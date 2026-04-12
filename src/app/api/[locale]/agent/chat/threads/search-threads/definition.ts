/**
 * Thread Search API Definition
 * Defines endpoint for full-text search across threads
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

import { ThreadStatus, ThreadStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Search Threads Endpoint (GET)
 * Full-text search across thread titles, previews, and system prompts
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "search-threads"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "search.get.title" as const,
  description: "search.get.description" as const,
  icon: "search",
  category: "endpointCategories.threads",
  subCategory: "endpointCategories.threadsSearch",
  tags: ["tags.threads" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "search.get.container.title" as const,
    description: "search.get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === SEARCH QUERY ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.get.query.label" as const,
        description: "search.get.query.description" as const,
        placeholder: "search.get.query.placeholder" as const,
        schema: z.string().min(1).max(500),
      }),

      // === PAGINATION ===
      pagination: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "search.get.sections.pagination.title" as const,
        description: "search.get.sections.pagination.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          page: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "search.get.page.label" as const,
            description: "search.get.page.description" as const,
            columns: 6,
            schema: z.coerce.number().min(1).optional().default(1),
          }),
          limit: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "search.get.limit.label" as const,
            description: "search.get.limit.description" as const,
            columns: 6,
            schema: z.coerce.number().min(1).max(100).optional().default(20),
          }),
        },
      }),

      // === SORT OPTIONS ===
      sortBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "search.get.sortBy.label" as const,
        description: "search.get.sortBy.description" as const,
        options: [
          {
            value: "relevance",
            label: "search.get.sortBy.options.relevance" as const,
          },
          {
            value: "date",
            label: "search.get.sortBy.options.date" as const,
          },
        ],
        schema: z.enum(["relevance", "date"]).optional().default("relevance"),
      }),

      // === FILTERS ===
      includeArchived: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "search.get.includeArchived.label" as const,
        description: "search.get.includeArchived.description" as const,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE ===
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label: "search.get.response.results.thread.id.label" as const,
              schema: z.uuid(),
            }),
            threadTitle: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "search.get.response.results.thread.title.label" as const,
              schema: z.string(),
            }),
            preview: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "search.get.response.results.thread.preview.label" as const,
              schema: z.string().nullable(),
            }),
            rank: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "search.get.response.results.thread.rank.label" as const,
              description:
                "search.get.response.results.thread.rank.description" as const,
              schema: z.coerce.number(),
            }),
            headline: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "search.get.response.results.thread.headline.label" as const,
              description:
                "search.get.response.results.thread.headline.description" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "search.get.response.results.thread.status.label" as const,
              options: ThreadStatusOptions,
              schema: z.enum(ThreadStatus),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "search.get.response.results.thread.createdAt.label" as const,
              schema: z.string(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "search.get.response.results.thread.updatedAt.label" as const,
              schema: z.string(),
            }),
          },
        }),
      }),

      totalResults: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "search.get.response.totalResults.label" as const,
        description: "search.get.response.totalResults.description" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "search.get.errors.validationFailed.title",
      description: "search.get.errors.validationFailed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "search.get.errors.network.title",
      description: "search.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "search.get.errors.unauthorized.title",
      description: "search.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "search.get.errors.forbidden.title",
      description: "search.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "search.get.errors.notFound.title",
      description: "search.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "search.get.errors.serverError.title",
      description: "search.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "search.get.errors.unknown.title",
      description: "search.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "search.get.errors.unsavedChanges.title",
      description: "search.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "search.get.errors.conflict.title",
      description: "search.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "search.get.success.title",
    description: "search.get.success.description",
  },

  examples: {
    requests: {
      default: {
        query: "machine learning",
        pagination: {
          page: 1,
          limit: 20,
        },
        sortBy: "relevance" as const,
        includeArchived: false,
      },
      success: {
        query: "machine learning",
        pagination: {
          page: 1,
          limit: 20,
        },
        sortBy: "relevance" as const,
        includeArchived: false,
      },
    },
    responses: {
      default: {
        results: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            threadTitle: "Machine Learning Discussion",
            preview: "Let's discuss machine learning algorithms...",
            rank: 0.95,
            headline:
              "<b>Machine learning</b> algorithms are powerful tools...",
            status: ThreadStatus.ACTIVE,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T14:20:00Z",
          },
        ],
        totalResults: 1,
      },
      success: {
        results: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            threadTitle: "Machine Learning Discussion",
            preview: "Let's discuss machine learning algorithms...",
            rank: 0.95,
            headline:
              "<b>Machine learning</b> algorithms are powerful tools...",
            status: ThreadStatus.ACTIVE,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T14:20:00Z",
          },
        ],
        totalResults: 1,
      },
    },
  },
});

export const definitions = { GET };
export type ThreadSearchGetRequestOutput = typeof GET.types.RequestOutput;
export type ThreadSearchGetResponseOutput = typeof GET.types.ResponseOutput;

export default definitions;
