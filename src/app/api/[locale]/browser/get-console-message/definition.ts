/**
 * GetConsoleMessage Tool - Definition
 * Gets a console message by its ID
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  path: ["browser", "get-console-message"],
  title: "get-console-message.title",
  description: "get-console-message.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "terminal",
  tags: [
    "get-console-message.tags.browserAutomation",
    "get-console-message.tags.debugging",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get-console-message.form.label",
    description: "get-console-message.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      msgid: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get-console-message.form.fields.msgid.label",
        description: "get-console-message.form.fields.msgid.description",
        placeholder: "get-console-message.form.fields.msgid.placeholder",
        columns: 6,
        schema: z
          .number()
          .describe(
            "The msgid of a console message on the page from the listed console messages",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-console-message.response.success",
        schema: z
          .boolean()
          .describe(
            "Whether the console message retrieval operation succeeded",
          ),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-console-message.response.result",
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
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-console-message.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-console-message.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { msgid: 123 },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# get_console_message response\nConsole message: [log] Example message",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get-console-message.errors.validation.title",
      description: "get-console-message.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get-console-message.errors.network.title",
      description: "get-console-message.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get-console-message.errors.unauthorized.title",
      description: "get-console-message.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get-console-message.errors.forbidden.title",
      description: "get-console-message.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get-console-message.errors.notFound.title",
      description: "get-console-message.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get-console-message.errors.serverError.title",
      description: "get-console-message.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get-console-message.errors.unknown.title",
      description: "get-console-message.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get-console-message.errors.unsavedChanges.title",
      description: "get-console-message.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get-console-message.errors.conflict.title",
      description: "get-console-message.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get-console-message.success.title",
    description: "get-console-message.success.description",
  },
});

export type GetConsoleMessageRequestInput = typeof POST.types.RequestInput;
export type GetConsoleMessageRequestOutput = typeof POST.types.RequestOutput;
export type GetConsoleMessageResponseInput = typeof POST.types.ResponseInput;
export type GetConsoleMessageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
