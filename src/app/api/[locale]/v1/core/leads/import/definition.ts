/**
 * Leads Import API Definition
 * Defines endpoints for CSV import operations
 */

// undefinedSchema replaced with z.never()
import { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { EndpointErrorTypes } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

import { EmailCampaignStage, LeadSource, LeadStatus } from "../enum";

/**
 * Import Leads from CSV Endpoint (POST)
 * Imports leads from CSV file upload
 */
const leadImportEndpoint = createEndpoint({
  description: "Import leads from CSV file",
  method: Methods.POST,
  requestSchema: z.object({
    file: z.string().min(1, "File content is required"), // Base64 encoded CSV content
    fileName: z.string().min(1, "File name is required"),
    skipDuplicates: z.boolean().default(true),
    updateExisting: z.boolean().default(false),
    defaultCountry: z.string(),
    defaultLanguage: z.string(),
    // Default field values for imported leads
    defaultStatus: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
    defaultCampaignStage: z
      .nativeEnum(EmailCampaignStage)
      .default(EmailCampaignStage.NOT_STARTED),
    defaultSource: z.nativeEnum(LeadSource).default(LeadSource.CSV_IMPORT),
    // Chunked processing options
    useChunkedProcessing: z.boolean().default(false),
    batchSize: z.number().min(10).max(1000).default(2000),
  }),
  responseSchema: z.object({
    batchId: z.uuid(),
    totalRows: z.number(),
    successfulImports: z.number(),
    failedImports: z.number(),
    duplicateEmails: z.number(),
    errors: z.array(
      z.object({
        row: z.number(),
        email: z.string().optional(),
        error: z.string(),
      }),
    ),
    summary: z.object({
      newLeads: z.number(),
      updatedLeads: z.number(),
      skippedDuplicates: z.number(),
    }),
    // Chunked processing fields
    isChunkedProcessing: z.boolean().default(false),
    jobId: z.uuid().optional(),
  }),
  requestUrlSchema: z.never(),
  apiQueryOptions: {
    queryKey: ["leads-import"],
    staleTime: 0, // Don't cache mutations
  },
  fieldDescriptions: {
    file: "Base64 encoded CSV content",
    fileName: "Name of the CSV file being imported",
    skipDuplicates: "Whether to skip duplicate email addresses",
    updateExisting: "Whether to update existing leads with new data",
    defaultCountry: "Default country for leads that don't specify one",
    defaultLanguage: "Default language for leads that don't specify one",
    defaultStatus: "Default status for imported leads that don't specify one",
    defaultCampaignStage:
      "Default campaign stage for imported leads that don't specify one",
    defaultSource: "Default source for imported leads that don't specify one",
    useChunkedProcessing: "Whether to process the CSV in chunks via cron job",
    batchSize: "Number of rows to process per batch (10-1000)",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "leadsErrors.leadsImport.post.error.validation.title",
      description: "leadsErrors.leadsImport.post.error.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "leadsErrors.leadsImport.post.error.unauthorized.title",
      description:
        "leadsErrors.leadsImport.post.error.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "leadsErrors.leadsImport.post.error.server.title",
      description: "leadsErrors.leadsImport.post.error.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "leadsErrors.leadsImport.post.error.unknown.title",
      description: "leadsErrors.leadsImport.post.error.unknown.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsImport.post.success.title",
    description: "leadsErrors.leadsImport.post.success.description",
  },
  path: ["v1", "leads", "import"],
  examples: {
    responses: {
      default: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...", // Base64 CSV
        fileName: "leads.csv",
        skipDuplicates: true,
        updateExisting: false,
        defaultCountry: "GLOBAL",
        defaultLanguage: "en",
        defaultStatus: LeadStatus.NEW,
        defaultCampaignStage: EmailCampaignStage.NOT_STARTED,
        defaultSource: LeadSource.CSV_IMPORT,
      },
    },
    urlPathVariables: undefined,
    responses: {
      default: {
        batchId: "123e4567-e89b-12d3-a456-426614174000",
        totalRows: 100,
        successfulImports: 95,
        failedImports: 5,
        duplicateEmails: 3,
        errors: [
          {
            row: 15,
            email: "invalid-email",
            error: "Invalid email format",
          },
        ],
        summary: {
          newLeads: 92,
          updatedLeads: 3,
          skippedDuplicates: 3,
        },
      },
    },
  },
});

// Export types from endpoint schemas
export type LeadsImportRequestType = z.infer<
  typeof leadImportEndpoint.POST.requestSchema
>;
export type LeadsImportResponseType = z.infer<
  typeof leadImportEndpoint.POST.responseSchema
>;

// Re-export types needed by generic import system
export type { NewCsvImportJob, NewImportBatch } from "./db";
export type { 
  CsvImportConfig, 
  DomainImportRepository,
} from "./repository";
export { CsvImportJobStatus } from "./enum";

// Export job-related types from specific endpoints
export type ImportJobUpdateResponseType = {
  id: string;
  fileName: string;
  status: string;
  totalRows: number;
  processedRows: number;
  successfulImports: number;
  failedImports: number;
  duplicateEmails: number;
  currentBatchStart: number;
  batchSize: number;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type ImportJobsListRequestType = {
  status?: string;
  limit?: number;
  offset?: number;
};

export type ImportJobsListResponseType = ImportJobUpdateResponseType[];

const importEndpoints = {
  POST: leadImportEndpoint.POST,
};

export default importEndpoints;
