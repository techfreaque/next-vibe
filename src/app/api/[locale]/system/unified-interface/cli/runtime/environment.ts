import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { config } from "dotenv";

import { Platform } from "../../shared/types/platform";

/** CLI-specific platforms (subset of Platform that applies to CLI environments) */
export type CliPlatform = typeof Platform.CLI | typeof Platform.CLI_PACKAGE;

/** Result of environment loading */
export interface EnvironmentResult {
  /** Detected platform - always CLI or CLI_PACKAGE in CLI runtime */
  platform: CliPlatform;
  /** Path to .env file if found */
  envPath: string | null;
  /** Path to project root if found */
  projectRoot: string | null;
  /** Whether running from npm package */
  isPackage: boolean;
}

/** Global storage for environment result (set once at startup) */
let cachedEnvironmentResult: EnvironmentResult | null = null;

/**
 * Detect if running from npm package vs local development
 * Checks:
 * 1. If script path contains node_modules
 * 2. If we're in a next-vibe project structure
 */
function detectIsPackage(): boolean {
  // Check if the main script is running from node_modules
  const mainScript = process.argv[1] || "";
  if (mainScript.includes("node_modules")) {
    return true;
  }

  // Check if we're in the next-vibe project (has src/app/api structure)
  const cwd = process.cwd();
  const localVibeStructure = join(cwd, "src/app/api/[locale]");
  if (existsSync(localVibeStructure)) {
    return false; // Local development
  }

  // Check if script is running from .dist/bin in a non-project context
  if (mainScript.includes(".dist/bin/vibe-runtime")) {
    // Could be local dist or package dist - check for src folder
    const scriptDir = dirname(mainScript);
    const projectRoot = resolve(scriptDir, "../..");
    const srcPath = join(projectRoot, "src/app/api/[locale]");
    if (!existsSync(srcPath)) {
      return true; // Running from package
    }
  }

  return false;
}

/**
 * Load environment variables and detect platform
 * Returns the detected platform for use in CLI initialization
 */
export function loadEnvironment(): EnvironmentResult {
  // Return cached result if already loaded
  if (cachedEnvironmentResult) {
    return cachedEnvironmentResult;
  }

  const envFileName = ".env";
  let envPath: string | null = null;
  let projectRoot: string | null = null;

  // Detect if running from package
  const isPackage = detectIsPackage();

  // Strategy 1: Look for .env file starting from current directory and going up
  let currentDir = process.cwd();
  while (currentDir !== dirname(currentDir)) {
    const potentialEnvPath = join(currentDir, envFileName);
    if (existsSync(potentialEnvPath)) {
      envPath = potentialEnvPath;
      projectRoot = currentDir;
      break;
    }
    currentDir = dirname(currentDir);
  }

  // Strategy 2: If not found, look for package.json to identify project root
  // This handles cases where MCP Inspector starts the process from a different directory
  if (!envPath) {
    let searchDir = process.cwd();
    while (searchDir !== dirname(searchDir)) {
      const packageJsonPath = join(searchDir, "package.json");
      if (existsSync(packageJsonPath)) {
        // Found package.json, this is likely the project root
        projectRoot = searchDir;
        const potentialEnvPath = join(searchDir, envFileName);
        if (existsSync(potentialEnvPath)) {
          envPath = potentialEnvPath;
          break;
        }
      }
      searchDir = dirname(searchDir);
    }
  }

  // Strategy 3: Try common project locations relative to node_modules
  if (!envPath) {
    // If this script is in node_modules or installed globally, try to find project root
    const possibleRoots = [
      resolve(process.cwd(), ".."),
      resolve(process.cwd(), "../.."),
      resolve(process.cwd(), "../../.."),
    ];

    for (const root of possibleRoots) {
      const potentialEnvPath = join(root, envFileName);
      if (existsSync(potentialEnvPath)) {
        envPath = potentialEnvPath;
        projectRoot = root;
        break;
      }
    }
  }

  // Load the .env file if found
  if (envPath) {
    config({ path: envPath, quiet: true });
  } else {
    // Fallback to default dotenv behavior
    config({ quiet: true });
  }

  // Determine platform based on detection
  const platform = isPackage ? Platform.CLI_PACKAGE : Platform.CLI;

  // Cache and return result
  cachedEnvironmentResult = {
    platform,
    envPath,
    projectRoot,
    isPackage,
  };

  return cachedEnvironmentResult;
}

/**
 * Get the cached environment result
 * Must be called after loadEnvironment()
 */
export function getEnvironmentResult(): EnvironmentResult | null {
  return cachedEnvironmentResult;
}
