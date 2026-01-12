/// <reference types="node" />
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { LaunchpadConfig } from "../types/types.js";
import {
  cloneRepo,
  closePrompt,
  getAllRepos,
  repoExists,
  updateRepo,
  updateRootRepo,
} from "../utils/repo-utils.js";

export async function updateAllRepos(
  logger: EndpointLogger,
  force: boolean,
  rootDir: string,
  config: LaunchpadConfig,
  locale: CountryLanguage,
): Promise<void> {
  const { t } = simpleT(locale);
  logger.info("app.api.system.launchpad.updateAll.updating");
  const repos = getAllRepos(config);

  let clonedCount = 0;
  let updatedCount = 0;
  let failedCloneCount = 0;
  let failedUpdateCount = 0;
  const failedCloneRepos: string[] = [];
  const failedUpdateRepos: string[] = [];

  // Process each repo
  for (const repo of repos) {
    if (!repoExists(repo.path, rootDir) && repo.config.repoUrl) {
      // Clone missing repos
      try {
        await cloneRepo(
          repo.config.repoUrl,
          join(...repo.path),
          repo.config.branch,
          rootDir,
        );
        clonedCount++;
      } catch {
        failedCloneCount++;
        const repoPath = join(...repo.path);
        failedCloneRepos.push(repoPath);
        logger.info(
          t("app.api.system.launchpad.updateAll.failedClone", {
            repoPath,
          }),
        );
      }
    } else if (repoExists(repo.path, rootDir)) {
      // Update existing repos
      try {
        await updateRepo(repo.path, repo.config.branch, force, rootDir);
        updatedCount++;
      } catch {
        failedUpdateCount++;
        const repoPath = join(...repo.path);
        failedUpdateRepos.push(repoPath);
        logger.info(
          t("app.api.system.launchpad.updateAll.failedUpdate", {
            repoPath,
          }),
        );
      }
    }
  }

  // Report results
  if (clonedCount > 0) {
    logger.info(
      t("app.api.system.launchpad.updateAll.clonedSuccess", {
        count: clonedCount.toString(),
      }),
    );
  }
  if (updatedCount > 0) {
    logger.info(
      t("app.api.system.launchpad.updateAll.updatedSuccess", {
        count: updatedCount.toString(),
      }),
    );
  }
  if (failedCloneCount > 0) {
    logger.info(
      t("app.api.system.launchpad.updateAll.cloneFailed", {
        count: failedCloneCount.toString(),
      }),
    );
    failedCloneRepos.forEach((repo) =>
      logger.info(t("app.api.system.launchpad.updateAll.failedRepo", { repo })),
    );
  }
  if (failedUpdateCount > 0) {
    logger.info(
      t("app.api.system.launchpad.updateAll.updateFailed", {
        count: failedUpdateCount.toString(),
      }),
    );
    failedUpdateRepos.forEach((repo) =>
      logger.info(t("app.api.system.launchpad.updateAll.failedRepo", { repo })),
    );
  }

  // Also update the root repository
  await updateRootRepo(force, rootDir);

  closePrompt();
}
