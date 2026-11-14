/**
 * Global browser error capture: anything that escapes every try/catch and
 * error boundary (event handlers, timers, promise chains, failed resource
 * loads, CSP blocks) is reported to the error log. Installed once per page
 * by LoggerProvider. Client-only; a no-op outside a browser.
 */

import { addDocumentListener, addWindowListener } from "next-vibe/ui/lib/dom";
import { getCurrentOrigin, getCurrentUrl } from "next-vibe/ui/lib/location";

import { claimErrorReport, sanitizeRoutePath } from "./client-context";
import type { EndpointLogger } from "./types";

declare global {
  var __vibeGlobalErrorListeners: EndpointLogger | undefined;
}

/** Path of a resource URL without query/hash (may carry signed tokens). */
function describeUrl(raw: string | null | undefined): string | null {
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

function describeReason(
  reason:
    | Error
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, string>,
): string {
  if (reason instanceof Error) {
    return reason.message;
  }
  if (typeof reason === "string") {
    return reason;
  }
  try {
    return JSON.stringify(reason) ?? String(reason);
  } catch {
    return String(reason);
  }
}

/** File extension of a URL's last path segment (null = none, e.g. a truncated URL). */
function urlExtension(raw: string | null | undefined): string | null {
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

/**
 * What the network said about a failed resource: Resource Timing knows the
 * HTTP status (Chromium) and whether bytes arrived, which the error event
 * never carries. 0/null = blocked, aborted or a cross-origin opaque response.
 */
function resourceTiming(raw: string | null | undefined): {
  responseStatus: number | null;
  transferSize: number | null;
  durationMs: number | null;
} {
  const empty = { responseStatus: null, transferSize: null, durationMs: null };
  if (!raw || typeof performance === "undefined") {
    return empty;
  }
  try {
    const entries = performance.getEntriesByName(
      new URL(raw, getCurrentUrl()).href,
    );
    const entry = entries.at(-1);
    if (!(entry instanceof PerformanceResourceTiming)) {
      return empty;
    }
    return {
      responseStatus:
        "responseStatus" in entry && typeof entry.responseStatus === "number"
          ? entry.responseStatus
          : null,
      transferSize: entry.transferSize,
      durationMs: Math.round(entry.duration),
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
  chunkUrl?: string | null;
  chunkFailKind?: string;
  responseStatus?: number | null;
  transferSize?: number | null;
  durationMs?: number | null;
} {
  const match =
    /Loading (?:CSS )?chunk \S+ failed\.?\s*\((\w+): ([^)\s]+)\)/.exec(
      message ?? "",
    );
  if (!match) {
    return {};
  }
  return {
    chunkFailKind: match[1],
    chunkUrl: describeUrl(match[2]),
    ...resourceTiming(match[2]),
  };
}

function handleWindowError(logger: EndpointLogger, event: Event): void {
  // Resource load failure (script/img/link/media): fires on the element,
  // reaches window only in the capture phase, and is not an ErrorEvent.
  if (!(event instanceof ErrorEvent)) {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const tag = target.tagName.toLowerCase();
      const src =
        target instanceof HTMLScriptElement ||
        target instanceof HTMLImageElement ||
        target instanceof HTMLMediaElement ||
        target instanceof HTMLIFrameElement
          ? target.src
          : target instanceof HTMLLinkElement
            ? target.href
            : null;
      logger.warn(`Resource failed to load: <${tag}>`, {
        source: "window.error.resource",
        tag,
        resource: describeUrl(src),
        // ids are redacted from `resource`; a missing extension on a file URL
        // means the src was cut short (e.g. a markdown image mid-stream)
        resourceExt: urlExtension(src),
        isConnected: target.isConnected,
        ...resourceTiming(src),
      });
    }
    return;
  }
  const error = event.error instanceof Error ? event.error : null;
  if (error && !claimErrorReport(error)) {
    return;
  }
  const context = {
    source: "window.onerror",
    file: describeUrl(event.filename),
    line: event.lineno,
    column: event.colno,
    // Thrown from the page document itself (not a /_next/ chunk): an inline
    // script. Ours are only Next's data pushes; app logic lives in chunks, so
    // this is usually code injected by an extension (e.g. a wallet's
    // `window.ethereum` shim) or a page-rewriting proxy.
    fromPageDocument:
      !!event.filename &&
      describeUrl(event.filename) === describeUrl(getCurrentUrl()),
  };
  if (error) {
    logger.error(`Uncaught error: ${error.message}`, error, context);
    return;
  }
  // Cross-origin scripts surface only as "Script error." with no detail.
  // No file + line 0 = an opaque cross-origin script (extension or third-party
  // embed), never our bundle: our chunks are same-origin and report in full.
  logger.error(`Uncaught error: ${event.message || "unknown"}`, {
    ...context,
    opaqueCrossOrigin: !event.filename && event.lineno === 0,
  });
}

function handleUnhandledRejection(
  logger: EndpointLogger,
  event: PromiseRejectionEvent,
): void {
  // PromiseRejectionEvent.reason is typed `any`; narrow before use.
  const reason:
    | Error
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, string> = event.reason;
  if (reason instanceof Error) {
    if (!claimErrorReport(reason)) {
      return;
    }
    // A user/navigation cancel, not a failure
    if (reason.name === "AbortError") {
      logger.warn(`Unhandled promise rejection (abort): ${reason.message}`, {
        source: "unhandledrejection",
        errorName: reason.name,
      });
      return;
    }
    logger.error(`Unhandled promise rejection: ${reason.message}`, reason, {
      source: "unhandledrejection",
      ...chunkLoadDiagnostics(reason.message),
    });
    return;
  }
  logger.error(
    `Unhandled promise rejection: ${describeReason(reason).slice(0, 300)}`,
    {
      source: "unhandledrejection",
      reasonType: reason === null ? "null" : typeof reason,
    },
  );
}

function handleCspViolation(
  logger: EndpointLogger,
  event: SecurityPolicyViolationEvent,
): void {
  logger.warn(`CSP blocked ${event.effectiveDirective}`, {
    source: "securitypolicyviolation",
    directive: event.effectiveDirective,
    blocked: describeUrl(event.blockedURI) ?? event.blockedURI,
    file: describeUrl(event.sourceFile),
    line: event.lineNumber,
  });
}

/**
 * Install the listeners once per page. Later calls (locale change, HMR,
 * a second provider) just swap the logger the listeners report through.
 */
export function installGlobalErrorListeners(logger: EndpointLogger): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }
  const alreadyInstalled = globalThis.__vibeGlobalErrorListeners !== undefined;
  globalThis.__vibeGlobalErrorListeners = logger;
  if (alreadyInstalled) {
    return;
  }
  const current = (): EndpointLogger =>
    globalThis.__vibeGlobalErrorListeners ?? logger;
  addWindowListener(
    "error",
    (event) => {
      try {
        handleWindowError(current(), event);
      } catch {
        // reporting must never throw into the page
      }
    },
    // capture: resource load errors don't bubble
    true,
  );
  addWindowListener("unhandledrejection", (event) => {
    try {
      handleUnhandledRejection(current(), event);
    } catch {
      // reporting must never throw into the page
    }
  });
  addDocumentListener("securitypolicyviolation", (event) => {
    try {
      handleCspViolation(current(), event);
    } catch {
      // reporting must never throw into the page
    }
  });
}
