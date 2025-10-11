/**
 * Onboarding database schema
 * Defines the structure of onboarding-related tables
 */

import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

/**
 * Onboarding table schema
 * Stores user onboarding information
 */
export const onboarding = pgTable("onboarding", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Reference to the user
  completedSteps: text("completed_steps")
    .array()
    .notNull()
    .default(sql`'{}'`),
  currentStep: text("current_step").notNull().default("profile"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Onboarding Business Data table schema
 * Stores detailed business information collected during onboarding
 */
export const onboardingBusinessData = pgTable("onboarding_business_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Reference to the user

  // Business Information
  businessType: text("business_type").notNull(),
  targetAudience: text("target_audience").notNull(),
  socialPlatforms: text("social_platforms")
    .array()
    .notNull()
    .default(sql`'{}'`),
  goals: text("goals")
    .array()
    .notNull()
    .default(sql`'{}'`),
  competitors: text("competitors"),
  brandGuidelines: boolean("brand_guidelines").notNull().default(false),
  additionalInfo: text("additional_info"),

  // Consultation Preferences (optional)
  currentChallenges: text("current_challenges"),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  contactPhone: text("contact_phone"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generated schemas for onboarding flow
export const insertOnboardingSchema = createInsertSchema(onboarding);
export const selectOnboardingSchema = createSelectSchema(onboarding);

// Generated schemas for business data
export const insertOnboardingBusinessDataSchema = createInsertSchema(
  onboardingBusinessData,
);
export const selectOnboardingBusinessDataSchema = createSelectSchema(
  onboardingBusinessData,
);

// Type definitions
export type Onboarding = z.infer<typeof selectOnboardingSchema>;
export type NewOnboarding = z.infer<typeof insertOnboardingSchema>;
export type OnboardingBusinessData = z.infer<
  typeof selectOnboardingBusinessDataSchema
>;
export type NewOnboardingBusinessData = z.infer<
  typeof insertOnboardingBusinessDataSchema
>;
