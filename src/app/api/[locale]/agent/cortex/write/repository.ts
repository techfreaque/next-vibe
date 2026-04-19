import "server-only";

/**
 * Cortex Write Repository
 * Handles creating and overwriting files in the document workspace
 */

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

import type { CortexWriteT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  ensureParentDirs,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  parseFrontmatter,
} from "../repository";

interface WriteParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  content: string;
  createParents?: boolean;
  logger: EndpointLogger;
  t: CortexWriteT;
}

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
  }: WriteParams): Promise<
    ResponseType<{
      responsePath: string;
      size: number;
      created: boolean;
      updatedAt: string;
    }>
  > {
    const path = normalizePath(rawPath);

    if (!isValidPath(path)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    // Skip for virtual writable mounts — they go through mount handlers → DB → disk write-through
    if (!user.isPublic && !isVirtualWritable(path)) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { fsWriteFile } = await import("../fs-provider/fs-write");
        return fsWriteFile(path, content, { t });
      }
    }

    // Virtual writable mount — delegate to mount handler
    if (isVirtualWritable(path)) {
      const mountPrefix = getMountPrefix(path);
      if (!mountPrefix) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      try {
        const { resolveVirtualWrite } = await import("../mounts/resolver");
        const result = await resolveVirtualWrite(
          { userId, user, locale, logger },
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
          updatedAt: new Date().toISOString(),
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

    if (!isWritablePath(path)) {
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

      // Upsert file — ON CONFLICT handles concurrent writes safely
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

      // Disk write-through for documents
      try {
        const { syncToDisk } = await import("../fs-provider/fs-sync");
        await syncToDisk(path, content);
      } catch {
        // Best-effort
      }

      // Queue background embedding for semantic search
      if (row) {
        const { queueEmbedding } = await import("../embeddings/auto-embed");
        queueEmbedding(row.id, path, content, {
          billCredits: true,
          user,
          locale,
          logger,
          feature: CortexCreditFeature.WRITE,
        });
      }

      return success({
        responsePath: path,
        size,
        created: isNew,
        updatedAt: now.toISOString(),
      });
    } catch (error) {
      logger.error("Cortex write failed", parseError(error), { path });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
