import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
import type { CortexDeleteT } from "./i18n";

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
      // Soft-delete: mark isDeleted=true + bump updatedAt so tombstone propagates to
      // connected remote instances via WS push. Hard-delete deferred until propagated.
      const deletedAt = new Date();
      const result = await db
        .update(cortexNodes)
        .set({ isDeleted: true, updatedAt: deletedAt })
        .where(
          and(
            eq(cortexNodes.userId, userId),
            or(
              eq(cortexNodes.path, path),
              sql`${cortexNodes.path} LIKE ${`${path}/%`}`,
            ),
          ),
        );

      const nodesDeleted = result.rowCount ?? 0;
      logger.info(
        `Cortex soft-delete: ${path} (${nodesDeleted} nodes marked deleted)`,
      );

      // WS-push sync: broadcast tombstone to connected remote instances
      void (async (): Promise<void> => {
        try {
          const { serializeProviders } =
            await import("@/app/api/[locale]/remote-connection/sync-provider");
          const { broadcastSyncNotify } =
            await import("@/app/api/[locale]/system/unified-interface/websocket/emitter");
          const providerKey = path.startsWith("/memories")
            ? "memories"
            : "documents";
          const syncPayloads = await serializeProviders(
            [providerKey],
            userId,
            logger,
          );
          broadcastSyncNotify(userId, syncPayloads, logger);
        } catch {
          // Best-effort
        }
      })();

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
