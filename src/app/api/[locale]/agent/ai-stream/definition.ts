/**
 * AI Stream API Route Definition
 * Defines endpoint for AI-powered streaming chat functionality using OpenAI GPT-4o
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  objectOptionalField,
  requestDataArrayOptionalField,
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
import { ChatMessageRole, ChatMessageRoleOptions } from "../chat/enum";
import { ModelId, ModelIdOptions } from "../chat/model-access/models";
import { DEFAULT_TTS_VOICE, TtsVoice } from "../text-to-speech/enum";

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
        z.enum(DefaultFolderId),
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
        z.uuid(),
      ),
      userMessageId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.agent.chat.aiStream.post.userMessageId.label",
          description:
            "app.api.agent.chat.aiStream.post.userMessageId.description",
          columns: 3,
        },
        z.uuid(),
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
        z.enum(ChatMessageRole).default(ChatMessageRole.USER),
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
        z.enum(ModelId),
      ),
      character: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.character.label",
          description: "app.api.agent.chat.aiStream.post.character.description",
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
      tools: requestDataArrayOptionalField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.agent.chat.aiStream.post.tools.label",
          description: "app.api.agent.chat.aiStream.post.tools.description",
          columns: 12,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 2,
          },
          { request: "data" },
          {
            toolId: requestDataField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.agent.chat.aiStream.post.tools.toolId.label",
                description:
                  "app.api.agent.chat.aiStream.post.tools.toolId.description",
                columns: 6,
              },
              z.string(),
            ),
            requiresConfirmation: requestDataField(
              {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label:
                  "app.api.agent.chat.aiStream.post.tools.requiresConfirmation.label",
                description:
                  "app.api.agent.chat.aiStream.post.tools.requiresConfirmation.description",
                columns: 6,
              },
              z.boolean().default(false),
            ),
          },
        ),
      ),
      toolConfirmation: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.aiStream.post.toolConfirmation.label",
          description:
            "app.api.agent.chat.aiStream.post.toolConfirmation.description",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data" },
        {
          messageId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.UUID,
              label:
                "app.api.agent.chat.aiStream.post.toolConfirmation.messageId.label",
              description:
                "app.api.agent.chat.aiStream.post.toolConfirmation.messageId.description",
              columns: 6,
            },
            z.string().uuid(),
          ),
          confirmed: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.agent.chat.aiStream.post.toolConfirmation.confirmed.label",
              description:
                "app.api.agent.chat.aiStream.post.toolConfirmation.confirmed.description",
              columns: 6,
            },
            z.boolean(),
          ),
          updatedArgs: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              label:
                "app.api.agent.chat.aiStream.post.toolConfirmation.updatedArgs.label",
              description:
                "app.api.agent.chat.aiStream.post.toolConfirmation.updatedArgs.description",
              columns: 12,
            },
            z
              .record(
                z.string(),
                z.union([z.string(), z.coerce.number(), z.boolean(), z.null()]),
              )
              .optional(),
          ),
        },
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

      // === FILE ATTACHMENTS ===
      attachments: requestDataArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          fieldType: FieldDataType.JSON,
          label: "app.api.agent.chat.aiStream.post.attachments.label" as const,
          description:
            "app.api.agent.chat.aiStream.post.attachments.description" as const,
          optional: true,
        },
        z.instanceof(File),
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

      // === VOICE MODE (TTS streaming) ===
      voiceMode: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.aiStream.post.voiceMode.label",
          description: "app.api.agent.chat.aiStream.post.voiceMode.description",
          layoutType: LayoutType.GRID,
          columns: 3,
        },
        { request: "data" },
        {
          enabled: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.agent.chat.aiStream.post.voiceMode.enabled.label",
              description:
                "app.api.agent.chat.aiStream.post.voiceMode.enabled.description",
              columns: 6,
            },
            z.boolean().default(false),
          ),
          voice: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.agent.chat.aiStream.post.voiceMode.voice.label",
              description:
                "app.api.agent.chat.aiStream.post.voiceMode.voice.description",
              options: [
                {
                  value: TtsVoice.MALE,
                  label:
                    "app.api.agent.chat.aiStream.post.voiceMode.voice.male",
                },
                {
                  value: TtsVoice.FEMALE,
                  label:
                    "app.api.agent.chat.aiStream.post.voiceMode.voice.female",
                },
              ],
              columns: 6,
            },
            z.enum(TtsVoice).default(DEFAULT_TTS_VOICE),
          ),
        },
      ),

      // === AUDIO INPUT (for voice-to-voice mode) ===
      audioInput: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.agent.chat.aiStream.post.audioInput.title",
          description:
            "app.api.agent.chat.aiStream.post.audioInput.description",
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
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        userMessageId: "990e8400-e29b-41d4-a716-446655440000",
        parentMessageId: null,
        content: "Hello, can you help me write a professional email?",
        role: ChatMessageRole.USER,
        model: ModelId.GPT_5_MINI,
        character: "default",
        temperature: 0.7,
        maxTokens: 1000,
        tools: null,
        toolConfirmation: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: null,
        audioInput: { file: null },
      },
      withCharacter: {
        operation: "send",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        userMessageId: "aa0e8400-e29b-41d4-a716-446655440000",
        parentMessageId: null,
        content: "Write a marketing email for our new product launch",
        role: ChatMessageRole.USER,
        model: ModelId.GPT_5,
        character: "professional",
        temperature: 0.8,
        maxTokens: 1500,
        tools: null,
        toolConfirmation: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: null,
        audioInput: { file: null },
      },
      retry: {
        operation: "retry",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        userMessageId: "msg-1234567890-abc",
        parentMessageId: "660e8400-e29b-41d4-a716-446655440001",
        content: "Can you try that again with more detail?",
        role: ChatMessageRole.USER,
        model: ModelId.CLAUDE_SONNET_4_5,
        character: "default",
        temperature: 0.7,
        maxTokens: 1200,
        tools: null,
        toolConfirmation: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
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
      withCharacter: {
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
