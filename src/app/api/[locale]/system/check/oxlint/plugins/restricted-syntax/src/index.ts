/**
 * Oxlint JS Plugin: Restricted Syntax
 *
 * Enforces custom syntax restrictions:
 * - No `unknown` type
 * - No `object` type
 * - No `throw` statements
 * - No JSX in object literals (except for common React node properties like content, icon, title, etc.)
 * - No unused variables (custom message: "Either use it or remove it")
 */

// Type definitions for Oxlint AST nodes
interface BaseASTNode {
  type: string;
  parent?: OxlintASTNode;
}

interface Identifier extends BaseASTNode {
  type: "Identifier";
  name: string;
}

interface Literal extends BaseASTNode {
  type: "Literal";
  value: string | number | boolean | null;
  raw?: string;
}

interface JSXElement extends BaseASTNode {
  type: "JSXElement";
}

interface JSXFragment extends BaseASTNode {
  type: "JSXFragment";
}

interface Property extends BaseASTNode {
  type: "Property";
  key?: OxlintASTNode;
  value?: OxlintASTNode;
  computed?: boolean;
  method?: boolean;
  shorthand?: boolean;
}

interface ParenthesizedExpression extends BaseASTNode {
  type: "ParenthesizedExpression";
  expression?: OxlintASTNode;
}

interface VariableDeclarator extends BaseASTNode {
  type: "VariableDeclarator";
  id?: OxlintASTNode;
  init?: OxlintASTNode;
}

interface FunctionDeclaration extends BaseASTNode {
  type: "FunctionDeclaration";
  id?: Identifier;
  params?: OxlintASTNode[];
  body?: OxlintASTNode;
}

interface ArrowFunctionExpression extends BaseASTNode {
  type: "ArrowFunctionExpression";
  params?: OxlintASTNode[];
  body?: OxlintASTNode;
}

interface FunctionExpression extends BaseASTNode {
  type: "FunctionExpression";
  id?: Identifier;
  params?: OxlintASTNode[];
  body?: OxlintASTNode;
}

interface CatchClause extends BaseASTNode {
  type: "CatchClause";
  param?: OxlintASTNode;
  body?: OxlintASTNode;
}

interface MemberExpression extends BaseASTNode {
  type: "MemberExpression";
  object?: OxlintASTNode;
  property?: OxlintASTNode;
  computed?: boolean;
}

interface ImportSpecifier extends BaseASTNode {
  type: "ImportSpecifier";
  imported?: Identifier;
  local?: Identifier;
}

interface ImportDefaultSpecifier extends BaseASTNode {
  type: "ImportDefaultSpecifier";
  local?: Identifier;
}

interface ImportNamespaceSpecifier extends BaseASTNode {
  type: "ImportNamespaceSpecifier";
  local?: Identifier;
}

interface ClassDeclaration extends BaseASTNode {
  type: "ClassDeclaration";
  id?: Identifier;
}

interface RestElement extends BaseASTNode {
  type: "RestElement";
  argument?: OxlintASTNode;
}

interface ArrayPattern extends BaseASTNode {
  type: "ArrayPattern";
  elements?: (OxlintASTNode | null)[];
}

interface ObjectPattern extends BaseASTNode {
  type: "ObjectPattern";
  properties?: OxlintASTNode[];
}

interface AssignmentPattern extends BaseASTNode {
  type: "AssignmentPattern";
  left?: OxlintASTNode;
  right?: OxlintASTNode;
}

interface ExportSpecifier extends BaseASTNode {
  type: "ExportSpecifier";
  local?: Identifier;
  exported?: Identifier;
}

interface MethodDefinition extends BaseASTNode {
  type: "MethodDefinition";
  key?: OxlintASTNode;
  value?: OxlintASTNode;
}

interface TSTypeReference extends BaseASTNode {
  type: "TSTypeReference";
  typeName?: OxlintASTNode;
}

interface TSInterfaceDeclaration extends BaseASTNode {
  type: "TSInterfaceDeclaration";
  id?: Identifier;
}

interface TSTypeAliasDeclaration extends BaseASTNode {
  type: "TSTypeAliasDeclaration";
  id?: Identifier;
}

interface TSEnumDeclaration extends BaseASTNode {
  type: "TSEnumDeclaration";
  id?: Identifier;
}

interface TSModuleDeclaration extends BaseASTNode {
  type: "TSModuleDeclaration";
  id?: Identifier;
}

type OxlintASTNode =
  | BaseASTNode
  | Identifier
  | Literal
  | JSXElement
  | JSXFragment
  | Property
  | ParenthesizedExpression
  | VariableDeclarator
  | FunctionDeclaration
  | ArrowFunctionExpression
  | FunctionExpression
  | CatchClause
  | MemberExpression
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ClassDeclaration
  | RestElement
  | ArrayPattern
  | ObjectPattern
  | AssignmentPattern
  | ExportSpecifier
  | MethodDefinition
  | TSTypeReference
  | TSInterfaceDeclaration
  | TSTypeAliasDeclaration
  | TSEnumDeclaration
  | TSModuleDeclaration;

interface OxlintComment {
  type: "Line" | "Block";
  value: string;
}

type RuleOption =
  | string
  | number
  | boolean
  | Record<string, string | number | boolean>;

interface OxlintRuleContext {
  report: (descriptor: { node: OxlintASTNode; message: string }) => void;
  options?: RuleOption[];
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

// Helper functions for type checking and node traversal
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

  return false;
}

function hasDisableComment(
  context: OxlintRuleContext,
  node: OxlintASTNode,
): boolean {
  // Try to get comments from context
  const getComments =
    context.getCommentsBefore || context.sourceCode?.getCommentsBefore;
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

function isObjectProperty(prop: OxlintASTNode): prop is Property {
  return isProperty(prop);
}

/**
 * Properties that commonly accept JSX/React nodes as values
 * These are allowed to have JSX in object literals
 */
const JSX_ALLOWED_PROPERTIES = new Set([
  "icon",
  "content",
  "title",
  "description",
  "children",
  "header",
  "footer",
  "element",
  "component",
  "label",
  "placeholder",
  "tooltip",
  "badge",
  "prefix",
  "suffix",
  "startAdornment",
  "endAdornment",
  "emptyState",
  "fallback",
]);

/**
 * Check if a property key is in the allowlist for JSX values
 */
function isJSXAllowedKey(prop: OxlintASTNode): boolean {
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

  return keyName !== null && JSX_ALLOWED_PROPERTIES.has(keyName);
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

function getRestrictedSyntaxtMessage(type: string): string {
  return `Usage of the '${type}' type isn't allowed. Consider using the inferred types from the unified interface system based on definition.ts`;
}

// ============================================================
// Unused Variables Detection
// ============================================================

interface VariableInfo {
  name: string;
  node: OxlintASTNode;
  isParam: boolean;
  isImport: boolean;
  isType: boolean;
}

/**
 * Extract identifiers from a pattern (handles destructuring)
 */
function extractIdentifiersFromPattern(
  pattern: OxlintASTNode,
  isParam: boolean,
  isImport: boolean,
): VariableInfo[] {
  const identifiers: VariableInfo[] = [];

  if (!pattern) {
    return identifiers;
  }

  switch (pattern.type) {
    case "Identifier": {
      const id = pattern as Identifier;
      identifiers.push({ name: id.name, node: pattern, isParam, isImport, isType: false });
      break;
    }
    case "ObjectPattern": {
      const objPattern = pattern as ObjectPattern;
      for (const prop of objPattern.properties || []) {
        if (prop.type === "Property") {
          const p = prop as Property;
          if (p.value) {
            identifiers.push(
              ...extractIdentifiersFromPattern(p.value, isParam, isImport),
            );
          }
        } else if (prop.type === "RestElement") {
          const rest = prop as RestElement;
          if (rest.argument) {
            identifiers.push(
              ...extractIdentifiersFromPattern(rest.argument, isParam, isImport),
            );
          }
        }
      }
      break;
    }
    case "ArrayPattern": {
      const arrPattern = pattern as ArrayPattern;
      for (const element of arrPattern.elements || []) {
        if (element) {
          identifiers.push(
            ...extractIdentifiersFromPattern(element, isParam, isImport),
          );
        }
      }
      break;
    }
    case "RestElement": {
      const rest = pattern as RestElement;
      if (rest.argument) {
        identifiers.push(
          ...extractIdentifiersFromPattern(rest.argument, isParam, isImport),
        );
      }
      break;
    }
    case "AssignmentPattern": {
      const assign = pattern as AssignmentPattern;
      if (assign.left) {
        identifiers.push(
          ...extractIdentifiersFromPattern(assign.left, isParam, isImport),
        );
      }
      break;
    }
  }

  return identifiers;
}

// Define the restricted-syntax rule
const restrictedSyntaxRule: RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces restricted syntax patterns (no unknown, object, throw, JSX in non-React-node properties, unused variables)",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create(
    context: OxlintRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Check if file is in allowed path (applies to all rules)
    const isAllowed = isAllowedPath(context);

    // Track declared variables and their usages for unused var detection
    const declaredVars = new Map<string, VariableInfo>();
    const usedVars = new Set<string>();
    // Track variables in declaration context to avoid marking them as used
    const inDeclarationContext = new Set<string>();

    /**
     * Register a variable declaration
     */
    function declareVariable(info: VariableInfo): void {
      // Don't track variables starting with underscore (intentionally unused)
      // Actually, we DO want to track them and report them with our message
      declaredVars.set(info.name, info);
      inDeclarationContext.add(info.name);
      // Remove from context after this "tick"
      setTimeout(() => inDeclarationContext.delete(info.name), 0);
    }

    /**
     * Mark a variable as used
     */
    function useVariable(name: string): void {
      usedVars.add(name);
    }

    return {
      // ============================================================
      // Original restricted syntax rules
      // ============================================================
      TSUnknownKeyword(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: getRestrictedSyntaxtMessage("unknown"),
        });
      },

      TSObjectKeyword(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message: getRestrictedSyntaxtMessage("object"),
        });
      },

      ThrowStatement(node: OxlintASTNode): void {
        if (isAllowed || hasDisableComment(context, node)) {
          return;
        }
        context.report({
          node,
          message:
            "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead.",
        });
      },

      Property(node: OxlintASTNode): void {
        // Only process ObjectProperty nodes
        if (!isObjectProperty(node)) {
          return;
        }

        // Skip properties that are allowed to have JSX values
        if (isJSXAllowedKey(node)) {
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
            message:
              "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
          });
          return;
        }

        // Check for parenthesized JSX
        if (value.type === "ParenthesizedExpression") {
          const inner = unwrapParen(value);
          if (isJSX(inner)) {
            context.report({
              node: inner,
              message:
                "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
            });
          }
        }

        // Handle shorthand property - it's also a usage
        if (property.shorthand && property.key?.type === "Identifier") {
          useVariable((property.key as Identifier).name);
        }
      },

      // ============================================================
      // Unused variables detection - Declaration tracking
      // ============================================================
      VariableDeclarator(node: OxlintASTNode): void {
        const decl = node as VariableDeclarator;
        if (decl.id) {
          const vars = extractIdentifiersFromPattern(decl.id, false, false);
          for (const v of vars) {
            declareVariable(v);
          }
        }
      },

      FunctionDeclaration(node: OxlintASTNode): void {
        const fn = node as FunctionDeclaration;
        // Function name is declared
        if (fn.id) {
          declareVariable({ name: fn.id.name, node: fn.id, isParam: false, isImport: false, isType: false });
        }
        // Parameters are declared
        for (const param of fn.params || []) {
          const vars = extractIdentifiersFromPattern(param, true, false);
          for (const v of vars) {
            declareVariable(v);
          }
        }
      },

      ArrowFunctionExpression(node: OxlintASTNode): void {
        const fn = node as ArrowFunctionExpression;
        for (const param of fn.params || []) {
          const vars = extractIdentifiersFromPattern(param, true, false);
          for (const v of vars) {
            declareVariable(v);
          }
        }
      },

      FunctionExpression(node: OxlintASTNode): void {
        const fn = node as FunctionExpression;
        // Named function expression - name is only available inside
        if (fn.id) {
          declareVariable({ name: fn.id.name, node: fn.id, isParam: false, isImport: false, isType: false });
        }
        for (const param of fn.params || []) {
          const vars = extractIdentifiersFromPattern(param, true, false);
          for (const v of vars) {
            declareVariable(v);
          }
        }
      },

      CatchClause(node: OxlintASTNode): void {
        const clause = node as CatchClause;
        if (clause.param) {
          const vars = extractIdentifiersFromPattern(clause.param, true, false);
          for (const v of vars) {
            declareVariable(v);
          }
        }
      },

      ImportSpecifier(node: OxlintASTNode): void {
        const spec = node as ImportSpecifier;
        if (spec.local) {
          declareVariable({ name: spec.local.name, node: spec.local, isParam: false, isImport: true, isType: false });
        }
      },

      ImportDefaultSpecifier(node: OxlintASTNode): void {
        const spec = node as ImportDefaultSpecifier;
        if (spec.local) {
          declareVariable({ name: spec.local.name, node: spec.local, isParam: false, isImport: true, isType: false });
        }
      },

      ImportNamespaceSpecifier(node: OxlintASTNode): void {
        const spec = node as ImportNamespaceSpecifier;
        if (spec.local) {
          declareVariable({ name: spec.local.name, node: spec.local, isParam: false, isImport: true, isType: false });
        }
      },

      ClassDeclaration(node: OxlintASTNode): void {
        const cls = node as ClassDeclaration;
        if (cls.id) {
          declareVariable({ name: cls.id.name, node: cls.id, isParam: false, isImport: false, isType: false });
        }
      },

      // TypeScript declarations
      TSInterfaceDeclaration(node: OxlintASTNode): void {
        const decl = node as TSInterfaceDeclaration;
        if (decl.id) {
          declareVariable({ name: decl.id.name, node: decl.id, isParam: false, isImport: false, isType: true });
        }
      },

      TSTypeAliasDeclaration(node: OxlintASTNode): void {
        const decl = node as TSTypeAliasDeclaration;
        if (decl.id) {
          declareVariable({ name: decl.id.name, node: decl.id, isParam: false, isImport: false, isType: true });
        }
      },

      TSEnumDeclaration(node: OxlintASTNode): void {
        const decl = node as TSEnumDeclaration;
        if (decl.id) {
          declareVariable({ name: decl.id.name, node: decl.id, isParam: false, isImport: false, isType: false });
        }
      },

      // ============================================================
      // Unused variables detection - Usage tracking
      // ============================================================
      Identifier(node: OxlintASTNode): void {
        const id = node as Identifier;
        const parent = id.parent;

        // Skip if in declaration context
        if (inDeclarationContext.has(id.name)) {
          return;
        }

        // Skip property keys in member expressions (obj.foo - foo is not a var reference)
        if (parent?.type === "MemberExpression") {
          const member = parent as MemberExpression;
          if (member.property === node && !member.computed) {
            return;
          }
        }

        // Skip property keys in object properties (unless shorthand)
        if (parent?.type === "Property") {
          const prop = parent as Property;
          if (prop.key === node && !prop.shorthand && !prop.computed) {
            return;
          }
        }

        // Skip if this is a variable declarator id
        if (parent?.type === "VariableDeclarator") {
          const decl = parent as VariableDeclarator;
          if (decl.id === node) {
            return;
          }
        }

        // Skip function/class declaration names
        if (
          parent?.type === "FunctionDeclaration" ||
          parent?.type === "FunctionExpression" ||
          parent?.type === "ClassDeclaration"
        ) {
          return;
        }

        // Skip import specifiers
        if (
          parent?.type === "ImportSpecifier" ||
          parent?.type === "ImportDefaultSpecifier" ||
          parent?.type === "ImportNamespaceSpecifier"
        ) {
          return;
        }

        // Skip method definition keys
        if (parent?.type === "MethodDefinition") {
          const method = parent as MethodDefinition;
          if (method.key === node) {
            return;
          }
        }

        // Skip export specifier locals (they are re-exports, not usages)
        if (parent?.type === "ExportSpecifier") {
          const spec = parent as ExportSpecifier;
          if (spec.local === node) {
            // Actually this IS a usage - we're exporting something
            useVariable(id.name);
            return;
          }
        }

        // This is a usage
        useVariable(id.name);
      },

      // Type references count as usage
      TSTypeReference(node: OxlintASTNode): void {
        const ref = node as TSTypeReference;
        if (ref.typeName?.type === "Identifier") {
          useVariable((ref.typeName as Identifier).name);
        }
      },

      // ============================================================
      // Report unused variables at program exit
      // ============================================================
      "Program:exit"(): void {
        if (isAllowed) {
          return;
        }

        for (const [name, info] of declaredVars) {
          if (!usedVars.has(name)) {
            // Skip React (commonly imported but used via JSX)
            if (name === "React") {
              continue;
            }

            context.report({
              node: info.node,
              message: `'${name}' is unused. Either use it or remove it.`,
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
    name: "oxlint-plugin-restricted",
    version: "1.0.0",
  },
  rules: {
    "restricted-syntax": restrictedSyntaxRule,
  },
};
