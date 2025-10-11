import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { logger, loggerError } from "./logger.js";

/**
 * Runs Snyk vulnerability test for a package
 */
export function runSnykTest(cwd: string, packageName: string): void {
  logger(`Running Snyk vulnerability test for ${packageName}`);

  try {
    // Check if Snyk is available
    execSync("snyk --version", { stdio: "pipe" });
  } catch (error) {
    loggerError(
      "Snyk CLI not found. Please install it with: npm install -g snyk",
      error,
    );
    // eslint-disable-next-line no-restricted-syntax
    throw new Error("Snyk CLI is required for vulnerability testing");
  }

  try {
    // Run Snyk test to check for vulnerabilities
    execSync("snyk test", {
      cwd,
      stdio: "inherit",
    });
    logger(`Snyk vulnerability test passed for ${packageName}`);
  } catch (error) {
    loggerError(`Snyk vulnerability test failed for ${packageName}:`, error);
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      `Snyk vulnerability test failed for ${packageName}. Please fix vulnerabilities before proceeding.`,
    );
  }
}

/**
 * Runs Snyk monitor to upload project to Snyk dashboard (CI mode)
 */
export function runSnykMonitor(cwd: string, packageName: string): void {
  logger(`Running Snyk monitor for ${packageName}`);

  try {
    // Check if Snyk is available
    execSync("snyk --version", { stdio: "pipe" });
  } catch (error) {
    loggerError(
      "Snyk CLI not found. Please install it with: npm install -g snyk",
      error,
    );
    // eslint-disable-next-line no-restricted-syntax
    throw new Error("Snyk CLI is required for vulnerability monitoring");
  }

  // Check if required environment variables are set
  // eslint-disable-next-line node/no-process-env
  if (!process.env["SNYK_TOKEN"]) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      "SNYK_TOKEN environment variable is required for Snyk monitoring",
    );
  }

  // eslint-disable-next-line node/no-process-env
  if (!process.env["SNYK_ORG_KEY"]) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      "SNYK_ORG_KEY environment variable is required for Snyk monitoring",
    );
  }

  try {
    // Determine lock file for monitoring
    const lockFile = getLockFile(cwd);
    const lockFileArg = lockFile ? `--file=${lockFile}` : "";

    // eslint-disable-next-line node/no-process-env
    const orgKey = process.env["SNYK_ORG_KEY"];
    const projectName = `/github/repository/${packageName}`;

    // Run Snyk monitor to upload to dashboard
    const command =
      `snyk monitor --org=${orgKey} --project-name="${projectName}" ${lockFileArg}`.trim();

    execSync(command, {
      cwd,
      stdio: "inherit",
      // eslint-disable-next-line node/no-process-env
      env: process.env,
    });

    logger(`Snyk monitor completed successfully for ${packageName}`);
  } catch (error) {
    loggerError(`Snyk monitor failed for ${packageName}:`, error);
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      `Snyk monitor failed for ${packageName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Determines the appropriate lock file for Snyk monitoring
 */
function getLockFile(cwd: string): string | null {
  const lockFiles = [
    "bun.lockb",
    "yarn.lock",
    "package-lock.json",
    "pnpm-lock.yaml",
  ];

  for (const lockFile of lockFiles) {
    if (existsSync(join(cwd, lockFile))) {
      return lockFile;
    }
  }

  return null;
}
