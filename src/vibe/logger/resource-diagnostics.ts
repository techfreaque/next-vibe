/**
 * Network diagnostics for failed resources and chunks: which URL (ids
 * redacted, no query), what Resource Timing saw. Client-safe, no imports
 * beyond location helpers, so both the global listeners and the chunk reload
 * guard can use it without an import cycle.
 */

import { getCurrentOrigin, getCurrentUrl } from "next-vibe/ui/lib/location";

import { sanitizeTelemetryUrl } from "../core/utils/telemetry-url";
import {
  EDGE_REQUEST_TIMING_METRIC,
  EDGE_TIMING_METRIC,
  PROXY_TIMING_METRIC,
  type ProxyTimingStage,
  readEdgeRequestId,
  readEdgeTimingNode,
  readProxyTimingStage,
} from "../realtime/core/proxy-timing";
import { sanitizeRoutePath } from "./client-context";

// Match the public JS/CSS paths recorded in both Caddy edge logs.
const NEXT_BUNDLE_PATH =
  /^\/_next\/static\/chunks\/[A-Za-z0-9_./~-]+\.(?:js|css)$/;

/** Path of a resource URL without query/hash (may carry signed tokens). */
export function describeUrl(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  try {
    const url = new URL(raw, getCurrentUrl());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    const sameOrigin = url.origin === getCurrentOrigin();
    if (sameOrigin && NEXT_BUNDLE_PATH.test(url.pathname)) {
      return url.pathname;
    }
    return `${sameOrigin ? "" : url.origin}${sanitizeRoutePath(url.pathname)}`;
  } catch {
    return null;
  }
}

/** File extension of a URL's last path segment (null = none, e.g. a truncated URL). */
export function urlExtension(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }
  try {
    const path = sanitizeTelemetryUrl(new URL(raw, getCurrentUrl()).href);
    const last = path?.split("/").pop() ?? "";
    const dot = last.lastIndexOf(".");
    return dot > 0 ? last.slice(dot + 1).slice(0, 10) : null;
  } catch {
    return null;
  }
}

interface ResourceTimingEvidence {
  responseStatus: number | null;
  transferSize: number | null;
  resourceOrigin: "same-origin" | "cross-origin" | null;
  nextHopProtocol: string | null;
  deliveryType: string | null;
  workerStartObserved: boolean | null;
  durationMs: number | null;
  decodedBodySize: number | null;
  responseWaitMs: number | null;
  responseReadMs: number | null;
  resourceStartedAtMs: number | null;
  resourceReportedAtMs: number;
  resourceFailureKind: string;
  resourceTimingPhase:
    | "unavailable"
    | "no-request-start"
    | "request"
    | "response";
  proxyTimingStage: ProxyTimingStage | null;
  edgeTimingNode: ReturnType<typeof readEdgeTimingNode>;
  edgeRequestId: string | null;
}

/** Attribution of the page document when a child resource has no timing. */
export function navigationTimingEvidence(): {
  documentEdgeTimingNode: ReturnType<typeof readEdgeTimingNode>;
  documentEdgeRequestId: string | null;
  documentProxyTimingStage: ProxyTimingStage | null;
  documentNavigationType: string | null;
} {
  const entry =
    typeof performance === "undefined" ||
    typeof performance.getEntriesByType !== "function"
      ? undefined
      : performance.getEntriesByType("navigation")[0];
  if (
    typeof PerformanceNavigationTiming === "undefined" ||
    !(entry instanceof PerformanceNavigationTiming)
  ) {
    return {
      documentEdgeTimingNode: null,
      documentEdgeRequestId: null,
      documentProxyTimingStage: null,
      documentNavigationType: null,
    };
  }
  return {
    documentEdgeTimingNode: readEdgeTimingNode(
      entry.serverTiming?.find(({ name }) => name === EDGE_TIMING_METRIC)
        ?.description,
    ),
    documentEdgeRequestId: readEdgeRequestId(
      entry.serverTiming?.find(
        ({ name }) => name === EDGE_REQUEST_TIMING_METRIC,
      )?.description,
    ),
    documentProxyTimingStage: readProxyTimingStage(
      entry.serverTiming?.find(({ name }) => name === PROXY_TIMING_METRIC)
        ?.description,
    ),
    documentNavigationType: entry.type,
  };
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

export function describeResourceResponse(
  entry: Pick<
    PerformanceResourceTiming,
    "requestStart" | "responseStart" | "responseEnd" | "decodedBodySize"
  >,
): Pick<
  ResourceTimingEvidence,
  "decodedBodySize" | "responseWaitMs" | "responseReadMs"
> {
  const { requestStart, responseStart, responseEnd, decodedBodySize } = entry;
  // Browsers can mask timing phases to zero, for example for cross-origin loads.
  const hasResponseStart = responseStart > 0;
  return {
    decodedBodySize,
    responseWaitMs:
      hasResponseStart && requestStart > 0 && responseStart >= requestStart
        ? Math.round(responseStart - requestStart)
        : null,
    responseReadMs:
      hasResponseStart && responseEnd >= responseStart
        ? Math.round(responseEnd - responseStart)
        : null,
  };
}

/** Resource Timing records evidence that the generic browser error event lacks. */
export function resourceTiming(
  raw: string | null | undefined,
  fetchStartedAt?: number,
): ResourceTimingEvidence {
  const empty: ResourceTimingEvidence = {
    responseStatus: null,
    transferSize: null,
    resourceOrigin: null,
    nextHopProtocol: null,
    deliveryType: null,
    workerStartObserved: null,
    durationMs: null,
    decodedBodySize: null,
    responseWaitMs: null,
    responseReadMs: null,
    resourceStartedAtMs: null,
    resourceReportedAtMs: Date.now(),
    resourceFailureKind: "no-resource-timing",
    resourceTimingPhase: "unavailable",
    proxyTimingStage: null,
    edgeTimingNode: null,
    edgeRequestId: null,
  };
  if (!raw || typeof performance === "undefined") {
    return empty;
  }
  try {
    const resource = new URL(raw, getCurrentUrl());
    const sameOrigin = resource.origin === getCurrentOrigin();
    empty.resourceOrigin = sameOrigin ? "same-origin" : "cross-origin";
    const entries = performance.getEntriesByName(resource.href);
    // The page's own navigation entry is a PerformanceResourceTiming too: an
    // element whose src resolved to the page URL (src="") must not borrow the
    // document's status/size (prod: <img>/<audio> "200, 9199 bytes").
    const candidates = entries.filter(
      (candidate) =>
        candidate.entryType === "resource" &&
        (fetchStartedAt === undefined ||
          (candidate instanceof PerformanceResourceTiming &&
            candidate.initiatorType === "fetch" &&
            Math.floor(performance.timeOrigin + candidate.startTime) >=
              fetchStartedAt)),
    );
    // An earlier request for the same endpoint or concurrent fetches cannot
    // identify this attempt. Leave its timing unavailable in that case.
    const entry =
      fetchStartedAt === undefined || candidates.length === 1
        ? candidates.at(-1)
        : undefined;
    if (!(entry instanceof PerformanceResourceTiming)) {
      return empty;
    }
    const responseStatus =
      "responseStatus" in entry && typeof entry.responseStatus === "number"
        ? entry.responseStatus
        : null;
    return {
      responseStatus,
      resourceOrigin: empty.resourceOrigin,
      nextHopProtocol: entry.nextHopProtocol || null,
      deliveryType:
        "deliveryType" in entry && typeof entry.deliveryType === "string"
          ? entry.deliveryType || null
          : null,
      workerStartObserved:
        typeof entry.workerStart === "number" ? entry.workerStart > 0 : null,
      transferSize: entry.transferSize,
      durationMs: Math.round(entry.duration),
      ...describeResourceResponse(entry),
      resourceStartedAtMs: Math.round(performance.timeOrigin + entry.startTime),
      resourceReportedAtMs: empty.resourceReportedAtMs,
      resourceFailureKind: classifyResourceFailure(
        responseStatus,
        entry.decodedBodySize,
      ),
      resourceTimingPhase:
        entry.responseStart > 0
          ? "response"
          : entry.requestStart > 0
            ? "request"
            : "no-request-start",
      proxyTimingStage: sameOrigin
        ? readProxyTimingStage(
            entry.serverTiming?.find(({ name }) => name === PROXY_TIMING_METRIC)
              ?.description,
          )
        : null,
      edgeTimingNode: sameOrigin
        ? readEdgeTimingNode(
            entry.serverTiming?.find(({ name }) => name === EDGE_TIMING_METRIC)
              ?.description,
          )
        : null,
      edgeRequestId: sameOrigin
        ? readEdgeRequestId(
            entry.serverTiming?.find(
              ({ name }) => name === EDGE_REQUEST_TIMING_METRIC,
            )?.description,
          )
        : null,
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
export function chunkLoadDiagnostics(
  message: string | undefined,
): Partial<ResourceTimingEvidence> & {
  chunkId?: string | null;
  chunkUrl?: string | null;
  chunkFailKind?: string;
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
