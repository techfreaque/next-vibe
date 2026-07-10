import "server-only";

import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { RemoteEventHandlerProps } from "next-vibe/core/route/handler";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
/**
 * Cortex Write Repository
 * Handles creating and overwriting files in the document workspace
 */
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createEndpointEmitter } from "next-vibe/realtime/emitter";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "../../chat/config";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  ensureParentDirs,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
  parseFrontmatter,
} from "../repository";
import writeDefinitions from "./definition";
import { type CortexWriteT, scopedTranslation } from "./i18n";

export class CortexWriteRepository {
  static async writeFile({
    userId,
    user,
    locale,
    path: rawPath,
    content,
    createParents = true,
    logger,
    t,
    relayed = false,
    streamContext,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    content: string;
    createParents?: boolean;
    logger: EndpointLogger;
    t: CortexWriteT;
    /** Fixture chain of the calling execution — the embedding call binds it. */
    streamContext: ToolExecutionContext;
    /**
     * True when invoked from a cross-instance applier (the write was already
     * performed on the origin and relayed here). Suppresses the `node-written`
     * emit so the event is not relayed back, preventing an infinite ping-pong.
     */
    relayed?: boolean;
  }): Promise<
    ResponseType<{
      responsePath: string;
      size: number;
      created: boolean;
      updatedAt: Date;
      responseContent: string;
    }>
  > {
    const rawNormalized = normalizePath(rawPath);
    // Normalize locale-aware path to canonical English path for DB storage
    const path = normalizeToCanonicalPath(rawNormalized, locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Virtual writable mount - delegate to mount handler
    if (isVirtualWritable(path)) {
      const mountPrefix = getMountPrefix(path, locale);
      if (!mountPrefix) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      try {
        const { resolveVirtualWrite } = await import("../mounts/resolver");
        const result = await resolveVirtualWrite(
          { userId, user, locale, logger, streamContext },
          path,
          content,
          mountPrefix,
        );
        if (!result) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        return success({
          responsePath: result.path,
          size: Buffer.byteLength(content, "utf8"),
          created: result.created,
          updatedAt: new Date(),
          responseContent: content,
        });
      } catch (error) {
        logger.error("Cortex virtual write failed", parseError(error), {
          path,
        });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    if (!isWritablePath(path, locale)) {
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Don't allow writing to root prefixes directly
    if (path === "/documents" || path === "/memories") {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      // Create parent directories if needed
      if (createParents) {
        await ensureParentDirs(userId, path);
      }

      // Parse frontmatter from content
      const { frontmatter } = parseFrontmatter(content);

      const size = Buffer.byteLength(content, "utf8");
      const now = new Date();

      // Upsert file - ON CONFLICT handles concurrent writes safely
      const [row] = await db
        .insert(cortexNodes)
        .values({
          userId,
          path,
          nodeType: CortexNodeType.FILE,
          content,
          size,
          frontmatter,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [cortexNodes.userId, cortexNodes.path],
          set: {
            content,
            size,
            frontmatter,
            nodeType: CortexNodeType.FILE,
            updatedAt: now,
          },
        })
        .returning({
          id: cortexNodes.id,
          createdAt: cortexNodes.createdAt,
        });

      const isNew = row?.createdAt?.getTime() === now.getTime();

      logger.info(
        `Cortex write: ${path} (${size} bytes, ${isNew ? "created" : "overwritten"})`,
      );

      // Queue background embedding for semantic search
      if (row) {
        const { queueEmbedding } = await import("../embeddings/auto-embed");
        queueEmbedding(row.id, path, content, {
          billCredits: true,
          user,
          locale,
          logger,
          feature: CortexCreditFeature.WRITE,
          streamContext,
        });
      }

      // This op owns its `node-written` event: the write the user submitted
      // (requestFields). The peer's onRemoteEvent re-runs writeFile. Server-only.
      // Suppressed when applying a relayed write (avoids re-relay ping-pong).
      if (!relayed) {
        createEndpointEmitter(
          writeDefinitions.POST,
          logger,
          user,
        )("node-written", {
          requestData: { path, content, createParents },
        });
      }

      return success({
        responsePath: path,
        size,
        created: isNew,
        updatedAt: now,
        responseContent: content,
      });
    } catch (error) {
      logger.error("Cortex write failed", parseError(error), { path });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Cross-instance applier for `node-written`: re-run the write on this instance
   * with the relayed inputs. Reuses writeFile so there is one code path.
   */
  static async applyRemoteWrite({
    requestData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    typeof writeDefinitions.POST,
    "node-written"
  >): Promise<void> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const result = await this.writeFile({
      userId: user.id,
      user,
      locale: defaultLocale,
      path: requestData.path,
      content: requestData.content,
      createParents: requestData.createParents,
      logger,
      t,
      relayed: true,
      // Relayed applier — no fixture chain crosses instances; an explicit
      // thread-less context routes embeddings live.
      // no user context — UTC (dates not user-facing here)
      streamContext: makeHeadlessContext(undefined, undefined, "UTC"),
    });
    if (!result.success) {
      logger.error("Failed to apply remote cortex write", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(writeDefinitions.POST, logger, user, {
      fanOut: false,
    })("node-written", {
      requestData: {
        path: requestData.path,
        content: requestData.content,
        createParents: requestData.createParents,
      },
    });
  }
}
