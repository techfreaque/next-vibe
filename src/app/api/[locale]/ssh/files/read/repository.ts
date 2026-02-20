/**
 * SSH Files Read Repository
 */

import "server-only";

import { open } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  FilesReadRequestOutput,
  FilesReadResponseOutput,
} from "./definition";

const DEFAULT_MAX_BYTES = 65536;
const MAX_ALLOWED_BYTES = 524288;

function resolvePath(inputPath: string): string {
  if (inputPath === "~" || inputPath.startsWith("~/")) {
    return join(homedir(), inputPath.slice(1));
  }
  return resolve(inputPath);
}

function isValidPath(p: string): boolean {
  return p.startsWith("/") && !p.includes("..");
}

export class FilesReadRepository {
  static async read(
    data: FilesReadRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<FilesReadResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message: "SSH backend not yet implemented for file reading",
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

    const maxBytes = Math.min(
      data.maxBytes ?? DEFAULT_MAX_BYTES,
      MAX_ALLOWED_BYTES,
    );
    const offset = data.offset ?? 0;

    try {
      logger.debug(
        `Reading file: ${filePath} (offset=${offset}, maxBytes=${maxBytes})`,
      );

      const fh = await open(filePath, "r");
      try {
        const stat = await fh.stat();
        const size = stat.size;
        const readSize = Math.min(maxBytes, size - offset);

        if (readSize <= 0) {
          return success({
            content: "",
            size,
            truncated: false,
            encoding: "utf8",
          });
        }

        const buf = Buffer.alloc(readSize);
        await fh.read(buf, 0, readSize, offset);
        const content = buf.toString("utf8");
        const truncated = offset + readSize < size;

        return success({ content, size, truncated, encoding: "utf8" });
      } finally {
        await fh.close();
      }
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") {
        return fail({
          message: "File not found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (err.code === "EACCES") {
        return fail({
          message: "Permission denied",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("Failed to read file", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
