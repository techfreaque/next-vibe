/**
 * Campaign Queue Repository
 * Queries leads currently active in email campaigns with pagination.
 */

import "server-only";

import { and, asc, count, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import {
  CampaignTypeFilter,
  mapCampaignTypeFilter,
} from "../../../messenger/accounts/enum";
import { emailCampaigns, leads } from "../../db";
import { LeadStatus } from "../../enum";
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
      const offset = (page - 1) * pageSize;

      // Map campaign type filter to actual campaign type value
      const campaignTypeValue =
        data.campaignType && data.campaignType !== CampaignTypeFilter.ANY
          ? mapCampaignTypeFilter(data.campaignType)
          : null;

      // Build the subquery for the next pending email per lead
      const nextScheduledSubquery = db
        .select({
          leadId: emailCampaigns.leadId,
          nextScheduledAt: sql<
            string | null
          >`min(${emailCampaigns.scheduledAt})`.as("next_scheduled_at"),
        })
        .from(emailCampaigns)
        .where(
          sql`${emailCampaigns.status} = 'PENDING' and ${emailCampaigns.sentAt} is null`,
        )
        .groupBy(emailCampaigns.leadId)
        .as("next_email");

      // Base filter: leads with CAMPAIGN_RUNNING status
      const baseFilter = eq(leads.status, LeadStatus.CAMPAIGN_RUNNING);

      // Campaign type condition for joining
      const campaignTypeCondition = campaignTypeValue
        ? eq(emailCampaigns.campaignType, campaignTypeValue)
        : undefined;

      // Count query
      const countQuery = db
        .selectDistinct({ total: count(leads.id) })
        .from(leads)
        .where(baseFilter);

      if (campaignTypeValue) {
        countQuery.innerJoin(
          emailCampaigns,
          and(eq(emailCampaigns.leadId, leads.id), campaignTypeCondition),
        );
      }

      const [countRow] = await countQuery;
      const total = countRow?.total ?? 0;

      // Data query - join with subquery for next scheduled email
      const dataQuery = db
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
          nextScheduledAt: nextScheduledSubquery.nextScheduledAt,
          // Get campaign type from the most recent email campaign
          campaignType: sql<string>`(
            select ec.campaign_type
            from email_campaigns ec
            where ec.lead_id = ${leads.id}
            order by ec.created_at desc
            limit 1
          )`,
        })
        .from(leads)
        .leftJoin(
          nextScheduledSubquery,
          eq(nextScheduledSubquery.leadId, leads.id),
        )
        .where(baseFilter)
        .orderBy(asc(leads.campaignStartedAt))
        .limit(pageSize)
        .offset(offset);

      if (campaignTypeValue) {
        dataQuery.innerJoin(
          emailCampaigns,
          and(eq(emailCampaigns.leadId, leads.id), campaignTypeCondition),
        );
      }

      const rows = await dataQuery;

      const items = rows.map((r) => ({
        leadId: r.leadId,
        leadEmail: r.leadEmail ?? null,
        businessName: r.businessName,
        campaignType: r.campaignType ?? "",
        journeyVariant: r.journeyVariant ?? "",
        currentStage: r.currentStage ?? "",
        nextScheduledAt: r.nextScheduledAt
          ? new Date(r.nextScheduledAt).toISOString()
          : null,
        emailsSent: r.emailsSent,
        emailsOpened: r.emailsOpened,
        emailsClicked: r.emailsClicked,
        startedAt: r.startedAt
          ? new Date(r.startedAt).toISOString()
          : new Date().toISOString(),
      }));

      logger.debug("Campaign queue retrieved", {
        total,
        page,
        pageSize,
        itemCount: items.length,
      });

      return success({
        totalCount: total,
        currentPage: page,
        pageSize,
        items,
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
