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
  requestUrlField,
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
  title: "app.api.v1.core.system.tasks.cron.task.get.title",
  description: "app.api.v1.core.system.tasks.cron.task.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  tags: ["app.api.v1.core.system.tasks.cron.task.get.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.task.get.container.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "url", response: true },
    {
      // URL parameter
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      id: requestUrlField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.tasks.cron.task.get.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.get.fields.id.description",
        },
        z.string(),
      ),

      // Response fields
      task: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.task.get.response.task.title",
        },
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          schedule: z.string(),
          enabled: z.boolean(),
          priority: z.nativeEnum(CronTaskPriority),
          status: z.nativeEnum(CronTaskStatus),
          category: z.nativeEnum(TaskCategory),
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
        "app.api.v1.core.system.tasks.cron.task.get.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.tasks.cron.task.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.system.tasks.cron.task.get.success.retrieved.title",
    description:
      "app.api.v1.core.system.tasks.cron.task.get.success.retrieved.description",
  },
});

/**
 * PUT /cron/task/[id] - Update task
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["v1", "core", "system", "tasks", "cron", "task", "[id]"],
  title: "app.api.v1.core.system.tasks.cron.task.put.title",
  description: "app.api.v1.core.system.tasks.cron.task.put.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  tags: ["app.api.v1.core.system.tasks.cron.task.put.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.task.put.container.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "both", response: true },
    {
      // URL parameter
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      id: requestUrlField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.tasks.cron.task.put.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.id.description",
        },
        z.string(),
      ),

      // Request data fields
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.system.tasks.cron.task.put.fields.name.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.name.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.name.placeholder",
          layout: { columns: 12 },
        },
        z.string().min(1),
      ),

      description: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.description.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.description.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.description.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      schedule: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.schedule.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.schedule.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.schedule.placeholder",
          layout: { columns: 6 },
        },
        z.string().min(1),
      ),

      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.enabled.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.enabled.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.priority.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.priority.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.priority.placeholder",
          options: CronTaskPriorityOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(CronTaskPriority),
      ),

      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.timeout.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.timeout.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.timeout.placeholder",
          layout: { columns: 6 },
        },
        z.number().optional(),
      ),

      retries: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.task.put.fields.retries.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.put.fields.retries.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.task.put.fields.retries.placeholder",
          layout: { columns: 6 },
        },
        z.number().optional(),
      ),

      // Response fields
      task: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.task.put.response.task.title",
        },
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          schedule: z.string(),
          enabled: z.boolean(),
          priority: z.nativeEnum(CronTaskPriority),
          status: z.nativeEnum(CronTaskStatus),
          category: z.nativeEnum(TaskCategory),
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
            "app.api.v1.core.system.tasks.cron.task.put.response.success.title",
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.put.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.put.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.put.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.system.tasks.cron.task.put.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.put.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.system.tasks.cron.task.put.success.updated.title",
    description:
      "app.api.v1.core.system.tasks.cron.task.put.success.updated.description",
  },
});

/**
 * DELETE /cron/task/[id] - Delete task
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["v1", "core", "system", "tasks", "cron", "task", "[id]"],
  title: "app.api.v1.core.system.tasks.cron.task.delete.title",
  description: "app.api.v1.core.system.tasks.cron.task.delete.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  tags: ["app.api.v1.core.system.tasks.cron.task.delete.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.task.delete.container.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "url", response: true },
    {
      // URL parameter
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      id: requestUrlField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.tasks.cron.task.delete.fields.id.label",
          description:
            "app.api.v1.core.system.tasks.cron.task.delete.fields.id.description",
        },
        z.string(),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.task.delete.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.task.delete.response.message.title",
        },
        z.string(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cron.task.delete.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.tasks.cron.task.delete.success.deleted.title",
    description:
      "app.api.v1.core.system.tasks.cron.task.delete.success.deleted.description",
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
