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
} from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Plants table
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  customId: varchar("custom_id"), // User-defined ID like "TRI-PACH-PC-1"
  type: varchar("type").notNull(), // cactus, succulent
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
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Seeds table for tracking seed sowing
export const seeds = pgTable("seeds", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  customId: varchar("custom_id"), // User-defined ID like "SDS-LOPH-WILL-1"
  type: varchar("type").notNull(),
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
  type: z.string().min(1, "Type is required"),
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type GrowthRecord = typeof growthRecords.$inferSelect;
export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;
export type PlantPhoto = typeof plantPhotos.$inferSelect;
export type InsertPlantPhoto = z.infer<typeof insertPlantPhotoSchema>;
export type Seed = typeof seeds.$inferSelect;
export type InsertSeed = z.infer<typeof insertSeedSchema>;
