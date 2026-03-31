/**
 * Storage adapter factory for chat file attachments
 * Supports both S3 and local filesystem storage
 */

import { agentEnv } from "../../env";
import { LocalStorageAdapter } from "./local-adapter";
import { S3StorageAdapter } from "./s3-adapter";

// ─── File Storage Types ───────────────────────────────────────────────────────

export interface FileMetadata {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy?: string;
  threadId: string;
  messageId?: string;
}

export interface StorageAdapter {
  /**
   * Upload a file and return its metadata and URL
   */
  uploadFile(
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
  }>;

  /**
   * Delete a file by its ID
   */
  deleteFile(fileId: string): Promise<void>;

  /**
   * Get a file's public URL
   */
  getFileUrl(fileId: string): Promise<string>;

  /**
   * Get file metadata
   */
  getFileMetadata(fileId: string): Promise<FileMetadata | null>;

  /**
   * Check if a file exists
   */
  fileExists(fileId: string): Promise<boolean>;

  /**
   * Read file contents as base64
   * Used for passing file data to AI when processing message history
   */
  readFileAsBase64(fileId: string, threadId: string): Promise<string | null>;

  /**
   * List all file metadata entries within a given threadId namespace.
   * Used for cleanup tasks that need to enumerate files without knowing their IDs.
   */
  listFilesByThread(threadId: string): Promise<FileMetadata[]>;
}

export interface FileUploadResult {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export type StorageType = "s3" | "filesystem";

export interface StorageConfig {
  type: StorageType;
  s3: {
    endpoint?: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    publicUrlBase?: string;
  };
  filesystem: {
    basePath: string;
  };
}

let storageInstance: StorageAdapter | null = null;

/**
 * Get or create the storage adapter instance (singleton)
 */
export function getStorageAdapter(): StorageAdapter {
  if (storageInstance) {
    return storageInstance;
  }

  if (agentEnv.CHAT_STORAGE_TYPE === "s3") {
    storageInstance = new S3StorageAdapter();
  } else {
    storageInstance = new LocalStorageAdapter();
  }

  return storageInstance;
}

/**
 * Reset the storage instance (useful for testing)
 */
export function resetStorageAdapter(): void {
  storageInstance = null;
}
