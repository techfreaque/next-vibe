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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  isNodeError,
  openSshClient,
  sftpWriteFile,
} from "../../client";
import type {
  FilesWriteRequestOutput,
  FilesWriteResponseOutput,
} from "./definition";
import type { FilesWriteT } from "./i18n";

export class FilesWriteRepository {
  /**
   * Allowed base directories for local file writes.
   * See ssh/files/read/repository.ts for rationale.
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
    const allowedBases = FilesWriteRepository.getAllowedBases();
    return allowedBases.some((base) => p === base || p.startsWith(`${base}/`));
  }

  static async write(
    data: FilesWriteRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: FilesWriteT,
  ): Promise<ResponseType<FilesWriteResponseOutput>> {
    if (data.connectionId) {
      return FilesWriteRepository.writeSftp(data, user, logger, t);
    }

    const filePath = FilesWriteRepository.resolvePath(data.path);

    if (!FilesWriteRepository.isValidPath(filePath)) {
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
        if (isNodeError(e) && e.code === "ENOENT") {
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
        } else if (isNodeError(e) && e.code === "EACCES") {
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

      if (!FilesWriteRepository.isValidPath(realFilePath)) {
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
      if (isNodeError(error) && error.code === "ENOENT") {
        return fail({
          message: t("errors.parentDirNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (isNodeError(error) && error.code === "EACCES") {
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

  private static async writeSftp(
    data: FilesWriteRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: FilesWriteT,
  ): Promise<ResponseType<FilesWriteResponseOutput>> {
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

    try {
      logger.info(`SFTP writing: ${data.path} on ${credsResult.data.host}`);
      const result = await sftpWriteFile(
        client,
        data.path,
        data.content,
        data.createDirs ?? false,
      );
      return success({ ok: true, bytesWritten: result.bytesWritten });
    } catch (error) {
      if (
        isNodeError(error) &&
        (error.code === "ENOENT" || error.code === "ERR_SFTP_NO_SUCH_FILE")
      ) {
        return fail({
          message: t("errors.parentDirNotFound"),
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
      logger.error("SFTP write failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
