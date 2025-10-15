import { existsSync, mkdirSync, renameSync, rmSync, unlinkSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

import { build } from "vite";

import type { LaunchpadConfig } from "../types/types.js";
import { logger, loggerError } from "./logger.js";

export const DEFAULT_CONFIG_PATH = "launchpad.config.ts";

// Store the config directory once found for reference
let configRootDir: string | null = null;

// Get the root directory from the config file location
export function getRootDirectory(): string {
  if (!configRootDir) {
    throw new Error("Config has not been loaded yet. Call loadConfig first.");
  }
  return configRootDir;
}

async function getCompiledConfigPath(configPath: string): Promise<string> {
  const outputFileName = `release.config.tmp.${Math.round(Math.random() * 100000)}.cjs`;
  const outputDir = dirname(configPath);
  const outputFilePath = join(outputDir, outputFileName);
  const outputTmpDir = join(outputDir, "tmp");
  const outputFileTmpPath = join(outputTmpDir, outputFileName);

  try {
    // Ensure tmp dir exists
    if (!existsSync(outputTmpDir)) {
      logger(`creating tmp dir ${outputTmpDir}`);
      process.umask(0);
      mkdirSync(outputTmpDir, { recursive: true });
    }

    await build({
      plugins: [],
      build: {
        lib: {
          entry: configPath,
          formats: ["cjs"],
          fileName: () => outputFileName,
        },
        outDir: outputTmpDir,
        emptyOutDir: false,
        sourcemap: false,
      },
    });
    renameSync(join(outputTmpDir, outputFileName), outputFilePath);
    rmSync(outputTmpDir, { force: true, recursive: true });
    return outputFilePath;
  } catch (error) {
    // // Clean up in case of an error
    try {
      unlinkSync(outputFileTmpPath);
    } catch (_cleanupError) {
      /* empty */
    }
    try {
      unlinkSync(outputFilePath);
    } catch (_cleanupError) {
      /* empty */
    }
    throw error;
  }
}

function cleanCompiledConfig(compiledConfigPath: string): void {
  unlinkSync(compiledConfigPath);
}

/**
 * Finds the config file by searching from the current directory up to the root.
 * @param configFileName The name of the config file to find
 * @returns The absolute path of the config file if found, null otherwise
 */
function findConfigUp(configFileName: string): string | null {
  let currentDir = process.cwd();
  const { root } = parse(currentDir);

  // Search up to the root directory
  while (currentDir !== root) {
    const filePath = join(currentDir, configFileName);
    if (existsSync(filePath)) {
      return filePath;
    }
    // Move up one directory
    const parentDir = dirname(currentDir);
    // If we're already at the root, break to avoid infinite loop
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  // Check the root directory
  const rootConfigPath = join(root, configFileName);
  if (existsSync(rootConfigPath)) {
    return rootConfigPath;
  }

  return null;
}

/**
 * Loads and returns the configuration.
 * @param explicitConfigPath Optional path to the config file
 */
/**
 * Type guard to validate that an imported module has the expected LaunchpadConfig structure
 */
function isLaunchpadConfigModule(
  module: unknown,
): module is { default: LaunchpadConfig } {
  if (typeof module !== "object" || module === null) {
    return false;
  }
  if (!("default" in module)) {
    return false;
  }
  const defaultExport = (module as { default: unknown }).default;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  if (!("packages" in defaultExport)) {
    return false;
  }
  const packages = (defaultExport as { packages: unknown }).packages;
  return typeof packages === "object" && packages !== null;
}

export async function loadConfig(
  explicitConfigPath?: string,
): Promise<LaunchpadConfig> {
  const configPath = explicitConfigPath || DEFAULT_CONFIG_PATH;
  let resolvedConfigPath: string;

  if (explicitConfigPath) {
    // If explicit path is provided, use it directly
    resolvedConfigPath = resolve(process.cwd(), configPath);
    if (!existsSync(resolvedConfigPath)) {
      throw new Error(`Config file not found: ${resolvedConfigPath}`);
    }
  } else {
    // Otherwise search up from cwd
    const foundConfigPath = findConfigUp(configPath);
    if (!foundConfigPath) {
      throw new Error(
        `Config file ${configPath} not found in current or parent directories`,
      );
    }
    resolvedConfigPath = foundConfigPath;
  }

  // Store the config directory as the root directory for the application
  configRootDir = dirname(resolvedConfigPath);
  logger(`Using config file: ${resolvedConfigPath}`);
  logger(`Root directory set to: ${configRootDir}`);

  try {
    // const compiledConfigPath = await getCompiledConfigPath(resolvedConfigPath);
    const importedModule = await import(`file://${resolvedConfigPath}`);

    if (!isLaunchpadConfigModule(importedModule)) {
      throw new Error(
        "Invalid config format. Ensure the config exports a default object with a 'packages' object. Check the docs for more info.",
      );
    }

    const config = importedModule.default;
    // cleanCompiledConfig(compiledConfigPath);

    return config;
  } catch (error) {
    loggerError("Error loading config:", error);
    throw error;
  }
}
