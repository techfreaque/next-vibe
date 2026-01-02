/**
 * Subscription Database Schema
 * Subscription management and billing
 */

import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { PaymentProvider, PaymentProviderDB } from "../payment/enum";
import { users } from "../user/db";
import {
  BillingInterval,
  BillingIntervalDB,
  CancellationReasonDB,
  SubscriptionPlanDB,
  SubscriptionStatus,
  SubscriptionStatusDB,
} from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Subscriptions Table
 * Stores subscription information for users
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: SubscriptionStatusDB })
    .notNull()
    .default(SubscriptionStatus.INCOMPLETE),
  planId: text("plan_id", { enum: SubscriptionPlanDB }).notNull(),
  billingInterval: text("billing_interval", { enum: BillingIntervalDB })
    .notNull()
    .default(BillingInterval.MONTHLY),

  // Subscription period information
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),

  // Cancellation information
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  cancelAt: timestamp("cancel_at", { withTimezone: true }), // When subscription will be canceled (Stripe cancel_at)
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  cancellationReason: text("cancellation_reason", {
    enum: CancellationReasonDB,
  }),

  // Trial information
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),

  // Product reference (code-defined)
  productId: text("product_id").notNull().default("subscription"),

  // Subscription interval
  interval: text("interval").notNull().default("month"),

  // Payment provider info
  provider: text("provider", { enum: PaymentProviderDB }).notNull().default(PaymentProvider.STRIPE),
  providerSubscriptionId: text("provider_subscription_id").unique(),

  // Provider-specific IDs (for managing recurring subscriptions)
  providerPriceId: text("provider_price_id"),
  providerProductId: text("provider_product_id"),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Subscription Relations
 */
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

/**
 * Zod schemas for subscription table
 */
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const selectSubscriptionSchema = createSelectSchema(subscriptions);

/**
 * Type Exports
 */
export type Subscription = z.infer<typeof selectSubscriptionSchema>;
export type NewSubscription = z.infer<typeof insertSubscriptionSchema>;
