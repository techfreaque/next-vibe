/**
 * Credits Database Schema
 * Drizzle ORM schema definitions for credit system
 *
 * wallet-based architecture:
 * - credit_wallets: Single wallet per user or lead
 * - credit_packs: Purchased/subscription credit packs
 * - credit_transactions: Immutable audit log
 */

import { relations, sql } from "drizzle-orm";
import {
  customType,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { leads } from "../leads/db";
import { users } from "../user/db";
import { CreditPackTypeDB, CreditTransactionTypeDB } from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Database: numeric(10, 6) - proper PostgreSQL numeric type
 * TypeScript: number - for calculations and type safety
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(10, 6)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * Typed Metadata for Credit Transactions
 * Each transaction type has specific metadata requirements
 */
export interface FreeGrantMetadata {
  reason: "initial_grant" | "admin_grant" | "monthly_reset";
  freeCreditsRemaining: number;
  totalPoolFreeCredits?: number;
}

export interface FreeResetMetadata {
  previousFreeCredits: number;
  newFreeCredits: number;
  daysSinceLastReset: number;
  previousPeriodStart?: string;
  newPeriodStart?: string;
}

export interface PurchaseMetadata {
  sessionId?: string;
  stripePaymentIntentId?: string;
  packQuantity?: number;
  totalPaid?: number;
  currency?: string;
}

export interface SubscriptionMetadata {
  subscriptionId: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface UsageMetadata {
  feature: string;
  cost: number;
  modelId?: string;
  messageId?: string;
  freeCreditsUsed?: number;
  packCreditsUsed?: number;
}

export interface ExpiryMetadata {
  expiredPackId: string;
  expiredAmount: number;
  packType?: "subscription" | "permanent" | "bonus" | "earned";
  originalAmount: number;
  expiresAt?: string | null;
  expiredAt?: string | null;
}

export interface RefundMetadata {
  reason: string;
  originalTransactionId?: string;
  adminId?: string;
}

export interface TransferMetadata {
  fromLeadWallet: string;
  fromLeadId: string;
  mergedFreeCredits: number;
  mergedPackCredits?: number;
  reason: "lead_to_user_merge";
}

export interface ReferralEarningMetadata {
  sourceUserId: string;
  sourceUserEmail?: string;
  transactionId: string;
  commissionPercent: number;
  originalAmountCents: number;
}

export interface ReferralPayoutMetadata {
  payoutRequestId: string;
  currency: "BTC" | "USDC" | "CREDITS";
  amountCents: number;
}

export interface TransferredUsageMetadata extends UsageMetadata {
  transferredFrom: string;
  reason: "wallet_merge" | "orphaned_wallet_cleanup";
}

/**
 * Union type for all possible transaction metadata
 * STRICT: No fallback - each transaction must use correct typed metadata
 */
export type CreditTransactionMetadata =
  | FreeGrantMetadata
  | FreeResetMetadata
  | PurchaseMetadata
  | SubscriptionMetadata
  | UsageMetadata
  | ExpiryMetadata
  | RefundMetadata
  | TransferMetadata
  | TransferredUsageMetadata
  | ReferralEarningMetadata
  | ReferralPayoutMetadata;

/**
 * Pack metadata for tracking source
 */
export interface CreditPackMetadata {
  sessionId?: string;
  subscriptionId?: string;
  adminId?: string;
  reason?: string;
  // For earned credits from referrals
  sourceUserId?: string;
  transactionId?: string;
}

/**
 * Credit Wallets Table
 * Single wallet per user OR lead (not both)
 *
 * ARCHITECTURE RULES:
 * 1. User wallets: ONLY paid credits (balance field)
 *    - freeCreditsRemaining always 0
 *    - Only authenticated users can purchase credits
 *
 * 2. Lead wallets: ONLY free credits
 *    - freeCreditsRemaining can be 0-20 per wallet
 *    - balance always 0
 *    - Leads cannot purchase credits
 *
 * 3. Wallet Linking:
 *    - Lead-to-lead: via leadLeadLinks table
 *    - Lead-to-user: via userLeadLinks table
 *
 * 4. Free Credit Pool:
 *    - Max 20 free credits can be spent per pool per period
 *    - Enforced at deduction time by tracking spending
 *
 * 5. Credit Deduction Priority:
 *    - Free credits from lead wallets (up to 20 per period)
 *    - Paid credits from user wallet (expiring first, then permanent)
 */
export const creditWallets = pgTable(
  "credit_wallets",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Owner: Either user OR lead (not both)
    // One of these must be set, but not both
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),

    // Total balance from credit packs (subscription + permanent + bonus)
    // Both user and lead wallets can have paid credits
    balance: numericNumber("balance").notNull().default(0),

    // Free tier tracking (20 credits per month SHARED across linked leads)
    // CRITICAL: User wallets MUST have freeCreditsRemaining = 0 (enforced in repository)
    // CRITICAL: Lead wallets share a pool of max 20 credits across ALL linked leads
    freeCreditsRemaining: numericNumber("free_credits_remaining")
      .notNull()
      .default(20),
    freePeriodStart: timestamp("free_period_start").defaultNow().notNull(),
    freePeriodId: text("free_period_id")
      .notNull()
      .default(sql`to_char(NOW(), 'YYYY-MM')`),

    // Metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Ensure one wallet per user
    unique("uq_wallet_user").on(table.userId),
    // Ensure one wallet per lead
    unique("uq_wallet_lead").on(table.leadId),
    // Fast lookups by user
    index("idx_wallet_user").on(table.userId),
    // Fast lookups by lead
    index("idx_wallet_lead").on(table.leadId),
  ],
);

/**
 * Credit Packs Table
 * Purchased or subscription credit packs tied to wallets
 */
export const creditPacks = pgTable(
  "credit_packs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => creditWallets.id, { onDelete: "cascade" }),

    // Pack details
    originalAmount: numericNumber("original_amount").notNull(), // Initial amount purchased
    remaining: numericNumber("remaining").notNull(), // Current remaining credits
    type: text("type", { enum: CreditPackTypeDB }).notNull(),

    // Expiration (NULL = never expires)
    expiresAt: timestamp("expires_at"),

    // Source tracking
    source: text("source"), // 'stripe_subscription', 'stripe_purchase', 'admin_grant', etc.

    // Metadata (typed)
    metadata: jsonb("metadata")
      .$type<CreditPackMetadata>()
      .notNull()
      .default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Priority deduction: expiring soonest first (NULLS LAST for permanent)
    index("idx_packs_wallet_priority").on(table.walletId, table.expiresAt),
    // Fast lookup by wallet
    index("idx_packs_wallet").on(table.walletId),
  ],
);

/**
 * Credit Transactions Table
 * Immutable audit log of all credit movements
 */
export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => creditWallets.id, { onDelete: "cascade" }),

    // Transaction details
    amount: numericNumber("amount").notNull(), // Positive for additions, negative for usage
    balanceAfter: numericNumber("balance_after").notNull(), // Total balance after transaction
    type: text("type", {
      enum: CreditTransactionTypeDB,
    }).notNull(),

    // Context for usage transactions
    modelId: text("model_id"),
    messageId: uuid("message_id"),

    // Reference to credit pack (for pack-specific transactions)
    packId: uuid("pack_id").references(() => creditPacks.id, {
      onDelete: "set null",
    }),

    // Period tracking for free credit transactions
    freePeriodId: text("free_period_id"),

    // Rich metadata (typed per transaction type)
    metadata: jsonb("metadata")
      .$type<CreditTransactionMetadata>()
      .notNull()
      .default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Fast transaction history queries
    index("idx_transactions_wallet").on(table.walletId, table.createdAt),
    // Query by transaction type
    index("idx_transactions_type").on(table.type, table.createdAt),
  ],
);

/**
 * Relations
 */
export const creditWalletsRelations = relations(
  creditWallets,
  ({ one, many }) => ({
    user: one(users, {
      fields: [creditWallets.userId],
      references: [users.id],
    }),
    lead: one(leads, {
      fields: [creditWallets.leadId],
      references: [leads.id],
    }),
    packs: many(creditPacks),
    transactions: many(creditTransactions),
  }),
);

export const creditPacksRelations = relations(creditPacks, ({ one, many }) => ({
  wallet: one(creditWallets, {
    fields: [creditPacks.walletId],
    references: [creditWallets.id],
  }),
  transactions: many(creditTransactions),
}));

export const creditTransactionsRelations = relations(
  creditTransactions,
  ({ one }) => ({
    wallet: one(creditWallets, {
      fields: [creditTransactions.walletId],
      references: [creditWallets.id],
    }),
    pack: one(creditPacks, {
      fields: [creditTransactions.packId],
      references: [creditPacks.id],
    }),
  }),
);

/**
 * Zod Schemas
 */
export const selectCreditWalletSchema = createSelectSchema(creditWallets);
export const insertCreditWalletSchema = createInsertSchema(creditWallets);
export const selectCreditPackSchema = createSelectSchema(creditPacks);
export const insertCreditPackSchema = createInsertSchema(creditPacks);
export const selectCreditTransactionSchema =
  createSelectSchema(creditTransactions);
export const insertCreditTransactionSchema =
  createInsertSchema(creditTransactions);

/**
 * Types
 */
export type CreditWallet = z.infer<typeof selectCreditWalletSchema>;
export type NewCreditWallet = z.infer<typeof insertCreditWalletSchema>;
export type CreditPack = z.infer<typeof selectCreditPackSchema>;
export type NewCreditPack = z.infer<typeof insertCreditPackSchema>;
export type CreditTransaction = z.infer<typeof selectCreditTransactionSchema>;
export type NewCreditTransaction = z.infer<
  typeof insertCreditTransactionSchema
>;
