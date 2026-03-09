/**
 * User View Repository Implementation
 * Business logic for fetching comprehensive user details with statistics
 */

import "server-only";

import { and, count, desc, eq, inArray, sql, sum } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import {
  ChatMessageRoleDB,
  ThreadStatusDB,
} from "@/app/api/[locale]/agent/chat/enum";
import {
  creditPacks,
  creditTransactions,
  creditWallets,
} from "@/app/api/[locale]/credits/db";
import {
  CreditPackType,
  CreditTransactionTypeDB,
} from "@/app/api/[locale]/credits/enum";
import { newsletterSubscriptions } from "@/app/api/[locale]/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/app/api/[locale]/newsletter/enum";
import {
  paymentRefunds,
  paymentTransactions,
} from "@/app/api/[locale]/payment/db";
import { PaymentStatusDB } from "@/app/api/[locale]/payment/enum";
import {
  referralCodes,
  referralEarnings,
} from "@/app/api/[locale]/referral/db";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import { SubscriptionStatusDB } from "@/app/api/[locale]/subscription/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles, users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserViewResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class UserViewRepository {
  /**
   * Get comprehensive user view data
   */
  static async getUserView(
    userId: string,
    requestingUser: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserViewResponseOutput>> {
    try {
      logger.debug("Fetching user view data", {
        userId,
        requestingUserId: requestingUser.id,
      });

      // Fetch basic user info
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Run all queries in parallel for better performance
      const [
        chatStatsResult,
        creditInfoResult,
        paymentStatsResult,
        newsletterInfoResult,
        referralStatsResult,
        userRolesResult,
        recentActivityResult,
        modelUsageStatsResult,
      ] = await Promise.all([
        // Chat Statistics
        this.getChatStats(userId),
        // Credit Information
        this.getCreditInfo(userId),
        // Payment Statistics
        this.getPaymentStats(userId),
        // Newsletter Information
        this.getNewsletterInfo(user.email),
        // Referral Statistics
        this.getReferralStats(userId),
        // User Roles
        this.getUserRoles(userId),
        // Recent Activity
        this.getRecentActivity(userId),
        // Model Usage Statistics
        this.getModelUsageStats(userId),
      ]);

      logger.debug("User view data fetched successfully", { userId });

      return success({
        basicInfo: {
          id: user.id,
          email: user.email,
          privateName: user.privateName,
          publicName: user.publicName,
          avatarUrl: user.avatarUrl,
          locale: user.locale,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          marketingConsent: user.marketingConsent,
          isBanned: user.isBanned,
          bannedReason: user.bannedReason,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        chatStats: chatStatsResult,
        creditInfo: creditInfoResult,
        paymentStats: paymentStatsResult,
        newsletterInfo: newsletterInfoResult,
        referralStats: referralStatsResult,
        roles: userRolesResult,
        recentActivity: recentActivityResult,
        modelUsageStats: modelUsageStatsResult,
      });
    } catch (error) {
      logger.error("Error fetching user view data", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get chat statistics for user
   */
  private static async getChatStats(userId: string): Promise<{
    totalThreads: number;
    activeThreads: number;
    archivedThreads: number;
    totalMessages: number;
    userMessages: number;
    aiMessages: number;
    lastActivityAt: Date | null;
  }> {
    // Get thread counts
    const [[threadsCount], [activeThreadsCount], [archivedThreadsCount]] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(chatThreads)
          .where(eq(chatThreads.userId, userId)),
        db
          .select({ count: count() })
          .from(chatThreads)
          .where(
            sql`${chatThreads.userId} = ${userId} AND ${chatThreads.status} = ${ThreadStatusDB[0]} AND ${chatThreads.archived} = false`,
          ),
        db
          .select({ count: count() })
          .from(chatThreads)
          .where(
            sql`${chatThreads.userId} = ${userId} AND ${chatThreads.archived} = true`,
          ),
      ]);

    // Get message counts
    const userThreadIds = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.userId, userId));

    const threadIds = userThreadIds.map((t) => t.id);

    if (threadIds.length === 0) {
      return {
        totalThreads: 0,
        activeThreads: 0,
        archivedThreads: 0,
        totalMessages: 0,
        userMessages: 0,
        aiMessages: 0,
        lastActivityAt: null,
      };
    }

    const [[messagesCount], [userMessagesCount], [aiMessagesCount]] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(chatMessages)
          .where(inArray(chatMessages.threadId, threadIds)),
        db
          .select({ count: count() })
          .from(chatMessages)
          .where(
            and(
              inArray(chatMessages.threadId, threadIds),
              eq(chatMessages.role, ChatMessageRoleDB[1]),
            ),
          ),
        db
          .select({ count: count() })
          .from(chatMessages)
          .where(
            and(
              inArray(chatMessages.threadId, threadIds),
              eq(chatMessages.role, ChatMessageRoleDB[0]),
            ),
          ),
      ]);

    // Get last activity
    const [lastActivity] = await db
      .select({ lastActivityAt: chatMessages.createdAt })
      .from(chatMessages)
      .where(inArray(chatMessages.threadId, threadIds))
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);

    return {
      totalThreads: threadsCount?.count ?? 0,
      activeThreads: activeThreadsCount?.count ?? 0,
      archivedThreads: archivedThreadsCount?.count ?? 0,
      totalMessages: messagesCount?.count ?? 0,
      userMessages: userMessagesCount?.count ?? 0,
      aiMessages: aiMessagesCount?.count ?? 0,
      lastActivityAt: lastActivity?.lastActivityAt ?? null,
    };
  }

  /**
   * Get credit information for user
   */
  private static async getCreditInfo(userId: string): Promise<{
    currentBalance: number;
    freeCreditsRemaining: number;
    totalCreditsEarned: number;
    totalCreditsSpent: number;
    totalCreditsPurchased: number;
    freePeriodStart: Date | null;
    freePeriodId: string | null;
    subscriptionCredits: number;
    permanentCredits: number;
    bonusCredits: number;
    earnedCredits: number;
    nextExpiry: Date | null;
  }> {
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (!wallet) {
      return {
        currentBalance: 0,
        freeCreditsRemaining: 0,
        totalCreditsEarned: 0,
        totalCreditsSpent: 0,
        totalCreditsPurchased: 0,
        freePeriodStart: null,
        freePeriodId: null,
        subscriptionCredits: 0,
        permanentCredits: 0,
        bonusCredits: 0,
        earnedCredits: 0,
        nextExpiry: null,
      };
    }

    // Get transaction totals and pack breakdown in parallel
    const [[earnedResult], [spentResult], [purchasedResult], packBreakdown] =
      await Promise.all([
        // Total credits earned (positive transactions excluding purchases)
        db
          .select({ total: sum(creditTransactions.amount) })
          .from(creditTransactions)
          .where(
            sql`${creditTransactions.walletId} = ${wallet.id} AND ${creditTransactions.type} IN (${CreditTransactionTypeDB[4]}, ${CreditTransactionTypeDB[5]})`,
          ),
        // Total credits spent (negative transactions)
        db
          .select({ total: sum(creditTransactions.amount) })
          .from(creditTransactions)
          .where(
            sql`${creditTransactions.walletId} = ${wallet.id} AND ${creditTransactions.amount} < 0`,
          ),
        // Total credits purchased
        db
          .select({ total: sum(creditTransactions.amount) })
          .from(creditTransactions)
          .where(
            sql`${creditTransactions.walletId} = ${wallet.id} AND ${creditTransactions.type} IN (${CreditTransactionTypeDB[1]}, ${CreditTransactionTypeDB[2]})`,
          ),
        // Credit pack breakdown by type (remaining > 0 only)
        db
          .select({
            type: creditPacks.type,
            total: sum(creditPacks.remaining),
            nextExpiry: sql<Date | null>`MIN(${creditPacks.expiresAt})`,
          })
          .from(creditPacks)
          .where(
            sql`${creditPacks.walletId} = ${wallet.id} AND ${creditPacks.remaining} > 0`,
          )
          .groupBy(creditPacks.type),
      ]);

    // Extract pack amounts by type
    let subscriptionCredits = 0;
    let permanentCredits = 0;
    let bonusCredits = 0;
    let earnedCreditsRemaining = 0;
    let nextExpiry: Date | null = null;

    for (const pack of packBreakdown) {
      const amount = Number(pack.total) || 0;
      if (pack.type === CreditPackType.SUBSCRIPTION) {
        subscriptionCredits = amount;
        if (pack.nextExpiry) {
          nextExpiry = pack.nextExpiry;
        }
      } else if (pack.type === CreditPackType.PERMANENT) {
        permanentCredits = amount;
      } else if (pack.type === CreditPackType.BONUS) {
        bonusCredits = amount;
      } else if (pack.type === CreditPackType.EARNED) {
        earnedCreditsRemaining = amount;
      }
    }

    return {
      currentBalance: Number(wallet.balance) || 0,
      freeCreditsRemaining: Number(wallet.freeCreditsRemaining) || 0,
      totalCreditsEarned: Math.abs(Number(earnedResult?.total) || 0),
      totalCreditsSpent: Math.abs(Number(spentResult?.total) || 0),
      totalCreditsPurchased: Number(purchasedResult?.total) || 0,
      freePeriodStart: wallet.freePeriodStart,
      freePeriodId: wallet.freePeriodId,
      subscriptionCredits,
      permanentCredits,
      bonusCredits,
      earnedCredits: earnedCreditsRemaining,
      nextExpiry,
    };
  }

  /**
   * Get payment statistics for user
   */
  private static async getPaymentStats(userId: string): Promise<{
    totalRevenueCents: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalRefundsCents: number;
    lastPaymentAt: Date | null;
    stripeCustomerId: string | null;
    hasActiveSubscription: boolean;
  }> {
    // Get payment totals
    const [[revenueResult], [paymentsCount], [successfulCount], [failedCount]] =
      await Promise.all([
        // Total revenue
        db
          .select({ total: sum(paymentTransactions.amount) })
          .from(paymentTransactions)
          .where(
            sql`${paymentTransactions.userId} = ${userId} AND ${paymentTransactions.status} = ${PaymentStatusDB[2]}`,
          ),
        // Total payments
        db
          .select({ count: count() })
          .from(paymentTransactions)
          .where(eq(paymentTransactions.userId, userId)),
        // Successful payments
        db
          .select({ count: count() })
          .from(paymentTransactions)
          .where(
            sql`${paymentTransactions.userId} = ${userId} AND ${paymentTransactions.status} = ${PaymentStatusDB[2]}`,
          ),
        // Failed payments
        db
          .select({ count: count() })
          .from(paymentTransactions)
          .where(
            sql`${paymentTransactions.userId} = ${userId} AND ${paymentTransactions.status} = ${PaymentStatusDB[3]}`,
          ),
      ]);

    // Get refund total
    const [refundResult] = await db
      .select({ total: sum(paymentRefunds.amount) })
      .from(paymentRefunds)
      .where(eq(paymentRefunds.userId, userId));

    // Get last payment
    const [lastPayment] = await db
      .select({ createdAt: paymentTransactions.createdAt })
      .from(paymentTransactions)
      .where(
        sql`${paymentTransactions.userId} = ${userId} AND ${paymentTransactions.status} = ${PaymentStatusDB[2]}`,
      )
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(1);

    // Check for active subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        sql`${subscriptions.userId} = ${userId} AND ${subscriptions.status} = ${SubscriptionStatusDB[0]}`,
      )
      .limit(1);

    // Get user's Stripe customer ID
    const [userRecord] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Convert string amounts to cents (multiply by 100)
    const totalRevenueCents = Math.round(
      (Number(revenueResult?.total) || 0) * 100,
    );
    const totalRefundsCents = Math.round(
      (Number(refundResult?.total) || 0) * 100,
    );

    return {
      totalRevenueCents,
      totalPayments: paymentsCount?.count ?? 0,
      successfulPayments: successfulCount?.count ?? 0,
      failedPayments: failedCount?.count ?? 0,
      totalRefundsCents,
      lastPaymentAt: lastPayment?.createdAt ?? null,
      stripeCustomerId: userRecord?.stripeCustomerId ?? null,
      hasActiveSubscription: !!subscription,
    };
  }

  /**
   * Get newsletter information for user
   */
  private static async getNewsletterInfo(email: string): Promise<{
    isSubscribed: boolean;
    subscribedAt: Date | null;
    confirmedAt: Date | null;
    lastEmailSentAt: Date | null;
  }> {
    const [newsletter] = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (!newsletter) {
      return {
        isSubscribed: false,
        subscribedAt: null,
        confirmedAt: null,
        lastEmailSentAt: null,
      };
    }

    return {
      isSubscribed:
        newsletter.status === NewsletterSubscriptionStatus.SUBSCRIBED,
      subscribedAt: newsletter.subscriptionDate,
      confirmedAt: newsletter.confirmedAt,
      lastEmailSentAt: newsletter.lastEmailSentDate,
    };
  }

  /**
   * Get referral statistics for user
   */
  private static async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    totalReferralRevenueCents: number;
    totalReferralEarningsCents: number;
    activeReferralCodes: number;
  }> {
    // Get referral codes count
    const [activeCodesCount] = await db
      .select({ count: count() })
      .from(referralCodes)
      .where(
        sql`${referralCodes.ownerUserId} = ${userId} AND ${referralCodes.isActive} = true`,
      );

    // Get total referrals (distinct users referred)
    const [referralsCountResult] = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${referralEarnings.sourceUserId})`,
      })
      .from(referralEarnings)
      .where(eq(referralEarnings.earnerUserId, userId));

    // Get total referral revenue and earnings
    const [earningsResult] = await db
      .select({ total: sum(referralEarnings.amountCents) })
      .from(referralEarnings)
      .where(eq(referralEarnings.earnerUserId, userId));

    return {
      totalReferrals: Number(referralsCountResult?.count) || 0,
      totalReferralRevenueCents: 0, // Revenue calculation requires additional business logic
      totalReferralEarningsCents: Math.round(Number(earningsResult.total) || 0),
      activeReferralCodes: activeCodesCount.count ?? 0,
    };
  }

  /**
   * Get user roles
   */
  private static async getUserRoles(
    userId: string,
  ): Promise<Array<{ role: string; assignedAt: Date }>> {
    const roles = await db
      .select({
        role: userRoles.role,
        assignedAt: userRoles.createdAt,
      })
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
      .orderBy(userRoles.createdAt);

    return roles.map((r) => ({
      role: r.role,
      assignedAt: r.assignedAt,
    }));
  }

  /**
   * Get recent activity summary
   */
  private static async getRecentActivity(userId: string): Promise<{
    lastLogin: Date | null;
    lastThreadCreated: Date | null;
    lastMessageSent: Date | null;
    lastPayment: Date | null;
  }> {
    // Get user's threads for message queries
    const userThreadIds = await db
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(eq(chatThreads.userId, userId));

    const threadIds = userThreadIds.map((t) => t.id);

    const [lastThread, lastMessage, lastPayment] = await Promise.all([
      // Last thread created
      db
        .select({ createdAt: chatThreads.createdAt })
        .from(chatThreads)
        .where(eq(chatThreads.userId, userId))
        .orderBy(desc(chatThreads.createdAt))
        .limit(1)
        .then((r) => r[0]),
      // Last message sent (if threads exist)
      threadIds.length > 0
        ? db
            .select({ createdAt: chatMessages.createdAt })
            .from(chatMessages)
            .where(
              and(
                inArray(chatMessages.threadId, threadIds),
                eq(chatMessages.role, ChatMessageRoleDB[1]),
              ),
            )
            .orderBy(desc(chatMessages.createdAt))
            .limit(1)
            .then((r) => r[0])
        : null,
      // Last payment
      db
        .select({ createdAt: paymentTransactions.createdAt })
        .from(paymentTransactions)
        .where(
          sql`${paymentTransactions.userId} = ${userId} AND ${paymentTransactions.status} = ${PaymentStatusDB[2]}`,
        )
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(1)
        .then((r) => r[0]),
    ]);

    // Note: lastLogin would require session tracking, which we don't have in the schema
    // Using updatedAt as a proxy for now
    const [user] = await db
      .select({ updatedAt: users.updatedAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return {
      lastLogin: user?.updatedAt ?? null,
      lastThreadCreated: lastThread?.createdAt ?? null,
      lastMessageSent: lastMessage?.createdAt ?? null,
      lastPayment: lastPayment?.createdAt ?? null,
    };
  }

  /**
   * Get model usage statistics for user
   */
  private static async getModelUsageStats(
    userId: string,
  ): Promise<
    Array<{ modelId: string; totalCreditsSpent: number; messageCount: number }>
  > {
    const [wallet] = await db
      .select()
      .from(creditWallets)
      .where(eq(creditWallets.userId, userId))
      .limit(1);

    if (!wallet) {
      return [];
    }

    const results = await db
      .select({
        modelId: creditTransactions.modelId,
        totalCreditsSpent: sql<number>`ABS(SUM(${creditTransactions.amount}))`,
        messageCount: count(),
      })
      .from(creditTransactions)
      .where(
        sql`${creditTransactions.walletId} = ${wallet.id} AND ${creditTransactions.type} = ${CreditTransactionTypeDB[3]} AND ${creditTransactions.modelId} IS NOT NULL`,
      )
      .groupBy(creditTransactions.modelId)
      .orderBy(sql`ABS(SUM(${creditTransactions.amount})) DESC`);

    return results.map((r) => ({
      modelId: r.modelId ?? "unknown",
      totalCreditsSpent: Number(r.totalCreditsSpent) || 0,
      messageCount: r.messageCount,
    }));
  }
}
