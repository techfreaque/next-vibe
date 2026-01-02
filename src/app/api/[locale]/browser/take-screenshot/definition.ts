/**
 * TakeScreenshot Tool - Definition
 * Take a screenshot of the page or element
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "take-screenshot"],
  title: "app.api.browser.take-screenshot.title",
  description: "app.api.browser.take-screenshot.description",
  category: "app.api.browser.category",
  icon: "camera",
  tags: ["app.api.browser.tags.browserAutomation", "app.api.browser.tags.captureAutomation"],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.take-screenshot.form.label",
      description: "app.api.browser.take-screenshot.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.take-screenshot.form.fields.uid.label",
          description: "app.api.browser.take-screenshot.form.fields.uid.description",
          placeholder: "app.api.browser.take-screenshot.form.fields.uid.placeholder",
          columns: 4,
        },
        z
          .string()
          .optional()
          .describe(
            "The uid of an element on the page from the page content snapshot. If omitted takes a pages screenshot.",
          ),
      ),
      fullPage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.browser.take-screenshot.form.fields.fullPage.label",
          description: "app.api.browser.take-screenshot.form.fields.fullPage.description",
          placeholder: "app.api.browser.take-screenshot.form.fields.fullPage.placeholder",
          columns: 4,
        },
        z
          .boolean()
          .optional()
          .describe(
            "If set to true takes a screenshot of the full page instead of the currently visible viewport. Incompatible with uid.",
          ),
      ),
      format: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.browser.take-screenshot.form.fields.format.label",
          description: "app.api.browser.take-screenshot.form.fields.format.description",
          placeholder: "app.api.browser.take-screenshot.form.fields.format.placeholder",
          columns: 4,
          options: [
            {
              value: "png",
              label: "app.api.browser.take-screenshot.form.fields.format.options.png" as const,
            },
            {
              value: "jpeg",
              label: "app.api.browser.take-screenshot.form.fields.format.options.jpeg" as const,
            },
            {
              value: "webp",
              label: "app.api.browser.take-screenshot.form.fields.format.options.webp" as const,
            },
          ],
        },
        z
          .enum(["png", "jpeg", "webp"])
          .optional()
          .default("png")
          .describe('Type of format to save the screenshot as. Default is "png"'),
      ),
      quality: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.take-screenshot.form.fields.quality.label",
          description: "app.api.browser.take-screenshot.form.fields.quality.description",
          placeholder: "app.api.browser.take-screenshot.form.fields.quality.placeholder",
          columns: 4,
        },
        z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe(
            "Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format.",
          ),
      ),
      filePath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.take-screenshot.form.fields.filePath.label",
          description: "app.api.browser.take-screenshot.form.fields.filePath.description",
          placeholder: "app.api.browser.take-screenshot.form.fields.filePath.placeholder",
          columns: 8,
        },
        z
          .string()
          .optional()
          .describe(
            "The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.take-screenshot.response.success",
        },
        z.boolean().describe("Whether the screenshot capture operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.take-screenshot.response.result",
        },
        z
          .object({
            captured: z.boolean().describe("Whether the screenshot was captured"),
            format: z.string().describe("Format of the screenshot"),
            filePath: z.string().optional().describe("Path where screenshot was saved"),
            data: z.string().optional().describe("Base64 encoded screenshot data"),
          })
          .optional()
          .describe("Result of screenshot capture"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.take-screenshot.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.take-screenshot.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { format: "png", filePath: "/path/to/file.txt" },
    },
    responses: {
      default: {
        success: true,
        result: {
          captured: true,
          format: "png",
          filePath: "/path/to/file.txt",
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.take-screenshot.errors.validation.title",
      description: "app.api.browser.take-screenshot.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.take-screenshot.errors.network.title",
      description: "app.api.browser.take-screenshot.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.take-screenshot.errors.unauthorized.title",
      description: "app.api.browser.take-screenshot.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.take-screenshot.errors.forbidden.title",
      description: "app.api.browser.take-screenshot.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.take-screenshot.errors.notFound.title",
      description: "app.api.browser.take-screenshot.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.take-screenshot.errors.serverError.title",
      description: "app.api.browser.take-screenshot.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.take-screenshot.errors.unknown.title",
      description: "app.api.browser.take-screenshot.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.take-screenshot.errors.unsavedChanges.title",
      description: "app.api.browser.take-screenshot.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.take-screenshot.errors.conflict.title",
      description: "app.api.browser.take-screenshot.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.take-screenshot.success.title",
    description: "app.api.browser.take-screenshot.success.description",
  },
});

export type TakeScreenshotRequestInput = typeof POST.types.RequestInput;
export type TakeScreenshotRequestOutput = typeof POST.types.RequestOutput;
export type TakeScreenshotResponseInput = typeof POST.types.ResponseInput;
export type TakeScreenshotResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
