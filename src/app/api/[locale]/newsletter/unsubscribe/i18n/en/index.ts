export const translations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
  },
  email: {
    label: "Email Address",
    description: "The email address to unsubscribe from newsletter",
    placeholder: "user@example.com",
    unsubscribe: {
      title: "Unsubscribe from Newsletter",
      preview: "You have successfully unsubscribed from our newsletter",
      greeting: "Hello",
      confirmation: "We have successfully unsubscribed {{email}} from our newsletter",
      resubscribe_info:
        "If you change your mind, you can always resubscribe by visiting our website",
      resubscribe_button: "Resubscribe",
      support_message: "If you have any questions, please contact our support team",
      subject: "Newsletter Unsubscribe Confirmation",
      admin_unsubscribe_notification: {
        title: "Newsletter Unsubscribe Notification",
        preview: "A user has unsubscribed from the newsletter",
        message: "A user has unsubscribed from the newsletter",
        email: "Email",
        date: "Date",
        view_dashboard: "View Dashboard",
        subject: "Newsletter Unsubscribe - Admin Notification",
      },
    },
  },
  response: {
    success: "Successfully unsubscribed from newsletter",
    message: "Success Message",
  },
  errors: {
    internal: {
      title: "Internal Error",
      description: "An error occurred while processing your unsubscribe request",
    },
  },
  post: {
    title: "Newsletter Unsubscribe",
    description: "Unsubscribe from newsletter updates",
    form: {
      title: "Unsubscribe from Newsletter",
      description: "Enter your email address to unsubscribe from our newsletter",
    },
    response: {
      title: "Unsubscribe Response",
      description: "Newsletter unsubscribe confirmation",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid email address provided",
      },
      internal: {
        title: "Internal Error",
        description: "An error occurred while processing your unsubscribe request",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
    },
    success: {
      title: "Successfully Unsubscribed",
      description: "You have been unsubscribed from our newsletter",
    },
  },
  sync: {
    failed: "Newsletter unsubscribe sync failed",
    error: "Newsletter unsubscribe sync error",
  },
  sms: {
    confirmation: {
      message:
        "You have successfully unsubscribed from {{appName}} newsletter. If this was a mistake, please visit our website to resubscribe.",
    },
    admin_notification: {
      message: "Newsletter Unsubscribe: {{email}} has unsubscribed from the newsletter.",
    },
    errors: {
      confirmation_failed: {
        title: "SMS Confirmation Failed",
        description: "Failed to send unsubscribe confirmation SMS",
      },
      admin_notification_failed: {
        title: "Admin SMS Notification Failed",
        description: "Failed to send admin notification SMS",
      },
    },
  },
};
