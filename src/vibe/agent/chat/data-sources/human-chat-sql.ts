/**
 * Which stored chats count as human AI usage in the chat analytics.
 *
 * Counted: threads in the private, shared and public roots of non-admin
 * accounts and guests. Left out: background agent threads (cron root), foreign
 * copies of remote-instance threads (remote root: counted where they ran) and
 * admin (internal) accounts. Incognito chats are never stored server-side, so
 * guest usage lives in the credit ledger (credits-active-spenders), not here.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { chatMessages, chatThreads } from "../db";

const HUMAN_ROOTS: readonly DefaultFolderId[] = [
  DefaultFolderId.PRIVATE,
  DefaultFolderId.SHARED,
  DefaultFolderId.PUBLIC,
];

function humanThreadConditionRaw(alias: string): SQL {
  const a = sql.raw(alias);
  return sql`${a}.root_folder_id IN (${sql.join(
    HUMAN_ROOTS.map((root) => sql`${root}`),
    sql`, `,
  )}) AND (${a}.user_id IS NULL OR ${a}.user_id NOT IN (
    SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN}
  ))`;
}

/** chat_threads row is a human chat. */
export const humanChatThread: SQL = sql`${chatThreads.id} IN (
  SELECT ht.id FROM chat_threads ht WHERE ${humanThreadConditionRaw("ht")}
)`;

/** chat_messages row belongs to a human chat. */
export const humanChatMessage: SQL = sql`${chatMessages.threadId} IN (
  SELECT ht.id FROM chat_threads ht WHERE ${humanThreadConditionRaw("ht")}
)`;
