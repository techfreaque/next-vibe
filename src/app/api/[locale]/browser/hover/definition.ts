/**
 * Hover Tool - Definition
 * Hover over the provided element
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
  path: ["browser", "hover"],
  title: "app.api.browser.hover.title",
  description: "app.api.browser.hover.description",
  category: "app.api.browser.category",
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
      title: "app.api.browser.hover.form.label",
      description: "app.api.browser.hover.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.hover.form.fields.uid.label",
          description: "app.api.browser.hover.form.fields.uid.description",
          placeholder: "app.api.browser.hover.form.fields.uid.placeholder",
          columns: 6,
        },
        z
          .string()
          .describe(
            "The uid of an element on the page from the page content snapshot",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.hover.response.success",
        },
        z.boolean().describe("Whether the hover operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.hover.response.result",
        },
        z
          .object({
            hovered: z.boolean().describe("Whether the element was hovered"),
          })
          .optional()
          .describe("Result of the hover operation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.hover.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.hover.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { uid: "element-123" },
    },
    responses: {
      default: {
        success: true,
        result: {
          hovered: true,
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.hover.errors.validation.title",
      description: "app.api.browser.hover.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.hover.errors.network.title",
      description: "app.api.browser.hover.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.hover.errors.unauthorized.title",
      description: "app.api.browser.hover.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.hover.errors.forbidden.title",
      description: "app.api.browser.hover.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.hover.errors.notFound.title",
      description: "app.api.browser.hover.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.hover.errors.serverError.title",
      description: "app.api.browser.hover.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.hover.errors.unknown.title",
      description: "app.api.browser.hover.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.hover.errors.unsavedChanges.title",
      description: "app.api.browser.hover.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.hover.errors.conflict.title",
      description: "app.api.browser.hover.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.hover.success.title",
    description: "app.api.browser.hover.success.description",
  },
});

export type HoverRequestInput = typeof POST.types.RequestInput;
export type HoverRequestOutput = typeof POST.types.RequestOutput;
export type HoverResponseInput = typeof POST.types.ResponseInput;
export type HoverResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
