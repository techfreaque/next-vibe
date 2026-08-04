/**
 * Resolves the setup registry, with a pre-generation fallback.
 *
 * Normally the registry is the generated `@/generated/setup` index. That file
 * does not exist yet on a fresh clone — and `vibe gen`, which would write it, is
 * itself reached through a setup. So this falls back to scanning the API dir and
 * importing each setup module directly, which is the only thing that makes the
 * very first run possible.
 *
 * Split out of run-setups.ts so that consumers with a guaranteed-generated
 * registry can import SETUP_REGISTRY directly and never pull in the scanner,
 * `node:fs`, or the generator utilities behind it.
 */

import "server-only";

import { readFileSync } from "node:fs";

import { getApiDir } from "@/env/paths";

import {
  findFilesRecursively,
  stripProjectRoot,
  toImportUrl,
} from "../generators/shared/utils";
import { isSetupFile, type SetupEntry, setupKeyFor } from "./types";

const REQUIRED_EXPORTS = ["description", "install", "uninstall"] as const;

function hasRequiredExports(absPath: string): boolean {
  const content = readFileSync(absPath, "utf-8");
  return REQUIRED_EXPORTS.every((name) =>
    new RegExp(`export\\s+(?:async\\s+)?(?:function|const)\\s+${name}\\b`).test(
      content,
    ),
  );
}

export async function loadSetupRegistry(): Promise<readonly SetupEntry[]> {
  try {
    const mod = await import("@/generated/setup");
    return mod.SETUP_REGISTRY;
  } catch {
    // Generated index missing (fresh clone, pre-gen). Fall back to scan.
    const files = findFilesRecursively(getApiDir(), isSetupFile)
      .toSorted()
      .filter(hasRequiredExports);

    const entries: SetupEntry[] = [];
    for (const absPath of files) {
      try {
        // toImportUrl, not the bare path: on Windows `import("C:/...")` is read
        // as a bare specifier and throws, and the catch below would swallow it —
        // leaving the bootstrap fallback silently returning zero setups there.
        const mod = (await import(toImportUrl(absPath))) as {
          description: string;
          install: SetupEntry["install"];
          uninstall: SetupEntry["uninstall"];
        };
        entries.push({
          key: setupKeyFor(stripProjectRoot(absPath)),
          description: mod.description,
          install: mod.install,
          uninstall: mod.uninstall,
        });
      } catch {
        // Skip modules that fail to import during bootstrap.
      }
    }
    return entries;
  }
}
