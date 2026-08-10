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
  /** Disallow throw statements (default: true) */
  noThrow?: boolean;
  /** Disallow unknown type (default: true) */
  noUnknown?: boolean;
  /** Disallow object type (default: true) */
  noObjectType?: boolean;
  /** Disallow `as` type assertions, except `as const` (default: false — opt in via config) */
  noAsAssertion?: boolean;
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

export interface BoilerplatePluginConfig {
  /** Extra allowed import sources for route.ts beyond the built-in defaults */
  routeAllowedImports?: readonly string[] | string[];
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
    | BoilerplatePluginConfig
    | LintConfigElement;
}

/** Optional oxlint settings (shared between enabled/disabled) */
interface OxlintConfigOptions {
  $schema?: string;
  /** File patterns to ignore (globs) - resolves relative to config file */
  ignorePatterns?: string[];
  /** Extra ignore patterns applied only in non-extensive mode (pre-formatted for oxlint) */
  nonExtensiveIgnorePatterns?: string[];
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
  /**
   * Per-path rule overrides, passed to oxlint verbatim. Later entries win.
   *
   * `rules` only. This used to also declare `categories`, which oxlint rejects
   * outright — `unknown field 'categories', expected one of 'files', 'env',
   * 'globals', 'plugins', 'jsPlugins', 'rules'` — so the whole config fails to
   * parse and nothing lints. A category cannot be scoped to a path here; see
   * `strictPaths` for how that is done instead.
   */
  overrides?: Array<{
    files: string[];
    rules?: LintConfigElement;
  }>;
}

/** Oxlint disabled - no other settings required */
interface OxlintConfigDisabled {
  enabled: false;
}

/**
 * Where the rules named in `strictRules` are reported.
 *
 * The scoping cannot live in the oxlint config. oxlint has no way to set a
 * *category* for a subset of files — `overrides` takes `rules` only, and a
 * nested `.oxlintrc.json` is ignored whenever `-c` is passed, which the checker
 * always does. So every rule runs everywhere and the checker drops the strict
 * ones for files outside `include`.
 */
export interface StrictPathsConfig {
  /** Globs where strict issues are reported. Empty means nowhere. */
  include: string[];
  /** Globs that opt back out, even inside an `include`. Wins over `include`. */
  exclude?: string[];
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
  /** Where {@link strictRules} apply. Omitted means every rule is repo-wide. */
  strictPaths?: StrictPathsConfig;
  /**
   * The rules that only apply inside `strictPaths`. Everything else in `rules`
   * is enforced everywhere.
   *
   * Explicit rather than inferred: "we turned it on, so it must be strict" reads
   * well until it silences `no-explicit-any` in the code that needs it most.
   * Bare names match either spelling — `no-explicit-any` covers both
   * `typescript/no-explicit-any` and `typescript-eslint(no-explicit-any)`.
   */
  strictRules?: string[];
  /**
   * Tier 2: the untyped-value bans (`any`, `unknown`, `object`).
   *
   * Its own rule list AND its own {@link midPaths}, so it rolls out
   * independently of the tier-3 style set — erasing the type system is a
   * different and smaller problem, and a tree is usually ready for this long
   * before it is ready for the rest.
   */
  midRules?: string[];
  /**
   * The trees that get {@link midRules} but are not on `strictPaths` yet.
   *
   * ADDITIVE to `strictPaths`, never a copy of it: a strict path already
   * reports the mid rules, so repeating it here would be redundant. Omitted
   * means "no extra trees" — the mid rules then apply exactly where the strict
   * ones do.
   */
  midPaths?: StrictPathsConfig;
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
  /** Path to generated .prettierignore file for oxfmt --ignore-path */
  ignoreFilePath?: string;
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
  /**
   * compilerOptions forced on top of whatever tsconfig owns the files.
   *
   * A project's own tsconfig says how IT builds; this says how the repo is
   * checked, and the checker's job is the second one. A nested project that
   * sets `noImplicitAny: false` would otherwise opt itself out of the very rule
   * the check exists to enforce, and the run would report it clean. Overriding
   * here means a project cannot silence the checker by editing its own config.
   *
   * Applied everywhere. The counterpart of the oxlint `rules` block.
   */
  compilerOptions?: Record<string, boolean | string | string[]>;
  /**
   * compilerOptions forced only inside `oxlint.strictPaths`, or everywhere when
   * `strict` is requested. The counterpart of oxlint's strict rules.
   *
   * Unlike a lint rule, a compilerOption cannot be scoped to a subset of files —
   * it belongs to the whole program. So this is decided per run, from the target
   * being checked: point at a whitelisted tree and it applies; point elsewhere
   * and only `compilerOptions` does. A repo-wide run checks each project
   * separately, so each gets the answer for its own path.
   */
  strictCompilerOptions?: Record<string, boolean | string | string[]>;
  /**
   * compilerOptions forced inside `oxlint.midPaths` OR `oxlint.strictPaths`,
   * and everywhere under `--strict`. The typecheck counterpart of
   * `oxlint.midRules` — `noImplicitAny` is the same defect as `no-explicit-any`,
   * reached from the compiler instead of the linter, so it belongs in the same
   * tier.
   */
  midCompilerOptions?: Record<string, boolean | string | string[]>;
  /** Use tsgo instead of tsc for type checking (default: false uses tsc) */
  useTsgo?: boolean;
  /** Ignore patterns always applied regardless of extensive mode (glob patterns for tsconfig exclude) */
  ignorePatterns?: string[];
  /** Extra ignore patterns applied only in non-extensive mode (glob patterns for tsconfig exclude) */
  nonExtensiveIgnorePatterns?: string[];
  /**
   * Keep a warm tsgo LSP daemon and query it via workspace/diagnostic instead of
   * spawning a fresh tsgo process each run.  First call pays the cold-start cost;
   * every subsequent call returns in 1–3 s because the type graph stays in memory.
   * Requires useTsgo: true.  The daemon socket lives at .tmp/tsgo-lsp.sock.
   */
  useLspDaemon?: boolean;
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
interface EslintParserOptions {
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

/** ESLint plugin interface - matches ESLint's Plugin type */
interface EslintPlugin {
  rules?: Record<string, EslintRule>;
  configs?: Record<string, EslintPluginConfig>;
  processors?: Record<string, EslintProcessor>;
  meta?: EslintPluginMeta;
}

/** ESLint plugin metadata */
interface EslintPluginMeta {
  name?: string;
  version?: string;
}

/** ESLint plugin config (shareable config) */
interface EslintPluginConfig {
  plugins?: Record<string, EslintPlugin>;
  rules?: LintConfigElement;
  languageOptions?: LintConfigElement;
  settings?: LintConfigElement;
}

/** ESLint processor interface */
interface EslintProcessor {
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
type EslintRule = EslintRuleFunction | EslintRuleModule;

/** ESLint rule as a function */
type EslintRuleFunction = (context: EslintRuleContext) => EslintRuleListener;

/** ESLint rule as a module with create function */
interface EslintRuleModule {
  create: EslintRuleFunction;
  meta?: EslintRuleMeta;
}

/** ESLint rule context (simplified) */
interface EslintRuleContext {
  report: (descriptor: EslintReportDescriptor) => void;
  options: LintConfigValue[];
  getSourceCode: () => EslintSourceCode;
  getFilename: () => string;
  getCwd: () => string;
}

/** ESLint report descriptor */
interface EslintReportDescriptor {
  node?: LintConfigElement;
  message?: string;
  messageId?: string;
  data?: Record<string, string | number>;
  loc?: { line: number; column: number };
  fix?: (fixer: EslintFixer) => EslintFix | EslintFix[] | null;
  suggest?: EslintSuggestion[];
}

/** ESLint fixer */
interface EslintFixer {
  insertTextAfter: (node: LintConfigElement, text: string) => EslintFix;
  insertTextBefore: (node: LintConfigElement, text: string) => EslintFix;
  remove: (node: LintConfigElement) => EslintFix;
  replaceText: (node: LintConfigElement, text: string) => EslintFix;
  replaceTextRange: (range: [number, number], text: string) => EslintFix;
}

/** ESLint fix */
interface EslintFix {
  range: [number, number];
  text: string;
}

/** ESLint suggestion */
interface EslintSuggestion {
  desc?: string;
  messageId?: string;
  data?: Record<string, string | number>;
  fix: (fixer: EslintFixer) => EslintFix | EslintFix[] | null;
}

/** ESLint source code */
interface EslintSourceCode {
  getText: (node?: LintConfigElement) => string;
  getLines: () => string[];
  getAllComments: () => LintConfigElement[];
}

/** ESLint rule listener */
interface EslintRuleListener {
  [selector: string]: ((node: LintConfigElement) => void) | undefined;
}

/** ESLint rule meta */
interface EslintRuleMeta {
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
  /** Extra ignore patterns applied only in non-extensive mode (pre-formatted for eslint) */
  nonExtensiveIgnorePatterns?: string[];
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

type EslintConfig = EslintConfigDisabled | EslintConfigEnabled;

// ============================================================
// Testing Configuration
// ============================================================

/** Optional testing settings */
interface TestingConfigOptions {
  /** Command to run tests (default: vitest via the PACKAGE_MANAGER runner) */
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

type TestingConfig = TestingConfigDisabled | TestingConfigEnabled;

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
      useTsgo?: boolean;
      /** @deprecated Use useTsgo. */
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

type VSCodeConfig = VSCodeConfigDisabled | VSCodeConfigEnabled;

// ============================================================
// Vibe Check Configuration
// ============================================================

/** Vibe Check defaults */
interface VibeCheckConfig {
  /**
   * Auto-fix issues (default: false).
   * - `true`: apply oxlint's safe rule fixes AND reformat with oxfmt.
   * - `"lint-only"`: apply oxlint's safe rule fixes (e.g. marking type-only
   *   imports for `consistent-type-imports`) without touching formatting.
   */
  fix?: boolean | "lint-only";
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
  /** Max issues to display per page for MCP platform (default: 100) */
  mcpLimit?: number;
  /** Max files to show in summary (default: 50) */
  maxFilesInSummary?: number;
  /** Editor URI scheme for clickable file links (default: "vscode://file/") */
  editorUriScheme?: string;
  /**
   * When false (default), skips test files (*.test.ts, *.test.tsx) and
   * generated files (system/generated/**). Set to true for release validation
   * or when you explicitly want to audit generated/test code.
   * The actual ignore patterns are defined per-checker via nonExtensiveIgnorePatterns
   * on oxlint, eslint, and typecheck configs (formatted by formatIgnorePatterns).
   */
  extensive?: boolean;
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

// ============================================================
// Config Repository Result Types
// ============================================================

interface ConfigReadyResult {
  ready: true;
  config: CheckConfig;
  regenerated: boolean;
}

interface ConfigErrorResult {
  ready: false;
  error: "missing" | "exists" | "creation_failed" | "load_failed";
  message: string;
  configPath: string;
}

export type EnsureConfigResult = ConfigReadyResult | ConfigErrorResult;

// ============================================================
// Config Repository Internal Result Types
// ============================================================

export interface GenerateVSCodeSettingsResult {
  settingsPath: string;
}

export interface CreateDefaultCheckConfigResult {
  configPath: string;
}

export interface CreateDefaultMcpConfigResult {
  mcpConfigPath: string;
}
