/**
 * Env Generator Repository
 * Handles environment configuration generation
 */

import "server-only";

import { dirname, join } from "node:path";

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
  schemaExportName: string;
  examplesExportName: string;
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
  formatWarning,
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
      logger.debug(`Starting env generation: ${data.outputDir}`);

      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const apiDir = join(process.cwd(), ...apiCorePath);
      // eslint-disable-next-line i18next/no-literal-string
      const configDir = join(process.cwd(), "src", "config");

      const excludeDirs = [
        "node_modules",
        ".git",
        ".next",
        "dist",
        "generated",
        "shared", // Exclude the shared/env utilities
      ];

      // Discover server env files (from API directory and config directory)
      logger.debug("Discovering server env files");
      const serverOutputPath = join(data.outputDir, "env.ts");
      const serverEnvFilePaths = [
        ...findFilesRecursively(apiDir, "env.ts", excludeDirs),
        ...findFilesRecursively(configDir, "env.ts", excludeDirs),
      ].filter((filePath) => {
        // Exclude the generated output file itself
        return filePath !== join(process.cwd(), serverOutputPath);
      });

      // Discover client env files (from API directory and config directory)
      logger.debug("Discovering client env files");
      const clientOutputPath = join(data.outputDir, "env-client.ts");
      const clientEnvFilePaths = [
        ...findFilesRecursively(apiDir, "env-client.ts", excludeDirs),
        ...findFilesRecursively(configDir, "env-client.ts", excludeDirs),
      ].filter((filePath) => {
        // Exclude the generated output file itself
        return filePath !== join(process.cwd(), clientOutputPath);
      });

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
        if (
          result.isValid &&
          result.module &&
          result.exportName &&
          result.schemaExportName &&
          result.examplesExportName
        ) {
          const outputFile = join(process.cwd(), data.outputDir, "env.ts");
          validServerModules.push({
            filePath,
            relativePath: getRelativeImportPath(filePath, outputFile),
            moduleName: result.module.moduleName,
            description: result.module.description,
            isClient: false,
            exportName: result.exportName,
            schemaExportName: result.schemaExportName,
            examplesExportName: result.examplesExportName,
            envExampleEntries: result.module.envExampleEntries,
          });
        } else {
          allErrors.push(...result.errors);
        }
      }

      // Validate client files
      for (const filePath of clientEnvFilePaths) {
        const result = validateEnvFileExports(filePath, true);
        if (
          result.isValid &&
          result.module &&
          result.exportName &&
          result.schemaExportName &&
          result.examplesExportName
        ) {
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
            schemaExportName: result.schemaExportName,
            examplesExportName: result.examplesExportName,
            envExampleEntries: result.module.envExampleEntries,
          });
        } else {
          allErrors.push(...result.errors);
        }
      }

      // Check for duplicate module names (separately for server and client)
      const serverDuplicates = checkDuplicateModuleNames(
        validServerModules.map((m) => ({
          moduleName: m.moduleName,
          filePath: m.filePath,
        })),
      );
      const clientDuplicates = checkDuplicateModuleNames(
        validClientModules.map((m) => ({
          moduleName: m.moduleName,
          filePath: m.filePath,
        })),
      );
      allErrors.push(...serverDuplicates, ...clientDuplicates);

      // Log validation errors as warnings (don't fail, just skip invalid files)
      if (allErrors.length > 0) {
        const errorMessage = formatValidationErrors(allErrors);
        logger.warn(
          formatWarning(
            `Skipped ${formatCount(allErrors.length, "invalid env file")}:\n${errorMessage}`,
          ),
        );
      }

      // If no valid modules at all, fail
      if (validServerModules.length === 0 && validClientModules.length === 0) {
        logger.error("No valid env files found");
        return fail({
          message: "app.api.system.generators.env.error.noValidFiles",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Generate output files
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
        // Sort so src/config modules appear first, then pair each directory's
        // env.ts (server) immediately followed by env-client.ts (client).
        // Within a pair, server comes first so client keys win deduplication.
        const configPath = join(process.cwd(), "src", "config");
        const allModules = [
          ...validServerModules,
          ...validClientModules,
        ].toSorted((a, b): number => {
          const aDir = dirname(a.filePath);
          const bDir = dirname(b.filePath);
          const aIsConfig = aDir === configPath;
          const bIsConfig = bDir === configPath;
          // config directory always comes first
          if (aIsConfig && !bIsConfig) {
            return -1;
          }
          if (!aIsConfig && bIsConfig) {
            return 1;
          }
          // group by directory
          if (aDir !== bDir) {
            return aDir.localeCompare(bDir);
          }
          // within same directory: server (env.ts) before client (env-client.ts)
          if (a.isClient !== b.isClient) {
            return a.isClient ? 1 : -1;
          }
          return 0;
        });
        const { content: envExampleContent, keys: envKeys } =
          await this.generateEnvExampleContent(allModules);
        await writeGeneratedFile(
          join(process.cwd(), envExamplePath),
          envExampleContent,
          false,
        );

        // Update Dockerfile and docker-compose.prod.yml with the same key list
        await this.updateDockerfile(join(process.cwd(), "Dockerfile"), envKeys);
        await this.updateDockerCompose(
          join(process.cwd(), "docker-compose.prod.yml"),
          envKeys,
        );
      }

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated env files with ${formatCount(validServerModules.length, "server module")} and ${formatCount(validClientModules.length, "client module")} in ${formatDuration(duration)}`,
          "⚙️ ",
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

    // Sort modules by import path for consistent output
    const sortedModules = [...modules].toSorted((a, b) =>
      getRelativeImportPath(a.filePath, outputFile).localeCompare(
        getRelativeImportPath(b.filePath, outputFile),
      ),
    );

    // Reserved names exported by the generated file itself
    const RESERVED = new Set(["env", "envSchema"]);

    // Build per-module aliased names to avoid collisions with generated exports
    const aliasedModules = sortedModules.map((m) => {
      const needsAlias =
        RESERVED.has(m.exportName) || RESERVED.has(m.schemaExportName);
      const prefix = needsAlias ? `${m.moduleName}_` : "";
      return {
        ...m,
        importedEnvName: needsAlias
          ? `${m.exportName} as ${prefix}${m.exportName}`
          : m.exportName,
        importedSchemaName: needsAlias
          ? `${m.schemaExportName} as ${prefix}${m.schemaExportName}`
          : m.schemaExportName,
        localEnvName: `${prefix}${m.exportName}`,
        localSchemaName: `${prefix}${m.schemaExportName}`,
      };
    });

    // Generate imports
    const imports: string[] = [];
    for (const mod of aliasedModules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      const singleLineImport = `import { ${mod.importedEnvName}, ${mod.importedSchemaName} } from "${relativePath}";`;
      if (singleLineImport.length > 80) {
        imports.push(
          `import {\n  ${mod.importedEnvName},\n  ${mod.importedSchemaName},\n} from "${relativePath}";`,
        );
      } else {
        imports.push(singleLineImport);
      }
    }

    // Generate module names for registry
    const moduleEntries = aliasedModules
      .map(
        (m) =>
          `  ${m.moduleName}: { env: ${m.localEnvName}, schema: ${m.localSchemaName} },`,
      )
      .join("\n");

    // Generate schema merge chain for server - check full single line length first
    const singleLineServerChain = aliasedModules
      .map((m, i) =>
        i === 0 ? `${m.localSchemaName}` : `.merge(${m.localSchemaName})`,
      )
      .join("");
    const fullServerDeclaration = `export const envSchema = ${singleLineServerChain}`;

    let serverSchemaChain: string;
    if (fullServerDeclaration.length > 80 && aliasedModules.length > 1) {
      // Use multiline format with newlines before each merge
      serverSchemaChain = aliasedModules
        .map((m, i) =>
          i === 0 ? `${m.localSchemaName}` : `\n  .merge(${m.localSchemaName})`,
        )
        .join("");
    } else {
      serverSchemaChain = singleLineServerChain;
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import "server-only";

import { validateEnv } from "next-vibe/shared/utils/env-util";
import type { z } from "zod";

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
export const envSchema = ${serverSchemaChain || "z.object({})"};

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
 * Validated environment variables (singleton)
 */
export const env: Env = validateAllEnv();

/**
 * Get a specific module's validated env vars from the singleton
 */
export function getModuleEnv<K extends keyof typeof envModules>(
  moduleName: K,
): (typeof envModules)[K]["env"] {
  return envModules[moduleName].env;
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

    // Sort modules by import path for consistent output
    const sortedModules = [...modules].toSorted((a, b) =>
      getRelativeImportPath(a.filePath, outputFile).localeCompare(
        getRelativeImportPath(b.filePath, outputFile),
      ),
    );

    // Reserved names exported by the generated file itself
    const RESERVED = new Set(["envClient", "envClientSchema"]);

    // Build per-module aliased names to avoid collisions with generated exports
    const aliasedModules = sortedModules.map((m) => {
      const needsAlias =
        RESERVED.has(m.exportName) || RESERVED.has(m.schemaExportName);
      const prefix = needsAlias ? `${m.moduleName}_` : "";
      return {
        ...m,
        importedEnvName: needsAlias
          ? `${m.exportName} as ${prefix}${m.exportName}`
          : m.exportName,
        importedSchemaName: needsAlias
          ? `${m.schemaExportName} as ${prefix}${m.schemaExportName}`
          : m.schemaExportName,
        localEnvName: `${prefix}${m.exportName}`,
        localSchemaName: `${prefix}${m.schemaExportName}`,
      };
    });

    // Generate imports
    const imports: string[] = [];
    for (const mod of aliasedModules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      const singleLineImport = `import { ${mod.importedEnvName}, ${mod.importedSchemaName} } from "${relativePath}";`;
      if (singleLineImport.length > 80) {
        imports.push(
          `import {\n  ${mod.importedEnvName},\n  ${mod.importedSchemaName},\n} from "${relativePath}";`,
        );
      } else {
        imports.push(singleLineImport);
      }
    }

    // Generate module names for registry
    const moduleEntries = aliasedModules
      .map(
        (m) =>
          `  ${m.moduleName}: { env: ${m.localEnvName}, schema: ${m.localSchemaName} },`,
      )
      .join("\n");

    // Generate schema merge chain for client - check full single line length first
    const singleLineClientChain = aliasedModules
      .map((m, i) =>
        i === 0 ? `${m.localSchemaName}` : `.merge(${m.localSchemaName})`,
      )
      .join("");
    const fullClientDeclaration = `export const envClientSchema = ${singleLineClientChain}`;

    let schemaChain: string;
    if (fullClientDeclaration.length > 80 && aliasedModules.length > 1) {
      // Use multiline format with arguments on separate lines
      schemaChain = aliasedModules
        .map((m, i) =>
          i === 0
            ? `${m.localSchemaName}`
            : `.merge(\n  ${m.localSchemaName},\n)`,
        )
        .join("");
    } else {
      schemaChain = singleLineClientChain;
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import { validateEnv } from "next-vibe/shared/utils/env-util";
import type { z } from "zod";

import { envValidationLogger } from "@/app/api/[locale]/system/unified-interface/shared/env/validation-logger";

// Import client env modules
${imports.join("\n")}

// Platform detection (will be set at runtime)
const isServer = typeof window === "undefined";
const isReactNative = false;
const isBrowser =
  !isServer && typeof window !== "undefined" && !!window.document;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Module registry for introspection
export const envClientModules = {
${moduleEntries}
} as const;

// Export platform for external use
export { platform };

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
 * Validated client environment variables (singleton)
 */
export const envClient: EnvClient = validateAllClientEnv();

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
   * Client module definitions take priority over server ones for shared keys
   * (e.g. NEXT_PUBLIC_* vars are owned by the client module).
   * Returns both the file content and the ordered list of emitted keys.
   */
  private async generateEnvExampleContent(
    modules: EnvFileInfo[],
  ): Promise<{ content: string; keys: string[] }> {
    const lines: string[] = [
      "# ============================================================================",
      "# AUTO-GENERATED FILE - DO NOT EDIT MANUALLY",
      "# Generated by: vibe generate",
      "# This file is auto-generated from environment module definitions.",
      "# ============================================================================",
      "",
    ];

    // Pass 1: build a map of key -> owning module (client wins over server)
    interface KeyOwner {
      example: string;
      comment?: string;
      isClient: boolean;
    }
    const keyOwner = new Map<string, KeyOwner>();

    for (const mod of modules) {
      const moduleImport = await import(mod.filePath);
      const examples = moduleImport[mod.examplesExportName] as Array<{
        key: string;
        example: string;
        comment?: string;
      }>;
      if (!examples) {
        continue;
      }

      for (const entry of examples) {
        const existing = keyOwner.get(entry.key);
        // Client definition beats server; otherwise first seen wins
        if (!existing || (!existing.isClient && mod.isClient)) {
          keyOwner.set(entry.key, {
            example: entry.example,
            comment: entry.comment,
            isClient: mod.isClient,
          });
        }
      }
    }

    // Pass 2: render in module order, skipping keys already emitted
    const emittedKeys = new Set<string>();

    for (const mod of modules) {
      const moduleImport = await import(mod.filePath);
      const examples = moduleImport[mod.examplesExportName] as Array<{
        key: string;
        example: string;
        comment?: string;
      }>;
      if (!examples) {
        continue;
      }

      // Only include keys whose preferred owner is this module
      const ownedEntries = examples.filter((entry) => {
        if (emittedKeys.has(entry.key)) {
          return false;
        }
        const owner = keyOwner.get(entry.key);
        return owner?.isClient === mod.isClient;
      });

      if (ownedEntries.length === 0) {
        continue;
      }

      const relativeSourcePath = mod.filePath
        .replace(process.cwd(), "")
        .replace(/^\//, "");
      lines.push(`# Source: ${relativeSourcePath}`);
      lines.push(`# ${mod.moduleName}`);

      for (const entry of ownedEntries) {
        const owner = keyOwner.get(entry.key);
        if (owner?.comment) {
          lines.push(`# ${owner.comment}`);
        }
        lines.push(`${entry.key}="${owner?.example ?? entry.example}"`);
        emittedKeys.add(entry.key);
      }

      lines.push("");
    }

    return { content: lines.join("\n"), keys: [...emittedKeys] };
  }

  /**
   * Update Dockerfile ARG and ENV blocks with current env keys.
   * Replaces the region between sentinel comments.
   */
  private async updateDockerfile(
    dockerfilePath: string,
    keys: string[],
  ): Promise<void> {
    const { readFileSync } = await import("node:fs");
    const START = "# BEGIN_GENERATED_ENV_ARGS";
    const END = "# END_GENERATED_ENV_ARGS";

    const argLines = keys.map((k) => `ARG ${k}`).join("\n");
    const envLines = keys.map((k) => `ENV ${k}=$${k}`).join("\n");
    const generated = `${START}\n${argLines}\n\n${envLines}\n${END}`;

    const original = readFileSync(dockerfilePath, "utf8");

    let updated: string;
    if (original.includes(START)) {
      updated = original.replace(
        new RegExp(`${START}[\\s\\S]*?${END}`),
        generated,
      );
    } else {
      // Insert before COPY . .
      updated = original.replace("COPY . .", `${generated}\n\nCOPY . .`);
    }

    await writeGeneratedFile(dockerfilePath, updated, false);
  }

  /**
   * Update docker-compose.prod.yml build args block with current env keys.
   * Replaces the region between sentinel comments.
   */
  private async updateDockerCompose(
    composePath: string,
    keys: string[],
  ): Promise<void> {
    const { readFileSync } = await import("node:fs");
    const START = "# BEGIN_GENERATED_ENV_ARGS";
    const END = "# END_GENERATED_ENV_ARGS";
    const INDENT = "        ";

    const argLines = keys.map((k) => `${INDENT}${k}: \${${k}}`).join("\n");
    const generated = `${INDENT}${START}\n${argLines}\n${INDENT}${END}`;

    const original = readFileSync(composePath, "utf8");

    let updated: string;
    if (original.includes(START)) {
      updated = original.replace(
        new RegExp(`${INDENT}${START}[\\s\\S]*?${INDENT}${END}`),
        generated,
      );
    } else {
      // Insert inside args: block — after "args:" line
      updated = original.replace(/( +args:\n)/, `$1${generated}\n`);
    }

    await writeGeneratedFile(composePath, updated, false);
  }
}

export const envGeneratorRepository = new EnvGeneratorRepositoryImpl();
