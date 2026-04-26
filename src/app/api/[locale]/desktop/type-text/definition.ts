/**
 * Desktop TypeText Tool - Definition
 * Type text into the focused window using xdotool type
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

import { scopedTranslation } from "../i18n";

const TypeTextWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TypeTextWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "type-text"],
  title: "type-text.title",
  description: "type-text.description",
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopInteraction",
  icon: "keyboard",
  tags: ["type-text.tags.desktopAutomation", "type-text.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: TypeTextWidget,
    usage: { request: "data", response: true } as const,
    children: {
      text: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "type-text.form.fields.text.label",
        description: "type-text.form.fields.text.description",
        placeholder: "type-text.form.fields.text.placeholder",
        columns: 12,
        schema: z
          .string()
          .min(1)
          .describe("The text to type into the focused window"),
      }),
      delay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "type-text.form.fields.delay.label",
        description: "type-text.form.fields.delay.description",
        placeholder: "type-text.form.fields.delay.placeholder",
        columns: 6,
        schema: z
          .number()
          .int()
          .min(0)
          .max(1000)
          .optional()
          .default(12)
          .describe(
            "Delay between keystrokes in milliseconds (default: 12). Use 0 for fastest input.",
          ),
      }),
      windowId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "type-text.form.fields.windowId.label",
        description: "type-text.form.fields.windowId.description",
        placeholder: "type-text.form.fields.windowId.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Focus this window UUID before typing. Get from list-windows or get-focused-window.",
          ),
      }),
      windowTitle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "type-text.form.fields.windowTitle.label",
        description: "type-text.form.fields.windowTitle.description",
        placeholder: "type-text.form.fields.windowTitle.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Focus window whose title contains this string before typing.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "type-text.response.success",
        schema: z.boolean().describe("Whether text was typed successfully"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "type-text.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "type-text.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { text: "Hello, World!" },
      slow: { text: "Typing slowly", delay: 100 },
    },
    responses: {
      default: {
        success: true,
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "type-text.errors.validation.title",
      description: "type-text.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "type-text.errors.network.title",
      description: "type-text.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "type-text.errors.unauthorized.title",
      description: "type-text.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "type-text.errors.forbidden.title",
      description: "type-text.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "type-text.errors.notFound.title",
      description: "type-text.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "type-text.errors.serverError.title",
      description: "type-text.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "type-text.errors.unknown.title",
      description: "type-text.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "type-text.errors.unsavedChanges.title",
      description: "type-text.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "type-text.errors.conflict.title",
      description: "type-text.errors.conflict.description",
    },
  },
  successTypes: {
    title: "type-text.success.title",
    description: "type-text.success.description",
  },
});

export type DesktopTypeTextRequestInput = typeof POST.types.RequestInput;
export type DesktopTypeTextRequestOutput = typeof POST.types.RequestOutput;
export type DesktopTypeTextResponseInput = typeof POST.types.ResponseInput;
export type DesktopTypeTextResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
