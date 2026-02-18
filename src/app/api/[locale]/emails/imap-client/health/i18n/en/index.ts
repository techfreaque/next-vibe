export const translations = {
  category: "IMAP Client",
  tags: {
    health: "Health",
    monitoring: "Monitoring",
  },
  get: {
    title: "Get IMAP Health Status",
    description: "Retrieve current IMAP server health status and metrics",
    form: {
      title: "IMAP Health Status Request",
      description: "Request form for IMAP server health monitoring",
    },
    response: {
      title: "IMAP Health Status Response",
      description: "Current IMAP server health status and performance metrics",
      data: {
        title: "Health Data",
        description: "Health status data and metrics",
        accountsHealthy: "Healthy Accounts",
        accountsTotal: "Total Accounts",
        connectionsActive: "Active Connections",
        connectionErrors: "Connection Errors",
        lastSyncAt: "Last Sync At",
      },
      message: "Health status retrieved successfully",
    },
  },
  health: {
    get: {
      title: "Get IMAP Health Status",
      description: "Retrieve current IMAP server health status and metrics",
      form: {
        title: "IMAP Health Status Request",
        description: "Request form for IMAP server health monitoring",
      },
      response: {
        title: "IMAP Health Status Response",
        description:
          "Current IMAP server health status and performance metrics",
        success: "Success",
        message: "Health status retrieved successfully",
        data: {
          title: "Health Data",
          description: "Health status data and metrics",
          status: "Health Status",
          accountsHealthy: "Healthy Accounts",
          accountsTotal: "Total Accounts",
          connectionsActive: "Active Connections",
          connectionErrors: "Connection Errors",
          lastSyncAt: "Last Sync At",
          syncStats: {
            title: "Sync Statistics",
            description: "Synchronization statistics and metrics",
            totalSyncs: "Total Syncs",
            lastSyncTime: "Last Sync Time",
          },
          serverStatus: "Server Status",
          uptime: "Uptime",
          syncedAccounts: "Synced Accounts",
          totalAccounts: "Total Accounts",
          activeConnections: "Active Connections",
          performanceMetrics: {
            title: "Performance Metrics",
            description: "Performance metrics and statistics",
            avgResponseTime: "Average Response Time",
          },
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to access IMAP health status",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters provided",
        },
        server: {
          title: "Server Error",
          description:
            "Internal server error occurred while retrieving health status",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while retrieving health status",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to IMAP health status is forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "IMAP health status not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes that need to be saved first",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred while retrieving health status",
        },
      },
      success: {
        title: "Success",
        description: "IMAP health status retrieved successfully",
      },
    },
  },
  widget: {
    title: "IMAP Health",
    accountsHealthy: "Healthy Accounts",
    accountsTotal: "Total Accounts",
    connectionsActive: "Active Connections",
    connectionErrors: "Connection Errors",
    performance: "Performance",
    avgResponseTime: "Avg. Response Time",
    uptime: "Uptime",
    serverStatus: "Server Status",
    syncStats: "Sync Statistics",
    totalSyncs: "Total Syncs",
    lastSyncTime: "Last Sync Time",
  },
};
