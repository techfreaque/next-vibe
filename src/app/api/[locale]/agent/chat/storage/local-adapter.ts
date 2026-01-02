/**
 * Local filesystem storage adapter for chat file attachments
 * Used for self-hosted/Docker deployments
 */

import fs from "node:fs/promises";
import path from "node:path";

import { v4 as uuidv4 } from "uuid";

import { agentEnv } from "../../env";
import type { FileMetadata, StorageAdapter } from "./types";

export class LocalStorageAdapter implements StorageAdapter {
  async uploadFile(
    file: File | Buffer,
    metadata: {
      filename: string;
      mimeType: string;
      threadId: string;
      messageId?: string;
      userId?: string;
    },
  ): Promise<{
    url: string;
    fileId: string;
    metadata: FileMetadata;
  }> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      const fileId = uuidv4();
      return {
        url: "",
        fileId,
        metadata: {
          id: fileId,
          filename: metadata.filename,
          originalFilename: metadata.filename,
          mimeType: metadata.mimeType,
          size: 0,
          uploadedAt: new Date(),
          threadId: metadata.threadId,
        },
      };
    }

    const fileId = uuidv4();
    const ext = metadata.filename.split(".").pop();
    const storedFilename = `${fileId}${ext ? `.${ext}` : ""}`;

    // Create directory structure: basePath/threadId/
    const threadDir = path.join(agentEnv.CHAT_STORAGE_PATH, metadata.threadId);
    await fs.mkdir(threadDir, { recursive: true });

    // Create metadata directory
    const metadataDir = path.join(threadDir, ".metadata");
    await fs.mkdir(metadataDir, { recursive: true });

    const filePath = path.join(threadDir, storedFilename);

    let buffer: Buffer;
    let size: number;

    if (Buffer.isBuffer(file)) {
      buffer = file;
      size = buffer.length;
    } else {
      // File type - convert to Buffer
      const arrayBuffer = await (file as File).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      size = (file as File).size;
    }

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Store metadata
    const fileMetadata: FileMetadata = {
      id: fileId,
      filename: storedFilename,
      originalFilename: metadata.filename,
      mimeType: metadata.mimeType,
      size,
      uploadedAt: new Date(),
      uploadedBy: metadata.userId,
      threadId: metadata.threadId,
      messageId: metadata.messageId,
    };

    const metadataPath = path.join(metadataDir, `${fileId}.json`);
    await fs.writeFile(metadataPath, JSON.stringify(fileMetadata, null, 2));

    // URL format: /api/{locale}/agent/chat/files/{threadId}/{filename}
    // Use en-GLOBAL as default locale for file URLs
    const url = `/api/en-GLOBAL/agent/chat/files/${metadata.threadId}/${storedFilename}`;

    return {
      url,
      fileId,
      metadata: fileMetadata,
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return;
    }

    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return;
    }

    const filePath = path.join(agentEnv.CHAT_STORAGE_PATH, metadata.threadId, metadata.filename);
    const metadataPath = path.join(
      agentEnv.CHAT_STORAGE_PATH,
      metadata.threadId,
      ".metadata",
      `${fileId}.json`,
    );

    try {
      await fs.unlink(filePath);
    } catch {
      // File already deleted or doesn't exist
    }

    try {
      await fs.unlink(metadataPath);
    } catch {
      // Metadata already deleted or doesn't exist
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return "";
    }

    return `/api/en-GLOBAL/agent/chat/files/${metadata.threadId}/${metadata.filename}`;
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return null;
    }

    // Search through all thread directories for this fileId
    try {
      const threads = await fs.readdir(agentEnv.CHAT_STORAGE_PATH);

      for (const threadId of threads) {
        const metadataPath = path.join(
          agentEnv.CHAT_STORAGE_PATH,
          threadId,
          ".metadata",
          `${fileId}.json`,
        );

        try {
          const metadataContent = await fs.readFile(metadataPath, "utf-8");
          const metadata = JSON.parse(metadataContent) as FileMetadata;
          // Convert uploadedAt string back to Date
          metadata.uploadedAt = new Date(metadata.uploadedAt);
          return metadata;
        } catch {
          // Metadata file doesn't exist in this thread, continue searching
          continue;
        }
      }
    } catch {
      // Base path doesn't exist
      return null;
    }

    return null;
  }

  async fileExists(fileId: string): Promise<boolean> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return false;
    }

    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return false;
    }

    try {
      const filePath = path.join(agentEnv.CHAT_STORAGE_PATH, metadata.threadId, metadata.filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFileAsBase64(fileId: string, threadId: string): Promise<string | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return null;
    }

    try {
      // Get metadata to find the stored filename
      const metadataPath = path.join(
        agentEnv.CHAT_STORAGE_PATH,
        threadId,
        ".metadata",
        `${fileId}.json`,
      );
      const metadataContent = await fs.readFile(metadataPath, "utf-8");
      const metadata = JSON.parse(metadataContent) as FileMetadata;

      // Read the file
      const filePath = path.join(agentEnv.CHAT_STORAGE_PATH, threadId, metadata.filename);
      const buffer = await fs.readFile(filePath);
      return buffer.toString("base64");
    } catch (error) {
      // File doesn't exist or couldn't be read
      return null;
    }
  }
}
