/**
 * Chat Messages API Definition
 * Defines endpoints for listing and creating messages in a thread
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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

import { DefaultFolderId } from "../../../config";
import type { MessageMetadata } from "../../../db";
import { ChatMessageRole } from "../../../enum";
import { scopedTranslation } from "./i18n";
import { MessagesWidget } from "./widget/widget";

/**
 * Get Messages List Endpoint (GET)
 * Retrieves all messages in a thread
 *
 * Note: PUBLIC role is allowed for anonymous users to view public threads
 * The repository layer filters results based on thread permissions
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  // WebSocket events for real-time message streaming.
  // Emitted by ai-stream repository, consumed by clients subscribed to this channel.
  // All 16 StreamEventType events — kebab-case keys match enqueue() directly.
  events: {
    "message-created": z.object({
      messageId: z.string(),
      threadId: z.string(),
      role: z.string(),
      parentId: z.string().nullable(),
      content: z.string().nullable(),
      model: z.string().nullable(),
      character: z.string().nullable(),
      sequenceId: z.string().nullable().optional(),
      toolCall: z
        .object({
          toolCallId: z.string(),
          toolName: z.string(),
          args: z.unknown(),
          result: z.unknown().optional(),
          error: z.record(z.string(), z.unknown()).optional(),
          executionTime: z.number().optional(),
          creditsUsed: z.number().optional(),
          requiresConfirmation: z.boolean().optional(),
          isConfirmed: z.boolean().optional(),
          waitingForConfirmation: z.boolean().optional(),
        })
        .optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
    "content-delta": z.object({
      messageId: z.string(),
      delta: z.string(),
    }),
    "content-done": z.object({
      messageId: z.string(),
      content: z.string(),
      totalTokens: z.number().nullable(),
      finishReason: z.string().nullable(),
    }),
    "reasoning-delta": z.object({
      messageId: z.string(),
      delta: z.string(),
    }),
    "reasoning-done": z.object({
      messageId: z.string(),
      content: z.string(),
    }),
    "tool-call": z.object({
      messageId: z.string(),
      toolName: z.string(),
      args: z.unknown(),
    }),
    "tool-waiting": z.object({
      messageId: z.string(),
      toolName: z.string(),
      toolCallId: z.string(),
    }),
    "tool-result": z.object({
      messageId: z.string(),
      toolName: z.string(),
      result: z.unknown().optional(),
      error: z.record(z.string(), z.unknown()).optional(),
      toolCall: z
        .object({
          toolCallId: z.string(),
          toolName: z.string(),
          args: z.unknown(),
          result: z.unknown().optional(),
          error: z.record(z.string(), z.unknown()).optional(),
          executionTime: z.number().optional(),
          creditsUsed: z.number().optional(),
          requiresConfirmation: z.boolean().optional(),
          isConfirmed: z.boolean().optional(),
          waitingForConfirmation: z.boolean().optional(),
        })
        .optional(),
    }),
    error: z.object({
      success: z.literal(false),
      message: z.string(),
      messageParams: z.record(z.string(), z.unknown()).optional(),
      errorType: z.object({
        errorKey: z.string(),
        errorCode: z.number(),
      }),
      cause: z.unknown().optional(),
    }),
    "voice-transcribed": z.object({
      messageId: z.string(),
      text: z.string(),
      confidence: z.number().nullable(),
      durationSeconds: z.number().nullable(),
    }),
    "audio-chunk": z.object({
      messageId: z.string(),
      audioData: z.string(),
      chunkIndex: z.number(),
      isFinal: z.boolean(),
      text: z.string(),
    }),
    "files-uploaded": z.object({
      messageId: z.string(),
      attachments: z.array(
        z.object({
          id: z.string(),
          url: z.string(),
          filename: z.string(),
          mimeType: z.string(),
          size: z.number(),
        }),
      ),
    }),
    "credits-deducted": z.object({
      amount: z.number(),
      feature: z.string(),
      type: z.enum(["tool", "model"]),
      partial: z.boolean().optional(),
    }),
    "tokens-updated": z.object({
      messageId: z.string(),
      promptTokens: z.number(),
      completionTokens: z.number(),
      totalTokens: z.number(),
      finishReason: z.string().nullable(),
      creditCost: z.number(),
    }),
    "compacting-delta": z.object({
      messageId: z.string(),
      delta: z.string(),
    }),
    "compacting-done": z.object({
      messageId: z.string(),
      content: z.string(),
      metadata: z.object({
        isCompacting: z.literal(true),
        compactedMessageCount: z.number(),
      }),
    }),
    // Thread metadata update
    "thread-title-updated": z.object({
      threadId: z.string(),
      title: z.string(),
    }),
    // Stream lifecycle — definitive "stream is completely done" signal
    "stream-finished": z.object({
      threadId: z.string(),
      reason: z.enum(["completed", "cancelled", "error", "timeout"]),
    }),
  },

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

  fields: customWidgetObject({
    render: MessagesWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    noFormElement: true,
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
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
        includeInCacheKey: true,
      }),
      leafMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.leafMessageId.label" as const,
        description: "get.leafMessageId.description" as const,
        columns: 3,
        schema: z.uuid().nullable().optional(),
      }),

      // === RESPONSE ===
      messages: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            threadId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.enum(ChatMessageRole),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            parentId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            sequenceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            authorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            authorName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            isAI: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            model: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.nativeEnum(ModelId).nullable(),
            }),
            skill: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorMessage: responseField(scopedTranslation, {
              type: WidgetType.ALERT,
              schema: z.string().nullable(),
            }),
            errorCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            metadata: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            downvotes: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            searchVector: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
          },
        }),
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
      default: { rootFolderId: DefaultFolderId.PRIVATE },
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
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: false,
            model: null,
            skill: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z",
          },
          {
            id: "770e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.ASSISTANT,
            content: "I can help you with various tasks!",
            parentId: "660e8400-e29b-41d4-a716-446655440000",
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            authorName: null,
            isAI: true,
            model: ModelId.GPT_5,
            skill: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z",
          },
        ],
      },
    },
  },
});

/**
 * Create Message Endpoint (POST)
 * Creates a new message in a thread
 *
 * Note: PUBLIC role is allowed for anonymous users to respond in threads
 * The repository layer validates thread access and permissions
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.threadId.label" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label" as const,
        description: "post.rootFolderId.description" as const,
        columns: 6,
        schema: z.enum(DefaultFolderId),
      }),
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.id.label" as const,
        description: "post.id.description" as const,
        schema: z.string().uuid().optional(),
      }),
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label" as const,
        description: "post.role.description" as const,
        options: [
          {
            value: ChatMessageRole.USER,
            label: "enums.role.user" as const,
          },
          {
            value: ChatMessageRole.ASSISTANT,
            label: "enums.role.assistant" as const,
          },
        ],
        schema: z
          .enum([ChatMessageRole.USER, ChatMessageRole.ASSISTANT])
          .optional()
          .default(ChatMessageRole.USER),
      }),
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        schema: z.string().min(1),
      }),
      parentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.parentId.label" as const,
        description: "post.parentId.description" as const,
        schema: z.string().uuid().optional(),
      }),
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.model.label" as const,
        description: "post.model.description" as const,
        schema: z.enum(ModelId).optional(),
      }),
      skill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.skill.label" as const,
        description: "post.skill.description" as const,
        schema: z.string().optional(),
      }),
      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.metadata.label" as const,
        description: "post.metadata.description" as const,
        schema: z.custom<MessageMetadata>().optional(),
      }),

      // === RESPONSE ===
      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message.createdAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        id: "770e8400-e29b-41d4-a716-446655440000",
        role: ChatMessageRole.USER,
        content: "Hello, how can you help me?",
      },
    },
    responses: {
      default: {
        messageId: "660e8400-e29b-41d4-a716-446655440000",
        createdAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Export types
 */
export type MessageListRequestOutput = typeof GET.types.RequestOutput;
export type MessageListUrlParamsTypeOutput =
  typeof GET.types.UrlVariablesOutput;
export type MessageListResponseOutput = typeof GET.types.ResponseOutput;

export type MessageCreateRequestOutput = typeof POST.types.RequestOutput;
export type MessageCreateUrlParamsTypeOutput =
  typeof POST.types.UrlVariablesOutput;
export type MessageCreateResponseOutput = typeof POST.types.ResponseOutput;

// Extract WS event types for typed emit/subscribe — owned by messages, used by ai-stream
export type MessagesWsEvents = typeof GET.types.Events;

/**
 * Export definitions
 */
export default { GET, POST } as const;
