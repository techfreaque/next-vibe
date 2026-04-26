/**
 * Filesystem Sync — disk write-through for preview mode
 *
 * After any DB mutation (memories, documents, skills), call these helpers
 * to keep the `data/` directory in sync. No-op in production mode.
 */

import "server-only";

import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { DATA_ROOT } from ".";
import { normalizePath } from "../repository";

/**
 * Returns true when disk sync is active (preview mode).
 * Lightweight check — no user context needed.
 */
export function isDiskSyncActive(): boolean {
  return process.env["IS_PREVIEW_MODE"] !== "false";
}

/**
 * Write content to disk at the given Cortex path.
 * Atomic: writes to `.tmp` then renames.
 * No-op if preview mode is not active.
 *
 * @param cortexPath - e.g. "/memories/3.md" or "/documents/notes/meeting.md"
 * @param content - file content (markdown with frontmatter)
 */
export async function syncToDisk(
  cortexPath: string,
  content: string,
): Promise<void> {
  if (!isDiskSyncActive()) {
    return;
  }

  const normalized = normalizePath(cortexPath);
  const diskPath = join(DATA_ROOT, normalized.slice(1));

  await mkdir(dirname(diskPath), { recursive: true });

  const tmpPath = join(dirname(diskPath), `.${Date.now()}.tmp`);
  await writeFile(tmpPath, content, "utf8");
  await rename(tmpPath, diskPath);
}

/**
 * Delete a file from disk at the given Cortex path.
 * Silently ignores if file doesn't exist.
 * No-op if preview mode is not active.
 *
 * @param cortexPath - e.g. "/memories/3.md"
 */
export async function deleteFromDisk(cortexPath: string): Promise<void> {
  if (!isDiskSyncActive()) {
    return;
  }

  const normalized = normalizePath(cortexPath);
  const diskPath = join(DATA_ROOT, normalized.slice(1));

  try {
    await unlink(diskPath);
  } catch {
    // File doesn't exist — nothing to delete
  }
}
