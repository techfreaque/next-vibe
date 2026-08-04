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
import { relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  APP_IMPORT_ROOT,
  GENERATED_DIR,
  getApiDir,
  getProjectRoot,
  VIBE_DIR,
  VIBE_IMPORT_ALIAS,
} from "@/env/paths";

import type { GeneratorContext, GeneratorResult } from "./shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  toPosixPath,
  writeGeneratedFile,
} from "./shared/utils";

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

/**
 * Convert an absolute path to the shortest alias-based import path.
 *
 * Anchored on the PROJECT ROOT, because VIBE_DIR and GENERATED_DIR are both
 * project-root-relative. Deliberately {@link getProjectRoot} and not
 * `getSrcDir()`: here the latter means `<root>/src`, so relativizing against it
 * drops the "src/vibe/" prefix the alias branch matches on and every generator
 * silently falls through to a relative path.
 *
 * The app-level branch reads {@link APP_IMPORT_ROOT} rather than hardcoding
 * `src/` → `@/`. A vendored copy with no such alias sets it to null and the
 * branch disappears, instead of the pair having to be edited out by hand.
 */
function toImportAlias(absPath: string): string {
  const rel = relative(getProjectRoot(), absPath)
    .replaceAll("\\", "/")
    .replace(/\.ts$/, "");
  if (rel.startsWith(`${VIBE_DIR}/`)) {
    return `${VIBE_IMPORT_ALIAS}/${rel.slice(VIBE_DIR.length + 1)}`;
  }
  if (APP_IMPORT_ROOT && rel.startsWith(`${APP_IMPORT_ROOT.dir}/`)) {
    return `${APP_IMPORT_ROOT.alias}/${rel.slice(APP_IMPORT_ROOT.dir.length + 1)}`;
  }
  // Last resort: a path relative to the OUTPUT file's directory. `./${rel}` was
  // wrong — that is relative to the project root, not to the generated file
  // that has to resolve it.
  return getRelativeImportPath(absPath, OUTPUT_FILE);
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
  const file = readFileSync(absPath, "utf-8");

  // Must export a `generator` const.
  const declIndex = file.search(/export\s+const\s+generator\b/);
  if (declIndex === -1) {
    return null;
  }

  /**
   * Scan from the declaration onward, never the whole file. Generators are
   * code-generators: their bodies are full of template strings that contain
   * `key: "..."` and `phase: "..."` as EMITTED source. Matching from the top of
   * the file would happily read a generated artefact's field as this
   * generator's own metadata.
   */
  const src = file.slice(declIndex);

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

  // The emitted import is written with the alias, NOT a relative path. The
  // relative form is resolved from the GENERATED file's directory, not this
  // one, so the two are never the same string — and an editor (or a sed)
  // fixing this module's own imports will happily rewrite the template's
  // literal to match, silently pointing the generated registry at a directory
  // that does not exist. That has already happened once here.
  return `${header}

import "server-only";

import type { GeneratorContext, GeneratorDefinition, GeneratorResult } from "${VIBE_IMPORT_ALIAS}/core/generators/shared/shared-inputs";

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

/**
 * `Pick<..., "logger">` rather than the full context: this generator does its own
 * generator.ts scan and never reads the shared file lists or parsed definitions.
 * Narrowing the parameter lets the orchestrator run it BEFORE building the shared
 * context — which it must, since the registry that context is sized from is this
 * generator's output.
 */
export async function generate(
  ctx: Pick<GeneratorContext, "logger">,
): Promise<GeneratorResult> {
  const { logger } = ctx;
  const apiDir = getApiDir();

  // Exclude this file itself, located from its own module URL rather than a
  // hardcoded "src/vibe/core/generators/generator.ts" under cwd. The literal
  // form silently stops excluding the moment the framework is vendored at a
  // different path or the process runs from another directory — and a
  // meta-generator that registers itself recurses.
  const selfPath = toPosixPath(fileURLToPath(import.meta.url));
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
