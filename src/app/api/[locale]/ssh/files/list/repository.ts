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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  openSshClient,
  sftpListDir,
} from "../../client";
import type {
  FilesListRequestOutput,
  FilesListResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
    user: JwtPayloadType,
    t: ModuleT,
  ): Promise<ResponseType<FilesListResponseOutput>> {
    if (data.connectionId) {
      return FilesListRepository.listSftp(data, user, logger, t);
    }

    const dirPath = resolvePath(data.path);

    if (!isValidPath(dirPath)) {
      return fail({
        message: t("errors.invalidPath"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      logger.debug(`Listing directory: ${dirPath}`);
      const names = await readdir(dirPath);

      const entries: FilesListResponseOutput["entries"] = [];

      for (const name of names) {
        // Use template string to prevent Turbopack from statically tracing paths
        const fullPath = `${dirPath}/${name}`;
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
          message: t("errors.directoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      logger.error("Failed to list directory", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async listSftp(
    data: FilesListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<FilesListResponseOutput>> {
    const credsResult = await getConnectionCredentials(
      data.connectionId!,
      user.id!,
      t,
    );
    if (!credsResult.success) {
      return fail({
        message: credsResult.message,
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const clientResult = await openSshClient(credsResult.data, t);
    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { client } = clientResult.data;
    const dirPath = data.path ?? "~";

    try {
      logger.debug(`SFTP listing: ${dirPath} on ${credsResult.data.host}`);
      const entries = await sftpListDir(client, dirPath);
      return success({ entries, currentPath: dirPath });
    } catch (error) {
      const err = error as NodeJS.ErrnoException & { code?: string };
      if (err.code === "ENOENT" || err.code === "ERR_SFTP_NO_SUCH_FILE") {
        return fail({
          message: t("errors.directoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      logger.error("SFTP list failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
