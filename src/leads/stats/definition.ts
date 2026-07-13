/**
 * Leads Stats API Definition
 * Comprehensive leads statistics with historical data for all metrics
 */

import {
  ChartType,
  DateRangePreset,
  TimePeriod,
} from "next-vibe/core/core-utils/stats-filtering.schema";
import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { CountryFilter, LanguageFilter } from "next-vibe/core/i18n/core/config";
import {
  ActivityType,
  EmailCampaignStage,
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
} from "next-vibe/identity/lead/enum";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { LEADS_STATS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const LeadsStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LeadsStatsContainer })),
);

// ========== Zod Schemas for Complex Response Types ==========

// Chart data schema for historical data
const chartDataPointSchema = z.object({
  x: z.string(),
  y: z.coerce.number(),
  color: z.string().optional(), // Per-point color for pie charts
  percentage: z.coerce.number().optional(), // Percentage for pie chart tooltips
});

const chartDataSchema = z.object({
  name: scopedTranslation.translationKeySchema(),
  type: z.enum(ChartType),
  data: z.array(chartDataPointSchema),
  color: z.string(),
});

// Historical data schema
const historicalDataSchema = z.record(z.string(), chartDataSchema);

// Grouped stats item schema helpers
const groupedStatsItemBase = {
  value: z.coerce.number(),
  percentage: z.coerce.number().optional(),
};

// Grouped stats schema
const groupedStatsSchema = z.object({
  byStatus: z.array(
    z.object({ category: z.enum(LeadStatus), ...groupedStatsItemBase }),
  ),
  bySource: z.array(
    z.object({ category: z.enum(LeadSource), ...groupedStatsItemBase }),
  ),
  byCountry: z.array(
    z.object({ category: z.string(), ...groupedStatsItemBase }),
  ),
  byLanguage: z.array(
    z.object({ category: z.string(), ...groupedStatsItemBase }),
  ),
  byCampaignStage: z.array(
    z.object({ category: z.enum(EmailCampaignStage), ...groupedStatsItemBase }),
  ),
  byJourneyVariant: z.array(
    z.object({ category: z.string(), ...groupedStatsItemBase }),
  ),
  byEngagementLevel: z.array(
    z.object({ category: z.string(), ...groupedStatsItemBase }),
  ),
  byConversionFunnel: z.array(
    z.object({ category: z.string(), ...groupedStatsItemBase }),
  ),
});

// Data range schema
const dataRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

// Create options arrays for enums that don't have them
const TimePeriodOptions = [
  { value: TimePeriod.HOUR, label: "timePeriod.hour" as const },
  { value: TimePeriod.DAY, label: "timePeriod.day" as const },
  { value: TimePeriod.WEEK, label: "timePeriod.week" as const },
  { value: TimePeriod.MONTH, label: "timePeriod.month" as const },
  { value: TimePeriod.QUARTER, label: "timePeriod.quarter" as const },
  { value: TimePeriod.YEAR, label: "timePeriod.year" as const },
];

const DateRangePresetOptions = [
  { value: DateRangePreset.TODAY, label: "dateRange.today" as const },
  { value: DateRangePreset.YESTERDAY, label: "dateRange.yesterday" as const },
  { value: DateRangePreset.LAST_7_DAYS, label: "dateRange.last7Days" as const },
  {
    value: DateRangePreset.LAST_30_DAYS,
    label: "dateRange.last30Days" as const,
  },
  {
    value: DateRangePreset.LAST_90_DAYS,
    label: "dateRange.last90Days" as const,
  },
  { value: DateRangePreset.THIS_WEEK, label: "dateRange.thisWeek" as const },
  { value: DateRangePreset.LAST_WEEK, label: "dateRange.lastWeek" as const },
  { value: DateRangePreset.THIS_MONTH, label: "dateRange.thisMonth" as const },
  { value: DateRangePreset.LAST_MONTH, label: "dateRange.lastMonth" as const },
  {
    value: DateRangePreset.THIS_QUARTER,
    label: "dateRange.thisQuarter" as const,
  },
  {
    value: DateRangePreset.LAST_QUARTER,
    label: "dateRange.lastQuarter" as const,
  },
  { value: DateRangePreset.THIS_YEAR, label: "dateRange.thisYear" as const },
  { value: DateRangePreset.LAST_YEAR, label: "dateRange.lastYear" as const },
  { value: DateRangePreset.CUSTOM, label: "dateRange.custom" as const },
];

const ChartTypeOptions = [
  { value: ChartType.LINE, label: "chartType.line" as const },
  { value: ChartType.BAR, label: "chartType.bar" as const },
  { value: ChartType.AREA, label: "chartType.area" as const },
  { value: ChartType.PIE, label: "chartType.pie" as const },
  { value: ChartType.DONUT, label: "chartType.donut" as const },
];

const CountryFilterOptions = [
  { value: CountryFilter.ALL, label: "country.all" as const },
  { value: CountryFilter.DE, label: "country.de" as const },
  { value: CountryFilter.PL, label: "country.pl" as const },
  { value: CountryFilter.GLOBAL, label: "country.global" as const },
];

const LanguageFilterOptions = [
  { value: LanguageFilter.ALL, label: "language.all" as const },
  { value: LanguageFilter.EN, label: "language.en" as const },
  { value: LanguageFilter.DE, label: "language.de" as const },
  { value: LanguageFilter.PL, label: "language.pl" as const },
];

/**
 * Leads Stats Endpoint Definition
 * Using new field-based API
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "stats"],
  aliases: [LEADS_STATS_ALIAS],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "leads",
  subCategory: "Management",
  tags: ["tags.leads", "tags.statistics", "tags.analytics"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "bar-chart-3",

  fields: customWidgetObject({
    render: LeadsStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "timePeriod.label",
        description: "timePeriod.description",
        options: TimePeriodOptions,
        columns: 4,
        schema: z.enum(TimePeriod).default(TimePeriod.DAY),
      }),

      dateRangePreset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dateRangePreset.label",
        description: "dateRangePreset.description",
        options: DateRangePresetOptions,
        columns: 4,
        schema: z.enum(DateRangePreset).default(DateRangePreset.LAST_30_DAYS),
      }),

      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "dateFrom.label",
        description: "dateFrom.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "dateTo.label",
        description: "dateTo.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      chartType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "chartType.label",
        description: "chartType.description",
        options: ChartTypeOptions,
        columns: 4,
        schema: z.enum(ChartType).default(ChartType.LINE),
      }),

      includeComparison: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "includeComparison.label",
        description: "includeComparison.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      comparisonPeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "comparisonPeriod.label",
        description: "comparisonPeriod.description",
        options: DateRangePresetOptions,
        columns: 6,
        schema: z.enum(DateRangePreset).optional(),
      }),

      // Lead-specific filters
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "status.label",
        description: "status.description",
        options: LeadStatusFilterOptions,
        columns: 4,
        schema: z.enum(LeadStatusFilter).default(LeadStatusFilter.ALL),
      }),

      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "source.label",
        description: "source.description",
        options: LeadSourceFilterOptions,
        columns: 4,
        schema: z.enum(LeadSourceFilter).default(LeadSourceFilter.ALL),
      }),

      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "country.label",
        description: "country.description",
        options: CountryFilterOptions,
        columns: 4,
        schema: z.enum(CountryFilter).default(CountryFilter.ALL),
      }),

      language: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "language.label",
        description: "language.description",
        options: LanguageFilterOptions,
        columns: 4,
        schema: z.enum(LanguageFilter).default(LanguageFilter.ALL),
      }),

      campaignStage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "campaignStage.label",
        description: "campaignStage.description",
        options: EmailCampaignStageFilterOptions,
        columns: 4,
        schema: z
          .enum(EmailCampaignStageFilter)
          .default(EmailCampaignStageFilter.ALL),
      }),

      // Engagement filters
      hasEngagement: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasEngagement.label",
        description: "hasEngagement.description",
        columns: 4,
        schema: z.coerce.boolean().optional(),
      }),

      minEmailsOpened: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsOpened.label",
        description: "minEmailsOpened.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      minEmailsClicked: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsClicked.label",
        description: "minEmailsClicked.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      // Conversion filters
      isConverted: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "isConverted.label",
        description: "isConverted.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasSignedUp: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasSignedUp.label",
        description: "hasSignedUp.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasConfirmedSubscription: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasConfirmedSubscription.label",
        description: "hasConfirmedSubscription.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Business filters
      hasBusinessName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasBusinessName.label",
        description: "hasBusinessName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasContactName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasContactName.label",
        description: "hasContactName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasPhone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasPhone.label",
        description: "hasPhone.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasWebsite: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasWebsite.label",
        description: "hasWebsite.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasNotes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasNotes.label",
        description: "hasNotes.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Association filters
      hasUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasUserId.label",
        description: "hasUserId.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      emailVerified: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "emailVerified.label",
        description: "emailVerified.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      // Journey and campaign filters
      journeyVariant: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journeyVariant.label",
        description: "journeyVariant.description",
        columns: 6,
        schema: z.enum(EmailJourneyVariant).optional(),
      }),

      minEmailsSent: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsSent.label",
        description: "minEmailsSent.description",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      // Date range filters
      createdAfter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "createdAfter.label",
        description: "createdAfter.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      createdBefore: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "createdBefore.label",
        description: "createdBefore.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      updatedAfter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "updatedAfter.label",
        description: "updatedAfter.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      updatedBefore: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "updatedBefore.label",
        description: "updatedBefore.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      // Search
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.label",
        description: "search.description",
        placeholder: "search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // Sorting
      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortBy.label",
        description: "sortBy.description",
        options: LeadSortFieldOptions,
        columns: 6,
        schema: z.enum(LeadSortField).default(LeadSortField.CREATED_AT),
      }),

      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortOrder.label",
        description: "sortOrder.description",
        options: SortOrderOptions,
        columns: 6,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===
      totalLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totalLeads",
        schema: z.coerce.number(),
      }),

      newLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.newLeads",
        schema: z.coerce.number(),
      }),

      activeLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.activeLeads",
        schema: z.coerce.number(),
      }),

      conversionRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.conversionRate",
        schema: z.coerce.number(),
      }),

      averageOpenRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageOpenRate",
        schema: z.coerce.number(),
      }),

      averageClickRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageClickRate",
        schema: z.coerce.number(),
      }),

      // Additional lead metrics
      campaignRunningLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.campaignRunningLeads",
        schema: z.coerce.number(),
      }),

      websiteUserLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.websiteUserLeads",
        schema: z.coerce.number(),
      }),

      newsletterSubscriberLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.newsletterSubscriberLeads",
        schema: z.coerce.number(),
      }),

      convertedLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.convertedLeads",
        schema: z.coerce.number(),
      }),

      signedUpLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.signedUpLeads",
        schema: z.coerce.number(),
      }),

      consultationBookedLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.consultationBookedLeads",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmedLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.subscriptionConfirmedLeads",
        schema: z.coerce.number(),
      }),

      unsubscribedLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.unsubscribedLeads",
        schema: z.coerce.number(),
      }),

      bouncedLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.bouncedLeads",
        schema: z.coerce.number(),
      }),

      invalidLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.invalidLeads",
        schema: z.coerce.number(),
      }),

      // Email campaign metrics
      totalEmailsSent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totalEmailsSent",
        schema: z.coerce.number(),
      }),

      totalEmailsOpened: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totalEmailsOpened",
        schema: z.coerce.number(),
      }),

      totalEmailsClicked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totalEmailsClicked",
        schema: z.coerce.number(),
      }),

      averageEmailsPerLead: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageEmailsPerLead",
        schema: z.coerce.number(),
      }),

      // Engagement metrics
      leadsWithEmailEngagement: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithEmailEngagement",
        schema: z.coerce.number(),
      }),

      leadsWithoutEmailEngagement: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithoutEmailEngagement",
        schema: z.coerce.number(),
      }),

      averageEmailEngagementScore: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageEmailEngagementScore",
        schema: z.coerce.number(),
      }),

      totalEmailEngagements: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.totalEmailEngagements",
        schema: z.coerce.number(),
      }),

      // Conversion metrics
      signupRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.signupRate",
        schema: z.coerce.number(),
      }),

      consultationBookingRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.consultationBookingRate",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmationRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.subscriptionConfirmationRate",
        schema: z.coerce.number(),
      }),

      // Data completeness
      dataCompletenessRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.dataCompletenessRate",
        schema: z.coerce.number(),
      }),

      // Performance metrics
      leadVelocity: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadVelocity",
        schema: z.coerce.number(),
      }),

      // Time-based metrics
      leadsCreatedToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsCreatedToday",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisWeek: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsCreatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisMonth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsCreatedThisMonth",
        schema: z.coerce.number(),
      }),

      leadsUpdatedToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsUpdatedToday",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisWeek: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsUpdatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisMonth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsUpdatedThisMonth",
        schema: z.coerce.number(),
      }),

      // Distribution metrics
      leadsByCampaignStage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsByCampaignStage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsInActiveCampaigns: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsInActiveCampaigns",
        schema: z.coerce.number(),
      }),

      leadsNotInCampaigns: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsNotInCampaigns",
        schema: z.coerce.number(),
      }),

      leadsByJourneyVariant: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsByJourneyVariant",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByCountry: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsByCountry",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByLanguage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsByLanguage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsBySource: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsBySource",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsByStatus",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      // Business information completeness
      leadsWithBusinessName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithBusinessName",
        schema: z.coerce.number(),
      }),

      leadsWithContactName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithContactName",
        schema: z.coerce.number(),
      }),

      leadsWithPhone: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithPhone",
        schema: z.coerce.number(),
      }),

      leadsWithWebsite: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithWebsite",
        schema: z.coerce.number(),
      }),

      leadsWithNotes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.leadsWithNotes",
        schema: z.coerce.number(),
      }),

      // Historical data with proper Zod schema
      historicalData: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.historicalData",
        schema: historicalDataSchema,
      }),

      // Grouped stats with proper Zod schema
      groupedStats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.groupedStats",
        schema: groupedStatsSchema,
      }),

      // Performance metrics - time-based
      averageTimeToConversion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageTimeToConversion",
        schema: z.coerce.number(),
      }),

      averageTimeToSignup: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageTimeToSignup",
        schema: z.coerce.number(),
      }),

      averageTimeToConsultation: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.averageTimeToConsultation",
        schema: z.coerce.number(),
      }),

      // Top performers with proper Zod schemas
      topPerformingCampaigns: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.topPerformingCampaigns",
        description: "response.topPerformingCampaigns",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            campaignId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.topPerformingCampaigns",
              schema: z.string(),
            }),
            campaignName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.topPerformingCampaigns",
              schema: z.string(),
            }),
            leadsGenerated: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.topPerformingCampaigns",
              schema: z.coerce.number(),
            }),
            conversionRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.conversionRate",
              schema: z.coerce.number(),
            }),
            openRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.averageOpenRate",
              schema: z.coerce.number(),
            }),
            clickRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.averageClickRate",
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      topPerformingSources: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.topPerformingSources",
        description: "response.topPerformingSources",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            source: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.leadsBySource",
              schema: z.enum(LeadSource),
            }),
            leadsGenerated: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.topPerformingSources",
              schema: z.coerce.number(),
            }),
            conversionRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.conversionRate",
              schema: z.coerce.number(),
            }),
            qualityScore: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.topPerformingSources",
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      // Recent activity with proper Zod schema
      recentActivity: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.recentActivity",
        description: "response.recentActivity",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.recentActivity",
              schema: z.string(),
            }),
            leadEmail: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.recentActivity",
              schema: z.string(),
            }),
            leadBusinessName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.recentActivity",
              schema: z.string(),
            }),
            timestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "response.generatedAt",
              schema: dateSchema,
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.recentActivity",
              schema: z.enum(ActivityType),
            }),
            details: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.recentActivity",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.leadsByStatus",
                  schema: z.enum(LeadStatus),
                }),
                source: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.leadsBySource",
                  schema: z.string(),
                }),
                country: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.leadsByCountry",
                  schema: z.string(),
                }),
                emailsSent: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.totalEmailsSent",
                  schema: z.coerce.number(),
                }),
                emailsOpened: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.totalEmailsOpened",
                  schema: z.coerce.number(),
                }),
                emailsClicked: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.totalEmailsClicked",
                  schema: z.coerce.number(),
                }),
                daysSinceCreated: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.recentActivity",
                  schema: z.coerce.number(),
                }),
                isConverted: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "response.convertedLeads",
                  schema: z.boolean(),
                }),
              },
            }),
          },
        }),
      }),

      // Metadata
      generatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.generatedAt",
        schema: dateSchema,
      }),

      dataRange: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.dataRange",
        schema: dataRangeSchema,
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        timePeriod: TimePeriod.DAY,
        dateRangePreset: DateRangePreset.LAST_30_DAYS,
        chartType: ChartType.LINE,
        includeComparison: false,
        comparisonPeriod: DateRangePreset.LAST_30_DAYS,
        status: LeadStatusFilter.ALL,
        source: LeadSourceFilter.ALL,
        country: CountryFilter.ALL,
        language: LanguageFilter.ALL,
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
        generatedAt: "2024-01-15T10:00:00.000Z",
        dataRange: {
          from: "2024-01-15T10:00:00.000Z",
          to: "2024-01-15T10:00:00.000Z",
        },
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

export type LeadsStatsRequestInput = typeof GET.types.RequestInput;
export type LeadsStatsRequestOutput = typeof GET.types.RequestOutput;
export type LeadsStatsResponseInput = typeof GET.types.ResponseInput;
export type LeadsStatsResponseOutput = typeof GET.types.ResponseOutput;
export type LeadsTopPerformingSource =
  LeadsStatsResponseOutput["topPerformingSources"][number];
export type LeadsStatsHistoricalData =
  LeadsStatsResponseOutput["historicalData"];
export type LeadsStatsGroupedStats = LeadsStatsResponseOutput["groupedStats"];
export type LeadsStatsRecentActivity =
  LeadsStatsResponseOutput["recentActivity"];
export type LeadsStatsTopPerformingCampaigns =
  LeadsStatsResponseOutput["topPerformingCampaigns"];
export type LeadsStatsTopPerformingSources =
  LeadsStatsResponseOutput["topPerformingSources"];
export type LeadsStatsGroupedByStatus = LeadsStatsGroupedStats["byStatus"];
export type LeadsStatsGroupedBySource = LeadsStatsGroupedStats["bySource"];
export type LeadsStatsGroupedByCountry = LeadsStatsGroupedStats["byCountry"];
export type LeadsStatsGroupedByLanguage = LeadsStatsGroupedStats["byLanguage"];
export type LeadsStatsGroupedByCampaignStage =
  LeadsStatsGroupedStats["byCampaignStage"];
export type LeadsStatsGroupedByJourneyVariant =
  LeadsStatsGroupedStats["byJourneyVariant"];
export type LeadsStatsGroupedByEngagementLevel =
  LeadsStatsGroupedStats["byEngagementLevel"];
export type LeadsStatsGroupedByConversionFunnel =
  LeadsStatsGroupedStats["byConversionFunnel"];

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export default definitions;
