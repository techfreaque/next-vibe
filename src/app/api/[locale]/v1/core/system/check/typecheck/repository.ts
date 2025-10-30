/**
 * Run TypeScript type checking Repository
 * Handles run typescript type checking operations
 */

import { readFileSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";

import { exec } from "node:child_process";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { parseJsonWithComments } from "../../../shared/utils/parse-json";
import { TYPECHECK_PATTERNS } from "./constants";
import type {
  TypecheckRequestOutput,
  TypecheckResponseOutput,
} from "./definition";
import {
  createTypecheckConfig,
  findTypeScriptFiles,
  getDisplayPath,
  PathType,
  shouldIncludeFile,
  type TypecheckConfig,
} from "./utils";

const INCLUDE_PATTERNS_BLACKLIST = ["**/*.ts", "**/*.tsx"];

// TypeScript configuration Zod schema for runtime validation
const TsConfigSchema = z.object({
  compilerOptions: z
    .object({
      rootDir: z.string().optional(),
      paths: z.record(z.string(), z.array(z.string())).optional(),
      baseUrl: z.string().optional(),
    })
    .passthrough()
    .optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
});

// TypeScript configuration type inferred from Zod schema
type TsConfig = z.infer<typeof TsConfigSchema>;

const execAsync = promisify(exec);

/**
 * Create a temporary tsconfig.json for specific files
 * This preserves all compiler options and path mappings from the main tsconfig
 * but limits the files to be checked to improve performance
 */
function createTempTsConfig(
  filesToCheck: string[],
  tempConfigPath: string,
): void {
  // Read and validate the main tsconfig.json with Zod to avoid any type
  let mainTsConfig: TsConfig;
  try {
    const tsConfigContent = readFileSync("tsconfig.json", "utf8");
    const parsedJsonResult = parseJsonWithComments(tsConfigContent);
    if (!parsedJsonResult.success) {
      // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
      throw new Error("Failed to parse tsconfig.json");
    }
    mainTsConfig = TsConfigSchema.parse(parsedJsonResult.data);
  } catch (error) {
    /* eslint-disable no-restricted-syntax, i18next/no-literal-string */
    throw new Error(
      `Failed to read or parse tsconfig.json: ${error instanceof Error ? error.message : String(error)}`, { cause: error },
    );
    /* eslint-enable no-restricted-syntax, i18next/no-literal-string */
  }
  const generalFilesToInclude = (mainTsConfig.include || []).filter(
    (includePattern) =>
      INCLUDE_PATTERNS_BLACKLIST.includes(includePattern)
        ? undefined
        : includePattern,
  );

  // Convert relative file paths to be relative to the temp config location
  // Since temp config is in .tmp/, we need to go up one level (../) to reach project root
  const adjustedFiles = filesToCheck.map((file) => {
    // If file is already relative to project root, prepend ../
    if (!file.startsWith("/")) {
      return `../${file}`;
    }
    return file;
  });

  // Adjust path mappings to account for temp config being in .tmp/ directory
  const adjustedPaths: Record<string, string[]> = {};
  if (mainTsConfig.compilerOptions?.paths) {
    for (const [key, paths] of Object.entries(
      mainTsConfig.compilerOptions.paths,
    )) {
      adjustedPaths[key] = paths.map((path) => {
        // If path starts with ./, adjust it to ../
        if (path.startsWith("./")) {
          return `../${path.slice(2)}`;
        }
        // If path doesn't start with ./ or ../, assume it's relative to project root
        if (!path.startsWith("../") && !path.startsWith("/")) {
          return `../${path}`;
        }
        return path;
      });
    }
  }

  // Adjust exclude patterns to account for temp config being in .tmp/ directory
  const adjustedExcludes = (mainTsConfig.exclude || []).map(
    (excludePattern) => {
      // If exclude pattern starts with ./, adjust it to ../
      if (excludePattern.startsWith("./")) {
        return `../${excludePattern.slice(2)}`;
      }
      // If exclude pattern doesn't start with ./ or ../, assume it's relative to project root
      if (
        !excludePattern.startsWith("../") &&
        !excludePattern.startsWith("/")
      ) {
        return `../${excludePattern}`;
      }
      return excludePattern;
    },
  );

  // Create a temporary tsconfig that includes only the specified files
  // but preserves all compiler options, path mappings, and exclude patterns
  const tempTsConfig: TsConfig = {
    ...mainTsConfig,
    compilerOptions: {
      ...mainTsConfig.compilerOptions,
      // eslint-disable-next-line i18next/no-literal-string
      rootDir: "..", // Adjust rootDir to point to project root from .tmp/
      // Remove baseUrl as tsgo doesn't support it, use paths instead
      baseUrl: undefined,
      paths: {
        ...adjustedPaths, // Use adjusted path mappings
        "*": ["./*"], // Replace baseUrl functionality for tsgo compatibility
      },
    },
    include: [...generalFilesToInclude, ...adjustedFiles],
    exclude: adjustedExcludes, // Preserve exclude patterns with adjusted paths
  };

  writeFileSync(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));
}

/**
 * Run TypeScript type checking Repository Interface
 */
export interface TypecheckRepositoryInterface {
  execute(
    data: TypecheckRequestOutput,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<TypecheckResponseOutput>>;
}

/**
 * Run TypeScript type checking Repository Implementation
 */
export class TypecheckRepositoryImpl implements TypecheckRepositoryInterface {
  async execute(
    data: TypecheckRequestOutput,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<TypecheckResponseOutput>> {
    const startTime = Date.now();
    let output = "";

    // Configuration setup
    let config: TypecheckConfig | undefined;

    try {
      // Create TypeScript checking configuration
      config = createTypecheckConfig(data.path);

      // Build TypeScript command based on path type
      let command: string;

      if (config.pathType === PathType.NO_PATH) {
        // No specific path provided, check entire project with increased memory
        // eslint-disable-next-line i18next/no-literal-string
        command = `${TYPECHECK_PATTERNS.TSGO_COMMAND}--noEmit --incremental --tsBuildInfoFile ${config.buildInfoFile} --skipLibCheck --project tsconfig.json`;
        logger.debug(
          "Running TypeScript check on entire project with increased memory",
        );
      } else if (config.pathType === PathType.SINGLE_FILE) {
        // Single file - create temporary tsconfig that includes only this file
        if (!config.tempConfigFile) {
          return fail({
            message:
              "app.api.v1.core.system.check.typecheck.errors.noTsFiles.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              message:
                "app.api.v1.core.system.check.typecheck.errors.noTsFiles.message",
            },
          });
        }

        // Create temporary tsconfig for the single file
        createTempTsConfig([config.targetPath!], config.tempConfigFile);

        // eslint-disable-next-line i18next/no-literal-string
        command = `${TYPECHECK_PATTERNS.TSGO_COMMAND} --noEmit --incremental --tsBuildInfoFile ${config.buildInfoFile} --skipLibCheck --project ${config.tempConfigFile}`;
      } else {
        // Folder - create temporary tsconfig that includes only files from this folder
        const tsFiles = findTypeScriptFiles(config.targetPath || ".");

        if (tsFiles.length === 0) {
          return createSuccessResponse({
            success: true,
            issues: [],
          });
        }

        if (!config.tempConfigFile) {
          return fail({
            message:
              "app.api.v1.core.system.check.typecheck.errors.noTsFiles.title",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: {
              message:
                "app.api.v1.core.system.check.typecheck.errors.noTsFiles.message",
            },
          });
        }

        // Create temporary tsconfig for the folder files
        createTempTsConfig(tsFiles, config.tempConfigFile);

        // eslint-disable-next-line i18next/no-literal-string
        command = `${TYPECHECK_PATTERNS.TSGO_COMMAND} --noEmit --incremental --tsBuildInfoFile ${config.buildInfoFile} --skipLibCheck --project ${config.tempConfigFile}`;
      }

      logger.debug("Executing TypeScript command:", command);

      // Validate command before execution
      if (!command || typeof command !== "string") {
        return fail({
          message:
            "app.api.v1.core.system.check.typecheck.errors.invalidCommand.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            message:
              "app.api.v1.core.system.check.typecheck.errors.invalidCommand.message",
          },
        });
      }

      let stdout: string | undefined;
      let stderr: string | undefined;

      try {
        const result = await execAsync(command, {
          cwd: process.cwd(),
          timeout: 900000, // 15 minute timeout for large projects
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        });
        logger.debug("TypeScript command executed successfully");

        stdout = result.stdout;
        stderr = result.stderr;
      } catch (execError) {
        // TSC exit codes 1 and 2 mean TypeScript errors were found - check for them
        const hasTypeErrors =
          execError &&
          typeof execError === "object" &&
          "code" in execError &&
          (execError.code === 1 || execError.code === 2);

        if (hasTypeErrors && "stdout" in execError && "stderr" in execError) {
          stdout =
            typeof execError.stdout === "string" ? execError.stdout : undefined;
          stderr =
            typeof execError.stderr === "string" ? execError.stderr : undefined;
          // TypeScript errors detected (exit codes 1 or 2)
        } else {
          // Other errors are unexpected
          const parsedExecError = parseError(execError);
          logger.error(
            "Unexpected error executing TypeScript command",
            parsedExecError,
          );
          return fail({
            message:
              "app.api.v1.core.system.check.typecheck.errors.internal.title",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: parsedExecError.message,
            },
          });
        }
      }

      // Combine stdout and stderr for complete output
      const fullOutput = [stdout, stderr].filter(Boolean).join("\n");
      output += fullOutput;

      // Parse TypeScript output for structured errors and warnings
      const errors: Array<{
        file: string;
        line?: number;
        column?: number;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
      }> = [];

      const warnings: Array<{
        file: string;
        line?: number;
        column?: number;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
      }> = [];

      // Parse TypeScript output for structured errors and warnings
      const combinedOutput = (stdout || "") + (stderr || "");

      // Strip ANSI color codes that tsgo adds to the output
      // eslint-disable-next-line no-control-regex
      const cleanOutput = combinedOutput.replaceAll(/\u001B\[[0-9;]*m/g, "");
      const outputLines = cleanOutput.split("\n");

      for (const line of outputLines) {
        // TypeScript format: file.ts(line,column): error TS1234: message (tsc)
        // or: file.ts:line:column - error TS1234: message (tsgo)
        let tsMatch = line.match(
          /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s*(.+)$/,
        );

        // If tsc pattern doesn't match, try tsgo pattern
        if (!tsMatch) {
          tsMatch = line.match(
            /^(.+?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s*(.+)$/,
          );
        }

        if (tsMatch) {
          const [, file, lineNum, colNum, severity, code, message] = tsMatch;
          const filePath = file.trim();

          // Apply filtering based on target path and disableFilter setting
          if (
            !shouldIncludeFile(filePath, config.targetPath, data.disableFilter)
          ) {
            continue;
          }

          // Severity is already validated by regex to be "error" or "warning"
          const errorObj: {
            file: string;
            line: number;
            column: number;
            code: string;
            severity: "error" | "warning" | "info";
            message: string;
          } = {
            file: getDisplayPath(filePath),
            line: parseInt(lineNum, 10),
            column: parseInt(colNum, 10),
            code: code.trim(),
            severity:
              severity === "error"
                ? "error"
                : severity === "warning"
                  ? "warning"
                  : "info",
            message: message.trim(),
          };

          if (severity === "error") {
            errors.push(errorObj);
          } else if (severity === "warning") {
            warnings.push(errorObj);
          }
        }
        // Fallback for simpler error formats - only when filtering is disabled
        else if (line.includes(TYPECHECK_PATTERNS.ERROR_TS) && line.trim()) {
          // Skip fallback parsing when path filtering is active and not disabled
          if (config.targetPath && !data.disableFilter) {
            continue;
          }
          errors.push({
            file: "unknown",
            severity: "error",
            message: line.trim(),
          });
        } else if (
          line.includes(TYPECHECK_PATTERNS.WARNING_KEYWORD) &&
          (line.includes(TYPECHECK_PATTERNS.TS_EXTENSION) ||
            line.includes(TYPECHECK_PATTERNS.TSX_EXTENSION)) &&
          line.trim()
        ) {
          // Skip fallback parsing when path filtering is active and not disabled
          if (config.targetPath && !data.disableFilter) {
            continue;
          }
          warnings.push({
            file: "unknown",
            severity: "warning",
            message: line.trim(),
          });
        }
      }

      const hasErrors = errors.length > 0;

      // Combine errors and warnings into issues array with type field
      const issues = [
        ...errors.map((error) => ({ ...error, type: "type" as const })),
        ...warnings.map((warning) => ({ ...warning, type: "type" as const })),
      ];

      const response: TypecheckResponseOutput = {
        success: !hasErrors,
        issues,
      };

      return createSuccessResponse(response);
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      // Recreate config for error handling
      const config = createTypecheckConfig(data.path);

      // Parse error output for structured errors
      const errors: Array<{
        file: string;
        line?: number;
        column?: number;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
      }> = [];

      const warnings: Array<{
        file: string;
        line?: number;
        column?: number;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
      }> = [];

      // Handle exec error output - check structure without assertions
      const hasStderr = error && typeof error === "object" && "stderr" in error;
      const hasStdout = error && typeof error === "object" && "stdout" in error;
      const hasCode = error && typeof error === "object" && "code" in error;

      if (hasStderr && typeof error.stderr === "string") {
        output += error.stderr;
        errors.push({
          file: "unknown",
          severity: "error",
          message: error.stderr.trim(),
        });
      }
      if (hasStdout && typeof error.stdout === "string") {
        output += error.stdout;

        // Parse TypeScript errors from stdout
        const stdoutForSplit = error.stdout || "";
        const lines = stdoutForSplit.split("\n");
        for (const line of lines) {
          const match = line.match(TYPECHECK_PATTERNS.FULL_ERROR_PATTERN);
          if (match) {
            const [, file, lineNum, colNum, , code, message] = match;
            const filePath = file.trim();

            // Apply filtering based on target path and disableFilter setting
            if (
              shouldIncludeFile(filePath, config.targetPath, data.disableFilter)
            ) {
              errors.push({
                file: getDisplayPath(filePath),
                line: parseInt(lineNum, 10),
                column: parseInt(colNum, 10),
                code: code.trim(),
                severity: "error",
                message: message.trim(),
              });
            }
          } else if (
            line.includes(TYPECHECK_PATTERNS.ERROR_TS) &&
            line.trim() &&
            (!config.targetPath || data.disableFilter)
          ) {
            // Fallback for other TypeScript error formats - only when filtering is disabled
            errors.push({
              file: "unknown",
              severity: "error",
              message: line.trim(),
            });
          }
        }
      }

      // If no specific errors found, add the general error message
      if (errors.length === 0) {
        errors.push({
          file: "unknown",
          severity: "error",
          message: parsedError.message,
        });
      }

      // Combine errors and warnings into issues array with type field
      const issues = [
        ...errors.map((error) => ({ ...error, type: "type" as const })),
        ...warnings.map((warning) => ({ ...warning, type: "type" as const })),
      ];

      const response: TypecheckResponseOutput = {
        success: false,
        issues,
      };

      // For TypeScript errors (exit code 2) or when we have parsed errors, return success with error details
      // This allows the UI to display the actual TypeScript errors
      const errorCode =
        hasCode && typeof error.code === "number" ? error.code : 0;
      if (errorCode === 2 || errors.length > 0) {
        // TypeScript compilation errors - treat as successful response with issues
        return createSuccessResponse(response);
      }

      return fail({
        message: "app.api.v1.core.system.check.typecheck.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          output: output.trim(),
          duration: duration.toString(),
        },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const typecheckRepository = new TypecheckRepositoryImpl();
