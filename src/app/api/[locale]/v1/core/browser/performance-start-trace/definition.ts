/**
 * PerformanceStartTrace Tool - Definition
 * Starts a performance trace recording on the selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create";
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "browser", "performance-start-trace"],
  title: "app.api.v1.core.browser.performance-start-trace.title",
  description: "app.api.v1.core.browser.performance-start-trace.description",
  category: "app.api.v1.core.browser.category",
  tags: [
    "app.api.v1.core.browser.tags.browserAutomation",
    "app.api.v1.core.browser.tags.performanceAutomation"
  ],

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
      title: "app.api.v1.core.browser.performance-start-trace.form.label",
      description: "app.api.v1.core.browser.performance-start-trace.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      reload: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.browser.performance-start-trace.form.fields.reload.label",
          description: "app.api.v1.core.browser.performance-start-trace.form.fields.reload.description",
          placeholder: "app.api.v1.core.browser.performance-start-trace.form.fields.reload.placeholder",
          columns: 6,
        },
        z.boolean().describe("Determines if, once tracing has started, the page should be automatically reloaded"),
      ),
      autoStop: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.browser.performance-start-trace.form.fields.autoStop.label",
          description: "app.api.v1.core.browser.performance-start-trace.form.fields.autoStop.description",
          placeholder: "app.api.v1.core.browser.performance-start-trace.form.fields.autoStop.placeholder",
          columns: 6,
        },
        z.boolean().describe("Determines if the trace recording should be automatically stopped"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.performance-start-trace.response.success",
        },
        z.boolean().describe("Whether the trace start operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.performance-start-trace.response.result",
        },
        z.object({
          started: z.boolean().describe("Whether the trace was started"),
          traceId: z.string().describe("Identifier for this trace"),
        }).optional().describe("Result of trace start operation")
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.performance-start-trace.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.performance-start-trace.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {"reload": true, "autoStop": true},
    },
    responses: {
      default: {
        success: true,
        result: {
          started: true,
          traceId: "trace_123"
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.validation.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.network.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.unauthorized.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.forbidden.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.notFound.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.serverError.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.unknown.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.unsavedChanges.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.browser.performance-start-trace.errors.conflict.title",
      description: "app.api.v1.core.browser.performance-start-trace.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.browser.performance-start-trace.success.title",
    description: "app.api.v1.core.browser.performance-start-trace.success.description",
  },
});

export type PerformanceStartTraceRequestInput = typeof POST.types.RequestInput;
export type PerformanceStartTraceRequestOutput = typeof POST.types.RequestOutput;
export type PerformanceStartTraceResponseInput = typeof POST.types.ResponseInput;
export type PerformanceStartTraceResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;