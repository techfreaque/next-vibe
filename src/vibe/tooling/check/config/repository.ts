/**
 * Unified Check Configuration Repository
 *
 * Centralizes all configuration operations for code quality tools:
 * - Loading and validating check.config.ts
 * - Generating output files (.oxlintrc.json, .oxfmtrc.json)
 * - Updating VSCode settings
 * - Providing configuration to all check modules
 */

import { existsSync, promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { coreEnv, getPackageDlxRunner } from "../../../core/env";
import {
  ErrorResponseTypes,
  failInline,
  type ResponseType,
  success,
} from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import type { Platform } from "../../../platforms/platforms";

import { parseJsonWithComments } from "../repository/parse-json";
import type {
  ConfigCreateRequestOutput,
  ConfigCreateResponseOutput,
} from "./definition";
import type {
  CheckConfig,
  CreateDefaultCheckConfigResult,
  CreateDefaultMcpConfigResult,
  EnsureConfigResult,
  GenerateVSCodeSettingsResult,
  OxlintJsPlugin,
} from "./types";

/**
 * The command a user runs to create check.config.ts. Uses the dlx runner
 * because @next-vibe/checker is fetched from the registry, not installed.
 */
function configCreateCommand(): string {
  const dlx = getPackageDlxRunner(coreEnv.PACKAGE_MANAGER);
  return [dlx.command, ...dlx.args, "@next-vibe/checker", "config-create"].join(
    " ",
  );
}

// ============================================================
// Repository Implementation
// ============================================================

export class ConfigRepositoryImpl {
  // --------------------------------------------------------
  // Static Private Helpers - Path Resolution
  // --------------------------------------------------------

  private static getConfigFilePath(): string {
    let dir = process.cwd();
    for (let i = 0; i < 10; i++) {
      const candidate = resolve(dir, "check.config.ts");
      if (existsSync(candidate)) {
        return candidate;
      }
      const parent = dirname(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
    return resolve(process.cwd(), "check.config.ts");
  }

  private static resolveJsPluginPath(pluginPath: string): string {
    // Pattern: @next-vibe/checker/oxlint-plugins/restricted-syntax.ts or .js
    const packagePrefix = "@next-vibe/checker/oxlint-plugins/";
    if (pluginPath.startsWith(packagePrefix)) {
      const fileName = pluginPath.slice(packagePrefix.length);
      const baseName = fileName.replace(/\.(ts|js)$/, "");

      // Installed package (@next-vibe/checker ships .ts sources) takes
      // precedence, so a consuming repo uses the published plugin rather than a
      // stale local copy.
      for (const candidate of [
        resolve(
          process.cwd(),
          "node_modules",
          "@next-vibe",
          "checker",
          "oxlint-plugins",
          `${baseName}.ts`,
        ),
        resolve(
          process.cwd(),
          "node_modules",
          "@next-vibe",
          "checker",
          "oxlint-plugins",
          fileName,
        ),
      ]) {
        if (existsSync(candidate)) {
          return candidate;
        }
      }

      return ConfigRepositoryImpl.localPluginPath(baseName);
    }

    // Pattern: next-vibe/tooling/checker/oxlint/oxlint-plugins/<name>.ts
    const internalPrefix = "next-vibe/tooling/checker/oxlint/oxlint-plugins/";
    if (pluginPath.startsWith(internalPrefix)) {
      const fileName = pluginPath.slice(internalPrefix.length);
      return ConfigRepositoryImpl.localPluginPath(
        fileName.replace(/\.(ts|js)$/, ""),
      );
    }

    // If no prefix matched, return absolute path if it exists, otherwise as-is
    if (pluginPath.startsWith("/")) {
      return pluginPath;
    }

    const absolutePath = `${process.cwd()}/${pluginPath}`;
    return existsSync(absolutePath) ? absolutePath : pluginPath;
  }

  /**
   * A plugin's source, resolved from THIS file's location:
   *   <check>/config/..  ->  <check>/repository/oxlint/plugins/<name>/src/index.ts
   *
   * Anchoring here - rather than walking up from cwd guessing at a `src/vibe/...`
   * tree - is what makes the checker work wherever it is mounted. Getting it
   * wrong is silent: oxlint fails the entire config load and the run still
   * reports "0 issues", so a bad path reads as a clean lint.
   */
  private static localPluginPath(baseName: string): string {
    return resolve(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "repository",
      "oxlint",
      "plugins",
      baseName,
      "src",
      "index.ts",
    );
  }

  private static resolveJsPlugins(
    jsPlugins: (string | OxlintJsPlugin)[] | undefined,
  ): string[] {
    if (!jsPlugins || jsPlugins.length === 0) {
      return [];
    }

    // Resolve paths - supports both string paths and objects with path property
    // Options in objects are for future oxlint native support, currently plugins read from config.oxlint.rules
    return jsPlugins.map((plugin) => {
      const pluginPath = typeof plugin === "string" ? plugin : plugin.path;
      return ConfigRepositoryImpl.resolveJsPluginPath(pluginPath);
    });
  }

  // --------------------------------------------------------
  // Static Private Helpers - Package Discovery
  // --------------------------------------------------------

  private static async findPackageRoot(
    startDir: string,
  ): Promise<string | null> {
    let currentDir = startDir;
    const root = resolve("/");

    while (currentDir !== root) {
      const packageJsonPath = resolve(currentDir, "package.json");
      if (existsSync(packageJsonPath)) {
        try {
          const content = await fs.readFile(packageJsonPath, "utf8");
          const pkg = JSON.parse(content) as { name?: string };
          if (pkg.name === "@next-vibe/checker" || pkg.name === "next-vibe") {
            return currentDir;
          }
        } catch {
          // Continue searching
        }
      }
      currentDir = dirname(currentDir);
    }
    return null;
  }

  // --------------------------------------------------------
  // Static Private Helpers - Config Generation
  // --------------------------------------------------------

  private static generateEslintConfigContent(): string {
    return `/**
 * ESLint Flat Config (Auto-generated)
 * Loads plugins and builds config from check.config.ts
 */

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(resolve(projectRoot, "package.json"));

// Load ESLint plugins
const reactCompilerPlugin = require("eslint-plugin-react-compiler");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const tseslint = require("typescript-eslint");

// Load check.config.ts and build flatConfig with plugins
const exported = require(resolve(projectRoot, "check.config.ts")).default;
const checkConfig = typeof exported === "function" ? exported() : exported;

// Build flatConfig by calling buildFlatConfig with loaded plugins
export default checkConfig.eslint?.buildFlatConfig?.(
  reactCompilerPlugin,
  reactHooksPlugin,
  simpleImportSortPlugin,
  tseslint
) || checkConfig.eslint?.flatConfig || [];
`;
  }

  private static buildOxfmtConfig(
    prettierConfig: CheckConfig["prettier"] & { enabled: true },
  ): Record<string, boolean | string | number> {
    return {
      semi: prettierConfig.semi ?? true,
      singleQuote: prettierConfig.singleQuote ?? false,
      trailingComma: prettierConfig.trailingComma ?? "all",
      tabWidth: prettierConfig.tabWidth ?? 2,
      useTabs: prettierConfig.useTabs ?? false,
      printWidth: prettierConfig.printWidth ?? 80,
      arrowParens: prettierConfig.arrowParens ?? "always",
      endOfLine: prettierConfig.endOfLine ?? "lf",
      bracketSpacing: prettierConfig.bracketSpacing ?? true,
      jsxSingleQuote: prettierConfig.jsxSingleQuote ?? false,
    };
  }

  // --------------------------------------------------------
  // Static Private Helpers - VSCode Settings
  // --------------------------------------------------------

  private static applyOxcSettings(
    settings: Record<string, WidgetData>,
    oxc: NonNullable<
      NonNullable<CheckConfig["vscode"] & { enabled: true }>["settings"]
    >["oxc"],
  ): void {
    if (!oxc) {
      return;
    }
    if (oxc.enable !== undefined) {
      settings["oxc.enable"] = oxc.enable;
    }
    if (oxc.lintRun) {
      settings["oxc.lint.run"] = oxc.lintRun;
    }
    if (oxc.configPath) {
      settings["oxc.configPath"] = oxc.configPath;
    }
    if (oxc.fmtConfigPath) {
      settings["oxc.fmt.configPath"] = oxc.fmtConfigPath;
    }
    if (oxc.fmtExperimental !== undefined) {
      settings["oxc.fmt.experimental"] = oxc.fmtExperimental;
    }
    if (oxc.typeAware !== undefined) {
      settings["oxc.typeAware"] = oxc.typeAware;
    }
    if (oxc.traceServer) {
      settings["oxc.trace.server"] = oxc.traceServer;
    }
  }

  private static applyEditorSettings(
    settings: Record<string, WidgetData>,
    editor: NonNullable<
      NonNullable<CheckConfig["vscode"] & { enabled: true }>["settings"]
    >["editor"],
  ): void {
    if (!editor) {
      return;
    }
    if (editor.formatOnSave !== undefined) {
      settings["editor.formatOnSave"] = editor.formatOnSave;
    }
    if (editor.defaultFormatter) {
      settings["editor.defaultFormatter"] = editor.defaultFormatter;
    }
    if (editor.codeActionsOnSave) {
      settings["editor.codeActionsOnSave"] = editor.codeActionsOnSave;
    }
  }

  private static applyTypescriptSettings(
    settings: Record<string, WidgetData>,
    ts: NonNullable<
      NonNullable<CheckConfig["vscode"] & { enabled: true }>["settings"]
    >["typescript"],
  ): void {
    if (!ts) {
      return;
    }
    if (ts.validateEnable !== undefined) {
      settings["typescript.validate.enable"] = ts.validateEnable;
    }
    if (ts.suggestAutoImports !== undefined) {
      settings["typescript.suggest.autoImports"] = ts.suggestAutoImports;
    }
    if (ts.preferTypeOnlyAutoImports !== undefined) {
      settings["typescript.preferences.preferTypeOnlyAutoImports"] =
        ts.preferTypeOnlyAutoImports;
    }
    const useTsgo = ts.useTsgo ?? ts.experimentalUseTsgo;
    if (useTsgo !== undefined) {
      delete settings["typescript.experimental.useTsgo"];
      settings["js/ts.experimental.useTsgo"] = useTsgo;
    }
  }

  private static applyFileSettings(
    settings: Record<string, WidgetData>,
    existing: Record<string, WidgetData>,
    files: NonNullable<
      NonNullable<CheckConfig["vscode"] & { enabled: true }>["settings"]
    >["files"],
  ): void {
    if (!files) {
      return;
    }
    if (files.eol) {
      settings["files.eol"] = files.eol;
    }
    if (files.exclude) {
      settings["files.exclude"] = {
        ...(existing["files.exclude"] as Record<string, boolean> | undefined),
        ...files.exclude,
      };
    }
  }

  private static applySearchSettings(
    settings: Record<string, WidgetData>,
    existing: Record<string, WidgetData>,
    search: NonNullable<
      NonNullable<CheckConfig["vscode"] & { enabled: true }>["settings"]
    >["search"],
  ): void {
    if (!search?.exclude) {
      return;
    }
    settings["search.exclude"] = {
      ...(existing["search.exclude"] as Record<string, boolean> | undefined),
      ...search.exclude,
    };
  }

  private static applyLanguageFormatterSettings(
    settings: Record<string, WidgetData>,
    existing: Record<string, WidgetData>,
    vscodeSettings: NonNullable<
      CheckConfig["vscode"] & { enabled: true }
    >["settings"],
  ): void {
    const formatter = vscodeSettings?.editor?.defaultFormatter;
    if (!formatter) {
      return;
    }

    for (const lang of [
      "typescript",
      "typescriptreact",
      "javascript",
      "javascriptreact",
    ]) {
      const langKey = `[${lang}]`;
      const existingLang = existing[langKey] as
        | Record<string, WidgetData>
        | undefined;
      settings[langKey] = {
        ...existingLang,
        "editor.defaultFormatter": formatter,
        "editor.formatOnSave": vscodeSettings?.editor?.formatOnSave ?? true,
        ...(lang.includes("typescript")
          ? {
              "editor.codeActionsOnSave": {
                "source.organizeImports": "always",
              },
            }
          : {}),
      };
    }
  }

  // --------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------

  static async ensureConfigReady(
    logger: EndpointLogger,
    createConfig: boolean,
  ): Promise<EnsureConfigResult> {
    const configPath = ConfigRepositoryImpl.getConfigFilePath();
    const configExists = existsSync(configPath);

    if (createConfig && configExists) {
      logger.debug("check.config.ts already exists", { path: configPath });
      return {
        ready: false,
        error: "exists",
        message: `check.config.ts already exists. To restore the default configuration, delete the existing file first and run '${configCreateCommand()}' to create a new one.`,
        configPath,
      };
    }

    if (!configExists) {
      if (createConfig) {
        logger.info("Creating default check.config.ts...");
        const createResult =
          await ConfigRepositoryImpl.createDefaultCheckConfig(logger);
        if (!createResult.success) {
          return {
            ready: false,
            error: "creation_failed",
            message: `Failed to create check.config.ts: ${createResult.message}`,
            configPath,
          };
        }
        logger.info("Created check.config.ts successfully");
      } else {
        logger.debug("check.config.ts not found", { path: configPath });
        return {
          ready: false,
          error: "missing",
          message: `check.config.ts not found. Run '${configCreateCommand()}' to create a default configuration.`,
          configPath,
        };
      }
    }

    // Do not time this call and report it as config-loading cost. This is the
    // first `await` on the check path, so it absorbs whatever the event loop
    // still has queued from CLI startup - measured at ~750ms, against ~3ms of
    // actual work (1.5ms to import check.config.ts, the rest a stat).
    // Wall-clock here has twice been misread as "check.config.ts is slow to
    // compile", prompting attempts to cache the resolved config. Caching it buys
    // ~3ms and risks serving stale lint rules. The real cost is upstream, in the
    // ~2.3s between the `[ROUTE] executing` and `[RouteExecute] Executing route`
    // log lines.
    const loaded = await ConfigRepositoryImpl.loadCheckConfig(logger);
    if (!loaded) {
      return {
        ready: false,
        error: "load_failed",
        message: `check.config.ts could not be loaded. Run '${configCreateCommand()}' to create a default configuration.`,
        configPath,
      };
    }

    const { config, configMtimeMs } = loaded;
    const status = await ConfigRepositoryImpl.checkConfigStatus(
      logger,
      config,
      configMtimeMs,
    );
    let regenerated = false;

    if (status.needsRegeneration) {
      logger.debug("Regenerating config files");
      const genResult = await ConfigRepositoryImpl.generateAllConfigs(
        logger,
        config,
      );
      if (genResult.success) {
        regenerated = true;
        logger.debug("Config files regenerated successfully");
      } else {
        logger.warn("Failed to regenerate config files", {
          error: genResult.message,
        });
      }
    } else {
      logger.debug("Config files are up-to-date");
    }

    const vscodeResult = await ConfigRepositoryImpl.generateVSCodeSettings(
      logger,
      config,
    );
    if (!vscodeResult.success) {
      logger.warn("Failed to generate VSCode settings", {
        error: vscodeResult.message,
      });
    }

    return { ready: true, config, regenerated };
  }

  private static async generateAllConfigs(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<
    ResponseType<{
      oxlintConfigPath?: string;
      oxfmtConfigPath?: string;
      eslintConfigPath?: string;
    }>
  > {
    try {
      let oxlintConfigPath: string | undefined;
      let oxfmtConfigPath: string | undefined;
      let eslintConfigPath: string | undefined;

      // Generate oxlint config if enabled
      if (config.oxlint.enabled) {
        oxlintConfigPath = await ConfigRepositoryImpl.generateOxlintConfig(
          logger,
          config.oxlint,
        );
      }

      // Generate prettier/oxfmt config if enabled
      if (config.prettier.enabled) {
        oxfmtConfigPath = await ConfigRepositoryImpl.generatePrettierConfig(
          logger,
          config.prettier,
        );

        // Generate .prettierignore from oxlint ignore patterns for oxfmt --ignore-path.
        // Always include nonExtensiveIgnorePatterns (generated/test files should never
        // be auto-formatted regardless of --extensive flag).
        const ignorePatterns = config.oxlint.enabled
          ? [
              ...(config.oxlint.ignorePatterns ?? []),
              ...(config.oxlint.nonExtensiveIgnorePatterns ?? []),
            ]
          : [];
        if (config.prettier.ignoreFilePath && ignorePatterns.length > 0) {
          await ConfigRepositoryImpl.generatePrettierIgnore(
            logger,
            config.prettier.ignoreFilePath,
            ignorePatterns,
          );
        }
      }

      // Generate ESLint config if enabled
      if (config.eslint.enabled) {
        eslintConfigPath = await ConfigRepositoryImpl.generateEslintConfig(
          logger,
          config.eslint,
        );
      }

      return success({
        oxlintConfigPath,
        oxfmtConfigPath,
        eslintConfigPath,
      });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to generate configs", { error: errorMessage });
      return failInline({
        message: `Failed to generate configs: ${errorMessage}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async generateVSCodeSettings(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<ResponseType<GenerateVSCodeSettingsResult>> {
    const defaultSettingsPath = resolve(process.cwd(), ".vscode/settings.json");

    try {
      // Check if VSCode integration is enabled
      if (!config.vscode.enabled) {
        logger.debug("VSCode settings generation disabled");
        return success({ settingsPath: defaultSettingsPath });
      }

      const vscodeConfig = config.vscode;
      const settingsPath = resolve(
        process.cwd(),
        vscodeConfig.settingsPath ?? ".vscode/settings.json",
      );
      if (!vscodeConfig.autoGenerateSettings) {
        logger.debug("VSCode settings auto-generation disabled");
        return success({ settingsPath });
      }

      const settingsDirectory = dirname(settingsPath);
      if (!existsSync(settingsDirectory)) {
        await fs.mkdir(settingsDirectory, { recursive: true });
      }

      const existingSettings =
        await ConfigRepositoryImpl.loadExistingSettings(settingsPath);
      const newSettings: Record<string, WidgetData> = { ...existingSettings };

      // Apply all settings using static helpers
      ConfigRepositoryImpl.applyOxcSettings(
        newSettings,
        vscodeConfig.settings?.oxc,
      );
      ConfigRepositoryImpl.applyEditorSettings(
        newSettings,
        vscodeConfig.settings?.editor,
      );
      ConfigRepositoryImpl.applyTypescriptSettings(
        newSettings,
        vscodeConfig.settings?.typescript,
      );
      ConfigRepositoryImpl.applyFileSettings(
        newSettings,
        existingSettings,
        vscodeConfig.settings?.files,
      );
      ConfigRepositoryImpl.applySearchSettings(
        newSettings,
        existingSettings,
        vscodeConfig.settings?.search,
      );
      ConfigRepositoryImpl.applyLanguageFormatterSettings(
        newSettings,
        existingSettings,
        vscodeConfig.settings,
      );

      // Only write when something actually changed. This runs on EVERY check,
      // and an unconditional write re-stamps the file's mtime, which editors and
      // file watchers treat as a real edit - reloading settings mid-session on a
      // command that changed nothing.
      const serialized = JSON.stringify(newSettings, null, 2);
      const currentSettings = await fs
        .readFile(settingsPath, "utf8")
        .catch(() => null);

      if (currentSettings === serialized) {
        logger.debug("VSCode settings already up-to-date", {
          path: settingsPath,
        });
        return success({ settingsPath });
      }

      await fs.writeFile(settingsPath, serialized, "utf8");

      logger.debug("Generated VSCode settings", { path: settingsPath });

      return success({ settingsPath });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to generate VSCode settings", {
        error: errorMessage,
      });
      return failInline({
        message: `Failed to generate VSCode settings: ${errorMessage}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createDefaultCheckConfig(
    logger: EndpointLogger,
  ): Promise<ResponseType<CreateDefaultCheckConfigResult>> {
    const configPath = ConfigRepositoryImpl.getConfigFilePath();

    try {
      const currentDir = dirname(fileURLToPath(import.meta.url));
      const packageRoot =
        await ConfigRepositoryImpl.findPackageRoot(currentDir);

      if (!packageRoot) {
        return failInline({
          message: "Package root not found",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const templatePath = resolve(packageRoot, "check.config.ts");

      if (!existsSync(templatePath)) {
        return failInline({
          message: `Template not found at ${templatePath}`,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      let templateContent = await fs.readFile(templatePath, "utf8");

      // Replace .ts extensions with .js for installed package usage
      templateContent = templateContent.replaceAll(
        /@next-vibe\/checker\/oxlint-plugins\/([^"']+)\.ts/g,
        "@next-vibe/checker/oxlint-plugins/$1.js",
      );

      // New projects default to cold-tsgo; LSP daemon is opt-in per project
      templateContent = templateContent.replaceAll(
        /useLspDaemon:\s*true/g,
        "useLspDaemon: false",
      );

      // Test-project configs must not auto-fix — corpus files are intentional violations
      templateContent = templateContent.replaceAll(
        /\bfix:\s*true\b/g,
        "fix: false",
      );

      await fs.writeFile(configPath, templateContent, "utf8");

      // Also create .mcp.json
      const mcpResult = await ConfigRepositoryImpl.createDefaultMcpConfig(
        logger,
        ".mcp.json",
      );
      if (!mcpResult.success) {
        logger.warn("Failed to create .mcp.json", {
          error: mcpResult.message,
        });
      }
      const mcpCursorResult = await ConfigRepositoryImpl.createDefaultMcpConfig(
        logger,
        ".cursor/mcp.json",
      );
      if (!mcpCursorResult.success) {
        logger.warn("Failed to create .cursor/mcp.json", {
          error: mcpCursorResult.message,
        });
      }

      const mcpVscodeResult = await ConfigRepositoryImpl.createDefaultMcpConfig(
        logger,
        ".vscode/mcp.json",
      );
      if (!mcpVscodeResult.success) {
        logger.warn("Failed to create .vscode/mcp.json", {
          error: mcpVscodeResult.message,
        });
      }

      return success({ configPath });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to create check.config.ts", { error: errorMessage });
      return failInline({
        message: `Failed to create check.config.ts: ${errorMessage}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createDefaultMcpConfig(
    logger: EndpointLogger,
    path: string,
  ): Promise<ResponseType<CreateDefaultMcpConfigResult>> {
    const projectPath = process.cwd();
    const mcpConfigPath = `${projectPath}/${path}`;

    try {
      // Use .mcp.example.json template if available, replacing {{PROJECT_PATH}}
      const examplePath = resolve(projectPath, ".mcp.example.json");
      let mcpContent: string;

      if (existsSync(examplePath)) {
        const template = await fs.readFile(examplePath, "utf8");
        mcpContent = template.replaceAll("{{PROJECT_PATH}}", projectPath);
      } else {
        // Fallback: minimal config fetching the external @next-vibe/checker package
        const dlx = getPackageDlxRunner(coreEnv.PACKAGE_MANAGER);
        mcpContent = JSON.stringify(
          {
            mcpServers: {
              vibe: {
                command: dlx.command,
                args: [...dlx.args, "@next-vibe/checker@latest", "mcp"],
                env: {
                  PROJECT_ROOT: projectPath,
                },
              },
            },
          },
          null,
          2,
        );
      }

      const mcpConfigDirectory = dirname(mcpConfigPath);
      if (!existsSync(mcpConfigDirectory)) {
        await fs.mkdir(mcpConfigDirectory, { recursive: true });
      }
      await fs.writeFile(mcpConfigPath, mcpContent, "utf8");

      return success({ mcpConfigPath });
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to create .mcp.json", { error: errorMessage });
      return failInline({
        message: `Failed to create .mcp.json: ${errorMessage}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // --------------------------------------------------------
  // Private Methods
  // --------------------------------------------------------

  private static async loadCheckConfig(
    logger: EndpointLogger,
  ): Promise<{ config: CheckConfig; configMtimeMs: number } | null> {
    try {
      const configPath = ConfigRepositoryImpl.getConfigFilePath();

      if (!existsSync(configPath)) {
        logger.debug("check.config.ts not found", { path: configPath });
        return null;
      }

      // Stat and dynamic import in parallel - stat is needed for stale check anyway
      // Use indirect import to prevent Turbopack static analysis
      // eslint-disable-next-line -- dynamic import required for runtime config loading
      const dynamicImport = new Function("p", "return import(p)") as (
        p: string,
      ) => Promise<{
        default?: CheckConfig | (() => CheckConfig);
        config?: CheckConfig | (() => CheckConfig);
      }>;
      // A file:// URL is the only specifier form both Node and Bun accept here;
      // Node's ESM loader rejects bare absolute paths (notably Windows "C:\...").
      const [configStats, configModule] = await Promise.all([
        fs.stat(configPath),
        dynamicImport(pathToFileURL(configPath).href),
      ]);

      const exportedValue = configModule.default ?? configModule.config;

      if (!exportedValue) {
        logger.warn("check.config.ts must export 'default' or 'config'");
        return null;
      }

      // Support both direct object exports and factory functions
      const config =
        typeof exportedValue === "function" ? exportedValue() : exportedValue;

      logger.debug(`Loaded check.config.ts (path: ${configPath})`);
      return { config, configMtimeMs: configStats.mtimeMs };
    } catch (error) {
      logger.debug(
        `Failed to load check.config.ts (error: ${parseError(error).message})`,
      );
      return null;
    }
  }

  private static async checkConfigStatus(
    logger: EndpointLogger,
    config: CheckConfig,
    configMtimeMs: number,
  ): Promise<{ needsRegeneration: boolean }> {
    // If no tools are enabled, no regeneration needed
    if (
      !config.oxlint.enabled &&
      !config.prettier.enabled &&
      !config.eslint.enabled
    ) {
      return { needsRegeneration: false };
    }

    // Collect all generated config paths to stat in parallel
    const generatedPaths: string[] = [];
    if (config.oxlint.enabled) {
      generatedPaths.push(`${process.cwd()}/${config.oxlint.configPath}`);
    }

    try {
      const results = await Promise.all(
        generatedPaths.map((p) => fs.stat(p).catch(() => null)),
      );

      for (const stat of results) {
        if (!stat || configMtimeMs > stat.mtimeMs) {
          return { needsRegeneration: true };
        }
      }

      // Also check that all resolved jsPlugin paths actually exist on disk.
      // This catches stale configs where the package was updated and plugin
      // paths changed (e.g. from .dist/oxlint-plugins/ to oxlint-plugins/).
      if (config.oxlint.enabled && config.oxlint.jsPlugins?.length) {
        const oxlintConfigPath = `${process.cwd()}/${config.oxlint.configPath}`;
        try {
          const rawConfig = await fs.readFile(oxlintConfigPath, "utf8");
          const parsed = JSON.parse(rawConfig) as {
            jsPlugins?: string[];
          };
          if (parsed.jsPlugins?.length) {
            for (const pluginPath of parsed.jsPlugins) {
              if (!existsSync(pluginPath)) {
                logger.debug(
                  "Stale jsPlugin path detected, forcing regeneration",
                  { path: pluginPath },
                );
                return { needsRegeneration: true };
              }
            }
          }
        } catch {
          // If we can't read/parse the config, regenerate to be safe
          return { needsRegeneration: true };
        }
      }

      return { needsRegeneration: false };
    } catch (error) {
      logger.debug("Error checking config status", {
        error: parseError(error).message,
      });
      return { needsRegeneration: true };
    }
  }

  private static async loadExistingSettings(
    settingsPath: string,
  ): Promise<Record<string, WidgetData>> {
    if (!existsSync(settingsPath)) {
      return {};
    }
    try {
      const content = await fs.readFile(settingsPath, "utf8");
      const parseResult = parseJsonWithComments(content);
      if (parseResult.success && typeof parseResult.data === "object") {
        return parseResult.data as Record<string, WidgetData>;
      }
    } catch {
      // Return empty object if parsing fails
    }
    return {};
  }

  private static async generateOxlintConfig(
    logger: EndpointLogger,
    oxlintConfig: CheckConfig["oxlint"] & { enabled: true },
  ): Promise<string> {
    const configPath = `${process.cwd()}/${oxlintConfig.configPath}`;
    await fs.mkdir(dirname(configPath), { recursive: true });

    // Convert jsPlugins to array of paths for .oxlintrc.json
    // Options are not yet supported by oxlint natively, used via direct import workaround
    const resolvedJsPlugins = ConfigRepositoryImpl.resolveJsPlugins(
      oxlintConfig.jsPlugins,
    );

    // Only include valid oxlint schema fields (not CheckConfig metadata like enabled, configPath, cachePath, lintableExtensions)
    const oxlintConfigForFile: {
      $schema?: string;
      ignorePatterns?: string[];
      plugins?: string[];
      jsPlugins?: string[];
      categories?: typeof oxlintConfig.categories;
      rules?: typeof oxlintConfig.rules;
      settings?: typeof oxlintConfig.settings;
      env?: typeof oxlintConfig.env;
      globals?: typeof oxlintConfig.globals;
      overrides?: typeof oxlintConfig.overrides;
    } = {};

    if (oxlintConfig.$schema !== undefined) {
      oxlintConfigForFile.$schema = oxlintConfig.$schema;
    }
    if (oxlintConfig.ignorePatterns !== undefined) {
      oxlintConfigForFile.ignorePatterns = oxlintConfig.ignorePatterns;
    }
    if (oxlintConfig.plugins !== undefined) {
      oxlintConfigForFile.plugins = oxlintConfig.plugins;
    }
    if (resolvedJsPlugins.length > 0) {
      oxlintConfigForFile.jsPlugins = resolvedJsPlugins;
    }
    if (oxlintConfig.categories !== undefined) {
      oxlintConfigForFile.categories = oxlintConfig.categories;
    }
    if (oxlintConfig.rules !== undefined) {
      oxlintConfigForFile.rules = oxlintConfig.rules;
    }
    if (oxlintConfig.settings !== undefined) {
      oxlintConfigForFile.settings = oxlintConfig.settings;
    }
    if (oxlintConfig.env !== undefined) {
      oxlintConfigForFile.env = oxlintConfig.env;
    }
    if (oxlintConfig.globals !== undefined) {
      oxlintConfigForFile.globals = oxlintConfig.globals;
    }
    if (oxlintConfig.overrides !== undefined) {
      oxlintConfigForFile.overrides = oxlintConfig.overrides;
    }

    if (resolvedJsPlugins.length > 0) {
      logger.debug("Resolved jsPlugins paths", {
        paths: resolvedJsPlugins,
      });
    }

    await fs.writeFile(
      configPath,
      JSON.stringify(oxlintConfigForFile, null, 2),
      "utf8",
    );
    logger.debug("Generated .oxlintrc.json", { path: configPath });

    return configPath;
  }

  private static async generatePrettierConfig(
    logger: EndpointLogger,
    prettierConfig: CheckConfig["prettier"] & { enabled: true },
  ): Promise<string> {
    const configPath = `${process.cwd()}/${prettierConfig.configPath}`;
    await fs.mkdir(dirname(configPath), { recursive: true });

    const oxfmtConfig = ConfigRepositoryImpl.buildOxfmtConfig(prettierConfig);
    await fs.writeFile(
      configPath,
      JSON.stringify(oxfmtConfig, null, 2),
      "utf8",
    );
    logger.debug("Generated .oxfmtrc.json", { path: configPath });

    return configPath;
  }

  private static async generatePrettierIgnore(
    logger: EndpointLogger,
    ignoreFilePath: string,
    ignorePatterns: string[],
  ): Promise<void> {
    const filePath = `${process.cwd()}/${ignoreFilePath}`;
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${ignorePatterns.join("\n")}\n`, "utf8");
    logger.debug("Generated .prettierignore", { path: filePath });
  }

  private static async generateEslintConfig(
    logger: EndpointLogger,
    eslintConfig: CheckConfig["eslint"] & { enabled: true },
  ): Promise<string> {
    const configPath = `${process.cwd()}/${eslintConfig.configPath}`;
    await fs.mkdir(dirname(configPath), { recursive: true });

    await fs.writeFile(
      configPath,
      ConfigRepositoryImpl.generateEslintConfigContent(),
      "utf8",
    );
    logger.debug("Generated eslint.config.mjs", { path: configPath });

    return configPath;
  }
}

// ============================================================
// Config Create Repository
// ============================================================

export class ConfigCreateRepository {
  static async execute(
    data: ConfigCreateRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
  ): Promise<ResponseType<ConfigCreateResponseOutput>> {
    logger.debug("[Config Create] Repository received data", {
      data,
      platform,
    });

    try {
      const configPath = resolve(process.cwd(), "check.config.ts");
      if (existsSync(configPath)) {
        return failInline({
          message: `Configuration already exists at ${configPath}`,
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const configResult =
        await ConfigRepositoryImpl.createDefaultCheckConfig(logger);

      if (!configResult.success) {
        return failInline({
          message: `Failed to create check.config.ts: ${
            configResult.message || "Unknown error"
          }`,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const createdConfigPath = configResult.data.configPath;
      const { readFileSync, writeFileSync } = await import("node:fs");
      let configContent = readFileSync(createdConfigPath, "utf-8");

      if (data.enableReactRules !== undefined) {
        configContent = configContent.replaceAll(
          "react: true,",
          `react: ${data.enableReactRules},`,
        );
        configContent = configContent.replaceAll(
          "reactCompiler: true,",
          `reactCompiler: ${data.enableReactRules},`,
        );
        configContent = configContent.replaceAll(
          "accessibility: true,",
          `accessibility: ${data.enableReactRules},`,
        );
      }
      if (data.enableNextjsRules !== undefined) {
        configContent = configContent.replaceAll(
          "nextjs: true,",
          `nextjs: ${data.enableNextjsRules},`,
        );
      }
      if (data.enableI18nRules !== undefined) {
        configContent = configContent.replaceAll(
          "i18n: true,",
          `i18n: ${data.enableI18nRules},`,
        );
      }
      if (data.jsxCapitalization !== undefined) {
        configContent = configContent.replaceAll(
          "jsxCapitalization: true,",
          `jsxCapitalization: ${data.jsxCapitalization},`,
        );
      }
      if (data.enablePedanticRules !== undefined) {
        configContent = configContent.replaceAll(
          "pedantic: false,",
          `pedantic: ${data.enablePedanticRules},`,
        );
      }
      if (data.enableRestrictedSyntax !== undefined) {
        configContent = configContent.replaceAll(
          "restrictedSyntax: true,",
          `restrictedSyntax: ${data.enableRestrictedSyntax},`,
        );
      }
      writeFileSync(createdConfigPath, configContent, "utf-8");

      // Every file actually written, not just the last one - three are created
      // (.mcp.json, .cursor, .vscode) and reporting one made the other two
      // look like they never happened.
      const mcpConfigPaths: string[] = [];
      let vscodeSettingsPath: string | undefined;

      if (data.createMcpConfig) {
        for (const mcpDest of [
          ".mcp.json",
          ".cursor/mcp.json",
          ".vscode/mcp.json",
        ]) {
          const mcpResult = await ConfigRepositoryImpl.createDefaultMcpConfig(
            logger,
            mcpDest,
          );
          if (mcpResult.success) {
            mcpConfigPaths.push(mcpResult.data.mcpConfigPath);
          } else {
            logger.warn("Failed to create MCP config", {
              error: mcpResult.message,
            });
          }
        }
      }

      if (data.updateVscodeSettings) {
        const configReadResult = await ConfigRepositoryImpl.ensureConfigReady(
          logger,
          false,
        );
        if (configReadResult.ready) {
          const vscodeResult =
            await ConfigRepositoryImpl.generateVSCodeSettings(
              logger,
              configReadResult.config,
            );
          if (vscodeResult.success) {
            vscodeSettingsPath = vscodeResult.data.settingsPath;
          } else {
            logger.warn("Failed to update VSCode settings", {
              error: vscodeResult.message,
            });
          }
        }
      }

      let packageJsonPath: string | undefined;
      if (data.updatePackageJson) {
        const pkgPath = resolve(process.cwd(), "package.json");
        if (existsSync(pkgPath)) {
          try {
            const packageJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
            packageJson.scripts = {
              ...packageJson.scripts,
              check: "v c",
              lint: "v c",
              typecheck: "v c",
            };
            writeFileSync(pkgPath, `${JSON.stringify(packageJson, null, 2)}\n`);
            packageJsonPath = pkgPath;
          } catch (error) {
            logger.warn("Failed to update package.json", {
              error: parseError(error).message,
            });
          }
        } else {
          logger.warn("package.json not found in current directory");
        }
      }

      const messages: string[] = [`✓ Created ${configResult.data.configPath}`];
      for (const createdMcpPath of mcpConfigPaths) {
        messages.push(`✓ Created ${createdMcpPath}`);
      }
      if (vscodeSettingsPath) {
        messages.push(`✓ Updated ${vscodeSettingsPath}`);
      }
      if (packageJsonPath) {
        messages.push(`✓ Updated ${packageJsonPath}`);
      }

      return success({ message: messages.join("\n") });
    } catch (error) {
      logger.error("An unexpected error occurred", parseError(error));
      return failInline({
        message: `An unexpected error occurred: ${parseError(error).message}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
