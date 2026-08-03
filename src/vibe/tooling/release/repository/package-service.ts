/**
 * Package Service
 * Package.json operations and management
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import { scopedTranslation } from "../i18n";

import type { PackageJson, ReleasePackage } from "../definition";
import { MESSAGES } from "./constants";
import { parsePackageJson, safeJsonParse } from "./utils";

class PackageService {
  getPackageJson(
    cwd: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): ResponseType<PackageJson> {
    const packageJsonPath = join(cwd, "package.json");
    const { t } = scopedTranslation.scopedT(locale);
    if (!existsSync(packageJsonPath)) {
      logger.error(MESSAGES.PACKAGE_JSON_NOT_FOUND, { path: packageJsonPath });
      return fail({
        message: t("packageJson.notFound", { path: packageJsonPath }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    try {
      const parsedPkg = parsePackageJson(
        safeJsonParse(readFileSync(packageJsonPath, "utf8")),
      );
      if (!parsedPkg) {
        logger.error(MESSAGES.PACKAGE_JSON_INVALID, { path: packageJsonPath });
        return fail({
          message: t("packageJson.invalidFormat", { path: packageJsonPath }),
          errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
        });
      }
      return success(parsedPkg);
    } catch (error) {
      logger.error(MESSAGES.PACKAGE_JSON_INVALID, parseError(error));
      return fail({
        message: t("packageJson.errorReading", { error: String(error) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  updatePackageVersion(
    pkg: ReleasePackage,
    newVersion: string,
    cwd: string,
    originalCwd: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): ResponseType<void> {
    const packageJsonPath = join(cwd, "package.json");
    const { t } = scopedTranslation.scopedT(locale);

    if (!existsSync(packageJsonPath)) {
      logger.error(MESSAGES.PACKAGE_JSON_NOT_FOUND, { path: packageJsonPath });
      return fail({
        message: t("packageJson.notFound", { path: packageJsonPath }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    try {
      // Read the raw JSON and preserve all fields, only updating version
      const rawContent = readFileSync(packageJsonPath, "utf8");
      const rawParsed = safeJsonParse(rawContent);

      if (
        typeof rawParsed !== "object" ||
        rawParsed === null ||
        Array.isArray(rawParsed)
      ) {
        logger.error(MESSAGES.PACKAGE_JSON_INVALID, { path: packageJsonPath });
        return fail({
          message: t("packageJson.invalidFormat", { path: packageJsonPath }),
          errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
        });
      }

      // Update only the version field, preserving everything else
      const updatedPackageJson = { ...rawParsed, version: newVersion };

      writeFileSync(
        packageJsonPath,
        `${JSON.stringify(updatedPackageJson, null, 2)}\n`,
      );

      logger.debug(MESSAGES.VERSION_BUMPED, {
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
        logger.debug(MESSAGES.VERSION_FILE_UPDATED, {
          file: "release.config.ts",
          newVersion,
        });
      }

      return success();
    } catch (error) {
      logger.error(MESSAGES.VERSION_BUMPED, parseError(error));
      return fail({
        message: t("packageJson.errorUpdatingVersion", {
          directory: pkg.directory,
          error: String(error),
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Singleton instance
export const packageService = new PackageService();
