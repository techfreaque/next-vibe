/**
 * ListPages Tool - Definition
 * Get a list of pages open in the browser
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "list-pages"],
  title: "list-pages.title",
  description: "list-pages.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "layers",
  tags: [
    "list-pages.tags.browserAutomation",
    "list-pages.tags.navigationAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "list-pages.form.label",
    description: "list-pages.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-pages.response.success",
        schema: z
          .boolean()
          .describe("Whether the pages listing operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-pages.response.result",
        schema: z
          .array(
            z.object({
              type: z.string().describe("Content type (text or image)"),
              text: z.string().optional().describe("Text content"),
              data: z.string().optional().describe("Base64 encoded data"),
              mimeType: z.string().optional().describe("MIME type for data"),
            }),
          )
          .optional()
          .describe("MCP content blocks returned by the tool"),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-pages.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list-pages.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# list_pages response\n[0] Example Page (https://example.com) [active]",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list-pages.errors.validation.title",
      description: "list-pages.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list-pages.errors.network.title",
      description: "list-pages.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list-pages.errors.unauthorized.title",
      description: "list-pages.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list-pages.errors.forbidden.title",
      description: "list-pages.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list-pages.errors.notFound.title",
      description: "list-pages.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list-pages.errors.serverError.title",
      description: "list-pages.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list-pages.errors.unknown.title",
      description: "list-pages.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list-pages.errors.unsavedChanges.title",
      description: "list-pages.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list-pages.errors.conflict.title",
      description: "list-pages.errors.conflict.description",
    },
  },
  successTypes: {
    title: "list-pages.success.title",
    description: "list-pages.success.description",
  },
});

export type ListPagesRequestInput = typeof POST.types.RequestInput;
export type ListPagesRequestOutput = typeof POST.types.RequestOutput;
export type ListPagesResponseInput = typeof POST.types.ResponseInput;
export type ListPagesResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
