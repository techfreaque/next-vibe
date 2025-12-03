import { translations as emailServiceTranslations } from "../../email-service/i18n/en";
import { translations as imapClientTranslations } from "../../imap-client/i18n/en";
import { translations as messagesTranslations } from "../../messages/i18n/en";
import { translations as sendTranslations } from "../../send/i18n/en";
import { translations as smtpClientTranslations } from "../../smtp-client/i18n/en";

export const translations = {
  category: "Email Management",
  enums: {
    // SMTP Client Enums
    smtpSecurityType: {
      none: "None",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    smtpAccountStatus: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
    smtpHealthStatus: {
      healthy: "Healthy",
      degraded: "Degraded",
      unhealthy: "Unhealthy",
      unknown: "Unknown",
    },
    smtpSortField: {
      name: "Name",
      status: "Status",
      createdAt: "Created At",
      updatedAt: "Updated At",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "Last Used At",
    },
    smtpCampaignType: {
      leadCampaign: "Lead Campaign",
      newsletter: "Newsletter",
      transactional: "Transactional",
      notification: "Notification",
      system: "System",
    },
    smtpLoadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Weighted",
      priority: "Priority",
      leastUsed: "Least Used",
    },
    loadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Weighted",
      priority: "Priority",
      leastUsed: "Least Used",
    },
    smtpTestResult: {
      success: "Success",
      authFailed: "Authentication Failed",
      connectionFailed: "Connection Failed",
      timeout: "Timeout",
      unknownError: "Unknown Error",
    },
    testResult: {
      success: "Success",
      authFailed: "Authentication Failed",
      connectionFailed: "Connection Failed",
      timeout: "Timeout",
      unknownError: "Unknown Error",
    },
    smtpStatusFilter: {
      all: "All",
    },
    smtpHealthStatusFilter: {
      all: "All",
    },
    smtpCampaignTypeFilter: {
      all: "All",
    },
    smtpSelectionRuleSortField: {
      name: "Name",
      priority: "Priority",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      campaignStage: "Campaign Stage",
      country: "Country",
      language: "Language",
      createdAt: "Created At",
      updatedAt: "Updated At",
      emailsSent: "Emails Sent",
      successRate: "Success Rate",
      lastUsedAt: "Last Used At",
    },
    selectionRuleSortField: {
      name: "Name",
      priority: "Priority",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      campaignStage: "Campaign Stage",
      country: "Country",
      language: "Language",
      createdAt: "Created At",
      updatedAt: "Updated At",
      emailsSent: "Emails Sent",
      successRate: "Success Rate",
      lastUsedAt: "Last Used At",
    },
    smtpSelectionRuleStatusFilter: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    // Email Messages Enums
    emailStatus: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Unsubscribed",
    },
    emailType: {
      transactional: "Transactional",
      marketing: "Marketing",
      notification: "Notification",
      system: "System",
      leadCampaign: "Lead Campaign",
      userCommunication: "User Communication",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Other",
    },
    emailSortField: {
      subject: "Subject",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      type: "Type",
      status: "Status",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    emailStatusFilter: {
      all: "All",
    },
    emailTypeFilter: {
      all: "All",
    },
    emailRetryRange: {
      noRetries: "No Retries",
      oneToTwo: "1-2 Retries",
      threeToFive: "3-5 Retries",
      sixPlus: "6+ Retries",
    },
    // IMAP Client Enums
    imapSyncStatus: {
      pending: "Pending",
      syncing: "Syncing",
      synced: "Synced",
      error: "Error",
    },
    imapOverallSyncStatus: {
      idle: "Idle",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
    },
    imapSortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    imapAuthMethod: {
      plain: "Plain",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapSpecialUseType: {
      inbox: "Inbox",
      sent: "Sent",
      drafts: "Drafts",
      trash: "Trash",
      junk: "Junk",
      archive: "Archive",
    },
    imapFolderSortField: {
      name: "Name",
      displayName: "Display Name",
      messageCount: "Message Count",
      unseenCount: "Unseen Count",
      createdAt: "Created At",
    },
    imapAccountSortField: {
      name: "Name",
      email: "Email",
      host: "Host",
      enabled: "Enabled",
      lastSyncAt: "Last Sync At",
      createdAt: "Created At",
    },
    imapConnectionStatus: {
      disconnected: "Disconnected",
      connecting: "Connecting",
      connected: "Connected",
      error: "Error",
      timeout: "Timeout",
    },
    imapSyncStatusFilter: {
      all: "All",
    },
    imapAccountStatusFilter: {
      all: "All",
      enabled: "Enabled",
      disabled: "Disabled",
    },
    imapAccountFilter: {
      all: "All",
    },
    imapMessageSortField: {
      subject: "Subject",
      senderName: "Sender Name",
      senderEmail: "Sender Email",
      recipientEmail: "Recipient Email",
      recipientName: "Recipient Name",
      isRead: "Is Read",
      isFlagged: "Is Flagged",
      messageSize: "Message Size",
      sentAt: "Sent At",
      createdAt: "Created At",
    },
    imapMessageStatusFilter: {
      all: "All",
      read: "Read",
      unread: "Unread",
      flagged: "Flagged",
      unflagged: "Unflagged",
      draft: "Draft",
      deleted: "Deleted",
      hasAttachments: "Has Attachments",
      noAttachments: "No Attachments",
    },
    imapHealthStatus: {
      healthy: "Healthy",
      warning: "Warning",
      error: "Error",
      maintenance: "Maintenance",
    },
    imapPerformanceStatus: {
      good: "Good",
      warning: "Warning",
      error: "Error",
    },
    imapLoggingLevel: {
      error: "Error",
      warn: "Warning",
      info: "Info",
      debug: "Debug",
    },
    // Email Service Enums
    emailServicePriority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
    emailServiceStatus: {
      idle: "Idle",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      retrying: "Retrying",
    },
    // SMS Service Enums
    smsProvider: {
      twilio: "Twilio",
      awsSns: "AWS SNS",
      messagebird: "MessageBird",
      plivo: "Plivo",
    },
    smsStatus: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      failed: "Failed",
      rejected: "Rejected",
      undelivered: "Undelivered",
    },
    smsTemplateType: {
      notification: "Notification",
      verification: "Verification",
      marketing: "Marketing",
      alert: "Alert",
      reminder: "Reminder",
    },
  },
  errors: {
    no_email: "No email address provided",
    email_generation_failed: "Failed to generate email",
  },
  email: {
    errors: {
      send: {
        title: "Email Send Failed",
      },
    },
  },
  smsService: {
    title: "SMS Service",
    description: "Send SMS messages through various providers",
    category: "SMS Service",
    tag: "SMS Service",
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to send SMS messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to SMS service is forbidden",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid SMS request data",
      },
      internal: {
        title: "Internal Error",
        description: "An internal server error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "SMS request conflicts with existing data",
      },
      notFound: {
        title: "Not Found",
        description: "SMS resource not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while sending SMS",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      invalid_phone: {
        title: "Invalid Phone Number",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
    send: {
      title: "Send SMS",
      description: "Send SMS message to recipient",
      container: {
        title: "SMS Configuration",
        description: "Configure SMS sending parameters",
      },
      to: {
        label: "Phone Number",
        description: "Recipient phone number",
        placeholder: "+1234567890",
      },
      message: {
        label: "Message",
        description: "SMS message content",
        placeholder: "Enter your message here...",
      },
      campaignType: {
        label: "Campaign Type",
        description: "Select the campaign type for this SMS",
        placeholder: "Select campaign type",
      },
      leadId: {
        label: "Lead ID",
        description: "Associated lead identifier",
        placeholder: "lead-12345",
      },
      templateName: {
        label: "Template Name",
        description: "SMS template to use",
        placeholder: "Select template",
      },
      response: {
        result: {
          title: "SMS Result",
          description: "Result of the SMS sending operation",
          success: "Success",
          messageId: "Message ID",
          sentAt: "Sent At",
          provider: "Provider",
          cost: "Cost",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid SMS request data",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to send SMS messages",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to SMS service is forbidden",
        },
        conflict: {
          title: "Conflict",
          description: "SMS request conflicts with existing data",
        },
        notFound: {
          title: "Not Found",
          description: "SMS resource not found",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while sending SMS",
        },
        server: {
          title: "Server Error",
          description: "An internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "SMS Sent Successfully",
        description: "Your SMS has been sent successfully",
      },
    },
  },
  sms: {
    errors: {
      invalid_phone: {
        title: "Invalid Phone Number",
      },
      send: {
        title: "SMS Send Failed",
      },
    },
  },
  emailService: emailServiceTranslations,
  imapClient: imapClientTranslations,
  messages: messagesTranslations,
  send: sendTranslations,
  smtpClient: smtpClientTranslations,

  // Core emails level translations
  tag: "Emails",
  tags: {
    stats: "Statistics",
    analytics: "Analytics",
  },
  error: {
    default: "An error occurred",
  },
  template: {
    tagline: "Your AI-powered chat platform",
  },
  footer: {
    visitWebsite: "Visit Website",
    allRightsReserved: "All rights reserved",
  },
};
