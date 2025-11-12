/**
 * Generic Import API Definition
 * UI-optimized endpoint definitions for CSV import operations
 * Provides user-friendly interfaces for CLI, Web, and AI Chat
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { CountriesOptions, LanguagesOptions } from "@/i18n/core/config";

import {
  CsvImportJobStatus,
  CsvImportJobStatusDB,
  CsvImportJobStatusOptions,
} from "../leads/import/enum";
import { ImportDomain, ImportDomainOptions } from "./enum";

/**
 * Import from CSV Endpoint (POST)
 * User-friendly interface for importing data from CSV files
 */
const { POST: ImportCsvPost } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "import", "csv"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:csv", "csv-import"],

  title: "app.api.v1.core.import.csv.post.title",
  description: "app.api.v1.core.import.csv.post.description",
  category: "app.api.v1.core.import.category",
  tags: [
    "app.api.v1.core.import.tags.csv",
    "app.api.v1.core.import.tags.upload",
    "app.api.v1.core.import.tags.batch",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.import.csv.post.form.title",
      description: "app.api.v1.core.import.csv.post.form.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === FILE UPLOAD SECTION ===
      fileUploadSection: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.import.csv.post.fileSection.title",
          description:
            "app.api.v1.core.import.csv.post.fileSection.description",
          layout: { type: LayoutType.FULL_WIDTH },
        },
        { request: "data" },
        {
          file: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.FILE,
              label: "app.api.v1.core.import.csv.post.file.label",
              description: "app.api.v1.core.import.csv.post.file.description",
              placeholder: "app.api.v1.core.import.csv.post.file.placeholder",
              validation: {
                required: true,
              },
            },
            z.string().min(1),
          ),

          fileName: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.v1.core.import.csv.post.fileName.label",
              description:
                "app.api.v1.core.import.csv.post.fileName.description",
              placeholder:
                "app.api.v1.core.import.csv.post.fileName.placeholder",
              validation: { required: true },
            },
            z.string().min(1),
          ),

          domain: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.import.csv.post.domain.label",
              description: "app.api.v1.core.import.csv.post.domain.description",
              placeholder: "app.api.v1.core.import.csv.post.domain.placeholder",
              options: ImportDomainOptions,
              validation: { required: true },
            },
            z.enum(ImportDomain),
          ),
        },
      ),

      // === PROCESSING OPTIONS SECTION ===
      processingSection: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.import.csv.post.processingSection.title",
          description:
            "app.api.v1.core.import.csv.post.processingSection.description",
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          skipDuplicates: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.v1.core.import.csv.post.skipDuplicates.label",
              description:
                "app.api.v1.core.import.csv.post.skipDuplicates.description",
            },
            z.boolean().default(true),
          ),

          updateExisting: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.v1.core.import.csv.post.updateExisting.label",
              description:
                "app.api.v1.core.import.csv.post.updateExisting.description",
            },
            z.boolean().default(false),
          ),

          useChunkedProcessing: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.v1.core.import.csv.post.useChunkedProcessing.label",
              description:
                "app.api.v1.core.import.csv.post.useChunkedProcessing.description",
            },
            z.boolean().default(false),
          ),

          batchSize: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.import.csv.post.batchSize.label",
              description:
                "app.api.v1.core.import.csv.post.batchSize.description",
              placeholder:
                "app.api.v1.core.import.csv.post.batchSize.placeholder",
              validation: {
                min: 10,
                max: 1000,
              },
            },
            z.number().min(10).max(1000).default(100),
          ),
        },
      ),

      // === DEFAULT VALUES SECTION ===
      defaultsSection: objectField(
        {
          type: WidgetType.SECTION,
          title: "app.api.v1.core.import.csv.post.defaultsSection.title",
          description:
            "app.api.v1.core.import.csv.post.defaultsSection.description",
          layout: { type: LayoutType.GRID, columns: 2 },
          collapsible: true,
          defaultExpanded: false,
        },
        { request: "data" },
        {
          defaultCountry: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.import.csv.post.defaultCountry.label",
              description:
                "app.api.v1.core.import.csv.post.defaultCountry.description",
              placeholder:
                "app.api.v1.core.import.csv.post.defaultCountry.placeholder",
              options: CountriesOptions,
            },
            z.string().default("GLOBAL"),
          ),

          defaultLanguage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.import.csv.post.defaultLanguage.label",
              description:
                "app.api.v1.core.import.csv.post.defaultLanguage.description",
              placeholder:
                "app.api.v1.core.import.csv.post.defaultLanguage.placeholder",
              options: LanguagesOptions,
            },
            z.string().default("en"),
          ),
        },
      ),

      // === RESPONSE DATA ===
      importResult: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.import.csv.post.response.title",
          description: "app.api.v1.core.import.csv.post.response.description",
          layout: { type: LayoutType.STACKED },
        },
        { response: true },
        {
          // === BASIC RESULTS ===
          basicResults: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.import.csv.post.response.basicResults.title",
              description:
                "app.api.v1.core.import.csv.post.response.basicResults.description",
              layout: { type: LayoutType.STACKED },
            },
            { response: true },
            {
              batchId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.batchId.label",
                },
                z.uuid(),
              ),
              totalRows: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.totalRows.label",
                },
                z.number(),
              ),
              isChunkedProcessing: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.isChunkedProcessing.label",
                },
                z.boolean(),
              ),
              jobId: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.jobId.label",
                },
                z.uuid().optional(),
              ),
            },
          ),

          // === STATISTICS ===
          statistics: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.import.csv.post.response.statistics.title",
              description:
                "app.api.v1.core.import.csv.post.response.statistics.description",
              layout: { type: LayoutType.GRID, columns: 2 },
            },
            { response: true },
            {
              successfulImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.successfulImports.label",
                },
                z.number(),
              ),
              failedImports: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.failedImports.label",
                },
                z.number(),
              ),
              duplicateEmails: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.duplicateEmails.label",
                },
                z.number(),
              ),
              processingTimeMs: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.processingTimeMs.label",
                },
                z.number().optional(),
              ),
            },
          ),

          // === DETAILED SUMMARY ===
          summary: objectField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.v1.core.import.csv.post.response.summary.title",
              description:
                "app.api.v1.core.import.csv.post.response.summary.description",
              layout: { type: LayoutType.GRID, columns: 3 },
            },
            { response: true },
            {
              newRecords: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.newRecords.label",
                },
                z.number(),
              ),
              updatedRecords: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.updatedRecords.label",
                },
                z.number(),
              ),
              skippedDuplicates: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.import.csv.post.response.skippedDuplicates.label",
                },
                z.number(),
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
                layout: { type: LayoutType.STACKED },
              },
              { response: true },
              {
                row: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.import.csv.post.response.errors.row.label",
                  },
                  z.number(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.import.csv.post.response.errors.email.label",
                  },
                  z.string().optional(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.import.csv.post.response.errors.error.label",
                  },
                  z.string(),
                ),
              },
            ),
          ),

          // === NEXT STEPS ===
          nextSteps: responseArrayField(
            {},
            responseField(
              {
                content:
                  "app.api.v1.core.import.csv.post.response.nextSteps.item.label",
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
      title: "app.api.v1.core.import.csv.post.errors.validation.title",
      description:
        "app.api.v1.core.import.csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.network.title",
      description: "app.api.v1.core.import.csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.import.csv.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.import.csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.import.csv.post.errors.forbidden.title",
      description:
        "app.api.v1.core.import.csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.import.csv.post.errors.notFound.title",
      description:
        "app.api.v1.core.import.csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.server.title",
      description: "app.api.v1.core.import.csv.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.unknown.title",
      description: "app.api.v1.core.import.csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.import.csv.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.import.csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.import.csv.post.errors.conflict.title",
      description:
        "app.api.v1.core.import.csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.import.csv.post.success.title",
    description: "app.api.v1.core.import.csv.post.success.description",
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
  path: ["v1", "core", "import", "jobs"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:jobs", "import-jobs-list"],

  title: "app.api.v1.core.import.jobs.get.title",
  description: "app.api.v1.core.import.jobs.get.description",
  category: "app.api.v1.core.import.category",
  tags: [
    "app.api.v1.core.import.tags.jobs",
    "app.api.v1.core.import.tags.status",
    "app.api.v1.core.import.tags.history",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.import.jobs.get.form.title",
      description: "app.api.v1.core.import.jobs.get.form.description",
      layout: { type: LayoutType.GRID, columns: 2 },
    },
    { request: "data", response: true },
    {
      // === FILTER OPTIONS ===
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.import.jobs.get.status.label",
          description: "app.api.v1.core.import.jobs.get.status.description",
          placeholder: "app.api.v1.core.import.jobs.get.status.placeholder",
          options: [
            { label: "All Statuses", value: "all" },
            ...CsvImportJobStatusOptions,
          ],
        },
        z.union([z.enum(CsvImportJobStatusDB), z.literal("all")]).optional(),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.import.jobs.get.limit.label",
          description: "app.api.v1.core.import.jobs.get.limit.description",
          placeholder: "app.api.v1.core.import.jobs.get.limit.placeholder",
          validation: {
            min: 1,
            max: 100,
          },
        },
        z.number().min(1).max(100).default(20),
      ),

      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.import.jobs.get.offset.label",
          description: "app.api.v1.core.import.jobs.get.offset.description",
          placeholder: "app.api.v1.core.import.jobs.get.offset.placeholder",
          validation: {
            min: 0,
          },
        },
        z.number().min(0).default(0),
      ),

      // === RESPONSE DATA ===
      jobs: responseArrayField(
        {},
        z.object({
          id: z.uuid().describe("Unique job identifier"),
          fileName: z.string().describe("Original CSV file name"),
          domain: z.string().describe("Import domain (leads, contacts, etc.)"),
          status: z
            .nativeEnum(CsvImportJobStatus)
            .describe("Current job status"),

          // === PROGRESS INFORMATION ===
          progress: z
            .object({
              totalRows: z.number().describe("Total number of rows to process"),
              processedRows: z
                .number()
                .describe("Number of rows already processed"),
              currentBatchStart: z
                .number()
                .describe("Starting position of current batch"),
              batchSize: z.number().describe("Number of rows per batch"),
              percentComplete: z
                .number()
                .describe("Completion percentage (0-100)"),
            })
            .describe("Job progress information"),

          // === RESULTS ===
          results: z
            .object({
              successfulImports: z
                .number()
                .describe("Successfully imported records"),
              failedImports: z.number().describe("Failed import attempts"),
              duplicateEmails: z.number().describe("Duplicate emails found"),
            })
            .describe("Import results summary"),

          // === TIMING INFORMATION ===
          timing: z
            .object({
              createdAt: z.string().describe("When the job was created"),
              updatedAt: z.string().describe("When the job was last updated"),
              startedAt: z
                .string()
                .nullable()
                .describe("When processing started"),
              completedAt: z
                .string()
                .nullable()
                .describe("When processing completed"),
            })
            .describe("Job timing information"),

          // === ERROR HANDLING ===
          errorInfo: z
            .object({
              error: z
                .string()
                .nullable()
                .describe("Last error message if any"),
              retryCount: z.number().describe("Number of retry attempts"),
              maxRetries: z.number().describe("Maximum allowed retries"),
            })
            .describe("Error and retry information"),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.import.csv.post.errors.validation.title",
      description:
        "app.api.v1.core.import.csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.network.title",
      description: "app.api.v1.core.import.csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.import.csv.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.import.csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.import.csv.post.errors.forbidden.title",
      description:
        "app.api.v1.core.import.csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.import.csv.post.errors.notFound.title",
      description:
        "app.api.v1.core.import.csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.import.jobs.get.errors.server.title",
      description: "app.api.v1.core.import.jobs.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.unknown.title",
      description: "app.api.v1.core.import.csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.import.csv.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.import.csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.import.csv.post.errors.conflict.title",
      description:
        "app.api.v1.core.import.csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.import.jobs.get.success.title",
    description: "app.api.v1.core.import.jobs.get.success.description",
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

export type ListImportJobsRequestInput =
  typeof ListImportJobsGet.types.RequestInput;
export type ListImportJobsRequestOutput =
  typeof ListImportJobsGet.types.RequestOutput;
export type ListImportJobsResponseInput =
  typeof ListImportJobsGet.types.ResponseInput;
export type ListImportJobsResponseOutput =
  typeof ListImportJobsGet.types.ResponseOutput;

// === ENDPOINT EXPORTS ===
const importEndpoints = {
  POST: ImportCsvPost,
  GET: ListImportJobsGet,
} as const;

export default importEndpoints;
