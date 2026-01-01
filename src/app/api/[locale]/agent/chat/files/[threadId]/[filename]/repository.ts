/**
 * Chat File Serving Repository
 * Handles serving files from filesystem storage
 */

import fs from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { chatFolders, chatThreads } from "../../../db";
import { canViewThread } from "../../../permissions/permissions";

interface FileRequestParams {
  threadId: string;
  filename: string;
}

interface FileResult {
  buffer: Buffer;
  contentType: string;
}

export class ChatFileRepository {
  static async getFile(
    data: FileRequestParams,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
  ): Promise<FileResult> {
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

      if (!thread) {
        logger.error("Thread not found for file access", {
          threadId: data.threadId,
        });
        return {
          buffer: Buffer.from(""),
          contentType: "text/plain",
        };
      }

      // Get folder for permission check
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }

      // Check if user has permission to view the thread (and therefore its files)
      // Note: user can be a public user (isPublic=true) or authenticated user
      if (!user) {
        logger.error("User object not provided for file access");
        return {
          buffer: Buffer.from(""),
          contentType: "text/plain",
        };
      }

      // Check thread access permissions - same logic as thread endpoint
      const hasAccess = await canViewThread(user, thread, folder, logger);

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
      const metadataDir = path.join(basePath, data.threadId, ".metadata");
      const fileId = data.filename.split(".")[0];
      const metadataPath = path.join(metadataDir, `${fileId}.json`);

      let contentType = "application/octet-stream";
      try {
        const metadataContent = await fs.readFile(metadataPath, "utf-8");
        const metadata = JSON.parse(metadataContent);
        contentType = metadata.mimeType || contentType;
      } catch {
        // Metadata not found, use default content type
      }

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
}
