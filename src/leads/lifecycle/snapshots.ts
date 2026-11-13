/**
 * Lifecycle contact snapshots - loads everything the pure eligibility rules need
 * for a set of emails, in a handful of batched queries.
 */

import "server-only";

import { and, eq, inArray, isNotNull, max, or, sql } from "drizzle-orm";
import { chatThreads } from "next-vibe/agent/chat/db";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import { users } from "next-vibe/identity/user/db";

import { creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { growthJourneys } from "@/leads/growth/db";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import { lifecycleSends } from "./db";
import type { ContactSnapshot } from "./eligibility";
import { LifecycleSendStatus } from "./enum";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const CHUNK = 400;

function chunk<T>(items: readonly T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += CHUNK) {
    out.push(items.slice(i, i + CHUNK));
  }
  return out;
}

const BLOCKED_LEAD_STATUSES: readonly string[] = [
  LeadStatus.UNSUBSCRIBED,
  LeadStatus.BOUNCED,
  LeadStatus.INVALID,
];

/** Distinct lower-cased emails of everyone who could possibly be in a journey. */
export async function listCandidateEmails(): Promise<string[]> {
  const userRows = await db
    .select({ email: sql<string>`lower(${users.email})` })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.isBanned, false)));
  const newsletterRows = await db
    .select({ email: sql<string>`lower(${newsletterSubscriptions.email})` })
    .from(newsletterSubscriptions)
    .where(
      and(
        eq(
          newsletterSubscriptions.status,
          NewsletterSubscriptionStatus.SUBSCRIBED,
        ),
        isNotNull(newsletterSubscriptions.confirmedAt),
      ),
    );
  const all = new Set<string>();
  for (const row of userRows) {
    all.add(row.email);
  }
  for (const row of newsletterRows) {
    all.add(row.email);
  }
  return [...all];
}

export async function loadSnapshots(
  emailsIn: readonly string[],
): Promise<Map<string, ContactSnapshot>> {
  const result = new Map<string, ContactSnapshot>();
  const emails = [...new Set(emailsIn.map(normalizeEmail))];
  for (const batch of chunk(emails)) {
    const userRows = await db
      .select()
      .from(users)
      .where(inArray(sql`lower(${users.email})`, batch));
    const userIds = userRows.map((u) => u.id);

    const chatRows =
      userIds.length === 0
        ? []
        : await db
            .select({
              userId: chatThreads.userId,
              last: max(chatThreads.createdAt),
            })
            .from(chatThreads)
            .where(inArray(chatThreads.userId, userIds))
            .groupBy(chatThreads.userId);

    const paidIds = new Set<string>();
    if (userIds.length > 0) {
      const subRows = await db
        .select({ userId: subscriptions.userId })
        .from(subscriptions)
        .where(
          and(
            inArray(subscriptions.userId, userIds),
            inArray(subscriptions.status, [
              SubscriptionStatus.ACTIVE,
              SubscriptionStatus.TRIALING,
              SubscriptionStatus.PAST_DUE,
              SubscriptionStatus.CANCELED,
              SubscriptionStatus.PAUSED,
            ]),
          ),
        );
      for (const r of subRows) {
        paidIds.add(r.userId);
      }
      const txRows = await db
        .selectDistinct({ userId: creditWallets.userId })
        .from(creditTransactions)
        .innerJoin(
          creditWallets,
          eq(creditTransactions.walletId, creditWallets.id),
        )
        .where(
          and(
            inArray(creditWallets.userId, userIds),
            inArray(creditTransactions.type, [
              CreditTransactionType.PURCHASE,
              CreditTransactionType.SUBSCRIPTION,
            ]),
          ),
        );
      for (const r of txRows) {
        if (r.userId) {
          paidIds.add(r.userId);
        }
      }
      const payRows = await db
        .selectDistinct({ userId: paymentTransactions.userId })
        .from(paymentTransactions)
        .where(
          and(
            inArray(paymentTransactions.userId, userIds),
            eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
          ),
        );
      for (const r of payRows) {
        paidIds.add(r.userId);
      }
      const growthRows = await db
        .select({ userId: growthJourneys.userId })
        .from(growthJourneys)
        .where(
          and(
            inArray(growthJourneys.userId, userIds),
            isNotNull(growthJourneys.firstPaidAt),
          ),
        );
      for (const r of growthRows) {
        if (r.userId) {
          paidIds.add(r.userId);
        }
      }
    }

    const newsletterRows = await db
      .select()
      .from(newsletterSubscriptions)
      .where(inArray(sql`lower(${newsletterSubscriptions.email})`, batch));

    const leadRows = await db
      .select()
      .from(leads)
      .where(
        userIds.length > 0
          ? or(
              inArray(sql`lower(${leads.email})`, batch),
              inArray(leads.convertedUserId, userIds),
            )
          : inArray(sql`lower(${leads.email})`, batch),
      );

    const sendRows = await db
      .select({ email: lifecycleSends.email, last: max(lifecycleSends.sentAt) })
      .from(lifecycleSends)
      .where(
        and(
          inArray(lifecycleSends.email, batch),
          eq(lifecycleSends.status, LifecycleSendStatus.SENT),
        ),
      )
      .groupBy(lifecycleSends.email);

    const userByEmail = new Map(
      userRows.map((u) => [normalizeEmail(u.email), u]),
    );
    const chatByUser = new Map<string, Date | null>();
    for (const r of chatRows) {
      if (r.userId) {
        chatByUser.set(r.userId, r.last);
      }
    }
    const newsletterByEmail = new Map(
      newsletterRows.map((n) => [normalizeEmail(n.email), n]),
    );
    const sendByEmail = new Map(sendRows.map((s) => [s.email, s.last]));

    for (const email of batch) {
      const user = userByEmail.get(email) ?? null;
      const newsletter = newsletterByEmail.get(email) ?? null;
      const relatedLeads = leadRows.filter(
        (l) =>
          (l.email !== null && normalizeEmail(l.email) === email) ||
          (user !== null && l.convertedUserId === user.id),
      );
      const blockedLead = relatedLeads.find((l) =>
        BLOCKED_LEAD_STATUSES.includes(l.status),
      );
      const primaryLead = blockedLead ?? relatedLeads[0] ?? null;

      let lastEmailAt: Date | null = sendByEmail.get(email) ?? null;
      for (const l of relatedLeads) {
        if (
          l.lastEmailSentAt &&
          (lastEmailAt === null || l.lastEmailSentAt > lastEmailAt)
        ) {
          lastEmailAt = l.lastEmailSentAt;
        }
      }

      const lastChatAt = user ? (chatByUser.get(user.id) ?? null) : null;
      const locale = user
        ? user.locale
        : primaryLead
          ? getLocaleFromLanguageAndCountry(
              primaryLead.language,
              primaryLead.country,
            )
          : defaultLocale;

      result.set(email, {
        email,
        userId: user?.id ?? null,
        leadId: primaryLead?.id ?? newsletter?.leadId ?? null,
        locale,
        user: user
          ? {
              emailVerified: user.emailVerified,
              isActive: user.isActive,
              isBanned: user.isBanned,
              marketingConsent: user.marketingConsent,
              createdAt: user.createdAt,
            }
          : null,
        hasChatted: user ? chatByUser.has(user.id) : false,
        lastChatAt,
        isPaid: user ? paidIds.has(user.id) : false,
        newsletter: newsletter
          ? {
              status: newsletter.status,
              confirmedAt: newsletter.confirmedAt,
              marketingConsent: newsletter.marketingConsent,
            }
          : null,
        leadStatus: primaryLead?.status ?? null,
        lastEmailAt,
      });
    }
  }
  return result;
}
