/**
 * Desktop TypeText Tool - Definition
 * Type text into the focused window using xdotool type
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

const TypeTextWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TypeTextWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "type-text"],
  aliases: ["desktop-type-text"] as const,
  title: "type-text.title",
  titleShort: "type-text.titleShort",
  description: "type-text.description",
  dynamicTitle: ({ request }) => {
    if (request?.text) {
      const text = String(request.text);
      const short = text.length > 30 ? `${text.slice(0, 30)}…` : text;
      return {
        message: "type-text.dynamicTitle" as const,
        messageParams: { text: short },
      };
    }
    return undefined;
  },
  category: "desktop",
  subCategory: "Interaction",
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
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list-windows/definition")).default.POST,
        labelField: "title",
        label: "type-text.form.fields.windowId.label",
        description: "type-text.form.fields.windowId.description",
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
        label: "type-text.response.success",
        schema: z.boolean().describe("Whether text was typed successfully"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "type-text.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "type-text.response.executionId",
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
