import "server-only";

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

import type { CortexMkdirT } from "./i18n";
import { cortexNodes } from "../db";
import { CortexNodeType, type CortexViewTypeValue } from "../enum";
import {
  ensureParentDirs,
  isValidPath,
  isWritablePath,
  normalizePath,
  pathExists,
} from "../repository";

interface MkdirParams {
  userId: string;
  user: JwtPrivatePayloadType;
  path: string;
  viewType?: CortexViewTypeValue;
  createParents?: boolean;
  logger: EndpointLogger;
  t: CortexMkdirT;
}

export class CortexMkdirRepository {
  static async createDirectory({
    userId,
    user,
    path: rawPath,
    viewType,
    createParents = true,
    logger,
    t,
  }: MkdirParams): Promise<
    ResponseType<{ responsePath: string; created: boolean }>
  > {
    const path = normalizePath(rawPath);

    if (!isValidPath(path)) {
      return fail({
        message: t("post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    if (!user.isPublic) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { fsMkdir } = await import("../fs-provider/fs-mkdir");
        return fsMkdir(path, createParents, { t });
      }
    }

    if (!isWritablePath(path)) {
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
