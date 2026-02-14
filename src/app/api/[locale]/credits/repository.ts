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
import { simpleT } from "@/i18n/core/shared";

import { getModelById, type ModelId } from "../agent/models/models";
import sttDefinition from "../agent/speech-to-text/definition";
import ttsDefinition from "../agent/text-to-speech/definition";
import { ProductIds, productsRepository } from "../products/repository-client";
import { payoutRequests } from "../referral/db";
import { PayoutStatus } from "../referral/enum";
import { withTransaction } from "../system/db/utils/repository-helpers";
import {
  creditPacks,
  creditTransactions,
  type CreditWallet,
  creditWallets,
} from "./db";
import type { CreditsGetResponseOutput } from "./definition";
import {
  CreditPackType,
  type CreditPackTypeValue,
  CreditTransactionType,
  CreditTypeIdentifier,
  type CreditTypeIdentifierValue,
} from "./enum";
import type {
  CreditsHistoryGetRequestOutput,
  CreditsHistoryGetResponseOutput,
} from "./history/definition";

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
  type: string;
  messageId: string | null;
  createdAt: string;
}

/**
 * Credit Repository Interface
 */

/**
 * Credit Repository Implementation
 * Uses simplified wallet-based architecture
 */
export class CreditRepository {
  /**
   * Initial free credits for new wallets
   * Uses the FREE_TIER product definition as single source of truth
   */
  private static getInitialFreeCredits(): number {
    return productsRepository.getProduct(ProductIds.FREE_TIER, "en-GLOBAL")
      .credits;
  }

  /**
   * Get pool for a user: user wallet + all linked lead wallets
   */
  static async getUserPool(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    try {
      // Get user wallet
      const userWalletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
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
  static async getLeadPoolOnly(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    try {
      const connectedLeadIds =
        await CreditRepository.findConnectedLeads(leadId);

      let leadWallets = await db
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, connectedLeadIds));

      if (leadWallets.length === 0) {
        const walletResult = await CreditRepository.getOrCreateLeadWallet(
          leadId,
          logger,
        );
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
  static async getLeadPool(
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
        return CreditRepository.getUserPool(userLink.userId, logger);
      }

      // Lead is not linked to user -> find lead-to-lead pool
      const connectedLeadIds =
        await CreditRepository.findConnectedLeads(leadId);

      // Get EXISTING wallets for all connected leads
      let leadWallets = await db
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, connectedLeadIds));

      // If no wallets exist, create wallet for the PRIMARY lead only
      if (leadWallets.length === 0) {
        const walletResult = await CreditRepository.getOrCreateLeadWallet(
          leadId,
          logger,
        );
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
  private static async findConnectedLeads(
    startLeadId: string,
  ): Promise<string[]> {
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
   * Expire all expired credit packs for given wallet IDs
   * Called automatically before balance calculations
   */
  private static async expireExpiredCreditsForWallets(
    walletIds: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    if (walletIds.length === 0) {
      return;
    }

    const now = new Date();

    // Find all expired packs across these wallets
    const expiredPacks = await db
      .select()
      .from(creditPacks)
      .where(
        and(
          inArray(creditPacks.walletId, walletIds),
          eq(creditPacks.type, CreditPackType.SUBSCRIPTION),
          not(isNull(creditPacks.expiresAt)),
          lt(creditPacks.expiresAt, now),
          not(eq(creditPacks.remaining, 0)), // Only expire packs with remaining credits
        ),
      );

    if (expiredPacks.length === 0) {
      return;
    }

    logger.info("Auto-expiring credits", {
      packCount: expiredPacks.length,
      totalCredits: expiredPacks.reduce((sum, p) => sum + p.remaining, 0),
    });

    // Expire each pack in a transaction
    for (const pack of expiredPacks) {
      try {
        await withTransaction(logger, async (tx) => {
          // Re-read pack with lock to prevent race conditions
          const [lockedPack] = await tx
            .select()
            .from(creditPacks)
            .where(eq(creditPacks.id, pack.id))
            .for("update")
            .limit(1);

          if (!lockedPack || lockedPack.remaining <= 0) {
            return;
          }

          // Get wallet with lock
          const [wallet] = await tx
            .select()
            .from(creditWallets)
            .where(eq(creditWallets.id, lockedPack.walletId))
            .for("update")
            .limit(1);

          if (!wallet) {
            return;
          }

          const newBalance = Math.max(0, wallet.balance - lockedPack.remaining);

          // Update wallet balance
          await tx
            .update(creditWallets)
            .set({
              balance: newBalance,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, wallet.id));

          // Set pack remaining to 0
          await tx
            .update(creditPacks)
            .set({
              remaining: 0,
              updatedAt: new Date(),
            })
            .where(eq(creditPacks.id, lockedPack.id));

          // Create expiry transaction
          await tx.insert(creditTransactions).values({
            walletId: wallet.id,
            amount: -lockedPack.remaining,
            balanceAfter: newBalance,
            type: CreditTransactionType.EXPIRY,
            packId: lockedPack.id,
            freePeriodId: wallet.freePeriodId,
            metadata: {
              expiredPackId: lockedPack.id,
              expiredAmount: lockedPack.remaining,
              packType: "subscription",
              originalAmount: lockedPack.originalAmount,
              expiresAt: lockedPack.expiresAt?.toISOString() || null,
              expiredAt: now.toISOString(),
            },
          });

          logger.debug("Expired credit pack", {
            packId: pack.id,
            walletId: wallet.id,
            amount: pack.remaining,
            newBalance,
          });
        });
      } catch (error) {
        logger.error("Failed to expire credit pack", {
          packId: pack.id,
          error: parseError(error),
        });
        // Continue with other packs even if one fails
      }
    }

    // Check for expired grace periods and cancel subscriptions
    // Get user IDs from wallets to check their subscriptions
    const { subscriptions } = await import("../subscription/db");
    const userWallets = await db
      .select({ userId: creditWallets.userId })
      .from(creditWallets)
      .where(
        and(
          inArray(creditWallets.id, walletIds),
          not(isNull(creditWallets.userId)),
        ),
      );

    const userIds = userWallets
      .map((w) => w.userId)
      .filter((id): id is string => id !== null);

    if (userIds.length > 0) {
      const { SubscriptionStatus } = await import("../subscription/enum");
      const GRACE_PERIOD_DAYS = 7;

      // Calculate cutoff date for missed webhooks (7 days ago)
      const gracePeriodCutoff = new Date(now);
      gracePeriodCutoff.setDate(
        gracePeriodCutoff.getDate() - GRACE_PERIOD_DAYS,
      );

      logger.info("Checking for expired subscriptions", {
        userIds,
        userIdsCount: userIds.length,
        gracePeriodCutoff,
      });

      // Find subscriptions with expired grace periods OR expired without grace period set (missed webhooks)
      const expiredSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            inArray(subscriptions.userId, userIds),
            or(
              // Grace period explicitly set and expired
              and(
                eq(subscriptions.status, SubscriptionStatus.PAST_DUE),
                not(isNull(subscriptions.gracePeriodEndsAt)),
                lt(subscriptions.gracePeriodEndsAt, now),
              ),
              // OR: Period ended more than grace period ago without grace period set (missed webhook case)
              and(
                or(
                  eq(subscriptions.status, SubscriptionStatus.ACTIVE),
                  eq(subscriptions.status, SubscriptionStatus.PAST_DUE),
                ),
                not(isNull(subscriptions.currentPeriodEnd)),
                isNull(subscriptions.gracePeriodEndsAt),
                lt(subscriptions.currentPeriodEnd, gracePeriodCutoff),
              ),
            ),
          ),
        );

      logger.info("Found expired subscriptions", {
        count: expiredSubscriptions.length,
        subscriptions: expiredSubscriptions.map((s) => ({
          id: s.id,
          userId: s.userId,
          status: s.status,
          currentPeriodEnd: s.currentPeriodEnd,
          gracePeriodEndsAt: s.gracePeriodEndsAt,
        })),
      });

      // Cancel expired subscriptions
      for (const sub of expiredSubscriptions) {
        try {
          await db
            .update(subscriptions)
            .set({
              status: SubscriptionStatus.CANCELED,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, sub.id));

          logger.info("Auto-canceled subscription after grace period", {
            subscriptionId: sub.id,
            userId: sub.userId,
            gracePeriodEndsAt: sub.gracePeriodEndsAt,
            currentPeriodEnd: sub.currentPeriodEnd,
            reason: sub.gracePeriodEndsAt
              ? "grace_period_expired"
              : "missed_webhook_period_expired",
          });
        } catch (error) {
          logger.error("Failed to cancel subscription after grace period", {
            subscriptionId: sub.id,
            error: parseError(error),
          });
        }
      }
    }
  }

  /**
   * Calculate balance across all wallets in pool
   * Enforces pool limit: max 20 free credits available per period
   * Refetches wallets to get current balances after any deductions
   * AUTOMATIC EXPIRATION: Expires old credits before calculating balance
   */
  private static async calculatePoolBalance(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<CreditsGetResponseOutput> {
    // Refetch all wallets to get current balances
    const walletIds = [
      pool.userWallet?.id,
      ...pool.leadWallets.map((w) => w.id),
    ].filter((id): id is string => id !== undefined);

    // AUTOMATIC EXPIRATION: Expire old credits before calculating balance
    await CreditRepository.expireExpiredCreditsForWallets(walletIds, logger);

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
    let totalEarned = 0;
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
        if (pack.type === CreditPackType.SUBSCRIPTION && pack.expiresAt) {
          totalExpiring += pack.remaining;
          if (!earliestExpiry || pack.expiresAt < earliestExpiry) {
            earliestExpiry = pack.expiresAt;
          }
        } else if (pack.type === CreditPackType.EARNED) {
          totalEarned += pack.remaining;
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

      // Find the most recent FREE_GRANT for this period
      const [latestGrant] = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, leadWalletIds),
            eq(creditTransactions.freePeriodId, activePeriodId),
            eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
          ),
        )
        .orderBy(desc(creditTransactions.createdAt))
        .limit(1);

      // Only count USAGE after the most recent FREE_GRANT
      const usageTransactions = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, leadWalletIds),
            eq(creditTransactions.freePeriodId, activePeriodId),
            eq(creditTransactions.type, CreditTransactionType.USAGE),
            latestGrant
              ? gte(creditTransactions.createdAt, latestGrant.createdAt)
              : sql`true`,
          ),
        );

      freeCreditsSpentThisPeriod = usageTransactions.reduce((sum, t) => {
        const metadata = t.metadata;
        return (
          sum +
          ("freeCreditsUsed" in metadata ? metadata?.freeCreditsUsed || 0 : 0)
        );
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

    return {
      total: freeCreditsAvailable + totalPaid,
      free: freeCreditsAvailable,
      expiring: totalExpiring,
      permanent: totalPermanent,
      earned: totalEarned,
      expiresAt: earliestExpiry?.toISOString() || null,
    };
  }

  /**
   * Get or create wallet for a user
   * Per spec: User wallet gets created with 0 free credits (not 20)
   * Free credits come from lead wallets during redistribution
   * ATOMIC: Wallet creation wrapped in database transaction
   */
  private static async getOrCreateUserWallet(
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
  private static async getOrCreateLeadWallet(
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
    const initialCredits = CreditRepository.getInitialFreeCredits();
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
  private static async ensureMonthlyFreeCreditsForPool(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<void> {
    const now = new Date();

    const allWallets = [pool.userWallet, ...pool.leadWallets].filter(
      (w): w is CreditWallet => w !== null,
    );

    if (allWallets.length === 0) {
      return;
    }

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

    // CRITICAL: Always use the OLDEST lead wallet's period as the canonical period for the pool
    // When leads get linked, we maintain the oldest period going forward
    const oldestLeadWallet = leadWallets.reduce((oldest, current) =>
      current.freePeriodStart < oldest.freePeriodStart ? current : oldest,
    );

    // Use the oldest wallet's period as the pool's current period
    const oldestPeriodDate = new Date(oldestLeadWallet.freePeriodStart);
    const oldestPeriodMonth = oldestPeriodDate.getMonth();
    const oldestPeriodYear = oldestPeriodDate.getFullYear();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Check if the oldest wallet's period needs to advance
    const isNewMonth =
      currentYear > oldestPeriodYear ||
      (currentYear === oldestPeriodYear && currentMonth > oldestPeriodMonth);

    if (!isNewMonth) {
      // Still in same month as oldest wallet - no reset needed
      // Do NOT update freePeriodId - it must stay consistent with existing transactions
      return;
    }

    // Calculate the new period ID by advancing the oldest wallet's period by one month
    const newPeriodDate = new Date(oldestPeriodDate);
    newPeriodDate.setMonth(newPeriodDate.getMonth() + 1);
    const newPeriodId = `${newPeriodDate.getFullYear()}-${String(newPeriodDate.getMonth() + 1).padStart(2, "0")}`;

    logger.info("Pool needs monthly free credits reset", {
      poolId: pool.poolId,
      oldestWalletPeriod: oldestLeadWallet.freePeriodId,
      newPeriodId,
      oldestPeriodDate: oldestPeriodDate.toISOString(),
      daysSinceOldestPeriod: Math.floor(
        (now.getTime() - oldestPeriodDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
      walletCount: allWallets.length,
      resetTime: now.toISOString(),
    });

    const totalFreeCreditsInPool = leadWallets.reduce(
      (sum, w) => sum + w.freeCreditsRemaining,
      0,
    );

    const maxFreeCreditsPerPool = productsRepository.getProduct(
      ProductIds.FREE_TIER,
      "en-GLOBAL",
    ).credits;

    await withTransaction(logger, async (tx) => {
      // CRITICAL: ALWAYS reset to exactly 20 credits when entering new period
      // This ensures fresh credits each month, regardless of leftover from previous period

      // Reset all lead wallets to 0 first
      // CRITICAL: Set freePeriodStart to NOW (when reset happens), not to calculated period date
      // This ensures we only count transactions that happen AFTER this reset
      for (const wallet of leadWallets) {
        await tx
          .update(creditWallets)
          .set({
            freeCreditsRemaining: 0,
            freePeriodStart: now,
            freePeriodId: newPeriodId,
            updatedAt: now,
          })
          .where(eq(creditWallets.id, wallet.id));
      }

      // Grant all 20 credits to the oldest lead wallet
      await tx
        .update(creditWallets)
        .set({
          freeCreditsRemaining: maxFreeCreditsPerPool,
          updatedAt: now,
        })
        .where(eq(creditWallets.id, oldestLeadWallet.id));

      // Calculate total pool balance (paid credits from all wallets + new free credits)
      const totalPaidBalance = allWallets.reduce(
        (sum, w) => sum + w.balance,
        0,
      );
      const totalBalanceAfterGrant = totalPaidBalance + maxFreeCreditsPerPool;

      // Create FREE_GRANT transaction
      await tx.insert(creditTransactions).values({
        walletId: oldestLeadWallet.id,
        amount: maxFreeCreditsPerPool,
        balanceAfter: totalBalanceAfterGrant,
        type: CreditTransactionType.FREE_GRANT,
        freePeriodId: newPeriodId,
        metadata: {
          reason: "monthly_reset",
          freeCreditsRemaining: maxFreeCreditsPerPool,
          totalPoolFreeCredits: maxFreeCreditsPerPool,
        },
      });

      logger.info("Pool monthly free credits reset complete", {
        poolId: pool.poolId,
        oldestWalletId: oldestLeadWallet.id,
        totalWallets: allWallets.length,
        previousTotal: totalFreeCreditsInPool,
        newTotal: maxFreeCreditsPerPool,
        excessCreditsRemoved: totalFreeCreditsInPool > maxFreeCreditsPerPool,
      });

      // Update period for user wallet (no free credits in user wallet)
      if (pool.userWallet) {
        await tx
          .update(creditWallets)
          .set({
            freePeriodStart: now,
            freePeriodId: newPeriodId,
            updatedAt: now,
          })
          .where(eq(creditWallets.id, pool.userWallet.id));
      }
    });
  }

  /**
   * Get balance for identifier
   */
  static async getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    try {
      let poolResult: ResponseType<CreditPool>;

      if (identifier.userId) {
        poolResult = await CreditRepository.getUserPool(
          identifier.userId,
          logger,
        );
      } else if (identifier.leadId) {
        poolResult = await CreditRepository.getLeadPool(
          identifier.leadId,
          logger,
        );
      } else {
        return fail({
          message: "app.api.credits.errors.invalidIdentifier",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const balance = await CreditRepository.calculatePoolBalance(
        poolResult.data,
        logger,
      );
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
  static async getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      // Get pool for this lead
      const poolResult = await CreditRepository.getLeadPool(leadId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // Check and reset monthly free credits for entire pool if needed
      await CreditRepository.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Calculate balance across all wallets in pool
      const balance = await CreditRepository.calculatePoolBalance(pool, logger);
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
  static async getCreditBalanceForUser(
    user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    try {
      let poolResult: ResponseType<CreditPool>;
      if (user.isPublic) {
        poolResult = await CreditRepository.getLeadPoolOnly(
          user.leadId,
          logger,
        );
      } else {
        poolResult = await CreditRepository.getUserPool(user.id, logger);
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // Check and reset monthly free credits for entire pool if needed
      await CreditRepository.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Calculate balance across all wallets in pool
      const balance = await CreditRepository.calculatePoolBalance(pool, logger);

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
  static async getOrCreateLeadByIp(
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
        const poolResult = await CreditRepository.getLeadPool(
          existingLead.id,
          logger,
        );
        if (!poolResult.success) {
          return poolResult;
        }

        // Ensure monthly credits are current for pool
        await CreditRepository.ensureMonthlyFreeCreditsForPool(
          poolResult.data,
          logger,
        );

        // Calculate total credits across pool
        const balance = await CreditRepository.calculatePoolBalance(
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
      const walletResult = await CreditRepository.getOrCreateLeadWallet(
        newLead.id,
        logger,
      );
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
  static async addCredits(
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
        walletResult = await CreditRepository.getOrCreateUserWallet(
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
          walletResult = await CreditRepository.getOrCreateUserWallet(
            leadLink.userId,
            logger,
          );
        } else {
          // Lead is not linked - use lead wallet
          walletResult = await CreditRepository.getOrCreateLeadWallet(
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
      let packType: CreditPackTypeValue;
      let expiresAt: Date | null = null;

      if (type === "subscription") {
        packType = CreditPackType.SUBSCRIPTION;
        // Subscription credits expire in 30 days
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
      } else if (type === "permanent") {
        packType = CreditPackType.PERMANENT;
      } else {
        packType = CreditPackType.BONUS;
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
        packType === CreditPackType.SUBSCRIPTION
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
          packType === CreditPackType.SUBSCRIPTION
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

      return success();
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
  static async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
    sessionId?: string,
  ): Promise<ResponseType<void>> {
    try {
      // Add to user wallet (credits are pooled across user + linked leads)
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      let packType: CreditPackTypeValue;
      let finalExpiresAt: Date | null = null;

      if (type === "subscription") {
        packType = CreditPackType.SUBSCRIPTION;
        finalExpiresAt =
          expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (type === "permanent") {
        packType = CreditPackType.PERMANENT;
      } else {
        packType = CreditPackType.BONUS;
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

      return success();
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
  private static async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: ModelId | undefined,
    feature: string | undefined,
    messageId: string,
    logger: EndpointLogger,
    allowPartial = false, //  allow deducting less than requested
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
        poolResult = await CreditRepository.getUserPool(
          identifier.userId,
          logger,
        );
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
        poolResult = await CreditRepository.getLeadPool(
          identifier.leadId!,
          logger,
        );
        currentLeadId = identifier.leadId;
      }

      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // AUTOMATIC EXPIRATION: Expire old credits before deducting
      const walletIds = [
        pool.userWallet?.id,
        ...pool.leadWallets.map((w) => w.id),
      ].filter((id): id is string => id !== undefined);
      await CreditRepository.expireExpiredCreditsForWallets(walletIds, logger);

      // Ensure monthly credits are current for ENTIRE pool (pool-aware reset)
      await CreditRepository.ensureMonthlyFreeCreditsForPool(pool, logger);

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
              feature,
              messageId,
              freePeriodId: lockedWallet.freePeriodId,
              metadata: {
                cost: amount,
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
            .orderBy(sql`${creditPacks.expiresAt} ASC`)
            .for("update"); // Lock packs to prevent race conditions

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
              feature,
              messageId,
              packId: pack.id,
              freePeriodId: walletInfo?.freePeriodId || null,
              metadata: {
                cost: amount,
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
            .orderBy(desc(creditPacks.createdAt))
            .for("update"); // Lock packs to prevent race conditions

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
              feature,
              messageId,
              packId: pack.id,
              freePeriodId: walletInfo?.freePeriodId || null,
              metadata: {
                cost: amount,
                messageId,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            remaining -= deduction;
          }
        }

        // Step 4: Deduct from earned credit packs (LOWEST PRIORITY - for referral earnings)
        if (remaining > 0 && pool.userWallet) {
          const walletIds = [pool.userWallet.id];
          const earnedPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, walletIds),
                eq(creditPacks.type, CreditPackType.EARNED),
              ),
            )
            .orderBy(creditPacks.createdAt) // FIFO for earned credits
            .for("update"); // Lock packs to prevent race conditions

          for (const pack of earnedPacks) {
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
              feature,
              messageId,
              packId: pack.id,
              freePeriodId: walletInfo?.freePeriodId || null,
              metadata: {
                cost: amount,
                messageId,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            remaining -= deduction;
          }
        }

        if (remaining > 0) {
          if (allowPartial) {
            // For model/TTS/STT: deduct what we can, commit the transaction
            logger.info("Partial credit deduction (graceful)", {
              requested: amount,
              deducted: amount - remaining,
              remaining,
              poolId: pool.poolId,
              feature,
            });
            // Return success - we deducted what was available
            return { success: true as const };
          } else {
            // For tools/endpoints: insufficient credits, rollback without creating record
            const availableCredits = [
              ...(pool.userWallet ? [pool.userWallet] : []),
              ...pool.leadWallets,
            ].reduce((sum, wallet) => sum + wallet.balance, 0);

            logger.warn("Insufficient credits for tool/endpoint", {
              requested: amount,
              available: availableCredits,
              poolId: pool.poolId,
              feature,
            });
            return {
              success: false as const,
              error: "app.api.credits.errors.insufficientCredits" as const,
            };
          }
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

      return success();
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
  private static async getTransactions(
    userId: string,
    leadId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      // Get user pool
      const poolResult = await CreditRepository.getUserPool(userId, logger);
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

      // Ensure monthly free credits are reset if needed (new period)
      await CreditRepository.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Refetch pool to get updated period IDs after potential reset
      const updatedPoolResult = await CreditRepository.getUserPool(
        userId,
        logger,
      );
      if (!updatedPoolResult.success) {
        return updatedPoolResult;
      }

      const updatedPool = updatedPoolResult.data;
      if (!updatedPool.userWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Find current lead's wallet (may not exist if user has no lead on this device)
      const currentLeadWallet = updatedPool.leadWallets.find(
        (w) => w.leadId === leadId,
      );

      // Use the wallet's actual freePeriodId for consistency
      const currentPeriodId = updatedPool.userWallet.freePeriodId;

      // Find the most recent FREE_GRANT for this period to get the reset cutoff time
      const [latestGrant] = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            inArray(
              creditTransactions.walletId,
              updatedPool.leadWallets.map((w) => w.id),
            ),
            eq(creditTransactions.freePeriodId, currentPeriodId),
            eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
          ),
        )
        .orderBy(desc(creditTransactions.createdAt))
        .limit(1);

      // Calculate spending from OTHER linked leads (not current lead) for summary entry
      // Only count USAGE after the most recent FREE_GRANT to avoid counting old usage
      let otherLeadsSpending = 0;
      for (const leadWallet of updatedPool.leadWallets) {
        if (currentLeadWallet && leadWallet.id === currentLeadWallet.id) {
          continue; // Skip current lead
        }

        const leadTransactions = await db
          .select()
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.walletId, leadWallet.id),
              eq(creditTransactions.freePeriodId, currentPeriodId),
              eq(creditTransactions.type, CreditTransactionType.USAGE),
              latestGrant
                ? gte(creditTransactions.createdAt, latestGrant.createdAt)
                : sql`true`,
            ),
          );

        const leadSpending = leadTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
        otherLeadsSpending += leadSpending;
      }

      // Adjust offset and limit to account for synthetic summary entry on page 1
      const hasSummaryEntry = otherLeadsSpending > 0;
      const adjustedOffset =
        hasSummaryEntry && offset > 0 ? offset - 1 : offset;
      const adjustedLimit = hasSummaryEntry && offset === 0 ? limit - 1 : limit;

      // Fetch transactions from current lead wallet (if exists) AND user wallet
      const walletIds = currentLeadWallet
        ? [currentLeadWallet.id, updatedPool.userWallet.id]
        : [updatedPool.userWallet.id];
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(inArray(creditTransactions.walletId, walletIds))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(adjustedLimit)
        .offset(adjustedOffset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(inArray(creditTransactions.walletId, walletIds));

      // Convert count to number (PostgreSQL count returns bigint as string)
      const totalCount = Number(count);
      const { t } = simpleT(locale);
      const result: CreditTransactionOutput[] = transactions.map(
        (transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          balanceAfter: transaction.balanceAfter,
          type: transaction.modelId
            ? `${t(transaction.type)} (${CreditRepository.getFetaureLabel(
                transaction.modelId,
                transaction.feature,
              )})`
            : transaction.type,
          modelId: transaction.modelId,
          messageId: transaction.messageId,
          createdAt: transaction.createdAt.toISOString(),
        }),
      );

      // Add summary entry for other leads' spending if > 0
      if (otherLeadsSpending > 0 && offset === 0) {
        result.unshift({
          id: "other-devices-summary",
          amount: -otherLeadsSpending,
          balanceAfter: updatedPool.userWallet.balance,
          type: t(CreditTransactionType.OTHER_DEVICES),
          messageId: null,
          createdAt: new Date().toISOString(),
        });
      }

      return success({
        transactions: result,
        totalCount: totalCount + (otherLeadsSpending > 0 ? 1 : 0),
      });
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { userId });
      return fail({
        message: "app.api.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static getFetaureLabel(
    modelId: ModelId | null,
    featureName: string | null,
  ): string | null {
    return modelId ? getModelById(modelId)?.name : featureName;
  }

  /**
   * Get transaction history (unified method for route handler)
   * Handles both authenticated users and public users
   */
  static async getTransactionHistory(
    data: CreditsHistoryGetRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditsHistoryGetResponseOutput>> {
    const { page, limit } = data.paginationInfo;
    const offset = (page - 1) * limit;

    const result = user.id
      ? await CreditRepository.getTransactions(
          user.id,
          user.leadId,
          limit,
          offset,
          logger,
          locale,
        )
      : await CreditRepository.getTransactionsByLeadId(
          user.leadId,
          limit,
          offset,
          logger,
          locale,
        );

    if (!result.success) {
      return result;
    }

    const totalPages = Math.ceil(result.data.totalCount / limit);

    return {
      success: true,
      data: {
        transactions: result.data.transactions,
        paginationInfo: {
          totalCount: result.data.totalCount,
          pageCount: totalPages,
        },
      },
      message: result.message,
    };
  }

  /**
   * Get transactions by lead ID
   * Shows only current lead wallet's transactions + summary of other devices' spending
   */
  private static async getTransactionsByLeadId(
    leadId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      // Get lead pool (lead wallets only, no user wallet)
      const poolResult = await CreditRepository.getLeadPoolOnly(leadId, logger);
      if (!poolResult.success) {
        return poolResult;
      }

      const pool = poolResult.data;

      // Ensure monthly free credits are reset if needed (new period)
      await CreditRepository.ensureMonthlyFreeCreditsForPool(pool, logger);

      // Refetch pool to get updated period IDs after potential reset
      const updatedPoolResult = await CreditRepository.getLeadPoolOnly(
        leadId,
        logger,
      );
      if (!updatedPoolResult.success) {
        return updatedPoolResult;
      }

      const updatedPool = updatedPoolResult.data;
      const allWallets = [
        updatedPool.userWallet,
        ...updatedPool.leadWallets,
      ].filter((w): w is CreditWallet => w !== null);

      // Find current lead's wallet
      const currentWallet = allWallets.find((w) => w.leadId === leadId);
      if (!currentWallet) {
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Use the wallet's actual freePeriodId for consistency
      const currentPeriodId = currentWallet.freePeriodId;

      // Find the most recent FREE_GRANT for this period to get the reset cutoff time
      const leadWalletIds = allWallets
        .filter((w) => w.leadId !== null)
        .map((w) => w.id);
      const [latestGrant] = leadWalletIds.length
        ? await db
            .select()
            .from(creditTransactions)
            .where(
              and(
                inArray(creditTransactions.walletId, leadWalletIds),
                eq(creditTransactions.freePeriodId, currentPeriodId),
                eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
              ),
            )
            .orderBy(desc(creditTransactions.createdAt))
            .limit(1)
        : [];

      // Calculate total spending from other linked lead wallets in current period (for summary entry)
      // Only count USAGE after the most recent FREE_GRANT to avoid counting old usage
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
              latestGrant
                ? gte(creditTransactions.createdAt, latestGrant.createdAt)
                : sql`true`,
            ),
          );

        otherDevicesSpending = otherTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
      }

      // Adjust offset and limit to account for synthetic summary entry on page 1
      const hasSummaryEntry = otherDevicesSpending > 0;
      const adjustedOffset =
        hasSummaryEntry && offset > 0 ? offset - 1 : offset;
      const adjustedLimit = hasSummaryEntry && offset === 0 ? limit - 1 : limit;

      // Fetch transactions from ONLY current wallet
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, currentWallet.id))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(adjustedLimit)
        .offset(adjustedOffset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.walletId, currentWallet.id));

      // Convert count to number (PostgreSQL count returns bigint as string)
      const totalCount = Number(count);
      const { t } = simpleT(locale);
      const result: CreditTransactionOutput[] = transactions.map(
        (transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          balanceAfter: transaction.balanceAfter,
          type: transaction.modelId
            ? `${t(transaction.type)} (${CreditRepository.getFetaureLabel(transaction.modelId, transaction.feature)})`
            : transaction.type,
          messageId: transaction.messageId,
          createdAt: transaction.createdAt.toISOString(),
        }),
      );

      // Add summary entry for other devices' spending if > 0
      if (otherDevicesSpending > 0 && offset === 0) {
        const { t } = simpleT(locale);
        result.unshift({
          id: "other-devices-summary",
          amount: -otherDevicesSpending,
          balanceAfter: currentWallet.balance,
          type: t("app.api.credits.enums.transactionType.otherDevices"),
          messageId: null,
          createdAt: new Date().toISOString(),
        });
      }

      return success({
        transactions: result,
        totalCount: totalCount + (otherDevicesSpending > 0 ? 1 : 0),
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
   * Expire old subscription credits (cron job)
   * Creates EXPIRY transaction before deleting packs
   * Each pack expiration is wrapped in a transaction for atomicity
   */
  static async expireCredits(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      const expiredPacks = await db
        .select()
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.type, CreditPackType.SUBSCRIPTION),
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
  static async getCreditIdentifierBySubscription(
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
  static async deductCreditsForFeature(
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

      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
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

      logger.debug(`Credits deducted for ${feature}`, {
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
   * Deduct credits for TTS (graceful - allows partial deduction to 0)
   */
  static async deductCreditsForTTS(
    user: JwtPayloadType,
    cost: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    if (cost <= 0) {
      logger.debug("Skipping TTS credit deduction - zero cost", { cost });
      return { success: true };
    }

    try {
      const creditMessageId = crypto.randomUUID();
      let identifier: CreditIdentifier;

      if (user.isPublic && user.leadId) {
        identifier = { leadId: user.leadId };
      } else if (user.id) {
        identifier = { userId: user.id, leadId: user.leadId };
      } else if (user.leadId) {
        identifier = { leadId: user.leadId };
      } else {
        logger.error("No identifier for TTS credit deduction", { cost });
        return { success: false };
      }
      const { t } = simpleT(locale);

      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
        t(ttsDefinition.POST.title),
        creditMessageId,
        logger,
        true, // allowPartial = true for TTS
      );

      if (!result.success) {
        logger.warn("TTS credit deduction failed", {
          ...identifier,
          cost,
        });
        return { success: false };
      }

      logger.debug("TTS credits deducted", {
        ...identifier,
        cost,
        messageId: creditMessageId,
      });

      return {
        success: true,
        messageId: creditMessageId,
        partialDeduction: false,
      };
    } catch (error) {
      logger.error("Failed to deduct TTS credits", parseError(error), {
        cost,
      });
      return { success: false };
    }
  }

  /**
   * Deduct credits for STT (graceful - allows partial deduction to 0)
   */
  static async deductCreditsForSTT(
    user: JwtPayloadType,
    cost: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    if (cost <= 0) {
      logger.debug("Skipping STT credit deduction - zero cost", { cost });
      return { success: true };
    }

    try {
      const creditMessageId = crypto.randomUUID();
      let identifier: CreditIdentifier;

      if (user.isPublic && user.leadId) {
        identifier = { leadId: user.leadId };
      } else if (user.id) {
        identifier = { userId: user.id, leadId: user.leadId };
      } else if (user.leadId) {
        identifier = { leadId: user.leadId };
      } else {
        logger.error("No identifier for STT credit deduction", { cost });
        return { success: false };
      }
      const { t } = simpleT(locale);
      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
        t(sttDefinition.POST.title),
        creditMessageId,
        logger,
        true, // allowPartial = true for STT
      );

      if (!result.success) {
        logger.warn("STT credit deduction failed", {
          ...identifier,
          cost,
        });
        return { success: false };
      }

      logger.debug("STT credits deducted", {
        ...identifier,
        cost,
        messageId: creditMessageId,
      });

      return {
        success: true,
        messageId: creditMessageId,
        partialDeduction: false,
      };
    } catch (error) {
      logger.error("Failed to deduct STT credits", parseError(error), {
        cost,
      });
      return { success: false };
    }
  }

  /**
   * Deduct credits for model usage with partial deduction allowed
   * If full amount cannot be deducted, deducts what's available (to 0) and returns success
   * This is ONLY for model costs at the end of streaming - we eat the cost difference
   */
  static async deductCreditsForModelUsage(
    user: JwtPayloadType,
    cost: number,
    model: ModelId,
    logger: EndpointLogger,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    if (cost <= 0) {
      logger.debug("Skipping credit deduction - zero or negative cost", {
        model,
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
        identifier = { userId: user.id, leadId: user.leadId };
      } else if (user.leadId) {
        identifier = { leadId: user.leadId };
      } else {
        logger.error("No identifier for credit deduction", { model, cost });
        return { success: false };
      }

      // Call internal deduct method with allowPartial=true for model usage
      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        model,
        undefined,
        creditMessageId,
        logger,
        true, // Allow partial deduction for model usage
      );

      // For model usage, treat partial deduction as success
      // The transaction will have committed whatever was available
      if (!result.success) {
        logger.warn(
          `Model usage: Insufficient credits, deducted what was available`,
          {
            ...identifier,
            requestedCost: cost,
            model,
          },
        );
        // Return success with partial flag - we eat the cost difference
        return {
          success: true,
          messageId: creditMessageId,
          partialDeduction: true,
        };
      }

      logger.debug(`Credits deducted for model usage`, {
        ...identifier,
        cost,
        model,
        messageId: creditMessageId,
      });

      return { success: true, messageId: creditMessageId };
    } catch (error) {
      logger.error(`Error deducting credits for model`, {
        error: error instanceof Error ? error.message : String(error),
        cost,
        model,
      });
      return { success: false };
    }
  }

  /**
   * Handle credit pack purchase from webhook
   * CRITICAL: Includes idempotency check to prevent duplicate credit additions
   */
  static async handleCreditPackPurchase(
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

      const result = await CreditRepository.addUserCredits(
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
  static async mergePendingLeadWallets(
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
      const poolResult = await CreditRepository.getUserPool(userId, logger);
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

      return success();
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
   * Check if identifier has sufficient credits (repository-level business logic)
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  static async hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (!identifier.leadId && !identifier.userId) {
      logger.error("Credit check requires leadId or userId");
      return false;
    }
    const balanceResult = await CreditRepository.getBalance(identifier, logger);
    if (!balanceResult.success) {
      return false;
    }
    return balanceResult.data.total >= required;
  }

  /**
   * Generate unique message ID for credit transactions
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
  }

  /**
   * Add earned credits from referral commission
   * Creates an "earned" credit pack with REFERRAL_EARNING transaction
   */
  static async addEarnedCredits(
    userId: string,
    amountCents: number,
    sourceUserId: string,
    transactionId: string,
    commissionPercent: number,
    originalAmountCents: number,
    logger: EndpointLogger,
    sourceUserEmail?: string,
  ): Promise<ResponseType<{ packId: string; transactionId: string }>> {
    try {
      // Get or create user wallet
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      // Create earned credit pack (no expiration)
      const [newPack] = await db
        .insert(creditPacks)
        .values({
          walletId: wallet.id,
          originalAmount: amountCents,
          remaining: amountCents,
          type: CreditPackType.EARNED,
          expiresAt: null,
          source: "referral_earning",
          metadata: {
            sourceUserId,
            transactionId,
          },
        })
        .returning();

      // Update wallet balance
      const newBalance = wallet.balance + amountCents;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create REFERRAL_EARNING transaction
      const [txRecord] = await db
        .insert(creditTransactions)
        .values({
          walletId: wallet.id,
          amount: amountCents,
          balanceAfter: newBalance,
          type: CreditTransactionType.REFERRAL_EARNING,
          packId: newPack.id,
          freePeriodId: wallet.freePeriodId,
          metadata: {
            sourceUserId,
            sourceUserEmail,
            transactionId,
            commissionPercent,
            originalAmountCents,
          },
        })
        .returning();

      logger.info("Earned credits added from referral", {
        userId,
        amountCents,
        sourceUserId,
        packId: newPack.id,
        transactionId: txRecord.id,
      });

      return success({
        packId: newPack.id,
        transactionId: txRecord.id,
      });
    } catch (error) {
      logger.error("Failed to add earned credits", parseError(error), {
        userId,
        amountCents,
        sourceUserId,
      });
      return fail({
        message: "app.api.credits.errors.addEarnedCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get earned credits balance for a user
   * Returns total earned, available (not locked), and locked amounts
   */
  static async getEarnedCreditsBalance(
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      total: number;
      available: number;
      locked: number;
    }>
  > {
    try {
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      // Sum all earned credit packs
      const earnedPacks = await db
        .select()
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.walletId, wallet.id),
            eq(creditPacks.type, CreditPackType.EARNED),
          ),
        );

      const total = earnedPacks.reduce((sum, pack) => sum + pack.remaining, 0);

      // Calculate locked amount from pending/approved/processing payout requests
      const pendingPayouts = await db
        .select({ amountCents: payoutRequests.amountCents })
        .from(payoutRequests)
        .where(
          and(
            eq(payoutRequests.userId, userId),
            inArray(payoutRequests.status, [
              PayoutStatus.PENDING,
              PayoutStatus.APPROVED,
              PayoutStatus.PROCESSING,
            ]),
          ),
        );

      const locked = pendingPayouts.reduce((sum, p) => sum + p.amountCents, 0);
      const available = Math.max(0, total - locked);

      return success({
        total,
        available,
        locked,
      });
    } catch (error) {
      logger.error("Failed to get earned credits balance", parseError(error), {
        userId,
      });
      return fail({
        message: "app.api.credits.errors.getEarnedBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct earned credits for payout
   * Creates REFERRAL_PAYOUT transaction
   */
  static async deductEarnedCredits(
    userId: string,
    amountCents: number,
    payoutRequestId: string,
    currency: "BTC" | "USDC" | "CREDITS",
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      // Get earned packs ordered by creation (FIFO)
      const earnedPacks = await db
        .select()
        .from(creditPacks)
        .where(
          and(
            eq(creditPacks.walletId, wallet.id),
            eq(creditPacks.type, CreditPackType.EARNED),
          ),
        )
        .orderBy(creditPacks.createdAt);

      let remaining = amountCents;

      for (const pack of earnedPacks) {
        if (remaining <= 0) {
          break;
        }

        const deduction = Math.min(pack.remaining, remaining);

        if (deduction === pack.remaining) {
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

      if (remaining > 0) {
        return fail({
          message: "app.api.credits.errors.insufficientEarnedCredits",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Update wallet balance
      const newBalance = wallet.balance - amountCents;
      await db
        .update(creditWallets)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(creditWallets.id, wallet.id));

      // Create REFERRAL_PAYOUT transaction
      await db.insert(creditTransactions).values({
        walletId: wallet.id,
        amount: -amountCents,
        balanceAfter: newBalance,
        type: CreditTransactionType.REFERRAL_PAYOUT,
        freePeriodId: wallet.freePeriodId,
        metadata: {
          payoutRequestId,
          currency,
          amountCents,
        },
      });

      logger.info("Earned credits deducted for payout", {
        userId,
        amountCents,
        payoutRequestId,
        currency,
      });

      return success();
    } catch (error) {
      logger.error("Failed to deduct earned credits", parseError(error), {
        userId,
        amountCents,
        payoutRequestId,
      });
      return fail({
        message: "app.api.credits.errors.deductEarnedCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get referral transactions for a user (earnings and payouts)
   */
  static async getReferralTransactions(
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
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      // Get only referral-related transactions
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.walletId, wallet.id),
            inArray(creditTransactions.type, [
              CreditTransactionType.REFERRAL_EARNING,
              CreditTransactionType.REFERRAL_PAYOUT,
            ]),
          ),
        )
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.walletId, wallet.id),
            inArray(creditTransactions.type, [
              CreditTransactionType.REFERRAL_EARNING,
              CreditTransactionType.REFERRAL_PAYOUT,
            ]),
          ),
        );

      const result: CreditTransactionOutput[] = transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        type: t.type,
        modelId: t.modelId,
        messageId: t.messageId,
        createdAt: t.createdAt.toISOString(),
      }));

      return success({
        transactions: result,
        totalCount: count,
      });
    } catch (error) {
      logger.error("Failed to get referral transactions", parseError(error), {
        userId,
      });
      return fail({
        message: "app.api.credits.errors.getReferralTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Type for native repository type checking
export type CreditRepositoryType = Pick<
  typeof CreditRepository,
  keyof typeof CreditRepository
>;
