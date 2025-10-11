/**
 * Leads Export API Definition
 * Defines endpoints for CSV/Excel export operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods, EndpointErrorTypes } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ExportFormat, LeadStatus, MimeType } from "../enum";

// Inline schemas to avoid deprecated schema.ts imports
const exportQuerySchema = z.object({
  format: z.string().default(ExportFormat.CSV),
  status: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  includeMetadata: z.boolean().default(false),
  includeEngagementData: z.boolean().default(false),
});

const exportResponseSchema = z.object({
  fileName: z.string(),
  fileContent: z.string(), // Base64 encoded file content
  mimeType: z.string(),
  totalRecords: z.number(),
  exportedAt: z.date(),
});

/**
 * Export Leads Endpoint (GET)
 * Exports leads to CSV or Excel format
 */
const leadExportEndpoint = createEndpoint({
  description: "Export leads to CSV or Excel format",
  method: Methods.GET,
  requestSchema: exportQuerySchema,
  responseSchema: exportResponseSchema,
  requestUrlSchema: exportQuerySchema,
  apiQueryOptions: {
    queryKey: ["leads-export"],
    staleTime: 0, // Don't cache exports
  },
  fieldDescriptions: {
    format: "Export format (csv or xlsx)",
    status: "Filter by lead status",
    country: "Filter by country",
    language: "Filter by language",
    source: "Filter by lead source",
    search: "Search in email, business name, contact name",
    dateFrom: "Export leads created from this date",
    dateTo: "Export leads created until this date",
    includeMetadata: "Include metadata fields in export",
    includeEngagementData: "Include email engagement statistics",
  },
  allowedRoles: [UserRole.ADMIN],
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "leadsErrors.leadsExport.get.error.validation.title",
      description: "leadsErrors.leadsExport.get.error.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "leadsErrors.leadsExport.get.error.unauthorized.title",
      description: "leadsErrors.leadsExport.get.error.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "leadsErrors.leadsExport.get.error.server.title",
      description: "leadsErrors.leadsExport.get.error.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "leadsErrors.leadsExport.get.error.unknown.title",
      description: "leadsErrors.leadsExport.get.error.unknown.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsExport.get.success.title",
    description: "leadsErrors.leadsExport.get.success.description",
  },
  path: ["v1", "leads", "export"],
  examples: {
    requests: {
      default: {
        format: ExportFormat.CSV,
        status: LeadStatus.CAMPAIGN_RUNNING,
        includeMetadata: true,
        includeEngagementData: true,
      },
    },
    urlPathVariables: {
      default: {},
    },
    responses: {
      default: {
        fileName: "leads_export_2023-01-01.csv",
        fileContent: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWU...", // Base64 CSV
        mimeType: MimeType.CSV,
        totalRecords: 150,
        exportedAt: new Date("2023-01-01T12:00:00.000Z"),
      },
    },
  },
});

/**
 * Combined endpoints
 */
const exportEndpoints = {
  GET: leadExportEndpoint.GET,
};

export default exportEndpoints;

// Export types for repository and other files to import
export type LeadExportRequestInput = typeof leadExportEndpoint.types.RequestInput;
export type LeadExportRequestOutput = typeof leadExportEndpoint.types.RequestOutput;
export type LeadExportResponseInput = typeof leadExportEndpoint.types.ResponseInput;
export type LeadExportResponseOutput = typeof leadExportEndpoint.types.ResponseOutput;

// Backward compatibility type exports (deprecated - use endpoint types above)
export type ExportQueryType = z.infer<typeof exportQuerySchema>;
export type ExportResponseType = z.infer<typeof exportResponseSchema>;
