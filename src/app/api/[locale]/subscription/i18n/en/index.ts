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
    errors: {
      validation: {
        title: "Invalid Input",
        description: "Please check your subscription details and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to connect. Please check your internet connection",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to create a subscription",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to create a subscription",
      },
      notFound: {
        title: "Plan Not Found",
        description: "The subscription plan you selected couldn't be found",
      },
      server: {
        title: "Something Went Wrong",
        description: "We couldn't create your subscription. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have changes that haven't been saved",
      },
      conflict: {
        title: "Subscription Exists",
        description: "You already have an active subscription",
      },
    },
    success: {
      title: "Subscription Created",
      description: "Your subscription has been activated successfully",
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
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Please check your changes and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to save your changes. Please try again",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to update your subscription",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to update this subscription",
      },
      notFound: {
        title: "Subscription Not Found",
        description: "We couldn't find your subscription to update",
      },
      server: {
        title: "Update Failed",
        description: "We couldn't save your changes. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have changes that haven't been saved",
      },
      conflict: {
        title: "Update Conflict",
        description:
          "Your subscription has changed. Please refresh and try again",
      },
    },
    success: {
      title: "Subscription Updated",
      description: "Your subscription has been updated successfully",
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
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Please check your cancellation details and try again",
      },
      network: {
        title: "Connection Error",
        description: "Unable to process cancellation. Please try again",
      },
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to cancel your subscription",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to cancel this subscription",
      },
      notFound: {
        title: "Subscription Not Found",
        description: "We couldn't find your subscription to cancel",
      },
      server: {
        title: "Cancellation Failed",
        description: "We couldn't cancel your subscription. Please try again",
      },
      unknown: {
        title: "Unexpected Error",
        description: "Something unexpected happened. Please try again",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have changes that haven't been saved",
      },
      conflict: {
        title: "Cancellation Conflict",
        description:
          "Your subscription status has changed. Please refresh and try again",
      },
    },
    success: {
      title: "Subscription Canceled",
      description: "Your subscription has been canceled successfully",
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
    cancelAt: "Cancel At",
    canceledAt: "Canceled At",
    endedAt: "Ended At",
    trialStart: "Trial Start Date",
    trialEnd: "Trial End Date",
    success: "Operation successful",
    message: "Status message",
    subscriptionId: "Subscription ID",
    stripeCustomerId: "Stripe Customer ID",
    updatedFields: "Updated Fields",
    endsAt: "Ends At",
    createdAt: "Created At",
    updatedAt: "Updated At",
    provider: "Payment Provider",
    providerSubscriptionId: "Provider Subscription ID",
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
    not_found_description: "The requested subscription could not be found",
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
    use_checkout_flow_description:
      "Direct subscription creation is not allowed. Please use the checkout process.",
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
    not_implemented_on_native:
      "{{method}} is not implemented on native platform. Please use the web version for this operation.",
    no_provider_id: "No payment provider ID found",
  },

  sync: {
    failed: "Failed to synchronize subscription",
    stripe_error: "Stripe synchronization error",
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
      headline: "You're in. No filters, no lectures.",
      subject: "Your {{appName}} subscription is active",
      previewText:
        "{{privateName}}, you're live. 800 credits/month, {{modelCount}} models, zero restrictions.",
      activeBadge: "Active",
      greeting: "Hey {{privateName}},",
      intro:
        "Your {{appName}} subscription is confirmed and ready. You have 800 credits every month across all models — no daily caps, no content filters, no explanations required.",
      models: {
        title: "{{modelCount}} models, 3 categories",
        mainstream: "Mainstream",
        open: "Open Source",
        uncensored: "Uncensored",
      },
      included: {
        title: "What you get every month:",
        credits: "800 credits per month (auto-renewed)",
        models: "Access to all {{modelCount}} AI models",
        nolimits: "No daily limits - use all credits whenever you want",
        uncensored: "Uncensored models with no content filters",
        packs: "Buy extra credit packs that never expire (subscribers only)",
        cancel: "Cancel anytime, no questions asked",
      },
      cta: "Start Chatting Now",
      packs: {
        title: "Need more credits?",
        description:
          "Buy credit packs anytime - €5 for 500 credits. They never expire and stack on top of your monthly allowance. Only available to subscribers.",
        cta: "Buy Credit Pack",
      },
      manage: "Manage or cancel your subscription anytime in",
      manageLink: "your account settings",
      signoff: "Happy chatting,\nThe {{appName}} Team",
    },
    admin_notification: {
      title: "New Subscription",
      subject: "New Subscription - {{planName}}",
      preview: "New subscription: {{userName}} subscribed to {{planName}}",
      message: "A new user has subscribed to {{appName}}.",
      details: "Subscription Details",
      user_name: "User Name",
      user_email: "User Email",
      plan: "Plan",
      status: "Status",
      contact_user: "Contact User",
      footer: "This is an automated notification from {{appName}}",
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
      canceling: "Canceling",
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

  // Page metadata
  meta: {
    subscription: {
      title: "Subscription",
      description: "Manage your subscription and billing",
    },
    buyCredits: {
      title: "Buy Credits",
      description: "Purchase additional credits for your account",
    },
    history: {
      title: "Billing History",
      description: "View your billing and transaction history",
    },
    overview: {
      title: "Subscription Overview",
      description: "View your subscription status and details",
    },
  },
};
