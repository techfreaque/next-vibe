/**
 * SelectPage Tool - Definition
 * Select a page as a context for future tool calls
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
  path: ["browser", "select-page"],
  title: "select-page.title",
  description: "select-page.description",
  category: "select-page.category",
  icon: "square-check",
  tags: [
    "select-page.tags.browserAutomation",
    "select-page.tags.navigationAutomation",
  ],

  allowedRoles: [
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "select-page.form.label",
    description: "select-page.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      pageIdx: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "select-page.form.fields.pageIdx.label",
        description: "select-page.form.fields.pageIdx.description",
        placeholder: "select-page.form.fields.pageIdx.placeholder",
        columns: 6,
        schema: z
          .number()
          .describe(
            "The index of the page to select. Call list_pages to list pages.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "select-page.response.success",
        schema: z
          .boolean()
          .describe("Whether the page selection operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "select-page.response.result",
        schema: z
          .object({
            selected: z.boolean().describe("Whether the page was selected"),
            pageIdx: z.coerce.number().describe("Index of the selected page"),
            title: z.string().optional().describe("Title of the selected page"),
            url: z.string().optional().describe("URL of the selected page"),
          })
          .optional()
          .describe("Result of page selection"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "select-page.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "select-page.response.executionId",
        schema: z
          .string()
          .optional()
          .describe("Unique identifier for this execution"),
      }),
    },
  }),
  examples: {
    requests: {
      default: { pageIdx: 0 },
    },
    responses: {
      default: {
        success: true,
        result: {
          selected: true,
          pageIdx: 0,
          title: "Example Page",
          url: "https://example.com",
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "select-page.errors.validation.title",
      description: "select-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "select-page.errors.network.title",
      description: "select-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "select-page.errors.unauthorized.title",
      description: "select-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "select-page.errors.forbidden.title",
      description: "select-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "select-page.errors.notFound.title",
      description: "select-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "select-page.errors.serverError.title",
      description: "select-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "select-page.errors.unknown.title",
      description: "select-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "select-page.errors.unsavedChanges.title",
      description: "select-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "select-page.errors.conflict.title",
      description: "select-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "select-page.success.title",
    description: "select-page.success.description",
  },
});

export type SelectPageRequestInput = typeof POST.types.RequestInput;
export type SelectPageRequestOutput = typeof POST.types.RequestOutput;
export type SelectPageResponseInput = typeof POST.types.ResponseInput;
export type SelectPageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
