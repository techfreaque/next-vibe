/**
 * NavigatePage Tool - Definition
 * Navigates the currently selected page to a URL
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
  path: ["browser", "navigate-page"],
  aliases: ["browser-navigate-page"] as const,
  title: "navigate-page.title",
  titleShort: "navigate-page.titleShort",
  description: "navigate-page.description",
  dynamicTitle: ({ request }) => {
    const target = request?.url || request?.type;
    if (target) {
      const short =
        typeof target === "string" && target.length > 60
          ? `${target.slice(0, 60)}…`
          : target;
      return {
        message: "navigate-page.dynamicTitle" as const,
        messageParams: { target: String(short) },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "Pages",
  icon: "navigation",
  tags: [
    "navigate-page.tags.browserAutomation",
    "navigate-page.tags.navigationAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "navigate-page.form.fields.type.label",
        description: "navigate-page.form.fields.type.description",
        placeholder: "navigate-page.form.fields.type.placeholder",
        columns: 6,
        options: [
          {
            label: "navigate-page.form.fields.type.options.url" as const,
            value: "url",
          },
          {
            label: "navigate-page.form.fields.type.options.back" as const,
            value: "back",
          },
          {
            label: "navigate-page.form.fields.type.options.forward" as const,
            value: "forward",
          },
          {
            label: "navigate-page.form.fields.type.options.reload" as const,
            value: "reload",
          },
        ],
        schema: z
          .enum(["url", "back", "forward", "reload"])
          .optional()
          .describe(
            "Navigate the page by URL, back or forward in history, or reload.",
          ),
      }),
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "navigate-page.form.fields.url.label",
        description: "navigate-page.form.fields.url.description",
        placeholder: "navigate-page.form.fields.url.placeholder",
        columns: 6,
        schema: z.string().optional().describe("Target URL (only type=url)"),
      }),
      ignoreCache: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "navigate-page.form.fields.ignoreCache.label",
        description: "navigate-page.form.fields.ignoreCache.description",
        placeholder: "navigate-page.form.fields.ignoreCache.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .optional()
          .describe("Whether to ignore cache on reload."),
      }),
      handleBeforeUnload: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "navigate-page.form.fields.ignoreCache.label",
        description: "navigate-page.form.fields.ignoreCache.description",
        columns: 6,
        options: [
          {
            label: "navigate-page.form.fields.type.options.url" as const,
            value: "accept",
          },
          {
            label: "navigate-page.form.fields.type.options.back" as const,
            value: "decline",
          },
        ],
        schema: z
          .enum(["accept", "decline"])
          .optional()
          .describe(
            "Whether to auto accept or beforeunload dialogs triggered by this navigation. Default is accept.",
          ),
      }),
      initScript: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "navigate-page.form.fields.url.label",
        description: "navigate-page.form.fields.url.description",
        columns: 12,
        schema: z
          .string()
          .optional()
          .describe(
            "A JavaScript script to be executed on each new document before any other scripts for the next navigation.",
          ),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "navigate-page.form.fields.timeout.label",
        description: "navigate-page.form.fields.timeout.description",
        placeholder: "navigate-page.form.fields.timeout.placeholder",
        columns: 6,
        schema: z
          .number()
          .optional()
          .describe(
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used.",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the navigation operation succeeded"),
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
      default: { type: "url", url: "https://example.com" },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# navigate_page response\nNavigated to https://example.com",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "navigate-page.errors.validation.title",
      description: "navigate-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "navigate-page.errors.network.title",
      description: "navigate-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "navigate-page.errors.unauthorized.title",
      description: "navigate-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "navigate-page.errors.forbidden.title",
      description: "navigate-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "navigate-page.errors.notFound.title",
      description: "navigate-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "navigate-page.errors.serverError.title",
      description: "navigate-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "navigate-page.errors.unknown.title",
      description: "navigate-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "navigate-page.errors.unsavedChanges.title",
      description: "navigate-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "navigate-page.errors.conflict.title",
      description: "navigate-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "navigate-page.success.title",
    description: "navigate-page.success.description",
  },
});

export type NavigatePageRequestInput = typeof POST.types.RequestInput;
export type NavigatePageRequestOutput = typeof POST.types.RequestOutput;
export type NavigatePageResponseInput = typeof POST.types.ResponseInput;
export type NavigatePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
