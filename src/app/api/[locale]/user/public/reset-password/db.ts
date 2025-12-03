/**
 * Password reset database schema
 * Defines the structure of password reset-related tables
 */

import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../../db";

/**
 * Password resets table schema
 */
export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Password reset relations
 */
export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, {
    fields: [passwordResets.userId],
    references: [users.id],
  }),
}));

/**
 * Zod schemas for validation
 */
export const insertPasswordResetSchema = createInsertSchema(passwordResets);
export const selectPasswordResetSchema = createSelectSchema(passwordResets);

/**
 * Types
 */
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;
export type SelectPasswordReset = z.infer<typeof selectPasswordResetSchema>;

/**
 * Legacy type aliases for backward compatibility
 */
export type PasswordReset = SelectPasswordReset;
export type NewPasswordReset = InsertPasswordReset;
