/**
 * Desktop PressKey Tool - Definition
 * Press a key or key combination using xdotool key
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

const PressKeyWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PressKeyWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "press-key"],
  title: "press-key.title",
  description: "press-key.description",
  dynamicTitle: ({ request }) => {
    if (request?.key) {
      return {
        message: "press-key.dynamicTitle" as const,
        messageParams: { key: String(request.key) },
      };
    }
    return undefined;
  },
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopInteraction",
  icon: "keyboard",
  tags: ["press-key.tags.desktopAutomation", "press-key.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: PressKeyWidget,
    usage: { request: "data", response: true } as const,
    children: {
      key: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "press-key.form.fields.key.label",
        description: "press-key.form.fields.key.description",
        placeholder: "press-key.form.fields.key.placeholder",
        columns: 6,
        schema: z
          .string()
          .min(1)
          .describe(
            "Key name or combination in xdotool syntax. Examples: Return, ctrl+c, alt+F4, super+d.",
          ),
      }),
      repeat: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "press-key.form.fields.repeat.label",
        description: "press-key.form.fields.repeat.description",
        placeholder: "press-key.form.fields.repeat.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(1)
          .describe("Number of times to press the key (default: 1)"),
      }),
      delay: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "press-key.form.fields.delay.label",
        description: "press-key.form.fields.delay.description",
        placeholder: "press-key.form.fields.delay.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(0)
          .max(5000)
          .optional()
          .default(0)
          .describe(
            "Delay between repeated key presses in milliseconds (default: 0)",
          ),
      }),
      windowId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "press-key.form.fields.windowId.label",
        description: "press-key.form.fields.windowId.description",
        placeholder: "press-key.form.fields.windowId.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Focus this window UUID before pressing the key. Get from list-windows.",
          ),
      }),
      windowTitle: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "press-key.form.fields.windowTitle.label",
        description: "press-key.form.fields.windowTitle.description",
        placeholder: "press-key.form.fields.windowTitle.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Focus window whose title contains this string before pressing the key.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "press-key.response.success",
        schema: z
          .boolean()
          .describe("Whether the key press operation succeeded"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "press-key.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "press-key.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      enter: { key: "Return" },
      copy: { key: "ctrl+c" },
      close: { key: "alt+F4" },
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
      title: "press-key.errors.validation.title",
      description: "press-key.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "press-key.errors.network.title",
      description: "press-key.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "press-key.errors.unauthorized.title",
      description: "press-key.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "press-key.errors.forbidden.title",
      description: "press-key.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "press-key.errors.notFound.title",
      description: "press-key.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "press-key.errors.serverError.title",
      description: "press-key.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "press-key.errors.unknown.title",
      description: "press-key.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "press-key.errors.unsavedChanges.title",
      description: "press-key.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "press-key.errors.conflict.title",
      description: "press-key.errors.conflict.description",
    },
  },
  successTypes: {
    title: "press-key.success.title",
    description: "press-key.success.description",
  },
});

export type DesktopPressKeyRequestInput = typeof POST.types.RequestInput;
export type DesktopPressKeyRequestOutput = typeof POST.types.RequestOutput;
export type DesktopPressKeyResponseInput = typeof POST.types.ResponseInput;
export type DesktopPressKeyResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
