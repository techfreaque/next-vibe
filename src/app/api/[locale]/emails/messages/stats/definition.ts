/**
 * Email Stats API Definition
 * Defines the API endpoint for email statistics and analytics with historical charts
 */

import { chartDataSchema } from "next-vibe/shared/types/stats-filtering.schema";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

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
import { EmailStatsContainer } from "./widget";

/**
 * Get Email Stats Endpoint (GET)
 * Retrieves comprehensive email statistics as historical charts only
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["emails", "messages", "stats"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.emails.messages.stats.get.title",
  description: "app.api.emails.messages.stats.get.description",
  category: "app.api.emails.category",
  icon: "bar-chart-3",
  tags: ["app.api.emails.tags.stats", "app.api.emails.tags.analytics"],

  fields: customWidgetObject({
    render: EmailStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.timePeriod.label",
        description: "app.api.emails.messages.stats.get.timePeriod.description",
        options: TimePeriodOptions,
        columns: 4,
        schema: z
          .enum(Object.values(TimePeriod) as [string, ...string[]])
          .default(TimePeriod.day),
      }),

      dateRangePreset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.dateRangePreset.label",
        description:
          "app.api.emails.messages.stats.get.dateRangePreset.description",
        options: DateRangePresetOptions,
        columns: 4,
        schema: z
          .enum(Object.values(DateRangePreset) as [string, ...string[]])
          .default(DateRangePreset.last_30_days),
      }),

      dateFrom: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.emails.messages.stats.get.dateFrom.label",
        description: "app.api.emails.messages.stats.get.dateFrom.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      dateTo: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "app.api.emails.messages.stats.get.dateTo.label",
        description: "app.api.emails.messages.stats.get.dateTo.description",
        columns: 6,
        schema: z.coerce.date().optional(),
      }),

      chartType: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.chartType.label",
        description: "app.api.emails.messages.stats.get.chartType.description",
        options: ChartTypeOptions,
        columns: 4,
        schema: z
          .enum(Object.values(ChartType) as [string, ...string[]])
          .default(ChartType.line),
      }),

      includeComparison: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.emails.messages.stats.get.includeComparison.label",
        description:
          "app.api.emails.messages.stats.get.includeComparison.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      // Email-specific filters
      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.status.label",
        description: "app.api.emails.messages.stats.get.status.description",
        columns: 3,
        options: EmailStatusFilterOptions,
        schema: z
          .enum(Object.values(EmailStatusFilter) as [string, ...string[]])
          .default(EmailStatusFilter.ANY),
      }),

      type: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.type.label",
        description: "app.api.emails.messages.stats.get.type.description",
        columns: 3,
        options: EmailTypeFilterOptions,
        schema: z
          .enum(Object.values(EmailTypeFilter) as [string, ...string[]])
          .default(EmailTypeFilter.ANY),
      }),

      search: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.emails.messages.stats.get.search.label",
        description: "app.api.emails.messages.stats.get.search.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      // Sorting
      sortBy: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.sortBy.label",
        description: "app.api.emails.messages.stats.get.sortBy.description",
        options: EmailSortFieldOptions,
        columns: 6,
        schema: z
          .enum(Object.values(EmailSortField) as [string, ...string[]])
          .default(EmailSortField.CREATED_AT),
      }),

      sortOrder: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.emails.messages.stats.get.sortOrder.label",
        description: "app.api.emails.messages.stats.get.sortOrder.description",
        options: SortOrderOptions,
        columns: 6,
        schema: z
          .enum(Object.values(SortOrder) as [string, ...string[]])
          .default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===

      // Current period email metrics
      totalEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.totalEmails",
        schema: z.coerce.number(),
      }),
      sentEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.sentEmails",
        schema: z.coerce.number(),
      }),
      deliveredEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.deliveredEmails",
        schema: z.coerce.number(),
      }),
      openedEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.openedEmails",
        schema: z.coerce.number(),
      }),
      clickedEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.clickedEmails",
        schema: z.coerce.number(),
      }),
      bouncedEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.bouncedEmails",
        schema: z.coerce.number(),
      }),
      failedEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.failedEmails",
        schema: z.coerce.number(),
      }),
      draftEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.draftEmails",
        schema: z.coerce.number(),
      }),

      // Engagement rates
      deliveryRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.deliveryRate",
        schema: z.coerce.number(),
      }),
      openRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.openRate",
        schema: z.coerce.number(),
      }),
      clickRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.clickRate",
        schema: z.coerce.number(),
      }),
      bounceRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.bounceRate",
        schema: z.coerce.number(),
      }),
      failureRate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.failureRate",
        schema: z.coerce.number(),
      }),

      // Provider/template/status/type metrics
      emailsByProvider: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsByProvider",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByTemplate: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsByTemplate",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByStatus: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsByStatus",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByType: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsByType",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      // User association metrics
      emailsWithUserId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsWithUserId",
        schema: z.coerce.number(),
      }),
      emailsWithoutUserId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messages.stats.get.response.emailsWithoutUserId",
        schema: z.coerce.number(),
      }),
      emailsWithLeadId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsWithLeadId",
        schema: z.coerce.number(),
      }),
      emailsWithoutLeadId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messages.stats.get.response.emailsWithoutLeadId",
        schema: z.coerce.number(),
      }),

      // Error metrics
      emailsWithErrors: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.emailsWithErrors",
        schema: z.coerce.number(),
      }),
      emailsWithoutErrors: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messages.stats.get.response.emailsWithoutErrors",
        schema: z.coerce.number(),
      }),
      averageRetryCount: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.averageRetryCount",
        schema: z.coerce.number(),
      }),
      maxRetryCount: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.maxRetryCount",
        schema: z.coerce.number(),
      }),

      // Performance metrics
      averageProcessingTime: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messages.stats.get.response.averageProcessingTime",
        schema: z.coerce.number(),
      }),
      averageDeliveryTime: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.messages.stats.get.response.averageDeliveryTime",
        schema: z.coerce.number(),
      }),

      // Historical data - complex nested structure
      historicalData: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.historicalData",
        schema: chartDataSchema,
      }),

      // Grouped stats - complex nested structure
      groupedStats: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.messages.stats.get.response.groupedStats",
        },
        { response: true },
        {
          byStatus: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                status: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.status",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byType: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                type: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.type",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byProvider: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                provider: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.provider",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byTemplate: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                template: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.template",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byEngagement: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                engagement: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.engagement",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byRetryCount: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                retryCount: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.retryCount",
                  schema: z.number(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
          byUserAssociation: responseArrayField(
            {
              type: WidgetType.CONTAINER,
            },
            objectField(
              { type: WidgetType.CONTAINER },
              { response: true },
              {
                association: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.association",
                  schema: z.string(),
                }),
                count: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.emails.messages.stats.get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            ),
          ),
        },
      ),

      // Metadata
      generatedAt: responseField({
        type: WidgetType.TEXT,
        content: "app.api.emails.messages.stats.get.response.generatedAt",
        schema: z.string(),
      }),

      dataRange: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.emails.messages.stats.get.response.dataRange",
        },
        { response: true },
        {
          from: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.emails.messages.stats.get.response.dataRange.from",
            schema: z.string(),
          }),
          to: responseField({
            type: WidgetType.TEXT,
            content: "app.api.emails.messages.stats.get.response.dataRange.to",
            schema: z.string(),
          }),
        },
      ),

      // Recent activity
      recentActivity: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          { type: WidgetType.CONTAINER },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.recentActivity.id",
              schema: z.string(),
            }),
            action: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.recentActivity.action",
              schema: z.string(),
            }),
            timestamp: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.recentActivity.timestamp",
              schema: z.string(),
            }),
            details: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.recentActivity.details",
              schema: z.string().optional(),
            }),
          },
        ),
      ),

      // Top performers
      topPerformingTemplates: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          { type: WidgetType.CONTAINER },
          { response: true },
          {
            template: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.template",
              schema: z.string(),
            }),
            sent: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.sent",
              schema: z.number(),
            }),
            delivered: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.delivered",
              schema: z.number(),
            }),
            opened: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.opened",
              schema: z.number(),
            }),
            clicked: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.clicked",
              schema: z.number(),
            }),
            deliveryRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.deliveryRate",
              schema: z.number(),
            }),
            openRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.openRate",
              schema: z.number(),
            }),
            clickRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingTemplates.clickRate",
              schema: z.number(),
            }),
          },
        ),
      ),

      topPerformingProviders: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          { type: WidgetType.CONTAINER },
          { response: true },
          {
            provider: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.provider",
              schema: z.string(),
            }),
            sent: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.sent",
              schema: z.number(),
            }),
            delivered: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.delivered",
              schema: z.number(),
            }),
            opened: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.opened",
              schema: z.number(),
            }),
            clicked: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.clicked",
              schema: z.number(),
            }),
            deliveryRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.deliveryRate",
              schema: z.number(),
            }),
            openRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.openRate",
              schema: z.number(),
            }),
            clickRate: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.emails.messages.stats.get.response.topPerformingProviders.clickRate",
              schema: z.number(),
            }),
          },
        ),
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.messages.stats.get.errors.validation.title",
      description:
        "app.api.emails.messages.stats.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.messages.stats.get.errors.unauthorized.title",
      description:
        "app.api.emails.messages.stats.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.messages.stats.get.errors.server.title",
      description:
        "app.api.emails.messages.stats.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.messages.stats.get.errors.unknown.title",
      description:
        "app.api.emails.messages.stats.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.messages.stats.get.errors.network.title",
      description:
        "app.api.emails.messages.stats.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.messages.stats.get.errors.forbidden.title",
      description:
        "app.api.emails.messages.stats.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.messages.stats.get.errors.notFound.title",
      description:
        "app.api.emails.messages.stats.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.messages.stats.get.errors.unsavedChanges.title",
      description:
        "app.api.emails.messages.stats.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.messages.stats.get.errors.conflict.title",
      description:
        "app.api.emails.messages.stats.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.emails.messages.stats.get.success.title",
    description: "app.api.emails.messages.stats.get.success.description",
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
} as const;
export default emailStatsEndpoints;
