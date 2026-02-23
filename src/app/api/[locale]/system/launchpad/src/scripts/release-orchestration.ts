/// <reference types="node" />
import inquirer from "inquirer";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as launchpadScopedTranslation } from "../../i18n";
import type {
  ReleaseOrchestrationOptions,
  ReleaseTarget,
  VersionBumpType,
} from "../types/types";
import {
  discoverReleaseTargets,
  findTargetByGitTag,
  getCurrentGitTag,
  validateReleaseTarget,
} from "../utils/release-discovery";
import { ReleaseExecutor } from "../utils/release-executor";
import { StateManager } from "../utils/state-manager";

/**
 * CI Release Command - releases specific package based on git tag
 */
export async function ciReleaseCommand(
  logger: EndpointLogger,
  locale: CountryLanguage,
  rootDir: string,
  targetDirectory?: string,
  gitTag?: string,
): Promise<void> {
  logger.info("🤖 CI Release Mode");

  const targets = discoverReleaseTargets(rootDir);
  let targetToRelease: ReleaseTarget | null = null;

  if (targetDirectory) {
    // Use explicitly provided target directory
    targetToRelease =
      targets.find((t) => t.directory === targetDirectory) || null;
    if (!targetToRelease) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI script throws for error reporting at startup
      throw new Error(`Target directory not found: ${targetDirectory}`);
    }
  } else {
    // Determine target from git tag
    const tagToUse =
      gitTag ||
      getCurrentGitTag() ||
      process.env.GITHUB_REF?.replace("refs/tags/", "");
    if (!tagToUse) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI script throws for error reporting at startup
      throw new Error(
        "No git tag found. Provide --tag option, set GITHUB_REF environment variable, or use --target option.",
      );
    }

    logger.info(`Using git tag: ${tagToUse}`);
    targetToRelease = await findTargetByGitTag(targets, tagToUse);

    if (!targetToRelease) {
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI script throws for error reporting at startup
      throw new Error(
        `No release target found for git tag: ${tagToUse}. Available targets: ${targets.map((t) => t.directory).join(", ")}`,
      );
    }
  }

  logger.info(`Target for release: ${targetToRelease.directory}`);

  // Validate target
  if (!validateReleaseTarget(rootDir, targetToRelease)) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI script throws for error reporting at startup
    throw new Error(`Invalid release target: ${targetToRelease.directory}`);
  }

  // Execute release
  const executor = new ReleaseExecutor(logger, rootDir);
  const options: ReleaseOrchestrationOptions = {
    ciMode: true,
  };

  const { t } = launchpadScopedTranslation.scopedT(locale);
  const success = executor.executeReleaseTarget(targetToRelease, options, t);
  if (!success) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI script throws for error reporting at startup
    throw new Error(`Release failed for: ${targetToRelease.directory}`);
  }

  logger.info("🎉 CI Release completed successfully!");
}

/**
 * Force Update All Command - updates dependencies for all packages
 */
export function forceUpdateAllCommand(
  logger: EndpointLogger,
  rootDir: string,
  locale: CountryLanguage,
): void {
  logger.info("🔄 Force Update All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger.info(`Found ${targets.length} targets to update`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger.info(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  const executor = new ReleaseExecutor(logger, rootDir);
  const { t } = launchpadScopedTranslation.scopedT(locale);
  executor.executeForceUpdateAll(validTargets, t);
}

/**
 * Release All Command - releases all packages sequentially
 */
export async function releaseAllCommand(
  logger: EndpointLogger,
  rootDir: string,
  locale: CountryLanguage,
): Promise<void> {
  logger.info("🚀 Release All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger.info(`Found ${targets.length} targets to release`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger.info(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  const options: ReleaseOrchestrationOptions = {
    allowSkip: true,
    allowRetry: true,
    continueFromState: true,
  };

  const executor = new ReleaseExecutor(logger, rootDir);
  const { t } = launchpadScopedTranslation.scopedT(locale);
  await executor.executeReleaseOrchestration(validTargets, options, t);
}

/**
 * Force Release Command - force releases all packages with version bump
 */
export async function forceReleaseCommand(
  logger: EndpointLogger,
  rootDir: string,
  locale: CountryLanguage,
  versionBump?: VersionBumpType,
): Promise<void> {
  logger.info("⚡ Force Release All Packages");

  const targets = discoverReleaseTargets(rootDir);
  logger.info(`Found ${targets.length} targets to release`);

  // Validate all targets
  const validTargets = targets.filter((target) =>
    validateReleaseTarget(rootDir, target),
  );

  if (validTargets.length !== targets.length) {
    logger.info(
      `Warning: ${targets.length - validTargets.length} targets failed validation`,
    );
  }

  // Prompt for version bump if not provided
  let selectedVersionBump = versionBump;
  if (!selectedVersionBump) {
    const versionBumpChoices: Array<{
      name: string;
      value: VersionBumpType;
    }> = [
      { name: "Patch (1.0.0 -> 1.0.1)", value: "patch" },
      { name: "Minor (1.0.0 -> 1.1.0)", value: "minor" },
      { name: "Major (1.0.0 -> 2.0.0)", value: "major" },
      { name: "Initialize (-> 1.0.0)", value: "init" },
    ];

    const result = (await inquirer.prompt([
      {
        type: "list",
        name: "versionBumpChoice",
        message: "Select version bump type:",
        choices: versionBumpChoices,
      },
    ])) as { versionBumpChoice: VersionBumpType };
    selectedVersionBump = result.versionBumpChoice;
  }

  // Confirm the action
  const confirmResult = (await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to force release ${validTargets.length} packages with ${selectedVersionBump} version bump?`,
      default: false,
    },
  ])) as { confirm: boolean };

  if (!confirmResult.confirm) {
    logger.info("Operation cancelled");
    return;
  }

  const executor = new ReleaseExecutor(logger, rootDir);
  const { t } = launchpadScopedTranslation.scopedT(locale);
  await executor.executeForceRelease(validTargets, selectedVersionBump, t);
}

/**
 * Continue Release Command - continues from previous state
 */
export async function continueReleaseCommand(
  logger: EndpointLogger,
  rootDir: string,
  t: ReturnType<typeof launchpadScopedTranslation.scopedT>["t"],
): Promise<void> {
  logger.info("🔄 Continue Release from Previous State");

  const stateManager = new StateManager(rootDir);
  const existingState = stateManager.loadState(logger);

  if (!existingState) {
    logger.info("No previous state found. Nothing to continue.");
    return;
  }

  logger.info("Previous state found:");
  logger.info(stateManager.getStateSummary(existingState));

  const actionResult = (await inquirer.prompt([
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
  ])) as { action: string };

  if (actionResult.action === "cancel") {
    logger.info("Operation cancelled");
    return;
  }

  if (actionResult.action === "clear") {
    stateManager.clearState(logger);
    logger.info("State cleared");
    return;
  }

  const options: ReleaseOrchestrationOptions = {
    continueFromState: true,
    allowSkip: true,
    allowRetry: actionResult.action === "retry",
  };

  const executor = new ReleaseExecutor(logger, rootDir);
  await executor.executeReleaseOrchestration(existingState.targets, options, t);
}

/**
 * Show Release Status Command - displays current state
 */
export function showReleaseStatusCommand(
  logger: EndpointLogger,
  rootDir: string,
): void {
  logger.info("📊 Release Status");

  const stateManager = new StateManager(rootDir);
  const existingState = stateManager.loadState(logger);

  if (!existingState) {
    logger.info("No active release state found");
    return;
  }

  logger.info(stateManager.getStateSummary(existingState));

  // Show detailed breakdown
  if (existingState.completed.length > 0) {
    logger.info("\n✅ Completed:");
    existingState.completed.forEach((dir) => logger.info(`  - ${dir}`));
  }

  if (existingState.failed.length > 0) {
    logger.info("\n❌ Failed:");
    existingState.failed.forEach((dir) => logger.info(`  - ${dir}`));
  }

  if (existingState.skipped.length > 0) {
    logger.info("\n⏭️  Skipped:");
    existingState.skipped.forEach((dir) => logger.info(`  - ${dir}`));
  }

  const remaining = stateManager.getRemainingTargets(existingState);
  if (remaining.length > 0) {
    logger.info("\n⏳ Remaining:");
    remaining.forEach((target) => logger.info(`  - ${target.directory}`));
  }
}

/**
 * Weekly Update Command - updates all packages, creates branch, runs Snyk, creates PR
 */
export async function weeklyUpdateCommand(
  logger: EndpointLogger,
  rootDir: string,
  locale: CountryLanguage,
  branchName = "next_version_candidates",
): Promise<void> {
  logger.info("📅 Weekly Dependency Update");

  const executor = new ReleaseExecutor(logger, rootDir);
  const { t } = launchpadScopedTranslation.scopedT(locale);
  await executor.executeWeeklyUpdate(branchName, t, locale);
}
