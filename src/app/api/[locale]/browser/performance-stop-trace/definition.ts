/**
 * PerformanceStopTrace Tool - Definition
 * Stops the active performance trace recording on the selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "performance-stop-trace"],
  title: "performance-stop-trace.title",
  description: "performance-stop-trace.description",
  category: "performance-stop-trace.category",
  icon: "pause-circle",
  tags: [
    "performance-stop-trace.tags.browserAutomation",
    "performance-stop-trace.tags.performanceAutomation",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "performance-stop-trace.form.label",
    description: "performance-stop-trace.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-stop-trace.response.success",
        schema: z
          .boolean()
          .describe("Whether the trace stop operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-stop-trace.response.result",
        schema: z
          .object({
            stopped: z.boolean().describe("Whether the trace was stopped"),
            metrics: z
              .object({
                lcp: z.coerce.number().optional(),
                fcp: z.coerce.number().optional(),
                cls: z.coerce.number().optional(),
                tti: z.coerce.number().optional(),
              })
              .optional()
              .describe("Performance metrics from the trace"),
          })
          .optional()
          .describe("Result of trace stop operation"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-stop-trace.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "performance-stop-trace.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    responses: {
      default: {
        success: true,
        result: {
          stopped: true,
          metrics: {
            lcp: 2500,
            fcp: 1800,
            cls: 0.1,
            tti: 3200,
          },
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "performance-stop-trace.errors.validation.title",
      description: "performance-stop-trace.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "performance-stop-trace.errors.network.title",
      description: "performance-stop-trace.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "performance-stop-trace.errors.unauthorized.title",
      description: "performance-stop-trace.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "performance-stop-trace.errors.forbidden.title",
      description: "performance-stop-trace.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "performance-stop-trace.errors.notFound.title",
      description: "performance-stop-trace.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "performance-stop-trace.errors.serverError.title",
      description: "performance-stop-trace.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "performance-stop-trace.errors.unknown.title",
      description: "performance-stop-trace.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "performance-stop-trace.errors.unsavedChanges.title",
      description: "performance-stop-trace.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "performance-stop-trace.errors.conflict.title",
      description: "performance-stop-trace.errors.conflict.description",
    },
  },
  successTypes: {
    title: "performance-stop-trace.success.title",
    description: "performance-stop-trace.success.description",
  },
});

export type PerformanceStopTraceRequestInput = typeof POST.types.RequestInput;
export type PerformanceStopTraceRequestOutput = typeof POST.types.RequestOutput;
export type PerformanceStopTraceResponseInput = typeof POST.types.ResponseInput;
export type PerformanceStopTraceResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
