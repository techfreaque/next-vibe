/**
 * Individual Cron Task API Definition
 * Endpoints for managing individual cron tasks
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  CronTaskPriority,
  CronTaskPriorityOptions,
  CronTaskStatus,
  TaskCategory,
} from "../../../enum";

/**
 * GET /cron/task/[id] - Get individual task
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "task", "[id]"],
  title: "app.api.v1.core.system.tasks.cronSystem.task.get.title",
  description: "app.api.v1.core.system.tasks.cronSystem.task.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  tags: ["app.api.v1.core.system.tasks.cronSystem.task.get.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cronSystem.task.get.container.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlPathParams", response: true },
    {
      // URL parameter
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.get.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.get.fields.id.description",
        },
        z.string(),
      ),

      // Response fields
      task: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.task.get.response.task.title",
        },
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          schedule: z.string(),
          enabled: z.boolean(),
          priority: z.enum(CronTaskPriority),
          status: z.enum(CronTaskStatus),
          category: z.enum(TaskCategory),
          timeout: z.number().optional(),
          retries: z.number().optional(),
          lastRun: z.string().optional(),
          nextRun: z.string().optional(),
          version: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.get.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.tasks.cronSystem.task.get.success.retrieved.title",
    description:
      "app.api.v1.core.system.tasks.cronSystem.task.get.success.retrieved.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    requests: undefined,
    responses: {
      default: {
        task: {
          id: "task-123",
          name: "Example Task",
          description: "An example cron task",
          schedule: "0 0 * * *",
          enabled: true,
          priority: "MEDIUM",
          status: "PENDING",
          category: "SYSTEM",
          timeout: 3600,
          retries: 3,
          version: 1,
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
  path: ["v1", "core", "system", "tasks", "cron", "task", "[id]"],
  title: "app.api.v1.core.system.tasks.cronSystem.task.put.title",
  description: "app.api.v1.core.system.tasks.cronSystem.task.put.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  tags: ["app.api.v1.core.system.tasks.cronSystem.task.put.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cronSystem.task.put.container.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data&urlPathParams", response: true },
    {
      // URL parameter
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.id.description",
        },
        z.string(),
      ),

      // Request data fields
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.name.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.name.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.name.placeholder",
          layout: { columns: 12 },
        },
        z.string().min(1),
      ),

      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.description.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.description.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.description.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      schedule: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.schedule.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.schedule.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.schedule.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1),
      ),

      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.enabled.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.enabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.priority.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.priority.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.priority.placeholder",
          options: CronTaskPriorityOptions,
          layout: { columns: 6 },
        },
        z.enum(CronTaskPriority),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.timeout.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.timeout.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.timeout.placeholder",
          layout: { columns: 6 },
        },
        z.number().optional(),
      ),

      retries: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.retries.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.retries.description",
          placeholder:
            "app.api.v1.core.system.tasks.cronSystem.task.put.fields.retries.placeholder",
          layout: { columns: 6 },
        },
        z.number().optional(),
      ),

      // Response fields
      task: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.task.put.response.task.title",
        },
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          schedule: z.string(),
          enabled: z.boolean(),
          priority: z.enum(CronTaskPriority),
          status: z.enum(CronTaskStatus),
          category: z.enum(TaskCategory),
          timeout: z.number().optional(),
          retries: z.number().optional(),
          lastRun: z.string().optional(),
          nextRun: z.string().optional(),
          version: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      ),

      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.task.put.response.success.title",
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.put.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.tasks.cronSystem.task.put.success.updated.title",
    description:
      "app.api.v1.core.system.tasks.cronSystem.task.put.success.updated.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    requests: {
      default: {
        name: "Updated Task",
        description: "An updated cron task",
        schedule: "0 */2 * * *",
        enabled: false,
        priority: "HIGH",
        timeout: 7200,
        retries: 5,
      },
    },
    responses: {
      default: {
        task: {
          id: "task-123",
          name: "Updated Task",
          description: "An updated cron task",
          schedule: "0 */2 * * *",
          enabled: false,
          priority: "HIGH",
          status: "PENDING",
          category: "SYSTEM",
          timeout: 7200,
          retries: 5,
          version: 2,
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
  path: ["v1", "core", "system", "tasks", "cron", "task", "[id]"],
  title: "app.api.v1.core.system.tasks.cronSystem.task.delete.title",
  description:
    "app.api.v1.core.system.tasks.cronSystem.task.delete.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  tags: ["app.api.v1.core.system.tasks.cronSystem.task.delete.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.container.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlPathParams", response: true },
    {
      // URL parameter
      id: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cronSystem.task.delete.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cronSystem.task.delete.fields.id.description",
        },
        z.string(),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.task.delete.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cronSystem.task.delete.response.message.title",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cronSystem.task.delete.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.tasks.cronSystem.task.delete.success.deleted.title",
    description:
      "app.api.v1.core.system.tasks.cronSystem.task.delete.success.deleted.description",
  },
  examples: {
    urlPathParams: {
      default: {
        id: "task-123",
      },
    },
    requests: undefined,
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
