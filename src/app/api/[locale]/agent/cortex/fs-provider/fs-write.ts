/**
 * Filesystem Write - creates or overwrites a file on disk
 */

import "server-only";

import { mkdir, rename, stat, writeFile } from "node:fs/promises";
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

interface FsWriteResult {
  responsePath: string;
  size: number;
  created: boolean;
  updatedAt: string;
  responseContent: string;
}

export async function fsWriteFile(
  rawPath: string,
  content: string,
  { t }: FsTranslate,
): Promise<ResponseType<FsWriteResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath = cortexPathToDisk(cortexPath);

  try {
    // Check if file already exists
    let created = true;
    try {
      await stat(diskPath);
      created = false;
    } catch {
      // File doesn't exist - will be created
    }

    // Ensure parent directories exist
    await mkdir(dirname(diskPath), { recursive: true });

    // Atomic write: write to tmp then rename
    const tmpPath = join(dirname(diskPath), `.${Date.now()}.tmp`);
    await writeFile(tmpPath, content, "utf8");
    await rename(tmpPath, diskPath);

    const size = Buffer.byteLength(content, "utf8");

    return success({
      responsePath: diskPathToCortex(diskPath),
      size,
      created,
      updatedAt: new Date().toISOString(),
      responseContent: content,
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
