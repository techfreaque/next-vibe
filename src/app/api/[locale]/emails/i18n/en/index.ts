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
      any: "Any",
    },
    smtpHealthStatusFilter: {
      any: "Any",
    },
    smtpCampaignTypeFilter: {
      any: "Any",
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
      any: "Any",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    selectionRuleStatusFilter: {
      any: "Any",
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
      any: "Any",
    },
    emailTypeFilter: {
      any: "Any",
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
    tagline: "AI without the guardrails",
  },
  footer: {
    visitWebsite: "Visit Website",
    allRightsReserved: "All rights reserved",
  },

  // Email Templates
  templates: {
    leads: {
      batch: {
        update: {
          meta: {
            name: "Lead Batch Update Email",
            description: "Email sent when leads are updated in batch",
          },
          preview: {
            totalMatched: "Total Matched",
            totalMatched_description: "Number of leads matched",
            totalProcessed: "Total Processed",
            totalProcessed_description: "Number of leads processed",
            totalUpdated: "Total Updated",
            totalUpdated_description: "Number of leads successfully updated",
            errorsCount: "Errors Count",
            errorsCount_description: "Number of errors during processing",
            dryRun: "Dry Run",
            dryRun_description: "Preview only without making changes",
            userId: "User ID",
            userId_description: "ID of the user performing the action",
          },
        },
      },
      welcome: {
        meta: {
          name: "Lead Welcome Email",
          description: "Welcome email sent to new leads",
        },
        preview: {
          leadId: "Lead ID",
          leadId_description: "Unique identifier for the lead",
          businessName: "Business Name",
          businessName_description: "Name of the business (optional)",
          email: "Email",
          email_description: "Email address of the lead",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
        },
      },
    },
    contact: {
      form: {
        meta: {
          name: "Contact Form Submission",
          description: "Email sent when contact form is submitted",
        },
        preview: {
          name: "Name",
          name_description: "Name of the contact",
          email: "Email",
          email_description: "Email address of the contact",
          company: "Company",
          company_description: "Company name (optional)",
          subject: "Subject",
          subject_description: "Message subject",
          message: "Message",
          message_description: "Message content",
          isForCompany: "For Company Account",
          isForCompany_description:
            "Whether this email is sent to company team",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
        },
      },
    },
    newsletter: {
      unsubscribe: {
        meta: {
          name: "Newsletter Unsubscribe Confirmation",
          description: "Confirmation email when unsubscribing from newsletter",
        },
        preview: {
          email: "Email",
          email_description: "Email address being unsubscribed",
        },
      },
      welcome: {
        meta: {
          name: "Newsletter Welcome Email",
          description: "Welcome email for new newsletter subscribers",
        },
        preview: {
          email: "Email",
          email_description: "Email address of the subscriber",
          name: "Name",
          name_description: "Name of the subscriber (optional)",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
          userId: "User ID",
          userId_description: "ID of the associated user (optional)",
        },
      },
    },
    password: {
      reset: {
        confirm: {
          meta: {
            name: "Password Reset Confirmation",
            description: "Confirmation email after password reset",
          },
          preview: {
            publicName: "Public Name",
            publicName_description: "Public name of the user",
            userId: "User ID",
            userId_description: "Unique identifier for the user",
          },
        },
        request: {
          meta: {
            name: "Password Reset Request",
            description: "Email with password reset link",
          },
          preview: {
            publicName: "Public Name",
            publicName_description: "Public name of the user",
            userId: "User ID",
            userId_description: "Unique identifier for the user",
            passwordResetUrl: "Password Reset URL",
            passwordResetUrl_description: "URL for resetting the password",
          },
        },
      },
    },
    signup: {
      welcome: {
        meta: {
          name: "User Signup Welcome",
          description: "Welcome email for new user signups",
        },
        preview: {
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead",
        },
      },
    },
    users: {
      welcome: {
        meta: {
          name: "User Welcome Email",
          description: "Welcome email sent to new users",
        },
        preview: {
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          email: "Email",
          email_description: "Email address of the user",
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          publicName: "Public Name",
          publicName_description: "Public name of the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead (optional)",
        },
      },
    },
    subscription: {
      success: {
        meta: {
          name: "Subscription Success",
          description: "Confirmation email for successful subscription",
        },
        preview: {
          privateName: "Private Name",
          privateName_description: "Private name of the user",
          userId: "User ID",
          userId_description: "Unique identifier for the user",
          leadId: "Lead ID",
          leadId_description: "ID of the associated lead",
          planName: "Plan Name",
          planName_description: "Name of the subscription plan",
        },
      },
    },
    admin: {
      signup: {
        meta: {
          name: "Admin: New User Signup",
          description: "Admin notification when a new user registers",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          userId: "User ID",
          subscribeToNewsletter: "Newsletter Subscription",
        },
      },
      subscription: {
        meta: {
          name: "Admin: New Subscription",
          description: "Admin notification when a user subscribes",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          planName: "Plan Name",
          statusName: "Status",
        },
      },
      user_create: {
        meta: {
          name: "Admin: New User Created",
          description: "Admin notification when a user account is created",
        },
        preview: {
          privateName: "Private Name",
          publicName: "Public Name",
          email: "Email",
          userId: "User ID",
          leadId: "Lead ID",
        },
      },
      contact: {
        meta: {
          name: "Admin: Contact Form Submission",
          description: "Admin notification when a contact form is submitted",
        },
        preview: {
          name: "Sender Name",
          email: "Sender Email",
          subject: "Subject",
          message: "Message",
          company: "Company",
          userId: "User ID",
          leadId: "Lead ID",
        },
      },
    },
  },

  // Email Preview System
  preview: {
    render: {
      post: {
        title: "Render Email Preview",
        description: "Server-side rendering of email templates for preview",
        container: {
          title: "Email Preview Configuration",
        },
        success: {
          title: "Preview Rendered",
          description: "Email preview rendered successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to render",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          html: {
            title: "Rendered HTML",
          },
          subject: {
            title: "Email Subject",
          },
          templateVersion: {
            title: "Template Version",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid preview request data",
          },
          network: {
            title: "Network Error",
            description: "Network error while rendering preview",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You are not authorized to render previews",
          },
          forbidden: {
            title: "Forbidden",
            description: "Preview rendering is forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Email template not found",
          },
          server: {
            title: "Server Error",
            description: "Failed to render email preview",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while rendering",
          },
        },
      },
      title: "Email Preview",
      preview: "Preview",
      version: "Version",
    },
    sendTest: {
      post: {
        title: "Send Test Email",
        description: "Send test email with custom template data",
        container: {
          title: "Test Email Configuration",
        },
        success: {
          title: "Test Email Sent",
          description: "Test email sent successfully",
        },
        fields: {
          templateId: {
            label: "Template ID",
            description: "ID of the email template to send",
          },
          recipientEmail: {
            label: "Recipient Email",
            description: "Email address to send test to",
          },
          language: {
            label: "Language",
            description: "Language for email rendering",
          },
          country: {
            label: "Country",
            description: "Country for email rendering",
          },
          props: {
            label: "Template Props",
            description: "Properties to pass to the email template",
          },
          success: {
            title: "Success",
          },
          message: {
            title: "Result Message",
          },
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid test email request data",
          },
          network: {
            title: "Network Error",
            description: "Network error while sending test email",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You are not authorized to send test emails",
          },
          forbidden: {
            title: "Forbidden",
            description: "Sending test emails is forbidden",
          },
          notFound: {
            title: "Not Found",
            description: "Email template not found",
          },
          server: {
            title: "Server Error",
            description: "Failed to send test email",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          unsavedChanges: {
            title: "Unsaved Changes",
            description: "You have unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "A conflict occurred while sending",
          },
        },
      },
      error: {
        templateNotFound: "Email template not found",
        invalidProps: "Invalid template props",
        sendFailed: "Failed to send test email",
      },
      success: "Test email sent successfully to {email}",
      title: "Send Test Email",
      failed: "Failed to send test email",
    },
  },
};
