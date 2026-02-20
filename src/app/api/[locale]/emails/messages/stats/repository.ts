import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import {
  ChartType,
  DateRangePreset,
  getDateRangeFromPreset,
  type HistoricalDataPointType,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";

import { ActivityType, UserAssociation } from "../../../leads/enum";
import { EngagementLevel } from "../../../leads/tracking/engagement/enum";
import type { JwtPayloadType } from "../../../user/auth/types";
import { emails } from "../db";
import {
  EmailProvider,
  EmailStatus,
  EmailStatusFilter,
  EmailTypeFilter,
  mapEmailStatusFilter,
  mapEmailTypeFilter,
  RetryRange,
} from "../enum";
import type {
  EmailStatsGetRequestTypeOutput,
  EmailStatsGetResponseTypeOutput,
} from "./definition";

// Extract types from definition schema for DRY principle
type EmailStatsResponseType = EmailStatsGetResponseTypeOutput;
type GroupedStatsType = EmailStatsResponseType["groupedStats"];
type ByStatusType = GroupedStatsType["byStatus"][number];
type ByTypeType = GroupedStatsType["byType"][number];
type ByProviderType = GroupedStatsType["byProvider"][number];
type ByTemplateType = GroupedStatsType["byTemplate"][number];
type ByEngagementType = GroupedStatsType["byEngagement"][number];
type ByRetryCountType = GroupedStatsType["byRetryCount"][number];
type ByUserAssociationType = GroupedStatsType["byUserAssociation"][number];
type RecentActivityType = EmailStatsResponseType["recentActivity"][number];
type TopPerformingTemplateType =
  EmailStatsResponseType["topPerformingTemplates"][number];
type TopPerformingProviderType =
  EmailStatsResponseType["topPerformingProviders"][number];
type HistoricalDataType = EmailStatsResponseType["historicalData"];

interface EmailStatsRepository {
  getStats(
    data: EmailStatsGetRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailStatsGetResponseTypeOutput>>;
}

/**
 * Email Stats Repository Implementation
 */
class EmailStatsRepositoryImpl implements EmailStatsRepository {
  /**
   * Get comprehensive email statistics
   */
  async getStats(
    data: EmailStatsGetRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailStatsGetResponseTypeOutput>> {
    logger.debug("Getting email stats", {
      userId: user.isPublic ? "public" : user.id,
      timePeriod: data.timePeriod,
      dateRangePreset: data.dateRangePreset,
    });
    const timePeriod = (data.timePeriod ?? TimePeriod.DAY) as TimePeriod;
    const dateRangePreset = (data.dateRangePreset ??
      DateRangePreset.LAST_30_DAYS) as DateRangePreset;
    const type = (data.type ??
      EmailTypeFilter.ANY) as (typeof EmailTypeFilter)[keyof typeof EmailTypeFilter];
    const status = (data.status ??
      EmailStatusFilter.ANY) as (typeof EmailStatusFilter)[keyof typeof EmailStatusFilter];
    const search = data.search;
    const dateFrom = data.dateFrom ? new Date(data.dateFrom) : undefined;
    const dateTo = data.dateTo ? new Date(data.dateTo) : undefined;

    try {
      // Build date range for filtering
      const dateRange =
        dateFrom && dateTo
          ? {
              from: dateFrom,
              to: dateTo,
            }
          : getDateRangeFromPreset(dateRangePreset);

      // Build comprehensive where conditions for filtering
      const whereConditions: (SQL | undefined)[] = [];

      // Date range filtering
      if (dateRange?.from) {
        whereConditions.push(gte(emails.createdAt, dateRange.from));
      }
      if (dateRange?.to) {
        whereConditions.push(lte(emails.createdAt, dateRange.to));
      }

      // Status filtering
      if (status && status !== EmailStatusFilter.ANY) {
        const mappedStatus = mapEmailStatusFilter(status);
        if (mappedStatus) {
          whereConditions.push(eq(emails.status, mappedStatus));
        }
      }

      // Type filtering
      if (type && type !== EmailTypeFilter.ANY) {
        const mappedType = mapEmailTypeFilter(type);
        if (mappedType) {
          whereConditions.push(eq(emails.type, mappedType));
        }
      }

      // Search filtering
      if (search) {
        whereConditions.push(
          or(
            ilike(emails.subject, `%${search}%`),
            ilike(emails.recipientEmail, `%${search}%`),
          ),
        );
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Generate comprehensive email statistics
      const results = await Promise.all([
        this.generateCurrentPeriodStats(whereClause),
        this.generateHistoricalData(timePeriod, whereClause),
        this.generateGroupedStats(whereClause),
        this.generateRecentActivity(whereClause),
        this.generateTopPerformingTemplates(whereClause),
        this.generateTopPerformingProviders(whereClause),
      ]);

      const [
        currentPeriodStats,
        historicalData,
        groupedStats,
        recentActivity,
        topPerformingTemplates,
        topPerformingProviders,
      ] = results;

      const statsResponse: EmailStatsResponseType = {
        ...currentPeriodStats,
        historicalData,
        groupedStats,
        generatedAt: new Date().toISOString(),
        dataRange: {
          from:
            dateRange?.from?.toISOString() ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: dateRange?.to?.toISOString() || new Date().toISOString(),
        },
        recentActivity,
        topPerformingTemplates,
        topPerformingProviders,
      };

      logger.debug("Email stats generated successfully", {
        totalEmails: statsResponse.totalEmails,
        sentEmails: statsResponse.sentEmails,
        deliveredEmails: statsResponse.deliveredEmails,
      });

      return success(statsResponse);
    } catch (error) {
      logger.error("Error generating email stats", parseError(error));
      return fail({
        message: "app.api.emails.messages.stats.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate current period statistics
   */
  private async generateCurrentPeriodStats(
    whereClause: SQL | undefined,
  ): Promise<{
    totalEmails: number;
    sentEmails: number;
    deliveredEmails: number;
    openedEmails: number;
    clickedEmails: number;
    bouncedEmails: number;
    failedEmails: number;
    draftEmails: number;
    emailsWithUserId: number;
    emailsWithoutUserId: number;
    emailsWithLeadId: number;
    emailsWithoutLeadId: number;
    emailsWithErrors: number;
    emailsWithoutErrors: number;
    averageRetryCount: number;
    maxRetryCount: number;
    averageProcessingTime: number;
    averageDeliveryTime: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    failureRate: number;
    emailsByProvider: Record<string, number>;
    emailsByTemplate: Record<string, number>;
    emailsByStatus: Record<string, number>;
    emailsByType: Record<string, number>;
  }> {
    const [basicStats] = await db
      .select({
        totalEmails: sql<number>`count(*)::int`,
        sentEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.SENT} then 1 else 0 end), 0)::int`,
        deliveredEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.DELIVERED} then 1 else 0 end), 0)::int`,
        openedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.OPENED} then 1 else 0 end), 0)::int`,
        clickedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.CLICKED} then 1 else 0 end), 0)::int`,
        bouncedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.BOUNCED} then 1 else 0 end), 0)::int`,
        failedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${EmailStatus.FAILED} then 1 else 0 end), 0)::int`,
        draftEmails: sql<number>`coalesce(sum(case when ${emails.isDraft} = true then 1 else 0 end), 0)::int`,
        emailsWithUserId: sql<number>`coalesce(sum(case when ${emails.userId} is not null then 1 else 0 end), 0)::int`,
        emailsWithLeadId: sql<number>`coalesce(sum(case when ${emails.leadId} is not null then 1 else 0 end), 0)::int`,
        emailsWithErrors: sql<number>`coalesce(sum(case when ${emails.error} is not null then 1 else 0 end), 0)::int`,
        averageRetryCount: sql<number>`coalesce(avg(${emails.retryCount}::int), 0)::float`,
        maxRetryCount: sql<number>`coalesce(max(${emails.retryCount}::int), 0)::int`,
        averageProcessingTime: sql<number>`coalesce(avg(${emails.processingTimeMs}), 0)::float`,
        averageDeliveryTime: sql<number>`coalesce(avg(${emails.deliveryTimeMs}), 0)::float`,
      })
      .from(emails)
      .where(whereClause);

    // Ensure all values are numbers (handle potential nulls)
    const safeBasicStats = {
      totalEmails: basicStats?.totalEmails ?? 0,
      sentEmails: basicStats?.sentEmails ?? 0,
      deliveredEmails: basicStats?.deliveredEmails ?? 0,
      openedEmails: basicStats?.openedEmails ?? 0,
      clickedEmails: basicStats?.clickedEmails ?? 0,
      bouncedEmails: basicStats?.bouncedEmails ?? 0,
      failedEmails: basicStats?.failedEmails ?? 0,
      draftEmails: basicStats?.draftEmails ?? 0,
      emailsWithUserId: basicStats?.emailsWithUserId ?? 0,
      emailsWithLeadId: basicStats?.emailsWithLeadId ?? 0,
      emailsWithErrors: basicStats?.emailsWithErrors ?? 0,
      averageRetryCount: Number(basicStats?.averageRetryCount) || 0,
      maxRetryCount: basicStats?.maxRetryCount ?? 0,
      averageProcessingTime: Number(basicStats?.averageProcessingTime) || 0,
      averageDeliveryTime: Number(basicStats?.averageDeliveryTime) || 0,
    };

    // Calculate rates
    const deliveryRate =
      safeBasicStats.sentEmails > 0
        ? safeBasicStats.deliveredEmails / safeBasicStats.sentEmails
        : 0;
    const openRate =
      safeBasicStats.deliveredEmails > 0
        ? safeBasicStats.openedEmails / safeBasicStats.deliveredEmails
        : 0;
    const clickRate =
      safeBasicStats.openedEmails > 0
        ? safeBasicStats.clickedEmails / safeBasicStats.openedEmails
        : 0;
    const bounceRate =
      safeBasicStats.sentEmails > 0
        ? safeBasicStats.bouncedEmails / safeBasicStats.sentEmails
        : 0;
    const failureRate =
      safeBasicStats.totalEmails > 0
        ? safeBasicStats.failedEmails / safeBasicStats.totalEmails
        : 0;

    // Get actual record-based stats from database
    const providerStatsResults = await db
      .select({
        provider: emails.emailProvider,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.emailProvider);

    const templateStatsResults = await db
      .select({
        templateName: emails.templateName,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.templateName);

    const statusStatsResults = await db
      .select({
        status: emails.status,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.status);

    const typeStatsResults = await db
      .select({
        type: emails.type,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.type);

    const emailsByProvider = Object.fromEntries(
      providerStatsResults.map((item) => [
        item.provider || EmailProvider.OTHER,
        item.count,
      ]),
    );
    const emailsByTemplate = Object.fromEntries(
      templateStatsResults
        .filter((item) => item.templateName)
        .map((item) => [item.templateName!, item.count]),
    );
    const emailsByStatus = Object.fromEntries(
      statusStatsResults.map((item) => [item.status, item.count]),
    );
    const emailsByType = Object.fromEntries(
      typeStatsResults.map((item) => [item.type, item.count]),
    );

    return {
      ...safeBasicStats,
      deliveryRate,
      openRate,
      clickRate,
      bounceRate,
      failureRate,
      emailsByProvider,
      emailsByTemplate,
      emailsByStatus,
      emailsByType,
      // Add missing fields with default values
      emailsWithoutUserId:
        safeBasicStats.totalEmails - safeBasicStats.emailsWithUserId,
      emailsWithoutLeadId:
        safeBasicStats.totalEmails - safeBasicStats.emailsWithLeadId,
      emailsWithoutErrors:
        safeBasicStats.totalEmails - safeBasicStats.emailsWithErrors,
    };
  }

  /**
   * Helper function to transform historical results to chart data
   */
  private transformToHistoricalData(
    results: Array<{ period: string; [key: string]: number | string }>,
    field: string,
  ): HistoricalDataPointType[] {
    return results.map((item) => ({
      date: new Date(item.period),
      value: (item[field] as number) || 0,
      label: undefined,
    }));
  }

  /**
   * Get PostgreSQL date truncation period string for time period
   */
  private getPostgresTimePeriod(period: TimePeriod): string {
    switch (period) {
      case TimePeriod.HOUR:
        return "hour";
      case TimePeriod.DAY:
        return "day";
      case TimePeriod.WEEK:
        return "week";
      case TimePeriod.MONTH:
        return "month";
      case TimePeriod.QUARTER:
        return "quarter";
      case TimePeriod.YEAR:
        return "year";
      default:
        return "day";
    }
  }

  /**
   * Generate historical data for charts
   */
  private async generateHistoricalData(
    timePeriodParam: TimePeriod,
    whereClause: SQL | undefined,
  ): Promise<HistoricalDataType> {
    const timePeriod = this.getPostgresTimePeriod(timePeriodParam);

    // Get historical data for all metrics
    const historicalResults = await db
      .select({
        period: sql<string>`date_trunc('${sql.raw(timePeriod)}', ${emails.createdAt})::text`,
        totalEmails: sql<number>`count(*)::int`,
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.CLICKED})::int`,
        bouncedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.BOUNCED})::int`,
        failedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.FAILED})::int`,
        draftEmailsHistorical: sql<number>`count(*) filter (where ${emails.isDraft} = true)::int`,
        emailsWithErrors: sql<number>`count(*) filter (where ${emails.error} is not null)::int`,
        averageRetryCount: sql<number>`coalesce(avg(${emails.retryCount}::int), 0)::float`,
        averageProcessingTime: sql<number>`coalesce(avg(${emails.processingTimeMs}), 0)::float`,
        averageDeliveryTime: sql<number>`coalesce(avg(${emails.deliveryTimeMs}), 0)::float`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(sql`date_trunc('${sql.raw(timePeriod)}', ${emails.createdAt})`)
      .orderBy(sql`date_trunc('${sql.raw(timePeriod)}', ${emails.createdAt})`);

    return {
      series: [
        {
          name: "app.api.emails.messages.stats.get.response.metrics.totalEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "totalEmails",
          ),
          color: "#3b82f6",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.sentEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(historicalResults, "sentEmails"),
          color: "#10b981",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.deliveredEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "deliveredEmails",
          ),
          color: "#059669",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.openedEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "openedEmails",
          ),
          color: "#0891b2",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.clickedEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "clickedEmails",
          ),
          color: "#7c3aed",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.bouncedEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "bouncedEmails",
          ),
          color: "#dc2626",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.failedEmails" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "failedEmails",
          ),
          color: "#b91c1c",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.deliveryRate" as const satisfies TranslationKey,
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.sentEmails > 0
                  ? item.deliveredEmails / item.sentEmails
                  : 0,
              label: undefined,
            }),
          ),
          color: "#059669",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.openRate" as const satisfies TranslationKey,
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.deliveredEmails > 0
                  ? item.openedEmails / item.deliveredEmails
                  : 0,
              label: undefined,
            }),
          ),
          color: "#0891b2",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.clickRate" as const satisfies TranslationKey,
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.openedEmails > 0
                  ? item.clickedEmails / item.openedEmails
                  : 0,
              label: undefined,
            }),
          ),
          color: "#7c3aed",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.bounceRate" as const satisfies TranslationKey,
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.sentEmails > 0 ? item.bouncedEmails / item.sentEmails : 0,
              label: undefined,
            }),
          ),
          color: "#dc2626",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.failureRate" as const satisfies TranslationKey,
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.totalEmails > 0 ? item.failedEmails / item.totalEmails : 0,
              label: undefined,
            }),
          ),
          color: "#b91c1c",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.emails_with_errors" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "emailsWithErrors",
          ),
          color: "#ef4444",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.average_retry_count" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "averageRetryCount",
          ),
          color: "#f97316",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.average_processing_time" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "averageProcessingTime",
          ),
          color: "#f97316",
          type: ChartType.LINE,
        },
        {
          name: "app.api.emails.messages.stats.get.response.metrics.average_delivery_time" as const satisfies TranslationKey,
          data: this.transformToHistoricalData(
            historicalResults,
            "averageDeliveryTime",
          ),
          color: "#84cc16",
          type: ChartType.LINE,
        },
      ],
    };
  }

  /**
   * Generate grouped statistics
   */
  private async generateGroupedStats(
    whereClause: SQL | undefined,
  ): Promise<GroupedStatsType> {
    // Get total count for percentage calculations
    const [{ totalEmails }] = await db
      .select({ totalEmails: count() })
      .from(emails)
      .where(whereClause);

    // Get status distribution
    const statusStats = await db
      .select({
        status: emails.status,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.status);

    const byStatus: ByStatusType[] = statusStats.map((item) => ({
      status: item.status,
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      historicalData: {
        name: item.status,
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#3b82f6",
        type: ChartType.LINE,
      },
    }));

    // Get type distribution
    const typeStats = await db
      .select({
        type: emails.type,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.type);

    const byType: ByTypeType[] = typeStats.map((item) => ({
      type: item.type,
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      historicalData: {
        name: item.type,
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#10b981",
        type: ChartType.LINE,
      },
    }));

    // Get provider distribution with engagement metrics
    const providerStats = await db
      .select({
        provider: emails.emailProvider,
        count: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.emailProvider);

    const byProvider: ByProviderType[] = providerStats.map((item) => ({
      provider: item.provider || EmailProvider.OTHER,
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      deliveryRate:
        item.sentEmails > 0 ? item.deliveredEmails / item.sentEmails : 0,
      openRate:
        item.deliveredEmails > 0 ? item.openedEmails / item.deliveredEmails : 0,
      clickRate:
        item.openedEmails > 0 ? item.clickedEmails / item.openedEmails : 0,
      historicalData: {
        name: "app.api.emails.messages.stats.get.response.metrics.provider_historical" as const satisfies TranslationKey,
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#8b5cf6",
        type: ChartType.LINE,
      },
    }));

    // Get template distribution with engagement metrics
    const templateStats = await db
      .select({
        templateName: emails.templateName,
        count: count(),
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.templateName);

    const byTemplate: ByTemplateType[] = templateStats
      .filter((item) => item.templateName)
      .map((item) => ({
        template: item.templateName!,
        count: item.count,
      }));

    // Get engagement level data based on actual email interactions
    const highEngagementCount = await db
      .select({ count: count() })
      .from(emails)
      .where(
        and(
          whereClause,
          or(
            eq(emails.status, EmailStatus.CLICKED),
            eq(emails.status, EmailStatus.OPENED),
          ),
        ),
      );

    const lowEngagementCount = await db
      .select({ count: count() })
      .from(emails)
      .where(
        and(
          whereClause,
          eq(emails.status, EmailStatus.DELIVERED),
          isNull(emails.openedAt),
        ),
      );

    const engagementData = [
      {
        level: EngagementLevel.HIGH,
        count: highEngagementCount[0]?.count || 0,
        color: "#10b981",
      },
      {
        level: EngagementLevel.LOW,
        count: lowEngagementCount[0]?.count || 0,
        color: "#ef4444",
      },
    ];

    const byEngagement: ByEngagementType[] = engagementData.map((item) => ({
      engagement: item.level,
      count: item.count,
    }));

    // Get retry count data based on actual retry counts
    const noRetriesCount = await db
      .select({ count: count() })
      .from(emails)
      .where(and(whereClause, eq(emails.retryCount, "0")));

    const withRetriesCount = await db
      .select({ count: count() })
      .from(emails)
      .where(and(whereClause, sql`${emails.retryCount}::int > 0`));

    const retryData = [
      {
        range: RetryRange.NO_RETRIES,
        count: noRetriesCount[0]?.count || 0,
        color: "#10b981",
        translationKey:
          "app.api.emails.messages.stats.get.response.retry.no_retries" as const satisfies TranslationKey,
      },
      {
        range: RetryRange.ONE_TO_TWO,
        count: withRetriesCount[0]?.count || 0,
        color: "#f59e0b",
        translationKey:
          "app.api.emails.messages.stats.get.response.retry.with_retries" as const satisfies TranslationKey,
      },
    ];

    const byRetryCount: ByRetryCountType[] = retryData.map((item, index) => ({
      retryCount: index,
      count: item.count,
    }));

    // Get user association stats
    const userAssociationStats = {
      withUser: await db
        .select({ count: count() })
        .from(emails)
        .where(and(whereClause, isNotNull(emails.userId)))
        .then((result) => result[0]?.count || 0),
      withLead: await db
        .select({ count: count() })
        .from(emails)
        .where(and(whereClause, isNotNull(emails.leadId)))
        .then((result) => result[0]?.count || 0),
      withBoth: await db
        .select({ count: count() })
        .from(emails)
        .where(
          and(whereClause, isNotNull(emails.userId), isNotNull(emails.leadId)),
        )
        .then((result) => result[0]?.count || 0),
      withNeither: await db
        .select({ count: count() })
        .from(emails)
        .where(and(whereClause, isNull(emails.userId), isNull(emails.leadId)))
        .then((result) => result[0]?.count || 0),
    };

    const associationData = [
      {
        type: UserAssociation.WITH_USER,
        count: userAssociationStats.withUser,
        color: "#3b82f6",
        translationKey:
          "app.api.emails.messages.stats.get.response.association.with_user" as const satisfies TranslationKey,
      },
      {
        type: UserAssociation.WITH_LEAD,
        count: userAssociationStats.withLead,
        color: "#10b981",
        translationKey:
          "app.api.emails.messages.stats.get.response.association.with_lead" as const satisfies TranslationKey,
      },
      {
        type: UserAssociation.WITH_BOTH,
        count: userAssociationStats.withBoth,
        color: "#8b5cf6",
        translationKey:
          "app.api.emails.messages.stats.get.response.association.with_both" as const satisfies TranslationKey,
      },
      {
        type: UserAssociation.STANDALONE,
        count: userAssociationStats.withNeither,
        color: "#6b7280",
        translationKey:
          "app.api.emails.messages.stats.get.response.association.with_neither" as const satisfies TranslationKey,
      },
    ];

    const byUserAssociation: ByUserAssociationType[] = associationData.map(
      (item) => ({
        association: item.type,
        count: item.count,
      }),
    );

    return {
      byStatus,
      byType,
      byProvider,
      byTemplate,
      byEngagement,
      byRetryCount,
      byUserAssociation,
    };
  }

  /**
   * Generate recent activity data
   */
  private async generateRecentActivity(
    whereClause: SQL | undefined,
  ): Promise<RecentActivityType[]> {
    const recentEmails = await db
      .select({
        id: emails.id,
        subject: emails.subject,
        recipientEmail: emails.recipientEmail,
        status: emails.status,
        createdAt: emails.createdAt,
        templateName: emails.templateName,
      })
      .from(emails)
      .where(whereClause)
      .orderBy(desc(emails.createdAt));

    return recentEmails.map((email) => {
      const activityType =
        email.status === EmailStatus.OPENED
          ? ActivityType.EMAIL_OPENED
          : email.status === EmailStatus.CLICKED
            ? ActivityType.EMAIL_CLICKED
            : ActivityType.EMAIL_SENT;

      return {
        id: email.id,
        action: activityType,
        timestamp: email.createdAt.toISOString(),
        details: email.subject || undefined,
      };
    });
  }

  /**
   * Generate top performing templates
   */
  private async generateTopPerformingTemplates(
    whereClause: SQL | undefined,
  ): Promise<TopPerformingTemplateType[]> {
    const templateStats = await db
      .select({
        templateName: emails.templateName,
        templateId: emails.templateName, // Use templateName as ID since no separate ID field
        totalEmails: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.templateName)
      .having(sql`count(*) > 0`)
      .orderBy(
        sql`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED}) DESC`,
      );

    return templateStats
      .filter((item) => item.templateName)
      .map((item) => ({
        template: item.templateName!,
        sent: item.sentEmails,
        delivered: item.deliveredEmails,
        opened: item.openedEmails,
        clicked: item.clickedEmails,
        deliveryRate:
          item.sentEmails > 0 ? item.deliveredEmails / item.sentEmails : 0,
        openRate:
          item.deliveredEmails > 0
            ? item.openedEmails / item.deliveredEmails
            : 0,
        clickRate:
          item.openedEmails > 0 ? item.clickedEmails / item.openedEmails : 0,
      }));
  }

  /**
   * Generate top performing providers
   */
  private async generateTopPerformingProviders(
    whereClause: SQL | undefined,
  ): Promise<TopPerformingProviderType[]> {
    const providerStats = await db
      .select({
        provider: emails.emailProvider,
        totalEmails: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${EmailStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.emailProvider)
      .having(sql`count(*) > 0`)
      .orderBy(
        sql`count(*) filter (where ${emails.status} = ${EmailStatus.DELIVERED}) DESC`,
      );

    return providerStats.map((item) => ({
      provider: item.provider || EmailProvider.OTHER,
      sent: item.sentEmails,
      delivered: item.deliveredEmails,
      opened: item.openedEmails,
      clicked: item.clickedEmails,
      deliveryRate:
        item.sentEmails > 0 ? item.deliveredEmails / item.sentEmails : 0,
      openRate:
        item.deliveredEmails > 0 ? item.openedEmails / item.deliveredEmails : 0,
      clickRate:
        item.openedEmails > 0 ? item.clickedEmails / item.openedEmails : 0,
    }));
  }
}

/**
 * Export singleton instance
 */
export const emailStatsRepository = new EmailStatsRepositoryImpl();
