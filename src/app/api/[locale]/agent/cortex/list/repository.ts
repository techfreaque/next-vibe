import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

/**
 * Cortex List Repository
 * Lists directory contents from both document workspace and virtual mounts
 */
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
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
  normalizePath,
  normalizeToCanonicalPath,
  VIRTUAL_MOUNTS,
} from "../repository";
import type { CortexListResponseOutput } from "./definition";
import type { CortexListT } from "./i18n";

export class CortexListRepository {
  static async listDirectory({
    userId,
    user,
    locale,
    path: rawPath,
    logger,
    t,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    logger: EndpointLogger;
    t: CortexListT;
  }): Promise<ResponseType<CortexListResponseOutput>> {
    // Normalize locale-aware path to canonical for DB queries and template matching
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      // Root listing: show all mount points + native writable prefixes
      if (path === "/") {
        const now = new Date();
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
        const isAdmin =
          !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
        const { resolveVirtualList } = await import("../mounts/resolver");
        const rawEntries = await resolveVirtualList(
          userId,
          path,
          mountPrefix,
          isAdmin,
        );
        const entries: CortexListResponseOutput["entries"] = rawEntries.map(
          (e) => ({
            name: e.name,
            entryPath: e.path,
            nodeType: e.nodeType,
            size: e.size,
            updatedAt: new Date(e.updatedAt),
          }),
        );
        return success({ responsePath: path, entries, total: entries.length });
      }

      // Document workspace listing
      const nodes = await listChildren(userId, path);
      const entries: CortexListResponseOutput["entries"] = nodes.map(
        (node) => ({
          name: basename(node.path),
          entryPath: node.path,
          nodeType: node.nodeType === CortexNodeType.DIR ? "dir" : "file",
          size: node.size,
          updatedAt: node.updatedAt,
        }),
      );

      // Overlay virtual template files/dirs for /memories and /documents paths
      // All template paths and input paths are canonical at this point.
      const {
        getMemoryTemplates,
        getDocumentTemplates,
        getDefaultDocumentDirs,
      } = await import("../seeds/templates");
      const existingPaths = new Set(entries.map((e) => e.entryPath));
      const now = new Date();
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
