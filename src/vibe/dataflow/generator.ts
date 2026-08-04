/**
 * Graph Seeds Index Generator (domain-co-located).
 *
 * Scans graph-seeds.ts across the API tree and emits src/generated/dataflow/graph-seeds-index.ts.
 * Byte-identical to the former tooling/generators/graph-seeds-index. Consumed by
 * system/dataflow/seeds.ts. File list comes from the shared GeneratorContext.
 */

import "server-only";

import { readFile } from "node:fs/promises";

import { GENERATED_DIR, getApiDir, VIBE_DIR } from "@/env/paths";

import type { GeneratorDefinition } from "../core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../core/generators/shared/utils";

const OUTPUT_FILE = `${GENERATED_DIR}/dataflow/graph-seeds-index.ts`;

/**
 * Where GraphSeedEntry actually lives. The emitted import resolves from the
 * generated file's directory, not this one — a hand-written "./graph/types"
 * pointed at <generated>/dataflow/graph/types, which does not exist.
 */
const GRAPH_TYPES_MODULE = `${VIBE_DIR}/dataflow/graph/types.ts`;

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

import type { GraphSeedEntry } from "${getRelativeImportPath(GRAPH_TYPES_MODULE, outputFile)}";

${imports.join("\n")}

/**
 * All graph seed entries discovered from the codebase.
 */
export const allGraphSeeds: GraphSeedEntry[] = [
${spreadEntries.join("\n")}
];
`;
}

export const generator: GeneratorDefinition = {
  key: "dataflow",
  phase: "default",
  needs: {},
  cacheKey: "graph-seeds-index",
  findInputs(live) {
    if (live) {
      return [...live.graphSeedFiles].toSorted();
    }
    return findFilesRecursively(getApiDir(), "graph-seeds.ts");
  },
  output: OUTPUT_FILE,
  async generate(ctx) {
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
  },
};
