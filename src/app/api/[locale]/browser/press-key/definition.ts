/**
 * PressKey Tool - Definition
 * Press a key or key combination
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
  path: ["browser", "press-key"],
  title: "app.api.browser.press-key.title",
  description: "app.api.browser.press-key.description",
  category: "app.api.browser.category",
  icon: "keyboard",
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
      title: "app.api.browser.press-key.form.label",
      description: "app.api.browser.press-key.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      key: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.browser.press-key.form.fields.key.label",
        description: "app.api.browser.press-key.form.fields.key.description",
        placeholder: "app.api.browser.press-key.form.fields.key.placeholder",
        columns: 12,
        schema: z
          .string()
          .describe(
            'A key or a combination (e.g., "Enter", "Control+A", "Control++", "Control+Shift+R"). Modifiers: Control, Shift, Alt, Meta',
          ),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.press-key.response.success",
        schema: z
          .boolean()
          .describe("Whether the key press operation succeeded"),
      }),
      result: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.press-key.response.result",
        schema: z
          .object({
            pressed: z.boolean().describe("Whether the key was pressed"),
            key: z.string().describe("The key or combination that was pressed"),
          })
          .optional()
          .describe("Result of key press operation"),
      }),
      error: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.press-key.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.press-key.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  ),
  examples: {
    requests: {
      default: { key: "Enter" },
    },
    responses: {
      default: {
        success: true,
        result: {
          pressed: true,
          key: "Enter",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.press-key.errors.validation.title",
      description: "app.api.browser.press-key.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.press-key.errors.network.title",
      description: "app.api.browser.press-key.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.press-key.errors.unauthorized.title",
      description: "app.api.browser.press-key.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.press-key.errors.forbidden.title",
      description: "app.api.browser.press-key.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.press-key.errors.notFound.title",
      description: "app.api.browser.press-key.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.press-key.errors.serverError.title",
      description: "app.api.browser.press-key.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.press-key.errors.unknown.title",
      description: "app.api.browser.press-key.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.press-key.errors.unsavedChanges.title",
      description:
        "app.api.browser.press-key.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.press-key.errors.conflict.title",
      description: "app.api.browser.press-key.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.press-key.success.title",
    description: "app.api.browser.press-key.success.description",
  },
});

export type PressKeyRequestInput = typeof POST.types.RequestInput;
export type PressKeyRequestOutput = typeof POST.types.RequestOutput;
export type PressKeyResponseInput = typeof POST.types.ResponseInput;
export type PressKeyResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
