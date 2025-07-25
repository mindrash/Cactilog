import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { SpeciesImageService } from "./wikimedia";
import { createInsertSchema } from "drizzle-zod";
import { speciesImages, photoReports } from "@shared/schema";
import { insertPlantSchema, insertGrowthRecordSchema, insertSeedSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Public feed route (no authentication required)
  app.get('/api/public/plants', async (req, res) => {
    try {
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
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const { search, type, genus } = req.query;
      const plants = await storage.getPlants(userId, {
        search: search as string,
        type: type as string,
        genus: genus as string,
      });
      res.json(plants);
    } catch (error) {
      console.error("Error fetching plants:", error);
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });

  app.get('/api/plants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const plantId = parseInt(req.params.id);
      
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }
      
      const validatedData = insertPlantSchema.partial().parse(req.body);
      const plant = await storage.updatePlant(plantId, userId, validatedData);
      
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      
      res.json(plant);
    } catch (error) {
      console.error("Error updating plant:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update plant" });
    }
  });

  app.delete('/api/plants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Growth record routes
  app.get('/api/plants/:plantId/growth', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // Photo routes
  app.get('/api/plants/:plantId/photos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plantId = parseInt(req.params.plantId);
      const photos = await storage.getPlantPhotos(plantId, userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching plant photos:", error);
      res.status(500).json({ message: "Failed to fetch plant photos" });
    }
  });

  app.post('/api/plants/:plantId/photos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plantId = parseInt(req.params.plantId);
      
      // For now, return a success response - actual file upload would need multer or similar
      // This is a placeholder for the photo upload functionality
      const photoData = {
        plantId,
        filename: `plant_${plantId}_${Date.now()}.jpg`,
        originalName: 'uploaded_photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024000, // 1MB placeholder
      };
      
      const photo = await storage.createPlantPhoto(photoData);
      res.status(201).json(photo);
    } catch (error) {
      console.error("Error uploading plant photo:", error);
      res.status(500).json({ message: "Failed to upload plant photo" });
    }
  });

  // Seed routes
  app.get('/api/seeds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const seeds = await storage.getSeeds(userId);
      res.json(seeds);
    } catch (error) {
      console.error("Error fetching seeds:", error);
      res.status(500).json({ message: "Failed to fetch seeds" });
    }
  });

  app.post('/api/seeds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const users = await storage.getPublicUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching public users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:userId', isAuthenticated, async (req, res) => {
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

  app.get('/api/users/:userId/plants', isAuthenticated, async (req, res) => {
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
      const userId = req.user?.claims?.sub;
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

  app.patch('/api/users/knowledge-base-contribution', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
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
      const userId = req.user?.claims?.sub;
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
      const userId = req.user?.claims?.sub;
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
      const userId = (req as any).user?.claims?.sub;
      
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

  // Admin routes (protected)
  app.get('/api/admin/reports', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
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
  app.patch('/api/admin/reports/:reportId', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
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

  // Check if user is admin
  app.get('/api/admin/status', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const isAdmin = await storage.isUserAdmin(userId);
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Initialize Tom as admin on first login
  app.post('/api/admin/initialize', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const userEmail = (req.user as any)?.claims?.email;
      
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

  const httpServer = createServer(app);
  return httpServer;
}
