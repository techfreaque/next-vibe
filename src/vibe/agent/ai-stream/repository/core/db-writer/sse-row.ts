/**
 * buildSseMessageRow - the ONE place that materialises the full ~20-field
 * message row sent in message-created (and friends) SSE/WS payloads.
 * Every emitter used to hand-roll this literal; they now pass only the fields
 * that differ from the defaults (null / 0 / empty metadata / now-timestamps).
 */

import "server-only";

import type { MessageMetadata } from "../../../../chat/db";
import type { ChatMessageRole } from "../../../../chat/enum";
import type { ChatModelId } from "../../../models";

/** The full message row shape expected by the messages WS event payloads. */
export interface SseMessageRow {
  id: string;
  threadId: string;
  role: ChatMessageRole;
  isAI: boolean;
  content: string | null;
  parentId: string | null;
  sequenceId: string | null;
  model: ChatModelId | null;
  skill: string | null;
  metadata: MessageMetadata;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
  authorName: string | null;
  errorType: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  upvotes: number;
  downvotes: number;
  searchVector: string | null;
}

/** id/threadId/role are always required; everything else falls back to defaults. */
export type SseMessageRowOverrides = Pick<
  SseMessageRow,
  "id" | "threadId" | "role"
> &
  Partial<SseMessageRow>;

/**
 * Build a full SSE message row from the given overrides.
 * Defaults: null for all nullable fields, 0 votes, `{}` metadata, `new Date()`
 * timestamps, isAI false.
 */
export function buildSseMessageRow(
  overrides: SseMessageRowOverrides,
): SseMessageRow {
  const now = new Date();
  return {
    isAI: false,
    content: null,
    parentId: null,
    sequenceId: null,
    model: null,
    skill: null,
    metadata: {},
    createdAt: now,
    updatedAt: now,
    authorId: null,
    authorName: null,
    errorType: null,
    errorCode: null,
    errorMessage: null,
    upvotes: 0,
    downvotes: 0,
    searchVector: null,
    ...overrides,
  };
}
