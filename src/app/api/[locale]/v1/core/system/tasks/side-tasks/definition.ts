/**
 * Side Tasks API Definition
 * Task management operations for side tasks system
 * Supports CRUD operations and task statistics
 */

import { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import {
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
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
  title: "common.sideTasksTitle",
  description: "common.sideTasksDescription",
  category: "common.sideTasksCategory",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["tasks:side", "side-tasks"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "common.sideTasksContainerTitle",
      description: "common.sideTasksContainerDescription",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      action: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "common.sideTasksActionLabel",
          description: "common.sideTasksActionDescription",
          options: [
            { value: "list", label: "common.sideTasksActionList" },
            { value: "get", label: "common.sideTasksActionGet" },
            { value: "create", label: "common.sideTasksActionCreate" },
            { value: "update", label: "common.sideTasksActionUpdate" },
            { value: "delete", label: "common.sideTasksActionDelete" },
            { value: "stats", label: "common.sideTasksActionStats" },
            { value: "executions", label: "common.sideTasksActionExecutions" },
            {
              value: "health-check",
              label: "common.sideTasksActionHealthCheck",
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
          label: "common.sideTasksIdLabel",
          description: "common.sideTasksIdDescription",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "common.sideTasksNameLabel",
          description: "common.sideTasksNameDescription",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "common.sideTasksLimitLabel",
          description: "common.sideTasksLimitDescription",
          layout: { columns: 3 },
        },
        z.number().optional().default(50),
      ),

      data: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "common.sideTasksDataLabel",
          description: "common.sideTasksDataDescription",
          layout: { columns: 12 },
        },
        z.record(z.unknown()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.side.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.side.response.message.title",
        },
        z.string(),
      ),

      data: responseField(
        {
          type: WidgetType.CODE_OUTPUT,
          content: "tasks.side.response.data.title",
        },
        z.unknown().optional(),
      ),

      count: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.side.response.count.title",
        },
        z.number().optional(),
      ),
    },
  ),

  examples: {
    requests: [
      {
        title: "tasks.side.examples.list.title",
        data: {
          action: "list" as const,
          limit: 10,
        },
      },
      {
        title: "tasks.side.examples.get.title",
        data: {
          action: "get" as const,
          id: "task-12345",
        },
      },
      {
        title: "tasks.side.examples.stats.title",
        data: {
          action: "stats" as const,
        },
      },
    ],
    responses: [
      {
        title: "tasks.side.examples.success.title",
        data: {
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
    ],
    urlPathVariables: [],
  },
});

/**
 * GET endpoint definition - Get side tasks status
 * Retrieves side tasks overview and statistics
 */
const sideTasksGetEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "side-tasks"],
  title: "app.api.v1.core.system.tasks.sideTasks.get.title",
  description: "app.api.v1.core.system.tasks.sideTasks.get.description",
  category: "app.api.v1.core.system.tasks.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CLI_ONLY],
  aliases: ["tasks:side:status"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.system.tasks.sideTasks.get.container.title",
      description:
        "app.api.v1.core.system.tasks.sideTasks.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: false, response: true },
    {
      // === RESPONSE FIELDS ONLY ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "tasks.side.response.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.stats.get.response.success.title",
        },
        z.string(),
      ),

      data: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.cron.stats.get.response.data.title",
        },
        z.unknown().optional(),
      ),
    },
  ),
});

export { sideTasksGetEndpoint as GET, sideTasksPostEndpoint as POST };
export { sideTasksGetEndpoint, sideTasksPostEndpoint };

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
