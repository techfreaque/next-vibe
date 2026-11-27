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

interface RuntimeEnvSentinel {
  sentinel: Buffer;
  value: Buffer;
}

const SENTINEL_PREFIX_BYTES = Buffer.from(RUNTIME_ENV_SENTINEL_PREFIX, "utf8");

/**
 * Replaces every known sentinel in `content` at the byte level (native
 * memmem scans, one allocation for the result). Returns undefined when the
 * file holds no known sentinel, so the caller skips the write.
 */
export function replaceRuntimeEnvSentinels(
  content: Buffer,
  sentinels: readonly RuntimeEnvSentinel[],
): { content: Buffer; count: number } | undefined {
  let at = content.indexOf(SENTINEL_PREFIX_BYTES);
  if (at === -1) {
    return undefined;
  }
  const parts: Buffer[] = [];
  let copiedUntil = 0;
  let count = 0;
  while (at !== -1) {
    const match = sentinels.find(
      ({ sentinel }) =>
        at + sentinel.length <= content.length &&
        content.compare(
          sentinel,
          0,
          sentinel.length,
          at,
          at + sentinel.length,
        ) === 0,
    );
    if (match) {
      parts.push(content.subarray(copiedUntil, at), match.value);
      copiedUntil = at + match.sentinel.length;
      count++;
      at = content.indexOf(SENTINEL_PREFIX_BYTES, copiedUntil);
    } else {
      // A sentinel for a key this container does not set: leave it as is.
      at = content.indexOf(
        SENTINEL_PREFIX_BYTES,
        at + SENTINEL_PREFIX_BYTES.length,
      );
    }
  }
  if (count === 0) {
    return undefined;
  }
  parts.push(content.subarray(copiedUntil));
  return { content: Buffer.concat(parts), count };
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

  // Longest first, so a sentinel that is a prefix of another never wins.
  const sentinels: RuntimeEnvSentinel[] = replacements
    .map(({ sentinel, value }) => ({
      sentinel: Buffer.from(sentinel, "utf8"),
      value: Buffer.from(value, "utf8"),
    }))
    .toSorted((a, b) => b.sentinel.length - a.sentinel.length);

  const startedAt = Date.now();
  const files: string[] = [];
  await walkJsFiles(NEXT_BUILD_DIR, files);

  let patchedFiles = 0;
  let patchedTokens = 0;

  const patchFile = async (file: string): Promise<void> => {
    // Raw bytes, never a decoded string: only ~200 of ~17,400 bundle files
    // carry a sentinel, and decoding every file to UTF-16 plus a regex
    // callback per match held the loop for up to 643 ms right after boot
    // (prod 2026-11-26 12:42, hot frames runtime-env-patch.ts:110/126,
    // 82 "[EventLoop] Elevated lag" occurrences across deploys). The
    // sentinels are ASCII, so a byte match can never split a UTF-8 sequence.
    let content: Buffer;
    try {
      content = await readFile(file);
    } catch {
      return;
    }
    const patched = replaceRuntimeEnvSentinels(content, sentinels);
    if (!patched) {
      return;
    }
    patchedTokens += patched.count;
    // Let queued requests run between patched files.
    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });
    try {
      await writeFile(file, patched.content);
      patchedFiles++;
    } catch (error) {
      logger.warn("[RuntimeEnvPatch] Failed to write patched file", {
        file,
        error: error instanceof Error ? error.message : String(error),
      });
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
