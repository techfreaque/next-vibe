/**
 * Favorites Database Schema
 * Database tables for user favorites (persona + model settings combos)
 */

import { relations } from "drizzle-orm";
import {
  boolean,
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

import type { ContentLevel, IntelligenceLevel, PriceLevel } from "../types";

/**
 * Model settings filters structure
 * Supports "any" to disable specific filters
 */
export interface FavoriteModelFilters {
  intelligence: IntelligenceLevel | "any";
  maxPrice: PriceLevel | "any";
  content: ContentLevel | "any";
}

/**
 * Model settings structure
 */
export interface FavoriteModelSettings {
  mode: "auto" | "manual";
  filters: FavoriteModelFilters;
  manualModelId?: string;
}

/**
 * Favorite UI settings structure
 */
export interface FavoriteUISettings {
  position: number;
  color?: string;
}

/**
 * Favorites Table
 * Stores user favorites (persona + model settings combos)
 * Users can have multiple favorites for the same persona with different settings
 * personaId can be null for model-only setups
 */
export const chatFavorites = pgTable("chat_favorites", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Character/persona reference
  // Note: DB column is "character_id", mapped to personaId in code
  personaId: text("character_id").notNull(),

  // Custom display name (DB column is just "name")
  customName: text("name"),

  // Model settings (mode, filters, manual model id)
  modelSettings: jsonb("model_settings").$type<FavoriteModelSettings>().notNull(),

  // UI settings (position, color)
  uiSettings: jsonb("ui_settings").$type<FavoriteUISettings>().notNull(),

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
