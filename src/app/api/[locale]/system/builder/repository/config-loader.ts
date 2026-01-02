/**
 * Config Loader Service
 * Loads build configuration from files or inline data
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import type { BuildConfig, CopyConfig, FileToCompile, NpmPackageConfig } from "../definition";
import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Types
// ============================================================================

/** Inline configuration input matching request type */
export interface InlineConfigInput {
  foldersToClean?: string[];
  filesToCompile?: FileToCompile[];
  filesOrFoldersToCopy?: CopyConfig[];
  npmPackage?: NpmPackageConfig;
}

/** Type for dynamically imported build config module */
interface BuildConfigModule {
  default: BuildConfig;
}

// ============================================================================
// Interface
// ============================================================================

export interface IConfigLoader {
  /**
   * Load build configuration from file or inline data
   */
  load(
    configPath: string | undefined,
    inlineConfig: InlineConfigInput | undefined,
    output: string[],
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<BuildConfig>>;

  /**
   * Check if a config file exists
   */
  exists(configPath: string): boolean;

  /**
   * Validate that a module exports a valid build config
   */
  isValidBuildConfigModule(
    module: BuildConfigModule | Record<string, BuildConfig | undefined>,
  ): module is BuildConfigModule;
}

// ============================================================================
// Implementation
// ============================================================================

export class ConfigLoader implements IConfigLoader {
  async load(
    configPath: string | undefined,
    inlineConfig: InlineConfigInput | undefined,
    output: string[],
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<BuildConfig>> {
    // Use config file if path provided
    if (configPath) {
      const fullPath = resolve(ROOT_DIR, configPath);

      if (!existsSync(fullPath)) {
        return fail({
          message: "app.api.system.builder.errors.configNotFound",
          messageParams: {
            path: configPath,
          },
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      output.push(
        outputFormatter.formatStep(
          t("app.api.system.builder.messages.loadingConfig", {
            path: configPath,
          }),
        ),
      );
      logger.info("Loading build config", { path: fullPath });

      const importedModule = (await import(fullPath)) as
        | BuildConfigModule
        | Record<string, BuildConfig | undefined>;

      if (!this.isValidBuildConfigModule(importedModule)) {
        return fail({
          message: "app.api.system.builder.errors.invalidBuildConfig",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      return success(importedModule.default);
    }

    // Use inline configuration
    output.push(outputFormatter.formatStep(t("app.api.system.builder.messages.usingInlineConfig")));
    logger.info("Using inline config");

    return success({
      foldersToClean: inlineConfig?.foldersToClean,
      filesToCompile: inlineConfig?.filesToCompile,
      filesOrFoldersToCopy: inlineConfig?.filesOrFoldersToCopy,
      npmPackage: inlineConfig?.npmPackage,
    });
  }

  exists(configPath: string): boolean {
    const fullPath = resolve(ROOT_DIR, configPath);
    return existsSync(fullPath);
  }

  isValidBuildConfigModule(
    module: BuildConfigModule | Record<string, BuildConfig | undefined>,
  ): module is BuildConfigModule {
    if (typeof module !== "object" || module === null) {
      return false;
    }
    if (!("default" in module)) {
      return false;
    }
    const defaultExport = module.default;
    return typeof defaultExport === "object" && defaultExport !== null;
  }
}

// Singleton instance
export const configLoader = new ConfigLoader();
