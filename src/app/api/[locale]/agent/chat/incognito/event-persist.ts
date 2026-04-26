/**
 * Incognito Event Persistence Helpers
 *
 * Two levels of helpers:
 *
 * 1. Factory helpers (onEventXxx) — for simple events where the entire
 *    onEvent is incognito persistence. Assign directly:
 *      onEvent: onEventPersistMessage()
 *
 * 2. Imperative helpers (persistXxxIfIncognito) — for mixed events that
 *    also have other logic. Call inside an existing onEvent handler:
 *      onEvent: async (ctx) => {
 *        // ... other logic
 *        await persistMessageIfIncognito(ctx.urlPathParams.threadId, ctx.requestData.rootFolderId, ...);
 *      }
 */

import type { ChatFolder, ChatThread } from "../db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { QueryClient } from "@tanstack/react-query";
import { DefaultFolderId } from "../config";

// ─── Minimal context interface ────────────────────────────────────────────────

interface MinCtx {
  readonly partial: { readonly [K: string]: WidgetData | undefined };
  readonly urlPathParams: { readonly [K: string]: string };
  readonly requestData: { readonly [K: string]: WidgetData | undefined };
  readonly queryClient: QueryClient;
  readonly logger: EndpointLogger;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function getStringField(
  ctx: MinCtx,
  source: "urlPathParams" | "requestData",
  key: string,
): string | undefined {
  const val =
    source === "urlPathParams" ? ctx.urlPathParams[key] : ctx.requestData[key];
  return typeof val === "string" ? val : undefined;
}

function isIncognito(
  ctx: MinCtx,
  source: "urlPathParams" | "requestData",
): boolean {
  return (
    getStringField(ctx, source, "rootFolderId") === DefaultFolderId.INCOGNITO
  );
}

function firstItemId(ctx: MinCtx, arrayField: string): string | undefined {
  const arr = ctx.partial[arrayField];
  if (!Array.isArray(arr)) {
    return undefined;
  }
  const first = arr[0];
  if (
    first !== null &&
    typeof first === "object" &&
    !Array.isArray(first) &&
    "id" in first &&
    typeof first["id"] === "string"
  ) {
    return first["id"];
  }
  return undefined;
}

// ─── Imperative helpers (for mixed onEvent handlers) ─────────────────────────

/**
 * Persist a specific message to incognito localStorage.
 * Use in mixed onEvent handlers where you already have msgId and threadId.
 */
export async function persistMessageIfIncognito(
  threadId: string,
  msgId: string,
  rootFolderId: string,
  logger: EndpointLogger,
  skipOptimistic = true,
): Promise<void> {
  if (rootFolderId !== DefaultFolderId.INCOGNITO) {
    return;
  }
  const [{ getCachedMessages }, { saveMessage }] = await Promise.all([
    import("../threads/[threadId]/messages/hooks/update-messages"),
    import("./storage"),
  ]);
  const msgs = getCachedMessages(
    threadId,
    rootFolderId as DefaultFolderId,
    logger,
  );
  const msg = msgs.find((m) => m.id === msgId);
  if (msg && !(skipOptimistic && msg.metadata?.isOptimistic)) {
    await saveMessage(msg);
  }
}

/**
 * Set streamingState: "idle" on a thread in incognito localStorage.
 * Use in mixed onEvent handlers where you already have threadId and rootFolderId.
 */
export async function finishIncognitoThreadIfIncognito(
  threadId: string,
  rootFolderId: string,
): Promise<void> {
  if (rootFolderId !== DefaultFolderId.INCOGNITO) {
    return;
  }
  const { updateIncognitoThread } = await import("./storage");
  await updateIncognitoThread(threadId, { streamingState: "idle" });
}

// ─── Factory helpers (for simple onEvent = pure incognito persistence) ────────

/**
 * Persist a message from the live cache to incognito localStorage after a merge.
 * Reads the FULL message from cache (not just the partial) so all fields are saved.
 *
 * @param skipOptimistic - skip messages with metadata.isOptimistic (default: true)
 */
export function onEventPersistMessage<TCtx extends MinCtx>(opts?: {
  skipOptimistic?: boolean;
}): (ctx: TCtx) => Promise<void> {
  const skipOptimistic = opts?.skipOptimistic ?? true;

  return async (ctx) => {
    if (!isIncognito(ctx, "requestData")) {
      return;
    }
    const msgId = firstItemId(ctx, "messages");
    if (!msgId) {
      return;
    }
    const threadId = ctx.urlPathParams["threadId"];
    if (!threadId) {
      return;
    }
    const rootFolderId =
      getStringField(ctx, "requestData", "rootFolderId") ?? "";
    await persistMessageIfIncognito(
      threadId,
      msgId,
      rootFolderId,
      ctx.logger,
      skipOptimistic,
    );
  };
}

// ─── Thread persistence ───────────────────────────────────────────────────────

/**
 * Update a thread in incognito localStorage from the event partial.
 *
 * @param source - "requestData" (threads endpoint) or "urlPathParams" (folder-contents)
 * @param arrayField - field name in partial that holds the thread/item array
 * @param pick - which fields from the partial item to pass to updateIncognitoThread
 */
export function onEventUpdateIncognitoThread<TCtx extends MinCtx>(opts: {
  source: "urlPathParams" | "requestData";
  arrayField: string;
  pick: (keyof ChatThread)[];
}): (ctx: TCtx) => Promise<void> {
  const { source, arrayField, pick } = opts;

  return async (ctx) => {
    if (!isIncognito(ctx, source)) {
      return;
    }
    const partial = ctx.partial as Record<string, Array<Partial<ChatThread>>>;
    const item = partial[arrayField]?.[0];
    if (!item?.id) {
      return;
    }
    const updates: Partial<ChatThread> = {};
    for (const key of pick) {
      if (item[key] !== undefined) {
        (updates as Record<string, ChatThread[typeof key]>)[key] = item[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return;
    }
    const { updateIncognitoThread } = await import("./storage");
    await updateIncognitoThread(item.id, updates);
  };
}

/**
 * Delete a thread from incognito localStorage.
 */
export function onEventDeleteIncognitoThread<TCtx extends MinCtx>(opts: {
  source: "urlPathParams" | "requestData";
  arrayField: string;
}): (ctx: TCtx) => Promise<void> {
  const { source, arrayField } = opts;

  return async (ctx) => {
    if (!isIncognito(ctx, source)) {
      return;
    }
    const id = firstItemId(ctx, arrayField);
    if (!id) {
      return;
    }
    const { deleteThread } = await import("./storage");
    await deleteThread(id);
  };
}

/**
 * Set streamingState: "idle" on the thread in incognito localStorage.
 * Used for stream-finished on the messages channel where threadId is in urlPathParams.
 */
export function onEventFinishIncognitoThread<TCtx extends MinCtx>(opts: {
  source: "urlPathParams" | "requestData";
}): (ctx: TCtx) => Promise<void> {
  const { source } = opts;

  return async (ctx) => {
    if (!isIncognito(ctx, source)) {
      return;
    }
    const threadId = ctx.urlPathParams["threadId"];
    if (!threadId) {
      return;
    }
    const rootFolderId = getStringField(ctx, source, "rootFolderId") ?? "";
    await finishIncognitoThreadIfIncognito(threadId, rootFolderId);
  };
}

// ─── Folder persistence ───────────────────────────────────────────────────────

/**
 * Update a folder in incognito localStorage from the event partial.
 * Always reads rootFolderId from urlPathParams (folder-contents endpoint).
 */
export function onEventUpdateIncognitoFolder<TCtx extends MinCtx>(opts: {
  arrayField: string;
  pick: (keyof ChatFolder)[];
}): (ctx: TCtx) => Promise<void> {
  const { arrayField, pick } = opts;

  return async (ctx) => {
    if (!isIncognito(ctx, "urlPathParams")) {
      return;
    }
    const partial = ctx.partial as Record<string, Array<Partial<ChatFolder>>>;
    const item = partial[arrayField]?.[0];
    if (!item?.id) {
      return;
    }
    const updates: Partial<ChatFolder> = {};
    for (const key of pick) {
      if (item[key] !== undefined) {
        (updates as Record<string, ChatFolder[typeof key]>)[key] = item[key];
      }
    }
    if (Object.keys(updates).length === 0) {
      return;
    }
    const { updateIncognitoFolder } = await import("./storage");
    await updateIncognitoFolder(item.id, updates);
  };
}

/**
 * Delete a folder from incognito localStorage.
 * Always reads rootFolderId from urlPathParams (folder-contents endpoint).
 */
export function onEventDeleteIncognitoFolder<TCtx extends MinCtx>(opts: {
  arrayField: string;
}): (ctx: TCtx) => Promise<void> {
  const { arrayField } = opts;

  return async (ctx) => {
    if (!isIncognito(ctx, "urlPathParams")) {
      return;
    }
    const id = firstItemId(ctx, arrayField);
    if (!id) {
      return;
    }
    const { deleteFolder } = await import("./storage");
    await deleteFolder(id);
  };
}
