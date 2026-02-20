/**
 * Leads Import API Definition
 * Defines endpoints for CSV import operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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
import {
  Countries,
  CountriesOptions,
  Languages,
  LanguagesOptions,
} from "@/i18n/core/config";

import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusOptions,
} from "../enum";
import type { CsvImportJobStatus } from "./enum";
import { LeadsImportContainer } from "./widget";

/**
 * Import Leads from CSV Endpoint (POST)
 * Imports leads from CSV file upload
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["leads", "import"],
  title: "app.api.leads.import.post.title" as const,
  description: "app.api.leads.import.post.description" as const,
  category: "app.api.leads.category" as const,
  tags: [
    "app.api.leads.tags.import" as const,
    "app.api.leads.tags.csv" as const,
    "app.api.leads.tags.leads" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "arrow-up",
  aliases: ["leads-import", "import-leads"] as const,

  cli: {
    firstCliArgKey: "fileName",
  },

  fields: customWidgetObject({
    render: LeadsImportContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { response: true } }),
      // === REQUEST FIELDS ===
      file: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "app.api.leads.import.post.file.label" as const,
        description: "app.api.leads.import.post.file.description" as const,
        helpText: "app.api.leads.import.post.file.helpText" as const,
        accept: ".csv,text/csv",
        columns: 12,
        schema: z.string().min(1),
      }),
      fileName: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.leads.import.post.fileName.label" as const,
        description: "app.api.leads.import.post.fileName.description" as const,
        placeholder: "app.api.leads.import.post.fileName.placeholder" as const,
        helpText: "app.api.leads.import.post.fileName.helpText" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      skipDuplicates: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.import.post.skipDuplicates.label" as const,
        description:
          "app.api.leads.import.post.skipDuplicates.description" as const,
        helpText: "app.api.leads.import.post.skipDuplicates.helpText" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      updateExisting: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.import.post.updateExisting.label" as const,
        description:
          "app.api.leads.import.post.updateExisting.description" as const,
        helpText: "app.api.leads.import.post.updateExisting.helpText" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      defaultCountry: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.import.post.defaultCountry.label" as const,
        description:
          "app.api.leads.import.post.defaultCountry.description" as const,
        helpText: "app.api.leads.import.post.defaultCountry.helpText" as const,
        columns: 6,
        options: CountriesOptions,
        schema: z.enum(Countries),
      }),
      defaultLanguage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.import.post.defaultLanguage.label" as const,
        description:
          "app.api.leads.import.post.defaultLanguage.description" as const,
        helpText: "app.api.leads.import.post.defaultLanguage.helpText" as const,
        columns: 6,
        options: LanguagesOptions,
        schema: z.enum(Languages),
      }),
      defaultStatus: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.import.post.defaultStatus.label" as const,
        description:
          "app.api.leads.import.post.defaultStatus.description" as const,
        helpText: "app.api.leads.import.post.defaultStatus.helpText" as const,
        columns: 6,
        options: LeadStatusOptions,
        schema: z.enum(LeadStatus).default(LeadStatus.NEW),
      }),
      defaultCampaignStage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.import.post.defaultCampaignStage.label" as const,
        description:
          "app.api.leads.import.post.defaultCampaignStage.description" as const,
        helpText:
          "app.api.leads.import.post.defaultCampaignStage.helpText" as const,
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z
          .enum(EmailCampaignStage)
          .default(EmailCampaignStage.NOT_STARTED),
      }),
      defaultSource: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.leads.import.post.defaultSource.label" as const,
        description:
          "app.api.leads.import.post.defaultSource.description" as const,
        helpText: "app.api.leads.import.post.defaultSource.helpText" as const,
        columns: 6,
        options: LeadSourceOptions,
        schema: z.enum(LeadSource).default(LeadSource.CSV_IMPORT),
      }),
      useChunkedProcessing: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.leads.import.post.useChunkedProcessing.label" as const,
        description:
          "app.api.leads.import.post.useChunkedProcessing.description" as const,
        helpText:
          "app.api.leads.import.post.useChunkedProcessing.helpText" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      batchSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.leads.import.post.batchSize.label" as const,
        description: "app.api.leads.import.post.batchSize.description" as const,
        helpText: "app.api.leads.import.post.batchSize.helpText" as const,
        columns: 6,
        schema: z.coerce.number().min(10).max(2000).default(2000),
      }),

      // === RESPONSE FIELDS ===
      batchId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.post.response.batchId" as const,
        schema: z.uuid(),
      }),
      totalRows: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.post.response.totalRows" as const,
        schema: z.coerce.number(),
      }),
      successfulImports: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.import.post.response.successfulImports" as const,
        schema: z.coerce.number(),
      }),
      failedImports: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.post.response.failedImports" as const,
        schema: z.coerce.number(),
      }),
      duplicateEmails: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.post.response.duplicateEmails" as const,
        schema: z.coerce.number(),
      }),
      errors: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.post.response.errors" as const,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 3,
          },
          { response: true },
          {
            row: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.import.post.response.errors" as const,
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
            email: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.import.post.response.errors" as const,
              fieldType: FieldDataType.TEXT,
              schema: z.string().optional(),
            }),
            error: responseField({
              type: WidgetType.TEXT,
              content: "app.api.leads.import.post.response.errors" as const,
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
          },
        ),
      ),
      summary: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.post.response.summary" as const,
          layoutType: LayoutType.GRID,
          columns: 3,
        },
        { response: true },
        {
          newLeads: responseField({
            type: WidgetType.TEXT,
            content: "app.api.leads.import.post.response.summary" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          updatedLeads: responseField({
            type: WidgetType.TEXT,
            content: "app.api.leads.import.post.response.summary" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          skippedDuplicates: responseField({
            type: WidgetType.TEXT,
            content: "app.api.leads.import.post.response.summary" as const,
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
        },
      ),
      isChunkedProcessing: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.leads.import.post.response.isChunkedProcessing" as const,
        schema: z.boolean().default(false),
      }),
      jobId: responseField({
        type: WidgetType.TEXT,
        content: "app.api.leads.import.post.response.jobId" as const,
        schema: z.uuid().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.import.post.errors.validation.title" as const,
      description:
        "app.api.leads.import.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.import.post.errors.unauthorized.title" as const,
      description:
        "app.api.leads.import.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.post.errors.forbidden.title" as const,
      description:
        "app.api.leads.import.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.post.errors.notFound.title" as const,
      description:
        "app.api.leads.import.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.post.errors.conflict.title" as const,
      description:
        "app.api.leads.import.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.post.errors.server.title" as const,
      description:
        "app.api.leads.import.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.post.errors.unknown.title" as const,
      description:
        "app.api.leads.import.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.post.errors.network.title" as const,
      description:
        "app.api.leads.import.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.import.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.leads.import.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.leads.import.post.success.title" as const,
    description: "app.api.leads.import.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...",
        fileName: "app.api.leads.csv",
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
        fileName: "app.api.leads.csv",
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
  },
});

// Export types from endpoint using proper .types accessor
export type LeadsImportRequestInput = typeof POST.types.RequestInput;
export type LeadsImportRequestOutput = typeof POST.types.RequestOutput;
export type LeadsImportResponseInput = typeof POST.types.ResponseInput;
export type LeadsImportResponseOutput = typeof POST.types.ResponseOutput;

// Export job-related types from specific endpoints
export interface ImportJobUpdateResponseType {
  id: string;
  fileName: string;
  status: (typeof CsvImportJobStatus)[keyof typeof CsvImportJobStatus];
  totalRows: number | null;
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
