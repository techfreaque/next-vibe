/**
 * Shared constants, types, and small pure helpers for the db-writer modules.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { CreditsT } from "@/app/api/[locale]/credits/i18n";

import type { MessagesWsEmit } from "../../../../chat/threads/[threadId]/messages/emitter";

/** Callback for emitting thread-title-updated to sidebar channels. */
export type EmitThreadTitleFn = (threadId: string, title: string) => void;

/** The values every method reaches through `this.deps` (constructor args). */
export interface WriterDeps {
  readonly isIncognito: boolean;
  readonly logger: EndpointLogger;
  readonly creditsT: CreditsT;
  readonly locale: CountryLanguage;
  readonly wsEmit: MessagesWsEmit;
  readonly emitTitle: EmitThreadTitleFn;
}

/** The throttle-engine surface the db-writer modules reach through the writer state. */
export interface ThrottleEngineView {
  advanceQueuedMessages(threadId: string, newParentId: string): void;
  scheduleUpdate(messageId: string, content: string): void;
  flush(messageId: string): Promise<void>;
  writeContentAndTokens(
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
  ): Promise<void>;
}

/**
 * The mutable state/deps view of MessageDbWriter that the extracted db-writer
 * modules operate on. The class satisfies this structurally - method bodies
 * moved to db-writer/ modules take this view instead of `this`.
 */
export interface DbWriterState {
  readonly deps: WriterDeps;
  readonly engine: ThrottleEngineView;
  /** Tracks the last assistant message ID written - used by headless callers */
  lastAssistantMessageId: string | null;
  /** Tracks the final text content of the last assistant message - populated even in incognito */
  lastAssistantContent: string | null;
  /** Tracks the URL of the last generated media (image/audio/video) - used by headless callers */
  lastGeneratedMediaUrl: string | null;
  /** Running total of credits deducted during this stream - used by headless callers to report cost */
  totalCreditsDeducted: number;
  /** Tracks the thread ID of the last assistant message - used for embedding sync */
  lastThreadId: string | null;
}

/** Throttle window in ms - coalesces content updates to same message */
export const THROTTLE_MS = 300;

/** Map a MIME type to an uploads mount type folder */
export function getMimeTypeFolder(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "images";
  }
  if (mimeType.startsWith("audio/")) {
    return "audio";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (
    mimeType.startsWith("text/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("application/vnd.") ||
    mimeType === "application/json" ||
    mimeType === "application/xml" ||
    mimeType === "application/msword"
  ) {
    return "documents";
  }
  return "other";
}

/**
 * Build thin thread content for cortex embedding.
 * Only title + tags + preview - no message content duplication.
 * Full thread content is resolved on-demand via the thread mount resolver.
 */
export function buildThinThreadContent(thread: {
  title: string | null;
  rootFolderId: string;
  tags: string[] | null;
  preview: string | null;
}): string {
  return [
    `# ${thread.title ?? "Untitled"}`,
    `Folder: ${thread.rootFolderId}`,
    thread.tags?.length ? `Tags: ${thread.tags.join(", ")}` : "",
    thread.preview ? `Preview: ${thread.preview.slice(0, 300)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export interface PendingWrite {
  messageId: string;
  content: string;
  timer: ReturnType<typeof setTimeout> | null;
  inflightPromise: Promise<void> | null;
}
