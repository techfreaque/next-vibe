/**
 * User View Repository Implementation
 * Business logic for fetching comprehensive user details with statistics
 */

import "server-only";

import { and, count, desc, eq, gt, inArray, or, sql, sum } from "drizzle-orm";
import { chatMessages, chatThreads } from "next-vibe/agent/chat/db";
import { ChatMessageRole, ThreadStatusDB } from "next-vibe/agent/chat/enum";
import { customSkills } from "next-vibe/agent/skills/db";
import { chatFavorites } from "next-vibe/agent/skills/favorites/db";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import {
  leadLeadLinks,
  leads,
  userLeadLinks,
} from "next-vibe/identity/lead/db";
import { sessions } from "next-vibe/identity/session/db";
import { userRoles, users } from "next-vibe/identity/user/db";
import { errorLogs } from "next-vibe/logger/error-monitor/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { growthJourneys } from "@/leads/growth/db";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { paymentRefunds, paymentTransactions } from "@/payment/db";
import { PaymentStatus, RefundStatus } from "@/payment/enum";
import { referralCodes, referralEarnings, userReferrals } from "@/referral/db";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import { roundMoney, usdAmountSql } from "../money-sql";
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

      // Wallets whose spend belongs to this user: own wallet + directly linked
      // lead wallets (free-tier spend happens on lead wallets).
      const walletIds = await UserViewRepository.getWalletIds(userId);

      const [
        chatStats,
        creditInfo,
        paymentStats,
        payments,
        subscriptionRows,
        newsletterInfo,
        referralStats,
        referredBy,
        referredUsers,
        attribution,
        roles,
        recentActivity,
        engagement,
        errorLogRows,
        modelUsageStats,
        connections,
      ] = await Promise.all([
        UserViewRepository.getChatStats(userId),
        UserViewRepository.getCreditInfo(userId, walletIds),
        UserViewRepository.getPaymentStats(userId, user.stripeCustomerId),
        UserViewRepository.getPayments(userId),
        UserViewRepository.getSubscriptions(userId),
        UserViewRepository.getNewsletterInfo(user.email),
        UserViewRepository.getReferralStats(userId),
        UserViewRepository.getReferredBy(userId),
        UserViewRepository.getReferredUsers(userId),
        UserViewRepository.getAttribution(userId),
        UserViewRepository.getUserRoles(userId),
        UserViewRepository.getRecentActivity(userId, walletIds),
        UserViewRepository.getEngagement(userId),
        UserViewRepository.getErrorLogs(userId),
        UserViewRepository.getModelUsageStats(userId),
        UserViewRepository.getConnections(userId),
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
        chatStats,
        creditInfo,
        paymentStats,
        payments,
        subscriptions: subscriptionRows,
        newsletterInfo,
        referralStats,
        referredBy,
        referredUsers,
        attribution,
        roles,
        recentActivity,
        engagement,
        errorLogs: errorLogRows,
        modelUsageStats,
        connectedLeads: connections.connectedLeads,
        connectedUsers: connections.connectedUsers,
      });
    } catch (error) {
      logger.error("Error fetching user view data", parseError(error), {
        userId,
      });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.serverError.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async getWalletIds(userId: string): Promise<string[]> {
    const [own, leadWallets] = await Promise.all([
      db
        .select({ id: creditWallets.id })
        .from(creditWallets)
        .where(eq(creditWallets.userId, userId)),
      db
        .select({ id: creditWallets.id })
        .from(userLeadLinks)
        .innerJoin(
          creditWallets,
          eq(creditWallets.leadId, userLeadLinks.leadId),
        )
        .where(eq(userLeadLinks.userId, userId)),
    ]);
    return [...new Set([...own, ...leadWallets].map((w) => w.id))];
  }

  /**
   * Chat statistics. Incognito chats are never stored, so these undercount;
   * credit spend is the real usage signal.
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
    const [[threadCounts], [messageCounts]] = await Promise.all([
      db
        .select({
          total: sql<number>`count(*)::int`,
          active: sql<number>`count(*) filter (where ${chatThreads.status} = ${ThreadStatusDB[0]} and ${chatThreads.archived} = false)::int`,
          archived: sql<number>`count(*) filter (where ${chatThreads.archived} = true)::int`,
        })
        .from(chatThreads)
        .where(eq(chatThreads.userId, userId)),
      db
        .select({
          total: sql<number>`count(*)::int`,
          user: sql<number>`count(*) filter (where ${chatMessages.role} = ${ChatMessageRole.USER})::int`,
          ai: sql<number>`count(*) filter (where ${chatMessages.role} = ${ChatMessageRole.ASSISTANT})::int`,
          lastAt: sql<Date | null>`max(${chatMessages.createdAt})`.mapWith(
            chatMessages.createdAt,
          ),
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatThreads.id, chatMessages.threadId))
        .where(eq(chatThreads.userId, userId)),
    ]);

    return {
      totalThreads: Number(threadCounts?.total ?? 0),
      activeThreads: Number(threadCounts?.active ?? 0),
      archivedThreads: Number(threadCounts?.archived ?? 0),
      totalMessages: Number(messageCounts?.total ?? 0),
      userMessages: Number(messageCounts?.user ?? 0),
      aiMessages: Number(messageCounts?.ai ?? 0),
      lastActivityAt: messageCounts?.lastAt ?? null,
    };
  }

  /**
   * Credit wallet. freeCreditsRemaining sums linked lead wallets (the user
   * wallet itself never holds free credits). Spend counts every wallet that
   * belongs to the user.
   */
  private static async getCreditInfo(
    userId: string,
    walletIds: string[],
  ): Promise<{
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

    const [freeResult] = await db
      .select({ total: sum(creditWallets.freeCreditsRemaining) })
      .from(userLeadLinks)
      .innerJoin(creditWallets, eq(creditWallets.leadId, userLeadLinks.leadId))
      .where(eq(userLeadLinks.userId, userId));

    const [[totals], packBreakdown] = await Promise.all([
      walletIds.length > 0
        ? db
            .select({
              spent: sql<number>`coalesce(sum(-${creditTransactions.amount}) filter (where ${creditTransactions.type} = ${CreditTransactionType.USAGE}), 0)::float8`,
              earned: sql<number>`coalesce(sum(${creditTransactions.amount}) filter (where ${creditTransactions.type} = ${CreditTransactionType.REFERRAL_EARNING}), 0)::float8`,
              purchased: sql<number>`coalesce(sum(${creditTransactions.amount}) filter (where ${creditTransactions.type} in (${CreditTransactionType.PURCHASE}, ${CreditTransactionType.SUBSCRIPTION})), 0)::float8`,
            })
            .from(creditTransactions)
            .where(inArray(creditTransactions.walletId, walletIds))
        : Promise.resolve([{ spent: 0, earned: 0, purchased: 0 }]),
      wallet
        ? db
            .select({
              type: creditPacks.type,
              total: sum(creditPacks.remaining),
              nextExpiry:
                sql<Date | null>`min(${creditPacks.expiresAt})`.mapWith(
                  creditPacks.expiresAt,
                ),
            })
            .from(creditPacks)
            .where(
              and(
                eq(creditPacks.walletId, wallet.id),
                gt(creditPacks.remaining, 0),
              ),
            )
            .groupBy(creditPacks.type)
        : Promise.resolve([]),
    ]);

    let subscriptionCredits = 0;
    let permanentCredits = 0;
    let bonusCredits = 0;
    let earnedCreditsRemaining = 0;
    let nextExpiry: Date | null = null;
    for (const pack of packBreakdown) {
      const amount = Number(pack.total) || 0;
      if (pack.type === CreditPackType.SUBSCRIPTION) {
        subscriptionCredits = amount;
        nextExpiry = pack.nextExpiry;
      } else if (pack.type === CreditPackType.PERMANENT) {
        permanentCredits = amount;
      } else if (pack.type === CreditPackType.BONUS) {
        bonusCredits = amount;
      } else if (pack.type === CreditPackType.EARNED) {
        earnedCreditsRemaining = amount;
      }
    }

    return {
      currentBalance: roundMoney(Number(wallet?.balance ?? 0)),
      freeCreditsRemaining: roundMoney(Number(freeResult?.total ?? 0)),
      totalCreditsEarned: roundMoney(Number(totals?.earned ?? 0)),
      totalCreditsSpent: roundMoney(Number(totals?.spent ?? 0)),
      totalCreditsPurchased: roundMoney(Number(totals?.purchased ?? 0)),
      freePeriodStart: wallet?.freePeriodStart ?? null,
      freePeriodId: wallet?.freePeriodId ?? null,
      subscriptionCredits: roundMoney(subscriptionCredits),
      permanentCredits: roundMoney(permanentCredits),
      bonusCredits: roundMoney(bonusCredits),
      earnedCredits: roundMoney(earnedCreditsRemaining),
      nextExpiry,
    };
  }

  /**
   * Payment totals in USD (static FX, same table as finance-status).
   */
  private static async getPaymentStats(
    userId: string,
    stripeCustomerId: string | null,
  ): Promise<{
    totalPaidUsd: number;
    totalRefundedUsd: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    firstPaymentAt: Date | null;
    lastPaymentAt: Date | null;
    stripeCustomerId: string | null;
    hasActiveSubscription: boolean;
    subscriptionPlan: string | null;
    subscriptionInterval: string | null;
    subscriptionNextBilling: Date | null;
    subscriptionStatus: string | null;
    cancelAtPeriodEnd: boolean;
  }> {
    const [[paymentRow], [refundRow], [subscription]] = await Promise.all([
      db
        .select({
          paidUsd: sql<number>`coalesce(sum(${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}), 0)::float8`,
          total: sql<number>`count(*)::int`,
          succeeded: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})::int`,
          failed: sql<number>`count(*) filter (where ${paymentTransactions.status} = ${PaymentStatus.FAILED})::int`,
          pending: sql<number>`count(*) filter (where ${paymentTransactions.status} in (${PaymentStatus.PENDING}, ${PaymentStatus.PROCESSING}))::int`,
          firstAt:
            sql<Date | null>`min(${paymentTransactions.createdAt}) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})`.mapWith(
              paymentTransactions.createdAt,
            ),
          lastAt:
            sql<Date | null>`max(${paymentTransactions.createdAt}) filter (where ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED})`.mapWith(
              paymentTransactions.createdAt,
            ),
        })
        .from(paymentTransactions)
        .where(eq(paymentTransactions.userId, userId)),
      db
        .select({
          refundedUsd: sql<number>`coalesce(sum(${usdAmountSql(paymentRefunds.amount, paymentRefunds.currency)}), 0)::float8`,
        })
        .from(paymentRefunds)
        .where(
          and(
            eq(paymentRefunds.userId, userId),
            eq(paymentRefunds.status, RefundStatus.SUCCEEDED),
          ),
        ),
      db
        .select({
          status: subscriptions.status,
          planId: subscriptions.planId,
          billingInterval: subscriptions.billingInterval,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1),
    ]);

    const status = subscription?.status ?? null;
    return {
      totalPaidUsd: roundMoney(Number(paymentRow?.paidUsd ?? 0)),
      totalRefundedUsd: roundMoney(Number(refundRow?.refundedUsd ?? 0)),
      totalPayments: Number(paymentRow?.total ?? 0),
      successfulPayments: Number(paymentRow?.succeeded ?? 0),
      failedPayments: Number(paymentRow?.failed ?? 0),
      pendingPayments: Number(paymentRow?.pending ?? 0),
      firstPaymentAt: paymentRow?.firstAt ?? null,
      lastPaymentAt: paymentRow?.lastAt ?? null,
      stripeCustomerId,
      hasActiveSubscription:
        status === SubscriptionStatus.ACTIVE ||
        status === SubscriptionStatus.TRIALING,
      subscriptionPlan: subscription?.planId ?? null,
      subscriptionInterval: subscription?.billingInterval ?? null,
      subscriptionNextBilling: subscription?.currentPeriodEnd ?? null,
      subscriptionStatus: status,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    };
  }

  /** Most recent payment attempts, any status. */
  private static async getPayments(userId: string): Promise<
    Array<{
      id: string;
      createdAt: Date;
      amount: number;
      currency: string;
      amountUsd: number;
      status: string;
      provider: string;
      mode: string;
    }>
  > {
    const rows = await db
      .select({
        id: paymentTransactions.id,
        createdAt: paymentTransactions.createdAt,
        amount: paymentTransactions.amount,
        currency: paymentTransactions.currency,
        amountUsd: sql<number>`${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}::float8`,
        status: paymentTransactions.status,
        provider: paymentTransactions.provider,
        mode: paymentTransactions.mode,
      })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, userId))
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(25);
    return rows.map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
      amount: Number(r.amount),
      currency: r.currency,
      amountUsd: roundMoney(Number(r.amountUsd)),
      status: r.status,
      provider: r.provider,
      mode: r.mode,
    }));
  }

  private static async getSubscriptions(userId: string): Promise<
    Array<{
      id: string;
      status: string;
      planId: string;
      billingInterval: string;
      provider: string;
      createdAt: Date;
      currentPeriodEnd: Date | null;
      cancelAtPeriodEnd: boolean;
      canceledAt: Date | null;
    }>
  > {
    return db
      .select({
        id: subscriptions.id,
        status: subscriptions.status,
        planId: subscriptions.planId,
        billingInterval: subscriptions.billingInterval,
        provider: subscriptions.provider,
        createdAt: subscriptions.createdAt,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        canceledAt: subscriptions.canceledAt,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(20);
  }

  /**
   * Referral performance as a referrer: signups through their links, how many
   * of those pay, and earnings per currency (amounts are minor units).
   */
  private static async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    payingReferrals: number;
    activeReferralCodes: number;
    earnings: Array<{ currency: string; amountCents: number; count: number }>;
  }> {
    const [[codes], [signups], earnings] = await Promise.all([
      db
        .select({ count: count() })
        .from(referralCodes)
        .where(
          and(
            eq(referralCodes.ownerUserId, userId),
            eq(referralCodes.isActive, true),
          ),
        ),
      db
        .select({
          total: sql<number>`count(*)::int`,
          paying: sql<number>`count(*) filter (where exists (select 1 from ${paymentTransactions} where ${paymentTransactions.userId} = ${userReferrals.referredUserId} and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}))::int`,
        })
        .from(userReferrals)
        .where(eq(userReferrals.referrerUserId, userId)),
      db
        .select({
          currency: referralEarnings.currency,
          amountCents: sql<number>`coalesce(sum(${referralEarnings.amountCents}), 0)::int`,
          count: sql<number>`count(*)::int`,
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.earnerUserId, userId))
        .groupBy(referralEarnings.currency),
    ]);

    return {
      totalReferrals: Number(signups?.total ?? 0),
      payingReferrals: Number(signups?.paying ?? 0),
      activeReferralCodes: Number(codes?.count ?? 0),
      earnings: earnings.map((e) => ({
        currency: e.currency,
        amountCents: Number(e.amountCents),
        count: Number(e.count),
      })),
    };
  }

  /** Who referred this user, if anyone. */
  private static async getReferredBy(userId: string): Promise<{
    userId: string;
    email: string;
    code: string | null;
    referredAt: Date;
  } | null> {
    const [row] = await db
      .select({
        userId: userReferrals.referrerUserId,
        email: users.email,
        code: referralCodes.code,
        referredAt: userReferrals.createdAt,
      })
      .from(userReferrals)
      .innerJoin(users, eq(users.id, userReferrals.referrerUserId))
      .leftJoin(
        referralCodes,
        eq(referralCodes.id, userReferrals.referralCodeId),
      )
      .where(eq(userReferrals.referredUserId, userId))
      .limit(1);
    return row ?? null;
  }

  /** Users who signed up through this user's links, newest first. */
  private static async getReferredUsers(
    userId: string,
  ): Promise<
    Array<{ id: string; email: string; createdAt: Date; totalPaidUsd: number }>
  > {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        totalPaidUsd: sql<number>`coalesce((select sum(${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}) from ${paymentTransactions} where ${paymentTransactions.userId} = ${users.id} and ${paymentTransactions.status} = ${PaymentStatus.SUCCEEDED}), 0)::float8`,
      })
      .from(userReferrals)
      .innerJoin(users, eq(users.id, userReferrals.referredUserId))
      .where(eq(userReferrals.referrerUserId, userId))
      .orderBy(desc(users.createdAt))
      .limit(50);
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      createdAt: r.createdAt,
      totalPaidUsd: roundMoney(Number(r.totalPaidUsd)),
    }));
  }

  /** First/last touch attribution from the growth journey. */
  private static async getAttribution(userId: string): Promise<{
    firstChannel: string;
    firstSource: string | null;
    firstMedium: string | null;
    firstCampaign: string | null;
    firstRefCode: string | null;
    firstReferrerHost: string | null;
    firstLandingPath: string | null;
    firstTouchAt: Date;
    lastChannel: string;
    lastTouchAt: Date;
    firstChatAt: Date | null;
    signedUpAt: Date | null;
    firstPaidAt: Date | null;
  } | null> {
    const [row] = await db
      .select({
        firstChannel: growthJourneys.firstChannel,
        firstSource: growthJourneys.firstSource,
        firstMedium: growthJourneys.firstMedium,
        firstCampaign: growthJourneys.firstCampaign,
        firstRefCode: growthJourneys.firstRefCode,
        firstReferrerHost: growthJourneys.firstReferrerHost,
        firstLandingPath: growthJourneys.firstLandingPath,
        firstTouchAt: growthJourneys.firstTouchAt,
        lastChannel: growthJourneys.lastChannel,
        lastTouchAt: growthJourneys.lastTouchAt,
        firstChatAt: growthJourneys.firstChatAt,
        signedUpAt: growthJourneys.signedUpAt,
        firstPaidAt: growthJourneys.firstPaidAt,
      })
      .from(growthJourneys)
      .where(eq(growthJourneys.userId, userId))
      .limit(1);
    return row ?? null;
  }

  private static async getEngagement(userId: string): Promise<{
    favoritesCount: number;
    customSkillsCount: number;
  }> {
    const [[favorites], [skills]] = await Promise.all([
      db
        .select({ count: count() })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId)),
      db
        .select({ count: count() })
        .from(customSkills)
        .where(eq(customSkills.userId, userId)),
    ]);
    return {
      favoritesCount: Number(favorites?.count ?? 0),
      customSkillsCount: Number(skills?.count ?? 0),
    };
  }

  /**
   * Error log rows whose logger metadata mentions this user id.
   * error_logs has no user column; the id lands in metadata via logger context.
   */
  private static async getErrorLogs(userId: string): Promise<
    Array<{
      id: string;
      message: string;
      level: string;
      occurrences: number;
      lastSeenAt: Date;
      resolved: boolean;
    }>
  > {
    return db
      .select({
        id: errorLogs.id,
        message: errorLogs.message,
        level: errorLogs.level,
        occurrences: errorLogs.occurrences,
        lastSeenAt: errorLogs.createdAt,
        resolved: errorLogs.resolved,
      })
      .from(errorLogs)
      .where(sql`${errorLogs.metadata}::text like ${`%${userId}%`}`)
      .orderBy(desc(errorLogs.createdAt))
      .limit(15);
  }

  /**
   * Activity timestamps. lastLogin = newest session; lastCreditUsage covers
   * own and linked lead wallets.
   */
  private static async getRecentActivity(
    userId: string,
    walletIds: string[],
  ): Promise<{
    lastLogin: Date | null;
    lastThreadCreated: Date | null;
    lastMessageSent: Date | null;
    lastPayment: Date | null;
    lastCreditUsage: Date | null;
    activeSessions: number;
  }> {
    const [[sessionRow], [threadRow], [messageRow], [paymentRow], usageRows] =
      await Promise.all([
        db
          .select({
            lastAt: sql<Date | null>`max(${sessions.createdAt})`.mapWith(
              sessions.createdAt,
            ),
            active: sql<number>`count(*) filter (where ${sessions.expiresAt} > now())::int`,
          })
          .from(sessions)
          .where(eq(sessions.userId, userId)),
        db
          .select({
            lastAt: sql<Date | null>`max(${chatThreads.createdAt})`.mapWith(
              chatThreads.createdAt,
            ),
          })
          .from(chatThreads)
          .where(eq(chatThreads.userId, userId)),
        db
          .select({
            lastAt: sql<Date | null>`max(${chatMessages.createdAt})`.mapWith(
              chatMessages.createdAt,
            ),
          })
          .from(chatMessages)
          .innerJoin(chatThreads, eq(chatThreads.id, chatMessages.threadId))
          .where(
            and(
              eq(chatThreads.userId, userId),
              eq(chatMessages.role, ChatMessageRole.USER),
            ),
          ),
        db
          .select({
            lastAt:
              sql<Date | null>`max(${paymentTransactions.createdAt})`.mapWith(
                paymentTransactions.createdAt,
              ),
          })
          .from(paymentTransactions)
          .where(
            and(
              eq(paymentTransactions.userId, userId),
              eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
            ),
          ),
        walletIds.length > 0
          ? db
              .select({
                lastAt:
                  sql<Date | null>`max(${creditTransactions.createdAt})`.mapWith(
                    creditTransactions.createdAt,
                  ),
              })
              .from(creditTransactions)
              .where(
                and(
                  inArray(creditTransactions.walletId, walletIds),
                  eq(creditTransactions.type, CreditTransactionType.USAGE),
                ),
              )
          : Promise.resolve([{ lastAt: null }]),
      ]);

    return {
      lastLogin: sessionRow?.lastAt ?? null,
      lastThreadCreated: threadRow?.lastAt ?? null,
      lastMessageSent: messageRow?.lastAt ?? null,
      lastPayment: paymentRow?.lastAt ?? null,
      lastCreditUsage: usageRows[0]?.lastAt ?? null,
      activeSessions: Number(sessionRow?.active ?? 0),
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
   * Get model usage statistics for user - includes all connected lead wallets
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

    // Find all leads linked to this user
    const linkedLeads = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId));

    const linkedLeadIds = linkedLeads.map((l) => l.leadId);

    // Find all leads connected via lead-lead links (graph traversal)
    const allLeadIds = new Set<string>(linkedLeadIds);
    const queue = [...linkedLeadIds];
    while (queue.length > 0) {
      const currentLeadId = queue.shift()!;
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
        const otherId =
          link.leadId1 === currentLeadId ? link.leadId2 : link.leadId1;
        if (!allLeadIds.has(otherId)) {
          allLeadIds.add(otherId);
          queue.push(otherId);
        }
      }
    }

    // Get all wallets: user wallet + all connected lead wallets
    const leadWallets =
      allLeadIds.size > 0
        ? await db
            .select({ id: creditWallets.id })
            .from(creditWallets)
            .where(inArray(creditWallets.leadId, [...allLeadIds]))
        : [];

    const allWalletIds = [wallet.id, ...leadWallets.map((w) => w.id)];

    const results = await db
      .select({
        modelId: creditTransactions.modelId,
        totalCreditsSpent: sql<number>`ABS(SUM(${creditTransactions.amount}))`,
        messageCount: count(),
      })
      .from(creditTransactions)
      .where(
        and(
          inArray(creditTransactions.walletId, allWalletIds),
          eq(creditTransactions.type, CreditTransactionType.USAGE),
          sql`${creditTransactions.modelId} IS NOT NULL`,
        ),
      )
      .groupBy(creditTransactions.modelId)
      .orderBy(sql`ABS(SUM(${creditTransactions.amount})) DESC`);

    return results.map((r) => ({
      modelId: r.modelId ?? "unknown",
      totalCreditsSpent: Number(r.totalCreditsSpent) || 0,
      messageCount: r.messageCount,
    }));
  }

  private static async getConnections(userId: string): Promise<{
    connectedLeads: Array<{
      id: string;
      email: string | null;
      businessName: string;
      status: string;
      ipAddress: string | null;
      deviceType: string | null;
      browser: string | null;
      os: string | null;
      linkReason: string | null;
      linkedAt: Date;
    }>;
    connectedUsers: Array<{
      id: string;
      email: string;
      publicName: string;
      linkReason: string | null;
      linkedAt: Date;
    }>;
  }> {
    // Get all directly linked leads
    const directLinks = await db
      .select({
        leadId: userLeadLinks.leadId,
        linkReason: userLeadLinks.linkReason,
        linkedAt: userLeadLinks.linkedAt,
      })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId));

    if (directLinks.length === 0) {
      return { connectedLeads: [], connectedUsers: [] };
    }

    const directLeadIds = directLinks.map((l) => l.leadId);
    const linkInfoByLeadId = new Map<
      string,
      { linkReason: string | null; linkedAt: Date }
    >(
      directLinks.map((l) => [
        l.leadId,
        { linkReason: l.linkReason, linkedAt: l.linkedAt },
      ]),
    );

    // Traverse lead-lead links to find all connected leads
    const allLeadIds = new Set<string>(directLeadIds);
    const queue = [...directLeadIds];
    while (queue.length > 0) {
      const currentLeadId = queue.shift()!;
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
        const otherId =
          link.leadId1 === currentLeadId ? link.leadId2 : link.leadId1;
        if (!allLeadIds.has(otherId)) {
          allLeadIds.add(otherId);
          // Use the lead-lead link info for indirect connections
          linkInfoByLeadId.set(otherId, {
            linkReason: link.linkReason,
            linkedAt: link.linkedAt,
          });
          queue.push(otherId);
        }
      }
    }

    // Fetch lead details
    const allLeadIdsArr = [...allLeadIds];
    const leadDetails = await db
      .select({
        id: leads.id,
        email: leads.email,
        businessName: leads.businessName,
        status: leads.status,
        ipAddress: leads.ipAddress,
        deviceType: leads.deviceType,
        browser: leads.browser,
        os: leads.os,
      })
      .from(leads)
      .where(inArray(leads.id, allLeadIdsArr));

    const connectedLeads = leadDetails.map((lead) => {
      const info = linkInfoByLeadId.get(lead.id);
      return {
        id: lead.id,
        email: lead.email,
        businessName: lead.businessName,
        status: lead.status,
        ipAddress: lead.ipAddress,
        deviceType: lead.deviceType,
        browser: lead.browser,
        os: lead.os,
        linkReason: info?.linkReason ?? null,
        linkedAt: info?.linkedAt ?? new Date(),
      };
    });

    // Find all users connected through these leads (excluding the current user)
    const connectedUserLinks = await db
      .select({
        userId: userLeadLinks.userId,
        leadId: userLeadLinks.leadId,
        linkReason: userLeadLinks.linkReason,
        linkedAt: userLeadLinks.linkedAt,
      })
      .from(userLeadLinks)
      .where(
        and(
          inArray(userLeadLinks.leadId, allLeadIdsArr),
          sql`${userLeadLinks.userId} != ${userId}`,
        ),
      );

    if (connectedUserLinks.length === 0) {
      return { connectedLeads, connectedUsers: [] };
    }

    const connectedUserIds = [
      ...new Set(connectedUserLinks.map((l) => l.userId)),
    ];
    const userDetails = await db
      .select({
        id: users.id,
        email: users.email,
        publicName: users.publicName,
      })
      .from(users)
      .where(inArray(users.id, connectedUserIds));

    // Pick earliest link for each user
    const userLinkMap = new Map<
      string,
      { linkReason: string | null; linkedAt: Date }
    >();
    for (const link of connectedUserLinks) {
      const existing = userLinkMap.get(link.userId);
      if (!existing || link.linkedAt < existing.linkedAt) {
        userLinkMap.set(link.userId, {
          linkReason: link.linkReason,
          linkedAt: link.linkedAt,
        });
      }
    }

    const connectedUsers = userDetails.map((u) => {
      const info = userLinkMap.get(u.id);
      return {
        id: u.id,
        email: u.email,
        publicName: u.publicName,
        linkReason: info?.linkReason ?? null,
        linkedAt: info?.linkedAt ?? new Date(),
      };
    });

    return { connectedLeads, connectedUsers };
  }
}
