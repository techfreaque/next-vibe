/**
 * Leads Stats API Definition
 * Comprehensive leads statistics with historical data for all metrics
 */

import {
  ChartType,
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { CountryFilter, LanguageFilter } from "@/i18n/core/config";

import { UserRole } from "../../user/user-roles/enum";
import {
  ActivityType,
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailJourneyVariant,
  LeadSortField,
  LeadSortFieldOptions,
  LeadSource,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadStatus,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

// ========== Zod Schemas for Complex Response Types ==========

// Chart data schema for historical data
const chartDataPointSchema = z.object({
  x: z.string(),
  y: z.coerce.number(),
  color: z.string().optional(), // Per-point color for pie charts
  percentage: z.coerce.number().optional(), // Percentage for pie chart tooltips
});

const chartDataSchema = z.object({
  name: z.string(),
  type: z.enum(ChartType),
  data: z.array(chartDataPointSchema),
  color: z.string(),
});

// Historical data schema
const historicalDataSchema = z.record(z.string(), chartDataSchema);

// Grouped stats item schema
const groupedStatsItemSchema = z.object({
  category: z.string(),
  value: z.coerce.number(),
  percentage: z.coerce.number().optional(),
});

// Grouped stats schema
const groupedStatsSchema = z.object({
  byStatus: z.array(groupedStatsItemSchema),
  bySource: z.array(groupedStatsItemSchema),
  byCountry: z.array(groupedStatsItemSchema),
  byLanguage: z.array(groupedStatsItemSchema),
  byCampaignStage: z.array(groupedStatsItemSchema),
  byJourneyVariant: z.array(groupedStatsItemSchema),
  byEngagementLevel: z.array(groupedStatsItemSchema),
  byConversionFunnel: z.array(groupedStatsItemSchema),
});

// Data range schema
const dataRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

// Create options arrays for enums that don't have them
const TimePeriodOptions = [
  {
    value: TimePeriod.HOUR,
    label: "app.api.leads.stats.timePeriod.hour" as const,
  },
  {
    value: TimePeriod.DAY,
    label: "app.api.leads.stats.timePeriod.day" as const,
  },
  {
    value: TimePeriod.WEEK,
    label: "app.api.leads.stats.timePeriod.week" as const,
  },
  {
    value: TimePeriod.MONTH,
    label: "app.api.leads.stats.timePeriod.month" as const,
  },
  {
    value: TimePeriod.QUARTER,
    label: "app.api.leads.stats.timePeriod.quarter" as const,
  },
  {
    value: TimePeriod.YEAR,
    label: "app.api.leads.stats.timePeriod.year" as const,
  },
];

const DateRangePresetOptions = [
  {
    value: DateRangePreset.TODAY,
    label: "app.api.leads.stats.dateRange.today" as const,
  },
  {
    value: DateRangePreset.YESTERDAY,
    label: "app.api.leads.stats.dateRange.yesterday" as const,
  },
  {
    value: DateRangePreset.LAST_7_DAYS,
    label: "app.api.leads.stats.dateRange.last7Days" as const,
  },
  {
    value: DateRangePreset.LAST_30_DAYS,
    label: "app.api.leads.stats.dateRange.last30Days" as const,
  },
  {
    value: DateRangePreset.LAST_90_DAYS,
    label: "app.api.leads.stats.dateRange.last90Days" as const,
  },
  {
    value: DateRangePreset.THIS_WEEK,
    label: "app.api.leads.stats.dateRange.thisWeek" as const,
  },
  {
    value: DateRangePreset.LAST_WEEK,
    label: "app.api.leads.stats.dateRange.lastWeek" as const,
  },
  {
    value: DateRangePreset.THIS_MONTH,
    label: "app.api.leads.stats.dateRange.thisMonth" as const,
  },
  {
    value: DateRangePreset.LAST_MONTH,
    label: "app.api.leads.stats.dateRange.lastMonth" as const,
  },
  {
    value: DateRangePreset.THIS_QUARTER,
    label: "app.api.leads.stats.dateRange.thisQuarter" as const,
  },
  {
    value: DateRangePreset.LAST_QUARTER,
    label: "app.api.leads.stats.dateRange.lastQuarter" as const,
  },
  {
    value: DateRangePreset.THIS_YEAR,
    label: "app.api.leads.stats.dateRange.thisYear" as const,
  },
  {
    value: DateRangePreset.LAST_YEAR,
    label: "app.api.leads.stats.dateRange.lastYear" as const,
  },
  {
    value: DateRangePreset.CUSTOM,
    label: "app.api.leads.stats.dateRange.custom" as const,
  },
];

const ChartTypeOptions = [
  {
    value: ChartType.LINE,
    label: "app.api.leads.stats.chartType.line" as const,
  },
  {
    value: ChartType.BAR,
    label: "app.api.leads.stats.chartType.bar" as const,
  },
  {
    value: ChartType.AREA,
    label: "app.api.leads.stats.chartType.area" as const,
  },
  {
    value: ChartType.PIE,
    label: "app.api.leads.stats.chartType.pie" as const,
  },
  {
    value: ChartType.DONUT,
    label: "app.api.leads.stats.chartType.donut" as const,
  },
];

const CountryFilterOptions = [
  {
    value: CountryFilter.ALL,
    label: "app.api.leads.stats.country.all" as const,
  },
  {
    value: CountryFilter.DE,
    label: "app.api.leads.stats.country.de" as const,
  },
  {
    value: CountryFilter.PL,
    label: "app.api.leads.stats.country.pl" as const,
  },
  {
    value: CountryFilter.GLOBAL,
    label: "app.api.leads.stats.country.global" as const,
  },
];

const LanguageFilterOptions = [
  {
    value: LanguageFilter.ALL,
    label: "app.api.leads.stats.language.all" as const,
  },
  {
    value: LanguageFilter.EN,
    label: "app.api.leads.stats.language.en" as const,
  },
  {
    value: LanguageFilter.DE,
    label: "app.api.leads.stats.language.de" as const,
  },
  {
    value: LanguageFilter.PL,
    label: "app.api.leads.stats.language.pl" as const,
  },
];

/**
 * Leads Stats Endpoint Definition
 * Using new field-based API
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["leads", "stats"],
  title: "app.api.leads.stats.title",
  description: "app.api.leads.stats.description",
  category: "app.api.leads.stats.category",
  tags: [
    "app.api.leads.stats.tags.leads",
    "app.api.leads.stats.tags.statistics",
    "app.api.leads.stats.tags.analytics",
  ],
  allowedRoles: [UserRole.ADMIN],
  icon: "bar-chart-3",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.stats.container.title",
      description: "app.api.leads.stats.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.timePeriod.label",
        description: "app.api.leads.stats.timePeriod.description",
        options: TimePeriodOptions,
        columns: 4,
        schema: z.enum(TimePeriod).default(TimePeriod.DAY),
      }),

      dateRangePreset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.dateRangePreset.label",
        description: "app.api.leads.stats.dateRangePreset.description",
        options: DateRangePresetOptions,
        columns: 4,
        schema: z.enum(DateRangePreset).default(DateRangePreset.LAST_30_DAYS),
      }),

      dateFrom: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.dateFrom.label",
        description: "app.api.leads.stats.dateFrom.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      dateTo: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.dateTo.label",
        description: "app.api.leads.stats.dateTo.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      chartType: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.chartType.label",
        description: "app.api.leads.stats.chartType.description",
        options: ChartTypeOptions,
        columns: 4,
        schema: z.enum(ChartType).default(ChartType.LINE),
      }),

      includeComparison: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.includeComparison.label",
        description: "app.api.leads.stats.includeComparison.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      comparisonPeriod: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.comparisonPeriod.label",
        description: "app.api.leads.stats.comparisonPeriod.description",
        options: DateRangePresetOptions,
        columns: 6,
        schema: z.enum(DateRangePreset).optional(),
      }),

      // Lead-specific filters
      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.status.label",
        description: "app.api.leads.stats.status.description",
        options: LeadStatusFilterOptions,
        columns: 4,
        schema: z.enum(LeadStatusFilter).default(LeadStatusFilter.ALL),
      }),

      source: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.source.label",
        description: "app.api.leads.stats.source.description",
        options: LeadSourceFilterOptions,
        columns: 4,
        schema: z.enum(LeadSourceFilter).default(LeadSourceFilter.ALL),
      }),

      country: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.country.label",
        description: "app.api.leads.stats.country.description",
        options: CountryFilterOptions,
        columns: 4,
        schema: z.enum(CountryFilter).default(CountryFilter.ALL),
      }),

      language: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.language.label",
        description: "app.api.leads.stats.language.description",
        options: LanguageFilterOptions,
        columns: 4,
        schema: z.enum(LanguageFilter).default(LanguageFilter.ALL),
      }),

      campaignStage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.campaignStage.label",
        description: "app.api.leads.stats.campaignStage.description",
        options: EmailCampaignStageFilterOptions,
        columns: 4,
        schema: z
          .enum(EmailCampaignStageFilter)
          .default(EmailCampaignStageFilter.ALL),
      }),

      // Engagement filters
      hasEngagement: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasEngagement.label",
        description: "app.api.leads.stats.hasEngagement.description",
        columns: 4,
        schema: z.coerce.boolean().optional(),
      }),

      minEmailsOpened: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.leads.stats.minEmailsOpened.label",
        description: "app.api.leads.stats.minEmailsOpened.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      minEmailsClicked: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.leads.stats.minEmailsClicked.label",
        description: "app.api.leads.stats.minEmailsClicked.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      // Conversion filters
      isConverted: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.isConverted.label",
        description: "app.api.leads.stats.isConverted.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasSignedUp: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasSignedUp.label",
        description: "app.api.leads.stats.hasSignedUp.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasBookedConsultation: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasBookedConsultation.label",
        description: "app.api.leads.stats.hasBookedConsultation.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasConfirmedSubscription: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasConfirmedSubscription.label",
        description: "app.api.leads.stats.hasConfirmedSubscription.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Business filters
      hasBusinessName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasBusinessName.label",
        description: "app.api.leads.stats.hasBusinessName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasContactName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasContactName.label",
        description: "app.api.leads.stats.hasContactName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasPhone: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasPhone.label",
        description: "app.api.leads.stats.hasPhone.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasWebsite: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasWebsite.label",
        description: "app.api.leads.stats.hasWebsite.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasNotes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasNotes.label",
        description: "app.api.leads.stats.hasNotes.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Association filters
      hasUserId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.hasUserId.label",
        description: "app.api.leads.stats.hasUserId.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      emailVerified: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.stats.emailVerified.label",
        description: "app.api.leads.stats.emailVerified.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      // Journey and campaign filters
      journeyVariant: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.leads.stats.journeyVariant.label",
        description: "app.api.leads.stats.journeyVariant.description",
        columns: 6,
        schema: z.enum(EmailJourneyVariant).optional(),
      }),

      minEmailsSent: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.leads.stats.minEmailsSent.label",
        description: "app.api.leads.stats.minEmailsSent.description",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      // Date range filters
      createdAfter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.createdAfter.label",
        description: "app.api.leads.stats.createdAfter.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      createdBefore: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.createdBefore.label",
        description: "app.api.leads.stats.createdBefore.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      updatedAfter: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.updatedAfter.label",
        description: "app.api.leads.stats.updatedAfter.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      updatedBefore: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.leads.stats.updatedBefore.label",
        description: "app.api.leads.stats.updatedBefore.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      // Search
      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.leads.stats.search.label",
        description: "app.api.leads.stats.search.description",
        placeholder: "app.api.leads.stats.search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // Sorting
      sortBy: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.sortBy.label",
        description: "app.api.leads.stats.sortBy.description",
        options: LeadSortFieldOptions,
        columns: 6,
        schema: z.enum(LeadSortField).default(LeadSortField.CREATED_AT),
      }),

      sortOrder: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.stats.sortOrder.label",
        description: "app.api.leads.stats.sortOrder.description",
        options: SortOrderOptions,
        columns: 6,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===
      // Note: For stats endpoints, we typically return a complex nested structure
      // For simplicity and to get this working, I'll add the key response fields
      // The repository will return the full structure as defined in the old schema

      totalLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.totalLeads",
        schema: z.coerce.number(),
      }),

      newLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.newLeads",
        schema: z.coerce.number(),
      }),

      activeLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.activeLeads",
        schema: z.coerce.number(),
      }),

      conversionRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.conversionRate",
        schema: z.coerce.number(),
      }),

      averageOpenRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageOpenRate",
        schema: z.coerce.number(),
      }),

      averageClickRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageClickRate",
        schema: z.coerce.number(),
      }),

      // Additional lead metrics
      campaignRunningLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.campaignRunningLeads",
        schema: z.coerce.number(),
      }),

      websiteUserLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.websiteUserLeads",
        schema: z.coerce.number(),
      }),

      newsletterSubscriberLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.newsletterSubscriberLeads",
        schema: z.coerce.number(),
      }),

      convertedLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.convertedLeads",
        schema: z.coerce.number(),
      }),

      signedUpLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.signedUpLeads",
        schema: z.coerce.number(),
      }),

      consultationBookedLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.consultationBookedLeads",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmedLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.subscriptionConfirmedLeads",
        schema: z.coerce.number(),
      }),

      unsubscribedLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.unsubscribedLeads",
        schema: z.coerce.number(),
      }),

      bouncedLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.bouncedLeads",
        schema: z.coerce.number(),
      }),

      invalidLeads: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.invalidLeads",
        schema: z.coerce.number(),
      }),

      // Email campaign metrics
      totalEmailsSent: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.totalEmailsSent",
        schema: z.coerce.number(),
      }),

      totalEmailsOpened: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.totalEmailsOpened",
        schema: z.coerce.number(),
      }),

      totalEmailsClicked: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.totalEmailsClicked",
        schema: z.coerce.number(),
      }),

      averageEmailsPerLead: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageEmailsPerLead",
        schema: z.coerce.number(),
      }),

      // Engagement metrics
      leadsWithEmailEngagement: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithEmailEngagement",
        schema: z.coerce.number(),
      }),

      leadsWithoutEmailEngagement: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithoutEmailEngagement",
        schema: z.coerce.number(),
      }),

      averageEmailEngagementScore: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageEmailEngagementScore",
        schema: z.coerce.number(),
      }),

      totalEmailEngagements: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.totalEmailEngagements",
        schema: z.coerce.number(),
      }),

      // Conversion metrics
      signupRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.signupRate",
        schema: z.coerce.number(),
      }),

      consultationBookingRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.consultationBookingRate",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmationRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.subscriptionConfirmationRate",
        schema: z.coerce.number(),
      }),

      // Data completeness
      dataCompletenessRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.dataCompletenessRate",
        schema: z.coerce.number(),
      }),

      // Performance metrics
      leadVelocity: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadVelocity",
        schema: z.coerce.number(),
      }),

      // Time-based metrics
      leadsCreatedToday: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsCreatedToday",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisWeek: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsCreatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisMonth: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsCreatedThisMonth",
        schema: z.coerce.number(),
      }),

      leadsUpdatedToday: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsUpdatedToday",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisWeek: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsUpdatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisMonth: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsUpdatedThisMonth",
        schema: z.coerce.number(),
      }),

      // Distribution metrics
      leadsByCampaignStage: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsByCampaignStage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsInActiveCampaigns: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsInActiveCampaigns",
        schema: z.coerce.number(),
      }),

      leadsNotInCampaigns: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsNotInCampaigns",
        schema: z.coerce.number(),
      }),

      leadsByJourneyVariant: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsByJourneyVariant",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByCountry: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsByCountry",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByLanguage: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsByLanguage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsBySource: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsBySource",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByStatus: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsByStatus",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      // Business information completeness
      leadsWithBusinessName: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithBusinessName",
        schema: z.coerce.number(),
      }),

      leadsWithContactName: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithContactName",
        schema: z.coerce.number(),
      }),

      leadsWithPhone: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithPhone",
        schema: z.coerce.number(),
      }),

      leadsWithWebsite: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithWebsite",
        schema: z.coerce.number(),
      }),

      leadsWithNotes: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.leadsWithNotes",
        schema: z.coerce.number(),
      }),

      // Historical data with proper Zod schema
      historicalData: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.historicalData",
        schema: historicalDataSchema,
      }),

      // Grouped stats with proper Zod schema
      groupedStats: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.groupedStats",
        schema: groupedStatsSchema,
      }),

      // Performance metrics - time-based
      averageTimeToConversion: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageTimeToConversion",
        schema: z.coerce.number(),
      }),

      averageTimeToSignup: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageTimeToSignup",
        schema: z.coerce.number(),
      }),

      averageTimeToConsultation: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.averageTimeToConsultation",
        schema: z.coerce.number(),
      }),

      // Top performers with proper Zod schemas
      topPerformingCampaigns: responseArrayField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.leads.stats.response.topPerformingCampaigns",
          description: "app.api.leads.stats.response.topPerformingCampaigns",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            campaignId: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.topPerformingCampaigns",
              schema: z.string(),
            }),
            campaignName: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.topPerformingCampaigns",
              schema: z.string(),
            }),
            leadsGenerated: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.topPerformingCampaigns",
              schema: z.coerce.number(),
            }),
            conversionRate: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.conversionRate",
              schema: z.coerce.number(),
            }),
            openRate: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.averageOpenRate",
              schema: z.coerce.number(),
            }),
            clickRate: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.averageClickRate",
              schema: z.coerce.number(),
            }),
          },
        ),
      ),

      topPerformingSources: responseArrayField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.leads.stats.response.topPerformingSources",
          description: "app.api.leads.stats.response.topPerformingSources",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            source: responseField({
              type: WidgetType.BADGE,
              text: "app.api.leads.stats.response.leadsBySource",
              schema: z.enum(LeadSource),
            }),
            leadsGenerated: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.topPerformingSources",
              schema: z.coerce.number(),
            }),
            conversionRate: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.conversionRate",
              schema: z.coerce.number(),
            }),
            qualityScore: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.topPerformingSources",
              schema: z.coerce.number(),
            }),
          },
        ),
      ),

      // Recent activity with proper Zod schema
      recentActivity: responseArrayField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.leads.stats.response.recentActivity",
          description: "app.api.leads.stats.response.recentActivity",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.recentActivity",
              schema: z.string(),
            }),
            leadEmail: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.recentActivity",
              schema: z.string(),
            }),
            leadBusinessName: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.recentActivity",
              schema: z.string(),
            }),
            timestamp: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.stats.response.generatedAt",
              schema: z.string(),
            }),
            type: responseField({
              type: WidgetType.BADGE,
              text: "app.api.leads.stats.response.recentActivity",
              schema: z.enum(ActivityType),
            }),
            details: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.stats.response.recentActivity",
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                status: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.leads.stats.response.leadsByStatus",
                  schema: z.enum(LeadStatus),
                }),
                source: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.leadsBySource",
                  schema: z.string(),
                }),
                country: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.leadsByCountry",
                  schema: z.string(),
                }),
                emailsSent: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.totalEmailsSent",
                  schema: z.coerce.number(),
                }),
                emailsOpened: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.totalEmailsOpened",
                  schema: z.coerce.number(),
                }),
                emailsClicked: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.totalEmailsClicked",
                  schema: z.coerce.number(),
                }),
                daysSinceCreated: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.recentActivity",
                  schema: z.coerce.number(),
                }),
                isConverted: responseField({
                  type: WidgetType.TEXT,
                  content: "app.api.leads.stats.response.convertedLeads",
                  schema: z.boolean(),
                }),
              },
            ),
          },
        ),
      ),

      // Metadata
      generatedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.generatedAt",
        schema: z.string(),
      }),

      dataRange: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.stats.response.dataRange",
        schema: dataRangeSchema,
      }),
    },
  ),

  examples: {
    requests: {
      default: {
        timePeriod: TimePeriod.DAY,
        dateRangePreset: DateRangePreset.LAST_30_DAYS,
        chartType: ChartType.LINE,
        includeComparison: false,
        status: LeadStatusFilter.ALL,
        campaignStage: EmailCampaignStageFilter.ALL,
        sortBy: LeadSortField.CREATED_AT,
        sortOrder: SortOrder.DESC,
      },
    },
    responses: {
      default: {
        totalLeads: 0,
        newLeads: 0,
        activeLeads: 0,
        conversionRate: 0,
        averageOpenRate: 0,
        averageClickRate: 0,
        campaignRunningLeads: 0,
        websiteUserLeads: 0,
        newsletterSubscriberLeads: 0,
        convertedLeads: 0,
        leadsByCampaignStage: {},
        leadsByJourneyVariant: {},
        leadsByCountry: {},
        leadsByLanguage: {},
        leadsBySource: {},
        leadsByStatus: {},
        signedUpLeads: 0,
        consultationBookedLeads: 0,
        subscriptionConfirmedLeads: 0,
        unsubscribedLeads: 0,
        bouncedLeads: 0,
        invalidLeads: 0,
        leadsWithEmailEngagement: 0,
        leadsWithoutEmailEngagement: 0,
        averageEmailEngagementScore: 0,
        totalEmailEngagements: 0,
        signupRate: 0,
        consultationBookingRate: 0,
        subscriptionConfirmationRate: 0,
        dataCompletenessRate: 0,
        leadsWithBusinessName: 0,
        leadsWithContactName: 0,
        leadsWithPhone: 0,
        leadsWithWebsite: 0,
        leadsWithNotes: 0,
        leadsInActiveCampaigns: 0,
        leadsNotInCampaigns: 0,
        averageTimeToConversion: 0,
        averageTimeToSignup: 0,
        averageTimeToConsultation: 0,
        totalEmailsSent: 0,
        totalEmailsOpened: 0,
        totalEmailsClicked: 0,
        averageEmailsPerLead: 0,
        leadVelocity: 0,
        leadsCreatedToday: 0,
        leadsCreatedThisWeek: 0,
        leadsCreatedThisMonth: 0,
        leadsUpdatedToday: 0,
        leadsUpdatedThisWeek: 0,
        leadsUpdatedThisMonth: 0,
        historicalData: {
          totalLeads: {
            name: "Total Leads",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          newLeads: {
            name: "New Leads",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          activeLeads: {
            name: "Active Leads",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          campaignRunningLeads: {
            name: "Campaign Running",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          websiteUserLeads: {
            name: "Website Users",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          newsletterSubscriberLeads: {
            name: "Newsletter Subscribers",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          convertedLeads: {
            name: "Converted",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          signedUpLeads: {
            name: "Signed Up",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          consultationBookedLeads: {
            name: "Consultation Booked",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          subscriptionConfirmedLeads: {
            name: "Subscription Confirmed",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          unsubscribedLeads: {
            name: "Unsubscribed",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          bouncedLeads: {
            name: "Bounced",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          invalidLeads: {
            name: "Invalid",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          emailsSent: {
            name: "Emails Sent",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          emailsOpened: {
            name: "Emails Opened",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          emailsClicked: {
            name: "Emails Clicked",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          openRate: {
            name: "Open Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          clickRate: {
            name: "Click Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          conversionRate: {
            name: "Conversion Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          signupRate: {
            name: "Signup Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          consultationBookingRate: {
            name: "Consultation Booking Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          subscriptionConfirmationRate: {
            name: "Subscription Confirmation Rate",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          averageEmailEngagementScore: {
            name: "Avg Email Engagement",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          leadVelocity: {
            name: "Lead Velocity",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
          dataCompletenessRate: {
            name: "Data Completeness",
            type: ChartType.LINE,
            data: [],
            color: "#000000",
          },
        },
        groupedStats: {
          byStatus: [],
          bySource: [],
          byCountry: [],
          byLanguage: [],
          byCampaignStage: [],
          byJourneyVariant: [],
          byEngagementLevel: [],
          byConversionFunnel: [],
        },
        recentActivity: [],
        topPerformingCampaigns: [],
        topPerformingSources: [],
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.stats.errors.unauthorized.title",
      description: "app.api.leads.stats.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.stats.errors.validation.title",
      description: "app.api.leads.stats.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.stats.errors.notFound.title",
      description: "app.api.leads.stats.errors.notFound.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.stats.errors.forbidden.title",
      description: "app.api.leads.stats.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.stats.errors.conflict.title",
      description: "app.api.leads.stats.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.stats.errors.unsavedChanges.title",
      description: "app.api.leads.stats.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.stats.errors.network.title",
      description: "app.api.leads.stats.errors.network.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.stats.errors.server.title",
      description: "app.api.leads.stats.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.stats.errors.unknown.title",
      description: "app.api.leads.stats.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.leads.stats.success.title",
    description: "app.api.leads.stats.success.description",
  },
});

export type LeadsStatsRequestInput = typeof GET.types.RequestInput;
export type LeadsStatsRequestOutput = typeof GET.types.RequestOutput;
export type LeadsStatsResponseInput = typeof GET.types.ResponseInput;
export type LeadsStatsResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export default definitions;
