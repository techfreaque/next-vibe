/**
 * Referral Repository
 * Business logic for referral code operations
 */

import "server-only";

import { and, desc, eq, inArray, lte, ne, sql } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import type { CreditsT } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { NotificationType } from "@/notifications/enum";
import { NotificationsRepository } from "@/notifications/repository";

import type {
  CodesListGetResponseOutput,
  ReferralCode,
} from "./codes/list/definition";
import { commissionAfterReversal } from "./commission";
import { REFERRAL_CONFIG } from "./config";
import {
  leadReferrals,
  payoutRequests,
  referralCodes,
  referralEarnings,
  userReferrals,
} from "./db";
import type {
  ReferralPostRequestOutput,
  ReferralPostResponseOutput,
} from "./definition";
import type { EarningsListGetResponseOutput } from "./earnings/list/definition";
import {
  PayoutCurrency,
  type PayoutCurrencyValue,
  PayoutStatus,
  type PayoutStatusValue,
  ReferralEarningStatus,
} from "./enum";
import type { ReferralT } from "./i18n";
import { scopedTranslation } from "./i18n";
import type { StatsGetResponseOutput } from "./stats/definition";
import { withTransaction } from "../vibe/database/utils/repository-helpers";

/** Placeholder until a lock's release resolver is assigned */
function noop(): void {
  return undefined;
}

/**
 * Internal result type for referral code validation
 */
interface ReferralCodeValidationResult {
  id: string;
  ownerUserId: string;
}

/**
 * Internal result type for lead referral code lookup
 */
interface LeadReferralCodeResult {
  referralCode: string | null;
}

/**
 * Internal type for commission share calculation
 */
interface CommissionShare {
  earnerUserId: string;
  level: number;
  amountCents: number;
}

/**
 * Internal result type for payout request creation
 */
interface PayoutRequestResult {
  payoutRequestId: string;
}

/**
 * Referral Repository Implementation
 */
export class ReferralRepository {
  // All commission config lives in ./config.ts - imported as REFERRAL_CONFIG
  /**
   * Create a new referral code
   */
  static async createReferralCode(
    userId: string,
    data: ReferralPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReferralPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      // Check if code already exists
      const [existingCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, data.fieldsGrid.code))
        .limit(1);

      if (existingCode) {
        return fail({
          message: t("errors.code_exists"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      await db
        .insert(referralCodes)
        .values({
          code: data.fieldsGrid.code,
          ownerUserId: userId,
          label: data.fieldsGrid.label ?? null,
          isActive: true,
          currentUses: 0,
        })
        .returning();
      return success({
        successMessage: t("response.success", {
          directPct: `${Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100)}%`,
        }),
        formAlert: undefined,
        fieldsGrid: undefined,
        submitRow: undefined,
      });
    } catch (error) {
      logger.error("Failed to create referral code", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get user's referral codes with stats
   */
  static async getUserReferralCodes(
    userId: string,
    logger: EndpointLogger,
    t: ReferralT,
  ): Promise<ResponseType<CodesListGetResponseOutput>> {
    try {
      logger.debug("Getting referral codes for user", { userId });

      const codes = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.ownerUserId, userId))
        .orderBy(desc(referralCodes.createdAt));

      // Get stats for each code
      const codesWithStats: CodesListGetResponseOutput["codes"] =
        await Promise.all(
          codes.map(async (code) => {
            // Count signups: users referred by this code (permanent, deduplicated)
            const [signupCount] = await db
              .select({ count: sql<number>`count(*)::int` })
              .from(userReferrals)
              .where(eq(userReferrals.referralCodeId, code.id));

            // Count unique visitors: leads linked to this code who have NOT signed up yet
            const [visitorCount] = await db
              .select({
                count: sql<number>`count(distinct ${leadReferrals.leadId})::int`,
              })
              .from(leadReferrals)
              .where(eq(leadReferrals.referralCodeId, code.id));

            // Get earnings and revenue for this code from users referred by this code
            // Revenue = total amount paid by referred users (amountCents / POOL_PERCENTAGE)
            // Earnings = commission earned by code owner
            const [stats] = await db
              .select({
                totalEarnings: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int`,
                // Revenue = earnings / total pool percentage
                totalRevenue: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int * ${Math.round(1 / (REFERRAL_CONFIG.DIRECT_PERCENTAGE + REFERRAL_CONFIG.UPLINE_PERCENTAGE))}`,
              })
              .from(referralEarnings)
              .innerJoin(
                userReferrals,
                eq(referralEarnings.sourceUserId, userReferrals.referredUserId),
              )
              .where(
                and(
                  eq(userReferrals.referralCodeId, code.id),
                  eq(referralEarnings.earnerUserId, userId), // Only count earnings for this code owner
                ),
              );

            return {
              code: code.code,
              label: code.label,
              currentVisitors: visitorCount?.count ?? 0,
              totalSignups: signupCount?.count ?? 0,
              totalRevenueCents: stats?.totalRevenue ?? 0,
              totalEarningsCents: stats?.totalEarnings ?? 0,
              isActive: code.isActive,
            } satisfies ReferralCode;
          }),
        );

      return success<CodesListGetResponseOutput>({ codes: codesWithStats });
    } catch (error) {
      logger.error("Failed to get referral codes", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Validate referral code
   */
  static async validateReferralCode(
    code: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ReferralCodeValidationResult>> {
    try {
      logger.debug("Validating referral code", { code });

      const [referralCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, code))
        .limit(1);

      if (!referralCode) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if code is active
      if (!referralCode.isActive) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.validation.title"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      return success({
        id: referralCode.id,
        ownerUserId: referralCode.ownerUserId,
      });
    } catch (error) {
      logger.error("Failed to validate referral code", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Link referral code to lead (Phase 1: Pre-signup)
   * Called when user clicks referral link or enters code on signup form
   * Multiple referral codes can be linked to a lead - on signup, the latest is used
   */
  static async linkReferralToLead(
    leadId: string,
    referralCode: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Linking referral to lead", { leadId, referralCode });

      // Validate referral code
      const codeResult = await this.validateReferralCode(
        referralCode,
        logger,
        locale,
      );
      if (!codeResult.success) {
        return codeResult;
      }

      const { id: codeId } = codeResult.data;

      // Check if this exact referral code is already linked to this lead
      const [existingReferral] = await db
        .select()
        .from(leadReferrals)
        .where(
          and(
            eq(leadReferrals.leadId, leadId),
            eq(leadReferrals.referralCodeId, codeId),
          ),
        )
        .limit(1);

      if (existingReferral) {
        // Same code already linked - idempotent
        logger.debug("Same referral code already linked to lead", {
          leadId,
          referralCode,
        });
        return success();
      }

      // Create new lead referral record (allows multiple different codes per lead)
      await db.insert(leadReferrals).values({
        referralCodeId: codeId,
        leadId,
      });

      logger.debug("Referral linked to lead successfully", { leadId, codeId });

      return success();
    } catch (error) {
      logger.error("Failed to link referral to lead", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the latest referral code for a lead
   * Returns the most recently linked referral code
   */
  static async getLatestLeadReferralCode(
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LeadReferralCodeResult>> {
    try {
      logger.debug("Getting latest referral code for lead", { leadId });

      // Get the most recent referral linked to this lead
      const [latestReferral] = await db
        .select({
          code: referralCodes.code,
        })
        .from(leadReferrals)
        .innerJoin(
          referralCodes,
          eq(leadReferrals.referralCodeId, referralCodes.id),
        )
        .where(eq(leadReferrals.leadId, leadId))
        .orderBy(desc(leadReferrals.createdAt))
        .limit(1);

      return success({
        referralCode: latestReferral?.code ?? null,
      });
    } catch (error) {
      logger.error("Failed to get latest referral code", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the latest referral code and label for a lead
   * Returns both code and label of the most recently linked referral code
   */
  static async getLatestLeadReferralWithLabel(
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{ referralCode: string | null; referralLabel: string | null }>
  > {
    try {
      logger.debug("Getting latest referral code with label for lead", {
        leadId,
      });

      const [latestReferral] = await db
        .select({
          code: referralCodes.code,
          label: referralCodes.label,
        })
        .from(leadReferrals)
        .innerJoin(
          referralCodes,
          eq(leadReferrals.referralCodeId, referralCodes.id),
        )
        .where(eq(leadReferrals.leadId, leadId))
        .orderBy(desc(leadReferrals.createdAt))
        .limit(1);

      return success({
        referralCode: latestReferral?.code ?? null,
        referralLabel: latestReferral?.label ?? null,
      });
    } catch (error) {
      logger.error(
        "Failed to get latest referral code with label",
        parseError(error),
      );
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Convert lead referral to user referral (Phase 2: During signup)
   * Called after user account is created to make referral permanent
   * Uses the LATEST referral code linked to the lead (most recent by createdAt)
   * @param skillCreatorUserId - Optional: the skill creator who gets Level 1 commission
   */
  static async convertLeadReferralToUser(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    skillCreatorUserId?: string | null,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Converting lead referral to user", {
        userId,
        leadId,
        skillCreatorUserId,
      });

      // Check if user already has a referrer
      const [existingUserReferral] = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.referredUserId, userId))
        .limit(1);

      if (existingUserReferral) {
        // Already converted - idempotent
        logger.debug("User already has referral", { userId });
        return success();
      }

      // Get the LATEST lead referral (most recent by createdAt)
      const [leadReferral] = await db
        .select()
        .from(leadReferrals)
        .where(eq(leadReferrals.leadId, leadId))
        .orderBy(desc(leadReferrals.createdAt))
        .limit(1);

      if (!leadReferral) {
        // No referral for this lead - not an error
        logger.debug("No referral found for lead", { leadId });
        return success();
      }

      // Get referral code to find referrer
      const [referralCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.id, leadReferral.referralCodeId))
        .limit(1);

      if (!referralCode) {
        logger.error("Referral code not found", {
          codeId: leadReferral.referralCodeId,
        });
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const referrerUserId = referralCode.ownerUserId;

      // Check for self-referral
      if (referrerUserId === userId) {
        logger.warn("Self-referral detected, skipping", { userId });
        return success();
      }

      // Guard skillCreatorUserId: null if same as referrer or self
      let resolvedSkillCreatorUserId: string | null =
        skillCreatorUserId ?? null;
      if (
        resolvedSkillCreatorUserId === referrerUserId ||
        resolvedSkillCreatorUserId === userId
      ) {
        resolvedSkillCreatorUserId = null;
      }

      // Create user referral record (permanent)
      await db.insert(userReferrals).values({
        referrerUserId,
        referredUserId: userId,
        referralCodeId: leadReferral.referralCodeId,
        skillCreatorUserId: resolvedSkillCreatorUserId,
      });

      // Increment code usage count
      await db
        .update(referralCodes)
        .set({
          currentUses: sql`${referralCodes.currentUses} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(referralCodes.id, leadReferral.referralCodeId));

      logger.debug("Lead referral converted to user successfully", {
        userId,
        referrerUserId,
        skillCreatorUserId: resolvedSkillCreatorUserId,
        referralCode: referralCode.code,
      });

      return success();
    } catch (error) {
      logger.error("Failed to convert lead referral", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get referral stats for a user
   * Returns: signups, revenue generated, earned credits, paid out, available
   */
  static async getReferralStats(
    userId: string,
    logger: EndpointLogger,
    t: ReferralT,
  ): Promise<ResponseType<StatsGetResponseOutput>> {
    try {
      logger.debug("Getting referral stats", { userId });

      // Count total signups from user referrals
      const [signupsResult] = await db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(userReferrals)
        .where(eq(userReferrals.referrerUserId, userId));

      const totalSignups = signupsResult?.count || 0;

      // Calculate total revenue generated (earnings / total pool percentage)
      const revenueMultiplier = Math.round(
        1 /
          (REFERRAL_CONFIG.DIRECT_PERCENTAGE +
            REFERRAL_CONFIG.UPLINE_PERCENTAGE),
      );
      const [revenueResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}) * ${revenueMultiplier}, 0)::int`,
        })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.earnerUserId, userId),
            ne(referralEarnings.status, ReferralEarningStatus.CANCELED),
          ),
        );

      const totalRevenueCredits = revenueResult?.total || 0;

      // Total earned = pending + confirmed (refunded/charged-back = canceled, excluded)
      const [earningsResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int`,
          confirmed: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}) FILTER (WHERE ${referralEarnings.status} = ${ReferralEarningStatus.CONFIRMED}), 0)::int`,
        })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.earnerUserId, userId),
            ne(referralEarnings.status, ReferralEarningStatus.CANCELED),
          ),
        );

      const totalEarnedCredits = earningsResult?.total || 0;
      const confirmedEarnedCredits = earningsResult?.confirmed || 0;

      // Calculate total paid out (from completed payout requests)
      const [payoutResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${payoutRequests.amountCents}), 0)::int`,
        })
        .from(payoutRequests)
        .where(
          and(
            eq(payoutRequests.userId, userId),
            eq(payoutRequests.status, PayoutStatus.COMPLETED),
          ),
        );

      const totalPaidOutCredits = payoutResult?.total || 0;

      // Available = confirmed (past the refund window) - paid out
      const availableCredits = Math.max(
        0,
        confirmedEarnedCredits - totalPaidOutCredits,
      );

      return success({
        totalSignupsTitle: "stats.fields.totalSignups",
        totalSignupsValue: totalSignups,
        totalSignupsDescription: "stats.fields.totalSignupsDescription",

        totalRevenueTitle: "stats.fields.totalRevenue",
        totalRevenueValue: totalRevenueCredits,
        totalRevenueDescription: "stats.fields.totalRevenueDescription",

        totalEarnedTitle: "stats.fields.totalEarned",
        totalEarnedValue: totalEarnedCredits,
        totalEarnedDescription: "stats.fields.totalEarnedDescription",

        availableCreditsTitle: "stats.fields.availableBalance",
        availableCreditsValue: availableCredits,
        availableCreditsDescription:
          availableCredits >= REFERRAL_CONFIG.MIN_PAYOUT_CENTS
            ? "stats.fields.availableBalanceDescription"
            : "stats.fields.availableBalanceDescriptionLow",
        availableCreditsReadyForPayout:
          availableCredits >= REFERRAL_CONFIG.MIN_PAYOUT_CENTS,
      });
    } catch (error) {
      logger.error("Failed to get referral stats", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get referral earnings for a user
   */
  static async getReferralEarnings(
    userId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    t: ReferralT,
  ): Promise<ResponseType<EarningsListGetResponseOutput>> {
    try {
      logger.debug("Getting referral earnings", { userId, limit, offset });

      const earnings = await db
        .select()
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId))
        .orderBy(desc(referralEarnings.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId));

      return success({
        earnings: earnings.map((e) => ({
          id: e.id,
          earnerUserId: e.earnerUserId,
          sourceUserId: e.sourceUserId,
          transactionId: e.transactionId,
          level: e.level,
          amountCents: e.amountCents,
          currency: e.currency,
          status: e.status,
          createdAt: e.createdAt,
        })),
        totalCount: Number(countResult?.count || 0),
      });
    } catch (error) {
      logger.error("Failed to get referral earnings", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Apply referral payout on payment success.
   * Commission is computed on the revenue the payment actually brought in
   * (amount paid, converted to USD cents), not on the credits it granted.
   * Earned commission is credited at 1 credit = 1 USD cent.
   */
  static async applyReferralPayoutOnPayment(
    transactionId: string,
    userId: string,
    revenueUsdCents: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
    grantedCredits: number | null = null,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Applying referral payout", {
        transactionId,
        userId,
        revenueUsdCents,
        grantedCredits,
      });

      if (revenueUsdCents <= 0) {
        logger.debug("No revenue on payment, no referral payout", {
          transactionId,
        });
        return success();
      }

      // Get referral chain for the user
      const chain = await ReferralRepository.getReferralChain(userId, logger);

      if (chain.length === 0) {
        logger.debug("No referral chain found for user", { userId });
        return success();
      }

      const shares = ReferralRepository.calculateCommissionShares(
        revenueUsdCents,
        chain,
      );

      // Earnings start PENDING: nothing is spendable or payable until the
      // refund window (REFERRAL_CONFIG.EARNING_HOLD_DAYS) has passed without a
      // refund/dispute. confirmMaturedEarnings() grants the credits afterwards.
      for (const share of shares) {
        await db
          .insert(referralEarnings)
          .values({
            earnerUserId: share.earnerUserId,
            sourceUserId: userId,
            transactionId,
            level: share.level,
            amountCents: share.amountCents, // Credits earned (1 credit = 1 USD cent)
            baseCredits: grantedCredits,
            baseAmountUsdCents: revenueUsdCents,
            currency: "CREDITS", // Paid out as earned credits
            status: ReferralEarningStatus.PENDING,
          })
          .onConflictDoNothing(); // Idempotency: one earning per tx/earner/level
      }

      logger.debug("Referral payout applied successfully", {
        transactionId,
        sharesCount: shares.length,
        revenueUsdCents,
      });

      return success();
    } catch (error) {
      logger.error("Failed to apply referral payout", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Confirm earnings whose refund window has passed: PENDING → CONFIRMED and
   * grant the earned credits, atomically per earning (row-locked, so a refund
   * reversal racing the cron either cancels it first or claws back after).
   * Called by the referral-earnings-confirm cron.
   */
  static async confirmMaturedEarnings(
    logger: EndpointLogger,
    creditsT: CreditsT,
    now: Date = new Date(),
  ): Promise<ResponseType<{ confirmedCount: number; failedCount: number }>> {
    const cutoff = new Date(
      now.getTime() - REFERRAL_CONFIG.EARNING_HOLD_DAYS * 24 * 60 * 60 * 1000,
    );
    try {
      const matured = await db
        .select({
          id: referralEarnings.id,
          earnerUserId: referralEarnings.earnerUserId,
        })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.status, ReferralEarningStatus.PENDING),
            lte(referralEarnings.createdAt, cutoff),
          ),
        )
        .orderBy(referralEarnings.createdAt)
        .limit(500);

      let confirmedCount = 0;
      let failedCount = 0;

      for (const earning of matured) {
        // Ensures the earner's wallet row exists (getOrCreateUserWallet side effect)
        const walletReady = await CreditRepository.getEarnedCreditsBalance(
          earning.earnerUserId,
          logger,
          creditsT,
        );
        if (!walletReady.success) {
          failedCount++;
          logger.error("Referral earning confirm: earner wallet unavailable", {
            earningId: earning.id,
            earnerUserId: earning.earnerUserId,
          });
          continue;
        }

        try {
          const confirmed = await withTransaction(logger, async (tx) => {
            const [locked] = await tx
              .select()
              .from(referralEarnings)
              .where(eq(referralEarnings.id, earning.id))
              .for("update")
              .limit(1);
            if (
              !locked ||
              locked.status !== ReferralEarningStatus.PENDING ||
              locked.createdAt > cutoff
            ) {
              return null;
            }

            const [wallet] = await tx
              .select()
              .from(creditWallets)
              .where(eq(creditWallets.userId, locked.earnerUserId))
              .for("update")
              .limit(1);
            if (!wallet) {
              return null;
            }

            const [sourceUser] = await tx
              .select({ email: users.email })
              .from(users)
              .where(eq(users.id, locked.sourceUserId))
              .limit(1);

            // Commission base: revenue in USD cents (legacy rows: credits)
            const base = locked.baseAmountUsdCents ?? locked.baseCredits ?? 0;
            if (locked.amountCents > 0) {
              const [newPack] = await tx
                .insert(creditPacks)
                .values({
                  walletId: wallet.id,
                  originalAmount: locked.amountCents,
                  remaining: locked.amountCents,
                  type: CreditPackType.EARNED,
                  expiresAt: null,
                  source: "referral_earning",
                  metadata: {
                    sourceUserId: locked.sourceUserId,
                    transactionId: locked.transactionId,
                  },
                })
                .returning({ id: creditPacks.id });

              const [updated] = await tx
                .update(creditWallets)
                .set({
                  balance: sql`${creditWallets.balance} + ${locked.amountCents}`,
                  updatedAt: new Date(),
                })
                .where(eq(creditWallets.id, wallet.id))
                .returning({ balance: creditWallets.balance });

              await tx.insert(creditTransactions).values({
                walletId: wallet.id,
                amount: locked.amountCents,
                balanceAfter: updated.balance,
                type: CreditTransactionType.REFERRAL_EARNING,
                packId: newPack.id,
                freePeriodId: wallet.freePeriodId,
                metadata: {
                  sourceUserId: locked.sourceUserId,
                  sourceUserEmail: sourceUser?.email,
                  transactionId: locked.transactionId,
                  commissionPercent:
                    base > 0 ? (locked.amountCents / base) * 100 : 0,
                  originalAmountCents: base,
                },
              });
            }

            await tx
              .update(referralEarnings)
              .set({ status: ReferralEarningStatus.CONFIRMED })
              .where(eq(referralEarnings.id, locked.id));
            return { amountCents: locked.amountCents };
          });
          if (confirmed) {
            confirmedCount++;
            if (confirmed.amountCents > 0) {
              await NotificationsRepository.notify(
                {
                  userId: earning.earnerUserId,
                  type: NotificationType.EARNING,
                  params: { amount: confirmed.amountCents },
                  link: "/user/referral",
                  dedupeKey: `earning:${earning.id}`,
                  metadata: {
                    earningId: earning.id,
                    amountCents: confirmed.amountCents,
                  },
                },
                logger,
              );
            }
          }
        } catch (error) {
          failedCount++;
          logger.error("Referral earning confirm failed", parseError(error), {
            earningId: earning.id,
            earnerUserId: earning.earnerUserId,
          });
        }
      }

      if (confirmedCount > 0 || failedCount > 0) {
        logger.info("Referral earnings confirmed", {
          confirmedCount,
          failedCount,
          cutoff: cutoff.toISOString(),
        });
      }
      return success({ confirmedCount, failedCount });
    } catch (error) {
      logger.error("Failed to confirm matured referral earnings", {
        error: parseError(error),
      });
      return fail({
        message: creditsT("errors.addEarnedCreditsFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Reverse the referral earnings of a refunded / charged-back payment in
   * proportion to the share of the payment reversed (cumulative, 0..1).
   * Each earning keeps `original × (1 - reversedFraction)`; at 1 it is CANCELED.
   * PENDING: the amount is simply reduced (never granted yet). CONFIRMED: the
   * reduction is clawed back from the earner's EARNED packs, never below zero;
   * any part already spent or paid out is recorded as unrecovered on the REFUND
   * transaction and logged at error level for manual review.
   * Idempotent: the target is computed from the original commission, so webhook
   * retries and repeated partial refunds never reverse twice.
   */
  static async reverseEarningsForTransaction(
    transactionId: string,
    reason: "refund" | "dispute",
    logger: EndpointLogger,
    reversedFraction = 1,
  ): Promise<
    ResponseType<{
      canceledPending: number;
      reversedConfirmed: number;
      unrecoveredCredits: number;
    }>
  > {
    try {
      const earnings = await db
        .select({ id: referralEarnings.id })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.transactionId, transactionId),
            inArray(referralEarnings.status, [
              ReferralEarningStatus.PENDING,
              ReferralEarningStatus.CONFIRMED,
            ]),
          ),
        );

      let canceledPending = 0;
      let reversedConfirmed = 0;
      let unrecoveredCredits = 0;

      for (const { id } of earnings) {
        const outcome = await withTransaction(logger, async (tx) => {
          const [locked] = await tx
            .select()
            .from(referralEarnings)
            .where(eq(referralEarnings.id, id))
            .for("update")
            .limit(1);
          if (!locked || locked.status === ReferralEarningStatus.CANCELED) {
            return { kind: "noop" as const, unrecovered: 0 };
          }

          const original = locked.originalAmountCents ?? locked.amountCents;
          const target = commissionAfterReversal(original, reversedFraction);
          const reduceBy = locked.amountCents - target;
          if (reduceBy <= 0 && target > 0) {
            return { kind: "noop" as const, unrecovered: 0 };
          }

          const wasConfirmed =
            locked.status === ReferralEarningStatus.CONFIRMED;
          await tx
            .update(referralEarnings)
            .set({
              amountCents: target,
              originalAmountCents: original,
              status:
                target === 0 ? ReferralEarningStatus.CANCELED : locked.status,
            })
            .where(eq(referralEarnings.id, locked.id));

          if (!wasConfirmed || reduceBy <= 0) {
            return { kind: "pending" as const, unrecovered: 0 };
          }

          const [wallet] = await tx
            .select()
            .from(creditWallets)
            .where(eq(creditWallets.userId, locked.earnerUserId))
            .for("update")
            .limit(1);
          if (!wallet) {
            return {
              kind: "confirmed" as const,
              unrecovered: reduceBy,
            };
          }

          const earnedPacks = await tx
            .select()
            .from(creditPacks)
            .where(
              and(
                eq(creditPacks.walletId, wallet.id),
                eq(creditPacks.type, CreditPackType.EARNED),
              ),
            )
            .orderBy(desc(creditPacks.createdAt))
            .for("update");

          let toRecover = reduceBy;
          for (const pack of earnedPacks) {
            if (toRecover <= 0) {
              break;
            }
            const take = Math.min(pack.remaining, toRecover);
            if (take <= 0) {
              continue;
            }
            await tx
              .update(creditPacks)
              .set({ remaining: pack.remaining - take, updatedAt: new Date() })
              .where(eq(creditPacks.id, pack.id));
            toRecover -= take;
          }
          const recovered = reduceBy - toRecover;

          const [updated] = await tx
            .update(creditWallets)
            .set({
              balance: sql`GREATEST(0, ${creditWallets.balance} - ${recovered})`,
              updatedAt: new Date(),
            })
            .where(eq(creditWallets.id, wallet.id))
            .returning({ balance: creditWallets.balance });

          await tx.insert(creditTransactions).values({
            walletId: wallet.id,
            amount: -recovered,
            balanceAfter: updated?.balance ?? 0,
            type: CreditTransactionType.REFUND,
            freePeriodId: wallet.freePeriodId,
            metadata: {
              reason: `referral_${reason}_reversal`,
              originalTransactionId: locked.id,
              revokedCredits: reduceBy,
              unrecoveredCredits: toRecover,
            },
          });
          return { kind: "confirmed" as const, unrecovered: toRecover };
        });

        if (outcome.kind === "pending") {
          canceledPending++;
        } else if (outcome.kind === "confirmed") {
          reversedConfirmed++;
          unrecoveredCredits += outcome.unrecovered;
        }
      }

      if (unrecoveredCredits > 0) {
        logger.error(
          "Referral reversal: earned credits already spent/paid out — unrecovered, review manually",
          { transactionId, reason, unrecoveredCredits },
        );
      }
      if (canceledPending > 0 || reversedConfirmed > 0) {
        logger.info("Referral earnings reversed", {
          transactionId,
          reason,
          canceledPending,
          reversedConfirmed,
          unrecoveredCredits,
        });
      }
      return success({
        canceledPending,
        reversedConfirmed,
        unrecoveredCredits,
      });
    } catch (error) {
      logger.error("Failed to reverse referral earnings", parseError(error), {
        transactionId,
        reason,
      });
      const { t } = scopedTranslation.scopedT(defaultLocale);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get referral chain for a user (private helper)
   *
   * Chain layout:
   *   chain[0] = direct referrer (Level 0, 10% flat)
   *   chain[1] = skill creator (Level 1, first upline share) - only if skillCreatorUserId is set
   *   chain[2+] = upline referrers walking from skill creator (or from direct referrer if no skill creator)
   *
   * Deduplication: any userId already in the chain is skipped when walking upline.
   */
  private static async getReferralChain(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    const chain: string[] = [];
    const seen = new Set<string>();

    // Get the direct referral for this user (Level 0)
    const [directReferral] = await db
      .select()
      .from(userReferrals)
      .where(eq(userReferrals.referredUserId, userId))
      .limit(1);

    if (!directReferral) {
      logger.debug("No referral chain found for user", { userId });
      return chain;
    }

    // Level 0: direct referrer
    chain.push(directReferral.referrerUserId);
    seen.add(directReferral.referrerUserId);

    // Level 1: skill creator (if set and different from referrer)
    let currentUserId: string = directReferral.referrerUserId;
    if (
      directReferral.skillCreatorUserId &&
      !seen.has(directReferral.skillCreatorUserId)
    ) {
      chain.push(directReferral.skillCreatorUserId);
      seen.add(directReferral.skillCreatorUserId);
      currentUserId = directReferral.skillCreatorUserId;
    }

    // Levels 2+: walk upline from currentUserId (up to MAX_UPLINE_LEVELS total upline slots)
    const maxUpline = REFERRAL_CONFIG.MAX_UPLINE_LEVELS;
    for (let i = chain.length - 1; i < maxUpline; i++) {
      const [referral] = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.referredUserId, currentUserId))
        .limit(1);

      if (!referral || seen.has(referral.referrerUserId)) {
        break;
      }

      chain.push(referral.referrerUserId);
      seen.add(referral.referrerUserId);
      currentUserId = referral.referrerUserId;
    }

    logger.debug("Referral chain retrieved", {
      userId,
      chainLength: chain.length,
      hasSkillCreator: !!directReferral.skillCreatorUserId,
    });
    return chain;
  }

  /**
   * Calculate commission shares using Option A split-pool algorithm.
   *
   * chain[0] = direct referrer, always earns DIRECT_PERCENTAGE of the
   * transaction regardless of chain depth. chain[1..N] = upline, splits
   * UPLINE_PERCENTAGE with geometric decay. This ensures that being referred
   * never penalises the direct referrer.
   */
  private static calculateCommissionShares(
    amountCents: number,
    chain: string[],
  ): CommissionShare[] {
    if (chain.length === 0) {
      return [];
    }

    const cfg = REFERRAL_CONFIG;
    const shares: CommissionShare[] = [];

    // --- Level 0: flat direct commission ---
    const directCents = Math.floor(amountCents * cfg.DIRECT_PERCENTAGE);
    shares.push({
      earnerUserId: chain[0],
      level: 0,
      amountCents: directCents,
    });

    // --- Levels 1+: upline pool with geometric decay ---
    const uplineChain = chain.slice(1, 1 + cfg.MAX_UPLINE_LEVELS);
    if (uplineChain.length === 0) {
      return shares;
    }

    const uplinePoolCents = Math.floor(amountCents * cfg.UPLINE_PERCENTAGE);
    const q = cfg.DECAY_RATIO;
    const n = uplineChain.length;

    // Sum of geometric series: S = (1 - q^n) / (1 - q)
    const sum = (1 - Math.pow(q, n)) / (1 - q);

    let uplineAllocated = 0;
    for (let k = 0; k < n; k++) {
      const weight = Math.pow(q, k);
      const shareCents = Math.floor((uplinePoolCents * weight) / sum);
      shares.push({
        earnerUserId: uplineChain[k],
        level: k + 1,
        amountCents: shareCents,
      });
      uplineAllocated += shareCents;
    }

    // Distribute rounding remainder to chain[1] (first upline)
    if (uplineAllocated < uplinePoolCents) {
      const firstUpline = shares.find((s) => s.level === 1);
      if (firstUpline) {
        firstUpline.amountCents += uplinePoolCents - uplineAllocated;
      }
    }

    return shares;
  }

  // ==================== PAYOUT METHODS ====================

  // MIN_PAYOUT_CENTS sourced from REFERRAL_CONFIG.MIN_PAYOUT_CENTS

  /**
   * Get user's earned credits balance and payout history
   */
  static async getEarnedBalance(
    userId: string,
    logger: EndpointLogger,
    creditsT: CreditsT,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      earnedCredits: {
        total: number;
        available: number;
        locked: number;
        /** In the refund window — not spendable, not payable yet */
        pending: number;
      };
      payoutHistory: Array<{
        id: string;
        amountCents: number;
        currency: typeof PayoutCurrencyValue;
        status: typeof PayoutStatusValue;
        walletAddress: string | null;
        rejectionReason: string | null;
        createdAt: string;
        processedAt: string | null;
      }>;
    }>
  > {
    try {
      // Get earned credits balance
      const balanceResult = await CreditRepository.getEarnedCreditsBalance(
        userId,
        logger,
        creditsT,
      );
      if (!balanceResult.success) {
        return balanceResult;
      }

      const [pendingResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int`,
        })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.earnerUserId, userId),
            eq(referralEarnings.status, ReferralEarningStatus.PENDING),
          ),
        );

      // Get payout history
      const history = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.userId, userId))
        .orderBy(desc(payoutRequests.createdAt))
        .limit(50);

      return success({
        earnedCredits: {
          ...balanceResult.data,
          pending: Number(pendingResult?.total ?? 0),
        },
        payoutHistory: history.map((p) => ({
          id: p.id,
          amountCents: p.amountCents,
          currency: p.currency,
          status: p.status,
          walletAddress: p.walletAddress,
          rejectionReason: p.rejectionReason,
          createdAt: p.createdAt.toISOString(),
          processedAt: p.processedAt?.toISOString() ?? null,
        })),
      });
    } catch (error) {
      logger.error("Failed to get earned balance", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Request a payout (BTC/USDC)
   */
  /** Per-user in-process payout queue (see withUserPayoutLock) */
  private static readonly payoutLocks = new Map<string, Promise<void>>();

  /**
   * Run payout work for one user strictly one-at-a-time in this process.
   * Defense in depth on top of the wallet row lock: on Postgres the
   * SELECT … FOR UPDATE alone serializes requests across instances, but the
   * embedded PGlite backend shares ONE session between connections, where
   * row locks cannot block concurrent transactions.
   */
  private static async withUserPayoutLock<T>(
    userId: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const previous =
      ReferralRepository.payoutLocks.get(userId) ?? Promise.resolve();
    let release: () => void = noop;
    const current = new Promise<void>((resolve) => {
      release = resolve;
    });
    const tail = previous.then(() => current);
    ReferralRepository.payoutLocks.set(userId, tail);
    await previous;
    try {
      return await fn();
    } finally {
      release();
      if (ReferralRepository.payoutLocks.get(userId) === tail) {
        ReferralRepository.payoutLocks.delete(userId);
      }
    }
  }

  static async requestPayout(
    userId: string,
    amountCents: number,
    currency: typeof PayoutCurrencyValue,
    walletAddress: string | null,
    logger: EndpointLogger,
    creditsT: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<PayoutRequestResult>> {
    return ReferralRepository.withUserPayoutLock(userId, () =>
      ReferralRepository.requestPayoutLocked(
        userId,
        amountCents,
        currency,
        walletAddress,
        logger,
        creditsT,
        locale,
      ),
    );
  }

  private static async requestPayoutLocked(
    userId: string,
    amountCents: number,
    currency: typeof PayoutCurrencyValue,
    walletAddress: string | null,
    logger: EndpointLogger,
    creditsT: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<PayoutRequestResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      // Validate minimum amount
      if (amountCents < REFERRAL_CONFIG.MIN_PAYOUT_CENTS) {
        return fail({
          message: t("payout.errors.minimumAmount", {
            minPayout: `$${(REFERRAL_CONFIG.MIN_PAYOUT_CENTS / 100).toFixed(2)}`,
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Validate wallet address for crypto payouts
      if (currency !== PayoutCurrency.CREDITS && !walletAddress) {
        return fail({
          message: t("payout.errors.walletRequired"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Balance check + insert under the wallet row lock: concurrent requests
      // serialize here, so the second sees the first as locked and cannot
      // double-spend. Only CONFIRMED earnings ever exist as EARNED packs, so
      // pending (refund-window) earnings are never payable.
      const created = await withTransaction(logger, async (tx) => {
        const [wallet] = await tx
          .select({ id: creditWallets.id })
          .from(creditWallets)
          .where(eq(creditWallets.userId, userId))
          .for("update")
          .limit(1);
        if (!wallet) {
          return null;
        }

        const earnedPacks = await tx
          .select({ remaining: creditPacks.remaining })
          .from(creditPacks)
          .where(
            and(
              eq(creditPacks.walletId, wallet.id),
              eq(creditPacks.type, CreditPackType.EARNED),
            ),
          );
        const earnedTotal = earnedPacks.reduce(
          (sum, pack) => sum + pack.remaining,
          0,
        );

        const openPayouts = await tx
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
        const locked = openPayouts.reduce((sum, p) => sum + p.amountCents, 0);

        if (earnedTotal - locked < amountCents) {
          return null;
        }

        const [inserted] = await tx
          .insert(payoutRequests)
          .values({
            userId,
            amountCents,
            currency,
            status: PayoutStatus.PENDING,
            walletAddress,
          })
          .returning();
        return inserted;
      });

      if (!created) {
        return fail({
          message: t("payout.errors.insufficientBalance"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }
      const request = created;

      // If converting to credits, process immediately
      if (currency === PayoutCurrency.CREDITS) {
        const conversion = await ReferralRepository.processCreditsConversion(
          request.id,
          userId,
          amountCents,
          logger,
          creditsT,
        );
        if (!conversion.success) {
          return fail({
            message: t("payout.errors.conversionFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            cause: conversion,
          });
        }
      }

      logger.info("Payout request created", {
        userId,
        amountCents,
        currency,
        requestId: request.id,
      });

      return success({ payoutRequestId: request.id });
    } catch (error) {
      logger.error("Failed to create payout request", parseError(error));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Process credits conversion (instant)
   */
  private static async processCreditsConversion(
    requestId: string,
    userId: string,
    amountCents: number,
    logger: EndpointLogger,
    creditsT: CreditsT,
  ): Promise<ResponseType<void>> {
    const markFailed = async (adminNotes: string): Promise<void> => {
      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.FAILED,
          adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, requestId));
    };

    // Deduct from earned credits
    const deductResult = await CreditRepository.deductEarnedCredits(
      userId,
      amountCents,
      requestId,
      "CREDITS",
      logger,
      creditsT,
    );

    if (!deductResult.success) {
      await markFailed("Failed to deduct earned credits");
      return deductResult;
    }

    // Add to permanent credits
    // Keyed by the payout request so a retried conversion can never mint twice
    const addResult = await CreditRepository.addUserCredits(
      userId,
      amountCents,
      "permanent",
      logger,
      creditsT,
      undefined,
      `payout_${requestId}`,
    );

    if (!addResult.success) {
      // Earned credits are already gone — put them back so the user loses
      // nothing, and never mark the conversion completed.
      const restoreResult = await CreditRepository.addEarnedCredits(
        userId,
        amountCents,
        userId,
        requestId,
        0,
        amountCents,
        logger,
        creditsT,
      );
      if (!restoreResult.success) {
        logger.error(
          "Credits conversion failed AND earned credits could not be restored — manual fix required",
          { requestId, userId, amountCents },
        );
        await markFailed(
          `Conversion failed; ${amountCents} earned credits deducted but NOT restored — restore manually`,
        );
      } else {
        logger.error("Credits conversion failed — earned credits restored", {
          requestId,
          userId,
          amountCents,
        });
        await markFailed(
          "Failed to add permanent credits; earned credits restored",
        );
      }
      return addResult;
    }

    // Mark request as completed
    await db
      .update(payoutRequests)
      .set({
        status: PayoutStatus.COMPLETED,
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(payoutRequests.id, requestId));

    logger.info("Credits conversion completed", {
      requestId,
      userId,
      amountCents,
    });
    return success();
  }

  /**
   * Admin: List all payout requests
   */
  static async listPayoutRequests(
    status: typeof PayoutStatusValue | null,
    limit: number,
    offset: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      requests: Array<{
        id: string;
        userId: string;
        userEmail: string;
        amountCents: number;
        currency: typeof PayoutCurrencyValue;
        status: typeof PayoutStatusValue;
        walletAddress: string | null;
        adminNotes: string | null;
        rejectionReason: string | null;
        createdAt: string;
        processedAt: string | null;
      }>;
      totalCount: number;
    }>
  > {
    try {
      const whereClause = status
        ? eq(payoutRequests.status, status)
        : undefined;

      const requests = await db
        .select({
          id: payoutRequests.id,
          userId: payoutRequests.userId,
          userEmail: users.email,
          amountCents: payoutRequests.amountCents,
          currency: payoutRequests.currency,
          status: payoutRequests.status,
          walletAddress: payoutRequests.walletAddress,
          adminNotes: payoutRequests.adminNotes,
          rejectionReason: payoutRequests.rejectionReason,
          createdAt: payoutRequests.createdAt,
          processedAt: payoutRequests.processedAt,
        })
        .from(payoutRequests)
        .innerJoin(users, eq(payoutRequests.userId, users.id))
        .where(whereClause)
        .orderBy(desc(payoutRequests.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(payoutRequests)
        .where(whereClause);

      return success({
        requests: requests.map((r) => ({
          id: r.id,
          userId: r.userId,
          userEmail: r.userEmail,
          amountCents: r.amountCents,
          currency: r.currency,
          status: r.status,
          walletAddress: r.walletAddress,
          adminNotes: r.adminNotes,
          rejectionReason: r.rejectionReason,
          createdAt: r.createdAt.toISOString(),
          processedAt: r.processedAt?.toISOString() ?? null,
        })),
        totalCount: Number(countResult?.count || 0),
      });
    } catch (error) {
      logger.error("Failed to list payout requests", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Admin: Approve payout request
   */
  static async approvePayoutRequest(
    requestId: string,
    adminUserId: string,
    adminNotes: string | null,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: t("payout.errors.notFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.PENDING) {
        return fail({
          message: t("payout.errors.invalidStatus"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.APPROVED,
          adminNotes,
          processedByUserId: adminUserId,
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, requestId));

      logger.info("Payout request approved", { requestId, adminUserId });
      return success();
    } catch (error) {
      logger.error("Failed to approve payout request", parseError(error));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Admin: Reject payout request
   */
  static async rejectPayoutRequest(
    requestId: string,
    adminUserId: string,
    rejectionReason: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: t("payout.errors.notFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.PENDING) {
        return fail({
          message: t("payout.errors.invalidStatus"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.REJECTED,
          rejectionReason,
          processedByUserId: adminUserId,
          processedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, requestId));

      logger.info("Payout request rejected", {
        requestId,
        adminUserId,
        reason: rejectionReason,
      });
      return success();
    } catch (error) {
      logger.error("Failed to reject payout request", parseError(error));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Admin: Complete payout request (after external transfer)
   */
  static async completePayoutRequest(
    requestId: string,
    adminUserId: string,
    adminNotes: string | null,
    logger: EndpointLogger,
    creditsT: CreditsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: t("payout.errors.notFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.APPROVED) {
        return fail({
          message: t("payout.errors.invalidStatus"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Deduct from earned credits
      const deductResult = await CreditRepository.deductEarnedCredits(
        request.userId,
        request.amountCents,
        requestId,
        request.currency as "BTC" | "USDC" | "CREDITS",
        logger,
        creditsT,
      );

      if (!deductResult.success) {
        await db
          .update(payoutRequests)
          .set({
            status: PayoutStatus.FAILED,
            adminNotes: `Deduction failed: ${deductResult.message}`,
            updatedAt: new Date(),
          })
          .where(eq(payoutRequests.id, requestId));
        return deductResult;
      }

      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.COMPLETED,
          adminNotes,
          processedByUserId: adminUserId,
          processedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, requestId));

      logger.info("Payout request completed", { requestId, adminUserId });
      return success();
    } catch (error) {
      logger.error("Failed to complete payout request", parseError(error));
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
