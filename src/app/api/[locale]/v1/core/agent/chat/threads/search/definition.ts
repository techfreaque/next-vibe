/**
 * Thread Search API Definition
 * Defines endpoint for full-text search across threads
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ThreadStatus, ThreadStatusOptions } from "../../enum";

/**
 * Search Threads Endpoint (GET)
 * Full-text search across thread titles, previews, and system prompts
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "chat", "threads", "search"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.v1.core.agent.chat.threads.search.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.search.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.search.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.search.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === SEARCH QUERY ===
      query: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.search.get.query.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.query.description" as const,
          placeholder:
            "app.api.v1.core.agent.chat.threads.search.get.query.placeholder" as const,
          required: true,
        },
        z.string().min(1).max(500),
      ),

      // === PAGINATION ===
      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.search.get.sections.pagination.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.sections.pagination.description" as const,
          layout: { type: LayoutType.GRID, columns: 2 },
        },
        { request: "data" },
        {
          page: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.agent.chat.threads.search.get.page.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.search.get.page.description" as const,
              layout: { columns: 6 },
            },
            z.number().min(1).optional().default(1),
          ),
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.agent.chat.threads.search.get.limit.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.search.get.limit.description" as const,
              layout: { columns: 6 },
            },
            z.number().min(1).max(100).optional().default(20),
          ),
        },
      ),

      // === SORT OPTIONS ===
      sortBy: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.threads.search.get.sortBy.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.sortBy.description" as const,
          options: [
            {
              value: "relevance",
              label:
                "app.api.v1.core.agent.chat.threads.search.get.sortBy.options.relevance" as const,
            },
            {
              value: "date",
              label:
                "app.api.v1.core.agent.chat.threads.search.get.sortBy.options.date" as const,
            },
          ],
        },
        z.enum(["relevance", "date"]).optional().default("relevance"),
      ),

      // === FILTERS ===
      includeArchived: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.chat.threads.search.get.includeArchived.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.includeArchived.description" as const,
        },
        z.boolean().optional().default(false),
      ),

      // === RESPONSE ===
      results: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layout: { type: LayoutType.STACKED },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.UUID,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.id.label" as const,
              },
              z.uuid(),
            ),
            threadTitle: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.title.label" as const,
              },
              z.string(),
            ),
            preview: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXTAREA,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.preview.label" as const,
              },
              z.string().nullable(),
            ),
            rank: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.rank.label" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.rank.description" as const,
              },
              z.number(),
            ),
            headline: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXTAREA,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.headline.label" as const,
                description:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.headline.description" as const,
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.status.label" as const,
                options: ThreadStatusOptions,
              },
              z.enum(ThreadStatus),
            ),
            createdAt: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.createdAt.label" as const,
              },
              z.string(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.v1.core.agent.chat.threads.search.get.response.results.thread.updatedAt.label" as const,
              },
              z.string(),
            ),
          },
        ),
      ),

      totalResults: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.agent.chat.threads.search.get.response.totalResults.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.search.get.response.totalResults.description" as const,
        },
        z.number(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.validationFailed.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.validationFailed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.serverError.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.search.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.search.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.threads.search.get.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.search.get.success.description",
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
