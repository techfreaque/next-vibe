/**
 * Import Job Management API Definition
 * Individual job operations (update, delete)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { TranslationKey } from "@/i18n/core/static-types";

import { UserRole } from "../../../../user/user-roles/enum";
import { CsvImportJobStatus } from "../../enum";

// Job update schema (PATCH)
const jobUpdateSchema = z.object({
  batchSize: z.number().min(10).max(1000).optional(),
  maxRetries: z.number().min(0).max(10).optional(),
});

// Job response schema
const importJobSchema = z.object({
  id: z.uuid(),
  fileName: z.string(),
  status: z.string(),
  totalRows: z.number().nullable(),
  processedRows: z.number(),
  successfulImports: z.number(),
  failedImports: z.number(),
  duplicateEmails: z.number(),
  currentBatchStart: z.number(),
  batchSize: z.number(),
  error: z.string().nullable(),
  retryCount: z.number(),
  maxRetries: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});

// Update job endpoint (PATCH)
const updateJobEndpoint = createEndpoint({
  description: "Update import job settings",
  method: Methods.PATCH,
  requestSchema: jobUpdateSchema,
  responseSchema: importJobSchema,
  requestUrlSchema: z.object({
    jobId: z.uuid(),
  }),
  apiQueryOptions: {
    queryKey: ["import-jobs"],
  },
  fieldDescriptions: {
    jobId: "ID of the import job to update",
    batchSize: "Number of records to process in each batch",
    maxRetries: "Maximum number of retry attempts for failed batches",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    unauthorized: {
      title: "leadsErrors.leadsImport.patch.error.unauthorized.title",
      description:
        "leadsErrors.leadsImport.patch.error.unauthorized.description",
    },
    forbidden: {
      title: "leadsErrors.leadsImport.patch.error.forbidden.title",
      description: "leadsErrors.leadsImport.patch.error.forbidden.description",
    },
    not_found: {
      title: "leadsErrors.leadsImport.patch.error.not_found.title",
      description: "leadsErrors.leadsImport.patch.error.not_found.description",
    },
    validation_failed: {
      title: "leadsErrors.leadsImport.patch.error.validation.title",
      description: "leadsErrors.leadsImport.patch.error.validation.description",
    },
    server_error: {
      title: "leadsErrors.leadsImport.patch.error.server.title",
      description: "leadsErrors.leadsImport.patch.error.server.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsImport.patch.success.title",
    description: "leadsErrors.leadsImport.patch.success.description",
  },
  path: ["v1", "leads", "import", "jobs", "[jobId]"],
  examples: {
    urlPathVariables: {
      default: {
        jobId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        batchSize: 100,
        maxRetries: 3,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        fileName: "leads.csv",
        status: CsvImportJobStatus.PROCESSING,
        totalRows: 1000,
        processedRows: 500,
        successfulImports: 480,
        failedImports: 20,
        duplicateEmails: 0,
        currentBatchStart: 500,
        batchSize: 100,
        error: null,
        retryCount: 0,
        maxRetries: 3,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:30:00Z",
        startedAt: "2024-01-01T00:00:00Z",
        completedAt: null,
      },
    },
  },
});

// Delete job endpoint (DELETE)
const deleteJobEndpoint = createEndpoint({
  description: "Delete import job",
  method: Methods.DELETE,
  requestSchema: z.object({}),
  responseSchema: z.object({
    success: z.boolean(),
    message: z.string() as z.ZodType<TranslationKey>,
  }),
  requestUrlSchema: z.object({
    jobId: z.uuid(),
  }),
  apiQueryOptions: {
    queryKey: ["import-jobs"],
  },
  fieldDescriptions: {
    jobId: "ID of the import job to delete",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    unauthorized: {
      title: "leadsErrors.leadsImport.delete.error.unauthorized.title",
      description:
        "leadsErrors.leadsImport.delete.error.unauthorized.description",
    },
    forbidden: {
      title: "leadsErrors.leadsImport.delete.error.forbidden.title",
      description: "leadsErrors.leadsImport.delete.error.forbidden.description",
    },
    not_found: {
      title: "leadsErrors.leadsImport.delete.error.not_found.title",
      description: "leadsErrors.leadsImport.delete.error.not_found.description",
    },
    server_error: {
      title: "leadsErrors.leadsImport.delete.error.server.title",
      description: "leadsErrors.leadsImport.delete.error.server.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsImport.delete.success.title",
    description: "leadsErrors.leadsImport.delete.success.description",
  },
  path: ["v1", "leads", "import", "jobs", "[jobId]"],
  examples: {
    urlPathVariables: {
      default: {
        jobId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {},
    },
    responses: {
      default: {
        success: true,
        message: "leadsErrors.leadsImport.delete.success.description",
      },
    },
  },
});

const definitions = {
  PATCH: updateJobEndpoint.PATCH,
  DELETE: deleteJobEndpoint.DELETE,
} as const;

export default definitions;

export type ImportJobUpdateResponseType = z.infer<
  typeof updateJobEndpoint.PATCH.responseSchema
>;

export type ImportJobDeleteResponseType = z.infer<
  typeof deleteJobEndpoint.DELETE.responseSchema
>;
