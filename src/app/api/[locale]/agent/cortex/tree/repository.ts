import "server-only";

/**
 * Cortex Tree Repository
 * Builds a compact directory tree representation
 */

import { and, eq, like } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import type { CortexTreeT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import {
  basename,
  isValidPath,
  normalizePath,
  pathDepth,
  DOCUMENTS_PREFIX,
} from "../repository";

interface TreeParams {
  userId: string;
  user: JwtPrivatePayloadType;
  path: string;
  maxDepth: number;
  logger: EndpointLogger;
  t: CortexTreeT;
}

export class CortexTreeRepository {
  static async getTree({
    userId,
    user,
    path: rawPath,
    maxDepth,
    logger,
    t,
  }: TreeParams): Promise<
    ResponseType<{ tree: string; totalFiles: number; totalDirs: number }>
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
        const { ensureMountPopulated, ensureDataRoot } =
          await import("../fs-provider/fs-populate");
        if (path === "/") {
          await ensureDataRoot();
        } else {
          const segments = path.split("/").filter(Boolean);
          if (segments.length > 0) {
            await ensureMountPopulated(`/${segments[0]}`, userId, logger);
          }
        }
        const { fsGetTree } = await import("../fs-provider/fs-tree");
        return fsGetTree(path, maxDepth, { t });
      }
    }

    try {
      // Build tree for documents
      const docNodes = await db
        .select({
          path: cortexNodes.path,
          nodeType: cortexNodes.nodeType,
          size: cortexNodes.size,
        })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, userId),
            path === "/" || path === DOCUMENTS_PREFIX
              ? like(cortexNodes.path, `${DOCUMENTS_PREFIX}%`)
              : like(cortexNodes.path, `${path}%`),
          ),
        )
        .orderBy(cortexNodes.path);

      // Filter by depth
      const baseDepth = pathDepth(path);
      const filteredNodes = docNodes.filter(
        (n) => pathDepth(n.path) - baseDepth <= maxDepth,
      );

      let totalFiles = 0;
      let totalDirs = 0;

      // Build tree string
      const lines: string[] = [];

      if (path === "/") {
        lines.push("/");

        // Add virtual mounts as summaries
        const { getVirtualMountCounts } = await import("../mounts/resolver");
        const counts = await getVirtualMountCounts(userId);

        // Documents tree
        if (filteredNodes.length > 0) {
          lines.push("├── documents/");
          const docTree = CortexTreeRepository.buildSubtree(
            filteredNodes,
            DOCUMENTS_PREFIX,
            "│   ",
            maxDepth - 1,
          );
          lines.push(...docTree.lines);
          totalFiles += docTree.files;
          totalDirs += docTree.dirs + 1;
        } else {
          lines.push("├── documents/ (empty)");
          totalDirs++;
        }

        // Thread summary
        const threadParts: string[] = [];
        for (const [root, count] of Object.entries(counts.threads.byRoot)) {
          if (count > 0) {
            threadParts.push(`${root}: ${count}`);
          }
        }
        lines.push(
          `├── threads/ (${counts.threads.total} threads${threadParts.length > 0 ? ` — ${threadParts.join(", ")}` : ""})`,
        );
        totalDirs++;

        // Memories summary
        lines.push(`├── memories/ (${counts.memories} files)`);
        totalDirs++;

        // Skills & tasks
        lines.push(`├── skills/ (${counts.skills})`);
        lines.push(`└── tasks/ (${counts.tasks})`);
        totalDirs += 2;
      } else {
        // Subtree for a specific path
        lines.push(`${basename(path)}/`);
        const tree = CortexTreeRepository.buildSubtree(
          filteredNodes,
          path,
          "",
          maxDepth,
        );
        lines.push(...tree.lines);
        totalFiles = tree.files;
        totalDirs = tree.dirs;
      }

      return success({
        tree: lines.join("\n"),
        totalFiles,
        totalDirs,
      });
    } catch (error) {
      logger.error("Cortex tree failed", parseError(error), { path });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Build tree lines for a set of nodes under a prefix
   */
  private static buildSubtree(
    nodes: Array<{ path: string; nodeType: string; size: number }>,
    prefix: string,
    indent: string,
    maxDepth: number,
  ): { lines: string[]; files: number; dirs: number } {
    const lines: string[] = [];
    let files = 0;
    let dirs = 0;

    // Get direct children
    const baseDepth = pathDepth(prefix);
    const children = nodes.filter(
      (n) =>
        n.path.startsWith(`${prefix}/`) && pathDepth(n.path) === baseDepth + 1,
    );

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const isLast = i === children.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childIndent = indent + (isLast ? "    " : "│   ");
      const name = basename(child.path);

      if (child.nodeType === CortexNodeType.DIR) {
        dirs++;
        lines.push(`${indent}${connector}${name}/`);
        if (maxDepth > 1) {
          const sub = CortexTreeRepository.buildSubtree(
            nodes,
            child.path,
            childIndent,
            maxDepth - 1,
          );
          lines.push(...sub.lines);
          files += sub.files;
          dirs += sub.dirs;
        }
      } else {
        files++;
        const sizeStr =
          child.size > 0
            ? ` ${child.size >= 1024 ? `${(child.size / 1024).toFixed(1)} KB` : `${child.size} B`}`
            : "";
        lines.push(`${indent}${connector}${name}${sizeStr}`);
      }
    }

    return { lines, files, dirs };
  }
}
