/**
 * Seeds Index Generator (domain-co-located).
 *
 * Scans seeds.ts across the API tree and emits src/generated/seeds/index.ts — a lazy
 * module-name → dynamic-import map. Byte-identical to the former
 * tooling/generators/seeds. File list comes from the shared GeneratorContext.
 */

import "server-only";

import type { GeneratorDefinition } from "next-vibe/core/generators/shared/shared-inputs";
import {
  extractModuleName,
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";

import { GENERATED_DIR, getApiDir } from "@/env/paths";

const OUTPUT_FILE = `${GENERATED_DIR}/seeds/index.ts`;

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

import type { EnvironmentSeeds } from "next-vibe/database/seed/seed-manager";

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
