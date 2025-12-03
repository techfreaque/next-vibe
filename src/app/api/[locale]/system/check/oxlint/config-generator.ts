/**
 * Oxlint Config Generator
 *
 * Converts the TypeScript oxlint.config.ts to JSON format that oxlint can consume.
 * This allows us to use TypeScript logic and switches while maintaining oxlint compatibility.
 */

import { existsSync, promises as fs } from "node:fs";
import { resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../shared/utils/parse-error";
import type { OxlintConfig, OxlintPrettierEslintConfig } from "./types";
import { LINT_CONFIG_PATH } from "./repository";

/**
 * Generate oxlint JSON config from TypeScript config
 * Also generates .oxfmtrc.json for the VSCode extension formatter
 */
export async function generateOxlintConfig(
  logger: EndpointLogger,
  cacheDir: string,
): Promise<{
  success: boolean;
  configPath: string;
  error?: string;
}> {
  try {
    const jsonConfigPath = resolve(cacheDir, ".oxlintrc.json");
    const fmtConfigPath = resolve(cacheDir, ".oxfmtrc.json");

    logger.debug("Loading lint.config.ts", { path: LINT_CONFIG_PATH });

    // Dynamic import of the TypeScript config
    const configModule = await import(LINT_CONFIG_PATH);
    const fullConfig: OxlintPrettierEslintConfig =
      configModule.config || configModule.default;

    if (!fullConfig) {
      return {
        success: false,
        configPath: jsonConfigPath,
        // eslint-disable-next-line i18next/no-literal-string
        error: "lint.config.ts must export 'config' or 'default'",
      };
    }

    // Extract oxlint config
    const oxlintConfig: OxlintConfig = fullConfig.oxlint || fullConfig;

    // Convert to JSON with pretty formatting
    const oxlintJsonContent = JSON.stringify(oxlintConfig, null, 2);

    // Write to .oxlintrc.json
    await fs.writeFile(jsonConfigPath, oxlintJsonContent, "utf8");

    logger.debug("Generated .oxlintrc.json", { path: jsonConfigPath });

    // Generate .oxfmtrc.json for VSCode extension formatter in .tmp folder
    logger.debug("Checking prettier config", {
      hasPrettier: !!fullConfig.prettier,
    });

    if (fullConfig.prettier) {
      const fmtConfig = {
        semi: fullConfig.prettier.semi ?? true,
        singleQuote: fullConfig.prettier.singleQuote ?? false,
        trailingComma: fullConfig.prettier.trailingComma ?? "all",
        tabWidth: fullConfig.prettier.tabWidth ?? 2,
        useTabs: fullConfig.prettier.useTabs ?? false,
        printWidth: fullConfig.prettier.printWidth ?? 80,
        arrowParens: fullConfig.prettier.arrowParens ?? "always",
        endOfLine: fullConfig.prettier.endOfLine ?? "lf",
        bracketSpacing: fullConfig.prettier.bracketSpacing ?? true,
        jsxSingleQuote: fullConfig.prettier.jsxSingleQuote ?? false,
      };

      const fmtJsonContent = JSON.stringify(fmtConfig, null, 2);
      await fs.writeFile(fmtConfigPath, fmtJsonContent, "utf8");

      logger.debug("Generated .oxfmtrc.json", { path: fmtConfigPath });
    } else {
      logger.warn("No prettier config found in lint.config.ts");
    }

    return {
      success: true,
      configPath: jsonConfigPath,
    };
  } catch (error) {
    const errorMessage = parseError(error).message;
    logger.error("Failed to generate oxlint config", { error: errorMessage });

    return {
      success: false,
      configPath: resolve(cacheDir, ".oxlintrc.json"),
      error: errorMessage,
    };
  }
}

/**
 * Check if config needs regeneration (TS file is newer than JSON)
 */
export async function needsConfigRegeneration(
  logger: EndpointLogger,
  cacheDir: string,
): Promise<boolean> {
  try {
    const projectRoot = process.cwd();
    const tsConfigPath = resolve(projectRoot, "lint.config.ts");
    const jsonConfigPath = resolve(cacheDir, ".oxlintrc.json");

    if (!existsSync(tsConfigPath)) {
      return false;
    }

    if (!existsSync(jsonConfigPath)) {
      return true;
    }

    // Check modification times
    const tsStats = await fs.stat(tsConfigPath);
    const jsonStats = await fs.stat(jsonConfigPath);

    // If TS file is newer, regenerate
    return tsStats.mtime > jsonStats.mtime;
  } catch (error) {
    logger.debug("Error checking config regeneration need", {
      error: parseError(error).message,
    });
    return true; // Regenerate on error to be safe
  }
}
