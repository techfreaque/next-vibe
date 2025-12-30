/**
 * Unified Check Configuration Types
 *
 * Centralized type definitions for all code quality tools:
 * - Oxlint (fast Rust linter)
 * - Prettier (code formatting)
 * - TypeScript (type checking)
 * - Testing (vitest/jest)
 * - VSCode integration
 */

// ============================================================
// Common Types
// ============================================================

export type Severity = "off" | "warn" | "error" | "allow" | "deny";

export type LintPrimitive = string | number | boolean;

export type LintConfigValue =
  | LintPrimitive
  | LintPrimitive[]
  | readonly LintPrimitive[]
  | LintConfigObject
  | readonly LintConfigObject[]
  | LintConfigObject[]
  | (LintPrimitive | LintConfigObject)[]
  | readonly (LintPrimitive | LintConfigObject)[]
  | I18nPluginConfig;

export interface LintConfigObject {
  [key: string]: LintConfigValue;
}

export type LintConfigElement = Record<string, LintConfigValue>;

/** JSON-compatible value type for settings files */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

// Forward declaration for circular reference
export interface I18nPluginConfig {
  words?: {
    exclude?: readonly string[] | string[];
  };
  "jsx-attributes"?: {
    exclude?: readonly string[] | string[];
  };
  "object-properties"?: {
    exclude?: readonly string[] | string[];
  };
}

export interface RestrictedSyntaxPluginConfig {
  /** Properties that commonly accept JSX/React nodes as values */
  jsxAllowedProperties?: readonly string[] | string[];
}

export interface JsxCapitalizationPluginConfig {
  /** Paths to exclude from jsx-capitalization rule */
  excludedPaths?: readonly string[] | string[];
  /** File patterns to exclude (email templates, test files) */
  excludedFilePatterns?: readonly string[] | string[];
  /** Typography elements that should import from typography module */
  typographyElements?: readonly string[] | string[];
  /** Elements with dedicated component files */
  standaloneElements?: readonly string[] | string[];
  /** SVG elements that need platform-independent handling */
  svgElements?: readonly string[] | string[];
  /** Image-related elements */
  imageElements?: readonly string[] | string[];
  /** Common UI elements that should have wrapper components */
  commonUiElements?: readonly string[] | string[];
}

// ============================================================
// Oxlint Configuration
// ============================================================

/** JS plugin configuration with path and options */
export interface OxlintJsPlugin {
  /** Path to the JS plugin file (e.g., "next-vibe/src/.../plugin/src/index.ts") */
  path: string;
  /** Plugin options - will be used when oxlint supports options natively */
  options?:
    | I18nPluginConfig
    | RestrictedSyntaxPluginConfig
    | JsxCapitalizationPluginConfig
    | LintConfigElement;
}

/** Optional oxlint settings (shared between enabled/disabled) */
interface OxlintConfigOptions {
  $schema?: string;
  /** File patterns to ignore (globs) - resolves relative to config file */
  ignorePatterns?: string[];
  /** Built-in oxlint plugins (e.g., "react", "typescript", "jsx-a11y") */
  plugins?: string[];
  /** Custom JS plugins - string paths or objects with path+options for future oxlint native support */
  jsPlugins?: (string | OxlintJsPlugin)[];
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
}

/** Oxlint disabled - no other settings required */
interface OxlintConfigDisabled {
  enabled: false;
}

/** Oxlint enabled - required paths */
interface OxlintConfigEnabled extends OxlintConfigOptions {
  enabled: true;
  /** Path to generated oxlint config file */
  configPath: string;
  /** Path to cache directory for oxlint */
  cachePath: string;
  /** File extensions to lint (e.g., [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]) */
  lintableExtensions: string[];
}

export type OxlintConfig = OxlintConfigDisabled | OxlintConfigEnabled;

// ============================================================
// Prettier Configuration
// ============================================================

/** Optional prettier settings */
interface PrettierConfigOptions {
  semi?: boolean;
  singleQuote?: boolean;
  trailingComma?: "none" | "es5" | "all";
  tabWidth?: number;
  useTabs?: boolean;
  printWidth?: number;
  arrowParens?: "avoid" | "always";
  endOfLine?: "lf" | "crlf" | "cr" | "auto";
  bracketSpacing?: boolean;
  jsxSingleQuote?: boolean;
  jsxBracketSameLine?: boolean;
  proseWrap?: "always" | "never" | "preserve";
}

/** Prettier disabled */
interface PrettierConfigDisabled {
  enabled: false;
}

/** Prettier enabled - required config path */
interface PrettierConfigEnabled extends PrettierConfigOptions {
  enabled: true;
  /** Path to generated prettier/oxfmt config file */
  configPath: string;
}

export type PrettierConfig = PrettierConfigDisabled | PrettierConfigEnabled;

// ============================================================
// TypeScript/TypeCheck Configuration
// ============================================================

/** Typecheck disabled */
interface TypecheckConfigDisabled {
  enabled: false;
}

/** Typecheck enabled */
interface TypecheckConfigEnabled {
  enabled: true;
  /** Path to directory for tsbuildinfo cache files */
  cachePath: string;
  /** Use tsgo instead of tsc for type checking (default: false uses tsc) */
  useTsgo?: boolean;
}

export type TypecheckConfig = TypecheckConfigDisabled | TypecheckConfigEnabled;

// ============================================================
// ESLint Configuration
// ============================================================

/** ESLint flat config item */
export interface EslintFlatConfigItem {
  /** File patterns to match */
  files?: string[];
  /** Patterns to ignore */
  ignores?: string[];
  /** Language options including parser */
  languageOptions?: {
    parser?: EslintParser;
    parserOptions?: EslintParserOptions;
    ecmaVersion?: number | "latest";
    sourceType?: "module" | "script" | "commonjs";
    globals?: Record<string, "readonly" | "writable" | "off" | boolean>;
  };
  /** Linter options */
  linterOptions?: {
    reportUnusedDisableDirectives?: "off" | "warn" | "error" | boolean;
    noInlineConfig?: boolean;
  };
  /**
   * ESLint plugins - accepts any plugin shape.
   *
   * ESLint plugins have diverse type signatures across the ecosystem.
   * We use object type for compatibility with all plugin packages.
   */
  plugins?: Record<string, EslintPluginLike>;
  /** ESLint rules */
  rules?: LintConfigElement;
  /** Settings */
  settings?: LintConfigElement;
}

/**
 * ESLint plugin interface - accepts any valid plugin.
 *
 * ESLint plugins from different packages have incompatible types.
 * This is a structural interface that all plugins satisfy.
 */
export interface EslintPluginLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ESLint plugin types are too diverse
  rules?: Record<string, { create: (...args: any[]) => any }>;
}

/**
 * ESLint parser interface - accepts any valid parser.
 *
 * Parsers must have parseForESLint method that returns AST.
 */
export interface EslintParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Parser types vary across packages
  parseForESLint?: (...args: any[]) => { ast: any; scopeManager?: any };
}

/** ESLint parser options */
export interface EslintParserOptions {
  ecmaVersion?: number | "latest";
  sourceType?: "module" | "script" | "commonjs";
  ecmaFeatures?: {
    jsx?: boolean;
    globalReturn?: boolean;
    impliedStrict?: boolean;
  };
  project?: string | string[];
  tsconfigRootDir?: string;
  [key: string]: LintConfigValue | undefined;
}

/** ESLint parse result */
export interface EslintParseResult {
  ast?: LintConfigElement;
  services?: LintConfigElement;
  scopeManager?: LintConfigElement;
  visitorKeys?: LintConfigElement;
}

/** ESLint plugin interface - matches ESLint's Plugin type */
export interface EslintPlugin {
  rules?: Record<string, EslintRule>;
  configs?: Record<string, EslintPluginConfig>;
  processors?: Record<string, EslintProcessor>;
  meta?: EslintPluginMeta;
}

/** ESLint plugin metadata */
export interface EslintPluginMeta {
  name?: string;
  version?: string;
}

/** ESLint plugin config (shareable config) */
export interface EslintPluginConfig {
  plugins?: Record<string, EslintPlugin>;
  rules?: LintConfigElement;
  languageOptions?: LintConfigElement;
  settings?: LintConfigElement;
}

/** ESLint processor interface */
export interface EslintProcessor {
  preprocess?: (
    text: string,
    filename: string,
  ) => Array<string | { text: string; filename: string }>;
  postprocess?: (
    messages: LintConfigElement[][],
    filename: string,
  ) => LintConfigElement[];
  supportsAutofix?: boolean;
}

/** ESLint rule interface - matches ESLint's LooseRuleDefinition */
export type EslintRule = EslintRuleFunction | EslintRuleModule;

/** ESLint rule as a function */
export type EslintRuleFunction = (
  context: EslintRuleContext,
) => EslintRuleListener;

/** ESLint rule as a module with create function */
export interface EslintRuleModule {
  create: EslintRuleFunction;
  meta?: EslintRuleMeta;
}

/** ESLint rule context (simplified) */
export interface EslintRuleContext {
  report: (descriptor: EslintReportDescriptor) => void;
  options: LintConfigValue[];
  getSourceCode: () => EslintSourceCode;
  getFilename: () => string;
  getCwd: () => string;
}

/** ESLint report descriptor */
export interface EslintReportDescriptor {
  node?: LintConfigElement;
  message?: string;
  messageId?: string;
  data?: Record<string, string | number>;
  loc?: { line: number; column: number };
  fix?: (fixer: EslintFixer) => EslintFix | EslintFix[] | null;
  suggest?: EslintSuggestion[];
}

/** ESLint fixer */
export interface EslintFixer {
  insertTextAfter: (node: LintConfigElement, text: string) => EslintFix;
  insertTextBefore: (node: LintConfigElement, text: string) => EslintFix;
  remove: (node: LintConfigElement) => EslintFix;
  replaceText: (node: LintConfigElement, text: string) => EslintFix;
  replaceTextRange: (range: [number, number], text: string) => EslintFix;
}

/** ESLint fix */
export interface EslintFix {
  range: [number, number];
  text: string;
}

/** ESLint suggestion */
export interface EslintSuggestion {
  desc?: string;
  messageId?: string;
  data?: Record<string, string | number>;
  fix: (fixer: EslintFixer) => EslintFix | EslintFix[] | null;
}

/** ESLint source code */
export interface EslintSourceCode {
  getText: (node?: LintConfigElement) => string;
  getLines: () => string[];
  getAllComments: () => LintConfigElement[];
}

/** ESLint rule listener */
export interface EslintRuleListener {
  [selector: string]: ((node: LintConfigElement) => void) | undefined;
}

/** ESLint rule meta */
export interface EslintRuleMeta {
  type?: "problem" | "suggestion" | "layout";
  docs?: {
    description?: string;
    recommended?: boolean | "error" | "warn";
    url?: string;
  };
  fixable?: "code" | "whitespace";
  hasSuggestions?: boolean;
  schema?: LintConfigValue[];
  deprecated?: boolean;
  replacedBy?: string[];
  messages?: Record<string, string>;
}

/** Optional ESLint settings */
interface EslintConfigOptions {
  /** ESLint flat config array - directly used by eslint.config.mjs */
  flatConfig?: EslintFlatConfigItem[];
  /** Patterns to ignore */
  ignores?: string[];
}

/** ESLint disabled */
interface EslintConfigDisabled {
  enabled: false;
}

/** ESLint enabled - required paths */
interface EslintConfigEnabled extends EslintConfigOptions {
  enabled: true;
  /** Path to generated ESLint config file */
  configPath: string;
  /** Path to cache directory for ESLint */
  cachePath: string;
  /** File extensions to lint (e.g., [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]) */
  lintableExtensions: string[];
  /** Build flat config with plugins (called from eslint.config.mjs) */
  buildFlatConfig: (
    reactCompilerPlugin: EslintPluginLike,
    reactHooksPlugin: EslintPluginLike,
    simpleImportSortPlugin: EslintPluginLike,
    tseslint: { parser: EslintParser },
  ) => EslintFlatConfigItem[];
}

export type EslintConfig = EslintConfigDisabled | EslintConfigEnabled;

// ============================================================
// Testing Configuration
// ============================================================

/** Optional testing settings */
interface TestingConfigOptions {
  /** Command to run tests (default: "bunx vitest") */
  command?: string;
  /** Timeout for test runs in milliseconds */
  timeout?: number;
  /** Test file patterns */
  include?: string[];
  /** Patterns to exclude from testing */
  exclude?: string[];
  /** Coverage configuration */
  coverage?: {
    enabled?: boolean;
    provider?: "v8" | "istanbul";
    thresholds?: {
      lines?: number;
      branches?: number;
      functions?: number;
      statements?: number;
    };
  };
}

/** Testing disabled */
interface TestingConfigDisabled {
  enabled: false;
}

/** Testing enabled */
interface TestingConfigEnabled extends TestingConfigOptions {
  enabled: true;
}

export type TestingConfig = TestingConfigDisabled | TestingConfigEnabled;

// ============================================================
// VSCode Integration Configuration
// ============================================================

/** Optional VSCode settings */
interface VSCodeConfigOptions {
  /** Whether to auto-generate VSCode settings */
  autoGenerateSettings?: boolean;
  /** Path to VSCode settings file */
  settingsPath?: string;
  /** Custom VSCode settings to merge */
  settings?: {
    /** Oxc extension settings */
    oxc?: {
      enable?: boolean;
      lintRun?: "onSave" | "onType";
      configPath?: string;
      fmtConfigPath?: string;
      fmtExperimental?: boolean;
      typeAware?: boolean;
      traceServer?: "off" | "messages" | "verbose";
    };
    /** Editor settings */
    editor?: {
      formatOnSave?: boolean;
      defaultFormatter?: string;
      codeActionsOnSave?: Record<string, "explicit" | "always" | "never">;
    };
    /** TypeScript settings */
    typescript?: {
      validateEnable?: boolean;
      suggestAutoImports?: boolean;
      preferTypeOnlyAutoImports?: boolean;
      experimentalUseTsgo?: boolean;
    };
    /** File settings */
    files?: {
      eol?: "\n" | "\r\n";
      exclude?: Record<string, boolean>;
    };
    /** Search settings */
    search?: {
      exclude?: Record<string, boolean>;
    };
  };
}

/** VSCode disabled */
interface VSCodeConfigDisabled {
  enabled: false;
}

/** VSCode enabled */
interface VSCodeConfigEnabled extends VSCodeConfigOptions {
  enabled: true;
}

export type VSCodeConfig = VSCodeConfigDisabled | VSCodeConfigEnabled;

// ============================================================
// Feature Switches
// ============================================================

export interface FeatureSwitches {
  /** Enable i18n literal string checking */
  i18n?: boolean;
  /** Enable React-specific rules */
  react?: boolean;
  /** Enable accessibility rules (jsx-a11y) */
  accessibility?: boolean;
  /** Enable import rules */
  import?: boolean;
  /** Enable promise rules */
  promise?: boolean;
  /** Enable Node.js rules */
  node?: boolean;
  /** Enable pedantic rules (stricter checks) */
  pedantic?: boolean;
  /** Use tsgo instead of tsc for type checking */
  tsgo?: boolean;
}

// ============================================================
// Vibe Check Configuration
// ============================================================

/** Vibe Check defaults */
export interface VibeCheckConfig {
  /** Auto-fix issues (default: false) */
  fix?: boolean;
  /** Skip ESLint checks (default: false) */
  skipEslint?: boolean;
  /** Skip Oxlint checks (default: false) */
  skipOxlint?: boolean;
  /** Skip TypeScript checks (default: false) */
  skipTypecheck?: boolean;
  /** Timeout in seconds (default: 3600) */
  timeout?: number;
  /** Max issues to display per page (default: 200) */
  limit?: number;
  /** Max files to show in summary (default: 50) */
  maxFilesInSummary?: number;
}

// ============================================================
// Unified Check Configuration
// ============================================================

export interface CheckConfig {
  /** Oxlint linter configuration */
  oxlint: OxlintConfig;

  /** ESLint linter configuration (for rules oxlint doesn't support) */
  eslint: EslintConfig;

  /** Prettier formatter configuration */
  prettier: PrettierConfig;

  /** TypeScript type checking configuration */
  typecheck: TypecheckConfig;

  /** Testing configuration */
  testing?: TestingConfig;

  /** VSCode integration settings */
  vscode: VSCodeConfig;

  /** Vibe Check defaults */
  vibeCheck?: VibeCheckConfig;
}
