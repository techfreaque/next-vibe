/**
 * Credit Repository
 * Simplified wallet-based credit system
 *
 * Architecture:
 * - Single wallet per user OR lead (not both)
 * - Credit packs (subscription/permanent/bonus) with expiration
 * - Free tier credits tracked per wallet
 * - All transactions are immutable audit logs
 */

import { and, desc, eq, gte, isNull, lt, or, sql } from "drizzle-orm";
import {
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { leads, userLeadLinks } from "@/app/api/[locale]/v1/core/leads/db";
import { LeadSource, LeadStatus } from "@/app/api/[locale]/v1/core/leads/enum";
import type { CreditPackCheckoutSession } from "@/app/api/[locale]/v1/core/payment/providers/types";
import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import { subscriptions } from "@/app/api/[locale]/v1/core/subscription/db";
import { SubscriptionStatus } from "@/app/api/[locale]/v1/core/subscription/enum";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { productsRepository, ProductIds } from "../products/repository-client";
import type {
  CreditBalance,
  CreditIdentifier,
} from "../system/unified-interface/shared/server-only/credits/handler";
import { BaseCreditHandler } from "../system/unified-interface/shared/server-only/credits/handler";
import {
  creditPacks,
  creditTransactions,
  creditWallets,
  type CreditWallet,
} from "./db";
import {
  CreditTransactionType,
  type CreditTransactionTypeValue,
  CreditTypeIdentifier,
  type CreditTypeIdentifierValue,
} from "./enum";

export type { CreditBalance };

/**
 * Credit Transaction Interface
 */
export interface CreditTransactionOutput {
  id: string;
  amount: number;
  balanceAfter: number;
  type: CreditTransactionTypeValue;
  modelId: string | null;
  messageId: string | null;
  createdAt: string;
}

/**
 * Credit Repository Interface
 */
export interface CreditRepositoryInterface {
  getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>>;

  deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;

  getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>>;

  getOrCreateLeadByIp(
    ipAddress: string,
    locale: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>>;

  addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
  ): Promise<ResponseType<void>>;

  getTransactions(
    userId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  >;

  expireCredits(logger: EndpointLogger): Promise<ResponseType<number>>;

  handleCreditPackPurchase(
    session: CreditPackCheckoutSession,
    logger: EndpointLogger,
  ): Promise<void>;

  getCreditIdentifierBySubscription(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId?: string;
      leadId?: string;
      creditType: CreditTypeIdentifierValue;
    }>
  >;

  deductCreditsForFeature(
    user: { id?: string; leadId?: string; isPublic: boolean },
    cost: number,
    feature: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }>;

  mergePendingLeadWallets(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  cleanupOrphanedLeadWallets(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>>;

  hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean>;

  deductCreditsWithValidation(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string; error?: string }>;

  generateMessageId(): string;
}

/**
 * Credit Repository Implementation
 * Uses simplified wallet-based architecture
 */
class CreditRepository
  extends BaseCreditHandler
  implements CreditRepositoryInterface
{
  /**
   * Get or create wallet for a user
   */
  private async getOrCreateUserWallet(
    userId: string,
    logger: EndpointLogger,
  ): Promise<CreditWallet> {
    const [existingWallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (existingWallet) {
      return existingWallet;
    }

    // Create new wallet for user
    const [newWallet] = await db
      .insert(creditWallets)
      .values({
        userId,
        balance: 0,
        freeCreditsRemaining: 20,
        freePeriodStart: new Date(),
      })
      .onConflictDoNothing() // Handle race condition
      .returning();

    if (newWallet) {
      logger.info("Created new user wallet", {
        userId,
        walletId: newWallet.id,
      });

      // Create FREE_GRANT transaction for initial free credits
      await db.insert(creditTransactions).values({
        walletId: newWallet.id,
        amount: 20,
        balanceAfter: 0, // Pack balance is 0, free credits are separate
        type: CreditTransactionType.FREE_GRANT,
        metadata: {
          reason: "initial_grant",
          freeCreditsRemaining: 20,
        },
      });

      return newWallet;
    }

    // Race condition: another process created it, fetch it
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    return wallet;
  }

  /**
   * Get or create wallet for a lead
   */
  private async getOrCreateLeadWallet(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<CreditWallet> {
    const [existingWallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);

    if (existingWallet) {
      return existingWallet;
    }

    // Create new wallet for lead
    const [newWallet] = await db
      .insert(creditWallets)
      .values({
        leadId,
        balance: 0,
        freeCreditsRemaining: 20,
        freePeriodStart: new Date(),
      })
      .onConflictDoNothing() // Handle race condition with UNIQUE constraint
      .returning();

    if (newWallet) {
      logger.info("Created new lead wallet", {
        leadId,
        walletId: newWallet.id,
      });

      // Create FREE_GRANT transaction for initial free credits
      await db.insert(creditTransactions).values({
        walletId: newWallet.id,
        amount: 20,
        balanceAfter: 0, // Pack balance is 0, free credits are separate
        type: CreditTransactionType.FREE_GRANT,
        metadata: {
          reason: "initial_grant",
          freeCreditsRemaining: 20,
        },
      });

      return newWallet;
    }

    // Race condition: another process created it, fetch it
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);

    return wallet;
  }

  /**
   * Check and reset monthly free credits if needed
   */
  private async ensureMonthlyFreeCredits(
    wallet: CreditWallet,
    logger: EndpointLogger,
  ): Promise<CreditWallet> {
    const now = new Date();
    const periodStart = new Date(wallet.freePeriodStart);

    // Calculate months difference
    const monthsDiff =
      (now.getFullYear() - periodStart.getFullYear()) * 12 +
      (now.getMonth() - periodStart.getMonth());

    if (monthsDiff < 1) {
      return wallet; // No reset needed
    }

    // Calculate days since last reset for audit trail
    const daysDiff = Math.floor(
      (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Check for duplicate reset transaction (idempotency)
    const [existingReset] = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet.id),
          eq(creditTransactions.type, CreditTransactionType.FREE_RESET),
          sql`${creditTransactions.metadata}->>'previousPeriodStart' = ${periodStart.toISOString()}`,
        ),
      )
      .limit(1);

    if (existingReset) {
      logger.debug("Monthly reset already processed", {
        walletId: wallet.id,
        transactionId: existingReset.id,
      });
      return wallet;
    }

    // Reset free credits
    const freeCredits = productsRepository.getProduct(
      ProductIds.FREE_TIER,
      "en-GLOBAL",
    ).credits;

    const previousFree = wallet.freeCreditsRemaining;

    const [updatedWallet] = await db
      .update(creditWallets)
      .set({
        freeCreditsRemaining: freeCredits,
        freePeriodStart: now,
        updatedAt: now,
      })
      .where(eq(creditWallets.id, wallet.id))
      .returning();

    // Create FREE_RESET transaction (tracks actual gain)
    await db.insert(creditTransactions).values({
      walletId: wallet.id,
      amount: freeCredits - previousFree, // Actual gain (could be negative if they had more)
      balanceAfter: wallet.balance, // Pack balance unchanged
      type: CreditTransactionType.FREE_RESET,
      metadata: {
        previousPeriodStart: periodStart.toISOString(),
        newPeriodStart: now.toISOString(),
        previousFreeCredits: previousFree,
        newFreeCredits: freeCredits,
        daysSinceLastReset: daysDiff,
      },
    });

    logger.info("Monthly free credits reset", {
      walletId: wallet.id,
      previousFree,
      newFree: freeCredits,
    });

    return updatedWallet;
  }

  /**
   * Get total balance for a wallet (packs + free credits)
   */
  private async getWalletBalance(
    wallet: CreditWallet,
    logger: EndpointLogger,
  ): Promise<CreditBalance> {
    // Ensure monthly credits are current
    const currentWallet = await this.ensureMonthlyFreeCredits(wallet, logger);

    // Get all active packs for this wallet
    const packs = await db
      .select()
      .from(creditPacks)
      .where(
        and(
          eq(creditPacks.walletId, currentWallet.id),
          or(
            isNull(creditPacks.expiresAt),
            gte(creditPacks.expiresAt, new Date()),
          ),
        ),
      );

    let expiring = 0;
    let permanent = 0;
    let bonus = 0;
    let earliestExpiry: Date | null = null;

    for (const pack of packs) {
      if (pack.type === "subscription") {
        expiring += pack.remaining;
        if (
          pack.expiresAt &&
          (!earliestExpiry || pack.expiresAt < earliestExpiry)
        ) {
          earliestExpiry = pack.expiresAt;
        }
      } else if (pack.type === "permanent") {
        permanent += pack.remaining;
      } else if (pack.type === "bonus") {
        bonus += pack.remaining;
      }
    }

    const total =
      currentWallet.freeCreditsRemaining + expiring + permanent + bonus;

    return {
      total,
      expiring,
      permanent,
      free: currentWallet.freeCreditsRemaining + bonus,
      expiresAt: earliestExpiry ? earliestExpiry.toISOString() : null,
    };
  }

  /**
   * Get balance for identifier
   */
  async getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      let wallet: CreditWallet;

      if (identifier.userId) {
        wallet = await this.getOrCreateUserWallet(identifier.userId, logger);
      } else if (identifier.leadId) {
        wallet = await this.getOrCreateLeadWallet(identifier.leadId, logger);
      } else {
        return fail({
          message: "app.api.v1.core.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const balance = await this.getWalletBalance(wallet, logger);
      return success(balance);
    } catch (error) {
      logger.error("Failed to get balance", parseError(error), {
        ...identifier,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get lead's credit balance (simplified)
   */
  async getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      const wallet = await this.getOrCreateLeadWallet(leadId, logger);
      const currentWallet = await this.ensureMonthlyFreeCredits(wallet, logger);

      // Total is free credits + any pack balance
      const total = currentWallet.freeCreditsRemaining + currentWallet.balance;
      return success(total);
    } catch (error) {
      logger.error("Failed to get lead balance", parseError(error), { leadId });
      return fail({
        message: "app.api.v1.core.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get credit balance for user
   * Handles wallet merging if user has multiple linked leads
   */
  async getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      if (user.isPublic) {
        // Public user: use lead wallet
        const wallet = await this.getOrCreateLeadWallet(user.leadId, logger);
        const balance = await this.getWalletBalance(wallet, logger);
        return success(balance);
      }

      // Private user: use user wallet
      const wallet = await this.getOrCreateUserWallet(user.id, logger);

      // Check for linked leads and merge their wallets if needed
      const linkedLeads = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, user.id));

      if (linkedLeads.length > 0) {
        await this.mergeLeadWalletsIntoUser(
          user.id,
          linkedLeads.map((l) => l.leadId),
          logger,
        );
      }

      const balance = await this.getWalletBalance(wallet, logger);
      return success(balance);
    } catch (error) {
      logger.error("Failed to get user balance", parseError(error), {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Merge lead wallets into user wallet (transfer packs and preserve history)
   */
  private async mergeLeadWalletsIntoUser(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    const userWallet = await this.getOrCreateUserWallet(userId, logger);

    for (const leadId of leadIds) {
      const [leadWallet] = await db
        .select()
        .from(creditWallets)
        .where(eq(creditWallets.leadId, leadId))
        .limit(1);

      if (!leadWallet) {
        continue;
      }

      // Check if already merged (idempotency)
      const [existingTransfer] = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.walletId, userWallet.id),
            eq(creditTransactions.type, CreditTransactionType.TRANSFER),
            sql`${creditTransactions.metadata}->>'fromLeadWallet' = ${leadWallet.id}`,
          ),
        )
        .limit(1);

      if (existingTransfer) {
        logger.debug("Lead wallet already merged", {
          leadId,
          leadWalletId: leadWallet.id,
          userWalletId: userWallet.id,
        });
        continue;
      }

      // Transfer any remaining free credits to user wallet (take the max)
      const maxFreeCredits = Math.max(
        userWallet.freeCreditsRemaining,
        leadWallet.freeCreditsRemaining,
      );

      // Update user wallet with merged free credits
      await db
        .update(creditWallets)
        .set({
          freeCreditsRemaining: maxFreeCredits,
          updatedAt: new Date(),
        })
        .where(eq(creditWallets.id, userWallet.id));

      // Transfer all packs from lead wallet to user wallet
      await db
        .update(creditPacks)
        .set({ walletId: userWallet.id, updatedAt: new Date() })
        .where(eq(creditPacks.walletId, leadWallet.id));

      // Update all transactions to point to user wallet (preserve history)
      await db
        .update(creditTransactions)
        .set({ walletId: userWallet.id })
        .where(eq(creditTransactions.walletId, leadWallet.id));

      // Calculate new balance after pack transfer (sum of all pack remaining credits)
      const packsAfterMerge = await db
        .select({ remaining: creditPacks.remaining })
        .from(creditPacks)
        .where(eq(creditPacks.walletId, userWallet.id));

      const newBalance = packsAfterMerge.reduce(
        (sum, pack) => sum + pack.remaining,
        0,
      );

      // Update user wallet balance to reflect merged packs
      await db
        .update(creditWallets)
        .set({
          balance: newBalance,
          updatedAt: new Date(),
        })
        .where(eq(creditWallets.id, userWallet.id));

      // Create transfer transaction for audit trail
      await db.insert(creditTransactions).values({
        walletId: userWallet.id,
        amount: leadWallet.balance, // Amount transferred from lead wallet
        balanceAfter: newBalance, // FIXED: Uses recalculated balance
        type: CreditTransactionType.TRANSFER,
        metadata: {
          fromLeadWallet: leadWallet.id,
          fromLeadId: leadId,
          mergedFreeCredits: leadWallet.freeCreditsRemaining,
          mergedPackCredits: leadWallet.balance,
          reason: "lead_to_user_merge",
        },
      });

      // Delete the lead wallet (no longer needed)
      await db.delete(creditWallets).where(eq(creditWallets.id, leadWallet.id));

      logger.info("Merged lead wallet into user wallet", {
        userId,
        leadId,
        leadWalletId: leadWallet.id,
        userWalletId: userWallet.id,
        mergedFreeCredits: leadWallet.freeCreditsRemaining,
      });
    }
  }

  /**
   * Get or create lead by IP address
   */
  async getOrCreateLeadByIp(
    ipAddress: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>> {
    try {
      // Check if lead exists for this IP
      const [existingLead] = await db
        .select()
        .from(leads)
        .where(eq(leads.ipAddress, ipAddress))
        .limit(1);

      if (existingLead) {
        const wallet = await this.getOrCreateLeadWallet(
          existingLead.id,
          logger,
        );
        const currentWallet = await this.ensureMonthlyFreeCredits(
          wallet,
          logger,
        );
        const credits =
          currentWallet.freeCreditsRemaining + currentWallet.balance;

        return success({
          leadId: existingLead.id,
          credits,
        });
      }

      // Create new lead with IP
      const { language, country } = getLanguageAndCountryFromLocale(locale);

      const [newLead] = await db
        .insert(leads)
        .values({
          ipAddress,
          businessName: "",
          country,
          language,
          status: LeadStatus.WEBSITE_USER,
          source: LeadSource.WEBSITE,
        })
        .returning();

      // Create wallet for new lead
      const wallet = await this.getOrCreateLeadWallet(newLead.id, logger);
      const credits = wallet.freeCreditsRemaining + wallet.balance;

      logger.debug("Created new lead with wallet", {
        leadId: newLead.id,
        ipAddress,
        credits,
      });

      return success({
        leadId: newLead.id,
        credits,
      });
    } catch (error) {
      logger.error("Failed to get or create lead by IP", parseError(error), {
        ipAddress,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.getOrCreateLeadFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Add credits to identifier
   */
  async addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      let wallet: CreditWallet;

      if (identifier.userId) {
        wallet = await this.getOrCreateUserWallet(identifier.userId, logger);
      } else if (identifier.leadId) {
        wallet = await this.getOrCreateLeadWallet(identifier.leadId, logger);
      } else {
        return fail({
          message: "app.api.v1.core.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Determine pack type and expiration
      let packType: "subscription" | "permanent" | "bonus";
      let expiresAt: Date | null = null;

      if (type === "subscription") {
        packType = "subscription";
        // Subscription credits expire in 30 days
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
      } else if (type === "permanent") {
        packType = "permanent";
      } else {
        packType = "bonus";
      }

      // Create credit pack
      const [newPack] = await db
        .insert(creditPacks)
        .values({
          walletId: wallet.id,
          originalAmount: amount,
          remaining: amount,
          type: packType,
          expiresAt,
          source: type,
        })
        .returning();

      // Update wallet balance
      const newBalance = wallet.balance + amount;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create transaction
      await db.insert(creditTransactions).values({
        walletId: wallet.id,
        amount,
        balanceAfter: newBalance,
        type:
          packType === "subscription"
            ? CreditTransactionType.SUBSCRIPTION
            : CreditTransactionType.PURCHASE,
        packId: newPack.id,
      });

      logger.info("Credits added", {
        walletId: wallet.id,
        amount,
        packType,
        expiresAt,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to add credits", parseError(error), {
        ...identifier,
        amount,
        type,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.addCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Add credits to user account (specific method)
   */
  async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
  ): Promise<ResponseType<void>> {
    try {
      const wallet = await this.getOrCreateUserWallet(userId, logger);

      let packType: "subscription" | "permanent" | "bonus";
      let finalExpiresAt: Date | null = null;

      if (type === "subscription") {
        packType = "subscription";
        finalExpiresAt =
          expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (type === "permanent") {
        packType = "permanent";
      } else {
        packType = "bonus";
      }

      // Create credit pack
      const [newPack] = await db
        .insert(creditPacks)
        .values({
          walletId: wallet.id,
          originalAmount: amount,
          remaining: amount,
          type: packType,
          expiresAt: finalExpiresAt,
          source: `${type}_purchase`,
        })
        .returning();

      // Update wallet balance
      const newBalance = wallet.balance + amount;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create transaction
      await db.insert(creditTransactions).values({
        walletId: wallet.id,
        amount,
        balanceAfter: newBalance,
        type:
          type === "subscription"
            ? CreditTransactionType.SUBSCRIPTION
            : type === "free"
              ? CreditTransactionType.FREE_GRANT
              : CreditTransactionType.PURCHASE,
        packId: newPack.id,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to add user credits", parseError(error), {
        userId,
        amount,
        type,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.addCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits from identifier
   * Priority: free credits → expiring soonest packs → permanent packs
   */
  async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      let wallet: CreditWallet;

      if (identifier.userId) {
        wallet = await this.getOrCreateUserWallet(identifier.userId, logger);
      } else if (identifier.leadId) {
        wallet = await this.getOrCreateLeadWallet(identifier.leadId, logger);
      } else {
        return fail({
          message: "app.api.v1.core.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Ensure monthly credits are current
      wallet = await this.ensureMonthlyFreeCredits(wallet, logger);

      let remaining = amount;

      // 1. Deduct from free credits first
      if (wallet.freeCreditsRemaining > 0 && remaining > 0) {
        const deduction = Math.min(wallet.freeCreditsRemaining, remaining);
        await db
          .update(creditWallets)
          .set({
            freeCreditsRemaining: wallet.freeCreditsRemaining - deduction,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id));
        remaining -= deduction;
      }

      // 2. Deduct from packs (expiring soonest first, NULLS LAST)
      if (remaining > 0) {
        const packs = await db
          .select()
          .from(creditPacks)
          .where(
            and(
              eq(creditPacks.walletId, wallet.id),
              or(
                isNull(creditPacks.expiresAt),
                gte(creditPacks.expiresAt, new Date()),
              ),
            ),
          )
          .orderBy(sql`${creditPacks.expiresAt} NULLS LAST`);

        for (const pack of packs) {
          if (remaining <= 0) {
            break;
          }

          const deduction = Math.min(pack.remaining, remaining);

          if (deduction === pack.remaining) {
            // Pack fully consumed, delete it
            await db.delete(creditPacks).where(eq(creditPacks.id, pack.id));
          } else {
            await db
              .update(creditPacks)
              .set({
                remaining: pack.remaining - deduction,
                updatedAt: new Date(),
              })
              .where(eq(creditPacks.id, pack.id));
          }

          remaining -= deduction;
        }
      }

      if (remaining > 0) {
        return fail({
          message: "app.api.v1.core.credits.errors.insufficientCredits",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Update wallet balance
      const newBalance = wallet.balance - (amount - remaining);
      await db
        .update(creditWallets)
        .set({ balance: Math.max(0, newBalance), updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create usage transaction
      await db.insert(creditTransactions).values({
        walletId: wallet.id,
        amount: -amount,
        balanceAfter: Math.max(0, newBalance),
        type: CreditTransactionType.USAGE,
        modelId,
        messageId,
      });

      logger.debug("Credits deducted", {
        walletId: wallet.id,
        amount,
        newBalance: Math.max(0, newBalance),
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to deduct credits", parseError(error), {
        ...identifier,
        amount,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.deductCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(
    userId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      const wallet = await this.getOrCreateUserWallet(userId, logger);

      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, wallet.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, wallet.id));

      return success({
        transactions: transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          balanceAfter: t.balanceAfter,
          type: t.type,
          modelId: t.modelId,
          messageId: t.messageId,
          createdAt: t.createdAt.toISOString(),
        })),
        totalCount: count,
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { userId });
      return fail({
        message: "app.api.v1.core.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transactions by lead ID
   */
  async getTransactionsByLeadId(
    leadId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      const wallet = await this.getOrCreateLeadWallet(leadId, logger);

      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, wallet.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, wallet.id));

      return success({
        transactions: transactions.map((t) => ({
          id: t.id,
          amount: t.amount,
          balanceAfter: t.balanceAfter,
          type: t.type,
          modelId: t.modelId,
          messageId: t.messageId,
          createdAt: t.createdAt.toISOString(),
        })),
        totalCount: count,
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { leadId });
      return fail({
        message: "app.api.v1.core.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Expire old subscription credits (cron job)
   * Creates EXPIRY transaction before deleting packs
   */
  async expireCredits(logger: EndpointLogger): Promise<ResponseType<number>> {
    try {
      const expiredPacks = await db
        .select()
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.type, "subscription"),
            lt(creditPacks.expiresAt, new Date()),
          ),
        );

      let expiredCount = 0;

      for (const pack of expiredPacks) {
        if (pack.remaining > 0) {
          // Get wallet to update balance
          const [wallet] = await db
            .select()
            .from(creditWallets)
            .where(eq(creditWallets.id, pack.walletId))
            .limit(1);

          if (wallet) {
            const newBalance = wallet.balance - pack.remaining;

            // Update wallet balance
            await db
              .update(creditWallets)
              .set({ balance: Math.max(0, newBalance), updatedAt: new Date() })
              .where(eq(creditWallets.id, wallet.id));

            // Create EXPIRY transaction (preserves history)
            await db.insert(creditTransactions).values({
              walletId: wallet.id,
              amount: -pack.remaining,
              balanceAfter: Math.max(0, newBalance),
              type: CreditTransactionType.EXPIRY,
              packId: pack.id,
              metadata: {
                expiredPackId: pack.id,
                expiredAmount: pack.remaining,
                originalAmount: pack.originalAmount,
                expiredAt: pack.expiresAt?.toISOString() ?? null,
              },
            });
          }
        }

        // Delete the expired pack
        await db.delete(creditPacks).where(eq(creditPacks.id, pack.id));
        expiredCount++;
      }

      logger.info("Expired credits cleanup completed", { expiredCount });
      return success(expiredCount);
    } catch (error) {
      logger.error("Failed to expire credits", parseError(error));
      return fail({
        message: "app.api.v1.core.credits.errors.expireCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get credit identifier based on subscription status
   */
  async getCreditIdentifierBySubscription(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId?: string;
      leadId?: string;
      creditType: CreditTypeIdentifierValue;
    }>
  > {
    try {
      // Check if user has an active subscription
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      const hasActiveSubscription =
        subscription && subscription.status === SubscriptionStatus.ACTIVE;

      if (hasActiveSubscription) {
        logger.debug("Using user credits (subscription)", {
          userId,
          subscriptionId: subscription.id,
        });
        return success({
          userId,
          creditType: CreditTypeIdentifier.USER_SUBSCRIPTION,
        });
      }

      // No subscription: use user wallet (which has free credits)
      logger.debug("Using user credits (no subscription)", { userId });
      return success({
        userId,
        creditType: CreditTypeIdentifier.LEAD_FREE,
      });
    } catch (error) {
      logger.error("Failed to get credit identifier", parseError(error), {
        userId,
        leadId,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.getCreditIdentifierFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits for a feature (high-level wrapper)
   */
  async deductCreditsForFeature(
    user: JwtPayloadType,
    cost: number,
    feature: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }> {
    if (cost <= 0) {
      logger.debug("Skipping credit deduction - zero or negative cost", {
        feature,
        cost,
      });
      return { success: true };
    }

    try {
      const creditMessageId = crypto.randomUUID();
      let identifier: CreditIdentifier;

      if (user.isPublic && user.leadId) {
        identifier = { leadId: user.leadId };
      } else if (user.id) {
        identifier = { userId: user.id };
      } else if (user.leadId) {
        identifier = { leadId: user.leadId };
      } else {
        logger.error("No identifier for credit deduction", { feature, cost });
        return { success: false };
      }

      const result = await this.deductCredits(
        identifier,
        cost,
        feature,
        creditMessageId,
        logger,
      );

      if (!result.success) {
        logger.error(`Failed to deduct credits for ${feature}`, {
          ...identifier,
          cost,
        });
        return { success: false };
      }

      logger.info(`Credits deducted for ${feature}`, {
        ...identifier,
        cost,
        messageId: creditMessageId,
      });

      return { success: true, messageId: creditMessageId };
    } catch (error) {
      logger.error(`Error deducting credits for ${feature}`, {
        error: error instanceof Error ? error.message : String(error),
        cost,
      });
      return { success: false };
    }
  }

  /**
   * Handle credit pack purchase from webhook
   */
  async handleCreditPackPurchase(
    session: CreditPackCheckoutSession,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const userId = session.metadata?.userId;
      const totalCredits = parseInt(session.metadata?.totalCredits || "0", 10);

      if (!userId || !totalCredits) {
        logger.error("Invalid credit pack metadata", {
          sessionId: session.id,
          metadata: session.metadata,
        });
        return;
      }

      const result = await this.addUserCredits(
        userId,
        totalCredits,
        "permanent",
        logger,
      );

      if (!result.success) {
        logger.error("Failed to add credits after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });
      } else {
        logger.info("Credits added after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });
      }
    } catch (error) {
      logger.error("Failed to handle credit pack purchase", {
        error: parseError(error),
        sessionId: session.id,
      });
    }
  }

  /**
   * Merge pending lead wallets into user wallet (public wrapper)
   * Called during signup to immediately merge lead credits instead of lazy merging
   */
  async mergePendingLeadWallets(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      if (leadIds.length === 0) {
        logger.debug("No lead wallets to merge", { userId });
        return success(undefined);
      }

      logger.debug("Merging pending lead wallets during signup", {
        userId,
        leadIds,
      });

      await this.mergeLeadWalletsIntoUser(userId, leadIds, logger);

      logger.info("Lead wallets merged during signup", {
        userId,
        mergedLeadCount: leadIds.length,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to merge lead wallets", parseError(error), {
        userId,
        leadIds,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.mergeLeadWalletsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cleanup orphaned lead wallets
   * Finds lead wallets that are linked to users but never merged
   * Returns the number of cleaned up wallets
   */
  async cleanupOrphanedLeadWallets(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      logger.info("Starting orphaned lead wallet cleanup");

      // Find all lead wallets that belong to leads linked to users
      // These are orphaned if they still exist after user signup
      const orphanedWallets = await db
        .select({
          leadId: userLeadLinks.leadId,
          userId: userLeadLinks.userId,
          walletId: creditWallets.id,
        })
        .from(userLeadLinks)
        .innerJoin(
          creditWallets,
          eq(creditWallets.leadId, userLeadLinks.leadId),
        );

      if (orphanedWallets.length === 0) {
        logger.info("No orphaned lead wallets found");
        return success(0);
      }

      logger.info("Found orphaned lead wallets", {
        count: orphanedWallets.length,
      });

      // Group by user to merge all their orphaned lead wallets
      const userLeadMap = new Map<string, string[]>();
      for (const wallet of orphanedWallets) {
        const existing = userLeadMap.get(wallet.userId) || [];
        existing.push(wallet.leadId);
        userLeadMap.set(wallet.userId, existing);
      }

      let mergedCount = 0;
      for (const [userId, leadIds] of userLeadMap) {
        try {
          await this.mergeLeadWalletsIntoUser(userId, leadIds, logger);
          mergedCount += leadIds.length;
          logger.debug("Merged orphaned wallets for user", {
            userId,
            leadIds,
          });
        } catch (error) {
          logger.error("Failed to merge orphaned wallets for user", {
            userId,
            leadIds,
            error: parseError(error).message,
          });
          // Continue with next user
        }
      }

      logger.info("Orphaned lead wallet cleanup completed", {
        totalOrphaned: orphanedWallets.length,
        mergedCount,
      });

      return success(mergedCount);
    } catch (error) {
      logger.error("Orphaned wallet cleanup failed", parseError(error));
      return fail({
        message: "app.api.v1.core.credits.errors.cleanupOrphanedFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Check if identifier has sufficient credits (repository-level business logic)
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  override async hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (!identifier.leadId && !identifier.userId) {
      logger.error("Credit check requires leadId or userId");
      return false;
    }
    const balanceResult = await this.getBalance(identifier, logger);
    if (!balanceResult.success) {
      return false;
    }
    return balanceResult.data.total >= required;
  }

  /**
   * Deduct credits with validation (repository-level business logic)
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  override async deductCreditsWithValidation(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!identifier.leadId && !identifier.userId) {
      logger.error("Credit deduction requires leadId or userId");
      return {
        success: false,
        error: "app.api.v1.core.credits.errors.missingIdentifier",
      };
    }

    const hasSufficient = await this.hasSufficientCredits(
      identifier,
      amount,
      logger,
    );
    if (!hasSufficient) {
      return {
        success: false,
        error: "app.api.v1.core.credits.errors.insufficientCredits",
      };
    }

    const messageId = this.generateMessageId();
    const result = await this.deductCredits(
      identifier,
      amount,
      modelId,
      messageId,
      logger,
    );
    if (!result.success) {
      return {
        success: false,
        error: "app.api.v1.core.credits.errors.deductionFailed",
      };
    }
    return { success: true, messageId };
  }

  /**
   * Generate unique message ID for credit transactions
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  override generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

export const creditRepository = new CreditRepository();

// Re-export transaction manager for backward compatibility
export const creditTransactionManager = {
  ensureMonthlyCredits: async (
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> => {
    const wallet = await creditRepository["getOrCreateLeadWallet"](
      leadId,
      logger,
    );
    await creditRepository["ensureMonthlyFreeCredits"](wallet, logger);
    return success(wallet.freeCreditsRemaining);
  },
  mergeCreditsIntoOldest: async (
    _leadIds: string[],
    _logger: EndpointLogger,
  ): Promise<ResponseType<string>> => {
    // No longer needed with wallet-based system
    // Merging happens automatically via mergeLeadWalletsIntoUser
    return success(_leadIds[0]);
  },
  createTransaction: async (
    _params: {
      walletId?: string;
      amount: number;
      balanceAfter: number;
      type: CreditTransactionTypeValue;
    },
    _logger: EndpointLogger,
  ): Promise<ResponseType<void>> => {
    // Transactions are created automatically by repository methods
    return success(undefined);
  },
};
