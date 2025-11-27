/**
 * Message Search API Definition
 * Defines endpoint for searching messages within a specific thread
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
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

import { ChatMessageRole } from "../../../../enum";

/**
 * Search Messages Endpoint (GET)
 * Search messages within a specific thread using full-text search
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: [
    "v1",
    "core",
    "agent",
    "chat",
    "threads",
    "[threadId]",
    "messages",
    "search",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.validationFailed.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.validationFailed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.serverError.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.errors.conflict.description",
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.success.description",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      query: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.query.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.query.description" as const,
        },
        z.string().min(1),
      ),

      pagination: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.sections.pagination.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.sections.pagination.description" as const,
          layoutType: LayoutType.GRID, columns: 2,
        },
        { request: "data" },
        {
          page: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.page.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.page.description" as const,
            },
            z.number().min(1).optional().default(1),
          ),
          limit: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.limit.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.limit.description" as const,
            },
            z.number().min(1).max(100).optional().default(20),
          ),
        },
      ),

      // === RESPONSE ===
      results: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.title" as const,
            layoutType: LayoutType.STACKED,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.id.content" as const,
              },
              z.uuid(),
            ),
            content: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.content.content" as const,
              },
              z.string(),
            ),
            role: responseField(
              {
                type: WidgetType.BADGE,
                text: "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.role.content" as const,
              },
              z.enum(ChatMessageRole),
            ),
            rank: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.rank.content" as const,
              },
              z.number(),
            ),
            headline: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.headline.content" as const,
              },
              z.string(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.results.message.createdAt.content" as const,
              },
              z.string().datetime(),
            ),
          },
        ),
      ),

      totalCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.messages.search.get.response.totalCount.content" as const,
        },
        z.number(),
      ),
    },
  ),

  examples: {
    urlPathParams: {
      default: {
        threadId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        query: "machine learning",
        pagination: {
          page: 1,
          limit: 20,
        },
      },
    },
    responses: {
      default: {
        results: [
          {
            id: "msg-123",
            content: "Let's discuss machine learning algorithms...",
            role: ChatMessageRole.USER,
            rank: 0.95,
            headline: "Let's discuss <b>machine learning</b> algorithms...",
            createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
          },
        ],
        totalCount: 1,
      },
    },
  },
});

/**
 * Export type definitions
 */
export type MessageSearchRequestOutput = typeof GET.types.RequestOutput;
export type MessageSearchResponseOutput = typeof GET.types.ResponseOutput;
export type MessageSearchUrlVariablesOutput =
  typeof GET.types.UrlVariablesOutput;

/**
 * Export definitions
 */
export default { GET };
