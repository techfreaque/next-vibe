import { execSync } from "node:child_process";
import { join } from "node:path";

import inquirer from "inquirer";

import type { ReleaseConfig, ReleasePackage } from "../types/index.js";
import { logger, loggerError } from "./logger.js";
import { getPackageJson } from "./package-json.js";

/**
 * Handles global dependency updates for all packages that have updateDeps enabled
 */
export async function handleGlobalDependencyUpdates(
  config: ReleaseConfig,
  packageManager: string,
  originalCwd: string,
  forceUpdate = false,
): Promise<boolean> {
  // Find all packages that need dependency updates
  const packagesNeedingUpdates = config.packages.filter(
    (pkg) => pkg.updateDeps === true || pkg.updateDeps === "force",
  );

  if (packagesNeedingUpdates.length === 0) {
    logger("No packages require dependency updates");
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
      const packageJson = getPackageJson(cwd);
      return `${packageJson.name} (${pkg.directory})`;
    });

    logger("The following packages are configured for dependency updates:");
    packageNames.forEach((name) => logger(`  - ${name}`));

    const { confirmUpdate } = await inquirer.prompt<{
      confirmUpdate: boolean;
    }>([
      {
        type: "confirm",
        name: "confirmUpdate",
        message: `Update dependencies for all ${packagesNeedingUpdates.length} packages?`,
        default: false,
      },
    ]);

    shouldUpdate = confirmUpdate;
  }

  if (!shouldUpdate) {
    logger("Skipping dependency updates for all packages");
    return false;
  }

  // Update dependencies for all packages
  logger(
    `Updating dependencies for ${packagesNeedingUpdates.length} packages...`,
  );

  for (const pkg of packagesNeedingUpdates) {
    const cwd = join(originalCwd, pkg.directory);
    const packageJson = getPackageJson(cwd);

    try {
      updatePackageDependencies(pkg, packageManager, cwd, packageJson.name);
    } catch (error) {
      loggerError(
        `Failed to update dependencies for ${packageJson.name}:`,
        error,
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
): void {
  const packageJson = getPackageJson(cwd);

  try {
    const ignoreList = packageJson.updateIgnoreDependencies || [];

    // Build ignore list arguments
    const ignoreArg =
      ignoreList.length > 0 ? `--reject ${ignoreList.join(",")}` : "";

    logger(`Updating dependencies for ${packageName}`);

    // Run npm-check-updates to find and update package.json
    execSync(`ncu -u ${ignoreArg}`, {
      cwd,
      stdio: "inherit",
      timeout: 60000, // 1 minute timeout
    });

    logger(`Successfully updated package.json for ${packageName}`);

    // Install dependencies with the correct path setup
    execSync(`${packageManager} install`, {
      cwd,
      stdio: "inherit",
      env: { ...process.env },
      timeout: 120000, // 2 minutes timeout
    });

    logger(`Successfully installed dependencies for ${packageName}`);
  } catch (error) {
    loggerError(
      `Error updating dependencies for ${packageName}. Continuing with release process.`,
      error,
    );
    throw error;
  }
}
