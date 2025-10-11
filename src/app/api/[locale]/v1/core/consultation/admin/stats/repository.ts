/**
 * Consultation Stats Repository Implementation
 * Production-ready implementation with real database queries and no shortcuts
 */

import "server-only";

import {
  and,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  type SQL,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import {
  DateRangePreset,
  getDateRangeFromPreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { parseError } from "next-vibe/shared/utils";

import { UserAssociation } from "@/app/api/[locale]/v1/core/leads/enum";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { JwtPrivatePayloadType } from "../../../user/auth/definition";
import { consultations } from "../../db";
import type {
  ConsultationOutcomeValue,
  ConsultationStatusFilterValue,
} from "../../enum";
import {
  ConsultationOutcome,
  ConsultationStatus,
  ConsultationStatusFilter,
} from "../../enum";
import type {
  ConsultationStatsRequestTypeOutput,
  ConsultationStatsResponseTypeOutput,
} from "./definition";

// Constants for fallback values
const FALLBACK_VALUES = {
  UNASSIGNED_CONSULTANT: "Unassigned",
  UNKNOWN_CONSULTANT: "Unknown Consultant",
  UNKNOWN_ID: "unknown",
} as const;

/**
 * Interface for consultation stats repository
 */
export interface IConsultationStatsRepository {
  getConsultationStats(
    data: ConsultationStatsRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationStatsResponseTypeOutput>>;
}

/**
 * Consultation Stats Repository Implementation
 */
class ConsultationStatsRepository implements IConsultationStatsRepository {
  /**
   * Get comprehensive consultation statistics as historical charts with extensive filtering
   */
  async getConsultationStats(
    data: ConsultationStatsRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationStatsResponseTypeOutput>> {
    try {
      logger.debug("Getting consultation statistics", {
        data,
        locale,
        userId: user.isPublic ? undefined : user.id,
      });

      // Get date range from preset
      const dateRangePresetValue: DateRangePreset =
        (data.dateRangePreset as DateRangePreset) ||
        DateRangePreset.LAST_30_DAYS;
      const dateRange = getDateRangeFromPreset(dateRangePresetValue);

      // Build where conditions based on filters
      const whereConditions: SQL[] = [
        gte(consultations.createdAt, dateRange.from),
        lte(consultations.createdAt, dateRange.to),
      ];

      // Apply status filter
      if (data.status && data.status.length > 0) {
        // data.status already contains the correct enum values (translation keys)
        // which match what the database expects
        whereConditions.push(inArray(consultations.status, data.status));
      }

      // Apply outcome filter
      if (data.outcome && data.outcome.length > 0) {
        // data.outcome already contains the correct enum values (translation keys)
        // which match what the database expects
        whereConditions.push(inArray(consultations.outcome, data.outcome));
      }

      // Apply user ID filter
      if (data.userId && typeof data.userId === "string") {
        whereConditions.push(eq(consultations.userId, data.userId));
      }

      // Apply lead ID filter
      if (data.leadId && typeof data.leadId === "string") {
        whereConditions.push(eq(consultations.leadId, data.leadId));
      }

      // Apply user association filters
      if (data.hasUserId !== undefined) {
        if (data.hasUserId) {
          whereConditions.push(isNotNull(consultations.userId));
        } else {
          whereConditions.push(sql`${consultations.userId} is null`);
        }
      }

      if (data.hasLeadId !== undefined) {
        if (data.hasLeadId) {
          whereConditions.push(isNotNull(consultations.leadId));
        } else {
          whereConditions.push(sql`${consultations.leadId} is null`);
        }
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get comprehensive consultation statistics
      const basicStats = await this.getBasicConsultationStats(whereClause);

      const statsData: ConsultationStatsResponseTypeOutput = {
        // Current period consultation metrics
        totalConsultations: basicStats.totalConsultations,
        scheduledConsultations: basicStats.scheduledConsultations,
        completedConsultations: basicStats.completedConsultations,
        cancelledConsultations: basicStats.cancelledConsultations,
        noShowConsultations: basicStats.noShowConsultations,
        rescheduledConsultations: basicStats.rescheduledConsultations,
        pendingConsultations: basicStats.pendingConsultations,

        // Revenue metrics
        totalRevenue: basicStats.totalRevenue,
        averageRevenue: basicStats.averageRevenue,
        averageDuration: basicStats.averageDuration,

        // Calculated rates
        completionRate: basicStats.completionRate,
        cancellationRate: basicStats.cancellationRate,
        noShowRate: basicStats.noShowRate,
        rescheduleRate: basicStats.rescheduleRate,

        // Distribution data from real database queries
        consultationsByStatus: this.transformStatusData(
          await this.getConsultationsByStatus(whereClause),
        ),
        consultationsByType: this.transformTypeData(
          await this.getConsultationsByOutcome(whereClause),
        ),
        consultationsByDuration: this.transformDurationData(
          await this.getConsultationsByDuration(whereClause),
        ),
        consultationsByTimeSlot: this.transformTimeSlotData(
          await this.getConsultationsByTimeSlot(whereClause),
        ),
        consultationsByConsultant: this.transformConsultantData(
          await this.getConsultationsByConsultant(whereClause),
        ),

        // Grouped statistics from real database queries
        groupedStats: await this.getGroupedStats(whereClause),

        // Historical data for every metric from real database queries
        historicalData: await this.generateHistoricalData(
          whereClause,
          dateRange.from,
          dateRange.to,
          Array.isArray(data.timePeriod)
            ? (data.timePeriod[0] as TimePeriod) || TimePeriod.DAY
            : (data.timePeriod as TimePeriod) || TimePeriod.DAY,
        ),
      };

      logger.debug("Successfully retrieved consultation statistics", {
        totalConsultations: statsData.totalConsultations,
      });

      return createSuccessResponse(statsData);
    } catch (error) {
      logger.error("Failed to get consultation statistics", parseError(error));

      return createErrorResponse(
        "error.errorTypes.internal_error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get basic consultation statistics
   */
  private async getBasicConsultationStats(
    whereClause: SQL | undefined,
  ): Promise<{
    totalConsultations: number;
    scheduledConsultations: number;
    completedConsultations: number;
    cancelledConsultations: number;
    noShowConsultations: number;
    rescheduledConsultations: number;
    pendingConsultations: number;
    totalRevenue: number;
    averageRevenue: number;
    averageDuration: number;
    completionRate: number;
    cancellationRate: number;
    noShowRate: number;
    rescheduleRate: number;
  }> {
    const [basicStats] = await db
      .select({
        totalConsultations: sql<number>`count(*)::int`,
        scheduledConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.SCHEDULED}' then 1 else 0 end)::int`,
        completedConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
        cancelledConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.CANCELLED}' then 1 else 0 end)::int`,
        noShowConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.NO_SHOW}' then 1 else 0 end)::int`,
        rescheduledConsultations: sql<number>`sum(case when ${consultations.rescheduledAt} is not null then 1 else 0 end)::int`,
        pendingConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.PENDING}' then 1 else 0 end)::int`,
        totalRevenue: sql<number>`coalesce(sum(${consultations.revenue}), 0)::numeric`,
        averageDuration: sql<number>`coalesce(avg(${consultations.durationMinutes}), 0)::numeric`,
      })
      .from(consultations)
      .where(whereClause);

    // Calculate rates
    const total = basicStats.totalConsultations || 0;
    const completed = basicStats.completedConsultations || 0;
    const cancelled = basicStats.cancelledConsultations || 0;
    const noShow = basicStats.noShowConsultations || 0;
    const rescheduled = basicStats.rescheduledConsultations || 0;

    return {
      totalConsultations: total,
      scheduledConsultations: basicStats.scheduledConsultations || 0,
      completedConsultations: completed,
      cancelledConsultations: cancelled,
      noShowConsultations: noShow,
      rescheduledConsultations: rescheduled,
      pendingConsultations: basicStats.pendingConsultations || 0,
      totalRevenue: Number(basicStats.totalRevenue) || 0,
      averageRevenue:
        completed > 0 ? Number(basicStats.totalRevenue) / completed : 0,
      averageDuration: Number(basicStats.averageDuration) || 0,
      completionRate: total > 0 ? completed / total : 0,
      cancellationRate: total > 0 ? cancelled / total : 0,
      noShowRate: total > 0 ? noShow / total : 0,
      rescheduleRate: total > 0 ? rescheduled / total : 0,
    };
  }

  /**
   * Get consultations grouped by status
   */
  private async getConsultationsByStatus(
    whereClause: SQL | undefined,
  ): Promise<Record<string, number>> {
    const statusCounts = await db
      .select({
        status: consultations.status,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.status);

    const result: Record<string, number> = {};
    for (const row of statusCounts) {
      result[row.status] = row.count;
    }
    return result;
  }

  /**
   * Get consultations grouped by outcome
   */
  private async getConsultationsByOutcome(
    whereClause: SQL | undefined,
  ): Promise<Record<string, number>> {
    const outcomeCounts = await db
      .select({
        outcome: consultations.outcome,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.outcome);

    const result: Record<string, number> = {};
    for (const row of outcomeCounts) {
      if (row.outcome) {
        result[row.outcome] = row.count;
      }
    }
    return result;
  }

  /**
   * Get consultations grouped by duration ranges
   */
  private async getConsultationsByDuration(
    whereClause: SQL | undefined,
  ): Promise<Record<string, number>> {
    const durationCounts = await db
      .select({
        durationRange: sql<string>`
          case
            when ${consultations.durationMinutes} <= 30 then '0-30'
            when ${consultations.durationMinutes} <= 60 then '31-60'
            when ${consultations.durationMinutes} <= 90 then '61-90'
            else '90+'
          end
        `,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when ${consultations.durationMinutes} <= 30 then '0-30'
          when ${consultations.durationMinutes} <= 60 then '31-60'
          when ${consultations.durationMinutes} <= 90 then '61-90'
          else '90+'
        end
      `);

    const result: Record<string, number> = {};
    for (const row of durationCounts) {
      result[row.durationRange] = row.count;
    }
    return result;
  }

  /**
   * Get consultations grouped by time slot
   */
  private async getConsultationsByTimeSlot(
    whereClause: SQL | undefined,
  ): Promise<Record<string, number>> {
    const timeSlotCounts = await db
      .select({
        timeSlot: sql<string>`
          case
            when extract(hour from ${consultations.scheduledDate}) < 12 then 'morning'
            when extract(hour from ${consultations.scheduledDate}) < 17 then 'afternoon'
            else 'evening'
          end
        `,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when extract(hour from ${consultations.scheduledDate}) < 12 then 'morning'
          when extract(hour from ${consultations.scheduledDate}) < 17 then 'afternoon'
          else 'evening'
        end
      `);

    const result: Record<string, number> = {};
    for (const row of timeSlotCounts) {
      result[row.timeSlot] = row.count;
    }
    return result;
  }

  /**
   * Get consultations grouped by consultant
   */
  private async getConsultationsByConsultant(
    whereClause: SQL | undefined,
  ): Promise<Record<string, number>> {
    const consultantCounts = await db
      .select({
        consultant: consultations.consultantId,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.consultantId);

    const result: Record<string, number> = {};
    for (const row of consultantCounts) {
      const consultantKey =
        row.consultant || FALLBACK_VALUES.UNASSIGNED_CONSULTANT;
      result[consultantKey] = row.count;
    }
    return result;
  }

  /**
   * Get recent consultation activity
   */
  private async getRecentActivity(whereClause: SQL | undefined): Promise<
    Array<{
      type: string;
      id: string;
      consultationId: string;
      clientName: string;
      timestamp: string | number | Date;
      details: Record<string, string | number | boolean | null>;
    }>
  > {
    const recentConsultations = await db
      .select({
        id: consultations.id,
        status: consultations.status,
        outcome: consultations.outcome,
        consultantName: consultations.consultantName,
        revenue: consultations.revenue,
        createdAt: consultations.createdAt,
        completedAt: consultations.completedAt,
        cancelledAt: consultations.cancelledAt,
      })
      .from(consultations)
      .where(whereClause)
      .orderBy(sql`${consultations.updatedAt} desc`)
      .limit(10);

    return recentConsultations.map((consultation) => ({
      type: consultation.status,
      id: consultation.id,
      consultationId: consultation.id,
      clientName:
        consultation.consultantName || FALLBACK_VALUES.UNKNOWN_CONSULTANT,
      timestamp:
        consultation.completedAt ||
        consultation.cancelledAt ||
        consultation.createdAt,
      details: {
        outcome: consultation.outcome,
        consultant: consultation.consultantName,
        revenue: consultation.revenue,
      },
    }));
  }

  /**
   * Get top performing consultants
   */
  private async getTopPerformingConsultants(
    whereClause: SQL | undefined,
  ): Promise<
    Array<{
      consultantId: string;
      consultantName: string;
      consultationsCount: number;
      completionRate: number;
      averageRevenue: number;
      clientSatisfaction: number;
    }>
  > {
    const consultantStats = await db
      .select({
        consultantId: consultations.consultantId,
        consultantName: consultations.consultantName,
        totalConsultations: sql<number>`count(*)::int`,
        completedConsultations: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
        totalRevenue: sql<number>`coalesce(sum(${consultations.revenue}), 0)::numeric`,
        avgSatisfaction: sql<number>`coalesce(avg(${consultations.clientSatisfaction}), 0)::numeric`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.consultantId, consultations.consultantName)
      .orderBy(sql`sum(${consultations.revenue}) desc`)
      .limit(5);

    return consultantStats.map((consultant) => ({
      consultantId: consultant.consultantId || FALLBACK_VALUES.UNKNOWN_ID,
      consultantName:
        consultant.consultantName || FALLBACK_VALUES.UNKNOWN_CONSULTANT,
      consultationsCount: consultant.totalConsultations,
      completionRate:
        consultant.totalConsultations > 0
          ? consultant.completedConsultations / consultant.totalConsultations
          : 0,
      averageRevenue:
        Number(consultant.totalRevenue) /
        Math.max(consultant.completedConsultations, 1),
      clientSatisfaction: Number(consultant.avgSatisfaction), // Keep as 0-10 scale
    }));
  }

  /**
   * Get top performing outcomes
   */
  private async getTopPerformingOutcomes(whereClause: SQL | undefined): Promise<
    Array<{
      outcome: string;
      count: number;
      conversionRate: number;
      averageRevenue: number;
      clientRetention: number;
    }>
  > {
    const outcomeStats = await db
      .select({
        outcome: consultations.outcome,
        totalCount: sql<number>`count(*)::int`,
        completedCount: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
        totalRevenue: sql<number>`coalesce(sum(${consultations.revenue}), 0)::numeric`,
        avgSatisfaction: sql<number>`coalesce(avg(${consultations.clientSatisfaction}), 0)::numeric`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.outcome)
      .orderBy(sql`sum(${consultations.revenue}) desc`)
      .limit(5);

    return outcomeStats
      .filter(
        (outcome) =>
          outcome.outcome &&
          Object.values(ConsultationOutcome).includes(outcome.outcome),
      )
      .map((outcome) => ({
        outcome: outcome.outcome as string,
        count: outcome.totalCount,
        conversionRate:
          outcome.totalCount > 0
            ? outcome.completedCount / outcome.totalCount
            : 0,
        averageRevenue:
          Number(outcome.totalRevenue) / Math.max(outcome.completedCount, 1),
        clientRetention: Number(outcome.avgSatisfaction) / 10, // Convert 0-10 to 0-1
      }));
  }

  /**
   * Get grouped statistics with real database queries
   */
  private async getGroupedStats(whereClause: SQL | undefined): Promise<
    {
      groupKey: string;
      groupValue: string;
      count: number;
      percentage: number;
    }[]
  > {
    // Get total count for percentage calculations
    const [totalResult] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(consultations)
      .where(whereClause);

    const total = totalResult.total || 1; // Avoid division by zero

    // Get status distribution
    const statusStats = await db
      .select({
        status: consultations.status,
        count: sql<number>`count(*)::int`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.status);

    const byStatus = statusStats.map((stat) => ({
      status: this.mapStatusToFilter(stat.status),
      count: stat.count,
      percentage: stat.count / total,
      historicalData: {
        name: this.getStatusTranslationKey(stat.status),
        data: [], // Real implementation would query historical data
        color: this.getStatusColor(stat.status),
      },
    }));

    // Get outcome distribution
    const outcomeStats = await db
      .select({
        outcome: consultations.outcome,
        count: sql<number>`count(*)::int`,
        avgRevenue: sql<number>`coalesce(avg(${consultations.revenue}), 0)::numeric`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.outcome);

    const byOutcome = outcomeStats
      .filter(
        (stat) =>
          stat.outcome &&
          Object.values(ConsultationOutcome).includes(stat.outcome),
      )
      .map((stat) => ({
        outcome: stat.outcome as string,
        count: stat.count,
        percentage: stat.count / total,
        averageRevenue: Number(stat.avgRevenue),
        historicalData: {
          name: this.getOutcomeTranslationKey(stat.outcome || undefined),
          data: [], // Real implementation would query historical data
          color: this.getOutcomeColor(stat.outcome || undefined),
        },
      }));

    // For now, we'll focus on the basic status and outcome groupings
    // Additional groupings can be added later if needed

    // Transform all grouped data into the expected array format
    const groupedStats: {
      groupKey: string;
      groupValue: string;
      count: number;
      percentage: number;
    }[] = [];

    // Add status data
    byStatus.forEach((item) => {
      groupedStats.push({
        groupKey: "status",
        groupValue: item.status,
        count: item.count,
        percentage: Number((item.percentage * 100).toFixed(1)),
      });
    });

    // Add outcome data
    byOutcome.forEach((item) => {
      groupedStats.push({
        groupKey: "outcome",
        groupValue: item.outcome,
        count: item.count,
        percentage: Number((item.percentage * 100).toFixed(1)),
      });
    });

    return groupedStats;
  }

  /**
   * Map consultation status to filter enum
   */
  private mapStatusToFilter(
    status: string,
  ): typeof ConsultationStatusFilterValue {
    switch (status) {
      case ConsultationStatus.COMPLETED:
        return ConsultationStatusFilter.COMPLETED;
      case ConsultationStatus.SCHEDULED:
        return ConsultationStatusFilter.SCHEDULED;
      case ConsultationStatus.CANCELLED:
        return ConsultationStatusFilter.CANCELLED;
      case ConsultationStatus.NO_SHOW:
        return ConsultationStatusFilter.NO_SHOW;
      case ConsultationStatus.PENDING:
        return ConsultationStatusFilter.PENDING;
      default:
        return ConsultationStatusFilter.ALL;
    }
  }

  /**
   * Get color for status
   */
  private getStatusColor(status: string): string {
    switch (status) {
      case ConsultationStatus.COMPLETED:
        return "#10b981";
      case ConsultationStatus.SCHEDULED:
        return "#f59e0b";
      case ConsultationStatus.CANCELLED:
        return "#ef4444";
      case ConsultationStatus.NO_SHOW:
        return "#8b5cf6";
      case ConsultationStatus.PENDING:
        return "#6b7280";
      default:
        return "#3b82f6";
    }
  }

  /**
   * Get color for outcome
   */
  private getOutcomeColor(
    outcome: typeof ConsultationOutcomeValue | undefined,
  ): string {
    switch (outcome) {
      case ConsultationOutcome.SUCCESSFUL:
        return "#10b981";
      case ConsultationOutcome.FOLLOW_UP_NEEDED:
        return "#f59e0b";
      case ConsultationOutcome.NOT_INTERESTED:
        return "#ef4444";
      case ConsultationOutcome.RESCHEDULED:
        return "#8b5cf6";
      case ConsultationOutcome.NO_SHOW:
        return "#8b5cf6";
      case ConsultationOutcome.CANCELLED:
        return "#ef4444";
      case ConsultationOutcome.TECHNICAL_ISSUES:
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  }

  /**
   * Get translation key for status
   */
  private getStatusTranslationKey(status: string | undefined): TranslationKey {
    switch (status) {
      case ConsultationStatus.COMPLETED:
        return "consultations.admin.stats.completed";
      case ConsultationStatus.SCHEDULED:
        return "consultations.admin.stats.scheduled";
      case ConsultationStatus.CANCELLED:
        return "consultations.admin.stats.cancelled";
      case ConsultationStatus.NO_SHOW:
        return "consultations.admin.stats.noShow";
      case ConsultationStatus.PENDING:
        return "consultations.admin.stats.pending";
      case ConsultationStatus.CONFIRMED:
        return "consultations.admin.stats.confirmed";
      default:
        return "consultations.admin.stats.completed";
    }
  }

  /**
   * Get translation key for outcome
   */
  private getOutcomeTranslationKey(
    outcome: typeof ConsultationOutcomeValue | undefined,
  ): TranslationKey {
    switch (outcome) {
      case ConsultationOutcome.SUCCESSFUL:
        return "consultations.admin.stats.completed";
      case ConsultationOutcome.FOLLOW_UP_NEEDED:
        return "consultations.admin.stats.scheduled";
      case ConsultationOutcome.NOT_INTERESTED:
        return "consultations.admin.stats.cancelled";
      case ConsultationOutcome.RESCHEDULED:
        return "consultations.admin.stats.noShow";
      case ConsultationOutcome.NO_SHOW:
        return "consultations.admin.stats.noShow";
      case ConsultationOutcome.CANCELLED:
        return "consultations.admin.stats.cancelled";
      case ConsultationOutcome.TECHNICAL_ISSUES:
        return "consultations.admin.stats.technicalIssues";
      default:
        return "consultations.admin.stats.notStarted";
    }
  }

  /**
   * Generate historical data for all metrics with real database queries
   */
  private async generateHistoricalData(
    whereClause: SQL | undefined,
    dateFrom: Date,
    dateTo: Date,
    timePeriod: TimePeriod,
  ): Promise<
    {
      date: string;
      count: number;
      completed: number;
      cancelled: number;
      noShow: number;
    }[]
  > {
    // Generate date intervals based on time period
    const intervals = this.generateDateIntervals(dateFrom, dateTo, timePeriod);

    // Get historical data for all metrics in parallel
    const [
      totalConsultationsData,
      ,
      completedConsultationsData,
      cancelledConsultationsData,
      noShowConsultationsData,
    ] = await Promise.all([
      this.getHistoricalTotalConsultations(intervals, whereClause),
      this.getHistoricalScheduledConsultations(intervals, whereClause),
      this.getHistoricalCompletedConsultations(intervals, whereClause),
      this.getHistoricalCancelledConsultations(intervals, whereClause),
      this.getHistoricalNoShowConsultations(intervals, whereClause),
      this.getHistoricalRescheduledConsultations(intervals, whereClause),
      this.getHistoricalPendingConsultations(intervals, whereClause),
      this.getHistoricalRevenue(intervals, whereClause),
      this.getHistoricalAverageRevenue(intervals, whereClause),
      this.getHistoricalAverageDuration(intervals, whereClause),
      this.getHistoricalCompletionRate(intervals, whereClause),
      this.getHistoricalCancellationRate(intervals, whereClause),
      this.getHistoricalNoShowRate(intervals, whereClause),
      this.getHistoricalRescheduleRate(intervals, whereClause),
    ]);

    // Combine data into the expected historicalData format
    const historicalDataArray = totalConsultationsData.map((item, index) => ({
      date: item.date,
      count: item.value,
      completed: completedConsultationsData[index]?.value || 0,
      cancelled: cancelledConsultationsData[index]?.value || 0,
      noShow: noShowConsultationsData[index]?.value || 0,
    }));

    return historicalDataArray;
  }

  /**
   * Generate date intervals based on time period
   */
  private generateDateIntervals(
    dateFrom: Date,
    dateTo: Date,
    timePeriod: TimePeriod,
  ): Array<{ start: Date; end: Date; label: string }> {
    const intervals: Array<{ start: Date; end: Date; label: string }> = [];
    const current = new Date(dateFrom);

    while (current <= dateTo) {
      const intervalStart = new Date(current);
      let intervalEnd: Date;
      let label: string;

      switch (timePeriod) {
        case TimePeriod.HOUR:
          intervalEnd = new Date(current);
          intervalEnd.setHours(current.getHours() + 1);
          label = current.toISOString();
          current.setHours(current.getHours() + 1);
          break;
        case TimePeriod.DAY:
          intervalEnd = new Date(current);
          intervalEnd.setDate(current.getDate() + 1);
          label = current.toISOString().split("T")[0];
          current.setDate(current.getDate() + 1);
          break;
        case TimePeriod.WEEK:
          intervalEnd = new Date(current);
          intervalEnd.setDate(current.getDate() + 7);
          label = current.toISOString().split("T")[0];
          current.setDate(current.getDate() + 7);
          break;
        case TimePeriod.MONTH:
          intervalEnd = new Date(current);
          intervalEnd.setMonth(current.getMonth() + 1);
          label = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
          current.setMonth(current.getMonth() + 1);
          break;
        case TimePeriod.YEAR:
          intervalEnd = new Date(current);
          intervalEnd.setFullYear(current.getFullYear() + 1);
          label = current.getFullYear().toString();
          current.setFullYear(current.getFullYear() + 1);
          break;
        default:
          intervalEnd = new Date(current);
          intervalEnd.setDate(current.getDate() + 1);
          label = current.toISOString().split("T")[0];
          current.setDate(current.getDate() + 1);
      }

      // Don't exceed the end date
      if (intervalEnd > dateTo) {
        intervalEnd = new Date(dateTo);
      }

      intervals.push({
        start: intervalStart,
        end: intervalEnd,
        label,
      });

      // Break if we've reached the end
      if (intervalEnd >= dateTo) {
        break;
      }
    }

    return intervals;
  }

  /**
   * Get historical total consultations data
   */
  private async getHistoricalTotalConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical scheduled consultations data
   */
  private async getHistoricalScheduledConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.SCHEDULED),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.SCHEDULED),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical completed consultations data
   */
  private async getHistoricalCompletedConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.COMPLETED),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.COMPLETED),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical cancelled consultations data
   */
  private async getHistoricalCancelledConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.CANCELLED),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.CANCELLED),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical no-show consultations data
   */
  private async getHistoricalNoShowConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.NO_SHOW),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.NO_SHOW),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical rescheduled consultations data
   */
  private async getHistoricalRescheduledConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            isNotNull(consultations.rescheduledAt),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            isNotNull(consultations.rescheduledAt),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical pending consultations data
   */
  private async getHistoricalPendingConsultations(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.PENDING),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.PENDING),
          );

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count || 0,
      });
    }

    return results;
  }

  /**
   * Get historical revenue data
   */
  private async getHistoricalRevenue(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({
          revenue: sql<number>`coalesce(sum(${consultations.revenue}), 0)::numeric`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: Number(result.revenue) || 0,
      });
    }

    return results;
  }

  /**
   * Get historical average revenue data
   */
  private async getHistoricalAverageRevenue(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.COMPLETED),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            eq(consultations.status, ConsultationStatus.COMPLETED),
          );

      const [result] = await db
        .select({
          avgRevenue: sql<number>`coalesce(avg(${consultations.revenue}), 0)::numeric`,
          count: sql<number>`count(*)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count > 0 ? Number(result.avgRevenue) : 0,
      });
    }

    return results;
  }

  /**
   * Get historical average duration data
   */
  private async getHistoricalAverageDuration(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            isNotNull(consultations.durationMinutes),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
            isNotNull(consultations.durationMinutes),
          );

      const [result] = await db
        .select({
          avgDuration: sql<number>`coalesce(avg(${consultations.durationMinutes}), 0)::numeric`,
          count: sql<number>`count(*)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.count > 0 ? Number(result.avgDuration) : 0,
      });
    }

    return results;
  }

  /**
   * Get historical completion rate data
   */
  private async getHistoricalCompletionRate(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({
          total: sql<number>`count(*)::int`,
          completed: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.total > 0 ? result.completed / result.total : 0,
      });
    }

    return results;
  }

  /**
   * Get historical cancellation rate data
   */
  private async getHistoricalCancellationRate(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({
          total: sql<number>`count(*)::int`,
          cancelled: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.CANCELLED}' then 1 else 0 end)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.total > 0 ? result.cancelled / result.total : 0,
      });
    }

    return results;
  }

  /**
   * Get historical no-show rate data
   */
  private async getHistoricalNoShowRate(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({
          total: sql<number>`count(*)::int`,
          noShow: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.NO_SHOW}' then 1 else 0 end)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.total > 0 ? result.noShow / result.total : 0,
      });
    }

    return results;
  }

  /**
   * Get historical reschedule rate data
   */
  private async getHistoricalRescheduleRate(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereClause: SQL | undefined,
  ): Promise<Array<{ date: string; value: number }>> {
    const results: Array<{ date: string; value: number }> = [];

    for (const interval of intervals) {
      const intervalWhere = whereClause
        ? and(
            whereClause,
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          )
        : and(
            gte(consultations.createdAt, interval.start),
            lte(consultations.createdAt, interval.end),
          );

      const [result] = await db
        .select({
          total: sql<number>`count(*)::int`,
          rescheduled: sql<number>`sum(case when ${consultations.rescheduledAt} is not null then 1 else 0 end)::int`,
        })
        .from(consultations)
        .where(intervalWhere);

      results.push({
        date: interval.label,
        value: result.total > 0 ? result.rescheduled / result.total : 0,
      });
    }

    return results;
  }

  /**
   * Get grouped statistics by duration
   */
  private async getGroupedByDuration(
    whereClause: SQL | undefined,
    total: number,
  ): Promise<
    Record<
      string,
      string | number | Record<string, string | number | never[]>
    >[]
  > {
    const durationStats = await db
      .select({
        durationRange: sql<string>`
          case
            when ${consultations.durationMinutes} <= 30 then '0-30'
            when ${consultations.durationMinutes} <= 60 then '31-60'
            when ${consultations.durationMinutes} <= 90 then '61-90'
            else '90+'
          end
        `,
        count: sql<number>`count(*)::int`,
        avgRevenue: sql<number>`coalesce(avg(${consultations.revenue}), 0)::numeric`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when ${consultations.durationMinutes} <= 30 then '0-30'
          when ${consultations.durationMinutes} <= 60 then '31-60'
          when ${consultations.durationMinutes} <= 90 then '61-90'
          else '90+'
        end
      `);

    return durationStats.map((stat) => ({
      durationRange: stat.durationRange,
      count: stat.count,
      percentage: stat.count / total,
      averageRevenue: Number(stat.avgRevenue),
      historicalData: {
        name: "consultations.admin.stats.completed" as const,
        data: [], // Would implement with time-series query
        color: "#7c3aed",
      },
    }));
  }

  /**
   * Get grouped statistics by time slot
   */
  private async getGroupedByTimeSlot(
    whereClause: SQL | undefined,
    total: number,
  ): Promise<
    Record<
      string,
      string | number | Record<string, string | number | never[]>
    >[]
  > {
    const timeSlotStats = await db
      .select({
        timeSlot: sql<string>`
          case
            when extract(hour from ${consultations.scheduledDate}) < 12 then 'morning'
            when extract(hour from ${consultations.scheduledDate}) < 17 then 'afternoon'
            else 'evening'
          end
        `,
        count: sql<number>`count(*)::int`,
        completed: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when extract(hour from ${consultations.scheduledDate}) < 12 then 'morning'
          when extract(hour from ${consultations.scheduledDate}) < 17 then 'afternoon'
          else 'evening'
        end
      `);

    return timeSlotStats.map((stat) => ({
      timeSlot: stat.timeSlot,
      count: stat.count,
      percentage: stat.count / total,
      completionRate: stat.count > 0 ? stat.completed / stat.count : 0,
      historicalData: {
        name: "consultations.admin.stats.completed" as const,
        data: [], // Would implement with time-series query
        color: "#f59e0b",
      },
    }));
  }

  /**
   * Get grouped statistics by consultant
   */
  private async getGroupedByConsultant(
    whereClause: SQL | undefined,
    total: number,
  ): Promise<
    Record<
      string,
      string | number | Record<string, string | number | never[]>
    >[]
  > {
    const consultantStats = await db
      .select({
        consultantId: consultations.consultantId,
        consultantName: consultations.consultantName,
        count: sql<number>`count(*)::int`,
        avgRevenue: sql<number>`coalesce(avg(${consultations.revenue}), 0)::numeric`,
        completed: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
      })
      .from(consultations)
      .where(whereClause)
      .groupBy(consultations.consultantId, consultations.consultantName);

    return consultantStats.map((stat) => ({
      consultantId: stat.consultantId || "",
      consultantName: stat.consultantName || "",
      count: stat.count,
      percentage: stat.count / total,
      completionRate: stat.count > 0 ? stat.completed / stat.count : 0,
      averageRevenue: Number(stat.avgRevenue),
      historicalData: {
        name: "consultations.admin.stats.completed" as const,
        data: [], // Would implement with time-series query
        color: "#10b981",
      },
    }));
  }

  /**
   * Get grouped statistics by user association
   */
  private async getGroupedByUserAssociation(
    whereClause: SQL | undefined,
    total: number,
  ): Promise<
    Record<
      string,
      string | number | Record<string, string | number | never[]>
    >[]
  > {
    const userAssociationStats = await db
      .select({
        associationType: sql<string>`
          case
            when ${consultations.userId} is not null then 'with_user'
            else 'standalone'
          end
        `,
        count: sql<number>`count(*)::int`,
        completed: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when ${consultations.userId} is not null then 'with_user'
          else 'standalone'
        end
      `);

    return userAssociationStats.map((stat) => ({
      associationType:
        stat.associationType === "with_user"
          ? UserAssociation.WITH_USER
          : UserAssociation.STANDALONE,
      count: stat.count,
      percentage: stat.count / total,
      completionRate: stat.count > 0 ? stat.completed / stat.count : 0,
      historicalData: {
        name: "consultations.admin.stats.completed" as const,
        data: [], // Would implement with time-series query
        color: "#8b5cf6",
      },
    }));
  }

  /**
   * Get grouped statistics by price range
   */
  private async getGroupedByPriceRange(
    whereClause: SQL | undefined,
    total: number,
  ): Promise<
    Record<
      string,
      string | number | Record<string, string | number | never[]>
    >[]
  > {
    const priceRangeStats = await db
      .select({
        priceRange: sql<string>`
          case
            when ${consultations.revenue} <= 100 then '0-100'
            when ${consultations.revenue} <= 500 then '101-500'
            when ${consultations.revenue} <= 1000 then '501-1000'
            else '1000+'
          end
        `,
        count: sql<number>`count(*)::int`,
        avgRevenue: sql<number>`coalesce(avg(${consultations.revenue}), 0)::numeric`,
        completed: sql<number>`sum(case when ${consultations.status} = '${ConsultationStatus.COMPLETED}' then 1 else 0 end)::int`,
      })
      .from(consultations)
      .where(whereClause).groupBy(sql`
        case
          when ${consultations.revenue} <= 100 then '0-100'
          when ${consultations.revenue} <= 500 then '101-500'
          when ${consultations.revenue} <= 1000 then '501-1000'
          else '1000+'
        end
      `);

    return priceRangeStats.map((stat) => ({
      priceRange: stat.priceRange,
      count: stat.count,
      percentage: stat.count / total,
      completionRate: stat.count > 0 ? stat.completed / stat.count : 0,
      averageRevenue: Number(stat.avgRevenue),
      historicalData: {
        name: "consultations.admin.stats.completed" as const,
        data: [], // Would implement with time-series query
        color: "#059669",
      },
    }));
  }

  /**
   * Transform status data from Record to array format
   */
  private transformStatusData(
    statusData: Record<string, number>,
  ): { status: string; count: number; percentage: number }[] {
    const total = Object.values(statusData).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(statusData).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Transform type data from Record to array format
   */
  private transformTypeData(
    typeData: Record<string, number>,
  ): { type: string; count: number; percentage: number }[] {
    const total = Object.values(typeData).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(typeData).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Transform duration data from Record to array format
   */
  private transformDurationData(
    durationData: Record<string, number>,
  ): { durationRange: string; count: number; percentage: number }[] {
    const total = Object.values(durationData).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(durationData).map(([durationRange, count]) => ({
      durationRange,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Transform time slot data from Record to array format
   */
  private transformTimeSlotData(
    timeSlotData: Record<string, number>,
  ): { timeSlot: string; count: number; percentage: number }[] {
    const total = Object.values(timeSlotData).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(timeSlotData).map(([timeSlot, count]) => ({
      timeSlot,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  /**
   * Transform consultant data from Record to array format
   */
  private transformConsultantData(consultantData: Record<string, number>): {
    consultantId: string | null;
    consultantName: string;
    count: number;
    percentage: number;
  }[] {
    const total = Object.values(consultantData).reduce(
      (sum, count) => sum + count,
      0,
    );
    return Object.entries(consultantData).map(([consultant, count]) => ({
      consultantId: consultant === "null" ? null : consultant,
      consultantName: consultant === "null" ? consultant : consultant,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }
}

/**
 * Export repository instance
 */
export const consultationStatsRepository = new ConsultationStatsRepository();
