/**
 * SelectPage Tool - Definition
 * Select a page as a context for future tool calls
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
  path: ["browser", "select-page"],
  title: "app.api.browser.select-page.title",
  description: "app.api.browser.select-page.description",
  category: "app.api.browser.category",
  icon: "square-check",
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
      title: "app.api.browser.select-page.form.label",
      description: "app.api.browser.select-page.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      pageIdx: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.browser.select-page.form.fields.pageIdx.label",
        description:
          "app.api.browser.select-page.form.fields.pageIdx.description",
        placeholder:
          "app.api.browser.select-page.form.fields.pageIdx.placeholder",
        columns: 6,
        schema: z
          .number()
          .describe(
            "The index of the page to select. Call list_pages to list pages.",
          ),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.select-page.response.success",
        schema: z
          .boolean()
          .describe("Whether the page selection operation succeeded"),
      }),
      result: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.select-page.response.result",
        schema: z
          .object({
            selected: z.boolean().describe("Whether the page was selected"),
            pageIdx: z.coerce.number().describe("Index of the selected page"),
            title: z.string().optional().describe("Title of the selected page"),
            url: z.string().optional().describe("URL of the selected page"),
          })
          .optional()
          .describe("Result of page selection"),
      }),
      error: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.select-page.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.select-page.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  ),
  examples: {
    requests: {
      default: { pageIdx: 0 },
    },
    responses: {
      default: {
        success: true,
        result: {
          selected: true,
          pageIdx: 0,
          title: "Example Page",
          url: "https://example.com",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.select-page.errors.validation.title",
      description: "app.api.browser.select-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.select-page.errors.network.title",
      description: "app.api.browser.select-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.select-page.errors.unauthorized.title",
      description:
        "app.api.browser.select-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.select-page.errors.forbidden.title",
      description: "app.api.browser.select-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.select-page.errors.notFound.title",
      description: "app.api.browser.select-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.select-page.errors.serverError.title",
      description: "app.api.browser.select-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.select-page.errors.unknown.title",
      description: "app.api.browser.select-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.select-page.errors.unsavedChanges.title",
      description:
        "app.api.browser.select-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.select-page.errors.conflict.title",
      description: "app.api.browser.select-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.select-page.success.title",
    description: "app.api.browser.select-page.success.description",
  },
});

export type SelectPageRequestInput = typeof POST.types.RequestInput;
export type SelectPageRequestOutput = typeof POST.types.RequestOutput;
export type SelectPageResponseInput = typeof POST.types.ResponseInput;
export type SelectPageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
