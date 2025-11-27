/**
 * Pulse Health Monitoring API Definition
 * Migrated from side-tasks-old/cron/pulse/definition.ts
 * Defines endpoints for pulse health monitoring and execution
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
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

// Export type definitions for both endpoints
export type PulseExecuteRequestInput =
  typeof pulseExecuteEndpoint.POST.types.RequestInput;
export type PulseExecuteRequestOutput =
  typeof pulseExecuteEndpoint.POST.types.RequestOutput;
export type PulseExecuteResponseInput =
  typeof pulseExecuteEndpoint.POST.types.ResponseInput;
export type PulseExecuteResponseOutput =
  typeof pulseExecuteEndpoint.POST.types.ResponseOutput;

const definitions = {
  POST: pulseExecuteEndpoint.POST,
};

export default definitions;
