/**
 * Favorites Database Schema
 * Database tables for user favorites (character + model settings combos)
 */

import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { users } from "@/app/api/[locale]/user/db";

import type { FavoriteModelSelection } from "./definition";

/**
 * Favorites Table
 * Stores user favorites (character + model settings combos)
 * Users can have multiple favorites for the same character with different settings
 * characterId can be null for model-only setups
 */
export const chatFavorites = pgTable("chat_favorites", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Character reference
  // Note: DB column is "character_id", mapped to characterId in code
  characterId: text("character_id").notNull(),

  // Custom display name (DB column is just "name")
  customName: text("name"),

  // Custom icon (emoji or icon identifier)
  customIcon: text("custom_icon").$type<IconKey>(),

  // Custom TTS voice (overrides character voice)
  voice: text("voice").$type<typeof TtsVoiceValue>(),

  modelSelection: jsonb("model_selection").$type<FavoriteModelSelection>().notNull(),
  position: integer("position").notNull(),
  color: text("color"),

  // Usage stats
  useCount: integer("use_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at"),

  // Is this the active favorite?
  isActive: boolean("is_active").default(false).notNull(),

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
export const selectChatFavoriteSchema = createSelectSchema(chatFavorites);

/**
 * Schema for inserting favorites
 */
export const insertChatFavoriteSchema = createInsertSchema(chatFavorites);

/**
 * Type for favorite model
 */
export type ChatFavorite = z.infer<typeof selectChatFavoriteSchema>;

/**
 * Type for new favorite model
 */
export type NewChatFavorite = z.infer<typeof insertChatFavoriteSchema>;
