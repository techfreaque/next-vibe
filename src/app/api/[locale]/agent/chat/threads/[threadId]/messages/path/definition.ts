/**
 * Conversation Path Endpoint Definition
 * Retrieves messages following a specific conversation path with branch metadata
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
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

import { DefaultFolderId } from "../../../../config";
import type { MessageMetadata } from "../../../../db";
import { ChatMessageRole } from "../../../../enum";
import { scopedTranslation } from "./i18n";

/**
 * Get Conversation Path Endpoint (GET)
 * Retrieves messages following a specific conversation path with branch metadata
 * Supports compaction-aware pagination via `before` cursor
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "path"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "arrow-right",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
        schema: z.enum(DefaultFolderId),
      }),
      leafMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.leafMessageId.label" as const,
        description: "get.leafMessageId.description" as const,
        schema: z.string().uuid().optional(),
      }),
      before: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.before.label" as const,
        description: "get.before.description" as const,
        schema: z.string().uuid().optional(),
      }),

      // === RESPONSE ===
      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.id.content" as const,
              schema: z.uuid(),
            }),
            threadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.threadId.content" as const,
              schema: z.uuid(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.role.content" as const,
              schema: z.enum(ChatMessageRole),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.content.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            sequenceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.sequenceId.content" as const,
              schema: z.string().uuid().nullable(),
            }),
            authorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.authorId.content" as const,
              schema: z.string().nullable(),
            }),
            authorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.authorName.content" as const,
              schema: z.string().nullable(),
            }),
            isAI: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.isAI.content" as const,
              schema: z.boolean(),
            }),
            model: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.model.content" as const,
              schema: z.nativeEnum(ModelId).nullable(),
            }),
            skill: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.skill.content" as const,
              schema: z.string().nullable(),
            }),
            errorType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorType.content" as const,
              schema: z.string().nullable(),
            }),
            errorMessage: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorMessage.content" as const,
              schema: z.string().nullable(),
            }),
            errorCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorCode.content" as const,
              schema: z.string().nullable(),
            }),
            metadata: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.metadata.content" as const,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              content: "get.response.messages.message.upvotes.content" as const,
              schema: z.number(),
            }),
            downvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              content:
                "get.response.messages.message.downvotes.content" as const,
              schema: z.number(),
            }),
            searchVector: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.searchVector.content" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      hasOlderHistory: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.hasOlderHistory.content" as const,
        schema: z.boolean(),
      }),
      hasNewerMessages: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.hasNewerMessages.content" as const,
        schema: z.boolean(),
      }),
      resolvedLeafMessageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.resolvedLeafMessageId.content" as const,
        schema: z.string().uuid().nullable(),
      }),
      oldestLoadedMessageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.oldestLoadedMessageId.content" as const,
        schema: z.string().nullable(),
      }),
      compactionBoundaryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.compactionBoundaryId.content" as const,
        schema: z.string().uuid().nullable(),
      }),
      newerChunkAnchorId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.newerChunkAnchorId.content" as const,
        schema: z.string().uuid().nullable(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // Route to client (localStorage) for incognito threads - caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
        leafMessageId: "660e8400-e29b-41d4-a716-446655440099",
      },
    },
    responses: {
      default: {
        messages: [
          {
            id: "660e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.USER,
            content: "Hello, how can you help me?",
            parentId: null,
            sequenceId: null,
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: false,
            model: null,
            skill: null,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            searchVector: null,
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z",
          },
        ],
        hasOlderHistory: false,
        hasNewerMessages: false,
        resolvedLeafMessageId: null,
        oldestLoadedMessageId: null,
        compactionBoundaryId: null,
        newerChunkAnchorId: null,
      },
    },
  },
});

/**
 * Export definitions
 */
export const definitions = { GET };

/**
 * Export type definitions
 */
export type PathGetRequestOutput = typeof GET.types.RequestOutput;
export type PathGetResponseOutput = typeof GET.types.ResponseOutput;
export type PathGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

export default definitions;
