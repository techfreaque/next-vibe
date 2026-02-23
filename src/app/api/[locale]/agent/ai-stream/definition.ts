/**
 * AI Stream API Route Definition
 * Defines endpoint for AI-powered streaming chat functionality using OpenAI GPT-4o
 */

import { z } from "zod";

import {
  ModelId,
  ModelIdOptions,
} from "@/app/api/[locale]/agent/models/models";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedObjectOptionalField,
  scopedRequestDataArrayOptionalField,
  scopedRequestField,
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

import { dateSchema } from "../../shared/types/common.schema";
import { DefaultFolderId } from "../chat/config";
import { AGENT_MESSAGE_LENGTH } from "../chat/constants";
import { type ChatMessage, selectChatMessageSchema } from "../chat/db";
import { ChatMessageRole, ChatMessageRoleOptions } from "../chat/enum";
import { DEFAULT_TTS_VOICE, TtsVoice } from "../text-to-speech/enum";
import { scopedTranslation } from "./i18n";

/**
 * AI Stream Endpoint (POST)
 * Streams AI responses
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream"],
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],

  title: "post.title",
  description: "post.description",
  icon: "sparkles",
  category: "category",
  tags: ["tags.streaming", "tags.chat", "tags.ai"],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === OPERATION context ===
      operation: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.operation.label",
        description: "post.operation.description",
        columns: 3,
        options: [
          {
            value: "send",
            label: "post.operation.options.send" as const,
          },
          {
            value: "retry",
            label: "post.operation.options.retry" as const,
          },
          {
            value: "edit",
            label: "post.operation.options.edit" as const,
          },
          {
            value: "answer-as-ai",
            label: "post.operation.options.answerAsAi" as const,
          },
        ],
        schema: z
          .enum(["send", "retry", "edit", "answer-as-ai"])
          .default("send"),
      }),
      rootFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label",
        description: "post.rootFolderId.description",
        columns: 3,
        options: [
          {
            value: DefaultFolderId.PRIVATE,
            label: "chat.config.folders.private" as const,
          },
          {
            value: DefaultFolderId.SHARED,
            label: "chat.config.folders.shared" as const,
          },
          {
            value: DefaultFolderId.PUBLIC,
            label: "chat.config.folders.public" as const,
          },
          {
            value: DefaultFolderId.INCOGNITO,
            label: "chat.config.folders.incognito" as const,
          },
          {
            value: DefaultFolderId.CRON,
            label: "chat.config.folders.cron" as const,
          },
        ],
        schema: z.enum(DefaultFolderId),
      }),
      subFolderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.subFolderId.label",
        description: "post.subFolderId.description",
        columns: 3,
        schema: z.string().nullable(),
      }),
      threadId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.threadId.label",
        description: "post.threadId.description",
        columns: 3,
        schema: z.uuid(),
      }),
      userMessageId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.userMessageId.label",
        description: "post.userMessageId.description",
        columns: 3,
        schema: z.uuid().nullable(),
      }),
      parentMessageId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.parentMessageId.label",
        description: "post.parentMessageId.description",
        columns: 3,
        schema: z.uuid().nullable(),
      }),

      // === MESSAGE CONTENT ===
      content: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label",
        description: "post.content.description",
        columns: 12,
        placeholder: "post.content.placeholder",
        // Allow empty content for answer-as-ai operation (AI generates its own response)
        // For other operations, content must be at least 1 character
        schema: z.string().max(AGENT_MESSAGE_LENGTH),
      }),
      role: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label",
        description: "post.role.description",
        columns: 4,
        options: ChatMessageRoleOptions,
        schema: z.enum(ChatMessageRole).default(ChatMessageRole.USER),
      }),

      // === AI CONFIGURATION ===
      model: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.model.label",
        description: "post.model.description",
        options: ModelIdOptions,
        columns: 4,
        schema: z.enum(ModelId),
      }),
      character: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.character.label",
        description: "post.character.description",
        columns: 4,
        schema: z.string(),
      }),

      // optional allowed tools - null/undefined = all tools permitted
      // allowed tools = permission gate (what the model is allowed to call)
      allowedTools: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.activeTool.label",
          description: "post.activeTool.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { request: "data" },
          children: {
            toolId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.activeTool.toolId.label",
              description: "post.activeTool.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "post.tools.requiresConfirmation.label",
              description: "post.tools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        }),
      ),
      // required array of tools - null/undefined = no tools enabled
      // Enabled tools are the ones the model sees and is able to execute
      // They are in the tools array and are part of the context window
      tools: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.tools.label",
          description: "post.tools.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 2,
          usage: { request: "data" },
          children: {
            toolId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "post.tools.toolId.label",
              description: "post.tools.toolId.description",
              columns: 6,
              schema: z.string(),
            }),
            requiresConfirmation: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "post.tools.requiresConfirmation.label",
              description: "post.tools.requiresConfirmation.description",
              columns: 6,
              schema: z.boolean().default(false),
            }),
          },
        }),
      ),
      toolConfirmations: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.toolConfirmation.label",
          description: "post.toolConfirmation.description",
        },
        scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { request: "data" },
          children: {
            messageId: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              schema: z.string().uuid(),
            }),
            confirmed: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            updatedArgs: scopedRequestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.JSON,
              schema: z
                .record(
                  z.string(),
                  z.union([
                    z.string(),
                    z.coerce.number(),
                    z.boolean(),
                    z.null(),
                  ]),
                )
                .optional(),
            }),
          },
        }),
      ),

      // === MESSAGE HISTORY (for incognito mode) ===
      messageHistory: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.messageHistory.label" as const,
        description: "post.messageHistory.description" as const,
        schema: z
          .array(
            selectChatMessageSchema.extend({
              createdAt: dateSchema,
              updatedAt: dateSchema,
            }),
          )
          .optional()
          .nullable() as z.ZodType<ChatMessage[]>,
      }),

      // === FILE ATTACHMENTS ===
      attachments: scopedRequestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.attachments.label",
          description: "post.attachments.description",
        },
        scopedRequestField(scopedTranslation, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.FILE,
          schema: z.instanceof(File),
        }),
      ),

      // === RESUMABLE STREAM SUPPORT ===
      resumeToken: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.resumeToken.label",
        description: "post.resumeToken.description",
        columns: 6,
        schema: z.string().nullable().optional(),
      }),

      // === VOICE MODE (TTS streaming) ===
      voiceMode: scopedObjectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.voiceMode.label",
        description: "post.voiceMode.description",
        layoutType: LayoutType.GRID,
        columns: 3,
        usage: { request: "data" },
        children: {
          enabled: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.voiceMode.enabled.label",
            description: "post.voiceMode.enabled.description",
            columns: 6,
            schema: z.boolean().default(false),
          }),
          voice: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.voiceMode.voice.label",
            description: "post.voiceMode.voice.description",
            options: [
              {
                value: TtsVoice.MALE,
                label: "post.voiceMode.voice.male",
              },
              {
                value: TtsVoice.FEMALE,
                label: "post.voiceMode.voice.female",
              },
            ],
            columns: 6,
            schema: z.enum(TtsVoice).default(DEFAULT_TTS_VOICE),
          }),
        },
      }),

      // === AUDIO INPUT (for voice-to-voice mode) ===
      audioInput: scopedObjectFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.audioInput.title",
        description: "post.audioInput.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        optional: true,
        usage: { request: "data" },
        children: {
          file: scopedRequestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "post.audioInput.file.label",
            description: "post.audioInput.file.description",
            columns: 12,
            schema: z
              .instanceof(File)
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message: "post.audioInput.validation.maxSize",
              })
              .refine(
                (file) => {
                  const allowedTypes = ["audio/", "application/octet-stream"];
                  return allowedTypes.some((type) =>
                    file.type.startsWith(type),
                  );
                },
                {
                  message: "post.audioInput.validation.audioOnly",
                },
              )
              .nullable()
              .optional(),
          }),
        },
      }),

      // === TIMEZONE (for cache-stable timestamps) ===
      timezone: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.timezone.label",
        description: "post.timezone.description",
        columns: 6,
        schema: z.string(),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.success",
        schema: z.boolean(),
      }),
      messageId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.messageId",
        schema: z.string(),
      }),
      totalTokens: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.totalTokens",
        schema: z.coerce.number().optional(),
      }),
      finishReason: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.finishReason",
        schema: z.string().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
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

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
        allowedTools: null,
        tools: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: null,
        audioInput: { file: null },
        timezone: "America/New_York",
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
        allowedTools: null,
        tools: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: null,
        audioInput: { file: null },
        timezone: "America/New_York",
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
        allowedTools: null,
        tools: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: null,
        audioInput: { file: null },
        timezone: "America/New_York",
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
  },
});

// Extract types using the new enhanced system
export type AiStreamPostRequestInput = typeof POST.types.RequestInput;
export type AiStreamPostRequestOutput = typeof POST.types.RequestOutput;
export type AiStreamPostResponseInput = typeof POST.types.ResponseInput;
export type AiStreamPostResponseOutput = typeof POST.types.ResponseOutput;

// Extract operation type for type-safe usage
export type AiStreamOperation = AiStreamPostRequestOutput["operation"];

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export default definitions;
