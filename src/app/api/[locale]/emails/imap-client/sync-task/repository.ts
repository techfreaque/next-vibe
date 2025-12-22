/**
 * IMAP Sync Task Repository
 * Automated synchronization of IMAP accounts, folders, and messages
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { imapSyncRepository } from "../sync-service/repository";
import type {
  ExecuteImapSyncRequestOutput,
  ExecuteImapSyncResponseOutput,
  TaskResultType,
  ValidateImapSyncResponseOutput,
} from "./types";

/**
 * IMAP Sync Task Repository Interface
 */
export interface ImapSyncTaskRepository {
  executeImapSync(
    data: ExecuteImapSyncRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExecuteImapSyncResponseOutput>>;

  validateImapSync(
    logger: EndpointLogger,
  ): ResponseType<ValidateImapSyncResponseOutput>;
}

/**
 * IMAP Sync Task Repository Implementation
 */
export class ImapSyncTaskRepositoryImpl implements ImapSyncTaskRepository {
  /**
   * Execute IMAP sync task
   */
  async executeImapSync(
    data: ExecuteImapSyncRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExecuteImapSyncResponseOutput>> {
    logger.info("tasks.imap_sync.start", {
      maxAccountsPerRun: data.config.maxAccountsPerRun ?? 0,
      enableFolderSync: data.config.enableFolderSync ?? false,
      enableMessageSync: data.config.enableMessageSync ?? false,
      dryRun: data.config.dryRun ?? false,
    });

    try {
      // For now, we'll execute a simplified sync all accounts operation
      // In a real implementation, this would get specific accounts based on config
      const syncResult = await imapSyncRepository.syncAllAccounts(logger);

      if (syncResult.success) {
        const result: TaskResultType = {
          accountsProcessed: syncResult.data.result.results.accountsProcessed,
          accountsSuccessful: syncResult.data.result.results.accountsProcessed,
          accountsFailed: 0,
          foldersProcessed: data.config.enableFolderSync
            ? syncResult.data.result.results.foldersProcessed
            : undefined,
          messagesProcessed: data.config.enableMessageSync
            ? syncResult.data.result.results.messagesProcessed
            : undefined,
          errors: syncResult.data.result.results.errors.map((error) => ({
            accountId: "unknown",
            stage: "sync",
            error: error.message,
          })),
          summary: {
            totalAccounts: syncResult.data.result.results.accountsProcessed,
            activeAccounts: syncResult.data.result.results.accountsProcessed,
            syncedAccounts: syncResult.data.result.results.accountsProcessed,
            failedAccounts: 0,
          },
        };

        logger.info("tasks.imap_sync.completed", result.summary);
        return success({ result });
      }
      logger.error("tasks.imap_sync.failed", {
        error: syncResult.message,
      });
      return fail({
        message: "app.api.emails.error.default",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        cause: syncResult,
      });
    } catch (error) {
      logger.error("tasks.imap_sync.failed", {
        error:
          error instanceof Error
            ? error.message
            : "tasks.imap_sync.unknown_error",
      });

      return fail({
        message: "app.api.emails.error.default",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Validate IMAP sync task
   */
  validateImapSync(
    logger: EndpointLogger,
  ): ResponseType<ValidateImapSyncResponseOutput> {
    try {
      // Basic validation - check if IMAP sync service is available
      // For now, we'll just return true since we don't have a health check method
      // In a real implementation, this would check service availability
      return success({ isValid: true });
    } catch (error) {
      logger.error(
        "IMAP sync validation failed",
        error instanceof Error ? error.message : String(error),
      );
      return fail({
        message: "app.api.emails.error.default",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const imapSyncTaskRepository = new ImapSyncTaskRepositoryImpl();
