/**
 * FillForm Tool - Definition
 * Fill out multiple form elements at once
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataArrayField,
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
  path: ["browser", "fill-form"],
  title: "fill-form.title",
  description: "fill-form.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "pen-tool",
  tags: ["fill-form.tags.browserAutomation", "fill-form.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "fill-form.form.label",
    description: "fill-form.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      elements: requestDataArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fill-form.form.fields.elements.label",
        description: "fill-form.form.fields.elements.description",
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { request: "data" },
          children: {
            uid: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "fill-form.form.fields.elements.uid.label",
              description: "fill-form.form.fields.elements.uid.description",
              columns: 6,
              schema: z.string().describe("The uid of the element to fill out"),
            }),
            value: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "fill-form.form.fields.elements.value.label",
              description: "fill-form.form.fields.elements.value.description",
              columns: 6,
              schema: z.string().describe("Value for the element"),
            }),
          },
        }),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill-form.response.success",
        schema: z
          .boolean()
          .describe("Whether the form fill operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill-form.response.result",
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
        content: "fill-form.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "fill-form.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { elements: [{ uid: "field-1", value: "value1" }] },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# fill_form response\nFilled 1 form element(s).",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "fill-form.errors.validation.title",
      description: "fill-form.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "fill-form.errors.network.title",
      description: "fill-form.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "fill-form.errors.unauthorized.title",
      description: "fill-form.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "fill-form.errors.forbidden.title",
      description: "fill-form.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "fill-form.errors.notFound.title",
      description: "fill-form.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "fill-form.errors.serverError.title",
      description: "fill-form.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "fill-form.errors.unknown.title",
      description: "fill-form.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "fill-form.errors.unsavedChanges.title",
      description: "fill-form.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "fill-form.errors.conflict.title",
      description: "fill-form.errors.conflict.description",
    },
  },
  successTypes: {
    title: "fill-form.success.title",
    description: "fill-form.success.description",
  },
});

export type FillFormRequestInput = typeof POST.types.RequestInput;
export type FillFormRequestOutput = typeof POST.types.RequestOutput;
export type FillFormResponseInput = typeof POST.types.ResponseInput;
export type FillFormResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
