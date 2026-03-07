/**
 * SSH Files Read Repository
 */

import "server-only";

import { open, realpath } from "node:fs/promises";
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
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const DEFAULT_MAX_BYTES = 65536;
const MAX_ALLOWED_BYTES = 524288;

/**
 * Allowed base directories for local file access.
 * Paths outside these roots are rejected — prevents reading arbitrary system files
 * (e.g. /etc/passwd, /proc/*, private keys) via path traversal or symlink attacks.
 *
 * Defaults to the user's home directory. Override with SSH_FILES_ALLOWED_BASE env var
 * (colon-separated list of absolute paths, e.g. "/home/user:/data").
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

export class FilesReadRepository {
  static async read(
    data: FilesReadRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<FilesReadResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message: t("errors.notImplemented.fileRead"),
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

    // Resolve symlinks to their real path and re-validate.
    // resolve() normalises ".." but does NOT dereference symlinks.
    // A symlink inside the allowed base can still point outside it.
    let realFilePath: string;
    try {
      realFilePath = await realpath(filePath);
    } catch {
      return fail({
        message: t("errors.fileNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    if (!isValidPath(realFilePath)) {
      return fail({
        message: t("errors.invalidPath"),
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
        `Reading file: ${realFilePath} (offset=${offset}, maxBytes=${maxBytes})`,
      );

      const fh = await open(realFilePath, "r");
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
          message: t("errors.fileNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (err.code === "EACCES") {
        return fail({
          message: t("errors.permissionDenied"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("Failed to read file", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
