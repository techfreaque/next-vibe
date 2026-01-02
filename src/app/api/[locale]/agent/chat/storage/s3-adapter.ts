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
import type { FileMetadata, StorageAdapter } from "./types";

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
      : `/api/en-GLOBAL/agent/chat/files/${metadata.threadId}/${storedFilename}`;

    return {
      url,
      fileId,
      metadata: fileMetadata,
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return;
    }

    const metadata = await this.getFileMetadata(fileId);
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

    return `/api/en-GLOBAL/agent/chat/files/${metadata.threadId}/${metadata.filename}`;
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    if (agentEnv.CHAT_STORAGE_TYPE !== "s3") {
      return null;
    }

    // Search through all thread directories for this fileId
    // List all objects under chat-attachments/
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: "chat-attachments/",
      });

      const response = await this.client.send(listCommand);
      const objects = response.Contents || [];

      // Find all .metadata directories and check for our fileId
      for (const obj of objects) {
        if (!obj.Key) {
          continue;
        }

        // Check if this is a metadata file for our fileId
        if (obj.Key.includes("/.metadata/") && obj.Key.endsWith(`${fileId}.json`)) {
          try {
            const getCommand = new GetObjectCommand({
              Bucket: this.bucket,
              Key: obj.Key,
            });

            const result = await this.client.send(getCommand);
            const body = await result.Body?.transformToString();

            if (body) {
              const metadata = JSON.parse(body) as FileMetadata;
              // Convert uploadedAt string back to Date
              metadata.uploadedAt = new Date(metadata.uploadedAt);
              return metadata;
            }
          } catch {
            // Metadata file couldn't be read, continue searching
            continue;
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

  async readFileAsBase64(fileId: string, threadId: string): Promise<string | null> {
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
}
