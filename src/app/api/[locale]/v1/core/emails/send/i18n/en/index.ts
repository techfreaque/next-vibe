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
      messageId: "SMS Message ID",
      provider: "SMS Provider",
      sentAt: "SMS Sent At",
      error: "SMS Error",
    },
  },

  // Error messages
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
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
