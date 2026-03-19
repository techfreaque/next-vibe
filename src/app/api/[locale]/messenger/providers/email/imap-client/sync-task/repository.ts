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
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { ImapSyncRepository } from "../sync-service/repository";

interface TaskConfig {
  maxAccountsPerRun: number;
  enableFolderSync: boolean;
  enableMessageSync: boolean;
  dryRun: boolean;
}

interface TaskResult {
  accountsProcessed: number;
  accountsSuccessful: number;
  accountsFailed: number;
  foldersProcessed?: number;
  messagesProcessed?: number;
  errors: Array<{ accountId: string; stage: string; error: string }>;
  summary: {
    totalAccounts: number;
    activeAccounts: number;
    syncedAccounts: number;
    failedAccounts: number;
  };
}

interface ExecuteImapSyncResult {
  result: TaskResult;
}

export class ImapSyncTaskRepository {
  static async executeImapSync(
    config: TaskConfig,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ExecuteImapSyncResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    logger.info("tasks.imap_sync.start", {
      maxAccountsPerRun: config.maxAccountsPerRun ?? 0,
      enableFolderSync: config.enableFolderSync ?? false,
      enableMessageSync: config.enableMessageSync ?? false,
      dryRun: config.dryRun ?? false,
    });

    try {
      const syncResult = await ImapSyncRepository.syncAllAccounts(
        logger,
        locale,
      );

      if (syncResult.success) {
        const result: TaskResult = {
          accountsProcessed: syncResult.data.result.results.accountsProcessed,
          accountsSuccessful: syncResult.data.result.results.accountsProcessed,
          accountsFailed: 0,
          foldersProcessed: config.enableFolderSync
            ? syncResult.data.result.results.foldersProcessed
            : undefined,
          messagesProcessed: config.enableMessageSync
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
      logger.error("tasks.imap_sync.failed", { error: syncResult.message });
      return fail({
        message: t("imap.sync.errors.default"),
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
        message: t("imap.sync.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static validateImapSync(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): ResponseType<{ isValid: boolean }> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      return success({ isValid: true });
    } catch (error) {
      logger.error(
        "IMAP sync validation failed",
        error instanceof Error ? error.message : String(error),
      );
      return fail({
        message: t("imap.sync.errors.default"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
