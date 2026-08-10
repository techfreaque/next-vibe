/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions, one rule name per ban:
 * - `no-unknown` — no `unknown` type
 * - `no-object-type` — no `object` type
 * - `no-throw` — no `throw` statements
 * - `no-jsx-in-object-literal` — no JSX in object literals (except common React
 *   node properties like content, icon, title, …)
 * - `no-raw-fetch` — no raw `fetch()` (use typed endpoint hooks; external-API
 *   calls opt out with a disable comment)
 * - `no-as-assertion` — no `as` type assertions, except `as const`
 * - `no-browser-globals` — no direct window/document/navigator/storage access
 * - `no-endpoints-page-in-server-entry` — no `EndpointsPage` in server entry
 *   files (page/layout/template without 'use client')
 *
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { RestrictedSyntaxPluginConfig } from "../../../../../config/types";
import type {
  OxlintASTNode,
  OxlintComment,
  OxlintRuleContext,
} from "../../../types";
import type {
  createPluginMessages,
  loadPluginConfig,
} from "../../shared/config-loader";

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

/** AST node for TSAsExpression (`expr as Type`) */
interface TSAsExpression extends OxlintASTNode {
  type: "TSAsExpression";
  expression?: OxlintASTNode;
  typeAnnotation?: OxlintASTNode;
}

/** AST node for TSTypeReference (e.g. the `const` in `as const`) */
interface TSTypeReference extends OxlintASTNode {
  type: "TSTypeReference";
  typeName?: OxlintASTNode;
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
  asAssertion: string;
  endpointsPageInServerEntry: string;
}

/** A single JSON-schema entry for a rule's options. */
interface RuleOptionSchema {
  type: string;
  properties?: Record<string, { type: string; items?: { type: string } }>;
}

/** The shape oxlint expects from a rule module: metadata plus a visitor factory. */
interface OxlintRule {
  meta: {
    type: string;
    docs: { description: string; category: string; recommended: boolean };
    schema: RuleOptionSchema[];
  };
  create: (
    context: RestrictedSyntaxRuleContext,
  ) => Record<string, (node: OxlintASTNode) => void>;
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
  noThrow: true,
  noUnknown: true,
  noObjectType: true,
  // Off by default here: this repo still carries thousands of `as X`
  // assertions, so a default-on ban would fail every check including the
  // checker's own tree. Trees that are clean opt in via check.config.ts
  // (`noAsAssertion: true` in the shared restricted-syntax options).
  noAsAssertion: false,
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
    "Raw 'fetch()' is not allowed. To read endpoint data, use the endpoint's typed hook (it handles caching, auth, and platform routing). Only genuine external-API calls may use raw fetch — mark those with '// oxlint-disable-next-line restricted/no-raw-fetch -- external API'.",
  asAssertion:
    "'as' type assertions are not allowed. Fix the underlying type instead of asserting past the checker ('as const' is unaffected).",
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
    configLoader = require("../../shared/config-loader") as typeof configLoader;
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
    // Any of the rules works: they are configured with one shared options
    // object, so this only needs a key that still exists.
    const result = loader.loadPluginConfig(
      "oxlint-plugin-restricted/no-unknown",
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
      exported?.oxlint?.rules?.["oxlint-plugin-restricted/no-unknown"];
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

/** Read the file being linted, across the context shapes oxlint has used. */
function getContextFilename(context: RestrictedSyntaxRuleContext): string {
  if (typeof context.getFilename === "function") {
    return context.getFilename();
  }
  if (typeof context.filename === "string") {
    return context.filename;
  }
  return "";
}

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
  const filename = getContextFilename(context);
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
 * Check if the node has a disable comment for this rule.
 *
 * Matches the rule's own name (e.g. "no-unknown") and the legacy combined name
 * "restricted-syntax", so directives written before the split keep working.
 */
function hasDisableComment(
  context: RestrictedSyntaxRuleContext,
  node: OxlintASTNode,
  ruleName: string,
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

    // Check if any preceding comment disables this rule (by its own name) or
    // carries a legacy combined "restricted-syntax" directive.
    for (const comment of comments) {
      if (!comment || typeof comment.value !== "string") {
        continue;
      }
      const commentText = comment.value.trim();
      if (
        (commentText.includes("eslint-disable-next-line") ||
          commentText.includes("oxlint-disable-next-line")) &&
        (commentText.includes(ruleName) ||
          commentText.includes("restricted-syntax"))
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

/** Return true for the `const` in `as const` (a widening opt-out, not a type assertion). */
function isConstAssertion(typeAnnotation: OxlintASTNode | undefined): boolean {
  if (!typeAnnotation || typeAnnotation.type !== "TSTypeReference") {
    return false;
  }
  const typeName = (typeAnnotation as TSTypeReference).typeName;
  return (
    typeName?.type === "Identifier" && (typeName as Identifier).name === "const"
  );
}

// ============================================================
// Rule Factory
// ============================================================

/**
 * The options schema every rule in this plugin accepts.
 *
 * All rules are configured with one shared options object, so they must all
 * accept the whole shape — a rule that declared only its own switch would make
 * oxlint reject the shared object as having unknown properties.
 */
const SHARED_OPTIONS_SCHEMA: RuleOptionSchema[] = [
  {
    type: "object",
    properties: {
      noThrow: { type: "boolean" },
      noUnknown: { type: "boolean" },
      noObjectType: { type: "boolean" },
      noAsAssertion: { type: "boolean" },
      jsxAllowedProperties: { type: "array", items: { type: "string" } },
    },
  },
];

/** What a ban's visitors are handed. */
interface BanRuleHelpers {
  context: RestrictedSyntaxRuleContext;
  options: RestrictedSyntaxPluginConfig;
  messages: RestrictedSyntaxMessages;
  /**
   * Report `message` at `node`, unless a disable comment covers it.
   *
   * `disableAnchor` is the node whose preceding comments are read; it defaults
   * to `node` but rules that report on a child (the JSX *value* of a property)
   * anchor on the node a human would actually write the comment above.
   */
  report: (
    node: OxlintASTNode,
    message: string,
    disableAnchor?: OxlintASTNode,
  ) => void;
}

/**
 * One rule per ban, rather than one rule with many visitors.
 *
 * The rule name is the only handle anything outside the plugin has: a diagnostic
 * says `oxlint-plugin-restricted(<name>)`, and that name is what `strictRules`,
 * an `eslint-disable` comment and an oxlint severity override all key on. While
 * every ban reported as `restricted-syntax`, they could only ever be toggled
 * together — you could not scope `unknown` to the strict paths while keeping
 * `throw` repo-wide, or silence one line's `object` without silencing its
 * `throw` too.
 *
 * Each still reads its own switch (`noUnknown`/`noObjectType`/`noThrow`), so the
 * plugin config keeps working as before; this only splits *how they report*.
 */
function createBanRule(config: {
  /** Rule name — appears verbatim in the diagnostic and in `strictRules`. */
  name: string;
  description: string;
  /** Which plugin switch turns it off. */
  isEnabled: (options: RestrictedSyntaxPluginConfig) => boolean;
  /** Files this ban does not apply to at all (the abstraction layer itself). */
  isExemptFile?: (context: RestrictedSyntaxRuleContext) => boolean;
  createVisitors: (
    helpers: BanRuleHelpers,
  ) => Record<string, (node: OxlintASTNode) => void>;
}): OxlintRule {
  return {
    meta: {
      type: "problem",
      docs: {
        description: config.description,
        category: "Best Practices",
        recommended: true,
      },
      schema: SHARED_OPTIONS_SCHEMA,
    },
    create(
      context: RestrictedSyntaxRuleContext,
    ): Record<string, (node: OxlintASTNode) => void> {
      const options = context.options?.[0] ?? loadRestrictedSyntaxConfig();
      if (!config.isEnabled(options) || config.isExemptFile?.(context)) {
        // No visitors at all — cheaper than checking the same flag per node.
        return {};
      }

      const messages = getMessages();
      const report = (
        node: OxlintASTNode,
        message: string,
        disableAnchor?: OxlintASTNode,
      ): void => {
        if (hasDisableComment(context, disableAnchor ?? node, config.name)) {
          return;
        }
        context.report({ node, message });
      };

      return config.createVisitors({ context, options, messages, report });
    },
  };
}

// ============================================================
// Rules
// ============================================================

const noUnknownRule = createBanRule({
  name: "no-unknown",
  description: "Disallow the `unknown` type",
  isEnabled: (options) => options.noUnknown !== false,
  isExemptFile: isAllowedPath,
  createVisitors: ({ messages, report }) => ({
    TSUnknownKeyword: (node: OxlintASTNode): void =>
      report(node, messages.unknownType),
  }),
});

const noObjectTypeRule = createBanRule({
  name: "no-object-type",
  description: "Disallow the `object` type",
  isEnabled: (options) => options.noObjectType !== false,
  isExemptFile: isAllowedPath,
  createVisitors: ({ messages, report }) => ({
    TSObjectKeyword: (node: OxlintASTNode): void =>
      report(node, messages.objectType),
  }),
});

const noThrowRule = createBanRule({
  name: "no-throw",
  description: "Disallow `throw` statements",
  isEnabled: (options) => options.noThrow !== false,
  isExemptFile: isAllowedPath,
  createVisitors: ({ messages, report }) => ({
    ThrowStatement: (node: OxlintASTNode): void =>
      report(node, messages.throwStatement),
  }),
});

const noJsxInObjectLiteralRule = createBanRule({
  name: "no-jsx-in-object-literal",
  description:
    "Disallow JSX values in object literals outside the React-node property allowlist",
  // Always on: it has no switch of its own, the plugin being enabled is the switch.
  isEnabled: () => true,
  createVisitors: ({ context, messages, report }) => {
    const jsxAllowedProperties = getJsxAllowedProperties(context);

    return {
      Property: (node: OxlintASTNode): void => {
        // Only process ObjectProperty nodes
        if (!isObjectProperty(node)) {
          return;
        }

        // Skip properties that are allowed to have JSX values
        if (isJSXAllowedKey(node, jsxAllowedProperties)) {
          return;
        }

        const value = (node as Property).value;
        if (!value) {
          return;
        }

        // Check for direct JSX
        if (isJSX(value)) {
          report(value, messages.jsxInObjectLiteral, node);
          return;
        }

        // Check for parenthesized JSX
        if (value.type === "ParenthesizedExpression") {
          const inner = unwrapParen(value);
          if (isJSX(inner)) {
            report(inner, messages.jsxInObjectLiteral, node);
          }
        }
      },
    };
  },
});

/**
 * No raw fetch — read endpoint data through typed hooks.
 *
 * No path is auto-exempt: genuine external-API calls opt out with an explicit
 * disable comment ("you know it when you see it").
 */
const noRawFetchRule = createBanRule({
  name: "no-raw-fetch",
  description: "Disallow raw `fetch()` calls outside external-API integrations",
  isEnabled: () => true,
  createVisitors: ({ messages, report }) => ({
    CallExpression: (node: OxlintASTNode): void => {
      if (!isRawFetchCall(node)) {
        return;
      }
      report(node, messages.rawFetch);
    },
  }),
});

const noAsAssertionRule = createBanRule({
  name: "no-as-assertion",
  description: "Disallow `as` type assertions, except `as const`",
  // Default OFF (see DEFAULT_CONFIG): only reports where the config opts in.
  isEnabled: (options) => options.noAsAssertion === true,
  isExemptFile: isAllowedPath,
  createVisitors: ({ messages, report }) => ({
    TSAsExpression: (node: OxlintASTNode): void => {
      if (isConstAssertion((node as TSAsExpression).typeAnnotation)) {
        return;
      }
      report(node, messages.asAssertion);
    },
  }),
});

// ============================================================
// next-vibe layout-specific rules
//
// These two key on the next-vibe UI/Next.js layout — the `next-vibe/ui/*`
// browser abstractions the messages point at, and the `EndpointsPage`
// component. A consumer that does not vendor that UI layer has nothing for
// them to point at, so they are not part of the shared rule set.
// ============================================================

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
  const filename = getContextFilename(context);
  if (!filename) {
    return false;
  }
  const normalized = filename.replaceAll("\\", "/");
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
  const filename = getContextFilename(context);
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

const noBrowserGlobalsRule = createBanRule({
  name: "no-browser-globals",
  description:
    "Disallow direct window/document/navigator/storage access outside the UI abstraction layer",
  isEnabled: () => true,
  // Both the vibe UI primitives and the browser-abstraction implementations
  // legitimately touch the raw globals — they are what app code should use.
  isExemptFile: (context) =>
    isAllowedPath(context) || isBrowserImplFile(context),
  createVisitors: ({ messages, report }) => ({
    MemberExpression: (node: OxlintASTNode): void => {
      const result = getBrowserGlobal(node);
      if (!result) {
        return;
      }
      report(
        node,
        getBrowserGlobalMessage(
          result.globalName,
          result.propertyName,
          messages,
        ),
      );
    },
  }),
});

const noEndpointsPageInServerEntryRule = createBanRule({
  name: "no-endpoints-page-in-server-entry",
  description:
    "Disallow `EndpointsPage` in Next.js server entry files (page/layout/template without 'use client')",
  isEnabled: () => true,
  isExemptFile: (context) => !isNextServerEntryFile(context),
  createVisitors: ({ messages, report }) => {
    // The directive prologue is visited before any ImportDeclaration, so the
    // flag is always set in time.
    let hasUseClientDirective = false;

    return {
      Program: (node: OxlintASTNode): void => {
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
      ExpressionStatement: (node: OxlintASTNode): void => {
        if (isUseClientDirective(node)) {
          hasUseClientDirective = true;
        }
      },

      ImportDeclaration: (node: OxlintASTNode): void => {
        if (hasUseClientDirective || !importsEndpointsPage(node)) {
          return;
        }
        report(node, messages.endpointsPageInServerEntry);
      },
    };
  },
});

// ============================================================
// Plugin Export
// ============================================================

export default {
  meta: {
    name: "oxlint-plugin-restricted",
    version: "1.0.0",
  },
  rules: {
    "no-unknown": noUnknownRule,
    "no-object-type": noObjectTypeRule,
    "no-throw": noThrowRule,
    "no-jsx-in-object-literal": noJsxInObjectLiteralRule,
    "no-raw-fetch": noRawFetchRule,
    "no-as-assertion": noAsAssertionRule,
    "no-browser-globals": noBrowserGlobalsRule,
    "no-endpoints-page-in-server-entry": noEndpointsPageInServerEntryRule,
  },
};

// Named exports for direct access
export { DEFAULT_CONFIG as defaultConfig, DEFAULT_MESSAGES as defaultMessages };
export type { RestrictedSyntaxMessages, RestrictedSyntaxPluginConfig };
