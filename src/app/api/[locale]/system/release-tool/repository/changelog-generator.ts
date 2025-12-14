/**
 * Changelog Generator Service
 * Generate changelogs from git commits
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import type { ReleaseOptions } from "../definition";
import { MESSAGES } from "./constants";
import { gitService } from "./git-service";
import type { VersionInfo } from "./types";

// ============================================================================
// Interface
// ============================================================================

export interface IChangelogGenerator {
  /**
   * Generate changelog from commits
   */
  generateChangelog(
    cwd: string,
    releaseConfig: ReleaseOptions,
    versionInfo: VersionInfo,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ChangelogGenerator implements IChangelogGenerator {
  generateChangelog(
    cwd: string,
    releaseConfig: ReleaseOptions,
    versionInfo: VersionInfo,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    const changelogConfig = releaseConfig.changelog;
    if (!changelogConfig?.enabled) {
      return success(undefined);
    }

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "generate changelog" });
      return success(undefined);
    }

    logger.info(MESSAGES.CHANGELOG_GENERATING);

    const changelogPath = join(cwd, changelogConfig.file ?? "CHANGELOG.md");
    const repo = gitService.getRepoUrl();

    try {
      // Get commits since last tag
      let commits: string[] = [];
      try {
        const lastTag = versionInfo.lastTag;
        const commitLog = execSync(
          `git log ${lastTag}..HEAD --pretty=format:"%h|%s|%an|%ae" 2>/dev/null || git log --pretty=format:"%h|%s|%an|%ae"`,
          { encoding: "utf8", cwd },
        );
        commits = commitLog.trim().split("\n").filter(Boolean);
      } catch {
        logger.warn("Could not get commit log, generating minimal changelog");
      }

      // Parse commits by type
      const grouped: Record<string, Array<{ hash: string; message: string; author: string }>> = {
        feat: [],
        fix: [],
        docs: [],
        style: [],
        refactor: [],
        perf: [],
        test: [],
        build: [],
        ci: [],
        chore: [],
        other: [],
      };

      for (const line of commits) {
        const [hash, message, author] = line.split("|");
        if (!hash || !message) {
          continue;
        }

        // Parse conventional commit type
        const typeMatch = message.match(/^(\w+)(?:\([^)]+\))?!?:\s*/);
        const type = typeMatch?.[1]?.toLowerCase() ?? "other";
        const cleanMessage = message.replace(/^(\w+)(?:\([^)]+\))?!?:\s*/, "");

        const groupKey = type in grouped ? type : "other";
        grouped[groupKey]?.push({ hash: hash ?? "", message: cleanMessage, author: author ?? "" });
      }

      // Build changelog content
      let content = "";

      // Add header
      const header = changelogConfig.header ?? "# Changelog\n\nAll notable changes to this project will be documented in this file.\n";
      content += `${header}\n\n`;

      // Add version section
      const date = new Date().toISOString().split("T")[0];
      content += `## [${versionInfo.newVersion}](${repo?.url ?? ""}/releases/tag/${versionInfo.newTag}) (${date})\n\n`;

      // Add compare link if previous tag exists
      if (repo && versionInfo.lastTag !== "v0.0.0") {
        /* eslint-disable no-template-curly-in-string -- Intentional placeholder strings for user config */
        const compareUrl = changelogConfig.compareUrlFormat
          ?.replace("${baseUrl}", repo.url)
          .replace("${prevTag}", versionInfo.lastTag)
          .replace("${tag}", versionInfo.newTag)
          /* eslint-enable no-template-curly-in-string */
          ?? `${repo.url}/compare/${versionInfo.lastTag}...${versionInfo.newTag}`;
        content += `[Compare with previous release](${compareUrl})\n\n`;
      }

      // Section mappings
      const sectionNames: Record<string, string> = {
        feat: "Features",
        fix: "Bug Fixes",
        docs: "Documentation",
        style: "Styles",
        refactor: "Code Refactoring",
        perf: "Performance Improvements",
        test: "Tests",
        build: "Build System",
        ci: "CI/CD",
        chore: "Chores",
        other: "Other Changes",
      };

      // Add sections
      for (const [type, items] of Object.entries(grouped)) {
        if (items.length === 0) {
          continue;
        }

        const sectionName = sectionNames[type] ?? "Other";
        content += `### ${sectionName}\n\n`;

        for (const item of items) {
          /* eslint-disable no-template-curly-in-string -- Intentional placeholder strings for user config */
          const commitUrl = changelogConfig.commitUrlFormat
            ?.replace("${baseUrl}", repo?.url ?? "")
            .replace("${hash}", item.hash)
            /* eslint-enable no-template-curly-in-string */
            ?? (repo ? `${repo.url}/commit/${item.hash}` : "");

          content += `* ${item.message} ([${item.hash}](${commitUrl}))\n`;
        }
        content += "\n";
      }

      // Read existing changelog and prepend new content
      let existingContent = "";
      if (existsSync(changelogPath)) {
        existingContent = readFileSync(changelogPath, "utf8");
        // Remove header if it exists (will be re-added)
        if (existingContent.startsWith("# Changelog")) {
          const firstVersionIndex = existingContent.indexOf("## [");
          if (firstVersionIndex > 0) {
            existingContent = existingContent.substring(firstVersionIndex);
          }
        }
      }

      const finalContent = content + existingContent;
      writeFileSync(changelogPath, finalContent);

      logger.info(MESSAGES.CHANGELOG_GENERATED, { path: changelogPath });
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.CHANGELOG_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.changelog.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }
}

// Singleton instance
export const changelogGenerator = new ChangelogGenerator();
