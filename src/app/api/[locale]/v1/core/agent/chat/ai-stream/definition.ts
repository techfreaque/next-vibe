/**
 * AI Stream API Route Definition
 * Defines endpoint for AI-powered streaming chat functionality using OpenAI GPT-4o
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
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { DEFAULT_FOLDER_IDS } from "../config";
import { ModelId } from "../model-access/models";

/**
 * Chat message schema
 */
// Accept SDK-native lowercase roles to avoid downstream conversions
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(10000),
});

/**
 * AI Stream Endpoint (POST)
 * Streams AI responses using OpenAI GPT-4o model
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "chat", "ai-stream"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],

  title: "app.api.v1.core.agent.chat.aiStream.post.title",
  description: "app.api.v1.core.agent.chat.aiStream.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.streaming",
    "app.api.v1.core.agent.tags.chat",
    "app.api.v1.core.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.aiStream.post.form.title",
      description: "app.api.v1.core.agent.chat.aiStream.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === OPERATION CONTEXT ===
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.chat.aiStream.post.operation.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.operation.description",
          layout: { columns: 3 },
          options: [
            {
              value: "send",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.operation.options.send" as const,
            },
            {
              value: "retry",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.operation.options.retry" as const,
            },
            {
              value: "edit",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.operation.options.edit" as const,
            },
            {
              value: "answer-as-ai",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.operation.options.answerAsAi" as const,
            },
          ],
        },
        z.enum(["send", "retry", "edit", "answer-as-ai"]).default("send"),
      ),
      rootFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.chat.aiStream.post.rootFolderId.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.rootFolderId.description",
          layout: { columns: 3 },
          options: [
            {
              value: DEFAULT_FOLDER_IDS.PRIVATE,
              label:
                "app.api.v1.core.agent.chat.config.folders.private" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.SHARED,
              label:
                "app.api.v1.core.agent.chat.config.folders.shared" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.PUBLIC,
              label:
                "app.api.v1.core.agent.chat.config.folders.public" as const,
            },
            {
              value: DEFAULT_FOLDER_IDS.INCOGNITO,
              label:
                "app.api.v1.core.agent.chat.config.folders.incognito" as const,
            },
          ],
        },
        z.enum([
          DEFAULT_FOLDER_IDS.PRIVATE,
          DEFAULT_FOLDER_IDS.SHARED,
          DEFAULT_FOLDER_IDS.PUBLIC,
          DEFAULT_FOLDER_IDS.INCOGNITO,
        ]),
      ),
      subFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.agent.chat.aiStream.post.subFolderId.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.subFolderId.description",
          layout: { columns: 3 },
        },
        z.uuid().nullable().optional(),
      ),
      threadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.agent.chat.aiStream.post.threadId.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.threadId.description",
          layout: { columns: 3 },
        },
        z.uuid().nullable().optional(),
      ),
      parentMessageId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.chat.aiStream.post.parentMessageId.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.parentMessageId.description",
          layout: { columns: 3 },
        },
        z.uuid().nullable().optional(),
      ),

      // === MESSAGE CONTENT ===
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.chat.aiStream.post.content.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.content.description",
          layout: { columns: 12 },
          placeholder:
            "app.api.v1.core.agent.chat.aiStream.post.content.placeholder",
        },
        z.string().min(1).max(10000),
      ),
      role: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.chat.aiStream.post.role.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.role.description",
          layout: { columns: 4 },
          options: [
            {
              value: "user",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.role.options.user" as const,
            },
            {
              value: "assistant",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.role.options.assistant" as const,
            },
            {
              value: "system",
              label:
                "app.api.v1.core.agent.chat.aiStream.post.role.options.system" as const,
            },
          ],
        },
        z.enum(["user", "assistant", "system"]).default("user"),
      ),

      // === AI CONFIGURATION ===
      model: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.chat.aiStream.post.model.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.model.description",
          layout: { columns: 4 },
        },
        z.nativeEnum(ModelId),
      ),
      persona: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.aiStream.post.persona.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.persona.description",
          layout: { columns: 4 },
        },
        z.string().nullable().optional(),
      ),
      temperature: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.aiStream.post.temperature.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.temperature.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(0).max(2).default(0.7),
      ),
      maxTokens: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.chat.aiStream.post.maxTokens.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.maxTokens.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).max(10000).default(1000),
      ),
      systemPrompt: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.chat.aiStream.post.systemPrompt.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.systemPrompt.description",
          layout: { columns: 12 },
          placeholder:
            "app.api.v1.core.agent.chat.aiStream.post.systemPrompt.placeholder",
        },
        z.string().max(10000).optional(),
      ),
      enableSearch: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.agent.chat.aiStream.post.enableSearch.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.enableSearch.description",
          layout: { columns: 4 },
        },
        z.boolean().optional().default(false),
      ),

      // === RESUMABLE STREAM SUPPORT ===
      resumeToken: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.chat.aiStream.post.resumeToken.label",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.resumeToken.description",
          layout: { columns: 6 },
        },
        z.string().nullable().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.chat.aiStream.post.response.title",
          description:
            "app.api.v1.core.agent.chat.aiStream.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.aiStream.post.response.success",
            },
            z.boolean(),
          ),
          messageId: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.aiStream.post.response.messageId",
            },
            z.string(),
          ),
          totalTokens: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.aiStream.post.response.totalTokens",
            },
            z.coerce.number().optional(),
          ),
          finishReason: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.chat.aiStream.post.response.finishReason",
            },
            z.string().optional(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.aiStream.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.aiStream.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.chat.aiStream.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.aiStream.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.chat.aiStream.post.success.title",
    description: "app.api.v1.core.agent.chat.aiStream.post.success.description",
  },

  examples: {
    requests: {
      default: {
        operation: "send",
        rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
        subFolderId: null,
        threadId: null,
        parentMessageId: null,
        content: "Hello, can you help me write a professional email?",
        role: "user",
        model: ModelId.GPT_5_MINI,
        persona: null,
        temperature: 0.7,
        maxTokens: 1000,
      },
      withSystemPrompt: {
        operation: "send",
        rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
        subFolderId: null,
        threadId: null,
        parentMessageId: null,
        content: "Write a marketing email for our new product launch",
        role: "user",
        model: ModelId.GPT_5,
        persona: null,
        temperature: 0.8,
        maxTokens: 1500,
        systemPrompt:
          "You are a professional marketing copywriter specializing in email campaigns.",
      },
      retry: {
        operation: "retry",
        rootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
        subFolderId: null,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        parentMessageId: "660e8400-e29b-41d4-a716-446655440001",
        content: "Can you try that again with more detail?",
        role: "user",
        model: ModelId.CLAUDE_SONNET_4_5,
        persona: null,
        temperature: 0.7,
        maxTokens: 1200,
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          messageId: "msg_123e4567-e89b-12d3-a456-426614174000",
          totalTokens: 245,
          finishReason: "stop",
        },
      },
      withSystemPrompt: {
        response: {
          success: true,
          messageId: "msg_456e7890-e89b-12d3-a456-426614174001",
          totalTokens: 387,
          finishReason: "stop",
        },
      },
      retry: {
        response: {
          success: true,
          messageId: "msg_789e0123-e89b-12d3-a456-426614174002",
          totalTokens: 298,
          finishReason: "stop",
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type AiStreamPostRequestInput = typeof POST.types.RequestInput;
export type AiStreamPostRequestOutput = typeof POST.types.RequestOutput;
export type AiStreamPostResponseInput = typeof POST.types.ResponseInput;
export type AiStreamPostResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { chatMessageSchema, POST };
export default definitions;
