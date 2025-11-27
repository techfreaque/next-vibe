/**
 * Chat Message by ID API Definition
 * Defines endpoints for getting, updating, and deleting individual messages
 */

import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
import {
  objectField,
  requestDataField,
  requestUrlPathParamsField,
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

import { ChatMessageRole, ChatMessageRoleOptions } from "../../../../enum";

/**
 * Get Message by ID Endpoint (GET)
 * Retrieves a specific message by ID
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
    "[messageId]",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.threadId.description" as const,
        },
        z.uuid(),
      ),
      messageId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.messageId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.messageId.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.title" as const,
          layoutType: LayoutType.GRID, columns: 2,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.id.content" as const,
            },
            z.uuid(),
          ),
          threadId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.threadId.content" as const,
            },
            z.uuid(),
          ),
          role: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.role.content" as const,
            },
            z.enum(ChatMessageRole),
          ),
          content: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.content.content" as const,
            },
            z.string(),
          ),
          parentId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.parentId.content" as const,
            },
            z.uuid().nullable(),
          ),
          depth: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.depth.content" as const,
            },
            z.number(),
          ),
          authorId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.authorId.content" as const,
            },
            z.string().nullable(),
          ),
          isAI: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.isAI.content" as const,
            },
            z.boolean(),
          ),
          model: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.model.content" as const,
            },
            z.string().nullable(),
          ),
          tokens: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.tokens.content" as const,
            },
            z.number().nullable(),
          ),
          createdAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.createdAt.content" as const,
            },
            z.string().datetime(),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.response.message.updatedAt.content" as const,
            },
            z.string().datetime(),
          ),
        },
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: undefined,
    responses: {
      default: {
        message: {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
});

/**
 * Update Message Endpoint (PATCH)
 * Updates a specific message's content
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: [
    "v1",
    "core",
    "agent",
    "chat",
    "threads",
    "[threadId]",
    "messages",
    "[messageId]",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.container.description" as const,
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
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.threadId.description" as const,
        },
        z.uuid(),
      ),
      messageId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.messageId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.messageId.description" as const,
        },
        z.uuid(),
      ),

      // === REQUEST DATA ===
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.content.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.content.description" as const},
        z.string().min(1),
      ),
      role: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.role.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.role.description" as const,
          options: ChatMessageRoleOptions,
        },
        z.enum(ChatMessageRole).optional(),
      ),

      // === RESPONSE ===
      message: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.response.message.title" as const,
          layoutType: LayoutType.GRID, columns: 2,
        },
        { response: true },
        {
          id: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.response.message.id.content" as const,
            },
            z.uuid(),
          ),
          content: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.response.message.content.content" as const,
            },
            z.string(),
          ),
          role: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.response.message.role.content" as const,
            },
            z.enum(ChatMessageRole),
          ),
          updatedAt: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.response.message.updatedAt.content" as const,
            },
            z.string().datetime(),
          ),
        },
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: {
      default: {
        content: "Updated message content",
        role: ChatMessageRole.USER,
      },
    },
    responses: {
      default: {
        message: {
          id: "660e8400-e29b-41d4-a716-446655440000",
          content: "Updated message content",
          role: ChatMessageRole.USER,
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
});

/**
 * Delete Message Endpoint (DELETE)
 * Deletes a specific message
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: [
    "v1",
    "core",
    "agent",
    "chat",
    "threads",
    "[threadId]",
    "messages",
    "[messageId]",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.threadId.description" as const,
        },
        z.uuid(),
      ),
      messageId: requestUrlPathParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.messageId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.messageId.description" as const,
        },
        z.uuid(),
      ),

      // === RESPONSE ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.response.success.content" as const,
        },
        z.boolean(),
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.messageId.delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: undefined,
    responses: {
      default: {
        success: true,
      },
    },
  },
});

/**
 * Export type definitions
 */
export type MessageGetRequestOutput = typeof GET.types.RequestOutput;
export type MessageGetResponseOutput = typeof GET.types.ResponseOutput;
export type MessageGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

export type MessagePatchRequestOutput = typeof PATCH.types.RequestOutput;
export type MessagePatchResponseOutput = typeof PATCH.types.ResponseOutput;
export type MessagePatchUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;

export type MessageDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MessageDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type MessageDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;

/**
 * Export definitions
 */
export default { GET, PATCH, DELETE };
