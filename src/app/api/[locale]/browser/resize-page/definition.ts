/**
 * ResizePage Tool - Definition
 * Resizes the selected page's window
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
  path: ["browser", "resize-page"],
  title: "resize-page.title",
  description: "resize-page.description",
  category: "endpointCategories.browser",
  subCategory: "endpointCategories.browserPages",
  icon: "maximize",
  tags: [
    "resize-page.tags.browserAutomation",
    "resize-page.tags.viewportAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "resize-page.form.label",
    description: "resize-page.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
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

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "resize-page.response.success",
        schema: z
          .boolean()
          .describe("Whether the page resize operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "resize-page.response.result",
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
        content: "resize-page.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "resize-page.response.executionId",
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
