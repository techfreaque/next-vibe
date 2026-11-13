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
  /**
   * Owning lead for files from incognito threads and guests' standalone tool
   * runs (no server-side thread row). Serving matches it against the
   * caller's leadId, so the same browser keeps access whether or not the
   * user is logged in. Guest files are removed by guest-media-cleanup.
   */
  leadId?: string;
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
      leadId?: string;
    },
  ): Promise<{
    url: string;
    fileId: string;
    metadata: FileMetadata;
  }>;

  /**
   * Delete a file by its ID. Pass the owning threadId when known: it skips the
   * search across every thread namespace.
   */
  deleteFile(fileId: string, threadId?: string): Promise<void>;

  /**
   * Get a file's public URL
   */
  getFileUrl(fileId: string): Promise<string>;

  /**
   * Get file metadata. Pass the owning threadId when known: it reads the one
   * metadata object directly instead of searching every thread namespace
   * (on S3 that search lists the whole bucket per call).
   */
  getFileMetadata(
    fileId: string,
    threadId?: string,
  ): Promise<FileMetadata | null>;

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

  /**
   * List every threadId namespace that holds files (stored threads, incognito
   * threads, standalone tool namespaces, caches). Used by storage cleanup jobs.
   */
  listThreadIds(): Promise<string[]>;
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
