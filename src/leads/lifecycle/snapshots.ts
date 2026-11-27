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
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
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
import { PaymentSegment, paymentSegment } from "./eligibility";
import { LifecycleSendStatus } from "./enum";
import { OUT_OF_CREDITS_THRESHOLD } from "./journeys";

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

/** A subscription in these states is a live, paying customer. */
const ACTIVE_SUBSCRIPTION_STATUSES: readonly string[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.PAST_DUE,
];

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
      .select({
        id: users.id,
        email: users.email,
        privateName: users.privateName,
        locale: users.locale,
        emailVerified: users.emailVerified,
        isActive: users.isActive,
        isBanned: users.isBanned,
        marketingConsent: users.marketingConsent,
        createdAt: users.createdAt,
      })
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

    // paidIds = real money ever (payment, subscription row, growth first paid).
    // grantIds = purchase/subscription credit rows without real money: admin
    // grants (testers, creators). activeSince = live subscription start.
    const paidIds = new Set<string>();
    const grantIds = new Set<string>();
    const activeSince = new Map<string, Date>();
    if (userIds.length > 0) {
      const subRows = await db
        .select({
          userId: subscriptions.userId,
          status: subscriptions.status,
          createdAt: subscriptions.createdAt,
        })
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
        if (ACTIVE_SUBSCRIPTION_STATUSES.includes(r.status)) {
          const prev = activeSince.get(r.userId);
          if (!prev || r.createdAt < prev) {
            activeSince.set(r.userId, r.createdAt);
          }
        }
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
          grantIds.add(r.userId);
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

    const pool = await loadPoolCredits(
      userIds,
      leadRows.map((l) => ({ id: l.id, convertedUserId: l.convertedUserId })),
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
      const poolInfo = user ? pool.get(user.id) : undefined;
      const lastUsageAt = poolInfo?.lastUsageAt ?? null;
      const lastActivityAt =
        lastChatAt && lastUsageAt
          ? lastChatAt > lastUsageAt
            ? lastChatAt
            : lastUsageAt
          : (lastChatAt ?? lastUsageAt);
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
        name: user ? greetingName(user.privateName) : null,
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
        lastActivityAt,
        outOfCreditsAt: poolInfo?.outOfCreditsAt ?? null,
        isPaid: user ? paidIds.has(user.id) : false,
        segment: user
          ? paymentSegment({
              paid: paidIds.has(user.id),
              activeSub: activeSince.has(user.id),
              granted: grantIds.has(user.id),
            })
          : PaymentSegment.NEVER_PAID,
        activeSubSince: user ? (activeSince.get(user.id) ?? null) : null,
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

interface PoolCredits {
  lastUsageAt: Date | null;
  outOfCreditsAt: Date | null;
}

/** "YYYY-MM" of a date in UTC - the free-credit period id format. */
function periodId(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Per user: newest credit usage across the account pool (user wallet + linked
 * lead wallets) and whether the pool is drained this month. Read-only: never
 * calls the credit repository, which mints monthly grants as a side effect.
 *
 * Drained = the newest usage happened this month AND paid balance + free credits
 * left in wallets already on this month's period < OUT_OF_CREDITS_THRESHOLD.
 */
async function loadPoolCredits(
  userIds: readonly string[],
  knownLeads: ReadonlyArray<{ id: string; convertedUserId: string | null }>,
): Promise<Map<string, PoolCredits>> {
  const out = new Map<string, PoolCredits>();
  if (userIds.length === 0) {
    return out;
  }
  const leadsByUser = new Map<string, Set<string>>();
  const addLead = (userId: string, leadId: string): void => {
    const set = leadsByUser.get(userId) ?? new Set<string>();
    set.add(leadId);
    leadsByUser.set(userId, set);
  };
  for (const l of knownLeads) {
    if (l.convertedUserId) {
      addLead(l.convertedUserId, l.id);
    }
  }
  const linkRows = await db
    .select({ userId: userLeadLinks.userId, leadId: userLeadLinks.leadId })
    .from(userLeadLinks)
    .where(inArray(userLeadLinks.userId, [...userIds]));
  for (const r of linkRows) {
    addLead(r.userId, r.leadId);
  }

  const ownerByLead = new Map<string, string>();
  for (const [userId, leadIds] of leadsByUser) {
    for (const leadId of leadIds) {
      ownerByLead.set(leadId, userId);
    }
  }
  const allLeadIds = [...ownerByLead.keys()];
  const walletRows: Array<{
    id: string;
    userId: string | null;
    leadId: string | null;
    balance: number;
    freeCreditsRemaining: number;
    freePeriodId: string;
  }> = [];
  for (const ids of chunk([...userIds])) {
    walletRows.push(
      ...(await db
        .select({
          id: creditWallets.id,
          userId: creditWallets.userId,
          leadId: creditWallets.leadId,
          balance: creditWallets.balance,
          freeCreditsRemaining: creditWallets.freeCreditsRemaining,
          freePeriodId: creditWallets.freePeriodId,
        })
        .from(creditWallets)
        .where(inArray(creditWallets.userId, ids))),
    );
  }
  for (const ids of chunk(allLeadIds)) {
    walletRows.push(
      ...(await db
        .select({
          id: creditWallets.id,
          userId: creditWallets.userId,
          leadId: creditWallets.leadId,
          balance: creditWallets.balance,
          freeCreditsRemaining: creditWallets.freeCreditsRemaining,
          freePeriodId: creditWallets.freePeriodId,
        })
        .from(creditWallets)
        .where(inArray(creditWallets.leadId, ids))),
    );
  }

  const ownerByWallet = new Map<string, string>();
  for (const w of walletRows) {
    const owner = w.userId ?? (w.leadId ? ownerByLead.get(w.leadId) : null);
    if (owner) {
      ownerByWallet.set(w.id, owner);
    }
  }

  const lastUsageByUser = new Map<string, Date>();
  for (const ids of chunk([...ownerByWallet.keys()])) {
    const usageRows = await db
      .select({
        walletId: creditTransactions.walletId,
        last: max(creditTransactions.createdAt),
      })
      .from(creditTransactions)
      .where(
        and(
          inArray(creditTransactions.walletId, ids),
          eq(creditTransactions.type, CreditTransactionType.USAGE),
        ),
      )
      .groupBy(creditTransactions.walletId);
    for (const r of usageRows) {
      const owner = ownerByWallet.get(r.walletId);
      if (!owner || !r.last) {
        continue;
      }
      const prev = lastUsageByUser.get(owner);
      if (!prev || r.last > prev) {
        lastUsageByUser.set(owner, r.last);
      }
    }
  }

  const currentPeriod = periodId(new Date());
  const availableByUser = new Map<string, number>();
  for (const w of walletRows) {
    const owner = ownerByWallet.get(w.id);
    if (!owner) {
      continue;
    }
    const free = w.freePeriodId === currentPeriod ? w.freeCreditsRemaining : 0;
    availableByUser.set(
      owner,
      (availableByUser.get(owner) ?? 0) + w.balance + free,
    );
  }

  for (const userId of userIds) {
    const lastUsageAt = lastUsageByUser.get(userId) ?? null;
    const drained =
      lastUsageAt !== null &&
      periodId(lastUsageAt) === currentPeriod &&
      (availableByUser.get(userId) ?? 0) < OUT_OF_CREDITS_THRESHOLD;
    out.set(userId, {
      lastUsageAt,
      outOfCreditsAt: drained ? lastUsageAt : null,
    });
  }
  return out;
}

/** First word of the private name, if it looks like a name (not an email/handle). */
function greetingName(privateName: string): string | null {
  const first = privateName.trim().split(/\s+/)[0] ?? "";
  if (first.length < 2 || first.length > 30 || /[@\d_]/.test(first)) {
    return null;
  }
  return first;
}
