/**
 * ClosePage Tool - Definition
 * Closes the page by its index. The last open page cannot be closed
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
  path: ["browser", "close-page"],
  title: "close-page.title",
  description: "close-page.description",
  category: "app.endpointCategories.browserAutomation",
  icon: "x-square",
  tags: ["close-page.tags.browserAutomation", "close-page.tags.chromeDevTools"],

  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "close-page.form.label",
    description: "close-page.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      pageIdx: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "close-page.form.fields.pageIdx.label",
        description: "close-page.form.fields.pageIdx.description",
        placeholder: "close-page.form.fields.pageIdx.placeholder",
        columns: 6,
        schema: z
          .number()
          .describe(
            "The index of the page to close. Call list_pages to list pages.",
          ),
      }),

      // Response fields
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "close-page.response.success",
        schema: z
          .boolean()
          .describe("Whether the page close operation succeeded"),
      }),
      result: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "close-page.response.result",
        schema: z
          .object({
            closed: z.boolean().describe("Whether the page was closed"),
            remainingPages: z
              .number()
              .optional()
              .describe("Number of remaining open pages"),
          })
          .optional()
          .describe("Result of the close page operation"),
      }),
      error: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "close-page.response.error",
        schema: z
          .string()
          .optional()
          .describe("Error message if the operation failed"),
      }),
      executionId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "close-page.response.executionId",
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
        pageIdx: 0,
      },
    },
    responses: {
      default: {
        success: true,
        result: {
          closed: true,
          remainingPages: 2,
        },
        executionId: "exec_123",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "close-page.errors.validation.title",
      description: "close-page.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "close-page.errors.network.title",
      description: "close-page.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "close-page.errors.unauthorized.title",
      description: "close-page.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "close-page.errors.forbidden.title",
      description: "close-page.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "close-page.errors.notFound.title",
      description: "close-page.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "close-page.errors.serverError.title",
      description: "close-page.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "close-page.errors.unknown.title",
      description: "close-page.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "close-page.errors.unsavedChanges.title",
      description: "close-page.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "close-page.errors.conflict.title",
      description: "close-page.errors.conflict.description",
    },
  },
  successTypes: {
    title: "close-page.success.title",
    description: "close-page.success.description",
  },
});

export type ClosePageRequestInput = typeof POST.types.RequestInput;
export type ClosePageRequestOutput = typeof POST.types.RequestOutput;
export type ClosePageResponseInput = typeof POST.types.ResponseInput;
export type ClosePageResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
