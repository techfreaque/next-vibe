export const translations = {
  tags: {
    messaging: "Messaging",
  },
  title: "Create Messenger Account",
  description: "Create a new messenger account",

  enums: {
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
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
    status: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
    securityType: {
      none: "None",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAUTH2",
    },
  },

  sections: {
    identity: "Account Settings",
    smtp: "SMTP Credentials",
    api: "API Credentials",
    imap: "IMAP Inbound",
    routing: "Email Routing",
  },

  fields: {
    name: {
      label: "Account Name",
      description: "A unique name for this account",
      placeholder: "e.g. Primary SMTP, Twilio SMS",
    },
    description: {
      label: "Description",
      description: "Optional description",
      placeholder: "Describe this account's purpose",
    },
    channel: {
      label: "Channel",
      description: "Communication channel",
    },
    provider: {
      label: "Provider",
      description: "Service provider for this channel",
    },
    status: {
      label: "Status",
      description: "Account status",
    },
    priority: {
      label: "Priority",
      description: "Higher number = higher priority",
    },
    isDefault: {
      label: "Default Account",
      description: "Use as default for this channel",
    },
    // SMTP outbound
    smtpHost: {
      label: "SMTP Host",
      description: "SMTP server hostname",
      placeholder: "smtp.example.com",
    },
    smtpPort: {
      label: "SMTP Port",
      description: "SMTP server port",
      placeholder: "587",
    },
    smtpSecurityType: {
      label: "Security",
      description: "Connection security type",
    },
    smtpUsername: {
      label: "SMTP Username",
      description: "SMTP authentication username",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP Password",
      description: "SMTP authentication password",
      placeholder: "••••••••",
    },
    smtpFromEmail: {
      label: "From Email",
      description: "Sender email address",
      placeholder: "noreply@example.com",
    },
    smtpConnectionTimeout: {
      label: "Connection Timeout",
      description: "Connection timeout in milliseconds",
    },
    smtpMaxConnections: {
      label: "Max Connections",
      description: "Maximum concurrent connections",
    },
    smtpRateLimitPerHour: {
      label: "Rate Limit",
      description: "Maximum emails per hour",
    },
    // API credentials
    apiKey: {
      label: "API Key",
      description: "API key for this provider",
      placeholder: "re_xxxxxxxxxxxx",
    },
    apiToken: {
      label: "API Token",
      description: "Primary API token / account SID",
      placeholder: "ACxxxxxxxxxxxx",
    },
    apiSecret: {
      label: "API Secret",
      description: "Secondary credential / auth token",
      placeholder: "••••••••",
    },
    fromId: {
      label: "From ID",
      description: "Phone number, sender ID, or bot token",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "Inbound message webhook URL",
      placeholder: "https://example.com/webhook",
    },
    // IMAP inbound
    imapHost: {
      label: "IMAP Host",
      description: "IMAP server hostname",
      placeholder: "imap.example.com",
    },
    imapPort: {
      label: "IMAP Port",
      description: "IMAP server port",
      placeholder: "993",
    },
    imapSecure: {
      label: "IMAP TLS",
      description: "Use TLS/SSL for IMAP",
    },
    imapUsername: {
      label: "IMAP Username",
      description: "IMAP authentication username",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "IMAP Password",
      description: "IMAP authentication password",
      placeholder: "••••••••",
    },
    imapAuthMethod: {
      label: "IMAP Auth Method",
      description: "IMAP authentication method",
    },
    imapSyncEnabled: {
      label: "Enable Sync",
      description: "Enable automatic IMAP sync",
    },
    imapSyncInterval: {
      label: "Sync Interval",
      description: "Sync interval in seconds",
    },
    imapMaxMessages: {
      label: "Max Messages",
      description: "Max messages to sync per folder",
    },
    // Email routing
    campaignTypes: {
      label: "Campaign Types",
      description: "Campaign types this account handles",
      placeholder: "Select campaign types",
    },
    emailJourneyVariants: {
      label: "Journey Variants",
      description: "Email journey variants",
      placeholder: "Select journey variants",
    },
    emailCampaignStages: {
      label: "Campaign Stages",
      description: "Campaign stages",
      placeholder: "Select stages",
    },
    countries: {
      label: "Countries",
      description: "Target countries",
      placeholder: "Select countries",
    },
    languages: {
      label: "Languages",
      description: "Target languages",
      placeholder: "Select languages",
    },
    isExactMatch: {
      label: "Exact Match",
      description: "Require exact country/language match",
    },
    weight: {
      label: "Weight",
      description: "Load balancing weight",
    },
    isFailover: {
      label: "Failover",
      description: "Use as failover account",
    },
    failoverPriority: {
      label: "Failover Priority",
      description: "Failover priority order",
    },
  },

  response: {
    account: {
      title: "Account Created",
      description: "New messenger account details",
      id: "ID",
      name: "Name",
      channel: "Channel",
      provider: "Provider",
      status: "Status",
      smtpFromEmail: "From Email",
      fromId: "From ID",
      createdAt: "Created",
      updatedAt: "Updated",
    },
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid account data",
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
      title: "Name Conflict",
      description: "An account with this name already exists",
    },
    server: {
      title: "Server Error",
      description: "Failed to create account",
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
    title: "Account Created",
    description: "Messenger account created successfully",
  },
};
