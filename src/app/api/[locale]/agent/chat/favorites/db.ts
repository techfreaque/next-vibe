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

import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { users } from "@/app/api/[locale]/user/db";

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

  // Custom display name (DB column is just "name")
  customName: text("name"),

  // Custom icon (emoji or icon identifier)
  customIcon: text("custom_icon").$type<IconKey>(),

  // Custom TTS voice (overrides character voice, null means use character default)
  voice: text("voice").$type<typeof TtsVoiceValue>(),

  // Model selection (stores only MANUAL or FILTERS, null means use character defaults)
  modelSelection: jsonb("model_selection").$type<FavoriteGetModelSelection>(),
  position: integer("position").notNull(),
  color: text("color"),

  // Auto-compacting token threshold (null = fall through to character/settings default)
  compactTrigger: integer("compact_trigger"),

  // Memory budget in chars (null = inherit from skill → user settings; overrides for this favorite)
  memoryLimit: integer("memory_limit"),

  // Tool configuration — null = fall through to character/settings default
  availableTools: jsonb("active_tools").$type<ToolConfigItem[] | null>(),
  pinnedTools: jsonb("visible_tools").$type<ToolConfigItem[] | null>(),
  // Additional tool blocks on top of skill defaults
  deniedTools: jsonb("denied_tools").$type<ToolConfigItem[] | null>(),

  // User-level prompt customization — appended to skill's systemPrompt
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
