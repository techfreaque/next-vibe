/**
 * EvaluateScript Tool - Definition
 * Evaluate a JavaScript function inside the currently selected page
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
  path: ["v1", "core", "browser", "evaluate-script"],
  title: "app.api.v1.core.browser.evaluate-script.title",
  description: "app.api.v1.core.browser.evaluate-script.description",
  category: "app.api.v1.core.browser.category",
  tags: [
    "app.api.v1.core.browser.tags.browserAutomation",
    "app.api.v1.core.browser.tags.scriptExecution"
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
      title: "app.api.v1.core.browser.evaluate-script.form.label",
      description: "app.api.v1.core.browser.evaluate-script.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      function: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.browser.evaluate-script.form.fields.function.label",
          description: "app.api.v1.core.browser.evaluate-script.form.fields.function.description",
          placeholder: "app.api.v1.core.browser.evaluate-script.form.fields.function.placeholder",
          columns: 12,
        },
        z.string().describe("A JavaScript function declaration to be executed by the tool in the currently selected page"),
      ),
      args: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.browser.evaluate-script.form.fields.args.label",
          description: "app.api.v1.core.browser.evaluate-script.form.fields.args.description",
          placeholder: "app.api.v1.core.browser.evaluate-script.form.fields.args.placeholder",
          columns: 12,
        },
        z.array(z.object({ uid: z.string().describe("The uid of an element on the page from the page content snapshot") })).optional().describe("An optional list of arguments to pass to the function"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.evaluate-script.response.success",
        },
        z.boolean().describe("Whether the script evaluation operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.evaluate-script.response.result",
        },
        z.object({
          executed: z.boolean().describe("Whether the script was executed"),
          result: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown()), z.array(z.unknown())]).optional().describe("The result returned by the script"),
        }).optional().describe("Result of the script evaluation")
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.evaluate-script.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.evaluate-script.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {"function": "() => { return document.title; }"},
    },
    responses: {
      default: {
        success: true,
        result: {
          executed: true,
          result: "Example Page Title",
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.validation.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.network.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.unauthorized.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.forbidden.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.notFound.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.serverError.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.unknown.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.unsavedChanges.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.browser.evaluate-script.errors.conflict.title",
      description: "app.api.v1.core.browser.evaluate-script.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.browser.evaluate-script.success.title",
    description: "app.api.v1.core.browser.evaluate-script.success.description",
  },
});

export type EvaluateScriptRequestInput = typeof POST.types.RequestInput;
export type EvaluateScriptRequestOutput = typeof POST.types.RequestOutput;
export type EvaluateScriptResponseInput = typeof POST.types.ResponseInput;
export type EvaluateScriptResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;