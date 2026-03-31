/**
 * URL Cache Cleanup Repository
 * Deletes stale URL fetch cache files older than RETENTION_DAYS.
 * Uses StorageAdapter — works transparently with S3 or local filesystem.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { getStorageAdapter } from "@/app/api/[locale]/agent/chat/storage";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { UrlCacheCleanupPostResponseOutput } from "./definition";

const CACHE_THREAD_ID = "url-fetch-cache";
const RETENTION_DAYS = 7;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

export class UrlCacheCleanupRepository {
  static async cleanup(
    logger: EndpointLogger,
  ): Promise<ResponseType<UrlCacheCleanupPostResponseOutput>> {
    const cutoff = new Date(Date.now() - RETENTION_MS);

    logger.debug(
      `Cleaning URL cache files older than ${cutoff.toISOString()} (${RETENTION_DAYS} days)`,
    );

    const adapter = getStorageAdapter();
    const allFiles = await adapter.listFilesByThread(CACHE_THREAD_ID);

    let deletedCount = 0;
    const totalScanned = allFiles.length;

    for (const metadata of allFiles) {
      if (metadata.uploadedAt < cutoff) {
        await adapter.deleteFile(metadata.id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.info(
        `Cleaned up ${deletedCount} stale URL cache files (scanned ${totalScanned})`,
      );
    } else {
      logger.debug(
        `No stale URL cache files to clean up (scanned ${totalScanned})`,
      );
    }

    return success({
      deletedCount,
      totalScanned,
      retentionDays: RETENTION_DAYS,
    });
  }
}
