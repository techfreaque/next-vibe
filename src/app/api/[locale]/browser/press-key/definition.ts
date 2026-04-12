/**
 * PressKey Tool - Definition
 * Press a key or key combination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "press-key"],
  title: "press-key.title",
  description: "press-key.description",
  category: "endpointCategories.browser",
  subCategory: "endpointCategories.browserInteraction",
  icon: "keyboard",
  tags: ["press-key.tags.browserAutomation", "press-key.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "press-key.form.label",
    description: "press-key.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      key: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "press-key.form.fields.key.label",
        description: "press-key.form.fields.key.description",
        placeholder: "press-key.form.fields.key.placeholder",
        columns: 12,
        schema: z
          .string()
          .describe(
            'A key or a combination (e.g., "Enter", "Control+A", "Control++", "Control+Shift+R"). Modifiers: Control, Shift, Alt, Meta',
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
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "press-key.response.result",
        schema: z
          .array(
            z.object({
              type: z.string().describe("Content type (text or image)"),
              text: z.string().optional().describe("Text content"),
              data: z.string().optional().describe("Base64 encoded data"),
              mimeType: z.string().optional().describe("MIME type for data"),
            }),
          )
          .optional()
          .describe("MCP content blocks returned by the tool"),
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
      default: { key: "Enter" },
    },
    responses: {
      default: {
        success: true,
        result: [
          { type: "text", text: "# press_key response\nPressed key: Enter" },
        ],
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

export type PressKeyRequestInput = typeof POST.types.RequestInput;
export type PressKeyRequestOutput = typeof POST.types.RequestOutput;
export type PressKeyResponseInput = typeof POST.types.ResponseInput;
export type PressKeyResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
