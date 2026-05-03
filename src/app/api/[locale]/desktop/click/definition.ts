/**
 * Desktop Click Tool - Definition
 * Move mouse and click at absolute coordinates using xdotool
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

const ClickWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ClickWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "click"],
  title: "click.title",
  description: "click.description",
  dynamicTitle: ({ request }) => {
    if (request?.x !== undefined && request?.y !== undefined) {
      return {
        message: "click.dynamicTitle" as const,
        messageParams: { x: String(request.x), y: String(request.y) },
      };
    }
    return undefined;
  },
  category: "endpointCategories.desktop",
  subCategory: "endpointCategories.desktopInteraction",
  icon: "mouse-pointer",
  tags: ["click.tags.desktopAutomation", "click.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: ClickWidget,
    usage: { request: "data", response: true } as const,
    children: {
      x: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "click.form.fields.x.label",
        description: "click.form.fields.x.description",
        placeholder: "click.form.fields.x.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(0)
          .describe("Horizontal screen coordinate in pixels (from left edge)"),
      }),
      y: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "click.form.fields.y.label",
        description: "click.form.fields.y.description",
        placeholder: "click.form.fields.y.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(0)
          .describe("Vertical screen coordinate in pixels (from top edge)"),
      }),
      button: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "click.form.fields.button.label",
        description: "click.form.fields.button.description",
        placeholder: "click.form.fields.button.placeholder",
        columns: 3,
        options: [
          {
            value: "left",
            label: "click.form.fields.button.options.left" as const,
          },
          {
            value: "middle",
            label: "click.form.fields.button.options.middle" as const,
          },
          {
            value: "right",
            label: "click.form.fields.button.options.right" as const,
          },
        ],
        schema: z
          .enum(["left", "middle", "right"])
          .describe('Mouse button to click. Default is "left".'),
      }),
      doubleClick: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "click.form.fields.doubleClick.label",
        description: "click.form.fields.doubleClick.description",
        placeholder: "click.form.fields.doubleClick.placeholder",
        columns: 3,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe("Perform a double click instead of a single click"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.success",
        schema: z.boolean().describe("Whether the click operation succeeded"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      leftClick: { x: 100, y: 200, button: "left" },
      doubleClick: { x: 100, y: 200, button: "left", doubleClick: true },
      rightClick: { x: 500, y: 300, button: "right" },
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
      title: "click.errors.validation.title",
      description: "click.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "click.errors.network.title",
      description: "click.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "click.errors.unauthorized.title",
      description: "click.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "click.errors.forbidden.title",
      description: "click.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "click.errors.notFound.title",
      description: "click.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "click.errors.serverError.title",
      description: "click.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "click.errors.unknown.title",
      description: "click.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "click.errors.unsavedChanges.title",
      description: "click.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "click.errors.conflict.title",
      description: "click.errors.conflict.description",
    },
  },
  successTypes: {
    title: "click.success.title",
    description: "click.success.description",
  },
});

export type DesktopClickRequestInput = typeof POST.types.RequestInput;
export type DesktopClickRequestOutput = typeof POST.types.RequestOutput;
export type DesktopClickResponseInput = typeof POST.types.ResponseInput;
export type DesktopClickResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
