import { translations as accountsTranslations } from "../../accounts/i18n/en";
import { translations as configTranslations } from "../../config/i18n/en";
import { translations as foldersTranslations } from "../../folders/i18n/en";
import { translations as healthTranslations } from "../../health/i18n/en";
import { translations as messagesTranslations } from "../../messages/i18n/en";
import { translations as syncTranslations } from "../../sync/i18n/en";

export const translations = {
  category: "IMAP Client",
  tag: "IMAP Client",
  tags: {
    health: "Health",
    monitoring: "Monitoring",
    sync: "Synchronization",
    accounts: "Accounts",
    folders: "Folders",
    messages: "Messages",
    config: "Configuration",
  },
  accounts: accountsTranslations,
  config: configTranslations,
  folders: foldersTranslations,
  health: healthTranslations,
  messages: messagesTranslations,
  sync: syncTranslations,
  enums: {
    syncStatus: {
      pending: "Pending",
      syncing: "Syncing",
      synced: "Synced",
      error: "Error",
    },
    overallSyncStatus: {
      idle: "Idle",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    authMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Inbox",
      sent: "Sent",
      drafts: "Drafts",
      trash: "Trash",
      junk: "Junk",
      archive: "Archive",
    },
    folderSortField: {
      name: "Name",
      displayName: "Display Name",
      messageCount: "Message Count",
      unseenCount: "Unseen Count",
      createdAt: "Created At",
    },
    accountSortField: {
      name: "Name",
      email: "Email",
      host: "Host",
      enabled: "Enabled",
      lastSyncAt: "Last Sync At",
      createdAt: "Created At",
    },
    connectionStatus: {
      disconnected: "Disconnected",
      connecting: "Connecting",
      connected: "Connected",
      error: "Error",
      timeout: "Timeout",
    },
    syncStatusFilter: {
      all: "All Sync Statuses",
    },
    accountStatusFilter: {
      all: "All Account Statuses",
      enabled: "Enabled",
      disabled: "Disabled",
    },
    accountFilter: {
      all: "All Accounts",
    },
    messageSortField: {
      subject: "Subject",
      senderName: "Sender Name",
      senderEmail: "Sender Email",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      isRead: "Read Status",
      isFlagged: "Flagged",
      messageSize: "Message Size",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    messageStatusFilter: {
      all: "All Messages",
      read: "Read",
      unread: "Unread",
      flagged: "Flagged",
      unflagged: "Unflagged",
      draft: "Draft",
      deleted: "Deleted",
      hasAttachments: "Has Attachments",
      noAttachments: "No Attachments",
    },
    healthStatus: {
      healthy: "Healthy",
      warning: "Warning",
      error: "Error",
      maintenance: "Maintenance",
    },
    performanceStatus: {
      good: "Good",
      warning: "Warning",
      error: "Error",
    },
  },
};
