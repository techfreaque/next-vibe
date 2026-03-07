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

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
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
} from "../enum";
import { LEADS_STATS_ALIAS } from "./constants";
import { type LeadsStatsTranslationKey, scopedTranslation } from "./i18n";
import { LeadsStatsContainer } from "./widget";

// ========== Zod Schemas for Complex Response Types ==========

// Chart data schema for historical data
const chartDataPointSchema = z.object({
  x: z.string(),
  y: z.coerce.number(),
  color: z.string().optional(), // Per-point color for pie charts
  percentage: z.coerce.number().optional(), // Percentage for pie chart tooltips
});

const chartDataSchema = z.object({
  name: z.string() as z.ZodType<LeadsStatsTranslationKey>,
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
  {
    value: TimePeriod.HOUR,
    label: "timePeriod.hour",
  },
  {
    value: TimePeriod.DAY,
    label: "timePeriod.day",
  },
  {
    value: TimePeriod.WEEK,
    label: "timePeriod.week",
  },
  {
    value: TimePeriod.MONTH,
    label: "timePeriod.month",
  },
  {
    value: TimePeriod.QUARTER,
    label: "timePeriod.quarter",
  },
  {
    value: TimePeriod.YEAR,
    label: "timePeriod.year",
  },
];

const DateRangePresetOptions = [
  {
    value: DateRangePreset.TODAY,
    label: "dateRange.today",
  },
  {
    value: DateRangePreset.YESTERDAY,
    label: "dateRange.yesterday",
  },
  {
    value: DateRangePreset.LAST_7_DAYS,
    label: "dateRange.last7Days",
  },
  {
    value: DateRangePreset.LAST_30_DAYS,
    label: "dateRange.last30Days",
  },
  {
    value: DateRangePreset.LAST_90_DAYS,
    label: "dateRange.last90Days",
  },
  {
    value: DateRangePreset.THIS_WEEK,
    label: "dateRange.thisWeek",
  },
  {
    value: DateRangePreset.LAST_WEEK,
    label: "dateRange.lastWeek",
  },
  {
    value: DateRangePreset.THIS_MONTH,
    label: "dateRange.thisMonth",
  },
  {
    value: DateRangePreset.LAST_MONTH,
    label: "dateRange.lastMonth",
  },
  {
    value: DateRangePreset.THIS_QUARTER,
    label: "dateRange.thisQuarter",
  },
  {
    value: DateRangePreset.LAST_QUARTER,
    label: "dateRange.lastQuarter",
  },
  {
    value: DateRangePreset.THIS_YEAR,
    label: "dateRange.thisYear",
  },
  {
    value: DateRangePreset.LAST_YEAR,
    label: "dateRange.lastYear",
  },
  {
    value: DateRangePreset.CUSTOM,
    label: "dateRange.custom",
  },
];

const ChartTypeOptions = [
  {
    value: ChartType.LINE,
    label: "chartType.line",
  },
  {
    value: ChartType.BAR,
    label: "chartType.bar",
  },
  {
    value: ChartType.AREA,
    label: "chartType.area",
  },
  {
    value: ChartType.PIE,
    label: "chartType.pie",
  },
  {
    value: ChartType.DONUT,
    label: "chartType.donut",
  },
];

const CountryFilterOptions = [
  {
    value: CountryFilter.ALL,
    label: "country.all",
  },
  {
    value: CountryFilter.DE,
    label: "country.de",
  },
  {
    value: CountryFilter.PL,
    label: "country.pl",
  },
  {
    value: CountryFilter.GLOBAL,
    label: "country.global",
  },
];

const LanguageFilterOptions = [
  {
    value: LanguageFilter.ALL,
    label: "language.all",
  },
  {
    value: LanguageFilter.EN,
    label: "language.en",
  },
  {
    value: LanguageFilter.DE,
    label: "language.de",
  },
  {
    value: LanguageFilter.PL,
    label: "language.pl",
  },
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
  description: "description",
  category: "app.endpointCategories.leads",
  tags: ["tags.leads", "tags.statistics", "tags.analytics"],
  allowedRoles: [UserRole.ADMIN],
  icon: "bar-chart-3",

  fields: customWidgetObject({
    render: LeadsStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "timePeriod.label",
        description: "timePeriod.description",
        options: TimePeriodOptions,
        columns: 4,
        schema: z.enum(TimePeriod).default(TimePeriod.DAY),
      }),

      dateRangePreset: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "dateRangePreset.label",
        description: "dateRangePreset.description",
        options: DateRangePresetOptions,
        columns: 4,
        schema: z.enum(DateRangePreset).default(DateRangePreset.LAST_30_DAYS),
      }),

      dateFrom: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "dateFrom.label",
        description: "dateFrom.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      dateTo: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "dateTo.label",
        description: "dateTo.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      chartType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "chartType.label",
        description: "chartType.description",
        options: ChartTypeOptions,
        columns: 4,
        schema: z.enum(ChartType).default(ChartType.LINE),
      }),

      includeComparison: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "includeComparison.label",
        description: "includeComparison.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      comparisonPeriod: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "comparisonPeriod.label",
        description: "comparisonPeriod.description",
        options: DateRangePresetOptions,
        columns: 6,
        schema: z.enum(DateRangePreset).optional(),
      }),

      // Lead-specific filters
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "status.label",
        description: "status.description",
        options: LeadStatusFilterOptions,
        columns: 4,
        schema: z.enum(LeadStatusFilter).default(LeadStatusFilter.ALL),
      }),

      source: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "source.label",
        description: "source.description",
        options: LeadSourceFilterOptions,
        columns: 4,
        schema: z.enum(LeadSourceFilter).default(LeadSourceFilter.ALL),
      }),

      country: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "country.label",
        description: "country.description",
        options: CountryFilterOptions,
        columns: 4,
        schema: z.enum(CountryFilter).default(CountryFilter.ALL),
      }),

      language: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "language.label",
        description: "language.description",
        options: LanguageFilterOptions,
        columns: 4,
        schema: z.enum(LanguageFilter).default(LanguageFilter.ALL),
      }),

      campaignStage: scopedRequestField(scopedTranslation, {
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
      hasEngagement: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasEngagement.label",
        description: "hasEngagement.description",
        columns: 4,
        schema: z.coerce.boolean().optional(),
      }),

      minEmailsOpened: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsOpened.label",
        description: "minEmailsOpened.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      minEmailsClicked: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsClicked.label",
        description: "minEmailsClicked.description",
        columns: 4,
        schema: z.coerce.number().optional(),
      }),

      // Conversion filters
      isConverted: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "isConverted.label",
        description: "isConverted.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasSignedUp: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasSignedUp.label",
        description: "hasSignedUp.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasConfirmedSubscription: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasConfirmedSubscription.label",
        description: "hasConfirmedSubscription.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Business filters
      hasBusinessName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasBusinessName.label",
        description: "hasBusinessName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasContactName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasContactName.label",
        description: "hasContactName.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasPhone: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasPhone.label",
        description: "hasPhone.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasWebsite: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasWebsite.label",
        description: "hasWebsite.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      hasNotes: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasNotes.label",
        description: "hasNotes.description",
        columns: 3,
        schema: z.coerce.boolean().optional(),
      }),

      // Association filters
      hasUserId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "hasUserId.label",
        description: "hasUserId.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      emailVerified: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "emailVerified.label",
        description: "emailVerified.description",
        columns: 6,
        schema: z.coerce.boolean().optional(),
      }),

      // Journey and campaign filters
      journeyVariant: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "journeyVariant.label",
        description: "journeyVariant.description",
        columns: 6,
        schema: z.enum(EmailJourneyVariant).optional(),
      }),

      minEmailsSent: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "minEmailsSent.label",
        description: "minEmailsSent.description",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      // Date range filters
      createdAfter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "createdAfter.label",
        description: "createdAfter.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      createdBefore: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "createdBefore.label",
        description: "createdBefore.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      updatedAfter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "updatedAfter.label",
        description: "updatedAfter.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      updatedBefore: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "updatedBefore.label",
        description: "updatedBefore.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      // Search
      search: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.label",
        description: "search.description",
        placeholder: "search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      // Sorting
      sortBy: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortBy.label",
        description: "sortBy.description",
        options: LeadSortFieldOptions,
        columns: 6,
        schema: z.enum(LeadSortField).default(LeadSortField.CREATED_AT),
      }),

      sortOrder: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "sortOrder.label",
        description: "sortOrder.description",
        options: SortOrderOptions,
        columns: 6,
        schema: z.enum(SortOrder).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===
      totalLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.totalLeads",
        schema: z.coerce.number(),
      }),

      newLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.newLeads",
        schema: z.coerce.number(),
      }),

      activeLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.activeLeads",
        schema: z.coerce.number(),
      }),

      conversionRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.conversionRate",
        schema: z.coerce.number(),
      }),

      averageOpenRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageOpenRate",
        schema: z.coerce.number(),
      }),

      averageClickRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageClickRate",
        schema: z.coerce.number(),
      }),

      // Additional lead metrics
      campaignRunningLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.campaignRunningLeads",
        schema: z.coerce.number(),
      }),

      websiteUserLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.websiteUserLeads",
        schema: z.coerce.number(),
      }),

      newsletterSubscriberLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.newsletterSubscriberLeads",
        schema: z.coerce.number(),
      }),

      convertedLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.convertedLeads",
        schema: z.coerce.number(),
      }),

      signedUpLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.signedUpLeads",
        schema: z.coerce.number(),
      }),

      consultationBookedLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.consultationBookedLeads",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmedLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.subscriptionConfirmedLeads",
        schema: z.coerce.number(),
      }),

      unsubscribedLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.unsubscribedLeads",
        schema: z.coerce.number(),
      }),

      bouncedLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.bouncedLeads",
        schema: z.coerce.number(),
      }),

      invalidLeads: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.invalidLeads",
        schema: z.coerce.number(),
      }),

      // Email campaign metrics
      totalEmailsSent: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.totalEmailsSent",
        schema: z.coerce.number(),
      }),

      totalEmailsOpened: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.totalEmailsOpened",
        schema: z.coerce.number(),
      }),

      totalEmailsClicked: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.totalEmailsClicked",
        schema: z.coerce.number(),
      }),

      averageEmailsPerLead: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageEmailsPerLead",
        schema: z.coerce.number(),
      }),

      // Engagement metrics
      leadsWithEmailEngagement: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithEmailEngagement",
        schema: z.coerce.number(),
      }),

      leadsWithoutEmailEngagement: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithoutEmailEngagement",
        schema: z.coerce.number(),
      }),

      averageEmailEngagementScore: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageEmailEngagementScore",
        schema: z.coerce.number(),
      }),

      totalEmailEngagements: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.totalEmailEngagements",
        schema: z.coerce.number(),
      }),

      // Conversion metrics
      signupRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.signupRate",
        schema: z.coerce.number(),
      }),

      consultationBookingRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.consultationBookingRate",
        schema: z.coerce.number(),
      }),

      subscriptionConfirmationRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.subscriptionConfirmationRate",
        schema: z.coerce.number(),
      }),

      // Data completeness
      dataCompletenessRate: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.dataCompletenessRate",
        schema: z.coerce.number(),
      }),

      // Performance metrics
      leadVelocity: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadVelocity",
        schema: z.coerce.number(),
      }),

      // Time-based metrics
      leadsCreatedToday: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsCreatedToday",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisWeek: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsCreatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsCreatedThisMonth: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsCreatedThisMonth",
        schema: z.coerce.number(),
      }),

      leadsUpdatedToday: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsUpdatedToday",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisWeek: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsUpdatedThisWeek",
        schema: z.coerce.number(),
      }),

      leadsUpdatedThisMonth: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsUpdatedThisMonth",
        schema: z.coerce.number(),
      }),

      // Distribution metrics
      leadsByCampaignStage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsByCampaignStage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsInActiveCampaigns: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsInActiveCampaigns",
        schema: z.coerce.number(),
      }),

      leadsNotInCampaigns: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsNotInCampaigns",
        schema: z.coerce.number(),
      }),

      leadsByJourneyVariant: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsByJourneyVariant",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByCountry: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsByCountry",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByLanguage: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsByLanguage",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsBySource: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsBySource",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      leadsByStatus: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsByStatus",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      // Business information completeness
      leadsWithBusinessName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithBusinessName",
        schema: z.coerce.number(),
      }),

      leadsWithContactName: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithContactName",
        schema: z.coerce.number(),
      }),

      leadsWithPhone: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithPhone",
        schema: z.coerce.number(),
      }),

      leadsWithWebsite: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithWebsite",
        schema: z.coerce.number(),
      }),

      leadsWithNotes: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.leadsWithNotes",
        schema: z.coerce.number(),
      }),

      // Historical data with proper Zod schema
      historicalData: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.historicalData",
        schema: historicalDataSchema,
      }),

      // Grouped stats with proper Zod schema
      groupedStats: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.groupedStats",
        schema: groupedStatsSchema,
      }),

      // Performance metrics - time-based
      averageTimeToConversion: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageTimeToConversion",
        schema: z.coerce.number(),
      }),

      averageTimeToSignup: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageTimeToSignup",
        schema: z.coerce.number(),
      }),

      averageTimeToConsultation: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.averageTimeToConsultation",
        schema: z.coerce.number(),
      }),

      // Top performers with proper Zod schemas
      topPerformingCampaigns: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.topPerformingCampaigns",
        description: "response.topPerformingCampaigns",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            campaignId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.topPerformingCampaigns",
              schema: z.string(),
            }),
            campaignName: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.topPerformingCampaigns",
              schema: z.string(),
            }),
            leadsGenerated: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.topPerformingCampaigns",
              schema: z.coerce.number(),
            }),
            conversionRate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.conversionRate",
              schema: z.coerce.number(),
            }),
            openRate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.averageOpenRate",
              schema: z.coerce.number(),
            }),
            clickRate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.averageClickRate",
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      topPerformingSources: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.topPerformingSources",
        description: "response.topPerformingSources",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            source: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.leadsBySource",
              schema: z.enum(LeadSource),
            }),
            leadsGenerated: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.topPerformingSources",
              schema: z.coerce.number(),
            }),
            conversionRate: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.conversionRate",
              schema: z.coerce.number(),
            }),
            qualityScore: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.topPerformingSources",
              schema: z.coerce.number(),
            }),
          },
        }),
      }),

      // Recent activity with proper Zod schema
      recentActivity: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.recentActivity",
        description: "response.recentActivity",
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.recentActivity",
              schema: z.string(),
            }),
            leadEmail: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.recentActivity",
              schema: z.string(),
            }),
            leadBusinessName: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.recentActivity",
              schema: z.string(),
            }),
            timestamp: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "response.generatedAt",
              schema: z.string(),
            }),
            type: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "response.recentActivity",
              schema: z.enum(ActivityType),
            }),
            details: scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "response.recentActivity",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                status: scopedResponseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "response.leadsByStatus",
                  schema: z.enum(LeadStatus),
                }),
                source: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.leadsBySource",
                  schema: z.string(),
                }),
                country: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.leadsByCountry",
                  schema: z.string(),
                }),
                emailsSent: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.totalEmailsSent",
                  schema: z.coerce.number(),
                }),
                emailsOpened: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.totalEmailsOpened",
                  schema: z.coerce.number(),
                }),
                emailsClicked: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.totalEmailsClicked",
                  schema: z.coerce.number(),
                }),
                daysSinceCreated: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.recentActivity",
                  schema: z.coerce.number(),
                }),
                isConverted: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "response.convertedLeads",
                  schema: z.boolean(),
                }),
              },
            }),
          },
        }),
      }),

      // Metadata
      generatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.generatedAt",
        schema: z.string(),
      }),

      dataRange: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.dataRange",
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

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export default definitions;
