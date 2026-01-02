/**
 * Env Generator Repository
 * Handles environment configuration generation
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { EnvValidationErrorType } from "./validator";

/**
 * Entry for .env.example generation
 */
interface EnvExampleEntry {
  key: string;
  exampleValue: string;
  comment?: string;
}

/**
 * Information about a discovered env file
 */
interface EnvFileInfo {
  filePath: string;
  relativePath: string;
  moduleName: string;
  description?: string;
  isClient: boolean;
  exportName: string;
  envExampleEntries?: EnvExampleEntry[];
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
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";
import {
  checkDuplicateModuleNames,
  formatValidationErrors,
  validateEnvFileExports,
} from "./validator";

// Type definitions
interface EnvGeneratorRequestType {
  outputDir: string;
  verbose: boolean;
  dryRun: boolean;
}

interface EnvGeneratorResponseType {
  success: boolean;
  message: string;
  serverEnvFiles: number;
  clientEnvFiles: number;
  duration: number;
  outputPaths: {
    server?: string;
    client?: string;
    envExample?: string;
  };
}

/**
 * Env Generator Repository Interface
 */
interface EnvGeneratorRepository {
  generateEnv(
    data: EnvGeneratorRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EnvGeneratorResponseType>>;
}

/**
 * Env Generator Repository Implementation
 */
class EnvGeneratorRepositoryImpl implements EnvGeneratorRepository {
  async generateEnv(
    data: EnvGeneratorRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EnvGeneratorResponseType>> {
    const startTime = Date.now();

    try {
      logger.debug("Starting env generation", { outputDir: data.outputDir });

      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const apiDir = join(process.cwd(), ...apiCorePath);
      const configDir = join(process.cwd(), "src", "config");

      const excludeDirs = [
        "node_modules",
        ".git",
        ".next",
        "dist",
        "generated",
        "shared", // Exclude the shared/env utilities
      ];

      // Discover server env files from both locations
      logger.debug("Discovering server env files");
      const serverEnvFilePaths = [
        ...findFilesRecursively(apiDir, "env.ts", excludeDirs),
        ...findFilesRecursively(configDir, "env.ts", excludeDirs),
      ];

      // Discover client env files from both locations
      logger.debug("Discovering client env files");
      const clientEnvFilePaths = [
        ...findFilesRecursively(apiDir, "env-client.ts", excludeDirs),
        ...findFilesRecursively(configDir, "env-client.ts", excludeDirs),
      ];

      if (data.verbose) {
        logger.debug(`Found ${serverEnvFilePaths.length} server env files`);
        logger.debug(`Found ${clientEnvFilePaths.length} client env files`);
      }

      // Validate all files
      const validServerModules: EnvFileInfo[] = [];
      const validClientModules: EnvFileInfo[] = [];
      const allErrors: EnvValidationError[] = [];

      // Validate server files
      for (const filePath of serverEnvFilePaths) {
        const result = validateEnvFileExports(filePath, false);
        if (result.isValid && result.module && result.exportName) {
          const outputFile = join(process.cwd(), data.outputDir, "env.ts");
          validServerModules.push({
            filePath,
            relativePath: getRelativeImportPath(filePath, outputFile),
            moduleName: result.module.moduleName,
            description: result.module.description,
            isClient: false,
            exportName: result.exportName,
            envExampleEntries: result.module.envExampleEntries,
          });
        } else {
          allErrors.push(...result.errors);
        }
      }

      // Validate client files
      for (const filePath of clientEnvFilePaths) {
        const result = validateEnvFileExports(filePath, true);
        if (result.isValid && result.module && result.exportName) {
          const outputFile = join(
            process.cwd(),
            data.outputDir,
            "env-client.ts",
          );
          validClientModules.push({
            filePath,
            relativePath: getRelativeImportPath(filePath, outputFile),
            moduleName: result.module.moduleName,
            description: result.module.description,
            isClient: true,
            exportName: result.exportName,
            envExampleEntries: result.module.envExampleEntries,
          });
        } else {
          allErrors.push(...result.errors);
        }
      }

      // Check for duplicate module names
      const duplicateErrors = checkDuplicateModuleNames([
        ...validServerModules.map((m) => ({
          moduleName: m.moduleName,
          filePath: m.filePath,
        })),
        ...validClientModules.map((m) => ({
          moduleName: m.moduleName,
          filePath: m.filePath,
        })),
      ]);
      allErrors.push(...duplicateErrors);

      // Fail if there are validation errors
      if (allErrors.length > 0) {
        const errorMessage = formatValidationErrors(allErrors);
        logger.error("Env file validation failed", {
          errorCount: allErrors.length,
          details: errorMessage,
        });
        return fail({
          message: "app.api.system.generators.env.error.validation_failed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            details: errorMessage,
          },
        });
      }

      // Generate output files
      const serverOutputPath = join(data.outputDir, "env.ts");
      const clientOutputPath = join(data.outputDir, "env-client.ts");
      const envExamplePath = ".env.example";

      if (!data.dryRun) {
        // Generate server env file
        const serverContent = this.generateServerEnvContent(
          validServerModules,
          join(process.cwd(), serverOutputPath),
        );
        await writeGeneratedFile(
          join(process.cwd(), serverOutputPath),
          serverContent,
          false,
        );

        // Generate client env file
        const clientContent = this.generateClientEnvContent(
          validClientModules,
          join(process.cwd(), clientOutputPath),
        );
        await writeGeneratedFile(
          join(process.cwd(), clientOutputPath),
          clientContent,
          false,
        );

        // Generate .env.example file
        const envExampleContent = this.generateEnvExampleContent([
          ...validServerModules,
          ...validClientModules,
        ]);
        await writeGeneratedFile(
          join(process.cwd(), envExamplePath),
          envExampleContent,
          false,
        );
      }

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated env files with ${formatCount(validServerModules.length, "server module")} and ${formatCount(validClientModules.length, "client module")} in ${formatDuration(duration)}`,
          "\u2699\uFE0F",
        ),
      );

      return success({
        success: true,
        message: "app.api.system.generators.env.success.generated",
        serverEnvFiles: validServerModules.length,
        clientEnvFiles: validClientModules.length,
        duration,
        outputPaths: data.dryRun
          ? {}
          : {
              server: serverOutputPath,
              client: clientOutputPath,
              envExample: envExamplePath,
            },
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Env generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: "app.api.system.generators.env.error.generation_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
          error: String(parseError(error)),
        },
      });
    }
  }

  /**
   * Generate server env file content
   */
  private generateServerEnvContent(
    modules: EnvFileInfo[],
    outputFile: string,
  ): string {
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "Env Generator",
      {
        command: "vibe generate:env",
      },
    );

    // Generate imports
    const imports: string[] = [];
    for (const mod of modules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      imports.push(`import { ${mod.exportName} } from "${relativePath}";`);
    }

    // Generate module names for registry
    const moduleEntries = modules
      .map((m) => `  "${m.moduleName}": ${m.exportName},`)
      .join("\n");

    // Generate schema merge chain
    const schemaChain = modules
      .map((m, i) =>
        i === 0 ? `${m.exportName}.schema` : `.merge(${m.exportName}.schema)`,
      )
      .join("\n  ");

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import "server-only";

import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { envValidationLogger } from "@/app/api/[locale]/system/unified-interface/shared/env/validation-logger";

// Import env modules
${imports.join("\n")}

// Platform detection
const platform = {
  isServer: true,
  isReactNative: false,
  isBrowser: false,
};

// Module registry for introspection
export const envModules = {
${moduleEntries}
} as const;

// Combined schema using merge
export const envSchema = ${schemaChain || "z.object({})"};

export type Env = z.infer<typeof envSchema>;

/**
 * Validate all environment variables
 * Call this explicitly at dev/build time
 */
export function validateAllEnv(): Env {
  return validateEnv(
    { ...process.env, platform },
    envSchema,
    envValidationLogger,
  );
}

/**
 * Validate a specific module's env vars
 * Useful for lazy validation or testing
 */
export function validateModuleEnv<K extends keyof typeof envModules>(
  moduleName: K,
): z.infer<(typeof envModules)[K]["schema"]> {
  return validateEnv(
    { ...process.env, platform },
    envModules[moduleName].schema,
    envValidationLogger,
  );
}

/**
 * Get list of all registered env modules
 */
export function getEnvModuleNames(): (keyof typeof envModules)[] {
  return Object.keys(envModules) as (keyof typeof envModules)[];
}
`;
  }

  /**
   * Generate client env file content
   */
  private generateClientEnvContent(
    modules: EnvFileInfo[],
    outputFile: string,
  ): string {
    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "Env Generator",
      {
        command: "vibe generate:env",
      },
    );

    // Generate imports
    const imports: string[] = [];
    for (const mod of modules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      imports.push(`import { ${mod.exportName} } from "${relativePath}";`);
    }

    // Generate module names for registry
    const moduleEntries = modules
      .map((m) => `  "${m.moduleName}": ${m.exportName},`)
      .join("\n");

    // Generate schema merge chain
    const schemaChain = modules
      .map((m, i) =>
        i === 0 ? `${m.exportName}.schema` : `.merge(${m.exportName}.schema)`,
      )
      .join("\n  ");

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { envValidationLogger } from "@/app/api/[locale]/system/unified-interface/shared/env/validation-logger";

// Import client env modules
${imports.join("\n")}

// Platform detection (will be set at runtime)
const isServer = typeof window === "undefined";
const isReactNative = false;
const isBrowser = !isServer && typeof window !== "undefined" && !!window.document;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Module registry for introspection
export const envClientModules = {
${moduleEntries}
} as const;

// Combined client schema
export const envClientSchema = ${schemaChain || "z.object({})"};

export type EnvClient = z.infer<typeof envClientSchema>;

/**
 * Validate all client environment variables
 */
export function validateAllClientEnv(): EnvClient {
  return validateEnv(
    { ...process.env, platform },
    envClientSchema,
    envValidationLogger,
  );
}

/**
 * Get list of all registered client env modules
 */
export function getEnvClientModuleNames(): (keyof typeof envClientModules)[] {
  return Object.keys(envClientModules) as (keyof typeof envClientModules)[];
}
`;
  }

  /**
   * Generate .env.example file content
   */
  private generateEnvExampleContent(modules: EnvFileInfo[]): string {
    const lines: string[] = [
      "# ============================================================================",
      "# AUTO-GENERATED FILE - DO NOT EDIT MANUALLY",
      "# Generated by: vibe generate:env",
      "# This file is auto-generated from environment module definitions.",
      "# To add new environment variables, add envExampleEntries to your env module.",
      "# ============================================================================",
      "",
    ];

    // Group modules by whether they have envExampleEntries
    const modulesWithEntries = modules.filter(
      (m) => m.envExampleEntries && m.envExampleEntries.length > 0,
    );

    for (const mod of modulesWithEntries) {
      // Add section header with description
      lines.push(
        `# ============================================================================`,
      );
      lines.push(`# ${mod.description || mod.moduleName}`);
      lines.push(
        `# ============================================================================`,
      );

      // Add each entry
      for (const entry of mod.envExampleEntries || []) {
        if (entry.comment) {
          lines.push(`# ${entry.comment}`);
        }
        lines.push(`${entry.key}="${entry.exampleValue}"`);
      }

      lines.push("");
    }

    return lines.join("\n");
  }
}

export const envGeneratorRepository = new EnvGeneratorRepositoryImpl();
