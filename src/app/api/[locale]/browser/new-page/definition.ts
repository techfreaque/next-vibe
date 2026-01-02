/**
 * NewPage Tool - Definition
 * Creates a new page
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
  path: ["browser", "new-page"],
  title: "app.api.browser.new-page.title",
  description: "app.api.browser.new-page.description",
  category: "app.api.browser.category",
  icon: "file-plus",
  tags: ["app.api.browser.tags.browserAutomation", "app.api.browser.tags.navigationAutomation"],

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
      title: "app.api.browser.new-page.form.label",
      description: "app.api.browser.new-page.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      url: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.new-page.form.fields.url.label",
          description: "app.api.browser.new-page.form.fields.url.description",
          placeholder: "app.api.browser.new-page.form.fields.url.placeholder",
          columns: 8,
        },
        z.string().describe("URL to load in a new page"),
      ),
      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.new-page.form.fields.timeout.label",
          description: "app.api.browser.new-page.form.fields.timeout.description",
          placeholder: "app.api.browser.new-page.form.fields.timeout.placeholder",
          columns: 4,
        },
        z
          .number()
          .optional()
          .describe(
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.new-page.response.success",
        },
        z.boolean().describe("Whether the new page creation operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.new-page.response.result",
        },
        z
          .object({
            created: z.boolean().describe("Whether the new page was created"),
            pageIdx: z.coerce.number().describe("Index of the new page"),
            url: z.string().describe("URL of the new page"),
          })
          .optional()
          .describe("Result of new page creation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.new-page.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.new-page.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { url: "https://example.com" },
    },
    responses: {
      default: {
        success: true,
        result: {
          created: true,
          pageIdx: 0,
          url: "https://example.com",
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.new-page.errors.validation.title",
      description: "app.api.browser.new-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.new-page.errors.network.title",
      description: "app.api.browser.new-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.new-page.errors.unauthorized.title",
      description: "app.api.browser.new-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.new-page.errors.forbidden.title",
      description: "app.api.browser.new-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.new-page.errors.notFound.title",
      description: "app.api.browser.new-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.new-page.errors.serverError.title",
      description: "app.api.browser.new-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.new-page.errors.unknown.title",
      description: "app.api.browser.new-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.new-page.errors.unsavedChanges.title",
      description: "app.api.browser.new-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.new-page.errors.conflict.title",
      description: "app.api.browser.new-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.new-page.success.title",
    description: "app.api.browser.new-page.success.description",
  },
});

export type NewPageRequestInput = typeof POST.types.RequestInput;
export type NewPageRequestOutput = typeof POST.types.RequestOutput;
export type NewPageResponseInput = typeof POST.types.ResponseInput;
export type NewPageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
