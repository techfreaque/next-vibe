/**
 * Patches runtime-env sentinel placeholders (baked in by the Docker prod
 * build - see VIBE_BUILD_PLACEHOLDER_ENV in environment.ts) with the real
 * NEXT_PUBLIC_* values from this container's actual runtime environment.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { EndpointLogger } from "../../../../logger/types";
import { runtimeEnvPlaceholder } from "../../../cli/runtime/runtime-env-placeholders";

const NEXT_BUILD_DIR = ".next-prod";
/** Persisted webpack/RSC incremental cache - build intermediates, never served */
const SKIP_DIRS = new Set(["cache"]);

function walkJsFiles(dir: string, out: string[]): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue;
      }
      walkJsFiles(join(dir, entry.name), out);
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
 */
export function patchRuntimeEnvPlaceholders(logger: EndpointLogger): void {
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

  const files: string[] = [];
  walkJsFiles(NEXT_BUILD_DIR, files);

  let patchedFiles = 0;
  let patchedTokens = 0;

  for (const file of files) {
    let content: string;
    try {
      content = readFileSync(file, "utf-8");
    } catch {
      continue;
    }

    let changed = false;
    for (const { sentinel, value } of replacements) {
      if (content.includes(sentinel)) {
        content = content.split(sentinel).join(value);
        changed = true;
        patchedTokens++;
      }
    }

    if (changed) {
      try {
        writeFileSync(file, content, "utf-8");
        patchedFiles++;
      } catch (error) {
        logger.warn("[RuntimeEnvPatch] Failed to write patched file", {
          file,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  if (patchedFiles > 0) {
    logger.info(
      `[RuntimeEnvPatch] Patched ${patchedTokens} runtime env placeholder occurrence(s) across ${patchedFiles} file(s)`,
    );
  } else {
    logger.debug(
      "[RuntimeEnvPatch] No runtime env placeholders found in build output - skipped",
    );
  }
}
