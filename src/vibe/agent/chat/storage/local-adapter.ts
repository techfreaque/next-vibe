/**
 * Local filesystem storage adapter for chat file attachments
 * Used for self-hosted/Docker deployments
 */

import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { parseError } from "next-vibe/core/utils/parse-error";
import { v4 as uuidv4 } from "uuid";

import { agentEnv } from "../../env";
import type {
  ByteRange,
  FileMetadata,
  StorageAdapter,
  StoredFileContent,
} from "./index";
import { buildStorageFileUrl } from "./url-utils";

export class LocalStorageAdapter implements StorageAdapter {
  async uploadFile(
    file: File | Buffer,
    metadata: {
      filename: string;
      mimeType: string;
      threadId: string;
      messageId?: string;
      userId?: string;
      leadId?: string;
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
      leadId: metadata.leadId,
      threadId: metadata.threadId,
      messageId: metadata.messageId,
    };

    await this.writeFileMetadata(fileMetadata);

    const url = buildStorageFileUrl(metadata.threadId, storedFilename);

    return {
      url,
      fileId,
      metadata: fileMetadata,
    };
  }

  async deleteFile(fileId: string, threadId?: string): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return;
    }

    const metadata = threadId
      ? await this.readThreadMetadata(threadId, fileId)
      : await this.getFileMetadata(fileId);
    if (!metadata) {
      return;
    }

    const filePath = path.join(
      agentEnv.CHAT_STORAGE_PATH,
      metadata.threadId,
      metadata.filename,
    );
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

    // Drop the namespace dirs once they are empty (rmdir refuses non-empty
    // dirs, so files still in the thread are never touched).
    const threadDir = path.join(agentEnv.CHAT_STORAGE_PATH, metadata.threadId);
    try {
      await fs.rmdir(path.join(threadDir, ".metadata"));
      await fs.rmdir(threadDir);
    } catch {
      // Not empty yet
    }
  }

  private async readThreadMetadata(
    threadId: string,
    fileId: string,
  ): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return null;
    }
    try {
      const raw = await fs.readFile(
        path.join(
          agentEnv.CHAT_STORAGE_PATH,
          threadId,
          ".metadata",
          `${fileId}.json`,
        ),
        "utf-8",
      );
      const metadata = JSON.parse(raw) as FileMetadata;
      metadata.uploadedAt = new Date(metadata.uploadedAt);
      return metadata;
    } catch {
      return null;
    }
  }

  async deleteFileContent(file: FileMetadata): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE === "filesystem") {
      await this.unlinkIfPresent(
        path.join(agentEnv.CHAT_STORAGE_PATH, file.threadId, file.filename),
      );
    }
  }

  async deleteFileMetadata(file: FileMetadata): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return;
    }
    const threadDir = path.join(agentEnv.CHAT_STORAGE_PATH, file.threadId);
    const metadataDir = path.join(threadDir, ".metadata");
    await this.unlinkIfPresent(path.join(metadataDir, `${file.id}.json`));
    // A concurrent write can leave either directory nonempty.
    await fs.rmdir(metadataDir).catch(() => undefined);
    await fs.rmdir(threadDir).catch(() => undefined);
  }

  async writeFileMetadata(file: FileMetadata): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE === "filesystem") {
      const metadataDir = path.join(
        agentEnv.CHAT_STORAGE_PATH,
        file.threadId,
        ".metadata",
      );
      await fs.mkdir(metadataDir, { recursive: true });
      await fs.writeFile(
        path.join(metadataDir, `${file.id}.json`),
        JSON.stringify(file, null, 2),
      );
    }
  }

  private async unlinkIfPresent(filePath: string): Promise<void> {
    await fs
      .unlink(filePath)
      .catch((error: NodeJS.ErrnoException) =>
        error.code === "ENOENT" ? undefined : Promise.reject(error),
      );
  }

  async getFileUrl(fileId: string): Promise<string> {
    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return "";
    }

    return buildStorageFileUrl(metadata.threadId, metadata.filename);
  }

  async getFileMetadata(
    fileId: string,
    threadId?: string,
  ): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return null;
    }

    if (threadId) {
      return this.readThreadMetadata(threadId, fileId);
    }

    // Search through all thread directories for this fileId
    try {
      const threads = await fs.readdir(agentEnv.CHAT_STORAGE_PATH);

      for (const threadDir of threads) {
        const metadataPath = path.join(
          agentEnv.CHAT_STORAGE_PATH,
          threadDir,
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
      const filePath = path.join(
        agentEnv.CHAT_STORAGE_PATH,
        metadata.threadId,
        metadata.filename,
      );
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFileAsBase64(
    fileId: string,
    threadId: string,
  ): Promise<string | null> {
    const file = await this.readFileBytes(fileId, threadId);
    return file ? file.bytes.toString("base64") : null;
  }

  async readFileBytes(
    fileId: string,
    threadId: string,
  ): Promise<{ bytes: Buffer; metadata: FileMetadata } | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return null;
    }

    const metadata = await this.readThreadMetadata(threadId, fileId);
    if (!metadata) {
      return null;
    }

    try {
      const bytes = await fs.readFile(
        path.join(agentEnv.CHAT_STORAGE_PATH, threadId, metadata.filename),
      );
      return { bytes, metadata };
    } catch {
      // File doesn't exist or couldn't be read
      return null;
    }
  }

  private resolveFilePath(threadId: string, filename: string): string | null {
    if (
      agentEnv.CHAT_STORAGE_TYPE !== "filesystem" ||
      !agentEnv.CHAT_STORAGE_PATH
    ) {
      return null;
    }
    const basePath = agentEnv.CHAT_STORAGE_PATH;
    const filePath = path.join(basePath, threadId, filename);
    const relative = path.relative(basePath, filePath);
    return relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
      ? null
      : filePath;
  }

  private async statFile(filePath: string): Promise<number | null> {
    try {
      const stat = await fs.stat(filePath);
      return stat.isFile() ? stat.size : null;
    } catch {
      return null;
    }
  }

  async getFileSize(
    threadId: string,
    filename: string,
  ): Promise<number | null> {
    const filePath = this.resolveFilePath(threadId, filename);
    return filePath === null ? null : this.statFile(filePath);
  }

  async readFileContent(
    threadId: string,
    filename: string,
    range?: ByteRange,
  ): Promise<StoredFileContent | null> {
    const filePath = this.resolveFilePath(threadId, filename);
    if (filePath === null) {
      return null;
    }
    const handle = await fs.open(filePath, "r").catch(() => null);
    if (!handle) {
      return null;
    }
    try {
      const stat = await handle.stat();
      if (stat.isFile() && (!range || range.end < stat.size)) {
        // The stream owns the descriptor and closes it on EOF or cancellation.
        const stream = handle.createReadStream(range);
        const body = Readable.toWeb(stream, { strategy: { highWaterMark: 1 } });
        if (body instanceof ReadableStream) {
          return {
            body,
            length: range ? range.end - range.start + 1 : stat.size,
          };
        }
        stream.destroy();
        return null;
      }
    } catch {
      // File couldn't be read.
    }
    await handle.close();
    return null;
  }

  async listFilesByThread(
    threadId: string,
    options?: { strict?: boolean; signal?: AbortSignal },
  ): Promise<FileMetadata[]> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return [];
    }

    const metadataDir = path.join(
      agentEnv.CHAT_STORAGE_PATH,
      threadId,
      ".metadata",
    );

    const results: FileMetadata[] = [];

    try {
      const files = await fs.readdir(metadataDir);
      for (const file of files) {
        if (!file.endsWith(".json")) {
          continue;
        }
        try {
          const raw = await fs.readFile(path.join(metadataDir, file), {
            encoding: "utf-8",
            signal: options?.signal,
          });
          const metadata = JSON.parse(raw) as FileMetadata;
          metadata.uploadedAt = new Date(metadata.uploadedAt);
          results.push(metadata);
        } catch (error) {
          if (options?.strict && !this.isMissing(parseError(error))) {
            return Promise.reject(error);
          }
          // Skip unreadable metadata files
        }
      }
    } catch (error) {
      if (options?.strict && !this.isMissing(parseError(error))) {
        return Promise.reject(error);
      }
      // Directory doesn't exist - return empty
    }

    return results;
  }

  async listThreadIds(): Promise<string[]> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "filesystem") {
      return [];
    }

    try {
      const entries = await fs.readdir(agentEnv.CHAT_STORAGE_PATH, {
        withFileTypes: true,
      });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch (error) {
      if (!this.isMissing(parseError(error))) {
        return Promise.reject(error);
      }
      // Base path doesn't exist yet
      return [];
    }
  }

  private isMissing(error: Error): boolean {
    return "code" in error && error.code === "ENOENT";
  }
}
