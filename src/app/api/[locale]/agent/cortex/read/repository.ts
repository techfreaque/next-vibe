import "server-only";

/**
 * Cortex Read Repository
 * Reads files from both the document workspace and virtual mounts
 */

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

import type { CortexReadT } from "./i18n";
import { CortexNodeType } from "../enum";
import {
  getNode,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizeToCanonicalPath,
  normalizePath,
} from "../repository";

interface ReadParams {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  path: string;
  maxLines?: number;
  logger: EndpointLogger;
  t: CortexReadT;
}

interface ReadResult {
  responsePath: string;
  content: string;
  size: number;
  truncated: boolean;
  readonly: boolean;
  nodeType: string;
  updatedAt: string;
}

export class CortexReadRepository {
  static async readFile({
    userId,
    user,
    locale,
    path: rawPath,
    maxLines,
    logger,
    t,
  }: ReadParams): Promise<ResponseType<ReadResult>> {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    if (!user.isPublic) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const mountPrefix = getMountPrefix(path, locale);
        // Virtual mounts are not on disk — delegate to virtual resolver inline
        if (mountPrefix && !isWritablePath(path, locale)) {
          return CortexReadRepository.readVirtualMount(
            userId,
            path,
            mountPrefix,
            maxLines,
            logger,
            t,
          );
        }
        // Native paths (memories, documents) — use filesystem
        if (mountPrefix) {
          const { ensureMountPopulated } =
            await import("../fs-provider/fs-populate");
          await ensureMountPopulated(mountPrefix, userId, logger);
        }
        const { fsReadFile } = await import("../fs-provider/fs-read");
        const fsResult = await fsReadFile(path, maxLines, { t });
        if (fsResult.success) {
          return fsResult;
        }
        // Non-NOT_FOUND error (e.g. FORBIDDEN, INTERNAL) — return immediately
        if (fsResult.errorType !== ErrorResponseTypes.NOT_FOUND) {
          return fsResult;
        }
        // NOT_FOUND on disk — check virtual templates (memories/documents only)
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
        return fsResult; // genuine NOT_FOUND
      }
    }

    const mountPrefix = getMountPrefix(path, locale);

    // Virtual mount reads — delegate to mount resolvers
    if (mountPrefix && !isWritablePath(path, locale)) {
      return CortexReadRepository.readVirtualMount(
        userId,
        path,
        mountPrefix,
        maxLines,
        logger,
        t,
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
  ): Promise<ResponseType<ReadResult>> {
    try {
      // Dynamic import to avoid pulling in all mount code at module load
      const { resolveVirtualRead } = await import("../mounts/resolver");
      const result = await resolveVirtualRead(userId, path, mountPrefix);

      if (!result) {
        // Path may be a directory in the virtual mount — render a listing summary
        const { resolveVirtualList } = await import("../mounts/resolver");
        const entries = await resolveVirtualList(userId, path, mountPrefix);
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
