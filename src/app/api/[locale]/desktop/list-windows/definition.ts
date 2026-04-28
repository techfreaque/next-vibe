/**
 * Desktop ListWindows Tool - Definition
 * List all open windows using wmctrl -lGp
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

const ListWindowsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ListWindowsWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "list-windows"],
  title: "list-windows.title",
  description: "list-windows.description",
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopWindows",
  icon: "list",
  tags: [
    "list-windows.tags.desktopAutomation",
    "list-windows.tags.windowManagement",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: ListWindowsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-windows.response.success",
        schema: z
          .boolean()
          .describe("Whether the window list retrieval succeeded"),
      }),
      windows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-windows.response.windows",
        schema: z
          .array(
            z.object({
              windowId: z.string().describe("X11 window ID (hex format)"),
              desktopId: z.string().describe("Desktop/workspace number"),
              pid: z.number().describe("Process ID"),
              x: z.number().describe("Window X position"),
              y: z.number().describe("Window Y position"),
              width: z.number().describe("Window width in pixels"),
              height: z.number().describe("Window height in pixels"),
              title: z.string().describe("Window title"),
              monitor: z
                .string()
                .optional()
                .describe(
                  "Monitor name the window is primarily on (e.g. DP-1)",
                ),
            }),
          )
          .optional()
          .describe("List of open windows with geometry and process info"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-windows.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-windows.response.executionId",
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
        windows: [
          {
            windowId: "0x3200001",
            desktopId: "0",
            pid: 12345,
            x: 0,
            y: 0,
            width: 1920,
            height: 1080,
            title: "Mozilla Firefox",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-windows.errors.validation.title",
      description: "list-windows.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-windows.errors.network.title",
      description: "list-windows.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-windows.errors.unauthorized.title",
      description: "list-windows.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-windows.errors.forbidden.title",
      description: "list-windows.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-windows.errors.notFound.title",
      description: "list-windows.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-windows.errors.serverError.title",
      description: "list-windows.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-windows.errors.unknown.title",
      description: "list-windows.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-windows.errors.unsavedChanges.title",
      description: "list-windows.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-windows.errors.conflict.title",
      description: "list-windows.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-windows.success.title",
    description: "list-windows.success.description",
  },
});

export type DesktopListWindowsRequestInput = typeof POST.types.RequestInput;
export type DesktopListWindowsRequestOutput = typeof POST.types.RequestOutput;
export type DesktopListWindowsResponseInput = typeof POST.types.ResponseInput;
export type DesktopListWindowsResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
