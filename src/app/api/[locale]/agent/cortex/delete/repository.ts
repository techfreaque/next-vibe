import "server-only";

import { and, eq, sql } from "drizzle-orm";

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
import type { CountryLanguage } from "@/i18n/core/config";

import type { CortexDeleteT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import {
  getNode,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
} from "../repository";

interface DeleteParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  recursive?: boolean;
  logger: EndpointLogger;
  t: CortexDeleteT;
}

export class CortexDeleteRepository {
  static async deleteNode({
    userId,
    user,
    locale,
    path: rawPath,
    recursive = false,
    logger,
    t,
  }: DeleteParams): Promise<
    ResponseType<{ responsePath: string; nodesDeleted: number }>
  > {
    const path = normalizePath(rawPath);

    if (!isValidPath(path)) {
      return fail({
        message: t("delete.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    // Skip for virtual writable mounts — they go through mount handlers → DB → disk write-through
    if (!user.isPublic && !isVirtualWritable(path)) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { fsDeleteNode } = await import("../fs-provider/fs-delete");
        return fsDeleteNode(path, recursive ?? false, { t });
      }
    }

    // Virtual writable mount — delegate to mount handler
    if (isVirtualWritable(path)) {
      const mountPrefix = getMountPrefix(path);
      if (!mountPrefix) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      try {
        const { resolveVirtualDelete } = await import("../mounts/resolver");
        const result = await resolveVirtualDelete(
          { userId, user, locale, logger },
          path,
          mountPrefix,
        );
        if (!result) {
          return fail({
            message: t("delete.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return success({ responsePath: result.path, nodesDeleted: 1 });
      } catch (error) {
        logger.error("Cortex virtual delete failed", parseError(error), {
          path,
        });
        return fail({
          message: t("delete.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    if (!isWritablePath(path)) {
      return fail({
        message: t("delete.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (path === "/documents" || path === "/memories") {
      return fail({
        message: t("delete.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const node = await getNode(userId, path);
    if (!node) {
      return fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Directories require recursive=true
    if (node.nodeType === CortexNodeType.DIR && !recursive) {
      return fail({
        message: t("delete.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      const result = await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, userId),
            sql`(${cortexNodes.path} = ${path} OR ${cortexNodes.path} LIKE ${`${path}/%`})`,
          ),
        );

      const nodesDeleted = result.rowCount ?? 0;
      logger.info(`Cortex delete: ${path} (${nodesDeleted} nodes)`);

      // Disk write-through: remove from disk
      try {
        const { deleteFromDisk } = await import("../fs-provider/fs-sync");
        await deleteFromDisk(path);
      } catch {
        // Best-effort
      }

      return success({ responsePath: path, nodesDeleted });
    } catch (error) {
      logger.error("Cortex delete failed", parseError(error), { path });
      return fail({
        message: t("delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
