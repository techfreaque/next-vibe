/**
 * Characters Database Schema
 * Database tables for custom user characters
 */

import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { ModelUtilityValue } from "@/app/api/[locale]/agent/models/enum";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import { users } from "@/app/api/[locale]/user/db";

import type { CharacterModelSelection } from "./create/definition";
import type {
  CharacterCategoryValue,
  CharacterOwnershipTypeValue,
  CharacterSourceValue,
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
  name: text("name").notNull(),
  description: text("description").notNull(),
  tagline: text("tagline").notNull(),
  icon: text("icon").$type<IconKey>().notNull(),
  avatar: text("avatar"), // Optional avatar URL
  systemPrompt: text("system_prompt").notNull(),

  // Categorization
  category: text("category").$type<typeof CharacterCategoryValue>().notNull(),
  source: text("source")
    .$type<typeof CharacterSourceValue>()
    .notNull()
    .default("app.api.agent.chat.characters.enums.source.my"),
  task: text("task").$type<ModelUtility>().notNull(), // Primary utility

  voice: text("voice")
    .$type<typeof TtsVoiceValue>()
    .notNull()
    .default("app.api.agent.textToSpeech.voices.FEMALE"),
  suggestedPrompts: jsonb("suggested_prompts").$type<string[]>().default([]).notNull(),

  // Model selection (discriminated union from API)
  modelSelection: jsonb("model_selection").$type<CharacterModelSelection>().notNull(),

  // Ownership type
  ownershipType: text("ownership_type").$type<typeof CharacterOwnershipTypeValue>().notNull(),

  // Sharing
  isPublic: boolean("is_public").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const customCharactersRelations = relations(customCharacters, ({ one }) => ({
  user: one(users, {
    fields: [customCharacters.userId],
    references: [users.id],
  }),
}));

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
