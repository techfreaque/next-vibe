/**
 * Fill Tool - Definition
 * Type text into an input, text area or select an option from a select element
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
  path: ["v1", "core", "browser", "fill"],
  title: "app.api.v1.core.browser.fill.title",
  description: "app.api.v1.core.browser.fill.description",
  category: "app.api.v1.core.browser.category",
  tags: [
    "app.api.v1.core.browser.tags.browserAutomation",
    "app.api.v1.core.browser.tags.inputAutomation"
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
      title: "app.api.v1.core.browser.fill.form.label",
      description: "app.api.v1.core.browser.fill.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.browser.fill.form.fields.uid.label",
          description: "app.api.v1.core.browser.fill.form.fields.uid.description",
          placeholder: "app.api.v1.core.browser.fill.form.fields.uid.placeholder",
          columns: 6,
        },
        z.string().describe("The uid of an element on the page from the page content snapshot"),
      ),
      value: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.browser.fill.form.fields.value.label",
          description: "app.api.v1.core.browser.fill.form.fields.value.description",
          placeholder: "app.api.v1.core.browser.fill.form.fields.value.placeholder",
          columns: 6,
        },
        z.string().describe("The value to fill in"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.fill.response.success",
        },
        z.boolean().describe("Whether the fill operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.fill.response.result",
        },
        z.object({
          filled: z.boolean().describe("Whether the element was filled"),
          element: z.string().describe("The element uid that was filled"),
          value: z.string().describe("The value that was filled"),
        }).optional().describe("Result of the fill operation")
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.fill.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.browser.fill.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {"uid": "element-123", "value": "test value"},
    },
    responses: {
      default: {
        success: true,
        result: {
          filled: true,
          element: "field-1",
          value: "test value"
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.browser.fill.errors.validation.title",
      description: "app.api.v1.core.browser.fill.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.browser.fill.errors.network.title",
      description: "app.api.v1.core.browser.fill.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.browser.fill.errors.unauthorized.title",
      description: "app.api.v1.core.browser.fill.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.browser.fill.errors.forbidden.title",
      description: "app.api.v1.core.browser.fill.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.browser.fill.errors.notFound.title",
      description: "app.api.v1.core.browser.fill.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.browser.fill.errors.serverError.title",
      description: "app.api.v1.core.browser.fill.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.browser.fill.errors.unknown.title",
      description: "app.api.v1.core.browser.fill.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.browser.fill.errors.unsavedChanges.title",
      description: "app.api.v1.core.browser.fill.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.browser.fill.errors.conflict.title",
      description: "app.api.v1.core.browser.fill.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.browser.fill.success.title",
    description: "app.api.v1.core.browser.fill.success.description",
  },
});

export type FillRequestInput = typeof POST.types.RequestInput;
export type FillRequestOutput = typeof POST.types.RequestOutput;
export type FillResponseInput = typeof POST.types.ResponseInput;
export type FillResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;