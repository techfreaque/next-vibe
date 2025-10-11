import { join } from "node:path";

import type { LaunchpadConfig } from "../types/types.js";
import { logger } from "../utils/logger.js";
import {
  cloneRepo,
  closePrompt,
  getAllRepos,
  repoExists,
  updateRepo,
  updateRootRepo,
} from "../utils/repo-utils.js";

export async function updateAllRepos(
  force = false,
  rootDir: string,
  config: LaunchpadConfig,
): Promise<void> {
  logger("Updating all repositories...");
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
        logger(
          `⚠️  Failed to clone ${repoPath}, continuing with other repositories...`,
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
        logger(
          `⚠️  Failed to update ${repoPath}, continuing with other repositories...`,
        );
      }
    }
  }

  // Report results
  if (clonedCount > 0) {
    logger(`✅ Successfully cloned ${clonedCount} missing repositories.`);
  }
  if (updatedCount > 0) {
    logger(`✅ Successfully updated ${updatedCount} existing repositories.`);
  }
  if (failedCloneCount > 0) {
    logger(`❌ Failed to clone ${failedCloneCount} repositories:`);
    failedCloneRepos.forEach((repo) => logger(`   - ${repo}`));
  }
  if (failedUpdateCount > 0) {
    logger(`❌ Failed to update ${failedUpdateCount} repositories:`);
    failedUpdateRepos.forEach((repo) => logger(`   - ${repo}`));
  }

  // Also update the root repository
  await updateRootRepo(force, rootDir);

  closePrompt();
}
