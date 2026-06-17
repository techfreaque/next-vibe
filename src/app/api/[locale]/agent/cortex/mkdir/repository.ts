import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import {
  ErrorResponseTypes,
  success,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { cortexNodes } from "../db";
import { CortexNodeType, type CortexViewTypeValue } from "../enum";
import {
  ensureParentDirs,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
import type { CortexMkdirT } from "./i18n";
  pathExists,
} from "../repository";

interface MkdirParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  viewType?: CortexViewTypeValue;
  createParents?: boolean;
  logger: EndpointLogger;
  t: CortexMkdirT;
}

export class CortexMkdirRepository {
  static async createDirectory({
    userId,
    locale,
    path: rawPath,
    viewType,
    createParents = true,
    logger,
    t,
  }: MkdirParams): Promise<
    ResponseType<{ responsePath: string; created: boolean }>
  > {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // SSH virtual mount — create real directory on machine
    if (isVirtualWritable(path)) {
      const mountPrefix = getMountPrefix(path, locale);
      if (mountPrefix === "/ssh") {
        try {
          const { mkdirSshPath } = await import("../mounts/ssh");
          const ok = await mkdirSshPath(userId, path);
          if (!ok) {
            return fail({
              message: t("post.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
          return success({ responsePath: path, created: true });
        } catch (error) {
          logger.error("Cortex ssh mkdir failed", parseError(error), { path });
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (!isWritablePath(path, locale)) {
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (path === "/documents") {
      return fail({
        message: t("post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    try {
      const exists = await pathExists(userId, path);
      if (exists) {
        // Dir already exists. If an explicit viewType was requested, apply it
        // (so `mkdir --view kanban` on an existing dir sets the view); otherwise
        // leave it untouched. Either way this is not a fresh creation.
        if (viewType) {
          await db
            .update(cortexNodes)
            .set({ viewType, updatedAt: new Date() })
            .where(
              and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)),
            );
        }
        return success({ responsePath: path, created: false });
      }

      if (createParents) {
        await ensureParentDirs(userId, `${path}/placeholder`);
      }

      // ensureParentDirs above may have already materialized this dir row
      // (without a viewType). Upsert so an explicit viewType is applied to the
      // target dir whether the row pre-existed or not. When no viewType was
      // requested, leave any existing viewType untouched (no-op on conflict).
      await db
        .insert(cortexNodes)
        .values({
          userId,
          path,
          nodeType: CortexNodeType.DIR,
          content: null,
          size: 0,
          viewType: viewType ?? null,
        })
        .onConflictDoUpdate({
          target: [cortexNodes.userId, cortexNodes.path],
          set: viewType
            ? { viewType, updatedAt: new Date() }
            : { updatedAt: new Date() },
        });

      logger.info(
        `Cortex mkdir: ${path}${viewType ? ` (viewType: ${viewType})` : ""}`,
      );

      // WS-push sync: broadcast changed provider to connected remote instances
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
          // Best-effort: cron fallback handles missed syncs
        }
      })();

      return success({ responsePath: path, created: true });
    } catch (error) {
      logger.error("Cortex mkdir failed", parseError(error), { path });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
