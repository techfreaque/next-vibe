/**
 * Client-side Logger
 * Thin wrapper around logger-core that POSTs errors/warnings to the server for DB persistence.
 * Import this in all client code: "use client" components, client hooks, etc.
 */

import type { ModuleNamespace, ViteHotContext } from "vite/types/hot.d.ts";
import { z } from "zod";

import { type CountryLanguage, defaultLocale } from "../core/i18n/core/config";
import { UserPermissionRole } from "../identity/roles/enum";
import { getClientReportContext } from "./client-context";
import { createLogger } from "./create-logger";
import { CLIENT_LOG_OCCURRENCES_KEY } from "./error-monitor/client-log/constants";
import { CLIENT_LOG_FINGERPRINT_IGNORE_KEYS } from "./error-monitor/client-log/fingerprint-keys";
import { serializeLogValue } from "./serialize";
import { sanitizeLogString, sanitizeLogText } from "./telemetry-privacy";
import type { EndpointLogger, LoggerMetadata } from "./types";

/** Coerce any LoggerMetadata value to a schema-safe primitive */
function toPrimitive(v: LoggerMetadata): string | number | boolean | null {
  if (v === null || v === undefined) {
    return null;
  }
  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return v;
  }
  if (v instanceof Error) {
    return v.message;
  }
  if (v instanceof Date) {
    return v.toISOString();
  }
  try {
    return JSON.stringify(serializeLogValue(v));
  } catch {
    return String(v);
  }
}

/** Flatten a metadata record so all values are primitives accepted by the server schema */
function sanitizeMetadata(
  record: Record<string, LoggerMetadata>,
): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(record)) {
    const value = toPrimitive(v);
    out[k] = typeof value === "string" ? sanitizeLogString(k, value) : value;
  }
  return out;
}

type ReportLevel = "error" | "warn";
type ReportMeta = Record<string, string | number | boolean | null>;

interface ReportPayload {
  level: ReportLevel;
  message: string;
  metadata: ReportMeta[];
  locale: CountryLanguage;
}

/**
 * Client-side dedup: the first occurrence of a report is ALWAYS sent at once.
 * Repeats of the same fingerprint inside the window are only counted, then
 * flushed as one report carrying `occurrences: n` (the server adds n to the
 * row). A continuous storm therefore costs one request per window.
 */
const DEDUP_WINDOW_MS = 30_000;

/**
 * Safety valve for render loops minting a distinct message every time:
 * past this many sends per minute, reports are counted and summarized in one
 * warn (with sample messages) instead of each becoming a request.
 */
const MAX_SENDS_PER_MINUTE = 120;
const SUPPRESSED_SAMPLE_LIMIT = 10;

interface DedupEntry {
  payload: ReportPayload;
  repeats: number;
}

interface ClientReportState {
  dedupEntries: Map<string, DedupEntry>;
  sendsThisMinute: number;
  minuteTimerArmed: boolean;
  suppressedCount: number;
  suppressedSamples: string[];
  lastLocale: CountryLanguage;
  create: typeof createClientLoggerImpl;
  report: typeof reportToServer;
}

const browserHot:
  | (Partial<Pick<ViteHotContext, "invalidate">> & {
      readonly data: { clientReportState?: ClientReportState };
    })
  | undefined = typeof window === "undefined" ? undefined : import.meta.hot;
const hotData = browserHot?.data;
const reportState: ClientReportState = hotData?.clientReportState ?? {
  dedupEntries: new Map(),
  sendsThisMinute: 0,
  minuteTimerArmed: false,
  suppressedCount: 0,
  suppressedSamples: [],
  lastLocale: defaultLocale,
  create: createClientLoggerImpl,
  report: reportToServer,
};
if (hotData) {
  // Existing loggers and pending timers share this state with the new module.
  hotData.clientReportState = reportState;
  reportState.create = createClientLoggerImpl;
  reportState.report = reportToServer;
}
let fingerprintIgnoreKeys = CLIENT_LOG_FINGERPRINT_IGNORE_KEYS;

if (browserHot && import.meta.hot) {
  import.meta.hot.accept((updated: ModuleNamespace | undefined) => {
    if (updated && typeof updated.createClientLogger !== "function") {
      browserHot.invalidate?.(
        "Client logger no longer exports createClientLogger",
      );
    }
  });
  const fingerprintKeysModuleSchema = z.object({
    CLIENT_LOG_FINGERPRINT_IGNORE_KEYS: z.set(z.string()),
  });
  import.meta.hot.accept(
    "./error-monitor/client-log/fingerprint-keys",
    (updated: ModuleNamespace | undefined) => {
      if (!updated) {
        return;
      }
      const policy = fingerprintKeysModuleSchema.safeParse(updated);
      if (!policy.success) {
        browserHot.invalidate?.(
          "Client logger fingerprint keys have an incompatible export",
        );
        return;
      }
      fingerprintIgnoreKeys = policy.data.CLIENT_LOG_FINGERPRINT_IGNORE_KEYS;
    },
  );
}

/**
 * setTimeout that never keeps a process alive: the CLI/MCP renderers reuse
 * this logger, and a pending dedup flush must not delay their exit.
 */
function schedule(fn: () => void, ms: number): void {
  unrefTimer(setTimeout(fn, ms));
}

/**
 * Browser: a number. Node/Bun: a Timeout object with unref(). Taken as a
 * parameter so the union survives (a typed `const` narrows to whichever
 * setTimeout overload the active lib picked, making the object branch never).
 */
function unrefTimer(timer: number | { unref?: () => void }): void {
  if (typeof timer === "object") {
    timer.unref?.();
  }
}

function buildFingerprint(
  level: ReportLevel,
  message: string,
  metadata: ReportMeta[],
): string {
  const stable = metadata.map((m) => {
    const out: ReportMeta = {};
    for (const [k, v] of Object.entries(m)) {
      if (!fingerprintIgnoreKeys.has(k)) {
        out[k] = v;
      }
    }
    return out;
  });
  try {
    return `${level}|${message}|${JSON.stringify(stable)}`;
  } catch {
    return `${level}|${message}`;
  }
}

function armMinuteTimer(): void {
  if (reportState.minuteTimerArmed) {
    return;
  }
  reportState.minuteTimerArmed = true;
  schedule(() => {
    reportState.minuteTimerArmed = false;
    reportState.sendsThisMinute = 0;
    if (reportState.suppressedCount > 0) {
      const summary: ReportPayload = {
        level: "warn",
        message: "Client error reports rate-limited",
        metadata: [
          {
            suppressedCount: reportState.suppressedCount,
            maxPerMinute: MAX_SENDS_PER_MINUTE,
            samples: reportState.suppressedSamples.join(" | ").slice(0, 2000),
          },
          getClientReportContext(),
        ],
        locale: reportState.lastLocale,
      };
      reportState.suppressedCount = 0;
      reportState.suppressedSamples.length = 0;
      transmit(summary);
    }
  }, 60_000);
}

function transmit(payload: ReportPayload): void {
  // Use the typed executeMutation transport - handles CSRF, auth, and response parsing.
  // Import lazily so this file stays tree-shakeable in non-browser bundles.
  void (async (): Promise<void> => {
    try {
      const [{ executeMutation }, { POST }] = await Promise.all([
        import("../unified-ui/hooks/mutation-executor"),
        import("./error-monitor/client-log/definition"),
      ]);

      // Minimal public-user stub - server re-auths from the JWT cookie.
      // The user param here only drives client-side routing decisions.
      const publicUser = {
        isPublic: true as const,
        leadId: "",
        roles: [UserPermissionRole.PUBLIC],
      };

      await executeMutation({
        endpoint: POST,
        logger: createLogger(false, payload.locale),
        requestData: {
          level: payload.level,
          message: payload.message.slice(0, 500),
          metadata: payload.metadata.length > 0 ? payload.metadata : undefined,
        },
        pathParams: undefined as never,
        locale: payload.locale,
        user: publicUser,
      });
    } catch {
      // silently swallow - client logger must never cascade
    }
  })();
}

function send(payload: ReportPayload): void {
  if (reportState.sendsThisMinute >= MAX_SENDS_PER_MINUTE) {
    reportState.suppressedCount++;
    if (reportState.suppressedSamples.length < SUPPRESSED_SAMPLE_LIMIT) {
      reportState.suppressedSamples.push(payload.message.slice(0, 150));
    }
    armMinuteTimer();
    return;
  }
  reportState.sendsThisMinute++;
  armMinuteTimer();
  transmit(payload);
}

function flushDedupEntry(fingerprint: string): void {
  const entry = reportState.dedupEntries.get(fingerprint);
  if (!entry) {
    return;
  }
  if (entry.repeats === 0) {
    reportState.dedupEntries.delete(fingerprint);
    return;
  }
  const repeats = entry.repeats;
  entry.repeats = 0;
  send({
    ...entry.payload,
    metadata: [
      ...entry.payload.metadata,
      {
        [CLIENT_LOG_OCCURRENCES_KEY]: repeats,
        dedupWindowMs: DEDUP_WINDOW_MS,
      },
    ],
  });
  // Keep the window open while the storm continues: next flush (or expiry).
  schedule(() => flushDedupEntry(fingerprint), DEDUP_WINDOW_MS);
}

function reportToServer(
  level: ReportLevel,
  message: string,
  error: LoggerMetadata | undefined,
  metadata: LoggerMetadata[],
  locale: CountryLanguage,
  tabId: string | undefined,
): void {
  reportState.lastLocale = locale;
  const safeMessage = sanitizeLogText(message);
  const allMeta = error !== undefined ? [error, ...metadata] : metadata;
  const normalizedMeta = allMeta.map((m) =>
    m instanceof Error
      ? {
          error: m.message,
          errorName: m.name,
          ...(m.stack
            ? { errorStack: sanitizeLogText(m.stack).slice(0, 2000) }
            : {}),
        }
      : typeof m === "string" && m.length > 0
        ? // A bare string detail (logger.error("x", "detail")) used to be dropped
          { detail: sanitizeLogText(m).slice(0, 1000) }
        : m,
  );
  const metaPayload = normalizedMeta
    .filter(
      (m): m is Record<string, LoggerMetadata> =>
        typeof m === "object" &&
        m !== null &&
        !(m instanceof Date) &&
        !Array.isArray(m),
    )
    .map(sanitizeMetadata);

  const fingerprint = buildFingerprint(level, safeMessage, metaPayload);
  const existing = reportState.dedupEntries.get(fingerprint);
  if (existing) {
    existing.repeats++;
    return;
  }

  // Context: where the user was, what they ran - so every row is fixable.
  metaPayload.push(getClientReportContext());
  // Append tab identity so server-side logs are traceable per browser tab
  if (tabId) {
    metaPayload.push({ tabId });
  }

  const payload: ReportPayload = {
    level,
    message: safeMessage,
    metadata: metaPayload,
    locale,
  };
  reportState.dedupEntries.set(fingerprint, { payload, repeats: 0 });
  schedule(() => flushDedupEntry(fingerprint), DEDUP_WINDOW_MS);
  send(payload);
}

function createClientLoggerImpl(
  debugEnabled: boolean,
  locale: CountryLanguage,
  tabId?: string,
): EndpointLogger {
  return createLogger(
    debugEnabled,
    locale,
    (level, message, error, metadata) => {
      reportState.report(level, message, error, metadata, locale, tabId);
    },
  );
}

export function createClientLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  tabId?: string,
): EndpointLogger {
  return reportState.create(debugEnabled, locale, tabId);
}
