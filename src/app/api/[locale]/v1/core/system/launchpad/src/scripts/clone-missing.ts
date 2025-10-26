/// <reference types="node" />
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { TFunction } from "@/i18n/core/static-types.js";

import type { LaunchpadConfig } from "../types/types.js";
import {
  cloneRepo,
  closePrompt,
  getAllRepos,
  repoExists,
} from "../utils/repo-utils.js";

export async function cloneMissingRepos(
  logger: EndpointLogger,
  rootDir: string,
  config: LaunchpadConfig,
  t: TFunction,
): Promise<void> {
  logger.info(t("app.api.v1.core.system.launchpad.cloneMissing.checking"));
  const repos = getAllRepos(config);
  let clonedCount = 0;
  let failedCount = 0;
  const failedRepos: string[] = [];

  // Clone missing repos
  for (const repo of repos) {
    if (!repoExists(repo.path, rootDir) && repo.config.repoUrl) {
      try {
        await cloneRepo(
          repo.config.repoUrl,
          join(...repo.path),
          repo.config.branch,
          rootDir,
        );
        clonedCount++;
      } catch {
        failedCount++;
        const repoPath = join(...repo.path);
        failedRepos.push(repoPath);
        logger.info(
          t("app.api.v1.core.system.launchpad.cloneMissing.failedToClone", {
            repoPath,
          }),
        );
      }
    }
  }

  if (clonedCount === 0 && failedCount === 0) {
    logger.info(t("app.api.v1.core.system.launchpad.cloneMissing.noMissing"));
  } else {
    if (clonedCount > 0) {
      logger.info(
        t("app.api.v1.core.system.launchpad.cloneMissing.success", {
          count: clonedCount.toString(),
        }),
      );
    }
    if (failedCount > 0) {
      logger.info(
        t("app.api.v1.core.system.launchpad.cloneMissing.failed", {
          count: failedCount.toString(),
        }),
      );
      failedRepos.forEach((repo) =>
        logger.info(
          t("app.api.v1.core.system.launchpad.cloneMissing.failedRepo", {
            repo,
          }),
        ),
      );
    }
  }

  closePrompt();
}
