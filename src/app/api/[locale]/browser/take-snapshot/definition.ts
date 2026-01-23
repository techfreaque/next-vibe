/**
 * TakeSnapshot Tool - Definition
 * Take a text snapshot of the currently selected page based on the a11y tree
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
  path: ["browser", "take-snapshot"],
  title: "app.api.browser.take-snapshot.title",
  description: "app.api.browser.take-snapshot.description",
  category: "app.api.browser.category",
  icon: "file-text",
  tags: [
    "app.api.browser.tags.browserAutomation",
    "app.api.browser.tags.captureAutomation",
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
      title: "app.api.browser.take-snapshot.form.label",
      description: "app.api.browser.take-snapshot.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.browser.take-snapshot.form.fields.verbose.label",
        description:
          "app.api.browser.take-snapshot.form.fields.verbose.description",
        placeholder:
          "app.api.browser.take-snapshot.form.fields.verbose.placeholder",
        columns: 6,
        schema: z
          .boolean()
          .optional()
          .describe(
            "Whether to include all possible information available in the full a11y tree. Default is false.",
          ),
      }),
      filePath: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.browser.take-snapshot.form.fields.filePath.label",
        description:
          "app.api.browser.take-snapshot.form.fields.filePath.description",
        placeholder:
          "app.api.browser.take-snapshot.form.fields.filePath.placeholder",
        columns: 6,
        schema: z
          .string()
          .optional()
          .describe(
            "The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response.",
          ),
      }),

      // Response fields
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.take-snapshot.response.success",
        schema: z
          .boolean()
          .describe("Whether the snapshot capture operation succeeded"),
      }),
      result: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.take-snapshot.response.result",
        schema: z
          .object({
            captured: z.boolean().describe("Whether the snapshot was captured"),
            elementCount: z
              .number()
              .optional()
              .describe("Number of elements in the snapshot"),
            filePath: z
              .string()
              .optional()
              .describe("Path where snapshot was saved"),
            data: z.string().optional().describe("The snapshot data"),
          })
          .optional()
          .describe("Result of snapshot capture"),
      }),
      error: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.take-snapshot.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.browser.take-snapshot.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  ),
  examples: {
    requests: {
      default: { filePath: "/path/to/file.txt" },
    },
    responses: {
      default: {
        success: true,
        result: {
          captured: true,
          elementCount: 42,
          filePath: "/path/to/file.txt",
          data: "Snapshot data content",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.browser.take-snapshot.errors.validation.title",
      description:
        "app.api.browser.take-snapshot.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.browser.take-snapshot.errors.network.title",
      description: "app.api.browser.take-snapshot.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.browser.take-snapshot.errors.unauthorized.title",
      description:
        "app.api.browser.take-snapshot.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.browser.take-snapshot.errors.forbidden.title",
      description: "app.api.browser.take-snapshot.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.browser.take-snapshot.errors.notFound.title",
      description: "app.api.browser.take-snapshot.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.browser.take-snapshot.errors.serverError.title",
      description:
        "app.api.browser.take-snapshot.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.browser.take-snapshot.errors.unknown.title",
      description: "app.api.browser.take-snapshot.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.browser.take-snapshot.errors.unsavedChanges.title",
      description:
        "app.api.browser.take-snapshot.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.browser.take-snapshot.errors.conflict.title",
      description: "app.api.browser.take-snapshot.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.browser.take-snapshot.success.title",
    description: "app.api.browser.take-snapshot.success.description",
  },
});

export type TakeSnapshotRequestInput = typeof POST.types.RequestInput;
export type TakeSnapshotRequestOutput = typeof POST.types.RequestOutput;
export type TakeSnapshotResponseInput = typeof POST.types.ResponseInput;
export type TakeSnapshotResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
