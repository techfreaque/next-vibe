/**
 * Desktop GetFocusedWindow Tool - Definition
 * Get info about the active window using xdotool
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const GetFocusedWindowWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GetFocusedWindowWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "get-focused-window"],
  aliases: ["desktop-get-focused-window"] as const,
  title: "get-focused-window.title",
  titleShort: "get-focused-window.titleShort",
  description: "get-focused-window.description",
  category: "desktop",
  subCategory: "Windows",
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
        label: "get-focused-window.response.success",
        schema: z
          .boolean()
          .describe("Whether the window info retrieval succeeded"),
      }),
      windowId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.windowId",
        schema: z
          .string()
          .optional()
          .describe("X11 window ID of the focused window (hex format)"),
      }),
      windowTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.windowTitle",
        schema: z
          .string()
          .optional()
          .describe("Title text of the focused window"),
      }),
      pid: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.pid",
        schema: z
          .number()
          .optional()
          .describe("Process ID of the focused window"),
      }),
      width: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.width",
        schema: z.number().optional().describe("Window width in pixels"),
      }),
      height: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.height",
        schema: z.number().optional().describe("Window height in pixels"),
      }),
      monitor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.monitor",
        schema: z
          .string()
          .optional()
          .describe("Monitor/display the window is on (e.g. DP-1, HDMI-A-1)"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get-focused-window.response.executionId",
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
        width: 1920,
        height: 1080,
        monitor: "DP-1",
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
