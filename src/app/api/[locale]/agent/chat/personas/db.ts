/**
 * Personas Database Schema
 * Database tables for custom user personas
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import type { IconKey } from "../model-access/icons";
import type { ModelId } from "../model-access/models";
import type {
  ModelUtility,
  PersonaDisplay,
  PersonaOwnership,
  PersonaPreferences,
  PersonaRequirements,
} from "../types";
import type { PersonaCategoryValue, PersonaSourceValue } from "./enum";

/**
 * Custom Personas Table
 * Stores user-created personas (system prompts, preferences)
 * Default personas are defined in config file and not stored in DB
 */
export const customPersonas = pgTable("custom_personas", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Owner
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Persona details
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").$type<IconKey>().notNull(),
  avatar: text("avatar"), // Optional avatar URL
  systemPrompt: text("system_prompt").notNull(),

  // Categorization
  category: text("category").$type<typeof PersonaCategoryValue>().notNull(),
  source: text("source").$type<typeof PersonaSourceValue>().notNull().default("app.api.agent.chat.personas.enums.source.my"),
  task: text("task").$type<ModelUtility>().notNull(), // Primary utility

  // Optional settings
  preferredModel: text("preferred_model").$type<ModelId>(),

  // Suggested prompts (up to 4)
  suggestedPrompts: jsonb("suggested_prompts").$type<string[]>().default([]),

  // Requirements (hard filters)
  requirements: jsonb("requirements").$type<PersonaRequirements>().notNull().default({}),

  // Preferences (soft scoring)
  preferences: jsonb("preferences").$type<PersonaPreferences>().notNull().default({}),

  // Ownership
  ownership: jsonb("ownership").$type<PersonaOwnership>().notNull(),

  // Display
  display: jsonb("display").$type<PersonaDisplay>().notNull(),

  // Sharing
  isPublic: boolean("is_public").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const customPersonasRelations = relations(customPersonas, ({ one }) => ({
  user: one(users, {
    fields: [customPersonas.userId],
    references: [users.id],
  }),
}));

/**
 * Schema for selecting custom personas
 */
export const selectCustomPersonaSchema = createSelectSchema(customPersonas);

/**
 * Schema for inserting custom personas
 */
export const insertCustomPersonaSchema = createInsertSchema(customPersonas);

/**
 * Type for custom persona model
 */
export type CustomPersona = z.infer<typeof selectCustomPersonaSchema>;

/**
 * Type for new custom persona model
 */
export type NewCustomPersona = z.infer<typeof insertCustomPersonaSchema>;
