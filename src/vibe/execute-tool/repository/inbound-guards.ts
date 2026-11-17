/**
 * Inbound wire-payload guards for cross-instance tool execution.
 *
 * A connected peer holds the account's token and controls the WHOLE
 * tool-execute-request / tool-execute-result payload. Everything the wire
 * carries beyond the execution args (caller platform, skill, thread, callId)
 * is a claim, never an authority: these helpers reduce each claim to what
 * the authenticated local user is entitled to.
 */

import "server-only";

import { and, eq } from "drizzle-orm";

import { chatThreads } from "../../agent/chat/db";
import { isUuid } from "../../agent/chat/slugify";
import { db } from "../../database";
import type { JwtPayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { Platform } from "../../platforms/platforms";

/**
 * Surfaces a NON-admin peer may claim. AI/MCP are the agent surfaces a remote
 * tool call legitimately comes from; NEXT_API is what the relay (ai-stream,
 * AI_TOOL_OFF) rides and is exactly the plain-HTTP surface the same token
 * already reaches directly, so it grants nothing new. Everything else
 * (CLI_PACKAGE's CLI_AUTH_BYPASS, CLI ignoring WEB_OFF/AI_TOOL_OFF, CRON,
 * TRPC, ...) would widen the permission gate beyond the token's own reach.
 */
const NON_ADMIN_INBOUND_PLATFORMS: ReadonlySet<Platform> = new Set([
  Platform.AI,
  Platform.MCP,
  Platform.NEXT_API,
]);

export function isAdminUser(user: JwtPayloadType): boolean {
  return !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
}

/**
 * The platform an inbound remote tool call is gated under. Admins keep the
 * claimed surface (their own `vibe --remote=<id> <tool>` CLI use); non-admins
 * are clamped to NON_ADMIN_INBOUND_PLATFORMS, anything else becomes AI.
 */
export function resolveInboundPlatform(
  user: JwtPayloadType,
  callerPlatform: Platform | undefined,
): Platform {
  if (callerPlatform === undefined) {
    return Platform.AI;
  }
  if (isAdminUser(user)) {
    return callerPlatform;
  }
  return NON_ADMIN_INBOUND_PLATFORMS.has(callerPlatform)
    ? callerPlatform
    : Platform.AI;
}

/** Whether the thread exists and belongs to this user. */
export async function isThreadOwnedByUser(
  threadId: string,
  userId: string,
): Promise<boolean> {
  if (!isUuid(threadId)) {
    return false;
  }
  const [row] = await db
    .select({ id: chatThreads.id })
    .from(chatThreads)
    .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
    .limit(1);
  return row !== undefined;
}

/**
 * Durable pending_call_results key. The table has no user column (and this
 * fix adds no migration), so the owning user is folded into the primary key:
 * a peer's result can only ever land in, and be consumed from, its own
 * account's namespace — a guessed/deterministic callId of another user never
 * collides with (or pre-empts via onConflictDoNothing) that user's row.
 */
export function pendingResultKey(
  userId: string | null,
  callId: string,
): string {
  return `${userId ?? ""}:${callId}`;
}
