/**
 * Import Jobs Management API Definition
 * Comprehensive CRUD operations for import jobs
 */

import { z } from "zod";

import { undefinedSchema } from "next-vibe/shared/types/common.schema";

import { createEndpoint } from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  EndpointErrorTypes,
  Methods,
} from "../../../system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "../../../user/user-roles/enum";
import { CsvImportJobStatus } from "../enum";

// Job update and action schemas moved to separate endpoints

/**
 * List Import Jobs Endpoint (GET)
 */
const listImportJobsEndpoint = createEndpoint({
  path: ["v1", "leads", "import", "status"],
  method: Methods.GET,
  requestSchema: z.object({
    status: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(50).optional(),
    offset: z.coerce.number().min(0).default(0).optional(),
  }),
  responseSchema: z.array(
    z.object({
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
    }),
  ),
  requestUrlSchema: undefinedSchema,
  allowedRoles: [UserRole.ADMIN],
  ui: {
    title: "leadsErrors.leadsImport.get.title",
    description: "leadsErrors.leadsImport.get.description",
    category: "leads",
    version: "1.0",
    tags: ["leads", "import", "jobs", "list"],
    autoInferUI: true,
    enableBuiltInActions: true,
    crossPlatformCompatible: true,
    caching: {
      strategy: "aggressive",
      ttl: 5 * 60 * 1000, // 5 minutes
      invalidateOn: ["leads-import-jobs-updated"],
    },
    request: [
      {
        type: "form",
        title: "leadsErrors.leadsImport.get.form.title",
        description: "leadsErrors.leadsImport.get.form.description",
        layout: {
          type: "horizontal",
          columns: 2,
          spacing: "compact",
        },
        behavior: {
          searchable: false,
          filterable: false,
        },
        fields: ["status", "limit", "offset"],
      },
    ],

    successTypes: {
      title: "leadsErrors.leadsImport.get.success.title",
      description: "leadsErrors.leadsImport.get.success.description",
    },

    errorTypes: {
      [EndpointErrorTypes.VALIDATION_FAILED]: {
        title: "leadsErrors.leadsImport.get.error.validation.title",
        description: "leadsErrors.leadsImport.get.error.validation.description",
      },
      [EndpointErrorTypes.UNAUTHORIZED]: {
        title: "leadsErrors.leadsImport.get.error.unauthorized.title",
        description:
          "leadsErrors.leadsImport.get.error.unauthorized.description",
      },
      [EndpointErrorTypes.SERVER_ERROR]: {
        title: "leadsErrors.leadsImport.get.error.server.title",
        description: "leadsErrors.leadsImport.get.error.server.description",
      },
      [EndpointErrorTypes.UNKNOWN_ERROR]: {
        title: "leadsErrors.leadsImport.get.error.unknown.title",
        description: "leadsErrors.leadsImport.get.error.unknown.description",
      },
    },
    examples: {
      requests: {
        default: {
          status: CsvImportJobStatus.PROCESSING,
          limit: 10,
          offset: 0,
        },
      },
      urlPathVariables: undefined,
      responses: {
        default: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            fileName: "leads.csv",
            status: CsvImportJobStatus.PROCESSING,
            totalRows: 100,
            processedRows: 0,
            successfulImports: 0,
            failedImports: 0,
            duplicateEmails: 0,
            currentBatchStart: 0,
            batchSize: 100,
            error: null,
            retryCount: 0,
            maxRetries: 3,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            startedAt: null,
            completedAt: null,
          },
        ],
      },
    },
  },
});

export type ImportJobsListRequestType = z.infer<
  typeof listImportJobsEndpoint.GET.requestSchema
>;

export type ImportJobsListResponseType = z.infer<
  typeof listImportJobsEndpoint.GET.responseSchema
>;

// PATCH and POST endpoints moved to separate endpoints:
// - PATCH: /jobs/[jobId]
// - POST: /jobs/[jobId]/stop, /jobs/[jobId]/retry

/**
 * Export definitions
 */
const definitions = {
  GET: listImportJobsEndpoint.GET,
} as const;

export default definitions;
