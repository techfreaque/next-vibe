/**
 * Filesystem List — lists directory contents from disk
 */

import "server-only";

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { DATA_ROOT, cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsListEntry {
  name: string;
  entryPath: string;
  nodeType: string;
  size: number | null;
  updatedAt: string;
}

interface FsListResult {
  responsePath: string;
  entries: FsListEntry[];
  total: number;
}

export async function fsListDirectory(
  rawPath: string,
  { t }: FsTranslate,
): Promise<ResponseType<FsListResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath =
    cortexPath === "/" ? DATA_ROOT : cortexPathToDisk(cortexPath);

  try {
    const dirents = await readdir(diskPath, { withFileTypes: true });
    const entries: FsListEntry[] = [];

    for (const dirent of dirents) {
      // Skip hidden files (like .populated markers)
      if (dirent.name.startsWith(".")) {
        continue;
      }

      const entryDisk = join(diskPath, dirent.name);
      const entryCortex = diskPathToCortex(entryDisk);
      const isDir = dirent.isDirectory();

      let size: number | null = null;
      let updatedAt = new Date().toISOString();

      try {
        const st = await stat(entryDisk);
        size = isDir ? null : st.size;
        updatedAt = st.mtime.toISOString();
      } catch {
        // stat failed — use defaults
      }

      entries.push({
        name: dirent.name,
        entryPath: entryCortex,
        nodeType: isDir ? "dir" : "file",
        size,
        updatedAt,
      });
    }

    // Sort: dirs first, then alphabetically
    entries.sort((a, b) => {
      if (a.nodeType !== b.nodeType) {
        return a.nodeType === "dir" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return success({
      responsePath: cortexPath,
      entries,
      total: entries.length,
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
