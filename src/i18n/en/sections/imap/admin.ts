export const adminTranslations = {
  overview: {
    title: "IMAP Server Overview",
    description: "Monitor IMAP server status and performance",
    dashboard: {
      title: "Server Dashboard",
    },
  },
  accounts: {
    title: "IMAP Account Management",
    description: "Manage and monitor IMAP accounts",
    management: {
      title: "Account Management",
    },
  },
  folders: {
    title: "IMAP Folder Management",
    description: "Manage and monitor IMAP folders",
    management: {
      title: "Folder Management",
    },
    stats: {
      title: "Folder Statistics",
    },
    no_folders: "No folders found for this account",
  },
  messages: {
    title: "IMAP Message Management ({{count}})",
    description: "View and manage IMAP messages",
    filters: "Message Filters",
    management: {
      title: "Message Management",
    },
    error: {
      title: "Error loading messages: {{error}}",
    },
    actions: {
      markAsRead: "Mark as Read",
      markAsUnread: "Mark as Unread",
      toggleFlag: "Toggle Flag",
      delete: "Delete",
      move: "Move",
      copy: "Copy",
    },
    selected: "{{count}} messages selected",
    no_messages: "No messages found",
    pagination: {
      showing: "Showing {{start}}-{{end}} of {{total}} messages",
    },
    statistics: "Message Statistics",
  },
  config: {
    title: "IMAP Server Configuration",
    description: "Configure IMAP server settings",
    settings: {
      title: "Configuration Settings",
    },
    resilience: {
      title: "Resilience Settings",
    },
    monitoring: {
      title: "Monitoring Settings",
    },
    development: {
      title: "Development Settings",
    },
    status: {
      title: "Configuration Status",
    },
  },
  sync: {
    title: "IMAP Sync Operations",
    description: "Monitor and manage email synchronization",
    operations: {
      title: "Sync Operations",
    },
  },
  health: {
    title: "IMAP Health Monitoring",
    description: "Monitor server health and performance metrics",
    monitoring: {
      title: "Health Monitoring",
    },
    error: {
      title: "Error loading health data",
    },
    errors: "Errors",
    serverStatus: "Server Status",
    uptime: "Uptime",
    lastUpdate: "Last updated {{time}}",
    lastHealthCheck: "Last Health Check",
    responseTime: "Response Time",
    memoryUsage: "Memory Usage",
    cpuUsage: "CPU Usage",
    diskUsage: "Disk Usage",
    activeConnections: "Active Connections",
    connections: "{{count}} connections",
    accounts: "{{healthy}}/{{total}} accounts",
    accountHealthSummary: "Account Health Summary",
    healthyAccounts: "Healthy Accounts",
    failedAccounts: "Failed Accounts",
    syncedAccounts: "Synced Accounts",
    systemResources: "System Resources",
    version: "Version",
    lastRestart: "Last Restart",
    connectedAccounts: "Connected Accounts",
    disconnectedAccounts: "Disconnected Accounts",
    statusValues: {
      healthy: "Healthy",
      warning: "Warning",
      error: "Error",
      offline: "Offline",
    },
    uptimeValues: {
      zero: "0 days, 0 hours",
    },
    lastCheckValues: {
      never: "Never",
    },
  },
  status: {
    title: "IMAP Server Status",
    description: "Real-time server and account status monitoring",
    monitoring: {
      title: "Status Monitoring",
    },
    accountStatusDetails: "Account Status Details",
  },
};
