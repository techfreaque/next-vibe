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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ThreadStatus, ThreadStatusOptions } from "../../enum";

/**
 * Search Threads Endpoint (GET)
 * Full-text search across thread titles, previews, and system prompts
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "threads", "search"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.search.get.title" as const,
  description: "app.api.agent.chat.threads.search.get.description" as const,
  icon: "search",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.threads.search.get.container.title" as const,
      description:
        "app.api.agent.chat.threads.search.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === SEARCH QUERY ===
      query: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.agent.chat.threads.search.get.query.label" as const,
        description:
          "app.api.agent.chat.threads.search.get.query.description" as const,
        placeholder:
          "app.api.agent.chat.threads.search.get.query.placeholder" as const,
        schema: z.string().min(1).max(500),
      }),

      // === PAGINATION ===
      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.search.get.sections.pagination.title" as const,
          description:
            "app.api.agent.chat.threads.search.get.sections.pagination.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          page: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.agent.chat.threads.search.get.page.label" as const,
            description:
              "app.api.agent.chat.threads.search.get.page.description" as const,
            columns: 6,
            schema: z.coerce.number().min(1).optional().default(1),
          }),
          limit: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.agent.chat.threads.search.get.limit.label" as const,
            description:
              "app.api.agent.chat.threads.search.get.limit.description" as const,
            columns: 6,
            schema: z.coerce.number().min(1).max(100).optional().default(20),
          }),
        },
      ),

      // === SORT OPTIONS ===
      sortBy: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.agent.chat.threads.search.get.sortBy.label" as const,
        description:
          "app.api.agent.chat.threads.search.get.sortBy.description" as const,
        options: [
          {
            value: "relevance",
            label:
              "app.api.agent.chat.threads.search.get.sortBy.options.relevance" as const,
          },
          {
            value: "date",
            label:
              "app.api.agent.chat.threads.search.get.sortBy.options.date" as const,
          },
        ],
        schema: z.enum(["relevance", "date"]).optional().default("relevance"),
      }),

      // === FILTERS ===
      includeArchived: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.agent.chat.threads.search.get.includeArchived.label" as const,
        description:
          "app.api.agent.chat.threads.search.get.includeArchived.description" as const,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE ===
      results: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.STACKED,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.id.label" as const,
              schema: z.uuid(),
            }),
            threadTitle: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.title.label" as const,
              schema: z.string(),
            }),
            preview: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.preview.label" as const,
              schema: z.string().nullable(),
            }),
            rank: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.rank.label" as const,
              description:
                "app.api.agent.chat.threads.search.get.response.results.thread.rank.description" as const,
              schema: z.coerce.number(),
            }),
            headline: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.headline.label" as const,
              description:
                "app.api.agent.chat.threads.search.get.response.results.thread.headline.description" as const,
              schema: z.string(),
            }),
            status: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.status.label" as const,
              options: ThreadStatusOptions,
              schema: z.enum(ThreadStatus),
            }),
            createdAt: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.createdAt.label" as const,
              schema: z.string(),
            }),
            updatedAt: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.agent.chat.threads.search.get.response.results.thread.updatedAt.label" as const,
              schema: z.string(),
            }),
          },
        ),
      ),

      totalResults: responseField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.agent.chat.threads.search.get.response.totalResults.label" as const,
        description:
          "app.api.agent.chat.threads.search.get.response.totalResults.description" as const,
        schema: z.coerce.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.search.get.errors.validationFailed.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.validationFailed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.threads.search.get.errors.network.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.threads.search.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.threads.search.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.threads.search.get.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.threads.search.get.errors.serverError.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.threads.search.get.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.threads.search.get.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.search.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.threads.search.get.success.title",
    description: "app.api.agent.chat.threads.search.get.success.description",
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
