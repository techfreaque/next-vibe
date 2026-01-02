/**
 * PerformanceStopTrace Tool - Definition
 * Stops the active performance trace recording on the selected page
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "performance-stop-trace"],
  title: "app.api.browser.performance-stop-trace.title",
  description: "app.api.browser.performance-stop-trace.description",
  category: "app.api.browser.category",
  icon: "pause-circle",
  tags: ["app.api.browser.tags.browserAutomation", "app.api.browser.tags.performanceAutomation"],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.performance-stop-trace.form.label",
      description: "app.api.browser.performance-stop-trace.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.performance-stop-trace.response.success",
        },
        z.boolean().describe("Whether the trace stop operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.performance-stop-trace.response.result",
        },
        z
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
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.performance-stop-trace.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.performance-stop-trace.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {},
    },
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
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.performance-stop-trace.errors.validation.title",
      description: "app.api.browser.performance-stop-trace.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.performance-stop-trace.errors.network.title",
      description: "app.api.browser.performance-stop-trace.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.performance-stop-trace.errors.unauthorized.title",
      description: "app.api.browser.performance-stop-trace.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.performance-stop-trace.errors.forbidden.title",
      description: "app.api.browser.performance-stop-trace.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.performance-stop-trace.errors.notFound.title",
      description: "app.api.browser.performance-stop-trace.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.performance-stop-trace.errors.serverError.title",
      description: "app.api.browser.performance-stop-trace.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.performance-stop-trace.errors.unknown.title",
      description: "app.api.browser.performance-stop-trace.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.performance-stop-trace.errors.unsavedChanges.title",
      description: "app.api.browser.performance-stop-trace.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.performance-stop-trace.errors.conflict.title",
      description: "app.api.browser.performance-stop-trace.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.performance-stop-trace.success.title",
    description: "app.api.browser.performance-stop-trace.success.description",
  },
});

export type PerformanceStopTraceRequestInput = typeof POST.types.RequestInput;
export type PerformanceStopTraceRequestOutput = typeof POST.types.RequestOutput;
export type PerformanceStopTraceResponseInput = typeof POST.types.ResponseInput;
export type PerformanceStopTraceResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
