/**
 * Competitors Database Schema
 * Competitor analysis information table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

/**
 * Competitors table for storing competitor analysis
 * Handles competitor research for the competitors form
 */
export const competitors = pgTable("competitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Main competitors list
  competitors: text("competitors"), // JSON array of competitor names

  // Competitive analysis
  mainCompetitors: text("main_competitors"), // JSON array of main competitors with details
  competitiveAdvantages: text("competitive_advantages"), // JSON array of advantages
  competitiveDisadvantages: text("competitive_disadvantages"), // JSON array of disadvantages

  // Market positioning
  marketPosition: text("market_position"), // How they position vs competitors
  differentiators: text("differentiators"), // JSON array of key differentiators

  // Competitive insights
  competitorStrengths: text("competitor_strengths"), // JSON array of competitor strengths
  competitorWeaknesses: text("competitor_weaknesses"), // JSON array of competitor weaknesses
  marketGaps: text("market_gaps"), // JSON array of identified market gaps

  // Additional analysis
  additionalNotes: text("additional_notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectCompetitorsSchema = createSelectSchema(competitors);
export const insertCompetitorsSchema = createInsertSchema(competitors);

/**
 * Types
 */
export type Competitors = z.infer<typeof selectCompetitorsSchema>;
export type NewCompetitors = z.infer<typeof insertCompetitorsSchema>;
