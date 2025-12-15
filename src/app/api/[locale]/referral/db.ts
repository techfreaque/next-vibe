/**
 * Referral system database schema
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { leads } from "../leads/db";
import { paymentTransactions } from "../payment/db";
import { users } from "../user/db";
import {
  PayoutCurrencyDB,
  PayoutStatus,
  PayoutStatusDB,
  ReferralEarningStatus,
  ReferralEarningStatusDB,
} from "./enum";

/**
 * Referral Codes Table
 * Stores user-created referral codes
 */
export const referralCodes = pgTable("referral_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label"),
  currentUses: integer("current_uses").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Lead Referrals Table (Phase 1: Pre-signup)
 * Tracks which lead used which referral code - temporary tracking before signup
 * Multiple referral codes can be linked to a lead (user may click multiple referral links)
 * On signup, the latest referral is used and copied to user_referrals for permanent storage
 */
export const leadReferrals = pgTable("lead_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referralCodeId: uuid("referral_code_id")
    .notNull()
    .references(() => referralCodes.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id")
    .notNull()
    // No unique constraint - leads can have multiple referral codes (history)
    .references(() => leads.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * User Referrals Table (Phase 2: Post-signup)
 * Permanent referral chain based on userId - survives even if leadId disappears
 * This is the source of truth for payment payout chain resolution
 */
export const userReferrals = pgTable("user_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerUserId: uuid("referrer_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referredUserId: uuid("referred_user_id")
    .notNull()
    .unique() // Each user can only have one referrer
    .references(() => users.id, { onDelete: "cascade" }),
  referralCodeId: uuid("referral_code_id")
    .notNull()
    .references(() => referralCodes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Referral Earnings Table
 * Per-transaction payouts per level
 */
export const referralEarnings = pgTable(
  "referral_earnings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    earnerUserId: uuid("earner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceUserId: uuid("source_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    transactionId: uuid("transaction_id")
      .notNull()
      .references(() => paymentTransactions.id, { onDelete: "cascade" }),
    level: integer("level").notNull(),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(),
    status: text("status", { enum: ReferralEarningStatusDB })
      .notNull()
      .default(ReferralEarningStatus.PENDING),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Ensure idempotency: one earning per transaction per earner per level
    uniqueEarning: unique().on(
      table.transactionId,
      table.earnerUserId,
      table.level,
    ),
  }),
);

/**
 * Payout Requests Table
 * Tracks user requests to withdraw earned credits
 */
export const payoutRequests = pgTable("payout_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency", { enum: PayoutCurrencyDB }).notNull(),
  status: text("status", { enum: PayoutStatusDB })
    .notNull()
    .default(PayoutStatus.PENDING),
  walletAddress: text("wallet_address"), // For BTC/USDC payouts
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
  processedAt: timestamp("processed_at"),
  processedByUserId: uuid("processed_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const referralCodesRelations = relations(
  referralCodes,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [referralCodes.ownerUserId],
      references: [users.id],
    }),
    leadReferrals: many(leadReferrals),
    userReferrals: many(userReferrals),
  }),
);

export const leadReferralsRelations = relations(leadReferrals, ({ one }) => ({
  lead: one(leads, {
    fields: [leadReferrals.leadId],
    references: [leads.id],
  }),
  referralCode: one(referralCodes, {
    fields: [leadReferrals.referralCodeId],
    references: [referralCodes.id],
  }),
}));

export const userReferralsRelations = relations(userReferrals, ({ one }) => ({
  referrer: one(users, {
    fields: [userReferrals.referrerUserId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [userReferrals.referredUserId],
    references: [users.id],
    relationName: "referred",
  }),
  referralCode: one(referralCodes, {
    fields: [userReferrals.referralCodeId],
    references: [referralCodes.id],
  }),
}));

export const referralEarningsRelations = relations(
  referralEarnings,
  ({ one }) => ({
    earner: one(users, {
      fields: [referralEarnings.earnerUserId],
      references: [users.id],
      relationName: "earner",
    }),
    source: one(users, {
      fields: [referralEarnings.sourceUserId],
      references: [users.id],
      relationName: "source",
    }),
    transaction: one(paymentTransactions, {
      fields: [referralEarnings.transactionId],
      references: [paymentTransactions.id],
    }),
  }),
);

/**
 * Schemas for validation
 */
export const selectReferralCodeSchema = createSelectSchema(referralCodes);
export const insertReferralCodeSchema = createInsertSchema(referralCodes);

export const selectLeadReferralSchema = createSelectSchema(leadReferrals);
export const insertLeadReferralSchema = createInsertSchema(leadReferrals);

export const selectUserReferralSchema = createSelectSchema(userReferrals);
export const insertUserReferralSchema = createInsertSchema(userReferrals);

export const selectReferralEarningSchema = createSelectSchema(referralEarnings);
export const insertReferralEarningSchema = createInsertSchema(referralEarnings);

export const selectPayoutRequestSchema = createSelectSchema(payoutRequests);
export const insertPayoutRequestSchema = createInsertSchema(payoutRequests);

/**
 * Payout Request Relations
 */
export const payoutRequestsRelations = relations(payoutRequests, ({ one }) => ({
  user: one(users, {
    fields: [payoutRequests.userId],
    references: [users.id],
    relationName: "payoutUser",
  }),
  processedBy: one(users, {
    fields: [payoutRequests.processedByUserId],
    references: [users.id],
    relationName: "payoutProcessor",
  }),
}));
