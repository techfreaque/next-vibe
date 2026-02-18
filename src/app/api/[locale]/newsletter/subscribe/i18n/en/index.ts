export const translations = {
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
};
