import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  date,
  integer,
  boolean,
  uuid,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  authProvider: varchar("auth_provider"), // Track which OAuth provider was used
  collectionPublic: varchar("collection_public", { enum: ["public", "private"] }).default("public"),
  contributePhotosToKnowledgeBase: boolean("contribute_photos_to_knowledge_base").default(true),
  displayName: varchar("display_name", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  website: varchar("website"),
  location: varchar("location"),
  specialties: text("specialties").array(), // ["seeds", "plants", "pots", "supplies", "tools", "soil"]
  categories: text("categories").array(), // ["cacti", "succulents", "equipment"]
  reputation: varchar("reputation", { enum: ["premium", "reliable", "budget", "specialty"] }).default("reliable"),
  shippingInfo: text("shipping_info"),
  priceRange: varchar("price_range", { enum: ["budget", "moderate", "premium", "luxury"] }).default("moderate"),
  isActive: boolean("is_active").default(true),
  verifiedDate: timestamp("verified_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Plants table
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  customId: varchar("custom_id"), // User-defined ID like "TRI-PACH-PC-1"
  family: varchar("family").notNull(), // Botanical families: Cactaceae, Aizoaceae, etc.
  genus: varchar("genus").notNull(),
  species: varchar("species"),
  cultivar: varchar("cultivar"),
  mutation: varchar("mutation"),
  commonName: varchar("common_name"),
  supplier: varchar("supplier"),
  acquisitionDate: date("acquisition_date"),
  initialType: varchar("initial_type"), // pup, root, graft, tip, grafted, mid, other
  isPublic: varchar("is_public").default("public").notNull(), // public, private
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Growth records table
export const growthRecords = pgTable("growth_records", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  date: date("date").notNull(),
  heightInches: decimal("height_inches", { precision: 5, scale: 2 }),
  widthInches: decimal("width_inches", { precision: 5, scale: 2 }),
  weightOz: decimal("weight_oz", { precision: 6, scale: 2 }),
  circumferenceInches: decimal("circumference_inches", { precision: 5, scale: 2 }),
  offsetCount: integer("offset_count").default(0), // Number of pups/offsets
  healthScore: integer("health_score"), // 1-10 subjective health rating
  floweringStatus: varchar("flowering_status"), // none, budding, flowering, fruiting
  environmentalNotes: text("environmental_notes"), // Temperature, light, watering changes
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plant photos table
export const plantPhotos = pgTable("plant_photos", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name"),
  mimeType: varchar("mime_type"),
  size: integer("size"),
  filePath: varchar("file_path"),
  imageData: text("image_data"), // Base64 encoded image data
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Plant likes table
export const plantLikes = pgTable("plant_likes", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Ensure one like per user per plant
  index("unique_user_plant_like").on(table.userId, table.plantId)
]);

// Seeds table for tracking seed sowing
export const seeds = pgTable("seeds", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  customId: varchar("custom_id"), // User-defined ID like "SDS-LOPH-WILL-1"
  family: varchar("family").notNull(), // Botanical families: Cactaceae, Aizoaceae, etc.
  genus: varchar("genus").notNull(),
  species: varchar("species"),
  cultivar: varchar("cultivar"),
  mutation: varchar("mutation"),
  commonName: varchar("common_name"),
  supplier: varchar("supplier"),
  sowDate: date("sow_date"),
  quantity: integer("quantity"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  plants: many(plants),
  seeds: many(seeds),
}));

export const plantsRelations = relations(plants, ({ one, many }) => ({
  user: one(users, {
    fields: [plants.userId],
    references: [users.id],
  }),
  growthRecords: many(growthRecords),
  photos: many(plantPhotos),
  likes: many(plantLikes),
}));

export const growthRecordsRelations = relations(growthRecords, ({ one }) => ({
  plant: one(plants, {
    fields: [growthRecords.plantId],
    references: [plants.id],
  }),
}));

export const plantPhotosRelations = relations(plantPhotos, ({ one }) => ({
  plant: one(plants, {
    fields: [plantPhotos.plantId],
    references: [plants.id],
  }),
}));

export const plantLikesRelations = relations(plantLikes, ({ one }) => ({
  plant: one(plants, {
    fields: [plantLikes.plantId],
    references: [plants.id],
  }),
  user: one(users, {
    fields: [plantLikes.userId],
    references: [users.id],
  }),
}));

export const seedsRelations = relations(seeds, ({ one }) => ({
  user: one(users, {
    fields: [seeds.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertPlantSchema = createInsertSchema(plants).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  family: z.string().min(1, "Family is required"),
  genus: z.string().min(1, "Genus is required"),
  species: z.string().optional().nullable(),
  cultivar: z.string().optional().nullable(),
  mutation: z.string().optional().nullable(),
  commonName: z.string().optional().nullable(),
  supplier: z.string().optional().nullable(),
  acquisitionDate: z.string().optional().nullable(),
  initialType: z.string().optional().nullable(),
  isPublic: z.enum(["public", "private"]).default("public"),
  notes: z.string().optional().nullable(),
  customId: z.string().optional().nullable(),
});

export const insertGrowthRecordSchema = createInsertSchema(growthRecords).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.string().min(1, "Date is required"),
  plantId: z.number().min(1, "Plant ID is required"),
  heightInches: z.string().optional().nullable(),
  widthInches: z.string().optional().nullable(),
  weightOz: z.string().optional().nullable(),
  circumferenceInches: z.string().optional().nullable(),
  offsetCount: z.number().min(0).optional().nullable(),
  healthScore: z.number().min(1).max(10).optional().nullable(),
  floweringStatus: z.enum(["none", "budding", "flowering", "fruiting"]).optional().nullable(),
  environmentalNotes: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
});

export const insertPlantPhotoSchema = createInsertSchema(plantPhotos).omit({
  id: true,
  uploadedAt: true,
});

export const insertSeedSchema = createInsertSchema(seeds).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof insertVendorSchema._type;

// Species images table for curated botanical photography
export const speciesImages = pgTable("species_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  genus: varchar("genus").notNull(),
  species: varchar("species").notNull(),
  imageUrl: varchar("image_url").notNull(),
  imageSource: varchar("image_source").notNull(), // 'wikimedia', 'manual', 'historical'
  sourceAttribution: varchar("source_attribution"), // Required for CC images
  sourceUrl: varchar("source_url"), // Original source URL
  imageType: varchar("image_type").notNull().default("photograph"), // 'photograph', 'illustration', 'historical'
  isPrimary: boolean("is_primary").default(false), // Main image for species
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photo reports for incorrect/inappropriate images
export const photoReports = pgTable("photo_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageId: varchar("image_id").references(() => speciesImages.id).notNull(),
  reporterUserId: varchar("reporter_user_id").references(() => users.id),
  reporterEmail: varchar("reporter_email"), // For anonymous reports
  reportType: varchar("report_type").notNull(), // 'incorrect_species', 'inappropriate', 'copyright', 'poor_quality'
  description: varchar("description", { length: 1000 }),
  status: varchar("status").notNull().default("pending"), // 'pending', 'reviewed', 'resolved', 'dismissed'
  adminNotes: varchar("admin_notes", { length: 1000 }),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users table for elevated permissions
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  email: varchar("email").notNull().unique(),
  role: varchar("role").notNull().default("admin"), // 'admin', 'super_admin'
  permissions: jsonb("permissions").default(sql`'{"manage_images": true, "review_reports": true, "manage_users": false}'`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Articles table for community content
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  html: text("html").notNull(),
  excerpt: varchar("excerpt", { length: 300 }),
  status: varchar("status", { enum: ["draft", "published"] }).default("draft").notNull(),
  tags: text("tags").array(),
  category: varchar("category", { length: 100 }),
  author: varchar("author", { length: 100 }),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: varchar("meta_description", { length: 300 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
}, (table) => [
  index("articles_status_published_at_idx").on(table.status, table.publishedAt),
  index("articles_slug_idx").on(table.slug),
]);

// Zod schemas for articles
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  html: z.string().min(1, "Content is required"),
  excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
  slug: z.string().max(220, "Slug must be less than 220 characters").optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  category: z.string().max(100, "Category must be less than 100 characters").optional(),
  author: z.string().max(100, "Author must be less than 100 characters").optional(),
  metaTitle: z.string().max(200, "Meta title must be less than 200 characters").optional(),
  metaDescription: z.string().max(300, "Meta description must be less than 300 characters").optional(),
});

export type SpeciesImage = typeof speciesImages.$inferSelect;
export type InsertSpeciesImage = typeof speciesImages.$inferInsert;
export type PhotoReport = typeof photoReports.$inferSelect;
export type InsertPhotoReport = typeof photoReports.$inferInsert;
export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type GrowthRecord = typeof growthRecords.$inferSelect;
export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;
export type PlantPhoto = typeof plantPhotos.$inferSelect;
export type InsertPlantPhoto = z.infer<typeof insertPlantPhotoSchema>;
export type PlantLike = typeof plantLikes.$inferSelect;
export type InsertPlantLike = typeof plantLikes.$inferInsert;
export type Seed = typeof seeds.$inferSelect;
export type InsertSeed = z.infer<typeof insertSeedSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

// Botanical families for plant classification
export const BOTANICAL_FAMILIES = [
  "Cactaceae",
  "Aizoaceae", 
  "Crassulaceae",
  "Apocynaceae",
  "Asphodelaceae",
  "Euphorbiaceae",
  "Agavoideae",
  "Didiereaceae",
  "Burseraceae",
  "Portulacaceae",
  "Talinaceae",
  "Cucurbitaceae",
  "Moraceae",
  "Passifloraceae"
] as const;
