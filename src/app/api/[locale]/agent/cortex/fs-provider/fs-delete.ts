/**
 * Filesystem Delete - removes files or directories from disk
 */

import "server-only";

import { rm, stat, unlink } from "node:fs/promises";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsDeleteResult {
  responsePath: string;
  nodesDeleted: number;
}

export async function fsDeleteNode(
  rawPath: string,
  recursive: boolean,
  { t }: FsTranslate,
): Promise<ResponseType<FsDeleteResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath = cortexPathToDisk(cortexPath);

  try {
    const st = await stat(diskPath);

    if (st.isDirectory()) {
      if (!recursive) {
        return fail({
          message: t("delete.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      await rm(diskPath, { recursive: true });
    } else {
      await unlink(diskPath);
    }

    return success({
      responsePath: diskPathToCortex(diskPath),
      nodesDeleted: 1,
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("delete.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("delete.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("delete.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
