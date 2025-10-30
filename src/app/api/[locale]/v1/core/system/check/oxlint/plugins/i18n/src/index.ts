/**
 * Oxlint JS Plugin: i18n No Literal String
 *
 * Detects untranslated literal strings in JSX and code.
 */

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

// AST Node types
interface ASTNode {
  type: string;
  value?: string | number | boolean | null | ASTNode;
  name?: string | ASTNode;
}

// Rule context interface
interface RuleContext {
  options?: Array<I18nOptions>;
  report: (descriptor: { node: ASTNode; message: string }) => void;
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
  create(context: RuleContext): Record<string, (node: ASTNode) => void> {
    // Merge user options with defaults
    const userOptions = context.options?.[0] || {};
    const options: I18nOptions = {
      words: {
        exclude: [
          ...(userOptions.words?.exclude || []),
          "^[\\[\\]\\{\\}\\—\\<\\>\\•\\+\\%\\#\\@\\.\\:\\-\\_\\*\\;\\,\\/\\(\\)]+$",
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
          // Technical symbols and emoji used as UI elements
          "^[▶◀▲▼►◄▴▾►◄✅✕✔✓🔧]+$",
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

    // Convert string patterns to RegExp
    const wordExclusionPatterns = (options.words?.exclude || []).map(
      (pattern: string) => new RegExp(pattern)
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
      JSXText(node: ASTNode): void {
        const value = node.value;
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
      "JSXExpressionContainer > Literal"(node: ASTNode): void {
        const value = node.value;
        if (typeof value === "string" && !shouldExcludeString(value)) {
          context.report({
            node,
            message: `Literal string "${value}" in JSX expression should be translated.`,
          });
        }
      },

      // JSX Attribute values
      JSXAttribute(node: ASTNode): void {
        // Access as any to get the actual AST structure from oxlint
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nameNode = (node as any).name;
        if (!nameNode) {
          return;
        }

        // Get the attribute name string - in JSX AST, name.name is the identifier
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrName: string = (nameNode as any).name || String(nameNode);

        // Skip ALL excluded attributes (className, href, etc.) - these contain non-translatable values
        if (isExcludedAttribute(attrName)) {
          return;
        }

        // For non-excluded attributes, check if the value is a literal string that should be translated
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valueNode = (node as any).value;
        if (!valueNode) {
          return;
        }

        if (valueNode.type === "Literal") {
          const literalValue = valueNode.value;
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
