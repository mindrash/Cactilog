import {
  users,
  plants,
  growthRecords,
  plantPhotos,
  seeds,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Plant operations
  async getPlants(userId: string, filters?: {
    search?: string;
    type?: string;
    genus?: string;
  }): Promise<Plant[]> {
    let whereConditions = [eq(plants.userId, userId)];
    
    if (filters?.search) {
      whereConditions.push(
        or(
          ilike(plants.commonName, `%${filters.search}%`),
          ilike(plants.genus, `%${filters.search}%`),
          ilike(plants.species, `%${filters.search}%`),
          ilike(plants.supplier, `%${filters.search}%`),
          ilike(plants.customId, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.type) {
      whereConditions.push(eq(plants.type, filters.type));
    }
    
    if (filters?.genus) {
      whereConditions.push(eq(plants.genus, filters.genus));
    }
    
    return await db.select().from(plants)
      .where(and(...whereConditions))
      .orderBy(desc(plants.createdAt));
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
    return newPhoto;
  }

  async deletePlantPhoto(id: number, userId: string): Promise<boolean> {
    // Verify photo belongs to user's plant
    const [photo] = await db
      .select({ plantId: plantPhotos.plantId })
      .from(plantPhotos)
      .where(eq(plantPhotos.id, id));
    
    if (!photo) return false;
    
    const plant = await this.getPlant(photo.plantId, userId);
    if (!plant) return false;
    
    const result = await db.delete(plantPhotos).where(eq(plantPhotos.id, id));
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
}

export const storage = new DatabaseStorage();
