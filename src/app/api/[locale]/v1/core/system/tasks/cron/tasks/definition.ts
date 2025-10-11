/**
 * Cron Tasks List API Definition
 * Clean implementation following spec.md and MIGRATION_GUIDE.md
 * Provides endpoints for listing and managing cron tasks
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  CronTaskPriority,
  CronTaskPriorityOptions,
  CronTaskStatus,
  CronTaskStatusOptions,
  TaskCategory,
  TaskCategoryOptions,
} from "../../enum";

/**
 * GET /cron/tasks - List cron tasks
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "cron", "tasks"],
  title: "app.api.v1.core.system.tasks.cron.tasks.get.title",
  description: "app.api.v1.core.system.tasks.cron.tasks.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  tags: ["app.api.v1.core.system.tasks.cron.tasks.get.title"],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.cron.tasks.get.container.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // Request fields for filtering
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.status.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.status.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.status.placeholder",
          options: CronTaskStatusOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(CronTaskStatus)).optional(),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.priority.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.priority.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.priority.placeholder",
          options: CronTaskPriorityOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(CronTaskPriority)).optional(),
      ),
      category: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.category.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.category.description",
          placeholder:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.category.placeholder",
          options: TaskCategoryOptions,
          layout: { columns: 6 },
        },
        z.array(z.nativeEnum(TaskCategory)).optional(),
      ),
      enabled: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.enabled.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.enabled.description",
          layout: { columns: 6 },
        },
        z.boolean().optional(),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.limit.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.limit.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.offset.label",
          description:
            "app.api.v1.core.system.tasks.cron.tasks.get.fields.offset.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      // Response fields
      tasks: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            {
              key: "name",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.name",
              type: FieldDataType.TEXT,
            },
            {
              key: "status",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.status",
              type: FieldDataType.BADGE,
            },
            {
              key: "priority",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.priority",
              type: FieldDataType.BADGE,
            },
            {
              key: "category",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.category",
              type: FieldDataType.TEXT,
            },
            {
              key: "lastRun",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.lastRun",
              type: FieldDataType.DATETIME,
            },
            {
              key: "nextRun",
              label:
                "app.api.v1.core.system.tasks.cron.tasks.get.response.task.nextRun",
              type: FieldDataType.DATETIME,
            },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.system.tasks.cron.tasks.get.response.task.title",
            description:
              "app.api.v1.core.system.tasks.cron.tasks.get.response.task.description",
            layout: { type: LayoutType.GRID, columns: 12 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.id",
              },
              z.string(),
            ),
            name: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.name",
              },
              z.string(),
            ),
            description: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.taskDescription",
              },
              z.string().optional(),
            ),
            schedule: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.schedule",
              },
              z.string(),
            ),
            enabled: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.enabled",
              },
              z.boolean(),
            ),
            priority: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.priority",
              },
              z.nativeEnum(CronTaskPriority),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.status",
              },
              z.nativeEnum(CronTaskStatus),
            ),
            category: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.category",
              },
              z.nativeEnum(TaskCategory),
            ),
            lastRun: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.lastRun",
              },
              z.string().optional(),
            ),
            nextRun: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.system.tasks.cron.tasks.get.response.task.nextRun",
              },
              z.string().optional(),
            ),
          },
        ),
      ),
      totalTasks: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.tasks.get.response.totalTasks",
        },
        z.number(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.validation.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.internal.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.tasks.get.errors.network.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.system.tasks.cron.tasks.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.system.tasks.cron.tasks.get.errors.unsaved.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.tasks.cron.tasks.get.success.retrieved.title",
    description:
      "app.api.v1.core.system.tasks.cron.tasks.get.success.retrieved.description",
  },
});

// Export the endpoint following MIGRATION_GUIDE pattern
export const endpoints = { GET };

// Type exports for use in repository and route
export type CronTaskListRequestInput = typeof GET.types.RequestInput;
export type CronTaskListRequestOutput = typeof GET.types.RequestOutput;
export type CronTaskListResponseInput = typeof GET.types.ResponseInput;
export type CronTaskListResponseOutput = typeof GET.types.ResponseOutput;
