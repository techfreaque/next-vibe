import "server-only";

/**
 * Cortex List Repository
 * Lists directory contents from both document workspace and virtual mounts
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CortexNodeType } from "../enum";
import {
  basename,
  DOCUMENTS_PREFIX,
  getMountPrefix,
  isValidPath,
  isWritablePath,
  listChildren,
  MEMORIES_PREFIX,
  normalizeToCanonicalPath,
  normalizePath,
  VIRTUAL_MOUNTS,
} from "../repository";
import type { CortexListT } from "./i18n";

interface ListParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  logger: EndpointLogger;
  t: CortexListT;
}

interface ListEntry {
  name: string;
  entryPath: string;
  nodeType: string;
  size: number | null;
  updatedAt: string;
}

export class CortexListRepository {
  static async listDirectory({
    userId,
    user,
    locale,
    path: rawPath,
    logger,
    t,
  }: ListParams): Promise<
    ResponseType<{ responsePath: string; entries: ListEntry[]; total: number }>
  > {
    // Normalize locale-aware path to canonical for DB queries and template matching
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    if (!user.isPublic) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const mountPrefix = getMountPrefix(path, locale);
        if (mountPrefix) {
          // ensureMountPopulated is a no-op for virtual mounts (non-native)
          const { ensureMountPopulated } =
            await import("../fs-provider/fs-populate");
          await ensureMountPopulated(mountPrefix, userId, logger);
        } else {
          // Root listing — create native dirs on disk
          const { ensureDataRoot } = await import("../fs-provider/fs-populate");
          await ensureDataRoot();
        }
        const { fsListDirectory } = await import("../fs-provider/fs-list");
        return fsListDirectory(path, { t }, userId, locale);
      }
    }

    try {
      // Root listing: show all mount points + native writable prefixes
      if (path === "/") {
        const now = new Date().toISOString();
        const { getLocaleRoots } = await import("../seeds/templates");
        const roots = getLocaleRoots(locale);
        const entries = [
          ...VIRTUAL_MOUNTS.map((mount) => ({
            name: mount.slice(1), // remove leading /
            entryPath: mount,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          })),
          {
            // Display locale-aware name (e.g. "erinnerungen") but canonical entryPath ("/memories")
            // so clicking it navigates to /memories/ which the endpoint normalizes correctly
            name: roots.memories.slice(1),
            entryPath: MEMORIES_PREFIX,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          },
          {
            name: roots.documents.slice(1),
            entryPath: DOCUMENTS_PREFIX,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          },
        ];

        return success({ responsePath: path, entries, total: entries.length });
      }

      const mountPrefix = getMountPrefix(path, locale);

      // Virtual mount listing
      if (mountPrefix && !isWritablePath(path, locale)) {
        const { resolveVirtualList } = await import("../mounts/resolver");
        const rawEntries = await resolveVirtualList(userId, path, mountPrefix);
        const entries: ListEntry[] = rawEntries.map((e) => ({
          name: e.name,
          entryPath: e.path,
          nodeType: e.nodeType,
          size: e.size,
          updatedAt: e.updatedAt,
        }));
        return success({ responsePath: path, entries, total: entries.length });
      }

      // Document workspace listing
      const nodes = await listChildren(userId, path);
      const entries: ListEntry[] = nodes.map((node) => ({
        name: basename(node.path),
        entryPath: node.path,
        nodeType: node.nodeType === CortexNodeType.DIR ? "dir" : "file",
        size: node.size,
        updatedAt: node.updatedAt.toISOString(),
      }));

      // Overlay virtual template files/dirs for /memories and /documents paths
      // All template paths and input paths are canonical at this point.
      const {
        getMemoryTemplates,
        getDocumentTemplates,
        getDefaultDocumentDirs,
      } = await import("../seeds/templates");
      const existingPaths = new Set(entries.map((e) => e.entryPath));
      const now = new Date().toISOString();
      const normalizedDir = path.endsWith("/") ? path.slice(0, -1) : path;

      if (path.startsWith(MEMORIES_PREFIX)) {
        const templates = getMemoryTemplates(locale);
        for (const item of templates) {
          if (!item.path.startsWith(`${normalizedDir}/`)) {
            continue;
          }
          const relative = item.path.slice(normalizedDir.length + 1);
          const firstSegment = relative.split("/")[0]!;
          if (relative.includes("/")) {
            // Synthesize a dir entry for the immediate subfolder
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
      } else if (path.startsWith(DOCUMENTS_PREFIX)) {
        const docTemplates = getDocumentTemplates(locale);
        // Document templates live at /documents/templates/*
        const templatesSubdir = "/documents/templates";
        if (path === templatesSubdir) {
          // Inject virtual document template files
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
        } else if (path === DOCUMENTS_PREFIX) {
          // Inject virtual subdirs for /documents/ root
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

      return success({ responsePath: path, entries, total: entries.length });
    } catch (error) {
      logger.error("Cortex list failed", parseError(error), { path });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
