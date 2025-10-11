/**
 * IMAP Health Monitoring Repository
 * Handles health monitoring data retrieval and processing
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType } from "../../../user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { imapAccounts } from "../../messages/db";
import { imapAccountsRepository } from "../accounts/repository";
import {
  ImapAccountSortField,
  ImapAccountStatusFilter,
  ImapConnectionStatus,
  ImapSyncStatus,
  SortOrder,
} from "../enum";
import type {
  ImapHealthGetRequestTypeOutput,
  ImapHealthGetResponseTypeOutput,
} from "./definition";

/**
 * IMAP Health Repository Interface
 */
export interface ImapHealthRepository {
  getHealthStatus(
    data: ImapHealthGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapHealthGetResponseTypeOutput>>;
}

/**
 * IMAP Health Repository Class
 */
class ImapHealthRepositoryImpl implements ImapHealthRepository {
  /**
   * Get current IMAP server health status
   */
  async getHealthStatus(
    data: ImapHealthGetRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapHealthGetResponseTypeOutput>> {
    try {
      logger.debug("Getting IMAP health status", { userId: user.id });

      // Get account statistics
      const accountsResponse = await imapAccountsRepository.listAccounts(
        {
          status: ImapAccountStatusFilter.ALL,
          page: 1,
          sortBy: ImapAccountSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
          limit: 1000, // Get all accounts for stats
        },
        user,
        locale,
        logger,
      );

      if (!accountsResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.emails.imapClient.health.get.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          parseError(accountsResponse.error),
        );
      }

      const accounts = accountsResponse.data.accounts;
      const totalAccounts = accounts.length;
      const syncedAccounts = accounts.filter(
        (account) => account.syncStatus === ImapSyncStatus.SYNCED,
      ).length;
      const failedAccounts = accounts.filter(
        (account) => account.syncStatus === ImapSyncStatus.ERROR,
      ).length;

      // Calculate system metrics
      const activeConnections = await this.getActiveConnections();
      const lastSyncTime = this.getLastSyncTime(accounts);

      const healthData = {
        success: true,
        data: {
          accountsHealthy: syncedAccounts,
          accountsTotal: totalAccounts,
          connectionsActive: activeConnections,
          connectionErrors: failedAccounts,
          lastSyncAt: lastSyncTime,
          status: this.determineHealthStatus(accounts),
        },
        message:
          "app.api.v1.core.emails.imapClient.health.get.success.description",
      };

      return createSuccessResponse(healthData);
    } catch (error) {
      logger.error("Error getting IMAP health status", error);
      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.health.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        parseError(error),
      );
    }
  }

  /**
   * Determine overall health status based on account states
   */
  private determineHealthStatus(
    accounts: Array<{ syncStatus: string; isConnected: boolean }>,
  ): string {
    if (accounts.length === 0) {
      return ImapConnectionStatus.DISCONNECTED;
    }

    const connectedAccounts = accounts.filter((account) => account.isConnected);
    const errorAccounts = accounts.filter(
      (account) => account.syncStatus === ImapSyncStatus.ERROR,
    );

    if (errorAccounts.length > accounts.length * 0.5) {
      return ImapConnectionStatus.ERROR;
    }

    if (connectedAccounts.length > 0) {
      return ImapConnectionStatus.CONNECTED;
    }

    return ImapConnectionStatus.DISCONNECTED;
  }

  /**
   * Get active connections count
   */
  private async getActiveConnections(): Promise<number> {
    try {
      // Count active connections from accounts that are currently connected
      const [{ count: activeCount }] = await db
        .select({ count: count() })
        .from(imapAccounts)
        .where(
          and(
            eq(imapAccounts.enabled, true),
            eq(imapAccounts.isConnected, true),
          ),
        );

      return activeCount;
    } catch {
      // Error will be logged at the calling level
      return 0;
    }
  }

  /**
   * Get last sync time from accounts
   */
  private getLastSyncTime(
    accounts: Array<{ lastSyncAt: string | null }>,
  ): string | null {
    const syncTimes = accounts
      .map((account) => account.lastSyncAt)
      .filter((time): time is string => time !== null)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return syncTimes.length > 0 ? syncTimes[0] : null;
  }
}

export const imapHealthRepository = new ImapHealthRepositoryImpl();
