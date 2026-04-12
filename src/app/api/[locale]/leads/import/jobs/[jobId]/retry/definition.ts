/**
 * Import Job Retry Action API Definition
 * Retries a failed import job
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestUrlPathParamsField,
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

import { ImportJobRetryContainer } from "../widget";
import { scopedTranslation } from "./i18n";

/**
 * Retry Import Job Endpoint (POST)
 * Retries a failed import job
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "import", "jobs", ":jobId", "retry"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsImport",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "rotate-ccw",

  fields: customWidgetObject({
    render: ImportJobRetryContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.jobId.label",
        description: "post.jobId.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.success.content",
            schema: z.boolean(),
          }),
          message: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.message.content",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        result: { success: true, message: "Job retried successfully" },
      },
    },
  },
});

// Export types following modern pattern
export type ImportJobRetryPostRequestInput = typeof POST.types.RequestInput;
export type ImportJobRetryPostRequestOutput = typeof POST.types.RequestOutput;
export type ImportJobRetryPostResponseInput = typeof POST.types.ResponseInput;
export type ImportJobRetryPostResponseOutput = typeof POST.types.ResponseOutput;
export type ImportJobRetryPostUrlParamsTypeOutput =
  typeof POST.types.UrlVariablesOutput;

// Repository types for standardized import patterns
export type ImportJobRetryRequestInput = ImportJobRetryPostRequestInput;
export type ImportJobRetryRequestOutput = ImportJobRetryPostRequestOutput;
export type ImportJobRetryResponseInput = ImportJobRetryPostResponseInput;
export type ImportJobRetryResponseOutput = ImportJobRetryPostResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
} as const;

export default definitions;
