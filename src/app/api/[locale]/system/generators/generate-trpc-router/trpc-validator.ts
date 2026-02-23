/**
 * tRPC Integration Validator
 * Validates that tRPC integration is working correctly
 *
 * Note: Triple-slash reference required for Node.js process type
 */

/// <reference types="node" />

import fs from "node:fs";
import path from "node:path";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";

/**
 * Constants for code pattern matching
 * These are not user-facing strings, but code patterns we search for
 */
const CODE_PATTERNS = {
  LOCALE_PARAM: "[locale]" as const,
  QUOTE: '"' as const,
  MARKDOWN_H3: "###" as const,
  EXPORT_CONST: "export const" as const,
  SPACE: " " as const,
};

export interface TRPCValidationOptions {
  apiDir: string;
  fix?: boolean;
  verbose?: boolean;
  logger: EndpointLogger;
  locale: CountryLanguage;
}

export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  routeFiles: RouteFileValidation[];
}

export interface RouteFileValidation {
  filePath: string;
  hasDefinition: boolean;
  hasEnhancedHandler: boolean;
  hasTRPCExport: boolean;
  hasNextExport: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate tRPC integration across all route files
 */
export function validateTRPCIntegration(
  options: TRPCValidationOptions,
): ValidationResult {
  const { apiDir, fix = false, verbose = false, logger, locale } = options;
  const { t } = scopedTranslation.scopedT(locale);

  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    routeFiles: [],
  };

  try {
    // Resolve API directory
    const resolvedApiDir = path.resolve(process.cwd(), apiDir);

    if (!fs.existsSync(resolvedApiDir)) {
      result.errors.push(
        t("generateTrpcRouter.trpcValidator.apiDirectoryNotFound", {
          resolvedApiDir,
        }),
      );
      result.success = false;
      return result;
    }

    // Find all route files
    const routeFiles = findRouteFiles(resolvedApiDir, locale);

    if (verbose) {
      logger.info(
        t("generateTrpcRouter.trpcValidator.foundRouteFiles", {
          count: routeFiles.length.toString(),
        }),
      );
    }

    // Validate each route file
    for (const routeFile of routeFiles) {
      const validation = validateRouteFile(routeFile, fix, locale);
      result.routeFiles.push(validation);

      // Aggregate errors and warnings
      result.errors.push(...validation.errors);
      result.warnings.push(...validation.warnings);

      if (validation.errors.length > 0) {
        result.success = false;
      }
    }

    // Check for tRPC router file
    const localeParam = CODE_PATTERNS.LOCALE_PARAM;
    const trpcDirName = "trpc";
    const trpcParam = "[...trpc]";
    const routerName = "router.ts";
    const routerFile = path.join(
      resolvedApiDir,
      localeParam,
      trpcDirName,
      trpcParam,
      routerName,
    );
    if (!fs.existsSync(routerFile)) {
      result.warnings.push(
        t("generateTrpcRouter.trpcValidator.routerNotFound"),
      );
    }

    // Summary
    if (verbose) {
      const status = result.success
        ? t("generateTrpcRouter.trpcValidator.passed")
        : t("generateTrpcRouter.trpcValidator.failed");
      logger.info(
        t("generateTrpcRouter.trpcValidator.validationComplete", {
          status,
        }),
      );
      logger.info(
        t("generateTrpcRouter.trpcValidator.errorsSummary", {
          errorCount: result.errors.length.toString(),
          warningCount: result.warnings.length.toString(),
        }),
      );
    }
  } catch (error) {
    result.errors.push(
      t("generateTrpcRouter.trpcValidator.validationFailed", {
        message: parseError(error).message,
      }),
    );
    result.success = false;
  }

  return result;
}

/**
 * Validate a single route file
 */
function validateRouteFile(
  filePath: string,
  fix: boolean,
  locale: CountryLanguage,
): RouteFileValidation {
  const { t } = scopedTranslation.scopedT(locale);

  const validation: RouteFileValidation = {
    filePath,
    hasDefinition: false,
    hasEnhancedHandler: false,
    hasTRPCExport: false,
    hasNextExport: false,
    errors: [],
    warnings: [],
  };

  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Check for definition import
    const definitionImportFrom = t(
      "generateTrpcRouter.trpcValidator.definitionImportFrom",
    );
    const definitionImportFromTs = t(
      "generateTrpcRouter.trpcValidator.definitionImportFromTs",
    );
    const fromKeyword = "from";
    const quote = CODE_PATTERNS.QUOTE;
    validation.hasDefinition =
      content.includes(
        `${fromKeyword} ${quote}${definitionImportFrom}${quote}`,
      ) ||
      content.includes(
        `${fromKeyword} ${quote}${definitionImportFromTs}${quote}`,
      );

    // Check for enhanced handler usage
    const enhancedApiHandlerCall = t(
      "generateTrpcRouter.trpcValidator.enhancedApiHandlerCall",
    );
    validation.hasEnhancedHandler = content.includes(enhancedApiHandlerCall);

    // Check for tRPC export
    const exportConstTrpc = t(
      "generateTrpcRouter.trpcValidator.exportConstTrpc",
    );
    validation.hasTRPCExport = content.includes(exportConstTrpc);

    // Check for Next.js exports
    const httpMethods = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ];
    const exportConstKeyword = CODE_PATTERNS.EXPORT_CONST;
    const space = CODE_PATTERNS.SPACE;
    validation.hasNextExport = httpMethods.some((method) =>
      content.includes(`${exportConstKeyword}${space}${method}`),
    );

    // Validation rules
    if (validation.hasDefinition) {
      // If has definition, should have enhanced handler
      if (!validation.hasEnhancedHandler) {
        validation.warnings.push(
          t("generateTrpcRouter.trpcValidator.routeHasDefinitionNoHandler"),
        );
      }

      // If has enhanced handler, should have tRPC export
      if (validation.hasEnhancedHandler && !validation.hasTRPCExport) {
        validation.warnings.push(
          t("generateTrpcRouter.trpcValidator.routeHasHandlerNoTrpc"),
        );
      }

      // Should maintain Next.js exports for backward compatibility
      if (validation.hasEnhancedHandler && !validation.hasNextExport) {
        validation.errors.push(
          t("generateTrpcRouter.trpcValidator.routeMissingNextExports"),
        );
      }
    }

    // Check for old apiHandler usage
    const apiHandlerOld = t("generateTrpcRouter.trpcValidator.apiHandlerOld");
    if (content.includes(apiHandlerOld) && !validation.hasEnhancedHandler) {
      validation.warnings.push(
        t("generateTrpcRouter.trpcValidator.routeUsesOldHandler"),
      );
    }

    // Auto-fix if requested
    if (fix && validation.warnings.length > 0) {
      // This would trigger the migration script
      validation.warnings.push(
        t("generateTrpcRouter.trpcValidator.autoFixNotImplemented"),
      );
    }
  } catch (error) {
    validation.errors.push(
      t("generateTrpcRouter.trpcValidator.failedToReadRoute", {
        message: parseError(error).message,
      }),
    );
  }

  return validation;
}

/**
 * Find all route.ts files in the API directory
 */
function findRouteFiles(apiDir: string, locale: CountryLanguage): string[] {
  const { t } = scopedTranslation.scopedT(locale);
  const routeFiles: string[] = [];

  // Get directory names to skip from translations
  const trpcDir = t("generateTrpcRouter.trpcValidator.directoriesSkip.trpc");
  const generatedDir = t(
    "generateTrpcRouter.trpcValidator.directoriesSkip.generated",
  );
  const nodeModulesDir = t(
    "generateTrpcRouter.trpcValidator.directoriesSkip.nodeModules",
  );
  const routeFileName = t("generateTrpcRouter.trpcValidator.routeFileName");

  function scanDirectory(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip certain directories
          if (
            entry.name === trpcDir ||
            entry.name === generatedDir ||
            entry.name.startsWith(".") ||
            entry.name === nodeModulesDir
          ) {
            continue;
          }
          scanDirectory(fullPath);
        } else if (entry.name === routeFileName) {
          routeFiles.push(fullPath);
        }
      }
    } catch {
      // Ignore directories we can't read
    }
  }

  scanDirectory(apiDir);
  return routeFiles;
}

/**
 * Generate validation report
 */
export function generateValidationReport(
  result: ValidationResult,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  const lines: string[] = [];

  const checkmark = t("generateTrpcRouter.trpcValidator.checkmark");
  const crossmark = t("generateTrpcRouter.trpcValidator.crossmark");
  const warningIcon = t("generateTrpcRouter.trpcValidator.warningIcon");

  lines.push(t("generateTrpcRouter.trpcValidator.reportTitle"));
  lines.push("");

  const statusText = result.success
    ? t("generateTrpcRouter.trpcValidator.reportStatusPassed")
    : t("generateTrpcRouter.trpcValidator.reportStatusFailed");
  lines.push(
    t("generateTrpcRouter.trpcValidator.reportStatus", {
      status: statusText,
    }),
  );
  lines.push(
    t("generateTrpcRouter.trpcValidator.reportRouteFiles", {
      count: result.routeFiles.length.toString(),
    }),
  );
  lines.push(
    t("generateTrpcRouter.trpcValidator.reportErrors", {
      count: result.errors.length.toString(),
    }),
  );
  lines.push(
    t("generateTrpcRouter.trpcValidator.reportWarnings", {
      count: result.warnings.length.toString(),
    }),
  );
  lines.push("");

  if (result.errors.length > 0) {
    lines.push(t("generateTrpcRouter.trpcValidator.errorsSection"));
    result.errors.forEach((error) => lines.push(`- ${crossmark} ${error}`));
    lines.push("");
  }

  if (result.warnings.length > 0) {
    lines.push(t("generateTrpcRouter.trpcValidator.warningsSection"));
    result.warnings.forEach((warning) =>
      lines.push(`- ${warningIcon} ${warning}`),
    );
    lines.push("");
  }

  // Route file details
  lines.push(t("generateTrpcRouter.trpcValidator.routeFileDetails"));
  for (const routeFile of result.routeFiles) {
    const relativePath = path.relative(process.cwd(), routeFile.filePath);
    const markdownHeading = CODE_PATTERNS.MARKDOWN_H3;
    const space = CODE_PATTERNS.SPACE;
    lines.push(`${markdownHeading}${space}${relativePath}`);

    const definitionStatus = routeFile.hasDefinition ? checkmark : crossmark;
    lines.push(
      t("generateTrpcRouter.trpcValidator.definitionField", {
        status: definitionStatus,
      }),
    );

    const enhancedHandlerStatus = routeFile.hasEnhancedHandler
      ? checkmark
      : crossmark;
    lines.push(
      t("generateTrpcRouter.trpcValidator.enhancedHandlerField", {
        status: enhancedHandlerStatus,
      }),
    );

    const trpcExportStatus = routeFile.hasTRPCExport ? checkmark : crossmark;
    lines.push(
      t("generateTrpcRouter.trpcValidator.trpcExportField", {
        status: trpcExportStatus,
      }),
    );

    const nextExportStatus = routeFile.hasNextExport ? checkmark : crossmark;
    lines.push(
      t("generateTrpcRouter.trpcValidator.nextExportField", {
        status: nextExportStatus,
      }),
    );

    if (routeFile.errors.length > 0) {
      lines.push(t("generateTrpcRouter.trpcValidator.errorsList"));
      routeFile.errors.forEach((error) =>
        lines.push(`  - ${crossmark} ${error}`),
      );
    }

    if (routeFile.warnings.length > 0) {
      lines.push(t("generateTrpcRouter.trpcValidator.warningsList"));
      routeFile.warnings.forEach((warning) =>
        lines.push(`  - ${warningIcon} ${warning}`),
      );
    }

    lines.push("");
  }

  return lines.join("\n");
}
