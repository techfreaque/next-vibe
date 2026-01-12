/**
 * Characters Database Schema
 * Database tables for custom user characters
 */

import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { users } from "@/app/api/[locale]/user/db";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { CharacterModelSelection } from "./create/definition";
import type {
  CharacterCategoryValue,
  CharacterOwnershipTypeValue,
} from "./enum";

/**
 * Custom Characters Table
 * Stores user-created characters (system prompts, preferences)
 * Default characters are defined in config file and not stored in DB
 */
export const customCharacters = pgTable("custom_characters", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Character details
  name: text("name").$type<TranslationKey>().notNull(),
  description: text("description").$type<TranslationKey>().notNull(),
  tagline: text("tagline").$type<TranslationKey>().notNull(),
  icon: text("icon").$type<IconKey>().notNull(),
  systemPrompt: text("system_prompt"),

  // Categorization
  category: text("category").$type<typeof CharacterCategoryValue>().notNull(),

  voice: text("voice").$type<typeof TtsVoiceValue>(),
  suggestedPrompts: jsonb("suggested_prompts")
    .$type<string[]>()
    .default([])
    .notNull(),

  // Model selection (discriminated union from API)
  modelSelection: jsonb("model_selection")
    .$type<CharacterModelSelection>()
    .notNull(),

  // Ownership type (determines visibility: USER=private, PUBLIC=shared, SYSTEM=built-in)
  ownershipType: text("ownership_type")
    .$type<typeof CharacterOwnershipTypeValue>()
    .notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const customCharactersRelations = relations(
  customCharacters,
  ({ one }) => ({
    user: one(users, {
      fields: [customCharacters.userId],
      references: [users.id],
    }),
  }),
);

/**
 * Schema for selecting custom characters
 */
export const selectCustomCharacterSchema = createSelectSchema(customCharacters);

/**
 * Schema for inserting custom characters
 */
export const insertCustomCharacterSchema = createInsertSchema(customCharacters);

/**
 * Type for custom character model
 */
export type CustomCharacter = z.infer<typeof selectCustomCharacterSchema>;

/**
 * Type for new custom character model
 */
export type NewCustomCharacter = z.infer<typeof insertCustomCharacterSchema>;
