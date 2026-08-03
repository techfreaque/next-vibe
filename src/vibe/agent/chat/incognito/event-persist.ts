/**
 * Incognito Event Persistence Helpers
 *
 * Imperative helpers for use inside onEvent handlers:
 *   - persistMessageIfIncognito
 *   - finishIncognitoThreadIfIncognito
 *
 * Factory helpers that return typed onEvent handlers:
 *   - onEventPersistMessage
 *   - onEventUpdateIncognitoThread
 *   - onEventDeleteIncognitoThread
 *   - onEventUpdateIncognitoFolder
 *   - onEventDeleteIncognitoFolder
 */

import type { EndpointLogger } from "next-vibe/logger/types";

import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { ChatFolder, ChatThread } from "../db";
import { ThreadStreamingState } from "../enum";

// ─── Imperative helpers ───────────────────────────────────────────────────────

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
  const msgs = getCachedMessages(threadId, rootFolderId, logger);
  const msg = msgs.find((m) => m.id === msgId);
  if (msg && !(skipOptimistic && msg.metadata?.isOptimistic)) {
    await saveMessage(msg);
  }
}

export async function finishIncognitoThreadIfIncognito(
  threadId: string,
  rootFolderId: string,
): Promise<void> {
  if (rootFolderId !== DefaultFolderId.INCOGNITO) {
    return;
  }
  const { updateIncognitoThread } = await import("./storage");
  await updateIncognitoThread(threadId, {
    streamingState: ThreadStreamingState.IDLE,
  });
}

// ─── onEvent factory helpers ──────────────────────────────────────────────────
//
// These factories return functions whose `ctx` parameter type is fully inferred
// by the framework at the call site — no manual generic constraints here.
// TypeScript resolves TResponseData/TRequestData/TUrlPathParams from the event
// declaration's responseFields/requestFields/urlPathParamsFields, then checks
// that the function body accesses only valid properties.

export function onEventPersistMessage(): (ctx: {
  responseData: { messages?: ReadonlyArray<{ id?: string | null }> | null };
  requestData: { rootFolderId?: string | null };
  urlPathParams: { threadId: string };
  logger: EndpointLogger;
}) => Promise<void> {
  return async (ctx) => {
    const rootFolderId = ctx.requestData.rootFolderId ?? "";
    if (rootFolderId !== DefaultFolderId.INCOGNITO) {
      return;
    }
    const threadId = ctx.urlPathParams.threadId;
    const messages = ctx.responseData.messages;
    if (!messages) {
      return;
    }
    for (const msg of messages) {
      if (!msg.id) {
        continue;
      }
      await persistMessageIfIncognito(
        threadId,
        msg.id,
        rootFolderId,
        ctx.logger,
      );
    }
  };
}

export function onEventUpdateIncognitoThread<
  TArrayField extends string,
  TKey extends keyof ChatThread,
>(opts: {
  source: "requestData" | "urlPathParams";
  arrayField: TArrayField;
  pick: TKey[];
}): (ctx: {
  responseData: Record<
    TArrayField,
    ReadonlyArray<Pick<ChatThread, TKey | "id">>
  >;
  requestData: { rootFolderId?: string | null };
  urlPathParams: { rootFolderId?: string | null };
}) => Promise<void> {
  return async (ctx) => {
    const rootFolderId =
      opts.source === "urlPathParams"
        ? (ctx.urlPathParams.rootFolderId ?? "")
        : (ctx.requestData.rootFolderId ?? "");
    if (rootFolderId !== DefaultFolderId.INCOGNITO) {
      return;
    }
    const items = ctx.responseData[opts.arrayField];
    const { updateIncognitoThread } = await import("./storage");
    for (const item of items) {
      const patch: Pick<ChatThread, TKey> = Object.fromEntries(
        opts.pick.map((key) => [key, item[key]]),
      ) as Pick<ChatThread, TKey>;
      await updateIncognitoThread(item.id, patch);
    }
  };
}

export function onEventDeleteIncognitoThread<TArrayField extends string>(opts: {
  source: "requestData" | "urlPathParams";
  arrayField: TArrayField;
}): (ctx: {
  responseData: Record<TArrayField, ReadonlyArray<{ id: string }>>;
  requestData: { rootFolderId?: string | null };
  urlPathParams: { rootFolderId?: string | null };
}) => Promise<void> {
  return async (ctx) => {
    const rootFolderId =
      opts.source === "urlPathParams"
        ? (ctx.urlPathParams.rootFolderId ?? "")
        : (ctx.requestData.rootFolderId ?? "");
    if (rootFolderId !== DefaultFolderId.INCOGNITO) {
      return;
    }
    const items = ctx.responseData[opts.arrayField];
    const { deleteThread } = await import("./storage");
    for (const item of items) {
      await deleteThread(item.id);
    }
  };
}

export function onEventUpdateIncognitoFolder<
  TArrayField extends string,
  TKey extends keyof ChatFolder,
>(opts: {
  arrayField: TArrayField;
  pick: TKey[];
}): (ctx: {
  responseData: Record<
    TArrayField,
    ReadonlyArray<Pick<ChatFolder, TKey | "id">>
  >;
  requestData: { rootFolderId?: string | null };
  urlPathParams: { rootFolderId?: string | null };
}) => Promise<void> {
  return async (ctx) => {
    const rootFolderId =
      ctx.urlPathParams.rootFolderId ?? ctx.requestData.rootFolderId ?? "";
    if (rootFolderId !== DefaultFolderId.INCOGNITO) {
      return;
    }
    const items = ctx.responseData[opts.arrayField];
    const { updateIncognitoFolder } = await import("./storage");
    for (const item of items) {
      const patch: Pick<ChatFolder, TKey> = Object.fromEntries(
        opts.pick.map((key) => [key, item[key]]),
      ) as Pick<ChatFolder, TKey>;
      await updateIncognitoFolder(item.id, patch);
    }
  };
}

export function onEventDeleteIncognitoFolder<TArrayField extends string>(opts: {
  arrayField: TArrayField;
}): (ctx: {
  responseData: Record<TArrayField, ReadonlyArray<{ id: string }>>;
  requestData: { rootFolderId?: string | null };
  urlPathParams: { rootFolderId?: string | null };
}) => Promise<void> {
  return async (ctx) => {
    const rootFolderId =
      ctx.urlPathParams.rootFolderId ?? ctx.requestData.rootFolderId ?? "";
    if (rootFolderId !== DefaultFolderId.INCOGNITO) {
      return;
    }
    const items = ctx.responseData[opts.arrayField];
    const { deleteFolder } = await import("./storage");
    for (const item of items) {
      await deleteFolder(item.id);
    }
  };
}
