/**
 * Generic Import API Definition
 * UI-optimized endpoint definitions for CSV import operations
 * Provides user-friendly interfaces for CLI, Web, and AI Chat
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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
import { Countries, CountriesOptions, Languages, LanguagesOptions } from "@/i18n/core/config";

import { CsvImportJobStatus, CsvImportJobStatusOptions } from "../leads/import/enum";
import { ImportDomain, ImportDomainOptions } from "./enum";

/**
 * Import from CSV Endpoint (POST)
 * User-friendly interface for importing data from CSV files
 */
const { POST: ImportCsvPost } = createEndpoint({
  method: Methods.POST,
  path: ["import", "csv"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:csv", "csv-import"],

  title: "app.api.import.csv.post.title",
  description: "app.api.import.csv.post.description",
  icon: "upload" as const,
  category: "app.api.import.category",
  tags: ["app.api.import.tags.csv", "app.api.import.tags.upload", "app.api.import.tags.batch"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.import.csv.post.form.title",
      description: "app.api.import.csv.post.form.description",
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === FILE UPLOAD SECTION ===
      fileUploadSection: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.import.csv.post.fileSection.title",
          description: "app.api.import.csv.post.fileSection.description",
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          file: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.FILE,
              label: "app.api.import.csv.post.file.label",
              description: "app.api.import.csv.post.file.description",
              placeholder: "app.api.import.csv.post.file.placeholder",
            },
            z.string().min(1),
          ),

          fileName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.import.csv.post.fileName.label",
              description: "app.api.import.csv.post.fileName.description",
              placeholder: "app.api.import.csv.post.fileName.placeholder",
            },
            z.string().min(1),
          ),

          domain: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.import.csv.post.domain.label",
              description: "app.api.import.csv.post.domain.description",
              placeholder: "app.api.import.csv.post.domain.placeholder",
              options: ImportDomainOptions,
            },
            z.enum(ImportDomain),
          ),
        },
      ),

      // === PROCESSING OPTIONS SECTION ===
      processingSection: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.import.csv.post.processingSection.title",
          description: "app.api.import.csv.post.processingSection.description",
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          skipDuplicates: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.import.csv.post.skipDuplicates.label",
              description: "app.api.import.csv.post.skipDuplicates.description",
            },
            z.boolean().default(true),
          ),

          updateExisting: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.import.csv.post.updateExisting.label",
              description: "app.api.import.csv.post.updateExisting.description",
            },
            z.boolean().default(false),
          ),

          useChunkedProcessing: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.import.csv.post.useChunkedProcessing.label",
              description: "app.api.import.csv.post.useChunkedProcessing.description",
            },
            z.boolean().default(false),
          ),

          batchSize: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.import.csv.post.batchSize.label",
              description: "app.api.import.csv.post.batchSize.description",
              placeholder: "app.api.import.csv.post.batchSize.placeholder",
            },
            z.coerce.number().min(10).max(1000).default(100),
          ),
        },
      ),

      // === DEFAULT VALUES SECTION ===
      defaultsSection: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.import.csv.post.defaultsSection.title",
          description: "app.api.import.csv.post.defaultsSection.description",
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          defaultCountry: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.import.csv.post.defaultCountry.label",
              description: "app.api.import.csv.post.defaultCountry.description",
              placeholder: "app.api.import.csv.post.defaultCountry.placeholder",
              options: CountriesOptions,
            },
            z.enum(Countries).default(Countries.GLOBAL),
          ),

          defaultLanguage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.import.csv.post.defaultLanguage.label",
              description: "app.api.import.csv.post.defaultLanguage.description",
              placeholder: "app.api.import.csv.post.defaultLanguage.placeholder",
              options: LanguagesOptions,
            },
            z.enum(Languages).default(Languages.EN),
          ),
        },
      ),

      // === RESPONSE DATA ===
      importResult: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.import.csv.post.response.title",
          description: "app.api.import.csv.post.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          // === BASIC RESULTS ===
          basicResults: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.import.csv.post.response.basicResults.title",
              description: "app.api.import.csv.post.response.basicResults.description",
              layoutType: LayoutType.STACKED,
            },
            { response: true },
            {
              batchId: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.batchId.label",
                },
                z.uuid(),
              ),
              totalRows: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.totalRows.label",
                },
                z.coerce.number(),
              ),
              isChunkedProcessing: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.isChunkedProcessing.label",
                },
                z.boolean(),
              ),
              jobId: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.jobId.label",
                },
                z.uuid().optional(),
              ),
            },
          ),

          // === STATISTICS ===
          statistics: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.import.csv.post.response.statistics.title",
              description: "app.api.import.csv.post.response.statistics.description",
              layoutType: LayoutType.GRID,
              columns: 2,
            },
            { response: true },
            {
              successfulImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.successfulImports.label",
                },
                z.coerce.number(),
              ),
              failedImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.failedImports.label",
                },
                z.coerce.number(),
              ),
              duplicateEmails: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.duplicateEmails.label",
                },
                z.coerce.number(),
              ),
              processingTimeMs: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.processingTimeMs.label",
                },
                z.coerce.number().optional(),
              ),
            },
          ),

          // === DETAILED SUMMARY ===
          summary: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.import.csv.post.response.summary.title",
              description: "app.api.import.csv.post.response.summary.description",
              layoutType: LayoutType.GRID,
              columns: 3,
            },
            { response: true },
            {
              newRecords: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.newRecords.label",
                },
                z.coerce.number(),
              ),
              updatedRecords: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.updatedRecords.label",
                },
                z.coerce.number(),
              ),
              skippedDuplicates: responseField(
                {
                  type: WidgetType.TEXT,
                  content: "app.api.import.csv.post.response.skippedDuplicates.label",
                },
                z.coerce.number(),
              ),
            },
          ),

          // === ERROR DETAILS ===
          errors: responseArrayField(
            {
              type: WidgetType.DATA_TABLE,
              columns: [],
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.import.csv.post.response.errors.title",
                layoutType: LayoutType.STACKED,
              },
              { response: true },
              {
                row: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.csv.post.response.errors.row.label",
                  },
                  z.coerce.number(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.csv.post.response.errors.email.label",
                  },
                  z.string().optional(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.csv.post.response.errors.error.label",
                  },
                  z.string(),
                ),
              },
            ),
          ),

          // === NEXT STEPS ===
          nextSteps: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
              title: "app.api.import.csv.post.response.nextSteps.title",
            },
            responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.import.csv.post.response.nextSteps.item.label",
              },
              z.string(),
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.import.csv.post.errors.validation.title",
      description: "app.api.import.csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.import.csv.post.errors.network.title",
      description: "app.api.import.csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.import.csv.post.errors.unauthorized.title",
      description: "app.api.import.csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.import.csv.post.errors.forbidden.title",
      description: "app.api.import.csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.import.csv.post.errors.notFound.title",
      description: "app.api.import.csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.import.csv.post.errors.server.title",
      description: "app.api.import.csv.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.import.csv.post.errors.unknown.title",
      description: "app.api.import.csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.import.csv.post.errors.unsavedChanges.title",
      description: "app.api.import.csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.import.csv.post.errors.conflict.title",
      description: "app.api.import.csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.import.csv.post.success.title",
    description: "app.api.import.csv.post.success.description",
  },

  examples: {
    requests: {
      default: {
        fileUploadSection: {
          file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWU=", // Base64 CSV
          fileName: "contacts.csv",
          domain: ImportDomain.LEADS,
        },
        processingSection: {
          skipDuplicates: true,
          updateExisting: false,
          useChunkedProcessing: false,
          batchSize: 100,
        },
        defaultsSection: {
          defaultCountry: "GLOBAL",
          defaultLanguage: "en",
        },
      },
    },
    responses: {
      default: {
        importResult: {
          basicResults: {
            batchId: "550e8400-e29b-41d4-a716-446655440000",
            totalRows: 250,
            isChunkedProcessing: false,
          },
          statistics: {
            successfulImports: 235,
            failedImports: 12,
            duplicateEmails: 3,
            processingTimeMs: 2500,
          },
          summary: {
            newRecords: 232,
            updatedRecords: 3,
            skippedDuplicates: 3,
          },
          errors: [
            {
              row: 15,
              email: "invalid-email",
              error: "Invalid email format",
            },
          ],
          nextSteps: [
            "Review error details for failed imports",
            "Consider updating CSV format for better results",
            "Check duplicate handling settings if needed",
          ],
        },
      },
    },
  },
});

/**
 * List Import Jobs Endpoint (GET)
 * User-friendly interface for viewing import job status
 */
const { GET: ListImportJobsGet } = createEndpoint({
  method: Methods.GET,
  path: ["import", "jobs"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:jobs", "import-jobs-list"],

  title: "app.api.import.jobs.get.title",
  description: "app.api.import.jobs.get.description",
  icon: "file-text" as const,
  category: "app.api.import.category",
  tags: ["app.api.import.tags.jobs", "app.api.import.tags.status", "app.api.import.tags.history"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.import.jobs.get.form.title",
      description: "app.api.import.jobs.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 2,
    },
    { request: "data", response: true },
    {
      // === FILTER OPTIONS ===
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.import.jobs.get.status.label",
          description: "app.api.import.jobs.get.status.description",
          placeholder: "app.api.import.jobs.get.status.placeholder",
          options: CsvImportJobStatusOptions,
        },
        z.enum(CsvImportJobStatus).optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.import.jobs.get.limit.label",
          description: "app.api.import.jobs.get.limit.description",
          placeholder: "app.api.import.jobs.get.limit.placeholder",
        },
        z.coerce.number().min(1).max(100).default(20),
      ),

      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.import.jobs.get.offset.label",
          description: "app.api.import.jobs.get.offset.description",
          placeholder: "app.api.import.jobs.get.offset.placeholder",
        },
        z.coerce.number().min(0).default(0),
      ),

      // === RESPONSE DATA ===
      jobs: responseArrayField(
        {
          type: WidgetType.DATA_TABLE,
          title: "app.api.import.jobs.get.response.jobs.title",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title: "app.api.import.jobs.get.response.job.title",
            layoutType: LayoutType.STACKED,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.import.jobs.get.response.job.id.label",
              },
              z.uuid(),
            ),
            fileName: responseField(
              {
                type: WidgetType.TEXT,
                content: "app.api.import.jobs.get.response.job.fileName.label",
              },
              z.string(),
            ),
            domain: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.import.jobs.get.response.job.domain.label",
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.import.jobs.get.response.job.status.label",
              },
              z.enum(CsvImportJobStatus),
            ),

            // === PROGRESS INFORMATION ===
            progress: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.import.jobs.get.response.job.progress.title",
                layoutType: LayoutType.GRID,
                columns: 2,
              },
              { response: true },
              {
                totalRows: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.progress.totalRows.label",
                  },
                  z.coerce.number(),
                ),
                processedRows: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.progress.processedRows.label",
                  },
                  z.coerce.number(),
                ),
                currentBatchStart: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.import.jobs.get.response.job.progress.currentBatchStart.label",
                  },
                  z.coerce.number(),
                ),
                batchSize: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.progress.batchSize.label",
                  },
                  z.coerce.number(),
                ),
                percentComplete: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.progress.percentComplete.label",
                  },
                  z.coerce.number(),
                ),
              },
            ),

            // === RESULTS ===
            results: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.import.jobs.get.response.job.results.title",
                layoutType: LayoutType.GRID,
                columns: 3,
              },
              { response: true },
              {
                successfulImports: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.results.successfulImports.label",
                  },
                  z.coerce.number(),
                ),
                failedImports: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.results.failedImports.label",
                  },
                  z.coerce.number(),
                ),
                duplicateEmails: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.results.duplicateEmails.label",
                  },
                  z.coerce.number(),
                ),
              },
            ),

            // === TIMING INFORMATION ===
            timing: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.import.jobs.get.response.job.timing.title",
                layoutType: LayoutType.GRID,
                columns: 2,
              },
              { response: true },
              {
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.timing.createdAt.label",
                  },
                  z.string(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.timing.updatedAt.label",
                  },
                  z.string(),
                ),
                startedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.timing.startedAt.label",
                  },
                  z.string().nullable(),
                ),
                completedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.timing.completedAt.label",
                  },
                  z.string().nullable(),
                ),
              },
            ),

            // === ERROR HANDLING ===
            errorInfo: objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.import.jobs.get.response.job.errorInfo.title",
                layoutType: LayoutType.STACKED,
              },
              { response: true },
              {
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.errorInfo.error.label",
                  },
                  z.string().nullable(),
                ),
                retryCount: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.errorInfo.retryCount.label",
                  },
                  z.coerce.number(),
                ),
                maxRetries: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.import.jobs.get.response.job.errorInfo.maxRetries.label",
                  },
                  z.coerce.number(),
                ),
              },
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.import.csv.post.errors.validation.title",
      description: "app.api.import.csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.import.csv.post.errors.network.title",
      description: "app.api.import.csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.import.csv.post.errors.unauthorized.title",
      description: "app.api.import.csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.import.csv.post.errors.forbidden.title",
      description: "app.api.import.csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.import.csv.post.errors.notFound.title",
      description: "app.api.import.csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.import.jobs.get.errors.server.title",
      description: "app.api.import.jobs.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.import.csv.post.errors.unknown.title",
      description: "app.api.import.csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.import.csv.post.errors.unsavedChanges.title",
      description: "app.api.import.csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.import.csv.post.errors.conflict.title",
      description: "app.api.import.csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.import.jobs.get.success.title",
    description: "app.api.import.jobs.get.success.description",
  },

  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        status: CsvImportJobStatus.COMPLETED,
        limit: 20,
        offset: 0,
      },
    },
    responses: {
      default: {
        jobs: [
          {
            id: "job_123",
            fileName: "leads.csv",
            domain: "leads",
            status: CsvImportJobStatus.COMPLETED,
            progress: {
              totalRows: 1000,
              processedRows: 1000,
              currentBatchStart: 1000,
              batchSize: 100,
              percentComplete: 100,
            },
            results: {
              successfulImports: 950,
              failedImports: 50,
              duplicateEmails: 25,
            },
            timing: {
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:05:00Z",
              startedAt: "2024-01-01T00:00:10Z",
              completedAt: "2024-01-01T00:05:00Z",
            },
            errorInfo: {
              error: null,
              retryCount: 0,
              maxRetries: 3,
            },
          },
        ],
      },
    },
  },
});

// === TYPE EXPORTS ===
// Using .types accessor for field-based endpoints
export type ImportCsvRequestInput = typeof ImportCsvPost.types.RequestInput;
export type ImportCsvRequestOutput = typeof ImportCsvPost.types.RequestOutput;
export type ImportCsvResponseInput = typeof ImportCsvPost.types.ResponseInput;
export type ImportCsvResponseOutput = typeof ImportCsvPost.types.ResponseOutput;

export type ListImportJobsRequestInput = typeof ListImportJobsGet.types.RequestInput;
export type ListImportJobsRequestOutput = typeof ListImportJobsGet.types.RequestOutput;
export type ListImportJobsResponseInput = typeof ListImportJobsGet.types.ResponseInput;
export type ListImportJobsResponseOutput = typeof ListImportJobsGet.types.ResponseOutput;

// === ENDPOINT EXPORTS ===
const importEndpoints = {
  POST: ImportCsvPost,
  GET: ListImportJobsGet,
} as const;

export default importEndpoints;
