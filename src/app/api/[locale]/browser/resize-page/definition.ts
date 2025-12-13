/**
 * ResizePage Tool - Definition
 * Resizes the selected page's window
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
  path: ["browser", "resize-page"],
  title: "app.api.browser.resize-page.title",
  description: "app.api.browser.resize-page.description",
  category: "app.api.browser.category",
  icon: "maximize",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.viewportAutomation",
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
      title: "app.api.browser.resize-page.form.label",
      description: "app.api.browser.resize-page.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      width: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.resize-page.form.fields.width.label",
          description:
            "app.api.browser.resize-page.form.fields.width.description",
          placeholder:
            "app.api.browser.resize-page.form.fields.width.placeholder",
          columns: 6,
        },
        z.number().describe("Page width"),
      ),
      height: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.resize-page.form.fields.height.label",
          description:
            "app.api.browser.resize-page.form.fields.height.description",
          placeholder:
            "app.api.browser.resize-page.form.fields.height.placeholder",
          columns: 6,
        },
        z.number().describe("Page height"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.resize-page.response.success",
        },
        z.boolean().describe("Whether the page resize operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.resize-page.response.result",
        },
        z
          .object({
            resized: z.boolean().describe("Whether the page was resized"),
            width: z.number().describe("New page width"),
            height: z.number().describe("New page height"),
          })
          .optional()
          .describe("Result of page resize operation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.resize-page.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.resize-page.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { width: 1920, height: 1080 },
    },
    responses: {
      default: {
        success: true,
        result: {
          resized: true,
          width: 1920,
          height: 1080,
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.resize-page.errors.validation.title",
      description: "app.api.browser.resize-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.resize-page.errors.network.title",
      description: "app.api.browser.resize-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.resize-page.errors.unauthorized.title",
      description:
        "app.api.browser.resize-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.resize-page.errors.forbidden.title",
      description: "app.api.browser.resize-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.resize-page.errors.notFound.title",
      description: "app.api.browser.resize-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.resize-page.errors.serverError.title",
      description: "app.api.browser.resize-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.resize-page.errors.unknown.title",
      description: "app.api.browser.resize-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.resize-page.errors.unsavedChanges.title",
      description:
        "app.api.browser.resize-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.resize-page.errors.conflict.title",
      description: "app.api.browser.resize-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.resize-page.success.title",
    description: "app.api.browser.resize-page.success.description",
  },
});

export type ResizePageRequestInput = typeof POST.types.RequestInput;
export type ResizePageRequestOutput = typeof POST.types.RequestOutput;
export type ResizePageResponseInput = typeof POST.types.ResponseInput;
export type ResizePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
