/**
 * Social Platform Database Schema
 * Defines database schema for social platform preferences and strategy
 */

import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

/**
 * Social Platform Preferences Table
 * Stores user's social platform preferences and strategy
 */
export const socialPlatforms = pgTable(
  "social_platforms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Platform selection - store full platform objects with usernames
    platforms: json("platforms")
      .$type<
        {
          platform: string;
          username: string;
          isActive: boolean;
          priority: string;
        }[]
      >()
      .default([]),

    // Content strategy
    contentStrategy: text("content_strategy"), // Content strategy description
    postingFrequency: text("posting_frequency"), // Posting frequency
    goals: text("goals"), // Social media goals

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("social_platforms_user_id_idx").on(table.userId),
  }),
);

/**
 * Social Platform Relations
 * Defines relationships between social platforms and users
 */
export const socialPlatformsRelations = relations(
  socialPlatforms,
  ({ one }) => ({
    user: one(users, {
      fields: [socialPlatforms.userId],
      references: [users.id],
    }),
  }),
);

/**
 * Zod Schemas
 */
export const selectSocialPlatformSchema = createSelectSchema(socialPlatforms);
export const insertSocialPlatformSchema = createInsertSchema(socialPlatforms);

/**
 * Social Platform Update Schema
 * Zod schema for validating social platform updates
 */
export const updateSocialPlatformSchema =
  createInsertSchema(socialPlatforms).partial();

/**
 * Types
 */
export type SocialPlatform = z.infer<typeof selectSocialPlatformSchema>;
export type NewSocialPlatform = z.infer<typeof insertSocialPlatformSchema>;
