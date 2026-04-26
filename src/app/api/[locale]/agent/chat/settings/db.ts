/**
 * Chat Settings Database Schema
 * Stores user chat settings and preferences
 */

import { relations } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ViewModeValue } from "../enum";
import type { SearchProviderValue } from "@/app/api/[locale]/agent/search/enum";

/**
 * Chat Settings Table
 * Stores user chat settings and preferences
 * Each user has one settings record
 */
export const chatSettings = pgTable("chat_settings", {
  // Primary key (required by Drizzle ORM)
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner - unique to ensure one settings per user
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // Selected model and character - only store if different from default
  selectedModel: jsonb("selected_model").$type<ChatModelId>(),
  selectedSkill: jsonb("selected_character").$type<string>(),
  activeFavoriteId: jsonb("active_favorite_id").$type<string | null>(),

  // TTS settings - only store if different from default
  ttsAutoplay: jsonb("tts_autoplay").$type<boolean>(),

  // UI preferences - only store if different from default
  viewMode: jsonb("view_mode").$type<typeof ViewModeValue>(),

  // Preferred web search provider. null = auto-detect (cheapest available)
  searchProvider: jsonb("search_provider").$type<SearchProviderValue | null>(),

  // Coding agent provider preference (admin-only). null = "claude-code" (default)
  codingAgent: jsonb("coding_agent").$type<"claude-code" | "open-code">(),

  // Dreaming pulse — AI reorganizes cortex on a schedule. null = disabled (false)
  dreamerEnabled: jsonb("dreamer_enabled").$type<boolean>(),
  // Favorite slot to power the dreaming session. null = system default (Thea)
  dreamerFavoriteId: jsonb("dreamer_favorite_id").$type<string | null>(),
  // Cron schedule for dreaming. null = system default ("0 2 * * *")
  dreamerSchedule: jsonb("dreamer_schedule").$type<string>(),
  // Custom user message to kick off each dreaming session. null = skill default
  dreamerPrompt: jsonb("dreamer_prompt").$type<string | null>(),

  // Autopilot pulse — AI works your queue while you're away. null = disabled (false)
  autopilotEnabled: jsonb("autopilot_enabled").$type<boolean>(),
  // Favorite slot to power the autopilot session. null = system default (Thea)
  autopilotFavoriteId: jsonb("autopilot_favorite_id").$type<string | null>(),
  // Cron schedule for autopilot. null = system default ("0 8 * * 1-5")
  autopilotSchedule: jsonb("autopilot_schedule").$type<string>(),
  // Custom user message to kick off each autopilot session. null = skill default
  autopilotPrompt: jsonb("autopilot_prompt").$type<string | null>(),

  // Mama pulse — Thea runs the production instance (admin-only, global shared task). null = disabled (false)
  mamaEnabled: jsonb("mama_enabled").$type<boolean>(),
  // Cron schedule for mama heartbeat. null = system default ("0 */4 * * *")
  mamaSchedule: jsonb("mama_schedule").$type<string>(),
  // Custom prompt for mama session. null = skill default
  mamaPrompt: jsonb("mama_prompt").$type<string | null>(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const chatSettingsRelations = relations(chatSettings, ({ one }) => ({
  user: one(users, {
    fields: [chatSettings.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting settings
 */
export const selectChatSettingsSchema = createSelectSchema(chatSettings);

/**
 * Schema for inserting settings
 */
export const insertChatSettingsSchema = createInsertSchema(chatSettings);

/**
 * Type for settings model - uses $inferSelect to respect .$type<> annotations
 */
export type ChatSettings = typeof chatSettings.$inferSelect;

/**
 * Type for new settings model
 */
export type NewChatSettings = z.infer<typeof insertChatSettingsSchema>;
