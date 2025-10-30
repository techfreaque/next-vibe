/**
 * Oxlint Configuration Types
 * Moved from root config for better organization
 */

export type Severity = "off" | "warn" | "error" | "allow" | "deny";

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
  categories?: {
    correctness?: Severity;
    suspicious?: Severity;
    pedantic?: Severity;
    style?: Severity;
    nursery?: Severity;
    restriction?: Severity;
  };
  rules?: Record<string, Severity | [Severity, Record<string, string | number | boolean>]>;
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

/**
 * ESLint Configuration
 * For i18n checking and custom AST rules that oxlint doesn't support
 */
export interface EslintConfig {
  ignores: string[];
  files: string[];
  i18n: {
    enabled: boolean;
    config: {
      files: string[];
      ignores: string[];
      rules: Record<string, string | number | boolean | [string, Record<string, string | number | boolean>]>;
    };
  };
  customRules: Record<string, string | number | boolean | [string, Record<string, string | number | boolean>]>;
  ruleOverrides: Record<string, Record<string, string | number | boolean | [string, Record<string, string | number | boolean>]>>;
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
