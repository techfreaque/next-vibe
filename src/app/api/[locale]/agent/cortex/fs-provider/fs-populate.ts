/**
 * Filesystem Populate — lazy export of DB data to disk on first access
 *
 * When a mount directory doesn't exist on disk, this module exports all
 * entries from the DB (via virtual mount handlers) as .md files.
 * A `.populated` marker prevents re-export on subsequent accesses.
 */

import "server-only";

import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DATA_ROOT } from ".";

/**
 * Ensure a mount directory exists and has been populated from DB.
 * Idempotent — checks for `.populated` marker file.
 */
export async function ensureMountPopulated(
  mountPrefix: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  const mountName = mountPrefix.replace(/^\//, "");
  const mountDir = join(DATA_ROOT, mountName);
  const markerPath = join(mountDir, ".populated");

  // Check marker
  try {
    await stat(markerPath);
    return; // Already populated
  } catch {
    // Not yet populated — continue
  }

  // Create the mount directory
  await mkdir(mountDir, { recursive: true });

  try {
    // Dynamic import to avoid pulling mount code at module load
    const { resolveVirtualList, resolveVirtualRead } =
      await import("../mounts/resolver");

    // List all entries in this mount
    const entries = await resolveVirtualList(userId, mountPrefix, mountPrefix);

    let count = 0;
    for (const entry of entries) {
      if (entry.nodeType === "file") {
        // Read the full content
        const readResult = await resolveVirtualRead(
          userId,
          entry.path,
          mountPrefix,
        );

        if (readResult) {
          const filePath = join(DATA_ROOT, entry.path.slice(1));
          await mkdir(join(filePath, ".."), { recursive: true });
          await writeFile(filePath, readResult.content, "utf8");
          count++;
        }
      } else if (entry.nodeType === "dir") {
        const dirPath = join(DATA_ROOT, entry.path.slice(1));
        await mkdir(dirPath, { recursive: true });
      }
    }

    logger.info(
      `Cortex fs-populate: exported ${count} files to data/${mountName}/`,
    );
  } catch (error) {
    logger.warn(
      `Cortex fs-populate: failed for ${mountPrefix}`,
      parseError(error),
    );
    // Don't fail — the directory exists, just wasn't fully populated
  }

  // Write marker
  await writeFile(markerPath, new Date().toISOString(), "utf8");
}

/**
 * Ensure the entire data/ directory structure exists.
 * Creates mount directories that don't exist yet.
 */
export async function ensureDataRoot(): Promise<void> {
  const mounts = ["documents", "threads", "memories", "skills", "tasks"];
  for (const mount of mounts) {
    await mkdir(join(DATA_ROOT, mount), { recursive: true });
  }
}
