/**
 * Drag Tool - Definition
 * Drag an element onto another element
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
  path: ["browser", "drag"],
  title: "drag.title",
  description: "drag.description",
  category: "endpointCategories.browser",
  subCategory: "endpointCategories.browserInteraction",
  icon: "move",
  tags: ["drag.tags.browserAutomation", "drag.tags.inputAutomation"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "drag.form.label",
    description: "drag.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      from_uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "drag.form.fields.from_uid.label",
        description: "drag.form.fields.from_uid.description",
        placeholder: "drag.form.fields.from_uid.placeholder",
        columns: 6,
        schema: z.string().describe("The uid of the element to drag"),
      }),
      to_uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "drag.form.fields.to_uid.label",
        description: "drag.form.fields.to_uid.description",
        placeholder: "drag.form.fields.to_uid.placeholder",
        columns: 6,
        schema: z.string().describe("The uid of the element to drop into"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "drag.response.success",
        schema: z.boolean().describe("Whether the drag operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "drag.response.result",
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
        content: "drag.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "drag.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      dragDrop: {
        from_uid: "draggable-123",
        to_uid: "dropzone-456",
      },
    },
    responses: {
      default: {
        success: true,
        result: [
          { type: "text", text: "# drag response\nDragged element to target." },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "drag.errors.validation.title",
      description: "drag.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "drag.errors.network.title",
      description: "drag.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "drag.errors.unauthorized.title",
      description: "drag.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "drag.errors.forbidden.title",
      description: "drag.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "drag.errors.notFound.title",
      description: "drag.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "drag.errors.serverError.title",
      description: "drag.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "drag.errors.unknown.title",
      description: "drag.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "drag.errors.unsavedChanges.title",
      description: "drag.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "drag.errors.conflict.title",
      description: "drag.errors.conflict.description",
    },
  },
  successTypes: {
    title: "drag.success.title",
    description: "drag.success.description",
  },
});

export type DragRequestInput = typeof POST.types.RequestInput;
export type DragRequestOutput = typeof POST.types.RequestOutput;
export type DragResponseInput = typeof POST.types.ResponseInput;
export type DragResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
