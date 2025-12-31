/**
 * S3 storage adapter for chat file attachments
 */

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
    const fileId = uuidv4();
    const ext = metadata.filename.split(".").pop();
    const storedFilename = `chat-attachments/${metadata.threadId}/${fileId}${ext ? `.${ext}` : ""}`;

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

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storedFilename,
      Body: buffer,
      ContentType: metadata.mimeType,
      Metadata: {
        originalFilename: metadata.filename,
        threadId: metadata.threadId,
        messageId: metadata.messageId || "",
        userId: metadata.userId || "",
        fileId: fileId,
      },
    });

    await this.client.send(command);

    const url = this.publicUrlBase
      ? `${this.publicUrlBase}/${storedFilename}`
      : await this.getFileUrl();

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

    return {
      url,
      fileId,
      metadata: fileMetadata,
    };
  }

  async deleteFile(): Promise<void> {
    // S3 adapter doesn't support delete by fileId without database
    // Files are deleted when thread is deleted
    return;
  }

  async getFileUrl(): Promise<string> {
    // S3 adapter returns URLs during upload
    // This method is not used in current implementation
    return "";
  }

  async getFileMetadata(): Promise<FileMetadata | null> {
    // S3 adapter doesn't support metadata lookup by fileId without database
    // Metadata is returned during upload and stored in message metadata
    return null;
  }

  async fileExists(): Promise<boolean> {
    // S3 adapter doesn't support existence check without database
    return false;
  }
}
