/**
 * IMAP Sync Task Repository Definition
 * Types for IMAP sync task operations
 */

import "server-only";

/**
 * Task Configuration Schema Type
 */
export interface TaskConfigType {
  maxAccountsPerRun: number;
  enableFolderSync: boolean;
  enableMessageSync: boolean;
  dryRun: boolean;
}

/**
 * Task Result Type
 */
export interface TaskResultType {
  accountsProcessed: number;
  accountsSuccessful: number;
  accountsFailed: number;
  foldersProcessed?: number;
  messagesProcessed?: number;
  errors: Array<{
    accountId: string;
    stage: string;
    error: string;
  }>;
  summary: {
    totalAccounts: number;
    activeAccounts: number;
    syncedAccounts: number;
    failedAccounts: number;
  };
}

/**
 * Execute IMAP Sync Request Type
 */
export interface ExecuteImapSyncRequestTypeOutput {
  config: TaskConfigType;
}

/**
 * Execute IMAP Sync Response Type
 */
export interface ExecuteImapSyncResponseTypeOutput {
  result: TaskResultType;
}

/**
 * Validate IMAP Sync Request Type
 */
export interface ValidateImapSyncRequestTypeOutput {
  // No specific parameters needed for validation
  [key: string]: never;
}

/**
 * Validate IMAP Sync Response Type
 */
export interface ValidateImapSyncResponseTypeOutput {
  isValid: boolean;
}
