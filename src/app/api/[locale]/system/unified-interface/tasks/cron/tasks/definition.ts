/**
 * Cron Tasks List API Definition
 * Clean implementation following spec.md and MIGRATION_GUIDE.md
 * Provides endpoints for listing and managing cron tasks
 */

import { z } from "zod";

import type { CronTaskRecentExecution } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/definition";

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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import {
  CronTaskEnabledFilter,
  CronTaskEnabledFilterDB,
  CronTaskEnabledFilterOptions,
  CronTaskHiddenFilter,
  CronTaskHiddenFilterDB,
  CronTaskHiddenFilterOptions,
  CronTaskPriority,
  CronTaskPriorityDB,
  CronTaskPriorityOptions,
  CronTaskStatusDB,
  CronTaskStatusOptions,
  TaskCategory,
  TaskCategoryDB,
  TaskCategoryOptions,
  TaskOutputModeDB,
  TaskOutputModeOptions,
} from "../../enum";
import { taskInputSchema, taskOwnerSchema } from "../db";
import { CRON_CREATE_ALIAS, CRON_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const CronTasksContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CronTasksContainer })),
);

/**
 * GET /cron/tasks - List cron tasks
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "tasks"],
  aliases: [CRON_LIST_ALIAS, "tasks", "cron-list", "cron-tasks"],
  title: "get.title",
  description: "get.description",
  icon: "clock",
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksCron",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: customWidgetObject({
    render: CronTasksContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // Request fields for filtering
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "get.fields.status.label",
        description: "get.fields.status.description",
        placeholder: "get.fields.status.placeholder",
        options: CronTaskStatusOptions,
        columns: 6,
        schema: z.array(z.enum(CronTaskStatusDB)).optional(),
      }),
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
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.fields.enabled.label",
        description: "get.fields.enabled.description",
        placeholder: "get.fields.enabled.placeholder",
        options: CronTaskEnabledFilterOptions,
        columns: 6,
        schema: z
          .enum(CronTaskEnabledFilterDB)
          .optional()
          .default(CronTaskEnabledFilter.ALL),
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
          .default(CronTaskHiddenFilter.VISIBLE),
      }),
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label",
        description: "get.fields.search.description",
        placeholder: "get.fields.search.placeholder",
        columns: 8,
        schema: z.string().optional(),
      }),
      sort: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.sort.label",
        description: "get.fields.sort.description",
        columns: 4,
        schema: z.string().optional().default("name_asc"),
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
            shortId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.shortId",
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
            owner: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.owner",
              schema: taskOwnerSchema,
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
            taskInput: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.taskInput",
              schema: taskInputSchema.optional().default({}),
            }),
            runOnce: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.runOnce",
              schema: z.boolean(),
            }),
            notificationTargets: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.notificationTargets",
              schema: z
                .array(
                  z.object({
                    type: z.enum(["email", "sms", "webhook"]),
                    target: z.string(),
                  }),
                )
                .optional()
                .default([]),
            }),
            targetInstance: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.targetInstance",
              schema: z.string().nullable(),
            }),
            tags: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.task.tags",
              schema: z.array(z.string()).optional().default([]),
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
      countsByStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalTasks",
        schema: z.object({
          all: z.number(),
          running: z.number(),
          completed: z.number(),
          failed: z.number(),
          pending: z.number(),
          disabled: z.number(),
        }),
      }),
      countsByHidden: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalTasks",
        schema: z.object({
          visible: z.number(),
          hidden: z.number(),
          all: z.number(),
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
        countsByStatus: {
          all: 0,
          running: 0,
          completed: 0,
          failed: 0,
          pending: 0,
          disabled: 0,
        },
        countsByHidden: {
          visible: 0,
          hidden: 0,
          all: 0,
        },
      },
    },
  },
});

/**
 * POST /cron/tasks - Create a new cron task
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "cron", "tasks"],
  aliases: [CRON_CREATE_ALIAS],
  title: "post.title",
  description: "post.description",
  icon: "clock",
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksCron",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Request fields
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.id.label",
        description: "post.fields.id.description",
        placeholder: "post.fields.id.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),
      routeId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.routeId.label",
        description: "post.fields.routeId.description",
        placeholder: "post.fields.routeId.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.displayName.label",
        description: "post.fields.displayName.description",
        placeholder: "post.fields.displayName.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.description.label",
        description: "post.fields.description.description",
        placeholder: "post.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),
      schedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.schedule.label",
        description: "post.fields.schedule.description",
        placeholder: "post.fields.schedule.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.priority.label",
        description: "post.fields.priority.description",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.enum(CronTaskPriorityDB).default(CronTaskPriority.MEDIUM),
      }),
      category: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.category.label",
        description: "post.fields.category.description",
        options: TaskCategoryOptions,
        columns: 6,
        schema: z.enum(TaskCategoryDB).default(TaskCategory.SYSTEM),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.enabled.label",
        description: "post.fields.enabled.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      hidden: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.hidden.label",
        description: "post.fields.hidden.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      outputMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        options: TaskOutputModeOptions,
        label: "post.fields.outputMode.label",
        description: "post.fields.outputMode.description",
        columns: 6,
        schema: z.enum(TaskOutputModeDB).default(TaskOutputModeDB[0]),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.timeout.label",
        description: "post.fields.timeout.description",
        columns: 4,
        schema: z.coerce.number().default(300000),
      }),
      retries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.retries.label",
        description: "post.fields.retries.description",
        columns: 4,
        schema: z.coerce.number().default(3),
      }),
      retryDelay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.retryDelay.label",
        description: "post.fields.retryDelay.description",
        columns: 4,
        schema: z.coerce.number().default(5000),
      }),
      taskInput: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.taskInput.label",
        description: "post.fields.taskInput.description",
        columns: 12,
        schema: taskInputSchema.optional(),
      }),
      runOnce: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.runOnce.label",
        description: "post.fields.runOnce.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      targetInstance: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.targetInstance.label",
        description: "post.fields.targetInstance.description",
        placeholder: "post.fields.targetInstance.placeholder",
        columns: 6,
        schema: z.string().optional(),
      }),

      // Response - return the created task
      task: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.task.title",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.id",
            schema: z.string(),
          }),
          shortId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.shortId",
            schema: z.string(),
          }),
          routeId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.routeId",
            schema: z.string(),
          }),
          displayName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.displayName",
            schema: z.string(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.taskDescription",
            schema: z.string().nullable(),
          }),
          version: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.version",
            schema: z.string(),
          }),
          category: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.category",
            schema: z.enum(TaskCategoryDB),
          }),
          schedule: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.schedule",
            schema: z.string(),
          }),
          timezone: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.timezone",
            schema: z.string().nullable(),
          }),
          enabled: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.enabled",
            schema: z.boolean(),
          }),
          hidden: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.hidden",
            schema: z.boolean(),
          }),
          priority: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.priority",
            schema: z.enum(CronTaskPriorityDB),
          }),
          timeout: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.timeout",
            schema: z.number().nullable(),
          }),
          retries: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.retries",
            schema: z.number().nullable(),
          }),
          retryDelay: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.retryDelay",
            schema: z.number().nullable(),
          }),
          taskInput: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.taskInput",
            schema: taskInputSchema.optional().default({}),
          }),
          runOnce: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.runOnce",
            schema: z.boolean(),
          }),
          outputMode: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.outputMode",
            schema: z.enum(TaskOutputModeDB),
          }),
          notificationTargets: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.notificationTargets",
            schema: z
              .array(
                z.object({
                  type: z.enum(["email", "sms", "webhook"]),
                  target: z.string(),
                }),
              )
              .optional()
              .default([]),
          }),
          lastExecutedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.lastExecutedAt",
            schema: z.string().nullable(),
          }),
          lastExecutionStatus: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.lastExecutionStatus",
            schema: z.enum(CronTaskStatusDB).nullable(),
          }),
          lastExecutionError: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.lastExecutionError",
            schema: z.string().nullable(),
          }),
          lastExecutionDuration: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.lastExecutionDuration",
            schema: z.number().nullable(),
          }),
          nextExecutionAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.nextExecutionAt",
            schema: z.string().nullable(),
          }),
          executionCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.executionCount",
            schema: z.number(),
          }),
          successCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.successCount",
            schema: z.number(),
          }),
          errorCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.errorCount",
            schema: z.number(),
          }),
          averageExecutionTime: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.averageExecutionTime",
            schema: z.number().nullable(),
          }),
          consecutiveFailures: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.consecutiveFailures",
            schema: z.number(),
          }),
          targetInstance: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.targetInstance",
            schema: z.string().nullable(),
          }),
          tags: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.tags",
            schema: z.array(z.string()).optional().default([]),
          }),
          owner: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.owner",
            schema: taskOwnerSchema,
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.createdAt",
            schema: z.string(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.task.updatedAt",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },
  options: {
    mutationOptions: {
      onSuccess: async ({ responseData, logger }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const newTask = responseData.task;
        apiClient.updateEndpointData(GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            success: true as const,
            data: {
              ...old.data,
              tasks: [newTask, ...old.data.tasks],
              totalTasks: old.data.totalTasks + 1,
            },
          };
        });
      },
    },
  },
  successTypes: {
    title: "post.success.created.title",
    description: "post.success.created.description",
  },
  examples: {
    requests: {
      default: {
        id: "daily-cleanup",
        routeId: "newsletter_unsubscribe_GET",
        displayName: "Daily Cleanup Task",
        description: "Cleans up old data",
        schedule: "0 0 * * *",
        priority: CronTaskPriority.MEDIUM,
        category: TaskCategory.MAINTENANCE,
        enabled: true,
        outputMode: TaskOutputModeDB[0],
        timeout: 300000,
        retries: 3,
        retryDelay: 5000,
        taskInput: {},
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          shortId: "task-123",
          routeId: "newsletter_unsubscribe_GET",
          displayName: "Daily Cleanup Task",
          description: "Cleans up old data",
          version: "1.0.0",
          category: TaskCategory.MAINTENANCE,
          schedule: "0 0 * * *",
          timezone: "UTC",
          enabled: true,
          hidden: false,
          priority: CronTaskPriority.MEDIUM,
          timeout: 300000,
          retries: 3,
          retryDelay: 5000,
          taskInput: {},
          runOnce: false,
          outputMode: TaskOutputModeDB[0],
          notificationTargets: [],
          lastExecutedAt: null,
          lastExecutionStatus: null,
          lastExecutionError: null,
          lastExecutionDuration: null,
          nextExecutionAt: null,
          executionCount: 0,
          successCount: 0,
          errorCount: 0,
          averageExecutionTime: null,
          consecutiveFailures: 0,
          targetInstance: null,
          tags: [],
          owner: { type: "system" },
          createdAt: "2024-01-15T10:00:00.000Z",
          updatedAt: "2024-01-15T10:00:00.000Z",
        },
      },
    },
  },
});

// Export the endpoint following MIGRATION_GUIDE pattern
export const endpoints = { GET, POST };

// Type exports for GET endpoint
export type CronTaskListRequestInput = typeof GET.types.RequestInput;
export type CronTaskListRequestOutput = typeof GET.types.RequestOutput;
export type CronTaskListResponseInput = typeof GET.types.ResponseInput;
export type CronTaskListResponseOutput = typeof GET.types.ResponseOutput;

// Type exports for POST endpoint
export type CronTaskCreateRequestInput = typeof POST.types.RequestInput;
export type CronTaskCreateRequestOutput = typeof POST.types.RequestOutput;
export type CronTaskCreateResponseInput = typeof POST.types.ResponseInput;
export type CronTaskCreateResponseOutput = typeof POST.types.ResponseOutput;

// Individual task type - derived from the GET list response items
export type CronTaskResponseType = CronTaskListResponseOutput["tasks"][number];

export type CronTaskItem = Pick<
  CronTaskResponseType,
  | "shortId"
  | "enabled"
  | "displayName"
  | "description"
  | "schedule"
  | "lastExecutedAt"
  | "lastExecutionStatus"
  | "lastExecutionDuration"
  | "errorCount"
  | "routeId"
  | "priority"
  | "consecutiveFailures"
> & {
  lastResultSummary: string | null;
  recentExecutions: CronTaskRecentExecution[] | null;
};

export default endpoints;
