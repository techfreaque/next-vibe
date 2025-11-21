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

import { and, desc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
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
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { productsRepository, ProductIds } from "../products/repository-client";
import { withTransaction } from "../system/db/utils/repository-helpers";
import {
  creditPacks,
  creditTransactions,
  creditWallets,
  type CreditWallet,
  type UsageMetadata,
} from "./db";
import {
  CreditTransactionType,
  type CreditTransactionTypeValue,
  CreditTypeIdentifier,
  type CreditTypeIdentifierValue,
} from "./enum";

/**
 * Credit Balance - summary of user/lead credit state
 */
export interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

/**
 * Credit Identifier - identifies who owns credits
 */
export interface CreditIdentifier {
  leadId?: string;
  userId?: string;
}

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
    type: "subscription" | "permanent" | "bonus",
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
    sessionId?: string,
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
class CreditRepository implements CreditRepositoryInterface {
  /**
   * Initial free credits for new wallets
   * Uses the FREE_TIER product definition as single source of truth
   */
  private getInitialFreeCredits(): number {
    return productsRepository.getProduct(ProductIds.FREE_TIER, "en-GLOBAL")
      .credits;
  }

  /**
   * Get or create wallet for a user
   * ATOMIC: Wallet creation and FREE_GRANT transaction are wrapped in database transaction
   */
  private async getOrCreateUserWallet(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditWallet>> {
    const [existingWallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (existingWallet) {
      return success(existingWallet);
    }

    // Create new wallet for user - ATOMIC operation
    const initialCredits = this.getInitialFreeCredits();

    try {
      const newWallet = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .insert(creditWallets)
          .values({
            userId,
            balance: 0,
            freeCreditsRemaining: initialCredits,
            freePeriodStart: new Date(),
          })
          .onConflictDoNothing() // Handle race condition
          .returning();

        if (wallet) {
          // Create FREE_GRANT transaction atomically with wallet
          await tx.insert(creditTransactions).values({
            walletId: wallet.id,
            amount: initialCredits,
            balanceAfter: 0, // Pack balance is 0, free credits are separate
            type: CreditTransactionType.FREE_GRANT,
            metadata: {
              reason: "initial_grant",
              freeCreditsRemaining: initialCredits,
            },
          });

          logger.info("Created new user wallet", {
            userId,
            walletId: wallet.id,
          });
        }

        return wallet;
      });

      if (newWallet) {
        return success(newWallet);
      }
    } catch (error) {
      logger.warn(
        "Wallet creation transaction failed, checking for race condition",
        {
          userId,
          error: parseError(error),
        },
      );
    }

    // Race condition: another process created it, fetch it
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (!wallet) {
      logger.error("Failed to retrieve user wallet after creation attempt", {
        userId,
      });
      return fail({
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        message: "app.api.v1.core.credits.errors.walletCreationFailed",
      });
    }

    return success(wallet);
  }

  /**
   * Get or create wallet for a lead
   * ATOMIC: Wallet creation and FREE_GRANT transaction are wrapped in database transaction
   */
  private async getOrCreateLeadWallet(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditWallet>> {
    const [existingWallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);

    if (existingWallet) {
      return success(existingWallet);
    }

    // Create new wallet for lead - ATOMIC operation
    const initialCredits = this.getInitialFreeCredits();

    try {
      const newWallet = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .insert(creditWallets)
          .values({
            leadId,
            balance: 0,
            freeCreditsRemaining: initialCredits,
            freePeriodStart: new Date(),
          })
          .onConflictDoNothing() // Handle race condition with UNIQUE constraint
          .returning();

        if (wallet) {
          // Create FREE_GRANT transaction atomically with wallet
          await tx.insert(creditTransactions).values({
            walletId: wallet.id,
            amount: initialCredits,
            balanceAfter: 0, // Pack balance is 0, free credits are separate
            type: CreditTransactionType.FREE_GRANT,
            metadata: {
              reason: "initial_grant",
              freeCreditsRemaining: initialCredits,
            },
          });

          logger.info("Created new lead wallet", {
            leadId,
            walletId: wallet.id,
          });
        }

        return wallet;
      });

      if (newWallet) {
        return success(newWallet);
      }
    } catch (error) {
      logger.warn(
        "Wallet creation transaction failed, checking for race condition",
        {
          leadId,
          error: parseError(error),
        },
      );
    }

    // Race condition: another process created it, fetch it
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.leadId, leadId))
      .limit(1);

    if (!wallet) {
      logger.error("Failed to retrieve lead wallet after creation attempt", {
        leadId,
      });
      return fail({
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        message: "app.api.v1.core.credits.errors.walletCreationFailed",
      });
    }

    return success(wallet);
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
      let walletResult: ResponseType<CreditWallet>;

      if (identifier.userId) {
        // Use shared wallet for authenticated users
        walletResult = await this.getOrCreateSharedWallet(
          identifier.userId,
          logger,
        );
      } else if (identifier.leadId) {
        // Check if this lead is linked to a user
        const [leadLink] = await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, identifier.leadId))
          .limit(1);

        if (leadLink) {
          // Lead is linked to a user - fetch from user's shared wallet
          logger.debug("Lead is linked to user, fetching from shared wallet", {
            leadId: identifier.leadId,
            userId: leadLink.userId,
          });
          walletResult = await this.getOrCreateSharedWallet(
            leadLink.userId,
            logger,
          );
        } else {
          // Lead is not linked - use lead wallet
          walletResult = await this.getOrCreateLeadWallet(
            identifier.leadId,
            logger,
          );
        }
      } else {
        return fail({
          message: "app.api.v1.core.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (!walletResult.success) {
        return walletResult;
      }

      const balance = await this.getWalletBalance(walletResult.data, logger);
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
   * Uses getWalletBalance for consistency with other balance calculations
   * If lead is linked to a user, fetches from the user's shared wallet instead
   */
  async getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      // Check if this lead is linked to a user
      const [leadLink] = await db
        .select()
        .from(userLeadLinks)
        .where(eq(userLeadLinks.leadId, leadId))
        .limit(1);

      let walletResult: ResponseType<CreditWallet>;
      if (leadLink) {
        // Lead is linked to a user - fetch from user's shared wallet
        logger.debug("Lead is linked to user, fetching from shared wallet", {
          leadId,
          userId: leadLink.userId,
        });
        walletResult = await this.getOrCreateSharedWallet(
          leadLink.userId,
          logger,
        );
      } else {
        // Lead is not linked - use lead wallet
        walletResult = await this.getOrCreateLeadWallet(leadId, logger);
      }

      if (!walletResult.success) {
        return walletResult;
      }
      // Use getWalletBalance for consistent calculation (sums active packs, checks expiration)
      const balance = await this.getWalletBalance(walletResult.data, logger);
      return success(balance.total);
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
   * Uses shared wallet system: one wallet per pool (user + all linked leads)
   */
  async getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      if (user.isPublic) {
        // Check if this lead is linked to a user
        const [leadLink] = await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, user.leadId))
          .limit(1);

        if (leadLink) {
          // Lead is linked to a user - fetch from user's shared wallet
          logger.debug(
            "Public user's lead is linked, fetching from shared wallet",
            {
              leadId: user.leadId,
              userId: leadLink.userId,
            },
          );
          const walletResult = await this.getOrCreateSharedWallet(
            leadLink.userId,
            logger,
          );
          if (!walletResult.success) {
            return walletResult;
          }
          const balance = await this.getWalletBalance(
            walletResult.data,
            logger,
          );
          return success(balance);
        }

        // Lead is not linked - use lead wallet
        const walletResult = await this.getOrCreateLeadWallet(
          user.leadId,
          logger,
        );
        if (!walletResult.success) {
          return walletResult;
        }
        const balance = await this.getWalletBalance(walletResult.data, logger);
        return success(balance);
      }

      // Private user: get the shared wallet for this pool
      const walletResult = await this.getOrCreateSharedWallet(user.id, logger);
      if (!walletResult.success) {
        return walletResult;
      }

      const balance = await this.getWalletBalance(walletResult.data, logger);
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
   * Get or create shared wallet for user pool
   * Strategy: Use oldest lead wallet if exists, otherwise create user wallet
   * CRITICAL: Delete all other lead wallets to ensure max 20 free credits per pool
   */
  private async getOrCreateSharedWallet(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditWallet>> {
    // Check if user already has a wallet
    const [userWallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (userWallet) {
      // User wallet exists - delete any orphaned lead wallets
      await this.deleteOrphanedLeadWallets(userId, logger);
      return success(userWallet);
    }

    // Get all linked lead IDs
    const { leadAuthRepository } = await import("../leads/auth/repository");
    const leadIds = await leadAuthRepository.getUserLeadIds(userId, logger);

    if (leadIds.length === 0) {
      // No leads linked - create new user wallet
      return await this.getOrCreateUserWallet(userId, logger);
    }

    // Get all lead wallets (by lead creation date)
    const leadWallets = await db
      .select({
        walletId: creditWallets.id,
        leadId: creditWallets.leadId,
        wallet: creditWallets,
        leadCreatedAt: leads.createdAt,
      })
      .from(creditWallets)
      .innerJoin(leads, eq(creditWallets.leadId, leads.id))
      .where(inArray(creditWallets.leadId, leadIds))
      .orderBy(leads.createdAt); // Oldest first

    if (leadWallets.length === 0) {
      // No lead wallets exist - create new user wallet
      return await this.getOrCreateUserWallet(userId, logger);
    }

    // Use transaction to ensure atomicity
    return await withTransaction(logger, async (tx) => {
      const oldestWallet = leadWallets[0];
      const newerWallets = leadWallets.slice(1);

      // Convert oldest lead wallet to shared wallet FIRST
      await tx
        .update(creditWallets)
        .set({
          userId,
          leadId: null, // Clear leadId - it's now a shared wallet
          updatedAt: new Date(),
        })
        .where(eq(creditWallets.id, oldestWallet.walletId));

      // Merge spending transactions from newer wallets to shared wallet
      if (newerWallets.length > 0) {
        const newerWalletIds = newerWallets.map((w) => w.walletId);

        // Get all USAGE transactions from newer wallets (spending only)
        const spendingTransactions = await tx
          .select()
          .from(creditTransactions)
          .where(
            and(
              inArray(creditTransactions.walletId, newerWalletIds),
              eq(creditTransactions.type, CreditTransactionType.USAGE),
            ),
          );

        // Transfer spending transactions to shared wallet
        if (spendingTransactions.length > 0) {
          for (const transaction of spendingTransactions) {
            const originalMetadata = transaction.metadata as UsageMetadata;
            await tx.insert(creditTransactions).values({
              walletId: oldestWallet.walletId,
              amount: transaction.amount, // Negative amount (spending)
              balanceAfter: transaction.balanceAfter,
              type: transaction.type,
              modelId: transaction.modelId,
              messageId: transaction.messageId,
              metadata: {
                feature: originalMetadata.feature,
                cost: originalMetadata.cost,
                modelId: originalMetadata.modelId,
                messageId: originalMetadata.messageId,
                freeCreditsUsed: originalMetadata.freeCreditsUsed,
                packCreditsUsed: originalMetadata.packCreditsUsed,
                transferredFrom: transaction.walletId,
                reason: "wallet_merge" as const,
              },
              createdAt: transaction.createdAt, // Preserve original timestamp
            });
          }

          logger.info("Transferred spending transactions to shared wallet", {
            userId,
            sharedWalletId: oldestWallet.walletId,
            transactionCount: spendingTransactions.length,
          });
        }

        // Delete ALL transactions for newer wallets (including FREE_GRANT)
        await tx
          .delete(creditTransactions)
          .where(inArray(creditTransactions.walletId, newerWalletIds));

        // Delete packs for newer wallets
        await tx
          .delete(creditPacks)
          .where(inArray(creditPacks.walletId, newerWalletIds));

        // Delete newer wallets
        await tx
          .delete(creditWallets)
          .where(inArray(creditWallets.id, newerWalletIds));

        logger.info(
          "Deleted newer lead wallets after merging spending transactions",
          {
            userId,
            deletedCount: newerWallets.length,
            deletedWalletIds: newerWalletIds,
          },
        );
      }

      logger.info("Converted oldest lead wallet to shared user wallet", {
        userId,
        walletId: oldestWallet.walletId,
        totalLeadCount: leadIds.length,
        mergedNewerWallets: newerWallets.length,
      });

      // Return the updated wallet
      const [sharedWallet] = await tx
        .select()
        .from(creditWallets)
        .where(eq(creditWallets.id, oldestWallet.walletId))
        .limit(1);

      return success(sharedWallet!);
    });
  }

  /**
   * Delete orphaned lead wallets for a user
   * Called when user already has a shared wallet but new leads were linked
   * CRITICAL: Transfer spending transactions before deleting
   */
  private async deleteOrphanedLeadWallets(
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    // Get all linked lead IDs
    const { leadAuthRepository } = await import("../leads/auth/repository");
    const leadIds = await leadAuthRepository.getUserLeadIds(userId, logger);

    if (leadIds.length === 0) {
      return;
    }

    // Get all lead wallets for these leads
    const leadWallets = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(inArray(creditWallets.leadId, leadIds));

    if (leadWallets.length === 0) {
      return;
    }

    const walletIds = leadWallets.map((w) => w.id);

    // Get user's shared wallet
    const [userWallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (!userWallet) {
      logger.error(
        "User wallet not found when deleting orphaned lead wallets",
        {
          userId,
        },
      );
      return;
    }

    // Delete orphaned lead wallets after transferring spending transactions
    await withTransaction(logger, async (tx) => {
      // Get all USAGE transactions from orphaned wallets (spending only)
      const spendingTransactions = await tx
        .select()
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, walletIds),
            eq(creditTransactions.type, CreditTransactionType.USAGE),
          ),
        );

      // Transfer spending transactions to user's shared wallet
      if (spendingTransactions.length > 0) {
        for (const transaction of spendingTransactions) {
          const originalMetadata = transaction.metadata as UsageMetadata;
          await tx.insert(creditTransactions).values({
            walletId: userWallet.id,
            amount: transaction.amount, // Negative amount (spending)
            balanceAfter: transaction.balanceAfter,
            type: transaction.type,
            modelId: transaction.modelId,
            messageId: transaction.messageId,
            metadata: {
              feature: originalMetadata.feature,
              cost: originalMetadata.cost,
              modelId: originalMetadata.modelId,
              messageId: originalMetadata.messageId,
              freeCreditsUsed: originalMetadata.freeCreditsUsed,
              packCreditsUsed: originalMetadata.packCreditsUsed,
              transferredFrom: transaction.walletId,
              reason: "orphaned_wallet_cleanup" as const,
            },
            createdAt: transaction.createdAt, // Preserve original timestamp
          });
        }

        logger.info("Transferred spending transactions from orphaned wallets", {
          userId,
          userWalletId: userWallet.id,
          transactionCount: spendingTransactions.length,
        });
      }

      // Delete ALL transactions for orphaned wallets
      await tx
        .delete(creditTransactions)
        .where(inArray(creditTransactions.walletId, walletIds));

      // Delete packs
      await tx
        .delete(creditPacks)
        .where(inArray(creditPacks.walletId, walletIds));

      // Delete wallets
      await tx
        .delete(creditWallets)
        .where(inArray(creditWallets.id, walletIds));

      logger.info("Deleted orphaned lead wallets after merging spending", {
        userId,
        deletedCount: leadWallets.length,
        walletIds,
      });
    });
  }

  /**
   * Merge lead wallets into shared user wallet
   * Strategy: Convert oldest lead wallet to shared wallet, delete others
   * This ensures one wallet per pool with max 20 free credits
   */
  private async mergeLeadWalletsIntoUser(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    if (leadIds.length === 0) {
      return;
    }

    // Trigger shared wallet creation/conversion
    // This will convert the oldest lead wallet to a shared wallet
    const walletResult = await this.getOrCreateSharedWallet(userId, logger);
    if (!walletResult.success) {
      logger.error("Failed to create shared wallet during merge", {
        userId,
        leadIds,
      });
      return;
    }

    logger.info("Shared wallet ready for user pool", {
      userId,
      walletId: walletResult.data.id,
      leadCount: leadIds.length,
    });
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
        const walletResult = await this.getOrCreateLeadWallet(
          existingLead.id,
          logger,
        );
        if (!walletResult.success) {
          return walletResult;
        }
        const currentWallet = await this.ensureMonthlyFreeCredits(
          walletResult.data,
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
      const walletResult = await this.getOrCreateLeadWallet(newLead.id, logger);
      if (!walletResult.success) {
        return walletResult;
      }
      const credits =
        walletResult.data.freeCreditsRemaining + walletResult.data.balance;

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
   * Validates input and creates typed transaction metadata
   */
  async addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: "subscription" | "permanent" | "bonus",
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // Input validation
    if (amount <= 0) {
      return fail({
        message: "app.api.v1.core.credits.errors.invalidAmount",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: "app.api.v1.core.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      let walletResult: ResponseType<CreditWallet>;

      if (identifier.userId) {
        // Use shared wallet for authenticated users
        walletResult = await this.getOrCreateSharedWallet(
          identifier.userId,
          logger,
        );
      } else {
        // Check if this lead is linked to a user
        const [leadLink] = await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, identifier.leadId!))
          .limit(1);

        if (leadLink) {
          // Lead is linked to a user - use user's shared wallet
          logger.debug("Lead is linked to user, using shared wallet", {
            leadId: identifier.leadId,
            userId: leadLink.userId,
          });
          walletResult = await this.getOrCreateSharedWallet(
            leadLink.userId,
            logger,
          );
        } else {
          // Lead is not linked - use lead wallet
          walletResult = await this.getOrCreateLeadWallet(
            identifier.leadId!,
            logger,
          );
        }
      }

      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

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
          metadata: {},
        })
        .returning();

      // Update wallet balance
      const newBalance = wallet.balance + amount;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create transaction with typed metadata
      const transactionMetadata =
        packType === "subscription"
          ? {
              subscriptionId: `system_add_${Date.now()}`,
              periodStart: new Date().toISOString(),
              periodEnd: expiresAt?.toISOString(),
            }
          : { packQuantity: 1 };

      await db.insert(creditTransactions).values({
        walletId: wallet.id,
        amount,
        balanceAfter: newBalance,
        type:
          packType === "subscription"
            ? CreditTransactionType.SUBSCRIPTION
            : CreditTransactionType.PURCHASE,
        packId: newPack.id,
        metadata: transactionMetadata,
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
   * Optional sessionId for idempotency checking
   */
  async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
    sessionId?: string,
  ): Promise<ResponseType<void>> {
    try {
      // Use shared wallet for authenticated users
      const walletResult = await this.getOrCreateSharedWallet(userId, logger);
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

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

      // Create credit pack with optional session tracking for idempotency
      const [newPack] = await db
        .insert(creditPacks)
        .values({
          walletId: wallet.id,
          originalAmount: amount,
          remaining: amount,
          type: packType,
          expiresAt: finalExpiresAt,
          source: `${type}_purchase`,
          metadata: sessionId ? { sessionId } : {},
        })
        .returning();

      // Update wallet balance
      const newBalance = wallet.balance + amount;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create transaction with typed metadata
      const purchaseMetadata = sessionId
        ? { sessionId, packQuantity: 1, totalPaid: 0, currency: "USD" }
        : { packQuantity: 1 };

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
        metadata: purchaseMetadata,
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
   *
   * CRITICAL: Uses database transaction with row locking to prevent race conditions
   */
  async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // Input validation
    if (amount <= 0) {
      return fail({
        message: "app.api.v1.core.credits.errors.invalidAmount",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: "app.api.v1.core.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      // Get wallet outside transaction for monthly credit check
      let walletResult: ResponseType<CreditWallet>;
      if (identifier.userId) {
        // Use shared wallet for authenticated users
        walletResult = await this.getOrCreateSharedWallet(
          identifier.userId,
          logger,
        );
      } else {
        // Check if this lead is linked to a user
        const [leadLink] = await db
          .select()
          .from(userLeadLinks)
          .where(eq(userLeadLinks.leadId, identifier.leadId!))
          .limit(1);

        if (leadLink) {
          // Lead is linked to a user - use user's shared wallet
          logger.debug("Lead is linked to user, using shared wallet", {
            leadId: identifier.leadId,
            userId: leadLink.userId,
          });
          walletResult = await this.getOrCreateSharedWallet(
            leadLink.userId,
            logger,
          );
        } else {
          // Lead is not linked - use lead wallet
          walletResult = await this.getOrCreateLeadWallet(
            identifier.leadId!,
            logger,
          );
        }
      }

      if (!walletResult.success) {
        return walletResult;
      }

      // Ensure monthly credits are current (outside transaction - separate concern)
      let wallet = await this.ensureMonthlyFreeCredits(
        walletResult.data,
        logger,
      );

      // Execute deduction within a transaction for atomicity
      const result = await withTransaction(logger, async (tx) => {
        // Lock the wallet row to prevent concurrent modifications
        const [lockedWallet] = await tx
          .select()
          .from(creditWallets)
          .where(eq(creditWallets.id, wallet.id))
          .for("update");

        if (!lockedWallet) {
          return {
            success: false as const,
            error: "app.api.v1.core.credits.errors.walletNotFound" as const,
          };
        }

        let remaining = amount;
        let freeCreditsUsed = 0;
        let packCreditsUsed = 0;

        // 1. Deduct from free credits first
        if (lockedWallet.freeCreditsRemaining > 0 && remaining > 0) {
          const deduction = Math.min(
            lockedWallet.freeCreditsRemaining,
            remaining,
          );
          await tx
            .update(creditWallets)
            .set({
              freeCreditsRemaining:
                lockedWallet.freeCreditsRemaining - deduction,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, lockedWallet.id));
          remaining -= deduction;
          freeCreditsUsed = deduction;
        }

        // 2. Deduct from packs (expiring soonest first, NULLS LAST)
        if (remaining > 0) {
          const packs = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                eq(creditPacks.walletId, lockedWallet.id),
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
              await tx.delete(creditPacks).where(eq(creditPacks.id, pack.id));
            } else {
              await tx
                .update(creditPacks)
                .set({
                  remaining: pack.remaining - deduction,
                  updatedAt: new Date(),
                })
                .where(eq(creditPacks.id, pack.id));
            }

            remaining -= deduction;
            packCreditsUsed += deduction;
          }
        }

        if (remaining > 0) {
          // Insufficient credits - transaction will rollback
          return {
            success: false as const,
            error:
              "app.api.v1.core.credits.errors.insufficientCredits" as const,
          };
        }

        // Update wallet balance (only pack credits affect balance)
        const newBalance = lockedWallet.balance - packCreditsUsed;
        await tx
          .update(creditWallets)
          .set({ balance: Math.max(0, newBalance), updatedAt: new Date() })
          .where(eq(creditWallets.id, lockedWallet.id));

        // Create usage transaction with typed metadata
        const usageMetadata: UsageMetadata = {
          feature: "credit_usage",
          cost: amount,
          modelId,
          messageId,
          freeCreditsUsed,
          packCreditsUsed,
        };

        await tx.insert(creditTransactions).values({
          walletId: lockedWallet.id,
          amount: -amount,
          balanceAfter: Math.max(0, newBalance),
          type: CreditTransactionType.USAGE,
          modelId,
          messageId,
          metadata: usageMetadata,
        });

        return {
          success: true as const,
          newBalance: Math.max(0, newBalance),
          freeCreditsUsed,
          packCreditsUsed,
        };
      });

      if (!result.success) {
        return fail({
          message: result.error,
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      logger.debug("Credits deducted", {
        walletId: wallet.id,
        amount,
        newBalance: result.newBalance,
        freeCreditsUsed: result.freeCreditsUsed,
        packCreditsUsed: result.packCreditsUsed,
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
      // Use shared wallet for authenticated users
      const walletResult = await this.getOrCreateSharedWallet(userId, logger);
      if (!walletResult.success) {
        return walletResult;
      }

      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, walletResult.data.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, walletResult.data.id));

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
   * If lead is linked to a user, fetches from the user's shared wallet instead
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
      // Check if this lead is linked to a user
      const [leadLink] = await db
        .select()
        .from(userLeadLinks)
        .where(eq(userLeadLinks.leadId, leadId))
        .limit(1);

      if (leadLink) {
        // Lead is linked to a user - fetch from user's shared wallet
        logger.debug("Lead is linked to user, fetching from shared wallet", {
          leadId,
          userId: leadLink.userId,
        });
        return await this.getTransactions(
          leadLink.userId,
          limit,
          offset,
          logger,
        );
      }

      // Lead is not linked - fetch from lead wallet
      const walletResult = await this.getOrCreateLeadWallet(leadId, logger);
      if (!walletResult.success) {
        return walletResult;
      }

      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, walletResult.data.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, walletResult.data.id));

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
   * Each pack expiration is wrapped in a transaction for atomicity
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
        try {
          // Wrap each pack expiration in a transaction for atomicity
          await withTransaction(logger, async (tx) => {
            if (pack.remaining > 0) {
              // Get wallet to update balance (with row lock to prevent concurrent modifications)
              const [wallet] = await tx
                .select()
                .from(creditWallets)
                .where(eq(creditWallets.id, pack.walletId))
                .for("update")
                .limit(1);

              if (wallet) {
                const newBalance = wallet.balance - pack.remaining;

                // Update wallet balance
                await tx
                  .update(creditWallets)
                  .set({
                    balance: Math.max(0, newBalance),
                    updatedAt: new Date(),
                  })
                  .where(eq(creditWallets.id, wallet.id));

                // Create EXPIRY transaction (preserves history)
                await tx.insert(creditTransactions).values({
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
            await tx.delete(creditPacks).where(eq(creditPacks.id, pack.id));
          });

          expiredCount++;
        } catch (packError) {
          // Log individual pack failure but continue with other packs
          logger.error(
            "Failed to expire individual pack",
            parseError(packError),
            {
              packId: pack.id,
              walletId: pack.walletId,
            },
          );
        }
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
   * CRITICAL: Includes idempotency check to prevent duplicate credit additions
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

      // IDEMPOTENCY CHECK: Verify this session hasn't been processed already
      const [existingPack] = await db
        .select()
        .from(creditPacks)
        .where(sql`${creditPacks.metadata}->>'sessionId' = ${session.id}`)
        .limit(1);

      if (existingPack) {
        logger.info("Credit pack already processed for session", {
          sessionId: session.id,
          packId: existingPack.id,
          userId,
        });
        return; // Idempotent - already processed
      }

      const result = await this.addUserCredits(
        userId,
        totalCredits,
        "permanent",
        logger,
        undefined, // no expiration for permanent packs
        session.id, // sessionId for idempotency tracking
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
  async hasSufficientCredits(
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
  async deductCreditsWithValidation(
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
  generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

export const creditRepository = new CreditRepository();
