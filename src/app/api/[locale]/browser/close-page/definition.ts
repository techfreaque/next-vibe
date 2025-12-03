/**
 * ClosePage Tool - Definition
 * Closes the page by its index. The last open page cannot be closed
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
  path: ["browser", "close-page"],
  title: "app.api.browser.close-page.title",
  description: "app.api.browser.close-page.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.navigationAutomation",
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.browser.close-page.form.label",
      description: "app.api.browser.close-page.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      pageIdx: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.close-page.form.fields.pageIdx.label",
          description:
            "app.api.browser.close-page.form.fields.pageIdx.description",
          placeholder:
            "app.api.browser.close-page.form.fields.pageIdx.placeholder",
          columns: 6,
        },
        z
          .number()
          .describe(
            "The index of the page to close. Call list_pages to list pages.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.close-page.response.success",
        },
        z.boolean().describe("Whether the page close operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.close-page.response.result",
        },
        z
          .object({
            closed: z.boolean().describe("Whether the page was closed"),
            remainingPages: z
              .number()
              .optional()
              .describe("Number of remaining open pages"),
          })
          .optional()
          .describe("Result of the close page operation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.close-page.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.close-page.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: {
        pageIdx: 0,
      },
    },
    responses: {
      default: {
        success: true,
        result: {
          closed: true,
          remainingPages: 2,
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.close-page.errors.validation.title",
      description: "app.api.browser.close-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.close-page.errors.network.title",
      description: "app.api.browser.close-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.close-page.errors.unauthorized.title",
      description: "app.api.browser.close-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.close-page.errors.forbidden.title",
      description: "app.api.browser.close-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.close-page.errors.notFound.title",
      description: "app.api.browser.close-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.close-page.errors.serverError.title",
      description: "app.api.browser.close-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.close-page.errors.unknown.title",
      description: "app.api.browser.close-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.close-page.errors.unsavedChanges.title",
      description:
        "app.api.browser.close-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.close-page.errors.conflict.title",
      description: "app.api.browser.close-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.close-page.success.title",
    description: "app.api.browser.close-page.success.description",
  },
});

export type ClosePageRequestInput = typeof POST.types.RequestInput;
export type ClosePageRequestOutput = typeof POST.types.RequestOutput;
export type ClosePageResponseInput = typeof POST.types.ResponseInput;
export type ClosePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
