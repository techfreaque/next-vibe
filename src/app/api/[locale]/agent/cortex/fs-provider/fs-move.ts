/**
 * Filesystem Move — renames/moves files or directories on disk
 */

import "server-only";

import { mkdir, rename } from "node:fs/promises";
import { dirname } from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsMoveResult {
  responseFrom: string;
  responseTo: string;
  nodesAffected: number;
}

export async function fsMoveNode(
  rawFrom: string,
  rawTo: string,
  { t }: FsTranslate,
): Promise<ResponseType<FsMoveResult>> {
  const fromCortex = normalizePath(rawFrom);
  const toCortex = normalizePath(rawTo);
  const fromDisk = cortexPathToDisk(fromCortex);
  const toDisk = cortexPathToDisk(toCortex);

  try {
    // Ensure destination parent exists
    await mkdir(dirname(toDisk), { recursive: true });

    await rename(fromDisk, toDisk);

    return success({
      responseFrom: diskPathToCortex(fromDisk),
      responseTo: diskPathToCortex(toDisk),
      nodesAffected: 1,
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
