/**
 * Global Message Search API Definition
 * Defines endpoint for searching messages across all threads
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ChatMessageRole, ChatMessageRoleDB } from "../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Root folder IDs for filtering
 */
const rootFolderIds = ["private", "shared", "public", "cron"] as const;

/**
 * Global Message Search Endpoint (GET)
 * Search messages across all threads using full-text search
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "search-messages"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "search.get.title" as const,
  description: "search.get.description" as const,
  icon: "search",
  category: "app.endpointCategories.chat",
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "search.get.container.title" as const,
    description: "search.get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST DATA ===
      query: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "search.get.query.label" as const,
        description: "search.get.query.description" as const,
        schema: z.string().min(1),
      }),

      // === FILTERS ===
      filters: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "search.get.sections.filters.title" as const,
        description: "search.get.sections.filters.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          rootFolderId: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "search.get.rootFolderId.label" as const,
            description: "search.get.rootFolderId.description" as const,
            schema: z.enum(rootFolderIds).optional(),
          }),
          role: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "search.get.role.label" as const,
            description: "search.get.role.description" as const,
            schema: z.enum(ChatMessageRoleDB).optional(),
          }),
          startDate: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "search.get.startDate.label" as const,
            description: "search.get.startDate.description" as const,
            schema: z.string().datetime().optional(),
          }),
          endDate: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "search.get.endDate.label" as const,
            description: "search.get.endDate.description" as const,
            schema: z.string().datetime().optional(),
          }),
        },
      }),

      // === PAGINATION ===
      pagination: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "search.get.sections.pagination.title" as const,
        description: "search.get.sections.pagination.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          page: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "search.get.page.label" as const,
            description: "search.get.page.description" as const,
            schema: z.coerce.number().min(1).optional().default(1),
          }),
          limit: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "search.get.limit.label" as const,
            description: "search.get.limit.description" as const,
            schema: z.coerce.number().min(1).max(100).optional().default(10),
          }),
        },
      }),

      // === RESPONSE ===
      results: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "search.get.response.results.message.title" as const,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            messageId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.messageId.content" as const,
              schema: z.uuid(),
            }),
            threadId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.threadId.content" as const,
              schema: z.uuid(),
            }),
            threadTitle: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.threadTitle.content" as const,
              schema: z.string(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.message.role.content" as const,
              schema: z.enum(ChatMessageRole),
            }),
            headline: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.headline.content" as const,
              schema: z.string(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "search.get.response.results.message.createdAt.content" as const,
              schema: dateSchema,
            }),
            rootFolderId: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "search.get.response.results.message.rootFolderId.content" as const,
              schema: z.string(),
            }),
          },
        }),
      }),

      total: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "search.get.response.total.content" as const,
        schema: z.coerce.number(),
      }),

      page: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "search.get.response.page.content" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        query: "Tool execution failed",
        filters: {
          rootFolderId: "private",
          role: ChatMessageRole.ASSISTANT,
        },
        pagination: {
          page: 1,
          limit: 50,
        },
      },
    },
    responses: {
      default: {
        results: [
          {
            messageId: "123e4567-e89b-12d3-a456-426614174000",
            threadId: "223e4567-e89b-12d3-a456-426614174000",
            threadTitle: "Error Monitoring Thread",
            role: ChatMessageRole.ASSISTANT,
            headline: "...<b>Tool execution failed</b> with error code 500...",
            createdAt: new Date("2026-02-26T18:23:00Z").toISOString(),
            rootFolderId: "private",
          },
        ],
        total: 42,
        page: 1,
      },
    },
  },
});

/**
 * Export type definitions
 */
export type GlobalMessageSearchRequestOutput = typeof GET.types.RequestOutput;
export type GlobalMessageSearchResponseOutput = typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
export default { GET };
