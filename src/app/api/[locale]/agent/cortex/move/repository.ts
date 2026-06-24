import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { RemoteEventHandlerProps } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  ensureParentDirs,
  getMountPrefix,
  getNode,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
  pathExists,
} from "../repository";
import moveDefinitions from "./definition";
import { type CortexMoveT, scopedTranslation } from "./i18n";

export class CortexMoveRepository {
  static async moveNode({
    userId,
    user,
    locale,
    from: rawFrom,
    to: rawTo,
    logger,
    t,
    relayed = false,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    from: string;
    to: string;
    logger: EndpointLogger;
    t: CortexMoveT;
    /**
     * True when invoked from a cross-instance applier (the move was already
     * performed on the origin and relayed here). Suppresses the `node-moved`
     * emit so the event is not relayed back, preventing an infinite ping-pong.
     */
    relayed?: boolean;
  }): Promise<
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

    // Virtual writable mount - both paths must share the same mount
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

      // Re-queue embedding for the moved node - path changed so embedding text changed
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

      // This op owns its `node-moved` event: the move the user submitted
      // (requestFields). The peer's onRemoteEvent re-runs moveNode. Server-only.
      // Suppressed when applying a relayed move (avoids re-relay ping-pong).
      if (!relayed) {
        createEndpointEmitter(
          moveDefinitions.POST,
          logger,
          user,
        )("node-moved", {
          requestData: { from, to },
        });
      }

      return success({
        responseFrom: from,
        responseTo: to,
        nodesAffected,
      });
    } catch (error) {
      logger.error("Cortex move failed", parseError(error), { from, to });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for `node-moved`: re-run the move on this instance with
   * the relayed from/to. Reuses moveNode so there is one move code path.
   */
  static async applyRemoteMove({
    requestData,
    user,
    logger,
    locale,
  }: RemoteEventHandlerProps<
    typeof moveDefinitions.POST,
    "node-moved"
  >): Promise<void> {
    const { t } = scopedTranslation.scopedT(locale);
    const result = await this.moveNode({
      userId: user.id,
      user,
      locale: defaultLocale,
      from: requestData.from,
      to: requestData.to,
      logger,
      t,
      relayed: true,
    });
    if (!result.success) {
      logger.error("Failed to apply remote cortex move", {
        message: result.message,
      });
    }
  }
}
