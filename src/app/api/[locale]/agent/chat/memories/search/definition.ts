/**
 * Memory Search API Definition
 * Defines GET endpoint for searching memories by content and tags
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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
import type { TParams } from "@/i18n/core/static-types";

import { scopedTranslation } from "./i18n";

/**
 * Memory Search Endpoint (GET)
 * Search memories by content using ILIKE, with optional tag filtering
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "memories", "search"],
  aliases: ["memories-search"] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "search.get.title" as const,
  description: "search.get.description" as const,
  dynamicTitle: ({
    request,
    response,
  }):
    | {
        message: "search.get.dynamicTitle" | "search.get.dynamicTitleWithCount";
        messageParams: TParams;
      }
    | undefined => {
    if (!request?.query) {
      return undefined;
    }
    const query =
      request.query.length > 30
        ? `${request.query.slice(0, 30)}...`
        : request.query;
    if (response?.results) {
      return {
        message: "search.get.dynamicTitleWithCount",
        messageParams: { query, count: response.results.length },
      };
    }
    return {
      message: "search.get.dynamicTitle",
      messageParams: { query },
    };
  },
  icon: "search",
  category: "endpointCategories.chatMemories",
  tags: ["tags.memories" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "search.get.container.title" as const,
    description: "search.get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST DATA ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.get.query.label" as const,
        description: "search.get.query.description" as const,
        schema: z.string().min(1),
      }),
      includeArchived: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "search.get.includeArchived.label" as const,
        description: "search.get.includeArchived.description" as const,
        schema: z.boolean().optional().default(false),
      }),
      tags: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "search.get.tags.label" as const,
        description: "search.get.tags.description" as const,
        schema: z.array(z.string()).optional(),
      }),

      // === RESPONSE ===
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "search.get.response.results.memory.title" as const,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            memoryNumber: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.memory.memoryNumber.text" as const,
              schema: z.coerce.number().int(),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.memory.content.content" as const,
              schema: z.string(),
            }),
            tags: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.string(),
              }),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.memory.priority.text" as const,
              schema: z.coerce.number(),
            }),
            isArchived: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.memory.isArchived.text" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.memory.createdAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),

      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "search.get.response.total.content" as const,
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
        query: "software engineer",
        includeArchived: false,
        tags: ["profession"],
      },
    },
    responses: {
      default: {
        results: [
          {
            memoryNumber: 0,
            content:
              "Profession: Senior Software Engineer specializing in TypeScript",
            tags: ["profession", "skills"],
            priority: 80,
            isArchived: false,
            createdAt: new Date("2025-01-01T00:00:00Z").toISOString(),
          },
        ],
        total: 1,
      },
    },
  },
});

/**
 * Export type definitions
 */
export type MemorySearchRequestOutput = typeof GET.types.RequestOutput;
export type MemorySearchResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
export default { GET };
