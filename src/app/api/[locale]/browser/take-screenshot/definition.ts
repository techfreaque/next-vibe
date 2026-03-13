/**
 * TakeScreenshot Tool - Definition
 * Take a screenshot of the page or element
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
  path: ["browser", "take-screenshot"],
  title: "take-screenshot.title",
  description: "take-screenshot.description",
  category: "app.endpointCategories.browser",
  icon: "camera",
  tags: [
    "take-screenshot.tags.browserAutomation",
    "take-screenshot.tags.captureAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "take-screenshot.form.label",
    description: "take-screenshot.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "take-screenshot.form.fields.uid.label",
        description: "take-screenshot.form.fields.uid.description",
        placeholder: "take-screenshot.form.fields.uid.placeholder",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "The uid of an element on the page from the page content snapshot. If omitted takes a pages screenshot.",
          ),
      }),
      fullPage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "take-screenshot.form.fields.fullPage.label",
        description: "take-screenshot.form.fields.fullPage.description",
        placeholder: "take-screenshot.form.fields.fullPage.placeholder",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .describe(
            "If set to true takes a screenshot of the full page instead of the currently visible viewport. Incompatible with uid.",
          ),
      }),
      format: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "take-screenshot.form.fields.format.label",
        description: "take-screenshot.form.fields.format.description",
        placeholder: "take-screenshot.form.fields.format.placeholder",
        columns: 4,
        options: [
          {
            value: "png",
            label: "take-screenshot.form.fields.format.options.png" as const,
          },
          {
            value: "jpeg",
            label: "take-screenshot.form.fields.format.options.jpeg" as const,
          },
          {
            value: "webp",
            label: "take-screenshot.form.fields.format.options.webp" as const,
          },
        ],
        schema: z
          .enum(["png", "jpeg", "webp"])
          .optional()
          .default("png")
          .describe(
            'Type of format to save the screenshot as. Default is "png"',
          ),
      }),
      quality: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "take-screenshot.form.fields.quality.label",
        description: "take-screenshot.form.fields.quality.description",
        placeholder: "take-screenshot.form.fields.quality.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe(
            "Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format.",
          ),
      }),
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "take-screenshot.form.fields.filePath.label",
        description: "take-screenshot.form.fields.filePath.description",
        placeholder: "take-screenshot.form.fields.filePath.placeholder",
        columns: 8,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.success",
        schema: z
          .boolean()
          .describe("Whether the screenshot capture operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.result",
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
        content: "take-screenshot.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { format: "png", filePath: "/path/to/file.txt" },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# take_screenshot response\nTook a screenshot of the current page's viewport.",
          },
          { type: "image", data: "iVBORw0KGgoAAAANSUhEUgAA..." },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "take-screenshot.errors.validation.title",
      description: "take-screenshot.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "take-screenshot.errors.network.title",
      description: "take-screenshot.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "take-screenshot.errors.unauthorized.title",
      description: "take-screenshot.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "take-screenshot.errors.forbidden.title",
      description: "take-screenshot.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "take-screenshot.errors.notFound.title",
      description: "take-screenshot.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "take-screenshot.errors.serverError.title",
      description: "take-screenshot.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "take-screenshot.errors.unknown.title",
      description: "take-screenshot.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "take-screenshot.errors.unsavedChanges.title",
      description: "take-screenshot.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "take-screenshot.errors.conflict.title",
      description: "take-screenshot.errors.conflict.description",
    },
  },
  successTypes: {
    title: "take-screenshot.success.title",
    description: "take-screenshot.success.description",
  },
});

export type TakeScreenshotRequestInput = typeof POST.types.RequestInput;
export type TakeScreenshotRequestOutput = typeof POST.types.RequestOutput;
export type TakeScreenshotResponseInput = typeof POST.types.ResponseInput;
export type TakeScreenshotResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
