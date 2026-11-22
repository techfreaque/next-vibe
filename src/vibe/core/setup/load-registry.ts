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

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

import { getApiDir, getGeneratedDir } from "@/env/paths";

import type { EndpointLogger } from "../../logger/types";
import {
  findFilesRecursively,
  stripProjectRoot,
} from "../generators/shared/utils";
import { parseError } from "../utils/parse-error";
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

export async function loadSetupRegistry(
  logger: EndpointLogger,
): Promise<readonly SetupEntry[]> {
  if (existsSync(join(getGeneratedDir(), "setup", "index.ts"))) {
    const mod = await import("@/generated/setup");
    return mod.SETUP_REGISTRY;
  }

  // Bootstrap discovery runs in Bun, which can load these filesystem TS
  // modules before there is a generated import that a bundler can follow.
  const loadDiscoveredSetup = createRequire(import.meta.url);
  const files = findFilesRecursively(getApiDir(), isSetupFile).toSorted();
  const entries: SetupEntry[] = [];
  for (const absPath of files) {
    try {
      if (!hasRequiredExports(absPath)) {
        continue;
      }
      const mod: Pick<SetupEntry, "description" | "install" | "uninstall"> =
        loadDiscoveredSetup(absPath);
      entries.push({
        key: setupKeyFor(stripProjectRoot(absPath)),
        description: mod.description,
        install: mod.install,
        uninstall: mod.uninstall,
      });
    } catch (error) {
      logger.error("Could not load discovered setup", parseError(error), {
        path: stripProjectRoot(absPath),
      });
    }
  }
  return entries;
}
