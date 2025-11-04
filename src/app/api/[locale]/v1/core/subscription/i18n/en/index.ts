import { translations as checkoutTranslations } from "../../../payment/checkout/i18n/en";

export const translations = {
  // Import checkout translations
  checkout: checkoutTranslations,

  // Main subscription domain
  category: "Subscription",

  // Tags
  tags: {
    subscription: "subscription",
    billing: "billing",
    get: "get",
    create: "create",
    update: "update",
    cancel: "cancel",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Starter Plan",
    },
    professional: {
      title: "Professional Plan",
    },
    premium: {
      title: "Premium Plan",
    },
    enterprise: {
      title: "Enterprise Plan",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Monthly",
    yearly: "Yearly",
  },

  // GET endpoint
  get: {
    title: "Get Subscription",
    description: "Retrieve current subscription details",
    form: {
      title: "Subscription Details",
      description: "View your current subscription information",
    },
  },

  // POST endpoint
  post: {
    title: "Create Subscription",
    description: "Create a new subscription",
    form: {
      title: "Subscription Creation",
      description: "Create a new subscription with the selected plan",
    },
  },

  // PUT endpoint
  put: {
    title: "Update Subscription",
    description: "Update existing subscription",
    form: {
      title: "Subscription Update",
      description: "Update your subscription plan or billing interval",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Cancel Subscription",
    description: "Cancel your subscription",
    form: {
      title: "Subscription Cancellation",
      description: "Cancel your subscription with optional settings",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Subscription Plan",
        description: "Select your subscription plan",
        placeholder: "Choose plan",
      },
      billingInterval: {
        label: "Billing Interval",
        description: "Select billing frequency",
        placeholder: "Choose billing interval",
      },
      cancelAtPeriodEnd: {
        label: "Cancel at Period End",
        description: "Cancel subscription at the end of current period",
      },
      reason: {
        label: "Cancellation Reason",
        description: "Please provide a reason for cancellation",
        placeholder: "Enter cancellation reason",
      },
    },
  },

  // Response fields
  response: {
    id: "Subscription ID",
    userId: "User ID",
    status: "Subscription Status",
    planId: "Plan ID",
    billingInterval: "Billing Interval",
    currentPeriodStart: "Current Period Start",
    currentPeriodEnd: "Current Period End",
    cancelAtPeriodEnd: "Cancel at Period End",
    trialStart: "Trial Start Date",
    trialEnd: "Trial End Date",
    success: "Operation successful",
    message: "Status message",
    subscriptionId: "Subscription ID",
    stripeCustomerId: "Stripe Customer ID",
    updatedFields: "Updated Fields",
    canceledAt: "Canceled At",
    endsAt: "Ends At",
    createdAt: "Created At",
    updatedAt: "Updated At",
  },

  // Error types
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid subscription parameters",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "Subscription not found",
    },
    not_found: "Subscription not found",
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    serverError: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    use_checkout_flow: "Please use the checkout flow to purchase subscriptions",
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
    sync_failed: "Failed to sync subscription with database",
    database_error: "Database error occurred",
    create_crashed: "Subscription creation failed",
    cancel_failed: "Failed to cancel subscription",
    user_not_found: "User not found",
    stripe_customer_creation_failed: "Failed to create Stripe customer",
  },

  // Cancel operation
  cancel: {
    success: "Subscription canceled successfully",
  },

  // Success types
  success: {
    title: "Success",
    description: "Operation completed successfully",
  },

  // Status translations
  status: {
    incomplete: "Incomplete",
    incomplete_expired: "Incomplete Expired",
    trialing: "Trialing",
    active: "Active",
    pastDue: "Past Due",
    canceled: "Canceled",
    unpaid: "Unpaid",
    paused: "Paused",
  },

  // Email translations
  email: {
    success: {
      title: "Subscription Successful!",
      subject: "Welcome to Your Subscription!",
      previewText: "Welcome to your new subscription",
      welcomeMessage: "Welcome to your subscription!",
      description: "Thank you for subscribing to {{appName}}",
      nextSteps: {
        title: "Next Steps",
        description: "Here's what you can do next",
        cta: "Get Started",
      },
      support: {
        title: "Need Help?",
        description: "Our support team is here to help you",
        cta: "Contact Support",
      },
      footer: {
        message: "Thank you for choosing us!",
        signoff: "Best regards, The Team",
      },
    },
    admin_notification: {
      title: "New Subscription",
      subject: "New Subscription - Admin Notification",
      preview: "A new subscription has been created",
      message: "A new subscription has been created",
      details: "Subscription Details",
      user_name: "User Name",
      user_email: "User Email",
      plan: "Plan",
      status: "Status",
      contact_user: "Contact User",
      footer: "This is an automated notification",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Subscription",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
    },
    status: {
      incomplete: "Incomplete",
      incompleteExpired: "Incomplete Expired",
      trialing: "Trialing",
      active: "Active",
      pastDue: "Past Due",
      canceled: "Canceled",
      unpaid: "Unpaid",
      paused: "Paused",
    },
    billing: {
      monthly: "Monthly",
      yearly: "Yearly",
    },
    cancellation: {
      tooExpensive: "Too Expensive",
      missingFeatures: "Missing Features",
      switchingService: "Switching Service",
      temporaryPause: "Temporary Pause",
      other: "Other",
    },
  },
};
