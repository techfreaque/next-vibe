/**
 * Desktop GetFocusedWindow Tool - Definition
 * Get info about the active window using xdotool
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

import { scopedTranslation } from "../i18n";

const GetFocusedWindowWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GetFocusedWindowWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "get-focused-window"],
  title: "get-focused-window.title",
  description: "get-focused-window.description",
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopWindows",
  icon: "eye",
  tags: [
    "get-focused-window.tags.desktopAutomation",
    "get-focused-window.tags.windowManagement",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: GetFocusedWindowWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.success",
        schema: z
          .boolean()
          .describe("Whether the window info retrieval succeeded"),
      }),
      windowId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.windowId",
        schema: z
          .string()
          .optional()
          .describe("X11 window ID of the focused window (hex format)"),
      }),
      windowTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.windowTitle",
        schema: z
          .string()
          .optional()
          .describe("Title text of the focused window"),
      }),
      pid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.pid",
        schema: z
          .number()
          .optional()
          .describe("Process ID of the focused window"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-focused-window.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: undefined,
    responses: {
      default: {
        success: true,
        windowId: "0x3200001",
        windowTitle: "Mozilla Firefox",
        pid: 12345,
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get-focused-window.errors.validation.title",
      description: "get-focused-window.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get-focused-window.errors.network.title",
      description: "get-focused-window.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get-focused-window.errors.unauthorized.title",
      description: "get-focused-window.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get-focused-window.errors.forbidden.title",
      description: "get-focused-window.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get-focused-window.errors.notFound.title",
      description: "get-focused-window.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get-focused-window.errors.serverError.title",
      description: "get-focused-window.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get-focused-window.errors.unknown.title",
      description: "get-focused-window.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get-focused-window.errors.unsavedChanges.title",
      description: "get-focused-window.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get-focused-window.errors.conflict.title",
      description: "get-focused-window.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get-focused-window.success.title",
    description: "get-focused-window.success.description",
  },
});

export type DesktopGetFocusedWindowRequestInput =
  typeof POST.types.RequestInput;
export type DesktopGetFocusedWindowRequestOutput =
  typeof POST.types.RequestOutput;
export type DesktopGetFocusedWindowResponseInput =
  typeof POST.types.ResponseInput;
export type DesktopGetFocusedWindowResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
