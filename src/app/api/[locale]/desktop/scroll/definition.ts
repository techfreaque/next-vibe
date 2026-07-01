/**
 * Desktop Scroll Tool - Definition
 * Scroll at coordinates using xdotool click with mouse buttons 4/5/6/7
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const ScrollWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ScrollWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["desktop", "scroll"],
  aliases: ["desktop-scroll"] as const,
  title: "scroll.title",
  titleShort: "scroll.titleShort",
  description: "scroll.description",
  dynamicTitle: ({ request }) => {
    if (request?.direction) {
      return {
        message: "scroll.dynamicTitle" as const,
        messageParams: { direction: String(request.direction) },
      };
    }
    return undefined;
  },
  category: "desktop",
  subCategory: "Interaction",
  icon: "chevron-down",
  tags: ["scroll.tags.desktopAutomation", "scroll.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    render: ScrollWidget,
    usage: { request: "data", response: true } as const,
    children: {
      x: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "scroll.form.fields.x.label",
        description: "scroll.form.fields.x.description",
        placeholder: "scroll.form.fields.x.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe(
            "Horizontal position to scroll at. Uses current mouse position if omitted.",
          ),
      }),
      y: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "scroll.form.fields.y.label",
        description: "scroll.form.fields.y.description",
        placeholder: "scroll.form.fields.y.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe(
            "Vertical position to scroll at. Uses current mouse position if omitted.",
          ),
      }),
      direction: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "scroll.form.fields.direction.label",
        description: "scroll.form.fields.direction.description",
        placeholder: "scroll.form.fields.direction.placeholder",
        columns: 3,
        options: [
          {
            value: "up",
            label: "scroll.form.fields.direction.options.up" as const,
          },
          {
            value: "down",
            label: "scroll.form.fields.direction.options.down" as const,
          },
          {
            value: "left",
            label: "scroll.form.fields.direction.options.left" as const,
          },
          {
            value: "right",
            label: "scroll.form.fields.direction.options.right" as const,
          },
        ],
        schema: z
          .enum(["up", "down", "left", "right"])
          .describe("Direction to scroll"),
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "scroll.form.fields.amount.label",
        description: "scroll.form.fields.amount.description",
        placeholder: "scroll.form.fields.amount.placeholder",
        columns: 3,
        schema: z
          .number()
          .int()
          .min(1)
          .max(100)
          .optional()
          .default(3)
          .describe("Number of scroll steps (default: 3)"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scroll.response.success",
        schema: z.boolean().describe("Whether the scroll operation succeeded"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scroll.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "scroll.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      scrollDown: { direction: "down", amount: 3 },
      scrollUp: { x: 500, y: 400, direction: "up", amount: 5 },
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
      title: "scroll.errors.validation.title",
      description: "scroll.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "scroll.errors.network.title",
      description: "scroll.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "scroll.errors.unauthorized.title",
      description: "scroll.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "scroll.errors.forbidden.title",
      description: "scroll.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "scroll.errors.notFound.title",
      description: "scroll.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "scroll.errors.serverError.title",
      description: "scroll.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "scroll.errors.unknown.title",
      description: "scroll.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "scroll.errors.unsavedChanges.title",
      description: "scroll.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "scroll.errors.conflict.title",
      description: "scroll.errors.conflict.description",
    },
  },
  successTypes: {
    title: "scroll.success.title",
    description: "scroll.success.description",
  },
});

export type DesktopScrollRequestInput = typeof POST.types.RequestInput;
export type DesktopScrollRequestOutput = typeof POST.types.RequestOutput;
export type DesktopScrollResponseInput = typeof POST.types.ResponseInput;
export type DesktopScrollResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
