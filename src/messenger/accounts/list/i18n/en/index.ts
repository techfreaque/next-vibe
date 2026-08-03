export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Messenger Accounts",
  titleShort: "Accounts",
  description: "List all messenger accounts across all channels",

  fields: {
    channel: {
      label: "Channel",
      description: "Filter by channel",
    },
    provider: {
      label: "Provider",
      description: "Filter by provider",
    },
    status: {
      label: "Status",
      description: "Filter by account status",
    },
    search: {
      label: "Search",
      description: "Search by name or description",
      placeholder: "Search accounts...",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
    },
    limit: {
      label: "Limit",
      description: "Number of accounts per page",
    },
    sortBy: {
      label: "Sort By",
      description: "Sort accounts by field",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort order (ascending or descending)",
    },
  },

  response: {
    account: {
      title: "Account",
      description: "Messenger account details",
      id: "ID",
      name: "Name",
      channel: "Channel",
      provider: "Provider",
      status: "Status",
      healthStatus: "Health",
      priority: "Priority",
      messagesSentTotal: "Messages Sent",
      lastUsedAt: "Last Used",
      createdAt: "Created",
      isDefault: "Default",
      smtpFromEmail: "From Email",
      fromId: "From ID",
    },
    pagination: {
      title: "Pagination",
      description: "Pagination information",
      page: "Page",
      limit: "Per Page",
      total: "Total",
      totalPages: "Total Pages",
    },
  },

  widget: {
    create: "Add Account",
    graphs: "Graphs",
    refresh: "Refresh",
    emptyState: "No messenger accounts configured",
    searchPlaceholder: "Search accounts...",
    deleteConfirm: "Delete this account?",
    deleteConfirmYes: "Delete",
    deleteConfirmNo: "Cancel",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid filter parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access denied",
    },
    notFound: {
      title: "Not Found",
      description: "Resource not found",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
    server: {
      title: "Server Error",
      description: "Failed to retrieve accounts",
      detail: "Couldn't load accounts: {{error}}",
    },
    networkError: {
      title: "Network Error",
      description: "Network communication failed",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
  },

  success: {
    title: "Accounts Retrieved",
    description: "Successfully retrieved messenger accounts",
  },

  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "All Channels",
    },
    provider: {
      smtp: "SMTP",
      resend: "Resend",
      ses: "Amazon SES",
      mailgun: "Mailgun",
      sendgrid: "SendGrid",
      mailjet: "Mailjet",
      postmark: "Postmark",
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      http: "HTTP",
      whatsappBusiness: "WhatsApp Business",
      telegramBot: "Telegram Bot",
    },
    providerFilter: {
      any: "All Providers",
    },
    status: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
    statusFilter: {
      any: "All Statuses",
    },
    healthStatus: {
      healthy: "Healthy",
      degraded: "Degraded",
      unhealthy: "Unhealthy",
      unknown: "Unknown",
    },
    healthStatusFilter: {
      any: "All",
    },
    sortField: {
      name: "Name",
      channel: "Channel",
      provider: "Provider",
      status: "Status",
      priority: "Priority",
      messagesSentTotal: "Messages Sent",
      lastUsedAt: "Last Used",
      createdAt: "Created",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
  },
};
