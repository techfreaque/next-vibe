"use client";

import type { DefaultFolderId } from "next-vibe/core/execution-context";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

/** Where the sidebar row that was deleted came from. */
export interface StaleThreadDeleteSource {
  threadId: string;
  rootFolderId: DefaultFolderId;
  folderId: string | null;
  /** Which sidebar list rendered the row. */
  list: "folder-contents" | "threads";
  createdAt: Date;
  updatedAt: Date;
  /** The send-message optimistic placeholder has no owner id yet. */
  ownerKnown: boolean | null;
  streamingState: string | null;
  isActive: boolean;
}

/**
 * A sidebar DELETE that comes back 404 means the row was stale: the server no
 * longer has the thread. The optimistic removal already dropped it from this
 * list; `reconcile` refetches the list so no other stale row survives either.
 * The warn carries the row's provenance (age, optimistic placeholder or not,
 * page age) so the next occurrence explains where the stale row came from.
 * The transport row ("Endpoint call rejected") is logged separately by the
 * API client; this one is the sidebar side of the same event (same threadId).
 */
export function handleThreadDeleteError(
  error: ErrorResponseType,
  source: StaleThreadDeleteSource,
  logger: EndpointLogger,
  reconcile: () => Promise<void>,
): void {
  if (error.errorType.errorCode !== ErrorResponseTypes.NOT_FOUND.errorCode) {
    return;
  }
  const now = Date.now();
  logger.warn(
    "[thread-delete] Sidebar listed a thread the server no longer has",
    {
      threadId: source.threadId,
      rootFolderId: source.rootFolderId,
      folderId: source.folderId,
      list: source.list,
      rowAgeMs: now - new Date(source.createdAt).getTime(),
      rowUpdatedAgoMs: now - new Date(source.updatedAt).getTime(),
      ownerKnown: source.ownerKnown,
      streamingState: source.streamingState,
      isActive: source.isActive,
      pageAgeMs:
        typeof performance === "undefined"
          ? null
          : Math.round(performance.now()),
    },
  );
  void reconcile();
}
