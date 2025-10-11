/**
 * Template API Notifications subdomain translations for English
 */

export const translations = {
  enums: {
    notificationType: {
      created: "Created",
      updated: "Updated",
      published: "Published",
      deleted: "Deleted",
    },
    channel: {
      email: "Email",
      sms: "SMS",
    },
  },
  notifications: {
    title: "Send Template Notifications",
    description: "Send template notifications via email and SMS",
    category: "Template API",
    tags: {
      notifications: "Notifications",
      email: "Email",
      sms: "SMS",
    },
    form: {
      title: "Notification Configuration",
      description: "Configure template notification settings",
    },

    // Field labels
    templateId: {
      label: "Template ID",
      description: "The ID of the template to send notifications for",
      placeholder: "Enter template ID",
    },
    notificationType: {
      label: "Notification Type",
      description: "Select the types of notifications to send",
      placeholder: "Select notification types",
    },
    channels: {
      label: "Notification Channels",
      description: "Select the channels to send notifications through",
      placeholder: "Select channels",
    },
    recipients: {
      label: "Recipients",
      description: "Optional list of recipient IDs",
      placeholder: "Select recipients",
    },
    customMessage: {
      label: "Custom Message",
      description: "Optional custom message to include in the notification",
      placeholder: "Enter your custom message (max 500 characters)",
    },

    // Response
    response: {
      title: "Notification Results",
      description: "Results of the notification sending process",
    },

    // Debug messages
    debug: {
      sending: "Sending template notifications",
      emailSent: "Email notifications sent",
      smsSent: "SMS notifications sent",
      sent: "All notifications sent successfully",
    },

    // Errors
    errors: {
      validation: {
        title: "Invalid Parameters",
        description: "The notification parameters are invalid",
        message: "Please check your input parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to send notifications",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "Access to notification sending is forbidden",
      },
      notFound: {
        title: "Template Not Found",
        description: "The specified template could not be found",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while sending notifications",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the notification service",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing your request",
      },
    },

    // Success
    success: {
      title: "Notifications Sent",
      description: "Template notifications sent successfully",
    },
  },
};
