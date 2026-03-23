/**
 * Prompt Fragments Generator Repository
 *
 * Scans for system-prompt/prompt.ts files across all modules,
 * extracts fragment IDs by importing each file, then generates
 * three output files:
 *   generated/prompt-fragments.ts        - isomorphic, fragment IDs + getPromptFragment()
 *   generated/prompt-fragments-server.ts - server-only, getServerLoader()
 *   generated/prompt-fragments-client.ts - client-side, static named imports of hooks + fragments
 *
 * Each module that participates in the system prompt owns three files:
 *   module/system-prompt/prompt.ts   - isomorphic fragment definition (build fn + data type)
 *   module/system-prompt/server.ts   - server-only data loader
 *   module/system-prompt/client.ts   - React hook returning same data shape
 */

import "server-only";

import { existsSync, readFileSync } from "node:fs";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsPromptFragmentsT } from "./i18n";

interface PromptFragmentsRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface PromptFragmentsResponseType {
  success: boolean;
  message: string;
  fragmentsFound: number;
  duration: number;
  outputFile?: string;
}

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

/** Erased fragment type used only for runtime scanning - data type is not needed here */
type AnyFragment = SystemPromptFragment<never>;

/** Dynamically imported prompt.ts module shape */
interface PromptModule {
  [key: string]: AnyFragment | string | undefined;
}

/** Fragment entry discovered from scanning */
interface FragmentEntry {
  /** Fragment ID as declared in the prompt.ts file */
  id: string;
  /** Fragment placement: "leading" (static system prompt) or "trailing" (dynamic per-turn message) */
  placement: "leading" | "trailing";
  /** Absolute @/ import path to the prompt.ts module */
  promptImportPath: string;
  /** All export names of fragment consts from this prompt.ts (for the import statement) */
  fragmentExportNames: string[];
  /** The specific export name for THIS fragment ID, e.g. "memoriesFragment" */
  ownExportName: string;
  /** Absolute @/ import path to the server.ts module (null if file doesn't exist) */
  serverImportPath: string | null;
  /** Export name of the server loader function, e.g. "loadMemoriesData" */
  serverLoaderExportName: string | null;
  /** Absolute @/ import path to the client.ts module (null if file doesn't exist) */
  clientImportPath: string | null;
  /** Export name of the hook function in client.ts, e.g. "useMemoriesData" */
  hookExportName: string | null;
}

export class PromptFragmentsGeneratorRepository {
  static async generatePromptFragments(
    data: PromptFragmentsRequestType,
    logger: EndpointLogger,
    t: GeneratorsPromptFragmentsT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<PromptFragmentsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting prompt fragments generation: ${outputFile}`);

      // ── 1. Discover prompt.ts files ──────────────────────────────────────
      let promptFiles: string[];

      if (liveIndex?.promptFragmentFiles) {
        logger.debug("Using live index for prompt fragment file discovery");
        promptFiles = [...liveIndex.promptFragmentFiles];
      } else {
        // Use template string to prevent Turbopack from statically tracing paths
        const startDir = `${process.cwd()}/src/app/api/[locale]`;
        logger.debug("Discovering system-prompt/prompt.ts files");
        promptFiles = findFilesRecursively(startDir, "prompt.ts").filter((f) =>
          f.includes("/system-prompt/"),
        );
      }

      logger.debug(`Found ${promptFiles.length} prompt fragment files`);

      // ── 2. Extract fragment data from each prompt.ts ──────────────────────
      const fragments =
        await PromptFragmentsGeneratorRepository.extractFragments(
          promptFiles,
          logger,
        );

      logger.debug(
        `Extracted ${fragments.length} fragment IDs: ${fragments.map((f) => f.id).join(", ")}`,
      );

      // ── 3. Generate file content ─────────────────────────────────────────
      const content =
        PromptFragmentsGeneratorRepository.generateContent(fragments);
      const serverOutputFile = outputFile.replace(
        /prompt-fragments\.ts$/,
        "prompt-fragments-server.ts",
      );
      const serverContent =
        PromptFragmentsGeneratorRepository.generateServerContent(fragments);
      const clientOutputFile = outputFile.replace(
        /prompt-fragments\.ts$/,
        "prompt-fragments-client.ts",
      );
      const clientContent =
        PromptFragmentsGeneratorRepository.generateClientContent(fragments);

      // ── 4. Write generated files ──────────────────────────────────────────
      await Promise.all([
        writeGeneratedFile(outputFile, content, data.dryRun),
        writeGeneratedFile(serverOutputFile, serverContent, data.dryRun),
        writeGeneratedFile(clientOutputFile, clientContent, data.dryRun),
      ]);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated prompt fragments index with ${formatCount(fragments.length, "fragment")} in ${formatDuration(duration)}`,
          "🧩",
        ),
      );

      return success({
        success: true,
        message: t("post.success.title"),
        fragmentsFound: fragments.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Prompt fragments generation failed", {
        error: parseError(error),
        duration,
      });
      return fail({
        message: t("post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
          duration,
        },
      });
    }
  }

  /** Convert kebab-case fragment ID to camelCase variable name, e.g. "user-name" → "userName" */
  private static toCamel(id: string): string {
    return id.replace(/-([a-z])/g, (m) => m[1].toUpperCase());
  }

  /**
   * Import each prompt.ts file and extract the fragment ID(s) it exports.
   * Also reads client.ts (text-based) to find the hook export name.
   */
  private static async extractFragments(
    promptFiles: string[],
    logger: EndpointLogger,
  ): Promise<FragmentEntry[]> {
    // Group: one entry per unique prompt file (may export multiple fragments)
    const entriesByFile = new Map<string, FragmentEntry>();

    for (const promptFile of promptFiles) {
      try {
        // Dynamically import the prompt.ts to read its exports
        const mod = (await import(promptFile)) as PromptModule;

        // Collect all exported fragment consts + their IDs, preserving id→exportName mapping
        const fragmentExportNames: string[] = [];
        const idToExportName = new Map<string, string>();

        for (const [exportName, exported] of Object.entries(mod)) {
          if (
            exported !== null &&
            typeof exported === "object" &&
            "id" in exported &&
            "placement" in exported &&
            "build" in exported &&
            typeof exported.id === "string" &&
            (exported.placement === "leading" ||
              exported.placement === "trailing")
          ) {
            const fragment = exported as AnyFragment;
            fragmentExportNames.push(exportName);
            idToExportName.set(fragment.id, exportName);
          }
        }

        if (fragmentExportNames.length === 0) {
          logger.warn(
            `No SystemPromptFragment exports found in ${promptFile} - skipping`,
          );
          continue;
        }

        // Build @/ import paths, check file existence for server/client
        const promptImportPath =
          PromptFragmentsGeneratorRepository.toAbsoluteImportPath(promptFile);
        const serverFile = promptFile.replace(/\/prompt\.ts$/, "/server.ts");
        const clientFile = promptFile.replace(/\/prompt\.ts$/, "/client.ts");
        const serverImportPath = existsSync(serverFile)
          ? promptImportPath.replace(/\/prompt$/, "/server")
          : null;
        const clientImportPath = existsSync(clientFile)
          ? promptImportPath.replace(/\/prompt$/, "/client")
          : null;

        // Extract hook name from client.ts via text-based regex
        const hookExportName = clientImportPath
          ? PromptFragmentsGeneratorRepository.extractHookName(
              clientFile,
              logger,
            )
          : null;

        // Extract server loader function name from server.ts via text-based regex
        const serverLoaderExportName = serverImportPath
          ? PromptFragmentsGeneratorRepository.extractServerLoaderName(
              serverFile,
              logger,
            )
          : null;

        // One entry per fragment ID - each knows its own export name and placement
        for (const [id, ownExportName] of idToExportName) {
          // Get the placement from the actual fragment object
          const fragment = mod[ownExportName] as AnyFragment | undefined;
          const placement = fragment?.placement ?? "trailing";
          const entry: FragmentEntry = {
            id,
            placement,
            promptImportPath,
            fragmentExportNames,
            ownExportName,
            serverImportPath,
            serverLoaderExportName,
            clientImportPath,
            hookExportName,
          };
          entriesByFile.set(`${promptFile}::${id}`, entry);
        }
      } catch (error) {
        logger.warn(
          `Could not import prompt fragment file ${promptFile}: ${parseError(error).message}`,
        );
      }
    }

    // Sort by fragment ID for stable output
    return [...entriesByFile.values()].toSorted((a, b) =>
      a.id.localeCompare(b.id),
    );
  }

  /**
   * Extract the exported hook function name from a client.ts file using regex.
   * Looks for: export function useXxx or export const useXxx
   */
  private static extractHookName(
    clientFile: string,
    logger: EndpointLogger,
  ): string | null {
    try {
      const content = readFileSync(clientFile, "utf-8");
      const match = /export\s+(?:function|const)\s+(use\w+)/.exec(content);
      if (match) {
        return match[1];
      }
      logger.warn(`Could not find hook export in ${clientFile}`);
      return null;
    } catch {
      logger.warn(`Could not read client file ${clientFile}`);
      return null;
    }
  }

  /**
   * Extract the exported server loader function name from a server.ts file using regex.
   * Looks for: export async function loadXxx or export function loadXxx
   */
  private static extractServerLoaderName(
    serverFile: string,
    logger: EndpointLogger,
  ): string | null {
    try {
      const content = readFileSync(serverFile, "utf-8");
      const match = /export\s+(?:async\s+)?function\s+(load\w+)/.exec(content);
      if (match) {
        return match[1];
      }
      logger.warn(`Could not find loader export in ${serverFile}`);
      return null;
    } catch {
      logger.warn(`Could not read server file ${serverFile}`);
      return null;
    }
  }

  /**
   * Convert an absolute filesystem path to an @/ import path.
   * e.g. /home/.../src/app/api/[locale]/agent/chat/memories/system-prompt/prompt.ts
   *   → @/app/api/[locale]/agent/chat/memories/system-prompt/prompt
   */
  private static toAbsoluteImportPath(absPath: string): string {
    const srcIndex = absPath.indexOf("/src/");
    if (srcIndex === -1) {
      return absPath.replace(/\.ts$/, "");
    }
    return `@${absPath.slice(srcIndex + 4).replace(/\.ts$/, "")}`;
  }

  /**
   * Generate prompt-fragments-client.ts - combined hook that calls all fragment
   * client hooks with a single standard params object.
   *
   * Exports:
   *   useAllPromptFragmentsData(params) - calls every hook, returns Record<fragmentId, data>
   *   + re-exports all fragment objects (for use in hook.ts without individual imports)
   */
  private static generateClientContent(fragments: FragmentEntry[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED PROMPT FRAGMENTS CLIENT INDEX",
      "generators/prompt-fragments",
      {
        "Fragments found": fragments.length,
        "Fragment IDs": fragments.map((f) => f.id).join(", "),
      },
    );

    // Deduplicate by promptImportPath for fragment object imports
    const seenPrompt = new Set<string>();
    // Track client.ts deduplicated hook calls (one call per unique client file)
    // clientImportPath → { dataVar, hookName }
    const seenClient = new Map<string, { dataVar: string; hookName: string }>();

    const fragmentImports: string[] = [];
    const hookImports: string[] = [];
    const fragmentExportNames: string[] = [];
    const hookExportNames: string[] = [];

    // Unique hook invocations in the combined hook body
    const hookCallLines: string[] = [];
    // Map of fragmentId → dataVar (for the return object)
    const dataEntries: string[] = [];

    for (const f of fragments) {
      if (!seenPrompt.has(f.promptImportPath)) {
        seenPrompt.add(f.promptImportPath);
        const names = f.fragmentExportNames.join(", ");
        fragmentImports.push(
          `import { ${names} } from "${f.promptImportPath}";`,
        );
        for (const name of f.fragmentExportNames) {
          fragmentExportNames.push(name);
        }
      }
      if (f.clientImportPath && f.hookExportName) {
        let entry = seenClient.get(f.clientImportPath);
        if (!entry) {
          // camelCase data var from hook name: "useUserNameData" → "userNameData"
          const raw = f.hookExportName.replace(/^use/, "");
          const dataVar = raw.charAt(0).toLowerCase() + raw.slice(1);
          entry = { dataVar, hookName: f.hookExportName };
          seenClient.set(f.clientImportPath, entry);
          hookImports.push(
            `import { ${f.hookExportName} } from "${f.clientImportPath}";`,
          );
          hookCallLines.push(
            `  const ${dataVar} = ${f.hookExportName}(params);`,
          );
          hookExportNames.push(f.hookExportName);
        }
        dataEntries.push(`    "${f.id}": ${entry.dataVar},`);
      }
    }

    // For each fragment with a hook: generate a build call using the strongly-typed
    // fragment object + data from the hook. This avoids any type erasure.
    // Only fragments with client hooks can be built on the client side.
    const buildLines: string[] = [];
    const builtEntries: string[] = [];
    const seenBuilt = new Set<string>();

    for (const f of fragments) {
      if (f.clientImportPath && f.hookExportName) {
        const entry = seenClient.get(f.clientImportPath);
        if (!entry) {
          continue;
        }
        if (!seenBuilt.has(f.id)) {
          seenBuilt.add(f.id);
          const camelId = PromptFragmentsGeneratorRepository.toCamel(f.id);
          buildLines.push(
            `  const ${camelId}Built = ${f.ownExportName}.condition && !${f.ownExportName}.condition(${entry.dataVar}) ? null : ${f.ownExportName}.build(${entry.dataVar});`,
          );
          builtEntries.push(`    "${f.id}": ${camelId}Built,`);
        }
      }
    }

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

"use client";

import type { SystemPromptClientParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

// Fragment objects - from each module's system-prompt/prompt.ts
${fragmentImports.join("\n")}

// Client hooks - from each module's system-prompt/client.ts
${hookImports.join("\n")}

/**
 * Combined hook - calls every fragment's client hook, builds strings, returns results.
 * Returns leading/trailing arrays (sorted by priority) plus a byId map of built strings.
 * All hooks called unconditionally (React rules of hooks).
 */
export function useAllPromptFragments(
  params: SystemPromptClientParams,
): {
  leading: Array<{ id: string; priority: number; str: string }>;
  trailing: Array<{ id: string; priority: number; str: string }>;
  byId: Record<string, string | null>;
} {
${hookCallLines.join("\n")}
${buildLines.join("\n")}
  const byId: Record<string, string | null> = {
${builtEntries.join("\n")}
  };
  const leading: Array<{ id: string; priority: number; str: string }> = [];
  const trailing: Array<{ id: string; priority: number; str: string }> = [];
${fragments
  .filter((f) => f.clientImportPath)
  .map((f) => {
    const camel = PromptFragmentsGeneratorRepository.toCamel(f.id);
    return `  if (${camel}Built) { ${f.placement === "leading" ? "leading" : "trailing"}.push({ id: "${f.id}", priority: ${f.ownExportName}.priority, str: ${camel}Built }); }`;
  })
  .join("\n")}
  leading.sort((a, b) => a.priority - b.priority);
  trailing.sort((a, b) => a.priority - b.priority);
  return { leading, trailing, byId };
}
`;
  }

  /**
   * Generate prompt-fragments.ts - isomorphic index with fragment IDs and getPromptFragment.
   * No server-only or client-only dependencies.
   */
  private static generateContent(fragments: FragmentEntry[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED PROMPT FRAGMENTS INDEX",
      "generators/prompt-fragments",
      {
        "Fragments found": fragments.length,
        "Fragment IDs": fragments.map((f) => f.id).join(", "),
      },
    );

    // Each fragment ID gets its own case (multiple IDs may point to the same file - that's fine)
    const allPromptCases = fragments.map(
      (f) =>
        `    case "${f.id}":\n      return import("${f.promptImportPath}") as Promise<Record<string, unknown>>;`,
    );

    // Fragment IDs list
    const fragmentIdList = fragments.map((f) => `  "${f.id}",`).join("\n");

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

/**
 * All registered prompt fragment IDs.
 * Auto-generated - do not edit manually.
 */
export const PROMPT_FRAGMENT_IDS = [
${fragmentIdList}
] as const;

export type PromptFragmentId = (typeof PROMPT_FRAGMENT_IDS)[number];

/**
 * Dynamically import a prompt fragment module by ID.
 * Returns the module with the fragment export(s) from its prompt.ts.
 */
export async function getPromptFragment(
  id: PromptFragmentId,
): Promise<Record<string, unknown>> {
  switch (id) {
${allPromptCases.join("\n")}
    default:
      return {};
  }
}
`;
  }

  /**
   * Generate prompt-fragments-server.ts - server-only combined loader.
   * Exports loadAllPromptFragments(params) that loads all fragment data in parallel
   * and builds leading/trailing arrays - mirrors useAllPromptFragments on the client.
   */
  private static generateServerContent(fragments: FragmentEntry[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED PROMPT FRAGMENTS SERVER INDEX",
      "generators/prompt-fragments",
      {
        "Fragments found": fragments.length,
        "Fragment IDs": fragments.map((f) => f.id).join(", "),
      },
    );

    // Unique server imports: serverImportPath → { loaderName, dataVar }
    const seenServer = new Map<
      string,
      { loaderName: string; dataVar: string }
    >();
    // Fragment imports (prompt.ts) - deduplicated
    const seenPrompt = new Set<string>();

    const serverImports: string[] = [];
    const fragmentImports: string[] = [];

    for (const f of fragments) {
      if (!seenPrompt.has(f.promptImportPath)) {
        seenPrompt.add(f.promptImportPath);
        fragmentImports.push(
          `import { ${f.fragmentExportNames.join(", ")} } from "${f.promptImportPath}";`,
        );
      }
      if (f.serverImportPath && f.serverLoaderExportName) {
        if (!seenServer.has(f.serverImportPath)) {
          const raw = f.serverLoaderExportName.replace(/^load/, "");
          const dataVar = raw.charAt(0).toLowerCase() + raw.slice(1);
          seenServer.set(f.serverImportPath, {
            loaderName: f.serverLoaderExportName,
            dataVar,
          });
          serverImports.push(
            `import { ${f.serverLoaderExportName} } from "${f.serverImportPath}";`,
          );
        }
      }
    }

    // Generate parallel load calls - deduplicated by server path
    const loaderCalls: string[] = [];
    const loaderVarNames: string[] = [];
    for (const [, { loaderName, dataVar }] of seenServer) {
      loaderVarNames.push(dataVar);
      loaderCalls.push(`    ${loaderName}(params),`);
    }

    const destructure =
      loaderVarNames.length > 0
        ? `  const [${loaderVarNames.map((v) => `${v}Result`).join(", ")}] = await Promise.allSettled([\n${loaderCalls.join("\n")}\n  ]);`
        : "";

    // Resolve each data var from its Promise.allSettled result
    const resolveLines: string[] = [];
    for (const [, { dataVar }] of seenServer) {
      resolveLines.push(
        `  const ${dataVar} = ${dataVar}Result.status === "fulfilled" ? ${dataVar}Result.value : undefined;`,
      );
    }

    // Build lines for each fragment that has a server loader
    const buildLines: string[] = [];
    const builtEntries: string[] = [];
    const seenBuilt = new Set<string>();

    for (const f of fragments) {
      if (f.serverImportPath && f.serverLoaderExportName) {
        const entry = seenServer.get(f.serverImportPath);
        if (!entry || seenBuilt.has(f.id)) {
          continue;
        }
        seenBuilt.add(f.id);
        const camel = PromptFragmentsGeneratorRepository.toCamel(f.id);
        buildLines.push(
          `  const ${camel}Built = ${entry.dataVar} && (${f.ownExportName}.condition ? ${f.ownExportName}.condition(${entry.dataVar}) : true) ? ${f.ownExportName}.build(${entry.dataVar}) : null;`,
        );
        builtEntries.push(`    "${f.id}": ${camel}Built,`);
      }
    }

    const pushLines = fragments
      .filter((f) => f.serverImportPath)
      .map((f) => {
        const camel = PromptFragmentsGeneratorRepository.toCamel(f.id);
        return `  if (${camel}Built) { ${f.placement}.push({ id: "${f.id}", priority: ${f.ownExportName}.priority, str: ${camel}Built }); }`;
      })
      .join("\n");

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

// Fragment objects - from each module's system-prompt/prompt.ts
${fragmentImports.join("\n")}

// Server loaders - from each module's system-prompt/server.ts
${serverImports.join("\n")}

/**
 * Combined server loader - loads all fragment data in parallel, builds strings, returns results.
 * Returns leading/trailing arrays (sorted by priority) plus a byId map of built strings.
 * Mirror of useAllPromptFragments on the client.
 */
export async function loadAllPromptFragments(
  params: SystemPromptServerParams,
): Promise<{
  leading: Array<{ id: string; priority: number; str: string }>;
  trailing: Array<{ id: string; priority: number; str: string }>;
  byId: Record<string, string | null>;
}> {
${destructure}
${resolveLines.join("\n")}
${buildLines.join("\n")}
  const byId: Record<string, string | null> = {
${builtEntries.join("\n")}
  };
  const leading: Array<{ id: string; priority: number; str: string }> = [];
  const trailing: Array<{ id: string; priority: number; str: string }> = [];
${pushLines}
  leading.sort((a, b) => a.priority - b.priority);
  trailing.sort((a, b) => a.priority - b.priority);
  return { leading, trailing, byId };
}
`;
  }
}
