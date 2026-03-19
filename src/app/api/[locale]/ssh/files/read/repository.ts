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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  isNodeError,
  openSshClient,
  sftpReadFile,
} from "../../client";
import type {
  FilesReadRequestOutput,
  FilesReadResponseOutput,
} from "./definition";
import type { FilesReadT } from "./i18n";

export class FilesReadRepository {
  private static readonly DEFAULT_MAX_BYTES = 65536;
  private static readonly MAX_ALLOWED_BYTES = 524288;
  /**
   * Allowed base directories for local file access.
   * Paths outside these roots are rejected — prevents reading arbitrary system files
   * (e.g. /etc/passwd, /proc/*, private keys) via path traversal or symlink attacks.
   *
   * Defaults to the user's home directory. Override with SSH_FILES_ALLOWED_BASE env var
   * (colon-separated list of absolute paths, e.g. "/home/user:/data").
   */
  private static getAllowedBases(): string[] {
    const override = process.env["SSH_FILES_ALLOWED_BASE"];
    if (override) {
      return override
        .split(":")
        .map((p) => p.trim())
        .filter(Boolean);
    }
    return [homedir()];
  }

  private static resolvePath(inputPath: string): string {
    if (inputPath === "~" || inputPath.startsWith("~/")) {
      return join(homedir(), inputPath.slice(1));
    }
    return resolve(inputPath);
  }

  private static isValidPath(p: string): boolean {
    if (!p.startsWith("/") || p.includes("..")) {
      return false;
    }
    const allowedBases = FilesReadRepository.getAllowedBases();
    return allowedBases.some((base) => p === base || p.startsWith(`${base}/`));
  }

  static async read(
    data: FilesReadRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: FilesReadT,
  ): Promise<ResponseType<FilesReadResponseOutput>> {
    if (data.connectionId) {
      return FilesReadRepository.readSftp(data, user, logger, t);
    }

    const filePath = FilesReadRepository.resolvePath(data.path);

    if (!FilesReadRepository.isValidPath(filePath)) {
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

    if (!FilesReadRepository.isValidPath(realFilePath)) {
      return fail({
        message: t("errors.invalidPath"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const maxBytes = Math.min(
      data.maxBytes ?? FilesReadRepository.DEFAULT_MAX_BYTES,
      FilesReadRepository.MAX_ALLOWED_BYTES,
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
      if (isNodeError(error) && error.code === "ENOENT") {
        return fail({
          message: t("errors.fileNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (isNodeError(error) && error.code === "EACCES") {
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

  private static async readSftp(
    data: FilesReadRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: FilesReadT,
  ): Promise<ResponseType<FilesReadResponseOutput>> {
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
    const maxBytes = Math.min(
      data.maxBytes ?? FilesReadRepository.DEFAULT_MAX_BYTES,
      FilesReadRepository.MAX_ALLOWED_BYTES,
    );
    const offset = data.offset ?? 0;

    try {
      logger.debug(
        `SFTP reading: ${data.path} on ${credsResult.data.host} (offset=${offset}, maxBytes=${maxBytes})`,
      );
      const result = await sftpReadFile(client, data.path, offset, maxBytes);
      return success({ ...result, encoding: "utf8" });
    } catch (error) {
      if (
        isNodeError(error) &&
        (error.code === "ENOENT" || error.code === "ERR_SFTP_FAILURE")
      ) {
        return fail({
          message: t("errors.fileNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (
        isNodeError(error) &&
        (error.code === "EACCES" || error.code === "ERR_SFTP_PERMISSION_DENIED")
      ) {
        return fail({
          message: t("errors.permissionDenied"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      logger.error("SFTP read failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
