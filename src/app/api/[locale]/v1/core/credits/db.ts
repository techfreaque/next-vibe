/**
 * Credits Database Schema
 * Drizzle ORM schema definitions for credit system
 */

import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { leads } from "../leads/db";
import { users } from "../user/db";

/**
 * User Credits Table
 * Tracks credits for authenticated users
 */
export const userCredits = pgTable("user_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: text("type", {
    enum: ["subscription", "permanent", "free"],
  }).notNull(),
  expiresAt: timestamp("expires_at"), // NULL for permanent credits
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Credit Transactions Table
 * Tracks all credit movements for users and leads
 */
export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Negative for deductions
  balanceAfter: integer("balance_after").notNull(),
  type: text("type", {
    enum: ["purchase", "subscription", "usage", "expiry", "free_tier"],
  }).notNull(),
  modelId: text("model_id"), // For usage transactions
  messageId: uuid("message_id"), // For usage transactions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectUserCreditSchema = createSelectSchema(userCredits);
export const insertUserCreditSchema = createInsertSchema(userCredits);
export const selectCreditTransactionSchema =
  createSelectSchema(creditTransactions);
export const insertCreditTransactionSchema =
  createInsertSchema(creditTransactions);

/**
 * Types
 */
export type UserCredit = z.infer<typeof selectUserCreditSchema>;
export type NewUserCredit = z.infer<typeof insertUserCreditSchema>;
export type CreditTransaction = z.infer<typeof selectCreditTransactionSchema>;
export type NewCreditTransaction = z.infer<
  typeof insertCreditTransactionSchema
>;
