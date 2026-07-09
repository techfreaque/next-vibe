/**
 * Throttle engine - the debounced DB write mechanism behind MessageDbWriter.
 *
 * Owns the `pending` debounce map and the low-level DB content writes. Content
 * updates within THROTTLE_MS are coalesced so rapid deltas don't hammer the DB;
 * flush() / flushAll() cancel the timer and write immediately - always called
 * before stream ends or on error.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import { chatMessages, type MessageMetadata } from "../../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../../chat/enum";
import { type PendingWrite, THROTTLE_MS, type WriterDeps } from "./shared";
import { buildSseMessageRow } from "./sse-row";

export class ThrottleEngine {
  private readonly pending = new Map<string, PendingWrite>();

  constructor(private readonly deps: WriterDeps) {}

  /**
   * After each new message is committed to DB, advance any queued messages in
   * the thread so their parentId always points to the latest frontier message.
   *
   * This prevents queued messages from branching off a mid-stream point:
   * as tool calls, tool results, and assistant messages are added, every
   * queued message rolls forward with the chain.
   *
   * Fire-and-forget: never blocks the stream. SSE is emitted per queued
   * message so the client updates position live without a page refresh.
   */
  advanceQueuedMessages(threadId: string, newParentId: string): void {
    if (this.deps.isIncognito) {
      return;
    }
    void (async (): Promise<void> => {
      try {
        // Find all queued messages in this thread
        const queued = await db
          .select({ id: chatMessages.id, metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(
            sql`${chatMessages.threadId} = ${threadId}
              AND ${chatMessages.role} = 'user'
              AND ${chatMessages.metadata}->>'isQueued' = 'true'`,
          );
        if (queued.length === 0) {
          return;
        }
        const now = new Date();
        await db
          .update(chatMessages)
          .set({ parentId: newParentId, updatedAt: now })
          .where(
            sql`${chatMessages.threadId} = ${threadId}
              AND ${chatMessages.role} = 'user'
              AND ${chatMessages.metadata}->>'isQueued' = 'true'`,
          );
        // Emit SSE for each queued message so the client tracks live
        for (const q of queued) {
          this.deps.wsEmit("message-created", {
            urlPathParams: { threadId },
            responseData: {
              streamingState: ThreadStreamingState.STREAMING,
              messages: [
                buildSseMessageRow({
                  id: q.id,
                  threadId,
                  role: ChatMessageRole.USER,
                  parentId: newParentId,
                  metadata: q.metadata ?? { isQueued: true },
                  createdAt: now,
                  updatedAt: now,
                }),
              ],
            },
          });
        }
      } catch (err) {
        this.deps.logger.warn(
          "[MessageDbWriter] Failed to advance queued messages",
          {
            threadId,
            newParentId,
            error: err instanceof Error ? err.message : String(err),
          },
        );
      }
    })();
  }

  /** Schedule a throttled DB write. */
  scheduleUpdate(messageId: string, content: string): void {
    if (this.deps.isIncognito) {
      return;
    }

    const existing = this.pending.get(messageId);
    if (existing) {
      if (existing.timer !== null) {
        clearTimeout(existing.timer);
        existing.timer = null;
      }
      existing.content = content;
    } else {
      this.pending.set(messageId, {
        messageId,
        content,
        timer: null,
        inflightPromise: null,
      });
    }

    const state = this.pending.get(messageId)!;
    state.timer = setTimeout(() => {
      state.timer = null;
      state.inflightPromise = this.writeNow(messageId, state.content).catch(
        (err: Error) => {
          this.deps.logger.error(
            "[MessageDbWriter] Throttled update failed",
            err,
            {
              messageId,
            },
          );
        },
      );
    }, THROTTLE_MS);
  }

  /** Cancel timer and write immediately. Removes from pending map. */
  async flush(messageId: string): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    const state = this.pending.get(messageId);
    if (!state) {
      return;
    }
    if (state.timer !== null) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    if (state.inflightPromise) {
      await state.inflightPromise;
    }
    await this.writeNow(messageId, state.content);
    this.pending.delete(messageId);
  }

  /** Flush all pending messages. Call at stream end. */
  async flushAll(): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    await Promise.all([...this.pending.keys()].map((id) => this.flush(id)));
  }

  /**
   * Flush all pending writes then write final content (for tool-call boundaries).
   * Does NOT emit any SSE events.
   */
  async flushContent(messageId: string, content: string): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    await this.flush(messageId);
    await this.writeNow(messageId, content);
  }

  /** Direct DB write without throttling. */
  async writeNow(messageId: string, content: string): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    try {
      await db
        .update(chatMessages)
        .set({ content: content.trim() || null, updatedAt: new Date() })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.deps.logger.error(
        "[MessageDbWriter] Failed to update message content",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  /** Build a partial MessageMetadata object from token fields, omitting nulls/zeros. */
  private static buildTokenMetadata(tokens: {
    promptTokens: number | null;
    completionTokens: number | null;
    finishReason: string | null;
    cachedInputTokens?: number | null;
    cacheWriteTokens?: number | null;
    timeToFirstToken?: number | null;
    streamingTime?: number | null;
    creditCost?: number | null;
  }): Partial<MessageMetadata> {
    const meta: Partial<MessageMetadata> = {};
    if (tokens.promptTokens !== null) {
      meta.promptTokens = tokens.promptTokens;
    }
    if (tokens.completionTokens !== null) {
      meta.completionTokens = tokens.completionTokens;
    }
    if (tokens.finishReason) {
      meta.finishReason = tokens.finishReason;
    }
    if (
      tokens.cachedInputTokens !== null &&
      tokens.cachedInputTokens !== undefined
    ) {
      meta.cachedInputTokens = tokens.cachedInputTokens;
    }
    if (
      tokens.cacheWriteTokens !== null &&
      tokens.cacheWriteTokens !== undefined &&
      tokens.cacheWriteTokens > 0
    ) {
      meta.cacheWriteTokens = tokens.cacheWriteTokens;
    }
    if (
      tokens.timeToFirstToken !== null &&
      tokens.timeToFirstToken !== undefined
    ) {
      meta.timeToFirstToken = tokens.timeToFirstToken;
    }
    if (tokens.streamingTime !== null && tokens.streamingTime !== undefined) {
      meta.streamingTime = tokens.streamingTime;
    }
    if (tokens.creditCost !== null && tokens.creditCost !== undefined) {
      meta.creditCost = tokens.creditCost;
    }
    return meta;
  }

  /** Write token metadata only (no content update). Used when content was already flushed. */
  async writeTokenMetadataOnly(
    messageId: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      streamingTime?: number | null;
      creditCost?: number | null;
    },
  ): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    try {
      const tokenMetadata = ThrottleEngine.buildTokenMetadata(tokens);
      if (Object.keys(tokenMetadata).length === 0) {
        return;
      }

      const [existing] = await db
        .select({ metadata: chatMessages.metadata })
        .from(chatMessages)
        .where(eq(chatMessages.id, messageId));

      await db
        .update(chatMessages)
        .set({
          metadata: { ...existing?.metadata, ...tokenMetadata },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, messageId));
    } catch (err) {
      this.deps.logger.error(
        "[MessageDbWriter] Failed to write token metadata",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  /** Write final content and token metadata in a single DB update. */
  async writeContentAndTokens(
    messageId: string,
    content: string,
    tokens: {
      promptTokens: number | null;
      completionTokens: number | null;
      finishReason: string | null;
      cachedInputTokens?: number | null;
      cacheWriteTokens?: number | null;
      timeToFirstToken?: number | null;
      creditCost?: number | null;
    },
  ): Promise<void> {
    if (this.deps.isIncognito) {
      return;
    }
    try {
      const tokenMetadata = ThrottleEngine.buildTokenMetadata(tokens);

      if (Object.keys(tokenMetadata).length > 0) {
        const [existing] = await db
          .select({ metadata: chatMessages.metadata })
          .from(chatMessages)
          .where(eq(chatMessages.id, messageId));

        await db
          .update(chatMessages)
          .set({
            content: content.trim() || null,
            metadata: { ...existing?.metadata, ...tokenMetadata },
            updatedAt: new Date(),
          })
          .where(eq(chatMessages.id, messageId));
      } else {
        await db
          .update(chatMessages)
          .set({ content: content.trim() || null, updatedAt: new Date() })
          .where(eq(chatMessages.id, messageId));
      }
    } catch (err) {
      this.deps.logger.error(
        "[MessageDbWriter] Failed to write content and token metadata",
        {
          messageId,
          error: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }
}
