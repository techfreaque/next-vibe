/**
 * Import Jobs Status API Definition
 * List and monitor import jobs with filtering
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
  widgetField,
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
  CsvImportJobStatus,
  CsvImportJobStatusDB,
  CsvImportJobStatusOptions,
} from "../enum";
import { scopedTranslation } from "../i18n";
import { ImportStatusContainer } from "./widget";

/**
 * List Import Jobs Endpoint (GET)
 * Lists all import jobs with optional filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "import", "status"],
  title: "status.get.title",
  description: "status.get.description",
  category: "app.endpointCategories.leads",
  tags: ["tags.import", "status.tags.jobs", "status.tags.list"],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "activity",

  fields: customWidgetObject({
    render: ImportStatusContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
        inline: true,
      }),

      submitButton: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "status.get.actions.refresh",
        loadingText: "status.get.actions.refreshing",
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
        inline: true,
        usage: { request: "data", response: true },
      }),

      // === QUERY PARAMETERS ===
      filters: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "status.get.filters.title",
        description: "status.get.filters.description",
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { request: "data" },
        children: {
          status: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "status.get.status.label",
            description: "status.get.status.description",
            placeholder: "status.get.status.placeholder",
            columns: 4,
            options: CsvImportJobStatusOptions,
            schema: z.enum(CsvImportJobStatusDB).optional(),
          }),
          limit: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "status.get.limit.label",
            description: "status.get.limit.description",
            placeholder: "status.get.limit.placeholder",
            columns: 4,
            schema: z.coerce.number().min(1).max(100).default(50).optional(),
          }),
          offset: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "status.get.offset.label",
            description: "status.get.offset.description",
            placeholder: "status.get.offset.placeholder",
            columns: 4,
            schema: z.coerce.number().min(0).default(0).optional(),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      jobs: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "status.get.response.title",
        description: "status.get.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          items: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            groupBy: "status",
            title: "status.get.response.items.title",
            description: "status.get.response.items.title",
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "status.get.response.items.title",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                // Job Identity
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.uuid(),
                }),
                fileName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string(),
                }),
                status: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "status.get.response.items.title",
                  schema: z.enum(CsvImportJobStatusDB),
                }),

                // Progress Tracking
                totalRows: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number().nullable(),
                }),
                processedRows: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                successfulImports: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                failedImports: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                duplicateEmails: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Batch Processing
                currentBatchStart: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                batchSize: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Error Handling
                error: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
                retryCount: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                maxRetries: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Timestamps
                createdAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string(),
                }),
                updatedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string(),
                }),
                startedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
                completedAt: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "status.get.errors.validation.title",
      description: "status.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "status.get.errors.unauthorized.title",
      description: "status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "status.get.errors.forbidden.title",
      description: "status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "status.get.errors.notFound.title",
      description: "status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "status.get.errors.server.title",
      description: "status.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "status.get.errors.unknown.title",
      description: "status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "status.get.errors.network.title",
      description: "status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "status.get.errors.unsavedChanges.title",
      description: "status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "status.get.errors.conflict.title",
      description: "status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "status.get.success.title",
    description: "status.get.success.description",
  },

  examples: {
    requests: {
      default: {
        filters: {},
      },
      all: {
        filters: {
          status: CsvImportJobStatus.COMPLETED,
          limit: 100,
          offset: 0,
        },
      },
    },
    responses: {
      default: {
        jobs: {
          items: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              fileName: "csv",
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
      all: {
        jobs: {
          items: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              fileName: "csv",
              status: CsvImportJobStatus.COMPLETED,
              totalRows: 100,
              processedRows: 100,
              successfulImports: 95,
              failedImports: 5,
              duplicateEmails: 2,
              currentBatchStart: 100,
              batchSize: 100,
              error: null,
              retryCount: 0,
              maxRetries: 3,
              createdAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T10:35:00Z",
              startedAt: "2024-01-15T10:30:00Z",
              completedAt: "2024-01-15T10:35:00Z",
            },
          ],
        },
      },
    },
  },
});

// Export types following modern pattern
export type ImportJobsStatusGetRequestInput = typeof GET.types.RequestInput;
export type ImportJobsStatusGetRequestOutput = typeof GET.types.RequestOutput;
export type ImportJobsStatusGetResponseInput = typeof GET.types.ResponseInput;
export type ImportJobsStatusGetResponseOutput = typeof GET.types.ResponseOutput;

// Repository types for standardized import patterns
export type ImportJobsListRequestInput = ImportJobsStatusGetRequestInput;
export type ImportJobsListRequestOutput = ImportJobsStatusGetRequestOutput;
export type ImportJobsListResponseInput = ImportJobsStatusGetResponseInput;
export type ImportJobsListResponseOutput = ImportJobsStatusGetResponseOutput;

/**
 * Export definitions
 */

const definitions = {
  GET,
} as const;

export default definitions;
