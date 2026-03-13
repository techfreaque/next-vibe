/**
 * Click Tool - Definition
 * Clicks on the provided element
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
  path: ["browser", "click"],
  title: "click.title",
  description: "click.description",
  category: "app.endpointCategories.browser",
  icon: "mouse-pointer",
  tags: ["click.tags.browserAutomation", "click.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "click.form.label",
    description: "click.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "click.form.fields.uid.label",
        description: "click.form.fields.uid.description",
        placeholder: "click.form.fields.uid.placeholder",
        columns: 8,
        schema: z
          .string()
          .describe(
            "The uid of an element on the page from the page content snapshot",
          ),
      }),
      dblClick: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "click.form.fields.dblClick.label",
        description: "click.form.fields.dblClick.description",
        columns: 4,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe("Set to true for double clicks. Default is false."),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.success",
        schema: z.boolean().describe("Whether the click operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.result",
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
        content: "click.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "click.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      singleClick: {
        uid: "element-123",
        dblClick: false,
      },
      doubleClick: {
        uid: "element-456",
        dblClick: true,
      },
    },
    responses: {
      default: {
        success: true,
        result: [
          { type: "text", text: "# click response\nClicked on the element." },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "click.errors.validation.title",
      description: "click.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "click.errors.network.title",
      description: "click.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "click.errors.unauthorized.title",
      description: "click.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "click.errors.forbidden.title",
      description: "click.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "click.errors.notFound.title",
      description: "click.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "click.errors.serverError.title",
      description: "click.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "click.errors.unknown.title",
      description: "click.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "click.errors.unsavedChanges.title",
      description: "click.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "click.errors.conflict.title",
      description: "click.errors.conflict.description",
    },
  },
  successTypes: {
    title: "click.success.title",
    description: "click.success.description",
  },
});

export type ClickRequestInput = typeof POST.types.RequestInput;
export type ClickRequestOutput = typeof POST.types.RequestOutput;
export type ClickResponseInput = typeof POST.types.ResponseInput;
export type ClickResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
