/**
 * ListNetworkRequests Tool - Definition
 * List all requests for the currently selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "list-network-requests"],
  title: "list-network-requests.title",
  description: "list-network-requests.description",
  category: "app.endpointCategories.browserDevTools",
  icon: "network",
  tags: [
    "list-network-requests.tags.browserAutomation",
    "list-network-requests.tags.networkAnalysis",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "list-network-requests.form.label",
    description: "list-network-requests.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      includePreservedRequests: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "list-network-requests.form.fields.includePreservedRequests.label",
        description:
          "list-network-requests.form.fields.includePreservedRequests.description",
        placeholder:
          "list-network-requests.form.fields.includePreservedRequests.placeholder",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Set to true to return the preserved requests over the last 3 navigations.",
          ),
      }),
      pageIdx: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "list-network-requests.form.fields.pageIdx.label",
        description: "list-network-requests.form.fields.pageIdx.description",
        placeholder: "list-network-requests.form.fields.pageIdx.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(0)
          .optional()
          .describe(
            "Page number to return (0-based). When omitted, returns the first page.",
          ),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "list-network-requests.form.fields.pageSize.label",
        description: "list-network-requests.form.fields.pageSize.description",
        placeholder: "list-network-requests.form.fields.pageSize.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(1)
          .optional()
          .describe(
            "Maximum number of requests to return. When omitted, returns all requests.",
          ),
      }),
      resourceTypes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "list-network-requests.form.fields.resourceTypes.label",
        description:
          "list-network-requests.form.fields.resourceTypes.description",
        placeholder:
          "list-network-requests.form.fields.resourceTypes.placeholder",
        columns: 12,
        schema: z
          .array(
            z.enum([
              "document",
              "stylesheet",
              "image",
              "media",
              "font",
              "script",
              "texttrack",
              "xhr",
              "fetch",
              "prefetch",
              "eventsource",
              "websocket",
              "manifest",
              "signedexchange",
              "ping",
              "cspviolationreport",
              "preflight",
              "fedcm",
              "other",
            ]),
          )
          .optional()
          .describe(
            "Filter requests to only return requests of the specified resource types. When omitted or empty, returns all requests.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-network-requests.response.success",
        schema: z
          .boolean()
          .describe("Whether the network requests listing operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-network-requests.response.result",
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
        content: "list-network-requests.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-network-requests.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { pageIdx: 0 },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# list_network_requests response\n[1] GET https://example.com - 200 document",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-network-requests.errors.validation.title",
      description: "list-network-requests.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-network-requests.errors.network.title",
      description: "list-network-requests.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-network-requests.errors.unauthorized.title",
      description: "list-network-requests.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-network-requests.errors.forbidden.title",
      description: "list-network-requests.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-network-requests.errors.notFound.title",
      description: "list-network-requests.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-network-requests.errors.serverError.title",
      description: "list-network-requests.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-network-requests.errors.unknown.title",
      description: "list-network-requests.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-network-requests.errors.unsavedChanges.title",
      description: "list-network-requests.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-network-requests.errors.conflict.title",
      description: "list-network-requests.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-network-requests.success.title",
    description: "list-network-requests.success.description",
  },
});

export type ListNetworkRequestsRequestInput = typeof POST.types.RequestInput;
export type ListNetworkRequestsRequestOutput = typeof POST.types.RequestOutput;
export type ListNetworkRequestsResponseInput = typeof POST.types.ResponseInput;
export type ListNetworkRequestsResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
