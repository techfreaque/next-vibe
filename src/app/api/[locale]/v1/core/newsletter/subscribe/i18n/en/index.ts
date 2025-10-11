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
};
