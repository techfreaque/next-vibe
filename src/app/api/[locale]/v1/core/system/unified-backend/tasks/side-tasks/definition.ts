/**
 * Side Tasks API Definition
 * Task management operations for side tasks system
 * Supports CRUD operations and task statistics
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

// Side task action enum
const sideTaskActionSchema = z.enum([
  "list",
  "get",
  "create",
  "update",
  "delete",
  "stats",
  "executions",
  "health-check",
]);

/**
 * POST endpoint definition - Side task management
 * Handles CRUD operations for side tasks
 */
const sideTasksPostEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "side-tasks"],
  title: "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.title",
  description:
    "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.description",
  category: "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.category",
  tags: [
    "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tags.sidetasks",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["tasks:side", "side-tasks"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.container.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      action: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionLabel",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionDescription",
          options: [
            {
              value: "list",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionList",
            },
            {
              value: "get",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionGet",
            },
            {
              value: "create",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionCreate",
            },
            {
              value: "update",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionUpdate",
            },
            {
              value: "delete",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionDelete",
            },
            {
              value: "stats",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionStats",
            },
            {
              value: "executions",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionExecutions",
            },
            {
              value: "health-check",
              label:
                "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksActionHealthCheck",
            },
          ],
          layout: { columns: 3 },
          required: true,
        },
        sideTaskActionSchema,
      ),

      id: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksIdLabel",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksIdDescription",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksNameLabel",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksNameDescription",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksLimitLabel",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksLimitDescription",
          layout: { columns: 3 },
        },
        z.number().optional().default(50),
      ),

      taskData: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksDataLabel",
          description:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.common.sideTasksDataDescription",
          layout: { columns: 12 },
        },
        z.record(z.string(), z.unknown()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.message.title",
        },
        z.string(),
      ),

      data: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.data.title",
        },
        z.unknown().optional(),
      ),

      count: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.count.title",
        },
        z.number().optional(),
      ),
    },
  ),

  examples: {
    requests: {
      list: {
        action: "list" as const,
        limit: 10,
      },
      get: {
        action: "get" as const,
        id: "task-12345",
      },
      stats: {
        action: "stats" as const,
      },
      success: {
        action: "list" as const,
        limit: 10,
      },
    },
    responses: {
      list: {
        success: true,
        message: "Tasks listed successfully",
        data: [],
        count: 0,
      },
      get: {
        success: true,
        message: "Task retrieved successfully",
        data: { id: "task-12345", name: "example-task" },
      },
      stats: {
        success: true,
        message: "Stats retrieved successfully",
        data: { total: 5 },
      },
      success: {
        success: true,
        message: "Operation completed successfully",
        data: {
          tasks: [
            {
              id: "task-12345",
              name: "example-task",
              status: "running",
            },
          ],
        },
        count: 1,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.serverError.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unknownError.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unknownError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.success.title",
    description:
      "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.success.description",
  },
});

/**
 * GET endpoint definition - Get side tasks status
 * Retrieves side tasks overview and statistics
 */
const sideTasksGetEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "side-tasks"],
  title: "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.title",
  description:
    "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.description",
  category: "app.api.v1.core.system.unifiedBackend.tasks.category",
  tags: [
    "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tags.sidetasks",
  ],
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_OFF],
  aliases: ["tasks:side:status"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.container.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // === RESPONSE FIELDS ONLY ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.message.title",
        },
        z.string(),
      ),

      data: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.tasks.side.response.data.title",
        },
        z.unknown().optional(),
      ),
    },
  ),

  examples: {
    responses: {
      status: {
        success: true,
        message: "Side tasks status retrieved",
        data: {
          totalTasks: 5,
          runningTasks: 2,
          healthyTasks: 4,
          unhealthyTasks: 1,
        },
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.serverError.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unknownError.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unknownError.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.success.title",
    description:
      "app.api.v1.core.system.unifiedBackend.tasks.sideTasks.get.success.description",
  },
});

export { sideTasksGetEndpoint as GET, sideTasksPostEndpoint as POST };
export { sideTasksGetEndpoint, sideTasksPostEndpoint };

const endpoints = { GET: sideTasksGetEndpoint, POST: sideTasksPostEndpoint };
export default endpoints;

// Export types for repository
export type SideTasksRequestInput =
  typeof sideTasksPostEndpoint.POST.types.RequestInput;
export type SideTasksRequestOutput =
  typeof sideTasksPostEndpoint.POST.types.RequestOutput;
export type SideTasksResponseInput =
  typeof sideTasksPostEndpoint.POST.types.ResponseInput;
export type SideTasksResponseOutput =
  typeof sideTasksPostEndpoint.POST.types.ResponseOutput;

export type SideTasksStatusRequestInput =
  typeof sideTasksGetEndpoint.GET.types.RequestInput;
export type SideTasksStatusRequestOutput =
  typeof sideTasksGetEndpoint.GET.types.RequestOutput;
export type SideTasksStatusResponseInput =
  typeof sideTasksGetEndpoint.GET.types.ResponseInput;
export type SideTasksStatusResponseOutput =
  typeof sideTasksGetEndpoint.GET.types.ResponseOutput;
