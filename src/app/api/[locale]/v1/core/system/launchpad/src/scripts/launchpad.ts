#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";

import { defaultLocale } from "../../../../../../../i18n/core/config";
import { createEndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import type { VersionBumpType } from "../types/types.js";
import { getRootDirectory, loadConfig } from "../utils/config.js";
import { cloneMissingRepos } from "./clone-missing.js";
import { navigateFolders } from "./navigate-folders.js";
import {
  ciReleaseCommand,
  continueReleaseCommand,
  forceReleaseCommand,
  forceUpdateAllCommand,
  releaseAllCommand,
  showReleaseStatusCommand,
  weeklyUpdateCommand,
} from "./release-orchestration.js";
import { updateAllRepos } from "./update-all.js";

const program = new Command();

program
  .name("launchpad")
  .description(
    "Tool for managing and orchestrating multiple packages in a monorepo",
  )
  .version("1.0.0");

// Legacy interactive mode (default behavior)
program
  .command("interactive", { isDefault: true })
  .description("Run in interactive mode (legacy behavior)")
  .action(async () => {
    await runInteractiveMode();
  });

// Release orchestration commands
program
  .command("ci-release")
  .description("CI release mode - release package based on git tag")
  .option("-t, --target <directory>", "Target directory to release")
  .option(
    "--tag <tag>",
    "Git tag to determine target (overrides auto-detection)",
  )
  .action(async (options) => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await ciReleaseCommand(logger, rootDir, options.target, options.tag);
    } catch (error) {
      logger.error("CI release failed:", error);
      process.exit(1);
    }
  });

program
  .command("force-update-all")
  .description("Force update dependencies for all packages")
  .action(async () => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await forceUpdateAllCommand(logger, rootDir);
    } catch (error) {
      logger.error("Force update failed:", error);
      process.exit(1);
    }
  });

program
  .command("release-all")
  .description("Release all packages sequentially with state persistence")
  .action(async () => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await releaseAllCommand(logger, rootDir);
    } catch (error) {
      logger.error("Release all failed:", error);
      process.exit(1);
    }
  });

program
  .command("force-release")
  .description("Force release all packages with version bump")
  .option(
    "-v, --version-bump <type>",
    "Version bump type (patch|minor|major|init)",
  )
  .action(async (options: { versionBump?: string }) => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();

      // Validate version bump type
      let versionBump: VersionBumpType | undefined;
      if (options.versionBump) {
        const typedValue = options.versionBump;

        if (
          typedValue === "patch" ||
          typedValue === "minor" ||
          typedValue === "major" ||
          typedValue === "init"
        ) {
          versionBump = typedValue;
        } else {
          throw new Error(
            `Invalid version bump type: ${typedValue}. Must be one of: patch, minor, major, init`,
          );
        }
      }

      await forceReleaseCommand(logger, rootDir, versionBump);
    } catch (error) {
      logger.error("Force release failed:", error);
      process.exit(1);
    }
  });

program
  .command("continue")
  .description("Continue release from previous state")
  .action(async () => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await continueReleaseCommand(logger, rootDir);
    } catch (error) {
      logger.error("Continue release failed:", error);
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show current release status")
  .action(async () => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await showReleaseStatusCommand(logger, rootDir);
    } catch (error) {
      logger.error("Show status failed:", error);
      process.exit(1);
    }
  });

program
  .command("weekly-update")
  .description("Weekly dependency update with branch creation and PR")
  .option("--branch <branch>", "Target branch name", "next_version_candidates")
  .action(async (options) => {
    const logger = createEndpointLogger(true, Date.now(), defaultLocale);
    try {
      const rootDir = process.cwd();
      await weeklyUpdateCommand(logger, rootDir, options.branch);
    } catch (error) {
      logger.error("Weekly update failed:", error);
      process.exit(1);
    }
  });

async function runInteractiveMode(): Promise<void> {
  const logger = createEndpointLogger(true, Date.now(), defaultLocale);
  logger.info("🚀 PWE Launchpad");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        // Legacy repository management
        {
          name: "Navigate folders and open in VS Code",
          value: "navigate-folders",
        },
        { name: "Clone missing repositories", value: "clone-missing" },
        { name: "Update all repositories", value: "update-all" },
        {
          name: "Update all repositories (auto stash and stash pop)",
          value: "update-all-force",
        },
        // New release orchestration
        { name: "Force update all packages", value: "force-update-all" },
        { name: "Release all packages", value: "release-all" },
        { name: "Force release all packages", value: "force-release" },
        { name: "Continue previous release", value: "continue-release" },
        { name: "Show release status", value: "show-status" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  if (action === "exit") {
    logger.info("Goodbye! 👋");
    return;
  }

  const rootDir = process.cwd();

  try {
    logger.info(`Executing: ${action}...`);

    switch (action) {
      // Legacy repository management
      case "clone-missing":
      case "update-all":
      case "update-all-force":
      case "navigate-folders": {
        const config = await loadConfig();
        const configRootDir = getRootDirectory();

        switch (action) {
          case "clone-missing":
            await cloneMissingRepos(configRootDir, config);
            break;
          case "update-all":
            await updateAllRepos(false, configRootDir, config);
            break;
          case "update-all-force":
            await updateAllRepos(true, configRootDir, config);
            break;
          case "navigate-folders":
            await navigateFolders(configRootDir, config);
            break;
        }
        break;
      }

      // New release orchestration
      case "force-update-all":
        await forceUpdateAllCommand(logger, rootDir);
        break;
      case "release-all":
        await releaseAllCommand(logger, rootDir);
        break;
      case "force-release":
        await forceReleaseCommand(logger, rootDir);
        break;
      case "continue-release":
        await continueReleaseCommand(logger, rootDir);
        break;
      case "show-status":
        await showReleaseStatusCommand(logger, rootDir);
        break;
    }

    logger.info("Command completed successfully! ✅");
  } catch (error) {
    logger.error("Error executing command:", error);
    process.exit(1);
  }
}

// Parse command line arguments
program.parse();

// If no command was provided, run interactive mode
if (!process.argv.slice(2).length) {
  const logger = createEndpointLogger(true, Date.now(), defaultLocale);
  runInteractiveMode().catch((error) => {
    logger.error("An unexpected error occurred:", error);
    process.exit(1);
  });
}
