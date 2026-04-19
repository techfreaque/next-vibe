/**
 * Filesystem Edit — find/replace or line-range edit on disk files
 */

import "server-only";

import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsEditResult {
  responsePath: string;
  size: number;
  replacements: number;
  updatedAt: string;
}

interface FsEditParams extends FsTranslate {
  path: string;
  find?: string;
  replace?: string;
  startLine?: number;
  endLine?: number;
  newContent?: string;
}

export async function fsEditFile({
  path: rawPath,
  find,
  replace,
  startLine,
  endLine,
  newContent,
  t,
}: FsEditParams): Promise<ResponseType<FsEditResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath = cortexPathToDisk(cortexPath);

  try {
    const original = await readFile(diskPath, "utf8");
    let edited: string;
    let replacements = 0;

    if (find !== undefined && replace !== undefined) {
      // Find and replace
      const parts = original.split(find);
      replacements = parts.length - 1;
      if (replacements === 0) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      edited = parts.join(replace);
    } else if (
      startLine !== undefined &&
      endLine !== undefined &&
      newContent !== undefined
    ) {
      // Line-range replace
      const lines = original.split("\n");
      const before = lines.slice(0, startLine - 1);
      const after = lines.slice(endLine);
      edited = [...before, newContent, ...after].join("\n");
      replacements = 1;
    } else {
      return fail({
        message: t("patch.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Atomic write
    const tmpPath = join(dirname(diskPath), `.${Date.now()}.tmp`);
    await writeFile(tmpPath, edited, "utf8");
    await rename(tmpPath, diskPath);

    const size = Buffer.byteLength(edited, "utf8");

    return success({
      responsePath: diskPathToCortex(diskPath),
      size,
      replacements,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("patch.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("patch.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
