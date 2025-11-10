/**
 * Oxlint Configuration Types
 * Moved from root config for better organization
 */
// Type guard helpers for AST nodes
export function isJSXIdentifier(node) {
  return node.type === "JSXIdentifier" || node.type === "Identifier";
}
export function isJSXLiteral(node) {
  return node.type === "Literal";
}
export function isProperty(node) {
  return node.type === "Property" && typeof node.method === "boolean";
}
//# sourceMappingURL=types.js.map
