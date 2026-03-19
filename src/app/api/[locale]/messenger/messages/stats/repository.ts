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
  sql,
  type SQL,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import {
  ChartType as SharedChartType,
  type HistoricalDataPointType,
} from "next-vibe/shared/types/stats-filtering.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ActivityType, UserAssociation } from "../../../leads/enum";
import { EngagementLevel } from "../../../leads/tracking/engagement/enum";
import type { JwtPayloadType } from "../../../user/auth/types";
import { emails } from "../db";
import type { StatsT } from "./i18n";

import {
  mapMessageStatusFilter,
  mapMessageTypeFilter,
  MessageStatus,
  MessageStatusFilter,
  MessageTypeFilter,
  RetryRange,
} from "../enum";
import type {
  EmailStatsGetRequestTypeOutput,
  EmailStatsGetResponseTypeOutput,
  EmailStatsGroupedStats,
  EmailStatsByStatus,
  EmailStatsByType,
  EmailStatsByProvider,
  EmailStatsByTemplate,
  EmailStatsByEngagement,
  EmailStatsByRetryCount,
  EmailStatsByUserAssociation,
  EmailStatsRecentActivity,
  EmailStatsTopPerformingTemplate,
  EmailStatsTopPerformingProvider,
  EmailStatsHistoricalData,
} from "./definition";
import { DateRangePreset, getDateRangeFromPreset, TimePeriod } from "./enum";

/**
 * Email Stats Repository
 */
export class EmailStatsRepository {
  /**
   * Get comprehensive email statistics
   */
  static async getStats(
    data: EmailStatsGetRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: StatsT,
  ): Promise<ResponseType<EmailStatsGetResponseTypeOutput>> {
    logger.debug("Getting email stats", {
      userId: user.isPublic ? "public" : user.id,
      timePeriod: data.timePeriod,
      dateRangePreset: data.dateRangePreset,
    });
    const timePeriod = data.timePeriod ?? TimePeriod.day;
    const dateRangePreset =
      data.dateRangePreset ?? DateRangePreset.last_30_days;
    const type = data.type ?? MessageTypeFilter.ANY;
    const status = data.status ?? MessageStatusFilter.ANY;
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
      if (status && status !== MessageStatusFilter.ANY) {
        const mappedStatus = mapMessageStatusFilter(status);
        if (mappedStatus) {
          whereConditions.push(eq(emails.status, mappedStatus));
        }
      }

      // Type filtering
      if (type && type !== MessageTypeFilter.ANY) {
        const mappedType = mapMessageTypeFilter(type);
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
        EmailStatsRepository.generateCurrentPeriodStats(whereClause),
        EmailStatsRepository.generateHistoricalData(timePeriod, whereClause, t),
        EmailStatsRepository.generateGroupedStats(whereClause, t),
        EmailStatsRepository.generateRecentActivity(whereClause),
        EmailStatsRepository.generateTopPerformingTemplates(whereClause),
        EmailStatsRepository.generateTopPerformingProviders(whereClause),
      ]);

      const [
        currentPeriodStats,
        historicalData,
        groupedStats,
        recentActivity,
        topPerformingTemplates,
        topPerformingProviders,
      ] = results;

      const statsResponse: EmailStatsGetResponseTypeOutput = {
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
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Generate current period statistics
   */
  private static async generateCurrentPeriodStats(
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
        sentEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.SENT} then 1 else 0 end), 0)::int`,
        deliveredEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.DELIVERED} then 1 else 0 end), 0)::int`,
        openedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.OPENED} then 1 else 0 end), 0)::int`,
        clickedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.CLICKED} then 1 else 0 end), 0)::int`,
        bouncedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.BOUNCED} then 1 else 0 end), 0)::int`,
        failedEmails: sql<number>`coalesce(sum(case when ${emails.status} = ${MessageStatus.FAILED} then 1 else 0 end), 0)::int`,
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
        provider: emails.accountId,
        count: count(),
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.accountId);

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
        item.provider || "unknown",
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
  private static transformToHistoricalData(
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
  private static getPostgresTimePeriod(
    period: (typeof TimePeriod)[keyof typeof TimePeriod],
  ): string {
    switch (period) {
      case TimePeriod.hour:
        return "hour";
      case TimePeriod.day:
        return "day";
      case TimePeriod.week:
        return "week";
      case TimePeriod.month:
        return "month";
      case TimePeriod.quarter:
        return "quarter";
      case TimePeriod.year:
        return "year";
      default:
        return "day";
    }
  }

  /**
   * Generate historical data for charts
   */
  private static async generateHistoricalData(
    timePeriodParam: (typeof TimePeriod)[keyof typeof TimePeriod],
    whereClause: SQL | undefined,
    t: StatsT,
  ): Promise<EmailStatsHistoricalData> {
    const timePeriod =
      EmailStatsRepository.getPostgresTimePeriod(timePeriodParam);

    // Get historical data for all metrics
    const historicalResults = await db
      .select({
        period: sql<string>`date_trunc('${sql.raw(timePeriod)}', ${emails.createdAt})::text`,
        totalEmails: sql<number>`count(*)::int`,
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.CLICKED})::int`,
        bouncedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.BOUNCED})::int`,
        failedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.FAILED})::int`,
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
          name: t("get.response.metrics.totalEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "totalEmails",
          ),
          color: "#3b82f6",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.sentEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "sentEmails",
          ),
          color: "#10b981",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.deliveredEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "deliveredEmails",
          ),
          color: "#059669",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.openedEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "openedEmails",
          ),
          color: "#0891b2",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.clickedEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "clickedEmails",
          ),
          color: "#7c3aed",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.bouncedEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "bouncedEmails",
          ),
          color: "#dc2626",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.failedEmails"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "failedEmails",
          ),
          color: "#b91c1c",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.deliveryRate"),
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
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.openRate"),
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
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.clickRate"),
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
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.bounceRate"),
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.sentEmails > 0 ? item.bouncedEmails / item.sentEmails : 0,
              label: undefined,
            }),
          ),
          color: "#dc2626",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.failureRate"),
          data: historicalResults.map(
            (item): HistoricalDataPointType => ({
              date: new Date(item.period),
              value:
                item.totalEmails > 0 ? item.failedEmails / item.totalEmails : 0,
              label: undefined,
            }),
          ),
          color: "#b91c1c",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.emails_with_errors"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "emailsWithErrors",
          ),
          color: "#ef4444",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.average_retry_count"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "averageRetryCount",
          ),
          color: "#f97316",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.average_processing_time"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "averageProcessingTime",
          ),
          color: "#f97316",
          type: SharedChartType.LINE,
        },
        {
          name: t("get.response.metrics.average_delivery_time"),
          data: EmailStatsRepository.transformToHistoricalData(
            historicalResults,
            "averageDeliveryTime",
          ),
          color: "#84cc16",
          type: SharedChartType.LINE,
        },
      ],
    };
  }

  /**
   * Generate grouped statistics
   */
  private static async generateGroupedStats(
    whereClause: SQL | undefined,
    t: StatsT,
  ): Promise<EmailStatsGroupedStats> {
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

    const byStatus: EmailStatsByStatus[] = statusStats.map((item) => ({
      status: item.status,
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      historicalData: {
        name: item.status,
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#3b82f6",
        type: SharedChartType.LINE,
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

    const byType: EmailStatsByType[] = typeStats.map((item) => ({
      type: item.type,
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      historicalData: {
        name: item.type,
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#10b981",
        type: SharedChartType.LINE,
      },
    }));

    // Get provider distribution with engagement metrics
    const providerStats = await db
      .select({
        provider: emails.accountId,
        count: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.accountId);

    const byProvider: EmailStatsByProvider[] = providerStats.map((item) => ({
      provider: item.provider || "unknown",
      count: item.count,
      percentage: totalEmails > 0 ? item.count / totalEmails : 0,
      deliveryRate:
        item.sentEmails > 0 ? item.deliveredEmails / item.sentEmails : 0,
      openRate:
        item.deliveredEmails > 0 ? item.openedEmails / item.deliveredEmails : 0,
      clickRate:
        item.openedEmails > 0 ? item.clickedEmails / item.openedEmails : 0,
      historicalData: {
        name: t("get.response.metrics.provider_historical"),
        data: [{ date: new Date().toISOString(), value: item.count }],
        color: "#8b5cf6",
        type: SharedChartType.LINE,
      },
    }));

    // Get template distribution with engagement metrics
    const templateStats = await db
      .select({
        templateName: emails.templateName,
        count: count(),
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.templateName);

    const byTemplate: EmailStatsByTemplate[] = templateStats
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
            eq(emails.status, MessageStatus.CLICKED),
            eq(emails.status, MessageStatus.OPENED),
          ),
        ),
      );

    const lowEngagementCount = await db
      .select({ count: count() })
      .from(emails)
      .where(
        and(
          whereClause,
          eq(emails.status, MessageStatus.DELIVERED),
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

    const byEngagement: EmailStatsByEngagement[] = engagementData.map(
      (item) => ({
        engagement: item.level,
        count: item.count,
      }),
    );

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
        translationKey: t("get.response.retry.no_retries"),
      },
      {
        range: RetryRange.ONE_TO_TWO,
        count: withRetriesCount[0]?.count || 0,
        color: "#f59e0b",
        translationKey: t("get.response.retry.with_retries"),
      },
    ];

    const byRetryCount: EmailStatsByRetryCount[] = retryData.map(
      (item, index) => ({
        retryCount: index,
        count: item.count,
      }),
    );

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
        translationKey: t("get.response.association.with_user"),
      },
      {
        type: UserAssociation.WITH_LEAD,
        count: userAssociationStats.withLead,
        color: "#10b981",
        translationKey: t("get.response.association.with_lead"),
      },
      {
        type: UserAssociation.WITH_BOTH,
        count: userAssociationStats.withBoth,
        color: "#8b5cf6",
        translationKey: t("get.response.association.with_both"),
      },
      {
        type: UserAssociation.STANDALONE,
        count: userAssociationStats.withNeither,
        color: "#6b7280",
        translationKey: t("get.response.association.with_neither"),
      },
    ];

    const byUserAssociation: EmailStatsByUserAssociation[] =
      associationData.map((item) => ({
        association: item.type,
        count: item.count,
      }));

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
  private static async generateRecentActivity(
    whereClause: SQL | undefined,
  ): Promise<EmailStatsRecentActivity[]> {
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
        email.status === MessageStatus.OPENED
          ? ActivityType.EMAIL_OPENED
          : email.status === MessageStatus.CLICKED
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
  private static async generateTopPerformingTemplates(
    whereClause: SQL | undefined,
  ): Promise<EmailStatsTopPerformingTemplate[]> {
    const templateStats = await db
      .select({
        templateName: emails.templateName,
        templateId: emails.templateName, // Use templateName as ID since no separate ID field
        totalEmails: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.templateName)
      .having(sql`count(*) > 0`)
      .orderBy(
        sql`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED}) DESC`,
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
  private static async generateTopPerformingProviders(
    whereClause: SQL | undefined,
  ): Promise<EmailStatsTopPerformingProvider[]> {
    const providerStats = await db
      .select({
        provider: emails.accountId,
        totalEmails: count(),
        sentEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.SENT})::int`,
        deliveredEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED})::int`,
        openedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.OPENED})::int`,
        clickedEmails: sql<number>`count(*) filter (where ${emails.status} = ${MessageStatus.CLICKED})::int`,
      })
      .from(emails)
      .where(whereClause)
      .groupBy(emails.accountId)
      .having(sql`count(*) > 0`)
      .orderBy(
        sql`count(*) filter (where ${emails.status} = ${MessageStatus.DELIVERED}) DESC`,
      );

    return providerStats.map((item) => ({
      provider: item.provider || "unknown",
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
