/**
 * Leads Stats API Definition
 * Comprehensive leads statistics with historical data for all metrics
 */

// dateSchema and undefinedSchema replaced with z.date() and z.never() respectively
import { z } from "zod";

import {
  EndpointErrorTypes,
  Methods,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  baseStatsFilterSchema,
  ChartType,
  DateRangePreset,
  historicalDataSeriesSchema,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import {
  Countries,
  CountryFilter,
  LanguageFilter,
  Languages,
} from "@/i18n/core/config";

import { UserRole } from "../../user/user-roles/enum";
import {
  ActivityType,
  EmailCampaignStage,
  EmailCampaignStageFilter,
  LeadSortField,
  LeadSource,
  LeadSourceFilter,
  LeadStatus,
  LeadStatusFilter,
  SortOrder,
} from "../enum";
import { EngagementLevel } from "../tracking/engagement/enum";

/**
 * Leads Stats Request Schema
 * Comprehensive filtering for historical leads statistics based on database schema
 */
const leadsStatsRequestSchema = baseStatsFilterSchema.extend({
  // Lead-specific filters
  status: z.string().default(LeadStatusFilter.ALL),
  source: z.string().default(LeadSourceFilter.ALL),
  country: z.string().default(CountryFilter.ALL),
  language: z.string().default(LanguageFilter.ALL),
  campaignStage: z
    .nativeEnum(EmailCampaignStageFilter)
    .default(EmailCampaignStageFilter.ALL),

  // Engagement filters
  hasEngagement: z.coerce.boolean().optional(),
  minEmailsOpened: z.coerce.number().optional(),
  minEmailsClicked: z.coerce.number().optional(),

  // Conversion filters
  isConverted: z.coerce.boolean().optional(),
  hasSignedUp: z.coerce.boolean().optional(),
  hasBookedConsultation: z.coerce.boolean().optional(),
  hasConfirmedSubscription: z.coerce.boolean().optional(),

  // Business filters
  hasBusinessName: z.coerce.boolean().optional(),
  hasContactName: z.coerce.boolean().optional(),
  hasPhone: z.coerce.boolean().optional(),
  hasWebsite: z.coerce.boolean().optional(),
  hasNotes: z.coerce.boolean().optional(),

  // Association filters
  hasUserId: z.coerce.boolean().optional(),
  emailVerified: z.coerce.boolean().optional(),

  // Journey and campaign filters
  journeyVariant: z.string().optional(),
  minEmailsSent: z.coerce.number().optional(),

  // Date range filters
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  updatedAfter: z.date().optional(),
  updatedBefore: z.date().optional(),

  // Search
  search: z.string().optional(),

  // Sorting
  sortBy: z.string().default(LeadSortField.CREATED_AT),
  sortOrder: z.string().default(SortOrder.DESC),
});

/**
 * Leads Stats Response Schema with Historical Data
 * Comprehensive response including all leads metrics with historical data
 */
const leadsStatsResponseSchema = z.object({
  // Current period lead metrics
  totalLeads: z.number(),
  newLeads: z.number(),
  activeLeads: z.number(),
  campaignRunningLeads: z.number(),
  websiteUserLeads: z.number(),
  newsletterSubscriberLeads: z.number(),
  convertedLeads: z.number(),
  signedUpLeads: z.number(),
  consultationBookedLeads: z.number(),
  subscriptionConfirmedLeads: z.number(),
  unsubscribedLeads: z.number(),
  bouncedLeads: z.number(),
  invalidLeads: z.number(),

  // Email campaign metrics
  totalEmailsSent: z.number(),
  totalEmailsOpened: z.number(),
  totalEmailsClicked: z.number(),
  averageEmailsPerLead: z.number(),
  averageOpenRate: z.number(),
  averageClickRate: z.number(),

  // Engagement metrics (email opens, clicks, or form submissions)
  leadsWithEmailEngagement: z.number(),
  leadsWithoutEmailEngagement: z.number(),
  averageEmailEngagementScore: z.number(),
  totalEmailEngagements: z.number(),

  // Conversion metrics
  conversionRate: z.number(),
  signupRate: z.number(),
  consultationBookingRate: z.number(),
  subscriptionConfirmationRate: z.number(),

  // Campaign stage distribution
  leadsByCampaignStage: z.record(z.string(), z.number()),
  leadsInActiveCampaigns: z.number(),
  leadsNotInCampaigns: z.number(),

  // Journey variant distribution (A/B testing)
  leadsByJourneyVariant: z.record(z.string(), z.number()),

  // Geographic and demographic distribution
  leadsByCountry: z.record(z.string(), z.number()),
  leadsByLanguage: z.record(z.string(), z.number()),
  leadsBySource: z.record(z.string(), z.number()),
  leadsByStatus: z.record(z.string(), z.number()),

  // Business information completeness
  leadsWithBusinessName: z.number(),
  leadsWithContactName: z.number(),
  leadsWithPhone: z.number(),
  leadsWithWebsite: z.number(),
  leadsWithNotes: z.number(),
  dataCompletenessRate: z.number(),

  // Time-based metrics
  leadsCreatedToday: z.number(),
  leadsCreatedThisWeek: z.number(),
  leadsCreatedThisMonth: z.number(),
  leadsUpdatedToday: z.number(),
  leadsUpdatedThisWeek: z.number(),
  leadsUpdatedThisMonth: z.number(),

  // Performance metrics
  averageTimeToConversion: z.number(), // in days
  averageTimeToSignup: z.number(), // in days
  averageTimeToConsultation: z.number(), // in days
  leadVelocity: z.number(), // leads per day

  // Historical data for every metric
  historicalData: z.object({
    totalLeads: historicalDataSeriesSchema,
    newLeads: historicalDataSeriesSchema,
    activeLeads: historicalDataSeriesSchema,
    campaignRunningLeads: historicalDataSeriesSchema,
    websiteUserLeads: historicalDataSeriesSchema,
    newsletterSubscriberLeads: historicalDataSeriesSchema,
    convertedLeads: historicalDataSeriesSchema,
    signedUpLeads: historicalDataSeriesSchema,
    consultationBookedLeads: historicalDataSeriesSchema,
    subscriptionConfirmedLeads: historicalDataSeriesSchema,
    unsubscribedLeads: historicalDataSeriesSchema,
    bouncedLeads: historicalDataSeriesSchema,
    invalidLeads: historicalDataSeriesSchema,
    emailsSent: historicalDataSeriesSchema,
    emailsOpened: historicalDataSeriesSchema,
    emailsClicked: historicalDataSeriesSchema,
    openRate: historicalDataSeriesSchema,
    clickRate: historicalDataSeriesSchema,
    conversionRate: historicalDataSeriesSchema,
    signupRate: historicalDataSeriesSchema,
    consultationBookingRate: historicalDataSeriesSchema,
    subscriptionConfirmationRate: historicalDataSeriesSchema,
    averageEmailEngagementScore: historicalDataSeriesSchema,
    leadVelocity: historicalDataSeriesSchema,
    dataCompletenessRate: historicalDataSeriesSchema,
  }),

  // Grouped statistics for all categorical fields
  groupedStats: z.object({
    byStatus: z.array(
      z.object({
        status: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    bySource: z.array(
      z.object({
        source: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byCountry: z.array(
      z.object({
        country: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byLanguage: z.array(
      z.object({
        language: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byCampaignStage: z.array(
      z.object({
        stage: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byJourneyVariant: z.array(
      z.object({
        variant: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byEngagementLevel: z.array(
      z.object({
        level: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
    byConversionFunnel: z.array(
      z.object({
        stage: z.string(),
        count: z.number(),
        percentage: z.number(),
        historicalData: historicalDataSeriesSchema,
      }),
    ),
  }),

  // Metadata
  generatedAt: z.date(),
  dataRange: z.object({
    from: z.date(),
    to: z.date(),
  }),

  // Recent activity
  recentActivity: z.array(
    z.object({
      type: z.string(),
      id: z.string(),
      leadEmail: z.string().nullable(),
      leadBusinessName: z.string().optional(),
      timestamp: z.date(),
      details: z.record(z.unknown()),
    }),
  ),

  // Top performers
  topPerformingCampaigns: z.array(
    z.object({
      campaignId: z.string(),
      campaignName: z.string(),
      leadsGenerated: z.number(),
      conversionRate: z.number(),
      openRate: z.number(),
      clickRate: z.number(),
    }),
  ),
  topPerformingSources: z.array(
    z.object({
      source: z.string(),
      leadsGenerated: z.number(),
      conversionRate: z.number(),
      qualityScore: z.number(),
    }),
  ),
});

/**
 * Get Leads Stats Endpoint (GET)
 * Retrieves comprehensive leads statistics as historical charts only
 */
const leadsStatsEndpoint = createEndpoint({
  title: "app.api.v1.core.leads.stats.title",
  description: "app.api.v1.core.leads.stats.description",
  category: "app.api.v1.core.leads.stats.category",
  tags: ["app.api.v1.core.leads.stats.tags.leads", "app.api.v1.core.leads.stats.tags.statistics", "app.api.v1.core.leads.stats.tags.analytics"],
  method: Methods.GET,
  requestSchema: leadsStatsRequestSchema,
  responseSchema: leadsStatsResponseSchema,
  requestUrlSchema: z.never(),
  apiQueryOptions: {
    queryKey: ["leads-stats"],
    staleTime: 30 * 1000, // 30 seconds
  },
  fieldDescriptions: {
    timePeriod: "Time period for data aggregation",
    dateRangePreset: "Preset date range for filtering",
    dateFrom: "Custom start date for filtering",
    dateTo: "Custom end date for filtering",
    chartType: "Type of chart visualization",
    includeComparison: "Include comparison with previous period",
    comparisonPeriod: "Period to compare against",
    status: "Filter by lead status",
    source: "Filter by lead source",
    country: "Filter by lead country",
    language: "Filter by lead language",
    campaignStage: "Filter by email campaign stage",
    hasEngagement: "Filter leads with/without engagement",
    minEmailsOpened: "Minimum emails opened filter",
    minEmailsClicked: "Minimum emails clicked filter",
    isConverted: "Filter converted/non-converted leads",
    hasSignedUp: "Filter leads who have signed up",
    hasBookedConsultation: "Filter leads who booked consultation",
    hasConfirmedSubscription: "Filter leads who confirmed subscription",
    hasBusinessName: "Filter leads with/without business name",
    hasContactName: "Filter leads with/without contact name",
    hasPhone: "Filter leads with/without phone",
    hasWebsite: "Filter leads with/without website",
    hasNotes: "Filter leads with/without notes",
    hasUserId: "Filter leads with/without associated user ID",
    emailVerified: "Filter by email verification status",
    journeyVariant: "Filter by email journey variant",
    minEmailsSent: "Minimum emails sent threshold",
    createdAfter: "Filter leads created after date",
    createdBefore: "Filter leads created before date",
    updatedAfter: "Filter leads updated after date",
    updatedBefore: "Filter leads updated before date",
    search: "Search in lead emails, business names, and contact names",
    sortBy: "Field to sort by",
    sortOrder: "Sort order (ascending or descending)",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.leads.stats.errors.unauthorized.title",
      description: "app.api.v1.core.leads.stats.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.stats.errors.server.title",
      description: "app.api.v1.core.leads.stats.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.stats.errors.unknown.title",
      description: "app.api.v1.core.leads.stats.errors.unknown.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.leads.stats.success.title",
    description: "app.api.v1.core.leads.stats.success.description",
  },
  path: ["v1", "leads", "stats"],
  examples: {
    urlPathVariables: undefined,
    responses: {
      default: {
        timePeriod: TimePeriod.DAY,
        dateRangePreset: DateRangePreset.LAST_30_DAYS,
        chartType: ChartType.LINE,
        includeComparison: false,
        status: LeadStatusFilter.ALL,
        source: LeadSourceFilter.ALL,
        country: CountryFilter.ALL,
        language: LanguageFilter.ALL,
        campaignStage: EmailCampaignStageFilter.ALL,
      },
      withFilters: {
        timePeriod: TimePeriod.WEEK,
        dateRangePreset: DateRangePreset.LAST_90_DAYS,
        chartType: ChartType.BAR,
        includeComparison: true,
        status: LeadStatusFilter.CAMPAIGN_RUNNING,
        source: LeadSourceFilter.WEBSITE,
        country: CountryFilter.DE,
        language: LanguageFilter.DE,
        campaignStage: EmailCampaignStageFilter.NURTURE,
        hasEngagement: true,
        minEmailsOpened: 2,
        isConverted: false,
        hasBusinessName: true,
        search: "tech",
        sortBy: LeadSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    },
    responses: {
      default: {
        // Current period metrics
        totalLeads: 2850,
        newLeads: 185,
        activeLeads: 2100,
        campaignRunningLeads: 850,
        websiteUserLeads: 650,
        newsletterSubscriberLeads: 520,
        convertedLeads: 125,
        signedUpLeads: 95,
        consultationBookedLeads: 65,
        subscriptionConfirmedLeads: 45,
        unsubscribedLeads: 85,
        bouncedLeads: 35,
        invalidLeads: 15,

        totalEmailsSent: 15750,
        totalEmailsOpened: 9450,
        totalEmailsClicked: 1890,
        averageEmailsPerLead: 5.5,
        averageOpenRate: 0.6,
        averageClickRate: 0.12,

        leadsWithEmailEngagement: 1950,
        leadsWithoutEmailEngagement: 900,
        averageEmailEngagementScore: 7.2,
        totalEmailEngagements: 12500,

        conversionRate: 0.044,
        signupRate: 0.033,
        consultationBookingRate: 0.023,
        subscriptionConfirmationRate: 0.016,

        leadsByCampaignStage: {
          [EmailCampaignStage.NOT_STARTED]: 450,
          [EmailCampaignStage.INITIAL]: 650,
          [EmailCampaignStage.FOLLOWUP_1]: 520,
          [EmailCampaignStage.FOLLOWUP_2]: 380,
          [EmailCampaignStage.FOLLOWUP_3]: 280,
          [EmailCampaignStage.NURTURE]: 420,
          [EmailCampaignStage.REACTIVATION]: 150,
        },
        leadsInActiveCampaigns: 2400,
        leadsNotInCampaigns: 450,

        leadsByJourneyVariant: {
          personal_approach: 950,
          results_focused: 980,
          personal_results: 920,
        },

        leadsByCountry: {
          [Countries.DE]: 1850,
          [Countries.PL]: 650,
          [Countries.GLOBAL]: 350,
        },
        leadsByLanguage: {
          [Languages.DE]: 1900,
          [Languages.EN]: 600,
          [Languages.PL]: 350,
        },
        leadsBySource: {
          [LeadSource.WEBSITE]: 1200,
          [LeadSource.SOCIAL_MEDIA]: 650,
          [LeadSource.EMAIL_CAMPAIGN]: 450,
          [LeadSource.REFERRAL]: 350,
          [LeadSource.CSV_IMPORT]: 150,
          [LeadSource.API]: 50,
        },
        leadsByStatus: {
          [LeadStatus.NEW]: 380,
          [LeadStatus.PENDING]: 300,
          [LeadStatus.CAMPAIGN_RUNNING]: 450,
          [LeadStatus.WEBSITE_USER]: 530,
          [LeadStatus.NEWSLETTER_SUBSCRIBER]: 320,
          [LeadStatus.SIGNED_UP]: 95,
          [LeadStatus.CONSULTATION_BOOKED]: 65,
          [LeadStatus.SUBSCRIPTION_CONFIRMED]: 45,
          [LeadStatus.UNSUBSCRIBED]: 85,
          [LeadStatus.BOUNCED]: 35,
          [LeadStatus.INVALID]: 15,
        },

        leadsWithBusinessName: 2750,
        leadsWithContactName: 2200,
        leadsWithPhone: 1850,
        leadsWithWebsite: 1650,
        leadsWithNotes: 950,
        dataCompletenessRate: 0.78,

        leadsCreatedToday: 12,
        leadsCreatedThisWeek: 85,
        leadsCreatedThisMonth: 350,
        leadsUpdatedToday: 45,
        leadsUpdatedThisWeek: 280,
        leadsUpdatedThisMonth: 950,

        averageTimeToConversion: 28.5,
        averageTimeToSignup: 21.3,
        averageTimeToConsultation: 35.7,
        leadVelocity: 11.7,

        // Historical data for every metric (last 30 days)
        historicalData: {
          totalLeads: {
            name: "leads.admin.stats.metrics.total_leads",
            data: [
              { date: "2025-01-01T00:00:00.000Z", value: 2650 },
              { date: "2025-01-02T00:00:00.000Z", value: 2665 },
              { date: "2025-01-03T00:00:00.000Z", value: 2680 },
              { date: "2025-01-04T00:00:00.000Z", value: 2695 },
              { date: "2025-01-05T00:00:00.000Z", value: 2710 },
              { date: "2025-01-06T00:00:00.000Z", value: 2730 },
              { date: "2025-01-07T00:00:00.000Z", value: 2850 },
            ],
          },
          newLeads: {
            name: "leads.admin.stats.metrics.new_leads",
            data: [
              { date: "2025-01-01T00:00:00.000Z", value: 15 },
              { date: "2025-01-02T00:00:00.000Z", value: 12 },
              { date: "2025-01-03T00:00:00.000Z", value: 18 },
              { date: "2025-01-04T00:00:00.000Z", value: 14 },
              { date: "2025-01-05T00:00:00.000Z", value: 16 },
              { date: "2025-01-06T00:00:00.000Z", value: 20 },
              { date: "2025-01-07T00:00:00.000Z", value: 22 },
            ],
          },
          activeLeads: {
            name: "leads.admin.stats.metrics.active_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 1950 },
              { date: "2024-01-02T00:00:00.000Z", value: 1965 },
              { date: "2024-01-03T00:00:00.000Z", value: 1980 },
              { date: "2024-01-04T00:00:00.000Z", value: 2000 },
              { date: "2024-01-05T00:00:00.000Z", value: 2025 },
              { date: "2024-01-06T00:00:00.000Z", value: 2050 },
              { date: "2024-01-07T00:00:00.000Z", value: 2100 },
            ],
          },
          campaignRunningLeads: {
            name: "leads.admin.stats.metrics.campaign_running_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 1150 },
              { date: "2024-01-02T00:00:00.000Z", value: 1165 },
              { date: "2024-01-03T00:00:00.000Z", value: 1180 },
              { date: "2024-01-04T00:00:00.000Z", value: 1200 },
              { date: "2024-01-05T00:00:00.000Z", value: 1215 },
              { date: "2024-01-06T00:00:00.000Z", value: 1230 },
              { date: "2024-01-07T00:00:00.000Z", value: 1250 },
            ],
          },
          websiteUserLeads: {
            name: "leads.admin.stats.metrics.website_user_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 480 },
              { date: "2024-01-02T00:00:00.000Z", value: 495 },
              { date: "2024-01-03T00:00:00.000Z", value: 510 },
              { date: "2024-01-04T00:00:00.000Z", value: 525 },
              { date: "2024-01-05T00:00:00.000Z", value: 540 },
              { date: "2024-01-06T00:00:00.000Z", value: 555 },
              { date: "2024-01-07T00:00:00.000Z", value: 570 },
            ],
          },
          newsletterSubscriberLeads: {
            name: "leads.admin.stats.metrics.newsletter_subscriber_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 290 },
              { date: "2024-01-02T00:00:00.000Z", value: 295 },
              { date: "2024-01-03T00:00:00.000Z", value: 300 },
              { date: "2024-01-04T00:00:00.000Z", value: 305 },
              { date: "2024-01-05T00:00:00.000Z", value: 310 },
              { date: "2024-01-06T00:00:00.000Z", value: 315 },
              { date: "2024-01-07T00:00:00.000Z", value: 320 },
            ],
          },
          convertedLeads: {
            name: "leads.admin.stats.metrics.converted_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 115 },
              { date: "2024-01-02T00:00:00.000Z", value: 117 },
              { date: "2024-01-03T00:00:00.000Z", value: 119 },
              { date: "2024-01-04T00:00:00.000Z", value: 121 },
              { date: "2024-01-05T00:00:00.000Z", value: 122 },
              { date: "2024-01-06T00:00:00.000Z", value: 124 },
              { date: "2024-01-07T00:00:00.000Z", value: 125 },
            ],
          },
          signedUpLeads: {
            name: "leads.admin.stats.metrics.signed_up_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 88 },
              { date: "2024-01-02T00:00:00.000Z", value: 90 },
              { date: "2024-01-03T00:00:00.000Z", value: 91 },
              { date: "2024-01-04T00:00:00.000Z", value: 92 },
              { date: "2024-01-05T00:00:00.000Z", value: 93 },
              { date: "2024-01-06T00:00:00.000Z", value: 94 },
              { date: "2024-01-07T00:00:00.000Z", value: 95 },
            ],
          },
          consultationBookedLeads: {
            name: "leads.admin.stats.metrics.consultation_booked_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 58 },
              { date: "2024-01-02T00:00:00.000Z", value: 60 },
              { date: "2024-01-03T00:00:00.000Z", value: 61 },
              { date: "2024-01-04T00:00:00.000Z", value: 62 },
              { date: "2024-01-05T00:00:00.000Z", value: 63 },
              { date: "2024-01-06T00:00:00.000Z", value: 64 },
              { date: "2024-01-07T00:00:00.000Z", value: 65 },
            ],
          },
          subscriptionConfirmedLeads: {
            name: "leads.admin.stats.metrics.subscription_confirmed_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 40 },
              { date: "2024-01-02T00:00:00.000Z", value: 41 },
              { date: "2024-01-03T00:00:00.000Z", value: 42 },
              { date: "2024-01-04T00:00:00.000Z", value: 43 },
              { date: "2024-01-05T00:00:00.000Z", value: 44 },
              { date: "2024-01-06T00:00:00.000Z", value: 44 },
              { date: "2024-01-07T00:00:00.000Z", value: 45 },
            ],
          },
          unsubscribedLeads: {
            name: "leads.admin.stats.metrics.unsubscribed_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 78 },
              { date: "2024-01-02T00:00:00.000Z", value: 79 },
              { date: "2024-01-03T00:00:00.000Z", value: 80 },
              { date: "2024-01-04T00:00:00.000Z", value: 82 },
              { date: "2024-01-05T00:00:00.000Z", value: 83 },
              { date: "2024-01-06T00:00:00.000Z", value: 84 },
              { date: "2024-01-07T00:00:00.000Z", value: 85 },
            ],
          },
          bouncedLeads: {
            name: "leads.admin.stats.metrics.bounced_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 32 },
              { date: "2024-01-02T00:00:00.000Z", value: 33 },
              { date: "2024-01-03T00:00:00.000Z", value: 33 },
              { date: "2024-01-04T00:00:00.000Z", value: 34 },
              { date: "2024-01-05T00:00:00.000Z", value: 34 },
              { date: "2024-01-06T00:00:00.000Z", value: 35 },
              { date: "2024-01-07T00:00:00.000Z", value: 35 },
            ],
          },
          invalidLeads: {
            name: "leads.admin.stats.metrics.invalid_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 12 },
              { date: "2024-01-02T00:00:00.000Z", value: 13 },
              { date: "2024-01-03T00:00:00.000Z", value: 13 },
              { date: "2024-01-04T00:00:00.000Z", value: 14 },
              { date: "2024-01-05T00:00:00.000Z", value: 14 },
              { date: "2024-01-06T00:00:00.000Z", value: 15 },
              { date: "2024-01-07T00:00:00.000Z", value: 15 },
            ],
          },
          emailsSent: {
            name: "leads.admin.stats.metrics.emails_sent",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 450 },
              { date: "2024-01-02T00:00:00.000Z", value: 520 },
              { date: "2024-01-03T00:00:00.000Z", value: 480 },
              { date: "2024-01-04T00:00:00.000Z", value: 550 },
              { date: "2024-01-05T00:00:00.000Z", value: 490 },
              { date: "2024-01-06T00:00:00.000Z", value: 580 },
              { date: "2024-01-07T00:00:00.000Z", value: 620 },
            ],
          },
          emailsOpened: {
            name: "leads.admin.stats.metrics.emails_opened",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 270 },
              { date: "2024-01-02T00:00:00.000Z", value: 312 },
              { date: "2024-01-03T00:00:00.000Z", value: 288 },
              { date: "2024-01-04T00:00:00.000Z", value: 330 },
              { date: "2024-01-05T00:00:00.000Z", value: 294 },
              { date: "2024-01-06T00:00:00.000Z", value: 348 },
              { date: "2024-01-07T00:00:00.000Z", value: 372 },
            ],
          },
          emailsClicked: {
            name: "leads.admin.stats.metrics.emails_clicked",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 54 },
              { date: "2024-01-02T00:00:00.000Z", value: 62 },
              { date: "2024-01-03T00:00:00.000Z", value: 58 },
              { date: "2024-01-04T00:00:00.000Z", value: 66 },
              { date: "2024-01-05T00:00:00.000Z", value: 59 },
              { date: "2024-01-06T00:00:00.000Z", value: 70 },
              { date: "2024-01-07T00:00:00.000Z", value: 74 },
            ],
          },
          openRate: {
            name: "leads.admin.stats.metrics.open_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.6 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.6 },
            ],
          },
          clickRate: {
            name: "leads.admin.stats.metrics.click_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.12 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.119 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.121 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.12 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.12 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.121 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.119 },
            ],
          },
          conversionRate: {
            name: "leads.admin.stats.metrics.conversion_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.043 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.044 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.044 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.045 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.045 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.045 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.044 },
            ],
          },
          signupRate: {
            name: "leads.admin.stats.metrics.signup_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.033 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.034 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.034 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.034 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.034 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.034 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.033 },
            ],
          },
          consultationBookingRate: {
            name: "leads.admin.stats.metrics.consultation_booking_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.022 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.023 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.023 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.023 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.023 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.023 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.023 },
            ],
          },
          subscriptionConfirmationRate: {
            name: "leads.admin.stats.metrics.subscription_confirmation_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.015 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.015 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.016 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.016 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.016 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.016 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.016 },
            ],
          },
          averageEmailEngagementScore: {
            name: "leads.admin.stats.metrics.average_email_engagement_score",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 6.8 },
              { date: "2024-01-02T00:00:00.000Z", value: 6.9 },
              { date: "2024-01-03T00:00:00.000Z", value: 7.0 },
              { date: "2024-01-04T00:00:00.000Z", value: 7.1 },
              { date: "2024-01-05T00:00:00.000Z", value: 7.1 },
              { date: "2024-01-06T00:00:00.000Z", value: 7.2 },
              { date: "2024-01-07T00:00:00.000Z", value: 7.2 },
            ],
          },
          leadVelocity: {
            name: "leads.admin.stats.metrics.lead_velocity",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 15.0 },
              { date: "2024-01-02T00:00:00.000Z", value: 12.0 },
              { date: "2024-01-03T00:00:00.000Z", value: 18.0 },
              { date: "2024-01-04T00:00:00.000Z", value: 14.0 },
              { date: "2024-01-05T00:00:00.000Z", value: 16.0 },
              { date: "2024-01-06T00:00:00.000Z", value: 20.0 },
              { date: "2024-01-07T00:00:00.000Z", value: 22.0 },
            ],
          },
          dataCompletenessRate: {
            name: "leads.admin.stats.metrics.data_completeness_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.76 },
              { date: "2024-01-02T00:00:00.000Z", value: 0.765 },
              { date: "2024-01-03T00:00:00.000Z", value: 0.77 },
              { date: "2024-01-04T00:00:00.000Z", value: 0.775 },
              { date: "2024-01-05T00:00:00.000Z", value: 0.775 },
              { date: "2024-01-06T00:00:00.000Z", value: 0.78 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.78 },
            ],
          },
        },

        // Grouped statistics for all categorical fields
        groupedStats: {
          byStatus: [
            {
              status: LeadStatus.CAMPAIGN_RUNNING,
              count: 850,
              percentage: 0.298,
              historicalData: {
                name: "leads.admin.stats.metrics.campaign_running_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
            {
              status: LeadStatus.WEBSITE_USER,
              count: 650,
              percentage: 0.228,
              historicalData: {
                name: "leads.admin.stats.metrics.website_user_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 600 },
                  { date: "2024-01-07T00:00:00.000Z", value: 650 },
                ],
              },
            },
            {
              status: LeadStatus.NEWSLETTER_SUBSCRIBER,
              count: 520,
              percentage: 0.182,
              historicalData: {
                name: "leads.admin.stats.metrics.newsletter_subscriber_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 480 },
                  { date: "2024-01-07T00:00:00.000Z", value: 520 },
                ],
              },
            },
          ],
          bySource: [
            {
              source: LeadSource.WEBSITE,
              count: 1200,
              percentage: 0.421,
              historicalData: {
                name: "leads.admin.stats.metrics.new_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 1100 },
                  { date: "2024-01-07T00:00:00.000Z", value: 1200 },
                ],
              },
            },
            {
              source: LeadSource.SOCIAL_MEDIA,
              count: 650,
              percentage: 0.228,
              historicalData: {
                name: "leads.admin.stats.metrics.social_media_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 580 },
                  { date: "2024-01-07T00:00:00.000Z", value: 650 },
                ],
              },
            },
          ],
          byCountry: [
            {
              country: Countries.DE,
              count: 1850,
              percentage: 0.649,
              historicalData: {
                name: "leads.admin.stats.metrics.german_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 1720 },
                  { date: "2024-01-07T00:00:00.000Z", value: 1850 },
                ],
              },
            },
            {
              country: Countries.PL,
              count: 650,
              percentage: 0.228,
              historicalData: {
                name: "leads.admin.stats.metrics.polish_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 600 },
                  { date: "2024-01-07T00:00:00.000Z", value: 650 },
                ],
              },
            },
          ],
          byLanguage: [
            {
              language: Languages.DE,
              count: 1900,
              percentage: 0.667,
              historicalData: {
                name: "leads.admin.stats.metrics.german_language_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 1750 },
                  { date: "2024-01-07T00:00:00.000Z", value: 1900 },
                ],
              },
            },
            {
              language: Languages.EN,
              count: 600,
              percentage: 0.211,
              historicalData: {
                name: "leads.admin.stats.metrics.english_language_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 550 },
                  { date: "2024-01-07T00:00:00.000Z", value: 600 },
                ],
              },
            },
          ],
          byCampaignStage: [
            {
              stage: EmailCampaignStage.INITIAL,
              count: 650,
              percentage: 0.228,
              historicalData: {
                name: "leads.admin.stats.metrics.initial_stage_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 600 },
                  { date: "2024-01-07T00:00:00.000Z", value: 650 },
                ],
              },
            },
            {
              stage: EmailCampaignStage.FOLLOWUP_1,
              count: 520,
              percentage: 0.182,
              historicalData: {
                name: "leads.admin.stats.metrics.followup_1_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 480 },
                  { date: "2024-01-07T00:00:00.000Z", value: 520 },
                ],
              },
            },
          ],
          byJourneyVariant: [
            {
              variant: "results_focused",
              count: 980,
              percentage: 0.344,
              historicalData: {
                name: "leads.admin.stats.metrics.results_focused_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 900 },
                  { date: "2024-01-07T00:00:00.000Z", value: 980 },
                ],
              },
            },
            {
              variant: "personal_approach",
              count: 950,
              percentage: 0.333,
              historicalData: {
                name: "leads.admin.stats.metrics.personal_approach_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 880 },
                  { date: "2024-01-07T00:00:00.000Z", value: 950 },
                ],
              },
            },
          ],
          byEngagementLevel: [
            {
              level: EngagementLevel.HIGH,
              count: 650,
              percentage: 0.228,
              historicalData: {
                name: "leads.admin.stats.metrics.high_engagement_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 580 },
                  { date: "2024-01-07T00:00:00.000Z", value: 650 },
                ],
              },
            },
            {
              level: EngagementLevel.MEDIUM,
              count: 850,
              percentage: 0.298,
              historicalData: {
                name: "leads.admin.stats.metrics.medium_engagement_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
            {
              level: EngagementLevel.LOW,
              count: 450,
              percentage: 0.158,
              historicalData: {
                name: "leads.admin.stats.metrics.low_engagement_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 420 },
                  { date: "2024-01-07T00:00:00.000Z", value: 450 },
                ],
              },
            },
            {
              level: EngagementLevel.NONE,
              count: 900,
              percentage: 0.316,
              historicalData: {
                name: "leads.admin.stats.metrics.no_engagement_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 870 },
                  { date: "2024-01-07T00:00:00.000Z", value: 900 },
                ],
              },
            },
          ],
          byConversionFunnel: [
            {
              stage: LeadStatus.NEW,
              count: 450,
              percentage: 0.158,
              historicalData: {
                name: "leads.admin.stats.metrics.new_status_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 420 },
                  { date: "2024-01-07T00:00:00.000Z", value: 450 },
                ],
              },
            },
            {
              stage: LeadStatus.CAMPAIGN_RUNNING,
              count: 1170,
              percentage: 0.411,
              historicalData: {
                name: "leads.admin.stats.metrics.engaged_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 1080 },
                  { date: "2024-01-07T00:00:00.000Z", value: 1170 },
                ],
              },
            },
            {
              stage: LeadStatus.WEBSITE_USER,
              count: 850,
              percentage: 0.298,
              historicalData: {
                name: "leads.admin.stats.metrics.qualified_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
            {
              stage: LeadStatus.SIGNED_UP,
              count: 125,
              percentage: 0.044,
              historicalData: {
                name: "leads.admin.stats.metrics.signed_up_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 115 },
                  { date: "2024-01-07T00:00:00.000Z", value: 125 },
                ],
              },
            },
          ],
        },

        // Metadata
        generatedAt: "2025-01-07T12:00:00.000Z",
        dataRange: {
          from: "2024-12-08T00:00:00.000Z",
          to: "2025-01-07T23:59:59.999Z",
        },

        // Recent activity
        recentActivity: [
          {
            type: ActivityType.LEAD_CREATED,
            id: "550e8400-e29b-41d4-a716-446655440001",
            leadEmail: "john.doe@techcorp.com",
            leadBusinessName: "TechCorp Solutions",
            timestamp: "2025-01-07T11:30:00.000Z",
            details: {
              source: LeadSource.WEBSITE,
              country: Countries.DE,
              language: Languages.DE,
              status: LeadStatus.NEW,
            },
          },
          {
            type: ActivityType.LEAD_CONVERTED,
            id: "550e8400-e29b-41d4-a716-446655440002",
            leadEmail: "jane.smith@startup.io",
            leadBusinessName: "Startup Innovation",
            timestamp: "2025-01-07T10:15:00.000Z",
            details: {
              previousStatus: LeadStatus.WEBSITE_USER,
              newStatus: LeadStatus.CAMPAIGN_RUNNING,
              campaignStage: EmailCampaignStage.FOLLOWUP_2,
              journeyVariant: "results_focused",
            },
          },
          {
            type: ActivityType.LEAD_CONVERTED,
            id: "550e8400-e29b-41d4-a716-446655440003",
            leadEmail: "mike.wilson@enterprise.com",
            leadBusinessName: "Enterprise Ltd",
            timestamp: "2025-01-07T09:45:00.000Z",
            details: {
              conversionType: "signup",
              timeToConversion: 25,
              totalEmailsReceived: 8,
              totalEngagements: 12,
            },
          },
        ],

        // Top performers
        topPerformingCampaigns: [
          {
            campaignId: "campaign-001",
            campaignName: "Tech Industry Outreach",
            leadsGenerated: 450,
            conversionRate: 0.067,
            openRate: 0.72,
            clickRate: 0.18,
          },
          {
            campaignId: "campaign-002",
            campaignName: "Startup Growth Series",
            leadsGenerated: 320,
            conversionRate: 0.056,
            openRate: 0.68,
            clickRate: 0.15,
          },
        ],
        topPerformingSources: [
          {
            source: LeadSource.WEBSITE,
            leadsGenerated: 1200,
            conversionRate: 0.052,
            qualityScore: 8.5,
          },
          {
            source: LeadSource.SOCIAL_MEDIA,
            leadsGenerated: 650,
            conversionRate: 0.038,
            qualityScore: 7.2,
          },
        ],
      },
      withFilters: {
        // Filtered response example with fewer results
        totalLeads: 850,
        newLeads: 45,
        activeLeads: 650,
        campaignRunningLeads: 850,
        websiteUserLeads: 320,
        newsletterSubscriberLeads: 280,
        convertedLeads: 57,
        signedUpLeads: 42,
        consultationBookedLeads: 28,
        subscriptionConfirmedLeads: 18,
        unsubscribedLeads: 12,
        bouncedLeads: 8,
        invalidLeads: 3,

        totalEmailsSent: 4680,
        totalEmailsOpened: 3370,
        totalEmailsClicked: 842,
        averageEmailsPerLead: 5.5,
        averageOpenRate: 0.72,
        averageClickRate: 0.18,

        leadsWithEmailEngagement: 750,
        leadsWithoutEmailEngagement: 100,
        averageEmailEngagementScore: 8.5,
        totalEmailEngagements: 4250,

        conversionRate: 0.067,
        signupRate: 0.049,
        consultationBookingRate: 0.033,
        subscriptionConfirmationRate: 0.021,

        leadsByCampaignStage: {
          [EmailCampaignStage.NURTURE]: 420,
          [EmailCampaignStage.FOLLOWUP_2]: 280,
          [EmailCampaignStage.FOLLOWUP_3]: 150,
        },
        leadsInActiveCampaigns: 850,
        leadsNotInCampaigns: 0,

        leadsByJourneyVariant: {
          results_focused: 850,
        },

        leadsByCountry: {
          [Countries.DE]: 850,
        },
        leadsByLanguage: {
          [Languages.DE]: 850,
        },
        leadsBySource: {
          [LeadSource.WEBSITE]: 850,
        },
        leadsByStatus: {
          [LeadStatus.CAMPAIGN_RUNNING]: 850,
        },

        leadsWithBusinessName: 850,
        leadsWithContactName: 820,
        leadsWithPhone: 780,
        leadsWithWebsite: 720,
        leadsWithNotes: 450,
        dataCompletenessRate: 0.92,

        leadsCreatedToday: 3,
        leadsCreatedThisWeek: 18,
        leadsCreatedThisMonth: 85,
        leadsUpdatedToday: 12,
        leadsUpdatedThisWeek: 65,
        leadsUpdatedThisMonth: 280,

        averageTimeToConversion: 22.3,
        averageTimeToSignup: 18.7,
        averageTimeToConsultation: 28.5,
        leadVelocity: 2.8,

        // Abbreviated historical data
        historicalData: {
          totalLeads: {
            name: "leads.admin.stats.metrics.total_leads",
            data: [
              { date: "2025-01-01T00:00:00.000Z", value: 780 },
              { date: "2025-01-07T00:00:00.000Z", value: 850 },
            ],
          },
          newLeads: {
            name: "leads.admin.stats.metrics.new_leads",
            data: [
              { date: "2025-01-01T00:00:00.000Z", value: 8 },
              { date: "2025-01-07T00:00:00.000Z", value: 10 },
            ],
          },
          activeLeads: {
            name: "leads.admin.stats.metrics.active_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 600 },
              { date: "2024-01-07T00:00:00.000Z", value: 650 },
            ],
          },
          campaignRunningLeads: {
            name: "leads.admin.stats.metrics.campaign_running_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 420 },
              { date: "2024-01-07T00:00:00.000Z", value: 450 },
            ],
          },
          websiteUserLeads: {
            name: "leads.admin.stats.metrics.website_user_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 480 },
              { date: "2024-01-07T00:00:00.000Z", value: 530 },
            ],
          },
          newsletterSubscriberLeads: {
            name: "leads.admin.stats.metrics.newsletter_subscriber_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 290 },
              { date: "2024-01-07T00:00:00.000Z", value: 320 },
            ],
          },
          convertedLeads: {
            name: "leads.admin.stats.metrics.converted_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 52 },
              { date: "2024-01-07T00:00:00.000Z", value: 57 },
            ],
          },
          signedUpLeads: {
            name: "leads.admin.stats.metrics.signed_up_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 38 },
              { date: "2024-01-07T00:00:00.000Z", value: 42 },
            ],
          },
          consultationBookedLeads: {
            name: "leads.admin.stats.metrics.consultation_booked_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 25 },
              { date: "2024-01-07T00:00:00.000Z", value: 28 },
            ],
          },
          subscriptionConfirmedLeads: {
            name: "leads.admin.stats.metrics.subscription_confirmed_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 16 },
              { date: "2024-01-07T00:00:00.000Z", value: 18 },
            ],
          },
          unsubscribedLeads: {
            name: "leads.admin.stats.metrics.unsubscribed_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 10 },
              { date: "2024-01-07T00:00:00.000Z", value: 12 },
            ],
          },
          bouncedLeads: {
            name: "leads.admin.stats.metrics.bounced_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 7 },
              { date: "2024-01-07T00:00:00.000Z", value: 8 },
            ],
          },
          invalidLeads: {
            name: "leads.admin.stats.metrics.invalid_leads",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 2 },
              { date: "2024-01-07T00:00:00.000Z", value: 3 },
            ],
          },
          emailsSent: {
            name: "leads.admin.stats.metrics.emails_sent",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 180 },
              { date: "2024-01-07T00:00:00.000Z", value: 220 },
            ],
          },
          emailsOpened: {
            name: "leads.admin.stats.metrics.emails_opened",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 130 },
              { date: "2024-01-07T00:00:00.000Z", value: 158 },
            ],
          },
          emailsClicked: {
            name: "leads.admin.stats.metrics.emails_clicked",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 32 },
              { date: "2024-01-07T00:00:00.000Z", value: 40 },
            ],
          },
          openRate: {
            name: "leads.admin.stats.metrics.open_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.72 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.72 },
            ],
          },
          clickRate: {
            name: "leads.admin.stats.metrics.click_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.178 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.182 },
            ],
          },
          conversionRate: {
            name: "leads.admin.stats.metrics.conversion_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.067 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.067 },
            ],
          },
          signupRate: {
            name: "leads.admin.stats.metrics.signup_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.049 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.049 },
            ],
          },
          consultationBookingRate: {
            name: "leads.admin.stats.metrics.consultation_booking_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.032 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.033 },
            ],
          },
          subscriptionConfirmationRate: {
            name: "leads.admin.stats.metrics.subscription_confirmation_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.021 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.021 },
            ],
          },
          averageEmailEngagementScore: {
            name: "leads.admin.stats.metrics.average_email_engagement_score",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 8.3 },
              { date: "2024-01-07T00:00:00.000Z", value: 8.5 },
            ],
          },
          leadVelocity: {
            name: "leads.admin.stats.metrics.lead_velocity",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 8.0 },
              { date: "2024-01-07T00:00:00.000Z", value: 10.0 },
            ],
          },
          dataCompletenessRate: {
            name: "leads.admin.stats.metrics.data_completeness_rate",
            data: [
              { date: "2024-01-01T00:00:00.000Z", value: 0.91 },
              { date: "2024-01-07T00:00:00.000Z", value: 0.92 },
            ],
          },
        },

        // Abbreviated grouped statistics
        groupedStats: {
          byStatus: [
            {
              status: LeadStatus.CAMPAIGN_RUNNING,
              count: 450,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.campaign_running_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 420 },
                  { date: "2024-01-07T00:00:00.000Z", value: 450 },
                ],
              },
            },
          ],
          bySource: [
            {
              source: LeadSource.WEBSITE,
              count: 850,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.website_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
          ],
          byCountry: [
            {
              country: Countries.DE,
              count: 850,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.german_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
          ],
          byLanguage: [
            {
              language: Languages.DE,
              count: 850,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.german_language_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
          ],
          byCampaignStage: [
            {
              stage: EmailCampaignStage.NURTURE,
              count: 420,
              percentage: 0.494,
              historicalData: {
                name: "leads.admin.stats.metrics.nurture_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 380 },
                  { date: "2024-01-07T00:00:00.000Z", value: 420 },
                ],
              },
            },
          ],
          byJourneyVariant: [
            {
              variant: "results_focused",
              count: 850,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.results_focused_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 780 },
                  { date: "2024-01-07T00:00:00.000Z", value: 850 },
                ],
              },
            },
          ],
          byEngagementLevel: [
            {
              level: EngagementLevel.HIGH,
              count: 750,
              percentage: 0.882,
              historicalData: {
                name: "leads.admin.stats.metrics.high_engagement_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 680 },
                  { date: "2024-01-07T00:00:00.000Z", value: 750 },
                ],
              },
            },
          ],
          byConversionFunnel: [
            {
              stage: LeadStatus.CAMPAIGN_RUNNING,
              count: 450,
              percentage: 1.0,
              historicalData: {
                name: "leads.admin.stats.metrics.campaign_running_leads",
                data: [
                  { date: "2024-01-01T00:00:00.000Z", value: 420 },
                  { date: "2024-01-07T00:00:00.000Z", value: 450 },
                ],
              },
            },
          ],
        },

        generatedAt: "2025-01-07T12:00:00.000Z",
        dataRange: {
          from: "2024-10-09T00:00:00.000Z",
          to: "2025-01-07T23:59:59.999Z",
        },

        recentActivity: [
          {
            type: ActivityType.LEAD_CONVERTED,
            id: "550e8400-e29b-41d4-a716-446655440004",
            leadEmail: "sarah.tech@innovation.de",
            leadBusinessName: "Innovation Tech GmbH",
            timestamp: "2025-01-07T14:20:00.000Z",
            details: {
              previousStatus: "engaged",
              newStatus: "qualified",
              campaignStage: "nurture",
              journeyVariant: "results_focused",
            },
          },
        ],

        topPerformingCampaigns: [
          {
            campaignId: "campaign-001",
            campaignName: "Tech Industry Outreach",
            leadsGenerated: 850,
            conversionRate: 0.067,
            openRate: 0.72,
            clickRate: 0.18,
          },
        ],
        topPerformingSources: [
          {
            source: LeadSource.WEBSITE,
            leadsGenerated: 850,
            conversionRate: 0.067,
            qualityScore: 9.2,
          },
        ],
      },
    },
  },
});

export type LeadsStatsRequestType = z.infer<
  typeof leadsStatsEndpoint.GET.requestSchema
>;
export type LeadsStatsResponseType = z.infer<
  typeof leadsStatsEndpoint.GET.responseSchema
>;

/**
 * Export definitions
 */
const definitions = {
  GET: leadsStatsEndpoint.GET,
};

export default definitions;
