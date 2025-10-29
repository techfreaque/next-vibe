/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import inquirer from "inquirer";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { PackageJson, ReleasePackage } from "../types/index.js";

/**
 * Type guard to validate if parsed JSON matches PackageJson structure
 */
function isPackageJson(value: unknown): value is PackageJson {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return typeof obj.name === "string" && typeof obj.version === "string";
}

/**
 * Reads the package.json file for a package and returns its contents.
 */
export function getPackageJson(
  cwd: string,
  logger: EndpointLogger,
): ResponseType<PackageJson> {
  const packageJsonPath = join(cwd, "package.json");
  if (!existsSync(packageJsonPath)) {
    logger.error("Package.json not found", { path: packageJsonPath });
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.packageJson.notFound",
      ErrorResponseTypes.NOT_FOUND,
      { path: packageJsonPath },
    );
  }

  try {
    const parsedJson: unknown = JSON.parse(
      readFileSync(packageJsonPath, "utf8"),
    );
    if (!isPackageJson(parsedJson)) {
      logger.error("Invalid package.json format", { path: packageJsonPath });
      return createErrorResponse(
        "app.api.v1.core.system.releaseTool.packageJson.invalidFormat",
        ErrorResponseTypes.INVALID_FORMAT_ERROR,
        { path: packageJsonPath },
      );
    }
    return createSuccessResponse(parsedJson);
  } catch (error) {
    logger.error("Error reading package.json", parseError(error));
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.packageJson.errorReading",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: String(error) },
    );
  }
}

/**
 * Updates a dependency version in the package.json.
 * An optional requireFn can be provided for testing.
 */
export async function updateDependencies(
  pkg: ReleasePackage,
  packageManager: string,
  cwd: string,
  logger: EndpointLogger,
): Promise<ResponseType<void>> {
  if (pkg.updateDeps !== "force") {
    const { shouldUpdate } = await inquirer.prompt<{
      shouldUpdate: boolean;
    }>([
      {
        type: "confirm",
        name: "shouldUpdate",
        // eslint-disable-next-line i18next/no-literal-string
        message: `Update dependencies for ${pkg.directory}?`,
        default: false,
      },
    ]);

    if (!shouldUpdate) {
      logger.info(`Skipping dependency updates for ${pkg.directory}`);
      return createSuccessResponse(undefined);
    }
  }

  const packageJsonResponse = getPackageJson(cwd, logger);
  if (!packageJsonResponse.success) {
    return packageJsonResponse;
  }

  const packageJson = packageJsonResponse.data;

  try {
    const ignoreList = packageJson.updateIgnoreDependencies || [];

    // Build ignore list arguments

    const ignoreArg =
      ignoreList.length > 0 ? `--reject ${ignoreList.join(",")}` : "";

    logger.info(`Updating dependencies for ${pkg.directory}`);
    // Run npm-check-updates to find and update package.json
    // eslint-disable-next-line i18next/no-literal-string
    execSync(`ncu -u ${ignoreArg}`, {
      cwd,

      stdio: "inherit",
    });

    logger.info(`Successfully updated dependencies for ${pkg.directory}`);
    // // Install dependencies with the correct path setup

    execSync(`${packageManager} install`, {
      cwd,

      stdio: "inherit",

      env: { ...process.env },
    });
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(
      `Error updating dependencies for ${pkg.directory}. Continuing with release process.`,
      parseError(error),
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.packageJson.errorUpdatingDeps",
      ErrorResponseTypes.INTERNAL_ERROR,
      { directory: pkg.directory, error: String(error) },
    );
  }
}

/**
 * Updates the version in the package.json file and also in release.config.ts.
 */
export function updatePackageVersion(
  pkg: ReleasePackage,
  newVersion: string,
  cwd: string,
  originalCwd: string,
  logger: EndpointLogger,
): ResponseType<void> {
  // Update package's package.json
  const packageJsonResponse = getPackageJson(cwd, logger);
  if (!packageJsonResponse.success) {
    return packageJsonResponse;
  }

  const packageJson = packageJsonResponse.data;

  try {
    packageJson.version = newVersion;

    const packageJsonPath = join(cwd, "package.json");
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    logger.info(`Updated version for ${pkg.directory} to ${newVersion}`);

    // Update version in release.config.ts (both globalVersion if available and package's own version)

    const configPath = join(originalCwd, "release.config.ts");
    if (existsSync(configPath)) {
      let configContent = readFileSync(configPath, "utf8");

      // Update globalVersion if it exists
      configContent = configContent.replace(
        /globalVersion\s*:\s*["']([^"']*)["']/,
        // eslint-disable-next-line i18next/no-literal-string
        `globalVersion: "${newVersion}"`,
      );

      // Helper to escape regex special characters in a directory string
      const escapeRegex = (s: string): string =>
        // eslint-disable-next-line i18next/no-literal-string
        s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const dirPattern = escapeRegex(pkg.directory);

      // Find the package object by matching its directory and update its version property.
      const packageRegex = new RegExp(
        // eslint-disable-next-line i18next/no-literal-string
        `(\\{[^}]*?directory\\s*:\\s*["']${dirPattern}["'][^}]*?version\\s*:\\s*["'])([^"']+)(["'])`,
        "m",
      );
      configContent = configContent.replace(
        packageRegex,
        (_match, p1, _p2, p3) => {
          return `${p1}${newVersion}${p3}`;
        },
      );

      writeFileSync(configPath, configContent);

      logger.info(
        `Updated release.config.ts for package ${pkg.directory} to ${newVersion}`,
      );
    } else {
      logger.info("release.config.ts not found. Skipping config update.");
    }

    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error("Error updating package version", parseError(error));
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.packageJson.errorUpdatingVersion",
      ErrorResponseTypes.INTERNAL_ERROR,
      { directory: pkg.directory, error: String(error) },
    );
  }
}
