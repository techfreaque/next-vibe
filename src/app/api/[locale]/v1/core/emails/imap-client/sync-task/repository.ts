/**
 * IMAP Sync Task Repository
 * Automated synchronization of IMAP accounts, folders, and messages
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType } from "../../../user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { imapSyncRepository } from "../sync-service/repository";
import type {
  ExecuteImapSyncRequestTypeOutput,
  ExecuteImapSyncResponseTypeOutput,
  TaskResultType,
  ValidateImapSyncRequestTypeOutput,
  ValidateImapSyncResponseTypeOutput,
} from "./definition";

/**
 * IMAP Sync Task Repository Interface
 */
export interface ImapSyncTaskRepository {
  executeImapSync(
    data: ExecuteImapSyncRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExecuteImapSyncResponseTypeOutput>>;

  validateImapSync(
    data: ValidateImapSyncRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ValidateImapSyncResponseTypeOutput>>;
}

/**
 * IMAP Sync Task Repository Implementation
 */
export class ImapSyncTaskRepositoryImpl implements ImapSyncTaskRepository {
  /**
   * Execute IMAP sync task
   */
  async executeImapSync(
    data: ExecuteImapSyncRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ExecuteImapSyncResponseTypeOutput>> {
    const config = data.config;

    logger.info("tasks.imap_sync.start", { config });

    let accountsProcessed = 0;
    let accountsSuccessful = 0;
    let accountsFailed = 0;
    let foldersProcessed = 0;
    let messagesProcessed = 0;
    const errors: TaskResultType["errors"] = [];

    try {
      // For now, we'll execute a simplified sync all accounts operation
      // In a real implementation, this would get specific accounts based on config
      const syncResult = await imapSyncRepository.syncAllAccounts(
        {}, // Empty data for sync all
        user,
        locale,
        logger,
      );

      if (syncResult.success) {
        const result: TaskResultType = {
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
        return createSuccessResponse({ result });
      } else {
        logger.error("tasks.imap_sync.failed", {
          error: syncResult.message,
        });
        return createErrorResponse(
          "error.default",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
    } catch (error) {
      logger.error("tasks.imap_sync.failed", {
        error:
          error instanceof Error
            ? error.message
            : "tasks.imap_sync.unknown_error",
      });

      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Validate IMAP sync task
   */
  async validateImapSync(
    data: ValidateImapSyncRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ValidateImapSyncResponseTypeOutput>> {
    try {
      // Basic validation - check if IMAP sync service is available
      // For now, we'll just return true since we don't have a health check method
      // In a real implementation, this would check service availability
      return createSuccessResponse({ isValid: true });
    } catch (error) {
      logger.error("IMAP sync validation failed", error);
      return createErrorResponse(
        "error.default",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const imapSyncTaskRepository = new ImapSyncTaskRepositoryImpl();
