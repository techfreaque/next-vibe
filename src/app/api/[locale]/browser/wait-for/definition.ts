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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  path: ["browser", "wait-for"],
  title: "app.api.browser.wait-for.title",
  description: "app.api.browser.wait-for.description",
  category: "app.api.browser.category",
  icon: "clock",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.waitAutomation",
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
      title: "app.api.browser.wait-for.form.label",
      description: "app.api.browser.wait-for.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      text: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.browser.wait-for.form.fields.text.label",
        description: "app.api.browser.wait-for.form.fields.text.description",
        placeholder: "app.api.browser.wait-for.form.fields.text.placeholder",
        columns: 8,
        schema: z.string().describe("Text to appear on the page"),
      }),
      timeout: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.browser.wait-for.form.fields.timeout.label",
        description: "app.api.browser.wait-for.form.fields.timeout.description",
        placeholder: "app.api.browser.wait-for.form.fields.timeout.placeholder",
        columns: 4,
        schema: z
          .number()
          .optional()
          .describe(
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used.",
          ),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.wait-for.response.success",
        schema: z.boolean().describe("Whether the wait operation succeeded"),
      }),
      result: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.wait-for.response.result",
        schema: z
          .object({
            found: z.boolean().describe("Whether the text was found"),
            waitTime: z
              .number()
              .optional()
              .describe("Time waited in milliseconds"),
          })
          .optional()
          .describe("Result of wait operation"),
      }),
      error: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.wait-for.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.wait-for.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  ),
  examples: {
    requests: {
      default: { text: "Loading..." },
    },
    responses: {
      default: {
        success: true,
        result: {
          found: true,
          waitTime: 1500,
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.wait-for.errors.validation.title",
      description: "app.api.browser.wait-for.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.wait-for.errors.network.title",
      description: "app.api.browser.wait-for.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.wait-for.errors.unauthorized.title",
      description: "app.api.browser.wait-for.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.wait-for.errors.forbidden.title",
      description: "app.api.browser.wait-for.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.wait-for.errors.notFound.title",
      description: "app.api.browser.wait-for.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.wait-for.errors.serverError.title",
      description: "app.api.browser.wait-for.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.wait-for.errors.unknown.title",
      description: "app.api.browser.wait-for.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.wait-for.errors.unsavedChanges.title",
      description: "app.api.browser.wait-for.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.wait-for.errors.conflict.title",
      description: "app.api.browser.wait-for.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.wait-for.success.title",
    description: "app.api.browser.wait-for.success.description",
  },
});

export type WaitForRequestInput = typeof POST.types.RequestInput;
export type WaitForRequestOutput = typeof POST.types.RequestOutput;
export type WaitForResponseInput = typeof POST.types.ResponseInput;
export type WaitForResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
