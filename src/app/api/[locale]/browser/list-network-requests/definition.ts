/**
 * ListNetworkRequests Tool - Definition
 * List all requests for the currently selected page
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestDataField,
  responseArrayField,
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
  path: ["browser", "list-network-requests"],
  title: "app.api.browser.list-network-requests.title",
  description: "app.api.browser.list-network-requests.description",
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
      title: "app.api.browser.list-network-requests.form.label",
      description: "app.api.browser.list-network-requests.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      includePreservedRequests: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.browser.list-network-requests.form.fields.includePreservedRequests.label",
          description:
            "app.api.browser.list-network-requests.form.fields.includePreservedRequests.description",
          placeholder:
            "app.api.browser.list-network-requests.form.fields.includePreservedRequests.placeholder",
          columns: 4,
        },
        z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Set to true to return the preserved requests over the last 3 navigations.",
          ),
      ),
      pageIdx: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.browser.list-network-requests.form.fields.pageIdx.label",
          description:
            "app.api.browser.list-network-requests.form.fields.pageIdx.description",
          placeholder:
            "app.api.browser.list-network-requests.form.fields.pageIdx.placeholder",
          columns: 4,
        },
        z
          .number()
          .min(0)
          .optional()
          .describe(
            "Page number to return (0-based). When omitted, returns the first page.",
          ),
      ),
      pageSize: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.browser.list-network-requests.form.fields.pageSize.label",
          description:
            "app.api.browser.list-network-requests.form.fields.pageSize.description",
          placeholder:
            "app.api.browser.list-network-requests.form.fields.pageSize.placeholder",
          columns: 4,
        },
        z
          .number()
          .min(1)
          .optional()
          .describe(
            "Maximum number of requests to return. When omitted, returns all requests.",
          ),
      ),
      resourceTypes: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.browser.list-network-requests.form.fields.resourceTypes.label",
          description:
            "app.api.browser.list-network-requests.form.fields.resourceTypes.description",
          placeholder:
            "app.api.browser.list-network-requests.form.fields.resourceTypes.placeholder",
          columns: 12,
        },
        z
          .array(
            z.enum([
              "document",
              "stylesheet",
              "image",
              "media",
              "font",
              "script",
              "texttrack",
              "xhr",
              "fetch",
              "prefetch",
              "eventsource",
              "websocket",
              "manifest",
              "signedexchange",
              "ping",
              "cspviolationreport",
              "preflight",
              "fedcm",
              "other",
            ]),
          )
          .optional()
          .describe(
            "Filter requests to only return requests of the specified resource types. When omitted or empty, returns all requests.",
          ),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-network-requests.response.success",
        },
        z
          .boolean()
          .describe("Whether the network requests listing operation succeeded"),
      ),
      result: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.browser.list-network-requests.response.result.title",
          description:
            "app.api.browser.list-network-requests.response.result.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          requests: responseArrayField(
            {
              type: WidgetType.DATA_TABLE,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                reqid: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-network-requests.response.result.requests.reqid",
                  },
                  z.coerce.number(),
                ),
                url: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-network-requests.response.result.requests.url",
                  },
                  z.string(),
                ),
                method: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-network-requests.response.result.requests.method",
                  },
                  z.string(),
                ),
                status: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-network-requests.response.result.requests.status",
                  },
                  z.coerce.number().optional(),
                ),
                type: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.browser.list-network-requests.response.result.requests.type",
                  },
                  z.string(),
                ),
              },
            ),
          ),
          totalCount: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.browser.list-network-requests.response.result.totalCount",
            },
            z.coerce.number().describe("Total number of requests"),
          ),
        },
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-network-requests.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.list-network-requests.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
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
          requests: [
            {
              reqid: 1,
              url: "https://example.com",
              method: "GET",
              status: 200,
              type: "document",
            },
          ],
          totalCount: 1,
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.list-network-requests.errors.validation.title",
      description:
        "app.api.browser.list-network-requests.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.list-network-requests.errors.network.title",
      description:
        "app.api.browser.list-network-requests.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.list-network-requests.errors.unauthorized.title",
      description:
        "app.api.browser.list-network-requests.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.list-network-requests.errors.forbidden.title",
      description:
        "app.api.browser.list-network-requests.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.list-network-requests.errors.notFound.title",
      description:
        "app.api.browser.list-network-requests.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.list-network-requests.errors.serverError.title",
      description:
        "app.api.browser.list-network-requests.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.list-network-requests.errors.unknown.title",
      description:
        "app.api.browser.list-network-requests.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.browser.list-network-requests.errors.unsavedChanges.title",
      description:
        "app.api.browser.list-network-requests.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.list-network-requests.errors.conflict.title",
      description:
        "app.api.browser.list-network-requests.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.list-network-requests.success.title",
    description: "app.api.browser.list-network-requests.success.description",
  },
});

export type ListNetworkRequestsRequestInput = typeof POST.types.RequestInput;
export type ListNetworkRequestsRequestOutput = typeof POST.types.RequestOutput;
export type ListNetworkRequestsResponseInput = typeof POST.types.ResponseInput;
export type ListNetworkRequestsResponseOutput =
  typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
