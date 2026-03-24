/**
 * Campaign Stats API Definition
 * GET endpoint for email campaign performance statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  CronTaskPriorityDB,
  CronTaskStatusDB,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  EmailJourneyVariantFilter,
  EmailJourneyVariantFilterOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import { CampaignStatsWidget } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "stats"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leadsCampaigns",
  icon: "bar-chart-3",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: CampaignStatsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      journeyVariant: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.journeyVariant.label",
        description: "get.fields.journeyVariant.description",
        options: EmailJourneyVariantFilterOptions,
        columns: 6,
        schema: z.enum(EmailJourneyVariantFilter).optional(),
      }),

      // Top-level counts
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.number(),
      }),
      pending: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pending",
        schema: z.number(),
      }),
      sent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.sent",
        schema: z.number(),
      }),
      delivered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.delivered",
        schema: z.number(),
      }),
      opened: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.opened",
        schema: z.number(),
      }),
      clicked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.clicked",
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.failed",
        schema: z.number(),
      }),

      // Total leads & unique persons
      totalLeads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalLeads",
        schema: z.number(),
      }),
      linkedLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.linkedLeadsCount",
        schema: z.number(),
      }),
      uniquePersonsEstimate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.uniquePersonsEstimate",
        schema: z.number(),
      }),

      // Queue health
      pendingLeadsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.pendingLeadsCount",
        schema: z.number(),
      }),
      emailsScheduledToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.emailsScheduledToday",
        schema: z.number(),
      }),

      // Derived rates (0–1 fractions)
      openRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.openRate",
        schema: z.number(),
      }),
      clickRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.clickRate",
        schema: z.number(),
      }),
      deliveryRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deliveryRate",
        schema: z.number(),
      }),
      failureRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.failureRate",
        schema: z.number(),
      }),

      // Breakdowns
      byStage: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.byStage",
        description: "get.response.byStage",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            stage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.byStage",
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.total",
              schema: z.number(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sent",
              schema: z.number(),
            }),
            opened: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.opened",
              schema: z.number(),
            }),
            clicked: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.clicked",
              schema: z.number(),
            }),
            failed: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.failed",
              schema: z.number(),
            }),
          },
        }),
      }),

      quotaProgress: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.quotaProgress",
        description: "get.response.quotaProgress",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            locale: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.quotaProgress",
              schema: z.string(),
            }),
            weeklyQuota: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.total",
              schema: z.number(),
            }),
            startedThisWeek: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sent",
              schema: z.number(),
            }),
            remaining: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.pending",
              schema: z.number(),
            }),
            perRunBudget: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.quotaProgress",
              schema: z.number(),
            }),
            totalRunsPerWeek: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.quotaProgress",
              schema: z.number(),
            }),
            accumulator: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.quotaProgress",
              schema: z.number(),
            }),
          },
        }),
      }),

      campaignTasks: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.campaignTasks",
        description: "get.response.campaignTasks",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string(),
            }),
            shortId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string(),
            }),
            routeId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string(),
            }),
            displayName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string(),
            }),
            schedule: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string(),
            }),
            enabled: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.boolean(),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.enum(CronTaskPriorityDB),
            }),
            lastExecutedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string().nullable(),
            }),
            nextExecutionAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string().nullable(),
            }),
            executionCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.number(),
            }),
            successCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.number(),
            }),
            averageExecutionTime: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.number().nullable(),
            }),
            lastResultSummary: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.campaignTasks",
              schema: z.string().nullable(),
            }),
            recentExecutions: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "get.response.campaignTasks",
              description: "get.response.campaignTasks",
              child: objectField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 12,
                usage: { response: true },
                children: {
                  status: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.campaignTasks",
                    schema: z.enum(CronTaskStatusDB),
                  }),
                  completedAt: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.campaignTasks",
                    schema: z.string().nullable(),
                  }),
                  durationMs: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.campaignTasks",
                    schema: z.number().nullable(),
                  }),
                  resultSnippet: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.campaignTasks",
                    schema: z.string().nullable(),
                  }),
                  errorSnippet: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "get.response.campaignTasks",
                    schema: z.string().nullable(),
                  }),
                },
              }),
            }),
          },
        }),
      }),

      alerts: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.alerts",
        description: "get.response.alerts",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            taskId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.string(),
            }),
            taskName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.string(),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.enum(CronTaskPriorityDB),
            }),
            consecutiveFailures: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.number(),
            }),
            lastError: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.string().nullable(),
            }),
            lastFailedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.alerts",
              schema: z.string().nullable(),
            }),
          },
        }),
      }),

      taskStats: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          totalTasks: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.number(),
          }),
          enabledTasks: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.number(),
          }),
          disabledTasks: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.number(),
          }),
          successRate24h: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.number().nullable(),
          }),
          failedTasks24h: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.number(),
          }),
          // eslint-disable-next-line i18next/no-literal-string
          systemHealth: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.taskStats",
            schema: z.enum(["healthy", "warning", "critical"]),
          }),
        },
      }),

      byJourneyVariant: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.byJourneyVariant",
        description: "get.response.byJourneyVariant",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            variant: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.byJourneyVariant",
              schema: z.string(),
            }),
            total: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.total",
              schema: z.number(),
            }),
            sent: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.sent",
              schema: z.number(),
            }),
            openRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.openRate",
              schema: z.number(),
            }),
            clickRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.clickRate",
              schema: z.number(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
        openRate: 0,
        clickRate: 0,
        deliveryRate: 0,
        failureRate: 0,
        totalLeads: 0,
        linkedLeadsCount: 0,
        uniquePersonsEstimate: 0,
        pendingLeadsCount: 0,
        emailsScheduledToday: 0,
        byStage: [],
        byJourneyVariant: [],
        quotaProgress: [],
        campaignTasks: [],
        alerts: [],
        taskStats: {
          totalTasks: 0,
          enabledTasks: 0,
          disabledTasks: 0,
          successRate24h: null,
          failedTasks24h: 0,
          systemHealth: "healthy" as const,
        },
      },
    },
  },
});

export type CampaignStatsGetRequestOutput = typeof GET.types.RequestOutput;
export type CampaignStatsGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
