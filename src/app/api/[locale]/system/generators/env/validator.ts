/**
 * Env File Export Validator
 * Validates that env files export the correct structure using defineEnv pattern
 */

import "server-only";

import { readFileSync } from "node:fs";

/**
 * Entry for .env.example generation
 */
interface EnvExampleEntry {
  key: string;
  exampleValue: string;
  comment?: string;
}

/**
 * Error types for env file validation during generation
 */
export enum EnvValidationErrorType {
  MISSING_EXPORT = "MISSING_EXPORT",
  INVALID_SCHEMA = "INVALID_SCHEMA",
  MISSING_MODULE_NAME = "MISSING_MODULE_NAME",
  SCHEMA_NOT_ZOD_OBJECT = "SCHEMA_NOT_ZOD_OBJECT",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  DUPLICATE_MODULE_NAME = "DUPLICATE_MODULE_NAME",
}

/**
 * Typed details for different error types
 */
type EnvValidationErrorDetails =
  | { hint: string }
  | { error: string }
  | { existingFile: string; duplicateFile: string };

/**
 * Structure for env validation errors
 */
interface EnvValidationError {
  type: EnvValidationErrorType;
  filePath: string;
  message: string;
  details?: EnvValidationErrorDetails;
}

/**
 * Information about a discovered env file
 */
interface EnvModuleInfo {
  moduleName: string;
  description?: string;
  envExampleEntries?: EnvExampleEntry[];
}

/**
 * Extract env example entries from defineEnv fields
 */
function extractEnvExampleEntries(content: string): EnvExampleEntry[] {
  const entries: EnvExampleEntry[] = [];

  // Match field definitions: KEY: { schema: ..., example: "...", comment?: "..." }
  const fieldPattern =
    /(\w+):\s*\{[^}]*example:\s*["']([^"']*)["'](?:[^}]*comment:\s*["']([^"']+)["'])?[^}]*\}/g;

  let match;
  while ((match = fieldPattern.exec(content)) !== null) {
    entries.push({
      key: match[1],
      exampleValue: match[2],
      comment: match[3] || undefined,
    });
  }

  return entries;
}

/**
 * Result of validating an env file
 */
export interface ValidationResult {
  isValid: boolean;
  errors: EnvValidationError[];
  module?: EnvModuleInfo;
  exportName?: string;
  schemaExportName?: string;
  examplesExportName?: string;
}

/**
 * Validate that an env file exports the correct structure
 * Uses static analysis to avoid import side effects during generation
 */
export function validateEnvFileExports(filePath: string, isClient: boolean): ValidationResult {
  const errors: EnvValidationError[] = [];

  try {
    const content = readFileSync(filePath, "utf8");

    // Check for defineEnv or defineEnvClient pattern with schema and examples export
    // Matches: { env: name, schema: schemaName, examples: examplesName } (supports multi-line)
    // Using [\s\S] to match any character including newlines, and making it non-greedy
    const definePattern = isClient
      ? /export\s+const\s*\{[\s\S]*?envClient(?::\s*(\w+))?[\s\S]*?schema:\s*(\w+)[\s\S]*?examples:\s*(\w+)[\s\S]*?\}\s*=\s*defineEnvClient/
      : /export\s+const\s*\{[\s\S]*?env(?::\s*(\w+))?[\s\S]*?schema:\s*(\w+)[\s\S]*?examples:\s*(\w+)[\s\S]*?\}\s*=\s*defineEnv/;

    const exportMatch = content.match(definePattern);

    if (!exportMatch) {
      errors.push({
        type: EnvValidationErrorType.MISSING_EXPORT,
        filePath,
        message: `File must export env, schema, and examples using ${isClient ? "defineEnvClient" : "defineEnv"}`,
        details: {
          hint: isClient
            ? "Add: export const { envClient: myEnv, schema: myEnvSchema, examples: myEnvExamples } = defineEnvClient({ ... })"
            : "Add: export const { env: myEnv, schema: myEnvSchema, examples: myEnvExamples } = defineEnv({ ... })",
        },
      });
      return { isValid: false, errors };
    }

    // If shorthand is used (no explicit name), derive from schema name or use default
    const exportName = exportMatch[1] || (isClient ? "envClient" : "env");
    const schemaExportName = exportMatch[2];
    const examplesExportName = exportMatch[3];

    // Derive module name from export name (e.g., smsEnv -> sms)
    const moduleName = exportName.replace(/Env$/, "").replace(/Client$/, "");

    // Extract env example entries from field definitions
    const envExampleEntries = extractEnvExampleEntries(content);

    const envModule: EnvModuleInfo = {
      moduleName,
      envExampleEntries: envExampleEntries.length > 0 ? envExampleEntries : undefined,
    };

    return {
      isValid: true,
      errors: [],
      module: envModule,
      exportName,
      schemaExportName,
      examplesExportName,
    };
  } catch (error) {
    errors.push({
      type: EnvValidationErrorType.INVALID_SCHEMA,
      filePath,
      message: `Failed to read env file: ${error instanceof Error ? error.message : String(error)}`,
      details: { error: String(error) },
    });
    return { isValid: false, errors };
  }
}

/**
 * Format validation errors for CLI output
 */
export function formatValidationErrors(errors: EnvValidationError[]): string {
  return errors
    .map((err) => {
      const relativePath = err.filePath.replace(process.cwd(), "").replace(/^\//, "");
      let msg = `    • ${relativePath}`;
      msg += `\n      ${err.message}`;

      // Format details nicely without JSON
      if (err.details) {
        if ("hint" in err.details) {
          msg += `\n      💡 ${err.details.hint}`;
        } else if ("error" in err.details) {
          msg += `\n      ⚠️  ${err.details.error}`;
        } else if ("existingFile" in err.details && "duplicateFile" in err.details) {
          const existing = err.details.existingFile.replace(process.cwd(), "").replace(/^\//, "");
          msg += `\n      ⚠️  Conflicts with: ${existing}`;
        }
      }
      return msg;
    })
    .join("\n");
}

/**
 * Check for duplicate module names
 */
export function checkDuplicateModuleNames(
  modules: Array<{ moduleName: string; filePath: string }>,
): EnvValidationError[] {
  const errors: EnvValidationError[] = [];
  const seen = new Map<string, string>();

  for (const mod of modules) {
    const existing = seen.get(mod.moduleName);
    if (existing) {
      errors.push({
        type: EnvValidationErrorType.DUPLICATE_MODULE_NAME,
        filePath: mod.filePath,
        message: `Duplicate module name "${mod.moduleName}" found`,
        details: {
          existingFile: existing,
          duplicateFile: mod.filePath,
        },
      });
    } else {
      seen.set(mod.moduleName, mod.filePath);
    }
  }

  return errors;
}
