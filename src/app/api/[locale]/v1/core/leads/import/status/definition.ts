/**
 * Import Jobs Status API Definition
 * List and monitor import jobs with filtering
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

import { CsvImportJobStatus, CsvImportJobStatusOptions } from "../enum";

/**
 * List Import Jobs Endpoint (GET)
 * Lists all import jobs with optional filtering
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "import", "status"],
  title: "app.api.v1.core.leads.import.status.get.title",
  description: "app.api.v1.core.leads.import.status.get.description",
  category: "app.api.v1.core.leads.category",
  tags: [
    "app.api.v1.core.leads.tags.import",
    "app.api.v1.core.leads.tags.jobs",
    "app.api.v1.core.leads.tags.list",
  ],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.leads.import.status.get.form.title",
      description: "app.api.v1.core.leads.import.status.get.form.description",
      layout: { type: LayoutType.STACKED },
      children: [],
    },
    { request: "urlParams", response: true },
    {
      // === QUERY PARAMETERS ===
      filters: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.leads.import.status.get.filters.title",
          description:
            "app.api.v1.core.leads.import.status.get.filters.description",
          layout: { type: LayoutType.GRID, columns: 3 },
          children: [],
        },
        { request: "urlParams" },
        {
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.v1.core.leads.import.status.get.status.label",
              description:
                "app.api.v1.core.leads.import.status.get.status.description",
              placeholder:
                "app.api.v1.core.leads.import.status.get.status.placeholder",
              layout: { columns: 4 },
              options: CsvImportJobStatusOptions,
            },
            z.enum(CsvImportJobStatus).optional(),
          ),
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.leads.import.status.get.limit.label",
              description:
                "app.api.v1.core.leads.import.status.get.limit.description",
              placeholder:
                "app.api.v1.core.leads.import.status.get.limit.placeholder",
              layout: { columns: 4 },
              validation: { min: 1, max: 100 },
            },
            z.coerce.number().min(1).max(100).default(50).optional(),
          ),
          offset: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.v1.core.leads.import.status.get.offset.label",
              description:
                "app.api.v1.core.leads.import.status.get.offset.description",
              placeholder:
                "app.api.v1.core.leads.import.status.get.offset.placeholder",
              layout: { columns: 4 },
              validation: { min: 0 },
            },
            z.coerce.number().min(0).default(0).optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      jobs: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.leads.import.status.get.response.title",
          description:
            "app.api.v1.core.leads.import.status.get.response.description",
          layout: { type: LayoutType.STACKED },
          children: [],
        },
        { response: true },
        {
          items: responseField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "status",
            },
            z.array(
              z.object({
                // Job Identity
                id: z.uuid(),
                fileName: z.string(),
                status: z.enum(CsvImportJobStatus),

                // Progress Tracking
                totalRows: z.number().nullable(),
                processedRows: z.number(),
                successfulImports: z.number(),
                failedImports: z.number(),
                duplicateEmails: z.number(),

                // Batch Processing
                currentBatchStart: z.number(),
                batchSize: z.number(),

                // Error Handling
                error: z.string().nullable(),
                retryCount: z.number(),
                maxRetries: z.number(),

                // Timestamps
                createdAt: z.string(),
                updatedAt: z.string(),
                startedAt: z.string().nullable(),
                completedAt: z.string().nullable(),
              }),
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.leads.import.status.get.errors.validation.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.import.status.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.leads.import.status.get.errors.forbidden.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.leads.import.status.get.errors.notFound.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.leads.import.status.get.errors.server.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.leads.import.status.get.errors.unknown.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.leads.import.status.get.errors.network.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.import.status.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.leads.import.status.get.errors.conflict.title",
      description:
        "app.api.v1.core.leads.import.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.leads.import.status.get.success.title",
    description: "app.api.v1.core.leads.import.status.get.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: {
      default: {
        filters: {
          status: CsvImportJobStatus.PROCESSING,
          limit: 10,
          offset: 0,
        },
      },
      all: {
        filters: {
          limit: 50,
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
              fileName: "app.api.v1.core.leads.csv",
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
export { GET };

const definitions = {
  GET,
} as const;

export default definitions;
