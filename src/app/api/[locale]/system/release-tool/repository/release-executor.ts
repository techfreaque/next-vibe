/**
 * Release Executor Service
 * Main orchestrator for the release process
 */

import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type endpoints from "../definition";
import { assetZipper } from "./asset-zipper";
import { changelogGenerator } from "./changelog-generator";
import { ciDetector } from "./ci-detector";
import { configLoader } from "./config";
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
import type { GitOpsConfig, ReleaseConfig } from "../definition";
import type {
  GitInfo,
  HookContext,
  NotificationResult,
  PackageResult,
  PublishedPackage,
  Timings,
} from "./types";
import { validationService } from "./validation";
import { versionService } from "./version-service";

// ============================================================================
// Types
// ============================================================================

type RequestType = typeof endpoints.POST.types.RequestOutput;
type ReleaseResponseType = typeof endpoints.POST.types.ResponseOutput;

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
    const trackTime = (phase: keyof Omit<Timings, "total">, start: number): void => {
      timings[phase] = Date.now() - start;
    };

    // Detect CI environment
    const ciEnv = ciDetector.detect();
    const isCI = data.ci || ciEnv.isCI;
    const isVerbose = data.verbose || data.inlineConfig?.verbose;

    if (ciEnv.isCI) {
      logger.info(MESSAGES.CI_ENV_DETECTED, { provider: ciEnv.provider });
    }

    if (isVerbose) {
      logger.info(MESSAGES.VERBOSE_ENABLED);
    }

    // Declare config outside try block so it's available in catch
    let config: ReleaseConfig | undefined;

    try {
      output.push(MESSAGES.RELEASE_START);

      // Load config
      if (data.inlineConfig) {
        config = data.inlineConfig;
        logger.info("Using inline configuration");
      } else {
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

      const packageManager = config.packageManager ?? "bun";
      logger.info(`Using package manager: ${packageManager}`);

      const originalCwd = process.cwd();
      const mainBranch = config.branch?.main ?? "main";

      // Gather git info
      globalGitInfo = gitService.getInfo(originalCwd, logger);
      if (isVerbose && globalGitInfo) {
        logger.info("Git info", {
          branch: globalGitInfo.currentBranch,
          lastTag: globalGitInfo.lastTag,
          uncommittedChanges: globalGitInfo.hasUncommittedChanges,
          commitsSinceTag: globalGitInfo.commitsSinceLastTag,
        });
      }

      // Run validations
      const validationResult = validationService.runAll(
        config,
        globalGitInfo,
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
      logger.info(MESSAGES.VALIDATION_PASSED);

      // Check branch if configured
      if (!isCI && !config.branch?.allowNonMain) {
        const currentBranch = gitService.getCurrentBranch();
        if (currentBranch !== mainBranch) {
          logger.warn(MESSAGES.GIT_NOT_ON_MAIN, { currentBranch });
          const prUrl = gitService.getPRUrl(currentBranch);
          if (prUrl) {
            warnings.push(`Not on ${mainBranch} branch. Create PR: ${prUrl}`);
          }
        }
      }

      // Run global pre-release hook
      if (config.hooks?.preRelease) {
        const hookResult = hookRunner.runHook(
          config.hooks.preRelease,
          originalCwd,
          logger,
          data.dryRun,
          { packageManager },
        );
        if (!hookResult.success) {
          errors.push(`Pre-release hook failed: ${hookResult.message}`);
        }
      }

      // Filter packages if targetPackage is specified
      let packages = config.packages;
      const targetPkg = data.targetPackage;
      if (targetPkg) {
        packages = packages.filter(
          (pkg) =>
            pkg.directory === targetPkg ||
            pkg.directory.includes(targetPkg),
        );
        if (packages.length === 0) {
          return fail({
            message: "app.api.system.releaseTool.errors.packageNotFound",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { targetPackage: targetPkg },
          });
        }
      }

      // Handle force update mode
      if (data.forceUpdate) {
        output.push(MESSAGES.RELEASE_FORCE_UPDATE);
        for (const pkg of packages) {
          if (pkg.updateDeps === true || pkg.updateDeps === "force") {
            const cwd = join(originalCwd, pkg.directory);
            const pkgJsonResult = packageService.getPackageJson(cwd, logger);
            if (pkgJsonResult.success) {
              const updateResult = dependencyManager.updateDependencies(
                cwd,
                packageManager,
                pkgJsonResult.data,
                logger,
                data.dryRun,
              );
              if (!updateResult.success) {
                errors.push(`Failed to update ${pkgJsonResult.data.name}: ${updateResult.message}`);
              }
            }
          }
        }
        return success({
          success: errors.length === 0,
          output: output.join("\n"),
          duration: Date.now() - startTime,
          packagesProcessed: [],
          errors: errors.length > 0 ? errors : undefined,
          warnings: warnings.length > 0 ? warnings : undefined,
        });
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
        logger.info(MESSAGES.PROCESSING_PACKAGE, { name: packageJson.name });

        // Create hook context for this package
        const hookContext: HookContext = {
          packageManager,
          packageName: packageJson.name,
          version: packageJson.version,
          directory: pkg.directory,
        };

        try {
          // Install dependencies if configured
          if (pkg.install) {
            if (pkg.hooks?.preInstall) {
              hookRunner.runHook(pkg.hooks.preInstall, cwd, logger, data.dryRun, hookContext);
            }
            const installCommand = typeof pkg.install === "string" ? pkg.install : undefined;
            const installResult = qualityRunner.runInstall(cwd, packageManager, logger, data.dryRun, installCommand);
            if (!installResult.success && !config.continueOnError) {
              throw new Error(installResult.message);
            }
            if (pkg.hooks?.postInstall) {
              hookRunner.runHook(pkg.hooks.postInstall, cwd, logger, data.dryRun, hookContext);
            }
          }

          // Clean if configured
          if (pkg.clean) {
            if (pkg.hooks?.preClean) {
              hookRunner.runHook(pkg.hooks.preClean, cwd, logger, data.dryRun, hookContext);
            }
            const cleanCommand = typeof pkg.clean === "string" ? pkg.clean : undefined;
            const cleanResult = qualityRunner.runClean(cwd, packageManager, logger, data.dryRun, cleanCommand);
            if (!cleanResult.success && !config.continueOnError) {
              throw new Error(cleanResult.message);
            }
            if (pkg.hooks?.postClean) {
              hookRunner.runHook(pkg.hooks.postClean, cwd, logger, data.dryRun, hookContext);
            }
          }

          // Update dependencies if needed
          if (pkg.updateDeps === true || pkg.updateDeps === "force") {
            const updateResult = dependencyManager.updateDependencies(
              cwd,
              packageManager,
              packageJson,
              logger,
              data.dryRun,
            );
            if (!updateResult.success && !config.continueOnError) {
              throw new Error(updateResult.message);
            }
          }

          // Lint
          if (pkg.lint && !data.skipLint) {
            if (pkg.hooks?.preLint) {
              hookRunner.runHook(pkg.hooks.preLint, cwd, logger, data.dryRun, hookContext);
            }
            const lintCommand = typeof pkg.lint === "string" ? pkg.lint : undefined;
            const lintResult = qualityRunner.runLint(cwd, packageManager, logger, data.dryRun, lintCommand);
            if (!lintResult.success && !config.continueOnError) {
              throw new Error(lintResult.message);
            }
            if (pkg.hooks?.postLint) {
              hookRunner.runHook(pkg.hooks.postLint, cwd, logger, data.dryRun, hookContext);
            }
          }

          // Typecheck
          if (pkg.typecheck && !data.skipTypecheck) {
            const typecheckCommand = typeof pkg.typecheck === "string" ? pkg.typecheck : undefined;
            const typecheckResult = qualityRunner.runTypecheck(cwd, packageManager, logger, data.dryRun, typecheckCommand);
            if (!typecheckResult.success && !config.continueOnError) {
              throw new Error(typecheckResult.message);
            }
          }

          // Build
          if (pkg.build && !data.skipBuild) {
            if (pkg.hooks?.preBuild) {
              hookRunner.runHook(pkg.hooks.preBuild, cwd, logger, data.dryRun, hookContext);
            }
            const buildCommand = typeof pkg.build === "string" ? pkg.build : undefined;
            const buildResult = qualityRunner.runBuild(cwd, packageManager, logger, data.dryRun, buildCommand);
            if (!buildResult.success && !config.continueOnError) {
              throw new Error(buildResult.message);
            }
            if (pkg.hooks?.postBuild) {
              hookRunner.runHook(pkg.hooks.postBuild, cwd, logger, data.dryRun, hookContext);
            }
          }

          // Tests
          if (pkg.test && !data.skipTests) {
            if (pkg.hooks?.preTest) {
              hookRunner.runHook(pkg.hooks.preTest, cwd, logger, data.dryRun, hookContext);
            }
            const testCommand = typeof pkg.test === "string" ? pkg.test : undefined;
            const testResult = qualityRunner.runTests(cwd, packageManager, logger, data.dryRun, testCommand);
            if (!testResult.success && !config.continueOnError) {
              throw new Error(testResult.message);
            }
            if (pkg.hooks?.postTest) {
              hookRunner.runHook(pkg.hooks.postTest, cwd, logger, data.dryRun, hookContext);
            }
          }

          // Snyk
          if (pkg.snyk && !data.skipSnyk) {
            const snykResult = isCI
              ? snykService.runSnykMonitor(cwd, packageJson.name, logger, data.dryRun)
              : snykService.runSnykTest(cwd, packageJson.name, logger, data.dryRun);
            if (!snykResult.success && !config.continueOnError) {
              throw new Error(snykResult.message);
            }
          }

          // Handle release
          const releaseConfig = pkg.release;
          if (releaseConfig !== false) {
            const versionInfo = versionService.getVersionInfo(
              logger,
              pkg,
              packageJson,
              config,
              releaseConfig,
              data.versionIncrement,
              data.prereleaseId,
            );

            logger.info(
              `Processing tag release (${versionInfo.newTag}) for ${packageJson.name}...`,
            );

            // Check if tag exists
            const tagExists = await gitService.checkTagExists(versionInfo.newTag, logger);
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

            // Check for new commits
            if (!gitService.hasNewCommitsSinceTag(versionInfo.lastTag, cwd, logger)) {
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
              hookRunner.runHook(pkg.hooks.preRelease, cwd, logger, data.dryRun, hookContext);
            }

            // Update version
            const updateResult = packageService.updatePackageVersion(
              pkg,
              versionInfo.newVersion,
              cwd,
              originalCwd,
              logger,
            );
            if (!updateResult.success) {
              throw new Error(updateResult.message);
            }

            // Update version in other files
            versionService.updateVariableStringValue(logger, versionInfo.newVersion, releaseConfig);

            // Zip folders
            if (releaseConfig.foldersToZip) {
              await assetZipper.zipFolders(
                versionInfo.newTag,
                packageJson,
                releaseConfig.foldersToZip,
                logger,
                data.dryRun,
              );
            }

            // Run pre-publish hook
            if (pkg.hooks?.prePublish) {
              hookRunner.runHook(pkg.hooks.prePublish, cwd, logger, data.dryRun, hookContext);
            }

            // Generate changelog if configured
            if (!data.skipChangelog) {
              const changelogResult = changelogGenerator.generateChangelog(
                cwd,
                releaseConfig,
                versionInfo,
                logger,
                data.dryRun,
              );
              if (!changelogResult.success && !config.continueOnError) {
                throw new Error(changelogResult.message);
              }
            }

            // Create git tag and publish
            if (!data.skipPublish) {
              logger.info(`Releasing ${packageJson.name}...`);

              // Build effective git config with request overrides
              const effectiveGitConfig: GitOpsConfig = {
                ...releaseConfig.git,
                skipTag: data.skipGitTag || releaseConfig.git?.skipTag,
                skipPush: data.skipGitPush || releaseConfig.git?.skipPush,
              };

              // Use git service for tag creation
              const tagResult = gitService.createTag(
                versionInfo.newTag,
                cwd,
                logger,
                data.dryRun,
                effectiveGitConfig,
              );
              if (!tagResult.success && !config.continueOnError) {
                errors.push(`Git operations failed: ${tagResult.message}`);
              }

              // Update global git info with new tag
              if (globalGitInfo) {
                globalGitInfo.newTag = versionInfo.newTag;
              }

              // Run CI release command or npm publish
              if (isCI && releaseConfig.ciReleaseCommand) {
                const ciResult = publisher.runCiReleaseCommand(
                  releaseConfig,
                  packageJson.name,
                  logger,
                  data.dryRun,
                );
                if (!ciResult.success) {
                  throw new Error(ciResult.message);
                }
              } else if (releaseConfig.npm?.enabled !== false) {
                const npmResult = publisher.publishToNpm(
                  cwd,
                  packageJson,
                  releaseConfig,
                  logger,
                  data.dryRun,
                  ciEnv,
                );
                if (!npmResult.success && !config.continueOnError) {
                  throw new Error(npmResult.message);
                }

                // Track NPM publish
                if (npmResult.success && !data.dryRun) {
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
                  data.dryRun,
                );
                if (!jsrResult.success && !config.continueOnError) {
                  throw new Error(jsrResult.message);
                }

                // Track JSR publish
                if (jsrResult.success && releaseConfig.jsr?.enabled && !data.dryRun) {
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
                data.dryRun,
              );
              if (!gitReleaseResult.success && !config.continueOnError) {
                throw new Error(gitReleaseResult.message);
              }
            }

            // Run post-publish hook
            if (pkg.hooks?.postPublish) {
              hookRunner.runHook(pkg.hooks.postPublish, cwd, logger, data.dryRun, hookContext);
            }

            // Run post-release hook
            if (pkg.hooks?.postRelease) {
              hookRunner.runHook(pkg.hooks.postRelease, cwd, logger, data.dryRun, hookContext);
            }

            packagesProcessed.push({
              name: packageJson.name,
              directory: pkg.directory,
              version: versionInfo.newVersion,
              tag: versionInfo.newTag,
              status: "success",
              message: data.dryRun ? "Would have been released" : "Released successfully",
            });
          } else {
            packagesProcessed.push({
              name: packageJson.name,
              directory: pkg.directory,
              status: "skipped",
              message: "Release disabled",
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          packagesProcessed.push({
            name: packageJson.name,
            directory: pkg.directory,
            status: "failed",
            message: errorMessage,
          });
          errors.push(`${packageJson.name}: ${errorMessage}`);

          if (!config.continueOnError) {
            break;
          }
        }
      }

      // Run global post-release hook
      if (config.hooks?.postRelease) {
        hookRunner.runHook(
          config.hooks.postRelease,
          originalCwd,
          logger,
          data.dryRun,
          { packageManager },
        );
      }

      output.push(MESSAGES.RELEASE_COMPLETE);

      // Calculate total time
      timings.total = Date.now() - startTime;

      // Add summary
      const successCount = packagesProcessed.filter((p) => p.status === "success").length;
      const skipCount = packagesProcessed.filter((p) => p.status === "skipped").length;
      const failCount = packagesProcessed.filter((p) => p.status === "failed").length;

      if (isVerbose) {
        logger.info(MESSAGES.SUMMARY_HEADER, {
          success: successCount,
          skipped: skipCount,
          failed: failCount,
        });
        logger.info(MESSAGES.TIMING_REPORT, { ...timings });
      }

      // Send notifications if configured
      const notifyConfig = config.notifications || (data.notifyWebhook ? {
        enabled: true,
        webhookUrl: data.notifyWebhook,
        onSuccess: true,
        onFailure: true,
      } : undefined);

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

      return success({
        success: errors.length === 0,
        output: output.join("\n"),
        duration: timings.total,
        packagesProcessed,
        ciEnvironment: ciEnv.isCI ? ciEnv : undefined,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        gitInfo: globalGitInfo,
        publishedPackages: publishedPackages.length > 0 ? publishedPackages : undefined,
        timings,
        notificationsSent: notificationsSent.length > 0 ? notificationsSent : undefined,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(errorMessage);
      output.push(MESSAGES.RELEASE_FAILED);

      // Calculate total time even on failure
      timings.total = Date.now() - startTime;

      // Send failure notification if configured
      const notifyConfig = config?.notifications || (data.notifyWebhook ? {
        enabled: true,
        webhookUrl: data.notifyWebhook,
        onSuccess: true,
        onFailure: true,
      } : undefined);

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

      return success({
        success: false,
        output: output.join("\n"),
        duration: timings.total,
        packagesProcessed,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined,
        gitInfo: globalGitInfo,
        publishedPackages: publishedPackages.length > 0 ? publishedPackages : undefined,
        timings,
        notificationsSent: notificationsSent.length > 0 ? notificationsSent : undefined,
      });
    }
  }
}

// Singleton instance
export const releaseExecutor = new ReleaseExecutor();
