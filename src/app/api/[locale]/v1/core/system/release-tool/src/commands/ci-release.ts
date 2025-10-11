import { execSync } from "node:child_process";
import { join } from "node:path";

import type {
  ReleaseConfig,
  ReleaseOptions,
  ReleasePackage,
} from "../types/index.js";
import { logger, loggerError } from "../utils/logger.js";
import { getPackageJson } from "../utils/package-json.js";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../utils/release-config.js";
import {
  build,
  lint,
  runTests,
  snykMonitor,
  snykTest,
  typecheck,
} from "../utils/scripts.js";

/**
 * Runs the CI release process for packages defined in the config.
 * In CI mode:
 * - No interactive prompts
 * - No dependency updates
 * - No version bumping
 * - Uses ciReleaseCommand instead of git tagging
 */
export async function ciRelease(
  configPath: string = DEFAULT_CONFIG_PATH,
): Promise<void> {
  const config: ReleaseConfig = await loadConfig(configPath);

  logger("Running release in CI mode...");

  let overallError = false;
  const affectedPackages: string[] = [];
  const originalCwd = process.cwd();

  for (const pkg of config.packages) {
    const cwd = join(originalCwd, pkg.directory);
    const packageJson = getPackageJson(cwd);

    try {
      logger(`Processing ${packageJson.name} in CI mode...`);

      // Run quality checks (no dependency updates in CI)
      runQualityChecks(pkg, cwd, packageJson.name);

      // Handle release if configured
      const releaseConfig = pkg.release;
      if (releaseConfig !== false) {
        // Run Snyk monitor if configured (upload to Snyk dashboard)
        if (pkg.snyk) {
          logger(`Running Snyk monitor for ${packageJson.name}`);
          snykMonitor(cwd);
        }

        runCiReleaseCommand(releaseConfig, packageJson.name);
      }
    } catch (error) {
      loggerError(`Error processing ${packageJson.name}:`, error);
      affectedPackages.push(pkg.directory);
      overallError = true;
    }

    try {
      process.chdir(originalCwd);
    } catch {
      // ignore
    }
  }

  if (overallError) {
    loggerError(
      "The CI release process encountered the above errors for the following packages:",
      affectedPackages.join(", "),
    );
    process.exit(1);
  }
}

/**
 * Runs quality checks for a package in CI mode
 */
function runQualityChecks(
  pkg: ReleasePackage,
  cwd: string,
  packageName: string,
): void {
  if (pkg.lint) {
    logger(`Linting ${packageName}`);
    lint(cwd);
  }

  if (pkg.typecheck) {
    logger(`Type checking ${packageName}`);
    typecheck(cwd);
  }

  if (pkg.build) {
    logger(`Building ${packageName}`);
    build(cwd);
  }

  if (pkg.test) {
    logger(`Running tests for ${packageName}`);
    runTests(cwd);
  }

  if (pkg.snyk) {
    logger(`Running Snyk vulnerability test for ${packageName}`);
    snykTest(cwd);
  }
}

/**
 * Runs the CI release command if configured
 */
function runCiReleaseCommand(
  releaseConfig: ReleaseOptions,
  packageName: string,
): void {
  if (!releaseConfig.ciReleaseCommand) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      `CI mode requires ciReleaseCommand to be configured for ${packageName}`,
    );
  }

  const { command, env } = releaseConfig.ciReleaseCommand;

  logger(`Running CI release command for ${packageName}: ${command.join(" ")}`);

  // Prepare environment variables
  // eslint-disable-next-line node/no-process-env
  const ciEnv = { ...process.env };
  if (env) {
    for (const [key, value] of Object.entries(env)) {
      if (typeof value !== "string") {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error(
          `Environment variable mapping value must be a string for ${packageName}`,
        );
      }
      // eslint-disable-next-line node/no-process-env
      const envValue = process.env[value];
      if (!envValue) {
        // eslint-disable-next-line no-restricted-syntax
        throw new Error(
          `Required environment variable ${value} is not set for ${packageName}`,
        );
      }
      ciEnv[key] = envValue;
    }
  }

  try {
    execSync(command.join(" "), {
      stdio: "inherit",
      env: ciEnv,
    });
    logger(`CI release command completed successfully for ${packageName}`);
  } catch (error) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      `CI release command failed for ${packageName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
