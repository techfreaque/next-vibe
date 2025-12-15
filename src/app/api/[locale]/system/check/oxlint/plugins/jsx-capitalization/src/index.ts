/**
 * Oxlint JS Plugin: JSX Capitalization
 *
 * Enforces the use of capitalized JSX components from next-vibe-ui
 * instead of lowercase HTML elements (div, p, a, etc.)
 *
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { JsxCapitalizationPluginConfig } from "../../../../config/types";
import type {
  JSXIdentifier,
  OxlintASTNode,
  OxlintComment,
  OxlintRuleContext,
} from "../../../types";
import type {
  createPluginMessages,
  loadPluginConfig,
} from "../../shared/config-loader";

/** JSXOpeningElement AST node */
interface JSXOpeningElement extends OxlintASTNode {
  type: "JSXOpeningElement";
  name?: OxlintASTNode;
  attributes?: OxlintASTNode[];
  selfClosing?: boolean;
}

// ============================================================
// Types
// ============================================================

/** Extended rule context with jsx-capitalization options */
interface JsxCapitalizationRuleContext extends OxlintRuleContext {
  options?: JsxCapitalizationPluginConfig[];
  getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  getFilename?: () => string;
  filename?: string;
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
    getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  };
}

/** Element sets structure for use in rule */
interface ElementSets {
  typography: Set<string>;
  standalone: Set<string>;
  svg: Set<string>;
  image: Set<string>;
  commonUi: Set<string>;
}

/** Default error messages (can be customized via config) */
interface JsxCapitalizationMessages {
  anchorTag: string;
  typographyElement: string;
  standaloneElement: string;
  svgElement: string;
  imageElement: string;
  commonUiElement: string;
  genericElement: string;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: JsxCapitalizationPluginConfig = {
  excludedPaths: [],
  excludedFilePatterns: [".email.tsx", ".test.tsx", ".spec.tsx"],
  typographyElements: [
    "p",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "em",
    "small",
    "blockquote",
    "code",
    "pre",
  ],
  standaloneElements: [
    "div",
    "button",
    "input",
    "label",
    "form",
    "table",
    "ul",
    "ol",
    "li",
  ],
  svgElements: [
    "svg",
    "path",
    "circle",
    "rect",
    "line",
    "polygon",
    "polyline",
    "ellipse",
    "g",
  ],
  imageElements: ["img", "picture", "source", "video", "audio"],
  commonUiElements: [
    "nav",
    "header",
    "footer",
    "main",
    "section",
    "article",
    "aside",
  ],
};

const DEFAULT_MESSAGES: JsxCapitalizationMessages = {
  anchorTag:
    'Use platform-independent <Link> component instead of <a>. import { Link } from "next-vibe-ui/ui/link";',
  typographyElement:
    'Use typography component <{capitalizedName}> instead of <{elementName}>. import { {capitalizedName} } from "next-vibe-ui/ui/typography";',
  standaloneElement:
    'Use platform-independent <{capitalizedName}> component instead of <{elementName}>. import { {capitalizedName} } from "next-vibe-ui/ui/{elementName}";',
  svgElement:
    "SVG element <{elementName}> detected. For icons, use components from next-vibe-ui/ui/icons instead. For custom SVG, create platform-independent components using react-native-svg that work on both web and native.",
  imageElement:
    'Use platform-independent <Image> component instead of <{elementName}>. import { Image } from "next-vibe-ui/ui/image";',
  commonUiElement:
    'Use platform-independent <{capitalizedName}> component instead of <{elementName}>. import { {capitalizedName} } from "next-vibe-ui/ui/{elementName}";',
  genericElement:
    "Lowercase element <{elementName}> detected. Create platform-independent components: 1) Create next-vibe-ui/web/ui/{elementName}.tsx for web, 2) Create next-vibe-ui/native/ui/{elementName}.tsx for React Native, or 3) Use an existing component if available.",
};

// ============================================================
// Dynamic Import for Shared Loader
// ============================================================

// Plugin config loader (lazy loaded to handle various runtime environments)
let configLoader: {
  loadPluginConfig: typeof loadPluginConfig;
  createPluginMessages: typeof createPluginMessages;
} | null = null;

let cachedConfig: JsxCapitalizationPluginConfig | null = null;
let cachedMessages: JsxCapitalizationMessages | null = null;

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
 * Load jsx-capitalization config using shared loader or fallback
 */
function loadJsxCapitalizationConfig(): JsxCapitalizationPluginConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  const loader = getConfigLoader();

  if (loader) {
    const result = loader.loadPluginConfig(
      "oxlint-plugin-jsx-capitalization/jsx-capitalization",
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
function loadConfigFallback(): JsxCapitalizationPluginConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment -- Plugin fallback requires dynamic loading
    const config = require(`${process.cwd()}/check.config.ts`);
    const checkConfig = config.default ?? config;
    const exported =
      typeof checkConfig === "function" ? checkConfig() : checkConfig;

    const ruleConfig =
      exported?.oxlint?.rules?.[
        "oxlint-plugin-jsx-capitalization/jsx-capitalization"
      ];
    if (Array.isArray(ruleConfig) && ruleConfig[1]) {
      return ruleConfig[1] as JsxCapitalizationPluginConfig;
    }
  } catch {
    // Config not available
  }

  return DEFAULT_CONFIG;
}

/**
 * Get error messages (supports customization via config)
 */
function getMessages(): JsxCapitalizationMessages {
  if (cachedMessages !== null) {
    return cachedMessages;
  }
  cachedMessages = DEFAULT_MESSAGES;
  return cachedMessages;
}

/**
 * Format a message with value substitution
 */
function formatMessage(
  template: string,
  elementName: string,
  capitalizedName: string,
): string {
  return template
    .replaceAll("{elementName}", elementName)
    .replaceAll("{capitalizedName}", capitalizedName);
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Check if a JSX element name is lowercase (indicating an HTML element)
 * In React/JSX, lowercase names are HTML elements, uppercase names are components
 */
function isLowercaseElement(elementName: string): boolean {
  const firstChar = elementName.charAt(0);
  return (
    firstChar === firstChar.toLowerCase() &&
    firstChar !== firstChar.toUpperCase()
  );
}

/**
 * Check if the current file is in the excluded path or matches excluded patterns
 */
function isExcludedPath(
  context: JsxCapitalizationRuleContext,
  excludedPaths: readonly string[],
  excludedFilePatterns: readonly string[],
): boolean {
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

  // Normalize path separators
  const normalizedPath = filename.replaceAll("\\", "/");

  // Check if file is in any excluded directory
  for (const excludedPath of excludedPaths) {
    if (normalizedPath.includes(excludedPath)) {
      return true;
    }
  }

  // Check if file matches any excluded pattern
  for (const pattern of excludedFilePatterns) {
    if (normalizedPath.includes(pattern) || normalizedPath.endsWith(pattern)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if the node has a disable comment
 */
function hasDisableComment(
  context: JsxCapitalizationRuleContext,
  node: OxlintASTNode,
): boolean {
  const getComments =
    context.getCommentsBefore ?? context.sourceCode?.getCommentsBefore;
  if (typeof getComments !== "function") {
    return false;
  }

  try {
    const comments = getComments(node);
    if (!comments || !Array.isArray(comments)) {
      return false;
    }

    for (const comment of comments) {
      if (!comment || typeof comment.value !== "string") {
        continue;
      }
      const commentText = comment.value.trim();
      if (
        (commentText.includes("eslint-disable-next-line") ||
          commentText.includes("oxlint-disable-next-line")) &&
        (commentText.includes("jsx-capitalization") ||
          commentText.includes("no-lowercase-jsx"))
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Get the element name from JSX opening element
 */
function getElementName(node: JSXOpeningElement): string | null {
  const name = node.name;

  if (!name) {
    return null;
  }

  // Handle simple identifier (e.g., <div>)
  if (name.type === "JSXIdentifier") {
    return (name as JSXIdentifier).name;
  }

  // Handle member expression (e.g., <Foo.Bar>) - not applicable for HTML elements
  if (name.type === "JSXMemberExpression") {
    return null;
  }

  // Handle namespaced name (e.g., <svg:path>) - not applicable for HTML elements
  if (name.type === "JSXNamespacedName") {
    return null;
  }

  return null;
}

/**
 * Capitalize the first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get element sets from rule options or config file
 */
function getElementSets(context: JsxCapitalizationRuleContext): ElementSets {
  // First try rule options (primary - passed via oxlint config)
  const ruleOptions = context.options?.[0];
  if (ruleOptions) {
    return {
      typography: new Set(ruleOptions.typographyElements ?? []),
      standalone: new Set(ruleOptions.standaloneElements ?? []),
      svg: new Set(ruleOptions.svgElements ?? []),
      image: new Set(ruleOptions.imageElements ?? []),
      commonUi: new Set(ruleOptions.commonUiElements ?? []),
    };
  }

  // Fallback to config file (for direct plugin usage)
  const config = loadJsxCapitalizationConfig();
  return {
    typography: new Set(config.typographyElements ?? []),
    standalone: new Set(config.standaloneElements ?? []),
    svg: new Set(config.svgElements ?? []),
    image: new Set(config.imageElements ?? []),
    commonUi: new Set(config.commonUiElements ?? []),
  };
}

/**
 * Get excluded paths from rule options or config file
 */
function getExcludedPaths(context: JsxCapitalizationRuleContext): {
  excludedPaths: readonly string[];
  excludedFilePatterns: readonly string[];
} {
  // First try rule options
  const ruleOptions = context.options?.[0];
  if (ruleOptions) {
    return {
      excludedPaths: ruleOptions.excludedPaths ?? [],
      excludedFilePatterns: ruleOptions.excludedFilePatterns ?? [],
    };
  }

  // Fallback to config file
  const config = loadJsxCapitalizationConfig();
  return {
    excludedPaths: config.excludedPaths ?? [],
    excludedFilePatterns: config.excludedFilePatterns ?? [],
  };
}

/**
 * Get error message for lowercase JSX element with smart import suggestions
 */
function getErrorMessage(
  elementName: string,
  elementSets: ElementSets,
): string {
  const capitalizedName = capitalize(elementName);
  const messages = getMessages();

  // Special case: anchor tags should use Link component
  if (elementName === "a") {
    return messages.anchorTag;
  }

  // Typography elements from typography.tsx
  if (elementSets.typography.has(elementName)) {
    return formatMessage(
      messages.typographyElement,
      elementName,
      capitalizedName,
    );
  }

  // Standalone UI elements with their own files
  if (elementSets.standalone.has(elementName)) {
    return formatMessage(
      messages.standaloneElement,
      elementName,
      capitalizedName,
    );
  }

  // SVG elements - suggest using icons instead
  if (elementSets.svg.has(elementName)) {
    return formatMessage(messages.svgElement, elementName, capitalizedName);
  }

  // Image elements
  if (elementSets.image.has(elementName)) {
    return formatMessage(messages.imageElement, elementName, capitalizedName);
  }

  // Common UI elements with known wrappers
  if (elementSets.commonUi.has(elementName)) {
    return formatMessage(
      messages.commonUiElement,
      elementName,
      capitalizedName,
    );
  }

  // Generic/unknown elements - guide to create platform-specific components
  return formatMessage(messages.genericElement, elementName, capitalizedName);
}

// ============================================================
// Rule Implementation
// ============================================================

const jsxCapitalizationRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces the use of capitalized JSX components instead of lowercase HTML elements",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          excludedPaths: { type: "array", items: { type: "string" } },
          excludedFilePatterns: { type: "array", items: { type: "string" } },
          typographyElements: { type: "array", items: { type: "string" } },
          standaloneElements: { type: "array", items: { type: "string" } },
          svgElements: { type: "array", items: { type: "string" } },
          imageElements: { type: "array", items: { type: "string" } },
          commonUiElements: { type: "array", items: { type: "string" } },
        },
      },
    ],
  },
  create(
    context: JsxCapitalizationRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Load config from check.config.ts (single source of truth)
    // Falls back to rule options if config file not available
    const { excludedPaths, excludedFilePatterns } = getExcludedPaths(context);
    const elementSets = getElementSets(context);

    // Check if file is in excluded path
    const isExcluded = isExcludedPath(
      context,
      excludedPaths,
      excludedFilePatterns,
    );

    return {
      JSXOpeningElement(node: OxlintASTNode): void {
        // Skip if file is in excluded directory
        if (isExcluded) {
          return;
        }

        // Skip if has disable comment
        if (hasDisableComment(context, node)) {
          return;
        }

        const openingElement = node as JSXOpeningElement;
        const elementName = getElementName(openingElement);

        // Skip if we couldn't get the element name
        if (!elementName) {
          return;
        }

        // Check if it's a lowercase element (HTML element that should be capitalized)
        if (isLowercaseElement(elementName)) {
          context.report({
            node,
            message: getErrorMessage(elementName, elementSets),
          });
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
    name: "oxlint-plugin-jsx-capitalization",
    version: "1.0.0",
  },
  rules: {
    "jsx-capitalization": jsxCapitalizationRule,
  },
};

// Named exports for direct access
export { DEFAULT_CONFIG as defaultConfig };
export { DEFAULT_MESSAGES as defaultMessages };
export type { JsxCapitalizationMessages, JsxCapitalizationPluginConfig };
