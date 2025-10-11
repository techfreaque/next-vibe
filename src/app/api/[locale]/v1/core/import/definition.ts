/**
 * Generic Import API Definition
 * UI-optimized endpoint definitions for CSV import operations
 * Provides user-friendly interfaces for CLI, Web, and AI Chat
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

import {
  CsvImportJobStatus,
  CsvImportJobStatusOptions,
  ImportDomain,
  ImportDomainOptions,
} from "./enum";

/**
 * Import from CSV Endpoint (POST)
 * User-friendly interface for importing data from CSV files
 */
const { POST: ImportCsvPost } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "import", "csv"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
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
          type: WidgetType.FORM_SECTION,
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
              helpText: "app.api.v1.core.import.csv.post.file.helpText",
              layout: { type: LayoutType.FULL_WIDTH },
              validation: {
                required: true,
                accept: ".csv,text/csv",
                maxSize: "10MB",
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
              layout: { type: LayoutType.FULL_WIDTH },
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
              layout: { type: LayoutType.FULL_WIDTH },
              validation: { required: true },
            },
            z.nativeEnum(ImportDomain),
          ),
        },
      ),

      // === PROCESSING OPTIONS SECTION ===
      processingSection: objectField(
        {
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.import.csv.post.processingSection.title",
          description:
            "app.api.v1.core.import.csv.post.processingSection.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
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
              helpText:
                "app.api.v1.core.import.csv.post.skipDuplicates.helpText",
              layout: { columns: 6 },
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
              helpText:
                "app.api.v1.core.import.csv.post.updateExisting.helpText",
              layout: { columns: 6 },
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
              helpText:
                "app.api.v1.core.import.csv.post.useChunkedProcessing.helpText",
              layout: { columns: 6 },
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
              helpText: "app.api.v1.core.import.csv.post.batchSize.helpText",
              layout: { columns: 6 },
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
          type: WidgetType.FORM_SECTION,
          title: "app.api.v1.core.import.csv.post.defaultsSection.title",
          description:
            "app.api.v1.core.import.csv.post.defaultsSection.description",
          layout: { type: LayoutType.GRID_2_COLUMNS },
          collapsed: true,
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
              options: Object.entries(Countries).map(([key, code]) => ({
                label: key === "GLOBAL" ? "Global" : key,
                value: code,
              })),
              layout: { columns: 6 },
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
              options: Object.entries(Languages).map(([key, code]) => ({
                label: key,
                value: code,
              })),
              layout: { columns: 6 },
            },
            z.string().default("en"),
          ),
        },
      ),

      // === RESPONSE DATA ===
      importResult: responseField(
        {
          type: WidgetType.RESULT_CONTAINER,
          title: "app.api.v1.core.import.csv.post.response.title",
          description: "app.api.v1.core.import.csv.post.response.description",
          layout: { type: LayoutType.STACKED },
        },
        z.object({
          // === BASIC RESULTS ===
          basicResults: z
            .object({
              batchId: z
                .string()
                .uuid()
                .describe("Unique identifier for this import batch"),
              totalRows: z.number().describe("Total number of rows processed"),
              isChunkedProcessing: z
                .boolean()
                .describe("Whether processing was done in chunks"),
              jobId: z
                .string()
                .uuid()
                .optional()
                .describe("Job ID for chunked processing"),
            })
            .describe("Basic import operation results"),

          // === STATISTICS ===
          statistics: z
            .object({
              successfulImports: z
                .number()
                .describe("Number of successfully imported records"),
              failedImports: z
                .number()
                .describe("Number of records that failed to import"),
              duplicateEmails: z
                .number()
                .describe("Number of duplicate email addresses found"),
              processingTimeMs: z
                .number()
                .optional()
                .describe("Total processing time in milliseconds"),
            })
            .describe("Import processing statistics"),

          // === DETAILED SUMMARY ===
          summary: z
            .object({
              newRecords: z
                .number()
                .describe("Number of completely new records created"),
              updatedRecords: z
                .number()
                .describe("Number of existing records updated"),
              skippedDuplicates: z
                .number()
                .describe("Number of duplicates that were skipped"),
            })
            .describe("Detailed breakdown of import results"),

          // === ERROR DETAILS ===
          errors: z
            .array(
              z.object({
                row: z.number().describe("Row number where error occurred"),
                email: z
                  .string()
                  .optional()
                  .describe("Email address associated with error"),
                error: z.string().describe("Human-readable error message"),
              }),
            )
            .describe("List of errors that occurred during import"),

          // === NEXT STEPS ===
          nextSteps: z
            .array(z.string())
            .describe("Recommended actions for the user"),
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.import.csv.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.import.csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FILE_TOO_LARGE]: {
      title: "app.api.v1.core.import.csv.post.errors.fileTooLarge.title",
      description:
        "app.api.v1.core.import.csv.post.errors.fileTooLarge.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.import.csv.post.errors.server.title",
      description: "app.api.v1.core.import.csv.post.errors.server.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.import.csv.post.success.title",
    description: "app.api.v1.core.import.csv.post.success.description",
  },

  examples: {
    requests: {
      default: {
        file: "ZW1haWwsYnVzaW5lc3NfbmFtZSxjb250YWN0X25hbWU=", // Base64 CSV
        fileName: "contacts.csv",
        domain: ImportDomain.LEADS,
        skipDuplicates: true,
        updateExisting: false,
        useChunkedProcessing: false,
        batchSize: 100,
        defaultCountry: "GLOBAL",
        defaultLanguage: "en",
      },
    },
    responses: {
      default: {
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
});

/**
 * List Import Jobs Endpoint (GET)
 * User-friendly interface for viewing import job status
 */
const { GET: ListImportJobsGet } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "import", "jobs"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
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
      layout: { type: LayoutType.GRID_2_COLUMNS },
    },
    { request: "query", response: true },
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
          layout: { columns: 6 },
        },
        z.string().default("all"),
      ),

      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.import.jobs.get.limit.label",
          description: "app.api.v1.core.import.jobs.get.limit.description",
          placeholder: "app.api.v1.core.import.jobs.get.limit.placeholder",
          layout: { columns: 6 },
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
          layout: { columns: 6 },
          validation: {
            min: 0,
          },
        },
        z.number().min(0).default(0),
      ),

      // === RESPONSE DATA ===
      jobs: responseArrayField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.v1.core.import.jobs.get.response.title",
          description: "app.api.v1.core.import.jobs.get.response.description",
          layout: { type: LayoutType.STACKED },
        },
        z.object({
          id: z.string().uuid().describe("Unique job identifier"),
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.import.jobs.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.import.jobs.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.import.jobs.get.errors.server.title",
      description: "app.api.v1.core.import.jobs.get.errors.server.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.import.jobs.get.success.title",
    description: "app.api.v1.core.import.jobs.get.success.description",
  },
});

// === TYPE EXPORTS ===
export type ImportCsvRequestType = z.infer<typeof ImportCsvPost.requestSchema>;
export type ImportCsvResponseType = z.infer<
  typeof ImportCsvPost.responseSchema
>;
export type ListImportJobsRequestType = z.infer<
  typeof ListImportJobsGet.requestSchema
>;
export type ListImportJobsResponseType = z.infer<
  typeof ListImportJobsGet.responseSchema
>;

// === ENDPOINT EXPORTS ===
const importEndpoints = {
  POST: ImportCsvPost,
  GET: ListImportJobsGet,
};

export default importEndpoints;
