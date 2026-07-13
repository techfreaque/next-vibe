/**
 * Media / file-part writing - generated media messages, media attached to
 * existing messages, streaming-state changes and gap-fill (modality bridge)
 * events with their DB persistence.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { Modality } from "@/app/api/[locale]/agent/models/enum";

import { chatMessages, type MessageMetadata } from "../../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import type { MessageVariant } from "../modality-resolver";
import type { DbWriterState } from "./shared";
import { buildSseMessageRow } from "./sse-row";

/**
 * Create an ASSISTANT message for generated media (image/audio).
 * Emits MESSAGE_CREATED SSE with generatedMedia metadata, inserts to DB.
 */
export async function emitGeneratedMediaMessage(
  w: DbWriterState,
  params: {
    messageId: string;
    threadId: string;
    parentId: string | null;
    userId: string | undefined;
    model: ChatModelId;
    skill: string;
    sequenceId: string | null;
    generatedMedia: MessageMetadata["generatedMedia"];
  },
): Promise<void> {
  const {
    messageId,
    threadId,
    parentId,
    model,
    skill,
    sequenceId,
    generatedMedia,
  } = params;

  w.lastAssistantMessageId = messageId;
  if (generatedMedia?.url) {
    w.lastGeneratedMediaUrl = generatedMedia.url;
  }

  // SSE: MESSAGE_CREATED with generatedMedia metadata
  // Also set top-level creditCost so AssistantMessageActions can display it
  const metadata = {
    generatedMedia,
    creditCost: generatedMedia?.creditCost,
  };
  w.deps.wsEmit("message-created", {
    urlPathParams: { threadId },
    responseData: {
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        buildSseMessageRow({
          id: messageId,
          threadId,
          role: ChatMessageRole.ASSISTANT,
          isAI: true,
          content: "",
          parentId,
          sequenceId: sequenceId ?? null,
          model: model ?? null,
          skill: skill ?? null,
          metadata,
        }),
      ],
    },
  });

  // DB: insert with metadata
  if (!w.deps.isIncognito) {
    try {
      await db.insert(chatMessages).values({
        id: messageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: null,
        parentId,
        authorId: params.userId ?? null,
        sequenceId,
        isAI: true,
        model,
        skill,
        metadata,
      });
    } catch (err) {
      w.deps.logger.warn(
        "[MessageDbWriter] Failed to create generated media message",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }
}

/**
 * Attach generated media to an existing assistant message (no new message created).
 * Emits GENERATED_MEDIA_ADDED SSE and updates the DB metadata JSONB.
 * Used when an LLM emits text first, then a file part - both belong in the same bubble.
 */
export async function emitGeneratedMediaOnExistingMessage(
  w: DbWriterState,
  params: {
    messageId: string;
    generatedMedia: MessageMetadata["generatedMedia"];
  },
): Promise<void> {
  const { messageId, generatedMedia } = params;

  if (!generatedMedia) {
    return;
  }
  if (generatedMedia.url) {
    w.lastGeneratedMediaUrl = generatedMedia.url;
  }

  // SSE: GENERATED_MEDIA_ADDED - tells the frontend to attach media to existing message
  w.deps.wsEmit("generated-media-added", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [
        {
          id: messageId,
          metadata: {
            generatedMedia: {
              type: generatedMedia.type,
              url: generatedMedia.url,
              prompt: generatedMedia.prompt ?? "",
              modelId: generatedMedia.modelId ?? "",
              mimeType: generatedMedia.mimeType ?? "",
              creditCost: generatedMedia.creditCost ?? 0,
              status: generatedMedia.status ?? "complete",
            },
          },
        },
      ],
    },
  });

  // DB: merge generatedMedia into existing message metadata
  if (!w.deps.isIncognito) {
    try {
      await db
        .update(chatMessages)
        .set({
          metadata: sql`metadata || ${JSON.stringify({ generatedMedia, creditCost: generatedMedia.creditCost })}::jsonb`,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      w.deps.logger.warn(
        "[MessageDbWriter] Failed to attach generated media to existing message",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }
}

/**
 * Emit STREAMING_STATE_CHANGED SSE event.
 * Used to mark the thread as "streaming" before gap-fill begins so the UI
 * shows an activity indicator during potentially long bridge calls.
 */
export function emitStreamingStateChanged(
  w: DbWriterState,
  params: {
    threadId: string;
    state: ThreadStreamingState;
  },
): void {
  w.deps.wsEmit("streaming-state-changed", {
    responseData: {
      streamingState: params.state,
    },
    urlPathParams: { threadId: params.threadId },
  });
}

/**
 * Emit GAP_FILL_STARTED SSE event.
 * Called when a modality bridge begins running on a message attachment.
 */
export function emitGapFillStarted(
  w: DbWriterState,
  params: {
    messageId: string;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
  },
): void {
  w.deps.wsEmit("gap-fill-started", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [
        {
          id: params.messageId,
          metadata: {
            isStreaming: true,
            gapFillStatus: {
              bridgeType: params.bridgeType,
              modality: params.modality,
            },
          },
        },
      ],
    },
  });
}

/**
 * Emit GAP_FILL_COMPLETED SSE event and persist the variant to DB.
 * Called when a modality bridge finishes and the text variant is ready.
 */
export async function emitGapFillCompleted(
  w: DbWriterState,
  params: {
    messageId: string;
    bridgeType: "stt" | "vision" | "translation" | "tts";
    modality: Modality;
    variant: MessageVariant;
  },
): Promise<void> {
  w.deps.wsEmit("gap-fill-completed", {
    urlPathParams: { threadId: w.lastThreadId ?? "" },
    responseData: {
      messages: [
        {
          id: params.messageId,
          metadata: {
            variants: [params.variant],
            gapFillStatus: null, // clear the "transcribing/analyzing" indicator
          },
        },
      ],
    },
  });

  // Persist variant to DB (non-incognito only)
  if (!w.deps.isIncognito) {
    try {
      // Append variant to existing variants array in metadata
      await db
        .update(chatMessages)
        .set({
          metadata: sql`jsonb_set(
              COALESCE(metadata, '{}'),
              '{variants}',
              COALESCE(metadata->'variants', '[]') || ${JSON.stringify([params.variant])}::jsonb
            )`,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, params.messageId));
    } catch (err) {
      w.deps.logger.warn(
        "[MessageDbWriter] Failed to persist gap-fill variant",
        {
          messageId: params.messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }
}
