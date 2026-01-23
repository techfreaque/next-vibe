/**
 * Chat Settings Database Schema
 * Stores user chat settings and preferences
 */

import { relations } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import type { ModelId } from "../../models/models";
import type { TtsVoiceValue } from "../../text-to-speech/enum";
import type { ViewModeValue } from "../enum";
import type { EnabledTool } from "../hooks/store";

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
  selectedModel: jsonb("selected_model").$type<ModelId>(),
  selectedCharacter: jsonb("selected_character").$type<string>(),
  activeFavoriteId: jsonb("active_favorite_id").$type<string | null>(),

  // TTS settings - only store if different from default
  ttsAutoplay: jsonb("tts_autoplay").$type<boolean>(),
  ttsVoice: jsonb("tts_voice").$type<typeof TtsVoiceValue>(),

  // UI preferences - only store if different from default
  viewMode: jsonb("view_mode").$type<typeof ViewModeValue>(),

  // Tool configuration - only store if different from default
  enabledTools: jsonb("enabled_tools").$type<EnabledTool[]>(),

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
 * Type for settings model
 */
export type ChatSettings = z.infer<typeof selectChatSettingsSchema>;

/**
 * Type for new settings model
 */
export type NewChatSettings = z.infer<typeof insertChatSettingsSchema>;
