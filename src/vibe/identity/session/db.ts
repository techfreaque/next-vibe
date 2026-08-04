/**
 * Session database schema
 * Defines the structure of session-related tables
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../user/db";

/**
 * Sessions table schema
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  name: text("name"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Zod schemas for validation
 */
const insertSessionSchema = createInsertSchema(sessions);
const selectSessionSchema = createSelectSchema(sessions);

/**
 * Types
 */
type InsertSession = z.infer<typeof insertSessionSchema>;
type SelectSession = z.infer<typeof selectSessionSchema>;

/**
 * Legacy type aliases for backward compatibility
 */
export type Session = SelectSession;
export type NewSession = InsertSession;
