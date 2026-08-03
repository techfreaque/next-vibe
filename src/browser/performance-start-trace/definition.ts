/**
 * PerformanceStartTrace Tool - Definition
 * Starts a performance trace recording on the selected page
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { browserInstanceIdField } from "../shared/instance-id-field";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "performance-start-trace"],
  aliases: ["browser-performance-start-trace"] as const,
  title: "performance-start-trace.title",
  titleShort: "performance-start-trace.titleShort",
  description: "performance-start-trace.description",
  category: "browser",
  subCategory: "DevTools",
  icon: "activity",
  tags: [
    "performance-start-trace.tags.browserAutomation",
    "performance-start-trace.tags.performanceAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      reload: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "performance-start-trace.form.fields.reload.label",
        description: "performance-start-trace.form.fields.reload.description",
        placeholder: "performance-start-trace.form.fields.reload.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Determines if, once tracing has started, the page should be automatically reloaded",
          ),
      }),
      autoStop: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "performance-start-trace.form.fields.autoStop.label",
        description: "performance-start-trace.form.fields.autoStop.description",
        placeholder: "performance-start-trace.form.fields.autoStop.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Determines if the trace recording should be automatically stopped",
          ),
      }),
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "performance-start-trace.form.fields.reload.label",
        description: "performance-start-trace.form.fields.reload.description",
        columns: 12,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute file path, or a file path relative to the current working directory, to save the raw trace data. For example, trace.json.gz (compressed) or trace.json (uncompressed).",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the trace start operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .array(
            z.object({
              type: z.string().describe("Content type (text or image)"),
              text: z.string().optional().describe("Text content"),
              data: z.string().optional().describe("Base64 encoded data"),
              mimeType: z.string().optional().describe("MIME type for data"),
            }),
          )
          .optional()
          .describe("MCP content blocks returned by the tool"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { reload: true, autoStop: true },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# performance_start_trace response\nTrace recording started.",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "performance-start-trace.errors.validation.title",
      description: "performance-start-trace.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "performance-start-trace.errors.network.title",
      description: "performance-start-trace.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "performance-start-trace.errors.unauthorized.title",
      description: "performance-start-trace.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "performance-start-trace.errors.forbidden.title",
      description: "performance-start-trace.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "performance-start-trace.errors.notFound.title",
      description: "performance-start-trace.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "performance-start-trace.errors.serverError.title",
      description: "performance-start-trace.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "performance-start-trace.errors.unknown.title",
      description: "performance-start-trace.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "performance-start-trace.errors.unsavedChanges.title",
      description: "performance-start-trace.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "performance-start-trace.errors.conflict.title",
      description: "performance-start-trace.errors.conflict.description",
    },
  },
  successTypes: {
    title: "performance-start-trace.success.title",
    description: "performance-start-trace.success.description",
  },
});

export type PerformanceStartTraceRequestInput = typeof POST.types.RequestInput;
export type PerformanceStartTraceRequestOutput =
  typeof POST.types.RequestOutput;
export type PerformanceStartTraceResponseInput =
  typeof POST.types.ResponseInput;
export type PerformanceStartTraceResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
