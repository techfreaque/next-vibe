/**
 * Chat Messages API Definition
 * Defines endpoints for listing and creating messages in a thread
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
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
  path: ["v1", "core", "agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.get.threadId.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      messages: responseArrayField(
        {
          type: WidgetType.DATA_CARDS,
          layout: "list",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.title" as const,
            layout: { type: LayoutType.GRID, columns: 2 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.id.content" as const,
              },
              z.uuid(),
            ),
            threadId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.threadId.content" as const,
              },
              z.uuid(),
            ),
            role: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.role.content" as const,
              },
              z.enum(ChatMessageRole),
            ),
            content: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.content.content" as const,
              },
              z.string(),
            ),
            parentId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.parentId.content" as const,
              },
              z.uuid().nullable(),
            ),
            depth: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.depth.content" as const,
              },
              z.number(),
            ),
            authorId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.authorId.content" as const,
              },
              z.string().nullable(),
            ),
            isAI: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.isAI.content" as const,
              },
              z.boolean(),
            ),
            model: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.model.content" as const,
              },
              z.string().nullable(),
            ),
            tokens: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.tokens.content" as const,
              },
              z.number().nullable(),
            ),
            sequenceId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.sequenceId.content" as const,
              },
              z.uuid().nullable(),
            ),
            sequenceIndex: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.sequenceIndex.content" as const,
              },
              z.number(),
            ),
            toolCalls: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.toolCalls.content" as const,
              },
              z.array(z.any()).nullable(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.createdAt.content" as const,
              },
              z.string().datetime(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.get.response.messages.message.updatedAt.content" as const,
              },
              z.string().datetime(),
            ),
          },
        ),
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.get.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: undefined,
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
            tokens: null,
            sequenceId: null,
            sequenceIndex: 0,
            toolCalls: null,
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
            tokens: 150,
            sequenceId: null,
            sequenceIndex: 0,
            toolCalls: null,
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
  path: ["v1", "core", "agent", "chat", "threads", "[threadId]", "messages"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.post.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.post.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.form.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.post.form.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.threadId.label" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.sections.message.title" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.sections.message.description" as const,
          layout: { type: LayoutType.STACKED },
        },
        { request: "data" },
        {
          role: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.role.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.role.description" as const,
              options: [
                {
                  value: ChatMessageRole.USER,
                  label: "app.api.v1.core.agent.chat.enums.role.user" as const,
                },
              ],
            },
            z.literal(ChatMessageRole.USER),
          ),
          content: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXTAREA,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.content.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.content.description" as const,
            },
            z.string().min(1),
          ),
          parentId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.parentId.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.parentId.description" as const,
            },
            z.uuid().optional(),
          ),
          model: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.model.label" as const,
              description:
                "app.api.v1.core.agent.chat.threads.threadId.messages.post.model.description" as const,
            },
            z.string().optional(),
          ),
        },
      ),

      // === RESPONSE ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.response.message.id.content" as const,
        },
        z.uuid(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.messages.post.response.message.createdAt.content" as const,
        },
        z.string().datetime(),
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.post.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        message: {
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
export default { GET, POST };
