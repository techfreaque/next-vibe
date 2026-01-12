/**
 * Pulse Health Monitoring API Definition
 * Migrated from side-tasks-old/cron/pulse/definition.ts
 * Defines endpoints for pulse health monitoring and execution
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

/**
 * GET endpoint definition - Get pulse status
 * Retrieves current pulse health status
 */
const pulseStatusEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["system", "tasks", "pulse", "status"],
  title: "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.title",
  description:
    "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.description",
  icon: "activity",
  category: "app.api.system.unifiedInterface.tasks.pulseSystem.status.category",
  allowedRoles: [],
  aliases: ["pulse:status"],
  tags: [
    "app.api.system.unifiedInterface.tasks.pulseSystem.status.tags.status",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      status: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.fields.status.title",
        },
        z.string(),
      ),

      lastPulseAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.fields.lastPulseAt.title",
        },
        z.string().nullable(),
      ),

      successRate: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.fields.successRate.title",
        },
        z.coerce.number().nullable(),
      ),

      totalExecutions: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.fields.totalExecutions.title",
        },
        z.coerce.number(),
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
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.network.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.notFound.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.internal.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unsaved.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.conflict.title",
      description:
        "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.pulseSystem.status.get.success.description",
  },
});

export type PulseStatusResponseInput =
  typeof pulseStatusEndpoint.GET.types.ResponseInput;
export type PulseStatusResponseOutput =
  typeof pulseStatusEndpoint.GET.types.ResponseOutput;

const definitions = {
  GET: pulseStatusEndpoint.GET,
};

export default definitions;
