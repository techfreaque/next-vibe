/**
 * IMAP Sync Repository Definition
 * Types for IMAP synchronization operations
 */

import "server-only";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { ImapAccount, ImapFolder } from "../../messages/db";

/**
 * Sync Result Interface
 */
export interface SyncResult {
  success: boolean;
  message: TranslationKey;
  results: {
    accountsProcessed: number;
    foldersProcessed: number;
    messagesProcessed: number;
    foldersAdded: number;
    foldersUpdated: number;
    foldersDeleted: number;
    messagesAdded: number;
    messagesUpdated: number;
    messagesDeleted: number;
    duration: number;
    errors: ErrorResponseType[];
  };
}

/**
 * Sync All Accounts Request Type
 */
export interface SyncAllAccountsRequestTypeOutput {
  // No specific parameters needed for syncing all accounts
  [key: string]: never;
}

/**
 * Sync All Accounts Response Type
 */
export interface SyncAllAccountsResponseTypeOutput {
  result: SyncResult;
}

/**
 * Sync Account Request Type
 */
export interface SyncAccountRequestTypeOutput {
  account: ImapAccount;
}

/**
 * Sync Account Response Type
 */
export interface SyncAccountResponseTypeOutput {
  result: SyncResult;
}

/**
 * Sync Account Folders Request Type
 */
export interface SyncAccountFoldersRequestTypeOutput {
  account: ImapAccount;
}

/**
 * Sync Account Folders Response Type
 */
export interface SyncAccountFoldersResponseTypeOutput {
  result: SyncResult;
}

/**
 * Sync Folder Messages Request Type
 */
export interface SyncFolderMessagesRequestTypeOutput {
  account: ImapAccount;
  folder: ImapFolder;
}

/**
 * Sync Folder Messages Response Type
 */
export interface SyncFolderMessagesResponseTypeOutput {
  result: SyncResult;
}
