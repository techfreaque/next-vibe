/**
 * Cron Tasks List API Definition
 * Clean implementation following spec.md and MIGRATION_GUIDE.md
 * Provides endpoints for listing and managing cron tasks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  CronTaskPriority,
  CronTaskPriorityDB,
  CronTaskPriorityOptions,
  CronTaskStatusDB,
  CronTaskStatusOptions,
  TaskCategory,
  TaskCategoryDB,
  TaskCategoryOptions,
} from "../../enum";

/**
 * GET /cron/tasks - List cron tasks
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "tasks", "cron", "tasks"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.description",
  icon: "clock",
  category: "app.api.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request fields for filtering
      status: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.status.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.status.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.status.placeholder",
        options: CronTaskStatusOptions,
        columns: 6,
        schema: z.array(z.enum(CronTaskStatusDB)).optional(),
      }),
      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.priority.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.priority.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.priority.placeholder",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.array(z.enum(CronTaskPriorityDB)).optional(),
      }),
      category: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.category.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.category.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.category.placeholder",
        options: TaskCategoryOptions,
        columns: 6,
        schema: z.array(z.enum(TaskCategoryDB)).optional(),
      }),
      enabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.enabled.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.enabled.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),
      limit: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.limit.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.limit.description",
        columns: 3,
        schema: z.string().optional(),
      }),
      offset: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.offset.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.fields.offset.description",
        columns: 3,
        schema: z.string().optional(),
      }),

      // Response fields
      tasks: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.title",
            description:
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.description",
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.id",
              schema: z.string(),
            }),
            name: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.name",
              schema: z.string(),
            }),
            description: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.taskDescription",
              schema: z.string().nullable(),
            }),
            version: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.version",
              schema: z.string(),
            }),
            category: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.category",
              schema: z.string(),
            }),
            schedule: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.schedule",
              schema: z.string(),
            }),
            timezone: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.timezone",
              schema: z.string().nullable(),
            }),
            enabled: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.enabled",
              schema: z.boolean(),
            }),
            priority: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.priority",
              schema: z.enum(CronTaskPriorityDB),
            }),
            timeout: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.timeout",
              schema: z.number().nullable(),
            }),
            retries: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.retries",
              schema: z.number().nullable(),
            }),
            retryDelay: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.retryDelay",
              schema: z.number().nullable(),
            }),
            lastExecutedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.lastExecutedAt",
              schema: z.string().nullable(),
            }),
            lastExecutionStatus: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.lastExecutionStatus",
              schema: z.enum(CronTaskStatusDB).nullable(),
            }),
            lastExecutionError: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.lastExecutionError",
              schema: z.string().nullable(),
            }),
            lastExecutionDuration: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.lastExecutionDuration",
              schema: z.number().nullable(),
            }),
            nextExecutionAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.nextExecutionAt",
              schema: z.string().nullable(),
            }),
            executionCount: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.executionCount",
              schema: z.number(),
            }),
            successCount: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.successCount",
              schema: z.number(),
            }),
            errorCount: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.errorCount",
              schema: z.number(),
            }),
            averageExecutionTime: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.averageExecutionTime",
              schema: z.number().nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.createdAt",
              schema: z.string(),
            }),
            updatedAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.task.updatedAt",
              schema: z.string(),
            }),
          },
        ),
      ),
      totalTasks: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.response.totalTasks",
        schema: z.coerce.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.success.retrieved.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.success.retrieved.description",
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

/**
 * POST /cron/tasks - Create a new cron task
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "tasks", "cron", "tasks"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.description",
  icon: "clock",
  category: "app.api.system.unifiedInterface.tasks.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request fields
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.name.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.name.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.name.placeholder",
        columns: 12,
        schema: z.string().min(1),
      }),
      description: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.description.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.description.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),
      schedule: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.schedule.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.schedule.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.schedule.placeholder",
        columns: 6,
        schema: z.string().min(1),
      }),
      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.priority.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.priority.description",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.enum(CronTaskPriorityDB).default(CronTaskPriority.MEDIUM),
      }),
      category: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.category.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.category.description",
        options: TaskCategoryOptions,
        columns: 6,
        schema: z.enum(TaskCategoryDB).default(TaskCategory.SYSTEM),
      }),
      enabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.enabled.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.enabled.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.timeout.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.timeout.description",
        columns: 4,
        schema: z.coerce.number().default(300000),
      }),
      retries: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.retries.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.retries.description",
        columns: 4,
        schema: z.coerce.number().default(3),
      }),
      retryDelay: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.retryDelay.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.fields.retryDelay.description",
        columns: 4,
        schema: z.coerce.number().default(5000),
      }),

      // Response - return the created task
      task: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.response.task.title",
        schema: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          version: z.string(),
          category: z.string(),
          schedule: z.string(),
          timezone: z.string().nullable(),
          enabled: z.boolean(),
          priority: z.enum(CronTaskPriorityDB),
          timeout: z.number().nullable(),
          retries: z.number().nullable(),
          retryDelay: z.number().nullable(),
          lastExecutedAt: z.string().nullable(),
          lastExecutionStatus: z.enum(CronTaskStatusDB).nullable(),
          lastExecutionError: z.string().nullable(),
          lastExecutionDuration: z.number().nullable(),
          nextExecutionAt: z.string().nullable(),
          executionCount: z.number(),
          successCount: z.number(),
          errorCount: z.number(),
          averageExecutionTime: z.number().nullable(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.unsaved.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.success.created.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.success.created.description",
  },
  examples: {
    requests: {
      default: {
        name: "Daily Cleanup Task",
        description: "Cleans up old data",
        schedule: "0 0 * * *",
        priority: CronTaskPriority.MEDIUM,
        category: TaskCategory.MAINTENANCE,
        enabled: true,
        timeout: 300000,
        retries: 3,
        retryDelay: 5000,
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          name: "Daily Cleanup Task",
          description: "Cleans up old data",
          version: "1.0.0",
          category: TaskCategory.MAINTENANCE,
          schedule: "0 0 * * *",
          timezone: "UTC",
          enabled: true,
          priority: CronTaskPriority.MEDIUM,
          timeout: 300000,
          retries: 3,
          retryDelay: 5000,
          lastExecutedAt: null,
          lastExecutionStatus: null,
          lastExecutionError: null,
          lastExecutionDuration: null,
          nextExecutionAt: null,
          executionCount: 0,
          successCount: 0,
          errorCount: 0,
          averageExecutionTime: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

// Individual task type extracted from response
export type CronTaskResponseType = CronTaskListResponseOutput["tasks"][number];

export default endpoints;
