/**
 * TakeSnapshot Tool - Definition
 * Take a text snapshot of the currently selected page based on the a11y tree
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
  path: ["browser", "take-snapshot"],
  aliases: ["browser-take-snapshot"] as const,
  title: "take-snapshot.title",
  titleShort: "take-snapshot.titleShort",
  description: "take-snapshot.description",
  category: "browser",
  subCategory: "Inspection",
  icon: "file-text",
  tags: [
    "take-snapshot.tags.browserAutomation",
    "take-snapshot.tags.captureAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: BrowserWidget,
    children: {
      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "take-snapshot.form.fields.verbose.label",
        description: "take-snapshot.form.fields.verbose.description",
        placeholder: "take-snapshot.form.fields.verbose.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .optional()
          .describe(
            "Whether to include all possible information available in the full a11y tree. Default is false.",
          ),
      }),
      filePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "take-snapshot.form.fields.filePath.label",
        description: "take-snapshot.form.fields.filePath.description",
        placeholder: "take-snapshot.form.fields.filePath.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response.",
          ),
      }),

      instanceId: browserInstanceIdField,

      // Response fields
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z
          .boolean()
          .describe("Whether the snapshot capture operation succeeded"),
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
      default: { filePath: "/path/to/file.txt" },
    },
    responses: {
      default: {
        success: true,
        result: [
          {
            type: "text",
            text: "# take_snapshot response\nCaptured accessibility snapshot of the page.",
          },
        ],
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "take-snapshot.errors.validation.title",
      description: "take-snapshot.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "take-snapshot.errors.network.title",
      description: "take-snapshot.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "take-snapshot.errors.unauthorized.title",
      description: "take-snapshot.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "take-snapshot.errors.forbidden.title",
      description: "take-snapshot.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "take-snapshot.errors.notFound.title",
      description: "take-snapshot.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "take-snapshot.errors.serverError.title",
      description: "take-snapshot.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "take-snapshot.errors.unknown.title",
      description: "take-snapshot.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "take-snapshot.errors.unsavedChanges.title",
      description: "take-snapshot.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "take-snapshot.errors.conflict.title",
      description: "take-snapshot.errors.conflict.description",
    },
  },
  successTypes: {
    title: "take-snapshot.success.title",
    description: "take-snapshot.success.description",
  },
});

export type TakeSnapshotRequestInput = typeof POST.types.RequestInput;
export type TakeSnapshotRequestOutput = typeof POST.types.RequestOutput;
export type TakeSnapshotResponseInput = typeof POST.types.ResponseInput;
export type TakeSnapshotResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
