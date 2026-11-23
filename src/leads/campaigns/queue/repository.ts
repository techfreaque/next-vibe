/**
 * Campaign Queue Repository
 */

import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  isNotNull,
  isNull,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { emailCampaigns, leads } from "next-vibe/identity/lead/db";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";

import { mapCampaignTypeFilter } from "@/messenger/accounts/enum";
import { MessageStatus } from "@/messenger/messages/enum";

import { journeyVariantFromFilter, stageFromFilter } from "../filter-map";
import type {
  CampaignQueueGetRequestOutput,
  CampaignQueueGetResponseOutput,
} from "./definition";
import { QueueDelivery } from "./enum";
import type { CampaignQueueT } from "./i18n";

function dayStart(value: Date): Date {
  const d = new Date(value);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function dayEnd(value: Date): Date {
  const d = new Date(value);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/** `column` inside the optional [eventFrom, eventTo] day window. */
function inEventWindow(
  column: SQL | typeof emailCampaigns.sentAt,
  data: CampaignQueueGetRequestOutput,
): SQL[] {
  const out: SQL[] = [];
  if (data.eventFrom) {
    out.push(sql`${column} >= ${utcSql(dayStart(data.eventFrom))}`);
  }
  if (data.eventTo) {
    out.push(sql`${column} <= ${utcSql(dayEnd(data.eventTo))}`);
  }
  return out;
}

/** Row-level conditions for the drill filters (delivery, variant, stage, locale). */
function drillConditions(data: CampaignQueueGetRequestOutput): SQL[] {
  const out: SQL[] = [];
  const variant = journeyVariantFromFilter(data.journeyVariant);
  if (variant) {
    out.push(eq(emailCampaigns.journeyVariant, variant));
  }
  const stage = stageFromFilter(data.stage);
  if (stage) {
    out.push(eq(emailCampaigns.stage, stage));
  }
  const locale = data.locale?.trim().toLowerCase();
  if (locale) {
    const loc = sql`lower(coalesce(
      (SELECT s.locale FROM email_send_log s WHERE s.campaign_id = ${emailCampaigns.id} LIMIT 1),
      (SELECT l2.language || '-' || l2.country FROM leads l2 WHERE l2.id = ${emailCampaigns.leadId})
    ))`;
    out.push(sql`(${loc} = ${locale} OR ${loc} LIKE ${`${locale}-%`})`);
  }
  const nowUtc = sql`(now() AT TIME ZONE 'UTC')`;
  const pending = and(
    eq(emailCampaigns.status, MessageStatus.PENDING),
    isNull(emailCampaigns.sentAt),
  );
  const sent = and(
    isNotNull(emailCampaigns.sentAt),
    ne(emailCampaigns.status, MessageStatus.FAILED),
  );
  switch (data.delivery) {
    case QueueDelivery.DUE_NOW:
      out.push(sql`${pending} AND ${emailCampaigns.scheduledAt} <= ${nowUtc}`);
      break;
    case QueueDelivery.OVERDUE:
      out.push(
        sql`${pending} AND ${emailCampaigns.scheduledAt} <= ${nowUtc} - interval '24 hours'`,
      );
      break;
    case QueueDelivery.SCHEDULED:
      out.push(sql`${pending} AND ${emailCampaigns.scheduledAt} > ${nowUtc}`);
      break;
    case QueueDelivery.STUCK:
      out.push(sql`EXISTS (
        SELECT 1 FROM email_send_log s
        WHERE s.campaign_id = ${emailCampaigns.id} AND s.status = ${MessageStatus.PENDING}
          AND s.claimed_at < ${nowUtc} - interval '1 hour'
      )`);
      break;
    case QueueDelivery.FAILED:
      out.push(
        eq(emailCampaigns.status, MessageStatus.FAILED),
        // Dedupe/status skips are not send errors (matches campaign-stats).
        sql`NOT coalesce(${emailCampaigns.error} LIKE 'duplicate:%' OR ${emailCampaigns.error} LIKE 'status_change:%', false)`,
        ...inEventWindow(sql`${emailCampaigns.updatedAt}`, data),
      );
      break;
    case QueueDelivery.SENT:
      out.push(sql`${sent}`, ...inEventWindow(emailCampaigns.sentAt, data));
      break;
    case QueueDelivery.OPENED:
      out.push(
        sql`${sent}`,
        isNotNull(emailCampaigns.openedAt),
        ...inEventWindow(emailCampaigns.sentAt, data),
      );
      break;
    case QueueDelivery.CLICKED:
      out.push(
        sql`${sent}`,
        isNotNull(emailCampaigns.clickedAt),
        ...inEventWindow(emailCampaigns.sentAt, data),
      );
      break;
    case QueueDelivery.UNSUBSCRIBED:
      out.push(
        isNotNull(emailCampaigns.unsubscribedAt),
        ...inEventWindow(sql`${emailCampaigns.unsubscribedAt}`, data),
      );
      break;
    case QueueDelivery.BOUNCED:
      out.push(
        isNotNull(emailCampaigns.bouncedAt),
        ...inEventWindow(sql`${emailCampaigns.bouncedAt}`, data),
      );
      break;
    case undefined:
      out.push(...inEventWindow(emailCampaigns.sentAt, data));
      break;
  }
  return out;
}

function matchedEvent(
  delivery: CampaignQueueGetRequestOutput["delivery"],
): SQL | null {
  switch (delivery) {
    case QueueDelivery.SENT:
      return sql`${emailCampaigns.sentAt}`;
    case QueueDelivery.OPENED:
      return sql`${emailCampaigns.openedAt}`;
    case QueueDelivery.CLICKED:
      return sql`${emailCampaigns.clickedAt}`;
    case QueueDelivery.UNSUBSCRIBED:
      return sql`${emailCampaigns.unsubscribedAt}`;
    case QueueDelivery.BOUNCED:
      return sql`${emailCampaigns.bouncedAt}`;
    case QueueDelivery.FAILED:
      return sql`${emailCampaigns.updatedAt}`;
    case QueueDelivery.STUCK:
      return sql`(SELECT min(s.claimed_at) FROM email_send_log s
        WHERE s.campaign_id = ${emailCampaigns.id} AND s.status = ${MessageStatus.PENDING})`;
    default:
      return null;
  }
}

export class CampaignQueueRepository {
  static async getQueue(
    data: CampaignQueueGetRequestOutput,
    logger: EndpointLogger,
    t: CampaignQueueT,
  ): Promise<ResponseType<CampaignQueueGetResponseOutput>> {
    try {
      const page = data.page ?? 1;
      const pageSize = data.limit ?? 20;
      const campaignType = mapCampaignTypeFilter(data.campaignType);
      const matchesCampaign = and(
        eq(emailCampaigns.leadId, leads.id),
        campaignType
          ? eq(emailCampaigns.campaignType, campaignType)
          : undefined,
      );
      const isPending = and(
        eq(emailCampaigns.status, MessageStatus.PENDING),
        isNull(emailCampaigns.sentAt),
      );
      const matchingDelivery = db
        .select({ id: emailCampaigns.id })
        .from(emailCampaigns)
        .where(matchesCampaign);
      const pendingDelivery = db
        .select({ id: emailCampaigns.id })
        .from(emailCampaigns)
        .where(and(matchesCampaign, isPending));
      const drill = drillConditions(data);
      const event = matchedEvent(data.delivery);
      const filter = and(
        data.leadId ? eq(leads.id, data.leadId) : undefined,
        drill.length > 0
          ? exists(
              db
                .select({ id: emailCampaigns.id })
                .from(emailCampaigns)
                .where(and(matchesCampaign, ...drill)),
            )
          : or(
              exists(pendingDelivery),
              and(
                eq(leads.status, LeadStatus.CAMPAIGN_RUNNING),
                campaignType ? exists(matchingDelivery) : undefined,
              ),
            ),
      );

      // A single matching row per lead keeps paging and counts consistent.
      const nextDelivery = db
        .select({
          campaignType: emailCampaigns.campaignType,
          stage: emailCampaigns.stage,
          journeyVariant: emailCampaigns.journeyVariant,
          matchedAt: sql<Date | null>`${event ?? sql`NULL`}`
            .mapWith(emailCampaigns.sentAt)
            .as("matched_at"),
          matchedSubject: sql<
            string | null
          >`${event ? emailCampaigns.subject : sql`NULL`}`.as(
            "matched_subject",
          ),
          nextScheduledAt:
            sql<Date | null>`case when ${isPending} then ${emailCampaigns.scheduledAt} end`
              .mapWith(emailCampaigns.scheduledAt)
              .as("next_scheduled_at"),
          nextSubject: sql<
            string | null
          >`case when ${isPending} then ${emailCampaigns.subject} end`.as(
            "next_subject",
          ),
        })
        .from(emailCampaigns)
        .where(and(matchesCampaign, ...drill))
        .orderBy(
          event
            ? sql`${event} desc nulls last`
            : sql`case when ${isPending} then ${emailCampaigns.scheduledAt} end asc nulls last`,
          desc(emailCampaigns.createdAt),
          asc(emailCampaigns.id),
        )
        .limit(1)
        .as("next_delivery");

      const [[countRow], rows] = await Promise.all([
        db.select({ total: count() }).from(leads).where(filter),
        db
          .select({
            leadId: leads.id,
            leadEmail: leads.email,
            businessName: leads.businessName,
            currentStage: leads.currentCampaignStage,
            journeyVariant: leads.emailJourneyVariant,
            emailsSent: leads.emailsSent,
            emailsOpened: leads.emailsOpened,
            emailsClicked: leads.emailsClicked,
            startedAt: leads.campaignStartedAt,
            deliveryType: nextDelivery.campaignType,
            deliveryStage: nextDelivery.stage,
            deliveryVariant: nextDelivery.journeyVariant,
            nextScheduledAt: nextDelivery.nextScheduledAt,
            nextSubject: nextDelivery.nextSubject,
            matchedAt: nextDelivery.matchedAt,
            matchedSubject: nextDelivery.matchedSubject,
          })
          .from(leads)
          .leftJoinLateral(nextDelivery, sql`true`)
          .where(filter)
          .orderBy(
            event
              ? sql`${nextDelivery.matchedAt} desc nulls last`
              : sql`${nextDelivery.nextScheduledAt} asc nulls last`,
            asc(leads.campaignStartedAt),
            asc(leads.id),
          )
          .limit(pageSize)
          .offset((page - 1) * pageSize),
      ]);

      const nowMs = Date.now();
      return success({
        totalCount: countRow?.total ?? 0,
        currentPage: page,
        pageSize,
        items: rows.map(
          ({
            deliveryType,
            deliveryStage,
            deliveryVariant,
            nextScheduledAt,
            matchedAt,
            ...lead
          }) => ({
            ...lead,
            campaignType: deliveryType ?? "",
            currentStage: deliveryStage ?? lead.currentStage ?? "",
            journeyVariant: deliveryVariant ?? lead.journeyVariant ?? "",
            nextScheduledAt: nextScheduledAt?.toISOString() ?? null,
            matchedAt: matchedAt?.toISOString() ?? null,
            daysOverdue:
              nextScheduledAt && nextScheduledAt.getTime() < nowMs
                ? Math.floor((nowMs - nextScheduledAt.getTime()) / 86_400_000)
                : null,
          }),
        ),
      });
    } catch (error) {
      logger.error("campaign.queue.error", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
