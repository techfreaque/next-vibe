/**
 * Import Job Management API Definition
 * Individual job operations (update, delete)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

import { CsvImportJobStatus } from "../../enum";

/**
 * Update Import Job Endpoint (PATCH)
 * Updates job configuration settings
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["leads", "import", "jobs", ":jobId"],
  title: "app.api.leads.import.jobs.jobId.patch.title",
  description: "app.api.leads.import.jobs.jobId.patch.description",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "upload",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.import.jobs.jobId.patch.form.title",
      description: "app.api.leads.import.jobs.jobId.patch.form.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.leads.import.jobs.jobId.patch.jobId.label",
          description:
            "app.api.leads.import.jobs.jobId.patch.jobId.description",
          columns: 12,
        },
        z.uuid(),
      ),

      // === REQUEST FIELDS ===
      settings: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.jobs.jobId.patch.settings.title",
          description:
            "app.api.leads.import.jobs.jobId.patch.settings.description",
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          batchSize: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.leads.import.jobs.jobId.patch.batchSize.label",
              description:
                "app.api.leads.import.jobs.jobId.patch.batchSize.description",
              placeholder:
                "app.api.leads.import.jobs.jobId.patch.batchSize.placeholder",
              columns: 6,
            },
            z.coerce.number().min(10).max(1000).optional(),
          ),
          maxRetries: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.leads.import.jobs.jobId.patch.maxRetries.label",
              description:
                "app.api.leads.import.jobs.jobId.patch.maxRetries.description",
              placeholder:
                "app.api.leads.import.jobs.jobId.patch.maxRetries.placeholder",
              columns: 6,
            },
            z.coerce.number().min(0).max(10).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      job: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.jobs.jobId.patch.response.title",
          description:
            "app.api.leads.import.jobs.jobId.patch.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          info: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.import.jobs.jobId.patch.response.info.title",
              description:
                "app.api.leads.import.jobs.jobId.patch.response.info.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              id: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.id.content",
                },
                z.uuid(),
              ),
              fileName: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.fileName.content",
                },
                z.string(),
              ),
              status: responseField(
                {
                  type: WidgetType.BADGE,
                  text: "app.api.leads.import.jobs.jobId.patch.response.status.content",
                },
                z.enum(CsvImportJobStatus),
              ),
            },
          ),

          progress: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.import.jobs.jobId.patch.response.progress.title",
              description:
                "app.api.leads.import.jobs.jobId.patch.response.progress.description",
              layoutType: LayoutType.GRID,
              columns: 3,
            },
            { response: true },
            {
              totalRows: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.totalRows.content",
                },
                z.coerce.number().nullable(),
              ),
              processedRows: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.processedRows.content",
                },
                z.coerce.number(),
              ),
              successfulImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.successfulImports.content",
                },
                z.coerce.number(),
              ),
              failedImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.failedImports.content",
                },
                z.coerce.number(),
              ),
              duplicateEmails: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.duplicateEmails.content",
                },
                z.coerce.number(),
              ),
            },
          ),

          configuration: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.import.jobs.jobId.patch.response.configuration.title",
              description:
                "app.api.leads.import.jobs.jobId.patch.response.configuration.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              currentBatchStart: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.currentBatchStart.content",
                },
                z.coerce.number(),
              ),
              batchSize: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.batchSize.content",
                },
                z.coerce.number(),
              ),
              retryCount: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.retryCount.content",
                },
                z.coerce.number(),
              ),
              maxRetries: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.maxRetries.content",
                },
                z.coerce.number(),
              ),
              error: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.error.content",
                },
                z.string().nullable(),
              ),
            },
          ),

          timestamps: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.leads.import.jobs.jobId.patch.response.timestamps.title",
              description:
                "app.api.leads.import.jobs.jobId.patch.response.timestamps.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              createdAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.createdAt.content",
                },
                z.string(),
              ),
              updatedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.updatedAt.content",
                },
                z.string(),
              ),
              startedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.startedAt.content",
                },
                z.string().nullable(),
              ),
              completedAt: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.jobs.jobId.patch.response.completedAt.content",
                },
                z.string().nullable(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.validation.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.unauthorized.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.forbidden.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.notFound.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.server.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.unknown.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.network.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.leads.import.jobs.jobId.patch.errors.unsavedChanges.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.jobs.jobId.patch.errors.conflict.title",
      description:
        "app.api.leads.import.jobs.jobId.patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.import.jobs.jobId.patch.success.title",
    description: "app.api.leads.import.jobs.jobId.patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: { settings: { batchSize: 100, maxRetries: 3 } },
    },
    responses: {
      default: {
        job: {
          info: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            fileName: "app.api.leads.csv",
            status: CsvImportJobStatus.PROCESSING,
          },
          progress: {
            totalRows: 1000,
            processedRows: 500,
            successfulImports: 480,
            failedImports: 20,
            duplicateEmails: 5,
          },
          configuration: {
            currentBatchStart: 500,
            batchSize: 100,
            retryCount: 0,
            maxRetries: 3,
            error: null,
          },
          timestamps: {
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:05:00Z",
            startedAt: "2024-01-01T00:00:00Z",
            completedAt: null,
          },
        },
      },
    },
  },
});

/**
 * Delete Import Job Endpoint (DELETE)
 * Deletes a specific import job
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["leads", "import", "jobs", ":jobId"],
  title: "app.api.leads.import.jobs.jobId.delete.title",
  description: "app.api.leads.import.jobs.jobId.delete.description",
  category: "app.api.leads.category",
  tags: ["app.api.leads.tags.leads", "app.api.leads.tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "upload",

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.import.jobs.jobId.delete.form.title",
      description: "app.api.leads.import.jobs.jobId.delete.form.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.leads.import.jobs.jobId.delete.jobId.label",
          description:
            "app.api.leads.import.jobs.jobId.delete.jobId.description",
          columns: 12,
        },
        z.uuid(),
      ),

      // === RESPONSE FIELDS ===
      result: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.jobs.jobId.delete.response.title",
          description:
            "app.api.leads.import.jobs.jobId.delete.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.leads.import.jobs.jobId.delete.response.success.content",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.leads.import.jobs.jobId.delete.response.message.content",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.validation.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.unauthorized.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.forbidden.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.notFound.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.server.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.unknown.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.network.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.leads.import.jobs.jobId.delete.errors.unsavedChanges.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.jobs.jobId.delete.errors.conflict.title",
      description:
        "app.api.leads.import.jobs.jobId.delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.import.jobs.jobId.delete.success.title",
    description: "app.api.leads.import.jobs.jobId.delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: undefined,
    responses: {
      default: {
        result: { success: true, message: "Job deleted successfully" },
      },
    },
  },
});

// Export types following modern pattern
export type ImportJobPatchRequestInput = typeof PATCH.types.RequestInput;
export type ImportJobPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ImportJobPatchResponseInput = typeof PATCH.types.ResponseInput;
export type ImportJobPatchResponseOutput = typeof PATCH.types.ResponseOutput;

export type ImportJobDeleteRequestInput = typeof DELETE.types.RequestInput;
export type ImportJobDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type ImportJobDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type ImportJobDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

// Repository types for standardized import patterns
export type ImportJobUpdateRequestInput = ImportJobPatchRequestInput;
export type ImportJobUpdateRequestOutput = ImportJobPatchRequestOutput;
export type ImportJobUpdateResponseInput = ImportJobPatchResponseInput;
export type ImportJobUpdateResponseOutput = ImportJobPatchResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  PATCH,
  DELETE,
} as const;

export default definitions;
