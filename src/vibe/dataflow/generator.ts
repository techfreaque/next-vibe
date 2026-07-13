/**
 * Graph Seeds Index Generator (domain-co-located).
 *
 * Scans graph-seeds.ts across the API tree and emits src/generated/dataflow/graph-seeds-index.ts.
 * Byte-identical to the former tooling/generators/graph-seeds-index. Consumed by
 * system/dataflow/seeds.ts. File list comes from the shared GeneratorContext.
 */

import "server-only";

import { readFile } from "node:fs/promises";

import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";
import {
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "next-vibe/tooling/generators/shared/utils";

const OUTPUT_FILE = "src/generated/dataflow/graph-seeds-index.ts";

async function validateFiles(files: string[]): Promise<string | null> {
  for (const file of files) {
    const content = await readFile(file, "utf-8");
    if (
      !content.includes("export const graphSeeds") &&
      !content.includes("export { graphSeeds }")
    ) {
      return `Graph seeds file ${file} must export 'graphSeeds' array`;
    }
  }
  return null;
}

function generateContent(seedFiles: string[], outputFile: string): string {
  const imports: string[] = [];
  const spreadEntries: string[] = [];

  let moduleIndex = 0;
  for (const file of seedFiles) {
    const relativePath = getRelativeImportPath(file, outputFile);
    imports.push(
      `import { graphSeeds as seedModule${moduleIndex} } from "${relativePath}";`,
    );
    spreadEntries.push(`  ...seedModule${moduleIndex},`);
    moduleIndex++;
  }

  const header = generateFileHeader(
    "AUTO-GENERATED GRAPH SEEDS INDEX",
    "Graph Seeds Index Generator",
    {
      Implements:
        "Auto-discovery of graph-seeds.ts files for Vibe Sense pipeline graphs",
      "Graph seed modules": seedFiles.length,
    },
  );

  return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { GraphSeedEntry } from "next-vibe/dataflow/graph/types";

${imports.join("\n")}

/**
 * All graph seed entries discovered from the codebase.
 */
export const allGraphSeeds: GraphSeedEntry[] = [
${spreadEntries.join("\n")}
];
`;
}

/** Generate the graph seeds index. Consumes shared graph-seed file list; writes one file. */
export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const seedFiles = ctx.files.graphSeed;

  const validationError = await validateFiles(seedFiles);
  if (validationError) {
    return {
      summary: "graph seeds index (failed validation)",
      failed: `Graph seeds index generation failed: ${validationError}`,
    };
  }

  const content = generateContent(seedFiles, OUTPUT_FILE);
  await writeGeneratedFile(OUTPUT_FILE, content);

  return {
    summary: `graph seeds index (${seedFiles.length} modules)`,
    counts: { modules: seedFiles.length },
  };
}
