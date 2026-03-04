/**
 * Conversation Path Endpoint Definition
 * Retrieves messages following a specific conversation path with branch metadata
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
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
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "arrow-right",
  category: "app.endpointCategories.chat",
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
        schema: z.enum(DefaultFolderId),
      }),
      branchIndices: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "get.branchIndices.label" as const,
        description: "get.branchIndices.description" as const,
        schema: z.record(z.string(), z.coerce.number()).optional(),
      }),
      before: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.before.label" as const,
        description: "get.before.description" as const,
        schema: z.string().uuid().optional(),
      }),

      // === RESPONSE ===
      messages: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.id.content" as const,
              schema: z.uuid(),
            }),
            threadId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.threadId.content" as const,
              schema: z.uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.role.content" as const,
              schema: z.enum(ChatMessageRole),
            }),
            content: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.content.content" as const,
              schema: z.string().nullable(),
            }),
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.parentId.content" as const,
              schema: z.uuid().nullable(),
            }),
            depth: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.depth.content" as const,
              schema: z.coerce.number(),
            }),
            sequenceId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.sequenceId.content" as const,
              schema: z.string().uuid().nullable(),
            }),
            authorId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.authorId.content" as const,
              schema: z.string().nullable(),
            }),
            authorName: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.authorName.content" as const,
              schema: z.string().nullable(),
            }),
            isAI: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.isAI.content" as const,
              schema: z.boolean(),
            }),
            model: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.messages.message.model.content" as const,
              schema: z.nativeEnum(ModelId).nullable(),
            }),
            character: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.character.content" as const,
              schema: z.string().nullable(),
            }),
            errorType: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorType.content" as const,
              schema: z.string().nullable(),
            }),
            errorMessage: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorMessage.content" as const,
              schema: z.string().nullable(),
            }),
            errorCode: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.errorCode.content" as const,
              schema: z.string().nullable(),
            }),
            metadata: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.metadata.content" as const,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              content: "get.response.messages.message.upvotes.content" as const,
              schema: z.number(),
            }),
            downvotes: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              content:
                "get.response.messages.message.downvotes.content" as const,
              schema: z.number(),
            }),
            searchVector: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.searchVector.content" as const,
              schema: z.string().nullable(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.createdAt.content" as const,
              schema: dateSchema,
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.messages.message.updatedAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
      branchMeta: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.branchMeta.item.title" as const,
          usage: { response: true },
          children: {
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.branchMeta.item.parentId.content" as const,
              schema: z.string(),
            }),
            siblingCount: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              content:
                "get.response.branchMeta.item.siblingCount.content" as const,
              schema: z.number(),
            }),
            currentIndex: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              content:
                "get.response.branchMeta.item.currentIndex.content" as const,
              schema: z.number(),
            }),
          },
        }),
      }),
      hasOlderHistory: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.hasOlderHistory.content" as const,
        schema: z.boolean(),
      }),
      oldestLoadedMessageId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.oldestLoadedMessageId.content" as const,
        schema: z.string().nullable(),
      }),
      compactionBoundaryId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.compactionBoundaryId.content" as const,
        schema: z.string().uuid().nullable(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // Route to client (localStorage) for incognito threads — caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
        branchIndices: {
          "660e8400-e29b-41d4-a716-446655440001": 0,
          "770e8400-e29b-41d4-a716-446655440002": 1,
        },
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
            depth: 0,
            sequenceId: null,
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: false,
            model: null,
            character: null,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            searchVector: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        branchMeta: [],
        hasOlderHistory: false,
        oldestLoadedMessageId: null,
        compactionBoundaryId: null,
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
