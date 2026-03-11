/**
 * Fill Tool - Definition
 * Type text into an input, text area or select an option from a select element
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
  path: ["browser", "fill"],
  title: "fill.title",
  description: "fill.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "edit",
  tags: ["fill.tags.browserAutomation", "fill.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "fill.form.label",
    description: "fill.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fill.form.fields.uid.label",
        description: "fill.form.fields.uid.description",
        placeholder: "fill.form.fields.uid.placeholder",
        columns: 6,
        schema: z
          .string()
          .describe(
            "The uid of an element on the page from the page content snapshot",
          ),
      }),
      value: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fill.form.fields.value.label",
        description: "fill.form.fields.value.description",
        placeholder: "fill.form.fields.value.placeholder",
        columns: 6,
        schema: z.string().describe("The value to fill in"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill.response.success",
        schema: z.boolean().describe("Whether the fill operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill.response.result",
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
        content: "fill.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { uid: "element-123", value: "test value" },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# fill response\nFilled element with the specified value.",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "fill.errors.validation.title",
      description: "fill.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "fill.errors.network.title",
      description: "fill.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "fill.errors.unauthorized.title",
      description: "fill.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "fill.errors.forbidden.title",
      description: "fill.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "fill.errors.notFound.title",
      description: "fill.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "fill.errors.serverError.title",
      description: "fill.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "fill.errors.unknown.title",
      description: "fill.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "fill.errors.unsavedChanges.title",
      description: "fill.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "fill.errors.conflict.title",
      description: "fill.errors.conflict.description",
    },
  },
  successTypes: {
    title: "fill.success.title",
    description: "fill.success.description",
  },
});

export type FillRequestInput = typeof POST.types.RequestInput;
export type FillRequestOutput = typeof POST.types.RequestOutput;
export type FillResponseInput = typeof POST.types.ResponseInput;
export type FillResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
