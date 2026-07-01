/**
 * Leads Dashboard Repository
 * Queries KPI counts, status breakdown, recent leads, and conversion metrics
 */

import "server-only";

import { count, desc, gte, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { LeadStatus } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { LeadsDashboardResponseOutput } from "./definition";
import type { LeadsDashboardT } from "./i18n";

export class LeadsDashboardRepository {
  static async getDashboard(
    logger: EndpointLogger,
    t: LeadsDashboardT,
  ): Promise<ResponseType<LeadsDashboardResponseOutput>> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Active leads: all statuses that are not terminal/inactive
      const activeStatuses = [
        LeadStatus.NEW,
        LeadStatus.PENDING,
        LeadStatus.CAMPAIGN_RUNNING,
        LeadStatus.WEBSITE_USER,
        LeadStatus.NEWSLETTER_SUBSCRIBER,
        LeadStatus.IN_CONTACT,
      ] as const;

      const [activeRow] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(
          sql`${leads.status} = ANY(ARRAY[${sql.join(
            activeStatuses.map((s) => sql`${s}`),
            sql`, `,
          )}]::text[])`,
        );

      const activeLeadsCount = activeRow?.cnt ?? 0;

      // New leads created in the last 7 days
      const [newWeekRow] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(gte(leads.createdAt, sevenDaysAgo));

      const newThisWeekCount = newWeekRow?.cnt ?? 0;

      // Running campaigns: leads currently in campaign (CAMPAIGN_RUNNING status)
      const [campaignRow] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(sql`${leads.status} = ${LeadStatus.CAMPAIGN_RUNNING}`);

      const runningCampaignsCount = campaignRow?.cnt ?? 0;

      // Converted: leads with SIGNED_UP or SUBSCRIPTION_CONFIRMED status
      const convertedStatuses = [
        LeadStatus.SIGNED_UP,
        LeadStatus.SUBSCRIPTION_CONFIRMED,
      ] as const;

      const [convertedRow] = await db
        .select({ cnt: count() })
        .from(leads)
        .where(
          sql`${leads.status} = ANY(ARRAY[${sql.join(
            convertedStatuses.map((s) => sql`${s}`),
            sql`, `,
          )}]::text[])`,
        );

      const convertedCount = convertedRow?.cnt ?? 0;

      // Total leads count
      const [totalRow] = await db.select({ cnt: count() }).from(leads);
      const totalLeadsCount = totalRow?.cnt ?? 0;

      // Conversion rate
      const conversionRate =
        totalLeadsCount > 0
          ? Math.round((convertedCount / totalLeadsCount) * 1000) / 10
          : 0;

      // Status breakdown: count per status
      const statusRows = await db
        .select({
          status: leads.status,
          cnt: count(),
        })
        .from(leads)
        .groupBy(leads.status);

      const statusBreakdown: Record<string, number> = {};
      for (const row of statusRows) {
        statusBreakdown[row.status] = row.cnt;
      }

      // Recent leads: last 5 created
      const recentLeadRows = await db
        .select({
          id: leads.id,
          businessName: leads.businessName,
          email: leads.email,
          status: leads.status,
          source: leads.source,
          createdAt: leads.createdAt,
        })
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(5);

      const recentLeads = recentLeadRows.map((row) => ({
        id: row.id,
        businessName: row.businessName,
        email: row.email ?? "",
        status: row.status,
        source: row.source,
        createdAt: row.createdAt.toISOString(),
      }));

      return success({
        activeLeadsCount,
        newThisWeekCount,
        runningCampaignsCount,
        convertedCount,
        totalLeadsCount,
        conversionRate,
        statusBreakdown,
        recentLeads,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to load leads dashboard", {
        error: parsed.message,
      });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
