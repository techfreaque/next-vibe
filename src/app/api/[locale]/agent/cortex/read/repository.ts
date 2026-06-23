import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

/**
 * Cortex Read Repository
 * Reads files from both the document workspace and virtual mounts
 */
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

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
import type { CortexReadResponseOutput } from "./definition";
import type { CortexReadT } from "./i18n";

export class CortexReadRepository {
  static async readFile({
    userId,
    user,
    locale,
    path: rawPath,
    maxLines,
    logger,
    t,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    maxLines?: number;
    logger: EndpointLogger;
    t: CortexReadT;
  }): Promise<ResponseType<CortexReadResponseOutput>> {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const mountPrefix = getMountPrefix(path, locale);

    // Virtual mount reads - delegate to mount resolvers
    if (mountPrefix && !isWritablePath(path, locale)) {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      return CortexReadRepository.readVirtualMount(
        userId,
        path,
        mountPrefix,
        maxLines,
        logger,
        t,
        isAdmin,
        locale,
      );
    }

    // Document workspace read
    const node = await getNode(userId, path);
    if (!node) {
      // Fallback: check virtual templates. Path is already canonical (/memories/..., /documents/...).
      const { getAllTemplates } = await import("../seeds/templates");
      if (path.startsWith("/memories/")) {
        const templates = getAllTemplates(locale);
        const template = templates.find(
          (item) => item.seedOnlyNew && item.path === path,
        );
        if (template) {
          const content = template.content;
          return success({
            responsePath: path,
            content,
            size: Buffer.byteLength(content, "utf8"),
            truncated: false,
            readonly: false,
            nodeType: "file",
            updatedAt: new Date().toISOString(),
          });
        }
      } else if (path.startsWith("/documents/")) {
        const templates = getAllTemplates(locale);
        const template = templates.find(
          (item) => item.updateIfUnchanged && item.path === path,
        );
        if (template) {
          const content = template.content;
          return success({
            responsePath: path,
            content,
            size: Buffer.byteLength(content, "utf8"),
            truncated: false,
            readonly: false,
            nodeType: "file",
            updatedAt: new Date().toISOString(),
          });
        }
      }
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    if (node.nodeType === CortexNodeType.DIR) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    let content = node.content ?? "";
    let truncated = false;

    if (maxLines) {
      const lines = content.split("\n");
      if (lines.length > maxLines) {
        content = lines.slice(0, maxLines).join("\n");
        truncated = true;
      }
    }

    return success({
      responsePath: path,
      content,
      size: node.size,
      truncated,
      readonly: false,
      nodeType: "file",
      updatedAt: node.updatedAt.toISOString(),
    });
  }

  /**
   * Read from virtual mounts (/threads/, /memories/, /skills/, /tasks/)
   * These resolve to existing tables and render as markdown.
   */
  private static async readVirtualMount(
    userId: string,
    path: string,
    mountPrefix: string,
    maxLines: number | undefined,
    logger: EndpointLogger,
    t: CortexReadT,
    isAdmin: boolean,
    locale: CountryLanguage,
  ): Promise<ResponseType<CortexReadResponseOutput>> {
    try {
      // Dynamic import to avoid pulling in all mount code at module load
      const { resolveVirtualRead } = await import("../mounts/resolver");
      const result = await resolveVirtualRead(
        userId,
        path,
        mountPrefix,
        isAdmin,
        locale,
      );

      if (!result) {
        // Path may be a directory in the virtual mount - render a listing summary
        const { resolveVirtualList } = await import("../mounts/resolver");
        const entries = await resolveVirtualList(
          userId,
          path,
          mountPrefix,
          isAdmin,
        );
        // Treat as a dir if it has entries OR if it's a known dir path (mount root or subdir)
        const isKnownDir =
          path === mountPrefix || path.startsWith(`${mountPrefix}/`);
        if (entries.length > 0 || isKnownDir) {
          const lines = [`# ${path}`, ""];
          for (const entry of entries) {
            const icon = entry.nodeType === "dir" ? "📁" : "📄";
            lines.push(`${icon} ${entry.name}`);
          }
          if (entries.length === 0) {
            lines.push("*(empty)*");
          }
          const content = lines.join("\n");
          return success({
            responsePath: path,
            content,
            size: Buffer.byteLength(content, "utf8"),
            truncated: false,
            readonly: true,
            nodeType: "dir",
            updatedAt: new Date().toISOString(),
          });
        }
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      let content = result.content;
      let truncated = false;

      if (maxLines) {
        const lines = content.split("\n");
        if (lines.length > maxLines) {
          content = lines.slice(0, maxLines).join("\n");
          truncated = true;
        }
      }

      return success({
        responsePath: path,
        content,
        size: Buffer.byteLength(content, "utf8"),
        truncated,
        readonly: !isVirtualWritable(path),
        nodeType: result.nodeType,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error("Cortex virtual mount read failed", parseError(error), {
        path,
      });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
