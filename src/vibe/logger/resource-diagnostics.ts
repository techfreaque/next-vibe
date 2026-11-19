/**
 * Network diagnostics for failed resources and chunks: which URL (ids
 * redacted, no query), what Resource Timing saw. Client-safe, no imports
 * beyond location helpers, so both the global listeners and the chunk reload
 * guard can use it without an import cycle.
 */

import { getCurrentOrigin, getCurrentUrl } from "next-vibe/ui/lib/location";

import { sanitizeRoutePath } from "./client-context";

/** Path of a resource URL without query/hash (may carry signed tokens). */
export function describeUrl(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  try {
    const url = new URL(raw, getCurrentUrl());
    // Non-http schemes (blob:, chrome-extension:, eval frames) have origin "null"
    if (url.origin === "null") {
      return raw.split(/[?#]/)[0]?.slice(0, 200) ?? null;
    }
    const sameOrigin = url.origin === getCurrentOrigin();
    return `${sameOrigin ? "" : url.origin}${sanitizeRoutePath(url.pathname)}`;
  } catch {
    return raw.slice(0, 200);
  }
}

/** File extension of a URL's last path segment (null = none, e.g. a truncated URL). */
export function urlExtension(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  try {
    const last = new URL(raw, getCurrentUrl()).pathname.split("/").pop() ?? "";
    const dot = last.lastIndexOf(".");
    return dot > 0 ? last.slice(dot + 1).slice(0, 10) : null;
  } catch {
    return null;
  }
}

interface ResourceTimingEvidence {
  responseStatus: number | null;
  transferSize: number | null;
  durationMs: number | null;
  resourceFailureKind: string;
}

/** Classify evidence from failed loads without guessing why an opaque one failed. */
export function classifyResourceFailure(
  status: number | null,
  decodedBodySize: number,
): string {
  if (status === 429) {
    return "http-rate-limited";
  }
  if (status !== null && status >= 500) {
    return "http-server-error";
  }
  if (status !== null && status >= 400) {
    return "http-client-error";
  }
  if (decodedBodySize > 0) {
    return "body-received";
  }
  if (status !== null && status > 0) {
    return "http-response-observed";
  }
  return status === 0 ? "opaque-or-no-response" : "status-unavailable";
}

/** Resource Timing records evidence that the generic browser error event lacks. */
export function resourceTiming(
  raw: string | null | undefined,
): ResourceTimingEvidence {
  const empty = {
    responseStatus: null,
    transferSize: null,
    durationMs: null,
    resourceFailureKind: "no-resource-timing",
  };
  if (!raw || typeof performance === "undefined") {
    return empty;
  }
  try {
    const entries = performance.getEntriesByName(
      new URL(raw, getCurrentUrl()).href,
    );
    // The page's own navigation entry is a PerformanceResourceTiming too: an
    // element whose src resolved to the page URL (src="") must not borrow the
    // document's status/size (prod: <img>/<audio> "200, 9199 bytes").
    const entry = entries
      .filter(
        (candidate) =>
          typeof PerformanceNavigationTiming === "undefined" ||
          !(candidate instanceof PerformanceNavigationTiming),
      )
      .at(-1);
    if (!(entry instanceof PerformanceResourceTiming)) {
      return empty;
    }
    const responseStatus =
      "responseStatus" in entry && typeof entry.responseStatus === "number"
        ? entry.responseStatus
        : null;
    return {
      responseStatus,
      transferSize: entry.transferSize,
      durationMs: Math.round(entry.duration),
      resourceFailureKind: classifyResourceFailure(
        responseStatus,
        entry.decodedBodySize,
      ),
    };
  } catch {
    return empty;
  }
}

/**
 * Webpack "Loading chunk N failed. (error|timeout|missing: URL)" => which
 * chunk, how it failed and what the network saw. Tells a stale client after a
 * deploy (404) from a slow/blocked network (timeout, status 0) and a scanner
 * that blocks subresources (Google-Safety). Empty when not a chunk error.
 */
export function chunkLoadDiagnostics(message: string | undefined): {
  chunkId?: string | null;
  chunkUrl?: string | null;
  chunkFailKind?: string;
  responseStatus?: number | null;
  transferSize?: number | null;
  durationMs?: number | null;
  resourceFailureKind?: string;
} {
  const match =
    /Loading (?:CSS )?chunk (\S+) failed(?:\.?\s*\((\w+): ([^)\s]+)\))?/i.exec(
      message ?? "",
    );
  const moduleUrl =
    /(?:dynamically imported module|module script failed):\s+(\S+)/i.exec(
      message ?? "",
    )?.[1];
  if (!match && !moduleUrl) {
    return {};
  }
  const rawUrl = match?.[3] ?? moduleUrl;
  const chunkUrl = describeUrl(rawUrl);
  return {
    chunkId: match?.[1] ?? chunkUrl?.split("/").at(-1) ?? null,
    chunkFailKind: match?.[2],
    chunkUrl,
    ...resourceTiming(rawUrl),
  };
}
