/**
 * Git Service
 * Git operations including info retrieval, tagging, and remote operations
 */

import { execSync } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { GitInfo, GitOpsConfig, RepoInfo } from "../definition";
import { MESSAGES } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IGitService {
  /**
   * Get comprehensive git information for a directory
   */
  getInfo(cwd: string, logger: EndpointLogger): GitInfo;

  /**
   * Check if a tag exists
   */
  checkTagExists(tag: string, logger: EndpointLogger): Promise<boolean>;

  /**
   * Check if there are new commits since a tag
   */
  hasNewCommitsSinceTag(
    tag: string,
    cwd: string,
    logger: EndpointLogger,
  ): boolean;

  /**
   * Get the current branch name
   */
  getCurrentBranch(): string;

  /**
   * Get repository URL information
   */
  getRepoUrl(): RepoInfo | null;

  /**
   * Get PR URL for a branch
   */
  getPRUrl(currentBranch: string): string | null;

  /**
   * Create a git tag with configuration
   */
  createTag(
    tag: string,
    cwd: string,
    logger: EndpointLogger,
    dryRun: boolean,
    config?: GitOpsConfig,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class GitService implements IGitService {
  getInfo(cwd: string, logger: EndpointLogger): GitInfo {
    logger.debug("Getting git info", { cwd });
    let currentBranch: string | null = null;
    let lastTag: string | null = null;
    let commitsSinceLastTag: number | null = null;
    let hasUncommittedChanges = false;

    try {
      currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf8",
        cwd,
      }).trim();
    } catch {
      // Ignore - not a git repo or no commits
    }

    try {
      lastTag = execSync("git describe --tags --abbrev=0 2>/dev/null", {
        encoding: "utf8",
        cwd,
      }).trim();
    } catch {
      // No tags yet
    }

    try {
      if (lastTag) {
        const count = execSync(`git rev-list ${lastTag}..HEAD --count`, {
          encoding: "utf8",
          cwd,
        }).trim();
        commitsSinceLastTag = parseInt(count, 10);
      }
    } catch {
      // Ignore
    }

    try {
      const status = execSync("git status --porcelain", {
        encoding: "utf8",
        cwd,
      }).trim();
      hasUncommittedChanges = status.length > 0;
    } catch {
      // Ignore
    }

    return {
      currentBranch,
      lastTag,
      newTag: null,
      commitsSinceLastTag,
      hasUncommittedChanges,
    };
  }

  async checkTagExists(tag: string, logger: EndpointLogger): Promise<boolean> {
    try {
      execSync(`git rev-parse ${tag}`, {
        encoding: "utf8",
        stdio: "pipe",
      });
      logger.info(MESSAGES.GIT_TAG_EXISTS, { tag });
      return true;
    } catch {
      return false;
    }
  }

  hasNewCommitsSinceTag(
    tag: string,
    cwd: string,
    logger: EndpointLogger,
  ): boolean {
    if (!tag || tag === "v0.0.0") {
      return true;
    }

    try {
      // Check if tag exists
      execSync(`git rev-parse ${tag}`, {
        encoding: "utf8",
        cwd,
        stdio: "pipe",
      });

      // Get commit count since tag
      const count = execSync(`git rev-list ${tag}..HEAD --count`, {
        encoding: "utf8",
        cwd,
      }).trim();

      const commitCount = parseInt(count, 10);
      if (commitCount === 0) {
        logger.info(MESSAGES.GIT_NO_COMMITS, { tag });
        return false;
      }

      logger.info(MESSAGES.GIT_COMMITS_SINCE_TAG, { count: commitCount, tag });
      return true;
    } catch {
      // Tag doesn't exist, so there are "new commits" since then
      return true;
    }
  }

  getCurrentBranch(): string {
    try {
      return execSync("git rev-parse --abbrev-ref HEAD", {
        encoding: "utf8",
      }).trim();
    } catch {
      return "main";
    }
  }

  getRepoUrl(): RepoInfo | null {
    try {
      const remoteUrl = execSync("git config --get remote.origin.url", {
        encoding: "utf8",
      }).trim();

      // Parse GitHub/GitLab URL
      let url = remoteUrl;
      let type: "github" | "gitlab" | "bitbucket" | "other" = "other";

      // Convert SSH to HTTPS format
      if (url.startsWith("git@github.com:")) {
        url = url.replace("git@github.com:", "https://github.com/");
        type = "github";
      } else if (url.startsWith("git@gitlab.com:")) {
        url = url.replace("git@gitlab.com:", "https://gitlab.com/");
        type = "gitlab";
      } else if (url.startsWith("git@bitbucket.org:")) {
        url = url.replace("git@bitbucket.org:", "https://bitbucket.org/");
        type = "bitbucket";
      } else if (url.includes("github.com")) {
        type = "github";
      } else if (url.includes("gitlab.com")) {
        type = "gitlab";
      } else if (url.includes("bitbucket.org")) {
        type = "bitbucket";
      }

      // Remove .git suffix
      url = url.replace(/\.git$/, "");

      // Parse owner and repo
      const match = url.match(/[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
      const owner = match?.[1];
      const repo = match?.[2];

      return { type, url, owner, repo };
    } catch {
      return null;
    }
  }

  getPRUrl(currentBranch: string): string | null {
    const repoInfo = this.getRepoUrl();
    if (!repoInfo) {
      return null;
    }

    switch (repoInfo.type) {
      case "github":
        return `${repoInfo.url}/compare/${currentBranch}?expand=1`;
      case "gitlab":
        return `${repoInfo.url}/-/merge_requests/new?merge_request[source_branch]=${currentBranch}`;
      case "bitbucket":
        return `${repoInfo.url}/pull-requests/new?source=${currentBranch}`;
      default:
        return null;
    }
  }

  createTag(
    tag: string,
    cwd: string,
    logger: EndpointLogger,
    dryRun: boolean,
    config?: GitOpsConfig,
  ): ResponseType<void> {
    const skipTag = config?.skipTag ?? false;
    const skipPush = config?.skipPush ?? false;
    const remote = config?.remote ?? "origin";
    // eslint-disable-next-line no-template-curly-in-string -- Intentional commit message template
    const commitMessage = config?.commitMessage ?? "chore(release): ${version}";
    const signTag = config?.signTag ?? false;
    const signCommit = config?.signCommit ?? false;

    // Stage all changes (package.json version bump, etc.)
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "git add ." });
    } else {
      try {
        execSync("git add .", { cwd, encoding: "utf8" });
        logger.debug("git add successful", { cwd });
      } catch (err) {
        const error = err as { stderr?: Buffer | string; message?: string };
        const stderr = error.stderr
          ? error.stderr.toString()
          : error.message || String(err);
        logger.error("git add failed", { stderr, cwd });
        return fail({
          message: "app.api.system.releaseTool.errors.gitAddFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: stderr },
        });
      }
    }

    // Create commit with version
    const finalMessage = commitMessage.replace(
      // eslint-disable-next-line no-template-curly-in-string -- Intentional commit message template
      "${version}",
      tag,
    );

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, {
        action: `git commit -m "${finalMessage}"`,
      });
    } else {
      const commitFlags = signCommit ? "-S" : "";
      try {
        execSync(
          `git commit ${commitFlags} -m "${finalMessage}" --allow-empty`,
          {
            cwd,
            encoding: "utf8",
          },
        );
        logger.debug("git commit successful", { message: finalMessage });
      } catch (err) {
        // May fail if nothing to commit - that's OK
        const error = err as { stderr?: Buffer | string; message?: string };
        const stderr = error.stderr
          ? error.stderr.toString()
          : error.message || String(err);
        logger.debug("git commit had no changes or failed (continuing)", {
          stderr,
        });
      }
    }

    // Create tag
    if (!skipTag) {
      if (dryRun) {
        logger.info(MESSAGES.DRY_RUN_MODE, { action: `git tag ${tag}` });
      } else {
        const tagFlags = signTag ? "-s" : "-a";
        try {
          execSync(`git tag ${tagFlags} ${tag} -m "Release ${tag}"`, {
            cwd,
            encoding: "utf8",
          });
          logger.info(MESSAGES.GIT_TAG_CREATED, { tag });
        } catch (err) {
          const error = err as { stderr?: Buffer | string; message?: string };
          const stderr = error.stderr
            ? error.stderr.toString()
            : error.message || String(err);
          logger.error("git tag failed", { stderr, tag, cwd });
          return fail({
            message: "app.api.system.releaseTool.errors.gitTagFailed",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { tag, error: stderr },
          });
        }
      }
    }

    // Push to remote
    if (!skipPush) {
      if (dryRun) {
        logger.info(MESSAGES.DRY_RUN_MODE, {
          action: `git push ${remote} && git push ${remote} ${tag}`,
        });
      } else {
        // Push commits
        try {
          execSync(`git push ${remote}`, { cwd, encoding: "utf8" });
          logger.debug("git push successful", { remote });
        } catch (err) {
          const error = err as { stderr?: Buffer | string; message?: string };
          const stderr = error.stderr
            ? error.stderr.toString()
            : error.message || String(err);
          logger.error("git push failed", { stderr, remote, cwd });
          return fail({
            message: "app.api.system.releaseTool.errors.gitPushFailed",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { remote, error: stderr },
          });
        }

        // Push tag if created
        if (!skipTag) {
          try {
            execSync(`git push ${remote} ${tag}`, { cwd, encoding: "utf8" });
            logger.debug("git push tag successful", { remote, tag });
          } catch (err) {
            const error = err as {
              stderr?: Buffer | string;
              message?: string;
            };
            const stderr = error.stderr
              ? error.stderr.toString()
              : error.message || String(err);
            logger.error("git push tag failed", { stderr, remote, tag, cwd });
            return fail({
              message: "app.api.system.releaseTool.errors.gitPushTagFailed",
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: { tag, remote, error: stderr },
            });
          }
        }

        logger.info(MESSAGES.GIT_PUSH_SUCCESS, { remote });
      }
    }

    return success();
  }
}

// Singleton instance
export const gitService = new GitService();
