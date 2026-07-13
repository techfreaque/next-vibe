/**
 * Thread streaming-state — the SINGLE owner of streaming-state transitions.
 *
 * A thread's `streamingState` (idle / streaming / waiting) is read by three
 * independent client views, each on its own WS channel keyed differently:
 *
 *   - messages-get     → the OPEN thread view (keyed by threadId + rootFolderId)
 *   - threads-get      → the sidebar LIST (keyed by rootFolderId + subFolderId)
 *   - folder-contents  → the folder tree (keyed by rootFolderId)
 *
 * Before this module, transitions were scattered (setup, clearStreamingState,
 * setStreamingStateWaiting, claimRevivalSlot, escalation, revival) and each
 * hand-rolled a partial emit — several skipped channels entirely and ALL of
 * them hardcoded `subFolderId: null`, so a thread living in a SUBFOLDER (e.g.
 * PRIVATE/cheap) never received its own state changes on the sidebar list.
 * That is the incoherence: the DB said "streaming" while the list showed idle,
 * or a finished thread stayed spinning forever in a subfolder view.
 *
 * `emitStreamingState` fixes it in ONE place: it fans the change out on all
 * three channels using the thread's REAL `folderId` as the list subFolderId, so
 * every subscribed view converges on the DB truth. `transitionStreamingState`
 * pairs the DB write with the emit for callers that own the write too.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ResolvedRelayContext } from "@/app/api/[locale]/system/realtime/remote-event-bridge/relay-context";

import { DefaultFolderId } from "../../../chat/config";
import { chatThreads } from "../../../chat/db";
import type { ThreadStreamingState } from "../../../chat/enum";
import { createFolderContentsEmitter } from "../../../chat/folder-contents/[rootFolderId]/emitter";
import { createMessagesGetEmitter } from "../../../chat/threads/[threadId]/messages/emitter";
import { createThreadsGetEmitter } from "../../../chat/threads/emitter";

/** Everything the 3-channel fan-out needs. When rootFolderId/subFolderId are
 *  omitted they are loaded from the thread row (one round-trip). */
export interface StreamingStateEmit {
  threadId: string;
  state: ThreadStreamingState;
  logger: EndpointLogger;
  user: JwtPayloadType;
  /** Root folder for channel routing — loaded from the thread when omitted. */
  rootFolderId?: DefaultFolderId | null;
  /** The thread's own folderId — the list channel's subFolderId. Loaded from
   *  the thread when omitted (`null` = a root-level thread). */
  subFolderId?: string | null;
  updatedAt?: Date;
  resolvedRelayContext?: ResolvedRelayContext;
}

/**
 * Fan a streaming-state change out on ALL three channels a client may watch,
 * routed to the thread's REAL folder so subfolder views converge too. Emit
 * only — the DB write is the caller's (or use transitionStreamingState).
 */
export async function emitStreamingState(
  params: StreamingStateEmit,
): Promise<void> {
  const { threadId, state, logger, user, resolvedRelayContext } = params;

  // Resolve channel routing from the thread when the caller didn't supply it.
  let rootFolderId = params.rootFolderId;
  let subFolderId = params.subFolderId;
  if (rootFolderId === undefined || subFolderId === undefined) {
    const [row] = await db
      .select({
        rootFolderId: chatThreads.rootFolderId,
        folderId: chatThreads.folderId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);
    if (rootFolderId === undefined) {
      rootFolderId = row?.rootFolderId ?? null;
    }
    if (subFolderId === undefined) {
      subFolderId = row?.folderId ?? null;
    }
  }
  const effectiveRoot = rootFolderId ?? DefaultFolderId.PRIVATE;
  const updatedAt = params.updatedAt ?? new Date();

  // The list-row shape shared by threads-get + folder-contents.
  const listRow = {
    id: threadId,
    streamingState: state,
    updatedAt,
  };

  // 1. OPEN thread view (messages-get) — keyed by threadId + rootFolderId.
  createMessagesGetEmitter(logger, user, {
    threadId,
    rootFolderId: effectiveRoot,
    resolvedRelayContext,
  })("streaming-state-changed", {
    responseData: { streamingState: state },
  });

  // 2. Sidebar LIST (threads-get) — keyed by rootFolderId + subFolderId. The
  //    thread's REAL folderId is the subFolderId (was hardcoded null before).
  createThreadsGetEmitter(logger, user, {
    rootFolderId: effectiveRoot,
    subFolderId: subFolderId ?? null,
    resolvedRelayContext,
  })("streaming-state-changed", {
    responseData: { threads: [listRow] },
  });

  // 3. Folder tree (folder-contents) — target the thread's OWN folder channel
  //    (subFolderId) so a nested-folder viewer gets the update, and carry the
  //    `type`/`rootFolderId` discriminators so a not-yet-cached thread doesn't
  //    merge as a partial stub.
  if (rootFolderId) {
    createFolderContentsEmitter(logger, user, rootFolderId, {
      subFolderId: subFolderId ?? null,
      resolvedRelayContext,
    })("streaming-state-changed", {
      responseData: {
        items: [
          {
            ...listRow,
            type: "thread" as const,
            rootFolderId: effectiveRoot,
            folderId: subFolderId ?? null,
          },
        ],
      },
    });
  }
}

/**
 * Write the streaming state to the DB AND fan the change out (emitStreamingState).
 * The one call every transition owner uses so DB truth and every client view
 * never diverge. Returns the resolved channel routing for callers that reuse it.
 */
export async function transitionStreamingState(params: {
  threadId: string;
  state: ThreadStreamingState;
  logger: EndpointLogger;
  user: JwtPayloadType;
  /** Ownership token to stamp/clear alongside the state (streaming_run_id). */
  streamingRunId?: string | null;
  resolvedRelayContext?: ResolvedRelayContext;
}): Promise<{
  rootFolderId: DefaultFolderId | null;
  subFolderId: string | null;
}> {
  const {
    threadId,
    state,
    logger,
    user,
    streamingRunId,
    resolvedRelayContext,
  } = params;
  const updatedAt = new Date();
  const [row] = await db
    .update(chatThreads)
    .set({
      streamingState: state,
      updatedAt,
      ...(streamingRunId !== undefined ? { streamingRunId } : {}),
    })
    .where(eq(chatThreads.id, threadId))
    .returning({
      rootFolderId: chatThreads.rootFolderId,
      folderId: chatThreads.folderId,
    });

  const rootFolderId = row?.rootFolderId ?? null;
  const subFolderId = row?.folderId ?? null;
  await emitStreamingState({
    threadId,
    state,
    logger,
    user,
    rootFolderId,
    subFolderId,
    updatedAt,
    resolvedRelayContext,
  });
  return { rootFolderId, subFolderId };
}
