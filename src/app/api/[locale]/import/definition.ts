/**
 * Generic Import API Definition
 * UI-optimized endpoint definitions for CSV import operations
 * Provides user-friendly interfaces for CLI, Web, and AI Chat
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
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
  CsvImportJobStatus,
  CsvImportJobStatusOptions,
} from "../leads/import/enum";
import { ImportDomain, ImportDomainOptions } from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Import from CSV Endpoint (POST)
 * User-friendly interface for importing data from CSV files
 */
const { POST: ImportCsvPost } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["import", "csv"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:csv", "csv-import"],

  title: "csv.post.title",
  description: "csv.post.description",
  icon: "upload" as const,
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.csv", "tags.upload", "tags.batch"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "csv.post.form.title",
    description: "csv.post.form.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === FILE UPLOAD SECTION ===
      fileUploadSection: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "csv.post.fileSection.title",
        description: "csv.post.fileSection.description",
        layoutType: LayoutType.STACKED,
        usage: { request: "data" },
        children: {
          file: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "csv.post.file.label",
            description: "csv.post.file.description",
            placeholder: "csv.post.file.placeholder",
            schema: z.string().min(1),
          }),

          fileName: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "csv.post.fileName.label",
            description: "csv.post.fileName.description",
            placeholder: "csv.post.fileName.placeholder",
            schema: z.string().min(1),
          }),

          domain: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "csv.post.domain.label",
            description: "csv.post.domain.description",
            placeholder: "csv.post.domain.placeholder",
            options: ImportDomainOptions,
            schema: z.enum(ImportDomain),
          }),
        },
      }),

      // === PROCESSING OPTIONS SECTION ===
      processingSection: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "csv.post.processingSection.title",
        description: "csv.post.processingSection.description",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          skipDuplicates: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "csv.post.skipDuplicates.label",
            description: "csv.post.skipDuplicates.description",
            schema: z.boolean().default(true),
          }),

          updateExisting: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "csv.post.updateExisting.label",
            description: "csv.post.updateExisting.description",
            schema: z.boolean().default(false),
          }),

          useChunkedProcessing: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "csv.post.useChunkedProcessing.label",
            description: "csv.post.useChunkedProcessing.description",
            schema: z.boolean().default(false),
          }),

          batchSize: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "csv.post.batchSize.label",
            description: "csv.post.batchSize.description",
            placeholder: "csv.post.batchSize.placeholder",
            schema: z.coerce.number().min(10).max(1000).default(100),
          }),
        },
      }),

      // === DEFAULT VALUES SECTION ===
      defaultsSection: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "csv.post.defaultsSection.title",
        description: "csv.post.defaultsSection.description",
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          defaultCountry: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "csv.post.defaultCountry.label",
            description: "csv.post.defaultCountry.description",
            placeholder: "csv.post.defaultCountry.placeholder",
            options: CountriesOptions,
            schema: z.enum(Countries).default(Countries.GLOBAL),
          }),

          defaultLanguage: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "csv.post.defaultLanguage.label",
            description: "csv.post.defaultLanguage.description",
            placeholder: "csv.post.defaultLanguage.placeholder",
            options: LanguagesOptions,
            schema: z.enum(Languages).default(Languages.EN),
          }),
        },
      }),

      // === RESPONSE DATA ===
      importResult: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "csv.post.response.title",
        description: "csv.post.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          // === BASIC RESULTS ===
          basicResults: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "csv.post.response.basicResults.title",
            description: "csv.post.response.basicResults.description",
            layoutType: LayoutType.STACKED,
            usage: { response: true },
            children: {
              batchId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.batchId.label",
                schema: z.uuid(),
              }),
              totalRows: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.totalRows.label",
                schema: z.coerce.number(),
              }),
              isChunkedProcessing: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.isChunkedProcessing.label",
                schema: z.boolean(),
              }),
              jobId: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.jobId.label",
                schema: z.uuid().optional(),
              }),
            },
          }),

          // === STATISTICS ===
          statistics: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "csv.post.response.statistics.title",
            description: "csv.post.response.statistics.description",
            layoutType: LayoutType.GRID,
            columns: 2,
            usage: { response: true },
            children: {
              successfulImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.successfulImports.label",
                schema: z.coerce.number(),
              }),
              failedImports: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.failedImports.label",
                schema: z.coerce.number(),
              }),
              duplicateEmails: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.duplicateEmails.label",
                schema: z.coerce.number(),
              }),
              processingTimeMs: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.processingTimeMs.label",
                schema: z.coerce.number().optional(),
              }),
            },
          }),

          // === DETAILED SUMMARY ===
          summary: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "csv.post.response.summary.title",
            description: "csv.post.response.summary.description",
            layoutType: LayoutType.GRID,
            columns: 3,
            usage: { response: true },
            children: {
              newRecords: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.newRecords.label",
                schema: z.coerce.number(),
              }),
              updatedRecords: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.updatedRecords.label",
                schema: z.coerce.number(),
              }),
              skippedDuplicates: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "csv.post.response.skippedDuplicates.label",
                schema: z.coerce.number(),
              }),
            },
          }),

          // === ERROR DETAILS ===
          errors: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "csv.post.response.errors.title",
              layoutType: LayoutType.STACKED,
              usage: { response: true },
              children: {
                row: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "csv.post.response.errors.row.label",
                  schema: z.coerce.number(),
                }),
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "csv.post.response.errors.email.label",
                  schema: z.string().optional(),
                }),
                error: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "csv.post.response.errors.error.label",
                  schema: z.string(),
                }),
              },
            }),
          }),

          // === NEXT STEPS ===
          nextSteps: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "csv.post.response.nextSteps.title",
            child: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "csv.post.response.nextSteps.item.label",
              schema: z.string(),
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "csv.post.errors.validation.title",
      description: "csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "csv.post.errors.network.title",
      description: "csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "csv.post.errors.unauthorized.title",
      description: "csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "csv.post.errors.forbidden.title",
      description: "csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "csv.post.errors.notFound.title",
      description: "csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "csv.post.errors.server.title",
      description: "csv.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "csv.post.errors.unknown.title",
      description: "csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "csv.post.errors.unsavedChanges.title",
      description: "csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "csv.post.errors.conflict.title",
      description: "csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "csv.post.success.title",
    description: "csv.post.success.description",
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
  scopedTranslation,
  method: Methods.GET,
  path: ["import", "jobs"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["import:jobs", "import-jobs-list"],

  title: "jobs.get.title",
  description: "jobs.get.description",
  icon: "file-text" as const,
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.jobs", "tags.status", "tags.history"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "jobs.get.form.title",
    description: "jobs.get.form.description",
    layoutType: LayoutType.GRID,
    columns: 2,
    usage: { request: "data", response: true },
    children: {
      // === FILTER OPTIONS ===
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "jobs.get.status.label",
        description: "jobs.get.status.description",
        placeholder: "jobs.get.status.placeholder",
        options: CsvImportJobStatusOptions,
        schema: z.enum(CsvImportJobStatus).optional(),
      }),

      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "jobs.get.limit.label",
        description: "jobs.get.limit.description",
        placeholder: "jobs.get.limit.placeholder",
        schema: z.coerce.number().min(1).max(100).default(20),
      }),

      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "jobs.get.offset.label",
        description: "jobs.get.offset.description",
        placeholder: "jobs.get.offset.placeholder",
        schema: z.coerce.number().min(0).default(0),
      }),

      // === RESPONSE DATA ===
      jobs: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "jobs.get.response.jobs.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "jobs.get.response.job.title",
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "jobs.get.response.job.id.label",
              schema: z.uuid(),
            }),
            fileName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "jobs.get.response.job.fileName.label",
              schema: z.string(),
            }),
            domain: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "jobs.get.response.job.domain.label",
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "jobs.get.response.job.status.label",
              schema: z.enum(CsvImportJobStatus),
            }),

            // === PROGRESS INFORMATION ===
            progress: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "jobs.get.response.job.progress.title",
              layoutType: LayoutType.GRID,
              columns: 2,
              usage: { response: true },
              children: {
                totalRows: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.progress.totalRows.label",
                  schema: z.coerce.number(),
                }),
                processedRows: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.progress.processedRows.label",
                  schema: z.coerce.number(),
                }),
                currentBatchStart: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "jobs.get.response.job.progress.currentBatchStart.label",
                  schema: z.coerce.number(),
                }),
                batchSize: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.progress.batchSize.label",
                  schema: z.coerce.number(),
                }),
                percentComplete: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "jobs.get.response.job.progress.percentComplete.label",
                  schema: z.coerce.number(),
                }),
              },
            }),

            // === RESULTS ===
            results: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "jobs.get.response.job.results.title",
              layoutType: LayoutType.GRID,
              columns: 3,
              usage: { response: true },
              children: {
                successfulImports: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "jobs.get.response.job.results.successfulImports.label",
                  schema: z.coerce.number(),
                }),
                failedImports: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.results.failedImports.label",
                  schema: z.coerce.number(),
                }),
                duplicateEmails: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content:
                    "jobs.get.response.job.results.duplicateEmails.label",
                  schema: z.coerce.number(),
                }),
              },
            }),

            // === TIMING INFORMATION ===
            timing: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "jobs.get.response.job.timing.title",
              layoutType: LayoutType.GRID,
              columns: 2,
              usage: { response: true },
              children: {
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.timing.createdAt.label",
                  schema: z.string(),
                }),
                updatedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.timing.updatedAt.label",
                  schema: z.string(),
                }),
                startedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.timing.startedAt.label",
                  schema: z.string().nullable(),
                }),
                completedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.timing.completedAt.label",
                  schema: z.string().nullable(),
                }),
              },
            }),

            // === ERROR HANDLING ===
            errorInfo: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "jobs.get.response.job.errorInfo.title",
              layoutType: LayoutType.STACKED,
              usage: { response: true },
              children: {
                error: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.errorInfo.error.label",
                  schema: z.string().nullable(),
                }),
                retryCount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.errorInfo.retryCount.label",
                  schema: z.coerce.number(),
                }),
                maxRetries: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "jobs.get.response.job.errorInfo.maxRetries.label",
                  schema: z.coerce.number(),
                }),
              },
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "csv.post.errors.validation.title",
      description: "csv.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "csv.post.errors.network.title",
      description: "csv.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "csv.post.errors.unauthorized.title",
      description: "csv.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "csv.post.errors.forbidden.title",
      description: "csv.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "csv.post.errors.notFound.title",
      description: "csv.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "jobs.get.errors.server.title",
      description: "jobs.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "csv.post.errors.unknown.title",
      description: "csv.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "csv.post.errors.unsavedChanges.title",
      description: "csv.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "csv.post.errors.conflict.title",
      description: "csv.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "jobs.get.success.title",
    description: "jobs.get.success.description",
  },

  examples: {
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
