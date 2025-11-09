/**
 * Credit Repository
 * Handles all credit-related database operations
 */

import { and, desc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
import {
  success,
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import {
  leadCredits,
  leads,
  userLeads,
} from "@/app/api/[locale]/v1/core/leads/db";
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
import { creditTransactions, userCredits } from "./db";
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
 * Extends BaseCreditHandler with repository-specific methods
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

  // Repository-specific methods
  // Get lead's current credit balance
  getLeadBalance(leadId: string): Promise<ResponseType<number>>;

  // Get credit balance for user (handles both subscription and lead credits)
  getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>>;

  // Get or create lead by IP address
  getOrCreateLeadByIp(
    ipAddress: string,
    locale: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>>;

  // Add credits (purchase or subscription)
  addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
  ): Promise<ResponseType<void>>;

  // Get transaction history
  getTransactions(
    userId: string,
    limit: number,
    offset: number,
    logger?: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  >;

  // Expire old subscription credits (cron job)
  expireCredits(): Promise<ResponseType<number>>;

  // Handle credit pack purchase from webhook
  handleCreditPackPurchase(
    session: CreditPackCheckoutSession,
    logger: EndpointLogger,
  ): Promise<void>;

  // Get correct credit identifier based on subscription status
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

  // Deduct credits for a feature (high-level wrapper)
  deductCreditsForFeature(
    user: { id?: string; leadId?: string; isPublic: boolean },
    cost: number,
    feature: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }>;
}

/**
 * Central Credit Transaction Manager
 * Handles monthly credit rotation and proper credit merging
 */
class CreditTransactionManager {
  /**
   * Check if a month has passed since the last credit period start
   * Returns true if we need to reset credits for this lead
   */
  private hasMonthPassed(lastPeriodStart: Date): boolean {
    const now = new Date();
    const lastStart = new Date(lastPeriodStart);

    // Calculate months difference
    const monthsDiff =
      (now.getFullYear() - lastStart.getFullYear()) * 12 +
      (now.getMonth() - lastStart.getMonth());

    return monthsDiff >= 1;
  }

  /**
   * Ensure monthly credits are current for a lead
   * If a month has passed, create a new transaction and reset the period
   * Returns the current credit amount after any monthly reset
   */
  async ensureMonthlyCredits(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    try {
      // Get current lead credit record
      const [credit] = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, leadId))
        .limit(1);

      // If no credit record exists, it will be created by getLeadBalance
      if (!credit) {
        return success(0);
      }

      // Check if a month has passed
      if (!this.hasMonthPassed(credit.monthlyPeriodStart)) {
        // No reset needed, return current amount
        return success(credit.amount);
      }

      // Month has passed - reset credits
      const freeCredits = productsRepository.getProduct(
        ProductIds.FREE_TIER,
        "en-GLOBAL",
      ).credits;

      const now = new Date();
      const previousPeriodStart = credit.monthlyPeriodStart;

      // Check if we already created a monthly reset transaction for this period
      // to prevent duplicate transactions in case of concurrent requests
      const [existingResetTransaction] = await db
        .select()
        .from(creditTransactions)
        .where(
          and(
            eq(creditTransactions.leadId, leadId),
            eq(creditTransactions.type, CreditTransactionType.MONTHLY_RESET),
            sql`${creditTransactions.metadata}->>'previousPeriodStart' = ${previousPeriodStart.toISOString()}`,
          ),
        )
        .limit(1);

      if (existingResetTransaction) {
        // Transaction already exists, just return current balance
        logger.debug("Monthly reset transaction already exists for this period", {
          leadId,
          transactionId: existingResetTransaction.id,
        });
        return success(credit.amount);
      }

      // Update the credit record with new period start
      await db
        .update(leadCredits)
        .set({
          amount: freeCredits,
          monthlyPeriodStart: now,
          updatedAt: now,
        })
        .where(eq(leadCredits.id, credit.id));

      // Create transaction record for monthly reset
      await db.insert(creditTransactions).values({
        leadId,
        amount: freeCredits,
        balanceAfter: freeCredits,
        type: CreditTransactionType.MONTHLY_RESET,
        metadata: {
          previousPeriodStart: previousPeriodStart.toISOString(),
          newPeriodStart: now.toISOString(),
          resetReason: "monthly_rotation",
        },
      });

      logger.info("Monthly credits reset for lead", {
        leadId,
        previousPeriodStart,
        newBalance: freeCredits,
      });

      return success(freeCredits);
    } catch (error) {
      logger.error("Failed to ensure monthly credits", parseError(error), {
        leadId,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.monthlyResetFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Find the oldest lead among a group of leads
   * This ensures we always merge into the oldest lead to preserve history
   */
  private async findOldestLead(leadIds: string[]): Promise<string | null> {
    if (leadIds.length === 0) {
      return null;
    }
    if (leadIds.length === 1) {
      return leadIds[0];
    }

    const leadsData = await db
      .select({
        id: leads.id,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .where(inArray(leads.id, leadIds))
      .orderBy(leads.createdAt);

    return leadsData[0]?.id ?? null;
  }

  /**
   * Merge credits from multiple leads into the oldest lead
   * Preserves all transaction history
   * Deletes only duplicate leadCredits records, never transactions
   *
   * Returns the oldest leadId that became the merge target
   */
  async mergeCreditsIntoOldest(
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      if (leadIds.length === 0) {
        return fail({
          message: "app.api.v1.core.credits.errors.noLeadsToMerge",
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      if (leadIds.length === 1) {
        return success(leadIds[0]);
      }

      // Find the oldest lead (merge target)
      const oldestLeadId = await this.findOldestLead(leadIds);
      if (!oldestLeadId) {
        return fail({
          message: "app.api.v1.core.credits.errors.oldestLeadNotFound",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const otherLeadIds = leadIds.filter((id) => id !== oldestLeadId);

      logger.info("Starting credit merge into oldest lead", {
        oldestLeadId,
        otherLeadIds,
        totalLeads: leadIds.length,
      });

      // Get free tier credits amount
      const freeCredits = productsRepository.getProduct(
        ProductIds.FREE_TIER,
        "en-GLOBAL",
      ).credits;

      // Get all credit records for these leads
      const allCredits = await db
        .select()
        .from(leadCredits)
        .where(inArray(leadCredits.leadId, leadIds));

      // Get oldest lead's current period start
      const [oldestCredit] = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, oldestLeadId))
        .limit(1);

      const oldestPeriodStart = oldestCredit?.monthlyPeriodStart ?? new Date();

      // Calculate spent IN CURRENT PERIOD ONLY
      // Get all USAGE transactions for this period across all leads
      let totalSpentThisPeriod = 0;

      for (const leadId of leadIds) {
        const credit = allCredits.find((c) => c.leadId === leadId);
        const periodStart = credit?.monthlyPeriodStart ?? oldestPeriodStart;

        // Get usage transactions since this lead's period started
        const usageTransactions = await db
          .select({ amount: creditTransactions.amount })
          .from(creditTransactions)
          .where(
            and(
              eq(creditTransactions.leadId, leadId),
              eq(creditTransactions.type, CreditTransactionType.USAGE),
              gte(creditTransactions.createdAt, periodStart),
            ),
          );

        const spentThisPeriod = usageTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0,
        );
        totalSpentThisPeriod += spentThisPeriod;
      }

      // Calculate merged balance: max(0, freeCredits - totalSpentThisPeriod)
      const mergedBalance = Math.max(0, freeCredits - totalSpentThisPeriod);

      logger.info("Calculated merged credits", {
        oldestLeadId,
        totalSpentThisPeriod,
        mergedBalance,
        periodStart: oldestPeriodStart,
      });

      // Update or create oldest lead credit record
      const [existingOldestCredit] = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, oldestLeadId))
        .limit(1);

      if (existingOldestCredit) {
        await db
          .update(leadCredits)
          .set({
            amount: mergedBalance,
            monthlyPeriodStart: existingOldestCredit.monthlyPeriodStart, // Keep original period
            updatedAt: new Date(),
          })
          .where(eq(leadCredits.id, existingOldestCredit.id));
      } else {
        await db.insert(leadCredits).values({
          leadId: oldestLeadId,
          amount: mergedBalance,
          monthlyPeriodStart: new Date(),
        });
      }

      // Delete credit records for other leads
      if (otherLeadIds.length > 0) {
        await db
          .delete(leadCredits)
          .where(inArray(leadCredits.leadId, otherLeadIds));

        logger.debug("Deleted duplicate credit records", {
          deletedLeadIds: otherLeadIds,
          count: otherLeadIds.length,
        });
      }

      // Update all credit transactions to point to oldest lead (preserve history)
      if (otherLeadIds.length > 0) {
        await db
          .update(creditTransactions)
          .set({ leadId: oldestLeadId })
          .where(inArray(creditTransactions.leadId, otherLeadIds));

        logger.debug("Updated credit transactions to oldest lead", {
          oldestLeadId,
          updatedFromLeadIds: otherLeadIds,
          count: otherLeadIds.length,
        });
      }

      logger.info("Credit merge completed successfully", {
        oldestLeadId,
        mergedFrom: otherLeadIds,
        totalSpentThisPeriod,
        mergedBalance,
      });

      return success(oldestLeadId);
    } catch (error) {
      logger.error("Failed to merge credits into oldest", parseError(error), {
        leadIds,
      });
      return fail({
        message: "app.api.v1.core.credits.errors.mergeFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a transaction record with full metadata
   */
  async createTransaction(
    params: {
      userId?: string;
      leadId?: string;
      amount: number;
      balanceAfter: number;
      type: CreditTransactionTypeValue;
      modelId?: string;
      messageId?: string;
      metadata?: Record<string, string | number | boolean | null>;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      await db.insert(creditTransactions).values({
        userId: params.userId ?? null,
        leadId: params.leadId ?? null,
        amount: params.amount,
        balanceAfter: params.balanceAfter,
        type: params.type,
        modelId: params.modelId ?? null,
        messageId: params.messageId ?? null,
        metadata: params.metadata ?? {},
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to create transaction", parseError(error), params);
      return fail({
        message: "app.api.v1.core.credits.errors.transactionFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Create singleton instance
export const creditTransactionManager = new CreditTransactionManager();

/**
 * Credit Repository Implementation
 * Extends BaseCreditHandler for shared logic
 */
class CreditRepository
  extends BaseCreditHandler
  implements CreditRepositoryInterface
{
  async getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    if (!identifier.leadId) {
      logger.error("getBalance requires leadId from DB");
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (identifier.userId) {
      const identifierResult = await this.getCreditIdentifierBySubscription(
        identifier.userId,
        identifier.leadId,
        logger,
      );
      if (identifierResult.success && identifierResult.data.userId) {
        return await this.getUserBalance(identifier.userId, logger);
      }
    }

    return await this.getLeadBalanceAsBalance(identifier.leadId, logger);
  }

  /**
   * Get user's current credit balance (internal)
   * Includes both userCredits (subscription/permanent) and leadCredits (free monthly)
   * Filters out expired credits
   */
  private async getUserBalance(
    userId: string,
    logger?: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      // Query credits, filtering out expired ones
      const credits = await db
        .select()
        .from(userCredits)
        .where(
          and(
            eq(userCredits.userId, userId),
            or(
              isNull(userCredits.expiresAt),
              gte(userCredits.expiresAt, new Date()),
            ),
          ),
        );

      let total = 0;
      let expiring = 0;
      let permanent = 0;
      let free = 0;
      let earliestExpiry: Date | null = null;

      for (const credit of credits) {
        total += credit.amount;

        if (credit.type === "subscription") {
          expiring += credit.amount;
          if (
            credit.expiresAt &&
            (!earliestExpiry || credit.expiresAt < earliestExpiry)
          ) {
            earliestExpiry = credit.expiresAt;
          }
        } else if (credit.type === "permanent") {
          permanent += credit.amount;
        } else if (credit.type === "free") {
          free += credit.amount;
        }
      }

      // Also include lead credits (free monthly credits) for subscribed users
      // Get user's lead to fetch their free monthly credits
      const [userLead] = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, userId))
        .limit(1);

      if (userLead) {
        const leadBalanceResult = await this.getLeadBalance(userLead.leadId, logger);
        if (leadBalanceResult.success) {
          const leadCredits = leadBalanceResult.data;
          total += leadCredits;
          free += leadCredits;
        }
      }

      return success({
        total,
        expiring,
        permanent,
        free,
        expiresAt: earliestExpiry ? earliestExpiry.toISOString() : null,
      });
    } catch {
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get lead's current credit balance as CreditBalance format
   */
  private async getLeadBalanceAsBalance(
    leadId: string,
    logger?: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    const result = await this.getLeadBalance(leadId, logger);
    if (!result.success) {
      return result as ResponseType<CreditBalance>;
    }

    return success({
      total: result.data,
      expiring: 0,
      permanent: 0,
      free: result.data,
      expiresAt: null,
    });
  }

  /**
   * Get lead's current credit balance
   * If lead has no credits, create initial free credits from products repository
   * Also handles monthly credit rotation automatically
   */
  async getLeadBalance(leadId: string, logger?: EndpointLogger): Promise<ResponseType<number>> {
    try {
      const credits = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, leadId))
        .limit(1);

      // Get free tier credits from products repository
      const freeCredits = productsRepository.getProduct(
        ProductIds.FREE_TIER,
        "en-GLOBAL",
      ).credits;

      // If lead has no credits, create initial free credits
      if (!credits[0]) {
        await db.insert(leadCredits).values({
          leadId,
          amount: freeCredits,
          monthlyPeriodStart: new Date(),
        });

        // Create transaction record
        await db.insert(creditTransactions).values({
          leadId,
          amount: freeCredits,
          balanceAfter: freeCredits,
          type: CreditTransactionType.FREE_TIER,
          metadata: {
            initialCreation: true,
            periodStart: new Date().toISOString(),
          },
        });

        return success(freeCredits);
      }

      // Check if monthly rotation is needed (if logger provided)
      if (logger) {
        const monthlyResult = await creditTransactionManager.ensureMonthlyCredits(
          leadId,
          logger,
        );
        if (monthlyResult.success) {
          return success(monthlyResult.data);
        }
      }

      return success(credits[0].amount);
    } catch {
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get credit balance for user (handles both subscription and lead credits)
   * Determines whether to use user credits or lead credits based on subscription status
   * Automatically merges credits if user has multiple linked leads
   */
  async getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    try {
      // Public users only have leadId and always use lead credits
      // Private users have id and leadId, may use either based on subscription
      if (user.isPublic) {
        // Public users always use lead credits (with monthly rotation)
        return await this.getLeadBalanceAsBalance(user.leadId, logger);
      }

      // Private user - check if they have multiple linked leads and merge if needed
      const allUserLeads = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, user.id));

      if (allUserLeads.length > 1) {
        // Merge credits (idempotent - safe to call multiple times)
        const mergeResult = await creditTransactionManager.mergeCreditsIntoOldest(
          allUserLeads.map((l) => l.leadId),
          logger,
        );

        if (!mergeResult.success) {
          logger.error("Failed to merge credits for user with multiple leads", {
            userId: user.id,
            allLeadIds: allUserLeads.map((l) => l.leadId),
          });
        } else {
          logger.debug("Credits merged for user with multiple leads", {
            userId: user.id,
            allLeadIds: allUserLeads.map((l) => l.leadId),
          });
        }
      }

      // Private user - check subscription to determine credit source
      const identifierResult = await this.getCreditIdentifierBySubscription(
        user.id,
        user.leadId,
        logger,
      );

      if (!identifierResult.success) {
        return identifierResult;
      }

      const {
        userId: effectiveUserId,
        leadId: effectiveLeadId,
        creditType,
      } = identifierResult.data;

      // If user has subscription → return user credits
      if (
        creditType === CreditTypeIdentifier.USER_SUBSCRIPTION &&
        effectiveUserId
      ) {
        // For subscription users, we need to get their primary leadId
        const [userLead] = await db
          .select()
          .from(userLeads)
          .where(eq(userLeads.userId, effectiveUserId))
          .limit(1);

        if (!userLead) {
          logger.error("No lead found for subscription user", {
            userId: effectiveUserId,
          });
          return fail({
            message: "app.api.v1.core.agent.chat.credits.errors.noLeadFound",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        return await this.getBalance(
          { leadId: userLead.leadId, userId: effectiveUserId },
          logger,
        );
      }

      // If user has no subscription → return combined user credits + lead credits
      if (creditType === CreditTypeIdentifier.LEAD_FREE && effectiveLeadId) {
        // Get lead credits (free credits)
        const leadBalanceResult = await this.getLeadBalance(effectiveLeadId, logger);

        if (!leadBalanceResult.success) {
          return leadBalanceResult;
        }

        const leadBalance = leadBalanceResult.data;

        // Also check for permanent credits in userCredits table
        const userCreditsResult = await this.getUserBalance(user.id, logger);

        if (!userCreditsResult.success) {
          // If we can't get user credits, just return lead credits
          return success({
            total: leadBalance,
            expiring: 0,
            permanent: 0,
            free: leadBalance,
            expiresAt: null,
          });
        }

        const userCreditsBalance = userCreditsResult.data;

        // Combine lead credits (free) with user permanent credits
        return success({
          total: leadBalance + userCreditsBalance.permanent,
          expiring: 0,
          permanent: userCreditsBalance.permanent,
          free: leadBalance,
          expiresAt: null,
        });
      }

      // Should never reach here
      logger.error("Invalid credit type or missing identifiers", {
        creditType,
        effectiveUserId,
        effectiveLeadId,
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.noCreditSource",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } catch (error) {
      logger.error("Failed to get credit balance for user", parseError(error), {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
        isPublic: user.isPublic,
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
      const existingLead = await db
        .select()
        .from(leads)
        .where(eq(leads.ipAddress, ipAddress))
        .limit(1);

      if (existingLead.length > 0) {
        const leadId = existingLead[0].id;

        // Get credit balance - use getLeadBalance to ensure credits exist and handle monthly rotation
        const balanceResult = await this.getLeadBalance(leadId, logger);
        const credits = balanceResult.success ? balanceResult.data : 0;

        return success({
          leadId,
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

      // Use getLeadBalance to create initial credits with proper duplicate prevention
      const balanceResult = await this.getLeadBalance(newLead.id, logger);
      const freeCredits = balanceResult.success ? balanceResult.data : 0;

      logger.debug("Created new lead with free tier credits", {
        leadId: newLead.id,
        ipAddress,
        credits: freeCredits,
      });

      return success({
        leadId: newLead.id,
        credits: freeCredits,
      });
    } catch (error) {
      logger.error("Failed to get or create lead by IP", parseError(error), {
        ipAddress,
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.getOrCreateLeadFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Add credits to user account
   * Overrides base implementation with database logic
   * CRITICAL: leadId is from DB, userId determines if subscription credits
   */
  async addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // CRITICAL: Validate leadId from DB
    if (!identifier.leadId) {
      logger.error("CRITICAL: addCredits requires leadId from DB");
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // If userId provided, add to user subscription credits
    if (identifier.userId) {
      return await this.addUserCredits(
        identifier.userId,
        amount,
        type as "subscription" | "permanent" | "free",
        logger,
      );
    }

    // Otherwise add to lead credits (public user)
    return await this.addLeadCredits(identifier.leadId, amount, logger);
  }

  /**
   * Add credits to lead account
   * For public users or when adding to specific lead
   */
  private async addLeadCredits(
    leadId: string,
    amount: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      // Get current balance
      const balanceResult = await this.getLeadBalance(leadId, logger);
      if (!balanceResult.success) {
        return balanceResult;
      }

      const currentBalance = balanceResult.data;
      const newBalance = currentBalance + amount;

      // Update lead credits
      await db
        .update(leadCredits)
        .set({ amount: newBalance, updatedAt: new Date() })
        .where(eq(leadCredits.leadId, leadId));

      // Create transaction record
      await db.insert(creditTransactions).values({
        leadId,
        amount,
        balanceAfter: newBalance,
        type: CreditTransactionType.FREE_TIER,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to add lead credits", parseError(error), {
        leadId,
        amount,
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.addCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Add credits to user account
   * For subscription credits - gets leadId from lead auth service
   */
  async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
  ): Promise<ResponseType<void>> {
    try {
      // Get PRIMARY leadId for this user to include in transaction
      const [primaryUserLead] = await db
        .select({ leadId: userLeads.leadId })
        .from(userLeads)
        .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
        .limit(1);

      await db.insert(userCredits).values({
        userId,
        amount,
        type,
        expiresAt: expiresAt ?? null,
      });

      // Create transaction with BOTH userId AND leadId for proper querying
      await db.insert(creditTransactions).values({
        userId,
        leadId: primaryUserLead?.leadId ?? null, // Include leadId if available
        amount,
        balanceAfter: amount,
        type:
          type === "subscription"
            ? CreditTransactionType.SUBSCRIPTION
            : type === "free"
              ? CreditTransactionType.FREE_TIER
              : CreditTransactionType.PURCHASE,
      });

      return success(undefined);
    } catch (error) {
      logger.error("Failed to add user credits", {
        userId,
        amount,
        type,
        error: parseError(error),
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.addCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits (for message usage)
   * Overrides base implementation with database logic
   * CRITICAL: leadId is ALWAYS from DB
   *
   * Logic:
   * - If userId + has subscription: Deduct from user subscription credits
   * - Otherwise: Deduct from lead credits (leadId from DB)
   */
  async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // CRITICAL: Validate leadId from DB
    if (!identifier.leadId) {
      logger.error("CRITICAL: deductCredits requires leadId from DB");
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      // Determine credit source based on subscription status
      let useUserCredits = false;
      if (identifier.userId) {
        const identifierResult = await this.getCreditIdentifierBySubscription(
          identifier.userId,
          identifier.leadId,
          logger,
        );
        useUserCredits =
          identifierResult.success && !!identifierResult.data.userId;
      }

      if (useUserCredits && identifier.userId) {
        // Deduct credits with correct priority:
        // 1. Lead credits (20 free monthly credits) - HIGHEST PRIORITY
        // 2. User free credits
        // 3. User subscription credits
        // 4. User permanent credits - LOWEST PRIORITY

        let remaining = amount;

        // STEP 1: Deduct from lead credits first (20 free monthly credits)
        const [leadCredit] = await db
          .select()
          .from(leadCredits)
          .where(eq(leadCredits.leadId, identifier.leadId))
          .limit(1);

        if (leadCredit && leadCredit.amount > 0) {
          const deduction = Math.min(leadCredit.amount, remaining);
          await db
            .update(leadCredits)
            .set({
              amount: sql`amount - ${deduction}`,
              updatedAt: new Date(),
            })
            .where(eq(leadCredits.id, leadCredit.id));
          remaining -= deduction;
        }

        // STEP 2: If still have remaining amount, deduct from user credits
        // Order: free → subscription → permanent
        if (remaining > 0) {
          const credits = await db
            .select()
            .from(userCredits)
            .where(
              and(
                eq(userCredits.userId, identifier.userId),
                or(
                  isNull(userCredits.expiresAt),
                  gte(userCredits.expiresAt, new Date()),
                ),
              ),
            )
            .orderBy(
              sql`CASE WHEN type = 'free' THEN 1 WHEN type = 'subscription' THEN 2 ELSE 3 END`,
            );

          for (const credit of credits) {
            if (remaining <= 0) {
              break;
            }

            const deduction = Math.min(credit.amount, remaining);

            if (deduction === credit.amount) {
              await db.delete(userCredits).where(eq(userCredits.id, credit.id));
            } else {
              await db
                .update(userCredits)
                .set({
                  amount: sql`amount - ${deduction}`,
                  updatedAt: new Date(),
                })
                .where(eq(userCredits.id, credit.id));
            }

            remaining -= deduction;
          }
        }

        // Get new balance (identifier already has leadId)
        const balanceResult = await this.getBalance(identifier, logger);
        const newBalance = balanceResult.success ? balanceResult.data.total : 0;

        // Create transaction record with BOTH userId AND leadId for proper querying
        await db.insert(creditTransactions).values({
          userId: identifier.userId,
          leadId: identifier.leadId, // CRITICAL: Include leadId for transaction history queries
          amount: -amount,
          balanceAfter: newBalance,
          type: CreditTransactionType.USAGE,
          modelId,
          messageId,
        });
      } else {
        // Deduct from lead credits (leadId from DB)
        const [credit] = await db
          .select()
          .from(leadCredits)
          .where(eq(leadCredits.leadId, identifier.leadId))
          .limit(1);

        if (!credit) {
          return fail({
            message:
              "app.api.v1.core.agent.chat.credits.errors.insufficientCredits",
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        await db
          .update(leadCredits)
          .set({ amount: sql`amount - ${amount}`, updatedAt: new Date() })
          .where(eq(leadCredits.id, credit.id));

        const newAmount = credit.amount - amount;

        // Create transaction record
        await db.insert(creditTransactions).values({
          leadId: identifier.leadId,
          amount: -amount,
          balanceAfter: newAmount,
          type: CreditTransactionType.USAGE,
          modelId,
          messageId,
        });
      }

      return success(undefined);
    } catch {
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.deductCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transaction history by userId
   * Uses cluster resolver to find canonical (oldest) lead
   * After credit merging, only the oldest lead retains transaction history
   */
  async getTransactions(
    userId: string,
    limit: number,
    offset: number,
    logger?: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      // Use cluster resolver to find canonical lead for this user
      const { getCanonicalLeadForUser } = await import(
        "../leads/cluster-resolver"
      );
      const canonicalLeadId = await getCanonicalLeadForUser(userId, logger);

      logger?.debug("Getting transactions for user", {
        userId,
        canonicalLeadId,
      });

      if (!canonicalLeadId) {
        logger?.warn("No canonical lead found for user, returning empty", {
          userId,
        });
        return success({
          transactions: [],
          totalCount: 0,
        });
      }

      // Fetch transactions for the canonical lead
      // Query by BOTH userId AND leadId to catch all transactions
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(
          or(
            eq(creditTransactions.userId, userId),
            eq(creditTransactions.leadId, canonicalLeadId),
          ),
        )
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(
          or(
            eq(creditTransactions.userId, userId),
            eq(creditTransactions.leadId, canonicalLeadId),
          ),
        );

      logger?.debug("Found transactions for user", {
        userId,
        canonicalLeadId,
        count,
      });

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
    } catch {
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get transaction history by leadId (for public users)
   */
  async getTransactionsByLeadId(
    leadId: string,
    limit: number,
    offset: number,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.leadId, leadId))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.leadId, leadId));

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
    } catch {
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.errors.getTransactionsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Expire old subscription credits (cron job)
   */
  async expireCredits(): Promise<ResponseType<number>> {
    try {
      const expiredCredits = await db
        .delete(userCredits)
        .where(
          and(
            eq(userCredits.type, "subscription"),
            lt(userCredits.expiresAt, new Date()),
          ),
        )
        .returning();

      return success(expiredCredits.length);
    } catch {
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.deductCreditsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get correct credit identifier based on subscription status
   * Logic:
   * - If user has active subscription → return { userId } (use user credits)
   * - If user has no subscription → return { leadId } (use lead credits)
   *
   * Optimization: Uses in-memory cache with 30-second TTL to reduce database queries
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

      let result: {
        userId?: string;
        leadId?: string;
        creditType: CreditTypeIdentifierValue;
      };

      if (hasActiveSubscription) {
        // User has active subscription → use user credits
        logger.debug("Using user credits (subscription)", {
          userId,
          subscriptionId: subscription.id,
        });
        result = {
          userId,
          creditType: CreditTypeIdentifier.USER_SUBSCRIPTION,
        };
      } else {
        // User has no active subscription → use lead credits
        // Get PRIMARY lead for user (the one with isPrimary=true)
        const [primaryUserLead] = await db
          .select()
          .from(userLeads)
          .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
          .limit(1);

        if (!primaryUserLead) {
          // Fallback: try to get any lead for this user
          const [anyUserLead] = await db
            .select()
            .from(userLeads)
            .where(eq(userLeads.userId, userId))
            .limit(1);

          if (!anyUserLead) {
            logger.error("No lead found for user", { userId });
            return fail({
              message: "app.api.v1.core.agent.chat.credits.errors.noLeadFound",
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }

          logger.warn("Using non-primary lead for user (primary not found)", {
            userId,
            leadId: anyUserLead.leadId,
          });
          result = {
            leadId: anyUserLead.leadId,
            creditType: CreditTypeIdentifier.LEAD_FREE,
          };
        } else {
          logger.debug("Using lead credits (non-subscription)", {
            userId,
            leadId: primaryUserLead.leadId,
          });
          result = {
            leadId: primaryUserLead.leadId,
            creditType: CreditTypeIdentifier.LEAD_FREE,
          };
        }
      }

      return success(result);
    } catch (error) {
      logger.error("Failed to get credit identifier", parseError(error), {
        userId,
        leadId,
      });
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.errors.getCreditIdentifierFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Deduct credits for a feature (high-level wrapper)
   */
  async deductCreditsForFeature(
    user: { id?: string; leadId?: string; isPublic: boolean },
    cost: number,
    feature: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }> {
    // Skip deduction only if cost is 0 or negative
    if (cost <= 0) {
      logger.debug("Skipping credit deduction - zero or negative cost", {
        feature,
        cost,
      });
      return { success: true };
    }

    // Validate leadId is present (required for both public and private users)
    if (!user.leadId) {
      logger.error("No leadId available for credit deduction", {
        feature,
        cost,
        isPublic: user.isPublic,
      });
      return { success: false };
    }

    try {
      const creditMessageId = crypto.randomUUID();
      let creditIdentifier: CreditIdentifier;

      // Public users always use lead credits
      if (user.isPublic) {
        creditIdentifier = { leadId: user.leadId };
        logger.debug("Using lead credits for public user", {
          leadId: user.leadId,
          feature,
          cost,
        });
      } else if (user.id && user.leadId) {
        // Private users: check subscription to determine credit source
        const identifierResult = await this.getCreditIdentifierBySubscription(
          user.id,
          user.leadId,
          logger,
        );

        if (identifierResult.success && identifierResult.data) {
          if (
            identifierResult.data.creditType ===
            CreditTypeIdentifier.USER_SUBSCRIPTION
          ) {
            creditIdentifier = { leadId: user.leadId, userId: user.id };
          } else {
            creditIdentifier = { leadId: user.leadId };
          }
        } else {
          creditIdentifier = { leadId: user.leadId };
        }
      } else if (user.leadId) {
        creditIdentifier = { leadId: user.leadId, userId: user.id };
      } else {
        logger.error("No leadId available for credit deduction");
        return { success: false };
      }

      const deductResult = await this.deductCredits(
        creditIdentifier,
        cost,
        feature,
        creditMessageId,
        logger,
      );

      if (!deductResult.success) {
        logger.error(`Failed to deduct credits for ${feature}`, {
          userId: user.isPublic ? undefined : user.id,
          leadId: user.leadId,
          cost,
        });
        return { success: false };
      }

      logger.info(`Credits deducted successfully for ${feature}`, {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
        cost,
        messageId: creditMessageId,
      });

      return { success: true, messageId: creditMessageId };
    } catch (error) {
      logger.error(`Error deducting credits for ${feature}`, {
        error: error instanceof Error ? error.message : String(error),
        userId: user.id,
        cost,
      });
      return { success: false };
    }
  }

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
        undefined,
      );

      if (!result.success) {
        logger.error("Failed to add credits after purchase", {
          sessionId: session.id,
          userId,
          totalCredits,
        });
      } else {
        logger.info("Credits added successfully after purchase", {
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
}
export const creditRepository = new CreditRepository();
