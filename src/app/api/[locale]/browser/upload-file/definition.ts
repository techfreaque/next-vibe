/**
 * UploadFile Tool - Definition
 * Upload a file through a provided element
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
  path: ["browser", "upload-file"],
  title: "app.api.browser.upload-file.title",
  description: "app.api.browser.upload-file.description",
  category: "app.api.browser.category",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.inputAutomation",
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
      title: "app.api.browser.upload-file.form.label",
      description: "app.api.browser.upload-file.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      uid: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.upload-file.form.fields.uid.label",
          description:
            "app.api.browser.upload-file.form.fields.uid.description",
          placeholder:
            "app.api.browser.upload-file.form.fields.uid.placeholder",
          columns: 6,
        },
        z
          .string()
          .describe(
            "The uid of the file input element or an element that will open file chooser on the page from the page content snapshot",
          ),
      ),
      filePath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.browser.upload-file.form.fields.filePath.label",
          description:
            "app.api.browser.upload-file.form.fields.filePath.description",
          placeholder:
            "app.api.browser.upload-file.form.fields.filePath.placeholder",
          columns: 6,
        },
        z.string().describe("The local path of the file to upload"),
      ),

      // Response fields
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.upload-file.response.success",
        },
        z.boolean().describe("Whether the file upload operation succeeded"),
      ),
      result: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.upload-file.response.result",
        },
        z
          .object({
            uploaded: z.boolean().describe("Whether the file was uploaded"),
            fileName: z
              .string()
              .optional()
              .describe("Name of the uploaded file"),
          })
          .optional()
          .describe("Result of file upload operation"),
      ),
      error: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.upload-file.response.error",
        },
        z.string().optional().describe("Error message if the operation failed"),
      ),
      executionId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.upload-file.response.executionId",
        },
        z.string().optional().describe("Unique identifier for this execution"),
      ),
    },
  ),
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
        result: {
          uploaded: true,
          fileName: "file.txt",
        },
        executionId: "exec_123",
      },
    },
    urlPathParams: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.upload-file.errors.validation.title",
      description: "app.api.browser.upload-file.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.upload-file.errors.network.title",
      description: "app.api.browser.upload-file.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.upload-file.errors.unauthorized.title",
      description:
        "app.api.browser.upload-file.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.upload-file.errors.forbidden.title",
      description: "app.api.browser.upload-file.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.upload-file.errors.notFound.title",
      description: "app.api.browser.upload-file.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.upload-file.errors.serverError.title",
      description: "app.api.browser.upload-file.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.upload-file.errors.unknown.title",
      description: "app.api.browser.upload-file.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.upload-file.errors.unsavedChanges.title",
      description:
        "app.api.browser.upload-file.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.upload-file.errors.conflict.title",
      description: "app.api.browser.upload-file.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.upload-file.success.title",
    description: "app.api.browser.upload-file.success.description",
  },
});

export type UploadFileRequestInput = typeof POST.types.RequestInput;
export type UploadFileRequestOutput = typeof POST.types.RequestOutput;
export type UploadFileResponseInput = typeof POST.types.ResponseInput;
export type UploadFileResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
