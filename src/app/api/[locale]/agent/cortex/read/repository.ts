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

import type { CortexReadT } from "./i18n";
import { CortexNodeType } from "../enum";
import {
  getNode,
  getMountPrefix,
  isValidPath,
  isVirtualWritable,
  isWritablePath,
  normalizePath,
} from "../repository";

interface ReadParams {
  userId: string;
  user: JwtPrivatePayloadType;
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
    path: rawPath,
    maxLines,
    logger,
    t,
  }: ReadParams): Promise<ResponseType<ReadResult>> {
    const path = normalizePath(rawPath);

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
        const mountPrefix = getMountPrefix(path);
        if (mountPrefix) {
          const { ensureMountPopulated } =
            await import("../fs-provider/fs-populate");
          await ensureMountPopulated(mountPrefix, userId, logger);
        }
        const { fsReadFile } = await import("../fs-provider/fs-read");
        return fsReadFile(path, maxLines, { t });
      }
    }

    const mountPrefix = getMountPrefix(path);

    // Virtual mount reads — delegate to mount resolvers
    if (mountPrefix && !isWritablePath(path)) {
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
