/**
 * Desktop MoveMouse Tool - Definition
 * Move the mouse cursor to absolute coordinates using xdotool mousemove
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

const MoveMouseWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MoveMouseWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "move-mouse"],
  title: "move-mouse.title",
  description: "move-mouse.description",
  dynamicTitle: ({ request }) => {
    if (request?.x !== undefined && request?.y !== undefined) {
      return {
        message: "move-mouse.dynamicTitle" as const,
        messageParams: { x: String(request.x), y: String(request.y) },
      };
    }
    return undefined;
  },
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopInteraction",
  icon: "move",
  tags: [
    "move-mouse.tags.desktopAutomation",
    "move-mouse.tags.inputAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: MoveMouseWidget,
    usage: { request: "data", response: true } as const,
    children: {
      x: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "move-mouse.form.fields.x.label",
        description: "move-mouse.form.fields.x.description",
        placeholder: "move-mouse.form.fields.x.placeholder",
        columns: 6,
        schema: z
          .number()
          .int()
          .min(0)
          .describe("Horizontal screen coordinate in pixels (from left edge)"),
      }),
      y: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "move-mouse.form.fields.y.label",
        description: "move-mouse.form.fields.y.description",
        placeholder: "move-mouse.form.fields.y.placeholder",
        columns: 6,
        schema: z
          .number()
          .int()
          .min(0)
          .describe("Vertical screen coordinate in pixels (from top edge)"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "move-mouse.response.success",
        schema: z
          .boolean()
          .describe("Whether the mouse move operation succeeded"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "move-mouse.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "move-mouse.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { x: 100, y: 200 },
      center: { x: 960, y: 540 },
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
      title: "move-mouse.errors.validation.title",
      description: "move-mouse.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "move-mouse.errors.network.title",
      description: "move-mouse.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "move-mouse.errors.unauthorized.title",
      description: "move-mouse.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "move-mouse.errors.forbidden.title",
      description: "move-mouse.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "move-mouse.errors.notFound.title",
      description: "move-mouse.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "move-mouse.errors.serverError.title",
      description: "move-mouse.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "move-mouse.errors.unknown.title",
      description: "move-mouse.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "move-mouse.errors.unsavedChanges.title",
      description: "move-mouse.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "move-mouse.errors.conflict.title",
      description: "move-mouse.errors.conflict.description",
    },
  },
  successTypes: {
    title: "move-mouse.success.title",
    description: "move-mouse.success.description",
  },
});

export type DesktopMoveMouseRequestInput = typeof POST.types.RequestInput;
export type DesktopMoveMouseRequestOutput = typeof POST.types.RequestOutput;
export type DesktopMoveMouseResponseInput = typeof POST.types.ResponseInput;
export type DesktopMoveMouseResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
