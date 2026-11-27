/**
 * Error Log Persistence
 * Fire-and-forget write of truncated error logs to the database.
 *
 * IMPORTANT: This module must never throw - logging persistence is best-effort.
 * All errors during persistence are silently swallowed to avoid cascading failures.
 */

import "server-only";

import { createHash } from "node:crypto";

import type { CountryLanguage } from "../core/i18n/core/config";
import {
  errorLogs,
  MAX_MESSAGE_LENGTH,
  MAX_STACK_LENGTH,
  type NewErrorLog,
} from "./error-monitor/db";
import { REFUSAL_DETAIL_LOG_KEY } from "./refusal-detail";
import { serializeLogValue } from "./serialize";
import { sanitizeLogText } from "./telemetry-privacy";
import { type ErrorLogLevel, type LoggerMetadata } from "./types";

/** Truncate a string to maxLen, appending "..." if truncated */
function truncate(str: string | undefined | null, maxLen: number): string {
  if (!str) {
    return "";
  }
  if (str.length <= maxLen) {
    return str;
  }
  return `${str.slice(0, maxLen - 3)}...`;
}

/** Extract a short stack trace (first few frames) */
function extractStack(error: LoggerMetadata | undefined): string | undefined {
  if (error instanceof Error && error.stack) {
    return truncate(sanitizeLogText(error.stack), MAX_STACK_LENGTH);
  }
  return undefined;
}

/** Extract error type from metadata */
function extractErrorType(
  error: LoggerMetadata | undefined,
): string | undefined {
  if (error instanceof Error) {
    return error.constructor.name;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    !(error instanceof Date) &&
    !Array.isArray(error) &&
    "errorType" in error &&
    typeof error.errorType === "string"
  ) {
    return error.errorType;
  }
  return undefined;
}

/** Bounded machine-readable evidence from top-level exceptions and their causes. */
function errorDiagnostics(error: Error): LoggerMetadata[] {
  const chain: LoggerMetadata[] = [];
  let current: Error | undefined = error;
  while (current && chain.length < 4) {
    const status =
      "statusCode" in current
        ? current.statusCode
        : "status" in current
          ? current.status
          : undefined;
    chain.push({
      name: current.constructor.name,
      // The top error's message is the row message; a cause's message is
      // otherwise lost when the top message is long (a Drizzle "Failed
      // query: select ..." hid "Query read timeout" on prod, 2026-11-25).
      message:
        chain.length > 0 && current.message
          ? truncate(sanitizeLogText(current.message), 200)
          : undefined,
      code:
        "code" in current &&
        typeof current.code === "string" &&
        /^(?:[A-Z][A-Z0-9_]{1,39}|[0-9A-Z]{5})$/.test(current.code)
          ? current.code
          : undefined,
      status:
        typeof status === "number" &&
        Number.isInteger(status) &&
        status >= 100 &&
        status <= 599
          ? status
          : undefined,
      constraint:
        "constraint" in current &&
        typeof current.constraint === "string" &&
        /^[a-z_][a-z0-9_]{0,62}$/.test(current.constraint)
          ? current.constraint
          : undefined,
    });
    current = current.cause instanceof Error ? current.cause : undefined;
  }
  return chain;
}

/** Extract error message from various error shapes */
function extractMessage(
  message: string,
  error: LoggerMetadata | undefined,
): string {
  let fullMessage = message;
  if (error instanceof Error && error.message) {
    fullMessage = `${message}: ${error.message}`;
  } else if (typeof error === "string") {
    fullMessage = `${message}: ${error}`;
  }
  return truncate(sanitizeLogText(fullMessage), MAX_MESSAGE_LENGTH);
}

/**
 * Metadata keys left out of every fingerprint (callers add their own on top).
 * `locale` split one bug into one row per UI language; `payload` is the raw
 * request input (attacker controlled on a sweep: one row per probe).
 */
const BASE_FINGERPRINT_IGNORE_KEYS: ReadonlySet<string> = new Set([
  "locale",
  "payload",
  // Per-occurrence detail of a business refusal (out of credits, daily free
  // limit): model, thread, translated message, amounts. 2026-11-27: one
  // refusal class split into 47 "[AiStream] Setup failed" rows (one per
  // model x message x folder). The class keys stay at the top level; the row
  // keeps the latest detail and counts occurrences.
  REFUSAL_DETAIL_LOG_KEY,
]);

/**
 * Replace the per-occurrence parts of a string (ids, numbers, timestamps,
 * addresses) with placeholders, so one error class gets one fingerprint.
 * 2026-11-18: 2,499 unresolved rows on prod, most of them one class split by
 * a user id in the message ("User <uuid> lacks required roles"), a thread id
 * or a credit balance in metadata. Applied to the fingerprint input only: the
 * stored message and metadata keep the full detail.
 *
 * Integers of up to 3 digits stay (status codes, error counts, small enums);
 * longer integers and every decimal become `<n>`.
 */
export function normalizeForFingerprint(input: string): string {
  return (
    input
      .replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        "<uuid>",
      )
      // Masked addresses ("ba***@bg2000.at"): the * broke the plain rule,
      // so a login failure got one row per address (2026-11-27 web lane).
      .replace(/[\w.+*-]*\*+[\w.+*-]*@[\w-]+(?:\.[\w-]+)+/g, "<email>")
      .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "<email>")
      .replace(
        /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?/g,
        "<ts>",
      )
      .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "<ip>")
      // URL query strings carry tokens, cache busters and tracking ids
      .replace(/\?[\w%.[\]-]+=[^\s"'\\)]*/g, "?<q>")
      // Zod echoes the rejected value: `(received "...")`
      .replace(/\(received [^)]*\)/g, "(received <v>)")
      // decimals before hex: 0.30000000000000004 is a number, not an id
      .replace(/\d+\.\d+/g, "<n>")
      .replace(/\b(?=[0-9a-f]*\d)[0-9a-f]{12,}\b/gi, "<hex>")
      .replace(/\d{4,}/g, "<n>")
  );
}

/**
 * Serialize metadata to a stable string for fingerprinting.
 * Uses the metadata content (minus ignored keys, values normalized) so errors
 * with different context (endpoint, feature, schedule, ...) get separate rows.
 */
function serializeMetaForFingerprint(
  allMeta: LoggerMetadata[],
  ignoreKeys: ReadonlySet<string> | undefined,
): string {
  if (allMeta.length === 0) {
    return "";
  }
  const isIgnored = (k: string): boolean =>
    BASE_FINGERPRINT_IGNORE_KEYS.has(k) || (ignoreKeys?.has(k) ?? false);
  const stable = allMeta.flatMap((m): LoggerMetadata[] => {
    if (
      m === null ||
      typeof m !== "object" ||
      m instanceof Error ||
      m instanceof Date ||
      Array.isArray(m)
    ) {
      return [m];
    }
    const out: Record<string, LoggerMetadata> = {};
    for (const [k, v] of Object.entries(m)) {
      if (!isIgnored(k)) {
        out[k] = v;
      }
    }
    // A record made only of ignored keys (tabId, occurrences, ...) must
    // vanish entirely, or its presence alone would split the row.
    return Object.keys(out).length > 0 ? [out] : [];
  });
  try {
    return normalizeForFingerprint(JSON.stringify(stable));
  } catch {
    return String(allMeta.length);
  }
}

/** Level + type + normalized message prefix: one error class. */
function fingerprintBaseKey(
  level: ErrorLogLevel,
  errorType: string | null | undefined,
  message: string,
): string {
  return `${level}:${errorType ?? "unknown"}:${normalizeForFingerprint(message).slice(0, 100)}`;
}

/** Compute a deterministic fingerprint for error grouping/deduplication */
function computeFingerprint(
  baseKey: string,
  allMeta: LoggerMetadata[],
  ignoreKeys: ReadonlySet<string> | undefined,
): string {
  const metaStr = serializeMetaForFingerprint(allMeta, ignoreKeys);
  return createHash("sha256")
    .update(`${baseKey}:${metaStr}`)
    .digest("base64url")
    .slice(0, 16);
}

/**
 * Maximum concurrent DB writes in flight at once.
 * Prevents error storms (e.g. pre-OOM cascades) from accumulating thousands
 * of pending async operations in the event loop, each holding DB context.
 */
const MAX_INFLIGHT = 8;
/**
 * Distinct rows that arrive while MAX_INFLIGHT are busy wait here instead of
 * being dropped - a burst of distinct first occurrences (e.g. a broken release
 * where every page errors) must still land. Bounded so a storm can't become an
 * OOM vector; only beyond this cap is a new row dropped (repeats of a row that
 * is already waiting are always counted).
 */
const MAX_QUEUED = 500;
/**
 * A fingerprint written less than this long ago is not written again right
 * away: repeats are summed in memory and land as ONE upsert when the window
 * ends. A storm of the same error (2026-11-17: ~750 forged webhooks/s) then
 * costs one row update per second instead of one per hit (CPU + table bloat).
 */
const COALESCE_MS = 1000;
/**
 * When one message (level + type + message prefix) produces more than this many
 * distinct fingerprints inside VARIANT_WINDOW_MS, its metadata varies per
 * occurrence (request ids, signatures, attacker input) and every further
 * variant is counted on one collapsed row instead of inserting a new row each.
 * The error class stays fully reported: occurrences keep counting and the
 * latest metadata is kept as the sample.
 */
const MAX_VARIANTS = 50;
const VARIANT_WINDOW_MS = 10 * 60 * 1000;
/** Bound on tracked keys so the trackers can't grow without limit. */
const MAX_TRACKED_KEYS = 5000;

type PendingRow = NewErrorLog & { occurrences: number };

let inflightCount = 0;
/** Rows waiting to be written, keyed by fingerprint (repeats merge here). */
const pendingRows = new Map<string, PendingRow>();
/** Fingerprints whose pending row may be written now, in arrival order. */
const readyFingerprints = new Set<string>();
const lastWriteAt = new Map<string, number>();
const variantTracker = new Map<
  string,
  { windowStart: number; fingerprints: Set<string> }
>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function pump(): void {
  while (inflightCount < MAX_INFLIGHT && readyFingerprints.size > 0) {
    const fingerprint = readyFingerprints.values().next().value;
    if (fingerprint === undefined) {
      return;
    }
    readyFingerprints.delete(fingerprint);
    const row = pendingRows.get(fingerprint);
    if (!row) {
      continue;
    }
    pendingRows.delete(fingerprint);
    const now = Date.now();
    if (lastWriteAt.size >= MAX_TRACKED_KEYS) {
      for (const [key, at] of lastWriteAt) {
        if (now - at >= COALESCE_MS) {
          lastWriteAt.delete(key);
        }
      }
    }
    lastWriteAt.set(fingerprint, now);
    inflightCount++;
    void upsertErrorLog(row).finally(() => {
      inflightCount--;
      pump();
    });
  }
}

function scheduleFlush(): void {
  if (flushTimer !== null) {
    return;
  }
  flushTimer = setTimeout(() => {
    flushTimer = null;
    for (const fingerprint of pendingRows.keys()) {
      readyFingerprints.add(fingerprint);
    }
    pump();
  }, COALESCE_MS);
}

function enqueueRow(row: PendingRow): void {
  const existing = pendingRows.get(row.fingerprint);
  if (existing) {
    existing.occurrences += row.occurrences;
    existing.metadata = row.metadata;
    existing.stackTrace = row.stackTrace ?? existing.stackTrace;
    return;
  }
  if (pendingRows.size >= MAX_QUEUED) {
    // drop - best-effort logging must never become an OOM vector
    return;
  }
  pendingRows.set(row.fingerprint, row);
  const last = lastWriteAt.get(row.fingerprint);
  if (last !== undefined && Date.now() - last < COALESCE_MS) {
    scheduleFlush();
    return;
  }
  readyFingerprints.add(row.fingerprint);
  pump();
}

/**
 * Returns the fingerprint to store under: the computed one, or the message's
 * collapsed fingerprint once it has produced more than MAX_VARIANTS distinct
 * ones in the current window.
 */
function resolveFingerprint(
  baseKey: string,
  fingerprint: string,
): { fingerprint: string; collapsed: boolean } {
  const now = Date.now();
  let entry = variantTracker.get(baseKey);
  if (!entry || now - entry.windowStart >= VARIANT_WINDOW_MS) {
    if (!entry && variantTracker.size >= MAX_TRACKED_KEYS) {
      variantTracker.clear();
    }
    entry = { windowStart: now, fingerprints: new Set() };
    variantTracker.set(baseKey, entry);
  }
  if (
    entry.fingerprints.has(fingerprint) ||
    entry.fingerprints.size < MAX_VARIANTS
  ) {
    entry.fingerprints.add(fingerprint);
    return { fingerprint, collapsed: false };
  }
  return {
    fingerprint: createHash("sha256")
      .update(`${baseKey}:variants-collapsed`)
      .digest("base64url")
      .slice(0, 16),
    collapsed: true,
  };
}

/** Optional overrides for rows whose error didn't originate in this process. */
export interface PersistErrorLogOptions {
  /** Add this many occurrences at once (client-side dedup flushes a count). */
  occurrences?: number;
  /** Stack trace captured elsewhere (e.g. the browser), used when `error` has none. */
  stackTrace?: string;
  /** Error class name captured elsewhere, used when `error` yields none. */
  errorType?: string;
  /**
   * Metadata keys that vary per occurrence (tab id, viewport, occurrence
   * count, ...) and must not split one error into many fingerprint rows.
   */
  fingerprintIgnoreKeys?: ReadonlySet<string>;
}

/**
 * Persist an error log to the database (fire-and-forget).
 * Never throws - all errors are silently caught.
 * Repeats of one fingerprint inside COALESCE_MS merge into one upsert; at most
 * MAX_INFLIGHT writes run at once and at most MAX_QUEUED distinct rows wait.
 */
export function persistErrorLog(
  level: ErrorLogLevel,
  message: string,
  error: LoggerMetadata | undefined,
  extraMeta: LoggerMetadata[],
  locale: CountryLanguage,
  options?: PersistErrorLogOptions,
): void {
  try {
    enqueueRow(buildRow(level, message, error, extraMeta, locale, options));
  } catch {
    // Silently swallow - logging persistence must never cascade
  }
}

function buildRow(
  level: ErrorLogLevel,
  message: string,
  error: LoggerMetadata | undefined,
  extraMeta: LoggerMetadata[],
  locale: CountryLanguage,
  options: PersistErrorLogOptions | undefined,
): PendingRow {
  const errorType = extractErrorType(error) ?? options?.errorType ?? null;
  const truncatedMessage = extractMessage(message, error);

  // Collect all metadata: include the error object itself when it's a plain
  // object (not an Error instance) so structured context isn't lost.
  // Exception diagnostics are attached separately after fingerprinting.
  const allMeta: LoggerMetadata[] = [{ locale }];
  if (
    error !== null &&
    error !== undefined &&
    !(error instanceof Error) &&
    typeof error === "object" &&
    !(error instanceof Date) &&
    !Array.isArray(error)
  ) {
    allMeta.push(error);
  }
  allMeta.push(...extraMeta);

  // Fingerprint includes stable context from metadata so the same error
  // from different code paths (e.g. different endpoints) gets separate rows.
  const baseKey = fingerprintBaseKey(level, errorType, truncatedMessage);
  const { fingerprint, collapsed } = resolveFingerprint(
    baseKey,
    computeFingerprint(
      baseKey,
      allMeta.map(serializeLogValue),
      options?.fingerprintIgnoreKeys,
    ),
  );
  if (error instanceof Error) {
    // Preserve the existing fingerprint so a recurrence can reopen the same row.
    allMeta.push({ errorCauses: errorDiagnostics(error) });
  }
  if (collapsed) {
    allMeta.push({
      fingerprintCollapsed: `metadata varied on more than ${String(MAX_VARIANTS)} occurrences within ${String(VARIANT_WINDOW_MS / 60_000)} min; further variants are counted on this row (latest sample kept)`,
    });
  }

  const occurrences =
    options?.occurrences !== undefined &&
    Number.isInteger(options.occurrences) &&
    options.occurrences > 0
      ? options.occurrences
      : 1;

  return {
    message: truncatedMessage,
    errorType,
    stackTrace:
      extractStack(error) ??
      (options?.stackTrace
        ? truncate(sanitizeLogText(options.stackTrace), MAX_STACK_LENGTH)
        : null),
    // jsonb would store nested Errors as `{}` - keep message/stack/cause.
    metadata: allMeta.map(serializeLogValue),
    fingerprint,
    occurrences,
    resolved: false,
    level,
  };
}

async function upsertErrorLog(row: PendingRow): Promise<void> {
  try {
    // Dynamic import to avoid circular dependencies and module-level DB init
    const { db } = await import("../database");

    const { sql } = await import("drizzle-orm");

    // Upsert: if same fingerprint exists, increment occurrences and update timestamp
    await db
      .insert(errorLogs)
      .values(row)
      .onConflictDoUpdate({
        target: errorLogs.fingerprint,
        set: {
          occurrences: sql`${errorLogs.occurrences} + ${row.occurrences}`,
          stackTrace: row.stackTrace,
          metadata: row.metadata,
          resolved: false,
          createdAt: sql`now()`,
        },
      });

    // Per-day occurrence counter (charts + affected users in the error monitor)
    const { recordErrorLogDaily } = await import("./error-monitor/daily");
    await recordErrorLogDaily({
      fingerprint: row.fingerprint,
      occurrences: row.occurrences,
      metadata: row.metadata,
    });
  } catch {
    // Silently swallow - logging persistence must never cascade
  }
}
