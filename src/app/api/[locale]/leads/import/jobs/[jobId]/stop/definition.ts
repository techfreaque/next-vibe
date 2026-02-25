/**
 * Import Job Stop Action API Definition
 * Stops a running import job
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestUrlPathParamsField,
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

import { ImportJobStopContainer } from "../widget";
import { scopedTranslation } from "./i18n";

/**
 * Stop Import Job Endpoint (POST)
 * Stops a running import job
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "import", "jobs", ":jobId", "stop"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "x-circle",

  fields: customWidgetObject({
    render: ImportJobStopContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),

      // === URL PARAMETERS ===
      jobId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.jobId.label",
        description: "post.jobId.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      result: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.title",
        description: "post.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: scopedResponseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.success.content",
            schema: z.boolean(),
          }),
          message: scopedResponseField(scopedTranslation, {
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
