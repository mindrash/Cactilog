import {
  users,
  plants,
  growthRecords,
  plantPhotos,
  seeds,
  speciesImages,
  photoReports,
  adminUsers,
  plantLikes,
  vendors,
  type User,
  type UpsertUser,
  type Plant,
  type InsertPlant,
  type GrowthRecord,
  type InsertGrowthRecord,
  type PlantPhoto,
  type InsertPlantPhoto,
  type Seed,
  type InsertSeed,
  type SpeciesImage,
  type InsertSpeciesImage,
  type PhotoReport,
  type InsertPhotoReport,
  type PlantLike,
  type InsertPlantLike,
  type Vendor,
  type InsertVendor,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, count, sql } from "drizzle-orm";
import { validateDisplayName, sanitizeDisplayName } from "./contentFilter";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserDisplayName(userId: string, displayName: string): Promise<User>;
  
  // Plant operations
  getPlants(userId: string, filters?: {
    search?: string;
    type?: string;
    genus?: string;
  }): Promise<Plant[]>;
  getPlant(id: number, userId: string): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant & { userId: string }): Promise<Plant>;
  updatePlant(id: number, userId: string, updates: Partial<InsertPlant>): Promise<Plant | undefined>;
  deletePlant(id: number, userId: string): Promise<boolean>;
  
  // Growth record operations
  getGrowthRecords(plantId: number, userId: string): Promise<GrowthRecord[]>;
  createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord>;
  updateGrowthRecord(id: number, userId: string, updates: Partial<InsertGrowthRecord>): Promise<GrowthRecord | undefined>;
  deleteGrowthRecord(id: number, userId: string): Promise<boolean>;
  getGrowthOverview(userId: string): Promise<Array<Plant & { 
    latestGrowth?: GrowthRecord; 
    growthCount: number;
    growthRate?: number;
    daysSinceLastMeasurement?: number;
  }>>;
  getGrowthAnalytics(userId: string): Promise<{
    totalMeasurements: number;
    plantsWithGrowth: number;
    averageGrowthRate: number;
    fastestGrowing: Array<{ plant: Plant; growthRate: number }>;
    genusGrowthComparison: Array<{ genus: string; averageGrowthRate: number; count: number }>;
    healthTrends: Array<{ month: string; averageHealth: number }>;
    floweringActivity: Array<{ genus: string; floweringCount: number; totalCount: number }>;
  }>;
  
  // Photo operations
  getPlantPhotos(plantId: number, userId: string): Promise<PlantPhoto[]>;
  createPlantPhoto(photo: InsertPlantPhoto): Promise<PlantPhoto>;
  deletePlantPhoto(id: number, userId: string): Promise<boolean>;
  
  // Seed operations
  getSeeds(userId: string): Promise<Seed[]>;
  createSeed(seed: InsertSeed & { userId: string }): Promise<Seed>;
  updateSeed(id: number, userId: string, updates: Partial<InsertSeed>): Promise<Seed | undefined>;
  deleteSeed(id: number, userId: string): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    totalPlants: number;
    uniqueGenera: number;
    recentAdditions: number;
    growthRecords: number;
  }>;
  
  // Public feed operations
  getPublicPlants(limit: number, offset: number): Promise<{
    plants: Plant[];
    total: number;
  }>;
  
  // Species image operations
  getSpeciesImages(genus: string, species: string): Promise<SpeciesImage[]>;
  createSpeciesImage(image: InsertSpeciesImage): Promise<SpeciesImage>;
  updateSpeciesImage(id: string, updates: Partial<InsertSpeciesImage>): Promise<SpeciesImage | undefined>;
  deleteSpeciesImage(id: string, userId: string): Promise<boolean>;
  getUserContributedPhotos(genus: string, species: string): Promise<PlantPhoto[]>;
  
  // Photo report operations
  createPhotoReport(report: InsertPhotoReport): Promise<PhotoReport>;
  getPhotoReports(status?: string): Promise<PhotoReport[]>;
  updatePhotoReport(id: string, updates: Partial<InsertPhotoReport>): Promise<PhotoReport | undefined>;
  
  // Admin operations
  getAdminUser(userId: string): Promise<any | undefined>;
  getAdminUserByEmail(email: string): Promise<any | undefined>;
  createAdminUser(admin: any): Promise<any>;
  isUserAdmin(userId: string): Promise<boolean>;
  
  // User settings operations
  updateUserCollectionVisibility(userId: string, visibility: 'public' | 'private'): Promise<User | undefined>;
  updateKnowledgeBaseContribution(userId: string, contribute: boolean): Promise<User | undefined>;
  
  // Plant likes operations
  likePlant(plantId: number, userId: string): Promise<PlantLike>;
  unlikePlant(plantId: number, userId: string): Promise<boolean>;
  getPlantLikeCount(plantId: number): Promise<number>;
  getUserPlantLike(plantId: number, userId: string): Promise<PlantLike | undefined>;
  getPlantWithLikes(plantId: number, userId?: string): Promise<Plant & { likeCount: number; isLiked?: boolean }>;

  // Vendor operations
  getAllVendors(): Promise<Vendor[]>;
  getVendorsBySpecialty(specialty: string): Promise<Vendor[]>;
  seedVendors(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to find existing user by email or id
      const existingUser = await db
        .select()
        .from(users)
        .where(userData.email ? eq(users.email, userData.email) : eq(users.id, userData.id!))
        .limit(1);

      if (existingUser.length > 0) {
        // Update existing user
        const [updatedUser] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser[0].id))
          .returning();
        return updatedUser;
      } else {
        // Insert new user
        const [newUser] = await db
          .insert(users)
          .values(userData)
          .returning();
        return newUser;
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      // If there's still a conflict, try to find and return the existing user
      if (error instanceof Error && error.message.includes('duplicate key')) {
        const existingUser = await db
          .select()
          .from(users)
          .where(userData.email ? eq(users.email, userData.email) : eq(users.id, userData.id!))
          .limit(1);
        
        if (existingUser.length > 0) {
          return existingUser[0];
        }
      }
      throw error;
    }
  }

  async updateUserDisplayName(userId: string, displayName: string): Promise<User> {
    // Validate and sanitize display name
    const sanitized = sanitizeDisplayName(displayName);
    const validation = validateDisplayName(sanitized);
    
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const [user] = await db
      .update(users)
      .set({ 
        displayName: sanitized || null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
      
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }

  // Plant operations
  async getPlants(userId: string, filters?: {
    search?: string;
    type?: string;
    genus?: string;
    sortBy?: string;
  }): Promise<Plant[]> {
    let whereConditions = [eq(plants.userId, userId)];
    
    if (filters?.search) {
      const searchCondition = or(
        ilike(plants.commonName, `%${filters.search}%`),
        ilike(plants.genus, `%${filters.search}%`),
        ilike(plants.species, `%${filters.search}%`),
        ilike(plants.supplier, `%${filters.search}%`),
        ilike(plants.customId, `%${filters.search}%`)
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }
    
    if (filters?.type) {
      whereConditions.push(eq(plants.family, filters.type));
    }
    
    if (filters?.genus) {
      whereConditions.push(eq(plants.genus, filters.genus));
    }
    
    // Enhanced sorting to include photo activity and proper last modified
    const query = db
      .select({
        id: plants.id,
        userId: plants.userId,
        customId: plants.customId,
        family: plants.family,
        genus: plants.genus,
        species: plants.species,
        cultivar: plants.cultivar,
        mutation: plants.mutation,
        commonName: plants.commonName,
        supplier: plants.supplier,
        acquisitionDate: plants.acquisitionDate,
        initialType: plants.initialType,
        isPublic: plants.isPublic,
        notes: plants.notes,
        createdAt: plants.createdAt,
        updatedAt: plants.updatedAt,
        lastActivity: sql<Date>`GREATEST(${plants.updatedAt}, COALESCE(MAX(${plantPhotos.uploadedAt}), ${plants.updatedAt}))`.as('lastActivity')
      })
      .from(plants)
      .leftJoin(plantPhotos, eq(plants.id, plantPhotos.plantId))
      .where(and(...whereConditions))
      .groupBy(plants.id);
    
    // Apply sorting based on the sortBy parameter
    const sortBy = filters?.sortBy || 'recent';
    
    switch (sortBy) {
      case 'genus-alpha':
        return await query.orderBy(plants.genus, plants.species);
      case 'species-alpha':
        return await query.orderBy(plants.species, plants.genus);
      case 'oldest':
        return await query.orderBy(plants.createdAt);
      case 'custom-id':
        return await query.orderBy(plants.customId);
      case 'id-asc':
        return await query.orderBy(plants.id);
      case 'id-desc':
        return await query.orderBy(desc(plants.id));
      case 'recent':
      default:
        return await query.orderBy(desc(sql`GREATEST(${plants.updatedAt}, COALESCE(MAX(${plantPhotos.uploadedAt}), ${plants.updatedAt}))`));
    }
  }

  async getPlant(id: number, userId: string): Promise<Plant | undefined> {
    const [plant] = await db
      .select()
      .from(plants)
      .where(and(eq(plants.id, id), eq(plants.userId, userId)));
    return plant;
  }

  async createPlant(plant: InsertPlant & { userId: string }): Promise<Plant> {
    const [newPlant] = await db.insert(plants).values(plant).returning();
    return newPlant;
  }

  async updatePlant(id: number, userId: string, updates: Partial<InsertPlant>): Promise<Plant | undefined> {
    const [updatedPlant] = await db
      .update(plants)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(plants.id, id), eq(plants.userId, userId)))
      .returning();
    return updatedPlant;
  }

  async deletePlant(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(plants)
      .where(and(eq(plants.id, id), eq(plants.userId, userId)));
    return result.rowCount! > 0;
  }

  // Growth record operations
  async getGrowthRecords(plantId: number, userId: string): Promise<GrowthRecord[]> {
    // Verify plant belongs to user first
    const plant = await this.getPlant(plantId, userId);
    if (!plant) return [];
    
    return await db
      .select()
      .from(growthRecords)
      .where(eq(growthRecords.plantId, plantId))
      .orderBy(desc(growthRecords.date));
  }

  async createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord> {
    const [newRecord] = await db.insert(growthRecords).values(record).returning();
    return newRecord;
  }

  async updateGrowthRecord(id: number, userId: string, updates: Partial<InsertGrowthRecord>): Promise<GrowthRecord | undefined> {
    // Verify record belongs to user's plant
    const [record] = await db
      .select({ plantId: growthRecords.plantId })
      .from(growthRecords)
      .where(eq(growthRecords.id, id));
    
    if (!record) return undefined;
    
    const plant = await this.getPlant(record.plantId, userId);
    if (!plant) return undefined;
    
    const [updatedRecord] = await db
      .update(growthRecords)
      .set(updates)
      .where(eq(growthRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteGrowthRecord(id: number, userId: string): Promise<boolean> {
    // Verify record belongs to user's plant
    const [record] = await db
      .select({ plantId: growthRecords.plantId })
      .from(growthRecords)
      .where(eq(growthRecords.id, id));
    
    if (!record) return false;
    
    const plant = await this.getPlant(record.plantId, userId);
    if (!plant) return false;
    
    const result = await db.delete(growthRecords).where(eq(growthRecords.id, id));
    return result.rowCount! > 0;
  }

  async getPlantsWithGrowthSummary(userId: string): Promise<any[]> {
    // First get all plants for the user
    const userPlants = await db
      .select()
      .from(plants)
      .where(eq(plants.userId, userId))
      .orderBy(desc(plants.createdAt));

    // Then for each plant, get growth summary
    const plantsWithGrowth = await Promise.all(
      userPlants.map(async (plant) => {
        // Get growth count
        const [countResult] = await db
          .select({ count: count() })
          .from(growthRecords)
          .where(eq(growthRecords.plantId, plant.id));

        // Get latest growth record
        const [latestGrowth] = await db
          .select()
          .from(growthRecords)
          .where(eq(growthRecords.plantId, plant.id))
          .orderBy(desc(growthRecords.date))
          .limit(1);

        return {
          ...plant,
          growthCount: countResult.count,
          latestGrowth: latestGrowth || null
        };
      })
    );

    return plantsWithGrowth;
  }

  async getGrowthOverview(userId: string): Promise<Array<Plant & { 
    latestGrowth?: GrowthRecord; 
    growthCount: number;
    growthRate?: number;
    daysSinceLastMeasurement?: number;
  }>> {
    const userPlants = await db
      .select()
      .from(plants)
      .where(eq(plants.userId, userId))
      .orderBy(desc(plants.updatedAt));

    const plantsWithGrowth = await Promise.all(
      userPlants.map(async (plant) => {
        // Get growth records for this plant
        const plantGrowthRecords = await db
          .select()
          .from(growthRecords)
          .where(eq(growthRecords.plantId, plant.id))
          .orderBy(desc(growthRecords.date));

        const growthCount = plantGrowthRecords.length;
        const latestGrowth = plantGrowthRecords[0] || undefined;

        let growthRate: number | undefined;
        let daysSinceLastMeasurement: number | undefined;

        if (plantGrowthRecords.length >= 2) {
          // Calculate growth rate from first to most recent measurement
          const earliest = plantGrowthRecords[plantGrowthRecords.length - 1];
          const latest = plantGrowthRecords[0];
          
          if (earliest.heightInches && latest.heightInches) {
            const heightChange = parseFloat(latest.heightInches) - parseFloat(earliest.heightInches);
            const daysBetween = Math.abs((new Date(latest.date).getTime() - new Date(earliest.date).getTime()) / (1000 * 60 * 60 * 24));
            growthRate = heightChange / (daysBetween / 30); // Growth per month
          }
        }

        if (latestGrowth) {
          const lastMeasurement = new Date(latestGrowth.date);
          daysSinceLastMeasurement = Math.floor((Date.now() - lastMeasurement.getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          ...plant,
          latestGrowth,
          growthCount,
          growthRate,
          daysSinceLastMeasurement,
        };
      })
    );

    return plantsWithGrowth;
  }

  async getGrowthAnalytics(userId: string): Promise<{
    totalMeasurements: number;
    plantsWithGrowth: number;
    averageGrowthRate: number;
    fastestGrowing: Array<{ plant: Plant; growthRate: number }>;
    genusGrowthComparison: Array<{ genus: string; averageGrowthRate: number; count: number }>;
    healthTrends: Array<{ month: string; averageHealth: number }>;
    floweringActivity: Array<{ genus: string; floweringCount: number; totalCount: number }>;
  }> {
    const userPlants = await db
      .select()
      .from(plants)
      .where(eq(plants.userId, userId));

    const plantIds = userPlants.map(p => p.id);
    
    const allGrowthRecords = plantIds.length > 0 
      ? await db
          .select()
          .from(growthRecords)
          .where(or(...plantIds.map(id => eq(growthRecords.plantId, id))))
          .orderBy(desc(growthRecords.date))
      : [];

    const totalMeasurements = allGrowthRecords.length;
    const plantsWithGrowth = new Set(allGrowthRecords.map(r => r.plantId)).size;

    // Calculate growth rates for each plant
    const plantGrowthRates: Array<{ plant: Plant; growthRate: number }> = [];
    for (const plant of userPlants) {
      const plantRecords = allGrowthRecords
        .filter(r => r.plantId === plant.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (plantRecords.length >= 2) {
        const earliest = plantRecords[0];
        const latest = plantRecords[plantRecords.length - 1];
        
        if (earliest.heightInches && latest.heightInches) {
          const heightChange = parseFloat(latest.heightInches) - parseFloat(earliest.heightInches);
          const daysBetween = Math.abs((new Date(latest.date).getTime() - new Date(earliest.date).getTime()) / (1000 * 60 * 60 * 24));
          const growthRate = heightChange / (daysBetween / 30); // Growth per month
          
          if (growthRate > 0) {
            plantGrowthRates.push({ plant, growthRate });
          }
        }
      }
    }

    const averageGrowthRate = plantGrowthRates.length > 0 
      ? plantGrowthRates.reduce((sum, p) => sum + p.growthRate, 0) / plantGrowthRates.length 
      : 0;

    const fastestGrowing = plantGrowthRates
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 5);

    // Genus growth comparison
    const genusGroups: { [genus: string]: number[] } = {};
    plantGrowthRates.forEach(({ plant, growthRate }) => {
      if (!genusGroups[plant.genus]) {
        genusGroups[plant.genus] = [];
      }
      genusGroups[plant.genus].push(growthRate);
    });

    const genusGrowthComparison = Object.entries(genusGroups).map(([genus, rates]) => ({
      genus,
      averageGrowthRate: rates.reduce((sum, rate) => sum + rate, 0) / rates.length,
      count: rates.length,
    })).sort((a, b) => b.averageGrowthRate - a.averageGrowthRate);

    // Health trends by month
    const healthTrends: Array<{ month: string; averageHealth: number }> = [];
    const healthRecords = allGrowthRecords.filter(r => r.healthScore !== null);
    
    if (healthRecords.length > 0) {
      const monthlyHealth: { [month: string]: number[] } = {};
      
      healthRecords.forEach(record => {
        const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyHealth[month]) {
          monthlyHealth[month] = [];
        }
        monthlyHealth[month].push(record.healthScore!);
      });

      Object.entries(monthlyHealth).forEach(([month, scores]) => {
        const averageHealth = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        healthTrends.push({ month, averageHealth });
      });

      // Sort by date
      healthTrends.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    }

    // Flowering activity by genus
    const floweringActivity: Array<{ genus: string; floweringCount: number; totalCount: number }> = [];
    const genusFlowering: { [genus: string]: { flowering: number; total: number } } = {};

    userPlants.forEach(plant => {
      if (!genusFlowering[plant.genus]) {
        genusFlowering[plant.genus] = { flowering: 0, total: 0 };
      }
      genusFlowering[plant.genus].total++;
    });

    allGrowthRecords.forEach(record => {
      if (record.floweringStatus && record.floweringStatus !== 'none') {
        const plant = userPlants.find(p => p.id === record.plantId);
        if (plant && genusFlowering[plant.genus]) {
          genusFlowering[plant.genus].flowering++;
        }
      }
    });

    Object.entries(genusFlowering).forEach(([genus, { flowering, total }]) => {
      if (total > 0) {
        floweringActivity.push({
          genus,
          floweringCount: flowering,
          totalCount: total,
        });
      }
    });

    return {
      totalMeasurements,
      plantsWithGrowth,
      averageGrowthRate,
      fastestGrowing,
      genusGrowthComparison,
      healthTrends,
      floweringActivity,
    };
  }

  async getPlantGrowthRecordsAuth(plantId: number, userId: string): Promise<GrowthRecord[]> {
    // First verify the plant belongs to the user
    const plant = await db
      .select()
      .from(plants)
      .where(and(eq(plants.id, plantId), eq(plants.userId, userId)))
      .limit(1);

    if (plant.length === 0) {
      throw new Error("Plant not found or unauthorized");
    }

    return await db
      .select()
      .from(growthRecords)
      .where(eq(growthRecords.plantId, plantId))
      .orderBy(desc(growthRecords.date));
  }

  async createGrowthRecordNew(plantId: number, data: any): Promise<GrowthRecord> {
    const [record] = await db
      .insert(growthRecords)
      .values({
        plantId,
        date: data.date,
        heightInches: data.heightInches || null,
        widthInches: data.widthInches || null,
        circumferenceInches: data.circumferenceInches || null,
        offsetCount: data.offsetCount || null,
        healthScore: data.healthScore || null,
        floweringStatus: data.floweringStatus || null,
        observations: data.observations || null,
      })
      .returning();

    // Update plant's updatedAt timestamp
    await db
      .update(plants)
      .set({ updatedAt: new Date() })
      .where(eq(plants.id, plantId));

    return record;
  }

  // Photo operations
  async getPlantPhotos(plantId: number, userId: string): Promise<PlantPhoto[]> {
    // Verify plant belongs to user first
    const plant = await this.getPlant(plantId, userId);
    if (!plant) return [];
    
    return await db
      .select()
      .from(plantPhotos)
      .where(eq(plantPhotos.plantId, plantId))
      .orderBy(desc(plantPhotos.uploadedAt));
  }

  async createPlantPhoto(photo: InsertPlantPhoto): Promise<PlantPhoto> {
    const [newPhoto] = await db.insert(plantPhotos).values(photo).returning();
    
    // Update the plant's updatedAt field to reflect that it was modified
    await db
      .update(plants)
      .set({ updatedAt: new Date() })
      .where(eq(plants.id, photo.plantId));
    
    return newPhoto;
  }

  async deletePlantPhoto(id: number, userId: string): Promise<boolean> {
    // Get the full photo record to access the file path
    const [photo] = await db
      .select()
      .from(plantPhotos)
      .where(eq(plantPhotos.id, id));
    
    if (!photo) return false;
    
    const plant = await this.getPlant(photo.plantId, userId);
    if (!plant) return false;
    
    // Delete from database first
    const result = await db.delete(plantPhotos).where(eq(plantPhotos.id, id));
    
    // If database deletion successful, try to delete the physical file
    if (result.rowCount! > 0) {
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Delete the file if it exists
        if (photo.filePath && fs.existsSync(photo.filePath)) {
          fs.unlinkSync(photo.filePath);
        }
      } catch (error) {
        console.error("Error deleting photo file:", error);
        // Don't fail the entire operation if file deletion fails
        // The database record is already deleted
      }
    }
    
    return result.rowCount! > 0;
  }

  // Seed operations
  async getSeeds(userId: string): Promise<Seed[]> {
    return await db
      .select()
      .from(seeds)
      .where(eq(seeds.userId, userId))
      .orderBy(desc(seeds.createdAt));
  }

  async createSeed(seed: InsertSeed & { userId: string }): Promise<Seed> {
    const [newSeed] = await db.insert(seeds).values(seed).returning();
    return newSeed;
  }

  async updateSeed(id: number, userId: string, updates: Partial<InsertSeed>): Promise<Seed | undefined> {
    const [updatedSeed] = await db
      .update(seeds)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(seeds.id, id), eq(seeds.userId, userId)))
      .returning();
    return updatedSeed;
  }

  async deleteSeed(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(seeds)
      .where(and(eq(seeds.id, id), eq(seeds.userId, userId)));
    return result.rowCount! > 0;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    totalPlants: number;
    uniqueGenera: number;
    recentAdditions: number;
    growthRecords: number;
  }> {
    const userPlants = await db.select().from(plants).where(eq(plants.userId, userId));
    
    const uniqueGenera = new Set(userPlants.map(p => p.genus)).size;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAdditions = userPlants.filter(p => 
      p.createdAt && p.createdAt > thirtyDaysAgo
    ).length;
    
    const plantIds = userPlants.map(p => p.id);
    const allGrowthRecords = plantIds.length > 0 
      ? await db.select().from(growthRecords).where(
          or(...plantIds.map(id => eq(growthRecords.plantId, id)))
        )
      : [];
    
    return {
      totalPlants: userPlants.length,
      uniqueGenera,
      recentAdditions,
      growthRecords: allGrowthRecords.length,
    };
  }

  // Public feed operations
  async getPublicPlants(limit: number, offset: number): Promise<{
    plants: Plant[];
    total: number;
  }> {
    // Get public plants with pagination, ordered by most recent activity (either plant creation or latest photo upload)
    const publicPlants = await db
      .select({
        id: plants.id,
        userId: plants.userId,
        customId: plants.customId,
        family: plants.family,
        genus: plants.genus,
        species: plants.species,
        cultivar: plants.cultivar,
        mutation: plants.mutation,
        commonName: plants.commonName,
        supplier: plants.supplier,
        acquisitionDate: plants.acquisitionDate,
        initialType: plants.initialType,
        isPublic: plants.isPublic,
        notes: plants.notes,
        createdAt: plants.createdAt,
        updatedAt: plants.updatedAt,
        lastActivity: sql<Date>`GREATEST(${plants.createdAt}, COALESCE(MAX(${plantPhotos.uploadedAt}), ${plants.createdAt}))`.as('lastActivity')
      })
      .from(plants)
      .leftJoin(plantPhotos, eq(plants.id, plantPhotos.plantId))
      .where(eq(plants.isPublic, "public"))
      .groupBy(plants.id)
      .orderBy(desc(sql`GREATEST(${plants.createdAt}, COALESCE(MAX(${plantPhotos.uploadedAt}), ${plants.createdAt}))`))
      .limit(limit)
      .offset(offset);

    // Get total count of public plants
    const [totalResult] = await db
      .select({ count: count() })
      .from(plants)
      .where(eq(plants.isPublic, "public"));

    return {
      plants: publicPlants,
      total: totalResult.count,
    };
  }
  // User browsing operations
  async getPublicUsers(sortBy: 'latest' | 'likes' | 'cacti' = 'latest'): Promise<Array<User & { plantCount: number; publicPlantCount: number; uniqueGenera: number; totalLikes: number; latestPlantDate: Date | null }>> {
    const usersWithStats = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        authProvider: users.authProvider,
        collectionPublic: users.collectionPublic,
        contributePhotosToKnowledgeBase: users.contributePhotosToKnowledgeBase,
        displayName: users.displayName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        plantCount: sql<number>`COUNT(DISTINCT ${plants.id})::int`,
        publicPlantCount: sql<number>`COUNT(DISTINCT CASE WHEN ${plants.isPublic} = 'public' THEN ${plants.id} END)::int`,
        uniqueGenera: sql<number>`COUNT(DISTINCT ${plants.genus})::int`,
        totalLikes: sql<number>`COUNT(DISTINCT ${plantLikes.id})::int`,
        latestPlantDate: sql<Date>`MAX(${plants.updatedAt})`,
      })
      .from(users)
      .leftJoin(plants, eq(plants.userId, users.id))
      .leftJoin(plantLikes, and(eq(plantLikes.plantId, plants.id), eq(plants.isPublic, 'public')))
      .where(eq(users.collectionPublic, 'public'))
      .groupBy(users.id)
      .orderBy(
        sortBy === 'latest' 
          ? desc(sql`MAX(${plants.updatedAt})`)
          : sortBy === 'likes'
          ? desc(sql`COUNT(DISTINCT ${plantLikes.id})`)
          : desc(sql`COUNT(DISTINCT ${plants.id})`) // cacti count
      );

    return usersWithStats;
  }

  async getUserWithStats(userId: string): Promise<(User & { plantCount: number; publicPlantCount: number; uniqueGenera: number }) | undefined> {
    const [userWithStats] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        authProvider: users.authProvider,
        collectionPublic: users.collectionPublic,
        contributePhotosToKnowledgeBase: users.contributePhotosToKnowledgeBase,
        displayName: users.displayName,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        plantCount: sql<number>`COUNT(${plants.id})::int`,
        publicPlantCount: sql<number>`COUNT(CASE WHEN ${plants.isPublic} = 'public' THEN 1 END)::int`,
        uniqueGenera: sql<number>`COUNT(DISTINCT ${plants.genus})::int`,
      })
      .from(users)
      .leftJoin(plants, eq(plants.userId, users.id))
      .where(eq(users.id, userId))
      .groupBy(users.id);

    return userWithStats;
  }

  async getUserPublicPlants(userId: string): Promise<Plant[]> {
    return await db
      .select()
      .from(plants)
      .where(and(eq(plants.userId, userId), eq(plants.isPublic, 'public')))
      .orderBy(desc(plants.createdAt));
  }

  async updateUserCollectionVisibility(userId: string, visibility: 'public' | 'private'): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ collectionPublic: visibility, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateKnowledgeBaseContribution(userId: string, contribute: boolean): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ contributePhotosToKnowledgeBase: contribute, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Plant likes operations
  async likePlant(plantId: number, userId: string): Promise<PlantLike> {
    const [like] = await db
      .insert(plantLikes)
      .values({ plantId, userId })
      .onConflictDoNothing()
      .returning();
    return like;
  }

  async unlikePlant(plantId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(plantLikes)
      .where(and(eq(plantLikes.plantId, plantId), eq(plantLikes.userId, userId)));
    return result.rowCount! > 0;
  }

  async getPlantLikeCount(plantId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(plantLikes)
      .where(eq(plantLikes.plantId, plantId));
    return result.count;
  }

  async getUserPlantLike(plantId: number, userId: string): Promise<PlantLike | undefined> {
    const [like] = await db
      .select()
      .from(plantLikes)
      .where(and(eq(plantLikes.plantId, plantId), eq(plantLikes.userId, userId)));
    return like;
  }

  async getPlantWithLikes(plantId: number, userId?: string): Promise<Plant & { likeCount: number; isLiked?: boolean }> {
    const [plant] = await db.select().from(plants).where(eq(plants.id, plantId));
    if (!plant) throw new Error('Plant not found');
    
    const likeCount = await this.getPlantLikeCount(plantId);
    const isLiked = userId ? !!(await this.getUserPlantLike(plantId, userId)) : false;
    
    return { ...plant, likeCount, isLiked };
  }

  // Species image operations
  async getSpeciesImages(genus: string, species: string): Promise<SpeciesImage[]> {
    return await db
      .select()
      .from(speciesImages)
      .where(and(eq(speciesImages.genus, genus), eq(speciesImages.species, species)))
      .orderBy(desc(speciesImages.isPrimary), desc(speciesImages.createdAt));
  }

  async createSpeciesImage(image: InsertSpeciesImage): Promise<SpeciesImage> {
    const [newImage] = await db.insert(speciesImages).values(image).returning();
    return newImage;
  }

  async updateSpeciesImage(id: string, updates: Partial<InsertSpeciesImage>): Promise<SpeciesImage | undefined> {
    const [updatedImage] = await db
      .update(speciesImages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(speciesImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteSpeciesImage(id: string, userId: string): Promise<boolean> {
    const image = await db.select().from(speciesImages).where(eq(speciesImages.id, id));
    if (!image[0]) return false;
    
    const isAdmin = await this.isUserAdmin(userId);
    if (!isAdmin && image[0].uploadedBy !== userId) return false;
    
    const result = await db.delete(speciesImages).where(eq(speciesImages.id, id));
    return result.rowCount! > 0;
  }

  async getUserContributedPhotos(genus: string, species: string): Promise<any[]> {
    // Get photos from users who have enabled Knowledge Base contribution
    // for plants matching the specified genus and species
    try {
      return await db
        .select()
        .from(plantPhotos)
        .innerJoin(plants, eq(plantPhotos.plantId, plants.id))
        .innerJoin(users, eq(plants.userId, users.id))
        .where(
          and(
            eq(plants.genus, genus),
            eq(plants.species, species || ''),
            eq(users.contributePhotosToKnowledgeBase, true),
            eq(plants.isPublic, 'public')
          )
        )
        .orderBy(desc(plantPhotos.uploadedAt));
    } catch (error) {
      console.error('Error fetching user contributed photos:', error);
      return [];
    }
  }

  async getPublicPhotos(): Promise<any[]> {
    // Get all photos from public plants ordered by latest activity
    try {
      return await db
        .select({
          photo: plantPhotos,
          plant: {
            id: plants.id,
            customId: plants.customId,
            genus: plants.genus,
            species: plants.species,
            commonName: plants.commonName,
            updatedAt: plants.updatedAt,
          },
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            displayName: users.displayName,
            profileImageUrl: users.profileImageUrl,
          }
        })
        .from(plantPhotos)
        .innerJoin(plants, eq(plantPhotos.plantId, plants.id))
        .innerJoin(users, eq(plants.userId, users.id))
        .where(eq(plants.isPublic, 'public'))
        .orderBy(desc(plants.updatedAt)); // Order by latest plant activity
    } catch (error) {
      console.error('Error fetching public photos:', error);
      return [];
    }
  }

  // Photo report operations
  async createPhotoReport(report: InsertPhotoReport): Promise<PhotoReport> {
    const [newReport] = await db.insert(photoReports).values(report).returning();
    return newReport;
  }

  async getPhotoReports(status?: string): Promise<PhotoReport[]> {
    const query = db.select().from(photoReports);
    
    if (status) {
      return await query.where(eq(photoReports.status, status)).orderBy(desc(photoReports.createdAt));
    }
    
    return await query.orderBy(desc(photoReports.createdAt));
  }

  async updatePhotoReport(id: string, updates: Partial<InsertPhotoReport>): Promise<PhotoReport | undefined> {
    const [updatedReport] = await db
      .update(photoReports)
      .set(updates)
      .where(eq(photoReports.id, id))
      .returning();
    return updatedReport;
  }

  // Admin operations
  async getAdminUser(userId: string): Promise<any | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.userId, userId));
    return admin;
  }

  async getAdminUserByEmail(email: string): Promise<any | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin;
  }

  async createAdminUser(admin: any): Promise<any> {
    const [newAdmin] = await db.insert(adminUsers).values(admin).returning();
    return newAdmin;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const admin = await this.getAdminUser(userId);
    return !!admin;
  }


  // Vendor operations
  async getAllVendors(): Promise<Vendor[]> {
    const vendorsList = await db
      .select()
      .from(vendors)
      .where(eq(vendors.isActive, true))
      .orderBy(vendors.reputation, vendors.name);
    return vendorsList;
  }

  async getVendorsBySpecialty(specialty: string): Promise<Vendor[]> {
    const vendorsList = await db
      .select()
      .from(vendors)
      .where(
        and(
          eq(vendors.isActive, true),
          sql`${specialty} = ANY(${vendors.specialties})`
        )
      )
      .orderBy(vendors.reputation, vendors.name);
    return vendorsList;
  }

  async seedVendors(): Promise<number> {
    const { vendorData } = await import("@shared/vendor-data");
    
    // Check if vendors already exist
    const existingVendors = await db.select().from(vendors);
    if (existingVendors.length > 0) {
      return existingVendors.length; // Return existing count, don't re-seed
    }

    // Insert all vendor data with proper type casting
    const insertedVendors = await db.insert(vendors).values(
      vendorData.map(vendor => ({
        ...vendor,
        reputation: vendor.reputation as "premium" | "reliable" | "budget" | "specialty",
        priceRange: vendor.priceRange as "budget" | "moderate" | "premium" | "luxury"
      }))
    ).returning();
    return insertedVendors.length;
  }
}

export const storage = new DatabaseStorage();
