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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { PULSE_STATUS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * GET endpoint definition - Get pulse status
 * Retrieves current pulse health status
 */
const pulseStatusEndpoint = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "tasks", "pulse", "status"],
  title: "get.title",
  description: "get.description",
  icon: "activity",
  category: "endpointCategories.systemTasks",
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  aliases: [PULSE_STATUS_ALIAS, "pulse:status"],
  tags: ["tags.status"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title",
    description: "get.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      // === RESPONSE FIELDS ===
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.status.title",
        schema: z.string(),
      }),

      lastPulseAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.lastPulseAt.title",
        schema: z.string().nullable(),
      }),

      successRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.successRate.title",
        schema: z.coerce.number().nullable(),
      }),

      totalExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.fields.totalExecutions.title",
        schema: z.coerce.number(),
      }),
    },
  }),

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
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title",
      description: "get.errors.internal.description",
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
    title: "get.success.title",
    description: "get.success.description",
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
