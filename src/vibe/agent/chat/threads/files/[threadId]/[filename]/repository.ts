/**
 * Chat File Serving Repository
 * Handles serving files from filesystem storage
 */

import fs from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";
import type { FileMetadata } from "../../../../storage/index";
import { agentEnv } from "../../../../../env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createFileResponse,
  ErrorResponseTypes,
  fail,
  type HandlerResponse,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatFolders, chatThreads } from "../../../../db";
import { canViewThread } from "../../../../permissions/permissions";
import type { ChatFileResponseOutput } from "./definition";
import type { ChatFileUrlVariablesOutput } from "./definition";
import type { ChatFileT } from "./i18n";

export class ChatFileRepository {
  /**
   * Read the stored metadata JSON for a file within a thread namespace
   * (filesystem storage only).
   */
  private static async readFileMetadata(
    threadId: string,
    filename: string,
  ): Promise<FileMetadata | null> {
    const basePath = agentEnv.CHAT_STORAGE_PATH;
    if (!basePath || typeof basePath !== "string") {
      return null;
    }
    const fileId = filename.split(".")[0];
    const metadataPath = path.join(
      basePath,
      threadId,
      ".metadata",
      `${fileId}.json`,
    );
    // Security check: ensure the resolved path is within basePath
    if (!path.resolve(metadataPath).startsWith(path.resolve(basePath))) {
      return null;
    }
    try {
      const metadataContent = await fs.readFile(metadataPath, "utf-8");
      return JSON.parse(metadataContent) as FileMetadata;
    } catch {
      return null;
    }
  }

  static async getFile(
    data: ChatFileUrlVariablesOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      logger.error("File serving only available for filesystem storage");
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }

    // Check thread access permissions
    try {
      // Get thread
      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, data.threadId))
        .limit(1);

      // Check if user has permission to view the thread (and therefore its files)
      // Note: user can be a public user (isPublic=true) or authenticated user
      if (!user) {
        logger.error("User object not provided for file access");
        return {
          buffer: Buffer.from(""),
          contentType: "text/plain",
        };
      }

      if (!thread) {
        // Incognito threads have no server-side thread row — their files carry
        // the owning leadId. Access is granted purely on leadId match (never
        // userId), so the same browser keeps access whether logged in or not.
        const fileMetadata = await ChatFileRepository.readFileMetadata(
          data.threadId,
          data.filename,
        );
        if (!fileMetadata?.leadId || fileMetadata.leadId !== user.leadId) {
          logger.error("Lead does not have permission to access file", {
            leadId: user.leadId,
            hasFileLeadId: !!fileMetadata?.leadId,
            threadId: data.threadId,
            filename: data.filename,
          });
          return {
            buffer: Buffer.from(""),
            contentType: "text/plain",
          };
        }
      } else {
        // Get folder for permission check
        let folder = null;
        if (thread.folderId) {
          [folder] = await db
            .select()
            .from(chatFolders)
            .where(eq(chatFolders.id, thread.folderId))
            .limit(1);
        }

        // Check thread access permissions - same logic as thread endpoint
        const hasAccess = await canViewThread(
          user,
          thread,
          folder,
          logger,
          locale,
        );

        if (!hasAccess) {
          logger.error("User does not have permission to access file", {
            userId: user.id || "public",
            isPublic: user.isPublic,
            threadId: data.threadId,
            threadUserId: thread.userId,
            threadRootFolderId: thread.rootFolderId,
            filename: data.filename,
          });
          return {
            buffer: Buffer.from(""),
            contentType: "text/plain",
          };
        }
      }

      logger.debug("File access granted", {
        userId: user.id || "public",
        threadId: data.threadId,
        filename: data.filename,
      });
    } catch (error) {
      logger.error("Error checking thread permissions", {
        error: error instanceof Error ? error.message : String(error),
        threadId: data.threadId,
      });
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }

    const basePath = agentEnv.CHAT_STORAGE_PATH;

    if (!basePath || typeof basePath !== "string") {
      logger.error("CHAT_STORAGE_PATH not configured or invalid", {
        basePath,
        type: typeof basePath,
      });
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }

    const filePath = path.join(basePath, data.threadId, data.filename);

    // Security check: ensure the resolved path is within basePath
    const resolvedPath = path.resolve(filePath);
    const resolvedBasePath = path.resolve(basePath);

    if (!resolvedPath.startsWith(resolvedBasePath)) {
      logger.error("Invalid file path attempted", { filePath });
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }

    try {
      // Read file
      const fileBuffer = await fs.readFile(filePath);

      // Get metadata to determine content type
      const fileMetadata = await ChatFileRepository.readFileMetadata(
        data.threadId,
        data.filename,
      );
      const contentType = fileMetadata?.mimeType ?? "application/octet-stream";

      return {
        buffer: fileBuffer,
        contentType,
      };
    } catch (error) {
      logger.error("File not found", {
        errorMessage: error instanceof Error ? error.message : String(error),
        filePath,
      });
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }
  }
  static async getFileResponse(
    urlPathParams: ChatFileUrlVariablesOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
    t: ChatFileT,
    locale: CountryLanguage,
  ): Promise<HandlerResponse<ChatFileResponseOutput>> {
    const result = await ChatFileRepository.getFile(
      urlPathParams,
      user,
      logger,
      locale,
    );

    if (result.buffer.length === 0) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    return createFileResponse(result.buffer, result.contentType, {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(result.buffer.length),
      "Accept-Ranges": "bytes",
    });
  }
}
