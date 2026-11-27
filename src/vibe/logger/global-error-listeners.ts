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
import { getDomEnvironmentHints } from "next-vibe/ui/lib/dom-mutation-guard";
import { getCurrentOrigin, getCurrentUrl } from "next-vibe/ui/lib/location";
import { getUserAgent } from "next-vibe/ui/lib/media";

import {
  currentBuildId,
  handleChunkLoadFailure,
  isChunkLoadError,
  observeChunkReloadOutcome,
} from "./chunk-reload";
import { claimErrorReport } from "./client-context";
import type { ErrorSourceResult } from "./error-source";
import { classifyErrorSource, errorSourceTag } from "./error-source";
import {
  describeUrl,
  navigationTimingEvidence,
  resourceSourceKind,
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

/**
 * Where an uncaught error came from (our bundle, an extension, a script an
 * in-app browser injected, ...). Never used to drop a report: it tags the
 * message and metadata, and the server groups foreign classes across routes.
 */
function attributeErrorSource(input: {
  message: string;
  filename?: string;
  lineno?: number;
  stack?: string;
}): ErrorSourceResult {
  return classifyErrorSource({
    ...input,
    pageOrigin: getCurrentOrigin(),
    pageUrl: getCurrentUrl(),
  });
}

/** Metadata fields + tagged message prefix for an attributed error. */
function sourceReport(
  prefix: string,
  message: string,
  source: ErrorSourceResult,
): { text: string; meta: Record<string, string | null> } {
  const tag = errorSourceTag(source);
  return {
    text: `${prefix}${tag ? ` ${tag}` : ""}: ${message}`,
    meta: {
      errorSource: source.errorSource,
      injectedGlobal: source.injectedGlobal,
      injectedBy: source.injectedBy,
      topFrameUrl: describeUrl(source.topFrameUrl) ?? source.extensionOrigin,
    },
  };
}

/** URL scheme of an element source ("https:", "chrome-extension:", "data:", ...). */
function resourceScheme(raw: string | null): string | null {
  if (!raw) {
    return null;
  }
  try {
    return new URL(raw, getCurrentUrl()).protocol.slice(0, 32);
  } catch {
    return "unparseable";
  }
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

/**
 * React stamps every DOM node it renders with a `__reactFiber$<id>` key. An
 * element without it on itself or its parent was put there by someone else
 * (extension, translator, injected script): a resource error on it is not
 * our asset (2026-11-27: extension-injected img.from / audio.audio-for-speech
 * with an empty src looked like ours).
 */
function isReactRendered(element: Element | null): boolean {
  if (!element) {
    return false;
  }
  return Object.keys(element).some((key) => key.startsWith("__reactFiber$"));
}

/** Up to three ancestors (tag#id.class), to place a foreign element. */
function ancestorChain(element: HTMLElement): string {
  const chain: string[] = [];
  let node = element.parentElement;
  while (node && chain.length < 3) {
    chain.push(describeElement(node).split(" > ").at(-1) ?? "");
    node = node.parentElement;
  }
  return chain.join(" < ");
}

/** Delay before re-checking a failed load the browser may have cancelled. */
const RESOURCE_RECHECK_MS = 2000;

/**
 * Whether a failed load succeeded later: an image that decoded, or a later
 * successful Resource Timing entry for the same URL.
 */
function resourceRecovered(target: HTMLElement, src: string | null): boolean {
  if (
    target instanceof HTMLImageElement &&
    target.complete &&
    target.naturalWidth > 0
  ) {
    return true;
  }
  if (!src || typeof performance === "undefined") {
    return false;
  }
  try {
    const absolute = new URL(src, getCurrentUrl()).href;
    return performance.getEntriesByName(absolute).some((entry) => {
      if (!(entry instanceof PerformanceResourceTiming)) {
        return false;
      }
      const status = entry.responseStatus;
      return (
        entry.responseEnd > 0 &&
        (status === 0 ? entry.transferSize > 0 : status >= 200 && status < 400)
      );
    });
  } catch {
    return false;
  }
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
        target instanceof HTMLImageElement || target instanceof HTMLMediaElement
          ? target.currentSrc || target.src
          : target instanceof HTMLScriptElement ||
              target instanceof HTMLIFrameElement ||
              target instanceof HTMLSourceElement
            ? target.src
            : target instanceof HTMLLinkElement
              ? target.href
              : null;
      const resource = describeUrl(src);
      const media =
        target instanceof HTMLSourceElement ? target.parentElement : target;
      const mediaDiagnostics =
        media instanceof HTMLMediaElement
          ? {
              mediaErrorCode: media.error?.code ?? null,
              mediaNetworkState: media.networkState,
              mediaReadyState: media.readyState,
              mediaSelectedSource: Boolean(media.currentSrc),
            }
          : undefined;
      const details = {
        source: "window.error.resource",
        tag,
        resource,
        // describeUrl keeps only http(s): a null resource with a
        // cross-origin, absolute src was a non-web scheme. Prod 2026-11-25:
        // "body > script" failures on /story with no resource timing at all,
        // most likely an extension-injected chrome-extension:// script.
        resourceScheme: resourceScheme(src),
        resourceExtensionOrigin: extensionOrigin(src ?? undefined),
        resourceSourceKind: resourceSourceKind(
          target.getAttribute(
            target instanceof HTMLLinkElement ? "href" : "src",
          ),
        ),
        imageUsesSrcset:
          target instanceof HTMLImageElement
            ? Boolean(
                target.getAttribute("srcset") ||
                target.parentElement?.tagName === "PICTURE",
              )
            : null,
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
        // Native media errors can identify decode, network, and unsupported
        // sources even when the failed load has no Resource Timing entry.
        ...mediaDiagnostics,
        ...navigationTimingEvidence(),
        ...resourceTiming(src),
        // Not rendered by our React tree (extension / translator injected)
        foreignElement: !isReactRendered(target),
        ancestors: ancestorChain(target),
      };
      // A load the browser never sent, or an image whose body arrived, is
      // often cancelled (navigation, lazy swap, memory pressure) and loads
      // fine right after. Re-check once and say so, so a cancelled load is
      // told apart from a broken asset.
      const recheck =
        details.responseSource === "never-sent" ||
        target instanceof HTMLImageElement;
      if (!recheck) {
        logger.warn(`Resource failed to load: <${tag}>`, details);
        return;
      }
      setTimeout(() => {
        logger.warn(`Resource failed to load: <${tag}>`, {
          ...details,
          recoveredLater: resourceRecovered(target, src),
          recheckAfterMs: RESOURCE_RECHECK_MS,
        });
      }, RESOURCE_RECHECK_MS);
    }
    return;
  }
  const error = event.error instanceof Error ? event.error : null;
  if (error && !claimErrorReport(error)) {
    return;
  }
  const file = describeUrl(event.filename);
  const navigation = navigationTimingEvidence();
  const fromPageDocument =
    file !== null && file === describeUrl(getCurrentUrl());
  const fromNavigationDocument =
    file !== null && file === navigation.documentNavigationPath;
  const context = {
    source: "window.onerror",
    file,
    line: event.lineno,
    column: event.colno,
    pageBuildId: currentBuildId(),
    ...navigation,
    // After a client navigation an inline script can still name the initial HTML URL.
    fromPageDocument,
    fromNavigationDocument,
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
    const dom =
      fromPageDocument || fromNavigationDocument || error.name === "RangeError"
        ? getDomEnvironmentHints()
        : null;
    const report = sourceReport(
      "Uncaught error",
      error.message,
      attributeErrorSource({
        message: error.message,
        filename: event.filename,
        lineno: event.lineno,
        stack: error.stack,
      }),
    );
    logger.error(report.text, error, {
      ...context,
      ...report.meta,
      extensionOrigin: extensionOrigin(error.stack),
      ...(dom
        ? {
            translatedClass: dom.translatedClass,
            fontWrapperCount: dom.fontWrapperCount,
            extensionMarkers: dom.extensionMarkers,
            googleSearchApp: /\bGSA\//.test(getUserAgent()),
          }
        : {}),
    });
    return;
  }
  // Cross-origin scripts surface only as "Script error." with no detail.
  // No file + line 0 = an opaque cross-origin script (extension or third-party
  // embed), never our bundle: our chunks are same-origin and report in full.
  const opaqueCrossOrigin = !event.filename && event.lineno === 0;
  const message = event.message || "unknown";
  const report = sourceReport(
    "Uncaught error",
    message,
    attributeErrorSource({
      message,
      filename: event.filename,
      lineno: event.lineno,
    }),
  );
  logger.error(report.text, {
    ...context,
    ...report.meta,
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
          popperRole:
            querySelector(
              '[data-radix-popper-content-wrapper] :is([role="menu"],[role="listbox"],[role="dialog"],[role="tooltip"])',
            )?.getAttribute("role") ?? null,
          popperInsideScrollArea:
            querySelector(
              "[data-radix-scroll-area-viewport] [data-radix-popper-content-wrapper]",
            ) !== null,
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
    const report = sourceReport(
      "Unhandled promise rejection",
      reason.message,
      attributeErrorSource({ message: reason.message, stack: reason.stack }),
    );
    logger.error(report.text, reason, {
      source: "unhandledrejection",
      ...report.meta,
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
  reportEnvPlaceholderLeaks(logger);
}

/**
 * Client env keys that still held their build sentinel at load time
 * (define-env-client.ts fell back to the default). Always a deploy bug: the
 * served bundle skipped the start-time runtime env patch.
 */
function reportEnvPlaceholderLeaks(logger: EndpointLogger): void {
  const leaks = globalThis.__vibeEnvPlaceholderLeaks;
  if (!leaks?.length) {
    return;
  }
  globalThis.__vibeEnvPlaceholderLeaks = [];
  logger.error("[env] Unpatched runtime env placeholder reached the browser", {
    keys: leaks.join(", ").slice(0, 500),
    buildId: currentBuildId(),
    errorSource: "runtime-env-patch",
  });
}
