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
  getAdminUser(userId: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
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

  // Public feed operations
  async getPublicPlants(limit: number, offset: number): Promise<{
    plants: Plant[];
    total: number;
  }> {
    // Get public plants with pagination
    const publicPlants = await db
      .select()
      .from(plants)
      .where(eq(plants.isPublic, "public"))
      .orderBy(desc(plants.createdAt))
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
  async getAdminUser(userId: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.userId, userId));
    return admin;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin;
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db.insert(adminUsers).values(admin).returning();
    return newAdmin;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const admin = await this.getAdminUser(userId);
    return !!admin;
  }


}

export const storage = new DatabaseStorage();
