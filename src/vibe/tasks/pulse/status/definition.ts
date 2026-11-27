/**
 * Pulse Health Monitoring API Definition
 * Migrated from side-tasks-old/cron/pulse/definition.ts
 * Defines endpoints for pulse health monitoring and execution
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../unified-ui/_shared/utils";
import { responseField } from "../../../unified-ui/_shared/utils-i18n";
import { PulseHealthStatus } from "../../enum";
import { PULSE_STATUS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const PulseStatusWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.PulseStatusWidget })),
);

/**
 * GET endpoint definition - Get pulse status
 * Retrieves current pulse health status
 */
const pulseStatusEndpoint = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "tasks", "pulse", "status"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "activity",
  category: "devTools",
  subCategory: "tasksPulse",
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  defaultWebPinned: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  aliases: [PULSE_STATUS_ALIAS, "pulse:status"],
  tags: ["tags.status"],

  fields: customWidgetObject({
    render: PulseStatusWidget,
    usage: { response: true },
    children: {
      // === RESPONSE FIELDS ===
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.status.title",
        schema: z.string(),
      }),

      lastPulseAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.lastPulseAt.title",
        schema: z.string().nullable(),
      }),

      successRate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.successRate.title",
        schema: z.coerce.number().nullable(),
      }),

      totalExecutions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.fields.totalExecutions.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    responses: {
      basic: {
        status: PulseHealthStatus.HEALTHY,
        lastPulseAt: "2023-07-21T12:00:00Z",
        successRate: 9500,
        totalExecutions: 1000,
      },
      success: {
        status: PulseHealthStatus.HEALTHY,
        lastPulseAt: "2023-07-21T12:00:00Z",
        successRate: 9500,
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
