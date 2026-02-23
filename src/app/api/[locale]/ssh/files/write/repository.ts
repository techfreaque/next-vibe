/**
 * SSH Files Write Repository
 */

import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  FilesWriteRequestOutput,
  FilesWriteResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

function resolvePath(inputPath: string): string {
  if (inputPath === "~" || inputPath.startsWith("~/")) {
    return join(homedir(), inputPath.slice(1));
  }
  return resolve(inputPath);
}

function isValidPath(p: string): boolean {
  return p.startsWith("/") && !p.includes("..");
}

export class FilesWriteRepository {
  static async write(
    data: FilesWriteRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<FilesWriteResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message: t("errors.notImplemented.fileWrite"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const filePath = resolvePath(data.path);

    if (!isValidPath(filePath)) {
      return fail({
        message: t("errors.invalidPath"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      if (data.createDirs) {
        await mkdir(dirname(filePath), { recursive: true });
      }

      const buf = Buffer.from(data.content, "utf8");
      logger.info(`Writing file: ${filePath} (${buf.length} bytes)`);
      await writeFile(filePath, buf);

      return success({ ok: true, bytesWritten: buf.length });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") {
        return fail({
          message: t("errors.parentDirNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (err.code === "EACCES") {
        return fail({
          message: t("errors.permissionDenied"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("Failed to write file", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
