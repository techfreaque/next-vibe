/**
 * IMAP Client Database Helpers
 *
 * imap_accounts and imap_folders tables have been removed.
 * All IMAP account data lives in messenger_accounts.
 * All folder data lives in messenger_folders.
 * Use toImapShape() to convert a MessengerAccount row to the ImapAccountShape expected by IMAP services.
 */

import type { messengerAccounts } from "../../../accounts/db";
import type { ImapAuthMethodValue, ImapSyncStatusValue } from "./enum";
import { ImapAuthMethod, ImapSyncStatus } from "./enum";

/**
 * ImapAccountShape — normalized view of a MessengerAccount's IMAP fields.
 * Used everywhere the old ImapAccount type was used in IMAP services.
 */
export interface ImapAccountShape {
  id: string;
  name: string;
  email: string; // smtpFromEmail used as email identity
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  authMethod: typeof ImapAuthMethodValue;
  connectionTimeout: number;
  keepAlive: boolean;
  enabled: boolean;
  syncInterval: number;
  maxMessages: number;
  syncFolders: string[];
  lastSyncAt: Date | null;
  syncStatus: typeof ImapSyncStatusValue;
  syncError: string | null;
  isConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Map a MessengerAccount row to ImapAccountShape for use in IMAP services.
 */
export function toImapShape(
  account: typeof messengerAccounts.$inferSelect,
): ImapAccountShape {
  return {
    id: account.id,
    name: account.name,
    email: account.smtpFromEmail ?? account.imapUsername ?? "",
    host: account.imapHost ?? "",
    port: account.imapPort ?? 993,
    secure: account.imapSecure ?? true,
    username: account.imapUsername ?? "",
    password: account.imapPassword ?? "",
    authMethod: account.imapAuthMethod ?? ImapAuthMethod.PLAIN,
    connectionTimeout: account.imapConnectionTimeout ?? 30000,
    keepAlive: account.imapKeepAlive ?? true,
    enabled: account.imapSyncEnabled ?? false,
    syncInterval: account.imapSyncInterval ?? 60,
    maxMessages: account.imapMaxMessages ?? 1000,
    syncFolders: account.imapSyncFolders ?? ["INBOX"],
    lastSyncAt: account.imapLastSyncAt,
    syncStatus: ImapSyncStatus.PENDING,
    syncError: account.imapSyncError,
    isConnected: account.imapIsConnected ?? false,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
