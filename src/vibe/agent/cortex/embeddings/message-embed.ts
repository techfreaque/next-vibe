import "server-only";

/**
 * Per-message embedding for vector search.
 * Embeds each message's text content into chatMessages.embedding so that
 * cortex vector search can use stored embeddings instead of generating a
 * query embedding at search time (eliminates the hot-path API call).
 *
 * Rules:
 * - Tool messages: skipped (no retrieval signal beyond their parent assistant turn)
 * - Reasoning (<think> tags): stripped before embedding
 * - Messages before compaction boundary: excluded from search query vectors
 *   (already summarized in system prompt, would just add noise)
 */
import { createHash } from "node:crypto";

import { and, eq, ne } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { MessageMetadata } from "@/app/api/[locale]/agent/chat/db";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";

import type { ToolExecutionContext } from "../../chat/config";
import { EMBEDDING_MODEL, generateEmbedding } from "./service";

/** Max chars to embed per message (keeps token cost bounded) */
const MAX_CONTENT_CHARS = 2000;

/** Strip <think>...</think> reasoning blocks — internal scratchpad, not retrieval signal */
function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/**
 * Build embeddable text for a message row.
 * Returns null for roles/content that carry no retrieval signal.
 */
export function buildMessageEmbedText(msg: {
  role: string;
  content: string | null;
  metadata: MessageMetadata | null;
}): string | null {
  if (
    msg.role === ChatMessageRole.SYSTEM ||
    msg.role === ChatMessageRole.TOOL
  ) {
    return null;
  }

  if (
    msg.role === ChatMessageRole.USER ||
    msg.role === ChatMessageRole.ASSISTANT
  ) {
    const text = stripThinkTags(msg.content ?? "");
    if (!text) {
      return null;
    }
    return text.slice(0, MAX_CONTENT_CHARS);
  }

  return null;
}

function computeMessageEmbedHash(text: string): string {
  return createHash("sha256")
    .update(`${EMBEDDING_MODEL}:msg:${text}`)
    .digest("hex");
}

/**
 * Generate the embedding for a message's content AT WRITE TIME. Returns the
 * vector + its content hash ready to persist on the row in the SAME write, so a
 * user/assistant message row is never stored without its search vector — cortex
 * search reads stored vectors only, never re-embeds a query. Returns null when
 * the content carries no retrieval signal (tool/system/empty) or the embedding
 * API is unavailable; callers persist the message unchanged in that case
 * (embedding is best-effort — a missing key must never block a message write).
 */
export async function embedMessageContent(
  msg: {
    role: string;
    content: string | null;
    metadata: MessageMetadata | null;
  },
  streamContext: ToolExecutionContext,
): Promise<{ embedding: number[]; embeddingHash: string } | null> {
  const text = buildMessageEmbedText(msg);
  if (!text) {
    return null;
  }
  const embedding = await generateEmbedding(text, streamContext);
  if (!embedding) {
    return null;
  }
  return { embedding, embeddingHash: computeMessageEmbedHash(text) };
}

/**
 * Embed a just-written assistant message and store the vector on its row. Called
 * at content-done (write time) — the assistant message is written incrementally,
 * so it can't be embedded in the initial insert like the user message; this is
 * its write-time embed. Best-effort + idempotent (skips if the content hash is
 * unchanged). The next step's cortex refresh awaits the returned promise so the
 * mid-step search sees this vector.
 */
export async function embedAssistantMessageRow(
  messageId: string,
  content: string,
  streamContext: ToolExecutionContext,
): Promise<void> {
  const text = buildMessageEmbedText({
    role: ChatMessageRole.ASSISTANT,
    content,
    metadata: null,
  });
  if (!text) {
    return;
  }
  const hash = computeMessageEmbedHash(text);
  try {
    const embedding = await generateEmbedding(text, streamContext);
    if (!embedding) {
      return;
    }
    await db
      .update(chatMessages)
      .set({ embedding, embeddingHash: hash })
      .where(
        and(
          eq(chatMessages.id, messageId),
          ne(chatMessages.embeddingHash, hash),
        ),
      );
  } catch {
    // best-effort — embedding must never break stream finalization
  }
}
