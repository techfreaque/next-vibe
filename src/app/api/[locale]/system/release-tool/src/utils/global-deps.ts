/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { execSync } from "node:child_process";
import { join } from "node:path";

import inquirer from "inquirer";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ReleaseConfig, ReleasePackage } from "../types/index.js";
import { getPackageJson } from "./package-json.js";

/**
 * Handles global dependency updates for all packages that have updateDeps enabled
 */
export async function handleGlobalDependencyUpdates(
  config: ReleaseConfig,
  packageManager: string,
  originalCwd: string,
  forceUpdate = false,
  logger: EndpointLogger,
): Promise<boolean> {
  // Find all packages that need dependency updates
  const packagesNeedingUpdates = config.packages.filter(
    (pkg) => pkg.updateDeps === true || pkg.updateDeps === "force",
  );

  if (packagesNeedingUpdates.length === 0) {
    logger.info("No packages require dependency updates");
    return false;
  }

  // Check if any package has "force" - if so, skip prompt
  const hasForceUpdate = packagesNeedingUpdates.some(
    (pkg) => pkg.updateDeps === "force",
  );

  let shouldUpdate = hasForceUpdate || forceUpdate;

  if (!hasForceUpdate && !forceUpdate) {
    // Show all packages that will be updated
    const packageNames = packagesNeedingUpdates.map((pkg) => {
      const cwd = join(originalCwd, pkg.directory);
      const packageJsonResponse = getPackageJson(cwd, logger);
      if (!packageJsonResponse.success) {
        // eslint-disable-next-line i18next/no-literal-string
        return `${pkg.directory} (error reading package.json)`;
      }
      // eslint-disable-next-line i18next/no-literal-string
      return `${packageJsonResponse.data.name} (${pkg.directory})`;
    });

    logger.info(
      "The following packages are configured for dependency updates:",
    );

    packageNames.forEach((name) => logger.info(`  - ${name}`));

    const { confirmUpdate } = await inquirer.prompt<{
      confirmUpdate: boolean;
    }>([
      {
        type: "confirm",
        name: "confirmUpdate",
        // eslint-disable-next-line i18next/no-literal-string
        message: `Update dependencies for all ${packagesNeedingUpdates.length} packages?`,
        default: false,
      },
    ]);

    shouldUpdate = confirmUpdate;
  }

  if (!shouldUpdate) {
    logger.info("Skipping dependency updates for all packages");
    return false;
  }

  // Update dependencies for all packages

  logger.info(
    `Updating dependencies for ${packagesNeedingUpdates.length} packages...`,
  );

  for (const pkg of packagesNeedingUpdates) {
    const cwd = join(originalCwd, pkg.directory);
    const packageJsonResponse = getPackageJson(cwd, logger);

    if (!packageJsonResponse.success) {
      logger.error(
        `Failed to read package.json for ${pkg.directory}`,
        packageJsonResponse.message,
      );
      continue;
    }

    try {
      updatePackageDependencies(
        pkg,
        packageManager,
        cwd,
        packageJsonResponse.data.name,
        logger,
      );
    } catch (error) {
      logger.error(
        `Failed to update dependencies for ${packageJsonResponse.data.name}:`,
        parseError(error),
      );
      // Continue with other packages instead of failing completely
    }
  }

  return true;
}

/**
 * Updates dependencies for a single package
 */
function updatePackageDependencies(
  _pkg: ReleasePackage,
  packageManager: string,
  cwd: string,
  packageName: string,
  logger: EndpointLogger,
): void {
  const packageJsonResponse = getPackageJson(cwd, logger);

  if (!packageJsonResponse.success) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Build/CLI tool error handling requires throwing to exit with error status
    throw new Error(`Failed to read package.json for ${packageName}`);
  }

  const packageJson = packageJsonResponse.data;

  try {
    const ignoreList = packageJson.updateIgnoreDependencies || [];

    // Build ignore list arguments

    const ignoreArg =
      ignoreList.length > 0 ? `--reject ${ignoreList.join(",")}` : "";

    logger.info(`Updating dependencies for ${packageName}`);

    // Run npm-check-updates to find and update package.json
    // eslint-disable-next-line i18next/no-literal-string
    execSync(`ncu -u ${ignoreArg}`, {
      cwd,

      stdio: "inherit",
      timeout: 60000, // 1 minute timeout
    });

    logger.info(`Successfully updated package.json for ${packageName}`);

    // Install dependencies with the correct path setup

    execSync(`${packageManager} install`, {
      cwd,

      stdio: "inherit",

      env: { ...process.env },
      timeout: 120000, // 2 minutes timeout
    });

    logger.info(`Successfully installed dependencies for ${packageName}`);
  } catch (error) {
    logger.error("Error updating global dependencies", parseError(error));
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
    throw error;
  }
}
