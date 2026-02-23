/**
 * GetNetworkRequest Tool - Definition
 * Gets a network request by its ID
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "get-network-request"],
  title: "get-network-request.title",
  description: "get-network-request.description",
  category: "get-network-request.category",
  icon: "network",
  tags: [
    "get-network-request.tags.browserAutomation",
    "get-network-request.tags.networkAnalysis",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get-network-request.form.label",
    description: "get-network-request.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      reqid: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get-network-request.form.fields.reqid.label",
        description: "get-network-request.form.fields.reqid.description",
        placeholder: "get-network-request.form.fields.reqid.placeholder",
        columns: 6,
        schema: z
          .number()
          .optional()
          .describe(
            "The reqid of the network request. If omitted returns the currently selected request in the DevTools Network panel.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-network-request.response.success",
        schema: z
          .boolean()
          .describe(
            "Whether the network request retrieval operation succeeded",
          ),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-network-request.response.result",
        schema: z
          .object({
            found: z.boolean().describe("Whether the request was found"),
            request: z
              .object({
                url: z.string().describe("Request URL"),
                method: z.string().describe("HTTP method"),
                status: z.coerce
                  .number()
                  .optional()
                  .describe("Response status code"),
                type: z.string().optional().describe("Resource type"),
              })
              .optional()
              .describe("The network request details"),
          })
          .optional()
          .describe("Result of the network request retrieval"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-network-request.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get-network-request.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
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
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get-network-request.errors.validation.title",
      description: "get-network-request.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get-network-request.errors.network.title",
      description: "get-network-request.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get-network-request.errors.unauthorized.title",
      description: "get-network-request.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get-network-request.errors.forbidden.title",
      description: "get-network-request.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get-network-request.errors.notFound.title",
      description: "get-network-request.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get-network-request.errors.serverError.title",
      description: "get-network-request.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get-network-request.errors.unknown.title",
      description: "get-network-request.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get-network-request.errors.unsavedChanges.title",
      description: "get-network-request.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get-network-request.errors.conflict.title",
      description: "get-network-request.errors.conflict.description",
    },
  },
  successTypes: {
    title: "get-network-request.success.title",
    description: "get-network-request.success.description",
  },
});

export type GetNetworkRequestRequestInput = typeof POST.types.RequestInput;
export type GetNetworkRequestRequestOutput = typeof POST.types.RequestOutput;
export type GetNetworkRequestResponseInput = typeof POST.types.ResponseInput;
export type GetNetworkRequestResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
