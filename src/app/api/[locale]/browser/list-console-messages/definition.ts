/**
 * ListConsoleMessages Tool - Definition
 * List all console messages for the currently selected page
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { browserInstanceIdField } from "../shared/instance-id-field";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "list-console-messages"],
  aliases: ["browser-list-console-messages"] as const,
  title: "list-console-messages.title",
  titleShort: "list-console-messages.titleShort",
  description: "list-console-messages.description",
  category: "browser",
  subCategory: "DevTools",
  icon: "terminal",
  tags: [
    "list-console-messages.tags.browserAutomation",
    "list-console-messages.tags.debugging",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      includePreservedMessages: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "list-console-messages.form.fields.includePreservedMessages.label",
        description:
          "list-console-messages.form.fields.includePreservedMessages.description",
        placeholder:
          "list-console-messages.form.fields.includePreservedMessages.placeholder",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Set to true to return the preserved messages over the last 3 navigations.",
          ),
      }),
      pageIdx: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "list-console-messages.form.fields.pageIdx.label",
        description: "list-console-messages.form.fields.pageIdx.description",
        placeholder: "list-console-messages.form.fields.pageIdx.placeholder",
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
        label: "list-console-messages.form.fields.pageSize.label",
        description: "list-console-messages.form.fields.pageSize.description",
        placeholder: "list-console-messages.form.fields.pageSize.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(1)
          .optional()
          .describe(
            "Maximum number of messages to return. When omitted, returns all messages.",
          ),
      }),
      types: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "list-console-messages.form.fields.types.label",
        description: "list-console-messages.form.fields.types.description",
        placeholder: "list-console-messages.form.fields.types.placeholder",
        columns: 12,
        schema: z
          .array(
            z.enum([
              "log",
              "debug",
              "info",
              "error",
              "warn",
              "dir",
              "dirxml",
              "table",
              "trace",
              "clear",
              "startGroup",
              "startGroupCollapsed",
              "endGroup",
              "assert",
              "profile",
              "profileEnd",
              "count",
              "timeEnd",
              "verbose",
              "issue",
            ]),
          )
          .optional()
          .describe(
            "Filter messages to only return messages of the specified types. When omitted or empty, returns all messages.",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the console messages listing operation succeeded"),
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
      default: { pageIdx: 0 },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# list_console_messages response\n[1] [log] Example message",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-console-messages.errors.validation.title",
      description: "list-console-messages.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-console-messages.errors.network.title",
      description: "list-console-messages.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-console-messages.errors.unauthorized.title",
      description: "list-console-messages.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-console-messages.errors.forbidden.title",
      description: "list-console-messages.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-console-messages.errors.notFound.title",
      description: "list-console-messages.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-console-messages.errors.serverError.title",
      description: "list-console-messages.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-console-messages.errors.unknown.title",
      description: "list-console-messages.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-console-messages.errors.unsavedChanges.title",
      description: "list-console-messages.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-console-messages.errors.conflict.title",
      description: "list-console-messages.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-console-messages.success.title",
    description: "list-console-messages.success.description",
  },
});

export type ListConsoleMessagesRequestInput = typeof POST.types.RequestInput;
export type ListConsoleMessagesRequestOutput = typeof POST.types.RequestOutput;
export type ListConsoleMessagesResponseInput = typeof POST.types.ResponseInput;
export type ListConsoleMessagesResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
