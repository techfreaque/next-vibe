/**
 * Env Generator Repository
 * Handles environment configuration generation
 */

import "server-only";

import { dirname, join } from "node:path";

import type { EnvExample, EnvFieldType } from "next-vibe/env/define-env";
import { formatCount, formatWarning } from "next-vibe/logger/formatters";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";
import {
  generateFileHeader as sharedGenerateFileHeader,
  jsonToTs,
  stripProjectRoot,
} from "next-vibe/tooling/generators/shared/utils";

import type { EnvValidationErrorType } from "./generator-validator";

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
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "next-vibe/tooling/generators/shared/utils";

import {
  checkDuplicateModuleNames,
  formatValidationErrors,
  validateEnvFileExports,
} from "./generator-validator";

const OUTPUT_DIR = "src/generated";

/** A validated env module — enough for env-keys to import its examples from source. */
interface ValidatedEnvModule {
  filePath: string;
  moduleName: string;
  examplesExportName: string;
}

class EnvGeneratorRepository {
  static async generateEnv(ctx: GeneratorContext): Promise<{
    serverEnvFiles: number;
    clientEnvFiles: number;
    modules: ValidatedEnvModule[];
  }> {
    const { logger } = ctx;
    const data = { outputDir: OUTPUT_DIR, verbose: false, dryRun: false };

    {
      logger.debug(`Starting env generation: ${data.outputDir}`);

      const apiDir = `${process.cwd()}/src/app/api/[locale]`;
      const configDir = `${process.cwd()}/src/config`;

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
      const serverOutputPath = join(data.outputDir, "env", "index.ts");
      const serverEnvFilePaths = [
        ...findFilesRecursively(apiDir, "env.ts", excludeDirs),
        ...findFilesRecursively(configDir, "env.ts", excludeDirs),
      ].filter((filePath) => {
        // Exclude the generated output file itself
        return filePath !== join(process.cwd(), serverOutputPath);
      });

      // Discover client env files (from API directory and config directory)
      logger.debug("Discovering client env files");
      const clientOutputPath = join(data.outputDir, "env", "client.ts");
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
          const outputFile = join(
            process.cwd(),
            data.outputDir,
            "env",
            "index.ts",
          );
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

      // If no valid modules at all, nothing to write.
      if (validServerModules.length === 0 && validClientModules.length === 0) {
        logger.error("No valid env files found");
        return { serverEnvFiles: 0, clientEnvFiles: 0, modules: [] };
      }

      // Generate output files
      const envExamplePath = ".env.example";

      if (!data.dryRun) {
        // Generate server env file
        const serverContent = EnvGeneratorRepository.generateServerEnvContent(
          validServerModules,
          join(process.cwd(), serverOutputPath),
        );
        await writeGeneratedFile(
          join(process.cwd(), serverOutputPath),
          serverContent,
          false,
        );

        // Generate client env file
        const clientContent = EnvGeneratorRepository.generateClientEnvContent(
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
          await EnvGeneratorRepository.generateEnvExampleContent(allModules);
        await writeGeneratedFile(
          join(process.cwd(), envExamplePath),
          envExampleContent,
          false,
        );

        // Update Dockerfile and docker-compose.prod.yml with the same key list
        // Skip gracefully if files don't exist (e.g. inside Docker build context)
        const { existsSync } = await import("node:fs");
        const dockerfilePath = join(process.cwd(), "Dockerfile");
        const dockerComposePath = join(
          process.cwd(),
          "docker-compose.prod.yml",
        );
        if (existsSync(dockerfilePath)) {
          await EnvGeneratorRepository.updateDockerfile(
            dockerfilePath,
            envKeys,
          );
        }
        if (existsSync(dockerComposePath)) {
          await EnvGeneratorRepository.updateDockerCompose(
            dockerComposePath,
            envKeys,
          );
        }
      }

      return {
        serverEnvFiles: validServerModules.length,
        clientEnvFiles: validClientModules.length,
        modules: [...validServerModules, ...validClientModules].map((m) => ({
          filePath: m.filePath,
          moduleName: m.moduleName,
          examplesExportName: m.examplesExportName,
        })),
      };
    }
  }

  /**
   * Generate server env file content
   */
  private static generateServerEnvContent(
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
      const examplesNeedsAlias =
        RESERVED.has(m.examplesExportName) ||
        sortedModules.some(
          (other) =>
            other !== m && other.examplesExportName === m.examplesExportName,
        );
      const examplesPrefix = examplesNeedsAlias ? `${m.moduleName}_` : "";
      return {
        ...m,
        importedEnvName: needsAlias
          ? `${m.exportName} as ${prefix}${m.exportName}`
          : m.exportName,
        importedSchemaName: needsAlias
          ? `${m.schemaExportName} as ${prefix}${m.schemaExportName}`
          : m.schemaExportName,
        importedExamplesName: examplesNeedsAlias
          ? `${m.examplesExportName} as ${examplesPrefix}${m.examplesExportName}`
          : m.examplesExportName,
        localEnvName: `${prefix}${m.exportName}`,
        localSchemaName: `${prefix}${m.schemaExportName}`,
        localExamplesName: `${examplesPrefix}${m.examplesExportName}`,
      };
    });

    // Generate imports (including examples)
    const imports: string[] = [];
    for (const mod of aliasedModules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      const importNames = [
        mod.importedEnvName,
        mod.importedSchemaName,
        mod.importedExamplesName,
      ].toSorted((a, b) => a.localeCompare(b));
      const singleLineImport = `import { ${importNames.join(", ")} } from "${relativePath}";`;
      if (singleLineImport.length > 80) {
        imports.push(
          `import {\n  ${importNames.join(",\n  ")},\n} from "${relativePath}";`,
        );
      } else {
        imports.push(singleLineImport);
      }
    }

    // Generate module names for registry (including examples)
    const moduleEntries = aliasedModules
      .map((m) => {
        const singleLine = `  ${m.moduleName}: { env: ${m.localEnvName}, schema: ${m.localSchemaName}, examples: ${m.localExamplesName} },`;
        if (singleLine.length <= 80) {
          return singleLine;
        }
        return `  ${m.moduleName}: {\n    env: ${m.localEnvName},\n    schema: ${m.localSchemaName},\n    examples: ${m.localExamplesName},\n  },`;
      })
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

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { EnvExample, EnvRecord } from "next-vibe/env/define-env";
import { envValidationLogger } from "next-vibe/env/env-logger";
import { validateEnv } from "next-vibe/env/env-util";
import type { z } from "zod";

// Import env modules
${imports.join("\n")}

// Platform detection
const platform = {
  isServer: true,
  isReactNative: false,
  isBrowser: false,
};

// Module registry for introspection
export const envModules: Record<
  string,
  {
    env: EnvRecord;
    schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
    examples: EnvExample[];
  }
> = {
${moduleEntries}
};

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
    defaultLocale,
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
  private static generateClientEnvContent(
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
      const examplesNeedsAlias =
        RESERVED.has(m.examplesExportName) ||
        sortedModules.some(
          (other) =>
            other !== m && other.examplesExportName === m.examplesExportName,
        );
      const examplesPrefix = examplesNeedsAlias ? `${m.moduleName}_` : "";
      return {
        ...m,
        importedEnvName: needsAlias
          ? `${m.exportName} as ${prefix}${m.exportName}`
          : m.exportName,
        importedSchemaName: needsAlias
          ? `${m.schemaExportName} as ${prefix}${m.schemaExportName}`
          : m.schemaExportName,
        importedExamplesName: examplesNeedsAlias
          ? `${m.examplesExportName} as ${examplesPrefix}${m.examplesExportName}`
          : m.examplesExportName,
        localEnvName: `${prefix}${m.exportName}`,
        localSchemaName: `${prefix}${m.schemaExportName}`,
        localExamplesName: `${examplesPrefix}${m.examplesExportName}`,
      };
    });

    // Generate imports (including examples)
    const imports: string[] = [];
    for (const mod of aliasedModules) {
      const relativePath = getRelativeImportPath(mod.filePath, outputFile);
      const importNames = [
        mod.importedEnvName,
        mod.importedSchemaName,
        mod.importedExamplesName,
      ].toSorted((a, b) => a.localeCompare(b));
      const singleLineImport = `import { ${importNames.join(", ")} } from "${relativePath}";`;
      if (singleLineImport.length > 80) {
        imports.push(
          `import {\n  ${importNames.join(",\n  ")},\n} from "${relativePath}";`,
        );
      } else {
        imports.push(singleLineImport);
      }
    }

    // Generate module names for registry (including examples)
    const moduleEntries = aliasedModules
      .map((m) => {
        const singleLine = `  ${m.moduleName}: { env: ${m.localEnvName}, schema: ${m.localSchemaName}, examples: ${m.localExamplesName} },`;
        if (singleLine.length <= 80) {
          return singleLine;
        }
        return `  ${m.moduleName}: {\n    env: ${m.localEnvName},\n    schema: ${m.localSchemaName},\n    examples: ${m.localExamplesName},\n  },`;
      })
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
      // Use multiline chained format: schema\n  .merge(next)\n  .merge(next2)
      schemaChain = aliasedModules
        .map((m, i) =>
          i === 0 ? `${m.localSchemaName}` : `\n  .merge(${m.localSchemaName})`,
        )
        .join("");
    } else {
      schemaChain = singleLineClientChain;
    }

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { envValidationLogger } from "next-vibe/env/env-logger";
import { validateEnv } from "next-vibe/env/env-util";
import type { z } from "zod";

// Import client env modules
${imports.join("\n")}

// Platform detection (will be set at runtime)
const isServer = typeof globalThis.document === "undefined";
const isReactNative = false;
const isBrowser = !isServer;

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
    defaultLocale,
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
  private static async generateEnvExampleContent(
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
    // Also collect ALL keys (including example: false) for Docker ARG/ENV generation
    interface KeyOwner {
      example: string;
      comment?: string;
      commented?: boolean;
      isClient: boolean;
    }
    const keyOwner = new Map<string, KeyOwner>();
    const allKeys = new Set<string>();

    for (const mod of modules) {
      const moduleImport = await import(mod.filePath);
      const examples = moduleImport[mod.examplesExportName] as Array<{
        key: string;
        example: string | false;
        comment?: string;
        commented?: boolean;
      }>;
      if (!examples) {
        continue;
      }

      for (const entry of examples) {
        allKeys.add(entry.key);
        // example: false means "exclude from .env.example" but still include in Docker
        if (entry.example === false) {
          continue;
        }
        const existing = keyOwner.get(entry.key);
        // Client definition beats server; otherwise first seen wins
        if (!existing || (!existing.isClient && mod.isClient)) {
          keyOwner.set(entry.key, {
            example: entry.example,
            comment: entry.comment,
            commented: entry.commented,
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
        example: string | false;
        comment?: string;
        commented?: boolean;
      }>;
      if (!examples) {
        continue;
      }

      // Only include keys whose preferred owner is this module
      const ownedEntries = examples.filter((entry) => {
        if (entry.example === false || emittedKeys.has(entry.key)) {
          return false;
        }
        const owner = keyOwner.get(entry.key);
        return owner?.isClient === mod.isClient;
      });

      if (ownedEntries.length === 0) {
        continue;
      }

      // Sort: active keys A-Z first, then commented keys A-Z
      const sortedEntries = [...ownedEntries].toSorted((a, b) => {
        const aCommented = keyOwner.get(a.key)?.commented ?? false;
        const bCommented = keyOwner.get(b.key)?.commented ?? false;
        if (aCommented !== bCommented) {
          return aCommented ? 1 : -1;
        }
        return a.key.localeCompare(b.key);
      });

      const relativeSourcePath = stripProjectRoot(mod.filePath);
      lines.push(`# Source: ${relativeSourcePath}`);

      for (const entry of sortedEntries) {
        const owner = keyOwner.get(entry.key);
        if (owner?.comment) {
          lines.push(`# ${owner.comment}`);
        }
        const line = `${entry.key}="${owner?.example ?? entry.example}"`;
        lines.push(owner?.commented ? `# ${line}` : line);
        emittedKeys.add(entry.key);
      }

      lines.push("");
    }

    return { content: lines.join("\n"), keys: [...allKeys] };
  }

  /**
   * Update Dockerfile ARG and ENV blocks with current env keys.
   * Replaces the region between sentinel comments.
   */
  private static async updateDockerfile(
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
  private static async updateDockerCompose(
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
      // Insert inside args: block - after "args:" line
      updated = original.replace(/( +args:\n)/, `$1${generated}\n`);
    }

    await writeGeneratedFile(composePath, updated, false);
  }
}

// ─── Env keys metadata (reads the generated env registry) ───────────────────

const ENV_KEYS_OUTPUT = "src/generated/env/keys.ts";

/** Serializable metadata for a single env key. */
export interface EnvKeyMeta {
  key: string;
  module: string;
  comment: string;
  example: string;
  sensitive: boolean;
  fieldType: EnvFieldType;
  options?: string[];
  onboardingRequired: boolean;
  onboardingStep?: number;
  onboardingGroup?: string;
  autoGenerate?: "hex32" | "hex64";
}

const ENV_KEYS_HIDDEN_MODULES = new Set(["serverSystem"]);
const ENV_KEYS_SENSITIVE_PATTERNS = [
  "_KEY",
  "_SECRET",
  "_PASS",
  "_TOKEN",
  "_SID",
  "_CREDENTIAL",
  "PASSWORD",
  "JWT_SECRET",
  "CRON_SECRET",
  "ACCESS_KEY",
  "AUTH_TOKEN",
  "DATABASE_URL",
];

function isSensitiveKey(key: string, explicitSensitive?: boolean): boolean {
  if (explicitSensitive !== undefined) {
    return explicitSensitive;
  }
  const upper = key.toUpperCase();
  return ENV_KEYS_SENSITIVE_PATTERNS.some((p) => upper.includes(p));
}

function generateEnvKeysContent(keys: EnvKeyMeta[]): string {
  const header = sharedGenerateFileHeader(
    "AUTO-GENERATED ENV KEYS METADATA",
    "generators/env-keys",
    { "Keys found": keys.length },
  );

  const keysTs = jsonToTs(keys, 0, 0);

  return `${header}

/* eslint-disable prettier/prettier */

/**
 * Serializable metadata for a single env key.
 * Imported by settings definition to build flat requestFields.
 * NOT server-only - safe to import in client context.
 */
export type EnvFieldType =
  | "text"
  | "boolean"
  | "number"
  | "select"
  | "url"
  | "email"
  | "log-path";

export interface EnvKeyMeta {
  key: string;
  module: string;
  comment: string;
  example: string;
  sensitive: boolean;
  fieldType: EnvFieldType;
  options?: string[];
  onboardingRequired: boolean;
  onboardingStep?: number;
  onboardingGroup?: string;
  autoGenerate?: "hex32" | "hex64";
}

/**
 * All configured env keys with their metadata.
 * Auto-generated - do not edit manually.
 */
export const ENV_KEYS = ${keysTs} as const satisfies readonly EnvKeyMeta[];

export type EnvKeyName = (typeof ENV_KEYS)[number]["key"];
`;
}

async function generateEnvKeys(
  ctx: GeneratorContext,
  modules: readonly ValidatedEnvModule[],
): Promise<number> {
  // Import each validated env module's `examples` export straight from SOURCE — not
  // from the just-written @/generated/env/index — so a single run always sees fresh
  // data (no ESM-cache staleness, no second pass).
  const moduleExamples = await Promise.all(
    modules.map(async (m) => {
      const mod = (await import(m.filePath)) as Record<string, EnvExample[]>;
      return {
        moduleName: m.moduleName,
        examples: mod[m.examplesExportName] ?? [],
      };
    }),
  );

  const keys: EnvKeyMeta[] = [];
  const seenKeys = new Set<string>();

  for (const { moduleName, examples } of moduleExamples) {
    if (ENV_KEYS_HIDDEN_MODULES.has(moduleName)) {
      continue;
    }
    for (const ex of examples) {
      if (seenKeys.has(ex.key)) {
        continue;
      }
      seenKeys.add(ex.key);
      keys.push({
        key: ex.key,
        module: moduleName,
        comment: ex.comment ?? "",
        example: ex.example === false ? "" : (ex.example ?? ""),
        sensitive: isSensitiveKey(ex.key, ex.sensitive),
        fieldType: ex.fieldType ?? "text",
        options: ex.options ? [...ex.options] : undefined,
        onboardingRequired: ex.onboardingRequired ?? false,
        onboardingStep: ex.onboardingStep,
        onboardingGroup: ex.onboardingGroup,
        autoGenerate: ex.autoGenerate,
      });
    }
  }

  await writeGeneratedFile(ENV_KEYS_OUTPUT, generateEnvKeysContent(keys));
  ctx.logger.debug(`Collected ${keys.length} env keys`);
  return keys.length;
}

/**
 * The single env-domain generator: builds the env registry (index + client +
 * .env.example + Docker), then the env-keys metadata (which reads the registry).
 */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const env = await EnvGeneratorRepository.generateEnv(ctx);
  const keyCount = await generateEnvKeys(ctx, env.modules);
  return {
    summary: `env (${env.serverEnvFiles} server, ${env.clientEnvFiles} client); env keys (${keyCount})`,
    counts: {
      serverModules: env.serverEnvFiles,
      clientModules: env.clientEnvFiles,
      envKeys: keyCount,
    },
  };
}
