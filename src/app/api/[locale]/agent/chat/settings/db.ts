/**
 * Chat Settings Database Schema
 * Stores user chat settings and preferences
 */

import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import type { ChatMode } from "../../models/enum";
import type { LlmModelId, ModelId, VideoGenModelId } from "../../models/models";
import type {
  ImageGenModelSelection,
  MusicGenModelSelection,
  SttModelSelection,
  VisionModelSelection,
  VoiceModelSelection,
} from "../../models/types";
import type { ViewModeValue } from "../enum";
import type { ToolConfigItem } from "./definition";

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
  selectedSkill: jsonb("selected_character").$type<string>(),
  activeFavoriteId: jsonb("active_favorite_id").$type<string | null>(),

  // TTS settings - only store if different from default
  ttsAutoplay: jsonb("tts_autoplay").$type<boolean>(),

  // Voice model selection (null = system default)
  voiceModelSelection: jsonb(
    "voice_model_selection",
  ).$type<VoiceModelSelection>(),

  // STT model selection (null = system default)
  sttModelSelection: jsonb("stt_model_selection").$type<SttModelSelection>(),

  // Vision bridge model selection (null = best vision model user has access to)
  visionBridgeModelSelection: jsonb(
    "vision_bridge_model_selection",
  ).$type<VisionModelSelection>(),

  // Translation model for pure generators (null = fast cheap LLM)
  translationModelId: text("translation_model_id").$type<LlmModelId>(),

  // Default chat mode (null = "text")
  defaultChatMode: text("default_chat_mode").$type<ChatMode>(),

  // Image/music/video gen model selections (null = system default)
  imageGenModelSelection: jsonb(
    "image_gen_model_selection",
  ).$type<ImageGenModelSelection>(),
  musicGenModelSelection: jsonb(
    "music_gen_model_selection",
  ).$type<MusicGenModelSelection>(),
  videoGenModelId: text("video_gen_model_id").$type<VideoGenModelId>(),

  // UI preferences - only store if different from default
  viewMode: jsonb("view_mode").$type<typeof ViewModeValue>(),

  // Tool configuration - DB columns are active_tools/visible_tools
  // null = default (all allowed, default pinned set); array = user customized
  availableTools: jsonb("active_tools").$type<ToolConfigItem[] | null>(),
  pinnedTools: jsonb("visible_tools").$type<ToolConfigItem[] | null>(),

  // Auto-compacting token threshold (null = use global default COMPACT_TRIGGER)
  compactTrigger: jsonb("compact_trigger").$type<number>(),

  // Memory budget in tokens (null = use DEFAULT_MEMORY_BUDGET_TOKENS; cascades to skill → favorite → subagent)
  memoryLimit: integer("memory_limit"),

  // Coding agent provider preference (admin-only). null = "claude-code" (default)
  codingAgent: jsonb("coding_agent").$type<"claude-code" | "open-code">(),

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
