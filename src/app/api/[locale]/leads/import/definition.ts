/**
 * Leads Import API Definition
 * Defines endpoints for CSV import operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  objectField,
  requestField,
  responseArrayField,
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
import { scopedTranslation } from "./i18n";
import { LeadsImportContainer } from "./widget";

/**
 * Import Leads from CSV Endpoint (POST)
 * Imports leads from CSV file upload
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "import"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.import", "tags.csv", "tags.leads"],
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
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // === REQUEST FIELDS ===
      file: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "post.file.label",
        description: "post.file.description",
        helpText: "post.file.helpText",
        accept: ".csv,text/csv",
        columns: 12,
        schema: z.string().min(1),
      }),
      fileName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fileName.label",
        description: "post.fileName.description",
        placeholder: "post.fileName.placeholder",
        helpText: "post.fileName.helpText",
        columns: 12,
        schema: z.string().optional(),
      }),
      skipDuplicates: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.skipDuplicates.label",
        description: "post.skipDuplicates.description",
        helpText: "post.skipDuplicates.helpText",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      updateExisting: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.updateExisting.label",
        description: "post.updateExisting.description",
        helpText: "post.updateExisting.helpText",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      defaultCountry: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.defaultCountry.label",
        description: "post.defaultCountry.description",
        helpText: "post.defaultCountry.helpText",
        columns: 6,
        options: CountriesOptions,
        schema: z.enum(Countries),
      }),
      defaultLanguage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.defaultLanguage.label",
        description: "post.defaultLanguage.description",
        helpText: "post.defaultLanguage.helpText",
        columns: 6,
        options: LanguagesOptions,
        schema: z.enum(Languages),
      }),
      defaultStatus: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.defaultStatus.label",
        description: "post.defaultStatus.description",
        helpText: "post.defaultStatus.helpText",
        columns: 6,
        options: LeadStatusOptions,
        schema: z.enum(LeadStatus).default(LeadStatus.NEW),
      }),
      defaultCampaignStage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.defaultCampaignStage.label",
        description: "post.defaultCampaignStage.description",
        helpText: "post.defaultCampaignStage.helpText",
        columns: 6,
        options: EmailCampaignStageOptions,
        schema: z
          .enum(EmailCampaignStage)
          .default(EmailCampaignStage.NOT_STARTED),
      }),
      defaultSource: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.defaultSource.label",
        description: "post.defaultSource.description",
        helpText: "post.defaultSource.helpText",
        columns: 6,
        options: LeadSourceOptions,
        schema: z.enum(LeadSource).default(LeadSource.CSV_IMPORT),
      }),
      useChunkedProcessing: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.useChunkedProcessing.label",
        description: "post.useChunkedProcessing.description",
        helpText: "post.useChunkedProcessing.helpText",
        columns: 6,
        schema: z.boolean().default(true),
      }),
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.batchSize.label",
        description: "post.batchSize.description",
        helpText: "post.batchSize.helpText",
        columns: 6,
        schema: z.coerce.number().min(10).max(2000).default(2000),
      }),

      // === RESPONSE FIELDS ===
      batchId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.batchId",
        schema: z.uuid(),
      }),
      totalRows: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.totalRows",
        schema: z.coerce.number(),
      }),
      successfulImports: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.successfulImports",
        schema: z.coerce.number(),
      }),
      failedImports: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.failedImports",
        schema: z.coerce.number(),
      }),
      duplicateEmails: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.duplicateEmails",
        schema: z.coerce.number(),
      }),
      errors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.errors",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 3,
          usage: { response: true },
          children: {
            row: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              fieldType: FieldDataType.NUMBER,
              schema: z.coerce.number(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              fieldType: FieldDataType.TEXT,
              schema: z.string().optional(),
            }),
            error: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.errors",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),
      summary: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.response.summary",
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { response: true },
        children: {
          newLeads: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.summary",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          updatedLeads: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.summary",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
          skippedDuplicates: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "post.response.summary",
            fieldType: FieldDataType.NUMBER,
            schema: z.coerce.number(),
          }),
        },
      }),
      isChunkedProcessing: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.isChunkedProcessing",
        schema: z.boolean().default(false),
      }),
      jobId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.jobId",
        schema: z.uuid().optional(),
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
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
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWUK...",
        fileName: "csv",
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
        fileName: "csv",
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
