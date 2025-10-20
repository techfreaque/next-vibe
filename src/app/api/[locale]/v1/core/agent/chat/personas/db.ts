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

import { users } from "@/app/api/[locale]/v1/core/user/db";

import type { ModelId } from "../model-access/models";
import type { PersonaCategoryId } from "./config";

/**
 * Persona metadata structure
 */
interface PersonaMetadata {
  tags?: string[];
  version?: number;
}

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
  icon: text("icon").notNull(), // emoji or icon identifier
  systemPrompt: text("system_prompt").notNull(),

  // Categorization
  category: text("category").$type<PersonaCategoryId>().notNull(), // PersonaCategoryId from config
  source: text("source").notNull().default("my"), // Always "my" for custom personas

  // Optional settings
  preferredModel: text("preferred_model").$type<ModelId | null>(), // ModelId from config

  // Suggested prompts (up to 4)
  suggestedPrompts: jsonb("suggested_prompts").$type<string[]>().default([]),

  // Sharing
  isPublic: boolean("is_public").default(false).notNull(),

  // Metadata
  metadata: jsonb("metadata").$type<PersonaMetadata>().default({}),

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
