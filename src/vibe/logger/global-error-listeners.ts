/**
 * Global browser error capture: anything that escapes every try/catch and
 * error boundary (event handlers, timers, promise chains, failed resource
 * loads, CSP blocks) is reported to the error log. Installed once per page
 * by LoggerProvider. Client-only; a no-op outside a browser.
 */

import {
  addDocumentListener,
  addWindowListener,
  querySelector,
} from "next-vibe/ui/lib/dom";
import { getCurrentOrigin, getCurrentUrl } from "next-vibe/ui/lib/location";

import {
  currentBuildId,
  handleChunkLoadFailure,
  isChunkLoadError,
  observeChunkReloadOutcome,
} from "./chunk-reload";
import { claimErrorReport } from "./client-context";
import {
  describeUrl,
  navigationTimingEvidence,
  resourceTiming,
  urlExtension,
} from "./resource-diagnostics";
import type { EndpointLogger } from "./types";

declare global {
  var __vibeGlobalErrorListeners: EndpointLogger | undefined;
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

/**
 * The browser extension that threw, when the top stack frame is extension
 * code (chrome-extension://<id>/...): not our bundle, the fix (if any) is a
 * guard on our side against what the extension injects. null = our code or
 * unknown.
 */
function extensionOrigin(stack: string | undefined): string | null {
  const match =
    /((?:chrome|moz|safari|safari-web|ms-browser)-extension:\/\/[^/\s)]+)/.exec(
      stack ?? "",
    );
  return match?.[1] ?? null;
}

/** Short CSS-ish description of an element: tag#id.class1.class2 */
function describeElement(element: HTMLElement): string {
  const id = element.id ? `#${element.id}` : "";
  const classes =
    typeof element.className === "string" && element.className.trim()
      ? `.${element.className.trim().split(/\s+/).slice(0, 3).join(".")}`
      : "";
  const parent = element.parentElement;
  const parentTag = parent ? `${parent.tagName.toLowerCase()} > ` : "";
  return `${parentTag}${element.tagName.toLowerCase()}${id}${classes}`.slice(
    0,
    160,
  );
}

/** The original file behind a next/image URL (`/_next/image?url=...`). */
function nextImageSource(raw: string | null | undefined): string | null {
  if (!raw || !raw.includes("/_next/image")) {
    return null;
  }
  try {
    const inner = new URL(raw, getCurrentUrl()).searchParams.get("url");
    return inner ? describeUrl(inner) : null;
  } catch {
    return null;
  }
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
      const resource = describeUrl(src);
      const details = {
        source: "window.error.resource",
        tag,
        resource,
        // ids are redacted from `resource`; a missing extension on a file URL
        // means the src was cut short (e.g. a markdown image mid-stream)
        resourceExt: urlExtension(src),
        isConnected: target.isConnected,
        // Which element: ours carry our classes; an extension's or a
        // translator's injected element does not
        element: describeElement(target),
        // src="" resolves to the page URL itself: an element rendered without
        // a source (or one an extension injected), not a missing file
        srcIsPageUrl:
          resource !== null && resource === describeUrl(getCurrentUrl()),
        // next/image hides the real file in ?url=: name it (path only)
        imageUrl: nextImageSource(src),
        // Static requests from a tab that still runs an older build can
        // fail after a rollout even though the current assets are intact.
        pageBuildId: resource?.startsWith("/_next/") ? currentBuildId() : null,
        ...navigationTimingEvidence(),
        ...resourceTiming(src),
      };
      logger.warn(`Resource failed to load: <${tag}>`, details);
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
    pageBuildId: currentBuildId(),
    ...navigationTimingEvidence(),
    // Thrown from the page document itself (not a /_next/ chunk): an inline
    // script. Ours are only Next's data pushes; app logic lives in chunks, so
    // this is usually code injected by an extension (e.g. a wallet's
    // `window.ethereum` shim) or a page-rewriting proxy.
    fromPageDocument:
      !!event.filename &&
      describeUrl(event.filename) === describeUrl(getCurrentUrl()),
  };
  if (error) {
    if (isChunkLoadError(error)) {
      handleChunkLoadFailure(logger, {
        source: "window.onerror",
        error,
        context,
      });
      return;
    }
    logger.error(`Uncaught error: ${error.message}`, error, {
      ...context,
      extensionOrigin: extensionOrigin(error.stack),
    });
    return;
  }
  // Cross-origin scripts surface only as "Script error." with no detail.
  // No file + line 0 = an opaque cross-origin script (extension or third-party
  // embed), never our bundle: our chunks are same-origin and report in full.
  const opaqueCrossOrigin = !event.filename && event.lineno === 0;
  const message = event.message || "unknown";
  logger.error(`Uncaught error: ${message}`, {
    ...context,
    opaqueCrossOrigin,
    // Which cross-origin scripts this page ran: the opaque error came from
    // one of them (or from an extension when the list is empty)
    ...(opaqueCrossOrigin
      ? { crossOriginScripts: crossOriginScriptOrigins() }
      : {}),
    // Our own observers apply sizes on the next frame (use-resize-observer,
    // chat input, messages list); a loop now points at a library observer.
    // Radix poppers (tooltip/select/popover) and scroll areas set state
    // inside their ResizeObserver callbacks.
    ...(message.includes("ResizeObserver loop")
      ? {
          radixPopperOpen:
            querySelector("[data-radix-popper-content-wrapper]") !== null,
          radixScrollArea:
            querySelector("[data-radix-scroll-area-viewport]") !== null,
          activeElement: describeActiveElement(),
        }
      : {}),
  });
}

/** Origins of cross-origin scripts loaded by this page (max 8). */
function crossOriginScriptOrigins(): string {
  try {
    const origins = new Set<string>();
    for (const entry of performance.getEntriesByType("resource")) {
      if (
        !(entry instanceof PerformanceResourceTiming) ||
        entry.initiatorType !== "script"
      ) {
        continue;
      }
      const origin = new URL(entry.name).origin;
      if (origin !== getCurrentOrigin()) {
        origins.add(origin);
      }
      if (origins.size >= 8) {
        break;
      }
    }
    return [...origins].join(", ");
  } catch {
    return "";
  }
}

/** tag#id of the focused element (what the user was interacting with). */
function describeActiveElement(): string | null {
  const active = querySelector(":focus");
  if (!(active instanceof HTMLElement)) {
    return null;
  }
  return `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ""}`;
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
    if (isChunkLoadError(reason)) {
      handleChunkLoadFailure(logger, {
        source: "unhandledrejection",
        error: reason,
      });
      return;
    }
    logger.error(`Unhandled promise rejection: ${reason.message}`, reason, {
      source: "unhandledrejection",
      extensionOrigin: extensionOrigin(reason.stack),
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
  observeChunkReloadOutcome(logger);
}
