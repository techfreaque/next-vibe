/**
 * Click Tool - Definition
 * Clicks on the provided element
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
  path: ["browser", "click"],
  title: "app.api.browser.click.title",
  description: "app.api.browser.click.description",
  category: "app.api.browser.category",
  icon: "mouse-pointer",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.inputAutomation",
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
      title: "app.api.browser.click.form.label",
      description: "app.api.browser.click.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      uid: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.browser.click.form.fields.uid.label",
        description: "app.api.browser.click.form.fields.uid.description",
        placeholder: "app.api.browser.click.form.fields.uid.placeholder",
        columns: 8,
        schema: z
          .string()
          .describe(
            "The uid of an element on the page from the page content snapshot",
          ),
      }),
      dblClick: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.browser.click.form.fields.dblClick.label",
        description: "app.api.browser.click.form.fields.dblClick.description",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe("Set to true for double clicks. Default is false."),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.click.response.success",
        schema: z.boolean().describe("Whether the click operation succeeded"),
      }),
      result: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.click.response.result",
        schema: z
          .object({
            clicked: z.boolean(),
            doubleClick: z.boolean().optional(),
          })
          .optional()
          .describe("Result of the click operation"),
      }),
      error: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.click.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.click.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  ),
  examples: {
    requests: {
      singleClick: {
        uid: "element-123",
        dblClick: false,
      },
      doubleClick: {
        uid: "element-456",
        dblClick: true,
      },
    },
    responses: {
      singleClick: {
        success: true,
        result: { clicked: true },
        executionId: "exec_123",
      },
      doubleClick: {
        success: true,
        result: { clicked: true, doubleClick: true },
        executionId: "exec_456",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.click.errors.validation.title",
      description: "app.api.browser.click.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.click.errors.network.title",
      description: "app.api.browser.click.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.click.errors.unauthorized.title",
      description: "app.api.browser.click.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.click.errors.forbidden.title",
      description: "app.api.browser.click.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.click.errors.notFound.title",
      description: "app.api.browser.click.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.click.errors.serverError.title",
      description: "app.api.browser.click.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.click.errors.unknown.title",
      description: "app.api.browser.click.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.click.errors.unsavedChanges.title",
      description: "app.api.browser.click.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.click.errors.conflict.title",
      description: "app.api.browser.click.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.click.success.title",
    description: "app.api.browser.click.success.description",
  },
});

export type ClickRequestInput = typeof POST.types.RequestInput;
export type ClickRequestOutput = typeof POST.types.RequestOutput;
export type ClickResponseInput = typeof POST.types.ResponseInput;
export type ClickResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
