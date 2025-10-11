import { join } from "node:path";

import type { LaunchpadConfig } from "../types/types.js";
import { logger } from "../utils/logger.js";
import {
  cloneRepo,
  closePrompt,
  getAllRepos,
  repoExists,
} from "../utils/repo-utils.js";

export async function cloneMissingRepos(
  rootDir: string,
  config: LaunchpadConfig,
): Promise<void> {
  // await updateRootRepo(false, rootDir);

  logger("Checking for missing repositories...");
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
        logger(
          `⚠️  Failed to clone ${repoPath}, continuing with other repositories...`,
        );
      }
    }
  }

  if (clonedCount === 0 && failedCount === 0) {
    logger("No missing repositories found.");
  } else {
    if (clonedCount > 0) {
      logger(`✅ Successfully cloned ${clonedCount} missing repositories.`);
    }
    if (failedCount > 0) {
      logger(`❌ Failed to clone ${failedCount} repositories:`);
      failedRepos.forEach((repo) => logger(`   - ${repo}`));
    }
  }

  // Update root repository

  closePrompt();
}
