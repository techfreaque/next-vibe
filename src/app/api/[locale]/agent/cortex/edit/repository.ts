import "server-only";

/**
 * Cortex Edit Repository
 * Find-and-replace or line-range editing within document workspace files
 */
import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import type { EndpointLogger } from "../../../system/logger/types";
import { UserPermissionRole } from "../../../user/user-roles/enum";
import { applyFindReplace, applyLineReplace } from "../_shared/edit-operations";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import {
  getMountPrefix,
  getNode,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
  normalizeToCanonicalPath,
  parseFrontmatter,
} from "../repository";
import editDefinitions from "./definition";
import { type CortexEditT, scopedTranslation } from "./i18n";

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
    relayed = false,
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
    /**
     * True when invoked from a cross-instance applier (the edit was already
     * performed on the origin and relayed here). Suppresses the `node-written`
     * emit so the event is not relayed back, preventing an infinite ping-pong.
     */
    relayed?: boolean;
  }): Promise<
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
          message: t("patch.errors.findNotFound", {
            details: `"${find.slice(0, 120)}${find.length > 120 ? "…" : ""}" in ${path}. Use cortex-read to get the current file content and retry with the exact text.`,
          }),
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
          message: t("patch.errors.invalidParams", {
            details: `Line range ${startLine}-${endLine} is out of bounds. File has ${lineCount} lines.`,
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      content = applyLineReplace(content, startLine, endLine, newContent);
      replacements = 1;
    } else {
      return fail({
        message: t("patch.errors.invalidParams", {
          details: `Use {find+replace} or {startLine+endLine+newContent}. Got: find=${find !== undefined ? "set" : "unset"}, replace=${replace !== undefined ? "set" : "unset"}, startLine=${startLine !== undefined ? "set" : "unset"}, endLine=${endLine !== undefined ? "set" : "unset"}, newContent=${newContent !== undefined ? "set" : "unset"}`,
        }),
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

    // This op owns its `node-written` event: the edit the user submitted
    // (requestFields). The peer's onRemoteEvent re-runs editFile. Server-only.
    // Suppressed when applying a relayed edit (avoids re-relay ping-pong).
    if (!relayed) {
      createEndpointEmitter(
        editDefinitions.PATCH,
        logger,
        user,
      )("node-written", {
        path,
        find,
        replace,
        startLine,
        endLine,
        newContent,
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
    const current = await resolveVirtualRead(
      userId,
      path,
      mountPrefix,
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN),
      locale,
    );
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
          message: t("patch.errors.findNotFound", {
            details: `"${find.slice(0, 120)}${find.length > 120 ? "…" : ""}" in ${path}. Use cortex-read to get the current file content and retry with the exact text.`,
          }),
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
          message: t("patch.errors.invalidParams", {
            details: `Line range ${startLine}-${endLine} is out of bounds. File has ${lineCount} lines.`,
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      content = applyLineReplace(content, startLine, endLine, newContent);
      replacements = 1;
    } else {
      return fail({
        message: t("patch.errors.invalidParams", {
          details: `Use {find+replace} or {startLine+endLine+newContent}. Got: find=${find !== undefined ? "set" : "unset"}, replace=${replace !== undefined ? "set" : "unset"}, startLine=${startLine !== undefined ? "set" : "unset"}, endLine=${endLine !== undefined ? "set" : "unset"}, newContent=${newContent !== undefined ? "set" : "unset"}`,
        }),
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

  /**
   * Cross-instance applier for `node-written`: re-run the edit on this instance
   * with the relayed inputs. Reuses editFile so there is one code path.
   */
  static async applyRemoteEdit(
    payload: {
      path: string;
      find?: string;
      replace?: string;
      startLine?: number;
      endLine?: number;
      newContent?: string;
    },
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<void> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const result = await this.editFile({
      userId: user.id,
      user,
      locale: defaultLocale,
      path: payload.path,
      find: payload.find,
      replace: payload.replace,
      startLine: payload.startLine,
      endLine: payload.endLine,
      newContent: payload.newContent,
      logger,
      t,
      relayed: true,
    });
    if (!result.success) {
      logger.error("Failed to apply remote cortex edit", {
        message: result.message,
      });
    }
  }
}
