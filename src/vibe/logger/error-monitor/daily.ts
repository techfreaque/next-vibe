/**
 * Error Log Daily Recorder
 * Adds occurrences to the per-day counter of a fingerprint (error_log_daily)
 * so the error monitor can chart occurrences over time and count affected
 * users/leads. Called by the persistence layer right after the error_logs
 * upsert (the fingerprint row must exist: foreign key).
 *
 * Best-effort like the rest of error persistence: never throws.
 */

import "server-only";

import type { LoggerMetadata } from "../types";
import { errorLogDaily } from "./db";

/** Distinct ids kept per fingerprint per day (bounded row size). */
export const ERROR_LOG_DAILY_MAX_IDS = 100;

const UUID_LIKE = /^[0-9a-f-]{8,64}$/i;

function isRecord(m: LoggerMetadata): m is { [key: string]: LoggerMetadata } {
  return (
    m !== null &&
    typeof m === "object" &&
    !Array.isArray(m) &&
    !(m instanceof Date) &&
    !(m instanceof Error)
  );
}

/** All string values of `key` across the metadata records, id-shaped only. */
function collectIds(
  metadata: readonly LoggerMetadata[] | null | undefined,
  key: "userId" | "leadId",
): string[] {
  const ids = new Set<string>();
  for (const m of metadata ?? []) {
    if (isRecord(m)) {
      const record: { readonly [k: string]: LoggerMetadata | undefined } = m;
      const v = record[key];
      if (typeof v === "string" && UUID_LIKE.test(v)) {
        ids.add(v.toLowerCase());
      }
    }
  }
  return [...ids].slice(0, ERROR_LOG_DAILY_MAX_IDS);
}

/** UTC midnight of `at`. */
function utcDayStart(at: Date): Date {
  return new Date(
    Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()),
  );
}

export interface ErrorLogDailyInput {
  fingerprint: string;
  occurrences: number;
  metadata: readonly LoggerMetadata[] | null | undefined;
  /** Defaults to now. */
  at?: Date;
}

export async function recordErrorLogDaily(
  input: ErrorLogDailyInput,
): Promise<void> {
  try {
    const { db } = await import("../../database");
    const { sql } = await import("drizzle-orm");

    const userIds = collectIds(input.metadata, "userId");
    const leadIds = collectIds(input.metadata, "leadId");
    const occurrences =
      Number.isInteger(input.occurrences) && input.occurrences > 0
        ? input.occurrences
        : 1;
    const max = ERROR_LOG_DAILY_MAX_IDS;

    await db
      .insert(errorLogDaily)
      .values({
        fingerprint: input.fingerprint,
        day: utcDayStart(input.at ?? new Date()),
        occurrences,
        userIds,
        leadIds,
      })
      .onConflictDoUpdate({
        target: [errorLogDaily.fingerprint, errorLogDaily.day],
        set: {
          occurrences: sql`${errorLogDaily.occurrences} + ${occurrences}`,
          userIds: sql`(SELECT COALESCE(jsonb_agg(v), '[]'::jsonb) FROM (SELECT DISTINCT v FROM jsonb_array_elements_text(${errorLogDaily.userIds} || excluded.user_ids) v LIMIT ${max}) s)`,
          leadIds: sql`(SELECT COALESCE(jsonb_agg(v), '[]'::jsonb) FROM (SELECT DISTINCT v FROM jsonb_array_elements_text(${errorLogDaily.leadIds} || excluded.lead_ids) v LIMIT ${max}) s)`,
        },
      });
  } catch {
    // Silently swallow - logging persistence must never cascade
  }
}
