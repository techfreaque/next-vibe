/**
 * Dependency Manager Service
 * Manage, update, and audit package dependencies
 */

import { execSync } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { PackageJson, SecurityScanResult } from "../definition";
import { MESSAGES, TIMEOUTS } from "./constants";
import { toCatchError } from "./utils";

// ============================================================================
// Types
// ============================================================================

/**
 * Result of checking for outdated dependencies
 */
export interface OutdatedResult {
  /** Number of outdated dependencies */
  count: number;
  /** List of outdated packages with current and latest versions */
  packages: Array<{
    name: string;
    current: string;
    wanted: string;
    latest: string;
    type: "dependencies" | "devDependencies" | "optionalDependencies";
  }>;
}

/**
 * Options for updating dependencies
 */
export interface UpdateOptions {
  /** Only update patch versions */
  patchOnly?: boolean;
  /** Only update minor versions */
  minorOnly?: boolean;
  /** Interactive mode (for CLI) */
  interactive?: boolean;
  /** Run in dry-run mode (check only) */
  dryRun?: boolean;
  /** Packages to ignore during update */
  ignore?: string[];
  /** Only update these specific packages */
  filter?: string[];
  /** Target version constraint (latest, newest, greatest, minor, patch) */
  target?: "latest" | "newest" | "greatest" | "minor" | "patch";
}

// ============================================================================
// Interface
// ============================================================================

export interface IDependencyManager {
  /**
   * Update dependencies using npm-check-updates
   */
  updateDependencies(
    cwd: string,
    packageManager: string,
    packageJson: PackageJson,
    logger: EndpointLogger,
    dryRun: boolean,
    options?: UpdateOptions,
  ): ResponseType<void>;

  /**
   * Check for outdated dependencies
   */
  checkOutdated(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<OutdatedResult>;

  /**
   * Run security audit
   */
  runAudit(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    fix?: boolean,
  ): ResponseType<SecurityScanResult>;

  /**
   * Deduplicate dependencies
   */
  deduplicate(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Prune unused dependencies
   */
  prune(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void>;

  /**
   * Check if npm-check-updates is available
   */
  isNcuAvailable(): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class DependencyManager implements IDependencyManager {
  private ncuAvailable: boolean | null = null;

  isNcuAvailable(): boolean {
    if (this.ncuAvailable !== null) {
      return this.ncuAvailable;
    }

    try {
      execSync("ncu --version", { stdio: "pipe" });
      this.ncuAvailable = true;
    } catch {
      this.ncuAvailable = false;
    }

    return this.ncuAvailable;
  }

  updateDependencies(
    cwd: string,
    packageManager: string,
    packageJson: PackageJson,
    logger: EndpointLogger,
    dryRun: boolean,
    options?: UpdateOptions,
  ): ResponseType<void> {
    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "update dependencies" });
      return success();
    }

    logger.debug(MESSAGES.UPDATING_DEPS, { package: packageJson.name });

    try {
      // Build ignore list from package.json config and options
      const ignoreList = [
        ...(packageJson.updateIgnoreDependencies ?? []),
        ...(options?.ignore ?? []),
      ];

      // Check if ncu is available
      if (!this.isNcuAvailable()) {
        logger.warn(
          "npm-check-updates (ncu) not found, attempting to use package manager directly",
        );
        return this.updateWithPackageManager(cwd, packageManager, logger);
      }

      // Build ncu command
      const ncuArgs: string[] = ["-u"];

      if (ignoreList.length > 0) {
        ncuArgs.push(`--reject ${ignoreList.join(",")}`);
      }

      if (options?.filter && options.filter.length > 0) {
        ncuArgs.push(`--filter ${options.filter.join(",")}`);
      }

      if (options?.target) {
        ncuArgs.push(`--target ${options.target}`);
      } else if (options?.patchOnly) {
        ncuArgs.push("--target patch");
      } else if (options?.minorOnly) {
        ncuArgs.push("--target minor");
      }

      // Run npm-check-updates
      execSync(`ncu ${ncuArgs.join(" ")}`, {
        cwd,
        stdio: "inherit",
        timeout: TIMEOUTS.DEFAULT,
      });

      // Install updated dependencies
      execSync(`${packageManager} install`, {
        cwd,
        stdio: "inherit",
        timeout: TIMEOUTS.LONG,
      });

      logger.info(MESSAGES.DEPS_UPDATED, { package: packageJson.name });
      return success();
    } catch (error) {
      logger.error(MESSAGES.DEPS_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.packageJson.errorUpdatingDeps",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: cwd, error: String(error) },
      });
    }
  }

  private updateWithPackageManager(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    try {
      // Use the package manager's built-in update command
      let command: string;
      switch (packageManager) {
        case "yarn":
          command = "yarn upgrade --latest";
          break;
        case "pnpm":
          command = "pnpm update --latest";
          break;
        case "bun":
          command = "bun update";
          break;
        default:
          command = "npm update";
      }

      execSync(command, {
        cwd,
        stdio: "inherit",
        timeout: TIMEOUTS.LONG,
      });

      logger.info(MESSAGES.DEPS_UPDATED);
      return success();
    } catch (error) {
      logger.error(MESSAGES.DEPS_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.packageJson.errorUpdatingDeps",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: cwd, error: String(error) },
      });
    }
  }

  checkOutdated(
    cwd: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for interface consistency
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<OutdatedResult> {
    logger.debug(MESSAGES.DEPS_CHECKING_OUTDATED);

    try {
      // Check if ncu is available
      if (!this.isNcuAvailable()) {
        logger.debug("ncu not available, skipping outdated check");
        return success({ count: 0, packages: [] });
      }

      // Use ncu --jsonUpgraded to check for outdated packages
      let output: string;
      try {
        output = execSync("ncu --jsonUpgraded", {
          cwd,
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
          timeout: TIMEOUTS.DEFAULT,
        });
      } catch (err) {
        const error = toCatchError(err as Error | { stdout?: string | Buffer; status?: number });
        if ("stdout" in error && error.stdout) {
          output = error.stdout.toString();
        } else {
          logger.debug("ncu check failed, assuming up to date");
          return success({ count: 0, packages: [] });
        }
      }

      if (!output.trim() || output.trim() === "{}") {
        logger.debug("No outdated dependencies found");
        return success({ count: 0, packages: [] });
      }

      // Parse the JSON output from ncu
      /* eslint-disable oxlint-plugin-restricted/restricted-syntax -- JSON.parse returns unknown by design */
      let parsed: unknown;
      /* eslint-enable oxlint-plugin-restricted/restricted-syntax */
      try {
        parsed = JSON.parse(output);
      } catch {
        logger.debug("Could not parse ncu output, assuming up to date");
        return success({ count: 0, packages: [] });
      }

      const packages: OutdatedResult["packages"] = [];

      // ncu --jsonUpgraded returns { "package-name": "new-version" }
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        for (const [name, newVersion] of Object.entries(parsed)) {
          if (typeof newVersion === "string") {
            packages.push({
              name,
              current: "installed",
              wanted: newVersion,
              latest: newVersion,
              type: "dependencies",
            });
          }
        }
      }

      logger.debug(`Found ${packages.length} outdated packages`);
      return success({ count: packages.length, packages });
    } catch (error) {
      logger.debug("Could not check outdated dependencies", parseError(error));
      return success({ count: 0, packages: [] });
    }
  }

  runAudit(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
    fix = false,
  ): ResponseType<SecurityScanResult> {
    logger.info(MESSAGES.AUDIT_RUNNING);

    try {
      let command: string;
      switch (packageManager) {
        case "yarn":
          command = fix ? "yarn audit --fix" : "yarn audit --json";
          break;
        case "pnpm":
          command = fix ? "pnpm audit --fix" : "pnpm audit --json";
          break;
        case "bun":
          // Bun doesn't have built-in audit, skip
          logger.warn("Bun does not have built-in security audit");
          return success({
            passed: true,
            vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
          });
        default:
          command = fix ? "npm audit fix" : "npm audit --json";
      }

      let output: string;
      let exitCode = 0;

      try {
        output = execSync(command, {
          cwd,
          encoding: "utf8",
          stdio: ["pipe", "pipe", "pipe"],
          timeout: TIMEOUTS.DEFAULT,
        });
      } catch (err) {
        // Audit commands exit with non-zero if vulnerabilities found
        const error = toCatchError(err as Error | { stdout?: string | Buffer; status?: number });
        if ("stdout" in error && error.stdout) {
          output = error.stdout.toString();
        } else {
          output = "{}";
        }
        exitCode = ("status" in error && typeof error.status === "number") ? error.status : 1;
      }

      // Parse the audit results
      const vulnerabilities = { critical: 0, high: 0, medium: 0, low: 0 };

      try {
        const parsed = JSON.parse(output);

        // Handle npm audit format
        if (parsed.metadata?.vulnerabilities) {
          const vuln = parsed.metadata.vulnerabilities;
          vulnerabilities.critical = vuln.critical ?? 0;
          vulnerabilities.high = vuln.high ?? 0;
          vulnerabilities.medium = vuln.moderate ?? 0;
          vulnerabilities.low = vuln.low ?? 0;
        }
      } catch {
        // If JSON parsing fails, check exit code
        if (exitCode !== 0) {
          vulnerabilities.high = 1; // Assume at least one issue
        }
      }

      const totalVulnerabilities =
        vulnerabilities.critical +
        vulnerabilities.high +
        vulnerabilities.medium +
        vulnerabilities.low;

      if (totalVulnerabilities > 0) {
        logger.warn(MESSAGES.AUDIT_VULNERABILITIES, {
          count: totalVulnerabilities,
          ...vulnerabilities,
        });
      } else {
        logger.info(MESSAGES.AUDIT_PASSED);
      }

      return success({
        passed: vulnerabilities.critical === 0 && vulnerabilities.high === 0,
        vulnerabilities,
      });
    } catch (error) {
      logger.error(MESSAGES.AUDIT_FAILED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.security.auditFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: cwd, error: String(error) },
      });
    }
  }

  deduplicate(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    logger.info("Deduplicating dependencies...");

    try {
      let command: string;
      switch (packageManager) {
        case "yarn":
          command = "yarn dedupe";
          break;
        case "pnpm":
          command = "pnpm dedupe";
          break;
        case "bun":
          // Bun doesn't have dedupe command
          logger.info("Bun handles deduplication automatically");
          return success();
        default:
          command = "npm dedupe";
      }

      execSync(command, {
        cwd,
        stdio: "inherit",
        timeout: TIMEOUTS.DEFAULT,
      });

      logger.info("Dependencies deduplicated successfully");
      return success();
    } catch (error) {
      logger.error("Deduplication failed", parseError(error));
      return fail({
        message: "app.api.system.releaseTool.dependencies.dedupeFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: cwd, error: String(error) },
      });
    }
  }

  prune(
    cwd: string,
    packageManager: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    logger.info("Pruning unused dependencies...");

    try {
      let command: string;
      switch (packageManager) {
        case "yarn":
          // Yarn v1 uses autoclean, Yarn v2+ handles this differently
          command = "yarn autoclean --force";
          break;
        case "pnpm":
          command = "pnpm prune";
          break;
        case "bun":
          // Bun doesn't have prune command
          logger.info("Bun handles pruning automatically");
          return success();
        default:
          command = "npm prune";
      }

      execSync(command, {
        cwd,
        stdio: "inherit",
        timeout: TIMEOUTS.DEFAULT,
      });

      logger.info("Dependencies pruned successfully");
      return success();
    } catch (error) {
      // Prune errors are often non-critical
      logger.warn("Prune completed with warnings", parseError(error));
      return success();
    }
  }
}

// Singleton instance
export const dependencyManager = new DependencyManager();
