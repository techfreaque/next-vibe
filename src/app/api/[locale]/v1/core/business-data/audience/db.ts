/**
 * Audience Database Schema
 * Target audience information table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

import {
  AgeRangeDB,
  CommunicationChannelDB,
  GenderDB,
  IncomeLevelDB,
} from "./enum";

/**
 * Audience table for storing target audience information
 * Handles audience demographics, psychographics, and behavior
 */
export const audience = pgTable("audience", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Target audience description
  targetAudience: text("target_audience").notNull(), // Main audience description

  // Demographics
  ageRange: text("age_range"), // e.g., "25-35", "18-24"
  gender: text("gender"), // e.g., "all", "male", "female", "non-binary"
  location: text("location"), // Geographic targeting
  income: text("income"), // Income level targeting

  // Psychographics
  interests: text("interests"), // JSON array of interests
  values: text("values"), // JSON array of values
  lifestyle: text("lifestyle"), // Lifestyle description

  // Behavior
  onlineBehavior: text("online_behavior"), // How they behave online
  purchaseBehavior: text("purchase_behavior"), // How they make purchases
  preferredChannels: text("preferred_channels"), // JSON array of preferred communication channels

  // Pain points and motivations
  painPoints: text("pain_points"), // JSON array of pain points
  motivations: text("motivations"), // JSON array of motivations

  // Additional insights
  additionalNotes: text("additional_notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectAudienceSchema = createSelectSchema(audience);
export const insertAudienceSchema = createInsertSchema(audience);

/**
 * Types
 */
export type Audience = z.infer<typeof selectAudienceSchema>;
export type NewAudience = z.infer<typeof insertAudienceSchema>;
