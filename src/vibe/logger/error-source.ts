/**
 * Source attribution for uncaught browser errors. Pure (no DOM access) so it
 * runs in tests and on the server alike.
 *
 * In-app browsers, iOS Firefox reader mode, wallet extensions and Dark Reader
 * inject scripts into our page; their failures reach window.onerror like
 * ours. They are always reported (never dropped or downgraded), tagged with
 * an `errorSource` so a triager sees at a glance they are not our bundle, and
 * grouped into one error_logs row per class instead of one per route.
 */

export const ERROR_SOURCES = [
  /** Top frame is one of our script chunks (same origin). */
  "our-bundle",
  /** A chrome-/moz-/safari-extension:// frame or file. */
  "browser-extension",
  /** The message names a global that only an injected script defines. */
  "injected-global",
  /** "Script error." with no file/line: a cross-origin script hid its detail. */
  "opaque-cross-origin",
  /** A cross-origin script that reported in full (crossorigin attribute). */
  "third-party-script",
  /** Inline script, page document, or no usable location. */
  "inline-or-unknown",
] as const;

export type ErrorSource = (typeof ERROR_SOURCES)[number];

/**
 * Classes that are never our code: their reports group across routes (the
 * route stays on the row as metadata, it just doesn't split the fingerprint).
 */
export const FOREIGN_ERROR_SOURCES: ReadonlySet<ErrorSource> = new Set([
  "browser-extension",
  "injected-global",
  "opaque-cross-origin",
]);

/** True for an `errorSource` metadata value naming a foreign class. */
export function isForeignErrorSource(value: string | undefined): boolean {
  return FOREIGN_ERROR_SOURCES.has(
    ERROR_SOURCES.find((source) => source === value) ?? "our-bundle",
  );
}

/**
 * Globals that only injected scripts define, with who injects them. Matched
 * as a whole identifier in the error message. Keep this list small: only
 * names seen in our prod error log or documented injectors.
 */
export const INJECTED_GLOBALS: readonly {
  readonly name: string;
  readonly injector: string;
}[] = [
  {
    name: "__firefox__",
    injector: "Firefox for iOS (reader mode / page scripts)",
  },
  { name: "__gCrWeb", injector: "Chrome for iOS (WKWebView bridge)" },
  { name: "ethereum", injector: "crypto wallet extension (window.ethereum)" },
  { name: "DarkReader", injector: "Dark Reader extension" },
  {
    name: "webkit.messageHandlers",
    injector: "iOS in-app browser (WKWebView)",
  },
];

export interface ErrorSourceInput {
  message: string;
  /** ErrorEvent.filename (may be empty). */
  filename?: string | null;
  /** ErrorEvent.lineno (0 when unknown). */
  lineno?: number | null;
  stack?: string | null;
  /** Origin of the page (e.g. "https://unbottled.ai"). */
  pageOrigin: string;
  /** Full URL of the current page, to recognise inline/document frames. */
  pageUrl?: string | null;
}

export interface ErrorSourceResult {
  errorSource: ErrorSource;
  /** The injected global the message names (injected-global only). */
  injectedGlobal: string | null;
  /** Who injects it, human-readable (injected-global only). */
  injectedBy: string | null;
  /** Extension origin (browser-extension only). */
  extensionOrigin: string | null;
  /** Top stack frame URL (or the event file) the classification used. */
  topFrameUrl: string | null;
}

const EXTENSION_URL =
  /((?:chrome|moz|safari|safari-web|ms-browser)-extension:\/\/[^/\s)]+)/;
/** First http(s) URL with :line:col in a V8 / JSC / SpiderMonkey stack. */
const STACK_FRAME_URL = /(https?:\/\/[^\s()@]+?):\d+(?::\d+)?/;
const SCRIPT_PATH =
  /(?:^\/_next\/|^\/@fs\/|^\/@vite\/|^\/@id\/|^\/node_modules\/|^\/src\/|\.(?:m?js|tsx?|jsx)$)/;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const INJECTED_GLOBAL_PATTERNS = INJECTED_GLOBALS.map((global) => ({
  ...global,
  pattern: new RegExp(`(?<![\\w$])${escapeRegExp(global.name)}(?![\\w$])`),
}));

function findInjectedGlobal(
  message: string,
): (typeof INJECTED_GLOBALS)[number] | null {
  for (const global of INJECTED_GLOBAL_PATTERNS) {
    if (global.pattern.test(message)) {
      return global;
    }
  }
  return null;
}

function parseUrl(raw: string, base: string): URL | null {
  try {
    return new URL(raw, base);
  } catch {
    return null;
  }
}

function stripHash(url: string): string {
  const hash = url.indexOf("#");
  return hash === -1 ? url : url.slice(0, hash);
}

/** Classify where an uncaught browser error came from. */
export function classifyErrorSource(
  input: ErrorSourceInput,
): ErrorSourceResult {
  const filename = input.filename ?? "";
  const stack = input.stack ?? "";
  const frameUrl = STACK_FRAME_URL.exec(stack)?.[1] ?? null;
  const topFrameUrl = frameUrl ?? (filename || null);
  const base: ErrorSourceResult = {
    errorSource: "inline-or-unknown",
    injectedGlobal: null,
    injectedBy: null,
    extensionOrigin: null,
    topFrameUrl,
  };

  const extension =
    EXTENSION_URL.exec(stack)?.[1] ?? EXTENSION_URL.exec(filename)?.[1] ?? null;
  if (extension) {
    return {
      ...base,
      errorSource: "browser-extension",
      extensionOrigin: extension,
    };
  }

  // Before the location checks: iOS in-app scripts report the page URL (our
  // origin) as their file, so the location alone would look like ours.
  const injected = findInjectedGlobal(input.message);
  if (injected) {
    return {
      ...base,
      errorSource: "injected-global",
      injectedGlobal: injected.name,
      injectedBy: injected.injector,
    };
  }

  if (
    !filename &&
    !frameUrl &&
    !input.lineno &&
    /^script error\.?$/i.test(input.message.trim())
  ) {
    return { ...base, errorSource: "opaque-cross-origin" };
  }

  if (!topFrameUrl) {
    return base;
  }
  const url = parseUrl(topFrameUrl, input.pageOrigin);
  if (!url) {
    return base;
  }
  if (url.origin !== input.pageOrigin) {
    return { ...base, errorSource: "third-party-script" };
  }
  if (
    input.pageUrl &&
    stripHash(url.href) ===
      stripHash(parseUrl(input.pageUrl, input.pageOrigin)?.href ?? "")
  ) {
    return base;
  }
  return SCRIPT_PATH.test(url.pathname)
    ? { ...base, errorSource: "our-bundle" }
    : base;
}

/** "Uncaught error [injected-global: __firefox__]: ..." style message tag. */
export function errorSourceTag(result: ErrorSourceResult): string | null {
  switch (result.errorSource) {
    case "injected-global":
      return `[injected-global: ${result.injectedGlobal ?? "?"}]`;
    case "browser-extension":
      return `[browser-extension: ${result.extensionOrigin ?? "?"}]`;
    case "opaque-cross-origin":
      return "[opaque-cross-origin]";
    case "our-bundle":
    case "third-party-script":
    case "inline-or-unknown":
      return null;
  }
}
