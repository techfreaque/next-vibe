/**
 * HandleDialog Tool - Definition
 * Handle a browser dialog (alert, confirm, prompt)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "browser", "handle-dialog"],
  title: "app.api.v1.core.browser.handle-dialog.title",
  description: "app.api.v1.core.browser.handle-dialog.description",
  category: "app.api.v1.core.browser.category",
  tags: [
    "app.api.v1.core.browser.tags.browserAutomation",
    "app.api.v1.core.browser.tags.dialogAutomation"
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
      title: "app.api.v1.core.browser.handle-dialog.form.label",
      description: "app.api.v1.core.browser.handle-dialog.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      action: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.browser.handle-dialog.form.fields.action.label",
          description: "app.api.v1.core.browser.handle-dialog.form.fields.action.description",
          placeholder: "app.api.v1.core.browser.handle-dialog.form.fields.action.placeholder",
          columns: 6,
          options: [
            { label: "Accept", value: "accept" },
            { label: "Dismiss", value: "dismiss" }
          ]
        },
        z.enum(["accept", "dismiss"]).describe("Whether to dismiss or accept the dialog"),
      ),
      promptText: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.browser.handle-dialog.form.fields.promptText.label",
          description: "app.api.v1.core.browser.handle-dialog.form.fields.promptText.description",
          placeholder: "app.api.v1.core.browser.handle-dialog.form.fields.promptText.placeholder",
          columns: 6,
        },
        z.string().optional().describe("Optional prompt text to enter into the dialog"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.handle-dialog.response.success",
        },
        z.boolean().describe("Whether the dialog handling operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.handle-dialog.response.result",
        },
        z.object({
          handled: z.boolean().describe("Whether the dialog was handled"),
          action: z.string().describe("The action taken"),
        }).optional().describe("Result of the dialog handling")
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.handle-dialog.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.handle-dialog.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {"action": "accept"},
    },
    responses: {
      default: {
        success: true,
        result: {
          handled: true,
          action: "accept"
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.validation.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.network.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.unauthorized.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.forbidden.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.notFound.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.serverError.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.unknown.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.unsavedChanges.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.browser.handle-dialog.errors.conflict.title",
      description: "app.api.v1.core.browser.handle-dialog.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.browser.handle-dialog.success.title",
    description: "app.api.v1.core.browser.handle-dialog.success.description",
  },
});

export type HandleDialogRequestInput = typeof POST.types.RequestInput;
export type HandleDialogRequestOutput = typeof POST.types.RequestOutput;
export type HandleDialogResponseInput = typeof POST.types.ResponseInput;
export type HandleDialogResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;