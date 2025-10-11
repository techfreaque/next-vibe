import inquirer from "inquirer";

import type {
  ReleaseOrchestrationOptions,
  ReleaseTarget,
  VersionBumpType,
} from "../types/types.js";
import { logger, loggerError } from "../utils/logger.js";
import {
  discoverReleaseTargets,
  findTargetByGitTag,
  getCurrentGitTag,
  validateReleaseTarget,
} from "../utils/release-discovery.js";
import { ReleaseExecutor } from "../utils/release-executor.js";
import { StateManager } from "../utils/state-manager.js";

/**
 * CI Release Command - releases specific package based on git tag
 */
export async function ciReleaseCommand(
  rootDir: string,
  targetDirectory?: string,
  gitTag?: string,
): Promise<void> {
  logger("🤖 CI Release Mode");

  const targets = discoverReleaseTargets(rootDir);
  let targetToRelease: ReleaseTarget | null = null;

  if (targetDirectory) {
    // Use explicitly provided target directory
    targetToRelease = targets.find((t) => t.directory === targetDirectory) || null;
    if (!targetToRelease) {
      throw new Error(`Target directory not found: ${targetDirectory}`);
    }
  } else {
    // Determine target from git tag
    const tagToUse = gitTag || getCurrentGitTag() || process.env.GITHUB_REF?.replace("refs/tags/", "");
    if (!tagToUse) {
      throw new Error(
        "No git tag found. Provide --tag option, set GITHUB_REF environment variable, or use --target option.",
      );
    }

    logger(`Using git tag: ${tagToUse}`);
    targetToRelease = await findTargetByGitTag(targets, tagToUse);

    if (!targetToRelease) {
      throw new Error(
        `No release target found for git tag: ${tagToUse}. Available targets: ${targets.map((t) => t.directory).join(", ")}`,
      );
    }
  }

  logger(`Target for release: ${targetToRelease.directory}`);

  // Validate target
  if (!validateReleaseTarget(rootDir, targetToRelease)) {
    throw new Error(`Invalid release target: ${targetToRelease.directory}`);
  }

  // Execute release
  const executor = new ReleaseExecutor(rootDir);
  const options: ReleaseOrchestrationOptions = {
    ciMode: true,
  };

  const success = await executor.executeReleaseTarget(targetToRelease, options);
  if (!success) {
    throw new Error(`Release failed for: ${targetToRelease.directory}`);
  }

  logger("🎉 CI Release completed successfully!");
}

/**
 * Force Update All Command - updates dependencies for all packages
 */
export async function forceUpdateAllCommand(rootDir: string): Promise<void> {
  logger("🔄 Force Update All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger(`Found ${targets.length} targets to update`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  const executor = new ReleaseExecutor(rootDir);
  await executor.executeForceUpdateAll(validTargets);
}

/**
 * Release All Command - releases all packages sequentially
 */
export async function releaseAllCommand(rootDir: string): Promise<void> {
  logger("🚀 Release All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger(`Found ${targets.length} targets to release`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  const options: ReleaseOrchestrationOptions = {
    allowSkip: true,
    allowRetry: true,
    continueFromState: true,
  };

  const executor = new ReleaseExecutor(rootDir);
  await executor.executeReleaseOrchestration(validTargets, options);
}

/**
 * Force Release Command - force releases all packages with version bump
 */
export async function forceReleaseCommand(
  rootDir: string,
  versionBump?: VersionBumpType,
): Promise<void> {
  logger("⚡ Force Release All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger(`Found ${targets.length} targets to release`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  // Prompt for version bump if not provided
  let selectedVersionBump = versionBump;
  if (!selectedVersionBump) {
    const { versionBumpChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "versionBumpChoice",
        message: "Select version bump type:",
        choices: [
          { name: "Patch (1.0.0 -> 1.0.1)", value: "patch" },
          { name: "Minor (1.0.0 -> 1.1.0)", value: "minor" },
          { name: "Major (1.0.0 -> 2.0.0)", value: "major" },
          { name: "Initialize (-> 1.0.0)", value: "init" },
        ],
      },
    ]);
    selectedVersionBump = versionBumpChoice as VersionBumpType;
  }

  // Confirm the action
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to force release ${validTargets.length} packages with ${selectedVersionBump} version bump?`,
      default: false,
    },
  ]);

  if (!confirm) {
    logger("Operation cancelled");
    return;
  }

  const executor = new ReleaseExecutor(rootDir);
  await executor.executeForceRelease(validTargets, selectedVersionBump);
}

/**
 * Continue Release Command - continues from previous state
 */
export async function continueReleaseCommand(rootDir: string): Promise<void> {
  logger("🔄 Continue Release from Previous State");

  const stateManager = new StateManager(rootDir);
  const existingState = stateManager.loadState();

  if (!existingState) {
    logger("No previous state found. Nothing to continue.");
    return;
  }

  logger("Previous state found:");
  logger(stateManager.getStateSummary(existingState));

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Continue from where left off", value: "continue" },
        { name: "Retry failed targets only", value: "retry" },
        { name: "Clear state and start fresh", value: "clear" },
        { name: "Cancel", value: "cancel" },
      ],
    },
  ]);

  if (action === "cancel") {
    logger("Operation cancelled");
    return;
  }

  if (action === "clear") {
    stateManager.clearState();
    logger("State cleared");
    return;
  }

  const options: ReleaseOrchestrationOptions = {
    continueFromState: true,
    allowSkip: true,
    allowRetry: action === "retry",
  };

  const executor = new ReleaseExecutor(rootDir);
  await executor.executeReleaseOrchestration(existingState.targets, options);
}

/**
 * Show Release Status Command - displays current state
 */
export async function showReleaseStatusCommand(rootDir: string): Promise<void> {
  logger("📊 Release Status");

  const stateManager = new StateManager(rootDir);
  const existingState = stateManager.loadState();

  if (!existingState) {
    logger("No active release state found");
    return;
  }

  logger(stateManager.getStateSummary(existingState));

  // Show detailed breakdown
  if (existingState.completed.length > 0) {
    logger("\n✅ Completed:");
    existingState.completed.forEach((dir) => logger(`  - ${dir}`));
  }

  if (existingState.failed.length > 0) {
    logger("\n❌ Failed:");
    existingState.failed.forEach((dir) => logger(`  - ${dir}`));
  }

  if (existingState.skipped.length > 0) {
    logger("\n⏭️  Skipped:");
    existingState.skipped.forEach((dir) => logger(`  - ${dir}`));
  }

  const remaining = stateManager.getRemainingTargets(existingState);
  if (remaining.length > 0) {
    logger("\n⏳ Remaining:");
    remaining.forEach((target) => logger(`  - ${target.directory}`));
  }
}

/**
 * Weekly Update Command - updates all packages, creates branch, runs Snyk, creates PR
 */
export async function weeklyUpdateCommand(
  rootDir: string,
  branchName: string = "next_version_candidates",
): Promise<void> {
  logger("📅 Weekly Dependency Update");

  const executor = new ReleaseExecutor(rootDir);
  await executor.executeWeeklyUpdate(branchName);
}
