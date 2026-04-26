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

import type { CortexMoveT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  ensureParentDirs,
  getNode,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizeToCanonicalPath,
  normalizePath,
  pathExists,
} from "../repository";

interface MoveParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  from: string;
  to: string;
  logger: EndpointLogger;
  t: CortexMoveT;
}

export class CortexMoveRepository {
  static async moveNode({
    userId,
    user,
    locale,
    from: rawFrom,
    to: rawTo,
    logger,
    t,
  }: MoveParams): Promise<
    ResponseType<{
      responseFrom: string;
      responseTo: string;
      nodesAffected: number;
    }>
  > {
    const from = normalizeToCanonicalPath(normalizePath(rawFrom), locale);
    const to = normalizeToCanonicalPath(normalizePath(rawTo), locale);

    if (!isValidPath(from) || !isValidPath(to)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    // Skip for virtual writable mounts — they go through mount handlers → DB → disk write-through
    if (!user.isPublic && !isVirtualWritable(from) && !isVirtualWritable(to)) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { fsMoveNode } = await import("../fs-provider/fs-move");
        return fsMoveNode(from, to, { t });
      }
    }

    // Virtual writable mount — both paths must share the same mount
    const fromMount = getMountPrefix(from, locale);
    const toMount = getMountPrefix(to, locale);
    if (isVirtualWritable(from) || isVirtualWritable(to)) {
      if (fromMount !== toMount) {
        // Cross-mount moves are forbidden
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (!fromMount || !isVirtualWritable(from)) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      try {
        const { resolveVirtualMove } = await import("../mounts/resolver");
        const result = await resolveVirtualMove(
          { userId, user, locale, logger },
          from,
          to,
          fromMount,
        );
        if (!result) {
          return fail({
            message: t("post.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        return success({
          responseFrom: result.from,
          responseTo: result.to,
          nodesAffected: 1,
        });
      } catch (error) {
        logger.error("Cortex virtual move failed", parseError(error), {
          from,
          to,
        });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    if (!isWritablePath(from, locale) || !isWritablePath(to, locale)) {
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (from === to) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Check source exists
    const sourceExists = await pathExists(userId, from);
    if (!sourceExists) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check destination doesn't exist
    const destExists = await pathExists(userId, to);
    if (destExists) {
      return fail({
        message: t("post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    try {
      // Ensure parent dirs for destination
      await ensureParentDirs(userId, to);

      // Atomic bulk rename: update the node itself + all children
      const now = new Date();
      const result = await db
        .update(cortexNodes)
        .set({
          path: sql`CASE
            WHEN ${cortexNodes.path} = ${from} THEN ${to}
            ELSE ${to} || substr(${cortexNodes.path}, ${from.length + 1})
          END`,
          updatedAt: now,
        })
        .where(
          and(
            eq(cortexNodes.userId, userId),
            sql`(${cortexNodes.path} = ${from} OR ${cortexNodes.path} LIKE ${`${from}/%`})`,
          ),
        );

      const nodesAffected = result.rowCount ?? 0;
      logger.info(`Cortex move: ${from} → ${to} (${nodesAffected} nodes)`);

      // Disk write-through: delete old path, content is preserved in DB at new path
      try {
        const { deleteFromDisk } = await import("../fs-provider/fs-sync");
        await deleteFromDisk(from);
        // For the new path, we'd need to read the content back — the DB already has it.
        // The next fs-populate cycle or explicit read will sync it. For single file moves,
        // read the node at the new path and sync.
        const movedNode = await getNode(userId, to);
        if (movedNode?.content !== null && movedNode?.content !== undefined) {
          const { syncToDisk } = await import("../fs-provider/fs-sync");
          await syncToDisk(to, movedNode.content);
        }
      } catch {
        // Best-effort
      }

      // Re-queue embedding for the moved node — path changed so embedding text changed
      try {
        const movedFile = await getNode(userId, to);
        if (
          movedFile?.id &&
          movedFile.nodeType === CortexNodeType.FILE &&
          movedFile.content !== null &&
          movedFile.content !== undefined
        ) {
          const { queueEmbedding } = await import("../embeddings/auto-embed");
          queueEmbedding(movedFile.id, to, movedFile.content, {
            billCredits: false,
            user,
            locale,
            logger,
            feature: CortexCreditFeature.EMBEDDING,
          });
        }
      } catch {
        // Best-effort
      }

      return success({ responseFrom: from, responseTo: to, nodesAffected });
    } catch (error) {
      logger.error("Cortex move failed", parseError(error), { from, to });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
