/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import type { PackageJson } from "../types/index.js";
import { runSnykMonitor, runSnykTest } from "./snyk.js";

/**
 * Type guard to validate if parsed JSON matches PackageJson structure
 */
function isPackageJson(value: unknown): value is PackageJson {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return typeof obj.name === "string" && typeof obj.version === "string";
}

/**
 * Type guard to check if error has stdout property
 */
function hasStdout(error: unknown): error is { stdout: string | Buffer } {
  return (
    typeof error === "object" &&
    error !== null &&
    "stdout" in error &&
    (typeof (error as { stdout: unknown }).stdout === "string" ||
      Buffer.isBuffer((error as { stdout: unknown }).stdout))
  );
}

/**
 * Runs tests for the given package path.
 */
export function runTests(
  packagePath: string,
  logger: EndpointLogger,
): ResponseType<void> {
  const pkgPath = `${packagePath}/package.json`;
  if (!existsSync(pkgPath)) {
    logger.info(`No package.json found in ${packagePath}, skipping tests.`);
    return createSuccessResponse(undefined);
  }

  const parsedJson: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (!isPackageJson(parsedJson)) {
    logger.error(`Invalid package.json format in ${packagePath}`);
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.invalidPackageJson",
      ErrorResponseTypes.INVALID_FORMAT_ERROR,
      { path: packagePath },
    );
  }

  if (!parsedJson.scripts?.["test"]) {
    logger.info(
      `No test script found in package.json at ${pkgPath}, skipping tests.`,
    );
    return createSuccessResponse(undefined);
  }

  try {
    // eslint-disable-next-line i18next/no-literal-string
    execSync(`yarn test`, { stdio: "inherit", cwd: packagePath });
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(`Tests failed in ${packagePath}`, parseError(error));
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.testsFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { path: packagePath, error: String(error) },
    );
  }
}

export const lint = (
  cwd: string,
  logger: EndpointLogger,
): ResponseType<void> => {
  let lintOutput = "";
  try {
    // Use the local eslint binary directly from node_modules
    // eslint-disable-next-line i18next/no-literal-string
    const eslintPath = join(cwd, "node_modules", ".bin", "eslint");

    // Check if eslint exists and use it directly
    if (existsSync(eslintPath)) {
      lintOutput = execSync(`${eslintPath} --fix`, {
        encoding: "utf8",

        env: { ...process.env, FORCE_COLOR: "1" },
        cwd: cwd,
      });
    } else {
      // Fall back to yarn lint if eslint binary not found
      // eslint-disable-next-line i18next/no-literal-string
      lintOutput = execSync(`yarn lint`, {
        encoding: "utf8",

        env: { ...process.env, FORCE_COLOR: "1" },
        cwd: cwd,
      });
    }
    return createSuccessResponse(undefined);
  } catch (error) {
    if (hasStdout(error)) {
      lintOutput = error.stdout.toString();
    } else if (error instanceof Error) {
      lintOutput = error.message;
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      lintOutput = "Unknown linting error.";
    }
    logger.error(`\n${lintOutput}`);
    logger.error(`Linting errors detected in ${cwd}. Aborting release.`);
    // If there is any lint output (e.g. warnings), print it at the bottom
    if (lintOutput.trim().length > 0) {
      logger.info(`\n${lintOutput}`);
    }
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.lintFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { path: cwd, output: lintOutput },
    );
  }
};

export const typecheck = (
  cwd: string,
  logger: EndpointLogger,
): ResponseType<void> => {
  // Check if tsconfig.json exists in the package directory

  const tsconfigPath = join(cwd, "tsconfig.json");
  if (!existsSync(tsconfigPath)) {
    logger.info(`No tsconfig.json found in ${cwd}, skipping typecheck.`);
    return createSuccessResponse(undefined);
  }

  try {
    // Try to use local TypeScript binary first
    // eslint-disable-next-line i18next/no-literal-string
    const tscPath = join(cwd, "node_modules", ".bin", "tsc");

    if (existsSync(tscPath)) {
      // Use local tsc binary with --noEmit flag for type checking only

      execSync(`${tscPath} --noEmit`, {
        stdio: "inherit",
        cwd,

        env: { ...process.env, FORCE_COLOR: "1" },
      });
    } else {
      // Fall back to yarn/npm script if available
      const parsedJson: unknown = JSON.parse(
        readFileSync(join(cwd, "package.json"), "utf8"),
      );
      if (!isPackageJson(parsedJson)) {
        logger.error(`Invalid package.json format in ${cwd}`);
        return createErrorResponse(
          "app.api.v1.core.system.releaseTool.scripts.invalidPackageJson",
          ErrorResponseTypes.INVALID_FORMAT_ERROR,
          { path: cwd },
        );
      }

      if (parsedJson.scripts?.["typecheck"]) {
        // eslint-disable-next-line i18next/no-literal-string
        execSync(`yarn typecheck`, { stdio: "inherit", cwd });
      } else {
        // Try global tsc as last resort
        // eslint-disable-next-line i18next/no-literal-string
        execSync(`tsc --noEmit`, {
          stdio: "inherit",
          cwd,

          env: { ...process.env, FORCE_COLOR: "1" },
        });
      }
    }
    logger.info(`TypeScript type checking passed for ${cwd}`);
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(
      `TypeScript type checking failed in ${cwd}. Aborting release.`,
      parseError(error),
    );
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.typecheckFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { path: cwd, error: String(error) },
    );
  }
};

export const build = (
  cwd: string,
  logger: EndpointLogger,
): ResponseType<void> => {
  try {
    // eslint-disable-next-line i18next/no-literal-string
    execSync(`yarn build`, { stdio: "inherit", cwd });
    return createSuccessResponse(undefined);
  } catch (error) {
    logger.error(`Build failed in ${cwd}`, parseError(error));
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.buildFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { path: cwd, error: String(error) },
    );
  }
};

/**
 * Runs Snyk vulnerability test for a package (local mode)
 */
export function snykTest(
  cwd: string,
  logger: EndpointLogger,
): ResponseType<void> {
  const packageJsonResponse = getPackageJson(cwd, logger);
  if (!packageJsonResponse.success) {
    return packageJsonResponse;
  }
  return runSnykTest(cwd, packageJsonResponse.data.name, logger);
}

/**
 * Runs Snyk monitor to upload to dashboard (CI mode)
 */
export function snykMonitor(
  cwd: string,
  logger: EndpointLogger,
): ResponseType<void> {
  const packageJsonResponse = getPackageJson(cwd, logger);
  if (!packageJsonResponse.success) {
    return packageJsonResponse;
  }
  return runSnykMonitor(cwd, packageJsonResponse.data.name, logger);
}

/**
 * Gets package.json from a directory
 */
function getPackageJson(
  cwd: string,
  logger: EndpointLogger,
): ResponseType<PackageJson> {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    logger.error(`No package.json found in ${cwd}`);
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.packageJsonNotFound",
      ErrorResponseTypes.NOT_FOUND,
      { path: cwd },
    );
  }
  const parsedJson: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (!isPackageJson(parsedJson)) {
    logger.error(`Invalid package.json format in ${cwd}`);
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.scripts.invalidPackageJson",
      ErrorResponseTypes.INVALID_FORMAT_ERROR,
      { path: cwd },
    );
  }
  return createSuccessResponse(parsedJson);
}
