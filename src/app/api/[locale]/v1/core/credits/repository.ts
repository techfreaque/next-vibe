/**
 * Credit Repository
 * Handles all credit-related database operations
 */

import { and, desc, eq, gte, inArray, isNull, lt, or, sql } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
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
import { CreditTypeIdentifier, type CreditTypeIdentifierValue } from "./enum";

export type { CreditBalance };

/**
 * In-memory cache for credit identifier lookups
 * Reduces redundant database queries for subscription status checks
 * Cache expires after 30 seconds
 */
interface CreditIdentifierCacheEntry {
  userId?: string;
  leadId?: string;
  creditType: CreditTypeIdentifierValue;
  timestamp: number;
}

const creditIdentifierCache = new Map<string, CreditIdentifierCacheEntry>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Credit Transaction Interface
 */
export interface CreditTransactionOutput {
  id: string;
  amount: number;
  balanceAfter: number;
  type: "purchase" | "subscription" | "usage" | "expiry" | "free_tier";
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

  // Merge credits when leads are linked
  mergeLeadCredits(
    primaryLeadId: string,
    linkedLeadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;
}

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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        ErrorResponseTypes.BAD_REQUEST,
      );
    }

    if (identifier.userId) {
      const identifierResult = await this.getCreditIdentifierBySubscription(
        identifier.userId,
        identifier.leadId,
        logger,
      );
      if (identifierResult.success && identifierResult.data.userId) {
        return await this.getUserBalance(identifier.userId);
      }
    }

    return await this.getLeadBalanceAsBalance(identifier.leadId);
  }

  /**
   * Get user's current credit balance (internal)
   * Includes both userCredits (subscription/permanent) and leadCredits (free monthly)
   * Filters out expired credits
   */
  private async getUserBalance(
    userId: string,
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
        const leadBalanceResult = await this.getLeadBalance(userLead.leadId);
        if (leadBalanceResult.success) {
          const leadCredits = leadBalanceResult.data;
          total += leadCredits;
          free += leadCredits;
        }
      }

      return createSuccessResponse({
        total,
        expiring,
        permanent,
        free,
        expiresAt: earliestExpiry ? earliestExpiry.toISOString() : null,
      });
    } catch {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get lead's current credit balance as CreditBalance format
   */
  private async getLeadBalanceAsBalance(
    leadId: string,
  ): Promise<ResponseType<CreditBalance>> {
    const result = await this.getLeadBalance(leadId);
    if (!result.success) {
      return result as ResponseType<CreditBalance>;
    }

    return createSuccessResponse({
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
   */
  async getLeadBalance(leadId: string): Promise<ResponseType<number>> {
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
        });

        // Create transaction record
        await db.insert(creditTransactions).values({
          leadId,
          amount: freeCredits,
          balanceAfter: freeCredits,
          type: "free_tier",
        });

        return createSuccessResponse(freeCredits);
      }

      return createSuccessResponse(credits[0].amount);
    } catch {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
        // Public users always use lead credits
        return await this.getLeadBalanceAsBalance(user.leadId);
      }

      // Private user - check if they have multiple linked leads and merge if needed
      const allUserLeads = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, user.id));

      if (allUserLeads.length > 1) {
        // Find primary lead
        const primaryLead = allUserLeads.find((l) => l.isPrimary);
        const primaryLeadId = primaryLead?.leadId ?? allUserLeads[0].leadId;

        // Get all other lead IDs
        const linkedLeadIds = allUserLeads
          .filter((l) => l.leadId !== primaryLeadId)
          .map((l) => l.leadId);

        // Merge credits (idempotent - safe to call multiple times)
        const mergeResult = await this.mergeLeadCredits(
          primaryLeadId,
          linkedLeadIds,
          logger,
        );

        if (!mergeResult.success) {
          logger.error("Failed to merge credits for user with multiple leads", {
            userId: user.id,
            primaryLeadId,
            linkedLeadIds,
          });
        } else {
          logger.debug("Credits merged for user with multiple leads", {
            userId: user.id,
            primaryLeadId,
            linkedLeadIds,
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
          return createErrorResponse(
            "app.api.v1.core.agent.chat.credits.errors.noLeadFound",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        return await this.getBalance(
          { leadId: userLead.leadId, userId: effectiveUserId },
          logger,
        );
      }

      // If user has no subscription → return combined user credits + lead credits
      if (creditType === CreditTypeIdentifier.LEAD_FREE && effectiveLeadId) {
        // Get lead credits (free credits)
        const leadBalanceResult = await this.getLeadBalance(effectiveLeadId);

        if (!leadBalanceResult.success) {
          return leadBalanceResult;
        }

        const leadBalance = leadBalanceResult.data;

        // Also check for permanent credits in userCredits table
        const userCreditsResult = await this.getUserBalance(user.id);

        if (!userCreditsResult.success) {
          // If we can't get user credits, just return lead credits
          return createSuccessResponse({
            total: leadBalance,
            expiring: 0,
            permanent: 0,
            free: leadBalance,
            expiresAt: null,
          });
        }

        const userCreditsBalance = userCreditsResult.data;

        // Combine lead credits (free) with user permanent credits
        return createSuccessResponse({
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.noCreditSource",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    } catch (error) {
      logger.error("Failed to get credit balance for user", parseError(error), {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
        isPublic: user.isPublic,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

        // Get credit balance
        const credits = await db
          .select()
          .from(leadCredits)
          .where(eq(leadCredits.leadId, leadId))
          .limit(1);

        return createSuccessResponse({
          leadId,
          credits: credits[0]?.amount ?? 0,
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

      // Create initial free tier credits from products repository
      const freeTier = productsRepository.getProduct(
        ProductIds.FREE_TIER,
        locale,
      );
      const freeCredits = freeTier.credits;

      await db.insert(leadCredits).values({
        leadId: newLead.id,
        amount: freeCredits,
      });

      // Create transaction record
      await db.insert(creditTransactions).values({
        leadId: newLead.id,
        amount: freeCredits,
        balanceAfter: freeCredits,
        type: "free_tier",
      });

      logger.debug("Created new lead with free tier credits", {
        leadId: newLead.id,
        ipAddress,
        credits: freeCredits,
      });

      return createSuccessResponse({
        leadId: newLead.id,
        credits: freeCredits,
      });
    } catch (error) {
      logger.error("Failed to get or create lead by IP", parseError(error), {
        ipAddress,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getOrCreateLeadFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        ErrorResponseTypes.BAD_REQUEST,
      );
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
      const balanceResult = await this.getLeadBalance(leadId);
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
        type: "free_tier",
      });

      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Failed to add lead credits", parseError(error), {
        leadId,
        amount,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.addCreditsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      await db.insert(userCredits).values({
        userId,
        amount,
        type,
        expiresAt: expiresAt ?? null,
      });

      await db.insert(creditTransactions).values({
        userId,
        amount,
        balanceAfter: amount,
        type:
          type === "subscription"
            ? "subscription"
            : type === "free"
              ? "free_tier"
              : "purchase",
      });

      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Failed to add user credits", {
        userId,
        amount,
        type,
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.addCreditsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.invalidIdentifier",
        ErrorResponseTypes.BAD_REQUEST,
      );
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

        // Create transaction record
        await db.insert(creditTransactions).values({
          userId: identifier.userId,
          amount: -amount,
          balanceAfter: newBalance,
          type: "usage",
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
          return createErrorResponse(
            "app.api.v1.core.agent.chat.credits.errors.insufficientCredits",
            ErrorResponseTypes.NOT_FOUND,
          );
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
          type: "usage",
          modelId,
          messageId,
        });
      }

      return createSuccessResponse(undefined);
    } catch {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.deductCreditsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get transaction history by userId
   * Includes transactions from all leads linked to this user
   */
  async getTransactions(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    try {
      // Get all leadIds linked to this user
      const userLeadLinks = await db
        .select({ leadId: userLeads.leadId })
        .from(userLeads)
        .where(eq(userLeads.userId, userId));

      const leadIds = userLeadLinks.map((link) => link.leadId);

      // Fetch transactions where userId matches OR leadId matches any of user's leads
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(
          or(
            eq(creditTransactions.userId, userId),
            leadIds.length > 0
              ? inArray(creditTransactions.leadId, leadIds)
              : sql`false`,
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
            leadIds.length > 0
              ? inArray(creditTransactions.leadId, leadIds)
              : sql`false`,
          ),
        );

      return createSuccessResponse({
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getTransactionsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

      return createSuccessResponse({
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
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getTransactionsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

      return createSuccessResponse(expiredCredits.length);
    } catch {
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.deductCreditsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      // Check cache first
      const cacheKey = `${userId}:${leadId}`;
      const cached = creditIdentifierCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        logger.debug("Using cached credit identifier", {
          userId,
          creditType: cached.creditType,
          cacheAge: Date.now() - cached.timestamp,
        });
        return createSuccessResponse({
          userId: cached.userId,
          leadId: cached.leadId,
          creditType: cached.creditType,
        });
      }

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
        // Get primary lead for user
        const [userLead] = await db
          .select()
          .from(userLeads)
          .where(eq(userLeads.userId, userId))
          .limit(1);

        if (!userLead) {
          logger.error("No lead found for user", { userId });
          return createErrorResponse(
            "app.api.v1.core.agent.chat.credits.errors.noLeadFound",
            ErrorResponseTypes.NOT_FOUND,
          );
        }

        logger.debug("Using lead credits (non-subscription)", {
          userId,
          leadId: userLead.leadId,
        });
        result = {
          leadId: userLead.leadId,
          creditType: CreditTypeIdentifier.LEAD_FREE,
        };
      }

      // Cache the result
      creditIdentifierCache.set(cacheKey, {
        ...result,
        timestamp: Date.now(),
      });

      return createSuccessResponse(result);
    } catch (error) {
      logger.error("Failed to get credit identifier", parseError(error), {
        userId,
        leadId,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getCreditIdentifierFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

  /**
   * Merge credits when leads are linked
   * Sums up spent credits from all linked leads and consolidates into primary lead
   * Deletes duplicate lead credit records after merging
   *
   * Logic:
   * 1. Calculate total spent credits from all leads (initial free credits - current balance)
   * 2. Set primary lead balance to max(0, free credits - totalSpent)
   * 3. Delete credit records for linked leads
   * 4. Create transaction records for the merge
   */
  async mergeLeadCredits(
    primaryLeadId: string,
    linkedLeadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      if (linkedLeadIds.length === 0) {
        logger.debug("No linked leads to merge", { primaryLeadId });
        return createSuccessResponse(undefined);
      }

      // Get free tier credits from products repository
      const freeCredits = productsRepository.getProduct(
        ProductIds.FREE_TIER,
        "en-GLOBAL",
      ).credits;

      // Get all lead IDs including primary
      const allLeadIds = [primaryLeadId, ...linkedLeadIds];

      logger.debug("Starting credit merge", {
        primaryLeadId,
        linkedLeadIds,
        totalLeads: allLeadIds.length,
      });

      // Get all lead credit records
      const allCredits = await db
        .select()
        .from(leadCredits)
        .where(inArray(leadCredits.leadId, allLeadIds));

      // Calculate total spent credits across all leads
      // Each lead starts with free credits, so spent = freeCredits - current balance
      let totalSpent = 0;
      const creditDetails: Array<{
        leadId: string;
        balance: number;
        spent: number;
      }> = [];

      for (const leadId of allLeadIds) {
        const credit = allCredits.find((c) => c.leadId === leadId);
        const currentBalance = credit?.amount ?? freeCredits; // Default to free credits if no record exists
        const spent = freeCredits - currentBalance;
        totalSpent += spent;
        creditDetails.push({ leadId, balance: currentBalance, spent });
      }

      // Calculate merged balance: max(0, freeCredits - totalSpent)
      // If they spent 10 each (2 leads), totalSpent = 20, so balance = 0
      const mergedBalance = Math.max(0, freeCredits - totalSpent);

      logger.info("Calculated merged credits", {
        primaryLeadId,
        totalSpent,
        mergedBalance,
        creditDetails,
      });

      // Update or create primary lead credit record
      const [existingPrimaryCredit] = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, primaryLeadId))
        .limit(1);

      if (existingPrimaryCredit) {
        await db
          .update(leadCredits)
          .set({
            amount: mergedBalance,
            updatedAt: new Date(),
          })
          .where(eq(leadCredits.id, existingPrimaryCredit.id));
      } else {
        await db.insert(leadCredits).values({
          leadId: primaryLeadId,
          amount: mergedBalance,
        });
      }

      // Delete credit records for linked leads
      if (linkedLeadIds.length > 0) {
        await db
          .delete(leadCredits)
          .where(inArray(leadCredits.leadId, linkedLeadIds));

        logger.debug("Deleted credit records for linked leads", {
          linkedLeadIds,
          count: linkedLeadIds.length,
        });
      }

      // Create transaction record for the merge
      await db.insert(creditTransactions).values({
        leadId: primaryLeadId,
        amount: 0, // No new credits added, just consolidation
        balanceAfter: mergedBalance,
        type: "free_tier",
        modelId: null,
        messageId: null,
      });

      logger.info("Credit merge completed successfully", {
        primaryLeadId,
        linkedLeadIds,
        totalSpent,
        mergedBalance,
      });

      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Failed to merge lead credits", {
        error: parseError(error),
        primaryLeadId,
        linkedLeadIds,
      });
      return createErrorResponse(
        "app.api.v1.core.credits.errors.mergeFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}
export const creditRepository = new CreditRepository();
