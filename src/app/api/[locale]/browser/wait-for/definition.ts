/**
 * WaitFor Tool - Definition
 * Wait for the specified text to appear on the selected page
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
  path: ["browser", "wait-for"],
  title: "wait-for.title",
  description: "wait-for.description",
  category: "app.endpointCategories.browser",
  icon: "clock",
  tags: ["wait-for.tags.browserAutomation", "wait-for.tags.waitAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "wait-for.form.label",
    description: "wait-for.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      text: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "wait-for.form.fields.text.label",
        description: "wait-for.form.fields.text.description",
        placeholder: "wait-for.form.fields.text.placeholder",
        columns: 8,
        schema: z
          .array(z.string())
          .min(1)
          .describe(
            "Non-empty list of texts. Resolves when any value appears on the page.",
          ),
      }),
      timeout: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "wait-for.form.fields.timeout.label",
        description: "wait-for.form.fields.timeout.description",
        placeholder: "wait-for.form.fields.timeout.placeholder",
        columns: 4,
        schema: z
          .number()
          .optional()
          .describe(
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used.",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "wait-for.response.success",
        schema: z.boolean().describe("Whether the wait operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "wait-for.response.result",
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
        content: "wait-for.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "wait-for.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { text: ["Loading..."] },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# wait_for response\nText found on the page.",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "wait-for.errors.validation.title",
      description: "wait-for.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "wait-for.errors.network.title",
      description: "wait-for.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "wait-for.errors.unauthorized.title",
      description: "wait-for.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "wait-for.errors.forbidden.title",
      description: "wait-for.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "wait-for.errors.notFound.title",
      description: "wait-for.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "wait-for.errors.serverError.title",
      description: "wait-for.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "wait-for.errors.unknown.title",
      description: "wait-for.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "wait-for.errors.unsavedChanges.title",
      description: "wait-for.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "wait-for.errors.conflict.title",
      description: "wait-for.errors.conflict.description",
    },
  },
  successTypes: {
    title: "wait-for.success.title",
    description: "wait-for.success.description",
  },
});

export type WaitForRequestInput = typeof POST.types.RequestInput;
export type WaitForRequestOutput = typeof POST.types.RequestOutput;
export type WaitForResponseInput = typeof POST.types.ResponseInput;
export type WaitForResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
