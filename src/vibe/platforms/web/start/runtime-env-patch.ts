/**
 * Patches runtime-env sentinel placeholders (baked in by the Docker prod
 * build - see VIBE_BUILD_PLACEHOLDER_ENV in environment.ts) with the real
 * NEXT_PUBLIC_* values from this container's actual runtime environment.
 */

import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { EndpointLogger } from "../../../logger/types";
import {
  RUNTIME_ENV_SENTINEL_PREFIX,
  runtimeEnvPlaceholder,
} from "../../cli/runtime/runtime-env-placeholders";

const NEXT_BUILD_DIR = ".next-prod";
/** Persisted webpack/RSC incremental cache - build intermediates, never served */
const SKIP_DIRS = new Set(["cache"]);
/**
 * Files read in parallel. The scan used to be readFileSync over ~2,500
 * bundle files: on a cold container overlayfs that blocked the event loop
 * for 11.9 s right after boot (prod CRITICAL lag, 2026-11-25 03:59 UTC),
 * freezing the Bun proxy and WS server that already run in this process.
 */
const READ_CONCURRENCY = 16;

async function walkJsFiles(dir: string, out: string[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue;
      }
      await walkJsFiles(join(dir, entry.name), out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(join(dir, entry.name));
    }
  }
}

/**
 * Lets one built image run across instances with different public env
 * (agent availability, local/cloud mode, Stripe key) without a rebuild - the
 * real secrets that drive NEXT_PUBLIC_AGENT_* never need to reach the build.
 *
 * Silent no-op when no sentinels are present (local/dev/Hermes builds bake
 * real values directly and never see this token) - safe to call
 * unconditionally on every `vibe start`, including supervisor restarts.
 * Uses async fs with bounded concurrency so the event loop stays responsive.
 */
export async function patchRuntimeEnvPlaceholders(
  logger: EndpointLogger,
): Promise<void> {
  if (!existsSync(NEXT_BUILD_DIR)) {
    return;
  }

  const replacements = Object.keys(process.env)
    .filter((key) => key.startsWith("NEXT_PUBLIC_"))
    .map((key) => ({
      sentinel: runtimeEnvPlaceholder(key),
      value: process.env[key] ?? "",
    }));

  if (replacements.length === 0) {
    return;
  }

  const valueBySentinel = new Map(
    replacements.map(({ sentinel, value }) => [sentinel, value]),
  );
  const sentinelPattern = new RegExp(
    replacements
      .map(({ sentinel }) => sentinel)
      .toSorted((a, b) => b.length - a.length)
      .map((sentinel) => sentinel.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g",
  );

  const startedAt = Date.now();
  const files: string[] = [];
  await walkJsFiles(NEXT_BUILD_DIR, files);

  let patchedFiles = 0;
  let patchedTokens = 0;

  const patchFile = async (file: string): Promise<void> => {
    let content: string;
    try {
      content = await readFile(file, "utf-8");
    } catch {
      return;
    }
    // One prefix scan rules out the vast majority of files cheaply.
    if (!content.includes(RUNTIME_ENV_SENTINEL_PREFIX)) {
      return;
    }

    // One regex pass per file. Per-key split/join over large chunks still
    // held the loop for 249 ms on the first async deploy (prod 2026-11-25
    // 09:49, hot frame runtime-env-patch.ts:97 "join" x165).
    let changed = false;
    content = content.replace(sentinelPattern, (sentinel) => {
      const value = valueBySentinel.get(sentinel);
      if (value === undefined) {
        return sentinel;
      }
      changed = true;
      patchedTokens++;
      return value;
    });
    // Let queued requests run between patched files.
    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });

    if (changed) {
      try {
        await writeFile(file, content, "utf-8");
        patchedFiles++;
      } catch (error) {
        logger.warn("[RuntimeEnvPatch] Failed to write patched file", {
          file,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < files.length) {
      const file = files[next];
      next++;
      if (file !== undefined) {
        await patchFile(file);
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(READ_CONCURRENCY, files.length) }, worker),
  );

  const durationMs = Date.now() - startedAt;
  if (patchedFiles > 0) {
    logger.info(
      `[RuntimeEnvPatch] Patched ${patchedTokens} runtime env placeholder occurrence(s) across ${patchedFiles} file(s)`,
      { scannedFiles: files.length, durationMs },
    );
  } else {
    logger.debug(
      "[RuntimeEnvPatch] No runtime env placeholders found in build output - skipped",
      { scannedFiles: files.length, durationMs },
    );
  }
}
