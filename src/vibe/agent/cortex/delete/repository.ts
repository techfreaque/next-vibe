import "server-only";

import { and, eq, sql } from "drizzle-orm";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler-realtime";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";

import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import {
  getMountPrefix,
  getNode,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
} from "../repository";
import deleteDefinitions from "./definition";
import { type CortexDeleteT, scopedTranslation } from "./i18n";

export class CortexDeleteRepository {
  static async deleteNode({
    userId,
    user,
    locale,
    path: rawPath,
    recursive = false,
    logger,
    t,
    relayed = false,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    recursive?: boolean;
    logger: EndpointLogger;
    t: CortexDeleteT;
    /**
     * True when invoked from a cross-instance applier (the delete was already
     * performed on the origin and relayed here). Suppresses the `node-deleted`
     * emit so the event is not relayed back, preventing an infinite ping-pong.
     */
    relayed?: boolean;
  }): Promise<
    ResponseType<{
      responsePath: string;
      nodesDeleted: number;
    }>
  > {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("delete.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Virtual writable mount - delegate to mount handler
    if (isVirtualWritable(path)) {
      const mountPrefix = getMountPrefix(path, locale);
      if (!mountPrefix) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      try {
        const { resolveVirtualDelete } = await import("../mounts/resolver");
        const result = await resolveVirtualDelete(
          // Delete removes the node — no embedding call, so no fixture chain.
          {
            userId,
            user,
            locale,
            logger,
            toolExecutionContext: rootlessToolExecutionContext(),
          },
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

    if (!isWritablePath(path, locale)) {
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
      const deletedRows = await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, userId),
            sql`(${cortexNodes.path} = ${path} OR ${cortexNodes.path} LIKE ${`${path}/%`})`,
          ),
        )
        .returning({ path: cortexNodes.path });

      const nodesDeleted = deletedRows.length;
      logger.info(`Cortex delete: ${path} (${nodesDeleted} nodes)`);

      // This op owns its `node-deleted` event: the delete the user submitted
      // (requestFields). The peer's onRemoteEvent re-runs deleteNode. Server-only.
      // Suppressed when applying a relayed delete (avoids re-relay ping-pong).
      if (!relayed) {
        createEndpointEmitter(
          deleteDefinitions.DELETE,
          logger,
          user,
        )("node-deleted", {
          requestData: { path, recursive },
        });
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

  /**
   * Cross-instance applier for `node-deleted`: re-run the delete on this instance
   * with the relayed inputs. Reuses deleteNode so there is one code path.
   */
  static async applyRemoteDelete({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof deleteDefinitions.DELETE,
    "node-deleted"
  >): Promise<void> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const result = await this.deleteNode({
      userId: user.id,
      user,
      locale: defaultLocale,
      path: requestData.path,
      recursive: requestData.recursive,
      logger,
      t,
      relayed: true,
    });
    if (!result.success) {
      logger.error("Failed to apply remote cortex delete", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(deleteDefinitions.DELETE, logger, user, {
      fanOut: false,
    })("node-deleted", {
      requestData: { path: requestData.path, recursive: requestData.recursive },
    });
  }
}
