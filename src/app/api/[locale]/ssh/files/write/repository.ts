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
  ): Promise<ResponseType<FilesWriteResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message: "SSH backend not yet implemented for file writing",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const filePath = resolvePath(data.path);

    if (!isValidPath(filePath)) {
      return fail({
        message: "Invalid path: must be absolute without '..' segments",
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
          message:
            "Parent directory not found. Set createDirs=true to create it.",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (err.code === "EACCES") {
        return fail({
          message: "Permission denied",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("Failed to write file", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
