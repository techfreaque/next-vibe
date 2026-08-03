/**
 * GetNetworkRequest Tool - Definition
 * Gets a network request by its ID
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
  path: ["browser", "get-network-request"],
  aliases: ["browser-get-network-request"] as const,
  title: "get-network-request.title",
  titleShort: "get-network-request.titleShort",
  description: "get-network-request.description",
  dynamicTitle: ({ request }) => {
    if (request?.reqid !== undefined) {
      return {
        message: "get-network-request.dynamicTitle" as const,
        messageParams: { id: String(request.reqid) },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "DevTools",
  icon: "network",
  tags: [
    "get-network-request.tags.browserAutomation",
    "get-network-request.tags.networkAnalysis",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      reqid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get-network-request.form.fields.reqid.label",
        description: "get-network-request.form.fields.reqid.description",
        placeholder: "get-network-request.form.fields.reqid.placeholder",
        columns: 4,
        schema: z
          .number()
          .optional()
          .describe(
            "The reqid of the network request. If omitted returns the currently selected request in the DevTools Network panel.",
          ),
      }),
      requestFilePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get-network-request.form.fields.reqid.label",
        description: "get-network-request.form.fields.reqid.description",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute or relative path to save the request body to. If omitted, the body is returned inline.",
          ),
      }),
      responseFilePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get-network-request.form.fields.reqid.label",
        description: "get-network-request.form.fields.reqid.description",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute or relative path to save the response body to. If omitted, the body is returned inline.",
          ),
      }),
      maxBodyLength: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get-network-request.form.fields.maxBodyLength.label",
        description:
          "get-network-request.form.fields.maxBodyLength.description",
        placeholder:
          "get-network-request.form.fields.maxBodyLength.placeholder",
        columns: 4,
        schema: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            "Maximum number of characters to return from inline request/response bodies. Bodies exceeding this limit are truncated with a notice. Omit for no limit.",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe(
            "Whether the network request retrieval operation succeeded",
          ),
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
      default: { reqid: 456 },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# get_network_request response\nGET https://example.com - 200 document",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get-network-request.errors.validation.title",
      description: "get-network-request.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get-network-request.errors.network.title",
      description: "get-network-request.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get-network-request.errors.unauthorized.title",
      description: "get-network-request.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get-network-request.errors.forbidden.title",
      description: "get-network-request.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get-network-request.errors.notFound.title",
      description: "get-network-request.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get-network-request.errors.serverError.title",
      description: "get-network-request.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get-network-request.errors.unknown.title",
      description: "get-network-request.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get-network-request.errors.unsavedChanges.title",
      description: "get-network-request.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get-network-request.errors.conflict.title",
      description: "get-network-request.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get-network-request.success.title",
    description: "get-network-request.success.description",
  },
});

export type GetNetworkRequestRequestInput = typeof POST.types.RequestInput;
export type GetNetworkRequestRequestOutput = typeof POST.types.RequestOutput;
export type GetNetworkRequestResponseInput = typeof POST.types.ResponseInput;
export type GetNetworkRequestResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
