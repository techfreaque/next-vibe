/**
 * GetConsoleMessage Tool - Definition
 * Gets a console message by its ID
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
  path: ["browser", "get-console-message"],
  title: "app.api.browser.get-console-message.title",
  description: "app.api.browser.get-console-message.description",
  category: "app.api.browser.category",
  icon: "terminal",
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
      title: "app.api.browser.get-console-message.form.label",
      description: "app.api.browser.get-console-message.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      msgid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.get-console-message.form.fields.msgid.label",
          description:
            "app.api.browser.get-console-message.form.fields.msgid.description",
          placeholder:
            "app.api.browser.get-console-message.form.fields.msgid.placeholder",
          columns: 6,
        },
        z
          .number()
          .describe(
            "The msgid of a console message on the page from the listed console messages",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-console-message.response.success",
        },
        z
          .boolean()
          .describe(
            "Whether the console message retrieval operation succeeded",
          ),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-console-message.response.result",
        },
        z
          .object({
            found: z.boolean().describe("Whether the message was found"),
            message: z
              .object({
                type: z.string().describe("Type of console message"),
                text: z.string().describe("Message text"),
                timestamp: z.string().optional().describe("Message timestamp"),
              })
              .optional()
              .describe("The console message details"),
          })
          .optional()
          .describe("Result of the console message retrieval"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-console-message.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-console-message.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { msgid: 123 },
    },
    responses: {
      default: {
        success: true,
        result: {
          found: true,
          message: {
            type: "log",
            text: "Example message",
            timestamp: "2024-01-01T00:00:00Z",
          },
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.get-console-message.errors.validation.title",
      description:
        "app.api.browser.get-console-message.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.get-console-message.errors.network.title",
      description:
        "app.api.browser.get-console-message.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.get-console-message.errors.unauthorized.title",
      description:
        "app.api.browser.get-console-message.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.get-console-message.errors.forbidden.title",
      description:
        "app.api.browser.get-console-message.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.get-console-message.errors.notFound.title",
      description:
        "app.api.browser.get-console-message.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.get-console-message.errors.serverError.title",
      description:
        "app.api.browser.get-console-message.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.get-console-message.errors.unknown.title",
      description:
        "app.api.browser.get-console-message.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.get-console-message.errors.unsavedChanges.title",
      description:
        "app.api.browser.get-console-message.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.get-console-message.errors.conflict.title",
      description:
        "app.api.browser.get-console-message.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.get-console-message.success.title",
    description: "app.api.browser.get-console-message.success.description",
  },
});

export type GetConsoleMessageRequestInput = typeof POST.types.RequestInput;
export type GetConsoleMessageRequestOutput = typeof POST.types.RequestOutput;
export type GetConsoleMessageResponseInput = typeof POST.types.ResponseInput;
export type GetConsoleMessageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
