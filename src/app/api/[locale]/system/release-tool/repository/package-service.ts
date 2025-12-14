/**
 * Package Service
 * Package.json operations and management
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

import type { PackageJson, ReleasePackage } from "../definition";
import { MESSAGES } from "./constants";
import { isPackageJson } from "./utils";

// ============================================================================
// Interface
// ============================================================================

export interface IPackageService {
  /**
   * Get package.json from a directory
   */
  getPackageJson(cwd: string, logger: EndpointLogger): ResponseType<PackageJson>;

  /**
   * Update package version in package.json
   */
  updatePackageVersion(
    pkg: ReleasePackage,
    newVersion: string,
    cwd: string,
    originalCwd: string,
    logger: EndpointLogger,
  ): ResponseType<void>;
}

// ============================================================================
// Implementation
// ============================================================================

export class PackageService implements IPackageService {
  getPackageJson(cwd: string, logger: EndpointLogger): ResponseType<PackageJson> {
    const packageJsonPath = join(cwd, "package.json");
    if (!existsSync(packageJsonPath)) {
      logger.error(MESSAGES.PACKAGE_JSON_NOT_FOUND, { path: packageJsonPath });
      return fail({
        message: "app.api.system.releaseTool.packageJson.notFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { path: packageJsonPath },
      });
    }

    try {
      const parsedJson: unknown = JSON.parse(
        readFileSync(packageJsonPath, "utf8"),
      );
      if (!isPackageJson(parsedJson)) {
        logger.error(MESSAGES.PACKAGE_JSON_INVALID, { path: packageJsonPath });
        return fail({
          message: "app.api.system.releaseTool.packageJson.invalidFormat",
          errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
          messageParams: { path: packageJsonPath },
        });
      }
      return success(parsedJson);
    } catch (error) {
      logger.error(MESSAGES.PACKAGE_JSON_INVALID, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.packageJson.errorReading",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  updatePackageVersion(
    pkg: ReleasePackage,
    newVersion: string,
    cwd: string,
    originalCwd: string,
    logger: EndpointLogger,
  ): ResponseType<void> {
    const packageJsonResponse = this.getPackageJson(cwd, logger);
    if (!packageJsonResponse.success) {
      return packageJsonResponse;
    }

    const packageJson = packageJsonResponse.data;

    try {
      packageJson.version = newVersion;

      const packageJsonPath = join(cwd, "package.json");
      writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

      logger.info(MESSAGES.VERSION_BUMPED, {
        directory: pkg.directory,
        newVersion,
      });

      // Update version in release.config.ts
      const configPath = join(originalCwd, "release.config.ts");
      if (existsSync(configPath)) {
        let configContent = readFileSync(configPath, "utf8");

        // Update globalVersion if it exists
        configContent = configContent.replace(
          /globalVersion\s*:\s*["']([^"']*)["']/,
          `globalVersion: "${newVersion}"`,
        );

        writeFileSync(configPath, configContent);
        logger.info(MESSAGES.VERSION_FILE_UPDATED, {
          file: "release.config.ts",
          newVersion,
        });
      }

      return success(undefined);
    } catch (error) {
      logger.error(MESSAGES.VERSION_BUMPED, parseError(error));
      return fail({
        message: "app.api.system.releaseTool.packageJson.errorUpdatingVersion",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { directory: pkg.directory, error: String(error) },
      });
    }
  }
}

// Singleton instance
export const packageService = new PackageService();
