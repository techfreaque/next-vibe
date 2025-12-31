/**
 * Release Executor Service
 * Main orchestrator for the release process
 */

import { join } from "node:path";

import { confirm, select } from "@inquirer/prompts";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import {
  formatConfig,
  formatDuration,
  formatError,
  formatHint,
  formatProgress,
  formatSection,
  formatSkip,
  formatStartup,
  formatSuccess,
  formatWarning,
} from "../../unified-interface/shared/logger/formatters";
import type {
  GitInfo,
  GitOpsConfig,
  HookContext,
  NotificationResult,
  PackageResult,
  PublishedPackage,
  ReleaseConfig,
  ReleaseResponseType,
  RequestType,
  Timings,
} from "../definition";
import { assetZipper } from "./asset-zipper";
import { changelogGenerator } from "./changelog-generator";
import { ciDetector } from "./ci-detector";
import type { IConfigLoader } from "./config";
import { MESSAGES } from "./constants";
import { dependencyManager } from "./dependency-manager";
import { gitService } from "./git-service";
import { hookRunner } from "./hook-runner";
import { notificationService } from "./notification-service";
import { packageService } from "./package-service";
import { publisher } from "./publisher";
import { qualityRunner } from "./quality-runner";
import { releaseCreator } from "./release-creator";
import { snykService } from "./snyk-service";
import { validationService } from "./validation";
import { versionService } from "./version-service";

// ============================================================================
// Interface
// ============================================================================

export interface IReleaseExecutor {
  /**
   * Execute the release process
   */
  execute(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ReleaseResponseType>>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ReleaseExecutor implements IReleaseExecutor {
  async execute(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ReleaseResponseType>> {
    void locale;
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const packagesProcessed: PackageResult[] = [];
    const publishedPackages: PublishedPackage[] = [];
    const notificationsSent: NotificationResult[] = [];
    let globalGitInfo: GitInfo | undefined;

    // Timings tracking
    const timings: Timings = { total: 0 };
    const trackTime = (
      phase: keyof Omit<Timings, "total">,
      start: number,
    ): void => {
      timings[phase] = Date.now() - start;
    };

    // Detect CI environment
    const ciEnv = ciDetector.detect();

    // Declare config outside try block so it's available in catch
    let config: ReleaseConfig | undefined;

    try {
      output.push(MESSAGES.RELEASE_START);

      // Load config from file or use configObject
      if (data.configObject) {
        config = data.configObject;
        logger.debug("Using inline configuration");
      } else {
        // Lazy-load configLoader to avoid Turbopack warning about dynamic imports
        // The config module uses dynamic imports that can't be statically analyzed
        const { configLoader } = (await import("./config")) as {
          configLoader: IConfigLoader;
        };
        const configResult = await configLoader.load(logger, data.configPath);
        if (!configResult.success) {
          return fail({
            message: configResult.message,
            errorType: configResult.errorType,
            messageParams: configResult.messageParams,
          });
        }
        config = configResult.data;
      }

      // Extract runtime options - request (data) params override config file
      const isCI = data.ci ?? ciEnv.isCI;
      const isVerbose = data.verbose ?? false;
      const dryRun = data.dryRun ?? false;
      // Track if forceUpdate was explicitly set (to know if we should prompt)
      const forceUpdateExplicitlySet = data.forceUpdate !== undefined || false;
      const forceUpdate = data.forceUpdate ?? false;
      const skipLint = data.skipLint ?? false;
      const skipTypecheck = data.skipTypecheck ?? false;
      const skipBuild = data.skipBuild ?? false;
      const skipTests = data.skipTests ?? false;
      const skipSnyk = data.skipSnyk ?? false;
      const skipPublish = data.skipPublish ?? false;
      const skipChangelog = data.skipChangelog ?? false;
      const skipGitTag = data.skipGitTag ?? false;
      const skipGitPush = data.skipGitPush ?? false;
      const targetPackage = data.targetPackage;
      let versionIncrement = data.versionIncrement;
      const prereleaseId = data.prereleaseId;
      const notifyWebhook = data.notifyWebhook;
      const packageManager = config.packageManager ?? "bun";

      // Show startup banner
      logger.vibe(formatStartup("Release Tool", "📦"));
      logger.vibe("");
      logger.vibe(`  ${formatConfig("Package Manager", packageManager)}`);
      logger.vibe(
        `  ${formatConfig("Dry Run", dryRun ? "YES" : "NO")}  ${formatHint(dryRun ? "(changes won't be applied)" : "")}`,
      );
      if (ciEnv.isCI) {
        logger.vibe(
          `  ${formatConfig("CI Environment", ciEnv.provider ?? "detected")}`,
        );
      }
      logger.vibe("");

      // Show what will be checked/skipped
      logger.vibe(`  ${formatConfig("Lint", skipLint ? "SKIP" : "ON")}`);
      logger.vibe(
        `  ${formatConfig("Typecheck", skipTypecheck ? "SKIP" : "ON")}`,
      );
      logger.vibe(`  ${formatConfig("Build", skipBuild ? "SKIP" : "ON")}`);
      logger.vibe(`  ${formatConfig("Tests", skipTests ? "SKIP" : "ON")}`);
      logger.vibe(`  ${formatConfig("Publish", skipPublish ? "SKIP" : "ON")}`);
      logger.vibe("");

      if (isVerbose) {
        logger.debug("Verbose mode enabled");
      }

      const originalCwd = process.cwd();
      const mainBranch = config.branch?.main ?? "main";

      // Gather git info (always needed)
      logger.vibe(formatProgress("Fetching git information..."));
      globalGitInfo = gitService.getInfo(originalCwd, logger);
      if (globalGitInfo) {
        logger.debug("Git info", {
          branch: globalGitInfo.currentBranch,
          lastTag: globalGitInfo.lastTag,
          uncommittedChanges: globalGitInfo.hasUncommittedChanges,
          commitsSinceTag: globalGitInfo.commitsSinceLastTag,
        });
      }

      // Run basic validations (NOT branch check - that comes later before git ops)
      logger.vibe(formatProgress("Running validations..."));
      const validationResult = validationService.runBasicValidations(
        config,
        originalCwd,
        packageManager,
        logger,
      );
      if (!validationResult.success) {
        return fail({
          message: validationResult.message,
          errorType: validationResult.errorType,
          messageParams: validationResult.messageParams,
        });
      }
      trackTime("validation", startTime);

      // Ask user if they want to update dependencies (unless forceUpdate explicitly set or CI)
      if (!forceUpdateExplicitlySet && !isCI) {
        const shouldUpdate = await confirm({
          message: "Update dependencies before release?",
          default: false,
        });

        if (shouldUpdate) {
          logger.vibe(formatProgress("Updating dependencies..."));
          const pkgJsonResult = packageService.getPackageJson(
            originalCwd,
            logger,
          );
          if (pkgJsonResult.success) {
            const updateResult = dependencyManager.updateDependencies(
              originalCwd,
              packageManager,
              pkgJsonResult.data,
              logger,
              dryRun,
            );
            if (updateResult.success) {
              logger.vibe(formatSuccess("Dependencies updated"));
            } else {
              logger.vibe(
                formatWarning("Failed to update dependencies, continuing..."),
              );
            }
          }
        } else {
          logger.vibe(formatSkip("Skipping dependency update"));
        }
      }

      // Handle force update mode - just update deps and return
      if (forceUpdate) {
        logger.vibe(
          formatProgress("Force update mode: updating dependencies..."),
        );
        const packages = config.packages ?? [];
        for (const pkg of packages) {
          // Skip dependency updates in CI mode
          if ((pkg.updateDeps === true || pkg.updateDeps === "force") && !isCI) {
            const cwd = join(originalCwd, pkg.directory);
            const pkgJsonResult = packageService.getPackageJson(cwd, logger);
            if (pkgJsonResult.success) {
              const updateResult = dependencyManager.updateDependencies(
                cwd,
                packageManager,
                pkgJsonResult.data,
                logger,
                dryRun,
              );
              if (!updateResult.success) {
                errors.push(
                  `Failed to update ${pkgJsonResult.data.name}: ${updateResult.message}`,
                );
              }
            }
          }
        }
        return success({
          success: errors.length === 0,
          output: output.join("\n"),
          duration: Date.now() - startTime,
          packagesProcessed: [],
          errors: errors.length > 0 ? errors : null,
          warnings: warnings.length > 0 ? warnings : null,
          publishedPackages: null,
          notificationsSent: null,
        });
      }

      // Run global pre-release hook
      if (config.hooks?.preRelease) {
        const hookResult = hookRunner.runHook(
          config.hooks.preRelease,
          originalCwd,
          logger,
          dryRun,
          { packageManager },
        );
        if (!hookResult.success) {
          const errorMsg = `Pre-release hook failed: ${hookResult.message}`;
          errors.push(errorMsg);
          // If continueOnError is false, fail the entire release
          if (!config.continueOnError) {
            return success(
              {
                success: false,
                output: output.join("\n"),
                duration: Date.now() - startTime,
                packagesProcessed: [],
                ciEnvironment: undefined,
                errors,
                warnings: warnings.length > 0 ? warnings : null,
                gitInfo: globalGitInfo,
                publishedPackages: null,
                timings: { total: Date.now() - startTime },
                notificationsSent: null,
              } satisfies ReleaseResponseType,
              { isErrorResponse: true },
            );
          }
        }
      }

      // Filter packages if targetPackage is specified
      let packages = config.packages ?? [];
      if (targetPackage) {
        packages = packages.filter(
          (pkg) =>
            pkg.directory === targetPackage ||
            pkg.directory.includes(targetPackage),
        );
        if (packages.length === 0) {
          return fail({
            message: "app.api.system.releaseTool.errors.packageNotFound",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { targetPackage },
          });
        }
      }

      // Process each package
      for (const pkg of packages) {
        const cwd = join(originalCwd, pkg.directory);
        const packageJsonResult = packageService.getPackageJson(cwd, logger);

        if (!packageJsonResult.success) {
          packagesProcessed.push({
            name: pkg.directory,
            directory: pkg.directory,
            status: "failed",
            message: "Failed to read package.json",
          });
          if (!config.continueOnError) {
            break;
          }
          continue;
        }

        const packageJson = packageJsonResult.data;
        logger.vibe(formatSection(`Package: ${packageJson.name}`));

        // Create hook context for this package
        const hookContext: HookContext = {
          packageManager,
          packageName: packageJson.name,
          version: packageJson.version,
          directory: pkg.directory,
        };

        // Helper to handle quality check failures
        let packageFailed = false;
        const handleFailure = (
          result: { success: boolean; message?: string },
          step: string,
        ): boolean => {
          if (!result.success) {
            const errorMsg = result.message ?? `${step} failed`;
            errors.push(`[${packageJson.name}] ${errorMsg}`);
            if (!config?.continueOnError) {
              packageFailed = true;
              packagesProcessed.push({
                name: packageJson.name,
                directory: pkg.directory,
                status: "failed",
                message: errorMsg,
              });
              return true; // Should stop processing
            }
          }
          return false; // Continue processing
        };

        // Helper to handle hook failures (same behavior as quality failures)
        const handleHookFailure = (hookName: string): boolean => {
          return handleFailure(
            { success: false, message: `Hook ${hookName} failed` },
            "Hook",
          );
        };

        // Install dependencies if configured
        if (pkg.install && !packageFailed) {
          if (pkg.hooks?.preInstall) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preInstall,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preInstall")) {
              continue;
            }
          }
          const installCommand =
            typeof pkg.install === "string" ? pkg.install : undefined;
          const installResult = qualityRunner.runInstall(
            cwd,
            packageManager,
            logger,
            dryRun,
            installCommand,
          );
          if (handleFailure(installResult, "Install")) {
            continue;
          }
          if (pkg.hooks?.postInstall) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postInstall,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("postInstall")) {
              continue;
            }
          }
        }

        // Clean if configured
        if (pkg.clean && !packageFailed) {
          if (pkg.hooks?.preClean) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preClean,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preClean")) {
              continue;
            }
          }
          const cleanCommand =
            typeof pkg.clean === "string" ? pkg.clean : undefined;
          const cleanResult = qualityRunner.runClean(
            cwd,
            packageManager,
            logger,
            dryRun,
            cleanCommand,
          );
          if (handleFailure(cleanResult, "Clean")) {
            continue;
          }
          if (pkg.hooks?.postClean) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postClean,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("postClean")) {
              continue;
            }
          }
        }

        // Note: Dependencies are only updated with --force-update flag
        // The check for outdated deps happens earlier and warns the user

        // Lint
        if (pkg.lint && !skipLint && !packageFailed) {
          if (pkg.hooks?.preLint) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preLint,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preLint")) {
              continue;
            }
          }
          const lintCommand =
            typeof pkg.lint === "string" ? pkg.lint : undefined;
          const lintResult = qualityRunner.runLint(
            cwd,
            packageManager,
            logger,
            dryRun,
            lintCommand,
          );
          if (handleFailure(lintResult, "Lint")) {
            continue;
          }
          if (pkg.hooks?.postLint) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postLint,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("postLint")) {
              continue;
            }
          }
        }

        // Typecheck
        if (pkg.typecheck && !skipTypecheck && !packageFailed) {
          const typecheckCommand =
            typeof pkg.typecheck === "string" ? pkg.typecheck : undefined;
          const typecheckResult = qualityRunner.runTypecheck(
            cwd,
            packageManager,
            logger,
            dryRun,
            typecheckCommand,
          );
          if (handleFailure(typecheckResult, "Typecheck")) {
            continue;
          }
        }

        // Build
        if (pkg.build && !skipBuild && !packageFailed) {
          if (pkg.hooks?.preBuild) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preBuild,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preBuild")) {
              continue;
            }
          }
          const buildCommand =
            typeof pkg.build === "string" ? pkg.build : undefined;
          const buildResult = qualityRunner.runBuild(
            cwd,
            packageManager,
            logger,
            dryRun,
            buildCommand,
          );
          if (handleFailure(buildResult, "Build")) {
            continue;
          }
          if (pkg.hooks?.postBuild) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postBuild,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("postBuild")) {
              continue;
            }
          }
        }

        // Tests
        if (pkg.test && !skipTests && !packageFailed) {
          if (pkg.hooks?.preTest) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preTest,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preTest")) {
              continue;
            }
          }
          const testCommand =
            typeof pkg.test === "string" ? pkg.test : undefined;
          const testResult = qualityRunner.runTests(
            cwd,
            packageManager,
            logger,
            dryRun,
            testCommand,
          );
          if (handleFailure(testResult, "Tests")) {
            continue;
          }
          if (pkg.hooks?.postTest) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postTest,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("postTest")) {
              continue;
            }
          }
        }

        // Snyk
        if (pkg.snyk && !skipSnyk && !packageFailed) {
          const snykResult = isCI
            ? snykService.runSnykMonitor(cwd, packageJson.name, logger, dryRun)
            : snykService.runSnykTest(cwd, packageJson.name, logger, dryRun);
          if (handleFailure(snykResult, "Security scan")) {
            continue;
          }
        }

        // Skip release steps if package failed quality checks
        if (packageFailed) {
          continue;
        }

        // Handle release
        const releaseConfig = pkg.release;
        if (releaseConfig) {
          // Ask for version increment if not provided and not in CI
          if (!versionIncrement && !isCI) {
            versionIncrement = await select({
              message: "Select version increment:",
              choices: [
                { name: "Patch (0.0.X)", value: "patch" },
                { name: "Minor (0.X.0)", value: "minor" },
                { name: "Major (X.0.0)", value: "major" },
              ],
              default: "patch",
            });
          }

          const versionInfo = versionService.getVersionInfo(
            logger,
            pkg,
            packageJson,
            config,
            releaseConfig,
            versionIncrement,
            prereleaseId,
          );

          logger.debug(
            `Processing tag release (${versionInfo.newTag}) for ${packageJson.name}...`,
          );

          // Check if tag exists
          const tagExists = await gitService.checkTagExists(
            versionInfo.newTag,
            logger,
          );
          if (tagExists) {
            packagesProcessed.push({
              name: packageJson.name,
              directory: pkg.directory,
              version: versionInfo.newVersion,
              tag: versionInfo.newTag,
              status: "skipped",
              message: "Tag already exists",
            });
            continue;
          }

          // Check for new commits (only skip if we're also doing git operations)
          // If skipGitTag is true, allow publishing even without new commits
          if (
            !gitService.hasNewCommitsSinceTag(
              versionInfo.lastTag,
              cwd,
              logger,
            ) &&
            !skipGitTag
          ) {
            packagesProcessed.push({
              name: packageJson.name,
              directory: pkg.directory,
              version: versionInfo.newVersion,
              tag: versionInfo.newTag,
              status: "skipped",
              message: "No new commits since last tag",
            });
            continue;
          }

          // Run pre-release hook
          if (pkg.hooks?.preRelease) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.preRelease,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("preRelease")) {
              continue;
            }
          }

          // Update version (skip in CI mode - version should already be set)
          if (!isCI) {
            const updateResult = packageService.updatePackageVersion(
              pkg,
              versionInfo.newVersion,
              cwd,
              originalCwd,
              logger,
            );
            if (handleFailure(updateResult, "Version update")) {
              continue;
            }

            // Update version in other files
            versionService.updateVariableStringValue(
              logger,
              versionInfo.newVersion,
              releaseConfig,
            );
          } else {
            logger.vibe(formatSkip("Skipping version bump (CI mode - using existing version)"));
          }

          // Zip folders
          if (releaseConfig.foldersToZip) {
            await assetZipper.zipFolders(
              versionInfo.newTag,
              packageJson,
              releaseConfig.foldersToZip,
              logger,
              dryRun,
            );
          }

          // Run pre-publish hook
          if (pkg.hooks?.prePublish) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.prePublish,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success && handleHookFailure("prePublish")) {
              continue;
            }
          }

          // Generate changelog if configured
          if (!skipChangelog) {
            const changelogResult = changelogGenerator.generateChangelog(
              cwd,
              releaseConfig,
              versionInfo,
              logger,
              dryRun,
            );
            if (handleFailure(changelogResult, "Changelog generation")) {
              continue;
            }
          }

          // Create git tag and publish
          if (!skipPublish && !packageFailed) {
            // Branch check RIGHT BEFORE git operations (last chance to warn)
            const currentBranch =
              globalGitInfo?.currentBranch ?? gitService.getCurrentBranch();
            if (
              currentBranch &&
              currentBranch !== mainBranch &&
              !config.branch?.allowNonMain
            ) {
              logger.vibe(
                formatWarning(
                  `Releasing from '${currentBranch}' branch (not '${mainBranch}')`,
                ),
              );
              logger.vibe(
                formatHint(
                  "Set branch.allowNonMain: true in config to suppress this warning",
                ),
              );
              warnings.push(
                `Released from ${currentBranch} instead of ${mainBranch}`,
              );
            }

            logger.vibe(formatProgress(`Releasing ${packageJson.name}...`));

            // Build effective git config with request overrides
            let effectiveGitConfig: GitOpsConfig = {
              ...releaseConfig.git,
              skipTag: skipGitTag || releaseConfig.git?.skipTag,
              skipPush: skipGitPush || releaseConfig.git?.skipPush,
            };

            // Interactive git prompts (only if not CI and not explicitly skipped)
            if (!isCI && !dryRun) {
              // Check if there are uncommitted changes
              const hasChanges = globalGitInfo?.hasUncommittedChanges ?? false;

              // Ask about git commit only if there are changes
              if (!effectiveGitConfig.skipTag && hasChanges) {
                const shouldCommit = await confirm({
                  message: `Version updated to ${versionInfo.newVersion} in package.json and release.config.ts. Commit these changes?`,
                  default: true,
                });

                if (!shouldCommit) {
                  logger.vibe(
                    formatWarning(
                      "Continuing without committing version changes",
                    ),
                  );
                  // User chose not to commit, but we continue
                }
              }

              // Ask about creating git tag
              if (!effectiveGitConfig.skipTag) {
                const shouldTag = await confirm({
                  message: `Create git tag ${versionInfo.newTag}?`,
                  default: true,
                });

                if (!shouldTag) {
                  logger.vibe(formatSkip("Skipping git tag creation"));
                  effectiveGitConfig.skipTag = true;
                  effectiveGitConfig.skipPush = true;
                }
              }

              // Ask about pushing to remote
              if (!effectiveGitConfig.skipPush && !effectiveGitConfig.skipTag) {
                const shouldPush = await confirm({
                  message: `Push tag ${versionInfo.newTag} to ${effectiveGitConfig.remote || "origin"}?`,
                  default: true,
                });

                if (!shouldPush) {
                  logger.vibe(formatSkip("Skipping git push"));
                  effectiveGitConfig.skipPush = true;
                }
              }
            }

            // Use git service for tag creation (if not skipped)
            if (!effectiveGitConfig.skipTag) {
              const tagResult = gitService.createTag(
                versionInfo.newTag,
                cwd,
                logger,
                dryRun,
                effectiveGitConfig,
              );
              if (handleFailure(tagResult, "Git tag creation")) {
                continue;
              }
            }

            // Update global git info with new tag
            if (globalGitInfo) {
              globalGitInfo.newTag = versionInfo.newTag;
            }

            // Ask about npm publish in interactive mode
            let shouldPublish = true;
            if (
              !isCI &&
              !skipPublish &&
              !dryRun &&
              releaseConfig.npm?.enabled !== false
            ) {
              shouldPublish = await confirm({
                message: `Publish ${packageJson.name}@${versionInfo.newVersion} to npm?`,
                default: true,
              });

              if (!shouldPublish) {
                logger.vibe(formatSkip("Skipping npm publish"));
              }
            }

            // Run CI release command or npm publish
            if (isCI && releaseConfig.ciReleaseCommand && shouldPublish) {
              const ciResult = publisher.runCiReleaseCommand(
                releaseConfig,
                packageJson.name,
                logger,
                dryRun,
              );
              if (handleFailure(ciResult, "CI release command")) {
                continue;
              }
            } else if (releaseConfig.npm?.enabled !== false && shouldPublish) {
              const npmResult = publisher.publishToNpm(
                cwd,
                packageJson,
                releaseConfig,
                logger,
                dryRun,
                ciEnv,
              );
              if (handleFailure(npmResult, "NPM publish")) {
                continue;
              }

              // Track NPM publish
              if (npmResult.success && !dryRun) {
                publishedPackages.push({
                  name: packageJson.name,
                  version: versionInfo.newVersion,
                  registry: "npm",
                  url: `${MESSAGES.NPM_REGISTRY_URL}/${packageJson.name}`,
                });
              }

              // Also publish to JSR if configured
              const jsrResult = publisher.publishToJsr(
                cwd,
                packageJson,
                releaseConfig,
                logger,
                dryRun,
              );
              if (handleFailure(jsrResult, "JSR publish")) {
                continue;
              }

              // Track JSR publish
              if (jsrResult.success && releaseConfig.jsr?.enabled && !dryRun) {
                publishedPackages.push({
                  name: packageJson.name,
                  version: versionInfo.newVersion,
                  registry: "jsr",
                  url: `${MESSAGES.JSR_REGISTRY_URL}/@${packageJson.name}`,
                });
              }
            }

            // Create GitHub/GitLab release if configured
            const gitReleaseResult = releaseCreator.createGitRelease(
              cwd,
              releaseConfig,
              packageJson,
              versionInfo,
              logger,
              dryRun,
            );
            if (handleFailure(gitReleaseResult, "Git release creation")) {
              continue;
            }
          }

          // Run post-publish hook (errors logged but don't fail release since package already published)
          if (pkg.hooks?.postPublish && !packageFailed) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postPublish,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success) {
              warnings.push(
                `[${packageJson.name}] postPublish hook failed: ${hookResult.message}`,
              );
            }
          }

          // Run post-release hook (errors logged but don't fail release since package already published)
          if (pkg.hooks?.postRelease && !packageFailed) {
            const hookResult = hookRunner.runHook(
              pkg.hooks.postRelease,
              cwd,
              logger,
              dryRun,
              hookContext,
            );
            if (!hookResult.success) {
              warnings.push(
                `[${packageJson.name}] postRelease hook failed: ${hookResult.message}`,
              );
            }
          }

          if (!packageFailed) {
            packagesProcessed.push({
              name: packageJson.name,
              directory: pkg.directory,
              version: versionInfo.newVersion,
              tag: versionInfo.newTag,
              status: "success",
              message: dryRun
                ? "Would have been released"
                : "Released successfully",
            });
          }
        } else {
          packagesProcessed.push({
            name: packageJson.name,
            directory: pkg.directory,
            status: "skipped",
            message: "Release disabled",
          });
        }
      }

      // Run global post-release hook only if no errors occurred
      // (errors logged but don't fail release since it's post-processing)
      const hasFailedPackages = packagesProcessed.some(
        (p) => p.status === "failed",
      );
      if (
        config.hooks?.postRelease &&
        !hasFailedPackages &&
        errors.length === 0
      ) {
        const hookResult = hookRunner.runHook(
          config.hooks.postRelease,
          originalCwd,
          logger,
          dryRun,
          { packageManager },
        );
        if (!hookResult.success) {
          warnings.push(
            `Global postRelease hook failed: ${hookResult.message}`,
          );
        }
      } else if (
        config.hooks?.postRelease &&
        (hasFailedPackages || errors.length > 0)
      ) {
        logger.vibe(formatSkip("Skipping postRelease hook due to errors"));
      }

      output.push(MESSAGES.RELEASE_COMPLETE);

      // Calculate total time
      timings.total = Date.now() - startTime;

      // Add summary
      const successCount = packagesProcessed.filter(
        (p) => p.status === "success",
      ).length;
      const skipCount = packagesProcessed.filter(
        (p) => p.status === "skipped",
      ).length;
      const failCount = packagesProcessed.filter(
        (p) => p.status === "failed",
      ).length;

      // Show summary
      logger.vibe("");
      logger.vibe(formatSection("Summary"));
      if (failCount > 0) {
        logger.vibe(formatError(`${failCount} package(s) failed`));
      }
      if (successCount > 0) {
        logger.vibe(formatSuccess(`${successCount} package(s) released`));
      }
      if (skipCount > 0) {
        logger.vibe(formatSkip(`${skipCount} package(s) skipped`));
      }
      logger.vibe(`  Total time: ${formatDuration(timings.total)}`);
      logger.vibe("");

      logger.debug(MESSAGES.SUMMARY_HEADER, {
        success: successCount,
        skipped: skipCount,
        failed: failCount,
      });
      logger.debug(MESSAGES.TIMING_REPORT, { ...timings });

      // Send notifications if configured
      const notifyConfig =
        config.notifications ||
        (notifyWebhook
          ? {
              enabled: true,
              webhookUrl: notifyWebhook,
              onSuccess: true,
              onFailure: true,
            }
          : undefined);

      if (notifyConfig?.enabled) {
        const notifyResult = await notificationService.sendNotification(
          notifyConfig,
          {
            success: errors.length === 0,
            packageName: packagesProcessed[0]?.name,
            version: packagesProcessed[0]?.version,
            duration: timings.total,
            timings,
          },
          logger,
        );
        notificationsSent.push(notifyResult);
      }

      // Extract only the fields expected by the response schema
      const ciEnvironment = ciEnv.isCI
        ? {
            isCI: ciEnv.isCI as boolean,
            provider: ciEnv.provider,
            branch: ciEnv.branch,
            commit: ciEnv.commit,
            pr: ciEnv.pr,
            tag: ciEnv.tag,
          }
        : undefined;

      const hasErrors = errors.length > 0;
      return success(
        {
          success: !hasErrors,
          output: output.join("\n"),
          duration: timings.total,
          packagesProcessed,
          ciEnvironment,
          errors: hasErrors ? errors : null,
          warnings: warnings.length > 0 ? warnings : null,
          gitInfo: globalGitInfo,
          publishedPackages:
            publishedPackages.length > 0 ? publishedPackages : null,
          timings,
          notificationsSent:
            notificationsSent.length > 0 ? notificationsSent : null,
        } satisfies ReleaseResponseType,
        hasErrors ? { isErrorResponse: true } : undefined,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      output.push(MESSAGES.RELEASE_FAILED);

      // Calculate total time even on failure
      timings.total = Date.now() - startTime;

      // Send failure notification if configured
      const notifyConfig =
        config?.notifications ||
        (data.notifyWebhook
          ? {
              enabled: true,
              webhookUrl: data.notifyWebhook,
              onSuccess: true,
              onFailure: true,
            }
          : undefined);

      if (notifyConfig?.enabled) {
        const notifyResult = await notificationService.sendNotification(
          notifyConfig,
          {
            success: false,
            error: errorMessage,
            duration: timings.total,
            timings,
          },
          logger,
        );
        notificationsSent.push(notifyResult);
      }

      return success(
        {
          success: false,
          output: output.join("\n"),
          duration: timings.total,
          packagesProcessed,
          ciEnvironment: undefined,
          errors,
          warnings: warnings.length > 0 ? warnings : null,
          gitInfo: globalGitInfo,
          publishedPackages:
            publishedPackages.length > 0 ? publishedPackages : null,
          timings,
          notificationsSent:
            notificationsSent.length > 0 ? notificationsSent : null,
        } satisfies ReleaseResponseType,
        { isErrorResponse: true },
      );
    }
  }
}

// Singleton instance
export const releaseExecutor = new ReleaseExecutor();
