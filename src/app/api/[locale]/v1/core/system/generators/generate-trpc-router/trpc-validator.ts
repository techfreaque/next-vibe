/**
 * tRPC Integration Validator
 * Validates that tRPC integration is working correctly
 */

import fs from "node:fs";
import path from "node:path";

// import { infoLogger } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils";

export interface TRPCValidationOptions {
  apiDir: string;
  fix?: boolean;
  verbose?: boolean;
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
  const { apiDir, fix = false, verbose = false } = options;

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
      result.errors.push(`API directory not found: ${resolvedApiDir}`);
      result.success = false;
      return result;
    }

    // Find all route files
    const routeFiles = findRouteFiles(resolvedApiDir);

    if (verbose) {
      infoLogger(`Found ${routeFiles.length} route files to validate`);
    }

    // Validate each route file
    for (const routeFile of routeFiles) {
      const validation = validateRouteFile(routeFile, fix);
      result.routeFiles.push(validation);

      // Aggregate errors and warnings
      result.errors.push(...validation.errors);
      result.warnings.push(...validation.warnings);

      if (validation.errors.length > 0) {
        result.success = false;
      }
    }

    // Check for tRPC router file
    const routerFile = path.join(
      resolvedApiDir,
      "[locale]",
      "trpc",
      "[...trpc]",
      "router.ts",
    );
    if (!fs.existsSync(routerFile)) {
      result.warnings.push(
        "tRPC router file not found. Run 'vibe generate-trpc' to create it.",
      );
    }

    // Summary
    if (verbose) {
      console.log(
        `Validation complete: ${result.success ? "PASSED" : "FAILED"}`,
      );
      console.log(
        `Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`,
      );
    }
  } catch (error) {
    result.errors.push(`Validation failed: ${parseError(error).message}`);
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
): RouteFileValidation {
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
    validation.hasDefinition =
      content.includes('from "./definition"') ||
      content.includes('from "./definition.ts"');

    // Check for enhanced handler usage
    validation.hasEnhancedHandler = content.includes("enhancedApiHandler(");

    // Check for tRPC export
    validation.hasTRPCExport = content.includes("export const trpc");

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
    validation.hasNextExport = httpMethods.some((method) =>
      content.includes(`export const ${method}`),
    );

    // Validation rules
    if (validation.hasDefinition) {
      // If has definition, should have enhanced handler
      if (!validation.hasEnhancedHandler) {
        validation.warnings.push(
          "Route has definition but not using enhancedApiHandler",
        );
      }

      // If has enhanced handler, should have tRPC export
      if (validation.hasEnhancedHandler && !validation.hasTRPCExport) {
        validation.warnings.push(
          "Route uses enhancedApiHandler but missing tRPC export",
        );
      }

      // Should maintain Next.js exports for backward compatibility
      if (validation.hasEnhancedHandler && !validation.hasNextExport) {
        validation.errors.push(
          "Route missing Next.js exports (needed for React Native support)",
        );
      }
    }

    // Check for old apiHandler usage
    if (content.includes("apiHandler(") && !validation.hasEnhancedHandler) {
      validation.warnings.push(
        "Route still uses old apiHandler, should migrate to enhancedApiHandler",
      );
    }

    // Auto-fix if requested
    if (fix && validation.warnings.length > 0) {
      // This would trigger the migration script
      validation.warnings.push(
        "Auto-fix not implemented yet. Run migration script manually.",
      );
    }
  } catch (error) {
    validation.errors.push(
      `Failed to read route file: ${parseError(error).message}`,
    );
  }

  return validation;
}

/**
 * Find all route.ts files in the API directory
 */
function findRouteFiles(apiDir: string): string[] {
  const routeFiles: string[] = [];

  function scanDirectory(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip certain directories
          if (
            entry.name === "trpc" ||
            entry.name === "generated" ||
            entry.name.startsWith(".") ||
            entry.name === "node_modules"
          ) {
            continue;
          }
          scanDirectory(fullPath);
        } else if (entry.name === "route.ts") {
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
export function generateValidationReport(result: ValidationResult): string {
  const lines: string[] = [];

  lines.push("# tRPC Integration Validation Report");
  lines.push("");
  lines.push(`**Status:** ${result.success ? "✅ PASSED" : "❌ FAILED"}`);
  lines.push(`**Route Files:** ${result.routeFiles.length}`);
  lines.push(`**Errors:** ${result.errors.length}`);
  lines.push(`**Warnings:** ${result.warnings.length}`);
  lines.push("");

  if (result.errors.length > 0) {
    lines.push("## Errors");
    result.errors.forEach((error) => lines.push(`- ❌ ${error}`));
    lines.push("");
  }

  if (result.warnings.length > 0) {
    lines.push("## Warnings");
    result.warnings.forEach((warning) => lines.push(`- ⚠️ ${warning}`));
    lines.push("");
  }

  // Route file details
  lines.push("## Route File Details");
  for (const routeFile of result.routeFiles) {
    const relativePath = path.relative(process.cwd(), routeFile.filePath);
    lines.push(`### ${relativePath}`);
    lines.push(`- Definition: ${routeFile.hasDefinition ? "✅" : "❌"}`);
    lines.push(
      `- Enhanced Handler: ${routeFile.hasEnhancedHandler ? "✅" : "❌"}`,
    );
    lines.push(`- tRPC Export: ${routeFile.hasTRPCExport ? "✅" : "❌"}`);
    lines.push(`- Next.js Export: ${routeFile.hasNextExport ? "✅" : "❌"}`);

    if (routeFile.errors.length > 0) {
      lines.push("**Errors:**");
      routeFile.errors.forEach((error) => lines.push(`  - ❌ ${error}`));
    }

    if (routeFile.warnings.length > 0) {
      lines.push("**Warnings:**");
      routeFile.warnings.forEach((warning) => lines.push(`  - ⚠️ ${warning}`));
    }

    lines.push("");
  }

  return lines.join("\n");
}
