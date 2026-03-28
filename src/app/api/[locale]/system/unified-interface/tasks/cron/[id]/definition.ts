/**
 * Individual Cron Task API Definition
 * Endpoints for managing individual cron tasks
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
  CronTaskStatusDB,
  CronTaskStatusOptions,
  TaskCategory,
  TaskOutputModeDB,
  TaskOutputModeOptions,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { taskInputSchema } from "../db";
import { cronTaskResponseSchema } from "../tasks/definition";
import {
  CRON_DELETE_ALIAS,
  CRON_GET_ALIAS,
  CRON_UPDATE_ALIAS,
} from "./constants";
import { scopedTranslation } from "./i18n";
import {
  CronTaskDetailContainer,
  CronTaskEditContainer,
} from "./widget/widget";

/**
 * GET /cron/task/[id] - Get individual task
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  aliases: [CRON_GET_ALIAS],
  title: "get.title",
  description: "get.description",
  icon: "clock",
  category: "endpointCategories.systemTasks",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: customWidgetObject({
    render: CronTaskDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // URL parameter
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.id.label",
        description: "get.fields.id.description",
        schema: z.string(),
      }),

      // Response fields
      task: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.task.title",
        schema: cronTaskResponseSchema,
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title",
      description: "get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
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
          shortId: "task-123",
          routeId: "system_unified-interface_tasks_cron_stats_GET",
          displayName: "Example Task",
          description: "An example cron task",
          version: "1.0.0",
          category: TaskCategory.SYSTEM,
          schedule: "0 0 * * *",
          timezone: "UTC",
          enabled: true,
          hidden: false,
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
          consecutiveFailures: 0,
          targetInstance: null,
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
  scopedTranslation,
  method: Methods.PUT,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  aliases: [CRON_UPDATE_ALIAS],
  title: "put.title",
  description: "put.description",
  icon: "clock",
  category: "endpointCategories.systemTasks",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: customWidgetObject({
    render: CronTaskEditContainer,
    noFormElement: true,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      actions: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.INLINE,
        gap: "2",
        noCard: true,
        usage: { request: "data&urlPathParams", response: true },
        children: {
          backButton: backButton(scopedTranslation, {
            inline: true,
            usage: { response: true, request: "data&urlPathParams" },
          }),
          submitButton: submitButton(scopedTranslation, {
            inline: true,
            className: "ml-auto",
            label: "put.submitButton.label",
            loadingText: "put.submitButton.loadingText",
            usage: { response: true, request: "data&urlPathParams" },
          }),
        },
      }),

      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 3.5,
        usage: { request: "data&urlPathParams" },
      }),

      // URL parameter
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.id.label",
        description: "put.fields.id.description",
        schema: z.string(),
        hidden: true,
      }),

      // Request data fields
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.displayName.label",
        description: "put.fields.displayName.description",
        placeholder: "put.fields.displayName.placeholder",
        columns: 12,
        schema: z.string().min(1).optional(),
      }),

      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "put.fields.description.label",
        description: "put.fields.description.description",
        placeholder: "put.fields.description.placeholder",
        columns: 12,
        schema: z.string().optional(),
      }),

      schedule: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.schedule.label",
        description: "put.fields.schedule.description",
        placeholder: "put.fields.schedule.placeholder",
        columns: 6,
        schema: z.string().min(1).optional(),
      }),

      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.fields.enabled.label",
        description: "put.fields.enabled.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.fields.priority.label",
        description: "put.fields.priority.description",
        placeholder: "put.fields.priority.placeholder",
        options: CronTaskPriorityOptions,
        columns: 6,
        schema: z.enum(CronTaskPriorityDB).optional(),
      }),

      outputMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        options: TaskOutputModeOptions,
        label: "put.fields.outputMode.label",
        description: "put.fields.outputMode.description",
        columns: 6,
        schema: z.enum(TaskOutputModeDB).optional(),
      }),

      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.fields.timeout.label",
        description: "put.fields.timeout.description",
        placeholder: "put.fields.timeout.placeholder",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      retries: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.fields.retries.label",
        description: "put.fields.retries.description",
        placeholder: "put.fields.retries.placeholder",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      retryDelay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.fields.retryDelay.label",
        description: "put.fields.retryDelay.description",
        placeholder: "put.fields.retryDelay.placeholder",
        columns: 6,
        schema: z.coerce.number().optional(),
      }),

      taskInput: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "put.fields.taskInput.label",
        description: "put.fields.taskInput.description",
        columns: 12,
        hidden: true,
        schema: taskInputSchema.optional(),
      }),

      hidden: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.fields.hidden.label",
        description: "put.fields.hidden.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),

      runOnce: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "put.fields.runOnce.label",
        description: "put.fields.runOnce.description",
        columns: 6,
        schema: z.boolean().optional(),
      }),
      targetInstance: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.fields.targetInstance.label",
        description: "put.fields.targetInstance.description",
        placeholder: "put.fields.targetInstance.placeholder",
        columns: 6,
        schema: z.string().nullable().optional(),
      }),

      lastExecutionStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "put.fields.lastExecutionStatus.label",
        description: "put.fields.lastExecutionStatus.description",
        placeholder: "put.fields.lastExecutionStatus.placeholder",
        options: CronTaskStatusOptions,
        columns: 6,
        schema: z.enum(CronTaskStatusDB).nullable().optional(),
      }),

      // Response fields
      task: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.task.title",
        schema: cronTaskResponseSchema,
      }),

      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "put.response.success.title",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "put.errors.validation.title",
      description: "put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "put.errors.unauthorized.title",
      description: "put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "put.errors.notFound.title",
      description: "put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "put.errors.internal.title",
      description: "put.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "put.errors.forbidden.title",
      description: "put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "put.errors.network.title",
      description: "put.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "put.errors.unknown.title",
      description: "put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "put.errors.unsaved.title",
      description: "put.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "put.errors.conflict.title",
      description: "put.errors.conflict.description",
    },
  },
  successTypes: {
    title: "put.success.updated.title",
    description: "put.success.updated.description",
  },
  options: {
    mutationOptions: {
      onSuccess: async ({ responseData, pathParams, logger }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const tasksDef = await import("../tasks/definition");
        const queueDef = await import("../queue/definition");
        const updatedTask = responseData.task;

        // Update the task in the tasks list cache
        apiClient.updateEndpointData(tasksDef.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            success: true as const,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((t) =>
                t.id === pathParams.id ? { ...t, ...updatedTask } : t,
              ),
            },
          };
        });

        // Update the task in the queue cache
        apiClient.updateEndpointData(queueDef.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            success: true as const,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((t) =>
                t.id === pathParams.id ? { ...t, ...updatedTask } : t,
              ),
            },
          };
        });

        // Update the individual task GET cache
        const idDef = await import("./definition");
        apiClient.updateEndpointData(
          idDef.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            return { success: true as const, data: { task: updatedTask } };
          },
          { urlPathParams: { id: pathParams.id } },
        );
      },
    },
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
        timeout: 300000,
        retries: 5,
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          shortId: "task-123",
          routeId: "system_unified-interface_tasks_cron_stats_GET",
          displayName: "Updated Task",
          description: "An updated cron task",
          version: "1.0.0",
          category: TaskCategory.SYSTEM,
          schedule: "0 */2 * * *",
          timezone: "UTC",
          enabled: false,
          hidden: false,
          priority: CronTaskPriority.HIGH,
          timeout: 300000,
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
          consecutiveFailures: 0,
          targetInstance: null,
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
  scopedTranslation,
  method: Methods.DELETE,
  path: ["system", "unified-interface", "tasks", "cron", "[id]"],
  aliases: [CRON_DELETE_ALIAS],
  title: "delete.title",
  description: "delete.description",
  icon: "clock",
  category: "endpointCategories.systemTasks",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
  ],
  tags: ["tags.cron" as const, "tags.scheduling" as const],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title",
    description: "delete.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL parameter
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.fields.id.label",
        description: "delete.fields.id.description",
        schema: z.string(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title",
      description: "delete.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsaved.title",
      description: "delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },
  successTypes: {
    title: "delete.success.deleted.title",
    description: "delete.success.deleted.description",
  },
  options: {
    mutationOptions: {
      onSuccess: async ({ pathParams, logger }) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const tasksDef = await import("../tasks/definition");
        const queueDef = await import("../queue/definition");

        // Remove from tasks list cache
        apiClient.updateEndpointData(tasksDef.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            success: true as const,
            data: {
              ...old.data,
              tasks: old.data.tasks.filter((t) => t.id !== pathParams.id),
              totalTasks: Math.max(0, old.data.totalTasks - 1),
            },
          };
        });

        // Remove from queue cache
        apiClient.updateEndpointData(queueDef.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            success: true as const,
            data: {
              ...old.data,
              tasks: old.data.tasks.filter((t) => t.id !== pathParams.id),
            },
          };
        });
      },
    },
  },

  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    responses: {
      default: {
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
