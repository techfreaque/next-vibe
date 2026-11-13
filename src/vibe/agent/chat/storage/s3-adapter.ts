/**
 * S3 storage adapter for chat file attachments
 */

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import { agentEnv } from "../../env";
import type { FileMetadata, StorageAdapter } from "./index";
import { buildStorageFileUrl } from "./url-utils";

export class S3StorageAdapter implements StorageAdapter {
  private client!: S3Client;
  private bucket!: string;
  private publicUrlBase?: string;

  constructor() {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return;
    }

    this.bucket = agentEnv.S3_BUCKET;
    this.publicUrlBase = agentEnv.S3_PUBLIC_URL_BASE;

    this.client = new S3Client({
      region: agentEnv.S3_REGION,
      endpoint: agentEnv.S3_ENDPOINT,
      credentials: {
        accessKeyId: agentEnv.S3_ACCESS_KEY_ID,
        secretAccessKey: agentEnv.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

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
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
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

    // Key structure: chat-attachments/{threadId}/{fileId}.{ext}
    const fileKey = `chat-attachments/${metadata.threadId}/${storedFilename}`;

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

    // Upload the file to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: metadata.mimeType,
    });

    await this.client.send(uploadCommand);

    // Store metadata as a separate JSON object in S3
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

    const metadataKey = `chat-attachments/${metadata.threadId}/.metadata/${fileId}.json`;
    const metadataCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: metadataKey,
      Body: JSON.stringify(fileMetadata, null, 2),
      ContentType: "application/json",
    });

    await this.client.send(metadataCommand);

    // Generate URL
    const url = this.publicUrlBase
      ? `${this.publicUrlBase}/${fileKey}`
      : buildStorageFileUrl(metadata.threadId, storedFilename);

    return {
      url,
      fileId,
      metadata: fileMetadata,
    };
  }

  async deleteFile(fileId: string, threadId?: string): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return;
    }

    const metadata = threadId
      ? await this.readMetadataObject(
          `chat-attachments/${threadId}/.metadata/${fileId}.json`,
        )
      : await this.getFileMetadata(fileId);
    if (!metadata) {
      return;
    }

    const fileKey = `chat-attachments/${metadata.threadId}/${metadata.filename}`;
    const metadataKey = `chat-attachments/${metadata.threadId}/.metadata/${fileId}.json`;

    // Delete the file
    try {
      const deleteFileCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });
      await this.client.send(deleteFileCommand);
    } catch {
      // File already deleted or doesn't exist
    }

    // Delete the metadata
    try {
      const deleteMetadataCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: metadataKey,
      });
      await this.client.send(deleteMetadataCommand);
    } catch {
      // Metadata already deleted or doesn't exist
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return "";
    }

    const fileKey = `chat-attachments/${metadata.threadId}/${metadata.filename}`;

    if (this.publicUrlBase) {
      return `${this.publicUrlBase}/${fileKey}`;
    }

    return buildStorageFileUrl(metadata.threadId, metadata.filename);
  }

  async getFileMetadata(
    fileId: string,
    threadId?: string,
  ): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return null;
    }

    if (threadId) {
      return this.readMetadataObject(
        `chat-attachments/${threadId}/.metadata/${fileId}.json`,
      );
    }

    // Search through all thread directories for this fileId
    // List all objects under chat-attachments/
    try {
      const { keys } = await this.listAllKeys("chat-attachments/");

      // Find all .metadata directories and check for our fileId
      for (const key of keys) {
        // Check if this is a metadata file for our fileId
        if (key.includes("/.metadata/") && key.endsWith(`/${fileId}.json`)) {
          const metadata = await this.readMetadataObject(key);
          if (metadata) {
            return metadata;
          }
        }
      }
    } catch {
      // Bucket or prefix doesn't exist
      return null;
    }

    return null;
  }

  async fileExists(fileId: string): Promise<boolean> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return false;
    }

    const metadata = await this.getFileMetadata(fileId);
    if (!metadata) {
      return false;
    }

    try {
      const fileKey = `chat-attachments/${metadata.threadId}/${metadata.filename}`;
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      await this.client.send(headCommand);
      return true;
    } catch {
      return false;
    }
  }

  async readFileAsBase64(
    fileId: string,
    threadId: string,
  ): Promise<string | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return null;
    }

    try {
      // Get metadata to find the stored filename
      const metadataKey = `chat-attachments/${threadId}/.metadata/${fileId}.json`;
      const metadataCommand = new GetObjectCommand({
        Bucket: this.bucket,
        Key: metadataKey,
      });

      const metadataResult = await this.client.send(metadataCommand);
      const metadataBody = await metadataResult.Body?.transformToString();

      if (!metadataBody) {
        return null;
      }

      const metadata = JSON.parse(metadataBody) as FileMetadata;

      // Read the file
      const fileKey = `chat-attachments/${threadId}/${metadata.filename}`;
      const fileCommand = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const fileResult = await this.client.send(fileCommand);
      const fileBuffer = await fileResult.Body?.transformToByteArray();

      if (!fileBuffer) {
        return null;
      }

      return Buffer.from(fileBuffer).toString("base64");
    } catch {
      // File doesn't exist or couldn't be read
      return null;
    }
  }

  async listFilesByThread(threadId: string): Promise<FileMetadata[]> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return [];
    }

    const prefix = `chat-attachments/${threadId}/.metadata/`;
    const results: FileMetadata[] = [];

    try {
      const { keys } = await this.listAllKeys(prefix);

      for (const key of keys) {
        if (!key.endsWith(".json")) {
          continue;
        }
        const metadata = await this.readMetadataObject(key);
        if (metadata) {
          results.push(metadata);
        }
      }
    } catch {
      // Bucket/prefix doesn't exist - return empty
    }

    return results;
  }

  async listThreadIds(): Promise<string[]> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return [];
    }

    const root = "chat-attachments/";
    try {
      const { prefixes } = await this.listAllKeys(root, "/");
      return prefixes
        .map((prefix) => prefix.slice(root.length).replace(/\/$/, ""))
        .filter((threadId) => threadId.length > 0);
    } catch {
      // Bucket/prefix doesn't exist - return empty
      return [];
    }
  }

  /**
   * List every key (and, with a delimiter, every common prefix) under a
   * prefix, following continuation tokens past the 1000-object page limit.
   */
  private async listAllKeys(
    prefix: string,
    delimiter?: string,
  ): Promise<{ keys: string[]; prefixes: string[] }> {
    const keys: string[] = [];
    const prefixes: string[] = [];
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          Delimiter: delimiter,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of response.Contents ?? []) {
        if (obj.Key) {
          keys.push(obj.Key);
        }
      }
      for (const common of response.CommonPrefixes ?? []) {
        if (common.Prefix) {
          prefixes.push(common.Prefix);
        }
      }
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return { keys, prefixes };
  }

  private async readMetadataObject(key: string): Promise<FileMetadata | null> {
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      const body = await result.Body?.transformToString();
      if (!body) {
        return null;
      }
      const metadata = JSON.parse(body) as FileMetadata;
      // Convert uploadedAt string back to Date
      metadata.uploadedAt = new Date(metadata.uploadedAt);
      return metadata;
    } catch {
      // Missing or unreadable metadata object
      return null;
    }
  }
}
