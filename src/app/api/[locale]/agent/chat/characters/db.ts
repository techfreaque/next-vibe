/**
 * Characters Database Schema
 * Database tables for custom user characters
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

import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/components/types";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { users } from "@/app/api/[locale]/user/db";
import type { TranslationKey } from "@/i18n/core/static-types";

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

  // Model selection (discriminated union from API)
  modelSelection: jsonb("model_selection")
    .$type<ModelSelectionSimple>()
    .notNull(),

  // Ownership type (determines visibility: USER=private, PUBLIC=shared, SYSTEM=built-in)
  ownershipType: text("ownership_type")
    .$type<typeof CharacterOwnershipTypeValue>()
    .notNull(),

  // Auto-compacting token threshold (null = use global/settings default)
  compactTrigger: integer("compact_trigger"),

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
export const selectCustomCharacterSchema = createSelectSchema(
  customCharacters,
  {
    icon: iconSchema,
  },
);

/**
 * Schema for inserting custom characters
 */
export const insertCustomCharacterSchema = createInsertSchema(
  customCharacters,
  {
    icon: iconSchema,
  },
);

/**
 * Type for custom character model - uses Drizzle's $inferSelect to respect .$type annotations
 */
export type CustomCharacter = typeof customCharacters.$inferSelect;

/**
 * Type for new custom character model - uses Drizzle's $inferInsert to respect .$type annotations
 */
export type NewCustomCharacter = typeof customCharacters.$inferInsert;
