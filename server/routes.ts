import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
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

  const httpServer = createServer(app);
  return httpServer;
}
