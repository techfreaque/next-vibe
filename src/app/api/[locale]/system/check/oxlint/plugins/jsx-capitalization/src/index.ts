/**
 * Oxlint JS Plugin: JSX Capitalization
 *
 * Enforces the use of capitalized JSX components from next-vibe-ui
 * instead of lowercase HTML elements (div, p, a, etc.)
 *
 * Excludes files in /src/packages/next-vibe-ui/web folder
 */

// Type definitions for Oxlint AST nodes
interface BaseASTNode {
  type: string;
}

interface JSXIdentifier extends BaseASTNode {
  type: "JSXIdentifier";
  name: string;
}

interface JSXOpeningElement extends BaseASTNode {
  type: "JSXOpeningElement";
  name?: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
  selfClosing?: boolean;
}

interface JSXMemberExpression extends BaseASTNode {
  type: "JSXMemberExpression";
  object: JSXIdentifier | JSXMemberExpression;
  property: JSXIdentifier;
}

interface JSXNamespacedName extends BaseASTNode {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

type OxlintASTNode =
  | BaseASTNode
  | JSXIdentifier
  | JSXOpeningElement
  | JSXMemberExpression
  | JSXNamespacedName;

interface OxlintComment {
  type: "Line" | "Block";
  value: string;
}

interface OxlintRuleContext {
  report: (descriptor: { node: OxlintASTNode; message: string }) => void;
  options?: unknown[];
  getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  getFilename?: () => string;
  filename?: string;
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
    getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  };
}

interface RuleModule {
  meta: {
    type: string;
    docs: {
      description: string;
      category: string;
      recommended: boolean;
    };
    schema: Array<Record<string, never>>;
  };
  create: (
    context: OxlintRuleContext,
  ) => Record<string, (node: OxlintASTNode) => void>;
}

/**
 * Check if a JSX element name is lowercase (indicating an HTML element)
 * In React/JSX, lowercase names are HTML elements, uppercase names are components
 */
function isLowercaseElement(elementName: string): boolean {
  // Check if the first character is lowercase
  const firstChar = elementName.charAt(0);
  return (
    firstChar === firstChar.toLowerCase() &&
    firstChar !== firstChar.toUpperCase()
  );
}

/**
 * Check if the current file is in the excluded path (next-vibe-ui/web) or is an email template
 */
function isExcludedPath(context: OxlintRuleContext): boolean {
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
  const normalizedPath = filename.replace(/\\/g, "/");

  // Check if file is in the excluded directory
  if (normalizedPath.includes("/src/packages/next-vibe-ui/web/")) {
    return true;
  }

  // Check if file is an email template (email.tsx files use @react-email components)
  if (
    normalizedPath.endsWith("/email.tsx") ||
    normalizedPath.endsWith(".email.tsx")
  ) {
    return true;
  }

  // Check if file is a test file
  if (
    normalizedPath.includes("/test.tsx") ||
    normalizedPath.includes(".test.tsx") ||
    normalizedPath.includes(".spec.tsx") ||
    normalizedPath.includes("/__tests__/")
  ) {
    return true;
  }

  return false;
}

/**
 * Check if the node has a disable comment
 */
function hasDisableComment(
  context: OxlintRuleContext,
  node: OxlintASTNode,
): boolean {
  const getComments =
    context.getCommentsBefore || context.sourceCode?.getCommentsBefore;
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
 * Typography elements that should import from typography module
 * These are available in next-vibe-ui/ui/typography
 */
const TYPOGRAPHY_ELEMENTS = new Set([
  "h1",
  "h2",
  "h3",
  "h4", // H1, H2, H3, H4
  "p", // P
  "blockquote", // BlockQuote
  "code", // Code
]);

/**
 * Elements with dedicated component files (not in typography.tsx)
 * These can be imported individually from next-vibe-ui/ui/{elementName}
 */
const STANDALONE_UI_ELEMENTS = new Set([
  "span", // Span
  "pre", // Pre
]);

/**
 * SVG elements that need platform-independent handling
 * No direct wrapper components exist - suggest using icons or custom components
 */
const SVG_ELEMENTS = new Set([
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "g",
  "text",
  "tspan",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "mask",
  "pattern",
  "use",
  "symbol",
  "marker",
  "foreignObject",
]);

/**
 * Image-related elements
 */
const IMAGE_ELEMENTS = new Set(["img", "picture"]);

/**
 * Common UI elements that should have wrapper components
 */
const COMMON_UI_ELEMENTS = new Set([
  "div",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "main",
  "nav",
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "label",
  "form",
  "fieldset",
  "legend",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "video",
  "audio",
  "source",
  "track",
  "canvas",
  "hr",
  "br",
  "iframe",
  "embed",
  "object",
  "details",
  "summary",
  "dialog",
  "menu",
  "figure",
  "figcaption",
  "time",
  "progress",
  "meter",
  "output",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
]);

/**
 * Get error message for lowercase JSX element with smart import suggestions
 */
function getErrorMessage(elementName: string): string {
  const capitalizedName = capitalize(elementName);

  // Special case: anchor tags should use Link component
  if (elementName === "a") {
    return `Use platform-independent <Link> component instead of <a>. import { Link } from "next-vibe-ui/ui/link";`;
  }

  // Typography elements from typography.tsx
  if (TYPOGRAPHY_ELEMENTS.has(elementName)) {
    return `Use typography component <${capitalizedName}> instead of <${elementName}>. import { ${capitalizedName} } from "next-vibe-ui/ui/typography";`;
  }

  // Standalone UI elements with their own files
  if (STANDALONE_UI_ELEMENTS.has(elementName)) {
    return `Use platform-independent <${capitalizedName}> component instead of <${elementName}>. import { ${capitalizedName} } from "next-vibe-ui/ui/${elementName}";`;
  }

  // SVG elements - suggest using icons instead
  if (SVG_ELEMENTS.has(elementName)) {
    return `SVG element <${elementName}> detected. For icons, use components from next-vibe-ui/ui/icons instead. For custom SVG, create platform-independent components using react-native-svg that work on both web and native.`;
  }

  // Image elements
  if (IMAGE_ELEMENTS.has(elementName)) {
    return `Use platform-independent <Image> component instead of <${elementName}>. import { Image } from "next-vibe-ui/ui/image";`;
  }

  // Common UI elements with known wrappers
  if (COMMON_UI_ELEMENTS.has(elementName)) {
    return `Use platform-independent <${capitalizedName}> component instead of <${elementName}>. import { ${capitalizedName} } from "next-vibe-ui/ui/${elementName}";`;
  }

  // Generic/unknown elements - guide to create platform-specific components
  return `Lowercase element <${elementName}> detected. Create platform-independent components: 1) Create next-vibe-ui/web/ui/${elementName}.tsx for web, 2) Create next-vibe-ui/native/ui/${elementName}.tsx for React Native, or 3) Use an existing component if available.`;
}

// Define the jsx-capitalization rule
const jsxCapitalizationRule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces the use of capitalized JSX components instead of lowercase HTML elements",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create(
    context: OxlintRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Check if file is in excluded path
    const isExcluded = isExcludedPath(context);

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
            message: getErrorMessage(elementName),
          });
        }
      },
    };
  },
};

// Export the plugin in ESLint-compatible format
export default {
  meta: {
    name: "oxlint-plugin-jsx-capitalization",
    version: "1.0.0",
  },
  rules: {
    "jsx-capitalization": jsxCapitalizationRule,
  },
};
