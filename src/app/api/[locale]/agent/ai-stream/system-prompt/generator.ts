/**
 * Prompt Fragments Generator
 *
 * Scans for module/system-prompt.ts files, extracts fragment metadata via regex
 * (files have `server-only` so dynamic import is not possible), then generates:
 *   generated/prompt-fragments/index.ts  - isomorphic, fragment IDs + getPromptFragment()
 *   generated/prompt-fragments/server.ts - server-only, loadAllPromptFragments()
 */

import "server-only";

import { readFileSync } from "node:fs";

import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";
import {
  generateFileHeader,
  writeGeneratedFile,
} from "next-vibe/tooling/generators/shared/utils";

const OUTPUT_FILE = "src/generated/prompt-fragments/index.ts";

/** Fragment entry discovered from scanning */
interface FragmentEntry {
  /** Fragment ID as declared in the system-prompt.ts file */
  id: string;
  /** Fragment placement: "leading" (static system prompt) or "trailing" (dynamic per-turn message) */
  placement: "leading" | "trailing";
  /** Absolute @/ import path to the fragment module (system-prompt.ts) */
  promptImportPath: string;
  /** All export names of fragment consts from this file (for the import statement) */
  fragmentExportNames: string[];
  /** The specific export name for THIS fragment ID, e.g. "memoriesFragment" */
  ownExportName: string;
  /** Absolute @/ import path to the server loader module (same as promptImportPath). */
  serverImportPath: string | null;
  /** Export name of the server loader function, e.g. "loadMemoriesData" */
  serverLoaderExportName: string | null;
}

/**
 * Generate the prompt fragments index (isomorphic + server + client). Consumes the
 * shared promptFragment file list; writes three files. Byte-identical to the former
 * tooling/generators/prompt-fragments.
 */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const { logger } = ctx;
  const promptFiles = ctx.files.promptFragment;

  logger.debug(`Found ${promptFiles.length} prompt fragment files`);

  const fragments = await PromptFragmentsGenerator.extractFragments(
    promptFiles,
    logger,
  );

  const content = PromptFragmentsGenerator.generateContent(fragments);
  const serverOutputFile = OUTPUT_FILE.replace(/\/index\.ts$/, "/server.ts");
  const serverContent =
    PromptFragmentsGenerator.generateServerContent(fragments);

  await Promise.all([
    writeGeneratedFile(OUTPUT_FILE, content),
    writeGeneratedFile(serverOutputFile, serverContent),
  ]);

  return {
    summary: `prompt fragments (${fragments.length} fragments)`,
    counts: { fragments: fragments.length },
  };
}

class PromptFragmentsGenerator {
  /** Convert kebab-case fragment ID to camelCase variable name, e.g. "user-name" → "userName" */
  private static toCamel(id: string): string {
    return id.replace(/-([a-z])/g, (m) => m[1].toUpperCase());
  }

  /**
   * Extract fragment metadata from a flat system-prompt.ts file using regex.
   * Flat files have `import "server-only"` so they cannot be dynamically imported
   * in a Node context. We parse the text instead.
   *
   * Looks for patterns like:
   *   export const identityFragment: SystemPromptFragment<...> = {
   *     id: "identity",
   *     placement: "leading",
   *     ...
   *   }
   */
  private static extractFragmentsFromText(
    content: string,
    logger: EndpointLogger,
    filePath: string,
  ): Array<{
    exportName: string;
    id: string;
    placement: "leading" | "trailing";
  }> {
    const results: Array<{
      exportName: string;
      id: string;
      placement: "leading" | "trailing";
    }> = [];

    // Find all fragment const declarations
    // Pattern: export const <name>Fragment ... = { ... id: "...", placement: "...", ...
    const constRegex = /export\s+const\s+(\w+)\s*(?::[^=]+)?=\s*\{/g;
    let match: RegExpExecArray | null;

    while ((match = constRegex.exec(content)) !== null) {
      const exportName = match[1];
      const blockStart = match.index + match[0].length;

      // Scan forward to extract id and placement from this object literal
      // Read up to 500 chars ahead (enough for the first few properties)
      const snippet = content.slice(blockStart, blockStart + 600);

      const idMatch = /\bid\s*:\s*"([^"]+)"/.exec(snippet);
      const placementMatch = /\bplacement\s*:\s*"(leading|trailing)"/.exec(
        snippet,
      );

      if (idMatch && placementMatch) {
        const placement = placementMatch[1] as "leading" | "trailing";
        results.push({ exportName, id: idMatch[1], placement });
      }
    }

    if (results.length === 0) {
      logger.warn(
        `No SystemPromptFragment exports found in ${filePath} via text scan - skipping`,
      );
    }

    return results;
  }

  /**
   * Import each prompt.ts file and extract the fragment ID(s) it exports.
   */
  static async extractFragments(
    promptFiles: string[],
    logger: EndpointLogger,
  ): Promise<FragmentEntry[]> {
    // Group: one entry per unique prompt file (may export multiple fragments)
    const entriesByFile = new Map<string, FragmentEntry>();

    for (const promptFile of promptFiles) {
      try {
        // Collect all exported fragment consts + their IDs
        const fragmentExportNames: string[] = [];
        const idToExportName = new Map<string, string>();
        const placementByExportName = new Map<string, "leading" | "trailing">();

        // Files have `server-only` — parse text instead of dynamic import
        const content = readFileSync(promptFile, "utf-8");
        const extracted = PromptFragmentsGenerator.extractFragmentsFromText(
          content,
          logger,
          promptFile,
        );
        for (const { exportName, id, placement } of extracted) {
          fragmentExportNames.push(exportName);
          idToExportName.set(id, exportName);
          placementByExportName.set(exportName, placement);
        }

        if (fragmentExportNames.length === 0) {
          logger.warn(
            `No SystemPromptFragment exports found in ${promptFile} - skipping`,
          );
          continue;
        }

        const promptImportPath =
          PromptFragmentsGenerator.toAbsoluteImportPath(promptFile);
        const serverImportPath = promptImportPath;
        const serverLoaderExportName =
          PromptFragmentsGenerator.extractServerLoaderName(promptFile, logger);

        // One entry per fragment ID - each knows its own export name and placement
        for (const [id, ownExportName] of idToExportName) {
          const placement =
            placementByExportName.get(ownExportName) ?? "trailing";
          const entry: FragmentEntry = {
            id,
            placement,
            promptImportPath,
            fragmentExportNames,
            ownExportName,
            serverImportPath,
            serverLoaderExportName,
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
   * Generate prompt-fragments.ts - isomorphic index with fragment IDs and getPromptFragment.
   * No server-only or client-only dependencies.
   */
  static generateContent(fragments: FragmentEntry[]): string {
    const header = generateFileHeader(
      "AUTO-GENERATED PROMPT FRAGMENTS INDEX",
      "generators/prompt-fragments",
      {
        "Fragments found": fragments.length,
        "Fragment IDs": fragments.map((f) => f.id).join(", "),
      },
    );

    // Each fragment ID gets its own case (multiple IDs may point to the same file - that's fine).
    // Use .then() to extract only the fragment exports so TS doesn't complain about non-fragment
    // exports (enums, interfaces, helper consts) that may exist in the same file.
    const allPromptCases = fragments.map((f) => {
      const names = f.fragmentExportNames.join(", ");
      const obj = f.fragmentExportNames.join(", ");
      const singleLine = `      return import("${f.promptImportPath}").then(({ ${names} }) => ({ ${obj} }));`;
      if (singleLine.length <= 80) {
        return `    case "${f.id}":\n${singleLine}`;
      }
      // Check if destructure param fits inline: "        ({ names }) => ({"
      const inlineParam = `        ({ ${names} }) => ({`;
      const nameLines = f.fragmentExportNames
        .map((n) => `          ${n},`)
        .join("\n");
      const objLines = f.fragmentExportNames
        .map((n) => `          ${n},`)
        .join("\n");
      if (inlineParam.length <= 80) {
        // Compact: .then(\n  ({ names }) => ({\n    name,\n  }),\n)
        // eslint-disable-next-line i18next/no-literal-string
        return `    case "${f.id}":\n      return import("${f.promptImportPath}").then(\n        ({ ${names} }) => ({\n${objLines}\n        }),\n      );`;
      }
      // eslint-disable-next-line i18next/no-literal-string
      return `    case "${f.id}":\n      return import("${f.promptImportPath}").then(\n        ({\n${nameLines}\n        }) => ({\n${objLines}\n        }),\n      );`;
    });

    // Fragment IDs list
    const fragmentIdList = fragments.map((f) => `  "${f.id}",`).join("\n");

    return `${header}

import type { PromptFragmentModule } from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";

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
): Promise<PromptFragmentModule> {
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
  /** Format an import statement (sorted names, single-line for 1 name) */
  private static formatImport(
    keyword: "import" | "import type",
    names: string[],
    path: string,
  ): string {
    const sorted = [...names].sort();
    if (sorted.length === 1) {
      return `${keyword} { ${sorted[0]} } from "${path}";`;
    }
    return `${keyword} {\n  ${sorted.join(",\n  ")},\n} from "${path}";`;
  }

  /** Strip quotes from a byId key when it's a plain identifier */
  private static byIdKey(id: string): string {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(id) ? id : `"${id}"`;
  }

  /**
   * Format a resolve line: `  const x =\n    cond ? val : fallback;`
   * If the full ternary fits on the second line (≤80 chars), keep it inline there.
   * Otherwise break the ternary to its own lines with 6-space indent.
   */
  private static formatResolveLine(
    varName: string,
    resultVar: string,
    yesVal: string,
    noVal: string,
  ): string {
    const cond = `${resultVar}.status === "fulfilled"`;
    const ternaryInline = `    ${cond} ? ${yesVal} : ${noVal};`;
    if (ternaryInline.length <= 80) {
      return `  const ${varName} =\n    ${cond} ? ${yesVal} : ${noVal};`;
    }
    return `  const ${varName} =\n    ${cond}\n      ? ${yesVal}\n      : ${noVal};`;
  }

  /**
   * Format a build line: `  const xBuilt = cond ? yes : null;`
   * If the full line fits ≤80 chars, keep inline.
   * Otherwise: `const xBuilt = cond\n    ? yes\n    : null;`
   */
  private static formatBuildLine(
    builtVar: string,
    cond: string,
    yes: string,
    no: string,
  ): string {
    const inline = `  const ${builtVar} = ${cond} ? ${yes} : ${no};`;
    if (inline.length <= 80) return inline;
    return `  const ${builtVar} = ${cond}\n    ? ${yes}\n    : ${no};`;
  }

  static generateServerContent(fragments: FragmentEntry[]): string {
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
    // Fragment imports (prompt.ts) - deduplicated by path
    const seenPrompt = new Map<string, string[]>();

    for (const f of fragments) {
      if (!seenPrompt.has(f.promptImportPath)) {
        seenPrompt.set(f.promptImportPath, f.fragmentExportNames);
      }
      if (f.serverImportPath && f.serverLoaderExportName) {
        if (!seenServer.has(f.serverImportPath)) {
          const raw = f.serverLoaderExportName.replace(/^load/, "");
          const dataVar = raw.charAt(0).toLowerCase() + raw.slice(1);
          seenServer.set(f.serverImportPath, {
            loaderName: f.serverLoaderExportName,
            dataVar,
          });
        }
      }
    }

    // Build a unified sorted import list (simple-import-sort groups all into one block)
    const typesPath =
      "@/app/api/[locale]/agent/ai-stream/system-prompt/types";
    const allImports: Array<{ path: string; line: string }> = [];
    allImports.push({
      path: typesPath,
      line: PromptFragmentsGenerator.formatImport(
        "import type",
        ["SystemPromptServerParams"],
        typesPath,
      ),
    });
    for (const [path, names] of seenPrompt) {
      allImports.push({
        path,
        line: PromptFragmentsGenerator.formatImport("import", names, path),
      });
    }
    for (const [path, { loaderName }] of seenServer) {
      allImports.push({
        path,
        line: PromptFragmentsGenerator.formatImport(
          "import",
          [loaderName],
          path,
        ),
      });
    }
    // simple-import-sort sorts by path, then by import kind (type before value)
    allImports.sort((a, b) => {
      if (a.path !== b.path) return a.path.localeCompare(b.path);
      // type imports come before value imports from the same path
      const aType = a.line.startsWith("import type");
      const bType = b.line.startsWith("import type");
      if (aType !== bType) return aType ? -1 : 1;
      return 0;
    });

    // Generate parallel load calls - deduplicated by server path
    const loaderCalls: string[] = [];
    const loaderVarNames: string[] = [];
    for (const [, { loaderName, dataVar }] of seenServer) {
      loaderVarNames.push(dataVar);
      loaderCalls.push(`    ${loaderName}(params),`);
    }

    // Destructure: always multi-line when > 1 var (formatter always expands)
    let destructure = "";
    if (loaderVarNames.length > 0) {
      const resultVars = loaderVarNames.map((v) => `${v}Result`);
      const singleLine = `  const [${resultVars.join(", ")}] = await Promise.allSettled([`;
      if (singleLine.length <= 80) {
        destructure = `  const [${resultVars.join(", ")}] = await Promise.allSettled([\n${loaderCalls.join("\n")}\n  ]);`;
      } else {
        const varLines = resultVars.map((v) => `    ${v},`).join("\n");
        destructure = `  const [\n${varLines}\n  ] = await Promise.allSettled([\n${loaderCalls.join("\n")}\n  ]);`;
      }
    }

    // Resolve each data var from its Promise.allSettled result
    const resolveLines: string[] = [];
    for (const [, { dataVar }] of seenServer) {
      resolveLines.push(
        PromptFragmentsGenerator.formatResolveLine(
          dataVar,
          `${dataVar}Result`,
          `${dataVar}Result.value`,
          "undefined",
        ),
      );
    }

    // Build lines for each fragment
    const buildLines: string[] = [];
    const builtEntries: string[] = [];
    const seenBuilt = new Set<string>();

    for (const f of fragments) {
      if (f.serverImportPath && f.serverLoaderExportName) {
        const entry = seenServer.get(f.serverImportPath);
        if (!entry || seenBuilt.has(f.id)) continue;
        seenBuilt.add(f.id);
        const camel = PromptFragmentsGenerator.toCamel(f.id);
        buildLines.push(
          PromptFragmentsGenerator.formatBuildLine(
            `${camel}Built`,
            entry.dataVar,
            `${f.ownExportName}.build(${entry.dataVar})`,
            "null",
          ),
        );
        builtEntries.push(
          `    ${PromptFragmentsGenerator.byIdKey(f.id)}: ${camel}Built,`,
        );
      }
    }

    // Push lines
    const pushLines = fragments
      .filter((f) => f.serverImportPath)
      .map((f) => {
        const camel = PromptFragmentsGenerator.toCamel(f.id);
        const pushCall = `    ${f.placement}.push({ id: "${f.id}", priority: ${f.ownExportName}.priority, str: ${camel}Built });`;
        if (pushCall.length <= 80) {
          return `  if (${camel}Built) {\n${pushCall}\n  }`;
        }
        return `  if (${camel}Built) {\n    ${f.placement}.push({\n      id: "${f.id}",\n      priority: ${f.ownExportName}.priority,\n      str: ${camel}Built,\n    });\n  }`;
      })
      .join("\n");

    return `${header}

import "server-only";

${allImports.map((i) => i.line).join("\n")}

/**
 * Combined server loader - loads all fragment data in parallel, builds strings, returns results.
 * Returns leading/trailing arrays (sorted by priority) and byId map of built strings.
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
