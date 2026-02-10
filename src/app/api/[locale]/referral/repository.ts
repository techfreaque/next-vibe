/**
 * Referral Repository
 * Business logic for referral code operations
 */

import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { users } from "@/app/api/[locale]/user/db";

import { leads } from "../leads/db";
import { LeadStatus } from "../leads/enum";
import type { CodesListGetResponseOutput } from "./codes/list/definition";
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
import type { StatsGetResponseOutput } from "./stats/definition";

// Internal types
interface CommissionShare {
  earnerUserId: string;
  level: number;
  amountCents: number;
}

/**
 * Configuration for referral payout algorithm
 */
const REFERRAL_CONFIG = {
  POOL_PERCENTAGE: 0.2, // 20% of transaction goes to referral pool
  DECAY_RATIO: 0.5, // Each level gets 50% of previous level
  MAX_LEVELS: 10, // Maximum depth of referral chain
} as const;

/**
 * Referral Repository Implementation
 */
export class ReferralRepository {
  /**
   * Create a new referral code
   */
  static async createReferralCode(
    userId: string,
    data: ReferralPostRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<ReferralPostResponseOutput>> {
    try {
      // Check if code already exists
      const [existingCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, data.fieldsGrid.code))
        .limit(1);

      if (existingCode) {
        return fail({
          message: "app.api.referral.errors.conflict.title",
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
        successMessage: "app.api.referral.response.success",
        formAlert: undefined,
        fieldsGrid: undefined,
        submitRow: undefined,
      });
    } catch (error) {
      logger.error("Failed to create referral code", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get user's referral codes with stats
   */
  static async getUserReferralCodes(
    userId: string,
    logger: EndpointLogger,
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
            // Count signups: leads linked to this code that have signedUp status
            const [signupCount] = await db
              .select({ count: sql<number>`count(*)::int` })
              .from(leadReferrals)
              .innerJoin(leads, eq(leadReferrals.leadId, leads.id))
              .where(
                and(
                  eq(leadReferrals.referralCodeId, code.id),
                  eq(leads.status, LeadStatus.SIGNED_UP),
                ),
              );

            // Get earnings and revenue for this code from users referred by this code
            // Revenue = total amount paid by referred users (amountCents / POOL_PERCENTAGE)
            // Earnings = commission earned by code owner
            const [stats] = await db
              .select({
                totalEarnings: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int`,
                // Revenue is earnings divided by pool percentage (0.2) = earnings * 5
                totalRevenue: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int * 5`,
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
              currentUses: code.currentUses,
              totalSignups: signupCount?.count ?? 0,
              totalRevenueCents: stats?.totalRevenue ?? 0,
              totalEarningsCents: stats?.totalEarnings ?? 0,
              isActive: code.isActive,
            } satisfies CodesListGetResponseOutput["codes"][number];
          }),
        );

      return success<CodesListGetResponseOutput>({ codes: codesWithStats });
    } catch (error) {
      logger.error("Failed to get referral codes", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Validate referral code
   */
  static async validateReferralCode(
    code: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ id: string; ownerUserId: string }>> {
    try {
      logger.debug("Validating referral code", { code });

      const [referralCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, code))
        .limit(1);

      if (!referralCode) {
        return fail({
          message: "app.api.referral.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check if code is active
      if (!referralCode.isActive) {
        return fail({
          message: "app.api.referral.errors.validation.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      return success({
        id: referralCode.id,
        ownerUserId: referralCode.ownerUserId,
      });
    } catch (error) {
      logger.error("Failed to validate referral code", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Linking referral to lead", { leadId, referralCode });

      // Validate referral code
      const codeResult = await this.validateReferralCode(referralCode, logger);
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
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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
  ): Promise<ResponseType<{ referralCode: string | null }>> {
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
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Convert lead referral to user referral (Phase 2: During signup)
   * Called after user account is created to make referral permanent
   * Uses the LATEST referral code linked to the lead (most recent by createdAt)
   */
  static async convertLeadReferralToUser(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Converting lead referral to user", { userId, leadId });

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
        return fail({
          message: "app.api.referral.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const referrerUserId = referralCode.ownerUserId;

      // Check for self-referral
      if (referrerUserId === userId) {
        logger.warn("Self-referral detected, skipping", { userId });
        return success();
      }

      // Create user referral record (permanent)
      await db.insert(userReferrals).values({
        referrerUserId,
        referredUserId: userId,
        referralCodeId: leadReferral.referralCodeId,
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
        referralCode: referralCode.code,
      });

      return success();
    } catch (error) {
      logger.error("Failed to convert lead referral", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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

      // Calculate total revenue generated (sum of all earnings * 5, since earnings are 20% of revenue)
      const [revenueResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}) * 5, 0)::int`,
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId));

      const totalRevenueCredits = revenueResult?.total || 0;

      // Calculate total earned credits (sum of all earnings)
      const [earningsResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)::int`,
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId));

      const totalEarnedCredits = earningsResult?.total || 0;

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

      // Available = earned - paid out
      const availableCredits = totalEarnedCredits - totalPaidOutCredits;

      return success({
        totalSignupsTitle: "app.api.referral.stats.fields.totalSignups",
        totalSignupsValue: totalSignups,
        totalSignupsDescription:
          "app.api.referral.stats.fields.totalSignupsDescription",

        totalRevenueTitle: "app.api.referral.stats.fields.totalRevenue",
        totalRevenueValue: totalRevenueCredits,
        totalRevenueDescription:
          "app.api.referral.stats.fields.totalRevenueDescription",

        totalEarnedTitle: "app.api.referral.stats.fields.totalEarned",
        totalEarnedValue: totalEarnedCredits,
        totalEarnedDescription: "app.api.referral.stats.fields.totalEarnedDescription",

        availableCreditsTitle: "app.api.referral.stats.fields.availableBalance",
        availableCreditsValue: availableCredits,
        availableCreditsDescription:
          "app.api.referral.stats.fields.availableBalanceDescription",
      });
    } catch (error) {
      logger.error("Failed to get referral stats", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
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
          createdAt: e.createdAt.toISOString(),
        })),
        totalCount: Number(countResult?.count || 0),
      });
    } catch (error) {
      logger.error("Failed to get referral earnings", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Apply referral payout on payment success
   * Uses credits as the base for commission calculation (currency-independent)
   * 1 credit = 1 cent in commission value
   */
  static async applyReferralPayoutOnPayment(
    transactionId: string,
    userId: string,
    creditsAmount: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Applying referral payout", {
        transactionId,
        userId,
        creditsAmount,
      });

      // Get referral chain for the user
      const chain = await ReferralRepository.getReferralChain(userId, logger);

      if (chain.length === 0) {
        logger.debug("No referral chain found for user", { userId });
        return success();
      }

      // Calculate commission shares based on credits (1 credit = 1 cent for commission)
      const shares = ReferralRepository.calculateCommissionShares(
        creditsAmount,
        chain,
      );

      // Get source user email for transaction metadata
      const [sourceUser] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      // Insert earnings records and add earned credits
      for (const share of shares) {
        // Insert referral earnings record (audit trail)
        // Note: amountCents here represents earned credits (1:1 mapping)
        const [insertedEarning] = await db
          .insert(referralEarnings)
          .values({
            earnerUserId: share.earnerUserId,
            sourceUserId: userId,
            transactionId,
            level: share.level,
            amountCents: share.amountCents, // Credits earned (1 credit = 1 cent value)
            currency: "CREDITS", // Currency-independent, stored as credits
            status: ReferralEarningStatus.CONFIRMED,
          })
          .onConflictDoNothing() // Idempotency: ignore if already exists
          .returning();

        // Add earned credits to user's wallet (only if earning was inserted)
        if (insertedEarning) {
          const commissionPercent = (share.amountCents / creditsAmount) * 100;
          await CreditRepository.addEarnedCredits(
            share.earnerUserId,
            share.amountCents, // Credits earned
            userId,
            transactionId,
            commissionPercent,
            creditsAmount, // Original credits purchased
            logger,
            sourceUser?.email,
          );
        }
      }

      logger.debug("Referral payout applied successfully", {
        transactionId,
        sharesCount: shares.length,
        totalCredits: creditsAmount,
      });

      return success();
    } catch (error) {
      logger.error("Failed to apply referral payout", parseError(error));
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get referral chain for a user (private helper)
   */
  private static async getReferralChain(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    const chain: string[] = [];
    let currentUserId: string | null = userId;

    // Traverse up the referral chain
    for (let i = 0; i < REFERRAL_CONFIG.MAX_LEVELS; i++) {
      const [referral] = await db
        .select()
        .from(userReferrals)
        .where(eq(userReferrals.referredUserId, currentUserId))
        .limit(1);

      if (!referral) {
        break;
      }

      chain.push(referral.referrerUserId);
      currentUserId = referral.referrerUserId;
    }

    logger.debug("Referral chain retrieved", {
      userId,
      chainLength: chain.length,
    });
    return chain;
  }

  /**
   * Calculate commission shares using geometric decay (private helper)
   */
  private static calculateCommissionShares(
    amountCents: number,
    chain: string[],
  ): CommissionShare[] {
    const poolCents = Math.floor(amountCents * REFERRAL_CONFIG.POOL_PERCENTAGE);
    const q = REFERRAL_CONFIG.DECAY_RATIO;
    const n = Math.min(chain.length, REFERRAL_CONFIG.MAX_LEVELS);

    if (n === 0) {
      return [];
    }

    // Calculate sum of geometric series: S = (1 - q^n) / (1 - q)
    const sum = (1 - Math.pow(q, n)) / (1 - q);

    const shares: CommissionShare[] = [];
    let totalAllocated = 0;

    // Calculate shares for each level
    for (let k = 0; k < n; k++) {
      const weight = Math.pow(q, k);
      const shareCents = Math.floor((poolCents * weight) / sum);

      shares.push({
        earnerUserId: chain[k],
        level: k,
        amountCents: shareCents,
      });

      totalAllocated += shareCents;
    }

    // Distribute remainder to level 0 (direct referrer)
    if (totalAllocated < poolCents && shares.length > 0) {
      shares[0].amountCents += poolCents - totalAllocated;
    }

    return shares;
  }

  // ==================== PAYOUT METHODS ====================

  /**
   * Minimum payout amount in cents ($40)
   */
  private static readonly MIN_PAYOUT_CENTS = 4000;

  /**
   * Get user's earned credits balance and payout history
   */
  static async getEarnedBalance(
    userId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      earnedCredits: {
        total: number;
        available: number;
        locked: number;
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
      );
      if (!balanceResult.success) {
        return balanceResult;
      }

      // Get payout history
      const history = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.userId, userId))
        .orderBy(desc(payoutRequests.createdAt))
        .limit(50);

      return success({
        earnedCredits: balanceResult.data,
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
      return fail({
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Request a payout (BTC/USDC)
   */
  static async requestPayout(
    userId: string,
    amountCents: number,
    currency: typeof PayoutCurrencyValue,
    walletAddress: string | null,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ payoutRequestId: string }>> {
    try {
      // Validate minimum amount
      if (amountCents < ReferralRepository.MIN_PAYOUT_CENTS) {
        return fail({
          message: "app.api.referral.payout.errors.minimumAmount",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Validate wallet address for crypto payouts
      if (currency !== PayoutCurrency.CREDITS && !walletAddress) {
        return fail({
          message: "app.api.referral.payout.errors.walletRequired",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Get earned balance
      const balanceResult = await CreditRepository.getEarnedCreditsBalance(
        userId,
        logger,
      );
      if (!balanceResult.success) {
        return balanceResult;
      }

      // Check sufficient available balance
      if (balanceResult.data.available < amountCents) {
        return fail({
          message: "app.api.referral.payout.errors.insufficientBalance",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Create payout request
      const [request] = await db
        .insert(payoutRequests)
        .values({
          userId,
          amountCents,
          currency,
          status: PayoutStatus.PENDING,
          walletAddress,
        })
        .returning();

      // If converting to credits, process immediately
      if (currency === PayoutCurrency.CREDITS) {
        await ReferralRepository.processCreditsConversion(
          request.id,
          userId,
          amountCents,
          logger,
        );
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
        message: "app.api.referral.errors.serverError.title",
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
  ): Promise<void> {
    // Deduct from earned credits
    const deductResult = await CreditRepository.deductEarnedCredits(
      userId,
      amountCents,
      requestId,
      "CREDITS",
      logger,
    );

    if (!deductResult.success) {
      // Mark request as failed
      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.FAILED,
          adminNotes: "Failed to deduct earned credits",
          updatedAt: new Date(),
        })
        .where(eq(payoutRequests.id, requestId));
      return;
    }

    // Add to permanent credits
    await CreditRepository.addUserCredits(
      userId,
      amountCents,
      "permanent",
      logger,
    );

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
  }

  /**
   * Admin: List all payout requests
   */
  static async listPayoutRequests(
    status: typeof PayoutStatusValue | null,
    limit: number,
    offset: number,
    logger: EndpointLogger,
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
      return fail({
        message: "app.api.referral.errors.serverError.title",
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
  ): Promise<ResponseType<void>> {
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: "app.api.referral.payout.errors.notFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.PENDING) {
        return fail({
          message: "app.api.referral.payout.errors.invalidStatus",
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
        message: "app.api.referral.errors.serverError.title",
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
  ): Promise<ResponseType<void>> {
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: "app.api.referral.payout.errors.notFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.PENDING) {
        return fail({
          message: "app.api.referral.payout.errors.invalidStatus",
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
        message: "app.api.referral.errors.serverError.title",
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
  ): Promise<ResponseType<void>> {
    try {
      const [request] = await db
        .select()
        .from(payoutRequests)
        .where(eq(payoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        return fail({
          message: "app.api.referral.payout.errors.notFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (request.status !== PayoutStatus.APPROVED) {
        return fail({
          message: "app.api.referral.payout.errors.invalidStatus",
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
        message: "app.api.referral.errors.serverError.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
