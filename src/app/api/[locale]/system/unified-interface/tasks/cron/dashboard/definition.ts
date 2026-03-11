/**
 * Cron Task Dashboard API Definition
 * Unified view: tasks + recent history + alerts + stats in one call
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronTaskPriorityDB, CronTaskStatusDB } from "../../enum";
import { cronTaskResponseSchema } from "../tasks/definition";
import { CRON_DASHBOARD_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/* eslint-disable i18next/no-literal-string */

const recentExecutionSchema = z.object({
  status: z.enum(CronTaskStatusDB),
  completedAt: z.string().nullable(),
  durationMs: z.number().nullable(),
  resultSnippet: z.string().nullable(),
  errorSnippet: z.string().nullable(),
});

const dashboardTaskSchema = cronTaskResponseSchema.extend({
  recentExecutions: z.array(recentExecutionSchema),
  lastResultSummary: z.string().nullable(),
});

const alertSchema = z.object({
  taskId: z.string(),
  taskName: z.string(),
  priority: z.enum(CronTaskPriorityDB),
  consecutiveFailures: z.number(),
  lastError: z.string().nullable(),
  lastFailedAt: z.string().nullable(),
});

const statsSchema = z.object({
  totalTasks: z.number(),
  enabledTasks: z.number(),
  disabledTasks: z.number(),
  successRate24h: z.number().nullable(),
  failedTasks24h: z.number(),
  systemHealth: z.enum(["healthy", "warning", "critical"]),
});

/**
 * GET endpoint — Task Dashboard
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "dashboard"],
  aliases: [CRON_DASHBOARD_ALIAS, "task-dashboard"],
  title: "get.title",
  description: "get.description",
  icon: "clock",
  category: "app.endpointCategories.system",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["get.tags.tasks" as const, "get.tags.monitoring" as const],

  fields: customWidgetObject({
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        columns: 6,
        schema: z.coerce.number().int().min(1).max(100).optional().default(20),
      }),
      historyDepth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.historyDepth.label",
        description: "get.fields.historyDepth.description",
        columns: 6,
        schema: z.coerce.number().int().min(0).max(10).optional().default(3),
      }),

      // === RESPONSE FIELDS ===
      tasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.tasks.title",
        schema: z.array(dashboardTaskSchema),
      }),
      alerts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.alerts.title",
        schema: z.array(alertSchema),
      }),
      stats: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.stats.title",
        schema: statsSchema,
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
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

  examples: {
    requests: {
      default: {
        limit: 20,
        historyDepth: 3,
      },
    },
    responses: {
      default: {
        tasks: [],
        alerts: [],
        stats: {
          totalTasks: 5,
          enabledTasks: 4,
          disabledTasks: 1,
          successRate24h: 95.5,
          failedTasks24h: 1,
          systemHealth: "healthy",
        },
      },
    },
  },
});

export type CronDashboardRequestOutput = typeof GET.types.RequestOutput;
export type CronDashboardResponseOutput = typeof GET.types.ResponseOutput;

export default { GET } as const;
