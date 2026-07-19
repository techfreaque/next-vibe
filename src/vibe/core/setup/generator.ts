/**
 * Setup Index Generator.
 *
 * Scans every `setup.ts` / `<name>.setup.ts` and emits `<generated>/setup/index.ts`
 * — SETUP_REGISTRY, the list the setup command walks. Consumed by
 * core/setup/{install,uninstall}.
 *
 * The registry exists so the CLI never imports a platform directly: a module
 * declares its setup beside its own code, and adding one is a new file rather
 * than an edit to a list someone has to remember. Same reason the endpoint
 * framework scans `definition.ts` instead of keeping a hand-written index.
 */

import "server-only";

import { readFileSync } from "node:fs";

import type {
  GeneratorContext,
  GeneratorDefinition,
} from "next-vibe/core/generators/shared/shared-inputs";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  stripProjectRoot,
  writeGeneratedFile,
} from "next-vibe/core/generators/shared/utils";

import { GENERATED_DIR, getApiDir } from "@/env/paths";

import { isSetupFile, setupKeyFor } from "./types";

const OUTPUT_FILE = `${GENERATED_DIR}/setup/index.ts`;

/** Required exports. A file missing any of them is not a setup module. */
const REQUIRED_EXPORTS = ["description", "install", "uninstall"] as const;

interface SetupFileInfo {
  absPath: string;
  /** Module directory relative to the project root, e.g. "src/vibe/platforms/mcp". */
  key: string;
  importAlias: string;
}

/**
 * Reject a `setup.ts` that does not export the full contract at *generate* time.
 *
 * Source is matched rather than imported: a setup module pulls in its platform's
 * code, so importing every one here would make `vibe gen` depend on every
 * platform loading cleanly. The registry only needs to know the exports exist —
 * the CLI is what actually calls them.
 */
function validateExports(
  absPath: string,
  logger: GeneratorContext["logger"],
): boolean {
  const content = readFileSync(absPath, "utf-8");
  const present = REQUIRED_EXPORTS.filter((name) =>
    new RegExp(`export\\s+(?:async\\s+)?(?:function|const)\\s+${name}\\b`).test(
      content,
    ),
  );

  // `setup.ts` is a common filename — vitest test setup, build scripts, and
  // anything else in the repo may use it. A file exporting NONE of the contract
  // is simply not one of ours, so it is skipped in silence rather than warned
  // about on every run.
  if (present.length === 0) {
    return false;
  }

  // Exporting SOME of it is different: that is a setup module with a typo or a
  // half-finished one, and staying quiet would mean it silently never runs.
  if (present.length < REQUIRED_EXPORTS.length) {
    const missing = REQUIRED_EXPORTS.filter((name) => !present.includes(name));
    logger.warn(
      `${stripProjectRoot(absPath)} exports ${present.join(", ")} but not ${missing.join(", ")} — skipping. See docs/patterns/setup.md.`,
    );
    return false;
  }
  return true;
}

function collectSetupFiles(
  files: string[],
  logger: GeneratorContext["logger"],
): SetupFileInfo[] {
  const infos: SetupFileInfo[] = [];
  for (const absPath of files.toSorted()) {
    if (!validateExports(absPath, logger)) {
      continue;
    }
    infos.push({
      absPath,
      key: setupKeyFor(stripProjectRoot(absPath)),
      importAlias: `setup_${infos.length}`,
    });
  }
  return infos;
}

function renderRegistry(entries: SetupFileInfo[]): string {
  const header = generateFileHeader("Setup Registry", "Setup Index Generator", {
    command: "vibe gen",
    setups: entries.length,
  });

  const imports = entries
    .map(
      (entry) =>
        `import * as ${entry.importAlias} from "${getRelativeImportPath(
          entry.absPath,
          OUTPUT_FILE,
        )}";`,
    )
    .join("\n");

  const registry = entries
    .map((entry) =>
      [
        "  {",
        `    key: ${JSON.stringify(entry.key)},`,
        `    description: ${entry.importAlias}.description,`,
        `    install: ${entry.importAlias}.install,`,
        `    uninstall: ${entry.importAlias}.uninstall,`,
        "  },",
      ].join("\n"),
    )
    .join("\n");

  return `${header}

import "server-only";

import type { SetupEntry } from "next-vibe/core/setup/types";
${imports}

export const SETUP_REGISTRY: readonly SetupEntry[] = [
${registry}
];
`;
}

export const generator: GeneratorDefinition = {
  key: "setup-index",
  phase: "default",
  needs: {},
  cacheKey: "setup-index",
  findInputs() {
    return findFilesRecursively(getApiDir(), isSetupFile);
  },
  async generate(ctx) {
    const entries = collectSetupFiles(
      findFilesRecursively(getApiDir(), isSetupFile),
      ctx.logger,
    );

    await writeGeneratedFile(OUTPUT_FILE, renderRegistry(entries));

    return {
      summary: `setup index (${entries.length} setup files)`,
      counts: { setups: entries.length },
    };
  },
};
