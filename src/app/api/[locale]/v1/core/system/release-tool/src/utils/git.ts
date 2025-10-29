/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import type { ExecException } from "node:child_process";
import { exec, execSync } from "node:child_process";

import inquirer from "inquirer";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

export function getLastVersionFromGitTag(
  tagPrefix: string,
  mainPackagePath: string,
  logger: EndpointLogger,
): string {
  try {
    // First check if any tags exist at all

    const tagsExist =
      execSync("git tag", { cwd: mainPackagePath }).toString().trim().length >
      0;

    if (!tagsExist) {
      logger.info(
        "No git tags found in the repository. Using 0.0.0 as the initial version.",
      );

      return "0.0.0";
    }

    // If tags exist, try to find the latest one matching our prefix
    /* eslint-disable i18next/no-literal-string */
    const lastGitTag = execSync(
      `git describe --tags --abbrev=0 --match="${tagPrefix}*"`,
      {
        cwd: mainPackagePath,
      },
    )
      .toString()
      .trim();
    /* eslint-enable i18next/no-literal-string */
    const currentTagVersionNumber = lastGitTag.replace(tagPrefix, "");
    return currentTagVersionNumber;
  } catch (error) {
    // This will catch the "No names found, cannot describe anything" error
    // when there are no tags matching our prefix
    logger.error(
      "No previous tag found matching the prefix. Using 0.0.0 as the initial version.",
      parseError(error),
    );

    return "0.0.0";
  }
}

/**
 * Creates a new Git tag and pushes commits and tags.
 */
export function createGitTag(
  tag: string,
  mainPackagePath: string,
  logger: EndpointLogger,
): void {
  let hasCommitted = false;

  try {
    // Check if there are changes to commit first
    // eslint-disable-next-line i18next/no-literal-string
    const statusOutput = execSync("git status --porcelain", {
      encoding: "utf8",
      cwd: mainPackagePath,
    }).trim();

    // Only attempt to commit if there are changes
    if (statusOutput.length > 0) {
      // Stage all files including untracked files
      // eslint-disable-next-line i18next/no-literal-string
      execSync(`git add .`, {
        stdio: "inherit",
        cwd: mainPackagePath,
      });
      // eslint-disable-next-line i18next/no-literal-string
      execSync(`git commit -m "Release: ${tag}"`, {
        stdio: "inherit",
        cwd: mainPackagePath,
      });
      hasCommitted = true;

      logger.info("Changes committed successfully.");
    } else {
      logger.info("No changes detected, continuing with tag creation.");
    }
  } catch (error) {
    // For commit errors (not status check errors)

    logger.error("Failed to commit changes.", parseError(error));
    // eslint-disable-next-line i18next/no-literal-string
    throw new Error("Failed to commit changes");
  }

  // Continue with tagging and pushing
  try {
    // eslint-disable-next-line i18next/no-literal-string
    execSync(`git tag ${tag}`, { stdio: "inherit", cwd: mainPackagePath });

    logger.info(`Created tag: ${tag}`);

    // Push commits only if we made any
    if (hasCommitted) {
      // eslint-disable-next-line i18next/no-literal-string
      execSync("git push && git push --tags", {
        stdio: "inherit",
        cwd: mainPackagePath,
      });

      logger.info("Pushed commits and tags to remote.");
    } else {
      // Only push the tags if there were no commits
      // eslint-disable-next-line i18next/no-literal-string
      execSync("git push --tags", {
        stdio: "inherit",
        cwd: mainPackagePath,
      });

      logger.info("Pushed tags to remote.");
    }
  } catch (error) {
    logger.error("Failed during tag operations.", parseError(error));
    // eslint-disable-next-line i18next/no-literal-string
    throw new Error("Failed during tag operations");
  }
}

export function checkTagExists(
  tag: string,
  logger: EndpointLogger,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    /* eslint-disable i18next/no-literal-string */
    void exec(
      `git tag --list ${tag}`,
      (error: ExecException | null, stdout: string) => {
        if (error) {
          logger.error(
            `Error checking if tag exists: ${tag}`,
            parseError(error),
          );
          return reject(error);
        }
        resolve(stdout.trim().length > 0);
      },
    );
    /* eslint-enable i18next/no-literal-string */
  });
}

export function hasNewCommitsSinceTag(
  tag: string,
  mainPackagePath: string,
  logger: EndpointLogger,
): boolean {
  // If the tag is 0.0.0, it means there are no previous tags
  // In this case, we should return true to indicate there are new commits

  if (tag === "0.0.0") {
    return true;
  }

  try {
    // Check if the tag exists in the repository

    const tagExists =
      execSync(`git tag --list ${tag}`, {
        encoding: "utf8",
        cwd: mainPackagePath,
      }).trim().length > 0;

    // If the tag doesn't exist, return true (all commits are new)
    if (!tagExists) {
      logger.info(`Tag ${tag} does not exist. Treating all commits as new.`);
      return true;
    }

    // If the tag exists, check for new commits since that tag
    // eslint-disable-next-line i18next/no-literal-string
    const logOutput = execSync(`git log ${tag}..HEAD --oneline || true`, {
      encoding: "utf8",
      cwd: mainPackagePath,
    });
    return logOutput.trim().length > 0;
  } catch (error) {
    // If any error occurs, log it and return true to allow the release process to continue
    logger.error(
      `Error checking for commits since tag ${tag}. Continuing with release.`,
      parseError(error),
    );
    return true;
  }
}

export async function promptVersionIncrement(): Promise<
  "major" | "minor" | "patch"
> {
  const answers = await inquirer.prompt<{
    increment: "major" | "minor" | "patch";
  }>([
    {
      type: "list",

      name: "increment",
      // eslint-disable-next-line i18next/no-literal-string
      message: "Choose the next version increment:",

      choices: ["patch", "minor", "major"],
    },
  ]);
  return answers.increment;
}

export async function ensureMainBranch(logger: EndpointLogger): Promise<void> {
  try {
    // eslint-disable-next-line i18next/no-literal-string
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();

    if (currentBranch !== "main") {
      logger.error(`You are currently on branch: ${currentBranch}.`, undefined);
      const { shouldSwitch } = await inquirer.prompt<{
        shouldSwitch: "switch" | "openRequest" | "cancel";
      }>([
        {
          type: "list",

          name: "shouldSwitch",
          // eslint-disable-next-line i18next/no-literal-string
          message: "Do you want to switch to the main branch?",
          choices: [
            // eslint-disable-next-line i18next/no-literal-string
            { name: "Switch to main", value: "switch" },
            // eslint-disable-next-line i18next/no-literal-string
            { name: "Open Pull Request/Merge Request", value: "openRequest" },
            // eslint-disable-next-line i18next/no-literal-string
            { name: "Cancel", value: "cancel" },
          ],
        },
      ]);

      if (shouldSwitch === "switch") {
        try {
          // eslint-disable-next-line i18next/no-literal-string
          execSync("git checkout main", {
            stdio: "inherit",
          });

          logger.info("Switched to the main branch.");
        } catch (error) {
          logger.error("Error switching to main branch:", parseError(error));
          process.exit(1);
        }
      } else if (shouldSwitch === "openRequest") {
        logger.info("Please create a Pull Request or Merge Request.");

        // eslint-disable-next-line i18next/no-literal-string
        const repoUrl = execSync("git config --get remote.origin.url", {
          encoding: "utf8",
        }).trim();

        let baseUrl = repoUrl.replace(/\.git$/, "");

        // eslint-disable-next-line i18next/no-literal-string
        if (baseUrl.startsWith("git@")) {
          baseUrl = baseUrl.replace(/^git@([^:]+):/, "https://$1/");
        }

        if (!baseUrl.startsWith("https://") && !baseUrl.startsWith("http://")) {
          baseUrl = `https://${baseUrl}`;
        }

        // Remove trailing slashes

        baseUrl = baseUrl.replace(/\/+$/, "");

        if (repoUrl.includes("github.com")) {
          const githubPrUrl = `${baseUrl}/compare/main...${currentBranch}`;

          logger.info(`Open a Pull Request on GitHub: ${githubPrUrl}`);
        } else if (repoUrl.includes("gitlab.com")) {
          // eslint-disable-next-line i18next/no-literal-string
          const gitlabMrUrl = `${baseUrl}/-/merge_requests/new?source_branch=${currentBranch}&target_branch=main`;

          logger.info(`Open a Merge Request on GitLab: ${gitlabMrUrl}`);
        } else {
          logger.info(
            "Could not determine the repository type (GitHub/GitLab).",
          );
        }

        process.exit(1);
      } else {
        logger.info("Release cancelled.");
        process.exit(1);
      }
    }
  } catch (error) {
    logger.error("Error checking current branch:", parseError(error));
    process.exit(1);
  }
}

export async function handleUncommittedChanges(
  logger: EndpointLogger,
): Promise<void> {
  let statusOutput: string;
  try {
    // eslint-disable-next-line i18next/no-literal-string
    statusOutput = execSync("git status --porcelain", {
      encoding: "utf8",
    });
  } catch (error) {
    logger.error("Error checking git status:", parseError(error));
    process.exit(1);
  }

  if (statusOutput.trim().length > 0) {
    logger.info("Uncommitted changes detected:");
    logger.info(statusOutput);

    const { action } = await inquirer.prompt<{
      action: "commit" | "cancel" | "continue";
    }>([
      {
        type: "list",

        name: "action",
        // eslint-disable-next-line i18next/no-literal-string
        message: "Uncommitted changes found. What do you want to do?",
        choices: [
          // eslint-disable-next-line i18next/no-literal-string
          { name: "Stage all and commit", value: "commit" },
          // eslint-disable-next-line i18next/no-literal-string
          { name: "Cancel release", value: "cancel" },
          // eslint-disable-next-line i18next/no-literal-string
          { name: "Continue anyway", value: "continue" },
        ],
      },
    ]);

    if (action === "cancel") {
      logger.info("Release cancelled.");
      process.exit(1);
    } else if (action === "continue") {
      logger.info(
        "Continuing with the release process despite uncommitted changes.",
      );
    } else {
      const { commitMessage } = await inquirer.prompt<{
        commitMessage: string;
      }>([
        {
          type: "input",

          name: "commitMessage",
          // eslint-disable-next-line i18next/no-literal-string
          message: "Enter commit message for the changes:",
        },
      ]);

      try {
        // eslint-disable-next-line i18next/no-literal-string
        execSync("git add .", { stdio: "inherit" });
        // eslint-disable-next-line i18next/no-literal-string
        execSync(`git commit -m "${commitMessage}"`, {
          stdio: "inherit",
        });
      } catch (error) {
        logger.error("Error during commit:", parseError(error));
        process.exit(1);
      }
    }
  }
}
