/**
 * NavigatePage Tool - Definition
 * Navigates the currently selected page to a URL
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
  path: ["browser", "navigate-page"],
  title: "app.api.browser.navigate-page.title",
  description: "app.api.browser.navigate-page.description",
  category: "app.api.browser.category",
  icon: "navigation",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.navigationAutomation",
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
      title: "app.api.browser.navigate-page.form.label",
      description: "app.api.browser.navigate-page.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      type: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.browser.navigate-page.form.fields.type.label",
          description:
            "app.api.browser.navigate-page.form.fields.type.description",
          placeholder:
            "app.api.browser.navigate-page.form.fields.type.placeholder",
          columns: 6,
          options: [
            {
              label:
                "app.api.browser.navigate-page.form.fields.type.options.url" as const,
              value: "url",
            },
            {
              label:
                "app.api.browser.navigate-page.form.fields.type.options.back" as const,
              value: "back",
            },
            {
              label:
                "app.api.browser.navigate-page.form.fields.type.options.forward" as const,
              value: "forward",
            },
            {
              label:
                "app.api.browser.navigate-page.form.fields.type.options.reload" as const,
              value: "reload",
            },
          ],
        },
        z
          .enum(["url", "back", "forward", "reload"])
          .optional()
          .describe(
            "Navigate the page by URL, back or forward in history, or reload.",
          ),
      ),
      url: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.navigate-page.form.fields.url.label",
          description:
            "app.api.browser.navigate-page.form.fields.url.description",
          placeholder:
            "app.api.browser.navigate-page.form.fields.url.placeholder",
          columns: 6,
        },
        z.string().optional().describe("Target URL (only type=url)"),
      ),
      ignoreCache: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.browser.navigate-page.form.fields.ignoreCache.label",
          description:
            "app.api.browser.navigate-page.form.fields.ignoreCache.description",
          placeholder:
            "app.api.browser.navigate-page.form.fields.ignoreCache.placeholder",
          columns: 6,
        },
        z.boolean().optional().describe("Whether to ignore cache on reload."),
      ),
      timeout: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.navigate-page.form.fields.timeout.label",
          description:
            "app.api.browser.navigate-page.form.fields.timeout.description",
          placeholder:
            "app.api.browser.navigate-page.form.fields.timeout.placeholder",
          columns: 6,
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
          content: "app.api.browser.navigate-page.response.success",
        },
        z.boolean().describe("Whether the navigation operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.navigate-page.response.result",
        },
        z
          .object({
            navigated: z.boolean().describe("Whether the page was navigated"),
            url: z
              .string()
              .optional()
              .describe("The URL of the navigated page"),
            title: z
              .string()
              .optional()
              .describe("The title of the navigated page"),
          })
          .optional()
          .describe("Result of the navigation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.navigate-page.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.navigate-page.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { type: "url", url: "https://example.com" },
    },
    responses: {
      default: {
        success: true,
        result: {
          navigated: true,
          url: "https://example.com",
          title: "Example Page",
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.navigate-page.errors.validation.title",
      description:
        "app.api.browser.navigate-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.navigate-page.errors.network.title",
      description: "app.api.browser.navigate-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.navigate-page.errors.unauthorized.title",
      description:
        "app.api.browser.navigate-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.navigate-page.errors.forbidden.title",
      description: "app.api.browser.navigate-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.navigate-page.errors.notFound.title",
      description: "app.api.browser.navigate-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.navigate-page.errors.serverError.title",
      description:
        "app.api.browser.navigate-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.navigate-page.errors.unknown.title",
      description: "app.api.browser.navigate-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.navigate-page.errors.unsavedChanges.title",
      description:
        "app.api.browser.navigate-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.navigate-page.errors.conflict.title",
      description: "app.api.browser.navigate-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.navigate-page.success.title",
    description: "app.api.browser.navigate-page.success.description",
  },
});

export type NavigatePageRequestInput = typeof POST.types.RequestInput;
export type NavigatePageRequestOutput = typeof POST.types.RequestOutput;
export type NavigatePageResponseInput = typeof POST.types.ResponseInput;
export type NavigatePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
