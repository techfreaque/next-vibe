/**
 * SSH Files List Repository
 * Lists directory contents using local fs/promises
 */

import "server-only";

import { readdir, stat } from "node:fs/promises";
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
  FilesListRequestOutput,
  FilesListResponseOutput,
} from "./definition";

function resolvePath(inputPath?: string): string {
  const raw = inputPath ?? "~";
  if (raw === "~" || raw.startsWith("~/")) {
    return join(homedir(), raw.slice(1));
  }
  return resolve(raw);
}

function isValidPath(p: string): boolean {
  return p.startsWith("/") && !p.includes("..");
}

export class FilesListRepository {
  static async list(
    data: FilesListRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<FilesListResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message: "SSH backend not yet implemented for file listing",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const dirPath = resolvePath(data.path);

    if (!isValidPath(dirPath)) {
      return fail({
        message: "Invalid path: must be absolute without '..' segments",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      logger.debug(`Listing directory: ${dirPath}`);
      const names = await readdir(dirPath);

      const entries: FilesListResponseOutput["entries"] = [];

      for (const name of names) {
        const fullPath = join(dirPath, name);
        try {
          const st = await stat(fullPath);
          const isDir = st.isDirectory();
          const isSymlink = st.isSymbolicLink();
          entries.push({
            name,
            type: isDir ? "dir" : isSymlink ? "symlink" : "file",
            size: isDir ? null : st.size,
            permissions: null,
            modifiedAt: st.mtime.toISOString(),
          });
        } catch {
          entries.push({
            name,
            type: "file",
            size: null,
            permissions: null,
            modifiedAt: null,
          });
        }
      }

      entries.sort((a, b) => {
        if (a.type === "dir" && b.type !== "dir") {
          return -1;
        }
        if (b.type === "dir" && a.type !== "dir") {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });

      return success({ entries, currentPath: dirPath });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") {
        return fail({
          message: "Directory not found",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      logger.error("Failed to list directory", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
