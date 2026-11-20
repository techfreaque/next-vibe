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
  isNull,
  or,
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

import { mapCampaignTypeFilter } from "@/messenger/accounts/enum";
import { MessageStatus } from "@/messenger/messages/enum";

import type {
  CampaignQueueGetRequestOutput,
  CampaignQueueGetResponseOutput,
} from "./definition";
import type { CampaignQueueT } from "./i18n";

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
      const filter = and(
        data.leadId ? eq(leads.id, data.leadId) : undefined,
        or(
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
        .where(matchesCampaign)
        .orderBy(
          sql`case when ${isPending} then ${emailCampaigns.scheduledAt} end asc nulls last`,
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
          })
          .from(leads)
          .leftJoinLateral(nextDelivery, sql`true`)
          .where(filter)
          .orderBy(
            sql`${nextDelivery.nextScheduledAt} asc nulls last`,
            asc(leads.campaignStartedAt),
            asc(leads.id),
          )
          .limit(pageSize)
          .offset((page - 1) * pageSize),
      ]);

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
            ...lead
          }) => ({
            ...lead,
            campaignType: deliveryType ?? "",
            currentStage: deliveryStage ?? lead.currentStage ?? "",
            journeyVariant: deliveryVariant ?? lead.journeyVariant ?? "",
            nextScheduledAt: nextScheduledAt?.toISOString() ?? null,
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
