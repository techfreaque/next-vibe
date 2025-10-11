/**
 * IMAP Accounts Repository
 * Data access layer for IMAP account management functionality
 */

import "server-only";

import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import Imap from "imap";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ImapAccount, NewImapAccount } from "../../messages/db";
import { imapAccounts } from "../../messages/db";
import {
  ImapAccountSortField,
  ImapAccountStatusFilter,
  ImapAuthMethod,
  type ImapAuthMethodValue,
  ImapConnectionStatus,
  ImapSyncStatus,
  SortOrder,
} from "../enum";
import type { ImapAccountPutRequestTypeOutput } from "./[id]/definition";
import type {
  ImapAccountCreatePostRequestOutput,
  ImapAccountCreatePostResponseOutput,
} from "./create/definition";
import type {
  ImapAccountsListRequestOutput,
  ImapAccountsListResponseOutput,
} from "./list/definition";
import type { ImapAccountTestPostResponseTypeOutput } from "./test/definition";

// Type aliases for consistent naming across the repository
export type ImapAccountCreateRequestTypeOutput =
  ImapAccountCreatePostRequestOutput;
export type ImapAccountResponseTypeOutput =
  ImapAccountCreatePostResponseOutput["account"];
export type ImapAccountListRequestTypeOutput = ImapAccountsListRequestOutput;
export type ImapAccountListResponseTypeOutput = ImapAccountsListResponseOutput;
export type ImapAccountUpdateRequestTypeOutput =
  ImapAccountPutRequestTypeOutput;
export type ImapAccountTestResponseTypeOutput =
  ImapAccountTestPostResponseTypeOutput;

/**
 * IMAP Accounts Repository Interface
 */
export interface ImapAccountsRepository {
  createAccount(
    data: ImapAccountCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>>;

  listAccounts(
    data: ImapAccountListRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountListResponseTypeOutput>>;

  getAccountById(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>>;

  updateAccount(
    data: ImapAccountUpdateRequestTypeOutput & { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>>;

  deleteAccount(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>>;

  testAccountConnection(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseTypeOutput>>;
}

/**
 * IMAP Accounts Repository Implementation
 */
class ImapAccountsRepositoryImpl implements ImapAccountsRepository {
  /**
   * Format IMAP account for response
   */
  private formatAccountResponse(
    account: ImapAccount,
  ): ImapAccountResponseTypeOutput {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      host: account.host,
      port: account.port,
      secure: account.secure || false,
      username: account.username,
      authMethod:
        (account.authMethod as typeof ImapAuthMethodValue) ||
        ImapAuthMethod.PLAIN,
      connectionTimeout: account.connectionTimeout || 30000,
      keepAlive: account.keepAlive || false,
      enabled: account.enabled || false,
      syncInterval: account.syncInterval || 300,
      maxMessages: account.maxMessages || 1000,
      syncFolders: (account.syncFolders as string[]) || [],
      lastSyncAt: account.lastSyncAt?.toISOString() || null,
      syncStatus: account.syncStatus || ImapSyncStatus.PENDING,
      syncError: account.syncError || null,
      isConnected: account.isConnected || false,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  /**
   * Create IMAP account
   */
  async createAccount(
    data: ImapAccountCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>> {
    try {
      logger.debug("Creating IMAP account", {
        email: data.basicInfo?.email,
        host: data.serverConnection?.host,
        userId: user.id,
      });

      // Extract values from nested structure
      const email = data.basicInfo?.email || "";
      const name = data.basicInfo?.name || "";
      const host = data.serverConnection?.host || "";
      const port = data.serverConnection?.port || 993;
      const secure = data.serverConnection?.secure ?? true;
      const username = data.authentication?.username || "";
      const password = data.authentication?.password || "";
      const authMethod =
        data.authentication?.authMethod || ImapAuthMethod.PLAIN;
      const connectionTimeout =
        data.advancedSettings?.connectionTimeout || 30000;
      const keepAlive = data.advancedSettings?.keepAlive ?? true;
      const enabled = data.syncConfiguration?.enabled ?? true;
      const syncInterval = data.syncConfiguration?.syncInterval || 300;
      const maxMessages = data.syncConfiguration?.maxMessages || 1000;
      const syncFolders = data.syncConfiguration?.syncFolders || ["INBOX"];

      // Check if account with this email already exists
      const existingAccount = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.email, email.toLowerCase().trim()))
        .limit(1);

      if (existingAccount.length > 0) {
        return createErrorResponse(
          "imapErrors.accounts.post.error.duplicate.title",
          ErrorResponseTypes.CONFLICT,
        );
      }

      const newAccount: NewImapAccount = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        host: host.trim(),
        port,
        secure,
        username: username.trim(),
        password, // Should be encrypted in production
        authMethod,
        connectionTimeout,
        keepAlive,
        enabled,
        syncInterval,
        maxMessages,
        syncFolders,
        syncStatus: ImapSyncStatus.PENDING,
        isConnected: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [createdAccount] = await db
        .insert(imapAccounts)
        .values(newAccount)
        .returning();

      logger.debug("IMAP account created successfully", {
        id: createdAccount.id,
        email: createdAccount.email,
      });

      return createSuccessResponse(this.formatAccountResponse(createdAccount));
    } catch (error) {
      logger.error("Error creating IMAP account", parseError(error));
      return createErrorResponse(
        "imapErrors.accounts.post.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * List IMAP accounts with filtering and pagination
   */
  async listAccounts(
    data: ImapAccountListRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountListResponseTypeOutput>> {
    try {
      logger.debug("Listing IMAP accounts", { ...data, userId: user.id });

      // Provide defaults for required fields
      const queryData = {
        ...data,
        status: data.status ?? ImapAccountStatusFilter.ALL,
        sortBy: data.sortBy ?? ImapAccountSortField.CREATED_AT,
        sortOrder: data.sortOrder ?? ("desc" as const),
        page: data.page ?? 1,
        limit: data.limit ?? 10,
      };

      const page = queryData.page;
      const limit = Math.min(queryData.limit, 100);
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = [];

      // Search filter
      if (queryData.search) {
        const searchTerm = `%${queryData.search.toLowerCase()}%`;
        whereConditions.push(
          or(
            ilike(imapAccounts.name, searchTerm),
            ilike(imapAccounts.email, searchTerm),
            ilike(imapAccounts.host, searchTerm),
          ),
        );
      }

      // Status filter
      if (
        queryData.status &&
        queryData.status !== ImapAccountStatusFilter.ALL
      ) {
        if (queryData.status === ImapAccountStatusFilter.ENABLED) {
          whereConditions.push(eq(imapAccounts.enabled, true));
        } else if (queryData.status === ImapAccountStatusFilter.DISABLED) {
          whereConditions.push(eq(imapAccounts.enabled, false));
        } else if (queryData.status === ImapAccountStatusFilter.CONNECTED) {
          whereConditions.push(eq(imapAccounts.isConnected, true));
        } else if (queryData.status === ImapAccountStatusFilter.DISCONNECTED) {
          whereConditions.push(eq(imapAccounts.isConnected, false));
        }
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get total count
      const [{ count: totalCount }] = await db
        .select({ count: count() })
        .from(imapAccounts)
        .where(whereClause);

      // Build order by clause
      const sortField =
        queryData.sortBy === ImapAccountSortField.NAME
          ? imapAccounts.name
          : queryData.sortBy === ImapAccountSortField.EMAIL
            ? imapAccounts.email
            : queryData.sortBy === ImapAccountSortField.HOST
              ? imapAccounts.host
              : imapAccounts.createdAt;

      const orderBy =
        queryData.sortOrder === SortOrder.ASC
          ? asc(sortField)
          : desc(sortField);

      // Get accounts with pagination
      const accounts = await db
        .select()
        .from(imapAccounts)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      const totalPages = Math.ceil(totalCount / limit);

      return createSuccessResponse({
        accounts: accounts.map((account) =>
          this.formatAccountResponse(account),
        ),
        total: totalCount,
        page,
        limit,
        totalPages,
      });
    } catch (error) {
      logger.error("Error listing IMAP accounts", parseError(error));
      return createErrorResponse(
        "imapErrors.accounts.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get IMAP account by ID
   */
  async getAccountById(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>> {
    try {
      logger.debug("Getting IMAP account by ID", {
        id: data.id,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.id, data.id))
        .limit(1);

      if (!account) {
        return createErrorResponse(
          "imapErrors.accounts.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(this.formatAccountResponse(account));
    } catch (error) {
      logger.error("Error getting IMAP account by ID", parseError(error));
      return createErrorResponse(
        "imapErrors.accounts.get.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Update IMAP account
   */
  async updateAccount(
    data: ImapAccountUpdateRequestTypeOutput & { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountResponseTypeOutput>> {
    try {
      logger.debug("Updating IMAP account", {
        id: data.id,
        userId: user.id,
      });

      // Check if account exists
      const [existingAccount] = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.id, data.id))
        .limit(1);

      if (!existingAccount) {
        return createErrorResponse(
          "imapErrors.accounts.put.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Check for email conflicts if email is being updated
      if (data.email && data.email !== existingAccount.email) {
        const emailConflict = await db
          .select()
          .from(imapAccounts)
          .where(
            and(
              eq(imapAccounts.email, data.email.toLowerCase().trim()),
              ne(imapAccounts.id, data.id),
            ),
          )
          .limit(1);

        if (emailConflict.length > 0) {
          return createErrorResponse(
            "imapErrors.accounts.put.error.duplicate.title",
            ErrorResponseTypes.CONFLICT,
          );
        }
      }

      const updateData = {
        name: data.name,
        email: data.email?.toLowerCase().trim(),
        host: data.host,
        port: data.port,
        secure: data.secure,
        username: data.username,
        password: data.password,
        authMethod: data.authMethod,
        connectionTimeout: data.connectionTimeout,
        keepAlive: data.keepAlive,
        enabled: data.enabled,
        syncInterval: data.syncInterval,
        maxMessages: data.maxMessages,
        syncFolders: data.syncFolders,
        updatedAt: new Date(),
      };

      const [updatedAccount] = await db
        .update(imapAccounts)
        .set(updateData as Partial<ImapAccount>)
        .where(eq(imapAccounts.id, data.id))
        .returning();

      logger.debug("IMAP account updated successfully", {
        id: updatedAccount.id,
        email: updatedAccount.email,
      });

      return createSuccessResponse(this.formatAccountResponse(updatedAccount));
    } catch (error) {
      logger.error("Error updating IMAP account", parseError(error));
      return createErrorResponse(
        "imapErrors.accounts.put.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Delete IMAP account
   */
  async deleteAccount(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    try {
      logger.debug("Deleting IMAP account", {
        id: data.id,
        userId: user.id,
      });

      const [existingAccount] = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.id, data.id))
        .limit(1);

      if (!existingAccount) {
        return createErrorResponse(
          "imapErrors.accounts.delete.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      await withTransaction(logger, async (tx) => {
        // Delete related folders and messages would be handled by cascade
        await tx.delete(imapAccounts).where(eq(imapAccounts.id, data.id));
      });

      logger.debug("IMAP account deleted successfully", { id: data.id });

      return createSuccessResponse({
        success: true,
        message: "imapErrors.accounts.delete.success.title",
      });
    } catch (error) {
      logger.error("Error deleting IMAP account", parseError(error));
      return createErrorResponse(
        "imapErrors.accounts.delete.error.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Test IMAP account connection
   */
  async testAccountConnection(
    data: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseTypeOutput>> {
    try {
      logger.debug("Testing IMAP account connection", {
        accountId: data.id,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.id, data.id))
        .limit(1);

      if (!account) {
        return createErrorResponse(
          "imapErrors.accounts.get.error.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      // Test IMAP connection inline
      const connectionResult = await this.testImapConnection(account, logger);
      return connectionResult;
    } catch (error) {
      logger.error("Error testing IMAP account connection", parseError(error));
      return createErrorResponse(
        "imapErrors.connection.timeout.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Test IMAP connection - migrated from service
   */
  private async testImapConnection(
    account: ImapAccount,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseTypeOutput>> {
    const startTime = Date.now();

    try {
      logger.debug("Testing IMAP connection", {
        host: account.host,
        port: account.port,
        username: account.username,
      });

      // Basic validation
      if (
        !account.host ||
        !account.port ||
        !account.username ||
        !account.password
      ) {
        logger.error("IMAP connection test failed", {
          error: "Missing required configuration",
        });
        return createErrorResponse(
          "imapErrors.validation.account.username.required",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Validate port range
      if (account.port < 1 || account.port > 65535) {
        logger.error("IMAP connection test failed", {
          error: "Invalid port number",
          port: account.port,
        });
        return createErrorResponse(
          "imapErrors.validation.account.port.invalid",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Validate host format (basic check)
      if (!/^[a-zA-Z0-9.-]+$/.test(account.host)) {
        logger.error("IMAP connection test failed", {
          error: "Invalid host format",
          host: account.host,
        });
        return createErrorResponse(
          "imapErrors.validation.account.host.invalid",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Implement actual IMAP connection test using node-imap
      return await new Promise<ResponseType<ImapAccountTestResponseTypeOutput>>(
        (resolve) => {
          const imap = new Imap({
            user: account.username,
            password: account.password,
            host: account.host,
            port: account.port,
            tls: account.secure ?? false,
            connTimeout: 10000,
            authTimeout: 5000,
          });

          let resolved = false;

          const resolveOnce = (
            result: ResponseType<ImapAccountTestResponseTypeOutput>,
          ): void => {
            if (!resolved) {
              resolved = true;
              resolve(result);
            }
          };

          imap.once("ready", () => {
            const responseTime = Date.now() - startTime;

            logger.debug("IMAP connection test successful", {
              host: account.host,
              responseTime,
            });

            resolveOnce(
              createSuccessResponse({
                success: true,
                message: "imap.connection.test.success",
                connectionStatus: ImapConnectionStatus.CONNECTED,
                details: {
                  host: account.host,
                  port: account.port,
                  secure: account.secure || false,
                  authMethod: account.authMethod || ImapAuthMethod.PLAIN,
                  responseTime,
                  serverCapabilities: [],
                },
              }),
            );

            imap.end();
          });

          imap.once("error", (error: Error) => {
            logger.error("IMAP connection test failed", {
              error: error.message || "IMAP connection error",
              host: account.host,
              port: account.port,
              secure: account.secure,
              username: account.username,
              errorDetails: error,
            });

            resolveOnce(
              createErrorResponse(
                "imapErrors.connection.test.failed",
                ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                { error: parseError(error).message },
              ),
            );
          });

          // Timeout fallback
          setTimeout(() => {
            resolveOnce(
              createErrorResponse(
                "imap.connection.test.timeout",
                ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              ),
            );
          }, 15000);

          imap.connect();
        },
      );
    } catch (error) {
      logger.error("IMAP connection test failed", parseError(error));
      return createErrorResponse(
        "imap.connection.test.failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const imapAccountsRepository = new ImapAccountsRepositoryImpl();
