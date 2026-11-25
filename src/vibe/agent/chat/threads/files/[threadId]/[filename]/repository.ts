/**
 * Chat File Serving Repository
 * Handles serving files from filesystem storage
 */

import fs from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  createFileResponse,
  createStreamingResponse,
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  fileResponseSecurityHeaders,
  type HandlerResponse,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../../../../env";
import { SKILL_AVATAR_STORAGE_NAMESPACE } from "../../../../../skills/constants";
import { chatFolders, chatThreads } from "../../../../db";
import { canViewThread } from "../../../../permissions/permissions";
import {
  serveStoredFile,
  type StoredFileSource,
} from "../../../../storage/file-response";
import type { FileMetadata } from "../../../../storage/index";
import { getStorageAdapter } from "../../../../storage/index";
import { readInlineThreadImage } from "../../../../storage/inline-image";
import { isStorageFileOwner } from "../../../../storage/url-utils";
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

  /**
   * Resolve a file's metadata regardless of the active storage backend.
   * Filesystem keeps the fast path-based read; S3/MinIO reads the
   * thread-scoped metadata object directly (never a bucket-wide search: the
   * old unpaginated listing only saw the first 1000 keys, so incognito files
   * in later threads 404'd as "Lead does not have permission"). Keeping this abstraction here is
   * what lets the serving route work when CHAT_STORAGE_TYPE=s3.
   */
  private static async resolveFileMetadata(
    threadId: string,
    filename: string,
  ): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE === "filesystem") {
      return ChatFileRepository.readFileMetadata(threadId, filename);
    }
    const fileId = filename.split(".")[0];
    if (!fileId) {
      return null;
    }
    return getStorageAdapter().getFileMetadata(fileId, threadId);
  }

  static async getFileSource(
    data: ChatFileUrlVariablesOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<StoredFileSource | null> {
    let fileMetadata: FileMetadata | null = null;
    let authorizedThread = false;
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
        return null;
      }

      if (!thread) {
        // No server-side thread row: incognito threads and standalone tool
        // runs. Incognito/guest files carry the owning leadId (the same browser
        // keeps access whether logged in or not); a logged-in user's
        // standalone generations carry their user id.
        fileMetadata = await ChatFileRepository.resolveFileMetadata(
          data.threadId,
          data.filename,
        );
        if (!fileMetadata) {
          // Not a permission question: nothing exists under this thread id
          // (deleted file, wrong link, probe). Served as 404 like a denial.
          logger.error(
            "Chat file not found: no thread row and no file metadata",
            {
              leadId: user.leadId,
              storageType: agentEnv.CHAT_STORAGE_TYPE,
              threadId: data.threadId,
              filename: data.filename,
            },
          );
          return null;
        }
        // Imported character avatars are public-read (copies of images the
        // source platform shows publicly; public skills show them to everyone).
        const isSkillAvatarNamespace =
          data.threadId === SKILL_AVATAR_STORAGE_NAMESPACE;
        const isPublicSkillAvatar =
          isSkillAvatarNamespace &&
          fileMetadata.mimeType.startsWith("image/") &&
          !fileMetadata.mimeType.includes("svg");
        if (!isPublicSkillAvatar && !isStorageFileOwner(fileMetadata, user)) {
          logger.error("Chat file owner mismatch without a server thread", {
            leadId: user.leadId,
            isPublic: user.isPublic,
            hasFileLeadId: !!fileMetadata.leadId,
            hasFileUploadedBy: !!fileMetadata.uploadedBy,
            isSkillAvatarNamespace,
            fileMimeType: fileMetadata.mimeType,
            storageType: agentEnv.CHAT_STORAGE_TYPE,
            threadId: data.threadId,
            filename: data.filename,
          });
          return null;
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
          return null;
        }
        authorizedThread = true;
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
      return null;
    }

    fileMetadata ??= await ChatFileRepository.resolveFileMetadata(
      data.threadId,
      data.filename,
    );
    if (!fileMetadata && authorizedThread) {
      const inline = await readInlineThreadImage(data.threadId, data.filename);
      if (inline) {
        return inline;
      }
    }
    if (agentEnv.CHAT_STORAGE_TYPE === "filesystem") {
      // Older thread attachments can still be served without a sidecar.
      return {
        threadId: data.threadId,
        filename: data.filename,
        contentType: fileMetadata?.mimeType ?? "application/octet-stream",
      };
    }
    return (
      fileMetadata && {
        threadId: data.threadId,
        filename: fileMetadata.filename,
        contentType: fileMetadata.mimeType || "application/octet-stream",
      }
    );
  }

  static async getFile(
    data: ChatFileUrlVariablesOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const source = await ChatFileRepository.getFileSource(
      data,
      user,
      logger,
      locale,
    );
    try {
      if (source?.inlineBytes) {
        return {
          buffer: Buffer.from(source.inlineBytes),
          contentType: source.contentType,
        };
      }
      if (source) {
        const file = await getStorageAdapter().readFileContent(
          source.threadId,
          source.filename,
        );
        if (file) {
          return {
            buffer: Buffer.from(await new Response(file.body).arrayBuffer()),
            contentType: source.contentType,
          };
        }
      }
    } catch (error) {
      logger.error("File not found", {
        errorMessage: error instanceof Error ? error.message : String(error),
        threadId: data.threadId,
        filename: data.filename,
      });
    }
    return { buffer: Buffer.alloc(0), contentType: "text/plain" };
  }

  static async getFileResponse(
    urlPathParams: ChatFileUrlVariablesOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
    t: ChatFileT,
    locale: CountryLanguage,
    request?: Request,
  ): Promise<HandlerResponse<ChatFileResponseOutput>> {
    const headers = { "Cache-Control": "private, max-age=31536000, immutable" };
    const notFound = (): ErrorResponseType =>
      fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    if (request) {
      const source = await ChatFileRepository.getFileSource(
        urlPathParams,
        user,
        logger,
        locale,
      );
      const response =
        source &&
        (await serveStoredFile(source, request, {
          ...headers,
          ...fileResponseSecurityHeaders(source.contentType),
        }));
      return response ? createStreamingResponse(response) : notFound();
    }
    const result = await ChatFileRepository.getFile(
      urlPathParams,
      user,
      logger,
      locale,
    );

    if (result.buffer.length === 0) {
      return notFound();
    }

    return createFileResponse(result.buffer, result.contentType, {
      ...headers,
      "Content-Length": String(result.buffer.length),
      "Accept-Ranges": "bytes",
    });
  }
}
