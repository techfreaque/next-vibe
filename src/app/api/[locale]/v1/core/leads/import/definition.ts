/**
 * Leads Import API Definition
 * Defines endpoints for CSV import operations
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
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../enum";
import type { CsvImportJobStatus } from "./enum";

/**
 * Import Leads from CSV Endpoint (POST)
 * Imports leads from CSV file upload
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "import"],
  title: "app.api.v1.core.leads.import.post.title" as const,
  description: "app.api.v1.core.leads.import.post.description" as const,
  category: "app.api.v1.core.leads.category" as const,
  tags: [
    "app.api.v1.core.leads.tags.import" as const,
    "app.api.v1.core.leads.tags.csv" as const,
    "app.api.v1.core.leads.tags.leads" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["leads-import", "import-leads"] as const,

  cli: {
    firstCliArgKey: "fileName",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.import.post.form.title" as const,
      description:
        "app.api.v1.core.leads.import.post.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
      children: [],
    },
    {
      [Methods.POST]: { request: "data", response: true },
    },
    {
      // === REQUEST FIELDS ===
      file: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.import.post.file.label" as const,
          description:
            "app.api.v1.core.leads.import.post.file.description" as const,
          placeholder:
            "app.api.v1.core.leads.import.post.file.placeholder" as const,
          helpText: "app.api.v1.core.leads.import.post.file.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().min(1),
      ),
      fileName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.leads.import.post.fileName.label" as const,
          description:
            "app.api.v1.core.leads.import.post.fileName.description" as const,
          placeholder:
            "app.api.v1.core.leads.import.post.fileName.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.import.post.fileName.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().min(1),
      ),
      skipDuplicates: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.leads.import.post.skipDuplicates.label" as const,
          description:
            "app.api.v1.core.leads.import.post.skipDuplicates.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.skipDuplicates.helpText" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),
      updateExisting: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.leads.import.post.updateExisting.label" as const,
          description:
            "app.api.v1.core.leads.import.post.updateExisting.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.updateExisting.helpText" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),
      defaultCountry: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.import.post.defaultCountry.label" as const,
          description:
            "app.api.v1.core.leads.import.post.defaultCountry.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.defaultCountry.helpText" as const,
          layout: { columns: 6 },
          options: Object.entries(Countries).map(
            ([, value]: [string, string]) => ({
              value: value,
              label: `app.api.v1.core.leads.enums.country.${value.toLowerCase()}`,
            }),
          ),
        },
        z.nativeEnum(Countries),
      ),
      defaultLanguage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.import.post.defaultLanguage.label" as const,
          description:
            "app.api.v1.core.leads.import.post.defaultLanguage.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.defaultLanguage.helpText" as const,
          layout: { columns: 6 },
          options: Object.entries(Languages).map(
            ([, value]: [string, string]) => ({
              value: value,
              label: `app.api.v1.core.leads.enums.language.${value.toLowerCase()}`,
            }),
          ),
        },
        z.nativeEnum(Languages),
      ),
      defaultStatus: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.import.post.defaultStatus.label" as const,
          description:
            "app.api.v1.core.leads.import.post.defaultStatus.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.defaultStatus.helpText" as const,
          layout: { columns: 6 },
          options: LeadStatusOptions,
        },
        z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
      ),
      defaultCampaignStage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.import.post.defaultCampaignStage.label" as const,
          description:
            "app.api.v1.core.leads.import.post.defaultCampaignStage.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.defaultCampaignStage.helpText" as const,
          layout: { columns: 6 },
          options: EmailCampaignStageOptions,
        },
        z
          .nativeEnum(EmailCampaignStage)
          .default(EmailCampaignStage.NOT_STARTED),
      ),
      defaultSource: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.import.post.defaultSource.label" as const,
          description:
            "app.api.v1.core.leads.import.post.defaultSource.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.defaultSource.helpText" as const,
          layout: { columns: 6 },
          options: LeadSourceOptions,
        },
        z.nativeEnum(LeadSource).default(LeadSource.CSV_IMPORT),
      ),
      useChunkedProcessing: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.leads.import.post.useChunkedProcessing.label" as const,
          description:
            "app.api.v1.core.leads.import.post.useChunkedProcessing.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.useChunkedProcessing.helpText" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),
      batchSize: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.leads.import.post.batchSize.label" as const,
          description:
            "app.api.v1.core.leads.import.post.batchSize.description" as const,
          helpText:
            "app.api.v1.core.leads.import.post.batchSize.helpText" as const,
          layout: { columns: 6 },
        },
        z.number().min(10).max(1000).default(2000),
      ),

      // === RESPONSE FIELDS ===
      batchId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.batchId" as const,
        },
        z.uuid(),
      ),
      totalRows: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.totalRows" as const,
        },
        z.number(),
      ),
      successfulImports: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.successfulImports" as const,
        },
        z.number(),
      ),
      failedImports: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.failedImports" as const,
        },
        z.number(),
      ),
      duplicateEmails: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.duplicateEmails" as const,
        },
        z.number(),
      ),
      errors: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.import.post.response.errors" as const,
        },
        z.array(
          z.object({
            row: z.number(),
            email: z.string().optional(),
            error: z.string(),
          }),
        ),
      ),
      summary: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.summary" as const,
        },
        z.object({
          newLeads: z.number(),
          updatedLeads: z.number(),
          skippedDuplicates: z.number(),
        }),
      ),
      isChunkedProcessing: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.import.post.response.isChunkedProcessing" as const,
        },
        z.boolean().default(false),
      ),
      jobId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.leads.import.post.response.jobId" as const,
        },
        z.uuid().optional(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.import.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.import.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.import.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.import.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.import.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.import.post.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.import.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.import.post.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.import.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.import.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.import.post.success.title" as const,
    description:
      "app.api.v1.core.leads.import.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...",
        fileName: "leads.csv",
        skipDuplicates: true,
        updateExisting: false,
        defaultCountry: "GLOBAL",
        defaultLanguage: "en",
        defaultStatus: LeadStatus.NEW,
        defaultCampaignStage: EmailCampaignStage.NOT_STARTED,
        defaultSource: LeadSource.CSV_IMPORT,
        useChunkedProcessing: false,
        batchSize: 2000,
      },
      minimal: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...",
        fileName: "leads.csv",
        defaultCountry: "GLOBAL",
        defaultLanguage: "en",
      },
      chunked: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...",
        fileName: "large-leads.csv",
        skipDuplicates: true,
        updateExisting: false,
        defaultCountry: "GLOBAL",
        defaultLanguage: "en",
        defaultStatus: LeadStatus.NEW,
        defaultCampaignStage: EmailCampaignStage.NOT_STARTED,
        defaultSource: LeadSource.CSV_IMPORT,
        useChunkedProcessing: true,
        batchSize: 1000,
      },
    },
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
        isChunkedProcessing: false,
      },
      chunked: {
        batchId: "123e4567-e89b-12d3-a456-426614174000",
        totalRows: 1000,
        successfulImports: 0,
        failedImports: 0,
        duplicateEmails: 0,
        errors: [],
        summary: {
          newLeads: 0,
          updatedLeads: 0,
          skippedDuplicates: 0,
        },
        isChunkedProcessing: true,
        jobId: "job_123e4567-e89b-12d3-a456-426614174000",
      },
      minimal: {
        batchId: "123e4567-e89b-12d3-a456-426614174000",
        totalRows: 10,
        successfulImports: 10,
        failedImports: 0,
        duplicateEmails: 0,
        errors: [],
        summary: {
          newLeads: 10,
          updatedLeads: 0,
          skippedDuplicates: 0,
        },
        isChunkedProcessing: false,
      },
    },
    urlPathVariables: undefined,
  },
});

// Export types from endpoint using proper .types accessor
export type LeadsImportRequestInput = typeof POST.types.RequestInput;
export type LeadsImportRequestOutput = typeof POST.types.RequestOutput;
export type LeadsImportResponseInput = typeof POST.types.ResponseInput;
export type LeadsImportResponseOutput = typeof POST.types.ResponseOutput;

// Re-export types needed by generic import system
export type { NewCsvImportJob, NewImportBatch } from "./db";
export { CsvImportJobStatus } from "./enum";
export type { CsvImportConfig, DomainImportRepository } from "./repository";

// Export job-related types from specific endpoints
export interface ImportJobUpdateResponseType {
  id: string;
  fileName: string;
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
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
}

export interface ImportJobsListRequestType {
  status?: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
  limit?: number;
  offset?: number;
}

export type ImportJobsListResponseType = ImportJobUpdateResponseType[];

const endpoints = { POST };
export default endpoints;
