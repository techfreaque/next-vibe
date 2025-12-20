/**
 * AI Stream API Route Definition
 * Defines endpoint for AI-powered streaming chat functionality using OpenAI GPT-4o
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

import { dateSchema } from "../../shared/types/common.schema";
import { DefaultFolderId } from "../chat/config";
import { selectChatMessageSchema } from "../chat/db";
import {
  ChatMessageRole,
  ChatMessageRoleOptions,
  NEW_MESSAGE_ID,
} from "../chat/enum";
import { ModelId, ModelIdOptions } from "../chat/model-access/models";

/**
 * AI Stream Endpoint (POST)
 * Streams AI responses using OpenAI GPT-4o model
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "ai-stream"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],

  title: "app.api.agent.chat.aiStream.post.title",
  description: "app.api.agent.chat.aiStream.post.description",
  icon: "sparkles",
  category: "app.api.agent.category",
  tags: [
    "app.api.agent.tags.streaming",
    "app.api.agent.tags.chat",
    "app.api.agent.tags.ai",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.aiStream.post.form.title",
      description: "app.api.agent.chat.aiStream.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === OPERATION context ===
      operation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.aiStream.post.operation.label",
          description: "app.api.agent.chat.aiStream.post.operation.description",
          columns: 3,
          options: [
            {
              value: "send",
              label:
                "app.api.agent.chat.aiStream.post.operation.options.send" as const,
            },
            {
              value: "retry",
              label:
                "app.api.agent.chat.aiStream.post.operation.options.retry" as const,
            },
            {
              value: "edit",
              label:
                "app.api.agent.chat.aiStream.post.operation.options.edit" as const,
            },
            {
              value: "answer-as-ai",
              label:
                "app.api.agent.chat.aiStream.post.operation.options.answerAsAi" as const,
            },
          ],
        },
        z.enum(["send", "retry", "edit", "answer-as-ai"]).default("send"),
      ),
      rootFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.aiStream.post.rootFolderId.label",
          description:
            "app.api.agent.chat.aiStream.post.rootFolderId.description",
          columns: 3,
          options: [
            {
              value: DefaultFolderId.PRIVATE,
              label: "app.api.agent.chat.config.folders.private" as const,
            },
            {
              value: DefaultFolderId.SHARED,
              label: "app.api.agent.chat.config.folders.shared" as const,
            },
            {
              value: DefaultFolderId.PUBLIC,
              label: "app.api.agent.chat.config.folders.public" as const,
            },
            {
              value: DefaultFolderId.INCOGNITO,
              label: "app.api.agent.chat.config.folders.incognito" as const,
            },
          ],
        },
        z.nativeEnum(DefaultFolderId),
      ),
      subFolderId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.subFolderId.label",
          description:
            "app.api.agent.chat.aiStream.post.subFolderId.description",
          columns: 3,
        },
        z.string().nullable(),
      ),
      threadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.aiStream.post.threadId.label",
          description: "app.api.agent.chat.aiStream.post.threadId.description",
          columns: 3,
        },
        z
          .string()
          .uuid()
          .nullable()
          .transform((val) => {
            // Transform "new" to null - client should send null but this provides safety
            if (val === NEW_MESSAGE_ID) {
              return null;
            }
            return val;
          }),
      ),
      parentMessageId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.aiStream.post.parentMessageId.label",
          description:
            "app.api.agent.chat.aiStream.post.parentMessageId.description",
          columns: 3,
        },
        z.uuid().nullable(),
      ),

      // === MESSAGE CONTENT ===
      content: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.agent.chat.aiStream.post.content.label",
          description: "app.api.agent.chat.aiStream.post.content.description",
          columns: 12,
          placeholder: "app.api.agent.chat.aiStream.post.content.placeholder",
        },
        // Allow empty content for answer-as-ai operation (AI generates its own response)
        // For other operations, content must be at least 1 character
        z.string().max(10000),
      ),
      role: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.aiStream.post.role.label",
          description: "app.api.agent.chat.aiStream.post.role.description",
          columns: 4,
          options: ChatMessageRoleOptions,
        },
        z.nativeEnum(ChatMessageRole).default(ChatMessageRole.USER),
      ),

      // === AI CONFIGURATION ===
      model: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.agent.chat.aiStream.post.model.label",
          description: "app.api.agent.chat.aiStream.post.model.description",
          options: ModelIdOptions,
          columns: 4,
        },
        z.nativeEnum(ModelId),
      ),
      persona: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.persona.label",
          description: "app.api.agent.chat.aiStream.post.persona.description",
          columns: 4,
        },
        z.string(),
      ),
      temperature: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.agent.chat.aiStream.post.temperature.label",
          description:
            "app.api.agent.chat.aiStream.post.temperature.description",
          columns: 2,
        },
        z.coerce.number().min(0).max(2).default(0.7),
      ),
      maxTokens: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.agent.chat.aiStream.post.maxTokens.label",
          description: "app.api.agent.chat.aiStream.post.maxTokens.description",
          columns: 2,
        },
        z.coerce.number().min(1).max(10000).default(1000),
      ),
      tools: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.tools.label",
          description: "app.api.agent.chat.aiStream.post.tools.description",
          columns: 12,
        },
        z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      ),
      toolConfirmation: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.toolConfirmation.label",
          description:
            "app.api.agent.chat.aiStream.post.toolConfirmation.description",
          columns: 12,
        },
        z
          .object({
            messageId: z.string().uuid(),
            confirmed: z.boolean(),
            updatedArgs: z
              .record(
                z.string(),
                z.union([z.string(), z.coerce.number(), z.boolean(), z.null()]),
              )
              .optional(),
          })
          .nullable()
          .optional(),
      ),

      // === MESSAGE HISTORY (for incognito mode) ===
      messageHistory: requestDataField(
        {
          type: WidgetType.DATA_LIST,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.agent.chat.aiStream.post.messageHistory.label" as const,
          description:
            "app.api.agent.chat.aiStream.post.messageHistory.description" as const,
          optional: true,
        },
        z
          .array(
            selectChatMessageSchema.extend({
              createdAt: dateSchema,
              updatedAt: dateSchema,
            }),
          )
          .optional()
          .nullable(),
      ),

      // === RESUMABLE STREAM SUPPORT ===
      resumeToken: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.resumeToken.label",
          description:
            "app.api.agent.chat.aiStream.post.resumeToken.description",
          columns: 6,
        },
        z.string().nullable().optional(),
      ),

      // === VOICE MODE ===
      voiceMode: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label: "app.api.agent.chat.aiStream.post.voiceMode.label",
          description: "app.api.agent.chat.aiStream.post.voiceMode.description",
          columns: 6,
          optional: true,
        },
        z
          .object({
            /** Enable streaming TTS - emit AUDIO_CHUNK events */
            streamTTS: z.boolean().default(false),
            /** Use call mode system prompt (short responses) */
            callMode: z.boolean().default(false),
            /** TTS voice preference */
            voice: z.enum(["MALE", "FEMALE"]).default("MALE"),
          })
          .nullable()
          .optional(),
      ),

      // === AUDIO INPUT (for voice-to-voice mode) ===
      audioInput: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.aiStream.post.audioInput.title",
          description: "app.api.agent.chat.aiStream.post.audioInput.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          optional: true,
        },
        { request: "data" },
        {
          file: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.FILE,
              label: "app.api.agent.chat.aiStream.post.audioInput.file.label",
              description:
                "app.api.agent.chat.aiStream.post.audioInput.file.description",
              columns: 12,
              optional: true,
            },
            z
              .instanceof(File)
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message:
                  "app.api.agent.chat.aiStream.post.audioInput.validation.maxSize",
              })
              .refine(
                (file) => {
                  const allowedTypes = ["audio/", "application/octet-stream"];
                  return allowedTypes.some((type) =>
                    file.type.startsWith(type),
                  );
                },
                {
                  message:
                    "app.api.agent.chat.aiStream.post.audioInput.validation.audioOnly",
                },
              )
              .nullable()
              .optional(),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.aiStream.post.response.success",
        },
        z.boolean(),
      ),
      messageId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.aiStream.post.response.messageId",
        },
        z.string(),
      ),
      totalTokens: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.aiStream.post.response.totalTokens",
        },
        z.coerce.number().optional(),
      ),
      finishReason: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.agent.chat.aiStream.post.response.finishReason",
        },
        z.string().optional(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.aiStream.post.errors.unauthorized.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.aiStream.post.errors.validation.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.aiStream.post.errors.server.title",
      description: "app.api.agent.chat.aiStream.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.aiStream.post.errors.unknown.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.aiStream.post.errors.network.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.aiStream.post.errors.forbidden.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.aiStream.post.errors.notFound.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.agent.chat.aiStream.post.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.aiStream.post.errors.conflict.title",
      description:
        "app.api.agent.chat.aiStream.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.aiStream.post.success.title",
    description: "app.api.agent.chat.aiStream.post.success.description",
  },

  examples: {
    requests: {
      default: {
        operation: "send",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: null,
        parentMessageId: null,
        content: "Hello, can you help me write a professional email?",
        role: ChatMessageRole.USER,
        model: ModelId.GPT_5_MINI,
        persona: "default",
        temperature: 0.7,
        maxTokens: 1000,
        messageHistory: [],
        voiceMode: null,
        audioInput: { file: null },
      },
      withPersona: {
        operation: "send",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: null,
        parentMessageId: null,
        content: "Write a marketing email for our new product launch",
        role: ChatMessageRole.USER,
        model: ModelId.GPT_5,
        persona: "professional",
        temperature: 0.8,
        maxTokens: 1500,
        messageHistory: [],
        voiceMode: null,
        audioInput: { file: null },
      },
      retry: {
        operation: "retry",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        parentMessageId: "660e8400-e29b-41d4-a716-446655440001",
        content: "Can you try that again with more detail?",
        role: ChatMessageRole.USER,
        model: ModelId.CLAUDE_SONNET_4_5,
        persona: "default",
        temperature: 0.7,
        maxTokens: 1200,
        messageHistory: [],
        voiceMode: null,
        audioInput: { file: null },
      },
    },
    responses: {
      default: {
        success: true,
        messageId: "msg_123e4567-e89b-12d3-a456-426614174000",
        totalTokens: 245,
        finishReason: "stop",
      },
      withPersona: {
        success: true,
        messageId: "msg_456e7890-e89b-12d3-a456-426614174001",
        totalTokens: 387,
        finishReason: "stop",
      },
      retry: {
        success: true,
        messageId: "msg_789e0123-e89b-12d3-a456-426614174002",
        totalTokens: 298,
        finishReason: "stop",
      },
    },
    urlPathParams: undefined,
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

export { POST };
export default definitions;
