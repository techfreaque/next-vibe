/**
 * Oxlint Config Generator
 *
 * Converts the TypeScript oxlint.config.ts to JSON format that oxlint can consume.
 * This allows us to use TypeScript logic and switches while maintaining oxlint compatibility.
 */

import { existsSync, promises as fs } from "node:fs";
import { resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import { parseError } from "../../../shared/utils/parse-error";
import type {
  OxlintConfig,
  OxlintPrettierEslintConfig,
} from "./types";

/**
 * Generate oxlint JSON config from TypeScript config
 * Note: Prettier config is now passed inline via CLI flags
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
    const projectRoot = process.cwd();
    const tsConfigPath = resolve(projectRoot, "lint.config.ts");
    const jsonConfigPath = resolve(cacheDir, ".oxlintrc.json");

    // Check if TypeScript config exists
    if (!existsSync(tsConfigPath)) {
      return {
        success: false,
        configPath: jsonConfigPath,
        // eslint-disable-next-line i18next/no-literal-string
        error: "lint.config.ts not found in project root",
      };
    }

    logger.debug("Loading lint.config.ts", { path: tsConfigPath });

    // Dynamic import of the TypeScript config
    // We need to use a file:// URL for Windows compatibility
    const configModule = await import(`file://${tsConfigPath}`);
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

    // Extract oxlint config (prettier is handled inline)
    const oxlintConfig: OxlintConfig = fullConfig.oxlint || fullConfig;

    // Convert to JSON with pretty formatting
    const oxlintJsonContent = JSON.stringify(oxlintConfig, null, 2);

    // Write to .oxlintrc.json
    await fs.writeFile(jsonConfigPath, oxlintJsonContent, "utf8");

    logger.debug("Generated .oxlintrc.json", { path: jsonConfigPath });

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
