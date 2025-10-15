import { translations as checkoutTranslations } from "../../checkout/i18n/en";

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
    starter: "Starter Plan",
    professional: "Professional Plan",
    premium: "Premium Plan",
    enterprise: "Enterprise Plan",
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
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },

  // Success types
  success: {
    title: "Success",
    description: "Operation completed successfully",
  },

  // Enum translations
  enums: {
    plan: {
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
