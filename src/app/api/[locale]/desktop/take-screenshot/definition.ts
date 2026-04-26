/**
 * Desktop TakeScreenshot Tool - Definition
 * Capture a screenshot of the desktop using spectacle (fallback: scrot)
 */

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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const TakeScreenshotWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TakeScreenshotWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "take-screenshot"],
  title: "take-screenshot.title",
  description: "take-screenshot.description",
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopCapture",
  icon: "monitor",
  tags: [
    "take-screenshot.tags.desktopAutomation",
    "take-screenshot.tags.captureAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: TakeScreenshotWidget,
    usage: { request: "data", response: true } as const,
    children: {
      outputPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "take-screenshot.form.fields.outputPath.label",
        description: "take-screenshot.form.fields.outputPath.description",
        placeholder: "take-screenshot.form.fields.outputPath.placeholder",
        columns: 8,
        schema: z
          .string()
          .optional()
          .describe(
            "Absolute path to save the screenshot. Omit to return inline base64 image.",
          ),
      }),
      screen: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "take-screenshot.form.fields.screen.label",
        description: "take-screenshot.form.fields.screen.description",
        placeholder: "take-screenshot.form.fields.screen.placeholder",
        columns: 4,
        schema: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe(
            "Screen/monitor index (0 = primary). Prefer monitorName over this.",
          ),
      }),
      monitorName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "take-screenshot.form.fields.monitorName.label",
        description: "take-screenshot.form.fields.monitorName.description",
        placeholder: "take-screenshot.form.fields.monitorName.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Monitor name (e.g. DP-1, HDMI-1). Use list-monitors to see available names. Takes priority over screen index.",
          ),
      }),
      capturedMonitor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.monitorName",
        schema: z
          .string()
          .optional()
          .describe("Monitor name that was captured"),
      }),
      maxWidth: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "take-screenshot.form.fields.maxWidth.label",
        description: "take-screenshot.form.fields.maxWidth.description",
        placeholder: "take-screenshot.form.fields.maxWidth.placeholder",
        columns: 6,
        schema: z
          .number()
          .int()
          .min(320)
          .max(7680)
          .optional()
          .describe(
            "Max width in pixels. Image is downscaled proportionally if wider. Useful for multi-monitor all-screen captures. Requires ImageMagick (auto-installed).",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.success",
        schema: z
          .boolean()
          .describe("Whether the screenshot capture succeeded"),
      }),
      imagePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.imagePath",
        schema: z
          .string()
          .optional()
          .describe("Path where the screenshot was saved"),
      }),
      imageData: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.imageData",
        schema: z
          .string()
          .optional()
          .describe("Base64-encoded PNG screenshot data"),
      }),
      width: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.width",
        schema: z.number().optional().describe("Screenshot width in pixels"),
      }),
      height: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.height",
        schema: z.number().optional().describe("Screenshot height in pixels"),
      }),
      originalWidth: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.originalWidth",
        schema: z
          .number()
          .optional()
          .describe("Original screenshot width before downscaling"),
      }),
      originalHeight: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "take-screenshot.response.originalHeight",
        schema: z
          .number()
          .optional()
          .describe("Original screenshot height before downscaling"),
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
      inline: {},
      toFile: { outputPath: "/tmp/screenshot.png" },
    },
    responses: {
      default: {
        success: true,
        imagePath: "/tmp/screenshot.png",
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

export type DesktopTakeScreenshotRequestInput = typeof POST.types.RequestInput;
export type DesktopTakeScreenshotRequestOutput =
  typeof POST.types.RequestOutput;
export type DesktopTakeScreenshotResponseInput =
  typeof POST.types.ResponseInput;
export type DesktopTakeScreenshotResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
