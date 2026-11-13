/**
 * Credit Repository
 * Wallet-based credit system with lead-to-lead and lead-to-user linking
 *
 * CRITICAL ARCHITECTURE:
 *
 * 1. WALLET STRUCTURE:
 *    - Lead Wallets: Each lead has separate wallet with FREE credits (pool allowance)
 *    - User Wallets: Each user has separate wallet with PAID credits ONLY (no free credits)
 *    - Linked Leads: All leads linked to a user maintain separate wallets
 *
 * 2. FREE CREDIT POOL (one monthly allowance shared, see free-allowance.ts):
 *    - Tiers from FREE_CREDIT_ALLOWANCE: guest pool, user pool, user pool + confirmed newsletter
 *    - All linked leads share ONE allowance - NOT per lead - prevents gaming the system
 *    - Free credits stored in lead wallets only (never in user wallets)
 *    - Monthly renewal: entire pool resets to its tier allowance (not per lead)
 *
 * 3. WALLET LINKING:
 *    - Lead-to-lead: via leadLeadLinks table (track page, referrals, same IP)
 *    - Lead-to-user: via userLeadLinks table (signup, login) or leads.convertedUserId
 *    - An account's pool = its linked/converted leads + every guest lead connected
 *      to them via leadLeadLinks, never crossing into another account's leads
 *      (pool-members.ts). A guest lead connected to an account uses that pool.
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
  isNotNull,
  isNull,
  lt,
  not,
  or,
  sql,
} from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentInvoices } from "@/payment/db";
import type { CreditPackCheckoutSession } from "@/payment/providers/types";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import { FREE_CREDIT_ALLOWANCE } from "../products/constants";
import { ProductIds, productsRepository } from "../products/repository-client";
import { payoutRequests } from "../referral/db";
import { PayoutStatus } from "../referral/enum";
import {
  type ChatModelId,
  chatModelOptionsIndex,
} from "../vibe/agent/ai-stream/models";
import type {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "../vibe/agent/ai-stream/vision-models";
import { withTransaction } from "../vibe/database/utils/repository-helpers";
import { createEndpointEmitter } from "../vibe/realtime/core/emitter";
import {
  creditPacks,
  type CreditTransactionMetadata,
  creditTransactions,
  type CreditWallet,
  creditWallets,
  type UsageUpstreamCost,
} from "./db";
import { getPoolBalance } from "./db-functions";
import {
  computeFreeAllowance,
  computeFreeAvailable,
  computeFreeTier,
  computeFreeTopUp,
  computeGrandfatheredFreeCap,
  computeLegacyFreeAllowance,
  FREE_GRANT_TIER_VERSION,
  type FreeTier,
  poolHasConfirmedNewsletter,
} from "./free-allowance";
import type { CreditsGetResponseOutput } from "./definition";
import creditsDefinitions from "./definition";
import {
  CreditPackType,
  type CreditPackTypeValue,
  CreditTransactionType,
  FreeCreditsStatus,
  type FreeCreditsStatusValue,
} from "./enum";
import type {
  CreditsHistoryGetRequestOutput,
  CreditsHistoryGetResponseOutput,
} from "./history/definition";
import type { CreditsT } from "./i18n";
import {
  type AccountFreeAccess as FreeCreditsAccess,
  claimGuestPool,
  isGuestPoolBlocked,
  resolveAccountFreeAccess,
  signupGuestCarryover,
} from "./anti-farming/quota";
import { SIGNUP_GUEST_SPEND_LOOKBACK_HOURS } from "./anti-farming/config";
import { guestPoolLeadIdsSql, userPoolLeadIdsSql } from "./pool-members";
import { PublicCapRepository } from "./public-cap/repository";

export interface CreditIdentifier {
  userId?: string;
  leadId: string;
}

export interface CreditPool {
  userWallet: CreditWallet | null;
  leadWallets: CreditWallet[];
  poolId: string;
  poolType: string;
}

export interface CreditTransactionOutput {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  modelId?: string | null;
  messageId: string | null;
  createdAt: Date;
}

interface GetOrCreateLeadByIpResult {
  leadId: string;
  credits: number;
}
interface DeductCreditsResult {
  partial?: boolean;
}
interface DeductForModelResult {
  messageId?: string;
  partialDeduction?: boolean;
}
interface AddReferralBonusResult {
  packId: string;
  transactionId: string;
}
/**
 * Result of addUserCredits. `granted` is false when an idempotency key
 * (sessionId) already had a pack: `packId` then points at that existing grant.
 * Callers gate one-time side effects (confirmation emails) on `granted`.
 */
export interface AddUserCreditsResult {
  packId: string;
  granted: boolean;
}

/**
 * Credit Repository Implementation
 * Uses simplified wallet-based architecture
 */
export class CreditRepository {
  /**
   * Initial free credits for new wallets
   * Uses the FREE_TIER product definition as single source of truth
   */
  private static getInitialFreeCredits(locale: CountryLanguage): number {
    return productsRepository.getProduct(ProductIds.FREE_TIER, locale).credits;
  }

  /**
   * Get pool for a user: user wallet + all linked lead wallets
   */
  static async getUserPool(
    userId: string,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditPool>> {
    try {
      // Get user wallet
      const userWalletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
        t,
      );
      if (!userWalletResult.success) {
        return userWalletResult;
      }

      // Every lead in the account's free pool (linked, converted, and guest
      // leads connected to them)
      const linkedLeadIds = await CreditRepository.findUserPoolLeadIds(userId);

      let leadWallets =
        linkedLeadIds.length > 0
          ? await db
              .select()
              .from(creditWallets)
              .where(inArray(creditWallets.leadId, linkedLeadIds))
          : [];

      // Auto-create missing lead wallets (can happen when a lead is linked at login/signup
      // but no wallet was ever created for it via the IP-tracking flow)
      if (linkedLeadIds.length > 0 && leadWallets.length === 0) {
        const primaryLeadId = linkedLeadIds[0];
        const walletResult = await CreditRepository.getOrCreateLeadWallet(
          primaryLeadId,
          logger,
          t,
          locale,
        );
        if (walletResult.success) {
          leadWallets = [walletResult.data];
        } else {
          logger.warn("Failed to auto-create missing lead wallet", {
            userId,
            leadId: primaryLeadId,
          });
        }
      }

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
        message: t("errors.getBalanceFailed"),
      });
    }
  }

  /**
   * Read-only version of getUserPool - does NOT create wallets or trigger side effects.
   * Use for admin reads of another user's data.
   */
  private static async getUserPoolReadOnly(
    userId: string,
    logger: EndpointLogger,
    t: CreditsT,
  ): Promise<ResponseType<CreditPool>> {
    try {
      const [userWallet] = await db
        .select()
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId))
        .limit(1);

      if (!userWallet) {
        return success({
          userWallet: null,
          leadWallets: [],
          poolId: userId,
          poolType: "USER_POOL",
        });
      }

      const linkedLeadIds = await CreditRepository.findUserPoolLeadIds(userId);

      const leadWallets =
        linkedLeadIds.length > 0
          ? await db
              .select()
              .from(creditWallets)
              .where(inArray(creditWallets.leadId, linkedLeadIds))
          : [];

      return success({
        userWallet,
        leadWallets,
        poolId: userId,
        poolType: "USER_POOL",
      });
    } catch (error) {
      logger.error("Failed to get user pool (read-only)", parseError(error));
      return fail({
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        message: t("errors.getBalanceFailed"),
      });
    }
  }

  /**
   * Get pool for a lead: only lead wallets, no user wallet
   */
  static async getLeadPoolOnly(
    leadId: string,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditPool>> {
    try {
      const connectedLeadIds =
        await CreditRepository.findGuestPoolLeadIds(leadId);

      let leadWallets = await db
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, connectedLeadIds));

      if (leadWallets.length === 0) {
        const walletResult = await CreditRepository.getOrCreateLeadWallet(
          leadId,
          logger,
          t,
          locale,
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
        message: t("errors.getBalanceFailed"),
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
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditPool>> {
    try {
      // Lead connected to an account through strong links (login, same
      // device) -> the account's pool. Logging out never opens a fresh guest
      // pool. Sharing an IP never makes a guest part of an account.
      const ownerUserId = await CreditRepository.findPoolOwner(leadId);
      if (ownerUserId) {
        return CreditRepository.getUserPool(ownerUserId, logger, t, locale);
      }
      const connectedLeadIds =
        await CreditRepository.findGuestPoolLeadIds(leadId);

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
          t,
          locale,
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
        message: t("errors.getBalanceFailed"),
      });
    }
  }

  /**
   * Leads in a guest pool: connected through any lead_lead_links (incl. same IP
   * within 24 h), never entering an account's lead (credits/pool-members.ts).
   */
  private static async findGuestPoolLeadIds(leadId: string): Promise<string[]> {
    const result = await db.execute<{ lead_id: string }>(
      guestPoolLeadIdsSql(leadId),
    );
    return result.rows.map((r) => r.lead_id);
  }

  /**
   * Leads reachable through STRONG links only (no ip_match), nearest first.
   */
  private static async findStronglyLinkedLeadIds(
    leadId: string,
  ): Promise<string[]> {
    const result = await db.execute<{ lead_id: string; depth: number }>(sql`
      WITH RECURSIVE strong(lead_id, depth) AS (
        SELECT ${leadId}::uuid, 0
        UNION
        SELECT CASE WHEN ll.lead_id_1 = s.lead_id
          THEN ll.lead_id_2 ELSE ll.lead_id_1 END, s.depth + 1
        FROM strong s
        JOIN ${leadLeadLinks} ll
          ON (ll.lead_id_1 = s.lead_id OR ll.lead_id_2 = s.lead_id)
          AND ll.link_reason <> 'ip_match'
        WHERE s.depth < 50
      )
      SELECT lead_id, min(depth) AS depth FROM strong
      GROUP BY lead_id ORDER BY min(depth)
    `);
    return result.rows.map((r) => r.lead_id);
  }

  /**
   * Lead ids sharing the account's monthly free pool (see credits/pool-members.ts).
   */
  private static async findUserPoolLeadIds(userId: string): Promise<string[]> {
    const result = await db.execute<{ lead_id: string }>(
      userPoolLeadIdsSql(userId),
    );
    return result.rows.map((r) => r.lead_id);
  }

  /**
   * Account that owns a set of connected leads (BFS order from the start lead),
   * so the nearest account wins. Ownership = user_lead_links or converted_user_id.
   * Null when every lead is a pure guest.
   */
  private static async findPoolOwner(leadId: string): Promise<string | null> {
    const connectedLeadIds =
      await CreditRepository.findStronglyLinkedLeadIds(leadId);
    if (connectedLeadIds.length === 0) {
      return null;
    }
    const [links, converted] = await Promise.all([
      db
        .select({ leadId: userLeadLinks.leadId, userId: userLeadLinks.userId })
        .from(userLeadLinks)
        .where(inArray(userLeadLinks.leadId, connectedLeadIds))
        .orderBy(userLeadLinks.createdAt),
      db
        .select({ leadId: leads.id, userId: leads.convertedUserId })
        .from(leads)
        .where(
          and(
            inArray(leads.id, connectedLeadIds),
            isNotNull(leads.convertedUserId),
          ),
        ),
    ]);
    const ownerByLead = new Map<string, string>();
    for (const row of links) {
      if (!ownerByLead.has(row.leadId)) {
        ownerByLead.set(row.leadId, row.userId);
      }
    }
    for (const row of converted) {
      if (row.userId && !ownerByLead.has(row.leadId)) {
        ownerByLead.set(row.leadId, row.userId);
      }
    }
    for (const connectedLeadId of connectedLeadIds) {
      const owner = ownerByLead.get(connectedLeadId);
      if (owner) {
        return owner;
      }
    }
    return null;
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

          // Atomic balance update with floor
          await tx
            .update(creditWallets)
            .set({
              balance: sql`GREATEST(0, ${creditWallets.balance} - ${lockedPack.remaining})`,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, wallet.id));

          // Re-read for accurate balanceAfter
          const [updated] = await tx
            .select({ balance: creditWallets.balance })
            .from(creditWallets)
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
            balanceAfter: updated?.balance ?? 0,
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
            newBalance: updated?.balance ?? 0,
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
    const userWallets = await db
      .select({ id: creditWallets.id, userId: creditWallets.userId })
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

      // Cancel expired subscriptions and revoke remaining subscription credits
      for (const sub of expiredSubscriptions) {
        try {
          await db
            .update(subscriptions)
            .set({
              status: SubscriptionStatus.CANCELED,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, sub.id));

          // Revoke any remaining subscription credit packs for this user
          // (pre-granted credits for the period that payment failed)
          if (sub.userId) {
            const userWallet = userWallets.find((w) => w.userId === sub.userId);
            if (userWallet) {
              const subPacks = await db
                .select()
                .from(creditPacks)
                .where(
                  and(
                    eq(creditPacks.walletId, userWallet.id),
                    eq(creditPacks.type, CreditPackType.SUBSCRIPTION),
                  ),
                );

              let packsRevoked = 0;
              for (const pack of subPacks) {
                if (pack.remaining > 0) {
                  await withTransaction(logger, async (tx) => {
                    // Lock the pack first to get fresh remaining value
                    const [lockedPack] = await tx
                      .select()
                      .from(creditPacks)
                      .where(eq(creditPacks.id, pack.id))
                      .for("update")
                      .limit(1);

                    if (!lockedPack || lockedPack.remaining <= 0) {
                      // Pack already consumed or revoked by concurrent operation
                      if (lockedPack) {
                        await tx
                          .delete(creditPacks)
                          .where(eq(creditPacks.id, pack.id));
                      }
                      return;
                    }

                    const [wallet] = await tx
                      .select()
                      .from(creditWallets)
                      .where(eq(creditWallets.id, lockedPack.walletId))
                      .for("update")
                      .limit(1);

                    if (wallet) {
                      // Atomic balance update with floor
                      await tx
                        .update(creditWallets)
                        .set({
                          balance: sql`GREATEST(0, ${creditWallets.balance} - ${lockedPack.remaining})`,
                          updatedAt: new Date(),
                        })
                        .where(eq(creditWallets.id, wallet.id));

                      // Re-read for accurate balanceAfter
                      const [updated] = await tx
                        .select({ balance: creditWallets.balance })
                        .from(creditWallets)
                        .where(eq(creditWallets.id, wallet.id));

                      await tx.insert(creditTransactions).values({
                        walletId: wallet.id,
                        amount: -lockedPack.remaining,
                        balanceAfter: updated?.balance ?? 0,
                        type: CreditTransactionType.EXPIRY,
                        packId: lockedPack.id,
                        freePeriodId: wallet.freePeriodId,
                        metadata: {
                          expiredPackId: lockedPack.id,
                          expiredAmount: lockedPack.remaining,
                          originalAmount: lockedPack.originalAmount,
                          reason: "subscription_grace_period_expired",
                        },
                      });
                    }

                    await tx
                      .delete(creditPacks)
                      .where(eq(creditPacks.id, lockedPack.id));
                  });
                  packsRevoked++;
                }
                // Packs with remaining=0 (fully consumed) are left intact for audit trail
              }

              logger.info("Revoked subscription credits after grace period", {
                userId: sub.userId,
                packsRevoked,
              });
            }
          }

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
   * Enforces pool limit: max `allowance` free credits available per period
   * Refetches wallets to get current balances after any deductions
   * AUTOMATIC EXPIRATION: Expires old credits before calculating balance
   */
  private static async calculatePoolBalance(
    pool: CreditPool,
    allowance: number,
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
    let packCapacity = 0;
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
        packCapacity += pack.originalAmount;
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
      // Use the current calendar period - all lead wallets in a pool share the
      // same month after ensureMonthlyFreeCreditsForPool advances them together.
      const activePeriodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const leadWalletIds = leadWallets.map((w) => w.id);

      // Count ALL free-credit USAGE in this period across all lead wallets.
      // Do NOT filter by latestGrant cutoff - after a pool merge, each lead has
      // its own FREE_GRANT timestamp and filtering would miss the older lead's spending.
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
        const metadata = t.metadata;
        return (
          sum +
          ("freeCreditsUsed" in metadata ? metadata?.freeCreditsUsed || 0 : 0)
        );
      }, 0);
    }

    // Enforce pool limit: max `allowance` free credits can be spent per period
    const freeCreditsAvailable = computeFreeAvailable({
      allowance,
      spentThisPeriod: freeCreditsSpentThisPeriod,
      remainingInWallets: totalFreeInWallets,
    });

    return {
      total: freeCreditsAvailable + totalPaid,
      free: freeCreditsAvailable,
      expiring: totalExpiring,
      permanent: totalPermanent,
      earned: totalEarned,
      expiresAt: earliestExpiry ?? null,
      capacity: packCapacity + allowance,
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
    t: CreditsT,
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

          logger.debug("Created new user wallet", {
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
        message: t("errors.walletCreationFailed"),
      });
    }

    return success(wallet);
  }

  /**
   * Get or create wallet for a lead
   * ATOMIC: Wallet creation and FREE_GRANT transaction are wrapped in database transaction
   * Grants the guest allowance when creating a new lead wallet (pool-aware)
   *
   * @param leadId - The lead ID to get/create wallet for
   * @param logger - Logger instance
   */
  private static async getOrCreateLeadWallet(
    leadId: string,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
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
    // Grant free credits only if the lead's pool doesn't already have them
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Check if the pool (guest graph, or the owning account's whole pool)
    // already has free credits in this period
    const ownerUserId = await CreditRepository.findPoolOwner(leadId);
    const connectedLeadIds = ownerUserId
      ? [
          ...new Set([
            leadId,
            ...(await CreditRepository.findUserPoolLeadIds(ownerUserId)),
          ]),
        ]
      : await CreditRepository.findGuestPoolLeadIds(leadId);
    const existingPoolWallets =
      connectedLeadIds.length > 1
        ? await db
            .select()
            .from(creditWallets)
            .where(inArray(creditWallets.leadId, connectedLeadIds))
        : [];
    const poolFreeCredits = existingPoolWallets.reduce(
      (sum, w) => sum + (w.freeCreditsRemaining ?? 0),
      0,
    );
    // New lead wallets start at the guest allowance. Higher tiers (signed-in,
    // newsletter) are topped up by ensureMonthlyFreeCreditsForPool on next access.
    // A brand-new guest pool (no account, no linked wallets) uses one of its
    // subnet's daily guest pool slots; beyond the quota it starts empty.
    const isNewGuestPool = !ownerUserId && existingPoolWallets.length === 0;
    const withinGuestQuota = isNewGuestPool
      ? await claimGuestPool(leadId, logger)
      : true;
    const initialCredits =
      !withinGuestQuota || poolFreeCredits >= FREE_CREDIT_ALLOWANCE.guest
        ? 0
        : Math.min(
            CreditRepository.getInitialFreeCredits(locale),
            FREE_CREDIT_ALLOWANCE.guest - poolFreeCredits,
          );

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
          if (initialCredits > 0) {
            // Create FREE_GRANT transaction atomically with wallet
            await tx.insert(creditTransactions).values({
              walletId: wallet.id,
              amount: initialCredits,
              balanceAfter: 0, // Pack balance is 0, free credits are separate
              type: CreditTransactionType.FREE_GRANT,
              freePeriodId: periodId,
              metadata: {
                reason: "initial_grant",
                tierVersion: FREE_GRANT_TIER_VERSION,
                tier: "guest",
                grantKey: `free:lead:${leadId}:${periodId}:initial`,
                freeCreditsRemaining: initialCredits,
              },
            });
          }

          logger.debug("Created new lead wallet", {
            leadId,
            walletId: wallet.id,
            initialCredits,
            poolFreeCredits,
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
        message: t("errors.walletCreationFailed"),
      });
    }

    return success(wallet);
  }

  /**
   * Resolve the pool's monthly free allowance (tier + confirmed newsletter bonus),
   * plus what the same pool would have had under the pre-2026-11 tiers.
   */
  private static async resolvePoolFreeAllowance(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<{
    allowance: number;
    legacyAllowance: number;
    tier: FreeTier;
    access: FreeCreditsAccess;
  }> {
    const userId = pool.userWallet?.userId ?? null;
    const isUserPool = pool.poolType === "USER_POOL" && userId !== null;
    const leadIds = pool.leadWallets
      .map((w) => w.leadId)
      .filter((id): id is string => id !== null);

    if (!isUserPool || !userId) {
      // Guest pool started beyond its subnet's daily quota: no free credits
      const blocked = await isGuestPoolBlocked(leadIds);
      const input = { isUserPool: false, hasConfirmedNewsletter: false };
      return {
        allowance: blocked ? 0 : computeFreeAllowance(input),
        legacyAllowance: blocked ? 0 : computeLegacyFreeAllowance(input),
        tier: "guest",
        access: blocked ? "subnetLimit" : "active",
      };
    }

    // Account tiers need a verified email and a slot in the subnet's budget
    const access = await resolveAccountFreeAccess(userId, logger);
    // Newsletter bonus is account-only
    const hasConfirmedNewsletter =
      access === "active"
        ? await poolHasConfirmedNewsletter({ userId, leadIds })
        : false;
    const accountInput = { isUserPool: true, hasConfirmedNewsletter };
    // What the pre-2026-11 rules granted stays until the next refill
    const legacyAllowance = computeLegacyFreeAllowance(accountInput);
    if (access === "subnetLimit") {
      return { allowance: 0, legacyAllowance: 0, tier: "account", access };
    }
    if (access === "verifyEmail") {
      // Unverified accounts keep the guest share only
      const guestInput = { isUserPool: false, hasConfirmedNewsletter: false };
      return {
        allowance: computeFreeAllowance(guestInput),
        legacyAllowance,
        tier: "guest",
        access,
      };
    }
    return {
      allowance: computeFreeAllowance(accountInput),
      legacyAllowance,
      tier: computeFreeTier(accountInput),
      access,
    };
  }

  private static toFreeStatus(
    access: FreeCreditsAccess,
  ): typeof FreeCreditsStatusValue {
    switch (access) {
      case "verifyEmail":
        return FreeCreditsStatus.VERIFY_EMAIL;
      case "subnetLimit":
        return FreeCreditsStatus.SUBNET_LIMIT;
      default:
        return FreeCreditsStatus.ACTIVE;
    }
  }

  /**
   * Guest free credits spent from the signup IP right before signup count
   * once against the new account: one usage row, keyed so it never repeats.
   * Only checked while the account's wallet is young.
   */
  private static async applySignupGuestCarryover(
    pool: CreditPool,
    logger: EndpointLogger,
  ): Promise<void> {
    const userWallet = pool.userWallet;
    const userId = userWallet?.userId;
    if (pool.poolType !== "USER_POOL" || !userWallet || !userId) {
      return;
    }
    const youngForMs = 2 * SIGNUP_GUEST_SPEND_LOOKBACK_HOURS * 3_600_000;
    if (Date.now() - userWallet.createdAt.getTime() > youngForMs) {
      return;
    }
    const grantKey = `free:user:${userId}:signup-carryover`;
    const [done] = await db
      .select({ id: creditTransactions.id })
      .from(creditTransactions)
      .where(sql`${creditTransactions.metadata}->>'grantKey' = ${grantKey}`)
      .limit(1);
    if (done) {
      return;
    }
    const carry = await signupGuestCarryover({
      userId,
      poolLeadIds: pool.leadWallets
        .map((w) => w.leadId)
        .filter((id): id is string => id !== null),
    });
    const target = pool.leadWallets.toSorted(
      (a, b) => a.freePeriodStart.getTime() - b.freePeriodStart.getTime(),
    )[0];
    if (carry <= 0 || !target) {
      return;
    }
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    await db
      .insert(creditTransactions)
      .values({
        walletId: target.id,
        amount: -carry,
        balanceAfter: target.freeCreditsRemaining + userWallet.balance,
        type: CreditTransactionType.USAGE,
        freePeriodId: periodId,
        metadata: {
          cost: carry,
          freeCreditsUsed: carry,
          packCreditsUsed: 0,
          signupCarryover: true,
          grantKey,
        },
      })
      .onConflictDoNothing();
    logger.debug("Counted guest spend from the signup IP against the account", {
      userId,
      carry,
    });
  }

  /**
   * Free credits granted to these lead wallets in the period under the
   * pre-2026-11 tiers (no tierVersion stamp; admin grants excluded).
   */
  private static async sumLegacyFreeGrantedThisPeriod(
    leadWalletIds: string[],
    periodId: string,
  ): Promise<number> {
    if (leadWalletIds.length === 0) {
      return 0;
    }
    const grants = await db
      .select({
        amount: creditTransactions.amount,
        metadata: creditTransactions.metadata,
      })
      .from(creditTransactions)
      .where(
        and(
          inArray(creditTransactions.walletId, leadWalletIds),
          eq(creditTransactions.freePeriodId, periodId),
          eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
        ),
      );
    return grants.reduce(
      (sum, row) =>
        "reason" in row.metadata &&
        row.metadata.reason !== "admin_grant" &&
        !("tierVersion" in row.metadata && row.metadata.tierVersion)
          ? sum + row.amount
          : sum,
      0,
    );
  }

  /**
   * Keep the pool's free credits current and return its monthly allowance.
   * 1. New calendar month -> reset the pool to the allowance.
   * 2. Allowance rose mid-month (signup, newsletter confirmed) -> top up the difference once.
   * 3. Tier cut mid-month -> keep what was already granted until the next refill.
   * The returned allowance is the cap every balance/deduction path must use.
   */
  private static async ensureMonthlyFreeCreditsForPool(
    pool: CreditPool,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<number> {
    return (await CreditRepository.ensurePoolFreeCredits(pool, logger, locale))
      .cap;
  }

  /**
   * ensureMonthlyFreeCreditsForPool + why the pool has (or lacks) its free tiers.
   */
  private static async ensurePoolFreeCredits(
    pool: CreditPool,
    logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars -- kept for call-site stability; allowance no longer depends on locale
    locale: CountryLanguage,
  ): Promise<{ cap: number; access: FreeCreditsAccess }> {
    const { allowance, legacyAllowance, tier, access } =
      await CreditRepository.resolvePoolFreeAllowance(pool, logger);
    await CreditRepository.applySignupGuestCarryover(pool, logger);
    await CreditRepository.resetMonthlyFreeCreditsIfNeeded(
      pool,
      allowance,
      tier,
      logger,
    );
    // Tier cut (2026-11): a pool already granted the old, higher cap this month
    // keeps it until its next monthly refill. Only pools whose tier went down
    // pay for the extra lookup.
    let cap = allowance;
    if (legacyAllowance > allowance) {
      const now = new Date();
      const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      cap = computeGrandfatheredFreeCap({
        allowance,
        legacyAllowance,
        legacyGrantedThisPeriod:
          await CreditRepository.sumLegacyFreeGrantedThisPeriod(
            pool.leadWallets.map((w) => w.id),
            periodId,
          ),
      });
    }
    await CreditRepository.topUpFreeAllowanceForPool(pool, cap, tier, logger);
    return { cap, access };
  }

  /**
   * Stable pool identity for grant idempotency keys: the account, or the guest
   * pool's oldest lead.
   */
  private static poolGrantKey(pool: CreditPool): string {
    const userId = pool.userWallet?.userId;
    if (pool.poolType === "USER_POOL" && userId) {
      return `user:${userId}`;
    }
    const oldest = pool.leadWallets.toSorted(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )[0];
    return `lead:${oldest?.leadId ?? pool.poolId}`;
  }

  /**
   * Top up a pool whose allowance rose mid-period.
   * Adds min(allowance - grantedThisPeriod, allowance - spent - remaining):
   * - bounded by what was already GRANTED this period, so zeroed or spent credits
   *   are never regenerated and repeated calls are idempotent
   * - bounded by what is still owed, so legacy wallets without grant rows never overshoot
   */
  private static async topUpFreeAllowanceForPool(
    pool: CreditPool,
    allowance: number,
    tier: FreeTier,
    logger: EndpointLogger,
  ): Promise<void> {
    const leadWalletIds = pool.leadWallets.map((w) => w.id);
    if (leadWalletIds.length === 0) {
      return;
    }
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const topUpKey = `free:${CreditRepository.poolGrantKey(pool)}:${periodId}:topup-${String(allowance)}`;

    const readTopUp = async (
      tx: Pick<Parameters<Parameters<typeof db.transaction>[0]>[0], "select">,
      lock: boolean,
    ): Promise<{
      topUp: number;
      grantAmount: number;
      target: CreditWallet | undefined;
    }> => {
      const walletsQuery = tx
        .select()
        .from(creditWallets)
        .where(inArray(creditWallets.id, leadWalletIds));
      const wallets = lock
        ? await walletsQuery.for("update")
        : await walletsQuery;
      const periodTxs = await tx
        .select({
          type: creditTransactions.type,
          amount: creditTransactions.amount,
          metadata: creditTransactions.metadata,
        })
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, leadWalletIds),
            eq(creditTransactions.freePeriodId, periodId),
            inArray(creditTransactions.type, [
              CreditTransactionType.USAGE,
              CreditTransactionType.FREE_GRANT,
            ]),
          ),
        );

      let spentThisPeriod = 0;
      let grantedThisPeriod = 0;
      // Highest cap the pool's grants already reached this month (a device's
      // first-visit grant is the guest cap). The grant row states the full tier
      // step (e.g. +50 newsletter) even when the pool's wallets already hold part
      // of it from linked devices; the history's shared-limit row nets that out.
      let reachedCap = 0;
      let alreadyRecorded = false;
      for (const row of periodTxs) {
        const meta = row.metadata;
        if (row.type === CreditTransactionType.USAGE) {
          spentThisPeriod +=
            "freeCreditsUsed" in meta ? (meta.freeCreditsUsed ?? 0) : 0;
        } else if ("reason" in meta && meta.reason !== "admin_grant") {
          grantedThisPeriod += row.amount;
          reachedCap = Math.max(
            reachedCap,
            meta.reason === "initial_grant"
              ? FREE_CREDIT_ALLOWANCE.guest
              : "totalPoolFreeCredits" in meta
                ? (meta.totalPoolFreeCredits ?? row.amount)
                : row.amount,
          );
          if ("grantKey" in meta && meta.grantKey === topUpKey) {
            alreadyRecorded = true;
          }
        }
      }
      const remainingInWallets = wallets.reduce(
        (sum, w) => sum + w.freeCreditsRemaining,
        0,
      );
      const owed = computeFreeTopUp({
        allowance,
        spentThisPeriod,
        remainingInWallets,
      });
      // Grants above the cap already reached (each linked device's first-visit
      // 20, a tier row whose step linked devices already held) are not "given"
      // twice: the zero-regeneration guard only counts up to that cap.
      const effectiveGranted =
        reachedCap > 0
          ? Math.min(grantedThisPeriod, reachedCap)
          : grantedThisPeriod;
      const topUp = Math.max(0, Math.min(allowance - effectiveGranted, owed));
      const tierStep = reachedCap > 0 ? Math.max(0, allowance - reachedCap) : 0;
      const grantAmount = alreadyRecorded ? 0 : Math.max(topUp, tierStep);
      const target = wallets.toSorted(
        (a, b) => a.freePeriodStart.getTime() - b.freePeriodStart.getTime(),
      )[0];
      return { topUp, grantAmount, target };
    };

    // Cheap unlocked check first - the hot path almost always ends here
    const probe = await readTopUp(db, false);
    if (probe.grantAmount <= 0) {
      return;
    }

    await withTransaction(logger, async (tx) => {
      const { topUp, grantAmount, target } = await readTopUp(tx, true);
      if (grantAmount <= 0 || !target) {
        return;
      }
      const freeAfter = target.freeCreditsRemaining + topUp;
      // The grant row goes first: its unique grantKey (pool + month + cap reached)
      // makes a concurrent or repeated top-up a no-op.
      const [grantRow] = await tx
        .insert(creditTransactions)
        .values({
          walletId: target.id,
          amount: grantAmount,
          balanceAfter: freeAfter + (pool.userWallet?.balance ?? 0),
          type: CreditTransactionType.FREE_GRANT,
          freePeriodId: periodId,
          metadata: {
            reason: "allowance_topup",
            tierVersion: FREE_GRANT_TIER_VERSION,
            tier,
            grantKey: topUpKey,
            creditedAmount: topUp,
            freeCreditsRemaining: freeAfter,
            totalPoolFreeCredits: allowance,
          },
        })
        .onConflictDoNothing()
        .returning({ id: creditTransactions.id });
      if (!grantRow || topUp <= 0) {
        return;
      }
      // Compare-and-swap on the value we read: a concurrent top-up or deduction
      // makes this a no-op (retried on the next read) instead of a double grant.
      // Row locks alone are not enough on PGlite, where pooled clients share one session.
      const [swapped] = await tx
        .update(creditWallets)
        .set({ freeCreditsRemaining: freeAfter, updatedAt: now })
        .where(
          and(
            eq(creditWallets.id, target.id),
            eq(creditWallets.freeCreditsRemaining, target.freeCreditsRemaining),
          ),
        )
        .returning({ id: creditWallets.id });
      if (!swapped) {
        await tx
          .delete(creditTransactions)
          .where(eq(creditTransactions.id, grantRow.id));
        return;
      }
      logger.debug("Topped up pool free allowance", {
        poolId: pool.poolId,
        walletId: target.id,
        topUp,
        allowance,
      });
    });
  }

  /**
   * Check and reset monthly free credits for entire pool (pool-aware)
   * Per spec: "When any wallet in pool hits new month: Reset entire pool to its allowance"
   *
   * CRITICAL: Only reset when moving to a NEW period (future month), not when syncing old periods
   * This prevents resetting credits that were already spent in the current period
   */
  private static async resetMonthlyFreeCreditsIfNeeded(
    pool: CreditPool,
    allowance: number,
    tier: FreeTier,
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

    // Jump directly to current month (not just +1) to handle multi-month gaps
    const newPeriodId = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

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

    const maxFreeCreditsPerPool = allowance;

    await withTransaction(logger, async (tx) => {
      // Lock the oldest wallet first and re-check if period was already advanced
      // This prevents TOCTOU double-grants when concurrent requests both see isNewMonth=true
      const [lockedOldest] = await tx
        .select({ freePeriodId: creditWallets.freePeriodId })
        .from(creditWallets)
        .where(eq(creditWallets.id, oldestLeadWallet.id))
        .for("update")
        .limit(1);

      if (lockedOldest && lockedOldest.freePeriodId === newPeriodId) {
        logger.debug("Monthly reset already completed by concurrent request", {
          poolId: pool.poolId,
          freePeriodId: lockedOldest.freePeriodId,
          newPeriodId,
        });
        return;
      }

      // Calculate total pool balance (paid credits from all wallets + new free credits)
      const totalPaidBalance = allWallets.reduce(
        (sum, w) => sum + w.balance,
        0,
      );
      const totalBalanceAfterGrant = totalPaidBalance + maxFreeCreditsPerPool;

      // The month's grant row goes first: its unique grantKey (pool + month)
      // stops a second refill even when another request saw a different
      // oldest wallet for the same pool.
      const [grantRow] = await tx
        .insert(creditTransactions)
        .values({
          walletId: oldestLeadWallet.id,
          amount: maxFreeCreditsPerPool,
          balanceAfter: totalBalanceAfterGrant,
          type: CreditTransactionType.FREE_GRANT,
          freePeriodId: newPeriodId,
          metadata: {
            reason: "monthly_reset",
            tierVersion: FREE_GRANT_TIER_VERSION,
            tier,
            grantKey: `free:${CreditRepository.poolGrantKey(pool)}:${newPeriodId}:monthly`,
            freeCreditsRemaining: maxFreeCreditsPerPool,
            totalPoolFreeCredits: maxFreeCreditsPerPool,
          },
        })
        .onConflictDoNothing()
        .returning({ id: creditTransactions.id });
      if (!grantRow) {
        logger.debug("Monthly grant already recorded for this pool", {
          poolId: pool.poolId,
          newPeriodId,
        });
        return;
      }

      // CRITICAL: ALWAYS reset to exactly the pool allowance when entering new period
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

      // Grant the full allowance to the oldest lead wallet
      await tx
        .update(creditWallets)
        .set({
          freeCreditsRemaining: maxFreeCreditsPerPool,
          updatedAt: now,
        })
        .where(eq(creditWallets.id, oldestLeadWallet.id));

      logger.debug("Pool monthly free credits reset complete", {
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
   * Balance for a logged-out device whose lead is linked to an account.
   * Mirrors deductCredits for a lead-only identifier: free credits come from the
   * account's whole pool (account cap, account-wide spending), paid credits are
   * not spendable without signing in - so they are not shown.
   */
  private static async getLinkedLeadFreeBalance(
    pool: CreditPool,
    leadId: string,
    freeAllowance: number,
    logger: EndpointLogger,
  ): Promise<CreditsGetResponseOutput> {
    const result = await getPoolBalance.call(
      {
        p_user_id: pool.poolId,
        p_lead_id: leadId,
        p_free_cap: freeAllowance,
      },
      logger,
    );
    return {
      total: result.free,
      free: result.free,
      expiring: 0,
      permanent: 0,
      earned: 0,
      expiresAt: null,
      capacity: freeAllowance,
    };
  }

  /**
   * Get balance for identifier
   */
  static async getBalance(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: CreditsT,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    try {
      // Side effects first: ensure wallets exist + monthly reset
      let poolResult: ResponseType<CreditPool>;

      if (!user.isPublic) {
        poolResult = await CreditRepository.getUserPool(
          user.id,
          logger,
          t,
          locale,
        );
      } else if (user.leadId) {
        poolResult = await CreditRepository.getLeadPool(
          user.leadId,
          logger,
          t,
          locale,
        );
      } else {
        return fail({
          message: t("errors.invalidIdentifier"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (!poolResult.success) {
        return poolResult;
      }

      // Monthly free credit reset + tier top-up (side effect - must happen before balance read)
      const { cap: freeAllowance, access } =
        await CreditRepository.ensurePoolFreeCredits(
          poolResult.data,
          logger,
          locale,
        );
      const freeStatus = CreditRepository.toFreeStatus(access);

      if (user.isPublic && poolResult.data.poolType === "USER_POOL") {
        return success({
          ...(await CreditRepository.getLinkedLeadFreeBalance(
            poolResult.data,
            user.leadId,
            freeAllowance,
            logger,
          )),
          freeStatus,
        });
      }

      // Atomic balance calc: expiry + aggregation in one PG call
      const result = await getPoolBalance.call(
        {
          p_user_id: user.isPublic ? null : user.id,
          p_lead_id: user.leadId ?? null,
          p_free_cap: freeAllowance,
        },
        logger,
      );

      return success({
        total: result.total,
        free: result.free,
        expiring: result.expiring,
        permanent: result.permanent,
        earned: result.earned,
        expiresAt: result.expires_at ? new Date(result.expires_at) : null,
        capacity: result.capacity,
        freeStatus,
      });
    } catch (error) {
      logger.error("Failed to get balance", parseError(error), {
        ...user,
      });
      return fail({
        message: t("errors.getBalanceFailed"),
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
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<number>> {
    try {
      // Side effects: ensure wallets exist + monthly reset
      const poolResult = await CreditRepository.getLeadPool(
        leadId,
        logger,
        t,
        locale,
      );
      if (!poolResult.success) {
        return poolResult;
      }

      const freeAllowance =
        await CreditRepository.ensureMonthlyFreeCreditsForPool(
          poolResult.data,
          logger,
          locale,
        );

      // Atomic balance calc in one PG call
      const result = await getPoolBalance.call(
        { p_user_id: null, p_lead_id: leadId, p_free_cap: freeAllowance },
        logger,
      );
      return success(result.total);
    } catch (error) {
      logger.error("Failed to get lead balance", parseError(error), { leadId });
      return fail({
        message: t("errors.getLeadBalanceFailed"),
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
    t: CreditsT,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    try {
      // Side effects first: ensure wallets exist + monthly reset
      let poolResult: ResponseType<CreditPool>;
      if (user.isPublic) {
        // Same pool resolution as deductions: a logged-out device whose lead
        // belongs to an account draws on that account's free allowance.
        poolResult = await CreditRepository.getLeadPool(
          user.leadId,
          logger,
          t,
          locale,
        );
      } else {
        poolResult = await CreditRepository.getUserPool(
          user.id,
          logger,
          t,
          locale,
        );
      }

      if (!poolResult.success) {
        return poolResult;
      }

      // Monthly free credit reset + tier top-up (side effect)
      const { cap: freeAllowance, access } =
        await CreditRepository.ensurePoolFreeCredits(
          poolResult.data,
          logger,
          locale,
        );
      const freeStatus = CreditRepository.toFreeStatus(access);

      if (user.isPublic && poolResult.data.poolType === "USER_POOL") {
        return success({
          ...(await CreditRepository.getLinkedLeadFreeBalance(
            poolResult.data,
            user.leadId,
            freeAllowance,
            logger,
          )),
          freeStatus,
        });
      }

      // Atomic balance calc: expiry + aggregation in one PG call
      const result = await getPoolBalance.call(
        {
          p_user_id: user.isPublic ? null : user.id,
          p_lead_id: user.isPublic ? user.leadId : null,
          p_free_cap: freeAllowance,
        },
        logger,
      );

      return success({
        total: result.total,
        free: result.free,
        expiring: result.expiring,
        permanent: result.permanent,
        earned: result.earned,
        expiresAt: result.expires_at ? new Date(result.expires_at) : null,
        capacity: result.capacity,
        freeStatus,
      });
    } catch (error) {
      logger.error("Failed to get user balance", parseError(error), {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
      });
      return fail({
        message: t("errors.getBalanceFailed"),
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
    t: CreditsT,
  ): Promise<ResponseType<GetOrCreateLeadByIpResult>> {
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
          t,
          locale,
        );
        if (!poolResult.success) {
          return poolResult;
        }

        // Ensure monthly credits are current for pool
        const freeAllowance =
          await CreditRepository.ensureMonthlyFreeCreditsForPool(
            poolResult.data,
            logger,
            locale,
          );

        // Calculate total credits across pool
        const balance = await CreditRepository.calculatePoolBalance(
          poolResult.data,
          freeAllowance,
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
        t,
        locale,
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
        message: t("errors.getOrCreateLeadFailed"),
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
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    // Input validation
    if (amount <= 0) {
      return fail({
        message: t("errors.invalidAmount"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: t("errors.invalidIdentifier"),
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
          t,
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
            t,
          );
        } else {
          // Lead is not linked - use lead wallet
          walletResult = await CreditRepository.getOrCreateLeadWallet(
            identifier.leadId!,
            logger,
            t,
            locale,
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

      // Atomic: insert pack, increment balance, create transaction in one transaction
      await withTransaction(logger, async (tx) => {
        const [newPack] = await tx
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

        // Atomic SQL increment - prevents lost updates from concurrent writes
        const [updated] = await tx
          .update(creditWallets)
          .set({
            balance: sql`${creditWallets.balance} + ${amount}`,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id))
          .returning({ balance: creditWallets.balance });

        const transactionMetadata =
          packType === CreditPackType.SUBSCRIPTION
            ? {
                subscriptionId: `system_add_${Date.now()}`,
                periodStart: new Date().toISOString(),
                periodEnd: expiresAt?.toISOString(),
              }
            : { packQuantity: 1 };

        await tx.insert(creditTransactions).values({
          walletId: wallet.id,
          amount,
          balanceAfter: updated.balance,
          type:
            packType === CreditPackType.SUBSCRIPTION
              ? CreditTransactionType.SUBSCRIPTION
              : CreditTransactionType.PURCHASE,
          packId: newPack.id,
          freePeriodId: wallet.freePeriodId,
          metadata: transactionMetadata,
        });
      });

      logger.debug("Credits added", {
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
        message: t("errors.addCreditsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Pack holding an idempotency key (metadata.sessionId), if any */
  private static async findPackIdBySessionId(
    executor: Pick<typeof db, "select">,
    key: string,
  ): Promise<string | undefined> {
    const [existing] = await executor
      .select({ id: creditPacks.id })
      .from(creditPacks)
      .where(sql`${creditPacks.metadata}->>'sessionId' = ${key}`)
      .limit(1);
    return existing?.id;
  }

  /**
   * Add credits to user account (specific method)
   *
   * Optional sessionId = idempotency key, enforced by the DB: the unique
   * partial index `uq_packs_session_id` on `metadata->>'sessionId'` plus
   * `ON CONFLICT DO NOTHING`. Concurrent callers with the same key (webhook +
   * success redirect + parallel getSubscription safety nets) produce exactly
   * one pack; the losers get `{ granted: false, packId: <existing> }`.
   */
  static async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    t: CreditsT,
    expiresAt?: Date,
    sessionId?: string,
  ): Promise<ResponseType<AddUserCreditsResult>> {
    try {
      // Add to user wallet (credits are pooled across user + linked leads)
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
        t,
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

      // Atomic: insert pack, increment balance, create transaction in one transaction
      const result = await withTransaction(
        logger,
        async (tx): Promise<AddUserCreditsResult | undefined> => {
          // Fast path: key already granted (the common retry / page-load case)
          if (sessionId) {
            const existingId = await CreditRepository.findPackIdBySessionId(
              tx,
              sessionId,
            );
            if (existingId) {
              return { packId: existingId, granted: false };
            }
          }

          // The unique index uq_packs_session_id is the real guard: a
          // concurrent grant with the same key that passed the check above
          // waits on the winner's row and inserts nothing here.
          const [newPack] = await tx
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
            .onConflictDoNothing()
            .returning({ id: creditPacks.id });

          if (!newPack) {
            // Lost the race: nothing was written in this transaction.
            return undefined;
          }

          // Atomic SQL increment - prevents lost updates from concurrent writes
          const [updated] = await tx
            .update(creditWallets)
            .set({
              balance: sql`${creditWallets.balance} + ${amount}`,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, wallet.id))
            .returning({ balance: creditWallets.balance });

          const purchaseMetadata = sessionId
            ? { sessionId, packQuantity: 1, totalPaid: 0, currency: "USD" }
            : { packQuantity: 1 };

          await tx.insert(creditTransactions).values({
            walletId: wallet.id,
            amount,
            balanceAfter: updated.balance,
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
          return { packId: newPack.id, granted: true };
        },
      );

      if (result) {
        if (!result.granted) {
          logger.info("Idempotency: credit pack already exists for session", {
            sessionId,
            existingPackId: result.packId,
            userId,
          });
        }
        return success(result);
      }

      // ON CONFLICT hit: the concurrent winner has committed by now (the
      // insert waited on it), so a fresh statement sees its pack.
      const winnerId = sessionId
        ? await CreditRepository.findPackIdBySessionId(db, sessionId)
        : undefined;
      if (!winnerId) {
        logger.error("Credit grant conflicted but no existing pack found", {
          sessionId,
          userId,
        });
        return fail({
          message: t("errors.addCreditsFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      logger.info("Idempotency: concurrent credit grant deduplicated", {
        sessionId,
        existingPackId: winnerId,
        userId,
      });
      return success({ packId: winnerId, granted: false });
    } catch (error) {
      logger.error("Failed to add user credits", parseError(error), {
        userId,
        amount,
        type,
      });
      return fail({
        message: t("errors.addCreditsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits with priority: free credits → expiring paid credits → permanent paid credits
   * Max pool-allowance free credits can be spent per pool per period
   * Uses database transaction with row locking to prevent race conditions
   */
  private static async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId:
      | ChatModelId
      | ImageVisionModelId
      | VideoVisionModelId
      | AudioVisionModelId
      | undefined,
    feature: string | undefined,
    messageId: string,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
    allowPartial = false, //  allow deducting less than requested
    upstreamCost?: UsageUpstreamCost,
  ): Promise<ResponseType<DeductCreditsResult>> {
    // Round amount to 6 decimal places to avoid floating point precision artifacts
    const roundedAmount = Math.round(amount * 1_000_000) / 1_000_000;

    // Input validation
    if (roundedAmount <= 0) {
      return fail({
        message: t("errors.invalidAmount"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (!identifier.userId && !identifier.leadId) {
      return fail({
        message: t("errors.invalidIdentifier"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Use rounded amount for all further calculations
    amount = roundedAmount;

    try {
      // Get pool for this identifier
      let poolResult: ResponseType<CreditPool>;
      let currentLeadId: string | undefined;

      if (identifier.userId) {
        poolResult = await CreditRepository.getUserPool(
          identifier.userId,
          logger,
          t,
          locale,
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
          t,
          locale,
        );
        currentLeadId = identifier.leadId;
      }

      if (!poolResult.success) {
        return poolResult;
      }

      let pool = poolResult.data;

      // For authenticated users: ensure the current session's lead wallet is included
      // in the pool even if the lead isn't yet in userLeadLinks (e.g. new session
      // before the link is established). Without this, each unlinked lead gets its own
      // independent free allowance, bypassing the pool cap entirely.
      if (identifier.userId && identifier.leadId) {
        const currentLeadAlreadyInPool = pool.leadWallets.some(
          (w) => w.leadId === identifier.leadId,
        );
        if (!currentLeadAlreadyInPool) {
          const [currentLeadWallet] = await db
            .select()
            .from(creditWallets)
            .where(eq(creditWallets.leadId, identifier.leadId))
            .limit(1);
          if (currentLeadWallet) {
            pool = {
              ...pool,
              leadWallets: [...pool.leadWallets, currentLeadWallet],
            };
          }
        }
      }

      // AUTOMATIC EXPIRATION: Expire old credits before deducting
      const walletIds = [
        pool.userWallet?.id,
        ...pool.leadWallets.map((w) => w.id),
      ].filter((id): id is string => id !== undefined);
      await CreditRepository.expireExpiredCreditsForWallets(walletIds, logger);

      // Ensure monthly credits are current for ENTIRE pool (pool-aware reset + tier top-up)
      const freeAllowance =
        await CreditRepository.ensureMonthlyFreeCreditsForPool(
          pool,
          logger,
          locale,
        );

      // Global daily cap check for free-tier pools (no paid credits anywhere)
      const isFreeTierPool =
        (pool.userWallet?.balance ?? 0) === 0 &&
        pool.leadWallets.every((w) => w.balance === 0);
      // Model usage (allowPartial) is gated BEFORE generation by gateFreeTierCap; a
      // post-generation rejection would only hand out the generation for free.
      // Tools/features are billed up-front here, so gate them in this path.
      let capIpAddress: string | undefined;
      if (isFreeTierPool && currentLeadId) {
        const [capLead] = await db
          .select({ ipAddress: leads.ipAddress })
          .from(leads)
          .where(eq(leads.id, currentLeadId))
          .limit(1);
        capIpAddress = capLead?.ipAddress ?? undefined;
      }
      if (isFreeTierPool && !allowPartial) {
        const capCheck = await PublicCapRepository.gate(
          {
            leadId: currentLeadId,
            ipAddress: capIpAddress,
            expectedCost: amount,
            model: feature ?? "feature",
          },
          logger,
          locale,
        );
        if (!capCheck.success) {
          return capCheck;
        }
      }

      // Determine which wallets to deduct from based on user type
      let walletsForDeduction: CreditWallet[];

      if (identifier.userId && pool.userWallet) {
        // Authenticated user: ALL lead wallets in pool (free credits are shared) + user wallet
        walletsForDeduction = [...pool.leadWallets, pool.userWallet];
      } else {
        // Public user: only lead wallets (no paid credits)
        walletsForDeduction = pool.leadWallets;
      }

      // Tracks how much of this deduction came from the FREE pool (STEP 1).
      // The public free-tier cap must count only free credits spent, never paid
      // pack/subscription spend — otherwise paid usage inflates the cap counter
      // and can wrongly block free users. (withTransaction does not retry, so a
      // single-pass accumulator is safe.)
      let freeCreditsDeducted = 0;
      // Execute deduction within a transaction for atomicity
      const result = await withTransaction(logger, async (tx) => {
        let remaining = amount;

        // Enforce pool limit: max `freeAllowance` free credits can be spent per period
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
            (sum, txn) => {
              const metadata = txn.metadata as {
                freeCreditsUsed?: number;
              } | null;
              return sum + (metadata?.freeCreditsUsed || 0);
            },
            0,
          );

          // Re-fetch lead wallets inside transaction with FOR UPDATE to prevent
          // concurrent over-spending of free credits across the pool
          const freshLeadWallets = await tx
            .select({
              freeCreditsRemaining: creditWallets.freeCreditsRemaining,
            })
            .from(creditWallets)
            .where(inArray(creditWallets.id, leadWalletIds))
            .for("update");
          const actualFreeRemaining = freshLeadWallets.reduce(
            (sum, w) => sum + w.freeCreditsRemaining,
            0,
          );
          // Cap uses BOTH wallet balance AND transaction history.
          // After a pool merge, two leads may each have remaining free credits
          // but their combined period spending already exceeds the pool limit.
          // Example: lead A spent 15, lead B spent 15 → 30 spent total → 0 available,
          // even though wallets still show freeCreditsRemaining > 0.
          const freeCreditsAvailableInPool = computeFreeAvailable({
            allowance: freeAllowance,
            spentThisPeriod: freeCreditsSpentThisPeriod,
            remainingInWallets: actualFreeRemaining,
          });

          logger.debug("Pool free credit limit check", {
            poolId: pool.poolId,
            currentPeriodId,
            freeCreditsSpentThisPeriod,
            freeCreditsAvailableInPool,
            requestedAmount: amount,
          });

          // STEP 1: Deduct from free credits FIRST
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
            // balanceAfter = remaining free in this wallet + user wallet's paid balance
            // This gives the user a meaningful "total credits after" value in history
            const freeAfter = lockedWallet.freeCreditsRemaining - deduction;
            const paidBalance = pool.userWallet?.balance ?? 0;
            await tx.insert(creditTransactions).values({
              walletId: lockedWallet.id,
              amount: -deduction,
              balanceAfter: freeAfter + paidBalance,
              type: CreditTransactionType.USAGE,
              modelId,
              feature,
              messageId,
              freePeriodId: lockedWallet.freePeriodId,
              metadata: {
                cost: amount,
                messageId,
                ...upstreamCost,
                freeCreditsUsed: deduction,
                packCreditsUsed: 0,
                ...(currentLeadId ? { actorLeadId: currentLeadId } : {}),
              },
            });

            remaining -= deduction;
            freeCreditsToDeduct -= deduction;
            freeCreditsDeducted += deduction;
          }
        }

        // STEP 2: Deduct from expiring subscription credits
        if (remaining > 0 && pool.userWallet) {
          const expiringWalletIds = [pool.userWallet.id];
          const expiringPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, expiringWalletIds),
                eq(creditPacks.type, CreditPackType.SUBSCRIPTION),
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

            // Update wallet balance
            await tx
              .update(creditWallets)
              .set({
                balance: sql`GREATEST(0, ${creditWallets.balance} - ${deduction})`,
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

            // Record transaction before modifying/deleting pack (FK constraint)
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
                ...upstreamCost,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            // Delete or update pack after transaction is recorded
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

            remaining -= deduction;
          }
        }

        // STEP 3: Deduct from earned credits (referral rewards)
        if (remaining > 0 && pool.userWallet) {
          const earnedWalletIds = [pool.userWallet.id];
          const earnedPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, earnedWalletIds),
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

            // Update wallet balance
            await tx
              .update(creditWallets)
              .set({
                balance: sql`GREATEST(0, ${creditWallets.balance} - ${deduction})`,
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

            // Record transaction before modifying/deleting pack (FK constraint)
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
                ...upstreamCost,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            // Delete or update pack after transaction is recorded
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

            remaining -= deduction;
          }
        }

        // STEP 4: Deduct from permanent purchased credits (LAST - never expire)
        if (remaining > 0 && pool.userWallet) {
          const permanentWalletIds = [pool.userWallet.id];
          const permanentPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                inArray(creditPacks.walletId, permanentWalletIds),
                or(
                  eq(creditPacks.type, CreditPackType.PERMANENT),
                  eq(creditPacks.type, CreditPackType.BONUS),
                ),
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

            // Update wallet balance
            await tx
              .update(creditWallets)
              .set({
                balance: sql`GREATEST(0, ${creditWallets.balance} - ${deduction})`,
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

            // Record transaction before modifying/deleting pack (FK constraint)
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
                ...upstreamCost,
                freeCreditsUsed: 0,
                packCreditsUsed: deduction,
              },
            });

            // Delete or update pack after transaction is recorded
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
            // Return partial flag so callers can propagate it
            return success({ partial: true });
          }
          // For tools/endpoints: insufficient credits, rollback without creating record
          const availableCredits = [
            ...(pool.userWallet ? [pool.userWallet] : []),
            ...pool.leadWallets,
          ].reduce(
            (sum, wallet) =>
              sum + wallet.balance + (wallet.freeCreditsRemaining ?? 0),
            0,
          );

          logger.warn("Insufficient credits for tool/endpoint", {
            requested: amount,
            available: availableCredits,
            poolId: pool.poolId,
            feature,
          });
          return fail({
            message: t("errors.insufficientCredits", { cost: amount }),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
        }

        return success({ partial: false });
      });

      if (!result.success) {
        return result;
      }

      logger.debug("Credits deducted from pool", {
        poolId: pool.poolId,
        poolType: pool.poolType,
        amount,
        walletCount: walletsForDeduction.length,
        partial: result.data.partial,
      });

      // Count ONLY the free credits actually spent against the public cap —
      // never paid pack/subscription spend (which would inflate the counter and
      // can wrongly block free users). Fire-and-forget: the increment is a
      // single atomic UPDATE (no lost updates), but we don't block the response
      // on it — keeps the hot path lean. incrementSpend swallows its own errors,
      // so no unhandled rejection. A not-yet-applied increment widens overshoot
      // slightly, which is acceptable (bounded, "slight overshoot is fine").
      if (freeCreditsDeducted > 0) {
        void PublicCapRepository.incrementSpend(freeCreditsDeducted, logger, {
          leadId: currentLeadId,
          ipAddress: capIpAddress,
        });
      }

      return success({ partial: result.data.partial });
    } catch (error) {
      logger.error("Failed to deduct credits", parseError(error), {
        ...identifier,
        amount,
      });
      return fail({
        message: t("errors.deductCreditsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Transaction history for an account.
   *
   * Shows:
   * - every free grant of the account's pool (monthly refill, tier upgrades,
   *   newsletter bonus): grants belong to the pool, not to one device
   * - this device's lead wallet + the user wallet (paid), itemized
   * - free credits spent this month on the pool's other devices, as one
   *   "Used on another device" row, so the balance is explainable from history
   * Admin views (readOnly) never create wallets or grants.
   */
  private static async getTransactions(
    userId: string,
    leadId: string | undefined,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
    readOnly: boolean,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      const poolResult = readOnly
        ? await CreditRepository.getUserPoolReadOnly(userId, logger, t)
        : await CreditRepository.getUserPool(userId, logger, t, locale);
      if (!poolResult.success) {
        return poolResult;
      }
      const cap = readOnly
        ? null
        : await CreditRepository.ensurePoolGrantVisible(
            poolResult.data,
            logger,
            locale,
          );
      const pool = readOnly
        ? poolResult.data
        : await CreditRepository.refetchPoolWallets(poolResult.data);
      if (!pool.userWallet) {
        return success({ transactions: [], totalCount: 0 });
      }

      // This device = its lead wallet + the account's paid wallet.
      // No specific lead (admin view of an account): every wallet is "own".
      const currentLeadWallet = leadId
        ? pool.leadWallets.find((w) => w.leadId === leadId)
        : undefined;
      const ownWalletIds = leadId
        ? [
            pool.userWallet.id,
            ...(currentLeadWallet ? [currentLeadWallet.id] : []),
          ]
        : [pool.userWallet.id, ...pool.leadWallets.map((w) => w.id)];

      return success(
        await CreditRepository.buildPoolHistory({
          pool,
          ownWalletIds,
          ownLeadIds: leadId
            ? [leadId]
            : pool.leadWallets
                .map((w) => w.leadId)
                .filter((id): id is string => id !== null),
          othersLabel: t("historyLabels.otherDevices"),
          summaryBalance: pool.userWallet.balance,
          cap,
          limit,
          offset,
          t,
        }),
      );
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { userId });
      return fail({
        message: t("errors.getTransactionsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Keep the pool's grants current (monthly refill, tier top-up) and make sure
   * this month's free credits have a grant row to show (pools refilled before
   * grants were logged get one recorded, without changing any balance).
   */
  private static async ensurePoolGrantVisible(
    pool: CreditPool,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<number> {
    const cap = await CreditRepository.ensureMonthlyFreeCreditsForPool(
      pool,
      logger,
      locale,
    );
    const leadWalletIds = pool.leadWallets.map((w) => w.id);
    if (leadWalletIds.length === 0) {
      return cap;
    }
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const periodTxs = await db
      .select({
        type: creditTransactions.type,
        metadata: creditTransactions.metadata,
      })
      .from(creditTransactions)
      .where(
        and(
          inArray(creditTransactions.walletId, leadWalletIds),
          eq(creditTransactions.freePeriodId, periodId),
          inArray(creditTransactions.type, [
            CreditTransactionType.USAGE,
            CreditTransactionType.FREE_GRANT,
          ]),
        ),
      );
    if (periodTxs.some((r) => r.type === CreditTransactionType.FREE_GRANT)) {
      return cap;
    }
    const spent = periodTxs.reduce(
      (sum, r) =>
        sum +
        ("freeCreditsUsed" in r.metadata
          ? (r.metadata.freeCreditsUsed ?? 0)
          : 0),
      0,
    );
    const wallets = await db
      .select()
      .from(creditWallets)
      .where(inArray(creditWallets.id, leadWalletIds));
    const remaining = wallets.reduce(
      (sum, w) => sum + w.freeCreditsRemaining,
      0,
    );
    const amount = Math.min(cap, spent + remaining);
    const target = wallets.toSorted(
      (a, b) => a.freePeriodStart.getTime() - b.freePeriodStart.getTime(),
    )[0];
    if (amount <= 0 || !target) {
      return cap;
    }
    // Same grantKey as the monthly refill: never both for one pool + month.
    // No tierVersion: these credits were granted by the pre-logging code.
    await db
      .insert(creditTransactions)
      .values({
        walletId: target.id,
        amount,
        balanceAfter: remaining + (pool.userWallet?.balance ?? 0),
        type: CreditTransactionType.FREE_GRANT,
        freePeriodId: periodId,
        metadata: {
          reason: "monthly_reset",
          grantKey: `free:${CreditRepository.poolGrantKey(pool)}:${periodId}:monthly`,
          freeCreditsRemaining: remaining,
          totalPoolFreeCredits: cap,
        },
      })
      .onConflictDoNothing();
    return cap;
  }

  /** Re-read the pool's wallets after grants changed them */
  private static async refetchPoolWallets(
    pool: CreditPool,
  ): Promise<CreditPool> {
    const walletIds = [
      ...(pool.userWallet ? [pool.userWallet.id] : []),
      ...pool.leadWallets.map((w) => w.id),
    ];
    if (walletIds.length === 0) {
      return pool;
    }
    const fresh = await db
      .select()
      .from(creditWallets)
      .where(inArray(creditWallets.id, walletIds));
    return {
      ...pool,
      userWallet: pool.userWallet
        ? (fresh.find((w) => w.id === pool.userWallet?.id) ?? pool.userWallet)
        : null,
      leadWallets: fresh.filter((w) => w.leadId !== null),
    };
  }

  /**
   * History label for a free grant, from what it was granted for.
   */
  private static freeGrantLabel(
    metadata: CreditTransactionMetadata,
    t: CreditsT,
  ): string | null {
    if (!("reason" in metadata)) {
      return null;
    }
    const tier = "tier" in metadata ? metadata.tier : undefined;
    switch (metadata.reason) {
      case "initial_grant":
        return t("historyLabels.freeGuest");
      case "monthly_reset":
        return tier === "guest"
          ? t("historyLabels.monthlyGuest")
          : tier === "account"
            ? t("historyLabels.monthlyAccount")
            : tier === "accountNewsletter"
              ? t("historyLabels.monthlyAccountNewsletter")
              : t("historyLabels.monthly");
      case "allowance_topup":
        return tier === "accountNewsletter"
          ? t("historyLabels.newsletterBonus")
          : tier === "account"
            ? t("historyLabels.accountUpgrade")
            : t("historyLabels.freeGuest");
      default:
        return null;
    }
  }

  /**
   * One page of pool history: own wallets itemized, every pool grant, and this
   * month's spending on the pool's other wallets as one summary row (page 1).
   */
  private static async buildPoolHistory({
    pool,
    ownWalletIds,
    ownLeadIds,
    othersLabel,
    summaryBalance,
    cap,
    limit,
    offset,
    t,
  }: {
    pool: CreditPool;
    /** Wallets whose rows are this viewer's own (paid wallet, this device) */
    ownWalletIds: string[];
    /** Devices whose spending is this viewer's own (usage metadata.actorLeadId) */
    ownLeadIds: string[];
    othersLabel: string;
    /** Paid credits this viewer can spend (0 for a logged-out device) */
    summaryBalance: number;
    /** The pool's cap this month; null skips the shared-limit row (admin reads) */
    cap: number | null;
    limit: number;
    offset: number;
    t: CreditsT;
  }): Promise<{ transactions: CreditTransactionOutput[]; totalCount: number }> {
    const now = new Date();
    const periodId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const poolLeadWalletIds = pool.leadWallets.map((w) => w.id);
    const poolWalletIds = [
      ...(pool.userWallet ? [pool.userWallet.id] : []),
      ...poolLeadWalletIds,
    ];

    // Free credits are drawn from whichever pool wallet holds them, so a usage
    // row belongs to the device that spent it (actorLeadId), not its wallet.
    const actor = sql`(${creditTransactions.metadata}->>'actorLeadId')`;
    const byOwnDevice =
      ownLeadIds.length > 0
        ? sql`COALESCE(${actor} IN (${sql.join(
            ownLeadIds.map((id) => sql`${id}`),
            sql`, `,
          )}), false)`
        : sql`false`;
    const ownRow = or(
      and(
        inArray(creditTransactions.walletId, ownWalletIds),
        or(sql`${actor} IS NULL`, byOwnDevice),
      ),
      and(inArray(creditTransactions.walletId, poolWalletIds), byOwnDevice),
      // Guest spend before signup belongs to the account itself
      and(
        inArray(creditTransactions.walletId, poolWalletIds),
        sql`(${creditTransactions.metadata}->>'signupCarryover') = 'true'`,
      ),
    );

    // This month's free-credit usage across the pool, split own / other devices
    const periodUsage =
      poolLeadWalletIds.length > 0
        ? await db
            .select({
              amount: creditTransactions.amount,
              createdAt: creditTransactions.createdAt,
              metadata: creditTransactions.metadata,
              isOwn: sql<boolean>`COALESCE(${ownRow ?? sql`false`}, false)`,
            })
            .from(creditTransactions)
            .where(
              and(
                inArray(creditTransactions.walletId, poolLeadWalletIds),
                eq(creditTransactions.freePeriodId, periodId),
                eq(creditTransactions.type, CreditTransactionType.USAGE),
              ),
            )
        : [];
    const otherUsage = periodUsage.filter((r) => !r.isOwn);
    const freeSpentThisPeriod = periodUsage.reduce(
      (sum, r) =>
        sum +
        ("freeCreditsUsed" in r.metadata
          ? (r.metadata.freeCreditsUsed ?? 0)
          : 0),
      0,
    );

    // Every device's first-visit grant is logged, but linked devices share ONE
    // monthly cap: what was granted above it this month is not spendable.
    let overCap = 0;
    let lastGrantAt: Date | null = null;
    if (cap !== null && poolLeadWalletIds.length > 0) {
      const grants = await db
        .select({
          amount: creditTransactions.amount,
          metadata: creditTransactions.metadata,
          createdAt: creditTransactions.createdAt,
        })
        .from(creditTransactions)
        .where(
          and(
            inArray(creditTransactions.walletId, poolLeadWalletIds),
            eq(creditTransactions.freePeriodId, periodId),
            eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
          ),
        );
      let granted = 0;
      for (const g of grants) {
        if ("reason" in g.metadata && g.metadata.reason !== "admin_grant") {
          granted += g.amount;
          if (lastGrantAt === null || g.createdAt > lastGrantAt) {
            lastGrantAt = g.createdAt;
          }
        }
      }
      overCap = Math.max(0, granted - cap);
    }
    const otherSpending =
      Math.round(
        otherUsage.reduce((sum, r) => sum + Math.abs(r.amount), 0) * 1_000_000,
      ) / 1_000_000;
    const lastOtherUse = otherUsage.reduce<Date | null>(
      (latest, r) =>
        latest === null || r.createdAt > latest ? r.createdAt : latest,
      null,
    );

    const syntheticCount = (otherSpending > 0 ? 1 : 0) + (overCap > 0 ? 1 : 0);
    const adjustedOffset =
      offset > 0 ? Math.max(0, offset - syntheticCount) : offset;
    const adjustedLimit = offset === 0 ? limit - syntheticCount : limit;

    const visible = or(
      ownRow,
      poolLeadWalletIds.length > 0
        ? and(
            inArray(creditTransactions.walletId, poolLeadWalletIds),
            eq(creditTransactions.type, CreditTransactionType.FREE_GRANT),
          )
        : undefined,
    );

    const transactions = await db
      .select()
      .from(creditTransactions)
      .where(visible)
      .orderBy(desc(creditTransactions.createdAt))
      .limit(adjustedLimit)
      .offset(adjustedOffset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(creditTransactions)
      .where(visible);

    const result: CreditTransactionOutput[] = transactions.map(
      (transaction) => {
        const grantLabel =
          transaction.type === CreditTransactionType.FREE_GRANT
            ? CreditRepository.freeGrantLabel(transaction.metadata, t)
            : "signupCarryover" in transaction.metadata &&
                transaction.metadata.signupCarryover
              ? t("historyLabels.signupCarryover")
              : null;
        const featureLabel = CreditRepository.getFetaureLabel(
          transaction.modelId,
          transaction.feature,
        );
        return {
          id: transaction.id,
          amount: transaction.amount,
          balanceAfter: transaction.balanceAfter,
          type:
            grantLabel ??
            (featureLabel
              ? `${t(transaction.type)} (${featureLabel})`
              : t(transaction.type)),
          modelId: transaction.modelId,
          messageId: transaction.messageId,
          createdAt: transaction.createdAt,
        };
      },
    );

    // Synthetic rows sit at the top of page 1: "balance after" = balance now
    const balanceNow =
      summaryBalance +
      (cap === null
        ? 0
        : computeFreeAvailable({
            allowance: cap,
            spentThisPeriod: freeSpentThisPeriod,
            remainingInWallets: pool.leadWallets.reduce(
              (sum, w) => sum + w.freeCreditsRemaining,
              0,
            ),
          }));
    if (offset === 0 && overCap > 0) {
      result.unshift({
        id: "shared-limit-adjustment",
        amount: -overCap,
        balanceAfter: balanceNow,
        type: t("historyLabels.sharedLimit"),
        messageId: null,
        createdAt: lastGrantAt ?? now,
      });
    }
    if (offset === 0 && otherSpending > 0) {
      result.unshift({
        id: "other-devices-summary",
        amount: -otherSpending,
        balanceAfter: balanceNow,
        type: othersLabel,
        messageId: null,
        createdAt: lastOtherUse ?? now,
      });
    }

    return {
      transactions: result,
      totalCount: Number(count) + syntheticCount,
    };
  }

  private static getFetaureLabel(
    modelId:
      | ChatModelId
      | ImageVisionModelId
      | VideoVisionModelId
      | AudioVisionModelId
      | null,
    featureName: string | null,
  ): string | null {
    // Vision model IDs are a subset of ChatModelId string values,
    // so chatModelOptionsIndex covers all cases (chat + vision).
    return modelId
      ? (chatModelOptionsIndex[modelId]?.name ?? featureName)
      : featureName;
  }

  /**
   * Get transaction history (unified method for route handler)
   * Handles both authenticated users and public users
   */
  static async getTransactionHistory(
    data: CreditsHistoryGetRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditsHistoryGetResponseOutput>> {
    const { page, limit } = data.paginationInfo;
    const offset = (page - 1) * limit;

    // Only admins may use targetUserId / targetLeadId to view another entity's history
    const isAdmin = user.isPublic
      ? false
      : ((user.roles?.includes(UserRole.ADMIN) &&
          (data.targetLeadId ?? data.targetUserId)) ??
        false);
    // When admin views a specific user, use the target lead if provided,
    // otherwise undefined means show all leads in the user's pool
    const effectiveLeadId = isAdmin ? data.targetLeadId : user.leadId;
    const effectiveUserId =
      (isAdmin ? data.targetUserId : user.id) || undefined;

    const result =
      effectiveUserId !== undefined
        ? await CreditRepository.getTransactions(
            effectiveUserId,
            effectiveLeadId,
            limit,
            offset,
            logger,
            t,
            locale,
            Boolean(isAdmin),
          )
        : effectiveLeadId !== undefined
          ? await CreditRepository.getTransactionsByLeadId(
              effectiveLeadId,
              limit,
              offset,
              logger,
              t,
              locale,
              Boolean(isAdmin),
            )
          : fail({
              message: t("errors.invalidIdentifier"),
              errorType: ErrorResponseTypes.BAD_REQUEST,
            });

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
   * Transaction history for a logged-out device.
   * Shows this device's own transactions and every grant of the pool it draws
   * on. When that pool belongs to an account (the device was linked to it),
   * the account's spending elsewhere shows as "Used by the linked account";
   * for a guest pool it shows as "Used on another device". The account's paid
   * transactions are never shown without signing in.
   */
  private static async getTransactionsByLeadId(
    leadId: string | undefined,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
    readOnly: boolean,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      if (!leadId) {
        return fail({
          message: t("errors.invalidIdentifier"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      // Same pool as balance and deductions (may be the owning account's pool)
      const poolResult = await CreditRepository.getLeadPool(
        leadId,
        logger,
        t,
        locale,
      );
      if (!poolResult.success) {
        return poolResult;
      }
      const cap = readOnly
        ? null
        : await CreditRepository.ensurePoolGrantVisible(
            poolResult.data,
            logger,
            locale,
          );
      const pool = await CreditRepository.refetchPoolWallets(poolResult.data);

      const currentWallet = pool.leadWallets.find((w) => w.leadId === leadId);
      if (!currentWallet) {
        return success({ transactions: [], totalCount: 0 });
      }

      return success(
        await CreditRepository.buildPoolHistory({
          pool,
          ownWalletIds: [currentWallet.id],
          ownLeadIds: [leadId],
          othersLabel:
            pool.poolType === "USER_POOL"
              ? t("historyLabels.linkedAccount")
              : t("historyLabels.otherDevices"),
          summaryBalance: 0,
          cap,
          limit,
          offset,
          t,
        }),
      );
    } catch (error) {
      logger.error("Failed to get transactions", parseError(error), { leadId });
      return fail({
        message: t("errors.getTransactionsFailed"),
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
    t: CreditsT,
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
              // Lock wallet to prevent concurrent modifications
              const [wallet] = await tx
                .select()
                .from(creditWallets)
                .where(eq(creditWallets.id, pack.walletId))
                .for("update")
                .limit(1);

              if (wallet) {
                // Atomic balance update with floor
                await tx
                  .update(creditWallets)
                  .set({
                    balance: sql`GREATEST(0, ${creditWallets.balance} - ${pack.remaining})`,
                    updatedAt: new Date(),
                  })
                  .where(eq(creditWallets.id, wallet.id));

                // Re-read for accurate balanceAfter
                const [updated] = await tx
                  .select({ balance: creditWallets.balance })
                  .from(creditWallets)
                  .where(eq(creditWallets.id, wallet.id));

                // Create EXPIRY transaction (preserves history)
                await tx.insert(creditTransactions).values({
                  walletId: wallet.id,
                  amount: -pack.remaining,
                  balanceAfter: updated?.balance ?? 0,
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
        message: t("errors.expireCreditsFailed"),
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
    t: CreditsT,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
  ): Promise<ResponseType<DeductForModelResult>> {
    if (cost <= 0) {
      logger.debug("Skipping credit deduction - zero or negative cost", {
        feature,
        cost,
      });
      return success({});
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
        return fail({
          message: t("errors.getCreditIdentifierFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
        feature,
        creditMessageId,
        logger,
        t,
        locale,
      );

      if (!result.success) {
        logger.error(`Failed to deduct credits for ${feature}`, {
          ...identifier,
          cost,
          reason: result.message,
        });
        return fail({
          message: t("errors.deductionFailed", { cost }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      logger.debug(`Credits deducted for ${feature}`, {
        ...identifier,
        cost,
        messageId: creditMessageId,
      });

      CreditRepository.emitBalanceUpdate(user, logger, t, locale);
      return success({ messageId: creditMessageId });
    } catch (error) {
      logger.error(`Error deducting credits for ${feature}`, {
        error: error instanceof Error ? error.message : String(error),
        cost,
      });
      return fail({
        message: t("errors.deductionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits for TTS (graceful - allows partial deduction to 0)
   */
  static async deductCreditsForTTS(
    user: JwtPayloadType,
    cost: number,
    logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
    t: CreditsT,
  ): Promise<ResponseType<DeductForModelResult>> {
    if (cost <= 0) {
      logger.debug("Skipping TTS credit deduction - zero cost", { cost });
      return success({});
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
        return fail({
          message: t("errors.getCreditIdentifierFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
        t("repository.tts"),
        creditMessageId,
        logger,
        t,
        locale,
        true, // allowPartial = true for TTS
      );

      if (!result.success) {
        logger.warn("TTS credit deduction failed", {
          ...identifier,
          cost,
        });
        return fail({
          message: t("errors.deductionFailed", { cost }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      const partialDeduction = result.data?.partial ?? false;
      logger.debug("TTS credits deducted", {
        ...identifier,
        cost,
        messageId: creditMessageId,
        partialDeduction,
      });

      CreditRepository.emitBalanceUpdate(user, logger, t, locale);
      return success({ messageId: creditMessageId, partialDeduction });
    } catch (error) {
      logger.error("Failed to deduct TTS credits", parseError(error), {
        cost,
      });
      return fail({
        message: t("errors.deductionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits for STT (graceful - allows partial deduction to 0)
   */
  static async deductCreditsForSTT(
    user: JwtPayloadType,
    cost: number,
    logger: EndpointLogger,
    t: CreditsT,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
  ): Promise<ResponseType<DeductForModelResult>> {
    if (cost <= 0) {
      logger.debug("Skipping STT credit deduction - zero cost", { cost });
      return success({});
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
        return fail({
          message: t("errors.getCreditIdentifierFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        undefined,
        t("repository.stt"),
        creditMessageId,
        logger,
        t,
        locale,
        true, // allowPartial = true for STT
      );

      if (!result.success) {
        logger.warn("STT credit deduction failed", {
          ...identifier,
          cost,
        });
        return fail({
          message: t("errors.deductionFailed", { cost }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      const partialDeduction = result.data?.partial ?? false;
      logger.debug("STT credits deducted", {
        ...identifier,
        cost,
        messageId: creditMessageId,
        partialDeduction,
      });

      CreditRepository.emitBalanceUpdate(user, logger, t, locale);
      return success({ messageId: creditMessageId, partialDeduction });
    } catch (error) {
      logger.error("Failed to deduct STT credits", parseError(error), {
        cost,
      });
      return fail({
        message: t("errors.deductionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
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
    model:
      | ChatModelId
      | ImageVisionModelId
      | VideoVisionModelId
      | AudioVisionModelId,
    logger: EndpointLogger,
    t: CreditsT,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
    /** Real upstream cost behind this charge (OpenRouter), for reconciliation. */
    upstreamCost?: UsageUpstreamCost,
  ): Promise<ResponseType<DeductForModelResult>> {
    if (cost <= 0) {
      logger.debug("Skipping credit deduction - zero or negative cost", {
        model,
        cost,
      });
      return success({});
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
        return fail({
          message: t("errors.getCreditIdentifierFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Call internal deduct method with allowPartial=true for model usage
      const result = await CreditRepository.deductCredits(
        identifier,
        cost,
        model,
        undefined,
        creditMessageId,
        logger,
        t,
        locale,
        true, // Allow partial deduction for model usage
        upstreamCost,
      );

      if (!result.success) {
        // deductCredits has several silent fail paths (invalid amount, missing
        // identifier, pool/wallet lookup failures inside the transaction);
        // without the underlying reason this warning is not diagnosable.
        logger.warn(`Model usage: Credit deduction failed`, {
          ...identifier,
          requestedCost: cost,
          model,
          reason: result.message,
          errorType: result.errorType.errorKey,
          cause: result.cause?.message ?? null,
        });
        return fail({
          message: t("errors.deductionFailed", { cost }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }

      const partialDeduction = result.data?.partial ?? false;
      if (partialDeduction) {
        logger.debug(
          `Model usage: Partial credit deduction (insufficient funds, deducted to 0)`,
          {
            ...identifier,
            requestedCost: cost,
            model,
          },
        );
      }

      logger.debug(`Credits deducted for model usage`, {
        ...identifier,
        cost,
        model,
        messageId: creditMessageId,
        partialDeduction,
      });

      CreditRepository.emitBalanceUpdate(user, logger, t, locale);
      return success({ messageId: creditMessageId, partialDeduction });
    } catch (error) {
      logger.error(`Error deducting credits for model`, {
        error: error instanceof Error ? error.message : String(error),
        cost,
        model,
      });
      return fail({
        message: t("errors.deductionFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Handle credit pack purchase from webhook
   * CRITICAL: Includes idempotency check to prevent duplicate credit additions
   */
  static async handleCreditPackPurchase(
    session: CreditPackCheckoutSession,
    logger: EndpointLogger,
    t: CreditsT,
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
        t,
        undefined, // no expiration for permanent packs
        session.id, // sessionId for idempotency tracking
      );

      if (!result.success) {
        logger.error("Failed to add credits after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });
      } else if (!result.data.granted) {
        // A concurrent path (webhook vs success redirect) granted it first and
        // sent the emails.
        logger.info("Credit pack already granted by a concurrent handler", {
          sessionId: session.id,
          packId: result.data.packId,
          userId,
        });
      } else {
        logger.debug("Credits added after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });

        // Send confirmation emails (user + admin)
        try {
          const { users: usersTable } =
            await import("next-vibe/identity/user/db");
          const [fullUser] = await db
            .select({
              email: usersTable.email,
              privateName: usersTable.privateName,
              locale: usersTable.locale,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

          const [leadLink] = await db
            .select({ leadId: userLeadLinks.leadId })
            .from(userLeadLinks)
            .where(eq(userLeadLinks.userId, userId))
            .limit(1);

          if (fullUser) {
            const userLocale = fullUser.locale;
            const { scopedTranslation: creditsScopedTranslation } =
              await import("./i18n");
            const { t: emailT } = creditsScopedTranslation.scopedT(userLocale);

            const {
              creditPackUserEmailTemplate,
              creditPackAdminEmailTemplate,
            } = await import("./email");
            const { EmailSendingRepository } =
              await import("../messenger/providers/email/smtp-client/email-sending/repository");
            const { contactClientRepository } =
              await import("../contact/repository-client");
            const { configScopedTranslation } = await import("@/env/i18n");
            const { createTrackingContext } =
              await import("../messenger/providers/email/smtp-client/components/tracking_context.email");
            const { t: configT } = configScopedTranslation.scopedT(userLocale);
            const appName = configT("appName");
            const leadId = leadLink?.leadId ?? userId;

            const userJsx = creditPackUserEmailTemplate.component({
              props: {
                privateName: fullUser.privateName,
                userId,
                leadId,
                credits: totalCredits,
                userEmail: fullUser.email,
              },
              t: emailT,
              locale: userLocale,
              recipientEmail: fullUser.email,
              tracking: createTrackingContext(userLocale, leadId, userId),
            });
            await EmailSendingRepository.sendEmail(
              {
                jsx: userJsx,
                subject: emailT("email.creditPack.user.subject", { appName }),
                toEmail: fullUser.email,
                toName: fullUser.privateName,
                locale: userLocale,
              },
              logger,
              userLocale,
            );

            const adminEmail =
              contactClientRepository.getSupportEmail(userLocale);
            const adminJsx = creditPackAdminEmailTemplate.component({
              props: {
                userEmail: fullUser.email,
                credits: totalCredits,
              },
              t: emailT,
              locale: userLocale,
              recipientEmail: adminEmail,
              tracking: createTrackingContext(userLocale),
            });
            await EmailSendingRepository.sendEmail(
              {
                jsx: adminJsx,
                subject: emailT("email.creditPack.admin.subject", {
                  appName,
                  credits: totalCredits.toLocaleString(),
                }),
                toEmail: adminEmail,
                toName: appName,
                locale: userLocale,
              },
              logger,
              userLocale,
            );

            logger.info("Sent credit pack confirmation emails", { userId });
          }
        } catch (emailError) {
          logger.error("Failed to send credit pack emails", {
            error: parseError(emailError),
            sessionId: session.id,
            userId,
          });
        }
      }
    } catch (error) {
      logger.error("Failed to handle credit pack purchase", {
        error: parseError(error),
        sessionId: session.id,
      });
    }
  }

  /**
   * Handle NOWPayments success redirect for credit pack purchases.
   * Token is encoded in the `type` param as "credits.TOKEN" — NowPayments
   * preserves the `type` param through the redirect, so the token always arrives.
   * Idempotent via providerInvoiceId.
   */
  static async handleNowPaymentsCreditSuccessRedirect(
    callbackToken: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.callbackToken, callbackToken))
        .limit(1);

      if (!invoice?.metadata) {
        logger.warn("No invoice found for NOWPayments credit redirect", {
          token: callbackToken.slice(0, 8),
          userId,
        });
        return;
      }

      const meta = invoice.metadata as Record<string, string>;

      if (meta.type !== "credit_pack") {
        logger.info("Invoice is not a credit_pack, skipping", {
          type: meta.type,
        });
        return;
      }

      if (invoice.userId !== userId) {
        logger.warn("User mismatch on NOWPayments credit redirect", {
          invoiceUserId: invoice.userId,
          requestUserId: userId,
        });
        return;
      }

      const { scopedTranslation: creditsScopedTranslation } =
        await import("./i18n");
      const { t } = creditsScopedTranslation.scopedT(locale);

      await CreditRepository.handleCreditPackPurchase(
        { id: invoice.providerInvoiceId, metadata: { ...meta, userId } },
        logger,
        t,
      );

      logger.info("NOWPayments credit pack processed on redirect", {
        invoiceId: invoice.providerInvoiceId,
        userId,
      });

      // Growth funnel: first payment (write-once on the user's journey)
      const { GrowthJourneyRepository } =
        await import("@/leads/growth/repository");
      const { FunnelStep, PaidKind } = await import("@/leads/growth/enum");
      await GrowthJourneyRepository.markStep(
        { userId },
        FunnelStep.PAID,
        logger,
        PaidKind.PACK,
      );
    } catch (error) {
      logger.error("Failed to process NOWPayments credit redirect", {
        error: String(error),
        userId,
      });
    }
  }

  /**
   * Link lead wallets to user during signup/login.
   * Pool free-credit cap (20/period) is enforced at deduction time via
   * transaction-history check, so no wallet surgery needed here.
   */
  static async mergePendingLeadWallets(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Linking lead wallets to user during signup/login", {
        userId,
        leadIds: leadIds.length,
      });

      // Get user pool (this will create user wallet if it doesn't exist)
      const poolResult = await CreditRepository.getUserPool(
        userId,
        logger,
        t,
        locale,
      );
      if (!poolResult.success) {
        logger.error("Failed to get user pool during signup", {
          userId,
          error: poolResult.message,
        });
        return poolResult;
      }

      logger.debug("Lead wallets linked to user pool", {
        userId,
        poolLeadCount: poolResult.data.leadWallets.length,
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
        message: t("errors.mergeLeadWalletsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Check if identifier has sufficient credits (repository-level business logic)
   * Moved from BaseCreditHandler to enforce repository-first architecture
   */
  /**
   * Pre-generation gate for the public free-tier daily cap. No-op for pools that
   * hold paid credits. Fails CLOSED (PAYMENT_REQUIRED, drives the out-of-credits
   * nudge) when the pool, the lead or the IP has hit its daily ceiling.
   */
  static async gateFreeTierCap(
    user: JwtPayloadType,
    ipAddress: string | undefined,
    expectedCost: number,
    model: string,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    if (expectedCost <= 0) {
      return success(undefined);
    }
    const poolResult =
      !user.isPublic && user.id
        ? await CreditRepository.getUserPool(user.id, logger, t, locale)
        : user.leadId
          ? await CreditRepository.getLeadPool(user.leadId, logger, t, locale)
          : undefined;
    if (!poolResult) {
      return success(undefined);
    }
    if (!poolResult.success) {
      // Cannot tell whether this is a free pool: fail closed.
      return fail({
        message: t("errors.getBalanceFailed"),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }
    const pool = poolResult.data;
    const isFreeTierPool =
      (pool.userWallet?.balance ?? 0) === 0 &&
      pool.leadWallets.every((w) => w.balance === 0);
    if (!isFreeTierPool) {
      return success(undefined);
    }
    return PublicCapRepository.gate(
      { leadId: user.leadId, ipAddress, expectedCost, model },
      logger,
      locale,
    );
  }

  static async hasSufficientCredits(
    user: JwtPayloadType,
    required: number,
    logger: EndpointLogger,
    t: CreditsT,
    // oxlint-disable-next-line no-unused-vars -- locale is unused on server, but required on native
    locale: CountryLanguage,
  ): Promise<boolean> {
    const balanceResult = await CreditRepository.getBalance(
      user,
      logger,
      t,
      locale,
    );
    if (!balanceResult.success) {
      return false;
    }
    return balanceResult.data.total >= required;
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
    t: CreditsT,
    sourceUserEmail?: string,
  ): Promise<ResponseType<AddReferralBonusResult>> {
    try {
      // Get or create user wallet
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
        t,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      // Atomic: insert pack, increment balance, create transaction in one transaction
      const result = await withTransaction(logger, async (tx) => {
        const [newPack] = await tx
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

        // Atomic SQL increment - prevents lost updates from concurrent writes
        const [updated] = await tx
          .update(creditWallets)
          .set({
            balance: sql`${creditWallets.balance} + ${amountCents}`,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id))
          .returning({ balance: creditWallets.balance });

        const [txRecord] = await tx
          .insert(creditTransactions)
          .values({
            walletId: wallet.id,
            amount: amountCents,
            balanceAfter: updated.balance,
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

        return { packId: newPack.id, transactionId: txRecord.id };
      });

      logger.info("Earned credits added from referral", {
        userId,
        amountCents,
        sourceUserId,
        packId: result.packId,
        transactionId: result.transactionId,
      });

      return success(result);
    } catch (error) {
      logger.error("Failed to add earned credits", parseError(error), {
        userId,
        amountCents,
        sourceUserId,
      });
      return fail({
        message: t("errors.addEarnedCreditsFailed"),
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
    t: CreditsT,
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
        t,
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
        message: t("errors.getEarnedBalanceFailed"),
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
    t: CreditsT,
  ): Promise<ResponseType<void>> {
    try {
      const walletResult = await CreditRepository.getOrCreateUserWallet(
        userId,
        logger,
        t,
      );
      if (!walletResult.success) {
        return walletResult;
      }

      const wallet = walletResult.data;

      const txResult = await withTransaction(logger, async (tx) => {
        // Lock wallet row to prevent concurrent deductions
        const [lockedWallet] = await tx
          .select()
          .from(creditWallets)
          .where(eq(creditWallets.id, wallet.id))
          .for("update")
          .limit(1);

        if (!lockedWallet) {
          return fail({
            message: t("errors.deductEarnedCreditsFailed"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        // Get earned packs ordered by creation (FIFO), locked to prevent concurrent reads
        const earnedPacks = await tx
          .select()
          .from(creditPacks)
          .where(
            and(
              eq(creditPacks.walletId, wallet.id),
              eq(creditPacks.type, CreditPackType.EARNED),
            ),
          )
          .orderBy(creditPacks.createdAt)
          .for("update");

        // Check coverage BEFORE mutating: a fail() returned mid-loop would
        // commit the partial pack deductions (only a throw rolls back).
        const earnedTotal = earnedPacks.reduce(
          (sum, pack) => sum + pack.remaining,
          0,
        );
        if (earnedTotal < amountCents) {
          return fail({
            message: t("errors.deductEarnedCreditsFailed"),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
        }

        let remaining = amountCents;

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

          remaining -= deduction;
        }

        if (remaining > 0) {
          return fail({
            message: t("errors.deductEarnedCreditsFailed"),
            errorType: ErrorResponseTypes.BAD_REQUEST,
          });
        }

        // Update wallet balance atomically with floor
        await tx
          .update(creditWallets)
          .set({
            balance: sql`GREATEST(0, ${creditWallets.balance} - ${amountCents})`,
            updatedAt: new Date(),
          })
          .where(eq(creditWallets.id, wallet.id));

        // Re-read for accurate balanceAfter
        const [updatedWallet] = await tx
          .select({ balance: creditWallets.balance })
          .from(creditWallets)
          .where(eq(creditWallets.id, wallet.id));

        // Create REFERRAL_PAYOUT transaction
        await tx.insert(creditTransactions).values({
          walletId: wallet.id,
          amount: -amountCents,
          balanceAfter: updatedWallet?.balance ?? 0,
          type: CreditTransactionType.REFERRAL_PAYOUT,
          freePeriodId: lockedWallet.freePeriodId,
          metadata: {
            payoutRequestId,
            currency,
            amountCents,
          },
        });

        return success();
      });

      if (!txResult.success) {
        return txResult;
      }

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
        message: t("errors.deductEarnedCreditsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Fire-and-forget: fetch updated balance and broadcast it on the credits WS channel.
   * Called after every credit deduction so the client balance updates in real time.
   */
  private static emitBalanceUpdate(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: CreditsT,
    locale: CountryLanguage,
  ): void {
    void CreditRepository.getBalance(user, logger, t, locale).then((result) => {
      if (!result.success) {
        return undefined;
      }
      const { total, expiring, permanent, earned, free, expiresAt, capacity } =
        result.data;
      const emitCredits = createEndpointEmitter(
        creditsDefinitions.GET,
        logger,
        user,
      );
      emitCredits("credits-balance-updated", {
        responseData: {
          total,
          expiring,
          permanent,
          earned,
          free,
          expiresAt,
          capacity,
        },
      });
      return undefined;
    });
  }
}

// Type for native repository type checking
/**
 * The cross-platform credit API — the statics BOTH the server repository and
 * repository.native.ts implement. Shared code must only depend on these;
 * server-only internals (wallet/pool plumbing, balance emits) stay out.
 */
export type CreditRepositoryType = Pick<
  typeof CreditRepository,
  | "addCredits"
  | "addEarnedCredits"
  | "addUserCredits"
  | "deductCreditsForFeature"
  | "deductCreditsForModelUsage"
  | "deductCreditsForSTT"
  | "deductCreditsForTTS"
  | "deductEarnedCredits"
  | "expireCredits"
  | "getBalance"
  | "getCreditBalanceForUser"
  | "getEarnedCreditsBalance"
  | "getLeadBalance"
  | "getLeadPool"
  | "getLeadPoolOnly"
  | "getOrCreateLeadByIp"
  | "getTransactionHistory"
  | "getUserPool"
  | "handleCreditPackPurchase"
  | "handleNowPaymentsCreditSuccessRedirect"
  | "hasSufficientCredits"
  | "mergePendingLeadWallets"
>;
