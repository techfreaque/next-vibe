/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions:
 * - No `unknown` type
 * - No `object` type
 * - No `throw` statements
 * - No JSX in object literals (except icon property)
 */
interface ASTNode {
  type: string;
  value?: string | number | boolean | null | ASTNode;
  name?: string;
  computed?: boolean;
  key?: ASTNode;
  expression?: ASTNode;
  method?: boolean;
}

interface RuleContext {
  report: (descriptor: { node: ASTNode; message: string }) => void;
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
  create: (context: RuleContext) => Record<string, (node: ASTNode) => void>;
}

// Helper functions for type checking and node traversal
function isObjectProperty(prop: ASTNode): boolean {
    return prop.type === "Property" && prop.method !== undefined && typeof prop.method === "boolean";
}

function isIconKey(prop: ASTNode): boolean {
    if (prop.computed) {
        return false;
    }
    const key = prop.key;
    if (!key) {
        return false;
    }
    if (key.type === "Identifier") {
        return key.name === "icon";
    }
    if (key.type === "Literal" && typeof key.value === "string") {
        return key.value === "icon";
    }
    return false;
}

function isJSX(n: ASTNode): boolean {
    return n && (n.type === "JSXElement" || n.type === "JSXFragment");
}

function unwrapParen(n: ASTNode): ASTNode {
    let cur = n;
    while (cur?.type === "ParenthesizedExpression") {
        const expr = cur.expression;
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
    create(context: RuleContext): Record<string, (node: ASTNode) => void> {
        return {
            TSUnknownKeyword(node: ASTNode): void {
                context.report({
                    node,
                    message: "Usage of the 'unknown' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                });
            },

            TSObjectKeyword(node: ASTNode): void {
                context.report({
                    node,
                    message: "Usage of the 'object' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                });
            },

            ThrowStatement(node: ASTNode): void {
                context.report({
                    node,
                    message: "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead."
                });
            },

            Property(node: ASTNode): void {
                // Only process ObjectProperty nodes
                if (!isObjectProperty(node)) {
                    return;
                }

                // Skip icon property
                if (isIconKey(node)) {
                    return;
                }

                const value = node.value;

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