export const translations = {
  category: "Newsletter",
  status: {
    title: "Newsletter Status",
    description: "Check newsletter subscription status for an email address",
    category: "Newsletter",
    tags: {
      status: "Status",
    },
    form: {
      title: "Check Newsletter Status",
      description:
        "Enter an email address to check its newsletter subscription status",
    },
    email: {
      label: "Email Address",
      description: "The email address to check subscription status for",
      placeholder: "user@example.com",
      helpText: "Enter the email address you want to check",
    },
    response: {
      subscribed: "Subscription Status",
      status: "Current Status",
    },
    errors: {
      validation: {
        title: "Invalid Email",
        description: "Please provide a valid email address",
      },
      internal: {
        title: "Internal Error",
        description: "An error occurred while checking the subscription status",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to check this subscription status",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription information found for this email address",
      },
    },
    success: {
      title: "Status Retrieved",
      description: "Successfully retrieved newsletter subscription status",
    },
  },
  subscribe: {
    category: "Newsletter",
    tags: {
      newsletter: "Newsletter",
      subscription: "Subscription",
    },
    email: {
      label: "Email Address",
      description: "Your email address for newsletter subscription",
      placeholder: "user@example.com",
      helpText: "We'll use this to send you newsletter updates",
    },
    name: {
      label: "Name",
      description: "Your name (optional)",
      placeholder: "John Doe",
      helpText: "Help us personalize your newsletter experience",
    },
    preferences: {
      label: "Newsletter Preferences",
      description: "Select the types of newsletters you'd like to receive",
      placeholder: "Select your preferences",
      helpText: "You can change these preferences anytime",
    },
    leadId: {
      label: "Lead ID",
      description: "Optional lead identifier",
      placeholder: "123e4567-e89b-12d3-a456-426614174000",
      helpText: "Internal use only",
    },
    response: {
      success: "Successfully subscribed to newsletter",
      message: "Success Message",
      leadId: "Lead Identifier",
      subscriptionId: "Subscription ID",
      userId: "User ID",
      alreadySubscribed:
        "This email address is already subscribed to our newsletter",
    },
    errors: {
      email_generation_failed: "Failed to generate email",
      badRequest: {
        title: "Bad Request",
        description: "Invalid request parameters provided",
      },
      internal: {
        title: "Internal Error",
        description: "An error occurred while processing your subscription",
      },
    },
    post: {
      title: "Newsletter Subscription",
      description: "Subscribe to newsletter updates and notifications",
      form: {
        title: "Newsletter Subscription",
        description: "Configure your newsletter subscription preferences",
      },
      response: {
        title: "Subscription Response",
        description: "Newsletter subscription confirmation data",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        internal: {
          title: "Internal Error",
          description: "An error occurred while processing your subscription",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        conflict: {
          title: "Already Subscribed",
          description:
            "This email address is already subscribed to our newsletter",
        },
        badRequest: {
          title: "Bad Request",
          description: "Invalid request parameters provided",
        },
      },
      success: {
        title: "Successfully Subscribed",
        description: "You have been successfully subscribed to our newsletter",
      },
    },
    repository: {
      starting: "Starting newsletter subscription",
      linking_to_lead: "Linking newsletter subscription to lead",
      lead_found: "Lead found for newsletter subscription",
      lead_updated: "Lead updated with newsletter subscription data",
      lead_update_failed: "Failed to update lead with newsletter data",
      lead_not_found: "Lead not found or not eligible for update",
      lead_linking_error: "Error during lead linking from newsletter",
      missing_lead_id: "Newsletter subscription attempted without leadId",
      already_subscribed: "User already subscribed to newsletter",
      reactivating: "Reactivating newsletter subscription",
      creating_new: "Creating new newsletter subscription",
      created_successfully: "Successfully created newsletter subscription",
      subscription_failed: "Newsletter subscription failed",
    },
    sms: {
      no_phone_number: "No phone number available for newsletter welcome SMS",
      sending_welcome: "Sending welcome SMS to newsletter subscriber",
      welcome_error: "Error sending newsletter welcome SMS",
      no_admin_phone:
        "No admin phone number configured, skipping SMS notification",
      sending_admin_notification:
        "Sending admin notification SMS for newsletter subscription",
      admin_notification_error: "Error sending admin notification SMS",
      welcome: {
        message:
          "Hi {{name}}! Welcome to our newsletter. Stay tuned for updates!",
      },
      admin_notification: {
        message:
          "New newsletter subscription: {{displayName}} ({{email}}) has subscribed",
      },
    },
    route: {
      sms_failed_continuing: "SMS notifications failed but continuing",
    },
    emailTemplates: {
      welcome: {
        name: "Newsletter Welcome Email",
        description: "Welcome email sent to new newsletter subscribers",
        category: "newsletter",
        preview: {
          email: {
            label: "Email Address",
            description: "Subscriber's email address",
          },
          name: {
            label: "Subscriber Name",
            description: "Subscriber's name (optional)",
          },
          leadId: {
            label: "Lead ID",
            description: "Lead tracking identifier for analytics",
          },
          userId: {
            label: "User ID",
            description: "User account identifier (optional)",
          },
        },
      },
    },
    emailTemplate: {
      welcome: {
        title: "Welcome to the {{appName}} Newsletter!",
        subject: "Welcome to {{appName}} - Stay Updated on Uncensored AI",
        preview:
          "You're subscribed! Get the latest updates on uncensored AI, new models, and exclusive tips.",
        greeting_with_name: "Hi {{name}}!",
        greeting: "Hello!",
        message:
          "Welcome to the {{appName}} newsletter! You're now part of our community of AI enthusiasts who value honest, uncensored conversations with AI.",
        what_to_expect: "Here's what you'll receive:",
        benefit_1: "New AI model announcements and updates",
        benefit_2: "Tips and tricks for getting the most out of uncensored AI",
        benefit_3: "Exclusive offers and early access to new features",
        benefit_4: "Community highlights and success stories",
        frequency:
          "We'll send you updates every few weeks - never spam, always valuable content.",
        unsubscribe_text: "Don't want to receive these emails?",
        unsubscribe_link: "Unsubscribe",
      },
      admin_notification: {
        title: "New Newsletter Subscription",
        subject: "New Newsletter Subscription",
        preview: "A new user has subscribed to the newsletter",
        message: "A new user has subscribed to the newsletter.",
        subscriber_details: "Subscriber Details",
        email: "Email",
        name: "Name",
        preferences: "Preferences",
        view_in_admin: "View in Admin Panel",
      },
    },
  },
  unsubscribe: {
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
        confirmation:
          "We have successfully unsubscribed {{email}} from our newsletter",
        resubscribe_info:
          "If you change your mind, you can always resubscribe by visiting our website",
        resubscribe_button: "Resubscribe",
        support_message:
          "If you have any questions, please contact our support team",
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
      email_generation_failed: "Failed to generate email",
      internal: {
        title: "Internal Error",
        description:
          "An error occurred while processing your unsubscribe request",
      },
    },
    post: {
      title: "Newsletter Unsubscribe",
      description: "Unsubscribe from newsletter updates",
      form: {
        title: "Unsubscribe from Newsletter",
        description:
          "Enter your email address to unsubscribe from our newsletter",
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
          description:
            "An error occurred while processing your unsubscribe request",
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
      tag: "Newsletter Sync",
      post: {
        title: "Newsletter Unsubscribe Sync",
        titleShort: "Unsub Sync",
        description: "Sync lead statuses for newsletter unsubscribes",
        container: {
          title: "Unsubscribe Sync Configuration",
          description: "Configure unsubscribe sync parameters",
        },
        fields: {
          batchSize: {
            label: "Batch Size",
            description: "Number of records to process per batch",
          },
          dryRun: {
            label: "Dry Run",
            description: "Run without making changes",
          },
        },
        response: {
          leadsProcessed: "Leads Processed",
          leadsUpdated: "Leads Updated",
          executionTimeMs: "Execution Time (ms)",
        },
        errors: {
          unauthorized: {
            title: "Unauthorized",
            description: "Authentication required",
          },
          forbidden: {
            title: "Forbidden",
            description: "Access forbidden",
          },
          server: {
            title: "Server Error",
            description: "An error occurred while syncing unsubscribes",
          },
          unknown: {
            title: "Unknown Error",
            description: "An unknown error occurred",
          },
          validation: {
            title: "Validation Error",
            description: "Invalid request parameters",
          },
        },
        success: {
          title: "Sync Complete",
          description: "Newsletter unsubscribe sync completed successfully",
        },
      },
    },
    emailTemplates: {
      unsubscribe: {
        name: "Newsletter Unsubscribe Email",
        description:
          "Confirmation email sent to users who unsubscribe from newsletter",
        category: "newsletter",
        preview: {
          email: {
            label: "Email Address",
            description: "The email address being unsubscribed",
          },
        },
      },
    },
    sms: {
      confirmation: {
        message:
          "You have successfully unsubscribed from {{appName}} newsletter. If this was a mistake, please visit our website to resubscribe.",
      },
      admin_notification: {
        message:
          "Newsletter Unsubscribe: {{email}} has unsubscribed from the newsletter.",
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
  },
  email: {
    welcome: {
      title: "Welcome to our Newsletter",
      preview: "Welcome to our newsletter! Thanks for subscribing",
      greeting: "Hello",
      greeting_with_name: "Hello {{name}}",
      message: "Welcome to {{appName}} Newsletter! Thank you for subscribing.",
      what_to_expect: "Here's what you can expect from our newsletter:",
      benefit_1: "Latest product updates and features",
      benefit_2: "Industry insights and trends",
      benefit_3: "Exclusive content and tips",
      benefit_4: "Special offers and promotions",
      frequency: "We'll send you newsletters weekly with the latest updates.",
      unsubscribe_text: "You can unsubscribe at any time by clicking",
      unsubscribe_link: "here",
      subject: "Welcome to our Newsletter!",
    },
    admin_notification: {
      title: "New Newsletter Subscription",
      preview: "A new user has subscribed to the newsletter",
      message: "A new user has subscribed to your newsletter.",
      subscriber_details: "Subscriber Details",
      email: "Email",
      name: "Name",
      preferences: "Preferences",
      view_in_admin: "View in Admin Panel",
      subject: "New Newsletter Subscription - Admin Notification",
    },
    unsubscribe: {
      title: "Unsubscribe from Newsletter",
      preview: "You have successfully unsubscribed from our newsletter",
      greeting: "Hello",
      confirmation:
        "We have successfully unsubscribed {{email}} from our newsletter",
      resubscribe_info:
        "If you change your mind, you can always resubscribe by visiting our website",
      resubscribe_button: "Resubscribe",
      support_message:
        "If you have any questions, please contact our support team",
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
  enum: {
    preferences: {
      marketing: "Marketing",
      productNews: "Product News",
      companyUpdates: "Company Updates",
      industryInsights: "Industry Insights",
      events: "Events",
    },
    status: {
      subscribed: "Subscribed",
      unsubscribed: "Unsubscribed",
      pending: "Pending",
      bounced: "Bounced",
      complained: "Complained",
    },
  },
  hooks: {
    errors: {
      missing_lead_id: "Newsletter subscription: Missing leadId",
    },
  },
  errors: {
    email_generation_failed: "Failed to generate email",
  },
  error: {
    general: {
      internal_server_error: "Internal server error",
    },
    default: "An error occurred",
  },
  subscription: {
    error: {
      description: "Failed to subscribe to newsletter",
    },
    unsubscribe: {
      error: "Failed to unsubscribe from newsletter",
      confirmQuestion: "Are you sure you want to unsubscribe?",
    },
  },
};
