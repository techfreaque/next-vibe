/**
 * English translations for Email Service endpoint
 */

export const translations = {
  category: "Email Management",
  tag: "Email Service",

  send: {
    title: "Send Email",
    description: "Send emails through the email service with advanced options",

    container: {
      title: "Email Configuration",
      description: "Configure email settings and content",
    },

    recipientInfo: {
      title: "Recipient Information",
      description: "Configure who will receive the email",
    },

    emailContent: {
      title: "Email Content",
      description: "Configure the email subject and content",
    },

    senderSettings: {
      title: "Sender Settings",
      description: "Configure email sender information",
    },

    campaignSettings: {
      title: "Campaign Settings",
      description: "Configure campaign-specific settings",
    },

    advancedOptions: {
      title: "Advanced Options",
      description: "Advanced configuration options",
    },

    // Form fields
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
      placeholder: "Enter email subject...",
    },
    html: {
      label: "HTML Content",
      description: "HTML content of the email",
      placeholder: "Enter HTML content...",
    },
    text: {
      label: "Plain Text Content",
      description: "Plain text version of the email (optional)",
      placeholder: "Enter plain text content...",
    },
    replyTo: {
      label: "Reply-To Email",
      description: "Email address for replies (optional)",
      placeholder: "noreply@example.com",
    },
    unsubscribeUrl: {
      label: "Unsubscribe URL",
      description: "URL for recipients to unsubscribe (optional)",
      placeholder: "https://example.com/unsubscribe",
    },
    senderName: {
      label: "Sender Name",
      description: "Name displayed as the sender",
      placeholder: "Your Company",
    },
    campaignType: {
      label: "Campaign Type",
      description: "Type of email campaign (optional)",
      placeholder: "newsletter, transactional, etc.",
    },
    emailJourneyVariant: {
      label: "Email Journey Variant",
      description: "Variant of the email journey (optional)",
      placeholder: "variant-a, variant-b, etc.",
    },
    emailCampaignStage: {
      label: "Email Campaign Stage",
      description: "Stage of the email campaign (optional)",
      placeholder: "welcome, follow-up, etc.",
    },
    skipRateLimitCheck: {
      label: "Skip Rate Limit Check",
      description: "Skip rate limiting for this email (admin only)",
    },
    leadId: {
      label: "Lead ID",
      description: "Associated lead identifier (optional)",
      placeholder: "lead-12345",
    },
    campaignId: {
      label: "Campaign ID",
      description: "Associated campaign identifier (optional)",
      placeholder: "campaign-12345",
    },

    // Response fields
    response: {
      accountInfo: {
        title: "Account Information",
      },
      deliveryStatus: {
        title: "Delivery Status",
        description: "Status of email delivery to recipients",
      },
      result: {
        title: "Email Result",
        description: "Result of the email sending operation",
        success: "Success",
        messageId: {
          title: "Message ID",
          label: "Message ID",
        },
        accountId: {
          title: "Account ID",
          label: "Account ID",
        },
        accountName: {
          title: "Account Name",
          label: "Account Name",
        },
        response: {
          title: "Server Response",
          label: "Response",
        },
        sentAt: "Sent At",
      },
      accepted: {
        title: "Accepted Recipients",
        description: "List of accepted email recipients",
        email: "Email Address",
      },
      rejected: {
        title: "Rejected Recipients",
        description: "List of rejected email recipients",
        email: "Email Address",
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
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "The requested resource was not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing the request",
      },
      noData: {
        title: "No Data",
        description: "SMTP service returned success but no data was provided",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred while sending the email",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred while sending the email",
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

    // Success messages
    success: {
      title: "Email Sent Successfully",
      description: "Your email has been sent successfully",
    },
  },
};
