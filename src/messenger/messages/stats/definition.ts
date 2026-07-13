/**
 * Email Stats API Definition
 * Defines the API endpoint for email statistics and analytics with historical charts
 */

import { chartDataSchema } from "next-vibe/core/core-utils/stats-filtering.schema";
import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
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

import {
  MessageSortField,
  MessageSortFieldDB,
  MessageSortFieldOptions,
  MessageStatus,
  MessageStatusFilter,
  MessageStatusFilterDB,
  MessageStatusFilterOptions,
  MessageType,
  MessageTypeFilter,
  MessageTypeFilterDB,
  MessageTypeFilterOptions,
  SortOrder,
  SortOrderDB,
  SortOrderOptions,
} from "../enum";
import { EMAIL_STATS_ALIAS } from "./constants";
import {
  ChartType,
  ChartTypeDB,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetDB,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodDB,
  TimePeriodOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const EmailStatsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EmailStatsContainer })),
);

/**
 * Get Email Stats Endpoint (GET)
 * Retrieves comprehensive email statistics as historical charts only
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "messages", "stats"],
  aliases: [EMAIL_STATS_ALIAS],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],

  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "messenger",
  subCategory: "Messages",
  icon: "bar-chart-3",
  tags: ["tags.stats", "tags.analytics"],

  fields: customWidgetObject({
    render: EmailStatsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS (Filters) ===

      // Time-based filtering
      timePeriod: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.timePeriod.label",
        description: "get.timePeriod.description",
        options: TimePeriodOptions,
        columns: 4,
        schema: z.enum(TimePeriodDB).default(TimePeriod.day),
      }),

      dateRangePreset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.dateRangePreset.label",
        description: "get.dateRangePreset.description",
        options: DateRangePresetOptions,
        columns: 4,
        schema: z.enum(DateRangePresetDB).default(DateRangePreset.last_30_days),
      }),

      dateFrom: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateFrom.label",
        description: "get.dateFrom.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      dateTo: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "get.dateTo.label",
        description: "get.dateTo.description",
        columns: 6,
        schema: dateSchema.optional(),
      }),

      chartType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.chartType.label",
        description: "get.chartType.description",
        options: ChartTypeOptions,
        columns: 4,
        schema: z.enum(ChartTypeDB).default(ChartType.line),
      }),

      includeComparison: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.includeComparison.label",
        description: "get.includeComparison.description",
        columns: 6,
        schema: z.coerce.boolean().default(false),
      }),

      // Email-specific filters
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.status.label",
        description: "get.status.description",
        columns: 3,
        options: MessageStatusFilterOptions,
        schema: z.enum(MessageStatusFilterDB).default(MessageStatusFilter.ANY),
      }),

      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.type.label",
        description: "get.type.description",
        columns: 3,
        options: MessageTypeFilterOptions,
        schema: z.enum(MessageTypeFilterDB).default(MessageTypeFilter.ANY),
      }),

      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.search.label",
        description: "get.search.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      // Sorting
      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.sortBy.label",
        description: "get.sortBy.description",
        options: MessageSortFieldOptions,
        columns: 6,
        schema: z.enum(MessageSortFieldDB).default(MessageSortField.CREATED_AT),
      }),

      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.sortOrder.label",
        description: "get.sortOrder.description",
        options: SortOrderOptions,
        columns: 6,
        schema: z.enum(SortOrderDB).default(SortOrder.DESC),
      }),

      // === RESPONSE FIELDS ===

      // Current period email metrics
      totalEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.totalEmails",
        schema: z.coerce.number(),
      }),
      sentEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.sentEmails",
        schema: z.coerce.number(),
      }),
      deliveredEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.deliveredEmails",
        schema: z.coerce.number(),
      }),
      openedEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.openedEmails",
        schema: z.coerce.number(),
      }),
      clickedEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.clickedEmails",
        schema: z.coerce.number(),
      }),
      bouncedEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.bouncedEmails",
        schema: z.coerce.number(),
      }),
      failedEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failedEmails",
        schema: z.coerce.number(),
      }),
      draftEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.draftEmails",
        schema: z.coerce.number(),
      }),

      // Engagement rates
      deliveryRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.deliveryRate",
        schema: z.coerce.number(),
      }),
      openRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.openRate",
        schema: z.coerce.number(),
      }),
      clickRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.clickRate",
        schema: z.coerce.number(),
      }),
      bounceRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.bounceRate",
        schema: z.coerce.number(),
      }),
      failureRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.failureRate",
        schema: z.coerce.number(),
      }),

      // Provider/template/status/type metrics
      emailsByProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsByProvider",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByTemplate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsByTemplate",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsByStatus",
        schema: z.record(z.string(), z.coerce.number()),
      }),
      emailsByType: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsByType",
        schema: z.record(z.string(), z.coerce.number()),
      }),

      // User association metrics
      emailsWithUserId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithUserId",
        schema: z.coerce.number(),
      }),
      emailsWithoutUserId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithoutUserId",
        schema: z.coerce.number(),
      }),
      emailsWithLeadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithLeadId",
        schema: z.coerce.number(),
      }),
      emailsWithoutLeadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithoutLeadId",
        schema: z.coerce.number(),
      }),

      // Error metrics
      emailsWithErrors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithErrors",
        schema: z.coerce.number(),
      }),
      emailsWithoutErrors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.emailsWithoutErrors",
        schema: z.coerce.number(),
      }),
      averageRetryCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.averageRetryCount",
        schema: z.coerce.number(),
      }),
      maxRetryCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.maxRetryCount",
        schema: z.coerce.number(),
      }),

      // Performance metrics
      averageProcessingTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.averageProcessingTime",
        schema: z.coerce.number(),
      }),
      averageDeliveryTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.averageDeliveryTime",
        schema: z.coerce.number(),
      }),

      // Historical data - complex nested structure
      historicalData: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.historicalData",
        schema: chartDataSchema,
      }),

      // Grouped stats - complex nested structure
      groupedStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.groupedStats.title",
        usage: { response: true },
        children: {
          byStatus: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                status: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.status",
                  schema: z.enum(MessageStatus),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byType: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                type: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.type",
                  schema: z.string(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byProvider: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                provider: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.provider",
                  schema: z.string(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byTemplate: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                template: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.template",
                  schema: z.string(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byEngagement: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                engagement: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.engagement",
                  schema: z.string(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byRetryCount: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                retryCount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.retryCount",
                  schema: z.number(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
          byUserAssociation: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              usage: { response: true },
              children: {
                association: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.association",
                  schema: z.string(),
                }),
                count: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  label: "get.response.groupedStats.count",
                  schema: z.number(),
                }),
              },
            }),
          }),
        },
      }),

      // Metadata
      generatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.generatedAt",
        schema: dateSchema,
      }),

      dataRange: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.dataRange.title",
        usage: { response: true },
        children: {
          from: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.dataRange.from",
            schema: dateSchema,
          }),
          to: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "get.response.dataRange.to",
            schema: dateSchema,
          }),
        },
      }),

      // Recent activity
      recentActivity: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentActivity.id",
              schema: z.string(),
            }),
            action: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentActivity.action",
              schema: z.string(),
            }),
            timestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentActivity.timestamp",
              schema: dateSchema,
            }),
            details: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.recentActivity.details",
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      // Top performers
      topPerformingTemplates: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            template: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.template",
              schema: z.string(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.sent",
              schema: z.number(),
            }),
            delivered: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.delivered",
              schema: z.number(),
            }),
            opened: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.opened",
              schema: z.number(),
            }),
            clicked: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.clicked",
              schema: z.number(),
            }),
            deliveryRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.deliveryRate",
              schema: z.number(),
            }),
            openRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.openRate",
              schema: z.number(),
            }),
            clickRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingTemplates.clickRate",
              schema: z.number(),
            }),
          },
        }),
      }),

      topPerformingProviders: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.provider",
              schema: z.string(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.sent",
              schema: z.number(),
            }),
            delivered: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.delivered",
              schema: z.number(),
            }),
            opened: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.opened",
              schema: z.number(),
            }),
            clicked: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.clicked",
              schema: z.number(),
            }),
            deliveryRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.deliveryRate",
              schema: z.number(),
            }),
            openRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.openRate",
              schema: z.number(),
            }),
            clickRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.topPerformingProviders.clickRate",
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
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
        emailsByType: {
          [MessageType.TRANSACTIONAL]: 500,
          [MessageType.MARKETING]: 300,
          [MessageType.NOTIFICATION]: 150,
          [MessageType.SYSTEM]: 50,
          [MessageType.LEAD_CAMPAIGN]: 0,
          [MessageType.USER_COMMUNICATION]: 0,
        },
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
        generatedAt: "2024-01-15T10:00:00.000Z",
        dataRange: {
          from: "2024-01-15T10:00:00.000Z",
          to: "2024-01-15T10:00:00.000Z",
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
export type EmailStatsGroupedStats =
  EmailStatsGetResponseTypeOutput["groupedStats"];
export type EmailStatsByStatus = EmailStatsGroupedStats["byStatus"][number];
export type EmailStatsByType = EmailStatsGroupedStats["byType"][number];
export type EmailStatsByProvider = EmailStatsGroupedStats["byProvider"][number];
export type EmailStatsByTemplate = EmailStatsGroupedStats["byTemplate"][number];
export type EmailStatsByEngagement =
  EmailStatsGroupedStats["byEngagement"][number];
export type EmailStatsByRetryCount =
  EmailStatsGroupedStats["byRetryCount"][number];
export type EmailStatsByUserAssociation =
  EmailStatsGroupedStats["byUserAssociation"][number];
export type EmailStatsRecentActivity =
  EmailStatsGetResponseTypeOutput["recentActivity"][number];
export type EmailStatsTopPerformingTemplate =
  EmailStatsGetResponseTypeOutput["topPerformingTemplates"][number];
export type EmailStatsTopPerformingProvider =
  EmailStatsGetResponseTypeOutput["topPerformingProviders"][number];
export type EmailStatsHistoricalData =
  EmailStatsGetResponseTypeOutput["historicalData"];

/**
 * Export definitions
 */
const emailStatsEndpoints = {
  GET,
} as const;
export default emailStatsEndpoints;
