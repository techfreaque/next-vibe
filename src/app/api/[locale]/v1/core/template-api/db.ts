import {
  jsonb,
  
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { TemplateStatusDB } from "./enum";


/**
 * Template table schema
 * Enhanced schema with proper template fields
 */
export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: TemplateStatusDB }).notNull().default("draft"),
  tags: jsonb("tags").$type<string[]>().default([]),
  description: text("description"),
  userId: uuid("user_id").notNull(),
  someValue: text("some_value").notNull(), // Keep for backward compatibility
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schemas for validation with Zod
export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);

// Type definitions
export type Template = z.infer<typeof selectTemplateSchema>;
export type NewTemplate = z.infer<typeof insertTemplateSchema>;
