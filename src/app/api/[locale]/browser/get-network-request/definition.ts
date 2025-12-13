/**
 * GetNetworkRequest Tool - Definition
 * Gets a network request by its ID
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
  path: ["browser", "get-network-request"],
  title: "app.api.browser.get-network-request.title",
  description: "app.api.browser.get-network-request.description",
  category: "app.api.browser.category",
  icon: "network",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.networkAnalysis",
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
      title: "app.api.browser.get-network-request.form.label",
      description: "app.api.browser.get-network-request.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      reqid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.get-network-request.form.fields.reqid.label",
          description:
            "app.api.browser.get-network-request.form.fields.reqid.description",
          placeholder:
            "app.api.browser.get-network-request.form.fields.reqid.placeholder",
          columns: 6,
        },
        z
          .number()
          .optional()
          .describe(
            "The reqid of the network request. If omitted returns the currently selected request in the DevTools Network panel.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-network-request.response.success",
        },
        z
          .boolean()
          .describe(
            "Whether the network request retrieval operation succeeded",
          ),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-network-request.response.result",
        },
        z
          .object({
            found: z.boolean().describe("Whether the request was found"),
            request: z
              .object({
                url: z.string().describe("Request URL"),
                method: z.string().describe("HTTP method"),
                status: z.number().optional().describe("Response status code"),
                type: z.string().optional().describe("Resource type"),
              })
              .optional()
              .describe("The network request details"),
          })
          .optional()
          .describe("Result of the network request retrieval"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-network-request.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.get-network-request.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
  examples: {
    requests: {
      default: { reqid: 456 },
    },
    responses: {
      default: {
        success: true,
        result: {
          found: true,
          request: {
            url: "https://example.com",
            method: "GET",
            status: 200,
            type: "document",
          },
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.get-network-request.errors.validation.title",
      description:
        "app.api.browser.get-network-request.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.get-network-request.errors.network.title",
      description:
        "app.api.browser.get-network-request.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.get-network-request.errors.unauthorized.title",
      description:
        "app.api.browser.get-network-request.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.get-network-request.errors.forbidden.title",
      description:
        "app.api.browser.get-network-request.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.get-network-request.errors.notFound.title",
      description:
        "app.api.browser.get-network-request.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.get-network-request.errors.serverError.title",
      description:
        "app.api.browser.get-network-request.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.get-network-request.errors.unknown.title",
      description:
        "app.api.browser.get-network-request.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.get-network-request.errors.unsavedChanges.title",
      description:
        "app.api.browser.get-network-request.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.get-network-request.errors.conflict.title",
      description:
        "app.api.browser.get-network-request.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.get-network-request.success.title",
    description: "app.api.browser.get-network-request.success.description",
  },
});

export type GetNetworkRequestRequestInput = typeof POST.types.RequestInput;
export type GetNetworkRequestRequestOutput = typeof POST.types.RequestOutput;
export type GetNetworkRequestResponseInput = typeof POST.types.ResponseInput;
export type GetNetworkRequestResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
