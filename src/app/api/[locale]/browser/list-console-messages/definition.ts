/**
 * ListConsoleMessages Tool - Definition
 * List all console messages for the currently selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedObjectOptionalField,
  scopedRequestField,
  scopedResponseArrayField,
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
  path: ["browser", "list-console-messages"],
  title: "list-console-messages.title",
  description: "list-console-messages.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "terminal",
  tags: [
    "list-console-messages.tags.browserAutomation",
    "list-console-messages.tags.debugging",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "list-console-messages.form.label",
    description: "list-console-messages.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      includePreservedMessages: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "list-console-messages.form.fields.includePreservedMessages.label",
        description:
          "list-console-messages.form.fields.includePreservedMessages.description",
        placeholder:
          "list-console-messages.form.fields.includePreservedMessages.placeholder",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Set to true to return the preserved messages over the last 3 navigations.",
          ),
      }),
      pageIdx: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "list-console-messages.form.fields.pageIdx.label",
        description: "list-console-messages.form.fields.pageIdx.description",
        placeholder: "list-console-messages.form.fields.pageIdx.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(0)
          .optional()
          .describe(
            "Page number to return (0-based). When omitted, returns the first page.",
          ),
      }),
      pageSize: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "list-console-messages.form.fields.pageSize.label",
        description: "list-console-messages.form.fields.pageSize.description",
        placeholder: "list-console-messages.form.fields.pageSize.placeholder",
        columns: 4,
        schema: z
          .number()
          .min(1)
          .optional()
          .describe(
            "Maximum number of messages to return. When omitted, returns all messages.",
          ),
      }),
      types: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "list-console-messages.form.fields.types.label",
        description: "list-console-messages.form.fields.types.description",
        placeholder: "list-console-messages.form.fields.types.placeholder",
        columns: 12,
        schema: z
          .array(
            z.enum([
              "log",
              "debug",
              "info",
              "error",
              "warn",
              "dir",
              "dirxml",
              "table",
              "trace",
              "clear",
              "startGroup",
              "startGroupCollapsed",
              "endGroup",
              "assert",
              "profile",
              "profileEnd",
              "count",
              "timeEnd",
              "verbose",
              "issue",
            ]),
          )
          .optional()
          .describe(
            "Filter messages to only return messages of the specified types. When omitted or empty, returns all messages.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-console-messages.response.success",
        schema: z
          .boolean()
          .describe("Whether the console messages listing operation succeeded"),
      }),
      result: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "list-console-messages.response.result.title",
        description: "list-console-messages.response.result.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          messages: scopedResponseArrayField(
            scopedTranslation,
            {
              type: WidgetType.CONTAINER,
            },
            scopedObjectFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                msgid: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "list-console-messages.response.result.messages.msgid",
                  schema: z.coerce.number(),
                }),
                type: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "list-console-messages.response.result.messages.type",
                  schema: z.string(),
                }),
                text: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "list-console-messages.response.result.messages.text",
                  schema: z.string(),
                }),
                timestamp: scopedResponseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "list-console-messages.response.result.messages.timestamp",
                  schema: z.string().optional(),
                }),
              },
            }),
          ),
          totalCount: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "list-console-messages.response.result.totalCount",
            schema: z.coerce.number().describe("Total number of messages"),
          }),
        },
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-console-messages.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-console-messages.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { pageIdx: 0 },
    },
    responses: {
      default: {
        success: true,
        result: {
          messages: [
            {
              msgid: 1,
              type: "log",
              text: "Example message",
            },
          ],
          totalCount: 1,
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-console-messages.errors.validation.title",
      description: "list-console-messages.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-console-messages.errors.network.title",
      description: "list-console-messages.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-console-messages.errors.unauthorized.title",
      description: "list-console-messages.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-console-messages.errors.forbidden.title",
      description: "list-console-messages.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-console-messages.errors.notFound.title",
      description: "list-console-messages.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-console-messages.errors.serverError.title",
      description: "list-console-messages.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-console-messages.errors.unknown.title",
      description: "list-console-messages.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-console-messages.errors.unsavedChanges.title",
      description: "list-console-messages.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-console-messages.errors.conflict.title",
      description: "list-console-messages.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-console-messages.success.title",
    description: "list-console-messages.success.description",
  },
});

export type ListConsoleMessagesRequestInput = typeof POST.types.RequestInput;
export type ListConsoleMessagesRequestOutput = typeof POST.types.RequestOutput;
export type ListConsoleMessagesResponseInput = typeof POST.types.ResponseInput;
export type ListConsoleMessagesResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
