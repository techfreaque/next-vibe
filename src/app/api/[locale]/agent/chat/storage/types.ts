/**
 * File storage types and interfaces for chat attachments
 */

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
