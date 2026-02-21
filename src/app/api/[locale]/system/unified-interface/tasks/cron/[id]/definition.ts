/**
 * Individual Cron Task API Definition
 * Endpoints for managing individual cron tasks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  CronTaskPriority,
  CronTaskPriorityDB,
  CronTaskPriorityOptions,
  TaskCategory,
  TaskOutputModeDB,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { taskInputSchema } from "../db";
import { cronTaskResponseSchema } from "../tasks/definition";
import { CronTaskDetailContainer } from "./widget";

/**
 * GET /cron/task/[id] - Get individual task
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.task.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.task.get.description",
  icon: "clock",
  category: "app.api.system.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.task.get.title"],
  fields: customWidgetObject({
    render: CronTaskDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // URL parameter
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.get.fields.id.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.get.fields.id.description",
        schema: z.string(),
      }),

      // Response fields
      task: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.get.response.task.title",
        schema: cronTaskResponseSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.get.success.retrieved.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.get.success.retrieved.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          routeId: "system_unified-interface_tasks_cron_stats_GET",
          displayName: "Example Task",
          description: "An example cron task",
          version: "1.0.0",
          category: TaskCategory.SYSTEM,
          schedule: "0 0 * * *",
          timezone: "UTC",
          enabled: true,
          priority: CronTaskPriority.MEDIUM,
          timeout: 3600,
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
          nextExecutionAt: "2024-01-02T00:00:00Z",
          executionCount: 0,
          successCount: 0,
          errorCount: 0,
          averageExecutionTime: null,
          tags: [],
          userId: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      },
    },
  },
});

/**
 * PUT /cron/task/[id] - Update task
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.task.put.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.task.put.description",
  icon: "clock",
  category: "app.api.system.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.task.put.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data&urlPathParams", response: true },
    {
      actions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          noCard: true,
        },
        { request: "data&urlPathParams", response: true },
        {
          backButton: backButton({
            inline: true,
            usage: { response: true, request: "data&urlPathParams" },
          }),
          submitButton: submitButton({
            inline: true,
            className: "ml-auto",
            label:
              "app.api.system.unifiedInterface.tasks.cronSystem.task.put.submitButton.label" as const,
            loadingText:
              "app.api.system.unifiedInterface.tasks.cronSystem.task.put.submitButton.loadingText" as const,
            usage: { response: true, request: "data&urlPathParams" },
          }),
        },
      ),

      // URL parameter
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.id.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.id.description",
        schema: z.string(),
        hidden: true,
      }),

      // Request data fields
      displayName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.displayName.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.displayName.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.displayName.placeholder",
        columns: 12,
        schema: z.string().min(1).optional(),
      }),

      description: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.description.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.description.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      schedule: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      enabled: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.enabled.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.enabled.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.priority.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.priority.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.priority.placeholder",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.enum(CronTaskPriorityDB).optional(),
      }),

      outputMode: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.outputMode.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.outputMode.description",
        columns: 6,
        schema: z.enum(TaskOutputModeDB).optional(),
      }),

      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.timeout.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.timeout.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.timeout.placeholder",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      retries: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.retries.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.retries.description",
        placeholder:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.retries.placeholder",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      taskInput: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.taskInput.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.taskInput.description",
        columns: 12,
        schema: taskInputSchema.optional(),
      }),
      runOnce: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.runOnce.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.fields.runOnce.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // Response fields
      task: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.response.task.title",
        schema: cronTaskResponseSchema,
      }),

      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.put.response.success.title",
        schema: z.boolean(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.put.success.updated.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.put.success.updated.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    requests: {
      default: {
        displayName: "Updated Task",
        description: "An updated cron task",
        schedule: "0 */2 * * *",
        enabled: false,
        priority: CronTaskPriority.HIGH,
        outputMode: TaskOutputModeDB[0],
        timeout: 7200,
        retries: 5,
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          routeId: "system_unified-interface_tasks_cron_stats_GET",
          displayName: "Updated Task",
          description: "An updated cron task",
          version: "1.0.0",
          category: TaskCategory.SYSTEM,
          schedule: "0 */2 * * *",
          timezone: "UTC",
          enabled: false,
          priority: CronTaskPriority.HIGH,
          timeout: 7200,
          retries: 5,
          retryDelay: 5000,
          taskInput: {},
          runOnce: false,
          outputMode: TaskOutputModeDB[0],
          notificationTargets: [],
          lastExecutedAt: null,
          lastExecutionStatus: null,
          lastExecutionError: null,
          lastExecutionDuration: null,
          nextExecutionAt: "2024-01-02T00:00:00Z",
          executionCount: 0,
          successCount: 0,
          errorCount: 0,
          averageExecutionTime: null,
          tags: [],
          userId: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
        },
        success: true,
      },
    },
  },
});

/**
 * DELETE /cron/task/[id] - Delete task
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  title: "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.title",
  description:
    "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.description",
  icon: "clock",
  category: "app.api.system.category",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["app.api.system.unifiedInterface.tasks.cronSystem.task.delete.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "urlPathParams", response: true },
    {
      // URL parameter
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.fields.id.label",
        description:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.fields.id.description",
        schema: z.string(),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.response.success.title",
        schema: z.boolean(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.response.message.title",
        schema: z.string(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.success.deleted.title",
    description:
      "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.success.deleted.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Task deleted successfully",
      },
    },
  },
});

// Export the endpoints following MIGRATION_GUIDE pattern
export const endpoints = { GET, PUT, DELETE };

// Type exports for use in repository and route
export type CronTaskGetRequestInput = typeof GET.types.RequestInput;
export type CronTaskGetRequestOutput = typeof GET.types.RequestOutput;
export type CronTaskGetResponseInput = typeof GET.types.ResponseInput;
export type CronTaskGetResponseOutput = typeof GET.types.ResponseOutput;

export type CronTaskPutRequestInput = typeof PUT.types.RequestInput;
export type CronTaskPutRequestOutput = typeof PUT.types.RequestOutput;
export type CronTaskPutResponseInput = typeof PUT.types.ResponseInput;
export type CronTaskPutResponseOutput = typeof PUT.types.ResponseOutput;

export type CronTaskDeleteRequestInput = typeof DELETE.types.RequestInput;
export type CronTaskDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type CronTaskDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type CronTaskDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

// Convenience type for the task object from GET response
export type IndividualCronTaskType = CronTaskGetResponseOutput["task"];

export default endpoints;
