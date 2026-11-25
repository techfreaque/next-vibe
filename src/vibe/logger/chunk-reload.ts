/**
 * Stale-build recovery for failed code chunks.
 *
 * After a deploy, a tab still running the old build asks for chunk hashes the
 * new server no longer has (404), and slow or flaky networks time out on a
 * chunk (webpack "timeout"). Either way the page is broken until it loads the
 * current build. Every place that can see a chunk failure (route error page,
 * error boundaries, global listeners, the definition loader, the icon loader)
 * calls `handleChunkLoadFailure`:
 *  - first failure in the window: reload the page once (guarded in
 *    sessionStorage so it can never loop), with an immediate failure report;
 *  - the reloaded page starts without a chunk error: report the observed
 *    startup outcome with its build id, when available;
 *  - a failure again within CHUNK_RELOAD_WINDOW_MS of that reload: the reload
 *    did not help, reported with both failures' diagnostics;
 *  - no working reload guard (storage unavailable): report the failure and
 *    skip the reload.
 * Platform-neutral: reloadPage / session storage are no-ops where they do not
 * apply (native, CLI).
 */

import {
  addWindowListener,
  getDocumentBody,
  getElementById,
  getReadyState,
  querySelector,
} from "next-vibe/ui/lib/dom";
import { getCurrentPathname, reloadPage } from "next-vibe/ui/lib/location";
import { getSessionItem, setSessionItem } from "next-vibe/ui/lib/storage";

import { sanitizeTelemetryUrl } from "../core/utils/telemetry-url";
import {
  readEdgeRequestId,
  readEdgeTimingNode,
} from "../realtime/core/proxy-timing";
import {
  CHUNK_LOAD_ERROR_MESSAGE,
  CHUNK_RELOAD_DELAY_MS,
  CHUNK_RELOAD_KEY,
  CHUNK_RELOAD_WINDOW_MS,
} from "./chunk-reload-policy";
import {
  chunkLoadDiagnostics,
  navigationTimingEvidence,
} from "./resource-diagnostics";
import type { EndpointLogger, ErrorLogLevel, LoggerMetadata } from "./types";

/** One reload per page, including when several chunks fail before it starts. */
let pendingReloadAt: number | null = null;
let reloadRequestedAt: number | null = null;
let failedAfterReloadAt: number | null = null;
let observedReloadAt: number | null = null;

/** Test hook: forget the reload scheduled on this page. */
export function resetChunkReloadForTests(): void {
  pendingReloadAt = null;
  reloadRequestedAt = null;
  failedAfterReloadAt = null;
  observedReloadAt = null;
}

interface ChunkReloadRecord {
  at: number;
  reloadRequestedAt: number | null;
  source: string;
  path: string | null;
  level: ErrorLogLevel;
  buildId: string | null;
  chunkId: string | null;
  chunkUrl: string | null;
  failKind: string | null;
  responseStatus: number | null;
  edgeRequestId: string | null;
  edgeTimingNode: ReturnType<typeof readEdgeTimingNode>;
  resourceStartedAtMs: number | null;
  outcome: "started" | "failed" | null;
}

/**
 * Stale client after a deploy or a chunk that never arrived. webpack:
 * ChunkLoadError "Loading chunk N failed" / "Loading CSS chunk N failed";
 * Vite/native ESM: "Failed to fetch dynamically imported module" (Chrome) /
 * "error loading dynamically imported module" (Firefox) / "Importing a module
 * script failed" (Safari).
 */
export function isChunkLoadError(error: {
  name?: string;
  message?: string;
}): boolean {
  return (
    error.name === "ChunkLoadError" ||
    CHUNK_LOAD_ERROR_MESSAGE.test(error.message ?? "")
  );
}

function readRecord(logger: EndpointLogger): ChunkReloadRecord | null {
  const raw = getSessionItem(CHUNK_RELOAD_KEY, logger);
  if (!raw) {
    return null;
  }
  try {
    const value: Partial<ChunkReloadRecord> | number | null = JSON.parse(raw);
    // An older build stored a bare timestamp.
    const parsed = typeof value === "number" ? { at: value } : value;
    if (typeof parsed?.at !== "number" || !Number.isFinite(parsed.at)) {
      return null;
    }
    return {
      at: parsed.at,
      reloadRequestedAt:
        typeof parsed.reloadRequestedAt === "number" &&
        Number.isFinite(parsed.reloadRequestedAt)
          ? parsed.reloadRequestedAt
          : null,
      source: typeof parsed.source === "string" ? parsed.source : "unknown",
      path: typeof parsed.path === "string" ? parsed.path : null,
      level: parsed.level === "warn" ? "warn" : "error",
      buildId: typeof parsed.buildId === "string" ? parsed.buildId : null,
      chunkId: typeof parsed.chunkId === "string" ? parsed.chunkId : null,
      chunkUrl: typeof parsed.chunkUrl === "string" ? parsed.chunkUrl : null,
      failKind: typeof parsed.failKind === "string" ? parsed.failKind : null,
      responseStatus:
        typeof parsed.responseStatus === "number"
          ? parsed.responseStatus
          : null,
      edgeRequestId: readEdgeRequestId(parsed.edgeRequestId ?? undefined),
      edgeTimingNode: readEdgeTimingNode(parsed.edgeTimingNode ?? undefined),
      resourceStartedAtMs:
        typeof parsed.resourceStartedAtMs === "number" &&
        Number.isFinite(parsed.resourceStartedAtMs)
          ? parsed.resourceStartedAtMs
          : null,
      outcome:
        parsed.outcome === "started" || parsed.outcome === "failed"
          ? parsed.outcome
          : null,
    };
  } catch {
    return null;
  }
}

export function currentBuildId(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  try {
    const nextData = getElementById("__NEXT_DATA__")?.textContent;
    if (nextData) {
      const data: { buildId?: string } | null = JSON.parse(nextData);
      if (typeof data?.buildId === "string") {
        return data.buildId;
      }
    }
    // App Router publishes the deployment id in asset URLs when configured.
    const script = querySelector<HTMLScriptElement>(
      'script[src*="/_next/static/"][src*="dpl="]',
    );
    const deploymentId = script && new URL(script.src).searchParams.get("dpl");
    if (deploymentId) {
      return deploymentId;
    }
    // Otherwise the build id is on the root row of Next's inlined Flight data.
    let tail = "";
    const scripts =
      getDocumentBody()?.querySelectorAll<HTMLScriptElement>(
        "script:not([src])",
      );
    for (const inline of scripts ?? []) {
      const call = /^self\.__next_f\.push\((\[1,.*\])\)$/.exec(inline.text);
      if (!call?.[1]) {
        continue;
      }
      const [, data]: [number, string] = JSON.parse(call[1]);
      const rows = (tail + data).split("\n");
      tail = rows.pop() ?? "";
      const root = rows.find((row) => row.startsWith("0:{"));
      if (root) {
        const payload: { b?: string } = JSON.parse(root.slice(2));
        return typeof payload.b === "string" ? payload.b : null;
      }
    }
  } catch {
    // Optional build diagnostics must never interrupt the error report.
  }
  return null;
}

function logChunk(
  logger: EndpointLogger,
  level: ErrorLogLevel,
  message: string,
  details: Record<string, LoggerMetadata>,
): void {
  const report = { ...details, ...navigationTimingEvidence() };
  if (level === "warn") {
    logger.warn(message, report);
  } else {
    logger.error(message, report);
  }
}

/** Observe the next same-route document after the app installs its logger. */
export function observeChunkReloadOutcome(logger: EndpointLogger): void {
  const previous = readRecord(logger);
  const navigation = performance.getEntriesByType("navigation")[0];
  if (
    !previous ||
    pendingReloadAt !== null ||
    previous.outcome !== null ||
    observedReloadAt === previous.at ||
    Date.now() - previous.at >= CHUNK_RELOAD_WINDOW_MS ||
    previous.path !== sanitizeTelemetryUrl(getCurrentPathname()) ||
    !navigation ||
    !("type" in navigation) ||
    (navigation.type !== "reload" &&
      navigation.type !== "navigate" &&
      navigation.type !== "back_forward") ||
    performance.timeOrigin < previous.at
  ) {
    return;
  }
  const navigationType = navigation.type;
  const reloaded = navigationType === "reload";
  observedReloadAt = previous.at;
  const onLoaded = (): void => {
    // Let startup errors already queued by hydration reach their handlers.
    setTimeout(() => {
      if (failedAfterReloadAt === previous.at) {
        return;
      }
      const context = {
        source: previous.source,
        chunkId: previous.chunkId,
        chunkUrl: previous.chunkUrl,
        chunkFailKind: previous.failKind,
        responseStatus: previous.responseStatus,
        firstEdgeRequestId: previous.edgeRequestId,
        firstEdgeTimingNode: previous.edgeTimingNode,
        firstResourceStartedAtMs: previous.resourceStartedAtMs,
        chunkReloadAt: previous.at,
        reloadRequestedAt: previous.reloadRequestedAt,
        buildIdBefore: previous.buildId,
        buildIdAfter: currentBuildId(),
        recoveredByReload: reloaded ? true : null,
        recoveryEvidence: reloaded ? "page-startup" : "later-navigation",
        observedNavigationType: navigationType,
      };
      logChunk(
        logger,
        previous.level,
        reloaded
          ? "[chunk] Page started after reload"
          : "[chunk] Page started on a later navigation",
        context,
      );
      setSessionItem(
        CHUNK_RELOAD_KEY,
        JSON.stringify({ ...previous, outcome: "started" }),
        logger,
      );
    }, CHUNK_RELOAD_DELAY_MS);
  };
  if (getReadyState() === "complete") {
    onLoaded();
  } else {
    addWindowListener("load", onLoaded, { once: true });
  }
}

/**
 * Report every chunk load failure and reload once within the guard window.
 * Returns true while a reload is in flight (the caller should render nothing
 * new / never resolve), false when the caller must show its error state.
 */
export function handleChunkLoadFailure(
  logger: EndpointLogger,
  {
    source,
    error,
    level = "error",
    context,
  }: {
    /** Who saw it: "route-error", "error-boundary:<name>", "definition-loader", ... */
    source: string;
    error: Error;
    level?: ErrorLogLevel;
    context?: Record<string, LoggerMetadata>;
  },
): boolean {
  const diagnostics = chunkLoadDiagnostics(error.message);
  const buildId = currentBuildId();
  const details = {
    source,
    errorName: error.name,
    errorMessage: error.message.slice(0, 300),
    stack: error.stack?.slice(0, 1500),
    ...diagnostics,
    chunkId: diagnostics.chunkId ?? null,
    ...context,
  };
  if (pendingReloadAt !== null) {
    logChunk(logger, level, "[chunk] Load failed while a reload is pending", {
      ...details,
      chunkReloadAt: pendingReloadAt,
      reloadRequestedAt,
      reloadTimerElapsedMs: (reloadRequestedAt ?? Date.now()) - pendingReloadAt,
      buildIdBefore: buildId,
      buildIdAfter: null,
      recoveredByReload: null,
    });
    return true;
  }
  const now = Date.now();
  const previous = readRecord(logger);
  if (previous && now - previous.at < CHUNK_RELOAD_WINDOW_MS) {
    failedAfterReloadAt = previous.at;
    const message =
      previous.outcome === "started"
        ? "[chunk] Load failed during the reload guard window"
        : "[chunk] Load still failing after an automatic reload";
    logChunk(logger, level, message, {
      ...details,
      sinceReloadMs: now - previous.at,
      chunkReloadAt: previous.at,
      reloadRequestedAt: previous.reloadRequestedAt,
      firstSource: previous.source,
      firstChunkId: previous.chunkId,
      firstChunkUrl: previous.chunkUrl,
      firstFailKind: previous.failKind,
      firstResponseStatus: previous.responseStatus,
      firstEdgeRequestId: previous.edgeRequestId,
      firstEdgeTimingNode: previous.edgeTimingNode,
      firstResourceStartedAtMs: previous.resourceStartedAtMs,
      buildIdBefore: previous.buildId,
      buildIdAfter: buildId,
      recoveredByReload: false,
    });
    if (previous.outcome === null) {
      setSessionItem(
        CHUNK_RELOAD_KEY,
        JSON.stringify({ ...previous, outcome: "failed" }),
        logger,
      );
    }
    return false;
  }
  const record: ChunkReloadRecord = {
    at: now,
    reloadRequestedAt: null,
    source,
    path:
      typeof window === "undefined"
        ? null
        : sanitizeTelemetryUrl(getCurrentPathname()),
    level,
    buildId,
    chunkId: diagnostics.chunkId ?? null,
    chunkUrl: diagnostics.chunkUrl ?? null,
    failKind: diagnostics.chunkFailKind ?? null,
    responseStatus: diagnostics.responseStatus ?? null,
    edgeRequestId: diagnostics.edgeRequestId ?? null,
    edgeTimingNode: diagnostics.edgeTimingNode ?? null,
    resourceStartedAtMs: diagnostics.resourceStartedAtMs ?? null,
    outcome: null,
  };
  const serialized = JSON.stringify(record);
  setSessionItem(CHUNK_RELOAD_KEY, serialized, logger);
  // Read back: without a working guard a reload could loop
  if (getSessionItem(CHUNK_RELOAD_KEY, logger) !== serialized) {
    logChunk(
      logger,
      level,
      "[chunk] Load failed and no reload guard is available",
      {
        ...details,
        buildIdBefore: buildId,
        buildIdAfter: null,
        reloadSkipped: true,
        recoveredByReload: false,
      },
    );
    return false;
  }
  pendingReloadAt = record.at;
  logChunk(logger, level, "[chunk] Load failed, reloading once", {
    ...details,
    chunkReloadAt: record.at,
    buildIdBefore: buildId,
    buildIdAfter: null,
    recoveredByReload: null,
  });
  setTimeout(() => {
    reloadRequestedAt = Date.now();
    setSessionItem(
      CHUNK_RELOAD_KEY,
      JSON.stringify({ ...record, reloadRequestedAt }),
      logger,
    );
    reloadPage();
  }, CHUNK_RELOAD_DELAY_MS);
  return true;
}
