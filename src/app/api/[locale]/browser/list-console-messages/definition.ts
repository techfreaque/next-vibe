/**
 * ListConsoleMessages Tool - Definition
 * List all console messages for the currently selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["browser", "list-console-messages"],
  title: "app.api.browser.list-console-messages.title",
  description: "app.api.browser.list-console-messages.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.debugging",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.list-console-messages.form.label",
      description: "app.api.browser.list-console-messages.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      includePreservedMessages: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.browser.list-console-messages.form.fields.includePreservedMessages.label",
          description:
            "app.api.browser.list-console-messages.form.fields.includePreservedMessages.description",
          placeholder:
            "app.api.browser.list-console-messages.form.fields.includePreservedMessages.placeholder",
          columns: 4,
        },
        z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Set to true to return the preserved messages over the last 3 navigations.",
          ),
      ),
      pageIdx: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.browser.list-console-messages.form.fields.pageIdx.label",
          description:
            "app.api.browser.list-console-messages.form.fields.pageIdx.description",
          placeholder:
            "app.api.browser.list-console-messages.form.fields.pageIdx.placeholder",
          columns: 4,
        },
        z
          .number()
          .min(0)
          .optional()
          .describe(
            "Page number to return (0-based). When omitted, returns the first page.",
          ),
      ),
      pageSize: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.browser.list-console-messages.form.fields.pageSize.label",
          description:
            "app.api.browser.list-console-messages.form.fields.pageSize.description",
          placeholder:
            "app.api.browser.list-console-messages.form.fields.pageSize.placeholder",
          columns: 4,
        },
        z
          .number()
          .min(1)
          .optional()
          .describe(
            "Maximum number of messages to return. When omitted, returns all messages.",
          ),
      ),
      types: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.browser.list-console-messages.form.fields.types.label",
          description:
            "app.api.browser.list-console-messages.form.fields.types.description",
          placeholder:
            "app.api.browser.list-console-messages.form.fields.types.placeholder",
          columns: 12,
        },
        z
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
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-console-messages.response.success",
        },
        z
          .boolean()
          .describe("Whether the console messages listing operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-console-messages.response.result",
        },
        z
          .object({
            messages: z
              .array(
                z.object({
                  msgid: z.number(),
                  type: z.string(),
                  text: z.string(),
                  timestamp: z.string().optional(),
                }),
              )
              .describe("List of console messages"),
            totalCount: z.number().describe("Total number of messages"),
          })
          .optional()
          .describe("Result of console messages listing"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-console-messages.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-console-messages.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
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
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.list-console-messages.errors.validation.title",
      description:
        "app.api.browser.list-console-messages.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.list-console-messages.errors.network.title",
      description:
        "app.api.browser.list-console-messages.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.list-console-messages.errors.unauthorized.title",
      description:
        "app.api.browser.list-console-messages.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.list-console-messages.errors.forbidden.title",
      description:
        "app.api.browser.list-console-messages.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.list-console-messages.errors.notFound.title",
      description:
        "app.api.browser.list-console-messages.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.list-console-messages.errors.serverError.title",
      description:
        "app.api.browser.list-console-messages.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.list-console-messages.errors.unknown.title",
      description:
        "app.api.browser.list-console-messages.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.browser.list-console-messages.errors.unsavedChanges.title",
      description:
        "app.api.browser.list-console-messages.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.list-console-messages.errors.conflict.title",
      description:
        "app.api.browser.list-console-messages.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.list-console-messages.success.title",
    description: "app.api.browser.list-console-messages.success.description",
  },
});

export type ListConsoleMessagesRequestInput = typeof POST.types.RequestInput;
export type ListConsoleMessagesRequestOutput = typeof POST.types.RequestOutput;
export type ListConsoleMessagesResponseInput = typeof POST.types.ResponseInput;
export type ListConsoleMessagesResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
