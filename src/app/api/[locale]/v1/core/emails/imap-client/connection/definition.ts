/**
 * IMAP Connection Repository Definition
 * Types for IMAP connection management operations
 */

import "server-only";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { ImapAccount } from "../../messages/db";
import type { ImapConnectionStatus, ImapSpecialUseType } from "../enum";

/**
 * IMAP Connection Configuration
 */
export interface ImapConnectionConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  authMethod: string;
  connectionTimeout: number;
  keepAlive: boolean;
}

/**
 * IMAP Connection Result
 */
export interface ImapConnectionResult {
  success: boolean;
  status: (typeof ImapConnectionStatus)[keyof typeof ImapConnectionStatus];
  message: string;
  details?: {
    host: string;
    port: number;
    secure: boolean;
    authMethod: string;
    responseTime?: number;
    serverCapabilities?: string[];
  };
  error?: string;
}

/**
 * IMAP Folder Information
 */
export interface ImapFolderInfo {
  name: string;
  displayName?: string;
  path: string;
  delimiter: string;
  isSelectable: boolean;
  hasChildren: boolean;
  isSpecialUse: boolean;
  specialUseType?: (typeof ImapSpecialUseType)[keyof typeof ImapSpecialUseType];
  uidValidity?: number;
  uidNext?: number;
  messageCount: number;
  recentCount: number;
  unseenCount: number;
}

/**
 * IMAP Message Information
 */
export interface ImapMessageInfo {
  uid: number;
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  size: number;
  flags: string[];
  headers: Record<string, string>;
  bodyText?: string;
  bodyHtml?: string;
  hasAttachments: boolean;
  attachmentCount: number;
}

/**
 * IMAP Connection Test Request Type
 */
export interface ImapConnectionTestRequestOutput {
  account: ImapAccount;
}

/**
 * IMAP Connection Test Response Type
 */
export interface ImapConnectionTestResponseOutput {
  success: boolean;
  message: TranslationKey;
  connectionStatus: (typeof ImapConnectionStatus)[keyof typeof ImapConnectionStatus];
  details?: {
    host: string;
    port: number;
    secure: boolean;
    authMethod: string;
    responseTime?: number;
    serverCapabilities?: string[];
  };
}

/**
 * IMAP Folder List Request Type
 */
export interface ImapFolderListRequestOutput {
  account: ImapAccount;
}

/**
 * IMAP Folder List Response Type
 */
export interface ImapFolderListResponseOutput {
  folders: ImapFolderInfo[];
}

/**
 * IMAP Message List Request Type
 */
export interface ImapMessageListRequestOutput {
  account: ImapAccount;
  folderPath: string;
  options?: {
    limit?: number;
    since?: Date;
    before?: Date;
    search?: string;
  };
}

/**
 * IMAP Message List Response Type
 */
export interface ImapMessageListResponseOutput {
  messages: ImapMessageInfo[];
}

/**
 * IMAP Connection Close Request Type
 */
export interface ImapConnectionCloseRequestOutput {
  account: ImapAccount;
}

/**
 * IMAP Connection Close Response Type
 */
export interface ImapConnectionCloseResponseOutput {
  success: boolean;
  message: TranslationKey;
}
