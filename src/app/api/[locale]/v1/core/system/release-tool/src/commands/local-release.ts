/* eslint-disable no-restricted-syntax */
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import type { ReleaseConfig } from "../types/index.js";
import { handleUncommittedChanges } from "../utils/git.js";
import { handleGlobalDependencyUpdates } from "../utils/global-deps.js";
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
  logger: EndpointLogger,
): Promise<void> {
  const configResponse = await loadConfig(logger, configPath);
  if (!configResponse.success) {
    logger.error("Failed to load config", { error: configResponse.message });
    throw new Error(configResponse.message);
  }
  const config: ReleaseConfig = configResponse.data;

  const packageManager = config.packageManager || "bun";
  logger.info(`Using package manager: ${packageManager}`);

  let overallError = false;
  const affectedPackages: string[] = [];
  const originalCwd = process.cwd();

  // Handle global dependency updates once for all packages
  await handleGlobalDependencyUpdates(
    config,
    packageManager,
    originalCwd,
    forceUpdate,
    logger,
  );

  // If forceUpdate is true, only update dependencies and skip all other steps
  if (forceUpdate) {
    logger.info(
      "Force update completed - skipping quality checks and release steps",
    );
    return;
  }

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
      // Run quality checks
      if (pkg.lint) {
        logger.info(`Linting ${packageJson.name}`);
        const lintResult = lint(cwd, logger);
        if (!lintResult.success) {
          throw new Error(lintResult.message);
        }
      }

      if (pkg.typecheck) {
        logger.info(`Type checking ${packageJson.name}`);
        const typecheckResult = typecheck(cwd, logger);
        if (!typecheckResult.success) {
          throw new Error(typecheckResult.message);
        }
      }

      if (pkg.build) {
        logger.info(`Building ${packageJson.name}`);
        const buildResult = build(cwd, logger);
        if (!buildResult.success) {
          throw new Error(buildResult.message);
        }
      }

      if (pkg.test) {
        logger.info(`Running tests for ${packageJson.name}`);
        const testResult = runTests(cwd, logger);
        if (!testResult.success) {
          throw new Error(testResult.message);
        }
      }

      if (pkg.snyk) {
        logger.info(`Running Snyk vulnerability test for ${packageJson.name}`);
        const snykResult = snykTest(cwd, logger);
        if (!snykResult.success) {
          throw new Error(snykResult.message);
        }
      }

      // Handle release if configured
      const releaseConfig = pkg.release;
      if (releaseConfig) {
        await handleUncommittedChanges(logger);

        const { newVersion, lastTag, newTag } = await getVersion(
          logger,
          pkg,
          packageJson,
          config,
          releaseConfig,
        );

        const updateVersionResult = updatePackageVersion(
          pkg,
          newVersion,
          cwd,
          originalCwd,
          logger,
        );
        if (!updateVersionResult.success) {
          throw new Error(updateVersionResult.message);
        }

        updateVariableStringValue(logger, newVersion, releaseConfig);

        if (releaseConfig.foldersToZip) {
          logger.info(`Zipping folders for ${packageJson.name}`);
          await zipFolders({
            newTag,
            lastTag,
            packageJson,
            pkg,
            foldersToZip: releaseConfig.foldersToZip,
            logger,
          });
        }

        await publishPackage({ newTag, lastTag, packageJson, pkg, logger });
      }
    } catch (error) {
      logger.error(`Error processing ${packageJson.name}:`, parseError(error));
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
    logger.error(
      "The release process encountered the above errors for the following packages:",
      affectedPackages.join(", "),
    );
    process.exit(1);
  }
}
