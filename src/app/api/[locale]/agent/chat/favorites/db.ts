/**
 * Favorites Database Schema
 * Database tables for user favorites (character + model settings combos)
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

import type { ChatMode } from "@/app/api/[locale]/agent/models/enum";
import type {
  AudioVisionModelSelection,
  ImageVisionModelSelection,
  VideoVisionModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { users } from "@/app/api/[locale]/user/db";

import type { ChatModelId } from "../../ai-stream/models";
import type { ToolConfigItem } from "../settings/definition";
import type { FavoriteGetModelSelection } from "./[id]/definition";

/**
 * Favorites Table
 * Stores user favorites (character + model settings combos)
 * Users can have multiple favorites for the same character with different settings
 * skillId can be null for model-only setups
 */
export const chatFavorites = pgTable("chat_favorites", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Skill reference
  // Note: DB column is "character_id", mapped to skillId in code
  skillId: text("character_id").notNull(),

  // Variant reference - null means "no variant / skill default"
  variantId: text("variant_id"),

  // Custom variant display name (overrides skill variant's default name)
  customVariantName: text("custom_variant_name"),

  // Custom icon (emoji or icon identifier)
  customIcon: text("custom_icon").$type<IconKey>(),

  // Voice model selection (null = cascade to skill → user settings → system default)
  voiceModelSelection: jsonb(
    "voice_model_selection",
  ).$type<VoiceModelSelection>(),

  // STT model selection (null = cascade to user settings → system default)
  sttModelSelection: jsonb("stt_model_selection").$type<SttModelSelection>(),

  // Vision model selections per modality (null = cascade to user settings → system default)
  imageVisionModelSelection: jsonb(
    "image_vision_model_selection",
  ).$type<ImageVisionModelSelection>(),
  videoVisionModelSelection: jsonb(
    "video_vision_model_selection",
  ).$type<VideoVisionModelSelection>(),
  audioVisionModelSelection: jsonb(
    "audio_vision_model_selection",
  ).$type<AudioVisionModelSelection>(),

  // Translation model for pure generators (null = cascade)
  translationModelId: text("translation_model_id").$type<ChatModelId>(),

  // Default chat mode for this favorite (null = cascade to skill → user settings → "text")
  defaultChatMode: text("default_chat_mode").$type<ChatMode>(),

  // Image/music/video gen model selections (null = cascade to skill → user settings → system default)
  imageGenModelSelection: jsonb(
    "image_gen_model_selection",
  ).$type<ImageGenModelSelection>(),
  musicGenModelSelection: jsonb(
    "music_gen_model_selection",
  ).$type<MusicGenModelSelection>(),
  videoGenModelSelection: jsonb(
    "video_gen_model_selection",
  ).$type<VideoGenModelSelection>(),

  // Model selection (stores only MANUAL or FILTERS, null means use character defaults)
  modelSelection: jsonb("model_selection").$type<FavoriteGetModelSelection>(),
  position: integer("position").notNull(),
  color: text("color"),

  // Auto-compacting token threshold (null = fall through to character/settings default)
  compactTrigger: integer("compact_trigger"),

  // Memory budget in chars (null = inherit from skill → user settings; overrides for this favorite)
  memoryLimit: integer("memory_limit"),

  // Tool configuration - null = fall through to character/settings default
  availableTools: jsonb("active_tools").$type<ToolConfigItem[] | null>(),
  pinnedTools: jsonb("visible_tools").$type<ToolConfigItem[] | null>(),
  // Additional tool blocks on top of skill defaults
  deniedTools: jsonb("denied_tools").$type<ToolConfigItem[] | null>(),

  // User-level prompt customization - appended to skill's systemPrompt
  promptAppend: text("prompt_append"),

  // Sub-agent favorite override: which favorite config sub-agents spawned by this favorite inherit
  // null = task isolation (sub-agents get skill systemPrompt + companionPrompt only, no user favorites)
  // set = sub-agents inherit that favorite's model + tool config (power-user override)
  subAgentFavoriteId: uuid("sub_agent_favorite_id"),

  // Usage stats
  useCount: integer("use_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const chatFavoritesRelations = relations(chatFavorites, ({ one }) => ({
  user: one(users, {
    fields: [chatFavorites.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting favorites
 */
export const selectChatFavoriteSchema = createSelectSchema(chatFavorites, {
  customIcon: iconSchema.nullable(),
});

/**
 * Schema for inserting favorites
 */
export const insertChatFavoriteSchema = createInsertSchema(chatFavorites, {
  customIcon: iconSchema.nullable(),
});

/**
 * Type for favorite model - uses Drizzle's $inferSelect to respect .$type annotations
 */
export type ChatFavorite = typeof chatFavorites.$inferSelect;

/**
 * Type for new favorite model - uses Drizzle's $inferInsert to respect .$type annotations
 */
export type NewChatFavorite = typeof chatFavorites.$inferInsert;
