/**
 * Generators Index Generator.
 *
 * Scans every generator.ts in the project, reads its exported `generator` const
 * (key, phase, needs, cacheKey, output, generate), and emits
 * src/generated/generators/index.ts — the GENERATORS_REGISTRY the orchestrator
 * (repository.ts) imports.
 *
 * Adding a new generator: create a generator.ts with a `generator` export and
 * run `vibe gen`. No manual index editing needed.
 *
 * Bootstrap-safe: never imports from src/generated/*.
 */

import "server-only";

import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";

import { GENERATED_DIR, getApiDir } from "@/env/paths";

export const OUTPUT_FILE = `${GENERATED_DIR}/generators/index.ts`;

// ---------------------------------------------------------------------------
// Meta extraction — reads generator export from source (no runtime import).
// ---------------------------------------------------------------------------

interface GeneratorFileMeta {
  absPath: string;
  importPath: string;
  importName: string;
  key: string;
  phase: string;
  needsDefinitionModules: boolean;
  cacheKey: string | null;
}

/** Convert an absolute path to the shortest alias-based import path. */
function toImportAlias(absPath: string): string {
  const cwd = process.cwd();
  const rel = relative(cwd, absPath).replace(/\\/g, "/").replace(/\.ts$/, "");
  if (rel.startsWith("src/vibe/")) {
    return `next-vibe/${rel.slice("src/vibe/".length)}`;
  }
  if (rel.startsWith("src/")) {
    return `@/${rel.slice("src/".length)}`;
  }
  return `./${rel}`;
}

/** Derive a camelCase import name from the generator key, e.g. "endpoint-framework" → "generatorEndpointFramework". */
function toImportName(key: string): string {
  const pascal = key
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return `generator${pascal}`;
}

function extractMeta(absPath: string): GeneratorFileMeta | null {
  const src = readFileSync(absPath, "utf-8");

  // Must export a `generator` const.
  if (!/export\s+const\s+generator\b/.test(src)) {
    return null;
  }

  const keyMatch = /key:\s*["']([^"']+)["']/.exec(src);
  const phaseMatch = /phase:\s*["']([^"']+)["']/.exec(src);
  const cacheKeyMatch = /cacheKey:\s*["']([^"']+)["']/.exec(src);
  const needsDef =
    /needsDefinitionModules:\s*true|definitionModules:\s*true/.test(src);

  if (!keyMatch || !phaseMatch) {
    return null;
  }

  const key = keyMatch[1];
  return {
    absPath,
    importPath: toImportAlias(absPath),
    importName: toImportName(key),
    key,
    phase: phaseMatch[1],
    needsDefinitionModules: needsDef,
    cacheKey: cacheKeyMatch?.[1] ?? null,
  };
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function renderIndex(entries: GeneratorFileMeta[]): string {
  const header = generateFileHeader(
    "Generators Registry",
    "Generators Index Generator",
    { command: "vibe gen", generators: entries.length },
  );

  const imports = entries
    .map(
      (e) => `import { generator as ${e.importName} } from "${e.importPath}";`,
    )
    .join("\n");

  const registryEntries = entries
    .map((e) => {
      return [
        "  {",
        `    ...${e.importName},`,
        `    run: ${e.importName}.generate,`,
        `    enabled: true,`,
        "  },",
      ].join("\n");
    })
    .join("\n");

  return `${header}

import "server-only";

import type { GeneratorContext, GeneratorDefinition, GeneratorResult } from "next-vibe/core/generators/shared/shared-inputs";

${imports}

export interface GeneratorEntry extends GeneratorDefinition {
  run: (ctx: GeneratorContext) => Promise<GeneratorResult>;
  enabled: boolean;
}

export const GENERATORS_REGISTRY: readonly GeneratorEntry[] = [
${registryEntries}
];
`;
}

export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const { logger } = ctx;
  const cwd = process.cwd();
  const apiDir = getApiDir();

  // Scan all generator.ts files, excluding this file itself.
  const selfPath = join(
    cwd,
    "src",
    "vibe",
    "core",
    "generators",
    "generator.ts",
  );
  const allGeneratorFiles = findFilesRecursively(apiDir, "generator.ts").filter(
    (f) => f !== selfPath,
  );

  const entries: GeneratorFileMeta[] = [];
  for (const absPath of allGeneratorFiles) {
    const meta = extractMeta(absPath);
    if (meta) {
      entries.push(meta);
    }
  }

  // Stable order: def-scan first, then default; alphabetical within each phase.
  entries.sort((a, b) => {
    if (a.phase === "def-scan" && b.phase !== "def-scan") {
      return -1;
    }
    if (a.phase !== "def-scan" && b.phase === "def-scan") {
      return 1;
    }
    return a.key.localeCompare(b.key);
  });

  await writeGeneratedFile(OUTPUT_FILE, renderIndex(entries));
  logger.debug(`generators index: wrote ${entries.length} entries`);

  return {
    summary: `generators index (${entries.length} generators)`,
    counts: { generators: entries.length },
  };
}
