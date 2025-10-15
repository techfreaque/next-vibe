import { join } from "node:path";

import type { ReleaseConfig } from "../types/index.js";
import { handleUncommittedChanges } from "../utils/git.js";
import { handleGlobalDependencyUpdates } from "../utils/global-deps.js";
import { logger, loggerError } from "../utils/logger.js";
import { getPackageJson, updatePackageVersion } from "../utils/package-json.js";
import { publishPackage, zipFolders } from "../utils/publishing.js";
import { DEFAULT_CONFIG_PATH, loadConfig } from "../utils/release-config.js";
import {
  build,
  lint,
  runTests,
  snykTest,
  typecheck,
} from "../utils/scripts.js";
import { getVersion, updateVariableStringValue } from "../utils/versioning.js";

/**
 * Runs the local release process for packages defined in the config.
 * In local mode:
 * - Interactive prompts allowed
 * - Dependency updates available
 * - Version bumping and git tagging
 */
export async function localRelease(
  configPath: string = DEFAULT_CONFIG_PATH,
  forceUpdate = false,
): Promise<void> {
  const config: ReleaseConfig = await loadConfig(configPath);

  const packageManager = config.packageManager || "bun";
  logger(`Using package manager: ${packageManager}`);

  let overallError = false;
  const affectedPackages: string[] = [];
  const originalCwd = process.cwd();

  // Handle global dependency updates once for all packages
  await handleGlobalDependencyUpdates(
    config,
    packageManager,
    originalCwd,
    forceUpdate,
  );

  // If forceUpdate is true, only update dependencies and skip all other steps
  if (forceUpdate) {
    logger(
      "Force update completed - skipping quality checks and release steps",
    );
    return;
  }

  for (const pkg of config.packages) {
    const cwd = join(originalCwd, pkg.directory);
    const packageJson = getPackageJson(cwd);

    try {
      // Run quality checks
      if (pkg.lint) {
        logger(`Linting ${packageJson.name}`);
        lint(cwd);
      }

      if (pkg.typecheck) {
        logger(`Type checking ${packageJson.name}`);
        typecheck(cwd);
      }

      if (pkg.build) {
        logger(`Building ${packageJson.name}`);
        build(cwd);
      }

      if (pkg.test) {
        logger(`Running tests for ${packageJson.name}`);
        runTests(cwd);
      }

      if (pkg.snyk) {
        logger(`Running Snyk vulnerability test for ${packageJson.name}`);
        snykTest(cwd);
      }

      // Handle release if configured
      const releaseConfig = pkg.release;
      if (releaseConfig) {
        await handleUncommittedChanges();

        const { newVersion, lastTag, newTag } = await getVersion(
          pkg,
          packageJson,
          config,
          releaseConfig,
        );

        updatePackageVersion(pkg, newVersion, cwd, originalCwd);
        updateVariableStringValue(newVersion, releaseConfig);

        if (releaseConfig.foldersToZip) {
          logger(`Zipping folders for ${packageJson.name}`);
          await zipFolders({
            newTag,
            lastTag,
            packageJson,
            pkg,
            foldersToZip: releaseConfig.foldersToZip,
          });
        }

        await publishPackage({ newTag, lastTag, packageJson, pkg });
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
      "The release process encountered the above errors for the following packages:",
      affectedPackages.join(", "),
    );
    process.exit(1);
  }
}
