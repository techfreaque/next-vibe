/**
 * Credit Repository
 * Handles all credit-related database operations
 */

import { and, desc, eq, lt, sql } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { leadCredits, leads, userLeads } from "@/app/api/[locale]/v1/core/leads/db";
import { LeadSource, LeadStatus } from "@/app/api/[locale]/v1/core/leads/enum";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { subscriptions } from "@/app/api/[locale]/v1/core/subscription/db";
import { SubscriptionStatus } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountriesArr, LanguagesArr } from "@/i18n/core/config";

import { creditTransactions, userCredits } from "./db";

/**
 * Credit Balance Interface
 */
export interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

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
 */
export interface CreditRepositoryInterface {
  // Get user's current credit balance
  getBalance(userId: string): Promise<ResponseType<CreditBalance>>;

  // Get lead's current credit balance
  getLeadBalance(leadId: string): Promise<ResponseType<number>>;

  // Get or create lead by IP address
  getOrCreateLeadByIp(
    ipAddress: string,
    locale: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>>;

  // Add credits (purchase or subscription)
  addCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    expiresAt?: Date,
  ): Promise<ResponseType<void>>;

  // Deduct credits (for message usage) - works for both users and leads
  deductCredits(
    identifier: { userId?: string; leadId?: string },
    amount: number,
    modelId: string,
    messageId: string,
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

  // Get correct credit identifier based on subscription status
  getCreditIdentifier(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ userId?: string; leadId?: string; creditType: string }>
  >;
}

/**
 * Credit Repository Implementation
 */
class CreditRepository implements CreditRepositoryInterface {
  /**
   * Get user's current credit balance
   */
  async getBalance(userId: string): Promise<ResponseType<CreditBalance>> {
    try {
      const credits = await db
        .select()
        .from(userCredits)
        .where(eq(userCredits.userId, userId));

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
   * Get lead's current credit balance
   * If lead has no credits, create initial 20 free credits
   */
  async getLeadBalance(leadId: string): Promise<ResponseType<number>> {
    try {
      const credits = await db
        .select()
        .from(leadCredits)
        .where(eq(leadCredits.leadId, leadId))
        .limit(1);

      // If lead has no credits, create initial 20 free credits
      if (!credits[0]) {
        await db.insert(leadCredits).values({
          leadId,
          amount: 20,
        });

        // Create transaction record
        await db.insert(creditTransactions).values({
          leadId,
          amount: 20,
          balanceAfter: 20,
          type: "free_tier",
        });

        return createSuccessResponse(20);
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
   * Get or create lead by IP address
   */
  async getOrCreateLeadByIp(
    ipAddress: string,
    locale: string,
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
      const [language, country] = locale.split("-") as [string, string];
      const [newLead] = await db
        .insert(leads)
        .values({
          ipAddress,
          businessName: "",
          country: (country || "GLOBAL") as (typeof CountriesArr)[number],
          language: (language || "en") as (typeof LanguagesArr)[number],
          status: LeadStatus.WEBSITE_USER,
          source: LeadSource.WEBSITE,
        })
        .returning();

      // Create initial 20 credits
      await db.insert(leadCredits).values({
        leadId: newLead.id,
        amount: 20,
      });

      // Create transaction record
      await db.insert(creditTransactions).values({
        leadId: newLead.id,
        amount: 20,
        balanceAfter: 20,
        type: "free_tier",
      });

      logger.info("Created new lead with free tier credits", {
        leadId: newLead.id,
        ipAddress,
      });

      return createSuccessResponse({
        leadId: newLead.id,
        credits: 20,
      });
    } catch (error) {
      logger.error("Failed to get or create lead by IP", { error, ipAddress });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getOrCreateLeadFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Add credits to user account
   */
  async addCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    expiresAt?: Date,
  ): Promise<ResponseType<void>> {
    try {
      // Add credits
      await db.insert(userCredits).values({
        userId,
        amount,
        type,
        expiresAt: expiresAt ?? null,
      });

      // Get new balance
      const balanceResult = await this.getBalance(userId);
      const newBalance = balanceResult.success
        ? balanceResult.data.total
        : amount;

      // Create transaction record
      await db.insert(creditTransactions).values({
        userId,
        amount,
        balanceAfter: newBalance,
        type: type === "subscription" ? "subscription" : "purchase",
      });

      return createSuccessResponse(undefined);
    } catch (error) {
      console.error("Failed to add credits:", error);
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.addCreditsFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Deduct credits (for message usage)
   */
  async deductCredits(
    identifier: { userId?: string; leadId?: string },
    amount: number,
    modelId: string,
    messageId: string,
  ): Promise<ResponseType<void>> {
    try {
      if (identifier.userId) {
        // Deduct from user credits (expiring first, then permanent)
        const credits = await db
          .select()
          .from(userCredits)
          .where(eq(userCredits.userId, identifier.userId))
          .orderBy(
            sql`CASE WHEN type = 'subscription' THEN 1 WHEN type = 'free' THEN 2 ELSE 3 END`,
          );

        let remaining = amount;
        for (const credit of credits) {
          if (remaining <= 0) {
            break;
          }

          const deduction = Math.min(credit.amount, remaining);
          const newAmount = credit.amount - deduction;

          if (newAmount > 0) {
            await db
              .update(userCredits)
              .set({ amount: newAmount, updatedAt: new Date() })
              .where(eq(userCredits.id, credit.id));
          } else {
            await db.delete(userCredits).where(eq(userCredits.id, credit.id));
          }

          remaining -= deduction;
        }

        // Get new balance
        const balanceResult = await this.getBalance(identifier.userId);
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
      } else if (identifier.leadId) {
        // Deduct from lead credits
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

        const newAmount = credit.amount - amount;
        await db
          .update(leadCredits)
          .set({ amount: newAmount, updatedAt: new Date() })
          .where(eq(leadCredits.id, credit.id));

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
   * Get transaction history
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
      const transactions = await db
        .select()
        .from(creditTransactions)
        .where(eq(creditTransactions.userId, userId))
        .orderBy(desc(creditTransactions.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(creditTransactions)
        .where(eq(creditTransactions.userId, userId));

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
   */
  async getCreditIdentifier(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{ userId?: string; leadId?: string; creditType: string }>
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
        // User has active subscription → use user credits
        logger.debug("Using user credits (subscription)", {
          userId,
          subscriptionId: subscription.id,
        });
        return createSuccessResponse({
          userId,
          creditType: "user_subscription",
        });
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
        return createSuccessResponse({
          leadId: userLead.leadId,
          creditType: "lead_free",
        });
      }
    } catch (error) {
      logger.error("Failed to get credit identifier", {
        error,
        userId,
        leadId,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getCreditIdentifierFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}
export const creditRepository = new CreditRepository();
