/**
 * Desktop ListMonitors Tool - Definition
 * Enumerate all connected monitors with resolution, position, and index.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const ListMonitorsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ListMonitorsWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "list-monitors"],
  title: "list-monitors.title",
  description: "list-monitors.description",
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopCapture",
  icon: "monitor",
  tags: [
    "list-monitors.tags.desktopAutomation",
    "list-monitors.tags.captureAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: ListMonitorsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-monitors.response.success",
        schema: z.boolean().describe("Whether the monitor listing succeeded"),
      }),
      monitors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z
                .string()
                .describe("Monitor output name (e.g. DP-1, HDMI-1)"),
            }),
            index: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z.number().int().describe("Zero-based monitor index"),
            }),
            x: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z
                .number()
                .describe("X position in virtual desktop space"),
            }),
            y: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z
                .number()
                .describe("Y position in virtual desktop space"),
            }),
            width: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z.number().describe("Monitor width in pixels"),
            }),
            height: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z.number().describe("Monitor height in pixels"),
            }),
            primary: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "list-monitors.response.monitors",
              schema: z
                .boolean()
                .describe("Whether this is the primary monitor"),
            }),
          },
        }),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-monitors.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-monitors.response.executionId",
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
        monitors: [
          {
            name: "DP-1",
            index: 0,
            x: 0,
            y: 0,
            width: 2560,
            height: 1440,
            primary: true,
          },
          {
            name: "DP-2",
            index: 1,
            x: 2560,
            y: 0,
            width: 1920,
            height: 1080,
            primary: false,
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-monitors.errors.validation.title",
      description: "list-monitors.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-monitors.errors.network.title",
      description: "list-monitors.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-monitors.errors.unauthorized.title",
      description: "list-monitors.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-monitors.errors.forbidden.title",
      description: "list-monitors.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-monitors.errors.notFound.title",
      description: "list-monitors.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-monitors.errors.serverError.title",
      description: "list-monitors.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-monitors.errors.unknown.title",
      description: "list-monitors.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-monitors.errors.unsavedChanges.title",
      description: "list-monitors.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-monitors.errors.conflict.title",
      description: "list-monitors.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-monitors.success.title",
    description: "list-monitors.success.description",
  },
});

export type DesktopListMonitorsRequestInput = typeof POST.types.RequestInput;
export type DesktopListMonitorsRequestOutput = typeof POST.types.RequestOutput;
export type DesktopListMonitorsResponseInput = typeof POST.types.ResponseInput;
export type DesktopListMonitorsResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
