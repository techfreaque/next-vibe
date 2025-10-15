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

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { CountryFilter, LanguageFilter } from "@/i18n/core/config";

import { UserRole } from "../../user/user-roles/enum";
import {
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailJourneyVariant,
  LeadSortField,
  LeadSortFieldOptions,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

// Create options arrays for enums that don't have them
const TimePeriodOptions = [
  {
    value: TimePeriod.HOUR,
    label: "app.api.v1.core.leads.stats.timePeriod.hour" as const,
  },
  {
    value: TimePeriod.DAY,
    label: "app.api.v1.core.leads.stats.timePeriod.day" as const,
  },
  {
    value: TimePeriod.WEEK,
    label: "app.api.v1.core.leads.stats.timePeriod.week" as const,
  },
  {
    value: TimePeriod.MONTH,
    label: "app.api.v1.core.leads.stats.timePeriod.month" as const,
  },
  {
    value: TimePeriod.QUARTER,
    label: "app.api.v1.core.leads.stats.timePeriod.quarter" as const,
  },
  {
    value: TimePeriod.YEAR,
    label: "app.api.v1.core.leads.stats.timePeriod.year" as const,
  },
];

const DateRangePresetOptions = [
  {
    value: DateRangePreset.TODAY,
    label: "app.api.v1.core.leads.stats.dateRange.today" as const,
  },
  {
    value: DateRangePreset.YESTERDAY,
    label: "app.api.v1.core.leads.stats.dateRange.yesterday" as const,
  },
  {
    value: DateRangePreset.LAST_7_DAYS,
    label: "app.api.v1.core.leads.stats.dateRange.last7Days" as const,
  },
  {
    value: DateRangePreset.LAST_30_DAYS,
    label: "app.api.v1.core.leads.stats.dateRange.last30Days" as const,
  },
  {
    value: DateRangePreset.LAST_90_DAYS,
    label: "app.api.v1.core.leads.stats.dateRange.last90Days" as const,
  },
  {
    value: DateRangePreset.THIS_WEEK,
    label: "app.api.v1.core.leads.stats.dateRange.thisWeek" as const,
  },
  {
    value: DateRangePreset.LAST_WEEK,
    label: "app.api.v1.core.leads.stats.dateRange.lastWeek" as const,
  },
  {
    value: DateRangePreset.THIS_MONTH,
    label: "app.api.v1.core.leads.stats.dateRange.thisMonth" as const,
  },
  {
    value: DateRangePreset.LAST_MONTH,
    label: "app.api.v1.core.leads.stats.dateRange.lastMonth" as const,
  },
  {
    value: DateRangePreset.THIS_QUARTER,
    label: "app.api.v1.core.leads.stats.dateRange.thisQuarter" as const,
  },
  {
    value: DateRangePreset.LAST_QUARTER,
    label: "app.api.v1.core.leads.stats.dateRange.lastQuarter" as const,
  },
  {
    value: DateRangePreset.THIS_YEAR,
    label: "app.api.v1.core.leads.stats.dateRange.thisYear" as const,
  },
  {
    value: DateRangePreset.LAST_YEAR,
    label: "app.api.v1.core.leads.stats.dateRange.lastYear" as const,
  },
  {
    value: DateRangePreset.CUSTOM,
    label: "app.api.v1.core.leads.stats.dateRange.custom" as const,
  },
];

const ChartTypeOptions = [
  {
    value: ChartType.LINE,
    label: "app.api.v1.core.leads.stats.chartType.line" as const,
  },
  {
    value: ChartType.BAR,
    label: "app.api.v1.core.leads.stats.chartType.bar" as const,
  },
  {
    value: ChartType.AREA,
    label: "app.api.v1.core.leads.stats.chartType.area" as const,
  },
  {
    value: ChartType.PIE,
    label: "app.api.v1.core.leads.stats.chartType.pie" as const,
  },
  {
    value: ChartType.DONUT,
    label: "app.api.v1.core.leads.stats.chartType.donut" as const,
  },
];

const CountryFilterOptions = [
  {
    value: CountryFilter.ALL,
    label: "app.api.v1.core.leads.stats.country.all" as const,
  },
  {
    value: CountryFilter.DE,
    label: "app.api.v1.core.leads.stats.country.de" as const,
  },
  {
    value: CountryFilter.PL,
    label: "app.api.v1.core.leads.stats.country.pl" as const,
  },
  {
    value: CountryFilter.GLOBAL,
    label: "app.api.v1.core.leads.stats.country.global" as const,
  },
];

const LanguageFilterOptions = [
  {
    value: LanguageFilter.ALL,
    label: "app.api.v1.core.leads.stats.language.all" as const,
  },
  {
    value: LanguageFilter.EN,
    label: "app.api.v1.core.leads.stats.language.en" as const,
  },
  {
    value: LanguageFilter.DE,
    label: "app.api.v1.core.leads.stats.language.de" as const,
  },
  {
    value: LanguageFilter.PL,
    label: "app.api.v1.core.leads.stats.language.pl" as const,
  },
];

/**
 * Leads Stats Endpoint Definition
 * Using new field-based API
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "stats"],
  title: "app.api.v1.core.leads.stats.title",
  description: "app.api.v1.core.leads.stats.description",
  category: "app.api.v1.core.leads.stats.category",
  tags: [
    "app.api.v1.core.leads.stats.tags.leads",
    "app.api.v1.core.leads.stats.tags.statistics",
    "app.api.v1.core.leads.stats.tags.analytics",
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.stats.container.title",
      description: "app.api.v1.core.leads.stats.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      [Methods.GET]: { request: "data", response: true },
    },
    {
      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.timePeriod.label",
          description: "app.api.v1.core.leads.stats.timePeriod.description",
          options: TimePeriodOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(TimePeriod).default(TimePeriod.DAY),
      ),

      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.dateRangePreset.label",
          description:
            "app.api.v1.core.leads.stats.dateRangePreset.description",
          options: DateRangePresetOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(DateRangePreset).default(DateRangePreset.LAST_30_DAYS),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.dateFrom.label",
          description: "app.api.v1.core.leads.stats.dateFrom.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.dateTo.label",
          description: "app.api.v1.core.leads.stats.dateTo.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      chartType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.chartType.label",
          description: "app.api.v1.core.leads.stats.chartType.description",
          options: ChartTypeOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(ChartType).default(ChartType.LINE),
      ),

      includeComparison: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.includeComparison.label",
          description:
            "app.api.v1.core.leads.stats.includeComparison.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().default(false),
      ),

      comparisonPeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.comparisonPeriod.label",
          description:
            "app.api.v1.core.leads.stats.comparisonPeriod.description",
          options: DateRangePresetOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(DateRangePreset).optional(),
      ),

      // Lead-specific filters
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.status.label",
          description: "app.api.v1.core.leads.stats.status.description",
          options: LeadStatusFilterOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(LeadStatusFilter).default(LeadStatusFilter.ALL),
      ),

      source: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.source.label",
          description: "app.api.v1.core.leads.stats.source.description",
          options: LeadSourceFilterOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(LeadSourceFilter).default(LeadSourceFilter.ALL),
      ),

      country: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.country.label",
          description: "app.api.v1.core.leads.stats.country.description",
          options: CountryFilterOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(CountryFilter).default(CountryFilter.ALL),
      ),

      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.language.label",
          description: "app.api.v1.core.leads.stats.language.description",
          options: LanguageFilterOptions,
          layout: { columns: 4 },
        },
        z.nativeEnum(LanguageFilter).default(LanguageFilter.ALL),
      ),

      campaignStage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.campaignStage.label",
          description: "app.api.v1.core.leads.stats.campaignStage.description",
          options: EmailCampaignStageFilterOptions,
          layout: { columns: 4 },
        },
        z
          .nativeEnum(EmailCampaignStageFilter)
          .default(EmailCampaignStageFilter.ALL),
      ),

      // Engagement filters
      hasEngagement: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasEngagement.label",
          description: "app.api.v1.core.leads.stats.hasEngagement.description",
          layout: { columns: 4 },
        },
        z.coerce.boolean().optional(),
      ),

      minEmailsOpened: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.stats.minEmailsOpened.label",
          description:
            "app.api.v1.core.leads.stats.minEmailsOpened.description",
          layout: { columns: 4 },
        },
        z.coerce.number().optional(),
      ),

      minEmailsClicked: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.stats.minEmailsClicked.label",
          description:
            "app.api.v1.core.leads.stats.minEmailsClicked.description",
          layout: { columns: 4 },
        },
        z.coerce.number().optional(),
      ),

      // Conversion filters
      isConverted: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.isConverted.label",
          description: "app.api.v1.core.leads.stats.isConverted.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasSignedUp: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasSignedUp.label",
          description: "app.api.v1.core.leads.stats.hasSignedUp.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasBookedConsultation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasBookedConsultation.label",
          description:
            "app.api.v1.core.leads.stats.hasBookedConsultation.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasConfirmedSubscription: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasConfirmedSubscription.label",
          description:
            "app.api.v1.core.leads.stats.hasConfirmedSubscription.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      // Business filters
      hasBusinessName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasBusinessName.label",
          description:
            "app.api.v1.core.leads.stats.hasBusinessName.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasContactName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasContactName.label",
          description: "app.api.v1.core.leads.stats.hasContactName.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasPhone: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasPhone.label",
          description: "app.api.v1.core.leads.stats.hasPhone.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasWebsite: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasWebsite.label",
          description: "app.api.v1.core.leads.stats.hasWebsite.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      hasNotes: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasNotes.label",
          description: "app.api.v1.core.leads.stats.hasNotes.description",
          layout: { columns: 3 },
        },
        z.coerce.boolean().optional(),
      ),

      // Association filters
      hasUserId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.hasUserId.label",
          description: "app.api.v1.core.leads.stats.hasUserId.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().optional(),
      ),

      emailVerified: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.leads.stats.emailVerified.label",
          description: "app.api.v1.core.leads.stats.emailVerified.description",
          layout: { columns: 6 },
        },
        z.coerce.boolean().optional(),
      ),

      // Journey and campaign filters
      journeyVariant: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.stats.journeyVariant.label",
          description: "app.api.v1.core.leads.stats.journeyVariant.description",
          layout: { columns: 6 },
        },
        z.nativeEnum(EmailJourneyVariant).optional(),
      ),

      minEmailsSent: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.stats.minEmailsSent.label",
          description: "app.api.v1.core.leads.stats.minEmailsSent.description",
          layout: { columns: 6 },
        },
        z.coerce.number().optional(),
      ),

      // Date range filters
      createdAfter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.createdAfter.label",
          description: "app.api.v1.core.leads.stats.createdAfter.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      createdBefore: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.createdBefore.label",
          description: "app.api.v1.core.leads.stats.createdBefore.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      updatedAfter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.updatedAfter.label",
          description: "app.api.v1.core.leads.stats.updatedAfter.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      updatedBefore: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.leads.stats.updatedBefore.label",
          description: "app.api.v1.core.leads.stats.updatedBefore.description",
          layout: { columns: 6 },
        },
        z.coerce.date().optional(),
      ),

      // Search
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.stats.search.label",
          description: "app.api.v1.core.leads.stats.search.description",
          placeholder: "app.api.v1.core.leads.stats.search.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // Sorting
      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.sortBy.label",
          description: "app.api.v1.core.leads.stats.sortBy.description",
          options: LeadSortFieldOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(LeadSortField).default(LeadSortField.CREATED_AT),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.leads.stats.sortOrder.label",
          description: "app.api.v1.core.leads.stats.sortOrder.description",
          options: SortOrderOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(SortOrder).default(SortOrder.DESC),
      ),

      // === RESPONSE FIELDS ===
      // Note: For stats endpoints, we typically return a complex nested structure
      // For simplicity and to get this working, I'll add the key response fields
      // The repository will return the full structure as defined in the old schema

      totalLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.totalLeads",
        },
        z.number(),
      ),

      newLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.newLeads",
        },
        z.number(),
      ),

      activeLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.activeLeads",
        },
        z.number(),
      ),

      conversionRate: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.conversionRate",
        },
        z.number(),
      ),

      averageOpenRate: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.averageOpenRate",
        },
        z.number(),
      ),

      averageClickRate: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.averageClickRate",
        },
        z.number(),
      ),

      // Additional lead metrics
      campaignRunningLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.campaignRunningLeads",
        },
        z.number(),
      ),

      websiteUserLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.websiteUserLeads",
        },
        z.number(),
      ),

      newsletterSubscriberLeads: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.newsletterSubscriberLeads",
        },
        z.number(),
      ),

      convertedLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.convertedLeads",
        },
        z.number(),
      ),

      signedUpLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.signedUpLeads",
        },
        z.number(),
      ),

      consultationBookedLeads: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.consultationBookedLeads",
        },
        z.number(),
      ),

      subscriptionConfirmedLeads: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.subscriptionConfirmedLeads",
        },
        z.number(),
      ),

      unsubscribedLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.unsubscribedLeads",
        },
        z.number(),
      ),

      bouncedLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.bouncedLeads",
        },
        z.number(),
      ),

      invalidLeads: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.invalidLeads",
        },
        z.number(),
      ),

      // Email campaign metrics
      totalEmailsSent: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.totalEmailsSent",
        },
        z.number(),
      ),

      totalEmailsOpened: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.totalEmailsOpened",
        },
        z.number(),
      ),

      totalEmailsClicked: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.totalEmailsClicked",
        },
        z.number(),
      ),

      averageEmailsPerLead: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.averageEmailsPerLead",
        },
        z.number(),
      ),

      // Engagement metrics
      leadsWithEmailEngagement: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.leadsWithEmailEngagement",
        },
        z.number(),
      ),

      leadsWithoutEmailEngagement: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.leadsWithoutEmailEngagement",
        },
        z.number(),
      ),

      averageEmailEngagementScore: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.averageEmailEngagementScore",
        },
        z.number(),
      ),

      totalEmailEngagements: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.totalEmailEngagements",
        },
        z.number(),
      ),

      // Conversion metrics
      signupRate: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.signupRate",
        },
        z.number(),
      ),

      consultationBookingRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.consultationBookingRate",
        },
        z.number(),
      ),

      subscriptionConfirmationRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.subscriptionConfirmationRate",
        },
        z.number(),
      ),

      // Data completeness
      dataCompletenessRate: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.dataCompletenessRate",
        },
        z.number(),
      ),

      // Performance metrics
      leadVelocity: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadVelocity",
        },
        z.number(),
      ),

      // Time-based metrics
      leadsCreatedToday: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsCreatedToday",
        },
        z.number(),
      ),

      leadsCreatedThisWeek: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsCreatedThisWeek",
        },
        z.number(),
      ),

      leadsCreatedThisMonth: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsCreatedThisMonth",
        },
        z.number(),
      ),

      leadsUpdatedToday: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsUpdatedToday",
        },
        z.number(),
      ),

      leadsUpdatedThisWeek: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsUpdatedThisWeek",
        },
        z.number(),
      ),

      leadsUpdatedThisMonth: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsUpdatedThisMonth",
        },
        z.number(),
      ),

      // Distribution metrics
      leadsByCampaignStage: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsByCampaignStage",
        },
        z.record(z.string(), z.number()),
      ),

      leadsInActiveCampaigns: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.leadsInActiveCampaigns",
        },
        z.number(),
      ),

      leadsNotInCampaigns: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsNotInCampaigns",
        },
        z.number(),
      ),

      leadsByJourneyVariant: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsByJourneyVariant",
        },
        z.record(z.string(), z.number()),
      ),

      leadsByCountry: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsByCountry",
        },
        z.record(z.string(), z.number()),
      ),

      leadsByLanguage: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsByLanguage",
        },
        z.record(z.string(), z.number()),
      ),

      leadsBySource: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsBySource",
        },
        z.record(z.string(), z.number()),
      ),

      leadsByStatus: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsByStatus",
        },
        z.record(z.string(), z.number()),
      ),

      // Business information completeness
      leadsWithBusinessName: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsWithBusinessName",
        },
        z.number(),
      ),

      leadsWithContactName: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsWithContactName",
        },
        z.number(),
      ),

      leadsWithPhone: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsWithPhone",
        },
        z.number(),
      ),

      leadsWithWebsite: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsWithWebsite",
        },
        z.number(),
      ),

      leadsWithNotes: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.leadsWithNotes",
        },
        z.number(),
      ),

      // Historical data - using z.any() for the complex nested structure
      historicalData: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.historicalData",
        },
        z.any(),
      ),

      // Grouped stats - using z.any() for the complex nested structure
      groupedStats: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.groupedStats",
        },
        z.any(),
      ),

      // Performance metrics - time-based
      averageTimeToConversion: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.averageTimeToConversion",
        },
        z.number(),
      ),

      averageTimeToSignup: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.averageTimeToSignup",
        },
        z.number(),
      ),

      averageTimeToConsultation: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.averageTimeToConsultation",
        },
        z.number(),
      ),

      // Top performers
      topPerformingCampaigns: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.stats.response.topPerformingCampaigns",
        },
        z.array(z.any()),
      ),

      topPerformingSources: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.topPerformingSources",
        },
        z.array(z.any()),
      ),

      // Recent activity
      recentActivity: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.recentActivity",
        },
        z.array(z.any()),
      ),

      // Metadata
      generatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.generatedAt",
        },
        z.coerce.date(),
      ),

      dataRange: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.dataRange",
        },
        z.any(),
      ),

      // Add a catch-all field for any remaining data
      data: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.stats.response.data",
        },
        z.any(),
      ),
    },
  ),

  examples: {
    responses: {},
  },

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.leads.stats.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.stats.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.leads.stats.errors.validation.title",
      description: "app.api.v1.core.leads.stats.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.stats.errors.notFound.title",
      description: "app.api.v1.core.leads.stats.errors.notFound.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.stats.errors.forbidden.title",
      description: "app.api.v1.core.leads.stats.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.stats.errors.conflict.title",
      description: "app.api.v1.core.leads.stats.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.leads.stats.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.stats.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.stats.errors.network.title",
      description: "app.api.v1.core.leads.stats.errors.network.description",
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
});

// Type exports using the new pattern
export type LeadsStatsRequestInput = typeof GET.types.RequestInput;
export type LeadsStatsRequestOutput = typeof GET.types.RequestOutput;
export type LeadsStatsResponseInput = typeof GET.types.ResponseInput;
export type LeadsStatsResponseOutput = typeof GET.types.ResponseOutput;

// Legacy type exports for backward compatibility
export type LeadsStatsRequestType = LeadsStatsRequestOutput;
export type LeadsStatsResponseType = LeadsStatsResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
};

export default definitions;
