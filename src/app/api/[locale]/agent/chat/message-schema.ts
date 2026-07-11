/**
 * Tolerant Zod schemas for chat messages and their metadata.
 *
 * Message metadata has accumulated many shapes over time (legacy incognito
 * localStorage threads, old DB rows, removed model ids). Parsing is therefore
 * tolerant on three levels:
 *  - metadata FIELD doesn't match its schema → the field is dropped
 *  - metadata as a whole is garbage → replaced with `{}`
 *  - a MESSAGE doesn't match the core shape → the message is skipped
 * A message-history parse never throws; it returns whatever parsed correctly.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { CallbackModeDB } from "next-vibe/execute-tool/constants";
import { z } from "zod";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { MessageVariant } from "@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";

import type { FavoriteConfig } from "../skills/favorites/db";
import type { DefaultFolderId } from "./config";
import type { ChatMessage, MessageMetadata, ToolCall } from "./db";
import { ChatMessageRole } from "./enum";

/**
 * Field-level tolerance: a metadata field that doesn't match its schema is
 * dropped (parsed as undefined) instead of failing the whole message.
 */
const tolerant = <T extends z.ZodType>(
  schema: T,
): z.ZodCatch<z.ZodOptional<T>> => schema.optional().catch(undefined);

/**
 * Stored ids whose enum churns over time (model ids get added/removed
 * constantly). Validated as "is a string" only — strict enum validation would
 * drop every message that references a since-removed id.
 */
const legacyToleratedId = <T extends string>(): z.ZodType<T> =>
  z.custom<T>((v) => typeof v === "string");

const modalitySchema: z.ZodType<Modality> = z.enum([
  "text",
  "audio",
  "image",
  "video",
]);

const bridgeTypeSchema = z.enum(["stt", "vision", "translation", "tts"]);

export const toolCallSchema: z.ZodType<ToolCall> = z.object({
  toolCallId: z.string(),
  toolName: z.string(),
  args: WidgetDataSchema,
  result: WidgetDataSchema.optional(),
  // Framework-produced structured error; branded translation keys make a
  // structural Zod schema impossible — guard the shape only.
  error: z
    .custom<ErrorResponseType>((v) => typeof v === "object" && v !== null)
    .optional(),
  executionTime: z.number().optional(),
  creditsUsed: z.number().optional(),
  requiresConfirmation: z.boolean().optional(),
  isConfirmed: z.boolean().optional(),
  waitingForConfirmation: z.boolean().optional(),
  status: z.enum(["pending", "completed", "failed"]).optional(),
  remoteTaskId: z.string().optional(),
  callbackMode: z.enum(CallbackModeDB).optional(),
  originalToolCallId: z.string().optional(),
  isDeferred: z.boolean().optional(),
  isPartial: z.boolean().optional(),
  isInputStreaming: z.boolean().optional(),
  argsText: z.string().optional(),
  remoteInstanceId: z.string().optional(),
  pendingCallId: z.string().optional(),
  pendingCallInline: z.boolean().optional(),
});

const attachmentSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  data: z.string().optional(),
});

const generatedMediaSchema = z.object({
  type: z.enum(["image", "video", "audio"]),
  url: z.string().optional(),
  prompt: z.string(),
  modelId: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSeconds: z.number().optional(),
  mimeType: z.string().optional(),
  creditCost: z.number(),
  status: z.enum(["pending", "complete", "failed"]).optional(),
});

const messageVariantSchema: z.ZodType<MessageVariant> = z.object({
  modality: modalitySchema,
  content: z.string(),
  modelId: legacyToleratedId<MessageVariant["modelId"]>(),
  creditCost: z.number().optional(),
  createdAt: z.string(),
  bridgeType: bridgeTypeSchema.optional(),
});

const pipelineStepSchema = z.object({
  type: z.enum(["stt", "tts", "vision", "translation", "routing", "gap-fill"]),
  modelId: legacyToleratedId<ChatModelId>(),
  creditCost: z.number(),
  durationMs: z.number().optional(),
});

const queuedSettingsSchema = z.object({
  model: legacyToleratedId<ChatModelId>(),
  skill: z.string(),
  rootFolderId: legacyToleratedId<DefaultFolderId>(),
  subFolderId: z.string().nullable(),
  voiceMode: z.object({ enabled: z.boolean() }),
  // Full favorite snapshot; validated structurally by the ai-stream request
  // schema when it's actually used — here a shape guard suffices.
  favoriteConfig: z
    .custom<FavoriteConfig>((v) => typeof v === "object" && v !== null)
    .nullable(),
  timezone: z.string(),
});

export const messageMetadataSchema: z.ZodType<MessageMetadata> = z.object({
  // Token and generation info
  generationTime: tolerant(z.number()),
  promptTokens: tolerant(z.number()),
  completionTokens: tolerant(z.number()),
  totalTokens: tolerant(z.number()),
  cachedInputTokens: tolerant(z.number()),
  cacheWriteTokens: tolerant(z.number()),
  timeToFirstToken: tolerant(z.number()),
  creditCost: tolerant(z.number()),
  finishReason: tolerant(z.string()),
  streamingTime: tolerant(z.number()),

  // Streaming / reasoning flags
  isReasoning: tolerant(z.boolean()),
  isStreaming: tolerant(z.boolean()),
  isOptimistic: tolerant(z.boolean()),
  isTranscribing: tolerant(z.boolean()),
  isUploadingAttachments: tolerant(z.boolean()),

  // Tool call
  toolCall: tolerant(toolCallSchema),

  // Compacting
  isCompacting: tolerant(z.boolean()),
  compactingFailed: tolerant(z.boolean()),
  compactedMessageCount: tolerant(z.number()),
  compactedTokenCount: tolerant(z.number()),
  compactedTimeRange: tolerant(
    z.object({ start: z.string(), end: z.string() }),
  ),
  originalMessageIds: tolerant(z.array(z.string())),
  containsMediaReferences: tolerant(z.boolean()),

  // Attachments
  attachments: tolerant(z.array(attachmentSchema)),

  // Chunk boundaries
  hasOlderHistory: tolerant(z.boolean()),
  hasNewerHistory: tolerant(z.boolean()),
  newerAnchorId: tolerant(z.string().nullable()),

  // Voting
  voterIds: tolerant(z.array(z.string())),
  voteDetails: tolerant(
    z.array(
      z.object({
        userId: z.string(),
        vote: z.enum(["up", "down"]),
        timestamp: z.number(),
      }),
    ),
  ),

  // Generated media
  generatedMedia: tolerant(generatedMediaSchema),

  // Modality provenance & pipeline
  inputModality: tolerant(modalitySchema),
  outputModality: tolerant(modalitySchema),
  pipelineSteps: tolerant(z.array(pipelineStepSchema)),
  variants: tolerant(z.array(messageVariantSchema)),
  gapFillStatus: tolerant(
    z
      .object({ bridgeType: bridgeTypeSchema, modality: modalitySchema })
      .nullable(),
  ),

  // Queue
  isQueued: tolerant(z.boolean()),
  queuedSettings: tolerant(queuedSettingsSchema),
});

/**
 * Coerce AI SDK multi-part content (arrays / plain objects sent by incognito
 * tool messages) to a JSON string; plain strings and null pass through.
 */
const messageContentSchema = z
  .union([
    z.string(),
    z.array(WidgetDataSchema),
    z.record(z.string(), WidgetDataSchema),
    z.null(),
  ])
  .transform((v) =>
    typeof v === "string" || v === null ? v : JSON.stringify(v),
  );

/**
 * One client-supplied (incognito) chat message, parsed into a full
 * `ChatMessage`. Core identity fields (id, threadId, role) must be valid —
 * anything else is tolerated: bad optional fields fall back to null/defaults,
 * garbage metadata becomes `{}`.
 */
export const chatMessageTolerantSchema = z
  .object({
    id: z.string(),
    threadId: z.string(),
    role: z.enum(ChatMessageRole),
    content: messageContentSchema.nullish().catch(null),
    parentId: z.string().nullish().catch(null),
    sequenceId: z.string().nullish().catch(null),
    authorId: z.string().nullish().catch(null),
    authorName: z.string().nullish().catch(null),
    isAI: z.boolean().catch(false),
    model: legacyToleratedId<ChatModelId>().nullish().catch(null),
    skill: z.string().nullish().catch(null),
    errorType: z.string().nullish().catch(null),
    errorMessage: z
      .union([z.string(), WidgetDataSchema])
      .transform((v) => (typeof v === "string" ? v : JSON.stringify(v)))
      .nullish()
      .catch(null),
    errorCode: z.string().nullish().catch(null),
    metadata: messageMetadataSchema.catch({}),
    upvotes: z.number().nullish().catch(null),
    downvotes: z.number().nullish().catch(null),
    createdAt: dateSchema.nullish().catch(null),
    updatedAt: dateSchema.nullish().catch(null),
  })
  .transform(
    (m): ChatMessage => ({
      id: m.id,
      threadId: m.threadId,
      role: m.role,
      content: m.content ?? null,
      parentId: m.parentId ?? null,
      sequenceId: m.sequenceId ?? null,
      authorId: m.authorId ?? null,
      authorName: m.authorName ?? null,
      isAI: m.isAI,
      model: m.model ?? null,
      skill: m.skill ?? null,
      errorType: m.errorType ?? null,
      errorMessage: m.errorMessage ?? null,
      errorCode: m.errorCode ?? null,
      metadata: m.metadata,
      upvotes: m.upvotes ?? 0,
      downvotes: m.downvotes ?? 0,
      createdAt: m.createdAt ?? new Date(),
      updatedAt: m.updatedAt ?? new Date(),
    }),
  );

/**
 * Tolerant message-history parse: every item that matches the core message
 * shape parses into a typed `ChatMessage`; legacy/unknown shapes are skipped.
 * Never throws.
 */
export function parseMessageHistory(
  items: readonly unknown[] | null | undefined,
): ChatMessage[] {
  if (!items) {
    return [];
  }
  return items.flatMap((item) => {
    const parsed = chatMessageTolerantSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}
