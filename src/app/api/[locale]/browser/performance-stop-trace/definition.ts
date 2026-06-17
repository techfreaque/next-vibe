/**
 * PerformanceStopTrace Tool - Definition
 * Stops the active performance trace recording on the selected page
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";
import { browserInstanceIdField } from "../shared/instance-id-field";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "performance-stop-trace"],
  aliases: ["browser-performance-stop-trace"] as const,
  title: "performance-stop-trace.title",
  titleShort: "performance-stop-trace.titleShort",
  description: "performance-stop-trace.description",
  category: "browser",
  subCategory: "DevTools",
  icon: "pause-circle",
  tags: [
    "performance-stop-trace.tags.browserAutomation",
    "performance-stop-trace.tags.performanceAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "performance-stop-trace.response.success",
        description: "performance-stop-trace.response.success",
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
          .describe("Whether the trace stop operation succeeded"),
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
      default: {},
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# performance_stop_trace response\nTrace stopped. LCP: 2500ms, FCP: 1800ms, CLS: 0.1, TTI: 3200ms",
          },
        ],
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
