/**
 * Campaign Starter Configuration Database Schema
 * Stores configuration settings for the campaign starter cron job
 */

import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * Campaign Starter Configuration Table
 * Stores configuration settings for the campaign starter cron job
 */
export const campaignStarterConfigs = pgTable("campaign_starter_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  environment: text("environment").notNull().unique(), // 'production' or 'development'

  // Configuration settings
  dryRun: integer("dry_run").notNull().default(0), // 0 = false, 1 = true (boolean as integer)
  minAgeHours: integer("min_age_hours").notNull().default(0),
  localeConfig: jsonb("locale_config")
    .$type<
      Record<
        string,
        {
          leadsPerWeek: number;
          enabledDays: number[];
          enabledHours: { start: number; end: number };
        }
      >
    >()
    .notNull(), // locale -> { leadsPerWeek, enabledDays, enabledHours }
  localeAccumulators: jsonb("locale_accumulators")
    .$type<Record<string, number>>()
    .notNull()
    .default({}), // locale -> fractional carry (0 ≤ x < 1) across runs

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Schema exports for validation
 */
export const selectCampaignStarterConfigSchema = createSelectSchema(
  campaignStarterConfigs,
);
export const insertCampaignStarterConfigSchema = createInsertSchema(
  campaignStarterConfigs,
);

/**
 * Type exports
 */
export type CampaignStarterConfig = typeof campaignStarterConfigs.$inferSelect;
export type NewCampaignStarterConfig =
  typeof campaignStarterConfigs.$inferInsert;
