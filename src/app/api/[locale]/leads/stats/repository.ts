/**
 * Leads Stats Repository Implementation
 * Production-ready implementation following established patterns
 */

import "server-only";

import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  notInArray,
  type SQL,
  sql,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { ChartType } from "next-vibe/shared/types/stats-filtering.schema";
import {
  getDateRangeFromPreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  convertCountryFilter,
  convertLanguageFilter,
  CountryFilter,
  LanguageFilter,
} from "@/i18n/core/config";

import { emailCampaigns, leads } from "../db";
import type { LeadSource } from "../enum";
import {
  ActivityType,
  EmailCampaignStageFilter,
  LeadSourceFilter,
  LeadStatus,
  LeadStatusFilter,
  mapCampaignStageFilter,
  mapSourceFilter,
  mapStatusFilter,
} from "../enum";
import type {
  LeadsStatsRequestOutput,
  LeadsStatsResponseOutput,
} from "./definition";

// Constants for metric types to avoid literal strings
const METRIC_TYPES = {
  TOTAL: "total",
  NEW: "new",
  ACTIVE: "active",
  CAMPAIGN_RUNNING: "campaign_running",
  WEBSITE_USER: "website_user",
  NEWSLETTER_SUBSCRIBER: "newsletter_subscriber",
  CONVERTED: "converted",
  SIGNED_UP: "signed_up",
  CONSULTATION_BOOKED: "consultation_booked",
  SUBSCRIPTION_CONFIRMED: "subscription_confirmed",
  UNSUBSCRIBED: "unsubscribed",
  BOUNCED: "bounced",
  INVALID: "invalid",
  EMAILS_SENT: "emails_sent",
  EMAILS_OPENED: "emails_opened",
  EMAILS_CLICKED: "emails_clicked",
} as const;

// PostgreSQL date truncation constants
const DATE_TRUNC = {
  HOUR: "'hour'",
  DAY: "'day'",
  WEEK: "'week'",
  MONTH: "'month'",
  QUARTER: "'quarter'",
  YEAR: "'year'",
} as const;

// Constants for default values
const DEFAULT_VALUES = {
  UNKNOWN_CAMPAIGN: "unknown_campaign",
  UNKNOWN_SOURCE: "unknown_source",
  UNKNOWN: "unknown",
} as const;

// Type for historical metric query results
interface HistoricalMetricResult {
  date: string;
  value: number;
}

// Map LeadStatus to ActivityType for recent activity
const mapLeadStatusToActivityType = (
  status: (typeof LeadStatus)[keyof typeof LeadStatus],
): (typeof ActivityType)[keyof typeof ActivityType] => {
  switch (status) {
    case LeadStatus.NEW:
      return ActivityType.LEAD_CREATED;
    case LeadStatus.CAMPAIGN_RUNNING:
    case LeadStatus.SIGNED_UP:
    case LeadStatus.CONSULTATION_BOOKED:
    case LeadStatus.SUBSCRIPTION_CONFIRMED:
      return ActivityType.LEAD_CONVERTED;
    case LeadStatus.UNSUBSCRIBED:
      return ActivityType.LEAD_UNSUBSCRIBED;
    default:
      return ActivityType.LEAD_UPDATED;
  }
};

export interface LeadsStatsRepository {
  getLeadsStats(
    data: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsStatsResponseOutput>>;
}

export class LeadsStatsRepositoryImpl implements LeadsStatsRepository {
  /**
   * Get comprehensive leads statistics
   */
  async getLeadsStats(
    data: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<LeadsStatsResponseOutput>> {
    // Initialize date variables for error handling scope
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    try {
      logger.debug("Getting leads stats");

      // Get date range from preset
      const dateRange = getDateRangeFromPreset(data.dateRangePreset);
      dateFrom = dateRange.from;
      dateTo = dateRange.to;

      // Build where conditions
      const whereConditions = this.buildWhereConditions(data, dateFrom, dateTo);

      // Get all metrics in parallel
      const [
        currentMetrics,
        historicalData,
        groupedStats,
        recentActivity,
        topPerformingCampaigns,
        topPerformingSources,
      ] = await Promise.all([
        this.getCurrentPeriodMetrics(whereConditions),
        this.generateHistoricalData(
          whereConditions,
          dateFrom,
          dateTo,
          data.timePeriod,
          data,
          logger,
        ),
        this.generateGroupedStats(whereConditions),
        this.generateRecentActivity(whereConditions),
        this.generateTopPerformingCampaigns(whereConditions),
        this.generateTopPerformingSources(whereConditions),
      ]);

      const response: LeadsStatsResponseOutput = {
        ...currentMetrics,
        historicalData,
        groupedStats,
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: dateFrom.toISOString(),
          to: dateTo.toISOString(),
        },
        recentActivity,
        topPerformingCampaigns,
        topPerformingSources,
      };

      return success(response);
    } catch (error) {
      const errorDetails = parseError(error);
      logger.error("Error getting leads stats", {
        error: errorDetails.message,
        stack: errorDetails.stack,
        dateRange: {
          from: dateFrom?.toISOString(),
          to: dateTo?.toISOString(),
        },
      });
      return fail({
        message: "app.api.leads.stats.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Build where conditions for database queries
   */
  private buildWhereConditions(
    query: LeadsStatsRequestOutput,
    dateFrom: Date,
    dateTo: Date,
  ): SQL | undefined {
    const conditions: SQL[] = [];

    // Date range filter
    conditions.push(gte(leads.createdAt, dateFrom));
    conditions.push(lte(leads.createdAt, dateTo));

    // Status filter
    if (query.status && query.status !== LeadStatusFilter.ALL) {
      const status = mapStatusFilter(query.status);
      if (status) {
        conditions.push(eq(leads.status, status));
      }
    }

    // Source filter
    if (query.source && query.source !== LeadSourceFilter.ALL) {
      const source = mapSourceFilter(query.source);
      if (source) {
        conditions.push(eq(leads.source, source));
      }
    }

    // Country filter
    if (query.country !== CountryFilter.ALL) {
      // Map filter to actual enum value
      const countryValue = convertCountryFilter(query.country);
      if (countryValue) {
        conditions.push(eq(leads.country, countryValue));
      }
    }

    // Language filter
    if (query.language !== LanguageFilter.ALL) {
      // Map filter to actual enum value
      const languageValue = convertLanguageFilter(query.language);
      if (languageValue) {
        conditions.push(eq(leads.language, languageValue));
      }
    }

    // Campaign stage filter
    if (query.campaignStage !== EmailCampaignStageFilter.ALL) {
      const stage = mapCampaignStageFilter(query.campaignStage);
      if (stage) {
        conditions.push(eq(leads.currentCampaignStage, stage));
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  /**
   * Get current period metrics with real database queries
   */
  private async getCurrentPeriodMetrics(
    whereConditions: SQL | undefined,
  ): Promise<
    Omit<
      LeadsStatsResponseOutput,
      | "historicalData"
      | "groupedStats"
      | "generatedAt"
      | "dataRange"
      | "recentActivity"
      | "topPerformingCampaigns"
      | "topPerformingSources"
    >
  > {
    // Get basic counts
    const totalLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const activeLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              notInArray(leads.status, [
                LeadStatus.UNSUBSCRIBED,
                LeadStatus.BOUNCED,
                LeadStatus.INVALID,
              ]),
            )
          : notInArray(leads.status, [
              LeadStatus.UNSUBSCRIBED,
              LeadStatus.BOUNCED,
              LeadStatus.INVALID,
            ]),
      );

    const campaignRunningLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.CAMPAIGN_RUNNING))
          : eq(leads.status, LeadStatus.CAMPAIGN_RUNNING),
      );

    const websiteUserLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.WEBSITE_USER))
          : eq(leads.status, LeadStatus.WEBSITE_USER),
      );

    const newsletterSubscriberLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              eq(leads.status, LeadStatus.NEWSLETTER_SUBSCRIBER),
            )
          : eq(leads.status, LeadStatus.NEWSLETTER_SUBSCRIBER),
      );

    const signedUpLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.SIGNED_UP))
          : eq(leads.status, LeadStatus.SIGNED_UP),
      );

    const consultationBookedLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              eq(leads.status, LeadStatus.CONSULTATION_BOOKED),
            )
          : eq(leads.status, LeadStatus.CONSULTATION_BOOKED),
      );

    const subscriptionConfirmedLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              eq(leads.status, LeadStatus.SUBSCRIPTION_CONFIRMED),
            )
          : eq(leads.status, LeadStatus.SUBSCRIPTION_CONFIRMED),
      );

    const unsubscribedLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.UNSUBSCRIBED))
          : eq(leads.status, LeadStatus.UNSUBSCRIBED),
      );

    const bouncedLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.BOUNCED))
          : eq(leads.status, LeadStatus.BOUNCED),
      );

    const invalidLeadsResult = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, eq(leads.status, LeadStatus.INVALID))
          : eq(leads.status, LeadStatus.INVALID),
      );

    // Get email metrics
    const emailMetricsResult = await db
      .select({
        totalEmailsSent: sql<number>`COALESCE(SUM(${leads.emailsSent}), 0)::int`,
        totalEmailsOpened: sql<number>`COALESCE(SUM(${leads.emailsOpened}), 0)::int`,
        totalEmailsClicked: sql<number>`COALESCE(SUM(${leads.emailsClicked}), 0)::int`,
      })
      .from(leads)
      .where(whereConditions);

    const totalLeads = Number(totalLeadsResult[0]?.count || 0);
    const emailMetrics = emailMetricsResult[0] || {
      totalEmailsSent: 0,
      totalEmailsOpened: 0,
      totalEmailsClicked: 0,
    };

    // Calculate rates
    const averageEmailsPerLead =
      totalLeads > 0 ? emailMetrics.totalEmailsSent / totalLeads : 0;
    const averageOpenRate =
      emailMetrics.totalEmailsSent > 0
        ? emailMetrics.totalEmailsOpened / emailMetrics.totalEmailsSent
        : 0;
    const averageClickRate =
      emailMetrics.totalEmailsSent > 0
        ? emailMetrics.totalEmailsClicked / emailMetrics.totalEmailsSent
        : 0;

    const signedUpLeads = Number(signedUpLeadsResult[0]?.count || 0);
    const consultationBookedLeads = Number(
      consultationBookedLeadsResult[0]?.count || 0,
    );
    const subscriptionConfirmedLeads = Number(
      subscriptionConfirmedLeadsResult[0]?.count || 0,
    );

    // Fix conversion rate calculation - converted means having convertedAt timestamp
    const actualConvertedLeads = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, isNotNull(leads.convertedAt))
          : isNotNull(leads.convertedAt),
      );

    const actualConverted = Number(actualConvertedLeads[0]?.count || 0);

    const conversionRate = totalLeads > 0 ? actualConverted / totalLeads : 0;
    const signupRate = totalLeads > 0 ? signedUpLeads / totalLeads : 0;
    const consultationBookingRate =
      totalLeads > 0 ? consultationBookedLeads / totalLeads : 0;
    const subscriptionConfirmationRate =
      totalLeads > 0 ? subscriptionConfirmedLeads / totalLeads : 0;

    // Calculate additional metrics
    const leadsWithEmailEngagement = await db
      .select({ count: count() })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              sql`(${leads.emailsOpened} > 0 OR ${leads.emailsClicked} > 0)`,
            )
          : sql`(${leads.emailsOpened} > 0 OR ${leads.emailsClicked} > 0)`,
      );

    const leadsWithoutEmailEngagement =
      totalLeads - Number(leadsWithEmailEngagement[0]?.count || 0);

    return {
      totalLeads,
      newLeads: totalLeads, // For current period stats, new leads = total leads in the filtered period
      activeLeads: Number(activeLeadsResult[0]?.count || 0),
      campaignRunningLeads: Number(campaignRunningLeadsResult[0]?.count || 0),
      websiteUserLeads: Number(websiteUserLeadsResult[0]?.count || 0),
      newsletterSubscriberLeads: Number(
        newsletterSubscriberLeadsResult[0]?.count || 0,
      ),
      convertedLeads: actualConverted, // Use the corrected converted count
      signedUpLeads,
      consultationBookedLeads,
      subscriptionConfirmedLeads,
      unsubscribedLeads: Number(unsubscribedLeadsResult[0]?.count || 0),
      bouncedLeads: Number(bouncedLeadsResult[0]?.count || 0),
      invalidLeads: Number(invalidLeadsResult[0]?.count || 0),
      totalEmailsSent: emailMetrics.totalEmailsSent,
      totalEmailsOpened: emailMetrics.totalEmailsOpened,
      totalEmailsClicked: emailMetrics.totalEmailsClicked,
      averageEmailsPerLead:
        Math.round((averageEmailsPerLead + Number.EPSILON) * 100) / 100,
      averageOpenRate:
        Math.round((averageOpenRate + Number.EPSILON) * 100) / 100,
      averageClickRate:
        Math.round((averageClickRate + Number.EPSILON) * 100) / 100,
      leadsWithEmailEngagement: Number(leadsWithEmailEngagement[0]?.count || 0),
      leadsWithoutEmailEngagement,
      averageEmailEngagementScore:
        emailMetrics.totalEmailsSent > 0
          ? Math.round(
              ((emailMetrics.totalEmailsOpened +
                emailMetrics.totalEmailsClicked * 2) /
                emailMetrics.totalEmailsSent +
                Number.EPSILON) *
                100,
            ) / 100
          : 0,
      totalEmailEngagements:
        emailMetrics.totalEmailsOpened + emailMetrics.totalEmailsClicked,
      conversionRate,
      signupRate,
      consultationBookingRate,
      subscriptionConfirmationRate,
      leadsByCampaignStage: await this.getLeadsByCampaignStage(whereConditions),
      leadsInActiveCampaigns:
        await this.getLeadsInActiveCampaigns(whereConditions),
      leadsNotInCampaigns: await this.getLeadsNotInCampaigns(whereConditions),
      leadsByJourneyVariant:
        await this.getLeadsByJourneyVariant(whereConditions),
      leadsByCountry: await this.getLeadsByCountry(whereConditions),
      leadsByLanguage: await this.getLeadsByLanguage(whereConditions),
      leadsBySource: await this.getLeadsBySource(whereConditions),
      leadsByStatus: await this.getLeadsByStatus(whereConditions),
      leadsWithBusinessName: await this.getLeadsWithField(
        whereConditions,
        "businessName",
      ),
      leadsWithContactName: await this.getLeadsWithField(
        whereConditions,
        "contactName",
      ),
      leadsWithPhone: await this.getLeadsWithField(whereConditions, "phone"),
      leadsWithWebsite: await this.getLeadsWithField(
        whereConditions,
        "website",
      ),
      leadsWithNotes: await this.getLeadsWithField(whereConditions, "notes"),
      dataCompletenessRate:
        await this.calculateDataCompletenessRate(whereConditions),
      leadsCreatedToday: await this.getLeadsCreatedInPeriod(
        whereConditions,
        "today",
      ),
      leadsCreatedThisWeek: await this.getLeadsCreatedInPeriod(
        whereConditions,
        "week",
      ),
      leadsCreatedThisMonth: await this.getLeadsCreatedInPeriod(
        whereConditions,
        "month",
      ),
      leadsUpdatedToday: await this.getLeadsUpdatedInPeriod(
        whereConditions,
        "today",
      ),
      leadsUpdatedThisWeek: await this.getLeadsUpdatedInPeriod(
        whereConditions,
        "week",
      ),
      leadsUpdatedThisMonth: await this.getLeadsUpdatedInPeriod(
        whereConditions,
        "month",
      ),
      averageTimeToConversion:
        await this.calculateAverageTimeToConversion(whereConditions),
      averageTimeToSignup:
        await this.calculateAverageTimeToSignup(whereConditions),
      averageTimeToConsultation:
        await this.calculateAverageTimeToConsultation(whereConditions),
      leadVelocity: await this.calculateCurrentLeadVelocity(whereConditions),
    };
  }

  /**
   * Generate historical data for all metrics with comprehensive error handling
   * Ensures all metrics are generated safely with proper fallbacks
   */
  private async generateHistoricalData(
    whereConditions: SQL | undefined,
    dateFrom: Date,
    dateTo: Date,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<LeadsStatsResponseOutput["historicalData"]> {
    try {
      logger.debug("Generating historical data", {
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        timePeriod,
      });

      // Generate date intervals based on time period with error handling
      const intervals = this.generateDateIntervals(
        dateFrom,
        dateTo,
        timePeriod,
        logger,
      );

      if (intervals.length === 0) {
        logger.error("No intervals generated for historical data", {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          timePeriod,
        });
        return this.createEmptyHistoricalDataStructure();
      }

      // Get historical data for each metric with individual error handling
      const [
        totalLeadsData,
        newLeadsData,
        activeLeadsData,
        campaignRunningLeadsData,
        websiteUserLeadsData,
        newsletterSubscriberLeadsData,
        convertedLeadsData,
        signedUpLeadsData,
        consultationBookedLeadsData,
        subscriptionConfirmedLeadsData,
        unsubscribedLeadsData,
        bouncedLeadsData,
        invalidLeadsData,
        emailsSentData,
        emailsOpenedData,
        emailsClickedData,
      ] = await Promise.allSettled([
        // Use specialized method for cumulative total leads
        this.getCumulativeTotalLeads(
          intervals,
          whereConditions,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.NEW,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.ACTIVE,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.CAMPAIGN_RUNNING,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.WEBSITE_USER,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.NEWSLETTER_SUBSCRIBER,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.CONVERTED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.SIGNED_UP,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.CONSULTATION_BOOKED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.SUBSCRIPTION_CONFIRMED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.UNSUBSCRIBED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.BOUNCED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.INVALID,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.EMAILS_SENT,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.EMAILS_OPENED,
          timePeriod,
          filters,
          logger,
        ),
        this.getHistoricalMetric(
          intervals,
          whereConditions,
          METRIC_TYPES.EMAILS_CLICKED,
          timePeriod,
          filters,
          logger,
        ),
      ]).then((results) => {
        // Extract successful results and provide fallbacks for failed ones
        const emptyIntervalData = intervals.map((interval) => ({
          date: interval.label,
          value: 0,
        }));

        return results.map((result, index) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            const metricNames = [
              "totalLeads",
              "newLeads",
              "activeLeads",
              "campaignRunningLeads",
              "websiteUserLeads",
              "newsletterSubscriberLeads",
              "convertedLeads",
              "signedUpLeads",
              "consultationBookedLeads",
              "subscriptionConfirmedLeads",
              "unsubscribedLeads",
              "bouncedLeads",
              "invalidLeads",
              "emailsSent",
              "emailsOpened",
              "emailsClicked",
            ];
            logger.error(
              `Error getting historical metric: ${metricNames[index]}`,
              {
                error: parseError(result.reason).message,
                timePeriod,
                intervalCount: intervals.length,
              },
            );
            return emptyIntervalData;
          }
        });
      });

      // Calculate rates from the raw data
      const openRateData = this.calculateRateData(
        emailsOpenedData,
        emailsSentData,
        logger,
      );
      const clickRateData = this.calculateRateData(
        emailsClickedData,
        emailsSentData,
        logger,
      );
      const conversionRateData = this.calculateRateData(
        convertedLeadsData,
        totalLeadsData,
        logger,
      );
      const signupRateData = this.calculateRateData(
        signedUpLeadsData,
        totalLeadsData,
        logger,
      );
      const consultationBookingRateData = this.calculateRateData(
        consultationBookedLeadsData,
        totalLeadsData,
        logger,
      );
      const subscriptionConfirmationRateData = this.calculateRateData(
        subscriptionConfirmedLeadsData,
        totalLeadsData,
        logger,
      );

      return {
        totalLeads: {
          name: "app.api.leads.admin.stats.total_leads" as const,
          type: "line" as ChartType,
          data: totalLeadsData,
          color: "#3b82f6",
        },
        newLeads: {
          name: "app.api.leads.admin.stats.new_leads" as const,
          type: "line" as ChartType,
          data: newLeadsData,
          color: "#10b981",
        },
        activeLeads: {
          name: "app.api.leads.admin.stats.active_leads" as const,
          type: "line" as ChartType,
          data: activeLeadsData,
          color: "#f59e0b",
        },
        campaignRunningLeads: {
          name: "app.api.leads.admin.stats.metrics.campaign_running_leads" as const,
          type: "line" as ChartType,
          data: campaignRunningLeadsData,
          color: "#10b981",
        },
        websiteUserLeads: {
          name: "app.api.leads.admin.stats.metrics.website_user_leads" as const,
          type: "line" as ChartType,
          data: websiteUserLeadsData,
          color: "#8b5cf6",
        },
        newsletterSubscriberLeads: {
          name: "app.api.leads.admin.stats.metrics.newsletter_subscriber_leads" as const,
          type: "line" as ChartType,
          data: newsletterSubscriberLeadsData,
          color: "#06b6d4",
        },
        convertedLeads: {
          name: "app.api.leads.admin.stats.converted_leads" as const,
          type: "line" as ChartType,
          data: convertedLeadsData,
          color: "#06b6d4",
        },
        signedUpLeads: {
          name: "app.api.leads.admin.stats.metrics.signed_up_leads" as const,
          type: "line" as ChartType,
          data: signedUpLeadsData,
          color: "#84cc16",
        },
        consultationBookedLeads: {
          name: "app.api.leads.admin.stats.metrics.consultation_booked_leads" as const,
          type: "line" as ChartType,
          data: consultationBookedLeadsData,
          color: "#f97316",
        },
        subscriptionConfirmedLeads: {
          name: "app.api.leads.admin.stats.metrics.subscription_confirmed_leads" as const,
          type: "line" as ChartType,
          data: subscriptionConfirmedLeadsData,
          color: "#ef4444",
        },
        unsubscribedLeads: {
          name: "app.api.leads.admin.stats.metrics.unsubscribed_leads" as const,
          type: "line" as ChartType,
          data: unsubscribedLeadsData,
          color: "#6b7280",
        },
        bouncedLeads: {
          name: "app.api.leads.admin.stats.metrics.bounced_leads" as const,
          type: "line" as ChartType,
          data: bouncedLeadsData,
          color: "#dc2626",
        },
        invalidLeads: {
          name: "app.api.leads.admin.stats.metrics.invalid_leads" as const,
          type: "line" as ChartType,
          data: invalidLeadsData,
          color: "#9ca3af",
        },
        emailsSent: {
          name: "app.api.leads.admin.stats.metrics.emails_sent" as const,
          type: "line" as ChartType,
          data: emailsSentData,
          color: "#3b82f6",
        },
        emailsOpened: {
          name: "app.api.leads.admin.stats.metrics.emails_opened" as const,
          type: "line" as ChartType,
          data: emailsOpenedData,
          color: "#10b981",
        },
        emailsClicked: {
          name: "app.api.leads.admin.stats.metrics.emails_clicked" as const,
          type: "line" as ChartType,
          data: emailsClickedData,
          color: "#f59e0b",
        },
        openRate: {
          name: "app.api.leads.admin.stats.metrics.open_rate" as const,
          type: "line" as ChartType,
          data: openRateData,
          color: "#8b5cf6",
        },
        clickRate: {
          name: "app.api.leads.admin.stats.metrics.click_rate" as const,
          type: "line" as ChartType,
          data: clickRateData,
          color: "#06b6d4",
        },
        conversionRate: {
          name: "app.api.leads.admin.stats.metrics.conversion_rate" as const,
          type: "line" as ChartType,
          data: conversionRateData,
          color: "#84cc16",
        },
        signupRate: {
          name: "app.api.leads.admin.stats.metrics.signup_rate" as const,
          type: "line" as ChartType,
          data: signupRateData,
          color: "#f97316",
        },
        consultationBookingRate: {
          name: "app.api.leads.admin.stats.metrics.consultation_booking_rate" as const,
          type: "line" as ChartType,
          data: consultationBookingRateData,
          color: "#ef4444",
        },
        subscriptionConfirmationRate: {
          name: "app.api.leads.admin.stats.metrics.subscription_confirmation_rate" as const,
          type: "line" as ChartType,
          data: subscriptionConfirmationRateData,
          color: "#6b7280",
        },
        averageEmailEngagementScore: {
          name: "app.api.leads.admin.stats.metrics.average_email_engagement_score" as const,
          type: "line" as ChartType,
          data: await this.calculateEngagementScore(
            intervals,
            timePeriod,
            filters,
            logger,
          ),
          color: "#dc2626",
        },
        leadVelocity: {
          name: "app.api.leads.admin.stats.metrics.lead_velocity" as const,
          type: "line" as ChartType,
          data: await this.calculateLeadVelocity(
            intervals,
            timePeriod,
            filters,
            logger,
          ),
          color: "#3b82f6",
        },
        dataCompletenessRate: {
          name: "app.api.leads.admin.stats.metrics.data_completeness_rate" as const,
          type: "line" as ChartType,
          data: await this.calculateDataCompleteness(
            intervals,
            timePeriod,
            filters,
            logger,
          ),
          color: "#10b981",
        },
      };
    } catch (error) {
      logger.error("Error generating historical data", {
        error: parseError(error).message,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        timePeriod,
      });

      // Return empty historical data structure to prevent UI crashes
      const emptyData = {
        name: "app.api.leads.admin.stats.error" as const,
        type: "line" as ChartType,
        data: [],
        color: "#ef4444",
      };

      return {
        totalLeads: emptyData,
        newLeads: emptyData,
        activeLeads: emptyData,
        campaignRunningLeads: emptyData,
        websiteUserLeads: emptyData,
        newsletterSubscriberLeads: emptyData,
        convertedLeads: emptyData,
        signedUpLeads: emptyData,
        consultationBookedLeads: emptyData,
        subscriptionConfirmedLeads: emptyData,
        unsubscribedLeads: emptyData,
        bouncedLeads: emptyData,
        invalidLeads: emptyData,
        emailsSent: emptyData,
        emailsOpened: emptyData,
        emailsClicked: emptyData,
        openRate: emptyData,
        clickRate: emptyData,
        conversionRate: emptyData,
        signupRate: emptyData,
        consultationBookingRate: emptyData,
        subscriptionConfirmationRate: emptyData,
        averageEmailEngagementScore: emptyData,
        leadVelocity: emptyData,
        dataCompletenessRate: emptyData,
      };
    }
  }

  /**
   * Generate grouped statistics
   */
  private async generateGroupedStats(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]> {
    // Get grouped statistics from database
    const [
      byStatusData,
      bySourceData,
      byCountryData,
      byLanguageData,
      byCampaignStageData,
      byJourneyVariantData,
      byEngagementLevelData,
      byConversionFunnelData,
    ] = await Promise.all([
      this.getGroupedByStatus(whereConditions),
      this.getGroupedBySource(whereConditions),
      this.getGroupedByCountry(whereConditions),
      this.getGroupedByLanguage(whereConditions),
      this.getGroupedByCampaignStage(whereConditions),
      this.getGroupedByJourneyVariant(whereConditions),
      this.getGroupedByEngagementLevel(whereConditions),
      this.getGroupedByConversionFunnel(whereConditions),
    ]);

    return {
      byStatus: byStatusData,
      bySource: bySourceData,
      byCountry: byCountryData,
      byLanguage: byLanguageData,
      byCampaignStage: byCampaignStageData,
      byJourneyVariant: byJourneyVariantData,
      byEngagementLevel: byEngagementLevelData,
      byConversionFunnel: byConversionFunnelData,
    };
  }

  /**
   * Generate recent activity
   */
  private async generateRecentActivity(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["recentActivity"]> {
    // Get recent leads activity (last 10 activities)
    const recentLeads = await db
      .select({
        id: leads.id,
        email: leads.email,
        businessName: leads.businessName,
        timestamp: leads.updatedAt,
        status: leads.status,
        source: leads.source,
        country: leads.country,
        emailsSent: leads.emailsSent,
        emailsOpened: leads.emailsOpened,
        emailsClicked: leads.emailsClicked,
        createdAt: leads.createdAt,
        convertedAt: leads.convertedAt,
      })
      .from(leads)
      .where(whereConditions)
      .orderBy(desc(leads.updatedAt))
      .limit(10);

    return recentLeads.map((lead) => ({
      id: lead.id,
      leadEmail: lead.email || "",
      leadBusinessName: lead.businessName || "",
      timestamp: lead.timestamp.toISOString(),
      type: mapLeadStatusToActivityType(lead.status),
      details: {
        status: lead.status,
        source: lead.source || "unknown",
        country: lead.country || "unknown",
        emailsSent: lead.emailsSent || 0,
        emailsOpened: lead.emailsOpened || 0,
        emailsClicked: lead.emailsClicked || 0,
        daysSinceCreated: Math.floor(
          (lead.timestamp.getTime() - lead.createdAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        isConverted: lead.convertedAt !== null,
      },
    }));
  }

  /**
   * Generate top performing campaigns
   */
  private async generateTopPerformingCampaigns(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["topPerformingCampaigns"]> {
    // Get top performing campaigns based on conversion rates
    const campaignStats = await db
      .select({
        stage: leads.currentCampaignStage,
        totalLeads: count(),
        convertedLeads: sql<number>`COUNT(CASE WHEN ${leads.convertedAt} IS NOT NULL THEN 1 END)::int`,
        emailsSent: sql<number>`COALESCE(SUM(${leads.emailsSent}), 0)::int`,
        emailsOpened: sql<number>`COALESCE(SUM(${leads.emailsOpened}), 0)::int`,
        emailsClicked: sql<number>`COALESCE(SUM(${leads.emailsClicked}), 0)::int`,
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.currentCampaignStage)
      .orderBy(
        desc(sql`COUNT(CASE WHEN ${leads.convertedAt} IS NOT NULL THEN 1 END)`),
      )
      .limit(5);

    return campaignStats.map((campaign) => {
      const totalLeads = Number(campaign.totalLeads);
      const convertedLeads = Number(campaign.convertedLeads);
      const emailsSent = Number(campaign.emailsSent);
      const emailsOpened = Number(campaign.emailsOpened);
      const emailsClicked = Number(campaign.emailsClicked);

      return {
        campaignId: campaign.stage || DEFAULT_VALUES.UNKNOWN,
        campaignName: campaign.stage || DEFAULT_VALUES.UNKNOWN_CAMPAIGN,
        leadsGenerated: totalLeads,
        conversionRate: totalLeads > 0 ? convertedLeads / totalLeads : 0,
        openRate: emailsSent > 0 ? emailsOpened / emailsSent : 0,
        clickRate: emailsSent > 0 ? emailsClicked / emailsSent : 0,
      };
    });
  }

  /**
   * Generate top performing sources
   */
  private async generateTopPerformingSources(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["topPerformingSources"]> {
    // Get top performing sources based on conversion rates
    const sourceStats = await db
      .select({
        source: leads.source,
        totalLeads: count(),
        convertedLeads: sql<number>`COUNT(CASE WHEN ${leads.convertedAt} IS NOT NULL THEN 1 END)::int`,
        emailsSent: sql<number>`COALESCE(SUM(${leads.emailsSent}), 0)::int`,
        emailsOpened: sql<number>`COALESCE(SUM(${leads.emailsOpened}), 0)::int`,
        emailsClicked: sql<number>`COALESCE(SUM(${leads.emailsClicked}), 0)::int`,
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.source)
      .orderBy(
        desc(sql`COUNT(CASE WHEN ${leads.convertedAt} IS NOT NULL THEN 1 END)`),
      )
      .limit(5);

    return sourceStats.map((source) => {
      const totalLeads = Number(source.totalLeads);
      const convertedLeads = Number(source.convertedLeads);

      return {
        source:
          (source.source as (typeof LeadSource)[keyof typeof LeadSource]) ||
          ("website" as (typeof LeadSource)[keyof typeof LeadSource]),
        leadsGenerated: totalLeads,
        conversionRate: totalLeads > 0 ? convertedLeads / totalLeads : 0,
        qualityScore: totalLeads > 0 ? (convertedLeads / totalLeads) * 10 : 0, // Simple quality score based on conversion rate
      };
    });
  }

  /**
   * Generate date intervals for historical data with proper calendar alignment
   * Ensures intervals align to natural boundaries (start of hour, day, week, month, etc.)
   */
  private generateDateIntervals(
    dateFrom: Date,
    dateTo: Date,
    timePeriod: TimePeriod,
    logger: EndpointLogger,
  ): Array<{ start: Date; end: Date; label: string }> {
    try {
      const intervals: Array<{ start: Date; end: Date; label: string }> = [];

      // Align the start date to the appropriate boundary for the time period
      const alignedStart = this.alignDateToPeriodStart(dateFrom, timePeriod);
      const current = new Date(alignedStart);

      while (current < dateTo) {
        const intervalStart = new Date(current);
        let intervalEnd: Date;

        switch (timePeriod) {
          case TimePeriod.HOUR:
            intervalEnd = new Date(current);
            intervalEnd.setHours(intervalEnd.getHours() + 1, 0, 0, 0);
            break;
          case TimePeriod.DAY:
            intervalEnd = new Date(current);
            intervalEnd.setDate(intervalEnd.getDate() + 1);
            intervalEnd.setHours(0, 0, 0, 0);
            break;
          case TimePeriod.WEEK:
            intervalEnd = new Date(current);
            // Add 7 days to get to next week start
            intervalEnd.setDate(intervalEnd.getDate() + 7);
            break;
          case TimePeriod.MONTH:
            intervalEnd = new Date(current);
            intervalEnd.setMonth(intervalEnd.getMonth() + 1, 1);
            intervalEnd.setHours(0, 0, 0, 0);
            break;
          case TimePeriod.QUARTER:
            intervalEnd = new Date(current);
            intervalEnd.setMonth(intervalEnd.getMonth() + 3, 1);
            intervalEnd.setHours(0, 0, 0, 0);
            break;
          case TimePeriod.YEAR:
            intervalEnd = new Date(current);
            intervalEnd.setFullYear(intervalEnd.getFullYear() + 1, 0, 1);
            intervalEnd.setHours(0, 0, 0, 0);
            break;
          default:
            intervalEnd = new Date(current);
            intervalEnd.setDate(intervalEnd.getDate() + 1);
            intervalEnd.setHours(0, 0, 0, 0);
        }

        // Don't exceed the end date
        if (intervalEnd > dateTo) {
          intervalEnd = new Date(dateTo);
        }

        // Only add intervals that have some duration
        if (intervalStart < intervalEnd) {
          intervals.push({
            start: intervalStart,
            end: intervalEnd,
            label: intervalStart.toISOString(),
          });
        }

        // Move to the next interval
        current.setTime(intervalEnd.getTime());

        // Safety check to prevent infinite loops
        if (intervals.length > 10000) {
          logger.error("Too many intervals generated, breaking loop", {
            timePeriod,
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString(),
            intervalCount: intervals.length,
          });
          break;
        }
      }

      logger.debug("Generated date intervals", {
        timePeriod,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        intervalCount: intervals.length,
        firstInterval: intervals[0]?.label,
        lastInterval: intervals[intervals.length - 1]?.label,
      });

      return intervals;
    } catch (error) {
      logger.error("Error generating date intervals", {
        error: parseError(error).message,
        timePeriod,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      });

      // Return a single interval covering the entire range as fallback
      return [
        {
          start: dateFrom,
          end: dateTo,
          label: dateFrom.toISOString(),
        },
      ];
    }
  }

  /**
   * Align a date to the start of the specified time period
   */
  private alignDateToPeriodStart(date: Date, timePeriod: TimePeriod): Date {
    const aligned = new Date(date);

    switch (timePeriod) {
      case TimePeriod.HOUR:
        aligned.setMinutes(0, 0, 0);
        break;
      case TimePeriod.DAY:
        aligned.setHours(0, 0, 0, 0);
        break;
      case TimePeriod.WEEK: {
        // Align to Monday (start of week)
        const dayOfWeek = aligned.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
        aligned.setDate(aligned.getDate() - daysToMonday);
        aligned.setHours(0, 0, 0, 0);
        break;
      }
      case TimePeriod.MONTH:
        aligned.setDate(1);
        aligned.setHours(0, 0, 0, 0);
        break;
      case TimePeriod.QUARTER: {
        // Align to start of quarter (Jan, Apr, Jul, Oct)
        const quarterStartMonth = Math.floor(aligned.getMonth() / 3) * 3;
        aligned.setMonth(quarterStartMonth, 1);
        aligned.setHours(0, 0, 0, 0);
        break;
      }
      case TimePeriod.YEAR:
        aligned.setMonth(0, 1);
        aligned.setHours(0, 0, 0, 0);
        break;
      default:
        aligned.setHours(0, 0, 0, 0);
    }

    return aligned;
  }

  /**
   * Get historical metric data for specific intervals using efficient SQL
   */
  private async getHistoricalMetric(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereConditions: SQL | undefined,
    metricType: string,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<Array<{ date: string; value: number }>> {
    try {
      if (intervals.length === 0) {
        logger.debug("Empty intervals provided for historical metric", {
          metricType,
        });
        return [];
      }

      const dateFrom = intervals[0].start;
      const dateTo = intervals[intervals.length - 1].end;

      // Use explicit time period for date truncation
      const dateTrunc = this.getDateTruncString(timePeriod);

      logger.debug("Getting historical metric", {
        metricType,
        timePeriod,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        intervalCount: intervals.length,
      });

      // Build base conditions
      const baseConditions: SQL[] = [
        gte(leads.createdAt, dateFrom),
        lte(leads.createdAt, dateTo),
      ];

      if (whereConditions) {
        baseConditions.push(whereConditions);
      }

      let query: Promise<HistoricalMetricResult[]>;

      // Build efficient query based on metric type
      switch (metricType) {
        case METRIC_TYPES.TOTAL: {
          // For total leads, we need to calculate cumulative totals properly
          // Get all leads created up to each time period, not just in that period
          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...baseConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`)
            .orderBy(
              sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`,
            );
          break;
        }

        case METRIC_TYPES.NEW: {
          // For "new" leads, we count leads created in each time period (same as total for historical data)
          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...baseConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`)
            .orderBy(
              sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`,
            );
          break;
        }

        case METRIC_TYPES.ACTIVE: {
          // For active leads, use lastEngagementAt or updatedAt to better reflect activity
          const activeConditions: SQL[] = [
            notInArray(leads.status, [
              LeadStatus.UNSUBSCRIBED,
              LeadStatus.BOUNCED,
              LeadStatus.INVALID,
            ]),
          ];

          // Use the most recent engagement or update timestamp
          const timestampField = sql`COALESCE(${leads.lastEngagementAt}, ${leads.updatedAt})`;
          activeConditions.push(gte(timestampField, dateFrom));
          activeConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            activeConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...activeConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "campaign_running": {
          // For campaign running leads, use campaignStartedAt or updatedAt
          const campaignRunningConditions: SQL[] = [
            eq(leads.status, LeadStatus.CAMPAIGN_RUNNING),
          ];

          const timestampField = sql`COALESCE(${leads.campaignStartedAt}, ${leads.updatedAt})`;
          campaignRunningConditions.push(gte(timestampField, dateFrom));
          campaignRunningConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            campaignRunningConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...campaignRunningConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "converted": {
          // For converted leads, use the actual conversion timestamp for accurate historical representation
          // Remove the original date filter and apply it to the conversion timestamp instead
          const convertedConditions: SQL[] = [
            gte(leads.convertedAt, dateFrom),
            lte(leads.convertedAt, dateTo),
            isNotNull(leads.convertedAt),
          ];

          // Apply other filters but not the original date range filters
          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            convertedConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.convertedAt})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...convertedConditions))
            .groupBy(
              sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.convertedAt})`,
            )
            .orderBy(
              sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.convertedAt})`,
            );
          break;
        }

        case "signed_up": {
          // For signed up leads, use the actual signup timestamp when available
          const signedUpConditions: SQL[] = [
            eq(leads.status, LeadStatus.SIGNED_UP),
          ];

          // Use signedUpAt if available, otherwise fall back to createdAt for date filtering
          const timestampField = sql`COALESCE(${leads.signedUpAt}, ${leads.createdAt})`;
          signedUpConditions.push(gte(timestampField, dateFrom));
          signedUpConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            signedUpConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...signedUpConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "consultation_booked": {
          // For consultation booked leads, use the actual booking timestamp when available
          const consultationConditions: SQL[] = [
            eq(leads.status, LeadStatus.CONSULTATION_BOOKED),
          ];

          const timestampField = sql`COALESCE(${leads.consultationBookedAt}, ${leads.createdAt})`;
          consultationConditions.push(gte(timestampField, dateFrom));
          consultationConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            consultationConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...consultationConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "subscription_confirmed": {
          // For subscription confirmed leads, use the actual confirmation timestamp when available
          const subscriptionConditions: SQL[] = [
            eq(leads.status, LeadStatus.SUBSCRIPTION_CONFIRMED),
          ];

          const timestampField = sql`COALESCE(${leads.subscriptionConfirmedAt}, ${leads.createdAt})`;
          subscriptionConditions.push(gte(timestampField, dateFrom));
          subscriptionConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            subscriptionConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...subscriptionConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "unsubscribed": {
          // For unsubscribed leads, use the actual unsubscribe timestamp when available
          const unsubscribedConditions: SQL[] = [
            eq(leads.status, LeadStatus.UNSUBSCRIBED),
          ];

          const timestampField = sql`COALESCE(${leads.unsubscribedAt}, ${leads.createdAt})`;
          unsubscribedConditions.push(gte(timestampField, dateFrom));
          unsubscribedConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            unsubscribedConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...unsubscribedConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "bounced": {
          // For bounced leads, use the actual bounce timestamp when available
          const bouncedConditions: SQL[] = [
            eq(leads.status, LeadStatus.BOUNCED),
          ];

          const timestampField = sql`COALESCE(${leads.bouncedAt}, ${leads.createdAt})`;
          bouncedConditions.push(gte(timestampField, dateFrom));
          bouncedConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            bouncedConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...bouncedConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "invalid": {
          // For invalid leads, use the actual invalid timestamp when available
          const invalidConditions: SQL[] = [
            eq(leads.status, LeadStatus.INVALID),
          ];

          const timestampField = sql`COALESCE(${leads.invalidAt}, ${leads.createdAt})`;
          invalidConditions.push(gte(timestampField, dateFrom));
          invalidConditions.push(lte(timestampField, dateTo));

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            invalidConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COUNT(*)::int`,
            })
            .from(leads)
            .where(and(...invalidConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "emails_sent": {
          // For emails sent, use lastEmailSentAt when available, otherwise fall back to createdAt
          // This provides better historical accuracy for when emails were actually sent
          const emailsSentConditions: SQL[] = [];

          const timestampField = sql`COALESCE(${leads.lastEmailSentAt}, ${leads.createdAt})`;
          emailsSentConditions.push(gte(timestampField, dateFrom));
          emailsSentConditions.push(lte(timestampField, dateTo));
          emailsSentConditions.push(sql`${leads.emailsSent} > 0`); // Only include leads that have sent emails

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            emailsSentConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COALESCE(SUM(${leads.emailsSent}), 0)::int`,
            })
            .from(leads)
            .where(and(...emailsSentConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "emails_opened": {
          // For emails opened, use lastEngagementAt when available, otherwise fall back to createdAt
          // This provides better historical accuracy for when emails were actually opened
          const emailsOpenedConditions: SQL[] = [];

          const timestampField = sql`COALESCE(${leads.lastEngagementAt}, ${leads.createdAt})`;
          emailsOpenedConditions.push(gte(timestampField, dateFrom));
          emailsOpenedConditions.push(lte(timestampField, dateTo));
          emailsOpenedConditions.push(sql`${leads.emailsOpened} > 0`); // Only include leads that have opened emails

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            emailsOpenedConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COALESCE(SUM(${leads.emailsOpened}), 0)::int`,
            })
            .from(leads)
            .where(and(...emailsOpenedConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        case "emails_clicked": {
          // For emails clicked, use lastEngagementAt when available, otherwise fall back to createdAt
          // This provides better historical accuracy for when emails were actually clicked
          const emailsClickedConditions: SQL[] = [];

          const timestampField = sql`COALESCE(${leads.lastEngagementAt}, ${leads.createdAt})`;
          emailsClickedConditions.push(gte(timestampField, dateFrom));
          emailsClickedConditions.push(lte(timestampField, dateTo));
          emailsClickedConditions.push(sql`${leads.emailsClicked} > 0`); // Only include leads that have clicked emails

          const nonDateConditions = this.buildNonDateConditions(filters);
          if (nonDateConditions.length > 0) {
            emailsClickedConditions.push(...nonDateConditions);
          }

          query = db
            .select({
              date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
              value: sql<number>`COALESCE(SUM(${leads.emailsClicked}), 0)::int`,
            })
            .from(leads)
            .where(and(...emailsClickedConditions))
            .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
            .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);
          break;
        }

        default:
          return intervals.map((interval) => ({
            date: interval.label,
            value: 0,
          }));
      }

      // Execute the query
      const queryResults = await query;

      // Create a map of results for quick lookup
      const resultMap = new Map<string, number>();

      for (const result of queryResults) {
        const dateKey = new Date(result.date).toISOString();
        resultMap.set(dateKey, result.value);
      }

      // Fill in missing intervals with zero values
      const data = intervals.map((interval) => ({
        date: interval.label,
        value: resultMap.get(interval.label) || 0,
      }));

      return data;
    } catch (error) {
      logger.error("Error getting historical metric", {
        error: parseError(error).message,
        metricType,
        timePeriod,
        intervalCount: intervals.length,
      });

      // Return empty data for the intervals to prevent UI crashes
      return intervals.map((interval) => ({
        date: interval.label,
        value: 0,
      }));
    }
  }

  /**
   * Convert period-specific data to cumulative totals
   * This method takes period-specific counts and converts them to running totals
   */
  private convertToCumulativeData(
    data: Array<{ date: string; value: number }>,
  ): Array<{ date: string; value: number }> {
    let cumulativeTotal = 0;
    return data.map((item) => {
      cumulativeTotal += item.value;
      return {
        date: item.date,
        value: cumulativeTotal,
      };
    });
  }

  /**
   * Get cumulative total leads data using efficient SQL window functions
   * This provides true cumulative totals by counting all leads created up to each time period
   */
  private async getCumulativeTotalLeads(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereConditions: SQL | undefined,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<Array<{ date: string; value: number }>> {
    try {
      if (intervals.length === 0) {
        return [];
      }

      const dateTo = intervals[intervals.length - 1].end;
      const dateTrunc = this.getDateTruncString(timePeriod);

      // Build conditions excluding the date range filter for cumulative calculation
      const nonDateConditions: SQL[] = [];

      // Extract non-date conditions from whereConditions
      const extractedConditions = this.buildNonDateConditions(filters);
      if (extractedConditions.length > 0) {
        nonDateConditions.push(...extractedConditions);
      }

      // Get period-specific counts first, then calculate cumulative totals
      // This approach is more reliable than using window functions with GROUP BY
      const periodQuery = db
        .select({
          date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})::text`,
          value: sql<number>`COUNT(*)::int`,
        })
        .from(leads)
        .where(
          nonDateConditions.length > 0
            ? and(lte(leads.createdAt, dateTo), ...nonDateConditions)
            : lte(leads.createdAt, dateTo),
        )
        .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`)
        .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`);

      const queryResults = await periodQuery;

      // Create a map of period-specific results
      const resultMap = new Map<string, number>();
      for (const result of queryResults) {
        const dateKey = new Date(result.date).toISOString();
        resultMap.set(dateKey, result.value);
      }

      // Fill in missing intervals and calculate cumulative totals
      let cumulativeTotal = 0;
      return intervals.map((interval) => {
        const periodValue = resultMap.get(interval.label) || 0;
        cumulativeTotal += periodValue;
        return {
          date: interval.label,
          value: cumulativeTotal,
        };
      });
    } catch (error) {
      logger.error("Error getting cumulative total leads", {
        error: parseError(error).message,
        timePeriod,
        intervalCount: intervals.length,
      });

      // Fall back to the original method
      const periodData = await this.getHistoricalMetric(
        intervals,
        whereConditions,
        METRIC_TYPES.NEW,
        timePeriod,
        filters,
        logger,
      );
      return this.convertToCumulativeData(periodData);
    }
  }

  /**
   * Extract non-date conditions from whereConditions
   * This is needed when we use different timestamp fields for filtering
   * We need to rebuild the conditions without the date range filters
   */
  private buildNonDateConditions(filters: LeadsStatsRequestOutput): SQL[] {
    const conditions: SQL[] = [];

    // Add status filter if specified (single value, not array)
    if (filters.status && filters.status !== LeadStatusFilter.ALL) {
      const mappedStatus = mapStatusFilter(
        filters.status as (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter],
      );
      if (mappedStatus) {
        conditions.push(eq(leads.status, mappedStatus));
      }
    }

    // Add source filter if specified (single value, not array)
    if (filters.source && filters.source !== LeadSourceFilter.ALL) {
      const mappedSource = mapSourceFilter(
        filters.source as (typeof LeadSourceFilter)[keyof typeof LeadSourceFilter],
      );
      if (mappedSource) {
        conditions.push(eq(leads.source, mappedSource));
      }
    }

    // Add country filter if specified (single value, not array)
    if (filters.country && filters.country !== CountryFilter.ALL) {
      // Map country filter to actual country value
      const countryValue = filters.country as "DE" | "PL" | "GLOBAL";
      conditions.push(eq(leads.country, countryValue));
    }

    // Add business name filter if specified
    if (filters.hasBusinessName === true) {
      conditions.push(isNotNull(leads.businessName));
    } else if (filters.hasBusinessName === false) {
      conditions.push(sql`${leads.businessName} IS NULL`);
    }

    // Add contact name filter if specified
    if (filters.hasContactName === true) {
      conditions.push(isNotNull(leads.contactName));
    } else if (filters.hasContactName === false) {
      conditions.push(sql`${leads.contactName} IS NULL`);
    }

    // Add search filter if specified
    if (filters.search && typeof filters.search === "string") {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        sql`(
          ${leads.businessName} ILIKE ${searchPattern} OR
          ${leads.contactName} ILIKE ${searchPattern} OR
          ${leads.email} ILIKE ${searchPattern}
        )`,
      );
    }

    // Add engagement filters
    if (filters.hasEngagement === true) {
      conditions.push(
        sql`${leads.emailsOpened} > 0 OR ${leads.emailsClicked} > 0`,
      );
    } else if (filters.hasEngagement === false) {
      conditions.push(
        sql`${leads.emailsOpened} = 0 AND ${leads.emailsClicked} = 0`,
      );
    }

    // Add conversion filters
    if (filters.isConverted === true) {
      conditions.push(isNotNull(leads.convertedAt));
    } else if (filters.isConverted === false) {
      conditions.push(sql`${leads.convertedAt} IS NULL`);
    }

    return conditions;
  }

  /**
   * Get PostgreSQL date truncation string for time period
   */
  private getDateTruncString(timePeriod: TimePeriod): string {
    switch (timePeriod) {
      case TimePeriod.HOUR:
        return DATE_TRUNC.HOUR;
      case TimePeriod.DAY:
        return DATE_TRUNC.DAY;
      case TimePeriod.WEEK:
        return DATE_TRUNC.WEEK;
      case TimePeriod.MONTH:
        return DATE_TRUNC.MONTH;
      case TimePeriod.QUARTER:
        return DATE_TRUNC.QUARTER;
      case TimePeriod.YEAR:
        return DATE_TRUNC.YEAR;
      default:
        return DATE_TRUNC.DAY;
    }
  }

  /**
   * Calculate rate data from two metric arrays with proper handling of zero denominators
   * Ensures rates are calculated correctly for each individual TimePeriod bucket
   */
  private calculateRateData(
    numeratorData: Array<{ date: string; value: number }>,
    denominatorData: Array<{ date: string; value: number }>,
    logger: EndpointLogger,
  ): Array<{ date: string; value: number }> {
    try {
      // Validate input arrays
      if (!numeratorData || !denominatorData) {
        logger.error("Invalid input arrays for rate calculation", {
          numeratorData: !!numeratorData,
          denominatorData: !!denominatorData,
        });
        return [];
      }

      // Log warning if arrays don't match but continue processing
      if (numeratorData.length !== denominatorData.length) {
        logger.debug("Rate calculation array length mismatch", {
          numeratorLength: numeratorData.length,
          denominatorLength: denominatorData.length,
        });
      }

      // Create a map of denominator data for more efficient lookup
      const denominatorMap = new Map<string, number>();
      for (const item of denominatorData) {
        denominatorMap.set(item.date, item.value);
      }

      return numeratorData.map((item) => {
        const denominator = denominatorMap.get(item.date) || 0;
        const numerator = item.value || 0;

        // Validate numeric values
        if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
          logger.debug("Invalid numeric values in rate calculation", {
            date: item.date,
            numerator,
            denominator,
          });
          return {
            date: item.date,
            value: 0,
          };
        }

        // Handle zero denominator case and calculate rate
        const rate = denominator > 0 ? numerator / denominator : 0;

        // Ensure rate is within reasonable bounds (0-1 for most rates)
        const clampedRate = Math.max(0, Math.min(rate, 1));

        // Log warning if rate was clamped
        if (rate !== clampedRate) {
          logger.debug("Rate value clamped to valid range", {
            date: item.date,
            originalRate: rate,
            clampedRate,
            numerator,
            denominator,
          });
        }

        return {
          date: item.date,
          value: Math.round(clampedRate * 10000) / 10000, // Round to 4 decimal places for precision
        };
      });
    } catch (error) {
      logger.error("Error in rate calculation", {
        error: parseError(error).message,
        numeratorLength: numeratorData?.length || 0,
        denominatorLength: denominatorData?.length || 0,
      });

      // Return empty array with same length as numerator data
      return (numeratorData || []).map((item) => ({
        date: item.date,
        value: 0,
      }));
    }
  }

  /**
   * Get historical metric data for a specific status
   */
  private async getHistoricalMetricForStatus(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    whereConditions: SQL | undefined,
    status: (typeof LeadStatus)[keyof typeof LeadStatus],
    timePeriod: TimePeriod,
  ): Promise<Array<{ date: string; value: number }>> {
    if (intervals.length === 0) {
      return [];
    }

    const dateFrom = intervals[0].start;
    const dateTo = intervals[intervals.length - 1].end;
    const dateTrunc = this.getDateTruncString(timePeriod);

    const baseConditions: SQL[] = [
      gte(leads.createdAt, dateFrom),
      lte(leads.createdAt, dateTo),

      eq(leads.status, status),
    ];

    if (whereConditions) {
      baseConditions.push(whereConditions);
    }

    const query = db
      .select({
        date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})::text`,
        value: sql<number>`COUNT(*)::int`,
      })
      .from(leads)
      .where(and(...baseConditions))
      .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`)
      .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`);

    const queryResults = await query;

    // Create a map of results for quick lookup
    const resultMap = new Map<string, number>();
    for (const result of queryResults) {
      const dateKey = new Date(result.date).toISOString();
      resultMap.set(dateKey, result.value);
    }

    // Fill in missing intervals with zero values
    return intervals.map((interval) => ({
      date: interval.label,
      value: resultMap.get(interval.label) || 0,
    }));
  }

  /**
   * Get color for lead status
   */
  private getStatusColor(
    status: (typeof LeadStatus)[keyof typeof LeadStatus],
  ): string {
    switch (status) {
      case LeadStatus.NEW:
        return "#3b82f6";
      case LeadStatus.PENDING:
        return "#f59e0b";
      case LeadStatus.CAMPAIGN_RUNNING:
        return "#10b981";
      case LeadStatus.WEBSITE_USER:
        return "#8b5cf6";
      case LeadStatus.NEWSLETTER_SUBSCRIBER:
        return "#06b6d4";
      case LeadStatus.SIGNED_UP:
        return "#84cc16";
      case LeadStatus.CONSULTATION_BOOKED:
        return "#f97316";
      case LeadStatus.SUBSCRIPTION_CONFIRMED:
        return "#22c55e";
      case LeadStatus.UNSUBSCRIBED:
        return "#ef4444";
      case LeadStatus.BOUNCED:
        return "#dc2626";
      case LeadStatus.INVALID:
        return "#6b7280";
      default:
        return "#3b82f6";
    }
  }

  /**
   * Get grouped statistics by status
   */
  private async getGroupedByStatus(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byStatus"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    const statusGroups = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.status);

    // Map to schema-compliant format
    return statusGroups.map((group) => ({
      label: group.status,
      value: Number(group.count),
      percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
      color: this.getStatusColor(group.status),
    }));
  }

  /**
   * Get grouped statistics by source
   */
  private async getGroupedBySource(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["bySource"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    const sourceGroups = await db
      .select({
        source: leads.source,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.source);

    return sourceGroups
      .filter((group) => group.source !== null)
      .map((group) => ({
        label: group.source!,
        value: Number(group.count),
        percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
        color: "#10b981",
      }));
  }

  /**
   * Get grouped statistics by country
   */
  private async getGroupedByCountry(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byCountry"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    const countryGroups = await db
      .select({
        country: leads.country,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.country);

    return countryGroups
      .filter((group) => group.country !== null)
      .map((group) => ({
        label: group.country,
        value: Number(group.count),
        percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
        color: "#f59e0b",
      }));
  }

  /**
   * Get grouped statistics by language
   */
  private async getGroupedByLanguage(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byLanguage"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    const languageGroups = await db
      .select({
        language: leads.language,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.language);

    return languageGroups
      .filter((group) => group.language !== null)
      .map((group) => ({
        label: group.language,
        value: Number(group.count),
        percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
        color: "#8b5cf6",
      }));
  }

  /**
   * Get grouped statistics by campaign stage
   */
  private async getGroupedByCampaignStage(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byCampaignStage"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    const stageGroups = await db
      .select({
        stage: leads.currentCampaignStage,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.currentCampaignStage);

    return stageGroups
      .filter((group) => group.stage !== null)
      .map((group) => ({
        label: group.stage!,
        value: Number(group.count),
        percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
        color: "#06b6d4",
      }));
  }

  /**
   * Calculate average email engagement score over time using efficient SQL
   * Uses engagement timestamps for more accurate historical representation
   */
  private async calculateEngagementScore(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<Array<{ date: string; value: number }>> {
    try {
      if (intervals.length === 0) {
        return [];
      }

      const dateFrom = intervals[0].start;
      const dateTo = intervals[intervals.length - 1].end;
      const dateTrunc = this.getDateTruncString(timePeriod);

      // Use engagement timestamp for better historical accuracy
      const engagementConditions: SQL[] = [];

      const timestampField = sql`COALESCE(${leads.lastEngagementAt}, ${leads.lastEmailSentAt}, ${leads.createdAt})`;
      engagementConditions.push(gte(timestampField, dateFrom));
      engagementConditions.push(lte(timestampField, dateTo));
      engagementConditions.push(sql`${leads.emailsSent} > 0`); // Only include leads with email activity

      const nonDateConditions = this.buildNonDateConditions(filters);
      if (nonDateConditions.length > 0) {
        engagementConditions.push(...nonDateConditions);
      }

      const query = db
        .select({
          date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})::text`,
          totalEmails: sql<number>`COALESCE(SUM(${leads.emailsSent}), 0)::int`,
          totalOpened: sql<number>`COALESCE(SUM(${leads.emailsOpened}), 0)::int`,
          totalClicked: sql<number>`COALESCE(SUM(${leads.emailsClicked}), 0)::int`,
        })
        .from(leads)
        .where(and(...engagementConditions))
        .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`)
        .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${timestampField})`);

      const queryResults = await query;

      // Create a map of results for quick lookup
      const resultMap = new Map<string, number>();
      for (const result of queryResults) {
        const totalEmails = Number(result.totalEmails || 0);
        const totalOpened = Number(result.totalOpened || 0);
        const totalClicked = Number(result.totalClicked || 0);

        // Calculate engagement score: (opens + clicks * 2) / total emails (as decimal)
        // Clicks are weighted more heavily as they indicate higher engagement
        const engagementScore =
          totalEmails > 0 ? (totalOpened + totalClicked * 2) / totalEmails : 0;

        // Ensure score is within reasonable bounds
        const clampedScore = Math.max(0, Math.min(engagementScore, 3)); // Max score of 3 (all emails opened and clicked)

        const dateKey = new Date(result.date).toISOString();
        resultMap.set(dateKey, Math.round(clampedScore * 100) / 100);
      }

      // Fill in missing intervals with zero values
      return intervals.map((interval) => ({
        date: interval.label,
        value: resultMap.get(interval.label) || 0,
      }));
    } catch (error) {
      logger.error("Error calculating engagement score", {
        error: parseError(error).message,
        timePeriod,
        intervalCount: intervals.length,
      });

      // Return empty data for the intervals to prevent UI crashes
      return intervals.map((interval) => ({
        date: interval.label,
        value: 0,
      }));
    }
  }

  /**
   * Calculate lead velocity (leads moving through stages) over time using efficient SQL
   * Tracks leads progressing through advanced stages to measure conversion momentum
   */
  private async calculateLeadVelocity(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<Array<{ date: string; value: number }>> {
    try {
      if (intervals.length === 0) {
        return [];
      }

      const dateFrom = intervals[0].start;
      const dateTo = intervals[intervals.length - 1].end;
      const dateTrunc = this.getDateTruncString(timePeriod);

      // Use the most appropriate timestamp for each status
      // This provides better accuracy for when leads actually progressed
      const velocityConditions: SQL[] = [
        sql`(
          (${leads.status} = ${LeadStatus.CAMPAIGN_RUNNING} AND COALESCE(${leads.campaignStartedAt}, ${leads.updatedAt}) BETWEEN ${dateFrom} AND ${dateTo}) OR
          (${leads.status} = ${LeadStatus.SIGNED_UP} AND COALESCE(${leads.signedUpAt}, ${leads.updatedAt}) BETWEEN ${dateFrom} AND ${dateTo}) OR
          (${leads.status} = ${LeadStatus.CONSULTATION_BOOKED} AND COALESCE(${leads.consultationBookedAt}, ${leads.updatedAt}) BETWEEN ${dateFrom} AND ${dateTo}) OR
          (${leads.status} = ${LeadStatus.SUBSCRIPTION_CONFIRMED} AND COALESCE(${leads.subscriptionConfirmedAt}, ${leads.updatedAt}) BETWEEN ${dateFrom} AND ${dateTo})
        )`,
      ];

      const nonDateConditions = this.buildNonDateConditions(filters);
      if (nonDateConditions.length > 0) {
        velocityConditions.push(...nonDateConditions);
      }

      const query = db
        .select({
          date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)},
            CASE
              WHEN ${leads.status} = ${LeadStatus.SIGNED_UP} THEN COALESCE(${leads.signedUpAt}, ${leads.updatedAt})
              WHEN ${leads.status} = ${LeadStatus.CONSULTATION_BOOKED} THEN COALESCE(${leads.consultationBookedAt}, ${leads.updatedAt})
              WHEN ${leads.status} = ${LeadStatus.SUBSCRIPTION_CONFIRMED} THEN COALESCE(${leads.subscriptionConfirmedAt}, ${leads.updatedAt})
              ELSE ${leads.updatedAt}
            END
          )::text`,
          value: sql<number>`COUNT(*)::int`,
        })
        .from(leads)
        .where(and(...velocityConditions))
        .groupBy(
          sql`DATE_TRUNC(${sql.raw(dateTrunc)},
            CASE
              WHEN ${leads.status} = ${LeadStatus.SIGNED_UP} THEN COALESCE(${leads.signedUpAt}, ${leads.updatedAt})
              WHEN ${leads.status} = ${LeadStatus.CONSULTATION_BOOKED} THEN COALESCE(${leads.consultationBookedAt}, ${leads.updatedAt})
              WHEN ${leads.status} = ${LeadStatus.SUBSCRIPTION_CONFIRMED} THEN COALESCE(${leads.subscriptionConfirmedAt}, ${leads.updatedAt})
              ELSE ${leads.updatedAt}
            END
          )`,
          leads.status,
          leads.signedUpAt,
          leads.consultationBookedAt,
          leads.subscriptionConfirmedAt,
          leads.updatedAt,
        ).orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)},
          CASE
            WHEN ${leads.status} = ${LeadStatus.SIGNED_UP} THEN COALESCE(${leads.signedUpAt}, ${leads.updatedAt})
            WHEN ${leads.status} = ${LeadStatus.CONSULTATION_BOOKED} THEN COALESCE(${leads.consultationBookedAt}, ${leads.updatedAt})
            WHEN ${leads.status} = ${LeadStatus.SUBSCRIPTION_CONFIRMED} THEN COALESCE(${leads.subscriptionConfirmedAt}, ${leads.updatedAt})
            ELSE ${leads.updatedAt}
          END
        )`);

      const queryResults = await query;

      // Create a map of results for quick lookup
      const resultMap = new Map<string, number>();
      for (const result of queryResults) {
        const dateKey = new Date(result.date).toISOString();
        resultMap.set(dateKey, result.value);
      }

      // Fill in missing intervals with zero values
      return intervals.map((interval) => ({
        date: interval.label,
        value: resultMap.get(interval.label) || 0,
      }));
    } catch (error) {
      logger.error("Error calculating lead velocity", {
        error: parseError(error).message,
        timePeriod,
        intervalCount: intervals.length,
      });

      // Return empty data for the intervals to prevent UI crashes
      return intervals.map((interval) => ({
        date: interval.label,
        value: 0,
      }));
    }
  }

  /**
   * Calculate data completeness rate over time using efficient SQL
   * Measures how complete lead data is over time (email + at least one contact method)
   */
  private async calculateDataCompleteness(
    intervals: Array<{ start: Date; end: Date; label: string }>,
    timePeriod: TimePeriod,
    filters: LeadsStatsRequestOutput,
    logger: EndpointLogger,
  ): Promise<Array<{ date: string; value: number }>> {
    try {
      if (intervals.length === 0) {
        return [];
      }

      const dateFrom = intervals[0].start;
      const dateTo = intervals[intervals.length - 1].end;
      const dateTrunc = this.getDateTruncString(timePeriod);

      const baseConditions: SQL[] = [
        gte(leads.createdAt, dateFrom),
        lte(leads.createdAt, dateTo),
      ];

      // Add non-date conditions from filters
      const nonDateConditions = this.buildNonDateConditions(filters);
      if (nonDateConditions.length > 0) {
        baseConditions.push(...nonDateConditions);
      }

      const query = db
        .select({
          date: sql<string>`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})::text`,
          totalLeads: sql<number>`COUNT(*)::int`,
          completeLeads: sql<number>`COUNT(CASE
            WHEN ${leads.email} IS NOT NULL
            AND (${leads.contactName} IS NOT NULL OR ${leads.phone} IS NOT NULL OR ${leads.website} IS NOT NULL)
            THEN 1
            ELSE NULL
          END)::int`,
          // Additional completeness metrics for better insights
          withBusinessName: sql<number>`COUNT(CASE WHEN ${leads.businessName} IS NOT NULL THEN 1 ELSE NULL END)::int`,
          withContactName: sql<number>`COUNT(CASE WHEN ${leads.contactName} IS NOT NULL THEN 1 ELSE NULL END)::int`,
          withPhone: sql<number>`COUNT(CASE WHEN ${leads.phone} IS NOT NULL THEN 1 ELSE NULL END)::int`,
          withWebsite: sql<number>`COUNT(CASE WHEN ${leads.website} IS NOT NULL THEN 1 ELSE NULL END)::int`,
        })
        .from(leads)
        .where(and(...baseConditions))
        .groupBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`)
        .orderBy(sql`DATE_TRUNC(${sql.raw(dateTrunc)}, ${leads.createdAt})`);

      const queryResults = await query;

      // Create a map of results for quick lookup
      const resultMap = new Map<string, number>();
      for (const result of queryResults) {
        const totalLeads = Number(result.totalLeads || 0);
        const completeLeads = Number(result.completeLeads || 0);

        // Calculate completeness rate as decimal (0-1)
        const completenessRate =
          totalLeads > 0 ? completeLeads / totalLeads : 0;

        // Ensure rate is within valid bounds
        const clampedRate = Math.max(0, Math.min(completenessRate, 1));

        const dateKey = new Date(result.date).toISOString();
        resultMap.set(dateKey, Math.round(clampedRate * 100) / 100);
      }

      // Fill in missing intervals with zero values
      return intervals.map((interval) => ({
        date: interval.label,
        value: resultMap.get(interval.label) || 0,
      }));
    } catch (error) {
      logger.error("Error calculating data completeness", {
        error: parseError(error).message,
        timePeriod,
        intervalCount: intervals.length,
      });

      // Return empty data for the intervals to prevent UI crashes
      return intervals.map((interval) => ({
        date: interval.label,
        value: 0,
      }));
    }
  }

  /**
   * Get count of leads with a specific field populated
   */
  private async getLeadsWithField(
    whereConditions: SQL | undefined,
    fieldName: keyof typeof leads,
  ): Promise<number> {
    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, sql`${leads[fieldName]} IS NOT NULL`)
          : sql`${leads[fieldName]} IS NOT NULL`,
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Calculate overall data completeness rate
   */
  private async calculateDataCompletenessRate(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        totalLeads: count(),
        completeLeads: sql<number>`COUNT(CASE WHEN ${leads.contactName} IS NOT NULL AND ${leads.phone} IS NOT NULL AND ${leads.website} IS NOT NULL THEN 1 END)::int`,
      })
      .from(leads)
      .where(whereConditions);

    const data = result[0];
    const totalLeads = Number(data?.totalLeads || 0);
    const completeLeads = Number(data?.completeLeads || 0);

    return totalLeads > 0 ? completeLeads / totalLeads : 0;
  }

  /**
   * Get count of leads created in a specific period
   */
  private async getLeadsCreatedInPeriod(
    whereConditions: SQL | undefined,
    period: "today" | "week" | "month",
  ): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, gte(leads.createdAt, startDate))
          : gte(leads.createdAt, startDate),
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Get count of leads updated in a specific period
   */
  private async getLeadsUpdatedInPeriod(
    whereConditions: SQL | undefined,
    period: "today" | "week" | "month",
  ): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, gte(leads.updatedAt, startDate))
          : gte(leads.updatedAt, startDate),
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Calculate current lead velocity (leads moving through stages in the last week)
   */
  private async calculateCurrentLeadVelocity(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(
              whereConditions,
              gte(leads.updatedAt, oneWeekAgo),
              inArray(leads.status, [
                LeadStatus.CAMPAIGN_RUNNING,
                LeadStatus.SIGNED_UP,
                LeadStatus.CONSULTATION_BOOKED,
                LeadStatus.SUBSCRIPTION_CONFIRMED,
              ]),
            )
          : and(
              gte(leads.updatedAt, oneWeekAgo),
              inArray(leads.status, [
                LeadStatus.CAMPAIGN_RUNNING,
                LeadStatus.SIGNED_UP,
                LeadStatus.CONSULTATION_BOOKED,
                LeadStatus.SUBSCRIPTION_CONFIRMED,
              ]),
            ),
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Get count of leads in active campaigns
   */
  private async getLeadsInActiveCampaigns(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, sql`${leads.currentCampaignStage} IS NOT NULL`)
          : sql`${leads.currentCampaignStage} IS NOT NULL`,
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Get count of leads not in campaigns
   */
  private async getLeadsNotInCampaigns(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        count: count(),
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, sql`${leads.currentCampaignStage} IS NULL`)
          : sql`${leads.currentCampaignStage} IS NULL`,
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Get leads grouped by campaign stage for summary
   */
  private async getLeadsByCampaignStage(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    const result = await db
      .select({
        stage: leads.currentCampaignStage,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.currentCampaignStage);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      if (row.stage) {
        grouped[row.stage] = Number(row.count);
      }
    }
    return grouped;
  }

  /**
   * Get leads grouped by journey variant for summary
   */
  private async getLeadsByJourneyVariant(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    // Journey variants are stored in email campaigns, so we need to join
    const result = await db
      .select({
        variant: emailCampaigns.journeyVariant,
        count: count(),
      })
      .from(leads)
      .leftJoin(emailCampaigns, eq(emailCampaigns.leadId, leads.id))
      .where(whereConditions)
      .groupBy(emailCampaigns.journeyVariant);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      if (row.variant !== null) {
        grouped[row.variant] = Number(row.count);
      }
    }
    return grouped;
  }

  /**
   * Get leads grouped by country for summary
   */
  private async getLeadsByCountry(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    const result = await db
      .select({
        country: leads.country,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.country);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      grouped[row.country] = Number(row.count);
    }
    return grouped;
  }

  /**
   * Get leads grouped by language for summary
   */
  private async getLeadsByLanguage(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    const result = await db
      .select({
        language: leads.language,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.language);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      grouped[row.language] = Number(row.count);
    }
    return grouped;
  }

  /**
   * Get leads grouped by source for summary
   */
  private async getLeadsBySource(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    const result = await db
      .select({
        source: leads.source,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.source);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      if (row.source) {
        grouped[row.source] = Number(row.count);
      }
    }
    return grouped;
  }

  /**
   * Get leads grouped by status for summary
   */
  private async getLeadsByStatus(
    whereConditions: SQL | undefined,
  ): Promise<Record<string, number>> {
    const result = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.status);

    const grouped: Record<string, number> = {};
    for (const row of result) {
      grouped[row.status] = Number(row.count);
    }
    return grouped;
  }

  /**
   * Calculate average time to conversion in days
   */
  private async calculateAverageTimeToConversion(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        avgDays: sql<number>`AVG(EXTRACT(EPOCH FROM (${leads.convertedAt} - ${leads.createdAt})) / 86400)::float`,
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, isNotNull(leads.convertedAt))
          : isNotNull(leads.convertedAt),
      );

    return Number(result[0]?.avgDays || 0);
  }

  /**
   * Calculate average time to signup in days
   */
  private async calculateAverageTimeToSignup(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        avgDays: sql<number>`AVG(EXTRACT(EPOCH FROM (${leads.signedUpAt} - ${leads.createdAt})) / 86400)::float`,
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, isNotNull(leads.signedUpAt))
          : isNotNull(leads.signedUpAt),
      );

    return Number(result[0]?.avgDays || 0);
  }

  /**
   * Calculate average time to consultation in days
   */
  private async calculateAverageTimeToConsultation(
    whereConditions: SQL | undefined,
  ): Promise<number> {
    const result = await db
      .select({
        avgDays: sql<number>`AVG(EXTRACT(EPOCH FROM (${leads.consultationBookedAt} - ${leads.createdAt})) / 86400)::float`,
      })
      .from(leads)
      .where(
        whereConditions
          ? and(whereConditions, isNotNull(leads.consultationBookedAt))
          : isNotNull(leads.consultationBookedAt),
      );

    return Number(result[0]?.avgDays || 0);
  }

  /**
   * Get grouped statistics by journey variant
   */
  private async getGroupedByJourneyVariant(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byJourneyVariant"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Journey variants are stored in email campaigns
    const variantGroups = await db
      .select({
        variant: emailCampaigns.journeyVariant,
        count: count(),
      })
      .from(leads)
      .leftJoin(emailCampaigns, eq(emailCampaigns.leadId, leads.id))
      .where(whereConditions)
      .groupBy(emailCampaigns.journeyVariant);

    return variantGroups
      .filter((group) => group.variant !== null)
      .map((group) => ({
        label: group.variant!,
        value: Number(group.count),
        percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
        color: "#f59e0b",
      }));
  }

  /**
   * Get grouped statistics by engagement level
   */
  private async getGroupedByEngagementLevel(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byEngagementLevel"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Calculate engagement levels based on email interactions with proper enum values
    const engagementGroups = await db
      .select({
        level: sql<string>`
          CASE
            WHEN ${leads.emailsClicked} > 0 THEN 'high'
            WHEN ${leads.emailsOpened} > 0 THEN 'medium'
            WHEN ${leads.emailsSent} > 0 THEN 'low'
            ELSE 'none'
          END
        `,
        count: count(),
      })
      .from(leads)
      .where(whereConditions).groupBy(sql`
        CASE
          WHEN ${leads.emailsClicked} > 0 THEN 'high'
          WHEN ${leads.emailsOpened} > 0 THEN 'medium'
          WHEN ${leads.emailsSent} > 0 THEN 'low'
          ELSE 'none'
        END
      `);

    return engagementGroups.map((group) => ({
      label: group.level,
      value: Number(group.count),
      percentage: totalCount > 0 ? Number(group.count) / totalCount : 0,
      color: "#8b5cf6",
    }));
  }

  /**
   * Get grouped statistics by conversion funnel
   */
  private async getGroupedByConversionFunnel(
    whereConditions: SQL | undefined,
  ): Promise<LeadsStatsResponseOutput["groupedStats"]["byConversionFunnel"]> {
    // Get total count for percentage calculation
    const totalCountResult = await db
      .select({ count: count() })
      .from(leads)
      .where(whereConditions);

    const totalCount = Number(totalCountResult[0]?.count || 0);

    // Get counts for each individual status (not grouped)
    const statusGroups = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .where(whereConditions)
      .groupBy(leads.status);

    // Create a map for quick lookup
    const statusCounts = new Map<
      (typeof LeadStatus)[keyof typeof LeadStatus],
      number
    >();
    for (const group of statusGroups) {
      statusCounts.set(group.status, Number(group.count));
    }

    // Define all lead statuses as funnel stages for proper conversion tracking
    const allStatuses = Object.values(LeadStatus);

    return allStatuses
      .map((status) => {
        const count = statusCounts.get(status) || 0;
        return {
          label: status,
          value: count,
          percentage: totalCount > 0 ? count / totalCount : 0,
          color: this.getStatusColor(status),
        };
      })
      .filter((stage) => stage.value > 0); // Only return stages with actual data
  }

  /**
   * Create an empty historical data structure for error fallback
   */
  private createEmptyHistoricalDataStructure(): LeadsStatsResponseOutput["historicalData"] {
    const emptyData = {
      name: "app.api.leads.admin.stats.error" as const,
      type: "line" as ChartType,
      data: [],
      color: "#ef4444",
    };

    return {
      totalLeads: emptyData,
      newLeads: emptyData,
      activeLeads: emptyData,
      campaignRunningLeads: emptyData,
      websiteUserLeads: emptyData,
      newsletterSubscriberLeads: emptyData,
      convertedLeads: emptyData,
      signedUpLeads: emptyData,
      consultationBookedLeads: emptyData,
      subscriptionConfirmedLeads: emptyData,
      unsubscribedLeads: emptyData,
      bouncedLeads: emptyData,
      invalidLeads: emptyData,
      emailsSent: emptyData,
      emailsOpened: emptyData,
      emailsClicked: emptyData,
      openRate: emptyData,
      clickRate: emptyData,
      conversionRate: emptyData,
      signupRate: emptyData,
      consultationBookingRate: emptyData,
      subscriptionConfirmationRate: emptyData,
      averageEmailEngagementScore: emptyData,
      leadVelocity: emptyData,
      dataCompletenessRate: emptyData,
    };
  }
}

export const leadsStatsRepository: LeadsStatsRepository =
  new LeadsStatsRepositoryImpl();
