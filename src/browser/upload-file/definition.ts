/**
 * UploadFile Tool - Definition
 * Upload a file through a provided element
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";
import { browserInstanceIdField } from "../shared/instance-id-field";

const BrowserWidget = lazyWidget(() =>
  import("../shared/widget").then((m) => ({ default: m.BrowserToolWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["browser", "upload-file"],
  aliases: ["browser-upload-file"] as const,
  title: "upload-file.title",
  titleShort: "upload-file.titleShort",
  description: "upload-file.description",
  dynamicTitle: ({ request }) => {
    const filePaths = request?.filePaths;
    const first = Array.isArray(filePaths) ? filePaths[0] : filePaths;
    if (first) {
      const fileName = first.split("/").pop() || first;
      const name =
        fileName.length > 40 ? `${fileName.slice(0, 40)}…` : fileName;
      const extra =
        Array.isArray(filePaths) && filePaths.length > 1
          ? ` +${filePaths.length - 1}`
          : "";
      const short = `${name}${extra}`;
      return {
        message: "upload-file.dynamicTitle" as const,
        messageParams: { file: short },
      };
    }
    return undefined;
  },
  category: "browser",
  subCategory: "Interaction",
  icon: "upload",
  tags: [
    "upload-file.tags.browserAutomation",
    "upload-file.tags.inputAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
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
      filePaths: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "upload-file.form.fields.filePaths.label",
        description: "upload-file.form.fields.filePaths.description",
        placeholder: "upload-file.form.fields.filePaths.placeholder",
        columns: 6,
        schema: z
          .union([z.string(), z.array(z.string())])
          .transform((v) => (Array.isArray(v) ? v : [v]))
          .pipe(z.array(z.string().min(1)).min(1))
          .describe(
            "Absolute path of the file to upload, or a list of paths for a multi-file input. Paths must be inside the project directory or the OS temp directory, on the machine running the browser.",
          ),
      }),
      includeSnapshot: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "upload-file.form.fields.includeSnapshot.label",
        description: "upload-file.form.fields.includeSnapshot.description",
        columns: 12,
        schema: z
          .boolean()
          .optional()
          .describe(
            "Whether to include a page snapshot in the response. Default is false.",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the file upload operation succeeded"),
      }),
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
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
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
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
        filePaths: ["/tmp/report.pdf"],
      },
      multiple: {
        uid: "element_123",
        filePaths: ["/tmp/photo-1.png", "/tmp/photo-2.png"],
        includeSnapshot: true,
      },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# upload_file response\nFile uploaded from /tmp/report.pdf.",
          },
        ],
        executionId: "exec_123",
      },
      multiple: {
        success: true,
        result: [
          {
            type: "text",
            text: "# upload_file response\nFile uploaded from /tmp/photo-1.png, /tmp/photo-2.png.",
          },
        ],
        executionId: "exec_124",
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
