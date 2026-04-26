/**
 * Filesystem Populate - lazy export of DB data to disk on first access
 *
 * Only /memories and /documents are filesystem-backed (NATIVE_WRITABLE_PREFIXES).
 * All other mounts (threads, skills, tasks, uploads, searches, gens) are virtual-only
 * and never written to disk.
 */

import "server-only";

import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DATA_ROOT } from ".";

/**
 * Ensure a native mount directory exists and has been populated from DB.
 * Only works for /memories and /documents - virtual mounts are skipped.
 * Idempotent - checks for `.populated` marker file.
 */
export async function ensureMountPopulated(
  mountPrefix: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  const { NATIVE_WRITABLE_PREFIXES } = await import("../repository");
  const isNative = (NATIVE_WRITABLE_PREFIXES as readonly string[]).includes(
    mountPrefix,
  );

  // Only filesystem-backed mounts get populated on disk
  if (!isNative) {
    return;
  }

  const mountName = mountPrefix.replace(/^\//, "");
  const mountDir = join(DATA_ROOT, mountName);
  const markerPath = join(mountDir, ".populated");

  // Check marker
  try {
    await stat(markerPath);
    return; // Already populated
  } catch {
    // Not yet populated - continue
  }

  // Create the mount directory
  await mkdir(mountDir, { recursive: true });

  try {
    const { CortexNodeType } = await import("../enum");
    const { db } = await import("@/app/api/[locale]/system/db");
    const { cortexNodes } = await import("../db");
    const { and, eq, like } = await import("drizzle-orm");
    const nodes = await db
      .select()
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          like(cortexNodes.path, `${mountPrefix}/%`),
        ),
      )
      .orderBy(cortexNodes.path);

    let count = 0;
    for (const node of nodes) {
      if (node.nodeType === CortexNodeType.FILE && node.content) {
        const filePath = join(DATA_ROOT, node.path.slice(1));
        await mkdir(join(filePath, ".."), { recursive: true });
        await writeFile(filePath, node.content, "utf8");
        count++;
      } else if (node.nodeType === CortexNodeType.DIR) {
        const dirPath = join(DATA_ROOT, node.path.slice(1));
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
    // Don't fail - the directory exists, just wasn't fully populated
  }

  // Write marker
  await writeFile(markerPath, new Date().toISOString(), "utf8");
}

/**
 * Ensure the data/ directory structure exists for filesystem-backed mounts only.
 * Only /memories and /documents are stored on disk.
 */
export async function ensureDataRoot(): Promise<void> {
  for (const mount of ["memories", "documents"]) {
    await mkdir(join(DATA_ROOT, mount), { recursive: true });
  }
}
