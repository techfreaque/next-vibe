/**
 * Import Jobs Status API Definition
 * List and monitor import jobs with filtering
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
  widgetField,
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
  CsvImportJobStatus,
  CsvImportJobStatusDB,
  CsvImportJobStatusOptions,
} from "../enum";
import { ImportStatusContainer } from "./widget";

/**
 * List Import Jobs Endpoint (GET)
 * Lists all import jobs with optional filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["leads", "import", "status"],
  title: "app.api.leads.import.status.get.title",
  description: "app.api.leads.import.status.get.description",
  category: "app.api.leads.category",
  tags: [
    "app.api.leads.tags.import",
    "app.api.leads.tags.jobs",
    "app.api.leads.tags.list",
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "activity",

  fields: customWidgetObject({
    render: ImportStatusContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({
        usage: { request: "data", response: true },
        inline: true,
      }),

      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "app.api.leads.import.status.get.actions.refresh" as const,
        loadingText:
          "app.api.leads.import.status.get.actions.refreshing" as const,
        icon: "refresh-cw",
        variant: "ghost",
        size: "sm",
        inline: true,
        usage: { request: "data", response: true },
      }),

      // === QUERY PARAMETERS ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.status.get.filters.title",
          description: "app.api.leads.import.status.get.filters.description",
          layoutType: LayoutType.GRID,
          columns: 3,
        },
        { request: "data" },
        {
          status: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.leads.import.status.get.status.label",
            description: "app.api.leads.import.status.get.status.description",
            placeholder: "app.api.leads.import.status.get.status.placeholder",
            columns: 4,
            options: CsvImportJobStatusOptions,
            schema: z.enum(CsvImportJobStatusDB).optional(),
          }),
          limit: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.leads.import.status.get.limit.label",
            description: "app.api.leads.import.status.get.limit.description",
            placeholder: "app.api.leads.import.status.get.limit.placeholder",
            columns: 4,
            schema: z.coerce.number().min(1).max(100).default(50).optional(),
          }),
          offset: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.leads.import.status.get.offset.label",
            description: "app.api.leads.import.status.get.offset.description",
            placeholder: "app.api.leads.import.status.get.offset.placeholder",
            columns: 4,
            schema: z.coerce.number().min(0).default(0).optional(),
          }),
        },
      ),

      // === RESPONSE FIELDS ===
      jobs: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.import.status.get.response.title",
          description: "app.api.leads.import.status.get.response.description",
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.CONTAINER,
              groupBy: "status",
              title: "app.api.leads.import.status.get.response.items.title",
              description:
                "app.api.leads.import.status.get.response.items.title",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.import.status.get.response.items.title",
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                // Job Identity
                id: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.uuid(),
                }),
                fileName: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string(),
                }),
                status: responseField({
                  type: WidgetType.BADGE,
                  text: "app.api.leads.import.status.get.response.items.title",
                  schema: z.enum(CsvImportJobStatusDB),
                }),

                // Progress Tracking
                totalRows: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number().nullable(),
                }),
                processedRows: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                successfulImports: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                failedImports: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                duplicateEmails: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Batch Processing
                currentBatchStart: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                batchSize: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Error Handling
                error: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
                retryCount: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),
                maxRetries: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.coerce.number(),
                }),

                // Timestamps
                createdAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string(),
                }),
                updatedAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string(),
                }),
                startedAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
                completedAt: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.leads.import.status.get.response.items.title",
                  schema: z.string().nullable(),
                }),
              },
            ),
          ),
        },
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.import.status.get.errors.validation.title",
      description:
        "app.api.leads.import.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.import.status.get.errors.unauthorized.title",
      description:
        "app.api.leads.import.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.import.status.get.errors.forbidden.title",
      description:
        "app.api.leads.import.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.import.status.get.errors.notFound.title",
      description:
        "app.api.leads.import.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.import.status.get.errors.server.title",
      description: "app.api.leads.import.status.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.import.status.get.errors.unknown.title",
      description: "app.api.leads.import.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.import.status.get.errors.network.title",
      description: "app.api.leads.import.status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.import.status.get.errors.unsavedChanges.title",
      description:
        "app.api.leads.import.status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.import.status.get.errors.conflict.title",
      description:
        "app.api.leads.import.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.leads.import.status.get.success.title",
    description: "app.api.leads.import.status.get.success.description",
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
              fileName: "app.api.leads.csv",
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
              fileName: "app.api.leads.csv",
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
