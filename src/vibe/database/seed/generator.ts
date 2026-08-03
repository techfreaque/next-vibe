/**
 * Seeds Index Generator (domain-co-located).
 *
 * Scans seeds.ts across the API tree and emits src/generated/seeds/index.ts — a lazy
 * module-name → dynamic-import map. Byte-identical to the former
 * tooling/generators/seeds. File list comes from the shared GeneratorContext.
 */

import "server-only";

import type { GeneratorDefinition } from "../../core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  toPosixPath,
  writeGeneratedFile,
} from "../../core/generators/shared/utils";

import { GENERATED_DIR, getApiDir, VIBE_DIR } from "@/env/paths";

/**
 * Module name a seeds file belongs to.
 *   .../core/leads/seeds.ts              -> "leads"
 *   .../core/emails/smtp-client/seeds.ts -> "smtp-client"
 *
 * Lives here rather than in the shared generator utilities because this is its
 * only caller. A helper with one consumer that sits in a shared module reads as
 * part of the shared contract, and every vendored copy of that module then
 * carries it as a dead export.
 */
function extractModuleName(filePath: string, coreMarker = "core"): string {
  const pathParts = toPosixPath(filePath).split("/");
  const coreIndex = pathParts.findIndex((p) => p === coreMarker);

  if (coreIndex === -1 || coreIndex >= pathParts.length - 1) {
    return pathParts.at(-2) || "unknown";
  }

  const moduleParts = pathParts.slice(coreIndex + 1, pathParts.length - 1);
  return moduleParts.at(-1) || moduleParts.join("-");
}

const OUTPUT_FILE = `${GENERATED_DIR}/seeds/index.ts`;

/**
 * Where EnvironmentSeeds actually lives. The emitted import resolves from the
 * generated file's directory, not this one — a hand-written "./seed-manager"
 * pointed at <generated>/seeds/seed-manager, which does not exist.
 */
const SEED_MANAGER_MODULE = `${VIBE_DIR}/database/seed/seed-manager.ts`;

function generateContent(seedFiles: string[], outputFile: string): string {
  const switchCases: string[] = [];
  const seedPaths: string[] = [];

  for (let i = 0; i < seedFiles.length; i++) {
    const seedFile = seedFiles[i];
    const relativePath = getRelativeImportPath(seedFile, outputFile);
    const moduleName = extractModuleName(seedFile);

    seedPaths.push(`    "${moduleName}",`);
    switchCases.push(
      `    case "${moduleName}":\n      return (await import("${relativePath}")) as EnvironmentSeeds;`,
    );
  }

  const header = generateFileHeader(
    "AUTO-GENERATED FILE - DO NOT EDIT",
    "Seeds Generator",
  );

  return `${header}

/* eslint-disable prettier/prettier */

import type { EnvironmentSeeds } from "${getRelativeImportPath(SEED_MANAGER_MODULE, outputFile)}";

/**
 * Dynamically import seed module by name
 * @param moduleName - The seed module name (e.g., "user", "leads")
 * @returns The seed module or null if not found
 */
export async function getSeedModule(
  moduleName: string,
): Promise<EnvironmentSeeds | null> {
  switch (moduleName) {
${switchCases.join("\n")}
    default:
      return null;
  }
}

/**
 * Get all available seed module names
 */
export function getAllSeedModuleNames(): string[] {
  return [
${seedPaths.join("\n")}
  ];
}

/**
 * Check if a seed module exists
 */
export function hasSeedModule(moduleName: string): boolean {
  return getAllSeedModuleNames().includes(moduleName);
}
`;
}

export const generator: GeneratorDefinition = {
  key: "seeds",
  phase: "default",
  needs: {},
  cacheKey: "seeds",
  findInputs(live) {
    if (live) {
      return [...live.seedFiles].toSorted();
    }
    return findFilesRecursively(getApiDir(), "seeds.ts");
  },
  output: OUTPUT_FILE,
  async generate(ctx) {
    const seedFiles = ctx.files.seed;
    const content = generateContent(seedFiles, OUTPUT_FILE);
    await writeGeneratedFile(OUTPUT_FILE, content);

    return {
      summary: `seeds index (${seedFiles.length} modules)`,
      counts: { seeds: seedFiles.length },
    };
  },
};
