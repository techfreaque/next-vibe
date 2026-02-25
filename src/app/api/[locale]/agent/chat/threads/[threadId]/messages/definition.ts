/**
 * Chat Messages API Definition
 * Defines endpoints for listing and creating messages in a thread
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

import type { MessageMetadata } from "../../../db";
import { ChatMessageRole } from "../../../enum";
import { scopedTranslation } from "./i18n";

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
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "message-circle",
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
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      messages: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.messages.message.title" as const,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            threadId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            role: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.enum(ChatMessageRole),
            }),
            content: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            parentId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            depth: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            sequenceId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            authorId: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            isAI: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            model: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.string().nullable(),
            }),
            character: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorType: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorMessage: scopedResponseField(scopedTranslation, {
              type: WidgetType.ALERT,
              schema: z.string().nullable(),
            }),
            errorCode: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            metadata: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            downvotes: scopedResponseField(scopedTranslation, {
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            searchVector: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
            updatedAt: scopedResponseField(scopedTranslation, {
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

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
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
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            isAI: false,
            model: null,
            character: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "770e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            role: ChatMessageRole.ASSISTANT,
            content: "I can help you with various tasks!",
            parentId: "660e8400-e29b-41d4-a716-446655440000",
            depth: 1,
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            isAI: true,
            model: "gpt-4o",
            character: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            searchVector: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chat",
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

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title" as const,
    description: "post.form.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.threadId.label" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      id: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.id.label" as const,
        description: "post.id.description" as const,
        schema: z.string().uuid().optional(),
      }),
      role: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label" as const,
        description: "post.role.description" as const,
        options: [
          {
            value: ChatMessageRole.USER,
            label: "enums.role.user" as const,
          },
        ],
        schema: z
          .literal(ChatMessageRole.USER)
          .optional()
          .default(ChatMessageRole.USER),
      }),
      content: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        schema: z.string().min(1),
      }),
      parentId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.parentId.label" as const,
        description: "post.parentId.description" as const,
        schema: z.string().uuid().optional(),
      }),
      model: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.model.label" as const,
        description: "post.model.description" as const,
        schema: z.enum(ModelId).optional(),
      }),
      metadata: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.metadata.label" as const,
        description: "post.metadata.description" as const,
        schema: z.custom<MessageMetadata>().optional(),
      }),

      // === RESPONSE ===
      messageId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
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

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        id: "770e8400-e29b-41d4-a716-446655440000",
        role: ChatMessageRole.USER,
        content: "Hello, how can you help me?",
      },
    },
    responses: {
      default: {
        messageId: "660e8400-e29b-41d4-a716-446655440000",
        createdAt: new Date().toISOString(),
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

/**
 * Export definitions
 */
export default { GET, POST } as const;
