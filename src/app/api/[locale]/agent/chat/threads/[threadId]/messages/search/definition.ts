/**
 * Message Search API Definition
 * Defines endpoint for searching messages within a specific thread
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
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

import { ChatMessageRole } from "../../../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Search Messages Endpoint (GET)
 * Search messages within a specific thread using full-text search
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "search"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "search.get.title" as const,
  description: "search.get.description" as const,
  icon: "search",
  category: "endpointCategories.messages",
  subCategory: "endpointCategories.messagesSearch",
  tags: ["tags.messages" as const],

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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "search.get.container.title" as const,
    description: "search.get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "search.get.threadId.label" as const,
        description: "search.get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.get.query.label" as const,
        description: "search.get.query.description" as const,
        schema: z.string().min(1),
      }),

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
            schema: z.coerce.number().min(1).optional().default(1),
          }),
          limit: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "search.get.limit.label" as const,
            description: "search.get.limit.description" as const,
            schema: z.coerce.number().min(1).max(100).optional().default(20),
          }),
        },
      }),

      // === RESPONSE ===
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "search.get.response.results.message.title" as const,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.id.content" as const,
              schema: z.uuid(),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.content.content" as const,
              schema: z.string().nullable(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.message.role.content" as const,
              schema: z.enum(ChatMessageRole),
            }),
            rank: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.rank.content" as const,
              schema: z.coerce.number(),
            }),
            headline: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.headline.content" as const,
              schema: z.string(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.createdAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),

      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "search.get.response.totalCount.content" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

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
