/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions:
 * - No `unknown` type
 * - No `object` type
 * - No `throw` statements
 * - No JSX in object literals (except for common React node properties like content, icon, title, etc.)
 * - No raw `fetch()` (use typed endpoint hooks; external-API calls opt out with a disable comment)
 * - No `EndpointsPage` in server entry files (page/layout/template without 'use client' — extract a page-client.tsx)
 *
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { RestrictedSyntaxPluginConfig } from "next-vibe/tooling/check/config/types";
import type {
  createPluginMessages,
  loadPluginConfig,
} from "next-vibe/tooling/check/oxlint/plugins/shared/config-loader";
import type {
  OxlintASTNode,
  OxlintComment,
  OxlintRuleContext,
} from "next-vibe/tooling/check/oxlint/types";

// ============================================================
// Types
// ============================================================

/** Extended rule context with restricted-syntax options */
interface RestrictedSyntaxRuleContext extends OxlintRuleContext {
  options?: RestrictedSyntaxPluginConfig[];
  getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  getFilename?: () => string;
  filename?: string;
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
    getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  };
}

/** AST node for Identifier */
interface Identifier extends OxlintASTNode {
  type: "Identifier";
  name: string;
}

/** AST node for Literal */
interface Literal extends OxlintASTNode {
  type: "Literal";
  value: string | number | boolean | null;
  raw?: string;
}

/** AST node for Property */
interface Property extends OxlintASTNode {
  type: "Property";
  key?: OxlintASTNode;
  value?: OxlintASTNode;
  computed?: boolean;
  method?: boolean;
  shorthand?: boolean;
}

/** AST node for ParenthesizedExpression */
interface ParenthesizedExpression extends OxlintASTNode {
  type: "ParenthesizedExpression";
  expression?: OxlintASTNode;
}

/** AST node for MemberExpression */
interface MemberExpression extends OxlintASTNode {
  type: "MemberExpression";
  object?: OxlintASTNode;
  property?: OxlintASTNode;
  computed?: boolean;
}

/** AST node for CallExpression */
interface CallExpression extends OxlintASTNode {
  type: "CallExpression";
  callee?: OxlintASTNode;
}

/** AST node for Program */
interface Program extends OxlintASTNode {
  type: "Program";
  body?: OxlintASTNode[];
}

/** AST node for ExpressionStatement */
interface ExpressionStatement extends OxlintASTNode {
  type: "ExpressionStatement";
  expression?: OxlintASTNode;
}

/** AST node for ImportDeclaration */
interface ImportDeclaration extends OxlintASTNode {
  type: "ImportDeclaration";
  source?: { value?: string | number | boolean | null };
  importKind?: "type" | "value";
  specifiers?: ImportSpecifier[];
}

/** AST node for ImportSpecifier */
interface ImportSpecifier extends OxlintASTNode {
  type: string;
  imported?: OxlintASTNode;
  local?: OxlintASTNode;
  importKind?: "type" | "value";
}

/** Default error messages (can be customized via config) */
interface RestrictedSyntaxMessages {
  unknownType: string;
  objectType: string;
  throwStatement: string;
  jsxInObjectLiteral: string;
  windowAccess: string;
  localStorageAccess: string;
  sessionStorageAccess: string;
  documentAccess: string;
  navigatorAccess: string;
  rawFetch: string;
  endpointsPageInServerEntry: string;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: RestrictedSyntaxPluginConfig = {
  jsxAllowedProperties: [
    "content",
    "icon",
    "title",
    "label",
    "description",
    "children",
    "render",
    "fallback",
    "error",
    "loading",
    "empty",
    "header",
    "footer",
    "trigger",
    "component",
  ],
};

const DEFAULT_MESSAGES: RestrictedSyntaxMessages = {
  unknownType:
    "Replace 'unknown' with existing typed interface. align with codebase types rather than converting or recreating.",
  objectType:
    "Replace 'object' with existing typed interface. align with codebase types rather than converting or recreating.",
  throwStatement:
    "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead.",
  jsxInObjectLiteral:
    "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
  windowAccess:
    "Direct 'window' access is not allowed. Use next-vibe-ui utils/hooks: getCurrentUrl(), openUrl(), openInNewTab(), getScreenWidth(), silentPushState(), silentReplaceState(), useWindowSize() — all from 'next-vibe/ui/utils/browser' or 'next-vibe/ui/hooks/use-window-size'.",
  localStorageAccess:
    "Direct 'localStorage' access is not allowed. Use the cross-platform storage abstraction: import { storage } from 'next-vibe/ui/lib/storage' and call storage.getItem/setItem/removeItem.",
  sessionStorageAccess:
    "Direct 'sessionStorage' access is not allowed. Use the cross-platform storage abstraction: import { storage } from 'next-vibe/ui/lib/storage' and call storage.getItem/setItem/removeItem.",
  documentAccess:
    "Direct 'document' access is not allowed. Use next-vibe-ui abstractions: getCookie/setCookie/deleteCookie from 'next-vibe/ui/lib/cookies', or getReferrer() from 'next-vibe/ui/utils/browser'.",
  navigatorAccess:
    "Direct 'navigator' access is not allowed. Use getUserAgent() from 'next-vibe/ui/utils/browser', or useWindowSize() from 'next-vibe/ui/hooks/use-window-size' / useTouchDevice() from 'next-vibe/ui/hooks/use-touch-device'.",
  rawFetch:
    "Raw 'fetch()' is not allowed. To read endpoint data, use the endpoint's typed hook (it handles caching, auth, and platform routing). Only genuine external-API calls may use raw fetch — mark those with '// oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- external API'.",
  endpointsPageInServerEntry:
    "'EndpointsPage' cannot be used in a server entry file (page/layout/template without 'use client') — its endpoint props don't survive the server→client boundary. Extract a page-client.tsx with 'use client' that renders EndpointsPage, and render that component from this file (see src/_pages/tools/page.tsx + page-client.tsx).",
};

// ============================================================
// Dynamic Import for Shared Loader
// ============================================================

// Plugin config loader (lazy loaded to handle various runtime environments)
let configLoader: {
  loadPluginConfig: typeof loadPluginConfig;
  createPluginMessages: typeof createPluginMessages;
} | null = null;

let cachedConfig: RestrictedSyntaxPluginConfig | null = null;
let cachedMessages: RestrictedSyntaxMessages | null = null;

/**
 * Load the shared config loader module
 * Uses dynamic require to handle different runtime environments
 */
function getConfigLoader(): typeof configLoader {
  if (configLoader) {
    return configLoader;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Plugin context requires sync loading
    configLoader =
      require("next-vibe/tooling/check/oxlint/plugins/shared/config-loader") as typeof configLoader;
    return configLoader;
  } catch {
    // Shared loader not available, will use fallback
    return null;
  }
}

/**
 * Load restricted-syntax config using shared loader or fallback
 */
function loadRestrictedSyntaxConfig(): RestrictedSyntaxPluginConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  const loader = getConfigLoader();

  if (loader) {
    const result = loader.loadPluginConfig(
      "oxlint-plugin-restricted/restricted-syntax",
      DEFAULT_CONFIG,
    );
    cachedConfig = result.config ?? DEFAULT_CONFIG;
  } else {
    // Fallback: try direct require of check.config.ts
    cachedConfig = loadConfigFallback();
  }

  return cachedConfig;
}

/**
 * Fallback config loading when shared loader is not available
 */
function loadConfigFallback(): RestrictedSyntaxPluginConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment -- Plugin fallback requires dynamic loading
    const config = require(`${process.cwd()}/check.config.ts`);
    const checkConfig = config.default ?? config;
    const exported =
      typeof checkConfig === "function" ? checkConfig() : checkConfig;

    const ruleConfig =
      exported?.oxlint?.rules?.["oxlint-plugin-restricted/restricted-syntax"];
    if (Array.isArray(ruleConfig) && ruleConfig[1]) {
      return ruleConfig[1] as RestrictedSyntaxPluginConfig;
    }
  } catch {
    // Config not available
  }

  return DEFAULT_CONFIG;
}

/**
 * Get error messages (supports customization via config)
 */
function getMessages(): RestrictedSyntaxMessages {
  if (cachedMessages !== null) {
    return cachedMessages;
  }
  cachedMessages = DEFAULT_MESSAGES;
  return cachedMessages;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Type guard to check if a node is a Property node
 */
function isProperty(node: OxlintASTNode): node is Property {
  return (
    node.type === "Property" && typeof (node as Property).method === "boolean"
  );
}

/**
 * Check if the current file is in an allowed path where restricted syntax is permitted
 */
function isAllowedPath(context: RestrictedSyntaxRuleContext): boolean {
  let filename = "";

  // Try to get filename from context
  if (typeof context.getFilename === "function") {
    filename = context.getFilename();
  } else if (typeof context.filename === "string") {
    filename = context.filename;
  }

  if (!filename) {
    return false;
  }

  const path = filename.replaceAll("\\", "/");

  // The vibe UI browser-abstraction primitives are the canonical implementations
  // of the safe wrappers (getCookie, useWindowSize, copyToClipboard, …). They
  // legitimately touch raw window/document/navigator — that's what they wrap.
  const ALLOWED_UI_PRIMITIVES = [
    // The whole web/cli/native/tanstack primitive component library is the
    // platform-abstraction layer — it wraps raw browser/DOM APIs by design.
    "/vibe/ui/web/",
    "/vibe/ui/cli/",
    "/vibe/ui/native/",
    "/vibe/ui/tanstack/",
  ];
  return ALLOWED_UI_PRIMITIVES.some((p) => path.includes(p));
}

/**
 * Check if the node has a disable comment
 */
function hasDisableComment(
  context: RestrictedSyntaxRuleContext,
  node: OxlintASTNode,
): boolean {
  // Try to get comments from context
  const getComments =
    context.getCommentsBefore ?? context.sourceCode?.getCommentsBefore;
  if (typeof getComments !== "function") {
    // If comment API is not available, allow the node (fail open)
    return false;
  }

  try {
    const comments = getComments(node);
    if (!comments || !Array.isArray(comments)) {
      return false;
    }

    // Check if any preceding comment contains eslint-disable or oxlint-disable for restricted-syntax
    for (const comment of comments) {
      if (!comment || typeof comment.value !== "string") {
        continue;
      }
      const commentText = comment.value.trim();
      if (
        (commentText.includes("eslint-disable-next-line") ||
          commentText.includes("oxlint-disable-next-line")) &&
        (commentText.includes("restricted-syntax") ||
          commentText.includes("no-restricted-syntax"))
      ) {
        return true;
      }
    }
  } catch {
    // If any error occurs, don't block (fail open)
    return false;
  }

  return false;
}

/**
 * Check if a node is an ObjectProperty
 */
function isObjectProperty(prop: OxlintASTNode): prop is Property {
  return isProperty(prop);
}

/**
 * Get the JSX allowed properties Set from rule options or config file
 */
function getJsxAllowedProperties(
  context: RestrictedSyntaxRuleContext,
): Set<string> {
  // First try rule options (primary - passed via oxlint config)
  const ruleOptions = context.options?.[0];
  if (ruleOptions?.jsxAllowedProperties) {
    return new Set(ruleOptions.jsxAllowedProperties);
  }

  // Fallback to config file (for direct plugin usage)
  const config = loadRestrictedSyntaxConfig();
  if (config.jsxAllowedProperties) {
    return new Set(config.jsxAllowedProperties);
  }

  // Return empty set if no config
  return new Set();
}

/**
 * Check if a property key is in the allowlist for JSX values
 */
function isJSXAllowedKey(
  prop: OxlintASTNode,
  jsxAllowedProperties: Set<string>,
): boolean {
  const property = prop as Property;
  if (property.computed) {
    return false;
  }
  const key = property.key;
  if (!key) {
    return false;
  }

  let keyName: string | null = null;

  if (key.type === "Identifier") {
    keyName = (key as Identifier).name;
  } else if (
    key.type === "Literal" &&
    typeof (key as Literal).value === "string"
  ) {
    keyName = (key as Literal).value as string;
  }

  return keyName !== null && jsxAllowedProperties.has(keyName);
}

/** Browser globals that must be accessed through vibe-ui abstractions */
const BROWSER_GLOBALS = new Set([
  "window",
  "localStorage",
  "sessionStorage",
  "document",
  "navigator",
]);

/**
 * Paths that ARE the browser abstraction layer — the rule does not apply here.
 * These implement the very APIs that app code should use instead.
 */
const BROWSER_IMPL_PATH_FRAGMENTS = [
  "next-vibe/ui/",
  "next-vibe/ui/tanstack/",
  // The vibe-frame embed bundle is a standalone, zero-dependency script that
  // runs on third-party pages / inside the iframe. It talks to the browser
  // directly and must NOT pull in next-vibe-ui. Only the in-frame runtime
  // files are exempt — host-side app code (VibeFrameHost, mount/) still uses
  // the abstractions.
  "vibe-frame/bridge.ts",
  "vibe-frame/inside-bridge.ts",
  "vibe-frame/embed.ts",
  "vibe-frame/embed-package.ts",
  "vibe-frame/triggers.ts",
];

/**
 * window.* properties that are universal globals — no abstraction needed.
 * window.setTimeout === setTimeout, etc.
 */
const WINDOW_UNIVERSAL_PROPS = new Set([
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "queueMicrotask",
  "fetch",
  "Promise",
  "URL",
  "URLSearchParams",
  "Blob",
  "File",
  "FormData",
  "AbortController",
  "ResizeObserver",
  "IntersectionObserver",
  "MutationObserver",
  "crypto",
  "performance",
  "matchMedia",
  "devicePixelRatio",
  "isSecureContext",
  "postMessage",
  "Audio",
  "AudioContext",
  "WebSocket",
  "Worker",
  "SharedWorker",
  "RTCPeerConnection",
  "MediaRecorder",
  "MediaStream",
  "atob",
  "btoa",
  "getComputedStyle",
]);

/** Per-property messages for window.* access */
const WINDOW_PROPERTY_MESSAGES: Record<string, string> = {
  location:
    "Use getCurrentUrl(), assignUrl(url), reloadPage(), getCurrentOrigin(), getCurrentHostname(), getCurrentPathname(), or getCurrentSearch() from 'next-vibe/ui/utils/browser' instead of window.location.*.",
  open: "Use openInNewTab(url) from 'next-vibe/ui/utils/browser' instead of window.open().",
  history:
    "Use silentPushState(url) or silentReplaceState(url) from 'next-vibe/ui/utils/browser' instead of window.history.",
  innerWidth:
    "Use getScreenWidth() or useWindowSize() from 'next-vibe/ui/hooks/use-window-size' instead of window.innerWidth.",
  innerHeight:
    "Use useWindowSize() from 'next-vibe/ui/hooks/use-window-size' instead of window.innerHeight.",
  scrollTo:
    "Use scrollToTop() from 'next-vibe/ui/utils/browser' instead of window.scrollTo().",
  print:
    "Use triggerPrint() from 'next-vibe/ui/utils/browser' instead of window.print().",
  ontouchstart:
    "Use useTouchDevice() from 'next-vibe/ui/hooks/use-touch-device' instead of window.ontouchstart.",
  addEventListener:
    "Use addWindowListener(event, handler) from 'next-vibe/ui/utils/browser' instead of window.addEventListener().",
  removeEventListener:
    "Use the cleanup function returned by addWindowListener() from 'next-vibe/ui/utils/browser' instead of window.removeEventListener().",
};

/** Per-property messages for document.* access */
const DOCUMENT_PROPERTY_MESSAGES: Record<string, string> = {
  cookie:
    "Use getCookie/setCookie/deleteCookie/getAllCookies from 'next-vibe/ui/lib/cookies' instead of document.cookie.",
  referrer:
    "Use getReferrer() from 'next-vibe/ui/utils/browser' instead of document.referrer.",
  documentElement:
    "Use getRootCssVar/setRootCssVar/rootHasClass/addRootClass/removeRootClass/observeRootMutations/getDocumentScrollHeight from 'next-vibe/ui/utils/browser' instead of document.documentElement.",
  getElementById:
    "Use getElementById(id) from 'next-vibe/ui/utils/browser' instead of document.getElementById().",
  querySelector:
    "Use querySelector(selector) from 'next-vibe/ui/utils/browser' instead of document.querySelector().",
  querySelectorAll:
    "Use querySelector(selector) from 'next-vibe/ui/utils/browser' instead of document.querySelectorAll().",
  createElement:
    "Use downloadFile(filename, content) from 'next-vibe/ui/utils/browser' for download links, or add a specific helper if needed.",
  addEventListener:
    "Use addDocumentListener(event, handler) from 'next-vibe/ui/utils/browser' instead of document.addEventListener().",
  removeEventListener:
    "Use the cleanup function returned by addDocumentListener() from 'next-vibe/ui/utils/browser' instead of document.removeEventListener().",
  body: "Use getDocumentBody() from 'next-vibe/ui/utils/browser' instead of document.body.",
  title:
    "Set document.title via a <title> tag or metadata API instead of direct document.title access.",
};

/** Per-property messages for navigator.* access */
const NAVIGATOR_PROPERTY_MESSAGES: Record<string, string> = {
  userAgent:
    "Use getUserAgent() from 'next-vibe/ui/utils/browser' instead of navigator.userAgent.",
  maxTouchPoints:
    "Use useTouchDevice() from 'next-vibe/ui/hooks/use-touch-device' instead of navigator.maxTouchPoints.",
  clipboard:
    "Use copyToClipboard(text) from 'next-vibe/ui/utils/browser' instead of navigator.clipboard.",
  geolocation:
    "Use getGeolocation() from 'next-vibe/ui/utils/browser' instead of navigator.geolocation.",
  mediaDevices:
    "Use navigator.mediaDevices directly — no abstraction exists yet. Add one to 'next-vibe/ui/utils/browser' if needed.",
  language:
    "Use navigator.language directly — no abstraction exists yet. Add one to 'next-vibe/ui/utils/browser' if needed.",
  onLine:
    "Use navigator.onLine directly — no abstraction exists yet. Add one to 'next-vibe/ui/utils/browser' if needed.",
};

/**
 * Build a specific error message based on which global and property was accessed.
 */
function getBrowserGlobalMessage(
  globalName: string,
  propertyName: string | null,
  messages: RestrictedSyntaxMessages,
): string {
  if (propertyName) {
    let specific: string | undefined;
    if (globalName === "window") {
      specific = WINDOW_PROPERTY_MESSAGES[propertyName];
    } else if (globalName === "document") {
      specific = DOCUMENT_PROPERTY_MESSAGES[propertyName];
    } else if (globalName === "navigator") {
      specific = NAVIGATOR_PROPERTY_MESSAGES[propertyName];
    }
    if (specific) {
      return specific;
    }
  }
  if (globalName === "window") {
    return messages.windowAccess;
  }
  if (globalName === "localStorage") {
    return messages.localStorageAccess;
  }
  if (globalName === "sessionStorage") {
    return messages.sessionStorageAccess;
  }
  if (globalName === "document") {
    return messages.documentAccess;
  }
  return messages.navigatorAccess;
}

/**
 * Check if the file is part of the browser abstraction layer (exempt from this rule).
 */
function isBrowserImplFile(context: RestrictedSyntaxRuleContext): boolean {
  let filename = "";
  if (typeof context.getFilename === "function") {
    filename = context.getFilename();
  } else if (typeof context.filename === "string") {
    filename = context.filename;
  }
  if (!filename) {
    return false;
  }
  const normalized = filename.replace(/\\/g, "/");
  return BROWSER_IMPL_PATH_FRAGMENTS.some((fragment) =>
    normalized.includes(fragment),
  );
}

/**
 * Return browser global info if node is a MemberExpression rooted at a bare browser global.
 */
function getBrowserGlobal(node: OxlintASTNode): {
  globalName: string;
  propertyName: string | null;
} | null {
  if (node.type !== "MemberExpression") {
    return null;
  }
  const mem = node as MemberExpression;
  if (!mem.object || mem.object.type !== "Identifier") {
    return null;
  }
  const globalName = (mem.object as Identifier).name;
  if (!BROWSER_GLOBALS.has(globalName)) {
    return null;
  }
  let propertyName: string | null = null;
  if (mem.property && !mem.computed) {
    if (mem.property.type === "Identifier") {
      propertyName = (mem.property as Identifier).name;
    } else if (
      mem.property.type === "Literal" &&
      typeof (mem.property as Literal).value === "string"
    ) {
      propertyName = (mem.property as Literal).value as string;
    }
  }
  // Skip universal globals that are available in all environments (setTimeout, fetch, etc.)
  if (
    globalName === "window" &&
    propertyName !== null &&
    WINDOW_UNIVERSAL_PROPS.has(propertyName)
  ) {
    return null;
  }
  return { globalName, propertyName };
}

/**
 * Next.js server entry filenames — always server components unless the file
 * itself starts with a 'use client' directive.
 */
const NEXT_SERVER_ENTRY_RE = /\/(?:page|layout|template|default)\.[jt]sx$/;

/**
 * Check if the file is a Next.js server entry file (page/layout/template/default).
 */
function isNextServerEntryFile(context: RestrictedSyntaxRuleContext): boolean {
  let filename = "";
  if (typeof context.getFilename === "function") {
    filename = context.getFilename();
  } else if (typeof context.filename === "string") {
    filename = context.filename;
  }
  if (!filename) {
    return false;
  }
  return NEXT_SERVER_ENTRY_RE.test(filename.replaceAll("\\", "/"));
}

/**
 * Return true if a statement is a `"use client"` directive
 * (an ExpressionStatement whose expression is the string literal).
 */
function isUseClientDirective(stmt: OxlintASTNode): boolean {
  if (stmt.type !== "ExpressionStatement") {
    return false;
  }
  const expr = (stmt as ExpressionStatement).expression;
  return expr?.type === "Literal" && (expr as Literal).value === "use client";
}

/**
 * Return true if an ImportDeclaration imports the EndpointsPage component
 * (as a value, not a type).
 */
function importsEndpointsPage(node: OxlintASTNode): boolean {
  if (node.type !== "ImportDeclaration") {
    return false;
  }
  const imp = node as ImportDeclaration;
  if (imp.importKind === "type") {
    return false;
  }
  const specifiers = imp.specifiers;
  if (!specifiers || !Array.isArray(specifiers)) {
    return false;
  }
  return specifiers.some((spec) => {
    if (spec.importKind === "type") {
      return false;
    }
    const imported = spec.imported;
    if (
      imported?.type === "Identifier" &&
      (imported as Identifier).name === "EndpointsPage"
    ) {
      return true;
    }
    const local = spec.local;
    return (
      local?.type === "Identifier" &&
      (local as Identifier).name === "EndpointsPage"
    );
  });
}

/**
 * Return true if a CallExpression is a raw global `fetch(...)` call.
 *
 * Matches bare `fetch(...)`, `window.fetch(...)`, and `globalThis.fetch(...)`.
 * Does NOT match method calls on other objects (e.g. `apiClient.fetch(...)`,
 * `sourceCode.fetch(...)`), which are sanctioned wrappers, not the global.
 */
function isRawFetchCall(node: OxlintASTNode): boolean {
  if (node.type !== "CallExpression") {
    return false;
  }
  const callee = (node as CallExpression).callee;
  if (!callee) {
    return false;
  }
  // Bare `fetch(...)`
  if (callee.type === "Identifier" && (callee as Identifier).name === "fetch") {
    return true;
  }
  // `window.fetch(...)` / `globalThis.fetch(...)` / `self.fetch(...)`
  if (callee.type === "MemberExpression") {
    const mem = callee as MemberExpression;
    if (mem.computed || mem.object?.type !== "Identifier") {
      return false;
    }
    const objectName = (mem.object as Identifier).name;
    if (
      objectName !== "window" &&
      objectName !== "globalThis" &&
      objectName !== "self"
    ) {
      return false;
    }
    const property = mem.property;
    if (!property) {
      return false;
    }
    if (
      property.type === "Identifier" &&
      (property as Identifier).name === "fetch"
    ) {
      return true;
    }
    if (
      property.type === "Literal" &&
      (property as Literal).value === "fetch"
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a node is a JSX element or fragment
 */
function isJSX(n: OxlintASTNode): boolean {
  return n && (n.type === "JSXElement" || n.type === "JSXFragment");
}

/**
 * Unwrap parenthesized expressions to get the inner node
 */
function unwrapParen(n: OxlintASTNode): OxlintASTNode {
  let cur = n;
  while (cur?.type === "ParenthesizedExpression") {
    const expr = (cur as ParenthesizedExpression).expression;
    if (!expr) {
      break;
    }
    cur = expr;
  }
  return cur;
}

// ============================================================
// Rule Implementation
// ============================================================

const restrictedSyntaxRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces restricted syntax patterns (no unknown, object, throw, JSX in non-React-node properties, raw fetch, EndpointsPage in server entry files)",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          jsxAllowedProperties: { type: "array", items: { type: "string" } },
        },
      },
    ],
  },
  create(
    context: RestrictedSyntaxRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Check if file is in allowed path (applies to all rules)
    const isAllowed = isAllowedPath(context);
    // Check if this file is the browser abstraction layer itself (exempt from browser global rules)
    const isBrowserImpl = isBrowserImplFile(context);

    // Load JSX allowed properties from rule options or config (single source of truth)
    const jsxAllowedProperties = getJsxAllowedProperties(context);

    // Get customizable messages
    const messages = getMessages();

    // Server-entry tracking for the EndpointsPage rule. The directive prologue
    // is visited before any ImportDeclaration, so the flag is always set in time.
    const isServerEntry = isNextServerEntryFile(context);
    let hasUseClientDirective = false;

    return {
      // ============================================================
      // 'use client' directive detection (directive prologue only)
      // ============================================================
      Program(node: OxlintASTNode): void {
        const body = (node as Program).body;
        if (!body || !Array.isArray(body)) {
          return;
        }
        for (const stmt of body) {
          if (stmt.type !== "ExpressionStatement") {
            break;
          }
          if (isUseClientDirective(stmt)) {
            hasUseClientDirective = true;
            break;
          }
        }
      },

      // Fallback for runtimes without a Program visitor: the directive's own
      // ExpressionStatement is visited before any later node in the file.
      ExpressionStatement(node: OxlintASTNode): void {
        if (isUseClientDirective(node)) {
          hasUseClientDirective = true;
        }
      },

      // ============================================================
      // No EndpointsPage in server entry files — it must live in a
      // 'use client' component (page-client.tsx pattern).
      // ============================================================
      ImportDeclaration(node: OxlintASTNode): void {
        if (!isServerEntry || hasUseClientDirective) {
          return;
        }
        if (!importsEndpointsPage(node)) {
          return;
        }
        if (hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: messages.endpointsPageInServerEntry,
        });
      },

      // ============================================================
      // Restricted syntax rules
      // ============================================================
      TSUnknownKeyword(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: messages.unknownType,
        });
      },

      TSObjectKeyword(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: messages.objectType,
        });
      },

      ThrowStatement(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: messages.throwStatement,
        });
      },

      Property(node: OxlintASTNode): void {
        // Only process ObjectProperty nodes
        if (!isObjectProperty(node)) {
          return;
        }

        // Skip properties that are allowed to have JSX values
        if (isJSXAllowedKey(node, jsxAllowedProperties)) {
          return;
        }

        const property = node as Property;
        const value = property.value;

        if (
          !value ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null
        ) {
          return;
        }

        // Check for direct JSX
        if (isJSX(value)) {
          context.report({
            node: value,
            message: messages.jsxInObjectLiteral,
          });
          return;
        }

        // Check for parenthesized JSX
        if (value.type === "ParenthesizedExpression") {
          const inner = unwrapParen(value);
          if (isJSX(inner)) {
            context.report({
              node: inner,
              message: messages.jsxInObjectLiteral,
            });
          }
        }
      },

      // ============================================================
      // Browser global restrictions — use vibe-ui abstractions instead
      // ============================================================
      MemberExpression(node: OxlintASTNode): void {
        if (isAllowed || isBrowserImpl || hasDisableComment(context, node)) {
          return;
        }
        const result = getBrowserGlobal(node);
        if (!result) {
          return;
        }
        context.report({
          node,
          message: getBrowserGlobalMessage(
            result.globalName,
            result.propertyName,
            messages,
          ),
        });
      },

      // ============================================================
      // No raw fetch — read endpoint data through typed hooks.
      // No path is auto-exempt: genuine external-API calls opt out
      // with an explicit disable comment ("you know it when you see it").
      // ============================================================
      CallExpression(node: OxlintASTNode): void {
        if (!isRawFetchCall(node)) {
          return;
        }
        if (hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: messages.rawFetch,
        });
      },
    };
  },
};

// ============================================================
// Plugin Export
// ============================================================

export default {
  meta: {
    name: "oxlint-plugin-restricted",
    version: "1.0.0",
  },
  rules: {
    "restricted-syntax": restrictedSyntaxRule,
  },
};

// Named exports for direct access
export { DEFAULT_CONFIG as defaultConfig, DEFAULT_MESSAGES as defaultMessages };
export type { RestrictedSyntaxMessages, RestrictedSyntaxPluginConfig };
