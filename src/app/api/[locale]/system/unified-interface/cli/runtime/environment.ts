import { copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { config } from "dotenv";

import {
  BUILD_ALIAS,
  BUILD_SERVER_ALIAS,
} from "../../../server/build/constants";
import { REBUILD_ALIAS } from "../../../server/rebuild/constants";
import {
  START_ALIAS,
  START_SERVER_ALIAS,
} from "../../../server/start/constants";
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

  // Auto-copy .env.example → .env on fresh clone when no .env exists
  if (!envPath && projectRoot) {
    const examplePath = join(projectRoot, ".env.example");
    const targetPath = join(projectRoot, ".env");
    if (existsSync(examplePath) && !existsSync(targetPath)) {
      try {
        copyFileSync(examplePath, targetPath);
        envPath = targetPath;
      } catch {
        // ignore - proceed without .env
      }
    }
  }

  // Snapshot all caller-provided env vars before dotenv overwrites them.
  // These are intentional overrides (e.g. from .mcp.json "env" block)
  // that must take priority over .env file values.
  const callerEnv = { ...process.env };

  // Load the .env file if found.
  // Use override: true so .env values always win over inherited shell env vars.
  // This prevents stale DATABASE_URL (e.g. from a previous `vibe start` session
  // that swapped to preview port 5433) from leaking into CLI/MCP commands.
  if (envPath) {
    config({ path: envPath, quiet: true, override: true });
  } else {
    // Fallback to default dotenv behavior
    config({ quiet: true, override: true });
  }

  // Re-apply caller env vars that dotenv overwrote.
  // Explicit process env (e.g. NODE_ENV=production from .mcp.json) wins over .env file.
  for (const key in callerEnv) {
    if (callerEnv[key] !== undefined && process.env[key] !== callerEnv[key]) {
      process.env[key] = callerEnv[key];
    }
  }

  // Activate local/preview mode for `vibe build` / `vibe start` (or --preview).
  // Derives preview DATABASE_URL and NEXT_PUBLIC_APP_URL by swapping ports,
  // using PREVIEW_DB_PORT (default 5433) and PREVIEW_PORT (default 3001).
  // Must happen BEFORE the env singleton is created by defineEnv().
  //
  // --local is an explicit override - always targets the local DB (5433) regardless
  // of NODE_ENV. This allows MCP (NODE_ENV=production) to hit the local preview DB.
  // Other triggers (build/start/rebuild) only apply in non-production to avoid
  // accidentally switching a real prod server's DB.
  const args = process.argv.slice(2);
  const isProduction = process.env["NODE_ENV"] === "production";
  const hasLocalFlag = args.includes("--preview") || args.includes("--local");
  const isPreviewMode =
    hasLocalFlag ||
    (!isProduction &&
      (args.includes(START_ALIAS) ||
        args.includes(START_SERVER_ALIAS) ||
        args.includes(BUILD_ALIAS) ||
        args.includes(BUILD_SERVER_ALIAS) ||
        args.includes(REBUILD_ALIAS)));

  // Expose preview mode flag so tasks can distinguish vibe start from vibe dev.
  // Explicitly set to "false" when not in preview mode to clear any stale shell env.
  process.env["IS_PREVIEW_MODE"] = isPreviewMode ? "true" : "false";

  // vibe start/build/rebuild always run in production mode - force NODE_ENV so
  // dev-only task runners (e.g. devWatcher) stay disabled.
  if (isPreviewMode) {
    // eslint-disable-next-line i18next/no-literal-string
    (process.env as Record<string, string>)["NODE_ENV"] = "production";
  }

  if (isPreviewMode && !args.includes("--skip-db-setup")) {
    const previewDbPort = process.env["PREVIEW_DB_PORT"] || "5433";
    const previewPort = process.env["PREVIEW_PORT"] || "3001";

    // Derive preview DATABASE_URL by swapping the port
    const dbUrl = process.env["DATABASE_URL"];
    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        parsed.port = previewDbPort;
        process.env["DATABASE_URL"] = parsed.toString();
      } catch {
        // If URL parsing fails, leave DATABASE_URL unchanged
      }
    }

    process.env["NEXT_PUBLIC_LOCAL_MODE"] = "true";

    // Derive preview NEXT_PUBLIC_APP_URL by swapping the port (localhost only)
    // Skip for production URLs (e.g. https://unbottled.ai) to avoid breaking real deployments
    const appUrl = process.env["NEXT_PUBLIC_APP_URL"];
    if (appUrl) {
      try {
        const parsed = new URL(appUrl);
        if (
          parsed.hostname === "localhost" ||
          parsed.hostname === "127.0.0.1"
        ) {
          parsed.port = previewPort;
          process.env["NEXT_PUBLIC_APP_URL"] = parsed.toString();
        }
      } catch {
        // If URL parsing fails, leave NEXT_PUBLIC_APP_URL unchanged
      }
    }
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

// Auto-load environment as a module side effect.
// This ensures process.env is populated (including DATABASE_URL overrides
// for `vibe start`) BEFORE @/config/env evaluates the env singleton,
// since ES module imports are evaluated in dependency order.
loadEnvironment();
