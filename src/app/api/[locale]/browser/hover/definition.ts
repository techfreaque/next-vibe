/**
 * Hover Tool - Definition
 * Hover over the provided element
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "hover"],
  title: "hover.title",
  description: "hover.description",
  category: "endpointCategories.browser",
  icon: "mouse-pointer",
  tags: ["hover.tags.browserAutomation", "hover.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "hover.form.label",
    description: "hover.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "hover.form.fields.uid.label",
        description: "hover.form.fields.uid.description",
        placeholder: "hover.form.fields.uid.placeholder",
        columns: 6,
        schema: z
          .string()
          .describe(
            "The uid of an element on the page from the page content snapshot",
          ),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "hover.response.success",
        schema: z.boolean().describe("Whether the hover operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "hover.response.result",
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
        content: "hover.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "hover.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { uid: "element-123" },
    },
    responses: {
      default: {
        success: true,
        result: [
          { type: "text", text: "# hover response\nHovered over the element." },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "hover.errors.validation.title",
      description: "hover.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "hover.errors.network.title",
      description: "hover.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "hover.errors.unauthorized.title",
      description: "hover.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "hover.errors.forbidden.title",
      description: "hover.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "hover.errors.notFound.title",
      description: "hover.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "hover.errors.serverError.title",
      description: "hover.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "hover.errors.unknown.title",
      description: "hover.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "hover.errors.unsavedChanges.title",
      description: "hover.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "hover.errors.conflict.title",
      description: "hover.errors.conflict.description",
    },
  },
  successTypes: {
    title: "hover.success.title",
    description: "hover.success.description",
  },
});

export type HoverRequestInput = typeof POST.types.RequestInput;
export type HoverRequestOutput = typeof POST.types.RequestOutput;
export type HoverResponseInput = typeof POST.types.ResponseInput;
export type HoverResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
