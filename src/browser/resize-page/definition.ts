/**
 * ResizePage Tool - Definition
 * Resizes the selected page's window
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
  path: ["browser", "resize-page"],
  aliases: ["browser-resize-page"] as const,
  title: "resize-page.title",
  titleShort: "resize-page.titleShort",
  description: "resize-page.description",
  dynamicTitle: ({ request }) => {
    if (request?.width !== undefined && request?.height !== undefined) {
      return {
        message: "resize-page.dynamicTitle" as const,
        messageParams: {
          width: String(request.width),
          height: String(request.height),
        },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "Pages",
  icon: "maximize",
  tags: [
    "resize-page.tags.browserAutomation",
    "resize-page.tags.viewportAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      width: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "resize-page.form.fields.width.label",
        description: "resize-page.form.fields.width.description",
        placeholder: "resize-page.form.fields.width.placeholder",
        columns: 6,
        schema: z.coerce.number().describe("Page width"),
      }),
      height: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "resize-page.form.fields.height.label",
        description: "resize-page.form.fields.height.description",
        placeholder: "resize-page.form.fields.height.placeholder",
        columns: 6,
        schema: z.coerce.number().describe("Page height"),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the page resize operation succeeded"),
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
      default: { width: 1920, height: 1080 },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# resize_page response\nResized page to 1920x1080.",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "resize-page.errors.validation.title",
      description: "resize-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "resize-page.errors.network.title",
      description: "resize-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "resize-page.errors.unauthorized.title",
      description: "resize-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "resize-page.errors.forbidden.title",
      description: "resize-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "resize-page.errors.notFound.title",
      description: "resize-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "resize-page.errors.serverError.title",
      description: "resize-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "resize-page.errors.unknown.title",
      description: "resize-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "resize-page.errors.unsavedChanges.title",
      description: "resize-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "resize-page.errors.conflict.title",
      description: "resize-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "resize-page.success.title",
    description: "resize-page.success.description",
  },
});

export type ResizePageRequestInput = typeof POST.types.RequestInput;
export type ResizePageRequestOutput = typeof POST.types.RequestOutput;
export type ResizePageResponseInput = typeof POST.types.ResponseInput;
export type ResizePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
