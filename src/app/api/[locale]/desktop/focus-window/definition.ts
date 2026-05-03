/**
 * Desktop FocusWindow Tool - Definition
 * Bring a window to the foreground using wmctrl
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

const FocusWindowWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.FocusWindowWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "focus-window"],
  title: "focus-window.title",
  description: "focus-window.description",
  dynamicTitle: ({ request }) => {
    const target = request?.title || request?.windowId || request?.pid;
    if (target) {
      return {
        message: "focus-window.dynamicTitle" as const,
        messageParams: { target: String(target) },
      };
    }
    return undefined;
  },
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopWindows",
  icon: "maximize",
  tags: [
    "focus-window.tags.desktopAutomation",
    "focus-window.tags.windowManagement",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: FocusWindowWidget,
    usage: { request: "data", response: true } as const,
    children: {
      windowId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "focus-window.form.fields.windowId.label",
        description: "focus-window.form.fields.windowId.description",
        placeholder: "focus-window.form.fields.windowId.placeholder",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "X11 window ID in hex (e.g. 0x3200001). Takes priority over pid and title.",
          ),
      }),
      pid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "focus-window.form.fields.pid.label",
        description: "focus-window.form.fields.pid.description",
        placeholder: "focus-window.form.fields.pid.placeholder",
        columns: 4,
        schema: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Focus the window belonging to this process ID"),
      }),
      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "focus-window.form.fields.title.label",
        description: "focus-window.form.fields.title.description",
        placeholder: "focus-window.form.fields.title.placeholder",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "Focus the first window whose title contains this string (case-sensitive)",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "focus-window.response.success",
        schema: z
          .boolean()
          .describe("Whether the window focus operation succeeded"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "focus-window.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "focus-window.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      byWindowId: { windowId: "0x3200001" },
      byPid: { pid: 12345 },
      byTitle: { title: "Firefox" },
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
      title: "focus-window.errors.validation.title",
      description: "focus-window.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "focus-window.errors.network.title",
      description: "focus-window.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "focus-window.errors.unauthorized.title",
      description: "focus-window.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "focus-window.errors.forbidden.title",
      description: "focus-window.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "focus-window.errors.notFound.title",
      description: "focus-window.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "focus-window.errors.serverError.title",
      description: "focus-window.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "focus-window.errors.unknown.title",
      description: "focus-window.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "focus-window.errors.unsavedChanges.title",
      description: "focus-window.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "focus-window.errors.conflict.title",
      description: "focus-window.errors.conflict.description",
    },
  },
  successTypes: {
    title: "focus-window.success.title",
    description: "focus-window.success.description",
  },
});

export type DesktopFocusWindowRequestInput = typeof POST.types.RequestInput;
export type DesktopFocusWindowRequestOutput = typeof POST.types.RequestOutput;
export type DesktopFocusWindowResponseInput = typeof POST.types.ResponseInput;
export type DesktopFocusWindowResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
