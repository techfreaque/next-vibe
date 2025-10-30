import { defineRule } from "oxlint";

const rule = defineRule({
    meta: {
        docs: { description: "Restricted syntax for TS and JSX-in-object checks" }
    },
    createOnce(context) {
        const isIconKey = (prop: any): boolean => {
            if (prop?.type !== "Property" || prop.computed) return false;
            const key = prop.key;
            if (key?.type === "Identifier") return key.name === "icon";
            if (key?.type === "Literal" && typeof key.value === "string")
                return key.value === "icon";
            return false;
        };

        const report = (node: any, message: string) => {
            context.report({ node, message });
        };

        const isJSX = (n: any) =>
            n && (n.type === "JSXElement" || n.type === "JSXFragment");

        const unwrapParen = (n: any): any => {
            let cur = n;
            while (cur?.type === "ParenthesizedExpression") {
                cur = cur.expression;
            }
            return cur;
        };

        return {
            TSUnknownKeyword(node: any) {
                report(
                    node,
                    "Usage of the 'unknown' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                );
            },

            TSObjectKeyword(node: any) {
                report(
                    node,
                    "Usage of the 'object' type isn't allowed. Consider using generics with interface or type alias for explicit structure."
                );
            },

            ThrowStatement(node: any) {
                report(
                    node,
                    "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead."
                );
            },

            // Match properties whose value is JSX, excluding key === "icon".
            Property(node: any) {
                if (isIconKey(node)) return;

                const value = node.value;
                if (!value) return;

                // Direct JSX
                if (isJSX(value)) {
                    report(
                        value,
                        "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly."
                    );
                    return;
                }

                // Parenthesized -> JSX
                if (value.type === "ParenthesizedExpression") {
                    const inner = unwrapParen(value);
                    if (isJSX(inner)) {
                        report(
                            inner,
                            "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly."
                        );
                    }
                }
            }
        };
    }
});

export default {
    meta: { name: "oxlint-plugin-restricted" },
    rules: {
        "restricted-syntax": rule
    }
};