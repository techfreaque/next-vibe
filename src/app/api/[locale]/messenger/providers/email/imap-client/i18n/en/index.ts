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
  messages: {
    tag: "Messages",
    id: {
      widget: {
        markRead: "Mark as Read",
        markUnread: "Mark as Unread",
        flag: "Flag",
        unflag: "Unflag",
      },
    },
    errors: {
      server: { title: "Server Error" },
      notFound: { title: "Message Not Found" },
      accountNotFound: { title: "Account Not Found" },
      syncFailed: { title: "Sync Failed" },
      syncSuccess: { message: "Messages synced successfully" },
      list: {
        get: { errors: { server: { title: "Server error listing messages" } } },
      },
    },
  },
  sync: {
    category: "IMAP Client",

    title: "IMAP Sync",
    description: "IMAP synchronization service",
    container: {
      title: "IMAP Sync Configuration",
      description: "Configure IMAP synchronization parameters",
    },
    accountIds: {
      label: "Account IDs",
      description: "IMAP account IDs to sync",
      placeholder: "Enter account IDs separated by commas",
    },
    force: {
      label: "Force Sync",
      description: "Force synchronization even if recently synced",
    },
    dryRun: {
      label: "Dry Run",
      description: "Perform a test run without making changes",
    },
    maxMessages: {
      label: "Max Messages",
      description: "Maximum number of messages to sync per folder",
      placeholder: "Enter maximum number of messages",
    },
    post: {
      title: "Sync",
      description: "Sync endpoint",
      form: {
        title: "Sync Configuration",
        description: "Configure sync parameters",
      },
      response: {
        title: "Response",
        description: "Sync response data",
        result: {
          title: "Sync Results",
          description: "Detailed synchronization results",
          accountsProcessed: "Accounts Processed",
          foldersProcessed: "Folders Processed",
          messagesProcessed: "Messages Processed",
          messagesAdded: "Messages Added",
          messagesUpdated: "Messages Updated",
          messagesDeleted: "Messages Deleted",
          duration: "Duration",
        },
        errors: {
          error: {
            title: "Sync Error",
            description: "Error details",
            code: "Error Code",
            message: "Error Message",
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
    widget: {
      title: "Full IMAP Sync",
      options: "Sync Options",
      noAccounts: "No IMAP accounts configured",
      result: "Sync Result",
      duration: "Duration",
      errors: "Errors",
      accountsProcessed: "Accounts Processed",
      foldersProcessed: "Folders Processed",
      messagesProcessed: "Messages Processed",
      messagesAdded: "Messages Added",
      messagesUpdated: "Messages Updated",
      messagesDeleted: "Messages Deleted",
      submit: "Start Sync",
      submitting: "Syncing...",
    },
  },
  imapErrors: {
    accounts: {
      post: {
        error: {
          duplicate: {
            title: "Account already exists",
          },
          server: {
            title: "Server error creating account",
          },
        },
      },
      get: {
        error: {
          not_found: {
            title: "Account not found",
          },
          server: {
            title: "Server error retrieving account",
          },
        },
      },
      put: {
        error: {
          not_found: {
            title: "Account not found",
          },
          duplicate: {
            title: "Account with this email already exists",
          },
          server: {
            title: "Server error updating account",
          },
        },
      },
      delete: {
        error: {
          not_found: {
            title: "Account not found",
          },
          server: {
            title: "Server error deleting account",
          },
        },
        success: {
          title: "Account deleted successfully",
        },
      },
    },
    folders: {
      get: {
        error: {
          not_found: {
            title: "Folder not found",
          },
          server: {
            title: "Server error retrieving folder",
          },
        },
      },
      sync: {
        error: {
          missing_account: {
            title: "Account not found for folder sync",
          },
        },
      },
    },
    messages: {
      get: {
        error: {
          not_found: {
            title: "Message not found",
          },
          server: {
            title: "Server error retrieving message",
          },
        },
      },
    },
    connection: {
      failed: "Connection failed",
      timeout: {
        title: "Connection timeout",
      },
      test: {
        failed: "Connection test failed",
      },
      close: {
        failed: "Failed to close connection",
      },
      folders: {
        list: {
          failed: "Failed to list folders",
        },
      },
      messages: {
        list: {
          failed: "Failed to list messages",
        },
      },
    },
    sync: {
      failed: "Sync failed",
      account: {
        failed: "Account sync failed",
      },
      folder: {
        failed: "Folder sync failed",
      },
      message: {
        failed: "Message sync failed",
      },
      post: {
        error: {
          server: {
            title: "Server error during sync",
          },
        },
      },
    },
    validation: {
      account: {
        username: {
          required: "Username is required",
        },
        port: {
          invalid: "Invalid port number",
        },
        host: {
          invalid: "Invalid host",
        },
      },
    },
  },
  imap: {
    "example.com": "imap.example.com",
    "gmail.com": "imap.gmail.com",
    connection: {
      test: {
        success: "Connection test successful",
        failed: "Connection test failed",
        timeout: "Connection test timeout",
      },
    },
    sync: {
      messages: {
        accounts: {
          success: "All accounts synced successfully",
          successWithErrors: "Accounts synced with errors",
        },
        account: {
          success: "Account synced successfully",
          successWithErrors: "Account synced with errors",
        },
        folders: {
          success: "Folders synced successfully",
          successWithErrors: "Folders synced with errors",
        },
        messages: {
          success: "Messages synced successfully",
          successWithErrors: "Messages synced with errors",
        },
      },
      errors: {
        default: "IMAP sync failed",
        account_failed: "Account sync failed",
        folder_sync_failed: "Folder sync failed",
        message_sync_error: "Message sync error",
        message_sync_failed: "Message sync failed",
      },
    },
  },
  enums: {
    loggingLevel: {
      error: "Error",
      warn: "Warning",
      info: "Info",
      debug: "Debug",
    },
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
    imapAuthMethod: {
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
