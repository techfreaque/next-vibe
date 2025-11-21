/**
 * Email Stats API Definition
 * Defines the API endpoint for email statistics and analytics with historical charts
 */

import { chartDataSchema } from "next-vibe/shared/types/stats-filtering.schema";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { SortOrder, SortOrderOptions } from "../../imap-client/enum";
import {
  EmailSortField,
  EmailSortFieldOptions,
  EmailStatusFilter,
  EmailStatusFilterOptions,
  EmailTypeFilter,
  EmailTypeFilterOptions,
} from "../enum";
import {
  ChartType,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodOptions,
} from "./enum";


/**
 * Get Email Stats Endpoint (GET)
 * Retrieves comprehensive email statistics as historical charts only
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "emails", "messages", "stats"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.emails.messages.stats.get.title",
  description: "app.api.v1.core.emails.messages.stats.get.description",
  category: "app.api.v1.core.emails.category",
  tags: [
    "app.api.v1.core.emails.tags.stats",
    "app.api.v1.core.emails.tags.analytics",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.emails.messages.stats.get.form.title",
      description: "app.api.v1.core.emails.messages.stats.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.timePeriod.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.timePeriod.description",
          options: TimePeriodOptions,
          columns: 4,
        },
        z.enum(Object.values(TimePeriod) as [string, ...string[]]).default(TimePeriod.day),
      ),

      dateRangePreset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.emails.messages.stats.get.dateRangePreset.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.dateRangePreset.description",
          options: DateRangePresetOptions,
          columns: 4,
        },
        z.enum(Object.values(DateRangePreset) as [string, ...string[]]).default(DateRangePreset.last_30_days),
      ),

      dateFrom: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.emails.messages.stats.get.dateFrom.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.dateFrom.description",
          columns: 6,
        },
        z.coerce.date().optional(),
      ),

      dateTo: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.emails.messages.stats.get.dateTo.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.dateTo.description",
          columns: 6,
        },
        z.coerce.date().optional(),
      ),

      chartType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.chartType.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.chartType.description",
          options: ChartTypeOptions,
          columns: 4,
        },
        z.enum(Object.values(ChartType) as [string, ...string[]]).default(ChartType.line),
      ),

      includeComparison: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.emails.messages.stats.get.includeComparison.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.includeComparison.description",
          columns: 6,
        },
        z.coerce.boolean().default(false),
      ),

      // Email-specific filters
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.status.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.status.description",
          columns: 3,
          options: EmailStatusFilterOptions,
        },
        z.enum(Object.values(EmailStatusFilter) as [string, ...string[]]).default(EmailStatusFilter.ALL),
      ),

      type: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.type.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.type.description",
          columns: 3,
          options: EmailTypeFilterOptions,
        },
        z.enum(Object.values(EmailTypeFilter) as [string, ...string[]]).default(EmailTypeFilter.ALL),
      ),

      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.emails.messages.stats.get.search.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.search.description",
          columns: 6,
        },
        z.string().optional(),
      ),

      // Sorting
      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.sortBy.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.sortBy.description",
          options: EmailSortFieldOptions,
          columns: 6,
        },
        z.enum(Object.values(EmailSortField) as [string, ...string[]]).default(EmailSortField.CREATED_AT),
      ),

      sortOrder: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.emails.messages.stats.get.sortOrder.label",
          description:
            "app.api.v1.core.emails.messages.stats.get.sortOrder.description",
          options: SortOrderOptions,
          columns: 6,
        },
        z.enum(Object.values(SortOrder) as [string, ...string[]]).default(SortOrder.DESC),
      ),

      // === RESPONSE FIELDS ===

      // Current period email metrics
      totalEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.totalEmails",
        },
        z.number(),
      ),
      sentEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.sentEmails",
        },
        z.number(),
      ),
      deliveredEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.deliveredEmails",
        },
        z.number(),
      ),
      openedEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.openedEmails",
        },
        z.number(),
      ),
      clickedEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.clickedEmails",
        },
        z.number(),
      ),
      bouncedEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.bouncedEmails",
        },
        z.number(),
      ),
      failedEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.failedEmails",
        },
        z.number(),
      ),
      draftEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.draftEmails",
        },
        z.number(),
      ),

      // Engagement rates
      deliveryRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.deliveryRate",
        },
        z.number(),
      ),
      openRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.openRate",
        },
        z.number(),
      ),
      clickRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.clickRate",
        },
        z.number(),
      ),
      bounceRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.bounceRate",
        },
        z.number(),
      ),
      failureRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.failureRate",
        },
        z.number(),
      ),

      // Provider/template/status/type metrics
      emailsByProvider: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsByProvider",
        },
        z.record(z.string(), z.number()),
      ),
      emailsByTemplate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsByTemplate",
        },
        z.record(z.string(), z.number()),
      ),
      emailsByStatus: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsByStatus",
        },
        z.record(z.string(), z.number()),
      ),
      emailsByType: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsByType",
        },
        z.record(z.string(), z.number()),
      ),

      // User association metrics
      emailsWithUserId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithUserId",
        },
        z.number(),
      ),
      emailsWithoutUserId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithoutUserId",
        },
        z.number(),
      ),
      emailsWithLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithLeadId",
        },
        z.number(),
      ),
      emailsWithoutLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithoutLeadId",
        },
        z.number(),
      ),

      // Error metrics
      emailsWithErrors: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithErrors",
        },
        z.number(),
      ),
      emailsWithoutErrors: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.emailsWithoutErrors",
        },
        z.number(),
      ),
      averageRetryCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.averageRetryCount",
        },
        z.number(),
      ),
      maxRetryCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.maxRetryCount",
        },
        z.number(),
      ),

      // Performance metrics
      averageProcessingTime: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.averageProcessingTime",
        },
        z.number(),
      ),
      averageDeliveryTime: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.averageDeliveryTime",
        },
        z.number(),
      ),

      // Historical data - complex nested structure
      historicalData: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.historicalData",
        },
        chartDataSchema,
      ),

      // Grouped stats - complex nested structure
      groupedStats: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.groupedStats",
        },
        z.any(),
      ),

      // Metadata
      generatedAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.generatedAt",
        },
        z.string(),
      ),

      dataRange: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.dataRange",
        },
        z.any(),
      ),

      // Recent activity
      recentActivity: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.recentActivity",
        },
        z.array(z.any()),
      ),

      // Top performers
      topPerformingTemplates: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.topPerformingTemplates",
        },
        z.array(z.any()),
      ),

      topPerformingProviders: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.emails.messages.stats.get.response.topPerformingProviders",
        },
        z.array(z.any()),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.validation.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.server.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.unknown.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.network.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.forbidden.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.notFound.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.emails.messages.stats.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.emails.messages.stats.get.errors.conflict.title",
      description:
        "app.api.v1.core.emails.messages.stats.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.emails.messages.stats.get.success.title",
    description:
      "app.api.v1.core.emails.messages.stats.get.success.description",
  },

  examples: {
    requests: {
      default: {
        timePeriod: TimePeriod.day,
        dateRangePreset: DateRangePreset.last_30_days,
        chartType: ChartType.line,
      },
    },
    responses: {
      default: {
        totalEmails: 1000,
        sentEmails: 950,
        deliveredEmails: 900,
        openedEmails: 450,
        clickedEmails: 120,
        bouncedEmails: 50,
        failedEmails: 50,
        draftEmails: 20,
        deliveryRate: 0.95,
        openRate: 0.5,
        clickRate: 0.27,
        bounceRate: 0.05,
        failureRate: 0.05,
        emailsByProvider: {},
        emailsByTemplate: {},
        emailsByStatus: {},
        emailsByType: {},
        emailsWithUserId: 800,
        emailsWithoutUserId: 200,
        emailsWithLeadId: 600,
        emailsWithoutLeadId: 400,
        emailsWithErrors: 50,
        emailsWithoutErrors: 950,
        averageRetryCount: 0.5,
        maxRetryCount: 3,
        averageProcessingTime: 150,
        averageDeliveryTime: 2000,
        historicalData: {
          series: [],
        },
        groupedStats: {
          byStatus: [],
          byType: [],
          byProvider: [],
          byTemplate: [],
          byEngagement: [],
          byRetryCount: [],
          byUserAssociation: [],
        },
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
        recentActivity: [],
        topPerformingTemplates: [],
        topPerformingProviders: [],
      },
    },
  },
});

// Extract types using the new enhanced system
export type EmailStatsGetRequestTypeInput = typeof GET.types.RequestInput;
export type EmailStatsGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type EmailStatsGetResponseTypeInput = typeof GET.types.ResponseInput;
export type EmailStatsGetResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const emailStatsEndpoints = {
  GET,
};

export { GET };
export default emailStatsEndpoints;
