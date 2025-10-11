/**
 * Brand Database Schema
 * Brand guidelines and identity table
 */

import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

/**
 * Brand table for storing brand guidelines and identity
 * Handles brand information for the brand form
 */
export const brand = pgTable("brand", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Brand guidelines
  brandGuidelines: boolean("brand_guidelines").default(false),
  brandDescription: text("brand_description"),

  // Brand identity
  brandValues: text("brand_values"), // JSON array of brand values
  brandPersonality: text("brand_personality"), // JSON array of personality traits
  brandVoice: text("brand_voice"), // Brand voice description
  brandTone: text("brand_tone"), // Brand tone description

  // Visual identity
  brandColors: text("brand_colors"), // JSON array of brand colors
  brandFonts: text("brand_fonts"), // JSON array of brand fonts
  logoDescription: text("logo_description"), // Logo description
  visualStyle: text("visual_style"), // Visual style description

  // Brand positioning
  brandPromise: text("brand_promise"), // Brand promise/value proposition
  brandDifferentiators: text("brand_differentiators"), // JSON array of differentiators
  brandMission: text("brand_mission"), // Mission statement
  brandVision: text("brand_vision"), // Vision statement

  // Brand assets
  hasStyleGuide: boolean("has_style_guide").default(false),
  hasLogoFiles: boolean("has_logo_files").default(false),
  hasBrandAssets: boolean("has_brand_assets").default(false),

  // Additional context
  additionalNotes: text("additional_notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectBrandSchema = createSelectSchema(brand);
export const insertBrandSchema = createInsertSchema(brand);

/**
 * Types
 */
export type Brand = z.infer<typeof selectBrandSchema>;
export type NewBrand = z.infer<typeof insertBrandSchema>;
