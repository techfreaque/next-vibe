/**
 * HandleDialog Tool - Definition
 * Handle a browser dialog (alert, confirm, prompt)
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
  path: ["browser", "handle-dialog"],
  title: "handle-dialog.title",
  description: "handle-dialog.description",
  category: "endpointCategories.browser",
  icon: "message-square",
  tags: [
    "handle-dialog.tags.browserAutomation",
    "handle-dialog.tags.dialogAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "handle-dialog.form.label",
    description: "handle-dialog.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "handle-dialog.form.fields.action.label",
        description: "handle-dialog.form.fields.action.description",
        placeholder: "handle-dialog.form.fields.action.placeholder",
        columns: 6,
        options: [
          {
            label: "handle-dialog.form.fields.action.options.accept" as const,
            value: "accept",
          },
          {
            label: "handle-dialog.form.fields.action.options.dismiss" as const,
            value: "dismiss",
          },
        ],
        schema: z
          .enum(["accept", "dismiss"])
          .describe("Whether to dismiss or accept the dialog"),
      }),
      promptText: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "handle-dialog.form.fields.promptText.label",
        description: "handle-dialog.form.fields.promptText.description",
        placeholder: "handle-dialog.form.fields.promptText.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe("Optional prompt text to enter into the dialog"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "handle-dialog.response.success",
        schema: z
          .boolean()
          .describe("Whether the dialog handling operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "handle-dialog.response.result",
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
        content: "handle-dialog.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "handle-dialog.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { action: "accept" },
    },
    responses: {
      default: {
        success: true,
        result: [
          { type: "text", text: "# handle_dialog response\nDialog accepted." },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "handle-dialog.errors.validation.title",
      description: "handle-dialog.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "handle-dialog.errors.network.title",
      description: "handle-dialog.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "handle-dialog.errors.unauthorized.title",
      description: "handle-dialog.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "handle-dialog.errors.forbidden.title",
      description: "handle-dialog.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "handle-dialog.errors.notFound.title",
      description: "handle-dialog.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "handle-dialog.errors.serverError.title",
      description: "handle-dialog.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "handle-dialog.errors.unknown.title",
      description: "handle-dialog.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "handle-dialog.errors.unsavedChanges.title",
      description: "handle-dialog.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "handle-dialog.errors.conflict.title",
      description: "handle-dialog.errors.conflict.description",
    },
  },
  successTypes: {
    title: "handle-dialog.success.title",
    description: "handle-dialog.success.description",
  },
});

export type HandleDialogRequestInput = typeof POST.types.RequestInput;
export type HandleDialogRequestOutput = typeof POST.types.RequestOutput;
export type HandleDialogResponseInput = typeof POST.types.ResponseInput;
export type HandleDialogResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
