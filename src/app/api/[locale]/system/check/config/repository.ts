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
import { fileURLToPath } from "node:url";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../shared/utils/parse-error";
import { parseJsonWithComments } from "../../../shared/utils/parse-json";
import type { CheckConfig, JsonObject, OxlintJsPlugin } from "./types";

// ============================================================
// Result Types
// ============================================================

export interface ConfigReadyResult {
  ready: true;
  config: CheckConfig;
  regenerated: boolean;
}

export interface ConfigErrorResult {
  ready: false;
  error: "missing" | "exists" | "creation_failed" | "load_failed";
  message: string;
  configPath: string;
}

export type EnsureConfigResult = ConfigReadyResult | ConfigErrorResult;

// ============================================================
// Repository Interface
// ============================================================

export interface ConfigRepositoryInterface {
  ensureConfigReady(
    logger: EndpointLogger,
    createConfig?: boolean,
  ): Promise<EnsureConfigResult>;

  generateAllConfigs(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<{
    success: boolean;
    oxlintConfigPath?: string;
    oxfmtConfigPath?: string;
    eslintConfigPath?: string;
    error?: string;
  }>;

  generateVSCodeSettings(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<{ success: boolean; settingsPath: string; error?: string }>;

  createDefaultCheckConfig(
    logger: EndpointLogger,
  ): Promise<{ success: boolean; configPath: string; error?: string }>;
}

// ============================================================
// Repository Implementation
// ============================================================

export class ConfigRepositoryImpl implements ConfigRepositoryInterface {
  // --------------------------------------------------------
  // Static Private Helpers - Path Resolution
  // --------------------------------------------------------

  private static getConfigFilePath(): string {
    return resolve(process.cwd(), "check.config.ts");
  }

  private static findNextVibeRoot(): string {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    return resolve(currentDir, "../../../../../../..");
  }

  private static isLocalDev(): boolean {
    const cwd = process.cwd();
    const packageRoot = ConfigRepositoryImpl.findNextVibeRoot();
    return cwd.startsWith(packageRoot);
  }

  private static resolveJsPluginPath(pluginPath: string): string {
    const packageRoot = ConfigRepositoryImpl.findNextVibeRoot();
    const localDev = ConfigRepositoryImpl.isLocalDev();

    if (pluginPath.startsWith("next-vibe/")) {
      const relativePath = pluginPath.slice("next-vibe/".length);
      if (localDev) {
        return resolve(packageRoot, relativePath);
      }
      return resolve(process.cwd(), "node_modules", "next-vibe", relativePath);
    }
    return pluginPath;
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
          if (pkg.name === "next-vibe") {
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
 * Imports eslint configuration directly from check.config.ts
 */

import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const require = createRequire(resolve(projectRoot, "package.json"));

// Direct import from check.config.ts (supports both object and function exports)
const exported = require("./check.config.ts").default;
const checkConfig = typeof exported === "function" ? exported() : exported;

// Re-export the eslint config directly
export default checkConfig.eslint?.flatConfig || [];
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
    settings: JsonObject,
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
    settings: JsonObject,
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
    settings: JsonObject,
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
    if (ts.experimentalUseTsgo !== undefined) {
      settings["typescript.experimental.useTsgo"] = ts.experimentalUseTsgo;
    }
  }

  private static applyFileSettings(
    settings: JsonObject,
    existing: JsonObject,
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
    settings: JsonObject,
    existing: JsonObject,
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
    settings: JsonObject,
    existing: JsonObject,
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
      const existingLang = existing[langKey] as JsonObject | undefined;
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

  async ensureConfigReady(
    logger: EndpointLogger,
    createConfig = false,
  ): Promise<EnsureConfigResult> {
    const configPath = ConfigRepositoryImpl.getConfigFilePath();
    const configExists = existsSync(configPath);

    if (createConfig && configExists) {
      logger.warn("check.config.ts already exists", { path: configPath });
      return {
        ready: false,
        error: "exists",
        // eslint-disable-next-line i18next/no-literal-string
        message:
          "check.config.ts already exists. To restore the default configuration, delete the existing file first and run again with --create-config.",
        configPath,
      };
    }

    if (!configExists) {
      if (createConfig) {
        logger.info("Creating default check.config.ts...");
        const createResult = await this.createDefaultCheckConfig(logger);
        if (!createResult.success) {
          return {
            ready: false,
            error: "creation_failed",
            // eslint-disable-next-line i18next/no-literal-string
            message: `Failed to create check.config.ts: ${createResult.error}`,
            configPath,
          };
        }
        logger.info("Created check.config.ts successfully");
      } else {
        logger.warn("check.config.ts not found", { path: configPath });
        return {
          ready: false,
          error: "missing",
          // eslint-disable-next-line i18next/no-literal-string
          message:
            "check.config.ts not found. Run with --create-config to create a default configuration.",
          configPath,
        };
      }
    }

    const config = await this.loadCheckConfig(logger);
    if (!config) {
      return {
        ready: false,
        error: "load_failed",
        // eslint-disable-next-line i18next/no-literal-string
        message:
          "check.config.ts could not be loaded. Run with --create-config to create a default configuration.",
        configPath,
      };
    }

    const status = await this.checkConfigStatus(logger, config);
    let regenerated = false;

    if (status.needsRegeneration) {
      logger.debug("Regenerating config files");
      const genResult = await this.generateAllConfigs(logger, config);
      if (genResult.success) {
        regenerated = true;
        logger.debug("Config files regenerated successfully");
      } else {
        logger.warn("Failed to regenerate config files", {
          error: genResult.error,
        });
      }
    } else {
      logger.debug("Config files are up-to-date");
    }

    return { ready: true, config, regenerated };
  }

  async generateAllConfigs(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<{
    success: boolean;
    oxlintConfigPath?: string;
    oxfmtConfigPath?: string;
    eslintConfigPath?: string;
    error?: string;
  }> {
    try {
      let oxlintConfigPath: string | undefined;
      let oxfmtConfigPath: string | undefined;
      let eslintConfigPath: string | undefined;

      // Generate oxlint config if enabled
      if (config.oxlint.enabled) {
        oxlintConfigPath = await this.generateOxlintConfig(
          logger,
          config.oxlint,
        );
      }

      // Generate prettier/oxfmt config if enabled
      if (config.prettier.enabled) {
        oxfmtConfigPath = await this.generatePrettierConfig(
          logger,
          config.prettier,
        );
      }

      // Generate ESLint config if enabled
      if (config.eslint.enabled) {
        eslintConfigPath = await this.generateEslintConfig(
          logger,
          config.eslint,
        );
      }

      return {
        success: true,
        oxlintConfigPath,
        oxfmtConfigPath,
        eslintConfigPath,
      };
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to generate configs", { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async generateVSCodeSettings(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<{ success: boolean; settingsPath: string; error?: string }> {
    const settingsPath = resolve(process.cwd(), ".vscode", "settings.json");

    try {
      // Check if VSCode integration is enabled
      if (!config.vscode.enabled) {
        logger.debug("VSCode settings generation disabled");
        return { success: true, settingsPath };
      }

      const vscodeConfig = config.vscode;
      if (!vscodeConfig.autoGenerateSettings) {
        logger.debug("VSCode settings auto-generation disabled");
        return { success: true, settingsPath };
      }

      await fs.mkdir(dirname(settingsPath), { recursive: true });

      const existingSettings = await this.loadExistingSettings(settingsPath);
      const newSettings: JsonObject = { ...existingSettings };

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

      await fs.writeFile(
        settingsPath,
        JSON.stringify(newSettings, null, 2),
        "utf8",
      );
      logger.debug("Generated VSCode settings", { path: settingsPath });

      return { success: true, settingsPath };
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to generate VSCode settings", {
        error: errorMessage,
      });
      return { success: false, settingsPath, error: errorMessage };
    }
  }

  async createDefaultCheckConfig(
    logger: EndpointLogger,
  ): Promise<{ success: boolean; configPath: string; error?: string }> {
    const configPath = ConfigRepositoryImpl.getConfigFilePath();

    try {
      const currentDir = dirname(fileURLToPath(import.meta.url));
      const packageRoot =
        await ConfigRepositoryImpl.findPackageRoot(currentDir);

      if (!packageRoot) {
        return {
          success: false,
          configPath,
          error: "Could not find next-vibe package root",
        };
      }

      const templatePath = resolve(packageRoot, "check.config.ts");

      if (!existsSync(templatePath)) {
        return {
          success: false,
          configPath,
          error: `Template check.config.ts not found at ${templatePath}`,
        };
      }

      const templateContent = await fs.readFile(templatePath, "utf8");
      await fs.writeFile(configPath, templateContent, "utf8");

      logger.info("Created check.config.ts from template", {
        path: configPath,
        source: templatePath,
      });

      return { success: true, configPath };
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Failed to create check.config.ts", { error: errorMessage });
      return { success: false, configPath, error: errorMessage };
    }
  }

  // --------------------------------------------------------
  // Private Methods
  // --------------------------------------------------------

  private async loadCheckConfig(
    logger: EndpointLogger,
  ): Promise<CheckConfig | null> {
    try {
      const configPath = ConfigRepositoryImpl.getConfigFilePath();

      if (!existsSync(configPath)) {
        logger.debug("check.config.ts not found", { path: configPath });
        return null;
      }

      // Use indirect import to prevent Turbopack static analysis
      // eslint-disable-next-line -- dynamic import required for runtime config loading
      const dynamicImport = new Function("p", "return import(p)") as (
        p: string,
      ) => Promise<{
        default?: CheckConfig | (() => CheckConfig);
        config?: CheckConfig | (() => CheckConfig);
      }>;
      const configModule = await dynamicImport(configPath);
      const exportedValue = configModule.default ?? configModule.config;

      if (!exportedValue) {
        logger.warn("check.config.ts must export 'default' or 'config'");
        return null;
      }

      // Support both direct object exports and factory functions
      const config =
        typeof exportedValue === "function" ? exportedValue() : exportedValue;

      logger.debug("Loaded check.config.ts", { path: configPath });
      return config;
    } catch (error) {
      logger.debug("Failed to load check.config.ts", {
        error: parseError(error).message,
      });
      return null;
    }
  }

  private async checkConfigStatus(
    logger: EndpointLogger,
    config: CheckConfig,
  ): Promise<{ needsRegeneration: boolean }> {
    const configPath = ConfigRepositoryImpl.getConfigFilePath();

    // If no tools are enabled, no regeneration needed
    if (
      !config.oxlint.enabled &&
      !config.prettier.enabled &&
      !config.eslint.enabled
    ) {
      return { needsRegeneration: false };
    }

    // Check if any enabled config file needs regeneration
    try {
      const configStats = await fs.stat(configPath);

      // Check oxlint config if enabled
      if (config.oxlint.enabled) {
        const oxlintConfigPath = resolve(
          process.cwd(),
          config.oxlint.configPath,
        );
        if (!existsSync(oxlintConfigPath)) {
          return { needsRegeneration: true };
        }
        const oxlintStats = await fs.stat(oxlintConfigPath);
        if (configStats.mtime > oxlintStats.mtime) {
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

  private async loadExistingSettings(
    settingsPath: string,
  ): Promise<JsonObject> {
    if (!existsSync(settingsPath)) {
      return {};
    }
    try {
      const content = await fs.readFile(settingsPath, "utf8");
      const parseResult = parseJsonWithComments(content);
      if (parseResult.success && typeof parseResult.data === "object") {
        return parseResult.data as JsonObject;
      }
    } catch {
      // Return empty object if parsing fails
    }
    return {};
  }

  private async generateOxlintConfig(
    logger: EndpointLogger,
    oxlintConfig: CheckConfig["oxlint"] & { enabled: true },
  ): Promise<string> {
    const configPath = resolve(process.cwd(), oxlintConfig.configPath);
    await fs.mkdir(dirname(configPath), { recursive: true });

    // Convert jsPlugins to array of paths for .oxlintrc.json
    // Options are not yet supported by oxlint natively, used via direct import workaround
    const resolvedJsPlugins = ConfigRepositoryImpl.resolveJsPlugins(
      oxlintConfig.jsPlugins,
    );
    const oxlintConfigForFile = {
      ...oxlintConfig,
      jsPlugins: resolvedJsPlugins.length > 0 ? resolvedJsPlugins : undefined,
    };
    if (resolvedJsPlugins.length > 0) {
      logger.debug("Resolved jsPlugins paths", {
        isLocalDev: ConfigRepositoryImpl.isLocalDev(),
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

  private async generatePrettierConfig(
    logger: EndpointLogger,
    prettierConfig: CheckConfig["prettier"] & { enabled: true },
  ): Promise<string> {
    const configPath = resolve(process.cwd(), prettierConfig.configPath);
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

  private async generateEslintConfig(
    logger: EndpointLogger,
    eslintConfig: CheckConfig["eslint"] & { enabled: true },
  ): Promise<string> {
    const configPath = resolve(process.cwd(), eslintConfig.configPath);
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
// Default Repository Instance
// ============================================================

export const configRepository = new ConfigRepositoryImpl();

// Legacy export for backwards compatibility
export const ensureConfigReady =
  configRepository.ensureConfigReady.bind(configRepository);
