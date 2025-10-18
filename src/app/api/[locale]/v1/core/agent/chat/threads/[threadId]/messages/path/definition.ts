/**
 * Conversation Path Endpoint Definition
 * Retrieves messages following a specific conversation path
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ChatMessageRole } from "../../../../enum";

/**
 * Get Conversation Path Endpoint (GET)
 * Retrieves messages following a specific conversation path
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
    "path",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title:
    "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.title" as const,
  description:
    "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.description" as const,
  category: "app.api.v1.core.agent.chat.category" as const,
  tags: ["app.api.v1.core.agent.chat.tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.errors.conflict.description",
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.container.title" as const,
      description:
        "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.container.description" as const,
      layout: { type: LayoutType.STACKED },
    },
    { request: "data&urlParams", response: true },
    {
      // === URL PARAMS ===
      threadId: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.threadId.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.threadId.description" as const,
        },
        z.string().uuid(),
      ),

      // === REQUEST DATA ===
      branchIndices: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.branchIndices.label" as const,
          description:
            "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.branchIndices.description" as const,
        },
        z.record(z.string(), z.number()).optional(),
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
              "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.title" as const,
            layout: { type: LayoutType.GRID, columns: 2 },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.id.content" as const,
              },
              z.string().uuid(),
            ),
            threadId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.threadId.content" as const,
              },
              z.string().uuid(),
            ),
            role: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.role.content" as const,
              },
              z.nativeEnum(ChatMessageRole),
            ),
            content: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.content.content" as const,
              },
              z.string(),
            ),
            parentId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.parentId.content" as const,
              },
              z.string().uuid().nullable(),
            ),
            depth: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.depth.content" as const,
              },
              z.number(),
            ),
            authorId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.authorId.content" as const,
              },
              z.string().nullable(),
            ),
            isAI: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.isAI.content" as const,
              },
              z.boolean(),
            ),
            model: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.model.content" as const,
              },
              z.string().nullable(),
            ),
            tokens: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.tokens.content" as const,
              },
              z.number().nullable(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.createdAt.content" as const,
              },
              z.date(),
            ),
            updatedAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.response.messages.message.updatedAt.content" as const,
              },
              z.date(),
            ),
          },
        ),
      ),
    },
  ),

  successTypes: {
    title:
      "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.success.title",
    description:
      "app.api.v1.core.agent.chat.threads.threadId.messages.path.get.success.description",
  },

  examples: {
    urlPathVariables: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
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
            authorId: "770e8400-e29b-41d4-a716-446655440000",
            isAI: false,
            model: null,
            tokens: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
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
