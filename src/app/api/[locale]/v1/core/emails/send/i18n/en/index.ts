/**
 * English translations for Email Send endpoint
 */

export const translations = {
  title: "Send Email",
  description: "Send emails with optional SMS notifications",
  category: "Email Communication",
  tag: "Send",

  container: {
    title: "Email Sending Configuration",
    description: "Configure email and optional SMS notification settings",
  },

  // Field groups
  recipient: {
    title: "Recipient Information",
    description: "Configure the email recipient details",
  },
  emailContent: {
    title: "Email Content",
    description: "Configure the email subject and body content",
  },
  senderSettings: {
    title: "Sender Settings",
    description: "Configure sender name and reply-to address",
  },
  groups: {
    campaignTracking: {
      title: "Campaign Tracking",
      description: "Track this email as part of a campaign",
    },
    smsNotifications: {
      title: "SMS Notifications",
      description: "Send SMS notifications in addition to email",
    },
  },

  // Email fields
  to: {
    label: "Recipient Email",
    description: "Email address of the recipient",
    placeholder: "recipient@example.com",
  },
  toName: {
    label: "Recipient Name",
    description: "Display name of the recipient (optional)",
    placeholder: "John Doe",
  },
  subject: {
    label: "Email Subject",
    description: "Subject line for the email",
    placeholder: "Your subject here...",
  },
  html: {
    label: "HTML Content",
    description: "HTML content of the email",
    placeholder: "Enter HTML email content...",
  },
  text: {
    label: "Plain Text Content",
    description: "Plain text fallback content (optional)",
    placeholder: "Enter plain text version...",
  },
  senderName: {
    label: "Sender Name",
    description: "Name displayed as the sender",
    placeholder: "Your Company",
  },
  replyTo: {
    label: "Reply-To Email",
    description: "Email address for replies (optional)",
    placeholder: "noreply@example.com",
  },
  campaignType: {
    label: "Campaign Type",
    description: "Type of email campaign",
    placeholder: "Select campaign type...",
    options: {
      leadCampaign: "Lead Campaign",
      newsletter: "Newsletter",
      transactional: "Transactional",
      notification: "Notification",
      system: "System",
    },
  },
  leadId: {
    label: "Lead ID",
    description: "Associated lead identifier (optional)",
    placeholder: "lead-12345",
  },

  // SMS notification fields
  sendSmsNotification: {
    label: "Send SMS Notification",
    description: "Send an SMS notification in addition to the email",
  },
  smsPhoneNumber: {
    label: "SMS Phone Number",
    description: "Phone number to send SMS notification to",
    placeholder: "+1234567890",
  },
  smsMessage: {
    label: "SMS Message",
    description: "Message content for SMS notification",
    placeholder: "Email sent successfully!",
  },

  // Response fields
  response: {
    title: "Email Send Result",
    description: "Result of the email sending operation",
    deliveryStatus: {
      title: "Delivery Status",
    },
    accountInfo: {
      title: "Account Information",
    },
    deliveryResults: {
      title: "Delivery Results",
    },
    success: {
      label: "Success",
    },
    messageId: {
      label: "Message ID",
    },
    accountId: {
      label: "Account ID",
    },
    accountName: {
      label: "SMTP Account",
    },
    accepted: {
      label: "Accepted Recipients",
    },
    rejected: {
      label: "Rejected Recipients",
    },
    response: {
      label: "SMTP Response",
    },
    sentAt: {
      label: "Sent At",
    },
    smsResult: {
      title: "SMS Notification Result",
      description: "Result of SMS notification sending",
      success: "SMS Success",
      messageId: {
        label: "SMS Message ID",
      },
      provider: "SMS Provider",
      sentAt: {
        label: "SMS Sent At",
      },
      error: {
        label: "SMS Error",
      },
    },
  },

  // SMS template
  sms: {
    emailNotificationTemplate: "Email notification",
  },

  // Error messages
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      smsFields: "SMS notification fields",
      smsRequired:
        "SMS phone number and message are required when SMS notification is enabled",
    },
    sms: {
      temporarilyUnavailable: "SMS service is temporarily unavailable",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to send emails",
    },
    server: {
      title: "Server Error",
      description: "An internal server error occurred while sending the email",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to this resource is forbidden",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while sending the email",
    },
    notFound: {
      title: "Not Found",
      description: "Email resource not found",
    },
    conflict: {
      title: "Conflict",
      description: "Email request conflicts with existing data",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    email: {
      title: "Email Sending Error",
      description: "Failed to send email through SMTP service",
    },
  },
  success: {
    title: "Email Sent Successfully",
    description: "Your email has been sent successfully",
  },
};
