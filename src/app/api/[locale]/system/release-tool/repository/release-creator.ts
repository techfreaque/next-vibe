/**
 * Release Creator Service
 * Create GitHub and GitLab releases
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { PackageJson, ReleaseOptions, VersionInfo } from "../definition";
import { MESSAGES } from "./constants";
import { gitService } from "./git-service";

// ============================================================================
// Interface
// ============================================================================

export interface IReleaseCreator {
  /**
   * Create a GitHub or GitLab release
   */
  createGitRelease(
    cwd: string,
    releaseConfig: ReleaseOptions,
    packageJson: PackageJson,
    versionInfo: VersionInfo,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<string | undefined>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ReleaseCreator implements IReleaseCreator {
  createGitRelease(
    cwd: string,
    releaseConfig: ReleaseOptions,
    packageJson: PackageJson,
    versionInfo: VersionInfo,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<string | undefined> {
    const gitReleaseConfig = releaseConfig.gitRelease;
    if (!gitReleaseConfig?.enabled) {
      return success(undefined);
    }

    const repo = gitService.getRepoUrl();
    if (!repo) {
      logger.warn("Could not determine repository URL, skipping git release");
      return success(undefined);
    }

    // Route to appropriate platform
    if (repo.type === "gitlab") {
      return this.createGitLabRelease(
        cwd,
        releaseConfig,
        packageJson,
        versionInfo,
        repo,
        logger,
        dryRun,
      );
    }

    if (repo.type !== "github") {
      logger.warn(
        `Git releases only supported for GitHub and GitLab (found: ${repo.type})`,
      );
      return success(undefined);
    }

    // GitHub release
    return this.createGitHubRelease(
      cwd,
      releaseConfig,
      packageJson,
      versionInfo,
      repo,
      logger,
      dryRun,
    );
  }

  private createGitHubRelease(
    cwd: string,
    releaseConfig: ReleaseOptions,
    packageJson: PackageJson,
    versionInfo: VersionInfo,
    repo: { type: string; url: string },
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<string | undefined> {
    const gitReleaseConfig = releaseConfig.gitRelease;

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "create GitHub release" });
      return success(undefined);
    }

    logger.info(MESSAGES.GITHUB_RELEASE_CREATING);

    try {
      // Check if gh CLI is available
      try {
        execSync("gh --version", { stdio: "pipe" });
      } catch {
        logger.warn("GitHub CLI (gh) not found, skipping GitHub release");
        return success(undefined);
      }

      // Build release command
      const commandParts = ["gh", "release", "create", versionInfo.newTag];

      // Add title
      /* eslint-disable no-template-curly-in-string -- Intentional release title/body templates */
      const title =
        gitReleaseConfig?.title
          ?.replace("${version}", versionInfo.newVersion)
          .replace("${name}", packageJson.name) ??
        /* eslint-enable no-template-curly-in-string */
        `Release ${versionInfo.newTag}`;
      commandParts.push(`--title "${title}"`);

      // Add notes
      if (gitReleaseConfig?.generateNotes) {
        commandParts.push("--generate-notes");
      } else if (gitReleaseConfig?.body) {
        /* eslint-disable no-template-curly-in-string -- Intentional release title/body templates */
        const body = gitReleaseConfig.body
          .replace("${version}", versionInfo.newVersion)
          .replace("${name}", packageJson.name);
        /* eslint-enable no-template-curly-in-string */
        commandParts.push(`--notes "${body}"`);
      }

      // Add flags
      if (gitReleaseConfig?.draft) {
        commandParts.push("--draft");
      }
      if (gitReleaseConfig?.prerelease) {
        commandParts.push("--prerelease");
      }
      if (gitReleaseConfig?.target) {
        commandParts.push(`--target ${gitReleaseConfig.target}`);
      }
      if (gitReleaseConfig?.discussionCategory) {
        commandParts.push(
          `--discussion-category ${gitReleaseConfig.discussionCategory}`,
        );
      }

      // Add assets
      if (gitReleaseConfig?.assets) {
        for (const asset of gitReleaseConfig.assets) {
          const assetPath = resolve(cwd, asset.path);
          if (existsSync(assetPath)) {
            let assetArg = assetPath;
            if (asset.label) {
              assetArg += `#${asset.label}`;
            }
            commandParts.push(assetArg);
          } else {
            logger.warn(`Release asset not found: ${asset.path}`);
          }
        }
      }

      const command = commandParts.join(" ");
      const output = execSync(command, { encoding: "utf8", cwd }).trim();

      logger.info(MESSAGES.GITHUB_RELEASE_SUCCESS, { tag: versionInfo.newTag });

      // Return the release URL
      const releaseUrl =
        output || `${repo.url}/releases/tag/${versionInfo.newTag}`;
      return success(releaseUrl);
    } catch (error) {
      logger.error(MESSAGES.GITHUB_RELEASE_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.gitRelease.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  private createGitLabRelease(
    cwd: string,
    releaseConfig: ReleaseOptions,
    packageJson: PackageJson,
    versionInfo: VersionInfo,
    repo: { type: string; url: string },
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<string | undefined> {
    const gitReleaseConfig = releaseConfig.gitRelease;

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "create GitLab release" });
      return success(undefined);
    }

    logger.info(MESSAGES.GITLAB_RELEASE_CREATING);

    try {
      // Check if glab CLI is available
      try {
        execSync("glab --version", { stdio: "pipe" });
      } catch {
        logger.warn("GitLab CLI (glab) not found, skipping GitLab release");
        return success(undefined);
      }

      // Build release command
      const commandParts = ["glab", "release", "create", versionInfo.newTag];

      // Add title/name
      /* eslint-disable no-template-curly-in-string -- Intentional release title/body templates */
      const title =
        gitReleaseConfig?.title
          ?.replace("${version}", versionInfo.newVersion)
          .replace("${name}", packageJson.name) ??
        /* eslint-enable no-template-curly-in-string */
        `Release ${versionInfo.newTag}`;
      commandParts.push(`--name "${title}"`);

      // Add notes
      if (gitReleaseConfig?.body) {
        /* eslint-disable no-template-curly-in-string -- Intentional release title/body templates */
        const body = gitReleaseConfig.body
          .replace("${version}", versionInfo.newVersion)
          .replace("${name}", packageJson.name);
        /* eslint-enable no-template-curly-in-string */
        commandParts.push(`--notes "${body}"`);
      } else if (gitReleaseConfig?.generateNotes) {
        commandParts.push("--notes ''");
      }

      // Add ref (target commitish)
      if (gitReleaseConfig?.target) {
        commandParts.push(`--ref ${gitReleaseConfig.target}`);
      }

      // Add assets
      if (gitReleaseConfig?.assets) {
        for (const asset of gitReleaseConfig.assets) {
          const assetPath = resolve(cwd, asset.path);
          if (existsSync(assetPath)) {
            const assetName = asset.name ?? basename(assetPath);
            commandParts.push(
              `--assets-links '[{"name": "${assetName}", "url": "file://${assetPath}"}]'`,
            );
          } else {
            logger.warn(`Release asset not found: ${asset.path}`);
          }
        }
      }

      const command = commandParts.join(" ");
      const output = execSync(command, { encoding: "utf8", cwd }).trim();

      logger.info(MESSAGES.GITLAB_RELEASE_SUCCESS, { tag: versionInfo.newTag });

      // Return the release URL
      const releaseUrl =
        output || `${repo.url}/-/releases/${versionInfo.newTag}`;
      return success(releaseUrl);
    } catch (error) {
      logger.error(MESSAGES.GITLAB_RELEASE_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.gitRelease.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }
}

// Singleton instance
export const releaseCreator = new ReleaseCreator();
