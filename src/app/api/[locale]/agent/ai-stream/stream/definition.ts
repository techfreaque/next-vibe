/**
 * AI Stream API Route Definition
 * Defines endpoint for AI-powered streaming chat functionality using OpenAI GPT-4o
 */

import type { JSONSchema7 } from "json-schema";
import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  customWidgetObject,
  objectField,
  requestDataArrayOptionalField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { lazy } from "react";
import { z } from "zod";

import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";

import { DefaultFolderId, rootFolderIdOptions } from "../../chat/config";
import { AGENT_MESSAGE_LENGTH } from "../../chat/constants";
import type { ChatMessage, MessageMetadata } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import {
  ChatModelId,
  ChatModelIdOptions,
  chatModelSelectionSchema,
} from "../models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "../vision-models";
import { AI_STREAM_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const AiStreamWidget = lazy(() =>
  import("./widget/widget").then((m) => ({ default: m.AiStreamWidget })),
);

/**
 * AI Stream Endpoint (POST)
 * Streams AI responses
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "ai-stream", "stream"],
  // No handler timeout: ai-stream runs an unbounded agent loop. A relay receiver
  // runs it HEADLESS (full loop to completion inside the request), and a WAIT-mode
  // media tool (image/video/music gen) can legitimately take minutes — well past
  // the 90s default. Matches video-generation / coding-agent (also long-running).
  timeoutMs: 0,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.PUBLIC,
    UserRole.AI_TOOL_OFF,
  ],
  defaultWebPinned: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],
  aliases: [AI_STREAM_ALIAS],

  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "sparkles",
  category: "ai",
  tags: ["tags.streaming", "tags.chat", "tags.ai"],

  // No events - ai-stream emits to the messages channel directly.
  // Event schemas are defined on the messages endpoint (the consumer).

  fields: customWidgetObject({
    render: AiStreamWidget,
    noFormElement: true,
    usage: { request: "data", response: true } as const,
    children: {
      // === OPERATION context ===
      operation: requestField(scopedTranslation, {
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
          {
            value: "wakeup-resume",
            label: "post.operation.options.answerAsAi" as const, // internal, not shown in UI
          },
        ],
        schema: z
          .enum(["send", "retry", "edit", "answer-as-ai", "wakeup-resume"])
          .default("send"),
      }),
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.rootFolderId.label",
        description: "post.rootFolderId.description",
        columns: 3,
        options: rootFolderIdOptions,
        schema: z.enum(DefaultFolderId),
      }),
      subFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.subFolderId.label",
        description: "post.subFolderId.description",
        columns: 3,
        schema: z.string().nullable().optional(),
      }),
      threadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/agent/chat/threads/definition"))
            .default.GET,
        labelField: "title",
        label: "post.threadId.label",
        description: "post.threadId.description",
        columns: 3,
        schema: z.uuid(),
      }),
      userMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.userMessageId.label",
        description: "post.userMessageId.description",
        columns: 3,
        schema: z.uuid().nullable(),
      }),
      parentMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.parentMessageId.label",
        description: "post.parentMessageId.description",
        columns: 3,
        schema: z.uuid().nullable().optional(),
      }),
      leafMessageId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.leafMessageId.label",
        description: "post.leafMessageId.description",
        columns: 3,
        schema: z.uuid().nullable().optional(),
      }),
      // === MESSAGE CONTENT ===
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label",
        description: "post.content.description",
        columns: 12,
        placeholder: "post.content.placeholder",
        // Allow empty content for answer-as-ai operation (AI generates its own response)
        // For other operations, content must be at least 1 skill
        schema: z.string().max(AGENT_MESSAGE_LENGTH),
      }),
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label",
        description: "post.role.description",
        columns: 4,
        options: rootFolderIdOptions,
        schema: z.enum(ChatMessageRole).default(ChatMessageRole.USER),
      }),

      // === AI CONFIGURATION ===
      model: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.model.label",
        description: "post.model.description",
        options: ChatModelIdOptions,
        columns: 4,
        schema: z.enum(ChatModelId),
      }),
      skill: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.skill.label",
        description: "post.skill.description",
        columns: 4,
        schema: z.string(),
      }),

      // Active favorite's full config - model selections, tools, context settings.
      // null = no favorite active (use skill/system defaults).
      // Logged-in users send their active favorite's config.
      // Public users send their client-side favorite's config.
      favoriteConfig: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.favoriteConfig.label",
        description: "post.favoriteConfig.description",
        schema: z
          .object({
            id: z.string(),
            skillId: z.string(),
            modelSelection: chatModelSelectionSchema.nullable(),
            voiceModelSelection: voiceModelSelectionSchema.nullable(),
            sttModelSelection: sttModelSelectionSchema.nullable(),
            imageVisionModelSelection:
              imageVisionModelSelectionSchema.nullable(),
            videoVisionModelSelection:
              videoVisionModelSelectionSchema.nullable(),
            audioVisionModelSelection:
              audioVisionModelSelectionSchema.nullable(),
            imageGenModelSelection: imageGenModelSelectionSchema.nullable(),
            musicGenModelSelection: musicGenModelSelectionSchema.nullable(),
            videoGenModelSelection: videoGenModelSelectionSchema.nullable(),
            availableTools: z
              .array(
                z.object({
                  toolId: z.string(),
                  requiresConfirmation: z.boolean(),
                }),
              )
              .nullable(),
            pinnedTools: z
              .array(
                z.object({
                  toolId: z.string(),
                  requiresConfirmation: z.boolean(),
                }),
              )
              .nullable(),
            deniedTools: z
              .array(
                z.object({
                  toolId: z.string(),
                  requiresConfirmation: z.boolean(),
                }),
              )
              .nullable(),
            compactTrigger: z.number().nullable(),
            memoryLimit: z.number().nullable(),
            promptAppend: z.string().nullable(),
          })
          .nullable()
          .optional(),
      }),
      toolConfirmations: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.toolConfirmation.label",
          description: "post.toolConfirmation.description",
        },
        objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { request: "data" },
          children: {
            messageId: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              schema: z.string().uuid(),
            }),
            confirmed: requestField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              schema: z.boolean(),
            }),
            updatedArgs: requestField(scopedTranslation, {
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
      messageHistory: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.messageHistory.label" as const,
        description: "post.messageHistory.description" as const,
        schema: z
          .array(
            z.object({
              id: z.string(),
              threadId: z.string(),
              role: z.nativeEnum(ChatMessageRole),
              parentId: z.string().nullable(),
              sequenceId: z.string().nullable(),
              isAI: z.boolean(),
              model: z.nativeEnum(ChatModelId).nullable(),
              skill: z.string().nullable(),
              metadata: z.custom<MessageMetadata>(),
              upvotes: z.number().nullish(),
              downvotes: z.number().nullish(),
              searchVector: z.string().nullish(),
              embedding: z.array(z.number()).nullish(),
              embeddingHash: z.string().nullish(),
              createdAt: dateSchema.nullable(),
              updatedAt: dateSchema.nullable(),
              // Tool messages in incognito mode may send content as an array
              // (AI SDK multi-part content format). Accept and coerce to JSON string.
              // Plain objects (e.g. {type:"text",text:"..."}) also need coercion.
              content: z
                .union([
                  z.string(),
                  z.array(WidgetDataSchema),
                  z.record(z.string(), WidgetDataSchema),
                  z.null(),
                ])
                .transform((v) =>
                  typeof v === "string" || v === null ? v : JSON.stringify(v),
                )
                .optional(),
              // errorMessage may also be a structured object in some clients
              errorMessage: z
                .union([z.string(), WidgetDataSchema])
                .transform((v) =>
                  typeof v === "string" || v === null || v === undefined
                    ? v
                    : JSON.stringify(v),
                )
                .optional(),
              authorId: z.string().nullish(),
              authorName: z.string().nullish(),
              errorType: z.string().nullish(),
              errorCode: z.string().nullish(),
            }),
          )
          .optional()
          .nullable() as z.ZodType<ChatMessage[]>,
      }),

      // === FILE ATTACHMENTS ===
      attachments: requestDataArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.CONTAINER,
          title: "post.attachments.label",
          description: "post.attachments.description",
        },
        requestField(scopedTranslation, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.FILE,
          // Accept both browser File objects (normal UI) and base64 wire format
          // (from remote relay POST bodies).
          schema: z.union([
            z.instanceof(File),
            z
              .object({
                filename: z.string().min(1),
                mimeType: z.string().min(1),
                data: z.string().min(1),
              })
              .transform(
                (att) =>
                  new File([Buffer.from(att.data, "base64")], att.filename, {
                    type: att.mimeType,
                  }),
              ),
          ]),
        }),
      ),

      // === RESUMABLE STREAM SUPPORT ===
      resumeToken: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.resumeToken.label",
        description: "post.resumeToken.description",
        columns: 6,
        schema: z.string().nullable().optional(),
      }),

      // === VOICE MODE (TTS streaming) ===
      voiceMode: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.voiceMode.label",
        description: "post.voiceMode.description",
        layoutType: LayoutType.GRID,
        columns: 3,
        optional: true,
        usage: { request: "data" },
        children: {
          // Only the ON/OFF flag. The VOICE itself resolves from the active
          // favorite/skill (→ DEFAULT_TTS_VOICE_ID) in stream setup — the client
          // never sends a voice, it's already part of the favorite.
          enabled: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.voiceMode.enabled.label",
            description: "post.voiceMode.enabled.description",
            columns: 6,
            schema: z.coerce.boolean().default(false),
          }),
        },
      }),

      // === AUDIO INPUT (for voice-to-voice mode) ===
      audioInput: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.audioInput.title",
        description: "post.audioInput.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        optional: true,
        usage: { request: "data" },
        children: {
          file: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "post.audioInput.file.label",
            description: "post.audioInput.file.description",
            columns: 12,
            // Accept both browser File objects (normal UI) and the base64
            // wire shape (remote relay POST bodies) — same contract as
            // attachments; a relayed STT turn must survive the hop.
            schema: z
              .union([
                z.instanceof(File),
                z
                  .object({
                    filename: z.string().min(1),
                    mimeType: z.string().min(1),
                    data: z.string().min(1),
                  })
                  .transform(
                    (att) =>
                      new File(
                        [Buffer.from(att.data, "base64")],
                        att.filename,
                        {
                          type: att.mimeType,
                        },
                      ),
                  ),
              ])
              .refine((file) => file.size <= 25 * 1024 * 1024, {
                message: "post.audioInput.validation.maxSize",
              })
              .nullable()
              .optional(),
          }),
        },
      }),

      // === WS-PROVIDER / REMOTE RELAY FIELDS ===
      // Discriminated union encoding how this stream should be executed.
      // Normal chat requests use the default { mode: "local" }.
      // Remote relay callers send inference-provider or relay context.
      executionContext: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.executionContext.label",
        description: "post.executionContext.description",
        columns: 12,
        schema: z
          .discriminatedUnion("mode", [
            z.object({
              mode: z.literal("local"),
            }),
            z.object({
              mode: z.literal("inference-provider"),
              instanceId: z.string(),
              tools: z
                .array(
                  z.object({
                    name: z.string().min(1),
                    description: z.string(),
                    parameters: z.custom<JSONSchema7>(),
                  }),
                )
                .optional(),
              systemPrompt: z.string().optional(),
              confirmationOverrides: z
                .array(
                  z.object({
                    toolId: z.string(),
                    requiresConfirmation: z.boolean(),
                  }),
                )
                .optional(),
            }),
            z.object({
              mode: z.literal("relay"),
              instanceId: z.string(),
              /** The CONNECTION's thread mirroring policy — 'off' keeps the
               *  executor's landing transient (no persisted copy). */
              threadMirrorMode: z.enum(["both", "off"]),
              confirmationOverrides: z
                .array(
                  z.object({
                    toolId: z.string(),
                    requiresConfirmation: z.boolean(),
                  }),
                )
                .optional(),
            }),
          ])
          .default({ mode: "local" }),
      }),

      // === TIMEZONE (for cache-stable timestamps) ===
      timezone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.timezone.label",
        description: "post.timezone.description",
        columns: 6,
        schema: z.string(),
      }),

      // === GENERATIVE MEDIA SETTINGS (image/audio models) ===
      imageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageSize.label",
        description: "post.imageSize.description",
        columns: 4,
        schema: z.string().optional(),
      }),
      imageQuality: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageQuality.label",
        description: "post.imageQuality.description",
        columns: 4,
        schema: z.string().optional(),
      }),
      musicDuration: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.musicDuration.label",
        description: "post.musicDuration.description",
        columns: 4,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success",
        schema: z.boolean(),
      }),
      messageId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.messageId",
        schema: z.string(),
      }),
      responseThreadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.threadId",
        schema: z.string().optional(),
      }),
      totalTokens: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.totalTokens",
        schema: z.coerce.number().optional(),
      }),
      finishReason: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.finishReason",
        schema: z.string().optional(),
      }),
      // Relay (PUSH-PUSH model): the receiver's synchronous response carries
      // the full turn summary — the caller never pulls the receiver's thread
      // to build its own response; its mirror converges from pushed events.
      lastAiMessageContent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.lastAiMessageContent",
        schema: z.string().nullable().optional(),
      }),
      lastGeneratedMediaUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.lastGeneratedMediaUrl",
        schema: z.string().nullable().optional(),
      }),
      totalCreditsDeducted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.totalCreditsDeducted",
        schema: z.coerce.number().optional(),
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
        model: ChatModelId.GPT_5_MINI,
        skill: "default",
        favoriteConfig: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: { enabled: false },
        audioInput: { file: null },
        timezone: "America/New_York",
        executionContext: { mode: "local" },
      },
      withSkill: {
        operation: "send",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: null,
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        userMessageId: "aa0e8400-e29b-41d4-a716-446655440000",
        parentMessageId: null,
        content: "Write a marketing email for our new product launch",
        role: ChatMessageRole.USER,
        model: ChatModelId.GPT_5,
        skill: "professional",
        favoriteConfig: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: { enabled: false },
        audioInput: { file: null },
        timezone: "America/New_York",
        executionContext: { mode: "local" },
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
        model: ChatModelId.CLAUDE_SONNET_4_5,
        skill: "default",
        favoriteConfig: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: { enabled: false },
        audioInput: { file: null },
        timezone: "America/New_York",
        executionContext: { mode: "local" },
      },
    },
    responses: {
      default: {
        success: true,
        messageId: "msg_123e4567-e89b-12d3-a456-426614174000",
        responseThreadId: "thread_123e4567-e89b-12d3-a456-426614174000",
        totalTokens: 245,
        finishReason: "stop",
      },
      withSkill: {
        success: true,
        messageId: "msg_456e7890-e89b-12d3-a456-426614174001",
        responseThreadId: "thread_456e7890-e89b-12d3-a456-426614174001",
        totalTokens: 387,
        finishReason: "stop",
      },
      retry: {
        success: true,
        messageId: "msg_789e0123-e89b-12d3-a456-426614174002",
        responseThreadId: "thread_789e0123-e89b-12d3-a456-426614174002",
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
