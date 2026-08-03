import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

// Captured before dotenv runs — used as the "this process started now" fallback
// when VIBE_START_TIME is not already in the environment.
const MODULE_LOAD_TIME = Date.now();

import { config } from "dotenv";
import { Platform } from "../../platforms";

import { runtimeEnvPlaceholder } from "./runtime-env-placeholders";

/** CLI-specific platforms (subset of Platform that applies to CLI environments) */
type CliPlatform = typeof Platform.CLI | typeof Platform.CLI_PACKAGE;

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

function detectIsPackage(): boolean {
  const mainScript = process.argv[1] || "";
  if (mainScript.includes("node_modules")) {
    return true;
  }
  if (existsSync(join(process.cwd(), "src"))) {
    return false;
  }
  if (mainScript.includes(".dist/bin/vibe-runtime")) {
    const root = join(dirname(mainScript), "../..");
    if (!existsSync(join(root, "src"))) {
      return true;
    }
  }
  return false;
}

/**
 * Load dotenv and stamp process.env with the startup-time values that domain
 * env singletons need to see when they evaluate. Domain env files (env.ts in
 * each feature) compute their own defaults from process.argv and write back to
 * process.env as a module-level side effect when first imported.
 */
export function loadEnvironment(): EnvironmentResult {
  if (cachedEnvironmentResult) {
    return cachedEnvironmentResult;
  }

  const isPackage = detectIsPackage();
  let envPath: string | null = null;
  let projectRoot: string | null = null;

  // Strategy 1: walk up from cwd
  let dir = process.cwd();
  while (dir !== dirname(dir)) {
    const candidate = join(dir, ".env");
    if (existsSync(candidate)) {
      envPath = candidate;
      projectRoot = dir;
      break;
    }
    dir = dirname(dir);
  }

  // Strategy 2: walk up via package.json
  if (!envPath) {
    let searchDir = process.cwd();
    while (searchDir !== dirname(searchDir)) {
      if (existsSync(join(searchDir, "package.json"))) {
        projectRoot = searchDir;
        const candidate = join(searchDir, ".env");
        if (existsSync(candidate)) {
          envPath = candidate;
          break;
        }
      }
      searchDir = dirname(searchDir);
    }
  }

  // Strategy 3: common relative locations
  if (!envPath) {
    for (const rel of ["../", "../../", "../../../"]) {
      const root = join(process.cwd(), rel);
      const candidate = join(root, ".env");
      if (existsSync(candidate)) {
        envPath = candidate;
        projectRoot = root;
        break;
      }
    }
  }

  // Auto-copy .env.example → .env on fresh clone
  if (!envPath && projectRoot) {
    const examplePath = join(projectRoot, ".env.example");
    const targetPath = join(projectRoot, ".env");
    if (existsSync(examplePath) && !existsSync(targetPath)) {
      try {
        copyFileSync(examplePath, targetPath);
        envPath = targetPath;
      } catch {
        /* proceed */
      }
    }
  }

  // Snapshot caller env before dotenv overwrites (MCP .mcp.json "env" block wins).
  const callerEnv = { ...process.env };

  if (envPath) {
    config({ path: envPath, quiet: true, override: true });
  } else {
    config({ quiet: true, override: true });
  }

  // Re-apply caller env — explicit process env wins over .env file.
  for (const key in callerEnv) {
    if (callerEnv[key] !== undefined && process.env[key] !== callerEnv[key]) {
      process.env[key] = callerEnv[key];
    }
  }

  // Stamp start time so domain env singletons see it in process.env when they evaluate.
  if (!process.env["VIBE_START_TIME"]) {
    process.env["VIBE_START_TIME"] = String(MODULE_LOAD_TIME);
  }

  // Docker prod build: bake placeholder sentinels into NEXT_PUBLIC_* so the
  // image works across instances. Runtime patches the bundle at container start.
  if (process.env["VIBE_BUILD_PLACEHOLDER_ENV"] === "true") {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("NEXT_PUBLIC_")) {
        process.env[key] = runtimeEnvPlaceholder(key);
      }
    }
  }

  const platform = isPackage ? Platform.CLI_PACKAGE : Platform.CLI;
  cachedEnvironmentResult = { platform, envPath, projectRoot, isPackage };
  return cachedEnvironmentResult;
}

// Auto-load as module side effect — ensures dotenv is loaded before any domain
// env singleton evaluates (ES module imports are ordered by dependency graph).
loadEnvironment();
