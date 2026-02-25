/**
 * NewPage Tool - Definition
 * Creates a new page
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
  path: ["browser", "new-page"],
  title: "new-page.title",
  description: "new-page.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "file-plus",
  tags: [
    "new-page.tags.browserAutomation",
    "new-page.tags.navigationAutomation",
  ],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "new-page.form.label",
    description: "new-page.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      url: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "new-page.form.fields.url.label",
        description: "new-page.form.fields.url.description",
        placeholder: "new-page.form.fields.url.placeholder",
        columns: 8,
        schema: z.string().describe("URL to load in a new page"),
      }),
      timeout: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "new-page.form.fields.timeout.label",
        description: "new-page.form.fields.timeout.description",
        placeholder: "new-page.form.fields.timeout.placeholder",
        columns: 4,
        schema: z
          .number()
          .optional()
          .describe(
            "Maximum wait time in milliseconds. If set to 0, the default timeout will be used.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "new-page.response.success",
        schema: z
          .boolean()
          .describe("Whether the new page creation operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "new-page.response.result",
        schema: z
          .object({
            created: z.boolean().describe("Whether the new page was created"),
            pageIdx: z.coerce.number().describe("Index of the new page"),
            url: z.string().describe("URL of the new page"),
          })
          .optional()
          .describe("Result of new page creation"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "new-page.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "new-page.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { url: "https://example.com" },
    },
    responses: {
      default: {
        success: true,
        result: {
          created: true,
          pageIdx: 0,
          url: "https://example.com",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "new-page.errors.validation.title",
      description: "new-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "new-page.errors.network.title",
      description: "new-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "new-page.errors.unauthorized.title",
      description: "new-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "new-page.errors.forbidden.title",
      description: "new-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "new-page.errors.notFound.title",
      description: "new-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "new-page.errors.serverError.title",
      description: "new-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "new-page.errors.unknown.title",
      description: "new-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "new-page.errors.unsavedChanges.title",
      description: "new-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "new-page.errors.conflict.title",
      description: "new-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "new-page.success.title",
    description: "new-page.success.description",
  },
});

export type NewPageRequestInput = typeof POST.types.RequestInput;
export type NewPageRequestOutput = typeof POST.types.RequestOutput;
export type NewPageResponseInput = typeof POST.types.ResponseInput;
export type NewPageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
