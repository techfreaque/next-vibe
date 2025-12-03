/**
 * IMAP Health Monitoring Repository
 * Handles health monitoring data retrieval and processing
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
import { imapAccountsRepository } from "../accounts/repository";
import { imapAccounts } from "../db";
import {
  ImapAccountSortField,
  ImapAccountStatusFilter,
  ImapHealthStatus,
  ImapSyncStatus,
  SortOrder,
} from "../enum";
import type {
  ImapHealthGetRequestOutput,
  ImapHealthGetResponseOutput,
} from "./definition";

/**
 * IMAP Health Repository Interface
 */
export interface ImapHealthRepository {
  getHealthStatus(
    data: ImapHealthGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapHealthGetResponseOutput>>;
}

/**
 * IMAP Health Repository Class
 */
class ImapHealthRepositoryImpl implements ImapHealthRepository {
  /**
   * Get current IMAP server health status
   */
  async getHealthStatus(
    data: ImapHealthGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapHealthGetResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.health.health.get.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: accountsResponse.message },
          cause: accountsResponse,
        });
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

      return success({
        accountsHealthy: syncedAccounts,
        accountsTotal: totalAccounts,
        connectionsActive: activeConnections,
        connectionErrors: failedAccounts,
        lastSyncAt: lastSyncTime,
        status: this.determineHealthStatus(accounts),
        syncStats: {
          totalSyncs: totalAccounts,
          lastSyncTime: lastSyncTime,
        },
        serverStatus: this.determineHealthStatus(accounts),
        uptime: "N/A",
        syncedAccounts,
        totalAccounts,
        activeConnections,
        avgResponseTime: 0,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Error getting IMAP health status", parsedError);
      return fail({
        message:
          "app.api.emails.imapClient.health.health.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Determine overall health status based on account states
   */
  private determineHealthStatus(
    accounts: Array<{ syncStatus: string; isConnected: boolean }>,
  ):
    | typeof ImapHealthStatus.HEALTHY
    | typeof ImapHealthStatus.WARNING
    | typeof ImapHealthStatus.ERROR
    | typeof ImapHealthStatus.MAINTENANCE {
    if (accounts.length === 0) {
      return ImapHealthStatus.WARNING;
    }

    const connectedAccounts = accounts.filter((account) => account.isConnected);
    const errorAccounts = accounts.filter(
      (account) => account.syncStatus === ImapSyncStatus.ERROR,
    );

    if (errorAccounts.length > accounts.length * 0.5) {
      return ImapHealthStatus.ERROR;
    }

    if (connectedAccounts.length > accounts.length * 0.8) {
      return ImapHealthStatus.HEALTHY;
    }

    if (connectedAccounts.length > 0) {
      return ImapHealthStatus.WARNING;
    }

    return ImapHealthStatus.ERROR;
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
      .toSorted((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return syncTimes.length > 0 ? syncTimes[0] : null;
  }
}

export const imapHealthRepository = new ImapHealthRepositoryImpl();
