/**
 * Campaign Stats Repository
 * Queries email campaign performance metrics from the DB.
 */

import "server-only";

import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { EmailStatus } from "@/app/api/[locale]/emails/messages/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { emailCampaigns, leads } from "../../db";
import type { EmailJourneyVariantValues } from "../../enum";
import { LeadStatus } from "../../enum";
import { EmailJourneyVariantFilter } from "../../enum";
import type {
  CampaignStatsGetRequestOutput,
  CampaignStatsGetResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class CampaignStatsRepository {
  static async getStats(
    data: CampaignStatsGetRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<CampaignStatsGetResponseOutput>> {
    try {
      const variantValue =
        data.journeyVariant &&
        data.journeyVariant !== EmailJourneyVariantFilter.ALL
          ? (data.journeyVariant as typeof EmailJourneyVariantValues)
          : null;
      const variantFilter = variantValue
        ? eq(emailCampaigns.journeyVariant, variantValue)
        : undefined;

      // ── Aggregate overall counts in one query ───────────────────────────
      const [overall] = await db
        .select({
          total: count(),
          pending: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.PENDING} then 1 end)`,
          sent: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.SENT} then 1 end)`,
          delivered: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.DELIVERED} then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.OPENED} then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.FAILED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter);

      const totals = overall ?? {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
      };

      // Sent includes delivered+opened+clicked for rate calculation denominator
      const sentBase =
        totals.sent + totals.delivered + totals.opened + totals.clicked;
      const openRate =
        sentBase > 0 ? (totals.opened + totals.clicked) / sentBase : 0;
      const clickRate = sentBase > 0 ? totals.clicked / sentBase : 0;
      const deliveryRate =
        sentBase > 0
          ? (totals.delivered + totals.opened + totals.clicked) / sentBase
          : 0;
      const failureRate = totals.total > 0 ? totals.failed / totals.total : 0;

      // ── Per-stage breakdown ─────────────────────────────────────────────
      const stageRows = await db
        .select({
          stage: emailCampaigns.stage,
          total: count(),
          sent: sql<number>`count(case when ${emailCampaigns.status} in (${EmailStatus.SENT}, ${EmailStatus.DELIVERED}, ${EmailStatus.OPENED}, ${EmailStatus.CLICKED}) then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} in (${EmailStatus.OPENED}, ${EmailStatus.CLICKED}) then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.FAILED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter)
        .groupBy(emailCampaigns.stage);

      const byStage = stageRows.map((r) => ({
        stage: r.stage,
        total: r.total,
        sent: r.sent,
        opened: r.opened,
        clicked: r.clicked,
        failed: r.failed,
      }));

      // ── Per-variant breakdown ───────────────────────────────────────────
      const variantRows = await db
        .select({
          variant: emailCampaigns.journeyVariant,
          total: count(),
          sent: sql<number>`count(case when ${emailCampaigns.status} in (${EmailStatus.SENT}, ${EmailStatus.DELIVERED}, ${EmailStatus.OPENED}, ${EmailStatus.CLICKED}) then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} in (${EmailStatus.OPENED}, ${EmailStatus.CLICKED}) then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${EmailStatus.CLICKED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter)
        .groupBy(emailCampaigns.journeyVariant);

      const byJourneyVariant = variantRows.map((r) => {
        const vSentBase = r.sent;
        return {
          variant: r.variant,
          total: r.total,
          sent: r.sent,
          openRate: vSentBase > 0 ? r.opened / vSentBase : 0,
          clickRate: vSentBase > 0 ? r.clicked / vSentBase : 0,
        };
      });

      // ── Queue health ─────────────────────────────────────────────────────
      const [pendingLeadsRow] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.status, LeadStatus.CAMPAIGN_RUNNING));

      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      const [scheduledTodayRow] = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          and(
            gte(emailCampaigns.scheduledAt, todayStart),
            lt(emailCampaigns.scheduledAt, tomorrowStart),
          ),
        );

      const pendingLeadsCount = pendingLeadsRow?.count ?? 0;
      const emailsScheduledToday = scheduledTodayRow?.count ?? 0;

      logger.info("campaign.stats.retrieved", {
        total: totals.total,
        openRate,
        clickRate,
        pendingLeadsCount,
        emailsScheduledToday,
      });

      return success({
        total: totals.total,
        pending: totals.pending,
        sent: totals.sent,
        delivered: totals.delivered,
        opened: totals.opened,
        clicked: totals.clicked,
        failed: totals.failed,
        openRate,
        clickRate,
        deliveryRate,
        failureRate,
        pendingLeadsCount,
        emailsScheduledToday,
        byStage,
        byJourneyVariant,
      });
    } catch (error) {
      logger.error("campaign.stats.error", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
