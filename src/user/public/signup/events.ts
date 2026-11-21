import "server-only";

/**
 * Signup funnel step events (signup_events). Best-effort: a failed write is
 * logged and never breaks the signup request that triggered it.
 */
import { type SQL, sql } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { pendingSignups, signupEvents } from "./db";
import { SignupEventType, type SignupEventTypeDB } from "./event-type";

export interface SignupEventInput {
  leadId: string;
  pendingId: string;
  type: (typeof SignupEventTypeDB)[number];
  occurredAt?: Date;
  /** Set for steps that can be replayed (bounce refinement, expiry sweep). */
  dedupeKey?: string;
}

export async function recordSignupEvents(
  events: readonly SignupEventInput[],
  logger: EndpointLogger,
): Promise<void> {
  if (events.length === 0) {
    return;
  }
  try {
    await db
      .insert(signupEvents)
      .values(
        events.map((event) => ({
          leadId: event.leadId,
          pendingId: event.pendingId,
          type: event.type,
          occurredAt: event.occurredAt ?? new Date(),
          dedupeKey: event.dedupeKey ?? null,
        })),
      )
      .onConflictDoNothing();
  } catch (error) {
    logger.error("Failed to record signup events", {
      types: events.map((event) => event.type),
      error: parseError(error).message,
    });
  }
}

/** One BOUNCED event per dispatch (pending id + send time). */
export function bounceDedupeKey(pendingId: string, sentAt: Date): string {
  return `bounced:${pendingId}:${String(sentAt.getTime())}`;
}

/** SQL dedupe key of an expiry: pending id + the expiry it reached. */
export function expiryDedupeKeySql(idColumn: SQL, expiresColumn: SQL): SQL {
  return sql`'expired:' || ${idColumn}::text || ':' || (extract(epoch from ${expiresColumn}) * 1000)::bigint::text`;
}

/**
 * Record EXPIRED for every pending signup whose confirmation window passed
 * (dated at its expiry). Idempotent; runs from the bounce sync and before a
 * new challenge replaces a lead's old row.
 */
export async function recordExpiredSignups(
  logger: EndpointLogger,
): Promise<number> {
  try {
    const result = await db.execute<{ id: string }>(sql`
      INSERT INTO ${signupEvents} (lead_id, pending_id, type, occurred_at, dedupe_key)
      SELECT p.lead_id, p.id, ${SignupEventType.EXPIRED}::text, p.expires_at,
        ${expiryDedupeKeySql(sql`p.id`, sql`p.expires_at`)}
      FROM ${pendingSignups} p
      WHERE p.expires_at <= ${new Date().toISOString()}::timestamp
      ON CONFLICT (dedupe_key) DO NOTHING
      RETURNING id
    `);
    return result.rows.length;
  } catch (error) {
    logger.error("Failed to record expired signups", parseError(error));
    return 0;
  }
}
