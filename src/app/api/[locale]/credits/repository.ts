/**
 * Credit Repository
 * Wallet-based credit system with lead-to-lead and lead-to-user linking
 *
 * CRITICAL ARCHITECTURE:
 *
 * 1. WALLET STRUCTURE:
 *    - Lead Wallets: Each lead has separate wallet with FREE credits (0-20 per pool)
 *    - User Wallets: Each user has separate wallet with PAID credits ONLY (no free credits)
 *    - Linked Leads: All leads linked to a user maintain separate wallets
 *
 * 2. FREE CREDIT POOL (20 credits shared):
 *    - All linked leads share ONE pool of max 20 free credits total
 *    - NOT 20 credits per lead - prevents gaming the system
 *    - Free credits stored in lead wallets only (never in user wallets)
 *    - Monthly renewal: entire pool resets to 20 total (not per lead)
 *
 * 3. WALLET LINKING:
 *    - Lead-to-lead: via leadLeadLinks table (track page, referrals)
 *    - Lead-to-user: via userLeadLinks table (signup, login)
 *    - When leads link: free credits redistribute across pool
 *    - When lead links to user: lead wallet keeps free credits, user wallet gets paid credits
 *
 * 4. BALANCE CALCULATION:
 *    - For Leads (not logged in): Sum all linked lead wallets (free + paid)
 *    - For Users (logged in): Sum all linked lead wallets + user wallet (free from leads + paid from user)
 *    - Spending priority: Free credits first, then paid credits
 *
 * 5. TRANSACTION HISTORY:
 *    - For Leads: Show own wallet transactions + aggregated usage from other linked leads
 *    - For Users: Show current lead + user wallet transactions + aggregated usage from other linked leads
 *
 * All transactions are immutable audit logs
 */

import {
  and,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  lt,
  not,
  or,
  sql,
} from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "@/app/api/[locale]/leads/db";
import { LeadSource, LeadStatus } from "@/app/api/[locale]/leads/enum";
import type { CreditPackCheckoutSession } from "@/app/api/[locale]/payment/providers/types";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { ProductIds,productsRepository } from "../products/repository-client";
import { withTransaction } from "../system/db/utils/repository-helpers";
import {
  creditPacks,
  creditTransactions,
  type CreditWallet,
  creditWallets,
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
 * Pool of wallets that share free credits
 */
export interface CreditPool {
  userWallet: CreditWallet | null;
  leadWallets: CreditWallet[];
  poolId: string;
  poolType: "USER_POOL" | "LEAD_POOL";
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
    locale: CountryLanguage,
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
    leadId: string,
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
   * Get pool for a user: user wallet + all linked lead wallets
   */
  async getUserPool(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    try {
      // Get user wallet
      const userWalletResult = await this.getOrCreateUserWallet(userId, logger);
      if (!userWalletResult.success) {
        return userWalletResult;
      }

      // Get all linked leads
      const linkedLeads = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, userId));

      const linkedLeadIds = linkedLeads.map((l) => l.leadId);

      const leadWallets =
        linkedLeadIds.length > 0
          ? await db
              .select()
              .from(creditWallets)
              .where(inArray(creditWallets.leadId, linkedLeadIds))
          : [];

      return success({
        userWallet: userWalletResult.data,
        leadWallets,
        poolId: userId,
        poolType: "USER_POOL",
      });
    } catch (error) {
      logger.error("Failed to get user pool", parseError(error));
      return fail({
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        message: "app.api.credits.errors.getBalanceFailed",
      });
    }
  }

  /**
   * Get pool for a lead: only lead wallets, no user wallet
   */
  async getLeadPoolOnly(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    try {
      const connectedLeadIds = await this.findConnectedLeads(leadId);

      let leadWallets = await db
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, connectedLeadIds));

      if (leadWallets.length === 0) {
        const walletResult = await this.getOrCreateLeadWallet(leadId, logger);
        if (!walletResult.success) {
          return walletResult;
        }
        leadWallets = [walletResult.data];
      }

      return success({
        userWallet: null,
        leadWallets,
        poolId: leadId,
        poolType: "LEAD_POOL",
      });
    } catch (error) {
      logger.error("Failed to get lead pool", parseError(error));
      return fail({
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        message: "app.api.credits.errors.getBalanceFailed",
      });
    }
  }

  /**
   * Get pool for a lead - uses graph traversal to find all connected leads
   * If lead is linked to a user, returns the full user pool (user wallet + lead wallets)
   * This is used for internal operations where we want full pool behavior
   * NEW ARCHITECTURE: Creates wallet for primary lead if needed, but not for connected leads
   */
  async getLeadPool(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    try {
      // Check if lead is linked to a user
      const [userLink] = await db
        .select()
        .from(userLeadLinks)
        .where(eq(userLeadLinks.leadId, leadId))
        .limit(1);

      if (userLink) {
        // Lead is linked to user -> return user's pool
        return this.getUserPool(userLink.userId, logger);
      }

      // Lead is not linked to user -> find lead-to-lead pool
      const connectedLeadIds = await this.findConnectedLeads(leadId);

      // Get EXISTING wallets for all connected leads
      let leadWallets = await db
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, connectedLeadIds));

      // If no wallets exist, create wallet for the PRIMARY lead only
      if (leadWallets.length === 0) {
        const walletResult = await this.getOrCreateLeadWallet(leadId, logger);
        if (!walletResult.success) {
          return walletResult;
        }
        leadWallets = [walletResult.data];
      }

      // NO LAZY CREATION for connected leads - they get wallets when accessed directly

      // Primary lead is the oldest
      const sortedWallets = leadWallets.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
      const primaryLead = sortedWallets[0];

      return success({
        userWallet: null,
        leadWallets,
        poolId: primaryLead?.leadId || leadId,
        poolType: "LEAD_POOL",
      });
    } catch (error) {
      logger.error("Failed to get lead pool", parseError(error));
      return fail({
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        message: "app.api.credits.errors.getBalanceFailed",
      });
    }
  }

  /**
   * Find all leads connected via lead_lead_links table using graph traversal
   */
  private async findConnectedLeads(startLeadId: string): Promise<string[]> {
    const visited = new Set<string>();
    const queue = [startLeadId];

    while (queue.length > 0) {
      const currentLeadId = queue.shift()!;

      if (visited.has(currentLeadId)) {
        continue;
      }
      visited.add(currentLeadId);

      // Find all links where current lead is either lead1 or lead2
      const links = await db
        .select()
        .from(leadLeadLinks)
        .where(
          or(
            eq(leadLeadLinks.leadId1, currentLeadId),
            eq(leadLeadLinks.leadId2, currentLeadId),
          ),
        );

      for (const link of links) {
        // Get the other lead in the link
        const otherLeadId =
          link.leadId1 === currentLeadId ? link.leadId2 : link.leadId1;
        if (!visited.has(otherLeadId)) {
          queue.push(otherLeadId);
        }
      }
    }

    return [...visited];
  }

  /**
   * Calculate balance across all wallets in pool
   * Enforces pool limit: max 20 free credits available per period
   * Refetches wallets to get current balances after any deductions
   */
  private async calculatePoolBalance(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<CreditBalance> {
    // Refetch all wallets to get current balances
    const walletIds = [
      pool.userWallet?.id,
      ...pool.leadWallets.map((w) => w.id),
    ].filter((id): id is string => id !== undefined);

    const currentWallets =
      walletIds.length > 0
        ? await db
            .select()
            .from(creditWallets)
            .where(inArray(creditWallets.id, walletIds))
        : [];

    let totalFreeInWallets = 0;
    let totalPaid = 0;
    let totalExpiring = 0;
    let totalPermanent = 0;
    let earliestExpiry: Date | null = null;

    const now = new Date();

    for (const wallet of currentWallets) {
      if (wallet.leadId !== null) {
        totalFreeInWallets += wallet.freeCreditsRemaining;
      }

      totalPaid += wallet.balance;

      const packs = await db
        .select()
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.walletId, wallet.id),
            or(isNull(creditPacks.expiresAt), gte(creditPacks.expiresAt, now)),
          ),
        );

      for (const pack of packs) {
        if (pack.type === "subscription" && pack.expiresAt) {
          totalExpiring += pack.remaining;
          if (!earliestExpiry || pack.expiresAt < earliestExpiry) {
            earliestExpiry = pack.expiresAt;
          }
        } else {
          totalPermanent += pack.remaining;
        }
      }
    }

    // Calculate how many free credits have been spent this period
    // Use the ACTUAL period ID from CURRENT wallets (not stale pool data)
    const leadWallets = currentWallets.filter((w) => w.leadId !== null);
    let freeCreditsSpentThisPeriod = 0;

    if (leadWallets.length > 0) {
      // Get the period ID from the most recently reset wallet
      const activePeriodId = leadWallets.reduce((newest, current) =>
        current.freePeriodStart > newest.freePeriodStart ? current : newest,
      ).freePeriodId;

      const leadWalletIds = leadWallets.map((w) => w.id);
      const usageTransactions = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, leadWalletIds),
            eq(creditTransactions.freePeriodId, activePeriodId),
            eq(creditTransactions.type, CreditTransactionType.USAGE),
          ),
        );

      freeCreditsSpentThisPeriod = usageTransactions.reduce((sum, t) => {
        const metadata = t.metadata as { freeCreditsUsed?: number } | null;
        return sum + (metadata?.freeCreditsUsed || 0);
      }, 0);
    }

    // Enforce pool limit: max 20 free credits can be spent per period
    const maxFreeCreditsPerPool = 20;
    const freeCreditsAvailable = Math.max(
      0,
      Math.min(
        totalFreeInWallets,
        maxFreeCreditsPerPool - freeCreditsSpentThisPeriod,
      ),
    );

    const activePeriodId =
      leadWallets.length > 0
        ? leadWallets.reduce((newest, current) =>
            current.freePeriodStart > newest.freePeriodStart ? current : newest,
          ).freePeriodId
        : null;

    logger.debug("Pool balance calculation", {
      totalFreeInWallets,
      freeCreditsSpentThisPeriod,
      freeCreditsAvailable,
      totalPaid,
      leadWalletCount: leadWallets.length,
      activePeriodId,
    });

    return {
      total: freeCreditsAvailable + totalPaid,
      free: freeCreditsAvailable,
      expiring: totalExpiring,
      permanent: totalPermanent,
      expiresAt: earliestExpiry?.toISOString() || null,
    };
  }

  /**
   * Get or create wallet for a user
   * Per spec: User wallet gets created with 0 free credits (not 20)
   * Free credits come from lead wallets during redistribution
   * ATOMIC: Wallet creation wrapped in database transaction
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
      // CRITICAL: Enforce that user wallets NEVER have free credits
      // If existing wallet has free credits, reset to 0 (data migration/fix)
      if (existingWallet.freeCreditsRemaining > 0) {
        logger.warn("User wallet has free credits - resetting to 0", {
          userId,
          walletId: existingWallet.id,
          freeCreditsRemaining: existingWallet.freeCreditsRemaining,
        });
        const [updated] = await db
          .update(creditWallets)
          .set({ freeCreditsRemaining: 0 })
          .where(eq(creditWallets.id, existingWallet.id))
          .returning();

        if (updated) {
          return success(updated);
        }
      }

      // Backfill freePeriodId if it's null (for existing wallets)
      if (!existingWallet.freePeriodId && existingWallet.freePeriodStart) {
        const periodId = `${existingWallet.freePeriodStart.getFullYear()}-${String(existingWallet.freePeriodStart.getMonth() + 1).padStart(2, "0")}`;
        const [updated] = await db
          .update(creditWallets)
          .set({ freePeriodId: periodId })
          .where(eq(creditWallets.id, existingWallet.id))
          .returning();

        if (updated) {
          logger.debug("Backfilled freePeriodId for user wallet", {
            walletId: existingWallet.id,
            periodId,
          });
          return success(updated);
        }
      }
      return success(existingWallet);
    }

    // Create new wallet for user with 0 free credits (per spec)
    // No FREE_GRANT transaction - user gets 0 initial free credits
    const initialCredits = 0;
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    try {
      const newWallet = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .insert(creditWallets)
          .values({
            userId,
            balance: 0,
            freeCreditsRemaining: initialCredits,
            freePeriodStart: now,
            freePeriodId: periodId,
          })
          .onConflictDoNothing() // Handle race condition
          .returning();

        if (wallet) {
          // CRITICAL: User wallets ALWAYS have 0 free credits
          // Free credits can ONLY exist in lead wallets
          // User wallets contain ONLY paid credits from purchases

          logger.info("Created new user wallet", {
            userId,
            walletId: wallet.id,
            initialCredits: 0,
            periodId,
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
        message: "app.api.credits.errors.walletCreationFailed",
      });
    }

    return success(wallet);
  }

  /**
   * Get or create wallet for a lead
   * ATOMIC: Wallet creation and FREE_GRANT transaction are wrapped in database transaction
   * NEW ARCHITECTURE: Always grants 20 free credits when creating new lead wallet
   *
   * @param leadId - The lead ID to get/create wallet for
   * @param logger - Logger instance
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
      // Backfill freePeriodId if it's null (for existing wallets)
      if (!existingWallet.freePeriodId && existingWallet.freePeriodStart) {
        const periodId = `${existingWallet.freePeriodStart.getFullYear()}-${String(existingWallet.freePeriodStart.getMonth() + 1).padStart(2, "0")}`;
        const [updated] = await db
          .update(creditWallets)
          .set({ freePeriodId: periodId })
          .where(eq(creditWallets.id, existingWallet.id))
          .returning();

        if (updated) {
          logger.debug("Backfilled freePeriodId for lead wallet", {
            walletId: existingWallet.id,
            periodId,
          });
          return success(updated);
        }
      }
      return success(existingWallet);
    }

    // Create new wallet for lead - ATOMIC operation
    // Always grant 20 free credits for new lead wallets
    const initialCredits = this.getInitialFreeCredits();
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    try {
      const newWallet = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .insert(creditWallets)
          .values({
            leadId,
            balance: 0,
            freeCreditsRemaining: initialCredits,
            freePeriodStart: now,
            freePeriodId: periodId,
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
            freePeriodId: periodId,
            metadata: {
              reason: "initial_grant",
              freeCreditsRemaining: initialCredits,
            },
          });

          logger.info("Created new lead wallet", {
            leadId,
            walletId: wallet.id,
            initialCredits,
            periodId,
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
        message: "app.api.credits.errors.walletCreationFailed",
      });
    }

    return success(wallet);
  }

  /**
   * Check and reset monthly free credits for entire pool (pool-aware)
   * Per spec: "When any wallet in pool hits new month: Reset entire pool to 20 total free credits"
   *
   * CRITICAL: Only reset when moving to a NEW period (future month), not when syncing old periods
   * This prevents resetting credits that were already spent in the current period
   */
  private async ensureMonthlyFreeCreditsForPool(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<void> {
    const now = new Date();
    const currentPeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const allWallets = [pool.userWallet, ...pool.leadWallets].filter(
      (w): w is CreditWallet => w !== null,
    );

    if (allWallets.length === 0) {
      return;
    }

    // Find the wallet with the most recent reset (newest freePeriodStart)
    const mostRecentlyResetWallet = allWallets.reduce((newest, current) =>
      current.freePeriodStart > newest.freePeriodStart ? current : newest,
    );

    // Check if the most recent reset was in a PREVIOUS calendar month
    const lastResetDate = new Date(mostRecentlyResetWallet.freePeriodStart);
    const lastResetMonth = lastResetDate.getMonth();
    const lastResetYear = lastResetDate.getFullYear();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const isNewMonth =
      currentYear > lastResetYear ||
      (currentYear === lastResetYear && currentMonth > lastResetMonth);

    if (!isNewMonth) {
      // Still in same month - no reset needed
      // Do NOT update freePeriodId - it must stay consistent with existing transactions
      return;
    }

    logger.info("Pool needs monthly free credits reset", {
      poolId: pool.poolId,
      currentPeriodId,
      lastResetDate: lastResetDate.toISOString(),
      daysSinceLastReset: Math.floor(
        (now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
      walletCount: allWallets.length,
    });

    // CRITICAL: Free credits can ONLY exist in lead wallets, NEVER in user wallets
    const leadWallets = allWallets.filter((w) => w.leadId !== null);
    if (leadWallets.length === 0) {
      // No lead wallets - this shouldn't happen, but handle gracefully
      logger.warn("No lead wallets found in pool during monthly reset", {
        poolId: pool.poolId,
        poolType: pool.poolType,
      });
      return;
    }

    const totalFreeCreditsInPool = leadWallets.reduce(
      (sum, w) => sum + w.freeCreditsRemaining,
      0,
    );

    const maxFreeCreditsPerPool = productsRepository.getProduct(
      ProductIds.FREE_TIER,
      "en-GLOBAL",
    ).credits;
    const oldestLeadWallet = leadWallets.reduce((oldest, current) =>
      current.freePeriodStart < oldest.freePeriodStart ? current : oldest,
    );

    await withTransaction(logger, async (tx) => {
      for (const wallet of allWallets) {
        await tx
          .update(creditWallets)
          .set({
            freePeriodStart: now,
            freePeriodId: currentPeriodId,
            updatedAt: now,
          })
          .where(eq(creditWallets.id, wallet.id));
      }

      if (totalFreeCreditsInPool < maxFreeCreditsPerPool) {
        const creditsToAdd = maxFreeCreditsPerPool - totalFreeCreditsInPool;

        await tx
          .update(creditWallets)
          .set({
            freeCreditsRemaining:
              oldestLeadWallet.freeCreditsRemaining + creditsToAdd,
            updatedAt: now,
          })
          .where(eq(creditWallets.id, oldestLeadWallet.id));

        // Create FREE_GRANT transaction
        await tx.insert(creditTransactions).values({
          walletId: oldestLeadWallet.id,
          amount: creditsToAdd,
          balanceAfter: oldestLeadWallet.balance,
          type: CreditTransactionType.FREE_GRANT,
          freePeriodId: currentPeriodId,
          metadata: {
            reason: "monthly_reset",
            freeCreditsRemaining:
              oldestLeadWallet.freeCreditsRemaining + creditsToAdd,
            totalPoolFreeCredits: maxFreeCreditsPerPool,
          },
        });

        logger.info("Pool monthly free credits reset complete", {
          poolId: pool.poolId,
          oldestWalletId: oldestLeadWallet.id,
          totalWallets: allWallets.length,
          creditsAdded: creditsToAdd,
          totalFreeCreditsAfter: maxFreeCreditsPerPool,
        });
      } else {
        logger.info("Pool monthly period updated (no credits added)", {
          poolId: pool.poolId,
          totalWallets: allWallets.length,
          totalFreeCreditsInPool,
          maxAllowed: maxFreeCreditsPerPool,
        });
      }
    });
  }

  /**
   * Get balance for identifier
   */
  async getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      let poolResult: ResponseType<CreditPool>;

      if (identifier.userId) {
        poolResult = await this.getUserPool(identifier.userId, logger);
      } else if (identifier.leadId) {
        poolResult = await this.getLeadPool(identifier.leadId, logger);
      } else {
        return fail({
          message: "app.api.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const balance = await this.calculatePoolBalance(poolResult.data, logger);
      return success(balance);
    } catch (error) {
      logger.error("Failed to get balance", parseError(error), {
        ...identifier,
      });
      return fail({
        message: "app.api.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get lead's credit balance (pool-based)
   * Sums all wallets in the lead's pool
   */
  async getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      // Get pool for this lead
      const poolResult = await this.getLeadPool(leadId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // Check and reset monthly free credits for entire pool if needed
      await this.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Calculate balance across all wallets in pool
      const balance = await this.calculatePoolBalance(pool, logger);
      return success(balance.total);
    } catch (error) {
      logger.error("Failed to get lead balance", parseError(error), { leadId });
      return fail({
        message: "app.api.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get credit balance for user by summing all wallets in their pool
   */
  async getCreditBalanceForUser(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      logger.debug("Getting credit balance", { userId: user.id, locale });
      let poolResult: ResponseType<CreditPool>;
      if (user.isPublic) {
        poolResult = await this.getLeadPoolOnly(user.leadId, logger);
      } else {
        poolResult = await this.getUserPool(user.id, logger);
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      logger.debug("Got pool for balance calculation", {
        poolId: pool.poolId,
        poolType: pool.poolType,
        leadWalletCount: pool.leadWallets.length,
        leadWalletIds: pool.leadWallets.map((w) => w.id),
        userWalletId: pool.userWallet?.id,
      });

      // Check and reset monthly free credits for entire pool if needed
      await this.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Calculate balance across all wallets in pool
      const balance = await this.calculatePoolBalance(pool, logger);

      logger.debug("Calculated balance", {
        total: balance.total,
        free: balance.free,
        expiring: balance.expiring,
        permanent: balance.permanent,
      });

      return success(balance);
    } catch (error) {
      logger.error("Failed to get user balance", parseError(error), {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
      });
      return fail({
        message: "app.api.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get or create lead by IP address
   * Pool-based: Returns total credits across lead's pool
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
        // Get pool for this lead
        const poolResult = await this.getLeadPool(existingLead.id, logger);
        if (!poolResult.success) {
          return poolResult;
        }

        // Ensure monthly credits are current for pool
        await this.ensureMonthlyFreeCreditsForPool(poolResult.data, logger);

        // Calculate total credits across pool
        const balance = await this.calculatePoolBalance(
          poolResult.data,
          logger,
        );

        return success({
          leadId: existingLead.id,
          credits: balance.total,
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

      // New lead has just one wallet, so credits = wallet balance
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
        message: "app.api.credits.errors.getOrCreateLeadFailed",
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
        message: "app.api.credits.errors.invalidAmount",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: "app.api.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      let walletResult: ResponseType<CreditWallet>;

      if (identifier.userId) {
        // Add to user wallet (credits are pooled across user + linked leads)
        walletResult = await this.getOrCreateUserWallet(
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
          // Lead is linked to a user - add to user wallet
          logger.debug("Lead is linked to user, adding to user wallet", {
            leadId: identifier.leadId,
            userId: leadLink.userId,
          });
          walletResult = await this.getOrCreateUserWallet(
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
        freePeriodId: wallet.freePeriodId,
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
        message: "app.api.credits.errors.addCreditsFailed",
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
      // Add to user wallet (credits are pooled across user + linked leads)
      const walletResult = await this.getOrCreateUserWallet(userId, logger);
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
        freePeriodId: wallet.freePeriodId,
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
        message: "app.api.credits.errors.addCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits with priority: free credits → expiring paid credits → permanent paid credits
   * Max 20 free credits can be spent per pool per period
   * Uses database transaction with row locking to prevent race conditions
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
        message: "app.api.credits.errors.invalidAmount",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: "app.api.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      // Get pool for this identifier
      let poolResult: ResponseType<CreditPool>;
      let currentLeadId: string | undefined;

      if (identifier.userId) {
        poolResult = await this.getUserPool(identifier.userId, logger);
        // For authenticated users, we need to know which lead is current
        // Get the leadId from identifier or fetch primary lead
        currentLeadId = identifier.leadId;
        if (!currentLeadId) {
          const [userLeadLink] = await db
            .select({ leadId: userLeadLinks.leadId })
            .from(userLeadLinks)
            .where(eq(userLeadLinks.userId, identifier.userId))
            .limit(1);
          currentLeadId = userLeadLink?.leadId;
        }
      } else {
        poolResult = await this.getLeadPool(identifier.leadId!, logger);
        currentLeadId = identifier.leadId;
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // Ensure monthly credits are current for ENTIRE pool (pool-aware reset)
      await this.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Determine which wallets to deduct from based on user type
      let walletsForDeduction: CreditWallet[];

      if (identifier.userId && pool.userWallet) {
        // Authenticated user: ALL lead wallets in pool (free credits are shared) + user wallet
        walletsForDeduction = [...pool.leadWallets, pool.userWallet];
      } else {
        // Public user: only lead wallets (no paid credits)
        walletsForDeduction = pool.leadWallets;
      }

      // Execute deduction within a transaction for atomicity
      const result = await withTransaction(logger, async (tx) => {
        let remaining = amount;

        // Enforce pool limit: max 20 free credits can be spent per period
        const now = new Date();
        const currentPeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const leadWalletIds = pool.leadWallets.map((w) => w.id);
        if (leadWalletIds.length > 0) {
          const usageTransactions = await tx
            .select()
            .from(creditTransactions)
            .where(
              and(
                inArray(creditTransactions.walletId, leadWalletIds),
                eq(creditTransactions.freePeriodId, currentPeriodId),
                eq(creditTransactions.type, CreditTransactionType.USAGE),
              ),
            );

          const freeCreditsSpentThisPeriod = usageTransactions.reduce(
            (sum, t) => {
              const metadata = t.metadata as {
                freeCreditsUsed?: number;
              } | null;
              return sum + (metadata?.freeCreditsUsed || 0);
            },
            0,
          );

          const maxFreeCreditsPerPool = 20;
          const freeCreditsAvailableInPool = Math.max(
            0,
            maxFreeCreditsPerPool - freeCreditsSpentThisPeriod,
          );

          logger.debug("Pool free credit limit check", {
            poolId: pool.poolId,
            currentPeriodId,
            freeCreditsSpentThisPeriod,
            freeCreditsAvailableInPool,
            requestedAmount: amount,
          });

          let freeCreditsToDeduct = Math.min(
            remaining,
            freeCreditsAvailableInPool,
          );

          for (const wallet of walletsForDeduction) {
            if (freeCreditsToDeduct <= 0) {
              break;
            }

            // Only deduct free credits from lead wallets (not user wallets)
            if (wallet.userId) {
              continue;
            }

            const [lockedWallet] = await tx
              .select()
              .from(creditWallets)
              .where(eq(creditWallets.id, wallet.id))
              .for("update");

            if (!lockedWallet || lockedWallet.freeCreditsRemaining <= 0) {
              continue;
            }

            const deduction = Math.min(
              lockedWallet.freeCreditsRemaining,
              freeCreditsToDeduct,
            );
            await tx
              .update(creditWallets)
              .set({
                freeCreditsRemaining:
                  lockedWallet.freeCreditsRemaining - deduction,
                updatedAt: new Date(),
              })
              .where(eq(creditWallets.id, lockedWallet.id));

            // Record transaction
            await tx.insert(creditTransactions).values({
              walletId: lockedWallet.id,
              amount: -deduction,
              balanceAfter: lockedWallet.balance,
              type: CreditTransactionType.USAGE,
              modelId,
              messageId,
              freePeriodId: lockedWallet.freePeriodId,
              metadata: {
                feature: "credit_usage",
                cost: amount,
                modelId,
                messageId,
                freeCreditsUsed: deduction,
                packCreditsUsed: 0,
              },
            });

            remaining -= deduction;
            freeCreditsToDeduct -= deduction;
          }
        }

        if (remaining > 0 && pool.userWallet) {
          const walletIds = [pool.userWallet.id];
          const expiringPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, walletIds),
                not(isNull(creditPacks.expiresAt)),
                gte(creditPacks.expiresAt, new Date()),
              ),
            )
            .orderBy(sql`${creditPacks.expiresAt} ASC`);

          for (const pack of expiringPacks) {
            if (remaining <= 0) {
              break;
            }

            const deduction = Math.min(pack.remaining, remaining);

            if (deduction === pack.remaining) {
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

            // Update wallet balance
            await tx
              .update(creditWallets)
              .set({
                balance: sql`${creditWallets.balance} - ${deduction}`,
                updatedAt: new Date(),
              })
              .where(eq(creditWallets.id, pack.walletId));

            // Get updated balance for transaction record
            const [updatedWallet] = await tx
              .select({ balance: creditWallets.balance })
              .from(creditWallets)
              .where(eq(creditWallets.id, pack.walletId));

            // Get wallet's freePeriodId for transaction
            const [walletInfo] = await tx
              .select({ freePeriodId: creditWallets.freePeriodId })
              .from(creditWallets)
              .where(eq(creditWallets.id, pack.walletId));

            // Record transaction
            await tx.insert(creditTransactions).values({
              walletId: pack.walletId,
              amount: -deduction,
              balanceAfter: updatedWallet?.balance || 0,
              type: CreditTransactionType.USAGE,
              modelId,
              messageId,
              packId: pack.id,
              freePeriodId: walletInfo?.freePeriodId || null,
              metadata: {
                feature: "credit_usage",
                cost: amount,
                modelId,
                messageId,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            remaining -= deduction;
          }
        }

        if (remaining > 0 && pool.userWallet) {
          const walletIds = [pool.userWallet.id];
          const permanentPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, walletIds),
                isNull(creditPacks.expiresAt),
              ),
            )
            .orderBy(desc(creditPacks.createdAt));

          for (const pack of permanentPacks) {
            if (remaining <= 0) {
              break;
            }

            const deduction = Math.min(pack.remaining, remaining);

            if (deduction === pack.remaining) {
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

            // Update wallet balance
            await tx
              .update(creditWallets)
              .set({
                balance: sql`${creditWallets.balance} - ${deduction}`,
                updatedAt: new Date(),
              })
              .where(eq(creditWallets.id, pack.walletId));

            // Get updated balance for transaction record
            const [updatedWallet] = await tx
              .select({ balance: creditWallets.balance })
              .from(creditWallets)
              .where(eq(creditWallets.id, pack.walletId));

            // Get wallet's freePeriodId for transaction
            const [walletInfo] = await tx
              .select({ freePeriodId: creditWallets.freePeriodId })
              .from(creditWallets)
              .where(eq(creditWallets.id, pack.walletId));

            // Record transaction
            await tx.insert(creditTransactions).values({
              walletId: pack.walletId,
              amount: -deduction,
              balanceAfter: updatedWallet?.balance || 0,
              type: CreditTransactionType.USAGE,
              modelId,
              messageId,
              packId: pack.id,
              freePeriodId: walletInfo?.freePeriodId || null,
              metadata: {
                feature: "credit_usage",
                cost: amount,
                modelId,
                messageId,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            remaining -= deduction;
          }
        }

        if (remaining > 0) {
          return {
            success: false as const,
            error: "app.api.credits.errors.insufficientCredits" as const,
          };
        }

        return { success: true as const };
      });

      if (!result.success) {
        return fail({
          message: result.error,
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      logger.debug("Credits deducted from pool", {
        poolId: pool.poolId,
        poolType: pool.poolType,
        amount,
        walletCount: walletsForDeduction.length,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to deduct credits", parseError(error), {
        ...identifier,
        amount,
      });
      return fail({
        message: "app.api.credits.errors.deductCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transaction history for authenticated user
   *
   * Shows:
   * - Current lead's transactions (including FREE_GRANT)
   * - User wallet's paid transactions
   * - Aggregated usage from other linked leads (summed as "usage from other devices")
   */
  async getTransactions(
    userId: string,
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
      // Get user pool
      const poolResult = await this.getUserPool(userId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;
      if (!pool.userWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Find current lead's wallet
      const currentLeadWallet = pool.leadWallets.find(
        (w) => w.leadId === leadId,
      );
      if (!currentLeadWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Get current period
      const now = new Date();
      const currentPeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Fetch transactions from current lead wallet AND user wallet
      const walletIds = [currentLeadWallet.id, pool.userWallet.id];
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(inArray(creditTransactions.walletId, walletIds))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(inArray(creditTransactions.walletId, walletIds));

      // Calculate spending from OTHER linked leads (not current lead)
      let otherLeadsSpending = 0;
      for (const leadWallet of pool.leadWallets) {
        if (leadWallet.id === currentLeadWallet.id) {
          continue; // Skip current lead
        }

        const leadTransactions = await db
          .select()
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.walletId, leadWallet.id),
              eq(creditTransactions.freePeriodId, currentPeriodId),
              lt(creditTransactions.amount, 0), // Only spending (negative amounts)
            ),
          );

        const leadSpending = leadTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
        otherLeadsSpending += Math.min(leadSpending, 20); // Cap at 20 per lead
      }

      const result: CreditTransactionOutput[] = transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        type: t.type,
        modelId: t.modelId,
        messageId: t.messageId,
        createdAt: t.createdAt.toISOString(),
      }));

      // Add summary entry for other leads' spending if > 0
      if (otherLeadsSpending > 0 && offset === 0) {
        result.unshift({
          id: "other-devices-summary",
          amount: -otherLeadsSpending,
          balanceAfter: pool.userWallet.balance,
          type: CreditTransactionType.OTHER_DEVICES,
          modelId: null,
          messageId: null,
          createdAt: new Date().toISOString(),
        });
      }

      return success({
        transactions: result,
        totalCount: count + (otherLeadsSpending > 0 ? 1 : 0),
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { userId });
      return fail({
        message: "app.api.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transactions by lead ID
   * Shows only current lead wallet's transactions + summary of other devices' spending
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
      // Get lead pool (lead wallets only, no user wallet)
      const poolResult = await this.getLeadPoolOnly(leadId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;
      const allWallets = [pool.userWallet, ...pool.leadWallets].filter(
        (w): w is CreditWallet => w !== null,
      );

      // Find current lead's wallet
      const currentWallet = allWallets.find((w) => w.leadId === leadId);
      if (!currentWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Get current period
      const now = new Date();
      const currentPeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Fetch transactions from ONLY current wallet
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, currentWallet.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, currentWallet.id));

      // Calculate total spending from other linked lead wallets in current period
      const otherWallets = allWallets.filter((w) => w.id !== currentWallet.id);
      let otherDevicesSpending = 0;

      if (otherWallets.length > 0) {
        const otherWalletIds = otherWallets.map((w) => w.id);
        const otherTransactions = await db
          .select()
          .from(creditTransactions)
          .where(
            and(
              inArray(creditTransactions.walletId, otherWalletIds),
              eq(creditTransactions.freePeriodId, currentPeriodId),
              eq(creditTransactions.type, CreditTransactionType.USAGE),
            ),
          );

        otherDevicesSpending = otherTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
      }

      const result: CreditTransactionOutput[] = transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        type: t.type,
        modelId: t.modelId,
        messageId: t.messageId,
        createdAt: t.createdAt.toISOString(),
      }));

      // Add summary entry for other devices' spending if > 0
      if (otherDevicesSpending > 0 && offset === 0) {
        result.unshift({
          id: "other-devices-summary",
          amount: -otherDevicesSpending,
          balanceAfter: currentWallet.balance,
          type: "app.api.credits.enums.transactionType.otherDevices",
          modelId: null,
          messageId: null,
          createdAt: new Date().toISOString(),
        });
      }

      return success({
        transactions: result,
        totalCount: count + (otherDevicesSpending > 0 ? 1 : 0),
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { leadId });
      return fail({
        message: "app.api.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transactions by user ID
   * Shows user wallet's transactions + summary of linked leads' spending
   */
  async getTransactionsByUserId(
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
      // Get user pool (user wallet + all linked lead wallets)
      const poolResult = await this.getUserPool(userId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;
      if (!pool.userWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Get current period
      const now = new Date();
      const currentPeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Fetch transactions from user wallet
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, pool.userWallet.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, pool.userWallet.id));

      // Calculate total spending from linked lead wallets in current period
      let linkedLeadsSpending = 0;

      if (pool.leadWallets.length > 0) {
        const leadWalletIds = pool.leadWallets.map((w) => w.id);
        const leadTransactions = await db
          .select()
          .from(creditTransactions)
          .where(
            and(
              inArray(creditTransactions.walletId, leadWalletIds),
              eq(creditTransactions.freePeriodId, currentPeriodId),
              eq(creditTransactions.type, CreditTransactionType.USAGE),
            ),
          );

        linkedLeadsSpending = leadTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
      }

      const result: CreditTransactionOutput[] = transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        type: t.type,
        modelId: t.modelId,
        messageId: t.messageId,
        createdAt: t.createdAt.toISOString(),
      }));

      // Add summary entry for linked leads' spending if > 0
      if (linkedLeadsSpending > 0 && offset === 0) {
        result.unshift({
          id: "linked-leads-summary",
          amount: -linkedLeadsSpending,
          balanceAfter: pool.userWallet.balance,
          type: CreditTransactionType.OTHER_DEVICES,
          modelId: null,
          messageId: null,
          createdAt: new Date().toISOString(),
        });
      }

      return success({
        transactions: result,
        totalCount: count + (linkedLeadsSpending > 0 ? 1 : 0),
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { userId });
      return fail({
        message: "app.api.credits.errors.getTransactionsFailed",
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
                  freePeriodId: wallet.freePeriodId,
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
        message: "app.api.credits.errors.expireCreditsFailed",
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
        message: "app.api.credits.errors.getCreditIdentifierFailed",
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
        // Public user: only leadId
        identifier = { leadId: user.leadId };
      } else if (user.id) {
        // Authenticated user: userId + leadId (for current lead's free credits)
        identifier = { userId: user.id, leadId: user.leadId };
      } else if (user.leadId) {
        // Fallback: leadId only
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
   * Link lead wallets to user during signup/login
   * NEW ARCHITECTURE: No credit redistribution - wallets stay separate
   * Each wallet keeps its own balance, pool limit enforced at deduction time
   */
  async mergePendingLeadWallets(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Linking lead wallets to user during signup/login", {
        userId,
        leadIds,
      });

      // Get user pool (this will create user wallet if it doesn't exist)
      const poolResult = await this.getUserPool(userId, logger);
      if (!poolResult.success) {
        logger.error("Failed to get user pool during signup", {
          userId,
          error: poolResult.message,
        });
        return poolResult;
      }

      // NO REDISTRIBUTION - wallets stay separate with their own balances
      // Pool limit (max 20 free credits) enforced at DEDUCTION time, not here

      logger.info("Lead wallets linked to user pool", {
        userId,
        poolLeadCount: poolResult.data.leadWallets.length,
        leadWalletIds: poolResult.data.leadWallets.map((w) => w.id),
      });

      return success(undefined);
    } catch (error) {
      logger.error(
        "Failed to link lead wallets during signup",
        parseError(error),
        {
          userId,
          leadIds,
        },
      );
      return fail({
        message: "app.api.credits.errors.mergeLeadWalletsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Pool-based architecture: No orphaned wallets exist
   * All wallets remain active in their pools
   * Credits are automatically redistributed during signup/login
   */
  async cleanupOrphanedLeadWallets(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.info("Pool-based credits: No orphaned wallets to clean up");
    return success(0);
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
        error: "app.api.credits.errors.missingIdentifier",
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
        error: "app.api.credits.errors.insufficientCredits",
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
        error: "app.api.credits.errors.deductionFailed",
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
