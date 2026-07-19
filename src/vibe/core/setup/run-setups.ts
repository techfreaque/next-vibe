/**
 * Runs the setups in the generated registry for the setup command.
 *
 * One setup failing must not abort the rest: they own unrelated artifacts, and a
 * project missing (say) an MCP template should still get its CLI shim. Each
 * outcome is reported on its own entry instead, and nothing here throws.
 *
 * Deliberately quiet. Each setup narrates its own work through the logger it is
 * handed — it knows what it did and how to say it well, and a runner that also
 * announced every entry would just double every line.
 */

import "server-only";

import { readFileSync } from "node:fs";

import {
  findFilesRecursively,
  stripProjectRoot,
} from "next-vibe/core/generators/shared/utils";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getApiDir } from "@/env/paths";

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

async function loadSetupRegistry(): Promise<readonly SetupEntry[]> {
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
        const mod = (await import(absPath)) as {
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

export type SetupPhase = "install" | "uninstall";

export interface SetupRunResult {
  key: string;
  description: string;
  /** The setup's own summary, or the failure reason when `ok` is false. */
  summary: string;
  ok: boolean;
}

/**
 * Run every registered setup. Sequential on purpose: the summaries are read as a
 * list, and interleaved console output from parallel setups is worse than the
 * millisecond saved.
 */
export async function runSetups(
  phase: SetupPhase,
  logger: EndpointLogger,
): Promise<SetupRunResult[]> {
  const registry = await loadSetupRegistry();
  const results: SetupRunResult[] = [];
  for (const entry of registry) {
    // A setup reports failure by returning `failed`; the try/catch is only for
    // the unexpected (a bad import, an fs error nobody wrapped). Both land on
    // the same failed entry, and neither aborts the setups that follow.
    let failed: string | undefined;
    let summary: string;
    try {
      const result = await entry[phase](logger);
      failed = result.failed;
      summary = result.failed ?? result.summary;
    } catch (error) {
      failed = parseError(error).message;
      summary = failed;
    }

    if (failed !== undefined) {
      // The only line this runner prints. Everything a setup has to say about
      // its own work it says itself — but a failed setup may not have got there.
      logger.error(`${entry.description} — ${phase} failed: ${failed}`);
    }

    results.push({
      key: entry.key,
      description: entry.description,
      summary,
      ok: failed === undefined,
    });
  }
  return results;
}
