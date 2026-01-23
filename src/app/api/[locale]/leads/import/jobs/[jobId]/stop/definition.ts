/**
 * Import Job Stop Action API Definition
 * Stops a running import job
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestUrlPathParamsField,
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

/**
 * Stop Import Job Endpoint (POST)
 * Stops a running import job
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["leads", "import", "jobs", ":jobId", "stop"],
  title: "app.api.leads.import.jobs.jobId.stop.post.title",
  description: "app.api.leads.import.jobs.jobId.stop.post.description",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "x-circle",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.import.jobs.jobId.stop.post.form.title",
      description: "app.api.leads.import.jobs.jobId.stop.post.form.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.leads.import.jobs.jobId.stop.post.jobId.label",
        description:
          "app.api.leads.import.jobs.jobId.stop.post.jobId.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.jobs.jobId.stop.post.response.title",
          description:
            "app.api.leads.import.jobs.jobId.stop.post.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.leads.import.jobs.jobId.stop.post.response.success.content",
            schema: z.boolean(),
          }),
          message: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.leads.import.jobs.jobId.stop.post.response.message.content",
            schema: z.string(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.leads.import.jobs.jobId.stop.post.errors.validation.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.leads.import.jobs.jobId.stop.post.errors.unauthorized.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.forbidden.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.notFound.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.server.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.unknown.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.network.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.leads.import.jobs.jobId.stop.post.errors.unsavedChanges.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.jobs.jobId.stop.post.errors.conflict.title",
      description:
        "app.api.leads.import.jobs.jobId.stop.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.import.jobs.jobId.stop.post.success.title",
    description:
      "app.api.leads.import.jobs.jobId.stop.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
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

const definitions = {
  POST,
} as const;

export default definitions;
