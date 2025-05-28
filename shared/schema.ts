import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: doublePrecision("bathrooms").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  status: text("status").notNull(),
  userId: integer("user_id").notNull(),
  amenities: text("amenities").array().notNull().default([]),
  brandVoice: text("brand_voice").default(""),
  brandVoiceSummary: text("brand_voice_summary").default(""),
  useBrandVoiceDefault: boolean("use_brand_voice_default").default(false),
  photos: text("photos").default("[]"), // JSON string of photo objects
  savedHashtags: text("saved_hashtags").array().default([]), // Array of saved hashtags for the property
  hostSignature: text("host_signature").default("").notNull(), // Optional host signature for personal touch in messages
});

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  keywords: text("keywords").array().notNull(),
  contentType: text("content_type").notNull(),
  propertyId: integer("property_id").notNull(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
  dateGenerated: text("date_generated"),
  brandVoice: text("brand_voice"),
  ctaEnhancements: text("cta_enhancements"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties)
.omit({ id: true })
.extend({
   hostSignature: z.string().nullable(), 
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;
