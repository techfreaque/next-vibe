/**
 * Generator Hash Cache
 *
 * Persists per-generator input fingerprints to .tmp/gen-state.json.
 * On each `vibe gen` run, generators whose inputs haven't changed are skipped.
 *
 * Fingerprint = xxHash of sorted "path:mtime:size" strings (sub-ms per generator).
 * False positives (mtime bump, no content change) are acceptable—they cause one
 * redundant run, then re-cache correctly.
 */

import "server-only";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

/**
 * Per-generator fingerprints stored on disk.
 * Key = generator key (e.g. "endpoints", "seeds").
 * Value = fingerprint string produced by fingerprint().
 */
export type GenState = Record<string, string>;

const STATE_FILE = join(process.cwd(), ".tmp", "gen-state.json");

/**
 * Read the persisted gen state from disk.
 * Returns {} if the file is missing, unreadable, or malformed.
 */
export function readGenState(): GenState {
  try {
    if (!existsSync(STATE_FILE)) {
      return {};
    }
    const raw = readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, string> | null;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

/**
 * Write gen state to disk synchronously.
 * Creates .tmp/ directory if it doesn't exist.
 */
export function writeGenState(state: GenState): void {
  const dir = dirname(STATE_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

/**
 * Compute a fingerprint for a list of input files.
 *
 * For each file (sorted for determinism): concatenates "path:mtime:size".
 * Hashes the combined string with Bun.hash (xxHash64 — extremely fast).
 * Returns the hash as a hex string.
 *
 * An empty file list produces a stable fingerprint for that generator
 * (useful when all inputs were deleted).
 */
export function fingerprint(files: readonly string[]): string {
  const sorted = [...files].toSorted();
  const parts: string[] = [];
  let existing = 0;

  for (const file of sorted) {
    try {
      const st = statSync(file);
      parts.push(`${file}:${st.mtimeMs}:${st.size}`);
      existing++;
    } catch {
      // File deleted since scan — treat as absent (contributes empty string)
      parts.push(`${file}:deleted`);
    }
  }

  // A generator that DECLARES inputs but resolves NONE on disk is a broken
  // input mapping (a stale hardcoded path in find-generator-inputs.ts) — NOT
  // an empty-inputs generator, which returns [] and never reaches here. Left
  // silent, such a mapping produces a stable "all-:deleted" fingerprint that
  // equals itself forever, so the generator is skipped on every run and only
  // regenerates under --force. Fail loudly instead of wedging the cache.
  if (sorted.length > 0 && existing === 0) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Build-time generator integrity check: a fully-missing input set means a broken path mapping; fail fast rather than silently wedge the gen-cache.
    throw new Error(
      `gen-cache: generator declared ${sorted.length} input file(s) but NONE exist on disk — ` +
        `this is a stale/incorrect path in find-generator-inputs.ts. Missing:\n  ${sorted.join("\n  ")}`,
    );
  }

  const combined = parts.join("|");
  // Bun.hash returns a bigint (u64); convert to hex string
  return Bun.hash(combined).toString(16);
}

/**
 * Returns true if the generator's inputs haven't changed since the last run
 * AND the given output file exists on disk.
 *
 * Both conditions must hold to safely skip generation.
 */
export function isUnchanged(
  key: string,
  files: readonly string[],
  outputFile: string,
  state: GenState,
): boolean {
  if (!existsSync(outputFile)) {
    return false;
  }
  const saved = state[key];
  if (saved === undefined) {
    return false;
  }
  return fingerprint(files) === saved;
}

/**
 * Record a successful generation for `key` by storing the current fingerprint
 * of `files` into `state` (mutates in place).
 *
 * Call writeGenState(state) once after all generators complete.
 */
export function markDone(
  key: string,
  files: readonly string[],
  state: GenState,
): void {
  state[key] = fingerprint(files);
}
