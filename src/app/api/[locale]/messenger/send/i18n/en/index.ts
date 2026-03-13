/**
 * English translations for unified Messenger Send endpoint
 */

export const translations = {
  title: "Send Message",
  description:
    "Send a message via any channel (Email, SMS, WhatsApp, Telegram)",
  category: "Messaging",
  tag: "Send",

  container: {
    title: "Send Message",
    description: "Send through a configured messenger account",
  },

  accountId: {
    label: "Messenger Account",
    description: "Account to send through",
    placeholder: "Select account UUID",
  },
  to: {
    label: "Recipient",
    description: "Email address, phone number, or chat ID",
    placeholder: "user@example.com or +12025551234",
  },
  toName: {
    label: "Recipient Name",
    description: "Display name of the recipient (optional)",
    placeholder: "John Doe",
  },
  subject: {
    label: "Subject",
    description: "Subject line (email only, optional for other channels)",
    placeholder: "Your subject here...",
  },
  text: {
    label: "Message",
    description:
      "Plain text body — used for SMS/WhatsApp/Telegram; email fallback",
    placeholder: "Enter your message...",
  },
  html: {
    label: "HTML Content",
    description:
      "HTML body (email only, optional — falls back to text if omitted)",
    placeholder: "<p>Enter HTML email content...</p>",
  },
  senderName: {
    label: "Sender Name",
    description: "Display name of the sender (email only, optional)",
    placeholder: "Your Company",
  },
  replyTo: {
    label: "Reply-To",
    description: "Reply-to address (email only, optional)",
    placeholder: "support@example.com",
  },
  leadId: {
    label: "Lead ID",
    description: "Associated lead for tracking (optional)",
    placeholder: "UUID",
  },
  campaignId: {
    label: "Campaign ID",
    description: "Associated campaign for tracking (optional)",
    placeholder: "UUID",
  },

  response: {
    title: "Send Result",
    description: "Result of the send operation",
    messageId: { label: "Message ID" },
    accountName: { label: "Account" },
    channel: { label: "Channel" },
    provider: { label: "Provider" },
    sentAt: { label: "Sent At" },
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to send messages",
    },
    server: {
      title: "Server Error",
      description: "An internal server error occurred while sending",
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
      description: "A network error occurred while sending",
    },
    notFound: {
      title: "Account Not Found",
      description: "The specified messenger account was not found",
    },
    conflict: {
      title: "Conflict",
      description: "Request conflicts with existing data",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
  },

  success: {
    title: "Message Sent",
    description: "Your message has been sent successfully",
  },
};
