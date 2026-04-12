/**
 * Import Job Management API Definition
 * Individual job operations (get, update, delete)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
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
import { scopedTranslation } from "./i18n";
import { ImportJobStatusContainer } from "./widget";

/**
 * Get Import Job Status Endpoint (GET)
 * Retrieves current status and progress of a specific import job
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "import", "jobs", ":jobId"],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsImport",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "activity",

  fields: customWidgetObject({
    render: ImportJobStatusContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.jobId.label",
        description: "get.jobId.description",
        columns: 12,
        hidden: true,
        schema: z.uuid(),
      }),

      // Navigation back
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === RESPONSE FIELDS ===
      job: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.title",
        description: "get.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          info: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.info.title",
            description: "get.response.info.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.id.content",
                schema: z.uuid(),
              }),
              fileName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.fileName.content",
                schema: z.string(),
              }),
              status: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "get.response.status.content",
                schema: z.enum(CsvImportJobStatus),
              }),
            },
          }),

          progress: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.progress.title",
            description: "get.response.progress.description",
            layoutType: LayoutType.GRID,
            columns: 3,
            usage: { response: true },
            children: {
              totalRows: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.totalRows.content",
                schema: z.coerce.number().nullable(),
              }),
              processedRows: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.processedRows.content",
                schema: z.coerce.number(),
              }),
              successfulImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.successfulImports.content",
                schema: z.coerce.number(),
              }),
              failedImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.failedImports.content",
                schema: z.coerce.number(),
              }),
              duplicateEmails: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.duplicateEmails.content",
                schema: z.coerce.number(),
              }),
            },
          }),

          configuration: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.configuration.title",
            description: "get.response.configuration.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              currentBatchStart: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.currentBatchStart.content",
                schema: z.coerce.number(),
              }),
              batchSize: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.batchSize.content",
                schema: z.coerce.number(),
              }),
              retryCount: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.retryCount.content",
                schema: z.coerce.number(),
              }),
              maxRetries: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.maxRetries.content",
                schema: z.coerce.number(),
              }),
              error: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.error.content",
                schema: z.string().nullable(),
              }),
            },
          }),

          timestamps: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "get.response.timestamps.title",
            description: "get.response.timestamps.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              createdAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.createdAt.content",
                schema: z.string(),
              }),
              updatedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.updatedAt.content",
                schema: z.string(),
              }),
              startedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.startedAt.content",
                schema: z.string().nullable(),
              }),
              completedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.completedAt.content",
                schema: z.string().nullable(),
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        job: {
          info: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            fileName: "leads.csv",
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
 * Update Import Job Endpoint (PATCH)
 * Updates job configuration settings
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "import", "jobs", ":jobId"],
  title: "patch.title",
  description: "patch.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsImport",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "upload",

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.form.title",
    description: "patch.form.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.jobId.label",
        description: "patch.jobId.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === REQUEST FIELDS ===
      settings: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.settings.title",
        description: "patch.settings.description",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          batchSize: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "patch.batchSize.label",
            description: "patch.batchSize.description",
            placeholder: "patch.batchSize.placeholder",
            columns: 6,
            schema: z.coerce.number().min(10).max(1000).optional(),
          }),
          maxRetries: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "patch.maxRetries.label",
            description: "patch.maxRetries.description",
            placeholder: "patch.maxRetries.placeholder",
            columns: 6,
            schema: z.coerce.number().min(0).max(10).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      job: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title",
        description: "patch.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          info: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.info.title",
            description: "patch.response.info.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              id: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.id.content",
                schema: z.uuid(),
              }),
              fileName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.fileName.content",
                schema: z.string(),
              }),
              status: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "patch.response.status.content",
                schema: z.enum(CsvImportJobStatus),
              }),
            },
          }),

          progress: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.progress.title",
            description: "patch.response.progress.description",
            layoutType: LayoutType.GRID,
            columns: 3,
            usage: { response: true },
            children: {
              totalRows: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.totalRows.content",
                schema: z.coerce.number().nullable(),
              }),
              processedRows: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.processedRows.content",
                schema: z.coerce.number(),
              }),
              successfulImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.successfulImports.content",
                schema: z.coerce.number(),
              }),
              failedImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.failedImports.content",
                schema: z.coerce.number(),
              }),
              duplicateEmails: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.duplicateEmails.content",
                schema: z.coerce.number(),
              }),
            },
          }),

          configuration: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.configuration.title",
            description: "patch.response.configuration.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              currentBatchStart: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.currentBatchStart.content",
                schema: z.coerce.number(),
              }),
              batchSize: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.batchSize.content",
                schema: z.coerce.number(),
              }),
              retryCount: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.retryCount.content",
                schema: z.coerce.number(),
              }),
              maxRetries: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.maxRetries.content",
                schema: z.coerce.number(),
              }),
              error: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.error.content",
                schema: z.string().nullable(),
              }),
            },
          }),

          timestamps: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.timestamps.title",
            description: "patch.response.timestamps.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              createdAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.createdAt.content",
                schema: z.string(),
              }),
              updatedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.updatedAt.content",
                schema: z.string(),
              }),
              startedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.startedAt.content",
                schema: z.string().nullable(),
              }),
              completedAt: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "patch.response.completedAt.content",
                schema: z.string().nullable(),
              }),
            },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
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
            fileName: "csv",
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
  scopedTranslation,
  method: Methods.DELETE,
  path: ["leads", "import", "jobs", ":jobId"],
  title: "delete.title",
  description: "delete.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsImport",
  tags: ["tags.leads", "tags.management"],
  allowedRoles: [UserRole.ADMIN],
  icon: "upload",

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.form.title",
    description: "delete.form.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      jobId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.jobId.label",
        description: "delete.jobId.description",
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE FIELDS ===
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "delete.response.title",
        description: "delete.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.success.content",
            schema: z.boolean(),
          }),
          message: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.message.content",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { jobId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        result: { success: true, message: "Job deleted successfully" },
      },
    },
  },
});

// Export types following modern pattern
export type ImportJobGetRequestInput = typeof GET.types.RequestInput;
export type ImportJobGetRequestOutput = typeof GET.types.RequestOutput;
export type ImportJobGetResponseInput = typeof GET.types.ResponseInput;
export type ImportJobGetResponseOutput = typeof GET.types.ResponseOutput;

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
  GET,
  PATCH,
  DELETE,
} as const;

export default definitions;
