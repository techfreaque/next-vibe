export const translations = {
  tags: {
    messaging: "Messaging",
  },
  get: {
    title: "View Messenger Account",
    description: "Get messenger account details",
  },
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
    imapAuthMethod: { plain: "Plain", oauth2: "OAuth2", xoauth2: "XOAUTH2" },
  },

  sections: {
    identity: "Account Identity",
    identitySubtitle: "Name and basic settings for this account",
    smtp: "SMTP Outbound",
    smtpSubtitle: "Server settings for sending emails",
    api: "API Credentials",
    apiSubtitle: "Provider API key and access token",
    apiSubtitleSms: "Provider API key and sender ID",
    apiSubtitleWhatsapp: "WhatsApp Business API token and phone number ID",
    apiSubtitleTelegram: "Enter your Telegram bot token from @BotFather",
    apiTitleSms: "SMS Provider Credentials",
    apiTitleWhatsapp: "WhatsApp Business Credentials",
    apiTitleTelegram: "Bot Token",
    imap: "IMAP Inbound",
    imapSubtitle: "Configure to receive and sync incoming emails (optional)",
    routing: "Email Routing",
    routingSubtitle: "Control which campaigns and journeys use this account",
    toggleHide: "Hide",
    toggleShow: "Show",
  },

  delete: {
    title: "Delete Account",
    description: "Permanently delete this messenger account",
    container: {
      title: "Delete Account",
      description:
        "Are you sure you want to permanently delete this messenger account? This action cannot be undone.",
    },
    backButton: {
      label: "Cancel",
    },
    deleteButton: {
      label: "Delete Account",
    },
    success: {
      title: "Account Deleted",
      description: "Messenger account was permanently deleted",
    },
  },
  put: {
    title: "Edit Messenger Account",
    description: "Update messenger account settings",
    success: {
      title: "Account Updated",
      description: "Messenger account updated successfully",
    },
  },
  fields: {
    id: { label: "ID", description: "Account ID" },
    name: {
      label: "Account Name",
      description: "A unique name for this account",
      placeholder: "e.g. Primary SMTP",
    },
    description: {
      label: "Description",
      description: "Optional description",
      placeholder: "Describe this account's purpose",
    },
    channel: { label: "Channel", description: "Communication channel" },
    provider: { label: "Provider", description: "Service provider" },
    status: { label: "Status", description: "Account status" },
    priority: {
      label: "Priority",
      description: "Higher number = higher priority",
    },
    isDefault: {
      label: "Default Account",
      description: "Use as default for this channel",
    },
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
      description: "SMTP username",
      placeholder: "user@example.com",
    },
    smtpPassword: {
      label: "SMTP Password",
      description: "Leave blank to keep existing",
      placeholder: "New password or leave blank",
    },
    smtpFromEmail: {
      label: "From Email",
      description: "Sender email address",
      placeholder: "noreply@example.com",
    },
    smtpFromName: {
      label: "From Name",
      description: "Sender display name shown in email clients",
      placeholder: "Unbottled",
    },
    smtpConnectionTimeout: {
      label: "Connection Timeout",
      description: "Timeout in milliseconds",
    },
    smtpMaxConnections: {
      label: "Max Connections",
      description: "Maximum concurrent connections",
    },
    smtpRateLimitPerHour: {
      label: "Rate Limit",
      description: "Maximum emails per hour",
    },
    apiKey: {
      label: "API Key",
      description: "Leave blank to keep existing",
      placeholder: "Leave blank to keep existing",
    },
    apiToken: {
      label: "API Token",
      description: "Leave blank to keep existing",
      placeholder: "Leave blank to keep existing",
    },
    apiSecret: {
      label: "API Secret",
      description: "Leave blank to keep existing",
      placeholder: "Leave blank to keep existing",
    },
    fromId: {
      label: "From ID",
      description: "Phone number or sender ID",
      placeholder: "+1234567890",
    },
    webhookUrl: {
      label: "Webhook URL",
      description: "Inbound message webhook URL",
      placeholder: "https://example.com/webhook",
    },
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
    imapSecure: { label: "IMAP TLS", description: "Use TLS/SSL for IMAP" },
    imapUsername: {
      label: "IMAP Username",
      description: "IMAP username",
      placeholder: "user@example.com",
    },
    imapPassword: {
      label: "IMAP Password",
      description: "Leave blank to keep existing",
      placeholder: "Leave blank to keep existing",
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
    weight: { label: "Weight", description: "Load balancing weight" },
    isFailover: { label: "Failover", description: "Use as failover account" },
    failoverPriority: {
      label: "Failover Priority",
      description: "Failover priority order",
    },
  },
  response: {
    account: {
      id: "ID",
      name: "Name",
      channel: "Channel",
      provider: "Provider",
      status: "Status",
      healthStatus: "Health",
      isDefault: "Default",
      priority: "Priority",
      smtpFromEmail: "From Email",
      smtpFromName: "From Name",
      fromId: "From ID",
      smtpHost: "SMTP Host",
      smtpPort: "SMTP Port",
      smtpSecurityType: "Security",
      smtpUsername: "SMTP Username",
      imapHost: "IMAP Host",
      imapPort: "IMAP Port",
      imapSyncEnabled: "IMAP Sync",
      imapLastSyncAt: "Last IMAP Sync",
      messagesSentTotal: "Messages Sent",
      lastUsedAt: "Last Used",
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
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not Found", description: "Account not found" },
    conflict: {
      title: "Name Conflict",
      description: "An account with this name already exists",
    },
    server: { title: "Server Error", description: "Failed to process request" },
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
    title: "Success",
    description: "Account loaded successfully",
  },
};
