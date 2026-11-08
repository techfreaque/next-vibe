import "server-only";

import { and, asc, eq, like } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { cortexNodes } from "../../../../../cortex/db";
import { CortexNodeType } from "../../../../../cortex/enum";
import { CortexWriteRepository } from "../../../../../cortex/write/repository";
import { scopedTranslation as cortexWriteTranslation } from "../../../../../cortex/write/i18n";
import { chatFolders, type ChatFolder } from "../../../../db";
import {
  canManageFolder,
  canViewFolder,
} from "../../../../permissions/permissions";
import type {
  FolderProjectGetResponseOutput,
  FolderProjectUpdateResponseOutput,
} from "./definition";
import type { FolderProjectAddFileResponseOutput } from "./files/definition";
import type { FolderProjectRemoveFileResponseOutput } from "./files/[fileId]/definition";
import { scopedTranslation as removeFileTranslation } from "./files/[fileId]/i18n";
import { scopedTranslation as filesTranslation } from "./files/i18n";
import { scopedTranslation } from "./i18n";

/** Cortex directory that holds all project knowledge files. */
export const KNOWLEDGE_ROOT = "/documents/projects";

/** Root folders that support projects (not incognito / public / remote). */
const PROJECT_ROOTS: readonly string[] = ["private", "shared"];

/** Max ancestors walked when resolving inherited instructions. */
const MAX_DEPTH = 12;

export function knowledgePath(folderId: string): string {
  return `${KNOWLEDGE_ROOT}/${folderId}`;
}

/** Turn a free-form file name into a safe single-segment cortex file name. */
export function toKnowledgeFileName(raw: string): string {
  const base = raw
    .trim()
    .replace(/[/\\]+/g, "-")
    .replace(/\.\.+/g, ".")
    .replace(/\s+/g, " ")
    .replace(/^\.+/, "");
  const name = base.length > 0 ? base : "untitled";
  return /\.[a-z0-9]{1,5}$/i.test(name) ? name : `${name}.md`;
}

export interface ProjectContextFile {
  name: string;
  path: string;
  content: string;
  size: number;
}

export interface ProjectContext {
  /** Instruction blocks, outermost ancestor first. */
  instructions: Array<{ folderName: string; text: string }>;
  /** Knowledge files of this folder and ancestors. */
  files: ProjectContextFile[];
  /** Owner of the knowledge cortex nodes (folder owner). */
  ownerUserId: string | null;
  /** Primary knowledge directory (the chat's own folder). */
  knowledgeDir: string;
}

/**
 * Resolve everything the system prompt needs for a chat running in `folderId`:
 * instructions of the folder and every ancestor (outermost first) + knowledge
 * files (owned by the folder owner) of the folder and ancestors.
 * Never throws; returns null for non-project contexts.
 */
export async function loadProjectContext(
  folderId: string,
  logger: EndpointLogger,
): Promise<ProjectContext | null> {
  try {
    const chain: ChatFolder[] = [];
    let currentId: string | null = folderId;
    while (currentId && chain.length < MAX_DEPTH) {
      const [row]: ChatFolder[] = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.id, currentId))
        .limit(1);
      if (!row) {
        break;
      }
      chain.push(row);
      currentId = row.parentId;
    }
    const self = chain[0];
    if (!self || !PROJECT_ROOTS.includes(self.rootFolderId)) {
      return null;
    }

    const ordered = chain.toReversed();
    const instructions = ordered
      .filter((f) => (f.instructions ?? "").trim().length > 0)
      .map((f) => ({
        folderName: f.name,
        text: (f.instructions ?? "").trim(),
      }));

    const files: ProjectContextFile[] = [];
    if (self.userId) {
      for (const folder of ordered) {
        if (folder.userId !== self.userId) {
          continue;
        }
        const rows = await db
          .select({
            path: cortexNodes.path,
            content: cortexNodes.content,
            size: cortexNodes.size,
          })
          .from(cortexNodes)
          .where(
            and(
              eq(cortexNodes.userId, self.userId),
              eq(cortexNodes.nodeType, CortexNodeType.FILE),
              like(cortexNodes.path, `${knowledgePath(folder.id)}/%`),
            ),
          )
          .orderBy(asc(cortexNodes.path))
          .limit(100);
        for (const r of rows) {
          files.push({
            name: r.path.slice(r.path.lastIndexOf("/") + 1),
            path: r.path,
            content: r.content ?? "",
            size: r.size,
          });
        }
      }
    }

    if (instructions.length === 0 && files.length === 0) {
      return null;
    }
    return {
      instructions,
      files,
      ownerUserId: self.userId,
      knowledgeDir: knowledgePath(self.id),
    };
  } catch (error) {
    logger.error("Failed to load folder project context", parseError(error), {
      folderId,
    });
    return null;
  }
}

async function loadFolder(id: string): Promise<ChatFolder | null> {
  const [row] = await db
    .select()
    .from(chatFolders)
    .where(eq(chatFolders.id, id))
    .limit(1);
  return row ?? null;
}

export class FolderProjectRepository {
  static async getProject(
    user: JwtPayloadType,
    data: { id: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderProjectGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (user.isPublic) {
      return fail({
        message: t("get.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const folder = await loadFolder(data.id);
      if (!folder) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!PROJECT_ROOTS.includes(folder.rootFolderId)) {
        return fail({
          message: t("get.errors.notSupported.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (!(await canViewFolder(user, folder, logger, locale))) {
        return fail({
          message: t("get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const dir = knowledgePath(folder.id);
      const rows = folder.userId
        ? await db
            .select({
              id: cortexNodes.id,
              path: cortexNodes.path,
              size: cortexNodes.size,
              updatedAt: cortexNodes.updatedAt,
            })
            .from(cortexNodes)
            .where(
              and(
                eq(cortexNodes.userId, folder.userId),
                eq(cortexNodes.nodeType, CortexNodeType.FILE),
                like(cortexNodes.path, `${dir}/%`),
              ),
            )
            .orderBy(asc(cortexNodes.path))
            .limit(100)
        : [];
      return success({
        folderName: folder.name,
        instructions: folder.instructions,
        knowledgePath: dir,
        canManage: await canManageFolder(user, folder, logger, locale),
        files: rows.map((r) => ({
          fileId: r.id,
          name: r.path.slice(r.path.lastIndexOf("/") + 1),
          path: r.path,
          size: r.size,
          updatedAt: r.updatedAt,
        })),
      });
    } catch (error) {
      logger.error("Folder project read failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateInstructions(
    user: JwtPayloadType,
    data: { id: string; instructions: string | null },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderProjectUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (user.isPublic) {
      return fail({
        message: t("patch.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const folder = await loadFolder(data.id);
      if (!folder) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!PROJECT_ROOTS.includes(folder.rootFolderId)) {
        return fail({
          message: t("patch.errors.notSupported.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (!(await canManageFolder(user, folder, logger, locale))) {
        return fail({
          message: t("patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const trimmed = (data.instructions ?? "").trim();
      const next = trimmed.length > 0 ? trimmed : null;
      await db
        .update(chatFolders)
        .set({ instructions: next, updatedAt: new Date() })
        .where(eq(chatFolders.id, folder.id));
      logger.info("Folder project instructions updated", {
        folderId: folder.id,
        hasInstructions: next !== null,
      });
      return success({ folderId: folder.id, hasInstructions: next !== null });
    } catch (error) {
      logger.error("Folder project update failed", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async addFile(
    user: JwtPayloadType,
    data: { id: string; name: string; content: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
    toolExecutionContext: Parameters<
      typeof CortexWriteRepository.writeFile
    >[0]["toolExecutionContext"],
  ): Promise<ResponseType<FolderProjectAddFileResponseOutput>> {
    const { t } = filesTranslation.scopedT(locale);
    if (user.isPublic) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const folder = await loadFolder(data.id);
      if (!folder?.userId) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!PROJECT_ROOTS.includes(folder.rootFolderId)) {
        return fail({
          message: t("post.errors.notSupported.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (!(await canManageFolder(user, folder, logger, locale))) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const path = `${knowledgePath(folder.id)}/${toKnowledgeFileName(data.name)}`;
      const written = await CortexWriteRepository.writeFile({
        userId: folder.userId,
        user,
        locale,
        path,
        content: data.content,
        createParents: true,
        logger,
        t: cortexWriteTranslation.scopedT(locale).t,
        toolExecutionContext,
      });
      if (!written.success) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const [node] = await db
        .select({ id: cortexNodes.id })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, folder.userId),
            eq(cortexNodes.path, written.data.responsePath),
          ),
        )
        .limit(1);
      if (!node) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return success({ fileId: node.id, path: written.data.responsePath });
    } catch (error) {
      logger.error("Folder project add file failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async removeFile(
    user: JwtPayloadType,
    data: { id: string; fileId: string },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FolderProjectRemoveFileResponseOutput>> {
    const { t } = removeFileTranslation.scopedT(locale);
    if (user.isPublic) {
      return fail({
        message: t("delete.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const folder = await loadFolder(data.id);
      if (!folder?.userId) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (!(await canManageFolder(user, folder, logger, locale))) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      // The node must live inside THIS folder's knowledge dir (scoping).
      const [node] = await db
        .select({ id: cortexNodes.id, path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.id, data.fileId),
            eq(cortexNodes.userId, folder.userId),
            eq(cortexNodes.nodeType, CortexNodeType.FILE),
            like(cortexNodes.path, `${knowledgePath(folder.id)}/%`),
          ),
        )
        .limit(1);
      if (!node) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      await db.delete(cortexNodes).where(eq(cortexNodes.id, node.id));
      return success({ removedPath: node.path });
    } catch (error) {
      logger.error("Folder project remove file failed", parseError(error));
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
