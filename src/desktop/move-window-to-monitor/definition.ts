/**
 * Desktop MoveWindowToMonitor Tool - Definition
 * Move a window to a specific monitor using KWin scripting
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

const MoveWindowToMonitorWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MoveWindowToMonitorWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "move-window-to-monitor"],
  aliases: ["desktop-move-window-to-monitor"] as const,
  title: "move-window-to-monitor.title",
  titleShort: "move-window-to-monitor.titleShort",
  description: "move-window-to-monitor.description",
  dynamicTitle: ({ request }) => {
    const target =
      request?.monitorName ||
      (request?.monitorIndex !== undefined
        ? `Monitor ${request.monitorIndex}`
        : undefined);
    if (target) {
      return {
        message: "move-window-to-monitor.dynamicTitle" as const,
        messageParams: { target: String(target) },
      };
    }
    return undefined;
  },
  category: "desktop",
  subCategory: "Windows",
  icon: "monitor",
  tags: [
    "move-window-to-monitor.tags.desktopAutomation",
    "move-window-to-monitor.tags.windowManagement",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: MoveWindowToMonitorWidget,
    usage: { request: "data", response: true } as const,
    children: {
      windowId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list-windows/definition")).default.POST,
        labelField: "title",
        label: "move-window-to-monitor.form.fields.windowId.label",
        description: "move-window-to-monitor.form.fields.windowId.description",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "KWin window UUID from list-windows (e.g. {8506b52c-...}). Takes priority over pid and title.",
          ),
      }),
      pid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "move-window-to-monitor.form.fields.pid.label",
        description: "move-window-to-monitor.form.fields.pid.description",
        placeholder: "move-window-to-monitor.form.fields.pid.placeholder",
        columns: 4,
        schema: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Move the window belonging to this process ID"),
      }),
      title: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "move-window-to-monitor.form.fields.title.label",
        description: "move-window-to-monitor.form.fields.title.description",
        placeholder: "move-window-to-monitor.form.fields.title.placeholder",
        columns: 4,
        schema: z
          .string()
          .optional()
          .describe(
            "Move the first window whose title contains this string (case-insensitive)",
          ),
      }),
      monitorName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../list-monitors/definition")).default.POST,
        labelField: "name",
        label: "move-window-to-monitor.form.fields.monitorName.label",
        description:
          "move-window-to-monitor.form.fields.monitorName.description",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "Target monitor name (e.g. DP-1, HDMI-A-1). Use list-monitors to see available names. Takes priority over monitorIndex.",
          ),
      }),
      monitorIndex: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "move-window-to-monitor.form.fields.monitorIndex.label",
        description:
          "move-window-to-monitor.form.fields.monitorIndex.description",
        placeholder:
          "move-window-to-monitor.form.fields.monitorIndex.placeholder",
        columns: 6,
        schema: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe(
            "Target monitor index (0-based). Use monitorName when possible.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "move-window-to-monitor.response.success",
        schema: z.boolean().describe("Whether the move succeeded"),
      }),
      movedTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "move-window-to-monitor.response.movedTo",
        schema: z
          .string()
          .optional()
          .describe("Monitor name the window was moved to"),
      }),
      windowTitle: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "move-window-to-monitor.response.windowTitle",
        schema: z
          .string()
          .optional()
          .describe("Title of the window that was moved"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "move-window-to-monitor.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "move-window-to-monitor.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      byWindowIdToMonitor: {
        windowId: "{8506b52c-93c3-4d7a-a9f3-bd330782b36e}",
        monitorName: "DP-3",
      },
      byTitleToMonitor: { title: "Firefox", monitorName: "HDMI-A-1" },
      byPidToIndex: { pid: 2649, monitorIndex: 2 },
    },
    responses: {
      default: {
        success: true,
        movedTo: "DP-3",
        windowTitle: "Mozilla Firefox",
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "move-window-to-monitor.errors.validation.title",
      description: "move-window-to-monitor.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "move-window-to-monitor.errors.network.title",
      description: "move-window-to-monitor.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "move-window-to-monitor.errors.unauthorized.title",
      description: "move-window-to-monitor.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "move-window-to-monitor.errors.forbidden.title",
      description: "move-window-to-monitor.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "move-window-to-monitor.errors.notFound.title",
      description: "move-window-to-monitor.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "move-window-to-monitor.errors.serverError.title",
      description: "move-window-to-monitor.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "move-window-to-monitor.errors.unknown.title",
      description: "move-window-to-monitor.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "move-window-to-monitor.errors.unsavedChanges.title",
      description: "move-window-to-monitor.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "move-window-to-monitor.errors.conflict.title",
      description: "move-window-to-monitor.errors.conflict.description",
    },
  },
  successTypes: {
    title: "move-window-to-monitor.success.title",
    description: "move-window-to-monitor.success.description",
  },
});

export type DesktopMoveWindowToMonitorRequestInput =
  typeof POST.types.RequestInput;
export type DesktopMoveWindowToMonitorRequestOutput =
  typeof POST.types.RequestOutput;
export type DesktopMoveWindowToMonitorResponseInput =
  typeof POST.types.ResponseInput;
export type DesktopMoveWindowToMonitorResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
