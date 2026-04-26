/**
 * Filesystem List - lists directory contents from disk
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
import type { CountryLanguage } from "@/i18n/core/config";
import {
  basename,
  normalizePath,
  VIRTUAL_MOUNTS,
  DOCUMENTS_PREFIX,
  MEMORIES_PREFIX,
} from "../repository";

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
  userId?: string,
  locale?: CountryLanguage,
): Promise<ResponseType<FsListResult>> {
  const cortexPath = normalizePath(rawPath);

  // Virtual mount paths - delegate to virtual resolver (not on disk)
  if (cortexPath !== "/") {
    const mountPrefix = VIRTUAL_MOUNTS.find(
      (m) => cortexPath === m || cortexPath.startsWith(`${m}/`),
    );
    if (mountPrefix && userId) {
      const { resolveVirtualList } = await import("../mounts/resolver");
      const rawEntries = await resolveVirtualList(
        userId,
        cortexPath,
        mountPrefix,
      );
      const entries: FsListEntry[] = rawEntries.map((e) => ({
        name: e.name,
        entryPath: e.path,
        nodeType: e.nodeType,
        size: e.size,
        updatedAt: e.updatedAt,
      }));
      return success({
        responsePath: cortexPath,
        entries,
        total: entries.length,
      });
    }
  }

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
        // stat failed - use defaults
      }

      entries.push({
        name: dirent.name,
        entryPath: entryCortex,
        nodeType: isDir ? "dir" : "file",
        size,
        updatedAt,
      });
    }

    // For root listing, inject virtual mounts that aren't on disk
    if (cortexPath === "/") {
      const now = new Date().toISOString();
      const existingNames = new Set(entries.map((e) => e.name));
      for (const mount of VIRTUAL_MOUNTS) {
        const name = mount.slice(1);
        if (!existingNames.has(name)) {
          entries.push({
            name,
            entryPath: mount,
            nodeType: "dir",
            size: null,
            updatedAt: now,
          });
        }
      }
    }

    // Overlay virtual template files for memories and documents (same as DB path)
    if (locale) {
      const {
        getMemoryTemplates,
        getDocumentTemplates,
        getDefaultDocumentDirs,
      } = await import("../seeds/templates");
      const existingPaths = new Set(entries.map((e) => e.entryPath));
      const now = new Date().toISOString();
      const normalizedDir = cortexPath.endsWith("/")
        ? cortexPath.slice(0, -1)
        : cortexPath;

      if (cortexPath.startsWith(MEMORIES_PREFIX)) {
        const templates = getMemoryTemplates(locale);
        for (const item of templates) {
          if (!item.path.startsWith(`${normalizedDir}/`)) {
            continue;
          }
          const relative = item.path.slice(normalizedDir.length + 1);
          const firstSegment = relative.split("/")[0]!;
          if (relative.includes("/")) {
            const dirPath = `${normalizedDir}/${firstSegment}`;
            if (!existingPaths.has(dirPath)) {
              existingPaths.add(dirPath);
              entries.push({
                name: firstSegment,
                entryPath: dirPath,
                nodeType: "dir",
                size: null,
                updatedAt: now,
              });
            }
            continue;
          }
          if (existingPaths.has(item.path)) {
            continue;
          }
          entries.push({
            name: basename(item.path),
            entryPath: item.path,
            nodeType: "file",
            size: Buffer.byteLength(item.content, "utf8"),
            updatedAt: now,
          });
        }
      } else if (cortexPath.startsWith(DOCUMENTS_PREFIX)) {
        const docTemplates = getDocumentTemplates(locale);
        const templatesSubdir = "/documents/templates";
        if (cortexPath === templatesSubdir) {
          for (const item of docTemplates) {
            if (existingPaths.has(item.path)) {
              continue;
            }
            entries.push({
              name: basename(item.path),
              entryPath: item.path,
              nodeType: "file",
              size: Buffer.byteLength(item.content, "utf8"),
              updatedAt: now,
            });
          }
        } else if (cortexPath === DOCUMENTS_PREFIX) {
          const templateDirs = getDefaultDocumentDirs(locale);
          for (const dir of templateDirs) {
            if (!existingPaths.has(dir.path)) {
              existingPaths.add(dir.path);
              entries.push({
                name: basename(dir.path),
                entryPath: dir.path,
                nodeType: "dir",
                size: null,
                updatedAt: now,
              });
            }
          }
        }
      }
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
