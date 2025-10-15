/**
 * TRPC Integration Validation Repository
 * Business logic for TRPC integration validation operations
 * Migrated from trpc-validator.ts following repository-only pattern
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type {
  TRPCValidationRequestOutput,
  TRPCValidationResponseOutput,
} from "./definition";

/**
 * TRPC Validation Options interface
 */
export interface TRPCValidationOptions {
  apiDir: string;
  fix?: boolean;
  verbose?: boolean;
  generateReport?: boolean;
}

/**
 * TRPC Validation Result interface
 */
export interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  routeFiles: RouteFileValidation[];
  report?: string;
  totalFiles?: number;
  validFiles?: number;
  filesWithIssues?: number;
}

/**
 * Route File Validation interface
 */
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
 * TRPC Integration Validation Repository Interface
 */
export interface TRPCValidationRepository {
  executeValidationOperation(
    data: TRPCValidationRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<TRPCValidationResponseOutput>>;

  validateTRPCIntegration(
    options: TRPCValidationOptions,
    logger: EndpointLogger,
  ): Promise<ValidationResult>;

  validateRouteFile(
    filePath: string,
    fix: boolean,
    logger: EndpointLogger,
  ): Promise<RouteFileValidation>;

  generateValidationReport(
    result: ValidationResult,
    logger: EndpointLogger,
  ): Promise<string>;

  checkRouterExists(apiDir: string, logger: EndpointLogger): Promise<boolean>;

  fixRoutes(apiDir: string, logger: EndpointLogger): Promise<ValidationResult>;
}

/**
 * TRPC Integration Validation Repository Implementation
 */
export class TRPCValidationRepositoryImpl implements TRPCValidationRepository {
  /**
   * Execute TRPC validation operation based on request
   */
  async executeValidationOperation(
    data: TRPCValidationRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<TRPCValidationResponseOutput>> {
    try {
      logger.info("Starting TRPC validation operation execution", {
        operations: data.operation,
        filePath: data.filePath,
        options: data.options,
      });

      // For multi-select operations, execute the first one (in real implementation, might execute all)
      const operation = Array.isArray(data.operation)
        ? data.operation[0]
        : data.operation;
      const filePath = data.filePath;
      const options = data.options || {};

      let result: ValidationResult | RouteFileValidation | boolean | string;

      switch (operation) {
        case "VALIDATE_INTEGRATION":
          const validationOptions: TRPCValidationOptions = {
            apiDir: options.apiDir || "src/app/api",
            fix: options.fix || false,
            verbose: options.verbose || false,
            generateReport: options.generateReport || false,
          };
          result = await this.validateTRPCIntegration(
            validationOptions,
            logger,
          );
          break;

        case "VALIDATE_ROUTE_FILE":
          if (!filePath) {
            throw new Error("File path is required for route file validation");
          }
          result = await this.validateRouteFile(
            filePath,
            options.fix || false,
            logger,
          );
          // Convert single file validation to ValidationResult format
          result = {
            success: result.errors.length === 0,
            errors: result.errors,
            warnings: result.warnings,
            routeFiles: [result],
            totalFiles: 1,
            validFiles: result.errors.length === 0 ? 1 : 0,
            filesWithIssues: result.errors.length > 0 ? 1 : 0,
          };
          break;

        case "GENERATE_REPORT":
          // First validate, then generate report
          const reportOptions: TRPCValidationOptions = {
            apiDir: options.apiDir || "src/app/api",
            fix: false,
            verbose: true,
            generateReport: true,
          };
          const validationResult = await this.validateTRPCIntegration(
            reportOptions,
            logger,
          );
          result = {
            ...validationResult,
            report: await this.generateValidationReport(
              validationResult,
              logger,
            ),
          };
          break;

        case "FIX_ROUTES":
          result = await this.fixRoutes(
            options.apiDir || "src/app/api",
            logger,
          );
          break;

        case "CHECK_ROUTER_EXISTS":
          const routerExists = await this.checkRouterExists(
            options.apiDir || "src/app/api",
            logger,
          );
          result = {
            success: routerExists,
            errors: routerExists ? [] : ["TRPC router file not found"],
            warnings: [],
            routeFiles: [],
            totalFiles: 0,
            validFiles: 0,
            filesWithIssues: routerExists ? 0 : 1,
          };
          break;

        default:
          throw new Error(`Unknown TRPC validation operation: ${operation}`);
      }

      logger.info("TRPC validation operation completed", {
        success: typeof result === "boolean" ? result : result.success,
        operation,
      });

      // Normalize result to ValidationResult format
      const normalizedResult: ValidationResult =
        typeof result === "boolean"
          ? { success: result, errors: [], warnings: [], routeFiles: [] }
          : result;

      return createSuccessResponse({
        success: normalizedResult.success,
        operation: operation.toString(),
        result: normalizedResult,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("TRPC validation operation execution failed", parsedError);

      return createErrorResponse(
        "app.api.v1.core.system.generators.generateTrpcRouter.validation.errors.executionFailed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Validate TRPC integration across all route files
   */
  async validateTRPCIntegration(
    options: TRPCValidationOptions,
    logger: EndpointLogger,
  ): Promise<ValidationResult> {
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
      const routeFiles = this.findRouteFiles(resolvedApiDir);

      if (verbose && logger) {
        logger.info(`Found ${routeFiles.length} route files to validate`);
      }

      // Validate each route file
      for (const routeFile of routeFiles) {
        const validation = await this.validateRouteFile(routeFile, fix, logger);
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

      // Set summary stats
      result.totalFiles = routeFiles.length;
      result.validFiles = result.routeFiles.filter(
        (rf) => rf.errors.length === 0,
      ).length;
      result.filesWithIssues = result.routeFiles.filter(
        (rf) => rf.errors.length > 0,
      ).length;

      // Summary
      if (verbose && logger) {
        logger.info(
          `Validation complete: ${result.success ? "PASSED" : "FAILED"}`,
        );
        logger.info(
          `Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`,
        );
      }
    } catch (error) {
      const parsedError = parseError(error);
      result.errors.push(`Validation failed: ${parsedError.message}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Validate a single route file
   */
  async validateRouteFile(
    filePath: string,
    fix: boolean,
    logger: EndpointLogger,
  ): Promise<RouteFileValidation> {
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
      validation.hasEnhancedHandler = content.includes("endpointsHandler(");

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
            "Route has definition but not using endpointsHandler",
          );
        }

        // If has enhanced handler, should have tRPC export
        if (validation.hasEnhancedHandler && !validation.hasTRPCExport) {
          validation.warnings.push(
            "Route uses endpointsHandler but missing tRPC export",
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
          "Route still uses old apiHandler, should migrate to endpointsHandler",
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
      const parsedError = parseError(error);
      validation.errors.push(
        `Failed to read route file: ${parsedError.message}`,
      );
    }

    return validation;
  }

  /**
   * Generate validation report
   */
  async generateValidationReport(
    result: ValidationResult,
    logger: EndpointLogger,
  ): Promise<string> {
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
        routeFile.warnings.forEach((warning) =>
          lines.push(`  - ⚠️ ${warning}`),
        );
      }

      lines.push("");
    }

    return lines.join("\n");
  }

  /**
   * Check if TRPC router file exists
   */
  async checkRouterExists(
    apiDir: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      const resolvedApiDir = path.resolve(process.cwd(), apiDir);
      const routerFile = path.join(
        resolvedApiDir,
        "[locale]",
        "trpc",
        "[...trpc]",
        "router.ts",
      );

      const exists = fs.existsSync(routerFile);

      if (logger) {
        logger.info(
          `TRPC router file ${exists ? "found" : "not found"}: ${routerFile}`,
        );
      }

      return exists;
    } catch (error) {
      if (logger) {
        logger.error("Error checking router file existence", parseError(error));
      }
      return false;
    }
  }

  /**
   * Fix route files automatically
   */
  async fixRoutes(
    apiDir: string,
    logger: EndpointLogger,
  ): Promise<ValidationResult> {
    // First validate to identify issues
    const validationResult = await this.validateTRPCIntegration(
      {
        apiDir,
        fix: false,
        verbose: true,
      },
      logger,
    );

    // In a real implementation, this would apply automatic fixes
    // For now, we'll just return the validation result with a note
    validationResult.warnings.push(
      "Automatic route fixing not implemented yet. Manual migration required.",
    );

    if (logger) {
      logger.info("Route fixing requested but not yet implemented");
    }

    return validationResult;
  }

  /**
   * Find all route.ts files in the API directory
   */
  private findRouteFiles(apiDir: string): string[] {
    const routeFiles: string[] = [];

    const scanDirectory = (dir: string): void => {
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
    };

    scanDirectory(apiDir);
    return routeFiles;
  }
}

/**
 * TRPC Integration Validation Repository Instance
 */
export const trpcValidationRepository = new TRPCValidationRepositoryImpl();
