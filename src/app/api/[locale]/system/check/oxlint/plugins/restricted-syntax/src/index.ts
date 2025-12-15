/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions:
 * - No `unknown` type
 * - No `object` type
 * - No `throw` statements
 * - No JSX in object literals (except for common React node properties like content, icon, title, etc.)
 *
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { RestrictedSyntaxPluginConfig } from "../../../../config/types";
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

/** Default error messages (can be customized via config) */
interface RestrictedSyntaxMessages {
  unknownType: string;
  objectType: string;
  throwStatement: string;
  jsxInObjectLiteral: string;
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
    "Usage of the 'unknown' type isn't allowed. Consider using the inferred types from the unified interface system based on definition.ts",
  objectType:
    "Usage of the 'object' type isn't allowed. Consider using the inferred types from the unified interface system based on definition.ts",
  throwStatement:
    "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead.",
  jsxInObjectLiteral:
    "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
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

  return false;
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
        "Enforces restricted syntax patterns (no unknown, object, throw, JSX in non-React-node properties)",
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

    // Load JSX allowed properties from rule options or config (single source of truth)
    const jsxAllowedProperties = getJsxAllowedProperties(context);

    // Get customizable messages
    const messages = getMessages();

    return {
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
export { DEFAULT_CONFIG as defaultConfig };
export { DEFAULT_MESSAGES as defaultMessages };
export type { RestrictedSyntaxMessages, RestrictedSyntaxPluginConfig };
