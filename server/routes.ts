import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./googleAuth";
import { vendorData } from "@shared/vendor-data";
import { SpeciesImageService } from "./wikimedia";
import { createInsertSchema } from "drizzle-zod";
import { speciesImages, photoReports } from "@shared/schema";
import { insertPlantSchema, insertGrowthRecordSchema, insertSeedSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
// @ts-ignore - heic-convert doesn't have TypeScript declarations
import convert from "heic-convert";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const storage_multer = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `plant-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Check if file is an image
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Force logout route for Replit preview mode
  app.post('/api/logout', async (req, res) => {
    try {
      console.log('Logout request received, session ID:', req.sessionID);
      
      // Force clear session data without relying on complex destroy mechanisms
      if (req.session) {
        // Clear all session data
        Object.keys(req.session).forEach(key => {
          if (key !== 'cookie') {
            delete (req.session as any)[key];
          }
        });
        
        // Reset passport user
        if ((req.session as any).passport) {
          delete (req.session as any).passport;
        }
      }
      
      // Clear user from request
      req.user = undefined;
      
      // Set multiple cookie clearing headers for different scenarios
      const cookieOptions = [
        'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'passport=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ];
      
      // Set multiple Set-Cookie headers to ensure clearing
      cookieOptions.forEach(cookie => {
        res.append('Set-Cookie', cookie);
      });
      
      console.log('Session cleared, sending response');
      res.json({ 
        success: true, 
        message: 'Logged out successfully',
        sessionCleared: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed', details: (error as Error).message });
    }
  });

  // Serve photos from database as base64 images
  app.get('/api/photos/:photoId/image', async (req, res) => {
    try {
      const photoId = parseInt(req.params.photoId);
      if (isNaN(photoId)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }
      
      const photo = await storage.getPhotoById(photoId);
      if (!photo || !photo.imageData) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      // Convert base64 back to buffer
      const imageBuffer = Buffer.from(photo.imageData, 'base64');
      
      // Set no-cache headers to ensure fresh content
      res.setHeader('Content-Type', photo.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Content-Length', imageBuffer.length);
      
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving photo:", error);
      res.status(500).json({ message: "Failed to serve photo" });
    }
  });

  // Public feed route (no authentication required)
  app.get('/api/public/plants', async (req, res) => {
    try {
      // Set no-cache headers for dynamic public content
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const { plants, total } = await storage.getPublicPlants(limit, offset);
      
      res.json({
        plants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error("Error fetching public plants:", error);
      res.status(500).json({ message: "Failed to fetch public plants" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put('/api/auth/user/display-name', isAuthenticated, async (req: any, res) => {
    try {

      const userId = req.user.id;
      const { displayName } = req.body;
      
      if (typeof displayName !== 'string') {
        return res.status(400).json({ message: "Display name must be a string" });
      }
      
      const user = await storage.updateUserDisplayName(userId, displayName);
      res.json(user);
    } catch (error) {
      console.error("Error updating display name:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to update display name" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Plant routes
  app.get('/api/plants', isAuthenticated, async (req: any, res) => {
    try {
      // Set no-cache headers for dynamic plant lists
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const userId = req.user.id;
      const { search, type, genus, sortBy } = req.query;
      const plants = await storage.getPlants(userId, {
        search: search as string,
        type: type as string,
        genus: genus as string,
        sortBy: sortBy as string,
      });
      res.json(plants);
    } catch (error) {
      console.error("Error fetching plants:", error);
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });

  // Growth tracking routes
  app.get('/api/plants/growth-overview', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const overview = await storage.getGrowthOverview(userId);
      res.json(overview);
    } catch (error) {
      console.error('Error fetching growth overview:', error);
      res.status(500).json({ error: 'Failed to fetch growth overview' });
    }
  });

  app.get('/api/growth/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const analytics = await storage.getGrowthAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching growth analytics:', error);
      res.status(500).json({ error: 'Failed to fetch growth analytics' });
    }
  });

  // Individual plant growth records
  app.get('/api/plants/:id/growth', isAuthenticated, async (req: any, res) => {
    try {

      const userId = req.user.id;
      const plantId = parseInt(req.params.id);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const records = await storage.getPlantGrowthRecordsAuth(plantId, userId);
      res.json(records);
    } catch (error) {
      console.error('Error fetching plant growth records:', error);
      res.status(500).json({ error: 'Failed to fetch plant growth records' });
    }
  });

  app.post('/api/plants/:id/growth', isAuthenticated, async (req: any, res) => {
    try {

      const userId = req.user.id;
      const plantId = parseInt(req.params.id);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      // Validate that the plant belongs to the user
      const plant = await storage.getPlant(plantId, userId);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      const record = await storage.createGrowthRecordNew(plantId, req.body);
      res.status(201).json(record);
    } catch (error) {
      console.error('Error creating growth record:', error);
      res.status(500).json({ error: 'Failed to create growth record' });
    }
  });

  app.get('/api/plants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.id);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const plant = await storage.getPlant(plantId, userId);
      
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      res.json(plant);
    } catch (error) {
      console.error("Error fetching plant:", error);
      res.status(500).json({ message: "Failed to fetch plant" });
    }
  });

  app.post('/api/plants', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertPlantSchema.parse(req.body);
      const plant = await storage.createPlant({ ...validatedData, userId });
      res.status(201).json(plant);
    } catch (error) {
      console.error("Error creating plant:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create plant" });
    }
  });

  app.patch('/api/plants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.id);
      
      console.log("PATCH /api/plants/:id - DEBUG INFO:");
      console.log("  Plant ID:", plantId);
      console.log("  User ID:", userId);
      console.log("  Request body:", JSON.stringify(req.body, null, 2));
      
      if (isNaN(plantId)) {
        console.log("  ERROR: Invalid plant ID");
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      console.log("  Validating data with insertPlantSchema.partial()...");
      const validatedData = insertPlantSchema.partial().parse(req.body);
      console.log("  Validated data:", JSON.stringify(validatedData, null, 2));
      
      console.log("  Calling storage.updatePlant...");
      const plant = await storage.updatePlant(plantId, userId, validatedData);
      console.log("  Update result:", plant ? "SUCCESS" : "NOT_FOUND");
      
      if (!plant) {
        console.log("  ERROR: Plant not found or user mismatch");
        return res.status(404).json({ message: "Plant not found" });
      }
      
      console.log("  Returning updated plant:", JSON.stringify(plant, null, 2));
      res.json(plant);
    } catch (error) {
      console.error("ERROR updating plant:", error);
      if (error instanceof z.ZodError) {
        console.error("  Zod validation errors:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid plant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update plant" });
    }
  });

  app.delete('/api/plants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.id);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const deleted = await storage.deletePlant(plantId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting plant:", error);
      res.status(500).json({ message: "Failed to delete plant" });
    }
  });

  // Growth overview route for growth tracking page
  app.get('/api/plants/growth-overview', isAuthenticated, async (req: any, res) => {
    try {

      const userId = req.user.id;
      const plantsWithGrowth = await storage.getPlantsWithGrowthSummary(userId);
      res.json(plantsWithGrowth);
    } catch (error) {
      console.error("Error fetching growth overview:", error);
      res.status(500).json({ message: "Failed to fetch growth overview" });
    }
  });

  // Growth record routes
  app.get('/api/plants/:plantId/growth', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const records = await storage.getGrowthRecords(plantId, userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching growth records:", error);
      res.status(500).json({ message: "Failed to fetch growth records" });
    }
  });

  app.post('/api/plants/:plantId/growth', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      // Verify plant belongs to user
      const plant = await storage.getPlant(plantId, userId);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      const validatedData = insertGrowthRecordSchema.parse({
        ...req.body,
        plantId,
      });
      const record = await storage.createGrowthRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating growth record:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid growth record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create growth record" });
    }
  });

  app.patch('/api/growth/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const recordId = parseInt(req.params.id);
      const validatedData = insertGrowthRecordSchema.partial().parse(req.body);
      const record = await storage.updateGrowthRecord(recordId, userId, validatedData);
      
      if (!record) {
        return res.status(404).json({ message: "Growth record not found" });
      }
      
      res.json(record);
    } catch (error) {
      console.error("Error updating growth record:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid growth record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update growth record" });
    }
  });

  app.delete('/api/growth/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const recordId = parseInt(req.params.id);
      const deleted = await storage.deleteGrowthRecord(recordId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Growth record not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting growth record:", error);
      res.status(500).json({ message: "Failed to delete growth record" });
    }
  });

  // Public photos gallery route
  app.get('/api/photos/public', async (req: any, res) => {
    try {
      // Set no-cache headers for dynamic photo galleries
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const photos = await storage.getPublicPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching public photos:", error);
      res.status(500).json({ message: "Failed to fetch public photos" });
    }
  });

  // Public plant detail route
  app.get('/api/plants/public/:plantId', async (req: any, res) => {
    try {
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const plant = await storage.getPublicPlantDetail(plantId);
      
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      if (!plant.isPublic) {
        return res.status(403).json({ message: "This plant is private" });
      }
      
      res.json(plant);
    } catch (error) {
      console.error("Error fetching public plant detail:", error);
      res.status(500).json({ message: "Failed to fetch plant details" });
    }
  });

  // Photo routes
  app.get('/api/plants/:plantId/photos', isAuthenticated, async (req: any, res) => {
    try {
      // Set no-cache headers for dynamic photo lists
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const userId = req.user.id;
      const plantId = parseInt(req.params.plantId);
      const photos = await storage.getPlantPhotos(plantId, userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching plant photos:", error);
      res.status(500).json({ message: "Failed to fetch plant photos" });
    }
  });

  app.post('/api/plants/:plantId/photos', isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }

      // Verify plant belongs to user
      const plant = await storage.getPlant(plantId, userId);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No photo file provided" });
      }
      
      // Handle HEIC conversion and image processing
      let imageBuffer = fs.readFileSync(req.file.path);
      let finalMimeType = req.file.mimetype;
      let finalFilename = req.file.filename;
      
      console.log(`Processing file: ${req.file.originalname}, MIME: ${req.file.mimetype}, Size: ${req.file.size}`);
      
      // Convert HEIC/HEIF to JPEG for better browser compatibility
      // Note: Browsers often don't provide correct MIME types for HEIC files
      const isHeicFile = req.file.mimetype === 'image/heic' || 
                        req.file.mimetype === 'image/heif' ||
                        req.file.mimetype === 'application/octet-stream' && 
                        (req.file.originalname.toLowerCase().endsWith('.heic') || 
                         req.file.originalname.toLowerCase().endsWith('.heif')) ||
                        req.file.originalname.toLowerCase().endsWith('.heic') || 
                        req.file.originalname.toLowerCase().endsWith('.heif');
      
      if (isHeicFile) {
        console.log(`HEIC file detected: ${req.file.originalname}, MIME: ${req.file.mimetype}, converting to JPEG`);
        
        try {
          // Use heic-convert library for reliable HEIC to JPEG conversion
          const outputBuffer = await convert({
            buffer: imageBuffer, // Input HEIC buffer
            format: 'JPEG',     // Output format
            quality: 0.85       // Quality (0-1, where 1 is highest)
          });
          
          imageBuffer = Buffer.from(outputBuffer);
          finalMimeType = 'image/jpeg';
          finalFilename = req.file.filename.replace(/\.(heic|heif)$/i, '.jpg');
          console.log(`HEIC conversion successful: ${req.file.originalname} -> ${finalFilename}, original: ${req.file.size} bytes, converted: ${imageBuffer.length} bytes`);
        } catch (conversionError: any) {
          console.error('Failed to convert HEIC to JPEG with heic-convert:', conversionError);
          console.error('Error details:', conversionError?.message || 'Unknown error');
          
          // Fallback: try Sharp anyway (might work for some formats)
          try {
            console.log('Trying fallback conversion with Sharp...');
            imageBuffer = await sharp(imageBuffer).jpeg({ quality: 85 }).toBuffer();
            finalMimeType = 'image/jpeg';
            finalFilename = req.file.filename.replace(/\.(heic|heif)$/i, '.jpg');
            console.log('Sharp fallback conversion successful');
          } catch (sharpError: any) {
            console.error('Sharp fallback also failed:', sharpError?.message || 'Unknown error');
            console.log('Keeping original format - image may not display in all browsers');
          }
        }
      } else {
        console.log(`Standard image file: ${req.file.originalname}, MIME: ${req.file.mimetype}`);
      }
      
      const base64Data = imageBuffer.toString('base64');
      
      const photoData = {
        plantId,
        filename: finalFilename,
        originalName: req.file.originalname,
        mimeType: finalMimeType,
        size: imageBuffer.length, // Use processed image size
        imageData: base64Data,
      };
      
      const photo = await storage.createPlantPhoto(photoData);
      
      // Clean up temporary file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error uploading plant photo:", error);
      
      // Clean up uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
        }
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ message: "Failed to upload plant photo" });
    }
  });

  app.delete('/api/plants/:plantId/photos/:photoId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const plantId = parseInt(req.params.plantId);
      const photoId = parseInt(req.params.photoId);
      
      console.log(`DELETE photo request - User: ${userId}, Plant: ${plantId}, Photo: ${photoId}`);
      
      if (isNaN(plantId) || isNaN(photoId)) {
        console.log("Invalid plant or photo ID provided");
        return res.status(400).json({ message: "Invalid plant or photo ID" });
      }

      // Verify plant belongs to user
      const plant = await storage.getPlant(plantId, userId);
      if (!plant) {
        console.log(`Plant ${plantId} not found for user ${userId}`);
        return res.status(404).json({ message: "Plant not found" });
      }

      const deleted = await storage.deletePlantPhoto(photoId, userId);
      if (!deleted) {
        console.log(`Photo ${photoId} not found or not owned by user ${userId}`);
        return res.status(404).json({ message: "Photo not found" });
      }
      
      console.log(`Photo ${photoId} successfully deleted for plant ${plantId}`);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting plant photo:", error);
      res.status(500).json({ message: "Failed to delete plant photo" });
    }
  });

  // EMERGENCY PHOTO RECOVERY ENDPOINT
  app.post('/api/emergency/photo-recovery', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log(`EMERGENCY PHOTO RECOVERY requested by user: ${userId}`);
      
      const result = await storage.emergencyPhotoRecovery();
      
      res.json({
        success: true,
        message: `Emergency photo recovery completed`,
        restored: result.restored,
        errors: result.errors,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in emergency photo recovery:", error);
      res.status(500).json({ 
        success: false,
        message: "Emergency photo recovery failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Seed routes
  app.get('/api/seeds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const seeds = await storage.getSeeds(userId);
      res.json(seeds);
    } catch (error) {
      console.error("Error fetching seeds:", error);
      res.status(500).json({ message: "Failed to fetch seeds" });
    }
  });

  app.post('/api/seeds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validatedData = insertSeedSchema.parse(req.body);
      const seed = await storage.createSeed({ ...validatedData, userId });
      res.status(201).json(seed);
    } catch (error) {
      console.error("Error creating seed:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid seed data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create seed" });
    }
  });

  // User browsing routes
  app.get('/api/users/public', async (req, res) => {
    try {
      const sortBy = (req.query.sortBy as string) || 'latest';
      const validSortOptions = ['latest', 'likes', 'cacti'];
      
      if (!validSortOptions.includes(sortBy)) {
        return res.status(400).json({ message: "Invalid sort option. Use 'latest', 'likes', or 'cacti'" });
      }
      
      const users = await storage.getPublicUsers(sortBy as 'latest' | 'likes' | 'cacti');
      res.json(users);
    } catch (error) {
      console.error("Error fetching public users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserWithStats(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/users/:userId/plants', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // First check if user exists and has public collection
      const user = await storage.getUserWithStats(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.collectionPublic !== 'public') {
        return res.status(403).json({ message: "User's collection is private" });
      }
      
      const plants = await storage.getUserPublicPlants(userId);
      res.json(plants);
    } catch (error) {
      console.error("Error fetching user plants:", error);
      res.status(500).json({ message: "Failed to fetch user plants" });
    }
  });

  app.patch('/api/users/collection-visibility', isAuthenticated, async (req: any, res) => {
    try {

      const userId = req.user.id;
      const { visibility } = req.body;
      
      if (!['public', 'private'].includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value" });
      }
      
      const updatedUser = await storage.updateUserCollectionVisibility(userId, visibility);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating collection visibility:", error);
      res.status(500).json({ message: "Failed to update collection visibility" });
    }
  });

  app.patch('/api/users/knowledge-base-contribution', async (req: any, res) => {
    try {

      const userId = req.user.id;
      const { contribute } = req.body;
      
      if (typeof contribute !== 'boolean') {
        return res.status(400).json({ message: "Contribute must be a boolean value" });
      }
      
      const updatedUser = await storage.updateKnowledgeBaseContribution(userId, contribute);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating Knowledge Base contribution:", error);
      res.status(500).json({ message: "Failed to update Knowledge Base contribution setting" });
    }
  });

  // Plant likes routes
  app.post('/api/plants/:plantId/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // Use Google Auth user ID
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const like = await storage.likePlant(plantId, userId);
      const likeCount = await storage.getPlantLikeCount(plantId);
      res.json({ like, likeCount });
    } catch (error) {
      console.error("Error liking plant:", error);
      res.status(500).json({ message: "Failed to like plant" });
    }
  });

  app.delete('/api/plants/:plantId/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // Use Google Auth user ID
      const plantId = parseInt(req.params.plantId);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const success = await storage.unlikePlant(plantId, userId);
      const likeCount = await storage.getPlantLikeCount(plantId);
      res.json({ success, likeCount });
    } catch (error) {
      console.error("Error unliking plant:", error);
      res.status(500).json({ message: "Failed to unlike plant" });
    }
  });

  app.get('/api/plants/:plantId/likes', async (req, res) => {
    try {
      const plantId = parseInt(req.params.plantId);
      const userId = (req as any).user?.id; // Use Google Auth user ID
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const likeCount = await storage.getPlantLikeCount(plantId);
      const isLiked = userId ? !!(await storage.getUserPlantLike(plantId, userId)) : false;
      
      res.json({ likeCount, isLiked });
    } catch (error) {
      console.error("Error fetching plant likes:", error);
      res.status(500).json({ message: "Failed to fetch plant likes" });
    }
  });

  // Species image routes
  const speciesImageService = new SpeciesImageService();

  // Get images for a species
  app.get('/api/species/:genus/:species/images', async (req, res) => {
    try {
      const { genus, species } = req.params;
      const images = await storage.getSpeciesImages(genus, species);
      
      // If no images exist, try to fetch from Wikimedia
      if (images.length === 0) {
        console.log(`⏳ Fetching images for ${genus} ${species} from Wikimedia...`);
        try {
          const fetchedImages = await speciesImageService.fetchAndStoreImages(genus, species, req.user ? (req.user as any)?.claims?.sub : null);
          console.log(`✓ Found ${fetchedImages.length} images for ${genus} ${species}`);
          
          for (const image of fetchedImages) {
            try {
              await storage.createSpeciesImage(image);
              console.log(`✓ Stored image: ${image.imageUrl}`);
            } catch (error) {
              console.error(`❌ Failed to store image:`, error);
            }
          }
          
          // Refresh the images list
          const refreshedImages = await storage.getSpeciesImages(genus, species);
          return res.json(refreshedImages);
        } catch (error) {
          console.error(`❌ Failed to fetch images for ${genus} ${species}:`, error);
        }
      }
      
      res.json(images);
    } catch (error) {
      console.error("Error fetching species images:", error);
      res.status(500).json({ message: "Failed to fetch species images" });
    }
  });

  // Get user-contributed photos for a species
  app.get('/api/species/:genus/:species/user-photos', async (req, res) => {
    try {
      const { genus, species } = req.params;
      const userPhotos = await storage.getUserContributedPhotos(genus, species);
      res.json(userPhotos);
    } catch (error) {
      console.error("Error fetching user-contributed photos:", error);
      res.status(500).json({ message: "Failed to fetch user-contributed photos" });
    }
  });

  // Report a photo
  app.post('/api/species/images/:imageId/report', async (req, res) => {
    try {
      const { imageId } = req.params;
      const { reportType, description, reporterEmail } = req.body;
      const userId = (req.user as any)?.claims?.sub;

      // Validate report type
      const validReportTypes = ['incorrect_species', 'inappropriate', 'copyright', 'poor_quality'];
      if (!validReportTypes.includes(reportType)) {
        return res.status(400).json({ message: 'Invalid report type' });
      }

      // Create the report
      const report = await storage.createPhotoReport({
        imageId,
        reporterUserId: userId || null,
        reporterEmail: reporterEmail || null,
        reportType,
        description: description || null,
        status: 'pending'
      });

      console.log(`✓ Photo report created: ${report.id} for image ${imageId}`);

      res.json({ success: true, reportId: report.id });
    } catch (error) {
      console.error("Error creating photo report:", error);
      res.status(500).json({ message: "Failed to create photo report" });
    }
  });

  // Admin routes (temporarily bypass auth for debugging)
  app.get('/api/admin/reports', async (req: any, res) => {
    try {
      // Temporary fix: Use Tom's known user ID
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { status } = req.query;
      const reports = await storage.getPhotoReports(status as string);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching photo reports:", error);
      res.status(500).json({ message: "Failed to fetch photo reports" });
    }
  });

  // Update photo report (admin only)
  app.patch('/api/admin/reports/:reportId', async (req: any, res) => {
    try {
      // Temporary fix: Use Tom's known user ID
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { reportId } = req.params;
      const { status, adminNotes } = req.body;

      const updatedReport = await storage.updatePhotoReport(reportId, {
        status,
        adminNotes,
        reviewedBy: userId,
        reviewedAt: new Date()
      });

      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating photo report:", error);
      res.status(500).json({ message: "Failed to update photo report" });
    }
  });

  // Check admin status - temporarily bypass authentication for debugging
  app.get('/api/admin/status', async (req: any, res) => {
    try {
      // Temporary fix: Use Tom's known user ID and email from logs
      const userId = req.user.id; // Tom's user ID from auth/user endpoint
      const userEmail = "tomlawson@gmail.com";
      
      console.log(`Admin status check for user: ${userId}, email: ${userEmail}`);
      
      // Auto-initialize Tom as admin if not already done
      if (userEmail === 'tomlawson@gmail.com') {
        const existingAdmin = await storage.getAdminUserByEmail(userEmail);
        if (!existingAdmin) {
          await storage.createAdminUser({
            userId,
            email: userEmail,
            role: 'super_admin',
            permissions: {
              manage_images: true,
              review_reports: true,
              manage_users: true,
              manage_admins: true
            }
          });
          console.log('✓ Tom Lawson auto-initialized as super admin');
        }
      }
      
      const isAdmin = await storage.isUserAdmin(userId);
      console.log(`Admin check result: ${isAdmin}`);
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Initialize Tom as admin on first login
  app.post('/api/admin/initialize', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      const userEmail = (req.user as any)?.email;
      
      if (userEmail === 'tomlawson@gmail.com') {
        const existingAdmin = await storage.getAdminUserByEmail(userEmail);
        if (!existingAdmin) {
          await storage.createAdminUser({
            userId,
            email: userEmail,
            role: 'super_admin',
            permissions: {
              manage_images: true,
              review_reports: true,
              manage_users: true,
              manage_admins: true
            }
          });
          console.log('✓ Tom Lawson initialized as super admin');
        }
        return res.json({ success: true, message: 'Admin initialized' });
      }
      
      res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
      console.error("Error initializing admin:", error);
      res.status(500).json({ message: "Failed to initialize admin" });
    }
  });

  // Vendor routes
  app.get('/api/vendors', async (req, res) => {
    try {
      const vendors = await storage.getAllVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post('/api/vendors/seed', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const isAdmin = await storage.isUserAdmin(userId);
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const seededCount = await storage.seedVendors();
      res.json({ message: `Successfully seeded ${seededCount} vendors` });
    } catch (error) {
      console.error("Error seeding vendors:", error);
      res.status(500).json({ message: "Failed to seed vendors" });
    }
  });

  app.get('/api/vendors/by-specialty/:specialty', async (req, res) => {
    try {
      const { specialty } = req.params;
      const vendors = await storage.getVendorsBySpecialty(specialty);
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors by specialty:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
