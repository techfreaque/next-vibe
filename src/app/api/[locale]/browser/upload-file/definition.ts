/**
 * UploadFile Tool - Definition
 * Upload a file through a provided element
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
  path: ["browser", "upload-file"],
  title: "upload-file.title",
  description: "upload-file.description",
  category: "endpointCategories.browser",
  icon: "upload",
  tags: [
    "upload-file.tags.browserAutomation",
    "upload-file.tags.inputAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "upload-file.form.label",
    description: "upload-file.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "upload-file.form.fields.uid.label",
        description: "upload-file.form.fields.uid.description",
        placeholder: "upload-file.form.fields.uid.placeholder",
        columns: 6,
        schema: z
          .string()
          .describe(
            "The uid of the file input element or an element that will open file chooser on the page from the page content snapshot",
          ),
      }),
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "upload-file.form.fields.filePath.label",
        description: "upload-file.form.fields.filePath.description",
        placeholder: "upload-file.form.fields.filePath.placeholder",
        columns: 6,
        schema: z.string().describe("The local path of the file to upload"),
      }),

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "upload-file.response.success",
        schema: z
          .boolean()
          .describe("Whether the file upload operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "upload-file.response.result",
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
        content: "upload-file.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "upload-file.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        uid: "element_123",
        filePath: "/path/to/file.txt",
      },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# upload_file response\nUploaded file: file.txt",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "upload-file.errors.validation.title",
      description: "upload-file.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "upload-file.errors.network.title",
      description: "upload-file.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "upload-file.errors.unauthorized.title",
      description: "upload-file.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "upload-file.errors.forbidden.title",
      description: "upload-file.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "upload-file.errors.notFound.title",
      description: "upload-file.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "upload-file.errors.serverError.title",
      description: "upload-file.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "upload-file.errors.unknown.title",
      description: "upload-file.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "upload-file.errors.unsavedChanges.title",
      description: "upload-file.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "upload-file.errors.conflict.title",
      description: "upload-file.errors.conflict.description",
    },
  },
  successTypes: {
    title: "upload-file.success.title",
    description: "upload-file.success.description",
  },
});

export type UploadFileRequestInput = typeof POST.types.RequestInput;
export type UploadFileRequestOutput = typeof POST.types.RequestOutput;
export type UploadFileResponseInput = typeof POST.types.ResponseInput;
export type UploadFileResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
