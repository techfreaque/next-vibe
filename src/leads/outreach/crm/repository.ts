/**
 * Outreach CRM - Repository
 * Server-only.
 *
 * Deal attribution mirrors the MoeMoe measurement recipe: a deal's cohort is
 * every growth journey whose first OR last touch carries the deal's campaign
 * link, utm_campaign or ref code, plus every user who signed up with the ref
 * code. Revenue = succeeded payments of those users from the deal's go-live
 * date (else commit date, else creation). A deal with none of those keys falls
 * back to first-touch journeys on its channel since go-live, flagged as
 * channel-wide.
 */

import "server-only";

import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { referralCodes, userReferrals } from "@/referral/db";

import { growthCampaignLinks, growthJourneys } from "../../growth/db";
import { costPer } from "../../growth/funnel";
import { outreachContacts, outreachDeals } from "../db";
import type {
  OutreachAngleGroupValue,
  OutreachAttributionBasisValue,
} from "../enum";
import {
  OutreachAngleGroupDB,
  OutreachAttributionBasis,
  OutreachContactStatusDB,
  OutreachDealStatus,
} from "../enum";
import type { OutreachT } from "../i18n";
import { angleGroup, ANSWERED_STATUSES } from "../pipeline";
import type {
  OutreachCrmRequestOutput,
  OutreachCrmResponseOutput,
  OutreachDealRow,
} from "./definition";

type DealRecord = typeof outreachDeals.$inferSelect & {
  contactName: string;
  contactEmail: string;
};

interface DealResults {
  basis: typeof OutreachAttributionBasisValue;
  linkVisits: number | null;
  visitors: number;
  signups: number;
  paying: number;
  revenue: OutreachDealRow["revenue"];
}

export class OutreachCrmRepository {
  static async dashboard(
    data: OutreachCrmRequestOutput,
    logger: EndpointLogger,
    t: OutreachT,
  ): Promise<ResponseType<OutreachCrmResponseOutput>> {
    try {
      const where = OutreachCrmRepository.contactFilter(data);
      const offset = (data.page - 1) * data.limit;
      const lastActivity = sql`greatest(${outreachContacts.lastContactAt}, ${outreachContacts.lastReplyAt})`;

      const [contacts, [matching], statusRows, angleRows, dealRecords] =
        await Promise.all([
          db
            .select({
              id: outreachContacts.id,
              name: outreachContacts.name,
              email: outreachContacts.email,
              kind: outreachContacts.kind,
              url: outreachContacts.url,
              angle: outreachContacts.angle,
              status: outreachContacts.status,
              firstContactAt: outreachContacts.firstContactAt,
              lastContactAt: outreachContacts.lastContactAt,
              lastReplyAt: outreachContacts.lastReplyAt,
              lastSubject: outreachContacts.lastSubject,
              contactCount: outreachContacts.contactCount,
              notes: outreachContacts.notes,
              refCode: outreachContacts.refCode,
              channel: outreachContacts.channel,
            })
            .from(outreachContacts)
            .where(where)
            .orderBy(
              sql`${lastActivity} desc nulls last`,
              outreachContacts.name,
            )
            .limit(data.limit)
            .offset(offset),
          db.select({ n: count() }).from(outreachContacts).where(where),
          db
            .select({ status: outreachContacts.status, n: count() })
            .from(outreachContacts)
            .groupBy(outreachContacts.status),
          db
            .select({
              angle: outreachContacts.angle,
              status: outreachContacts.status,
              n: count(),
            })
            .from(outreachContacts)
            .groupBy(outreachContacts.angle, outreachContacts.status),
          db
            .select({
              deal: outreachDeals,
              contactName: outreachContacts.name,
              contactEmail: outreachContacts.email,
            })
            .from(outreachDeals)
            .innerJoin(
              outreachContacts,
              eq(outreachContacts.id, outreachDeals.contactId),
            )
            .orderBy(desc(outreachDeals.createdAt)),
        ]);

      const statusCounts = new Map(
        statusRows.map((row) => [row.status, row.n]),
      );
      const total = statusRows.reduce((sum, row) => sum + row.n, 0);
      const answered = statusRows
        .filter((row) => ANSWERED_STATUSES.includes(row.status))
        .reduce((sum, row) => sum + row.n, 0);

      const angleTotals = new Map<
        typeof OutreachAngleGroupValue,
        { contacts: number; answered: number }
      >();
      for (const row of angleRows) {
        const group = angleGroup(row.angle);
        const entry = angleTotals.get(group) ?? { contacts: 0, answered: 0 };
        entry.contacts += row.n;
        if (ANSWERED_STATUSES.includes(row.status)) {
          entry.answered += row.n;
        }
        angleTotals.set(group, entry);
      }

      const deals = await Promise.all(
        dealRecords.map(async (record) => {
          const deal: DealRecord = {
            ...record.deal,
            contactName: record.contactName,
            contactEmail: record.contactEmail,
          };
          const results = await OutreachCrmRepository.dealResults(deal);
          return OutreachCrmRepository.toDealRow(deal, results);
        }),
      );

      const totals = new Map<
        OutreachDealRow["currency"],
        { paidCents: number; committedCents: number }
      >();
      for (const deal of deals) {
        const entry = totals.get(deal.currency) ?? {
          paidCents: 0,
          committedCents: 0,
        };
        if (deal.status === OutreachDealStatus.PAID) {
          entry.paidCents += deal.amountCents;
        } else if (deal.status === OutreachDealStatus.COMMITTED) {
          entry.committedCents += deal.amountCents;
        }
        totals.set(deal.currency, entry);
      }

      const matchingCount = matching?.n ?? 0;
      return success({
        summary: {
          total,
          answered,
          matching: matchingCount,
          page: data.page,
          pageCount: Math.max(1, Math.ceil(matchingCount / data.limit)),
          limit: data.limit,
          byStatus: OutreachContactStatusDB.map((status) => ({
            status,
            count: statusCounts.get(status) ?? 0,
          })),
        },
        angles: OutreachAngleGroupDB.flatMap((group) => {
          const entry = angleTotals.get(group);
          return entry ? [{ group, ...entry }] : [];
        }),
        contacts,
        deals,
        dealTotals: [...totals.entries()].map(([currency, entry]) => ({
          currency,
          ...entry,
        })),
      });
    } catch (error) {
      logger.error("Failed to load outreach CRM", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static contactFilter(
    data: OutreachCrmRequestOutput,
  ): SQL | undefined {
    const conditions: SQL[] = [];
    if (data.status) {
      conditions.push(eq(outreachContacts.status, data.status));
    }
    if (data.kind) {
      conditions.push(eq(outreachContacts.kind, data.kind));
    }
    const angle = data.angle?.trim();
    if (angle) {
      conditions.push(
        ilike(
          outreachContacts.angle,
          `${OutreachCrmRepository.escapeLike(angle)}%`,
        ),
      );
    }
    const search = data.search?.trim();
    if (search) {
      const pattern = `%${OutreachCrmRepository.escapeLike(search)}%`;
      const searchCondition = or(
        ilike(outreachContacts.name, pattern),
        ilike(outreachContacts.email, pattern),
        ilike(outreachContacts.lastSubject, pattern),
        ilike(outreachContacts.notes, pattern),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private static escapeLike(value: string): string {
    return value.replaceAll(/[\\%_]/g, (char) => `\\${char}`);
  }

  private static windowStart(deal: DealRecord): Date {
    return deal.liveAt ?? deal.committedAt ?? deal.createdAt;
  }

  /** Visitors, signups, paying users and revenue matched to one deal. */
  private static async dealResults(deal: DealRecord): Promise<DealResults> {
    const gj = growthJourneys;
    const tracked: SQL[] = [];
    if (deal.campaignLinkId) {
      const linkMatch = or(
        eq(gj.firstLinkId, deal.campaignLinkId),
        eq(gj.lastLinkId, deal.campaignLinkId),
      );
      if (linkMatch) {
        tracked.push(linkMatch);
      }
    }
    if (deal.utmCampaign) {
      const campaignMatch = or(
        eq(gj.firstCampaign, deal.utmCampaign),
        eq(gj.lastCampaign, deal.utmCampaign),
      );
      if (campaignMatch) {
        tracked.push(campaignMatch);
      }
    }
    if (deal.refCode) {
      const refMatch = or(
        eq(gj.firstRefCode, deal.refCode),
        eq(gj.lastRefCode, deal.refCode),
      );
      if (refMatch) {
        tracked.push(refMatch);
      }
    }

    const start = OutreachCrmRepository.windowStart(deal);
    let basis: typeof OutreachAttributionBasisValue;
    let cohort: SQL | undefined;
    if (tracked.length > 0) {
      basis = OutreachAttributionBasis.TRACKED;
      cohort = or(...tracked);
    } else if (deal.channel) {
      basis = OutreachAttributionBasis.CHANNEL;
      cohort = and(
        eq(gj.firstChannel, deal.channel),
        gte(gj.firstTouchAt, start),
      );
    } else {
      return {
        basis: OutreachAttributionBasis.NONE,
        linkVisits: null,
        visitors: 0,
        signups: 0,
        paying: 0,
        revenue: [],
      };
    }
    if (!cohort) {
      cohort = sql`false`;
    }

    // Signed-up users of the cohort, plus users who signed up with the code
    const cohortUsers = db
      .select({ userId: sql<string>`${gj.userId}`.as("user_id") })
      .from(gj)
      .where(
        and(
          cohort,
          sql`${gj.userId} is not null`,
          sql`${gj.signedUpAt} is not null`,
        ),
      );
    const userIds = deal.refCode
      ? cohortUsers.union(
          db
            .select({
              userId: sql<string>`${userReferrals.referredUserId}`.as(
                "user_id",
              ),
            })
            .from(userReferrals)
            .innerJoin(
              referralCodes,
              eq(referralCodes.id, userReferrals.referralCodeId),
            )
            .where(eq(referralCodes.code, deal.refCode)),
        )
      : cohortUsers;
    const userIdList = (await userIds).map((row) => row.userId);

    const paidWhere =
      userIdList.length > 0
        ? and(
            inArray(paymentTransactions.userId, userIdList),
            eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
            gte(paymentTransactions.createdAt, start),
          )
        : sql`false`;

    const [[visitors], [paying], revenueRows, linkRows] = await Promise.all([
      db.select({ n: count() }).from(gj).where(cohort),
      db
        .select({ n: countDistinct(paymentTransactions.userId) })
        .from(paymentTransactions)
        .where(paidWhere),
      db
        .select({
          currency: paymentTransactions.currency,
          total: sql<string>`coalesce(sum(${paymentTransactions.amount}), 0)`,
        })
        .from(paymentTransactions)
        .where(paidWhere)
        .groupBy(paymentTransactions.currency),
      deal.campaignLinkId
        ? db
            .select({ visits: growthCampaignLinks.visits })
            .from(growthCampaignLinks)
            .where(eq(growthCampaignLinks.id, deal.campaignLinkId))
            .limit(1)
        : Promise.resolve([]),
    ]);

    return {
      basis,
      linkVisits: linkRows[0]?.visits ?? null,
      visitors: visitors?.n ?? 0,
      signups: new Set(userIdList).size,
      paying: paying?.n ?? 0,
      revenue: revenueRows.map((row) => ({
        currency: row.currency,
        amountCents: Math.round(Number(row.total) * 100),
      })),
    };
  }

  private static toDealRow(
    deal: DealRecord,
    results: DealResults,
  ): OutreachDealRow {
    return {
      id: deal.id,
      contactId: deal.contactId,
      contactName: deal.contactName,
      contactEmail: deal.contactEmail,
      deliverable: deal.deliverable,
      amountCents: deal.amountCents,
      currency: deal.currency,
      status: deal.status,
      channel: deal.channel,
      campaignLinkId: deal.campaignLinkId,
      utmCampaign: deal.utmCampaign,
      refCode: deal.refCode,
      notes: deal.notes,
      liveAt: deal.liveAt,
      paidAt: deal.paidAt,
      ...results,
      costPerSignupCents: costPer(deal.amountCents, results.signups),
      costPerPayingCents: costPer(deal.amountCents, results.paying),
    };
  }
}
