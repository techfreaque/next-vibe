/**
 * Cron Queue API Definition
 * Lists enabled tasks sorted by next execution time ascending (queue order).
 * Defaults: enabled tasks only, all visibility (including hidden).
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  CronTaskHiddenFilter,
  CronTaskHiddenFilterDB,
  CronTaskHiddenFilterOptions,
  CronTaskPriorityDB,
  CronTaskPriorityOptions,
  CronTaskStatusDB,
  TaskCategoryDB,
  TaskCategoryOptions,
  TaskOutputModeDB,
} from "../../enum";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { CRON_QUEUE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CronQueueContainer = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.CronQueueContainer })),
);

/**
 * GET /cron/queue - Upcoming task queue sorted by next execution time
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "queue"],
  aliases: [CRON_QUEUE_ALIAS, "task-queue"],
  title: "get.title",
  description: "get.description",
  icon: "clock",
  category: "app.endpointCategories.systemTasks",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: customWidgetObject({
    render: CronQueueContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // Request filters
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.fields.priority.label",
        description: "get.fields.priority.description",
        placeholder: "get.fields.priority.placeholder",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.array(z.enum(CronTaskPriorityDB)).optional(),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.fields.category.label",
        description: "get.fields.category.description",
        placeholder: "get.fields.category.placeholder",
        options: TaskCategoryOptions,
        columns: 6,
        schema: z.array(z.enum(TaskCategoryDB)).optional(),
      }),
      hidden: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.hidden.label",
        description: "get.fields.hidden.description",
        placeholder: "get.fields.hidden.placeholder",
        options: CronTaskHiddenFilterOptions,
        columns: 6,
        schema: z
          .enum(CronTaskHiddenFilterDB)
          .optional()
          // Queue shows ALL by default (including hidden tasks)
          .default(CronTaskHiddenFilter.ALL),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label",
        description: "get.fields.search.description",
        placeholder: "get.fields.search.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label",
        description: "get.fields.limit.description",
        columns: 3,
        schema: z.string().optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label",
        description: "get.fields.offset.description",
        columns: 3,
        schema: z.string().optional(),
      }),

      // Response fields
      tasks: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.task.title",
          description: "get.response.task.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.id",
              schema: z.string(),
            }),
            routeId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.routeId",
              schema: z.string(),
            }),
            displayName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.displayName",
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.taskDescription",
              schema: z.string().nullable(),
            }),
            version: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.version",
              schema: z.string(),
            }),
            category: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.category",
              schema: z.enum(TaskCategoryDB),
            }),
            schedule: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.schedule",
              schema: z.string(),
            }),
            timezone: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.timezone",
              schema: z.string().nullable(),
            }),
            enabled: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.enabled",
              schema: z.boolean(),
            }),
            hidden: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.hidden",
              schema: z.boolean(),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.priority",
              schema: z.enum(CronTaskPriorityDB),
            }),
            timeout: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.timeout",
              schema: z.number().nullable(),
            }),
            retries: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.retries",
              schema: z.number().nullable(),
            }),
            retryDelay: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.retryDelay",
              schema: z.number().nullable(),
            }),
            outputMode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.outputMode",
              schema: z.enum(TaskOutputModeDB),
            }),
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.userId",
              schema: z.string().nullable(),
            }),
            lastExecutedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.lastExecutedAt",
              schema: z.string().nullable(),
            }),
            lastExecutionStatus: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.lastExecutionStatus",
              schema: z.enum(CronTaskStatusDB).nullable(),
            }),
            lastExecutionError: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.lastExecutionError",
              schema: z.string().nullable(),
            }),
            lastExecutionDuration: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.lastExecutionDuration",
              schema: z.number().nullable(),
            }),
            nextExecutionAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.nextExecutionAt",
              schema: z.string().nullable(),
            }),
            executionCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.executionCount",
              schema: z.number(),
            }),
            consecutiveFailures: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.consecutiveFailures",
              schema: z.number(),
            }),
            successCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.successCount",
              schema: z.number(),
            }),
            errorCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.errorCount",
              schema: z.number(),
            }),
            averageExecutionTime: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.averageExecutionTime",
              schema: z.number().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.createdAt",
              schema: z.string(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.updatedAt",
              schema: z.string(),
            }),
          },
        }),
      }),
      totalTasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalTasks",
        schema: z.coerce.number(),
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
      title: "get.errors.internal.title",
      description: "get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsaved.title",
      description: "get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get.success.retrieved.title",
    description: "get.success.retrieved.description",
  },
  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },
  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        tasks: [],
        totalTasks: 0,
      },
    },
  },
});

export const endpoints = { GET };

export type CronQueueListRequestInput = typeof GET.types.RequestInput;
export type CronQueueListRequestOutput = typeof GET.types.RequestOutput;
export type CronQueueListResponseInput = typeof GET.types.ResponseInput;
export type CronQueueListResponseOutput = typeof GET.types.ResponseOutput;
export type CronQueueTask = CronQueueListResponseOutput["tasks"][number];

export default endpoints;
