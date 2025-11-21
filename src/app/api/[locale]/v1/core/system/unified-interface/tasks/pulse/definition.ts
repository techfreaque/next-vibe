/**
 * Pulse Health Monitoring API Definition
 * Migrated from side-tasks-old/cron/pulse/definition.ts
 * Defines endpoints for pulse health monitoring and execution
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * POST endpoint definition - Execute pulse
 * Executes a pulse cycle with optional dry run
 */
const pulseExecuteEndpoint = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "tasks", "pulse", "execute"],
  title:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.title",
  description:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.description",
  category:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.category",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["pulse:execute"],
  tags: [
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.tags.execute",
  ],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unsaved.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.success.description",
  },

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.container.title",
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.dryRun.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.dryRun.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      force: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.force.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.force.description",
          columns: 4,
        },
        z.boolean().optional().default(false),
      ),

      taskNames: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.taskNames.label",
          description:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.taskNames.description",
          columns: 4,
        },
        z.array(z.string()).optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.success.title",
        },
        z.boolean(),
      ),

      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.execute.post.fields.message.title",
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
  title:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.title",
  description:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.description",
  category:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.category",
  allowedRoles: [],
  aliases: ["pulse:status"],
  tags: [
    "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.tags.status",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.container.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.container.description",
      layoutType: LayoutType.GRID, columns: 12,
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.fields.status.title",
        },
        z.string(),
      ),

      lastPulseAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.fields.lastPulseAt.title",
        },
        z.string().nullable(),
      ),

      successRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.fields.successRate.title",
        },
        z.number().nullable(),
      ),

      totalExecutions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.fields.totalExecutions.title",
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
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.validation.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.network.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.forbidden.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.notFound.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.internal.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unknown.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unsaved.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.conflict.title",
      description:
        "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.success.title",
    description:
      "app.api.v1.core.system.unifiedInterface.tasks.pulseSystem.status.get.success.description",
  },
});

// Export type definitions for both endpoints
export type PulseExecuteRequestInput =
  typeof pulseExecuteEndpoint.POST.types.RequestInput;
export type PulseExecuteRequestOutput =
  typeof pulseExecuteEndpoint.POST.types.RequestOutput;
export type PulseExecuteResponseInput =
  typeof pulseExecuteEndpoint.POST.types.ResponseInput;
export type PulseExecuteResponseOutput =
  typeof pulseExecuteEndpoint.POST.types.ResponseOutput;

export type PulseStatusResponseInput =
  typeof pulseStatusEndpoint.GET.types.ResponseInput;
export type PulseStatusResponseOutput =
  typeof pulseStatusEndpoint.GET.types.ResponseOutput;

export { pulseStatusEndpoint as GET, pulseExecuteEndpoint as POST };
export { pulseExecuteEndpoint, pulseStatusEndpoint };

const definitions = {
  GET: pulseStatusEndpoint.GET,
  POST: pulseExecuteEndpoint.POST,
};

export default definitions;
