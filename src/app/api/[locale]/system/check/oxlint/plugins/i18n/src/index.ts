/**
 * Oxlint JS Plugin: i18n No Literal String
 *
 * Detects untranslated literal strings in JSX and code.
 */

import type {
  OxlintASTNode,
  OxlintRuleContext,
  JSXIdentifier,
  JSXLiteral,
  JSXAttribute,
} from "../../../types";

// Configuration options interface
interface I18nOptions {
  words?: {
    exclude?: string[];
  };
  "jsx-attributes"?: {
    exclude?: string[];
  };
  "object-properties"?: {
    exclude?: string[];
  };
}

// Extended rule context with i18n options
interface I18nRuleContext extends OxlintRuleContext {
  options?: I18nOptions[];
}

// Define the no-literal-string rule
const noLiteralStringRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow literal strings that should be internationalized",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          words: {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
          "jsx-attributes": {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
          "object-properties": {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    ],
  },
  create(
    context: I18nRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Merge user options with defaults
    const userOptions = context.options?.[0] || {};
    const options: I18nOptions = {
      words: {
        exclude: [
          ...(userOptions.words?.exclude || []),
          "^[-\\[\\]\\{\\}—<>•+%#@.:_*;,/() ]+$",
          "^\\s+$",
          "^\\d+$",
          "^[^\\s]+\\.[^\\s]+$",
          "\\.(?:jpe?g|png|svg|webp|gif|csv|json|xml|pdf)$",
          "^(?:https?://|/)[^\\s]*$",
          "^[#@]\\w+$",
          "^[a-z]+$",
          "^[a-z]+(?:[A-Z][a-zA-Z0-9]*)*$",
          "^[^\\s]+(?:-[^\\s]+)+$",
          "^[^\\s]+\\/(?:[^\\s]*)$",
          "^[A-Z]+(?:_[A-Z]+)*$",
          "^use (?:client|server|custom)$",
          "^&[a-z]+;$",
          // SVG path data
          "^[MmLlHhVvCcSsQqTtAaZz0-9\\s,.-]+$",
          // Technical symbols used as UI elements (NOT emojis - those should use icon components)
          "^[▶◀▲▼►◄▴▾►◄✅✕✔✓]+$",
          // CSS-like values with units
          "^[\\d\\s]+(?:px|em|rem|%|vh|vw|deg|rad)?(?:\\s+[\\d]+)*$",
          // url() notation
          "^url\\([^)]+\\)$",
          // transform functions
          "^(?:translate|rotate|scale|matrix|skew)\\([^)]+\\)$",
          // Keyboard key indicators
          "^(?:Esc|Enter|Tab|Shift|Ctrl|Alt|Cmd|Space|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|F\\d+)$",
          // Single/double character technical indicators
          "^[A-Z0-9]{1,2}$",
        ],
      },
      "jsx-attributes": {
        exclude: [
          ...(userOptions["jsx-attributes"]?.exclude || []),
          "className",
          "*ClassName",
          "id",
          "data-testid",
          "to",
          "href",
          "style",
          "target",
          "rel",
          "type",
          "src",
          // SVG attributes
          "viewBox",
          "d",
          "fill",
          "stroke",
          "transform",
          "gradientTransform",
          "gradientUnits",
          "cx",
          "cy",
          "r",
          "fx",
          "fy",
          "offset",
          "stopColor",
          "stopOpacity",
          "width",
          "height",
          "x",
          "y",
          "x1",
          "x2",
          "y1",
          "y2",
          "strokeWidth",
          "strokeLinecap",
          "strokeLinejoin",
          "fillRule",
          "clipRule",
          "opacity",
          "xmlns",
          "xmlnsXlink",
          // Accessibility attributes
          "aria-label",
          "aria-labelledby",
          "aria-describedby",
          "title",
          "placeholder",
        ],
      },
    };

    // Convert string patterns to RegExp with Unicode support
    const wordExclusionPatterns = (options.words?.exclude || []).map(
      (pattern: string) => new RegExp(pattern, "u"),
    );
    const excludedAttributes = options["jsx-attributes"]?.exclude || [];

    // Helper: Check if a string should be excluded
    const shouldExcludeString = (value: string): boolean => {
      if (!value || typeof value !== "string") {
        return true;
      }

      // Check all word exclusion patterns
      for (const pattern of wordExclusionPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }

      return false;
    };

    // Helper: Check if JSX attribute is excluded
    const isExcludedAttribute = (attrName: string): boolean => {
      return excludedAttributes.some((excluded: string) => {
        if (excluded.startsWith("*")) {
          return attrName.endsWith(excluded.slice(1));
        }
        return attrName === excluded;
      });
    };

    return {
      // JSX Text nodes
      JSXText(node: OxlintASTNode): void {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- AST node parsing: Node values from the parser are unknown until runtime type checking. This is standard for AST traversal.
        const value = (node as { value?: unknown }).value;
        if (typeof value !== "string") {
          return;
        }
        const trimmed = value.trim();

        if (trimmed && !shouldExcludeString(trimmed)) {
          context.report({
            node,
            message: `Literal string "${trimmed}" should be translated using i18n.`,
          });
        }
      },

      // String literals in JSX expressions
      "JSXExpressionContainer > Literal"(node: OxlintASTNode): void {
        const value = (node as JSXLiteral).value;
        if (typeof value === "string" && !shouldExcludeString(value)) {
          context.report({
            node,
            message: `Literal string "${value}" in JSX expression should be translated.`,
          });
        }
      },

      // JSX Attribute values
      JSXAttribute(node: OxlintASTNode): void {
        const attrNode = node as JSXAttribute;
        const nameNode = attrNode.name;

        if (!nameNode) {
          return;
        }

        // Get the attribute name string - properly typed now
        const attrName: string =
          (nameNode as JSXIdentifier).name || String(nameNode);

        // Skip ALL excluded attributes (className, href, etc.) - these contain non-translatable values
        if (isExcludedAttribute(attrName)) {
          return;
        }

        // For non-excluded attributes, check if the value is a literal string that should be translated
        const valueNode = attrNode.value;
        if (!valueNode) {
          return;
        }

        if (valueNode.type === "Literal") {
          const literalValue = (valueNode as JSXLiteral).value;
          if (
            typeof literalValue === "string" &&
            !shouldExcludeString(literalValue)
          ) {
            context.report({
              node: valueNode,
              message: `Literal string "${literalValue}" in JSX attribute should be translated.`,
            });
          }
        }
      },
    };
  },
};

// Export the plugin in ESLint-compatible format
export default {
  meta: {
    name: "oxlint-plugin-i18n",
    version: "1.0.0",
  },
  rules: {
    "no-literal-string": noLiteralStringRule,
  },
};
