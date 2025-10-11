/**
 * Pulse Health Monitoring API Definition
 * Migrated from side-tasks-old/cron/pulse/definition.ts
 * Defines endpoints for pulse health monitoring and execution
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  Methods,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
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

import { UserRoleValue } from "../../../user/user-roles/enum";

/**
 * POST endpoint definition - Execute pulse
 * Executes a pulse cycle with optional dry run
 */
const pulseExecuteEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "pulse", "execute"],
  title: "common.pulseExecuteTitle",
  description: "common.pulseExecuteDescription",
  category: "common.sideTasksCategory",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["pulse:execute"],
  tags: ["common.pulseTaskType"],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "common.pulseExecutePostValidationFailed",
      description: "common.pulseExecutePostValidationFailed",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "common.pulseExecutePostNetworkError",
      description: "common.pulseExecutePostNetworkError",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "common.pulseExecutePostUnauthorized",
      description: "common.pulseExecutePostUnauthorized",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "common.pulseExecutePostForbidden",
      description: "common.pulseExecutePostForbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "common.pulseExecutePostNotFound",
      description: "common.pulseExecutePostNotFound",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "common.pulseExecutePostServerError",
      description: "common.pulseExecutePostServerError",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "common.pulseExecutePostUnknownError",
      description: "common.pulseExecutePostUnknownError",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "common.pulseExecutePostUnsavedChanges",
      description: "common.pulseExecutePostUnsavedChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "common.pulseExecutePostConflict",
      description: "common.pulseExecutePostConflict",
    },
  },
  successTypes: {
    title: "common.success",
    description: "common.pulseExecuteDescription",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "common.pulseContainerTitle",
      description: "common.pulseContainerDescription",
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "common.dryRun",
          description: "common.dryRunDescription",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "common.force",
          description: "common.forceDescription",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      taskNames: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "common.taskNames",
          description: "common.taskNamesDescription",
          layout: { columns: 4 },
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.success",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content: "common.message",
        },
        z.string(),
      ),
    },
  ),

  examples: {
    requests: {
      basic: {
        dryRun: false,
        force: false,
      },
      success: {
        dryRun: true,
        force: true,
        taskNames: ["task1", "task2"],
      },
    },
    responses: {
      basic: {
        success: true,
        message: "Pulse executed successfully",
      },
      success: {
        success: true,
        message: "Pulse executed successfully",
      },
    },
  },
});

/**
 * GET endpoint definition - Get pulse status
 * Retrieves current pulse health status
 */
const pulseStatusEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "system", "tasks", "pulse", "status"],
  title: "common.pulseStatusTitle",
  description: "common.pulseStatusDescription",
  category: "common.sideTasksCategory",
  allowedRoles: [],
  aliases: ["pulse:status"],
  tags: ["app.api.v1.core.system.tasks.pulseSystem.status.get.title"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.tasks.pulseSystem.status.get.container.title",
      description:
        "app.api.v1.core.system.tasks.pulseSystem.status.get.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.pulseSystem.status.get.fields.status.title",
        },
        z.string(),
      ),

      lastPulseAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.pulseSystem.status.get.fields.lastPulseAt.title",
        },
        z.string().nullable(),
      ),

      successRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.pulseSystem.status.get.fields.successRate.title",
        },
        z.number().nullable(),
      ),

      totalExecutions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.tasks.pulseSystem.status.get.fields.totalExecutions.title",
        },
        z.number(),
      ),
    },
  ),

  examples: {
    responses: {
      basic: {
        status: "HEALTHY",
        lastPulseAt: "2023-07-21T12:00:00Z",
        successRate: 95.0,
        totalExecutions: 1000,
      },
      success: {
        status: "HEALTHY",
        lastPulseAt: "2023-07-21T12:00:00Z",
        successRate: 95.0,
        totalExecutions: 1000,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "common.pulseStatusGetValidationFailed",
      description: "common.pulseStatusGetValidationFailed",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "common.pulseStatusGetNetworkError",
      description: "common.pulseStatusGetNetworkError",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "common.pulseStatusGetUnauthorized",
      description: "common.pulseStatusGetUnauthorized",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "common.pulseStatusGetForbidden",
      description: "common.pulseStatusGetForbidden",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "common.pulseStatusGetNotFound",
      description: "common.pulseStatusGetNotFound",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "common.pulseStatusGetServerError",
      description: "common.pulseStatusGetServerError",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "common.pulseStatusGetUnknownError",
      description: "common.pulseStatusGetUnknownError",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "common.pulseStatusGetUnsavedChanges",
      description: "common.pulseStatusGetUnsavedChanges",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "common.pulseStatusGetConflict",
      description: "common.pulseStatusGetConflict",
    },
  },

  successTypes: {
    title: "common.success",
    description: "common.pulseStatusDescription",
  },
});

export { pulseStatusEndpoint as GET, pulseExecuteEndpoint as POST };
export { pulseExecuteEndpoint, pulseStatusEndpoint };
