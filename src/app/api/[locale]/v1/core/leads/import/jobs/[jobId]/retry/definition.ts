/**
 * Import Job Retry Action API Definition
 * Retries a failed import job
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Retry Import Job Endpoint (POST)
 * Retries a failed import job
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "import", "jobs", ":jobId", "retry"],
  title: "app.api.v1.core.leads.import.jobs.jobId.retry.post.title",
  description: "app.api.v1.core.leads.import.jobs.jobId.retry.post.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.leads",
    "app.api.v1.core.leads.tags.management",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.import.jobs.jobId.retry.post.form.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.form.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.import.jobs.jobId.retry.post.jobId.label",
          description:
            "app.api.v1.core.leads.import.jobs.jobId.retry.post.jobId.description",
          layout: { columns: 12 },
          validation: { required: true },
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.leads.import.jobs.jobId.retry.post.response.title",
          description:
            "app.api.v1.core.leads.import.jobs.jobId.retry.post.response.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.import.jobs.jobId.retry.post.response.success.content",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.import.jobs.jobId.retry.post.response.message.content",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.validation.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.notFound.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.server.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unknown.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.network.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.conflict.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.retry.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.import.jobs.jobId.retry.post.success.title",
    description:
      "app.api.v1.core.leads.import.jobs.jobId.retry.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: undefined,
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
export { POST };

const definitions = {
  POST,
};

export default definitions;
