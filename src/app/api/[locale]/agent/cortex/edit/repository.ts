import "server-only";

/**
 * Cortex Edit Repository
 * Find-and-replace or line-range editing within document workspace files
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CortexEditT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  getNode,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizeToCanonicalPath,
  normalizePath,
  parseFrontmatter,
} from "../repository";
import { applyFindReplace, applyLineReplace } from "../_shared/edit-operations";

interface EditParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  find?: string;
  replace?: string;
  startLine?: number;
  endLine?: number;
  newContent?: string;
  logger: EndpointLogger;
  t: CortexEditT;
}

export class CortexEditRepository {
  static async editFile({
    userId,
    user,
    locale,
    path: rawPath,
    find,
    replace,
    startLine,
    endLine,
    newContent,
    logger,
    t,
  }: EditParams): Promise<
    ResponseType<{
      responsePath: string;
      size: number;
      replacements: number;
      updatedAt: string;
    }>
  > {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("patch.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    // Skip for virtual writable mounts - they go through mount handlers → DB → disk write-through
    if (!user.isPublic && !isVirtualWritable(path)) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { fsEditFile } = await import("../fs-provider/fs-edit");
        return fsEditFile({
          path,
          find,
          replace,
          startLine,
          endLine,
          newContent,
          t,
        });
      }
    }

    // Virtual writable mount - read via mount, apply edit, write back via mount
    if (isVirtualWritable(path)) {
      return CortexEditRepository.editVirtualMount({
        userId,
        user,
        locale,
        path,
        find,
        replace,
        startLine,
        endLine,
        newContent,
        logger,
        t,
      });
    }

    if (!isWritablePath(path, locale)) {
      return fail({
        message: t("patch.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const node = await getNode(userId, path);
    if (!node) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    if (node.nodeType === CortexNodeType.DIR) {
      return fail({
        message: t("patch.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    let content = node.content ?? "";
    let replacements = 0;

    // Strategy 1: Find and replace
    if (find !== undefined && replace !== undefined) {
      const result = applyFindReplace(content, find, replace);
      if (result.replacements === 0) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      content = result.content;
      replacements = result.replacements;
    }
    // Strategy 2: Line range replace
    else if (
      startLine !== undefined &&
      endLine !== undefined &&
      newContent !== undefined
    ) {
      const lineCount = content.split("\n").length;
      if (startLine > lineCount || endLine > lineCount) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      content = applyLineReplace(content, startLine, endLine, newContent);
      replacements = 1;
    } else {
      return fail({
        message: t("patch.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const { frontmatter } = parseFrontmatter(content);
    const size = Buffer.byteLength(content, "utf8");
    const now = new Date();

    try {
      await db
        .update(cortexNodes)
        .set({ content, size, frontmatter, updatedAt: now })
        .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)));
    } catch (error) {
      logger.error(`Cortex edit failed: ${path}`, parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    logger.info(`Cortex edit: ${path} (${replacements} replacements)`);

    // Disk write-through for documents
    try {
      const { syncToDisk } = await import("../fs-provider/fs-sync");
      await syncToDisk(path, content);
    } catch {
      // Best-effort
    }

    // Queue background re-embedding for semantic search
    if (node.id) {
      const { queueEmbedding } = await import("../embeddings/auto-embed");
      queueEmbedding(node.id, path, content, {
        billCredits: true,
        user,
        locale,
        logger,
        feature: CortexCreditFeature.EDIT,
      });
    }

    return success({
      responsePath: path,
      size,
      replacements,
      updatedAt: now.toISOString(),
    });
  }

  /**
   * Edit a virtual mount file: read current content, apply edit, write back
   */
  private static async editVirtualMount({
    userId,
    user,
    locale,
    path,
    find,
    replace,
    startLine,
    endLine,
    newContent,
    logger,
    t,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    find?: string;
    replace?: string;
    startLine?: number;
    endLine?: number;
    newContent?: string;
    logger: EndpointLogger;
    t: CortexEditT;
  }): Promise<
    ResponseType<{
      responsePath: string;
      size: number;
      replacements: number;
      updatedAt: string;
    }>
  > {
    const mountPrefix = getMountPrefix(path, locale);
    if (!mountPrefix) {
      return fail({
        message: t("patch.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Read current content via virtual mount
    const { resolveVirtualRead, resolveVirtualWrite } =
      await import("../mounts/resolver");
    const current = await resolveVirtualRead(userId, path, mountPrefix);
    if (!current) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    let content = current.content;
    let replacements = 0;

    // Strategy 1: Find and replace
    if (find !== undefined && replace !== undefined) {
      const result = applyFindReplace(content, find, replace);
      if (result.replacements === 0) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      content = result.content;
      replacements = result.replacements;
    }
    // Strategy 2: Line range replace
    else if (
      startLine !== undefined &&
      endLine !== undefined &&
      newContent !== undefined
    ) {
      const lineCount = content.split("\n").length;
      if (startLine > lineCount || endLine > lineCount) {
        return fail({
          message: t("patch.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      content = applyLineReplace(content, startLine, endLine, newContent);
      replacements = 1;
    } else {
      return fail({
        message: t("patch.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Write back via virtual mount
    const writeResult = await resolveVirtualWrite(
      { userId, user, locale, logger },
      path,
      content,
      mountPrefix,
    );

    if (!writeResult) {
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const size = Buffer.byteLength(content, "utf8");
    logger.info(`Cortex virtual edit: ${path} (${replacements} replacements)`);

    return success({
      responsePath: path,
      size,
      replacements,
      updatedAt: new Date().toISOString(),
    });
  }
}
