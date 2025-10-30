/* eslint-disable no-restricted-syntax */
import { execSync } from "node:child_process";
import { join } from "node:path";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { ReleaseOptions, ReleasePackage } from "../types/index.js";
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

// CLI Messages
const CLI_MESSAGES = {
  runningCiMode: "Running release in CI mode...",
  processingPackage: (name: string) => `Processing ${name} in CI mode...`,
  runningSnykMonitor: (name: string) => `Running Snyk monitor for ${name}`,
  errorProcessing: (name: string) => `Error processing ${name}:`,
  ciErrorsSummary:
    "The CI release process encountered the above errors for the following packages:",
  linting: (name: string) => `Linting ${name}`,
  typeChecking: (name: string) => `Type checking ${name}`,
  building: (name: string) => `Building ${name}`,
  runningTests: (name: string) => `Running tests for ${name}`,
  runningSnykTest: (name: string) =>
    `Running Snyk vulnerability test for ${name}`,
  ciReleaseRequired: (name: string) =>
    `CI mode requires ciReleaseCommand to be configured for ${name}`,
  runningCiCommand: (name: string, cmd: string) =>
    `Running CI release command for ${name}: ${cmd}`,
  envVarNotString: (name: string) =>
    `Environment variable mapping value must be a string for ${name}`,
  envVarNotSet: (value: string, name: string) =>
    `Required environment variable ${value} is not set for ${name}`,
  ciCommandSuccess: (name: string) =>
    `CI release command completed successfully for ${name}`,
  ciCommandFailed: (name: string, msg: string) =>
    `CI release command failed for ${name}: ${msg}`,
} as const;

/**
 * Runs the CI release process for packages defined in the config.
 * In CI mode:
 * - No interactive prompts
 * - No dependency updates
 * - No version bumping
 * - Uses ciReleaseCommand instead of git tagging
 */
// Helper to get environment variable safely
function getEnvVar(key: string): string | undefined {
  return process.env[key];
}

export async function ciRelease(
  configPath: string = DEFAULT_CONFIG_PATH,
  logger: EndpointLogger,
): Promise<void> {
  const configResponse = await loadConfig(logger, configPath);

  if (!configResponse.success) {
    logger.error("Failed to load config", { error: configResponse.message });
    throw new Error(configResponse.message);
  }

  const config = configResponse.data;
  logger.info(CLI_MESSAGES.runningCiMode);

  let overallError = false;
  const affectedPackages: string[] = [];
  const originalCwd = process.cwd();

  for (const pkg of config.packages) {
    const cwd = join(originalCwd, pkg.directory);
    const packageJsonResponse = getPackageJson(cwd, logger);

    if (!packageJsonResponse.success) {
      logger.error("Failed to read package.json", {
        directory: pkg.directory,
        error: packageJsonResponse.message,
      });
      affectedPackages.push(pkg.directory);
      overallError = true;
      continue;
    }

    const packageJson = packageJsonResponse.data;

    try {
      logger.info(CLI_MESSAGES.processingPackage(packageJson.name));

      // Run quality checks (no dependency updates in CI)
      runQualityChecks(pkg, cwd, packageJson.name, logger);

      // Handle release if configured
      const releaseConfig = pkg.release;
      if (releaseConfig !== false) {
        // Run Snyk monitor if configured (upload to Snyk dashboard)
        if (pkg.snyk) {
          logger.info(CLI_MESSAGES.runningSnykMonitor(packageJson.name));
          const snykResult = snykMonitor(cwd, logger);
          if (!snykResult.success) {
            throw new Error(snykResult.message);
          }
        }

        runCiReleaseCommand(releaseConfig, packageJson.name, logger);
      }
    } catch (error) {
      logger.error(
        CLI_MESSAGES.errorProcessing(packageJson.name),
        parseError(error),
      );
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
    const packagesStr = affectedPackages.join(", ");
    logger.error(CLI_MESSAGES.ciErrorsSummary, packagesStr);
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
  logger: EndpointLogger,
): void {
  if (pkg.lint) {
    logger.info(CLI_MESSAGES.linting(packageName));
    const lintResult = lint(cwd, logger);
    if (!lintResult.success) {
      throw new Error(lintResult.message);
    }
  }

  if (pkg.typecheck) {
    logger.info(CLI_MESSAGES.typeChecking(packageName));
    const typecheckResult = typecheck(cwd, logger);
    if (!typecheckResult.success) {
      throw new Error(typecheckResult.message);
    }
  }

  if (pkg.build) {
    logger.info(CLI_MESSAGES.building(packageName));
    const buildResult = build(cwd, logger);
    if (!buildResult.success) {
      throw new Error(buildResult.message);
    }
  }

  if (pkg.test) {
    logger.info(CLI_MESSAGES.runningTests(packageName));
    const testResult = runTests(cwd, logger);
    if (!testResult.success) {
      throw new Error(testResult.message);
    }
  }

  if (pkg.snyk) {
    logger.info(CLI_MESSAGES.runningSnykTest(packageName));
    const snykResult = snykTest(cwd, logger);
    if (!snykResult.success) {
      throw new Error(snykResult.message);
    }
  }
}

/**
 * Runs the CI release command if configured
 */
function runCiReleaseCommand(
  releaseConfig: ReleaseOptions,
  packageName: string,
  logger: EndpointLogger,
): void {
  if (!releaseConfig.ciReleaseCommand) {
    const errorMsg = CLI_MESSAGES.ciReleaseRequired(packageName);
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const { command, env } = releaseConfig.ciReleaseCommand;
  const commandStr = command.join(" ");

  logger.info(CLI_MESSAGES.runningCiCommand(packageName, commandStr));

  // Prepare environment variables
  const ciEnv: Record<string, string> = {};

  // Copy all environment variables

  for (const key in process.env) {
    const value = getEnvVar(key);
    if (value !== undefined) {
      ciEnv[key] = value;
    }
  }

  if (env) {
    for (const [key, value] of Object.entries(env)) {
      if (typeof value !== "string") {
        const errorMsg = CLI_MESSAGES.envVarNotString(packageName);
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      const envValue = getEnvVar(value);
      if (!envValue) {
        const errorMsg = CLI_MESSAGES.envVarNotSet(value, packageName);
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      ciEnv[key] = envValue;
    }
  }

  try {
    execSync(commandStr, {
      stdio: "inherit",
      env: ciEnv as NodeJS.ProcessEnv,
    });
    logger.info(CLI_MESSAGES.ciCommandSuccess(packageName));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const errorMsg = CLI_MESSAGES.ciCommandFailed(packageName, msg);
    logger.error(errorMsg);
    throw new Error(errorMsg, { cause: error });
  }
}
