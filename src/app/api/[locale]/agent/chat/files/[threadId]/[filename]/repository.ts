/**
 * Chat File Serving Repository
 * Handles serving files from filesystem storage
 */

import fs from "node:fs/promises";
import path from "node:path";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ChatFileRequestOutput } from "./definition";

interface FileResult {
  buffer: Buffer;
  contentType: string;
}

export class ChatFileRepository {
  static async getFile(
    data: ChatFileRequestOutput,
    user: JwtPayloadType | undefined,
    logger: EndpointLogger,
  ): Promise<FileResult> {
    void user;

    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      logger.error("File serving only available for filesystem storage");
      return {
        buffer: Buffer.from(""),
        contentType: "text/plain",
      };
    }

    const basePath = agentEnv.CHAT_STORAGE_PATH;
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
