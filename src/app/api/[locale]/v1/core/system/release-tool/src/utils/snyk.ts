/// <reference types="node" />
/* eslint-disable no-restricted-syntax, node/no-process-env */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

/**
 * Runs Snyk vulnerability test for a package
 */
export function runSnykTest(
  cwd: string,
  packageName: string,
  logger: EndpointLogger,
): ResponseType<void> {
  logger.info(`Running Snyk vulnerability test for ${packageName}`);

  try {
    // Check if Snyk is available
    // eslint-disable-next-line i18next/no-literal-string
    execSync("snyk --version", { stdio: "pipe" });
  } catch (error) {
    logger.error(
      "Snyk CLI not found. Please install it with: npm install -g snyk",
      error,
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.cliNotFound",
      ErrorResponseTypes.NOT_FOUND,
      { packageName },
    );
  }

  try {
    // Run Snyk test to check for vulnerabilities
    // eslint-disable-next-line i18next/no-literal-string
    execSync("snyk test", {
      cwd,
      // eslint-disable-next-line i18next/no-literal-string
      stdio: "inherit",
    });
    logger.info(`Snyk vulnerability test passed for ${packageName}`);
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(`Snyk vulnerability test failed for ${packageName}:`, error);
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.testFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { packageName, error: String(error) },
    );
  }
}

/**
 * Runs Snyk monitor to upload project to Snyk dashboard (CI mode)
 */
export function runSnykMonitor(
  cwd: string,
  packageName: string,
  logger: EndpointLogger,
): ResponseType<void> {
  logger.info(`Running Snyk monitor for ${packageName}`);

  try {
    // Check if Snyk is available
    // eslint-disable-next-line i18next/no-literal-string
    execSync("snyk --version", { stdio: "pipe" });
  } catch (error) {
    logger.error(
      "Snyk CLI not found. Please install it with: npm install -g snyk",
      error,
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.cliNotFound",
      ErrorResponseTypes.NOT_FOUND,
      { packageName },
    );
  }

  // Check if required environment variables are set
  const env = { ...process.env };
  // eslint-disable-next-line i18next/no-literal-string
  if (!env["SNYK_TOKEN"]) {
    logger.error(
      "SNYK_TOKEN environment variable is required for Snyk monitoring",
      undefined,
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.tokenRequired",
      ErrorResponseTypes.INVALID_FORMAT_ERROR,
      { packageName },
    );
  }

  // eslint-disable-next-line i18next/no-literal-string
  if (!env["SNYK_ORG_KEY"]) {
    logger.error(
      "SNYK_ORG_KEY environment variable is required for Snyk monitoring",
      undefined,
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.orgKeyRequired",
      ErrorResponseTypes.INVALID_FORMAT_ERROR,
      { packageName },
    );
  }

  try {
    // Determine lock file for monitoring
    const lockFile = getLockFile(cwd);
    // eslint-disable-next-line i18next/no-literal-string
    const lockFileArg = lockFile ? `--file=${lockFile}` : "";

    // eslint-disable-next-line i18next/no-literal-string
    const orgKey = env["SNYK_ORG_KEY"];
    // eslint-disable-next-line i18next/no-literal-string
    const projectName = `/github/repository/${packageName}`;

    // Run Snyk monitor to upload to dashboard
    const command =
      // eslint-disable-next-line i18next/no-literal-string
      `snyk monitor --org=${orgKey} --project-name="${projectName}" ${lockFileArg}`.trim();

    execSync(command, {
      cwd,
      // eslint-disable-next-line i18next/no-literal-string
      stdio: "inherit",
      env,
    });

    logger.info(`Snyk monitor completed successfully for ${packageName}`);
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(`Snyk monitor failed for ${packageName}:`, error);
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.snyk.monitorFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { packageName, error: String(error) },
    );
  }
}

/**
 * Determines the appropriate lock file for Snyk monitoring
 */
function getLockFile(cwd: string): string | null {
  const lockFiles = [
    // eslint-disable-next-line i18next/no-literal-string
    "bun.lockb",
    // eslint-disable-next-line i18next/no-literal-string
    "yarn.lock",
    // eslint-disable-next-line i18next/no-literal-string
    "package-lock.json",
    // eslint-disable-next-line i18next/no-literal-string
    "pnpm-lock.yaml",
  ];

  for (const lockFile of lockFiles) {
    if (existsSync(join(cwd, lockFile))) {
      return lockFile;
    }
  }

  return null;
}
