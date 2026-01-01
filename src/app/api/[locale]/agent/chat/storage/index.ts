/**
 * Storage adapter factory for chat file attachments
 * Supports both S3 and local filesystem storage
 */

import { agentEnv } from "../../env";
import { LocalStorageAdapter } from "./local-adapter";
import { S3StorageAdapter } from "./s3-adapter";
import type { StorageAdapter } from "./types";

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
