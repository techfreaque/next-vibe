/**
 * Filesystem Read — reads a file from disk
 */

import "server-only";

import { readFile, stat } from "node:fs/promises";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsReadResult {
  responsePath: string;
  content: string;
  size: number;
  truncated: boolean;
  readonly: boolean;
  nodeType: string;
  updatedAt: string;
}

export async function fsReadFile(
  rawPath: string,
  maxLines: number | undefined,
  { t }: FsTranslate,
): Promise<ResponseType<FsReadResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath = cortexPathToDisk(cortexPath);

  try {
    const st = await stat(diskPath);

    if (st.isDirectory()) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    let content = await readFile(diskPath, "utf8");
    let truncated = false;

    if (maxLines) {
      const lines = content.split("\n");
      if (lines.length > maxLines) {
        content = lines.slice(0, maxLines).join("\n");
        truncated = true;
      }
    }

    return success({
      responsePath: diskPathToCortex(diskPath),
      content,
      size: st.size,
      truncated,
      readonly: false,
      nodeType: "file",
      updatedAt: st.mtime.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
