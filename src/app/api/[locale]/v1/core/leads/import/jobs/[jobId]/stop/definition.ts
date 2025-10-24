/**
 * Import Job Stop Action API Definition
 * Stops a running import job
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
  requestUrlParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Stop Import Job Endpoint (POST)
 * Stops a running import job
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "import", "jobs", ":jobId", "stop"],
  title: "app.api.v1.core.leads.import.jobs.jobId.stop.post.title",
  description: "app.api.v1.core.leads.import.jobs.jobId.stop.post.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.leads",
    "app.api.v1.core.leads.tags.management",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.import.jobs.jobId.stop.post.form.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.form.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "urlParams", response: true },
    {
      // === URL PARAMETERS ===
      jobId: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.import.jobs.jobId.stop.post.jobId.label",
          description:
            "app.api.v1.core.leads.import.jobs.jobId.stop.post.jobId.description",
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
            "app.api.v1.core.leads.import.jobs.jobId.stop.post.response.title",
          description:
            "app.api.v1.core.leads.import.jobs.jobId.stop.post.response.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.import.jobs.jobId.stop.post.response.success.content",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.leads.import.jobs.jobId.stop.post.response.message.content",
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
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.validation.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.notFound.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.server.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unknown.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.network.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.conflict.title",
      description:
        "app.api.v1.core.leads.import.jobs.jobId.stop.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.import.jobs.jobId.stop.post.success.title",
    description:
      "app.api.v1.core.leads.import.jobs.jobId.stop.post.success.description",
  },

  examples: {
    urlPathVariables: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: undefined,
    responses: {
      default: {
        result: { success: true, message: "Job stopped successfully" },
      },
    },
  },
});

// Export types following modern pattern
export type ImportJobStopPostRequestInput = typeof POST.types.RequestInput;
export type ImportJobStopPostRequestOutput = typeof POST.types.RequestOutput;
export type ImportJobStopPostResponseInput = typeof POST.types.ResponseInput;
export type ImportJobStopPostResponseOutput = typeof POST.types.ResponseOutput;

// Repository types for standardized import patterns
export type ImportJobStopRequestInput = ImportJobStopPostRequestInput;
export type ImportJobStopRequestOutput = ImportJobStopPostRequestOutput;
export type ImportJobStopResponseInput = ImportJobStopPostResponseInput;
export type ImportJobStopResponseOutput = ImportJobStopPostResponseOutput;

/**
 * Export definitions
 */
export { POST };

const definitions = {
  POST,
} as const;

export default definitions;
