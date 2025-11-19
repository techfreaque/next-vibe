/**
 * tRPC Router Generator
 * Automatically generates tRPC routers from existing route files
 * Scans the API directory and creates nested router structure
 */

import fs from "node:fs";
import path from "node:path";

import { findRouteFiles } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/filesystem/scanner";

import {
  type RouteFileStructure,
  validateRouteFileForTRPC,
} from "../../unified-interface/trpc/procedure-factory";

/**
 * Router generation configuration
 */
export interface RouterGenerationConfig {
  /** Root directory to scan for API routes */
  apiDir: string;

  /** Output file for the generated router */
  outputFile: string;

  /** Whether to include validation warnings in output */
  includeWarnings?: boolean;

  /** Patterns to exclude from scanning */
  excludePatterns?: string[];
}

/**
 * Information about a discovered route file
 */
export interface RouteFileInfo {
  /** Full file path */
  filePath: string;

  /** Relative path from API directory */
  relativePath: string;

  /** Router path segments (e.g., ['leads', 'batch']) */
  routerPath: string[];

  /** Available HTTP methods */
  methods: string[];

  /** Validation result */
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };

  /** Variable name for import (set during code generation) */
  varName?: string;
}

/**
 * Scan API directory for route files and generate router structure
 */
export async function generateTRPCRouter(
  config: RouterGenerationConfig,
): Promise<{
  success: boolean;
  routeFiles: RouteFileInfo[];
  errors: string[];
  warnings: string[];
}> {
  // Debug: generateTRPCRouter started with config
  const {
    apiDir,
    outputFile,
    includeWarnings = true,
    excludePatterns = [],
  } = config;
  const errors: string[] = [];
  const warnings: string[] = [];
  const routeFiles: RouteFileInfo[] = [];

  // Add default exclude patterns for standalone packages
  // These packages have their own node_modules and shouldn't be processed as API routes
  const defaultExcludePatterns = [
    "system/builder",
    "system/launchpad",
    "system/release-tool",
    "system/guard",
    "system/check",
  ];
  const allExcludePatterns = [...defaultExcludePatterns, ...excludePatterns];

  try {
    // Debug: Starting tRPC router generation

    // Scan for route files
    const discoveredFiles = scanForRouteFiles(apiDir, allExcludePatterns);
    // Debug: Found route files

    // Validate and process each route file
    // Debug: Processing routes

    let processedCount = 0;
    for (const filePath of discoveredFiles) {
      processedCount++;
      if (processedCount <= 5 || processedCount % 20 === 0) {
        // Debug: Processing route
      }
      try {
        const routeInfo = await processRouteFile(filePath, apiDir);
        routeFiles.push(routeInfo);

        if (!routeInfo.validation.isValid) {
          errors.push(
            ...routeInfo.validation.errors.map(
              (err) => `${routeInfo.relativePath}: ${err}`,
            ),
          );
          // Debug first few invalid routes
          if (errors.length <= 6) {
            // Debug: Invalid route
          }
        } else {
          // Debug first few valid routes
          if (routeFiles.filter((r) => r.validation.isValid).length <= 3) {
            // Debug: Valid route
          }
        }

        if (includeWarnings) {
          warnings.push(
            ...routeInfo.validation.warnings.map(
              (warn) => `${routeInfo.relativePath}: ${warn}`,
            ),
          );
        }
      } catch {
        const errorMsg = "app.error.general.route_processing_failed";
        errors.push(errorMsg);
        // Error processing route - continuing with other routes
      }
    }

    // Debug: Processing complete

    // Generate router code
    const validRoutes = routeFiles.filter((f) => f.validation.isValid);
    // Debug: Generating router code
    const routerCode = generateRouterCode(validRoutes);

    // Write to output file
    writeRouterFile(outputFile, routerCode);

    // Debug: tRPC router generation completed

    const validRouteCount = routeFiles.filter(
      (f) => f.validation.isValid,
    ).length;
    return {
      success: validRouteCount > 0, // Success if we have at least one valid route
      routeFiles,
      errors,
      warnings,
    };
  } catch {
    const errorMsg = "app.error.general.router_generation_failed";
    errors.push(errorMsg);
    // Error generating router - returning failure

    return {
      success: false,
      routeFiles,
      errors,
      warnings,
    };
  }
}

/**
 * Scan directory recursively for route.ts files
 */
function scanForRouteFiles(
  apiDir: string,
  excludePatterns: string[],
): string[] {
  // Use consolidated directory scanner
  const results = findRouteFiles(apiDir, excludePatterns);
  return results.map((r) => r.fullPath);
}

/**
 * Process a single route file and extract information
 */
async function processRouteFile(
  filePath: string,
  apiDir: string,
): Promise<RouteFileInfo> {
  const relativePath = path.relative(apiDir, filePath);

  // Calculate router path from file path
  // e.g., /leads/batch/route.ts -> ['leads', 'batch']
  const routerPath = path
    .dirname(relativePath)
    .split(path.sep)
    .filter((segment) => segment !== "." && segment !== "")
    .filter((segment) => !segment.startsWith("[") || !segment.endsWith("]")); // Remove dynamic segments like [locale]

  // Try to import and validate the route file
  let validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } = {
    isValid: false,
    errors: ["app.error.general.route_load_failed"],
    warnings: [],
  };
  let methods: string[] = [];

  try {
    // Dynamic import of the route file
    // Convert absolute path to relative path from the current file's directory
    const currentFileUrl = new URL(import.meta.url);
    const currentFileDir = path.dirname(currentFileUrl.pathname);
    const relativeToCurrentFile = path.relative(currentFileDir, filePath);
    const importPath = relativeToCurrentFile.startsWith(".")
      ? relativeToCurrentFile
      : `./${relativeToCurrentFile}`;
    const routeModule = (await import(importPath)) as RouteFileStructure;

    // Extract available HTTP methods
    methods = ["GET", "POST", "PUT", "PATCH", "DELETE"].filter((method) => {
      const moduleExport = routeModule[method as keyof RouteFileStructure];
      return moduleExport && typeof moduleExport === "function";
    });

    // Validate the route file structure
    validation = validateRouteFileForTRPC(
      routeModule as RouteFileStructure & Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  } catch {
    validation.errors = ["app.error.general.route_import_failed"];
  }

  return {
    filePath,
    relativePath,
    routerPath,
    methods,
    validation,
  };
}

/**
 * Generate TypeScript code for the router with proper nested structure
 */
function generateRouterCode(validRouteFiles: RouteFileInfo[]): string {
  const routerStructure = buildNestedRouterStructure(validRouteFiles);

  // Collect all routes that are actually used in the router structure
  const usedRoutes = new Set<RouteFileInfo>();
  collectUsedRoutes(routerStructure, usedRoutes);

  const imports: string[] = [];
  const constants: string[] = [];
  let importCounter = 0;

  // Only generate imports and constants for routes that are actually used
  for (const routeFile of validRouteFiles) {
    if (!usedRoutes.has(routeFile)) {
      continue;
    }

    const varName = `route${importCounter++}`;
    // eslint-disable-next-line i18next/no-literal-string
    const toolsVarName = `${varName}Tools`;
    const importPath = path
      .relative(
        path.dirname(
          path.join(
            process.cwd(),
            "src/app/api/[locale]/trpc/[...trpc]/router.ts",
          ),
        ),
        routeFile.filePath.replace(/\.ts$/, ""),
      )
      .replace(/\\/g, "/");

    // eslint-disable-next-line i18next/no-literal-string
    imports.push(`import { tools as ${toolsVarName} } from '${importPath}';`);
    // eslint-disable-next-line i18next/no-literal-string
    constants.push(`const ${varName} = ${toolsVarName}.trpc;`);

    // Store the variable name for later use
    routeFile.varName = varName;
  }

  // Generate router structure code
  const routerCode = generateNestedRouterCode(routerStructure, validRouteFiles);

  // eslint-disable-next-line i18next/no-literal-string
  return `/**
 * Auto-generated tRPC Router
 * Generated from route files in the API directory
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */

import { router } from '@/app/api/[locale]/v1/core/system/unified-interface/trpc/core';
${imports.join("\n")}

${constants.join("\n")}

export const appRouter = router({
${routerCode}
});

export type AppRouter = typeof appRouter;
`;
}

/**
 * Recursively collect all routes that are actually used in the router structure
 */
function collectUsedRoutes(
  structure: NestedRouterStructure,
  usedRoutes: Set<RouteFileInfo>,
): void {
  for (const [key, value] of Object.entries(structure)) {
    if (key === "_root" && Array.isArray(value)) {
      for (const route of value) {
        usedRoutes.add(route);
      }
    } else if (Array.isArray(value)) {
      for (const route of value) {
        usedRoutes.add(route);
      }
    } else if (value && typeof value === "object") {
      collectUsedRoutes(value, usedRoutes);
    }
  }
}

/**
 * Build nested router structure from route files
 */
function buildNestedRouterStructure(
  routeFiles: RouteFileInfo[],
): NestedRouterStructure {
  const structure: NestedRouterStructure = {};

  for (const routeFile of routeFiles) {
    const { routerPath } = routeFile;

    if (routerPath.length === 0) {
      // Root level procedures
      if (!structure._root) {
        structure._root = [];
      }
      structure._root.push(routeFile);
    } else {
      // Nested procedures
      let current = structure;

      // Navigate/create the nested structure
      for (let i = 0; i < routerPath.length; i++) {
        const segment = routerPath[i];

        if (i === routerPath.length - 1) {
          // Last segment - add the route file
          if (!current[segment]) {
            current[segment] = [];
          }
          if (Array.isArray(current[segment])) {
            current[segment].push(routeFile);
          }
        } else {
          // Intermediate segment - ensure nested structure exists
          if (!current[segment]) {
            current[segment] = {};
          }
          current = current[segment] as NestedRouterStructure;
        }
      }
    }
  }

  return structure;
}

/**
 * Generate nested router code from structure
 */
function generateNestedRouterCode(
  structure: NestedRouterStructure,
  // eslint-disable-next-line oxc/only-used-in-recursion
  allRouteFiles: RouteFileInfo[],
  indent = "  ",
): string {
  const entries: string[] = [];

  // Handle root level procedures
  if (structure._root) {
    for (const routeFile of structure._root) {
      entries.push(`${indent}...${routeFile.varName},`);
    }
  }

  // Handle nested structures
  for (const [key, value] of Object.entries(structure)) {
    if (key === "_root") {
      continue;
    }

    // Quote key if it contains hyphens or other special characters
    // eslint-disable-next-line i18next/no-literal-string
    const quotedKey = /[^a-zA-Z0-9_$]/.test(key) ? `"${key}"` : key;

    if (Array.isArray(value)) {
      // Direct procedures at this level
      if (value.length === 1) {
        // Single route file - spread the procedures object (e.g., { GET: procedure, POST: procedure })

        entries.push(
          `${indent}${quotedKey}: router({ ...${value[0].varName} }),`,
        );
      } else {
        // Multiple route files at same level - merge them
        const mergedProcedures = value
          .map((rf) => `...${rf.varName}`)
          .join(", ");
        // eslint-disable-next-line i18next/no-literal-string
        entries.push(`${indent}${quotedKey}: router({ ${mergedProcedures} }),`);
      }
    } else if (value) {
      // Nested structure
      const nestedCode = generateNestedRouterCode(
        value,
        allRouteFiles,
        `${indent}  `,
      );
      // eslint-disable-next-line i18next/no-literal-string
      const nestedRouterEntry = `${indent}${quotedKey}: router({\n${nestedCode}\n${indent}}),`;
      entries.push(nestedRouterEntry);
    }
  }

  return entries.join("\n");
}

/**
 * Interface for nested router structure
 */
interface NestedRouterStructure {
  [key: string]: NestedRouterStructure | RouteFileInfo[] | undefined;
  _root?: RouteFileInfo[];
}

/**
 * Write the generated router code to file
 */
function writeRouterFile(outputFile: string, content: string): void {
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(outputFile, content, "utf8");
}
