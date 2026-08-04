/**
 * Quality Runner Service
 * Run quality checks: lint, typecheck, build, test
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import {
  formatError,
  formatProgress,
  formatSkip,
  formatSuccess,
} from "../../../logger/formatters";
import type { EndpointLogger } from "../../../logger/types";
import type { PackageManager } from "../definition";
import { scopedTranslation } from "../i18n";
import { MESSAGES } from "./constants";
import {
  hasStdout,
  parsePackageJson,
  safeJsonParse,
  toCatchError,
} from "./utils";

// ============================================================================
// Interface
// ============================================================================

interface IQualityRunner {
  /**
   * Run linting (with optional custom command)
   */
  runLint(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;

  /**
   * Run type checking (with optional custom command)
   */
  runTypecheck(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;

  /**
   * Run build (with optional custom command)
   */
  runBuild(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;

  /**
   * Run tests (with optional custom command)
   */
  runTests(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;

  /**
   * Run install (with optional custom command)
   */
  runInstall(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;

  /**
   * Run clean (with optional custom command)
   */
  runClean(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

class QualityRunner implements IQualityRunner {
  runLint(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    if (dryRun) {
      logger.vibe(formatSkip("Lint (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Running lint..."));

    try {
      // If custom command provided, execute it directly
      if (customCommand) {
        execSync(customCommand, {
          stdio: "inherit",
          cwd,
          env: { ...process.env, FORCE_COLOR: "1" },
        });
        logger.vibe(formatSuccess("Lint passed"));
        return success();
      }

      // Default: prefer package.json script as it may use custom linting setup
      const pkgPath = join(cwd, "package.json");
      const parsedPkg = existsSync(pkgPath)
        ? parsePackageJson(safeJsonParse(readFileSync(pkgPath, "utf8")))
        : undefined;
      const hasLintScript = parsedPkg?.scripts?.lint;

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
          logger.vibe(formatSkip("No lint script found"));
          return success();
        }
      }
      logger.vibe(formatSuccess("Lint passed"));
      return success();
    } catch (err) {
      const error = toCatchError(err as Error | { stdout?: string | Buffer });
      const output = hasStdout(error)
        ? error.stdout.toString()
        : parseError(err).message;
      logger.vibe(formatError("Lint failed"));
      logger.debug(MESSAGES.LINT_FAILED, { output });
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("scripts.lintFailed", { path: cwd, output }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runTypecheck(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    // Skip tsconfig check if custom command provided
    if (!customCommand) {
      const tsconfigPath = join(cwd, "tsconfig.json");
      if (!existsSync(tsconfigPath)) {
        logger.vibe(formatSkip("No tsconfig.json found"));
        return success();
      }
    }

    if (dryRun) {
      logger.vibe(formatSkip("Typecheck (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Running typecheck..."));

    try {
      // If custom command provided, execute it directly
      if (customCommand) {
        execSync(customCommand, {
          stdio: "inherit",
          cwd,
          env: { ...process.env, FORCE_COLOR: "1" },
        });
        logger.vibe(formatSuccess("Typecheck passed"));
        return success();
      }

      // Default behavior
      execSync(`${packageManager} run typecheck`, {
        stdio: "inherit",
        cwd,
      });
      logger.vibe(formatSuccess("Typecheck passed"));
      return success();
    } catch (error) {
      logger.vibe(formatError("Typecheck failed"));
      logger.debug(MESSAGES.TYPECHECK_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("scripts.typecheckFailed", {
          path: cwd,
          error: String(error),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runBuild(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    if (dryRun) {
      logger.vibe(formatSkip("Build (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Running build..."));

    try {
      // Custom build commands (e.g. "vibe builder --configPath=...") are
      // designed to be run from the project root, not the package directory.
      // Only the default package-manager build script uses the package cwd.
      const command = customCommand ?? `${packageManager} run build`;
      const buildCwd = customCommand !== undefined ? process.cwd() : cwd;
      execSync(command, {
        stdio: "inherit",
        cwd: buildCwd,
      });
      logger.vibe(formatSuccess("Build passed"));
      return success();
    } catch (error) {
      logger.vibe(formatError("Build failed"));
      logger.debug(MESSAGES.BUILD_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("scripts.buildFailed", { path: cwd, error: String(error) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runTests(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    // Skip package.json check if custom command provided
    if (!customCommand) {
      const pkgPath = join(cwd, "package.json");
      if (!existsSync(pkgPath)) {
        return success();
      }

      const parsedPkg = parsePackageJson(
        safeJsonParse(readFileSync(pkgPath, "utf8")),
      );
      if (!parsedPkg?.scripts?.["test"]) {
        logger.vibe(formatSkip("No test script found"));
        return success();
      }
    }

    if (dryRun) {
      logger.vibe(formatSkip("Tests (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Running tests..."));

    try {
      const command = customCommand ?? `${packageManager} run test`;
      execSync(command, {
        stdio: "inherit",
        cwd,
      });
      logger.vibe(formatSuccess("Tests passed"));
      return success();
    } catch (error) {
      logger.vibe(formatError("Tests failed"));
      logger.debug(MESSAGES.TESTS_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("scripts.testsFailed", { path: cwd, error: String(error) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runInstall(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    if (dryRun) {
      logger.vibe(formatSkip("Install (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Installing dependencies..."));

    try {
      const command = customCommand ?? `${packageManager} install`;
      execSync(command, {
        cwd,
        stdio: "inherit",
        timeout: 300000, // 5 minutes
      });
      logger.vibe(formatSuccess("Dependencies installed"));
      return success();
    } catch (error) {
      logger.vibe(formatError("Install failed"));
      logger.debug(MESSAGES.INSTALL_FAILED, parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("dependencies.failed", {
          directory: cwd,
          error: String(error),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  runClean(
    cwd: string,
    packageManager: PackageManager,
    logger: EndpointLogger,
    dryRun: boolean,
    locale: CountryLanguage,
    customCommand?: string,
  ): ResponseType<void> {
    if (dryRun) {
      logger.vibe(formatSkip("Clean (dry run)"));
      return success();
    }

    logger.vibe(formatProgress("Cleaning..."));

    // If custom command provided, execute it directly
    if (customCommand) {
      try {
        execSync(customCommand, {
          cwd,
          stdio: "inherit",
          timeout: 60000,
        });
        logger.info(MESSAGES.CLEAN_SUCCESS);
        return success();
      } catch (error) {
        logger.error(MESSAGES.CLEAN_FAILED, parseError(error));
        const { t } = scopedTranslation.scopedT(locale);
        return fail({
          message: t("scripts.buildFailed", {
            path: cwd,
            error: String(error),
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    // Check if clean script exists in package.json
    const pkgPath = join(cwd, "package.json");
    if (existsSync(pkgPath)) {
      const parsedPkg = parsePackageJson(
        safeJsonParse(readFileSync(pkgPath, "utf8")),
      );
      if (parsedPkg?.scripts?.["clean"]) {
        try {
          execSync(`${packageManager} run clean`, {
            cwd,
            stdio: "inherit",
            timeout: 60000,
          });
          logger.info(MESSAGES.CLEAN_SUCCESS);
          return success();
        } catch (error) {
          logger.error(MESSAGES.CLEAN_FAILED, parseError(error));
          const { t } = scopedTranslation.scopedT(locale);
          return fail({
            message: t("scripts.buildFailed", {
              path: cwd,
              error: String(error),
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }
    }

    // Default clean: remove dist, build, node_modules/.cache
    const dirsToClean = ["dist", "build", "node_modules/.cache", ".turbo"];
    for (const dir of dirsToClean) {
      // Use template string to prevent Turbopack from statically tracing paths
      const dirPath = `${cwd}/${dir}`;
      if (existsSync(dirPath)) {
        try {
          execSync(`rm -rf "${dirPath}"`, { cwd, stdio: "pipe" });
        } catch {
          // Ignore errors
        }
      }
    }

    logger.info(MESSAGES.CLEAN_SUCCESS);
    return success();
  }
}

// Singleton instance
export const qualityRunner = new QualityRunner();
