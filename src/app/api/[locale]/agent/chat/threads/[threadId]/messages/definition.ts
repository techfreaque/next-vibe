/**
 * Chat Messages API Definition
 * Defines endpoints for listing and creating messages in a thread
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  requestField,
  requestUrlPathParamsField,
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

import type { MessageMetadata } from "../../../db";
import { ChatMessageRole } from "../../../enum";

/**
 * Get Messages List Endpoint (GET)
 * Retrieves all messages in a thread
 *
 * Note: PUBLIC role is allowed for anonymous users to view public threads
 * The repository layer filters results based on thread permissions
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.messages.get.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.messages.get.description" as const,
  icon: "message-circle",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.get.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.get.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.messages.get.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.messages.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.messages.get.threadId.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.messages.get.threadId.description" as const,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      messages: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.agent.chat.threads.threadId.messages.get.response.messages.message.title" as const,
          },
          { response: true },
          {
            id: responseField({
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            threadId: responseField({
              type: WidgetType.TEXT,
              schema: z.string().uuid(),
            }),
            role: responseField({
              type: WidgetType.BADGE,
              schema: z.enum(ChatMessageRole),
            }),
            content: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            parentId: responseField({
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            depth: responseField({
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            sequenceId: responseField({
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            authorId: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            authorName: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            authorAvatar: responseField({
              type: WidgetType.ICON,
              schema: z.string().nullable(),
            }),
            authorColor: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            isAI: responseField({
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            model: responseField({
              type: WidgetType.BADGE,
              schema: z.string().nullable(),
            }),
            character: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorType: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            errorMessage: responseField({
              type: WidgetType.ALERT,
              schema: z.string().nullable(),
            }),
            errorCode: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            edited: responseField({
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            originalId: responseField({
              type: WidgetType.TEXT,
              schema: z.string().uuid().nullable(),
            }),
            tokens: responseField({
              type: WidgetType.STAT,
              schema: z.number().nullable(),
            }),
            metadata: responseField({
              type: WidgetType.TEXT,
              schema: z.custom<MessageMetadata>().nullable(),
            }),
            upvotes: responseField({
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            downvotes: responseField({
              type: WidgetType.STAT,
              schema: z.number(),
            }),
            searchVector: responseField({
              type: WidgetType.TEXT,
              schema: z.string().nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
            updatedAt: responseField({
              type: WidgetType.TEXT,
              schema: dateSchema,
            }),
          },
        ),
      ),
    },
  ),

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.messages.get.success.title",
    description:
      "app.api.agent.chat.threads.threadId.messages.get.success.description",
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
            authorName: "User",
            authorAvatar: null,
            authorColor: null,
            isAI: false,
            model: null,
            character: null,
            tokens: null,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            edited: false,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            originalId: null,
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
            authorName: "Assistant",
            authorAvatar: null,
            authorColor: null,
            isAI: true,
            model: "gpt-4o",
            character: null,
            tokens: 150,
            sequenceId: null,
            metadata: null,
            upvotes: 0,
            downvotes: 0,
            edited: false,
            errorType: null,
            errorMessage: null,
            errorCode: null,
            originalId: null,
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
  method: Methods.POST,
  path: ["agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.messages.post.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.messages.post.description" as const,
  icon: "message-circle",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.threads.threadId.messages.post.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.messages.post.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.messages.post.form.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.messages.post.form.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.agent.chat.threads.threadId.messages.post.threadId.label" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.messages.post.sections.message.title" as const,
          description:
            "app.api.agent.chat.threads.threadId.messages.post.sections.message.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { request: "data" },
        {
          id: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.id.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.id.description" as const,
            schema: z.uuid(),
          }),
          role: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.role.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.role.description" as const,
            options: [
              {
                value: ChatMessageRole.USER,
                label: "app.api.agent.chat.enums.role.user" as const,
              },
            ],
            schema: z.literal(ChatMessageRole.USER),
          }),
          content: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.content.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.content.description" as const,
            schema: z.string().min(1),
          }),
          parentId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.parentId.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.parentId.description" as const,
            schema: z.uuid().optional(),
          }),
          model: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.model.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.model.description" as const,
            schema: z.enum(ModelId).optional(),
          }),
          metadata: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.JSON,
            label:
              "app.api.agent.chat.threads.threadId.messages.post.metadata.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.messages.post.metadata.description" as const,
            schema: z.custom<MessageMetadata>().optional(),
          }),
        },
      ),

      // === RESPONSE ===
      id: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.messages.post.response.message.id.content" as const,
        schema: z.uuid(),
      }),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.messages.post.response.message.createdAt.content" as const,
        schema: dateSchema,
      }),
    },
  ),

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.messages.post.success.title",
    description:
      "app.api.agent.chat.threads.threadId.messages.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        message: {
          id: "770e8400-e29b-41d4-a716-446655440000",
          role: ChatMessageRole.USER,
          content: "Hello, how can you help me?",
        },
      },
    },
    responses: {
      default: {
        id: "660e8400-e29b-41d4-a716-446655440000",
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
