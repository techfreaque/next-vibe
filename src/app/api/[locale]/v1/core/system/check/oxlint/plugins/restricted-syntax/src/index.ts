/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions:
 * - No `unknown` type
 * - No `object` type
 * - No `throw` statements
 * - No JSX in object literals (except icon property)
 */

// Type definitions for Oxlint AST nodes
interface OxlintASTNode {
  type: string;
  [key: string]: unknown;
}

interface Property extends OxlintASTNode {
  type: "Property";
  key?: OxlintASTNode;
  value?: OxlintASTNode;
  computed?: boolean;
  method?: boolean;
}

interface ParenthesizedExpression extends OxlintASTNode {
  type: "ParenthesizedExpression";
  expression?: OxlintASTNode;
}

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
  create: (context: OxlintRuleContext) => Record<string, (node: OxlintASTNode) => void>;
}

// Helper functions for type checking and node traversal
/**
 * Type guard to check if a node is a Property node
 */
function isProperty(node: OxlintASTNode): node is Property {
  return node.type === "Property" && typeof (node as Property).method === "boolean";
}
/**
 * Check if the current file is in an allowed path where restricted syntax is permitted
 */
function isAllowedPath(context: OxlintRuleContext): boolean {
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

    // Allow unified-interface system code (infrastructure)
    if (normalizedPath.includes("/core/system/unified-interface/")) {
        return true;
    }

    // Allow oxlint plugins (infrastructure)
    if (normalizedPath.includes("/core/system/check/oxlint/plugins/")) {
        return true;
    }

    return false;
}

function hasDisableComment(context: OxlintRuleContext, node: OxlintASTNode): boolean {
    // Try to get comments from context
    const getComments = context.getCommentsBefore || context.sourceCode?.getCommentsBefore;
    if (typeof getComments !== "function") {
        // If comment API is not available, allow the node (fail open)
        return false;
    }

    try {
        const comments = getComments(node);
        if (!comments || !Array.isArray(comments)) {
            return false;
        }

        // Check if any preceding comment contains eslint-disable or oxlint-disable for restricted-syntax or no-restricted-syntax
        for (const comment of comments) {
            if (!comment || typeof comment.value !== "string") {
                continue;
            }
            const commentText = comment.value.trim();
            // Check for eslint-disable-next-line or oxlint-disable-next-line with restricted-syntax or no-restricted-syntax
            if (
                (commentText.includes("eslint-disable-next-line") || commentText.includes("oxlint-disable-next-line")) &&
                (commentText.includes("restricted-syntax") || commentText.includes("no-restricted-syntax"))
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

function isObjectProperty(prop: OxlintASTNode): prop is Property {
    return isProperty(prop);
}

function isIconKey(prop: OxlintASTNode): boolean {
    const property = prop as Property;
    if (property.computed) {
        return false;
    }
    const key = property.key;
    if (!key) {
        return false;
    }
    if (key.type === "Identifier") {
        return (key as { name?: string }).name === "icon";
    }
    if (key.type === "Literal" && typeof (key as { value?: unknown }).value === "string") {
        return (key as { value?: string }).value === "icon";
    }
    return false;
}

function isJSX(n: OxlintASTNode): boolean {
    return n && (n.type === "JSXElement" || n.type === "JSXFragment");
}

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

// Define the restricted-syntax rule
const restrictedSyntaxRule: RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforces restricted syntax patterns (no unknown, object, throw, JSX in objects)",
            category: "Best Practices",
            recommended: true
        },
        schema: []
    },
    create(context: OxlintRuleContext): Record<string, (node: OxlintASTNode) => void> {
        // Check if file is in allowed path (applies to all rules)
        const isAllowed = isAllowedPath(context);

        return {
            TSUnknownKeyword(node: OxlintASTNode): void {
                if (isAllowed || hasDisableComment(context, node)) {
                    return;
                }
                context.report({
                    node,
                    message: "Usage of the 'unknown' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                });
            },

            TSObjectKeyword(node: OxlintASTNode): void {
                if (isAllowed || hasDisableComment(context, node)) {
                    return;
                }
                context.report({
                    node,
                    message: "Usage of the 'object' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                });
            },

            ThrowStatement(node: OxlintASTNode): void {
                if (isAllowed || hasDisableComment(context, node)) {
                    return;
                }
                context.report({
                    node,
                    message: "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead."
                });
            },

            Property(node: OxlintASTNode): void {
                // Only process ObjectProperty nodes
                if (!isObjectProperty(node)) {
                    return;
                }

                // Skip icon property
                if (isIconKey(node)) {
                    return;
                }

                const property = node as Property;
                const value = property.value;

                if (!value || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
                    return;
                }

                // Check for direct JSX
                if (isJSX(value)) {
                    context.report({
                        node: value,
                        message: "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly."
                    });
                    return;
                }

                // Check for parenthesized JSX
                if (value.type === "ParenthesizedExpression") {
                    const inner = unwrapParen(value);
                    if (isJSX(inner)) {
                        context.report({
                            node: inner,
                            message: "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly."
                        });
                    }
                }
            }
        };
    }
};

// Export the plugin in ESLint-compatible format
export default {
    meta: {
        name: "oxlint-plugin-restricted",
        version: "1.0.0"
    },
    rules: {
        "restricted-syntax": restrictedSyntaxRule
    }
};