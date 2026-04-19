import "server-only";

/**
 * Cortex List Repository
 * Lists directory contents from both document workspace and virtual mounts
 */

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import type { CortexListT } from "./i18n";
import {
  getMountPrefix,
  isValidPath,
  isWritablePath,
  listChildren,
  normalizePath,
  basename,
  VIRTUAL_MOUNTS,
  DOCUMENTS_PREFIX,
  MEMORIES_PREFIX,
} from "../repository";

interface ListParams {
  userId: string;
  user: JwtPrivatePayloadType;
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
    path: rawPath,
    logger,
    t,
  }: ListParams): Promise<
    ResponseType<{ responsePath: string; entries: ListEntry[]; total: number }>
  > {
    const path = normalizePath(rawPath);

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
        const { ensureMountPopulated } =
          await import("../fs-provider/fs-populate");
        const mountPrefix = getMountPrefix(path);
        if (mountPrefix) {
          await ensureMountPopulated(mountPrefix, userId, logger);
        } else {
          // Root listing — populate all mounts
          const { ensureDataRoot } = await import("../fs-provider/fs-populate");
          await ensureDataRoot();
        }
        const { fsListDirectory } = await import("../fs-provider/fs-list");
        return fsListDirectory(path, { t });
      }
    }

    try {
      // Root listing: show all mount points + native writable prefixes
      if (path === "/") {
        const now = new Date().toISOString();
        const entries = [
          ...VIRTUAL_MOUNTS.map((mount) => ({
            name: mount.slice(1), // remove leading /
            entryPath: mount,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          })),
          {
            name: "memories",
            entryPath: MEMORIES_PREFIX,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          },
          {
            name: "documents",
            entryPath: DOCUMENTS_PREFIX,
            nodeType: "dir" as const,
            size: null,
            updatedAt: now,
          },
        ];

        return success({ responsePath: path, entries, total: entries.length });
      }

      const mountPrefix = getMountPrefix(path);

      // Virtual mount listing
      if (mountPrefix && !isWritablePath(path)) {
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
        nodeType: node.nodeType,
        size: node.size,
        updatedAt: node.updatedAt.toISOString(),
      }));

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
