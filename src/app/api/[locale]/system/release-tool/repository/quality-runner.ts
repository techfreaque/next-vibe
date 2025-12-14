/**
 * Quality Runner Service
 * Run quality checks: lint, typecheck, build, test
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import { MESSAGES } from "./constants";
import { hasStdout, isPackageJson } from "./utils";

// ============================================================================
// Interface
// ============================================================================

export interface IQualityRunner {
  /**
   * Run linting
   */
  runLint(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Run type checking
   */
  runTypecheck(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Run build
   */
  runBuild(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Run tests
   */
  runTests(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Run install
   */
  runInstall(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;

  /**
   * Run clean
   */
  runClean(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class QualityRunner implements IQualityRunner {
  runLint(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "lint" });
      return success(undefined);
    }

    logger.info(MESSAGES.LINTING);

    try {
      // Always prefer package.json script as it may use custom linting setup
      const pkgPath = join(cwd, "package.json");
      const hasLintScript =
        existsSync(pkgPath) &&
        JSON.parse(readFileSync(pkgPath, "utf8")).scripts?.lint;

      if (hasLintScript) {
        execSync(`${packageManager} run lint`, {
          stdio: "inherit",
          cwd,
          env: { ...process.env, FORCE_COLOR: "1" },
        });
      } else {
        // Fallback to direct eslint if no lint script
        const eslintPath = join(cwd, "node_modules", ".bin", "eslint");
        if (existsSync(eslintPath)) {
          execSync(`${eslintPath} --fix .`, {
            stdio: "inherit",
            cwd,
            env: { ...process.env, FORCE_COLOR: "1" },
          });
        } else {
          logger.info("No lint script or eslint found, skipping lint");
          return success(undefined);
        }
      }
      logger.info(MESSAGES.LINT_PASSED);
      return success(undefined);
    } catch (error) {
      let output = "";
      if (hasStdout(error)) {
        output = error.stdout.toString();
      }
      logger.error(MESSAGES.LINT_FAILED, { output });
      return fail({
        message: "app.api.system.releaseTool.scripts.lintFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { path: cwd, output },
      });
    }
  }

  runTypecheck(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    const tsconfigPath = join(cwd, "tsconfig.json");
    if (!existsSync(tsconfigPath)) {
      logger.info(`No tsconfig.json found in ${cwd}, skipping typecheck`);
      return success(undefined);
    }

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "typecheck" });
      return success(undefined);
    }

    logger.info(MESSAGES.TYPECHECKING);

    try {
      const tscPath = join(cwd, "node_modules", ".bin", "tsc");

      if (existsSync(tscPath)) {
        execSync(`${tscPath} --noEmit`, {
          stdio: "inherit",
          cwd,
          env: { ...process.env, FORCE_COLOR: "1" },
        });
      } else {
        execSync(`${packageManager} run typecheck`, {
          stdio: "inherit",
          cwd,
        });
      }
      logger.info(MESSAGES.TYPECHECK_PASSED);
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.TYPECHECK_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.scripts.typecheckFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { path: cwd, error: String(error) },
      });
    }
  }

  runBuild(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "build" });
      return success(undefined);
    }

    logger.info(MESSAGES.BUILDING);

    try {
      execSync(`${packageManager} run build`, {
        stdio: "inherit",
        cwd,
      });
      logger.info(MESSAGES.BUILD_PASSED);
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.BUILD_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.scripts.buildFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { path: cwd, error: String(error) },
      });
    }
  }

  runTests(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    const pkgPath = join(cwd, "package.json");
    if (!existsSync(pkgPath)) {
      return success(undefined);
    }

    const parsedJson: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (!isPackageJson(parsedJson) || !parsedJson.scripts?.["test"]) {
      logger.info(`No test script found, skipping tests`);
      return success(undefined);
    }

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "test" });
      return success(undefined);
    }

    logger.info(MESSAGES.TESTING);

    try {
      execSync(`${packageManager} run test`, {
        stdio: "inherit",
        cwd,
      });
      logger.info(MESSAGES.TESTS_PASSED);
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.TESTS_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.scripts.testsFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { path: cwd, error: String(error) },
      });
    }
  }

  runInstall(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "install" });
      return success(undefined);
    }

    logger.info(MESSAGES.INSTALLING);

    try {
      execSync(`${packageManager} install`, {
        cwd,
        stdio: "inherit",
        timeout: 300000, // 5 minutes
      });
      logger.info(MESSAGES.INSTALL_SUCCESS);
      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.INSTALL_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.dependencies.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: cwd, error: String(error) },
      });
    }
  }

  runClean(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    dryRun: boolean,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "clean" });
      return success(undefined);
    }

    logger.info(MESSAGES.CLEANING);

    // Check if clean script exists in package.json
    const pkgPath = join(cwd, "package.json");
    if (existsSync(pkgPath)) {
      const parsedJson: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (isPackageJson(parsedJson) && parsedJson.scripts?.["clean"]) {
        try {
          execSync(`${packageManager} run clean`, {
            cwd,
            stdio: "inherit",
            timeout: 60000,
          });
          logger.info(MESSAGES.CLEAN_SUCCESS);
          return success(undefined);
        } catch (error) {
          logger.error(MESSAGES.CLEAN_FAILED, parseError(error));
          return fail({
            message: "app.api.system.releaseTool.scripts.buildFailed",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { path: cwd, error: String(error) },
          });
        }
      }
    }

    // Default clean: remove dist, build, node_modules/.cache
    const dirsToClean = ["dist", "build", "node_modules/.cache", ".turbo"];
    for (const dir of dirsToClean) {
      const dirPath = join(cwd, dir);
      if (existsSync(dirPath)) {
        try {
          execSync(`rm -rf "${dirPath}"`, { cwd, stdio: "pipe" });
        } catch {
          // Ignore errors
        }
      }
    }

    logger.info(MESSAGES.CLEAN_SUCCESS);
    return success(undefined);
  }
}

// Singleton instance
export const qualityRunner = new QualityRunner();
