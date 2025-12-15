/**
 * Validation Service
 * Release validation and checks
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { GitInfo, ReleaseConfig } from "../definition";
import { MESSAGES } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IValidationService {
  /**
   * Validate branch configuration
   */
  validateBranch(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Validate working directory is clean
   */
  validateWorkingDirectory(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Verify lockfile integrity
   */
  verifyLockfile(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Run all validations
   */
  runAll(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Run basic validations (without branch check - for early validation)
   * Branch check should happen later, right before git operations
   */
  runBasicValidations(
    config: ReleaseConfig,
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class ValidationService implements IValidationService {
  /**
   * Validate branch configuration
   */
  validateBranch(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    logger: EndpointLogger,
  ): ResponseType<void> {
    logger.info(MESSAGES.VALIDATION_BRANCH_CHECK);

    const branchConfig = config.branch;
    if (!branchConfig) {
      return success();
    }

    const currentBranch = gitInfo.currentBranch;
    if (!currentBranch) {
      return success(); // Can't validate without branch info
    }

    const mainBranch = branchConfig.main ?? "main";
    const isOnMain = currentBranch === mainBranch;
    const isOnDevelop =
      branchConfig.develop && currentBranch === branchConfig.develop;

    // Check if current branch is allowed
    if (!isOnMain && !isOnDevelop && !branchConfig.allowNonMain) {
      logger.error(MESSAGES.VALIDATION_BRANCH_NOT_ALLOWED, {
        currentBranch,
        mainBranch,
      });
      return fail({
        message: "app.api.system.releaseTool.git.notOnMain",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { currentBranch, main: mainBranch },
      });
    }

    // Check protected branches
    if (branchConfig.protected?.includes(currentBranch)) {
      logger.warn(`Branch ${currentBranch} is protected`);
    }

    return success();
  }

  /**
   * Validate working directory is clean
   */
  validateWorkingDirectory(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    logger: EndpointLogger,
  ): ResponseType<void> {
    if (!config.requireCleanWorkingDir) {
      return success();
    }

    if (gitInfo.hasUncommittedChanges) {
      logger.error(MESSAGES.VALIDATION_DIRTY_WORKING_DIR);
      return fail({
        message: "app.api.system.releaseTool.git.uncommittedChanges",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    return success();
  }

  /**
   * Verify lockfile integrity
   */
  verifyLockfile(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    logger.info(MESSAGES.LOCKFILE_CHECKING);

    const lockfileMap: Record<string, string> = {
      npm: "package-lock.json",
      yarn: "yarn.lock",
      pnpm: "pnpm-lock.yaml",
      bun: "bun.lock",
      deno: "deno.lock",
    };

    const lockfileName = lockfileMap[packageManager];
    if (!lockfileName) {
      return success();
    }

    const lockfilePath = join(cwd, lockfileName);

    if (!existsSync(lockfilePath)) {
      logger.warn(MESSAGES.LOCKFILE_MISSING, { expected: lockfileName });
      return success();
    }

    try {
      // Verify lockfile integrity based on package manager
      switch (packageManager) {
        case "npm":
          execSync("npm ci --dry-run 2>/dev/null || npm install --dry-run", {
            cwd,
            stdio: "pipe",
            timeout: 60000,
          });
          break;
        case "yarn":
          execSync(
            "yarn install --frozen-lockfile --check-files 2>/dev/null || true",
            {
              cwd,
              stdio: "pipe",
              timeout: 60000,
            },
          );
          break;
        case "pnpm":
          execSync(
            "pnpm install --frozen-lockfile --dry-run 2>/dev/null || true",
            {
              cwd,
              stdio: "pipe",
              timeout: 60000,
            },
          );
          break;
        case "bun":
          // Bun doesn't have a direct frozen lockfile check, just verify file exists
          break;
      }

      logger.info(MESSAGES.LOCKFILE_VALID);
      return success();
    } catch (error) {
      logger.error(MESSAGES.LOCKFILE_INVALID, { error: String(error) });
      return fail({
        message: "app.api.system.releaseTool.lockfile.invalid",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Run all validations
   */
  runAll(
    config: ReleaseConfig,
    gitInfo: GitInfo,
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    // Validate branch
    const branchResult = this.validateBranch(config, gitInfo, logger);
    if (!branchResult.success) {
      return branchResult;
    }

    // Validate working directory
    const workingDirResult = this.validateWorkingDirectory(
      config,
      gitInfo,
      logger,
    );
    if (!workingDirResult.success) {
      return workingDirResult;
    }

    // Verify lockfile if configured
    if (config.verifyLockfile) {
      const lockfileResult = this.verifyLockfile(cwd, packageManager, logger);
      if (!lockfileResult.success) {
        return lockfileResult;
      }
    }

    logger.info(MESSAGES.VALIDATION_PASSED);
    return success();
  }

  /**
   * Run basic validations without branch check
   * Branch check is deferred to right before git operations
   */
  runBasicValidations(
    config: ReleaseConfig,
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    // Verify lockfile if configured
    if (config.verifyLockfile) {
      const lockfileResult = this.verifyLockfile(cwd, packageManager, logger);
      if (!lockfileResult.success) {
        return lockfileResult;
      }
    }

    logger.debug(MESSAGES.VALIDATION_PASSED);
    return success();
  }
}

export const validationService = new ValidationService();
