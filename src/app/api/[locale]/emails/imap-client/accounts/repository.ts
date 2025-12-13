/**
 * IMAP Accounts Repository
 * Data access layer for IMAP account management functionality
 */

import "server-only";

import { and, asc, count, desc, eq, ilike, ne, or } from "drizzle-orm";
import Imap from "imap";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { withTransaction } from "@/app/api/[locale]/system/db/utils/repository-helpers";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ImapAccount, NewImapAccount } from "../db";
import { imapAccounts } from "../db";
import {
  ImapAccountSortField,
  ImapAccountStatusFilter,
  ImapAuthMethod,
  type ImapAuthMethodValue,
  ImapConnectionStatus,
  ImapSyncStatus,
  type ImapSyncStatusValue,
  SortOrder,
} from "../enum";
import type {
  ImapAccountGetResponseOutput,
  ImapAccountPutRequestOutput,
  ImapAccountPutResponseOutput,
} from "./[id]/definition";
import type {
  ImapAccountCreatePostRequestOutput,
  ImapAccountCreatePostResponseOutput,
} from "./create/definition";
import type {
  ImapAccountsListRequestOutput,
  ImapAccountsListResponseOutput,
} from "./list/definition";
import type { ImapAccountTestPostResponseOutput } from "./test/definition";

// Type aliases for consistent naming across the repository
export type ImapAccountCreateRequestOutput = ImapAccountCreatePostRequestOutput;
export type ImapAccountCreateResponseOutput =
  ImapAccountCreatePostResponseOutput;
export type ImapAccountListRequestOutput = ImapAccountsListRequestOutput;
export type ImapAccountListResponseOutput = ImapAccountsListResponseOutput;
export type ImapAccountUpdateRequestOutput = ImapAccountPutRequestOutput;
export type ImapAccountTestResponseOutput = ImapAccountTestPostResponseOutput;

/**
 * IMAP Accounts Repository Interface
 */
export interface ImapAccountsRepository {
  createAccount(
    data: ImapAccountCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountCreateResponseOutput>>;

  listAccounts(
    data: ImapAccountListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountListResponseOutput>>;

  getAccountById(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountGetResponseOutput>>;

  updateAccount(
    data: ImapAccountUpdateRequestOutput & { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountPutResponseOutput>>;

  deleteAccount(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>>;

  testAccountConnection(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseOutput>>;
}

/**
 * IMAP Accounts Repository Implementation
 */
class ImapAccountsRepositoryImpl implements ImapAccountsRepository {
  /**
   * Format IMAP account for create response (nested structure)
   */
  private formatAccountForCreate(
    account: ImapAccount,
  ): ImapAccountCreateResponseOutput["account"] {
    return {
      accountSummary: {
        id: account.id,
        name: account.name,
        email: account.email,
        connectionStatus: account.isConnected || false,
      },
      connectionDetails: {
        host: account.host,
        port: account.port,
        secure: account.secure || false,
        username: account.username,
        authMethod:
          (account.authMethod as typeof ImapAuthMethodValue) ||
          ImapAuthMethod.PLAIN,
        connectionTimeout: account.connectionTimeout || 30000,
      },
      syncConfiguration: {
        enabled: account.enabled || false,
        syncStatus: account.syncStatus || ImapSyncStatus.PENDING,
        syncInterval: account.syncInterval || 300,
        maxMessages: account.maxMessages || 1000,
        syncFolders: (account.syncFolders as string[]) || [],
        lastSyncAt: account.lastSyncAt?.toISOString() || null,
      },
      metadata: {
        keepAlive: account.keepAlive || false,
        syncError: account.syncError || null,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Format IMAP account for GET response (flat structure)
   */
  private formatAccountForGet(
    account: ImapAccount,
  ): ImapAccountGetResponseOutput["account"] {
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
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  /**
   * Format IMAP account for PUT response (flat structure)
   */
  private formatAccountForPut(
    account: ImapAccount,
  ): ImapAccountPutResponseOutput["account"] {
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
      enabled: account.enabled || false,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };
  }

  /**
   * Format IMAP account for list response (flat structure)
   */
  private formatAccountForList(account: ImapAccount): {
    id: string;
    name: string;
    email: string;
    host: string;
    port: number;
    secure: boolean;
    username: string;
    authMethod: typeof ImapAuthMethodValue;
    connectionTimeout: number;
    keepAlive: boolean;
    enabled: boolean;
    syncInterval: number;
    maxMessages: number;
    syncFolders: string[];
    lastSyncAt: string | null;
    syncStatus: typeof ImapSyncStatusValue;
    syncError: string | null;
    isConnected: boolean;
    createdAt: string;
    updatedAt: string;
  } {
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
    data: ImapAccountCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountCreateResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.accounts.post.error.duplicate.title",
          errorType: ErrorResponseTypes.CONFLICT,
        });
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

      return success({
        account: this.formatAccountForCreate(createdAccount),
      });
    } catch (error) {
      logger.error("Error creating IMAP account", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.accounts.post.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * List IMAP accounts with filtering and pagination
   */
  async listAccounts(
    data: ImapAccountListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountListResponseOutput>> {
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

      return success({
        accounts: accounts.map((account) => this.formatAccountForList(account)),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error) {
      logger.error("Error listing IMAP accounts", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.accounts.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get IMAP account by ID
   */
  async getAccountById(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountGetResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.accounts.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        account: this.formatAccountForGet(account),
      });
    } catch (error) {
      logger.error("Error getting IMAP account by ID", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.accounts.get.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update IMAP account
   */
  async updateAccount(
    data: ImapAccountUpdateRequestOutput & { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountPutResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.accounts.put.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
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
          return fail({
            message:
              "app.api.emails.imapClient.imapErrors.accounts.put.error.duplicate.title",
            errorType: ErrorResponseTypes.CONFLICT,
          });
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

      return success({
        account: this.formatAccountForPut(updatedAccount),
      });
    } catch (error) {
      logger.error("Error updating IMAP account", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.accounts.put.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Delete IMAP account
   */
  async deleteAccount(
    data: { id: string },
    user: JwtPayloadType,
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.accounts.delete.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      await withTransaction(logger, async (tx) => {
        // Delete related folders and messages would be handled by cascade
        await tx.delete(imapAccounts).where(eq(imapAccounts.id, data.id));
      });

      logger.debug("IMAP account deleted successfully", { id: data.id });

      return success({
        success: true,
        message:
          "app.api.emails.imapClient.imapErrors.accounts.delete.success.title",
      });
    } catch (error) {
      logger.error("Error deleting IMAP account", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.accounts.delete.error.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Test IMAP account connection
   */
  async testAccountConnection(
    data: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.accounts.get.error.not_found.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Test IMAP connection inline
      const connectionResult = await this.testImapConnection(account, logger);
      return connectionResult;
    } catch (error) {
      logger.error("Error testing IMAP account connection", parseError(error));
      return fail({
        message:
          "app.api.emails.imapClient.imapErrors.connection.timeout.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Test IMAP connection - migrated from service
   */
  private async testImapConnection(
    account: ImapAccount,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapAccountTestResponseOutput>> {
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
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.validation.account.username.required",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Validate port range
      if (account.port < 1 || account.port > 65535) {
        logger.error("IMAP connection test failed", {
          error: "Invalid port number",
          port: account.port,
        });
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.validation.account.port.invalid",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Validate host format (basic check)
      if (!/^[a-zA-Z0-9.-]+$/.test(account.host)) {
        logger.error("IMAP connection test failed", {
          error: "Invalid host format",
          host: account.host,
        });
        return fail({
          message:
            "app.api.emails.imapClient.imapErrors.validation.account.host.invalid",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Implement actual IMAP connection test using node-imap
      return await new Promise<ResponseType<ImapAccountTestResponseOutput>>(
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
            result: ResponseType<ImapAccountTestResponseOutput>,
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
              success({
                success: true,
                message:
                  "app.api.emails.imapClient.imap.connection.test.success",
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
              fail({
                message:
                  "app.api.emails.imapClient.imapErrors.connection.test.failed",
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                messageParams: { error: parseError(error).message },
              }),
            );
          });

          // Timeout fallback
          setTimeout(() => {
            resolveOnce(
              fail({
                message:
                  "app.api.emails.imapClient.imap.connection.test.timeout",
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              }),
            );
          }, 15000);

          imap.connect();
        },
      );
    } catch (error) {
      logger.error("IMAP connection test failed", parseError(error));
      return fail({
        message: "app.api.emails.imapClient.imap.connection.test.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Export singleton instance
 */
export const imapAccountsRepository = new ImapAccountsRepositoryImpl();
