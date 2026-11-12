/**
 * DOM mutation guard for page translators and DOM-rewriting extensions.
 *
 * Google Translate (Chrome's built-in translator), Edge's translator,
 * Immersive Translate, Grammarly & co. wrap or replace text nodes that React
 * owns (Google wraps every text node in `<font style="vertical-align:
 * inherit">`). React still holds the ORIGINAL node, so its next commit calls
 * `parent.insertBefore(x, staleRef)` / `parent.removeChild(staleChild)` with a
 * node whose parent is no longer `parent` -> NotFoundError -> the whole route
 * falls into the error boundary (prod: /user/signup, /user/login,
 * /subscription/overview on Chrome 156).
 *
 * `translate="no"` is not an option - users WANT to translate the page. So we
 * make the two mutation primitives tolerant instead (the well-known patch from
 * facebook/react#11538), resolving to the closest correct DOM operation:
 *  - insertBefore: if the reference node was wrapped by a foreign element that
 *    is itself a child of `this`, insert before that wrapper (same visual
 *    position); otherwise append (node stays visible, order may drift).
 *  - removeChild: if the child was re-parented (wrapped or moved), remove it
 *    from its real parent; if it is already detached, no-op.
 *
 * Every time the guard kicks in it reports a warn (node names + translator /
 * extension hints) so the event stays visible in the error log.
 *
 * Installed once, before hydration (src/instrumentation-client.ts for Next,
 * src/generated/app-tanstack/client.tsx for TanStack). The reporter is wired
 * by LoggerProvider; events before that are buffered.
 */

export interface DomEnvironmentHints {
  [key: string]: string | number | boolean | null;
  /** `<html lang>` right now - translators rewrite it to the target language */
  htmlLang: string | null;
  /** Google Translate / Chrome built-in translator marks <html> with these */
  translatedClass: boolean;
  /** Count of Google Translate `<font style="vertical-align: inherit">` wrappers */
  fontWrapperCount: number;
  /** Comma-separated list of detected translator / extension DOM markers */
  extensionMarkers: string;
  /** document.referrer without query/hash */
  referrer: string | null;
}

/** DOM markers left by translators and DOM-rewriting extensions. */
const EXTENSION_MARKERS: readonly (readonly [string, string])[] = [
  ["googleTranslateFrame", "iframe.goog-te-banner-frame, .skiptranslate"],
  ["msTranslator", "[_msttexthash], [_msthash]"],
  [
    "immersiveTranslate",
    "[data-immersive-translate-walked], immersive-translate, .immersive-translate-target-wrapper",
  ],
  ["deepl", "deepl-input-controller, [data-deepl-translated]"],
  ["yandexTranslate", "[data-yandex-translate], .yt-wrapper"],
  ["grammarly", "grammarly-desktop-integration, [data-gr-ext-installed]"],
  ["languageTool", "lt-toolbar, [data-lt-installed]"],
  ["darkReader", "[data-darkreader-mode], [data-darkreader-scheme]"],
  ["lastPass", "[data-lastpass-icon-root], [data-lastpass-root]"],
  ["bitwarden", "[data-bwautofill], bit-notification-bar"],
];

function safeCount(selector: string): number {
  try {
    return document.querySelectorAll(selector).length;
  } catch {
    return 0;
  }
}

function stripQuery(url: string): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split(/[?#]/)[0] ?? null;
  }
}

/**
 * Snapshot of translator / extension evidence in the current document.
 * Safe to call anywhere on the client; returns empty hints without a DOM.
 */
export function getDomEnvironmentHints(): DomEnvironmentHints {
  if (typeof document === "undefined") {
    return {
      htmlLang: null,
      translatedClass: false,
      fontWrapperCount: 0,
      extensionMarkers: "",
      referrer: null,
    };
  }
  const html = document.documentElement;
  const markers = EXTENSION_MARKERS.filter(
    ([, selector]) => safeCount(selector) > 0,
  ).map(([name]) => name);
  // Google Translate always wraps text in <font style="vertical-align: inherit;">
  const fontWrapperCount = safeCount('font[style*="vertical-align"]');
  if (fontWrapperCount > 0) {
    markers.push("fontWrappers");
  }
  return {
    htmlLang: html.getAttribute("lang"),
    translatedClass:
      html.classList.contains("translated-ltr") ||
      html.classList.contains("translated-rtl"),
    fontWrapperCount,
    extensionMarkers: markers.join(","),
    referrer: stripQuery(document.referrer),
  };
}

export interface DomGuardEvent {
  [key: string]: string | number | boolean | null;
  operation: "insertBefore" | "removeChild";
  resolution:
    | NonNullable<InsertPlan<Node>["resolution"]>
    | NonNullable<RemovePlan<Node>["resolution"]>;
  parentNode: string;
  targetNode: string;
  targetActualParent: string | null;
  /** 1-based count of guard hits on this page load */
  occurrence: number;
  path: string;
}

export type DomGuardReporter = (
  event: DomGuardEvent,
  hints: DomEnvironmentHints,
) => void;

/** Only the first N hits per page load are reported (one translation pass can fire hundreds). */
const MAX_REPORTED_PER_PAGE = 10;
const MAX_BUFFERED = MAX_REPORTED_PER_PAGE;

let installed = false;
let occurrences = 0;
let reporter: DomGuardReporter | null = null;
const buffered: DomGuardEvent[] = [];

function describeNode(node: Node | null): string {
  if (!node) {
    return "null";
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return `#text(${(node.textContent ?? "").slice(0, 40)})`;
  }
  if (node instanceof Element) {
    const id = node.id ? `#${node.id}` : "";
    const cls =
      typeof node.className === "string" && node.className
        ? `.${node.className.trim().split(/\s+/).slice(0, 3).join(".")}`
        : "";
    return `${node.nodeName.toLowerCase()}${id}${cls}`.slice(0, 120);
  }
  return node.nodeName;
}

function record(
  operation: DomGuardEvent["operation"],
  resolution: DomGuardEvent["resolution"],
  parent: Node,
  target: Node,
): void {
  occurrences += 1;
  if (occurrences > MAX_REPORTED_PER_PAGE) {
    return;
  }
  const event: DomGuardEvent = {
    operation,
    resolution,
    parentNode: describeNode(parent),
    targetNode: describeNode(target),
    targetActualParent: target.parentNode
      ? describeNode(target.parentNode)
      : null,
    occurrence: occurrences,
    path: window.location.pathname,
  };
  if (reporter) {
    reporter(event, getDomEnvironmentHints());
    return;
  }
  // No logger yet (pre-hydration): keep it for LoggerProvider, and surface it
  // in the console so it is never silent.
  // oxlint-disable-next-line no-console
  console.warn("[dom-guard] foreign DOM mutation tolerated", event);
  if (buffered.length < MAX_BUFFERED) {
    buffered.push(event);
  }
}

/** Minimal tree shape the planners need - `Node` satisfies it. */
export interface GuardTreeNode<N> {
  readonly parentNode: N | null;
}

/** Closest ancestor of `node` (or `node` itself) whose parent is `parent`. */
function findChildOf<N extends GuardTreeNode<N>>(parent: N, node: N): N | null {
  let current: N | null = node;
  while (current && current.parentNode !== parent) {
    current = current.parentNode;
  }
  return current;
}

export interface InsertPlan<N> {
  /** null = the reference node is a real child, run the native call as-is */
  resolution: "insertedBeforeWrapper" | "appended" | null;
  reference: N | null;
}

/** Decide where `parent.insertBefore(x, reference)` should really insert. */
export function planInsertBefore<N extends GuardTreeNode<N>>(
  parent: N,
  reference: N | null,
): InsertPlan<N> {
  if (!reference || reference.parentNode === parent) {
    return { resolution: null, reference };
  }
  const wrapper = findChildOf(parent, reference);
  return wrapper
    ? { resolution: "insertedBeforeWrapper", reference: wrapper }
    : { resolution: "appended", reference: null };
}

export interface RemovePlan<N> {
  /** null = the child is a real child, run the native call as-is */
  resolution:
    | "removedFromWrapper"
    | "removedFromForeignParent"
    | "alreadyDetached"
    | null;
  /** Node to call the native removeChild on; null = nothing to remove */
  removeFrom: N | null;
}

/** Decide which parent `parent.removeChild(child)` should really remove from. */
export function planRemoveChild<N extends GuardTreeNode<N>>(
  parent: N,
  child: N,
): RemovePlan<N> {
  const realParent = child.parentNode;
  if (realParent === parent) {
    return { resolution: null, removeFrom: parent };
  }
  if (!realParent) {
    // Already detached by the foreign script - nothing left to remove.
    return { resolution: "alreadyDetached", removeFrom: null };
  }
  // Re-parented (wrapped inside `parent`, or moved elsewhere): React wants the
  // node gone, so remove it from wherever it actually lives.
  return {
    resolution: findChildOf(parent, realParent)
      ? "removedFromWrapper"
      : "removedFromForeignParent",
    removeFrom: realParent,
  };
}

/**
 * Wire the warn reporter (LoggerProvider). Flushes events buffered before the
 * logger existed. Returns an unregister function.
 */
export function setDomGuardReporter(next: DomGuardReporter): () => void {
  reporter = next;
  if (buffered.length > 0) {
    const hints = getDomEnvironmentHints();
    for (const event of buffered.splice(0)) {
      next(event, hints);
    }
  }
  return (): void => {
    if (reporter === next) {
      reporter = null;
    }
  };
}

export function installDomMutationGuard(): void {
  if (installed || typeof Node === "undefined") {
    return;
  }
  installed = true;

  const originalInsertBefore = Node.prototype.insertBefore;
  const originalRemoveChild = Node.prototype.removeChild;

  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    this: Node,
    node: T,
    child: Node | null,
  ): T {
    const plan = planInsertBefore<Node>(this, child);
    if (plan.resolution && child) {
      record("insertBefore", plan.resolution, this, child);
    }
    originalInsertBefore.call(this, node, plan.reference);
    return node;
  };

  Node.prototype.removeChild = function removeChild<T extends Node>(
    this: Node,
    child: T,
  ): T {
    const plan = planRemoveChild<Node>(this, child);
    if (plan.resolution) {
      record("removeChild", plan.resolution, this, child);
    }
    if (plan.removeFrom) {
      originalRemoveChild.call(plan.removeFrom, child);
    }
    return child;
  };
}
