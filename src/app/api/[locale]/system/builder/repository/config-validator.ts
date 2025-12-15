/**
 * Config Validator Service
 * Validates build configuration
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { TFunction } from "@/i18n/core/static-types";

import type { BuildConfig } from "../definition";
import { ROOT_DIR } from "./constants";

/** Validation result */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Interface
// ============================================================================

export interface IConfigValidator {
  /**
   * Validate build configuration and return detailed errors/warnings
   */
  validate(config: BuildConfig, t: TFunction): ValidationResult;
}

// ============================================================================
// Implementation
// ============================================================================

export class ConfigValidator implements IConfigValidator {
  validate(config: BuildConfig, t: TFunction): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if there's anything to build
    if (
      !config.foldersToClean?.length &&
      !config.filesToCompile?.length &&
      !config.filesOrFoldersToCopy?.length &&
      !config.npmPackage
    ) {
      errors.push(t("app.api.system.builder.errors.emptyConfig"));
    }

    // Validate file paths for filesToCompile
    if (config.filesToCompile) {
      for (const file of config.filesToCompile) {
        const inputPath = resolve(ROOT_DIR, file.input);
        if (!existsSync(inputPath)) {
          errors.push(
            t("app.api.system.builder.errors.inputFileNotFound", {
              filePath: file.input,
            }),
          );
        }

        // Check for common mistakes
        if (file.output.endsWith("/")) {
          warnings.push(
            t("app.api.system.builder.warnings.outputIsDirectory", {
              path: file.output,
            }),
          );
        }
      }
    }

    // Validate copy paths
    if (config.filesOrFoldersToCopy) {
      for (const copyConfig of config.filesOrFoldersToCopy) {
        const srcPath = resolve(ROOT_DIR, copyConfig.input);
        if (!existsSync(srcPath)) {
          warnings.push(
            t("app.api.system.builder.warnings.sourceNotFound", {
              path: copyConfig.input,
            }),
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Singleton instance
export const configValidator = new ConfigValidator();
