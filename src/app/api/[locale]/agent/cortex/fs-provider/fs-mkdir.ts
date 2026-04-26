/**
 * Filesystem Mkdir — creates directories on disk
 */

import "server-only";

import { mkdir, stat } from "node:fs/promises";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsMkdirResult {
  responsePath: string;
  created: boolean;
}

export async function fsMkdir(
  rawPath: string,
  createParents: boolean,
  { t }: FsTranslate,
): Promise<ResponseType<FsMkdirResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath = cortexPathToDisk(cortexPath);

  try {
    // Check if already exists
    try {
      const st = await stat(diskPath);
      if (st.isDirectory()) {
        return success({
          responsePath: diskPathToCortex(diskPath),
          created: false,
        });
      }
      // Path exists but is a file — conflict
      return fail({
        message: t("post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    } catch {
      // Doesn't exist — create it
    }

    await mkdir(diskPath, { recursive: createParents });

    return success({
      responsePath: diskPathToCortex(diskPath),
      created: true,
    });
  } catch (error) {
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
