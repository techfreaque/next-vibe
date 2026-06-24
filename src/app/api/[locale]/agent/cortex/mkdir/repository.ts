import "server-only";

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
import { CortexNodeType, type CortexViewTypeValue } from "../enum";
import {
  ensureParentDirs,
  isValidPath,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
  pathExists,
} from "../repository";
import mkdirDefinitions from "./definition";
import { type CortexMkdirT, scopedTranslation } from "./i18n";

export class CortexMkdirRepository {
  static async createDirectory({
    userId,
    user,
    locale,
    path: rawPath,
    viewType,
    createParents = true,
    logger,
    t,
    relayed = false,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    viewType?: CortexViewTypeValue;
    createParents?: boolean;
    logger: EndpointLogger;
    t: CortexMkdirT;
    /**
     * True when invoked from a cross-instance applier (the mkdir was already
     * performed on the origin and relayed here). Suppresses the `node-written`
     * emit so the event is not relayed back, preventing an infinite ping-pong.
     */
    relayed?: boolean;
  }): Promise<
    ResponseType<{
      responsePath: string;
      created: boolean;
    }>
  > {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
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
        return success({ responsePath: path, created: false });
      }

      if (createParents) {
        await ensureParentDirs(userId, `${path}/placeholder`);
      }

      // onConflictDoNothing: ensureParentDirs may have already created this dir
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
        .onConflictDoNothing();

      logger.info(
        `Cortex mkdir: ${path}${viewType ? ` (viewType: ${viewType})` : ""}`,
      );

      // This op owns its `node-written` event: the mkdir the user submitted
      // (requestFields). The peer's onRemoteEvent re-runs createDirectory.
      // Server-only. Suppressed when applying a relayed mkdir (avoids re-relay
      // ping-pong).
      if (!relayed) {
        createEndpointEmitter(
          mkdirDefinitions.POST,
          logger,
          user,
        )("node-written", {
          requestData: { path, viewType, createParents },
        });
      }

      return success({ responsePath: path, created: true });
    } catch (error) {
      logger.error("Cortex mkdir failed", parseError(error), { path });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for `node-written`: re-run the mkdir on this instance
   * with the relayed inputs. Reuses createDirectory so there is one code path.
   */
  static async applyRemoteMkdir({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof mkdirDefinitions.POST,
    "node-written"
  >): Promise<void> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const result = await this.createDirectory({
      userId: user.id,
      user,
      locale: defaultLocale,
      path: requestData.path,
      viewType: requestData.viewType,
      createParents: requestData.createParents,
      logger,
      t,
      relayed: true,
    });
    if (!result.success) {
      logger.error("Failed to apply remote cortex mkdir", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(mkdirDefinitions.POST, logger, user, {
      fanOut: false,
    })("node-written", {
      requestData: {
        path: requestData.path,
        viewType: requestData.viewType,
        createParents: requestData.createParents,
      },
    });
  }
}
