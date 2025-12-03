/**
 * Oxlint Configuration Types
 * Moved from root config for better organization
 */
export type Severity = "off" | "warn" | "error" | "allow" | "deny";
/**
 * Oxlint AST Node Types
 * These types define the structure of AST nodes for Oxlint plugin development
 */
export interface OxlintASTNode {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export interface JSXIdentifier extends OxlintASTNode {
  type: "JSXIdentifier" | "Identifier";
  name: string;
}
export interface JSXLiteral extends OxlintASTNode {
  type: "Literal";
  value: string | number | boolean | null;
}
export interface JSXAttribute extends OxlintASTNode {
  type: "JSXAttribute";
  name: JSXIdentifier;
  value?: JSXLiteral | OxlintASTNode;
}
export interface JSXText extends OxlintASTNode {
  type: "JSXText";
  value: string;
}
export interface Property extends OxlintASTNode {
  type: "Property";
  key?: OxlintASTNode;
  value?: OxlintASTNode;
  computed?: boolean;
  method?: boolean;
}
export interface TSUnknownKeyword extends OxlintASTNode {
  type: "TSUnknownKeyword";
}
export interface TSObjectKeyword extends OxlintASTNode {
  type: "TSObjectKeyword";
}
export interface ThrowStatement extends OxlintASTNode {
  type: "ThrowStatement";
  argument?: OxlintASTNode;
}
export interface ParenthesizedExpression extends OxlintASTNode {
  type: "ParenthesizedExpression";
  expression?: OxlintASTNode;
}
export interface OxlintComment {
  type: "Line" | "Block";
  value: string;
}
export interface OxlintRuleContext {
  report: (descriptor: { node: OxlintASTNode; message: string }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any[];
  getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
  getFilename?: () => string;
  filename?: string;
  sourceCode?: {
    getCommentsBefore?: (node: OxlintASTNode) => OxlintComment[];
    getCommentsInside?: (node: OxlintASTNode) => OxlintComment[];
  };
}
export declare function isJSXIdentifier(
  node: OxlintASTNode,
): node is JSXIdentifier;
export declare function isJSXLiteral(node: OxlintASTNode): node is JSXLiteral;
export declare function isProperty(node: OxlintASTNode): node is Property;
export interface OxlintLabel {
  span: {
    offset: number;
    length: number;
    line: number;
    column: number;
  };
  message?: string;
}
export interface OxlintConfig {
  $schema?: string;
  plugins?: string[];
  jsPlugins?: string[];
  categories?: {
    correctness?: Severity;
    suspicious?: Severity;
    pedantic?: Severity;
    style?: Severity;
    nursery?: Severity;
    restriction?: Severity;
  };
  rules?: LintConfigElement;
  settings?: {
    "jsx-a11y"?: {
      polymorphicPropName?: string | null;
      components?: Record<string, string>;
      attributes?: Record<string, string>;
    };
    next?: {
      rootDir?: string[];
    };
    react?: {
      formComponents?: string[];
      linkComponents?: string[];
    };
    jsdoc?: {
      ignorePrivate?: boolean;
      ignoreInternal?: boolean;
      ignoreReplacesDocs?: boolean;
      overrideReplacesDocs?: boolean;
      augmentsExtendsReplacesDocs?: boolean;
      implementsReplacesDocs?: boolean;
      exemptDestructuredRootsFromChecks?: boolean;
      tagNamePreference?: Record<string, string>;
    };
  };
  env?: {
    builtin?: boolean;
  };
  globals?: Record<string, "readonly" | "writable" | "off">;
  ignorePatterns?: string[];
}
/**
 * Prettier Configuration
 * Aligned with project formatting standards
 */
export interface PrettierConfig {
  semi: boolean;
  singleQuote: boolean;
  trailingComma: "none" | "es5" | "all";
  tabWidth: number;
  useTabs: boolean;
  printWidth: number;
  arrowParens: "avoid" | "always";
  endOfLine: "lf" | "crlf" | "cr" | "auto";
  bracketSpacing: boolean;
  jsxSingleQuote: boolean;
  jsxBracketSameLine: boolean;
  proseWrap: "always" | "never" | "preserve";
}
type LintPrimitive = string | number | boolean;
type LintConfigValue =
  | LintPrimitive
  | LintPrimitive[]
  | LintConfigObject
  | LintConfigObject[]
  | (LintPrimitive | LintConfigObject)[];
interface LintConfigObject {
  [key: string]: LintConfigValue;
}
type LintConfigElement = Record<string, LintConfigValue>;
/**
 * ESLint Configuration
 * For import sorting, React hooks, and custom AST rules that oxlint doesn't support
 * i18n is now handled by oxlint JS plugin
 */
export interface EslintConfig {
  ignores: string[];
  files: string[];
  eslintOnlyRules: LintConfigElement;
  ruleOverrides: LintConfigElement;
  parserOptions: {
    project: string;
    tsconfigRootDir: string;
  };
}
/**
 * Combined configuration for oxlint + prettier + eslint
 */
export interface OxlintPrettierConfig {
  oxlint: OxlintConfig;
  prettier: PrettierConfig;
}
/**
 * Combined configuration for oxlint + prettier + eslint
 */
export interface OxlintPrettierEslintConfig {
  oxlint: OxlintConfig;
  eslint: EslintConfig;
  prettier: PrettierConfig;
}
//# sourceMappingURL=types.d.ts.map
