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
export interface ExecuteImapSyncRequestOutput {
  config: TaskConfigType;
}

/**
 * Execute IMAP Sync Response Type
 */
export interface ExecuteImapSyncResponseOutput {
  result: TaskResultType;
}

/**
 * Validate IMAP Sync Request Type
 */
export interface ValidateImapSyncRequestOutput {
  // No specific parameters needed for validation
  [key: string]: never;
}

/**
 * Validate IMAP Sync Response Type
 */
export interface ValidateImapSyncResponseOutput {
  isValid: boolean;
}

const definitions = {};

export default definitions;
