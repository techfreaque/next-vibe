/**
 * NewPage Tool - Definition
 * Creates a new page
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
import { BROWSER_NEW_PAGE_ALIAS } from "./constants";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "new-page"],
  aliases: [BROWSER_NEW_PAGE_ALIAS] as const,
  title: "new-page.title",
  titleShort: "new-page.titleShort",
  description: "new-page.description",
  dynamicTitle: ({ request }) => {
    if (request?.url) {
      const url = String(request.url);
      const short = url.length > 60 ? `${url.slice(0, 60)}…` : url;
      return {
        message: "new-page.dynamicTitle" as const,
        messageParams: { url: short },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "Pages",
  icon: "file-plus",
  tags: [
    "new-page.tags.browserAutomation",
    "new-page.tags.navigationAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "new-page.form.fields.url.label",
        description: "new-page.form.fields.url.description",
        placeholder: "new-page.form.fields.url.placeholder",
        columns: 8,
        schema: z.string().describe("URL to load in a new page."),
      }),
      replacePage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "new-page.form.fields.replacePage.label",
        description: "new-page.form.fields.replacePage.description",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(true)
          .describe(
            "When true (default), closes all existing pages for this session before opening the new one — one tab per session. Set to false to accumulate pages (open an additional tab regardless of existing ones). This never affects other sessions.",
          ),
      }),
      background: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "new-page.form.fields.url.label",
        description: "new-page.form.fields.url.description",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .describe(
            "Whether to open the page in the background without bringing it to the front. Default is false (foreground).",
          ),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "new-page.form.fields.timeout.label",
        description: "new-page.form.fields.timeout.description",
        placeholder: "new-page.form.fields.timeout.placeholder",
        columns: 4,
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
          .describe("Whether the new page creation operation succeeded"),
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
      default: { url: "https://example.com", replacePage: true },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# new_page response\nCreated new page at https://example.com",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "new-page.errors.validation.title",
      description: "new-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "new-page.errors.network.title",
      description: "new-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "new-page.errors.unauthorized.title",
      description: "new-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "new-page.errors.forbidden.title",
      description: "new-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "new-page.errors.notFound.title",
      description: "new-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "new-page.errors.serverError.title",
      description: "new-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "new-page.errors.unknown.title",
      description: "new-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "new-page.errors.unsavedChanges.title",
      description: "new-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "new-page.errors.conflict.title",
      description: "new-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "new-page.success.title",
    description: "new-page.success.description",
  },
});

export type NewPageRequestInput = typeof POST.types.RequestInput;
export type NewPageRequestOutput = typeof POST.types.RequestOutput;
export type NewPageResponseInput = typeof POST.types.ResponseInput;
export type NewPageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
