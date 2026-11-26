import "server-only";

import { sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { loadFleetHealth } from "next-vibe/remote-connection/health-summary";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";

import { companies } from "@/companies/db";
import { creditPacks, creditTransactions } from "@/credits/db";
import { CreditPackType, CreditTransactionType } from "@/credits/enum";
import { notSignupCarryover } from "@/credits/usage-filter";
import { MessageChannel } from "@/messenger/accounts/enum";
import { emails } from "@/messenger/messages/db";
import { MessageStatus } from "@/messenger/messages/enum";
import { utcTs } from "@/payment/analytics/money-sql";
import { payoutRequests } from "@/referral/db";
import { PayoutStatus } from "@/referral/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import type { PlatformSummaryInput, PlatformSummaryOutput } from "./definition";

type Summary = PlatformSummaryOutput["summary"];
type WorkspaceSection = Extract<
  PlatformSummaryInput["section"],
  | "credits"
  | "subscriptions"
  | "referral"
  | "messenger"
  | "instances"
  | "companies"
>;

export function isWorkspaceSection(
  section: NonNullable<PlatformSummaryInput["section"]>,
): section is WorkspaceSection {
  return (
    section === "credits" ||
    section === "subscriptions" ||
    section === "referral" ||
    section === "messenger" ||
    section === "instances" ||
    section === "companies"
  );
}

function metric(
  label: Summary["kpis"][number]["label"],
  value: number | undefined,
  alias: string,
): Summary["kpis"][number] {
  return { label, value: value ?? 0, format: "number", drill: { alias } };
}

export async function getWorkspaceMetrics(
  section: WorkspaceSection,
  win: AnalyticsWindow,
): Promise<Pick<Summary, "kpis" | "attention" | "attentionAvailable">> {
  const from = utcTs(win.from);
  const to = utcTs(win.to);
  const base = { attention: [], attentionAvailable: false };
  switch (section) {
    case "credits": {
      const [[activity], [wallets]] = await Promise.all([
        db
          .select({
            purchased: sql<number>`coalesce(sum(${creditTransactions.amount}) filter (where ${creditTransactions.type} = ${CreditTransactionType.PURCHASE}), 0)::float8`,
            used: sql<number>`coalesce(sum(-${creditTransactions.amount}) filter (where ${creditTransactions.type} = ${CreditTransactionType.USAGE} AND ${notSignupCarryover}), 0)::float8`,
          })
          .from(creditTransactions)
          .where(
            sql`${creditTransactions.createdAt} >= ${from} AND ${creditTransactions.createdAt} < ${to}`,
          ),
        db
          .select({
            unused: sql<number>`coalesce(sum(${creditPacks.remaining}), 0)::float8`,
          })
          .from(creditPacks)
          .where(sql`${creditPacks.type} IN (${CreditPackType.PERMANENT}, ${CreditPackType.SUBSCRIPTION})
            AND ${creditPacks.remaining} > 0 AND (${creditPacks.expiresAt} IS NULL OR ${creditPacks.expiresAt} > now())`),
      ]);
      return {
        ...base,
        kpis: [
          metric(
            "platformSummary.creditsPurchased",
            activity?.purchased,
            "subscription-admin-purchases",
          ),
          metric(
            "platformSummary.creditsUsed",
            activity?.used,
            "credit-usage-report",
          ),
          metric(
            "platformSummary.creditsUnused",
            wallets?.unused,
            "finance-credit-liabilities",
          ),
        ],
      };
    }
    case "subscriptions": {
      const [row] = await db
        .select({
          active: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.ACTIVE})::int`,
          renewals: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.ACTIVE}
            AND NOT ${subscriptions.cancelAtPeriodEnd} AND ${subscriptions.cancelAt} IS NULL
            AND ${subscriptions.currentPeriodEnd} >= now()
            AND ${subscriptions.currentPeriodEnd} < now() + interval '7 days')::int`,
          pastDue: sql<number>`count(*) filter (where ${subscriptions.status} = ${SubscriptionStatus.PAST_DUE})::int`,
        })
        .from(subscriptions);
      return {
        ...base,
        kpis: [
          metric(
            "platformSummary.activeSubscriptions",
            row?.active,
            "subscription-admin-list",
          ),
          metric(
            "platformSummary.renewalsSoon",
            row?.renewals,
            "subscription-admin-list",
          ),
          metric(
            "platformSummary.pastDueSubscriptions",
            row?.pastDue,
            "subscription-admin-list",
          ),
        ],
      };
    }
    case "referral": {
      const [row] = await db
        .select({
          pending: sql<number>`count(*)::int`,
          usd: sql<number>`coalesce(sum(${payoutRequests.amountCents}) / 100.0, 0)::float8`,
        })
        .from(payoutRequests)
        .where(sql`${payoutRequests.status} = ${PayoutStatus.PENDING}`);
      const alias = "referral_admin_payouts_GET";
      return {
        kpis: [
          metric("platformSummary.pendingPayouts", row?.pending, alias),
          {
            label: "platformSummary.pendingPayoutValue",
            value: row?.usd ?? 0,
            format: "money",
            currency: "USD",
            drill: { alias },
          },
        ],
        attention: row?.pending
          ? [
              {
                label: "platformSummary.reviewPayouts",
                count: row.pending,
                severity: "info",
                drill: { alias },
              },
            ]
          : [],
        attentionAvailable: true,
      };
    }
    case "messenger": {
      const [row] = await db
        .select({
          sent: sql<number>`count(*) filter (where ${emails.sentAt} IS NOT NULL)::int`,
          bounced: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.BOUNCED})::int`,
          failed: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.FAILED})::int`,
        })
        .from(emails)
        .where(
          sql`${emails.createdAt} >= ${from} AND ${emails.createdAt} < ${to} AND ${emails.channel} = ${MessageChannel.EMAIL}`,
        );
      return {
        ...base,
        kpis: [
          metric("platformSummary.messagesSent", row?.sent, "email-stats"),
          metric(
            "platformSummary.messagesBounced",
            row?.bounced,
            "email-stats",
          ),
          metric("platformSummary.messagesFailed", row?.failed, "email-stats"),
        ],
      };
    }
    case "instances": {
      const { connections } = await loadFleetHealth();
      const count = connections.filter(
        ({ health }) => health.status !== "healthy",
      ).length;
      const alias = "remote-connections";
      return {
        kpis: [
          metric("platformSummary.totalConnections", connections.length, alias),
        ],
        attention: count
          ? [
              {
                label: "get.widget.alerts.connections",
                count,
                severity: "danger",
                drill: { alias },
              },
            ]
          : [],
        attentionAvailable: true,
      };
    }
    case "companies": {
      const [row] = await db
        .select({
          active: sql<number>`count(*) filter (where ${companies.isActive})::int`,
          inactive: sql<number>`count(*) filter (where NOT ${companies.isActive})::int`,
        })
        .from(companies);
      return {
        ...base,
        kpis: [
          metric(
            "platformSummary.activeCompanies",
            row?.active,
            "companies-list",
          ),
          metric(
            "platformSummary.inactiveCompanies",
            row?.inactive,
            "companies-list",
          ),
        ],
      };
    }
  }
}
