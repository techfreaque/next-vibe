/**
 * Referral Repository
 * Business logic for referral code operations
 */

import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CodesListGetResponseOutput } from "./codes/list/definition";
import {
  referralCodes,
  leadReferrals,
  userReferrals,
  referralEarnings,
} from "./db";
import type {
  ReferralPostRequestOutput,
  ReferralPostResponseOutput,
} from "./definition";
import type { EarningsListGetResponseOutput } from "./earnings/list/definition";
import { ReferralEarningStatus } from "./enum";
import type { LinkToLeadPostResponseOutput } from "./link-to-lead/definition";
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
 * Referral Repository Interface
 */
export interface ReferralRepository {
  createReferralCode(
    userId: string,
    data: ReferralPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ReferralPostResponseOutput>>;

  getUserReferralCodes(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CodesListGetResponseOutput>>;

  validateReferralCode(
    code: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ id: string; ownerUserId: string }>>;

  linkReferralToLead(
    leadId: string,
    referralCode: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LinkToLeadPostResponseOutput>>;

  convertLeadReferralToUser(
    userId: string,
    leadId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  getReferralStats(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatsGetResponseOutput>>;

  getReferralEarnings(
    userId: string,
    limit: number,
    offset: number,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EarningsListGetResponseOutput>>;

  applyReferralPayoutOnPayment(
    transactionId: string,
    userId: string,
    amountCents: number,
    currency: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;
}

/**
 * Referral Repository Implementation
 */
export class ReferralRepositoryImpl implements ReferralRepository {
  /**
   * Create a new referral code
   */
  async createReferralCode(
    userId: string,
    data: ReferralPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ReferralPostResponseOutput>> {
    try {
      logger.debug("Creating referral code", {
        code: data.code,
        userId,
      });

      // Check if code already exists
      const [existingCode] = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, data.code))
        .limit(1);

      if (existingCode) {
        return fail({
          message: "app.api.referral.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [newCode] = await db
        .insert(referralCodes)
        .values({
          code: data.code,
          ownerUserId: userId,
          label: data.label ?? null,
          maxUses: data.maxUses ?? null,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          isActive: true,
          currentUses: 0,
        })
        .returning();

      logger.debug("Referral code created successfully", {
        codeId: newCode.id,
      });

      return success({
        id: newCode.id,
        responseCode: newCode.code,
        responseLabel: newCode.label,
        responseMaxUses: newCode.maxUses,
        ownerUserId: newCode.ownerUserId,
        currentUses: newCode.currentUses,
        isActive: newCode.isActive,
        createdAt: newCode.createdAt.toISOString(),
        updatedAt: newCode.updatedAt.toISOString(),
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
  async getUserReferralCodes(
    userId: string,
    locale: CountryLanguage,
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
      const codesWithStats = codes.map((code) => {
        return {
          id: code.id,
          code: code.code,
          label: code.label,
          currentUses: code.currentUses,
          maxUses: code.maxUses,
          isActive: code.isActive,
          expiresAt: code.expiresAt?.toISOString() ?? null,
          createdAt: code.createdAt.toISOString(),
          totalSignups: 0,
          totalRevenueCents: 0,
          totalEarningsCents: 0,
        };
      });

      return success({ codes: codesWithStats });
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
  async validateReferralCode(
    code: string,
    locale: CountryLanguage,
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

      // Check if code is expired
      if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
        return fail({
          message: "app.api.referral.errors.validation.title",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      // Check if code has reached max uses
      if (
        referralCode.maxUses &&
        referralCode.currentUses >= referralCode.maxUses
      ) {
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
   */
  async linkReferralToLead(
    leadId: string,
    referralCode: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LinkToLeadPostResponseOutput>> {
    try {
      logger.debug("Linking referral to lead", { leadId, referralCode });

      // Validate referral code
      const codeResult = await this.validateReferralCode(
        referralCode,
        locale,
        logger,
      );
      if (!codeResult.success) {
        return codeResult;
      }

      const { id: codeId } = codeResult.data;

      // Check if lead already has a referral
      const [existingReferral] = await db
        .select()
        .from(leadReferrals)
        .where(eq(leadReferrals.leadId, leadId))
        .limit(1);

      if (existingReferral) {
        // Already linked - idempotent
        logger.debug("Lead already has referral", { leadId });
        return success({
          referralCode,
        });
      }

      // Create lead referral record
      await db.insert(leadReferrals).values({
        referralCodeId: codeId,
        leadId,
      });

      logger.debug("Referral linked to lead successfully", { leadId, codeId });

      return success({
        referralCode,
      });
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
   * Convert lead referral to user referral (Phase 2: During signup)
   * Called after user account is created to make referral permanent
   */
  async convertLeadReferralToUser(
    userId: string,
    leadId: string,
    locale: CountryLanguage,
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
        return success(undefined);
      }

      // Get lead referral
      const [leadReferral] = await db
        .select()
        .from(leadReferrals)
        .where(eq(leadReferrals.leadId, leadId))
        .limit(1);

      if (!leadReferral) {
        // No referral for this lead - not an error
        logger.debug("No referral found for lead", { leadId });
        return success(undefined);
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
        return success(undefined);
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
      });

      return success(undefined);
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
   */
  async getReferralStats(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StatsGetResponseOutput>> {
    try {
      logger.debug("Getting referral stats", { userId });

      // Count total referrals
      const totalReferrals = await db
        .select({ count: sql<number>`count(*)` })
        .from(userReferrals)
        .where(eq(userReferrals.referrerUserId, userId));

      // Calculate earnings by status
      const earningsByStatus = await db
        .select({
          status: referralEarnings.status,
          total: sql<number>`COALESCE(SUM(${referralEarnings.amountCents}), 0)`,
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId))
        .groupBy(referralEarnings.status);

      const pendingEarnings =
        earningsByStatus.find((e) => e.status === ReferralEarningStatus.PENDING)
          ?.total || 0;
      const confirmedEarnings =
        earningsByStatus.find(
          (e) => e.status === ReferralEarningStatus.CONFIRMED,
        )?.total || 0;

      return success({
        totalReferrals: Number(totalReferrals[0]?.count || 0),
        totalEarningsCents: Number(pendingEarnings) + Number(confirmedEarnings),
        pendingEarningsCents: Number(pendingEarnings),
        confirmedEarningsCents: Number(confirmedEarnings),
        currency: "EUR", // TODO: Get from user's currency preference
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
  async getReferralEarnings(
    userId: string,
    limit: number,
    offset: number,
    locale: CountryLanguage,
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
   */
  async applyReferralPayoutOnPayment(
    transactionId: string,
    userId: string,
    amountCents: number,
    currency: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Applying referral payout", {
        transactionId,
        userId,
        amountCents,
      });

      // Get referral chain for the user
      const chain = await this.getReferralChain(userId, logger);

      if (chain.length === 0) {
        logger.debug("No referral chain found for user", { userId });
        return success(undefined);
      }

      // Calculate commission shares
      const shares = this.calculateCommissionShares(amountCents, chain);

      // Insert earnings records
      for (const share of shares) {
        await db
          .insert(referralEarnings)
          .values({
            earnerUserId: share.earnerUserId,
            sourceUserId: userId,
            transactionId,
            level: share.level,
            amountCents: share.amountCents,
            currency,
            status: ReferralEarningStatus.CONFIRMED,
          })
          .onConflictDoNothing(); // Idempotency: ignore if already exists
      }

      logger.debug("Referral payout applied successfully", {
        transactionId,
        sharesCount: shares.length,
      });

      return success(undefined);
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
  private async getReferralChain(
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
  private calculateCommissionShares(
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
}

/**
 * Default repository instance
 */
export const referralRepository = new ReferralRepositoryImpl();
