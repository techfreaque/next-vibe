/**
 * SSH Files Write Repository
 */

import "server-only";

import { mkdir, realpath, writeFile } from "node:fs/promises";
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

/**
 * Allowed base directories for local file writes.
 * See ssh/files/read/repository.ts for rationale.
 */
function getAllowedBases(): string[] {
  const override = process.env["SSH_FILES_ALLOWED_BASE"];
  if (override) {
    return override
      .split(":")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [homedir()];
}

function resolvePath(inputPath: string): string {
  if (inputPath === "~" || inputPath.startsWith("~/")) {
    return join(homedir(), inputPath.slice(1));
  }
  return resolve(inputPath);
}

function isValidPath(p: string): boolean {
  if (!p.startsWith("/") || p.includes("..")) {
    return false;
  }
  const allowedBases = getAllowedBases();
  return allowedBases.some((base) => p === base || p.startsWith(`${base}/`));
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

      // Resolve symlinks on the parent directory to prevent a symlink in the
      // allowed base from redirecting the write to a path outside it.
      // For new files (ENOENT), realpath on the parent is sufficient.
      let realFilePath: string;
      try {
        realFilePath = await realpath(filePath);
      } catch (e) {
        const err = e as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
          // File doesn't exist yet — resolve the parent dir instead
          try {
            const parentReal = await realpath(dirname(filePath));
            realFilePath = `${parentReal}/${filePath.split("/").pop() ?? ""}`;
          } catch {
            return fail({
              message: t("errors.parentDirNotFound"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
        } else if (err.code === "EACCES") {
          return fail({
            message: t("errors.permissionDenied"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        } else {
          logger.error("Failed to resolve real path", parseError(e));
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      if (!isValidPath(realFilePath)) {
        return fail({
          message: t("errors.invalidPath"),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      const buf = Buffer.from(data.content, "utf8");
      logger.info(`Writing file: ${realFilePath} (${buf.length} bytes)`);
      await writeFile(realFilePath, buf);

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
