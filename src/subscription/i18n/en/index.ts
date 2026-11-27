export const translations = {
  // Import checkout translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Create Subscription Checkout",
    description: "Create a Stripe checkout session for subscription",
    category: "Subscription",

    // Tags
    tags: {
      subscription: "subscription",
      checkout: "checkout",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Checkout Configuration",
      description: "Configure checkout session parameters",
      fields: {
        planId: {
          label: "Subscription Plan",
          description: "Select the subscription plan",
          placeholder: "Choose a plan",
        },
        billingInterval: {
          label: "Billing Interval",
          description: "Select billing frequency",
          placeholder: "Choose billing interval",
        },
        provider: {
          label: "Payment Provider",
          description: "Choose how you want to pay",
          placeholder: "Select payment provider",
        },
        metadata: {
          label: "Metadata",
          description: "Additional metadata for the checkout session",
          placeholder: "Enter metadata as JSON",
        },
      },
    },

    // Response fields
    response: {
      success: "Checkout session created successfully",
      sessionId: "Stripe session ID",
      checkoutUrl: "Checkout URL",
      message: "Status message",
    },

    // Error types
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
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
        description: "Resource not found",
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
      description: "Checkout session created successfully",
    },

    // POST endpoint specific translations
    post: {
      title: "Create Checkout Session",
      description: "Create a new subscription checkout session",
      form: {
        title: "Checkout Session Configuration",
        description: "Configure the checkout session parameters",
      },
      response: {
        title: "Checkout Response",
        description: "Checkout session response data",
      },
      errors: {
        alreadySubscribed: {
          title: "Already Subscribed",
          description: "You already have an active subscription",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid checkout parameters",
          reason: {
            enterpriseCustomPricing: "ENTERPRISE plan requires custom pricing",
          },
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
          description: "Checkout session not found",
        },
        server: {
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
      success: {
        title: "Success",
        description: "Checkout session created successfully",
      },
    },

    // General error message
    error: "An error occurred during checkout",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Monthly",
      yearly: "Yearly",
    },
  },

  // Main subscription domain
  category: "Billing",

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
    titleShort: "My subscription",
    description: "Retrieve current subscription details",
    form: {
      title: "Subscription Details",
      description: "View your current subscription information",
    },
  },

  // POST endpoint
  post: {
    title: "Create Subscription",
    titleShort: "Create Session",
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
    titleShort: "Update Sub",
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
    submit: {
      label: "Update Subscription",
      loading: "Updating...",
    },
    success: {
      title: "Subscription Updated",
      description: "Your subscription has been updated successfully",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Cancel Subscription",
    titleShort: "Cancel Sub",
    description: "Cancel your subscription",
    warning:
      "Canceling your subscription will end your access at the end of the billing period.",
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
    submit: {
      label: "Cancel Subscription",
      loading: "Canceling...",
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
      provider: {
        label: "Payment Provider",
        description: "Select your payment provider",
      },
      catalogProductId: {
        label: "Catalog Product",
        description: "Link to a catalog product for this subscription",
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
    checkoutUrl: "Checkout URL",
    sessionId: "Session ID",
    hasSubscription: "Has Subscription",
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
    checkoutProviders: "Available Payment Methods",
    nowPaymentsAcceptsCards: "Crypto Checkout Takes Cards",
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
    tierChange: {
      notActive: "Your plan is not active. Start a new plan instead.",
      cryptoNotSupported:
        "Crypto plans can't switch mid-period. Pick your new plan when this one ends.",
      paymentRequired:
        "Your bank wants a confirmation for the upgrade. Open the invoice to finish it: {{url}}",
      failed: "Plan change failed: {{error}}",
      upgraded:
        "Upgraded to {{plan}}. {{credits}} extra credits added for this period.",
      changed: "Switched to {{plan}}.",
      downgraded:
        "Switching to {{plan}} at your next renewal. You keep your current credits until then.",
      unchanged: "You are already on this plan.",
    },
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
    database_error: "Database error occurred: {{error}}",
    create_crashed: "Subscription creation failed",
    cancel_failed: "Failed to cancel subscription: {{error}}",
    user_not_found: "User not found",
    stripe_customer_creation_failed: "Failed to create Stripe customer",
    not_implemented_on_native:
      "{{method}} is not implemented on native platform. Please use the web version for this operation.",
    no_provider_id: "No payment provider ID found",
  },

  sync: {
    failed: "Failed to synchronize subscription: {{error}}",
    stripe_error: "Stripe synchronization error: {{error}}",
    success: "Subscription synchronized successfully",
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
        "{{privateName}}, you're live. {{subscriptionCredits}} credits/month, {{modelCount}} models, zero restrictions.",
      activeBadge: "Active",
      greeting: "Hey {{privateName}},",
      intro:
        "Your {{appName}} subscription is confirmed and ready. You have {{subscriptionCredits}} credits every month across all models. No daily caps, no content filters, no explanations required.",
      models: {
        title: "{{modelCount}} models, 3 categories",
        mainstream: "Mainstream",
        open: "Open Source",
        uncensored: "Uncensored",
      },
      included: {
        title: "What you get every month:",
        credits: "{{subscriptionCredits}} credits per month (auto-renewed)",
        models: "Access to all {{modelCount}} AI models",
        nolimits: "No daily limits. Spend your credits whenever you want",
        uncensored: "Uncensored models with no content filters",
        packs: "Buy extra credit packs that never expire",
        cancel: "Cancel anytime, no questions asked",
      },
      cta: "Start Chatting Now",
      packs: {
        title: "Need more credits?",
        description:
          "Running low before your plan renews? Top up any time: {{packPrice}} for {{packCredits}} credits. Packs never expire and stack on top of your monthly credits.",
        cta: "Buy Credit Pack",
      },
      manage: "Manage or cancel your subscription anytime in",
      manageLink: "your account settings",
      signoff: "Happy chatting,\nThe {{appName}} Team",
    },
    admin_notification: {
      title: "New Subscription",
      subject: "New subscription: {{planName}}",
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

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "Subscription Success Email",
      description: "Confirmation email sent when user activates a subscription",
      category: "subscription",
      preview: {
        privateName: {
          label: "User Name",
          description: "The user's display name",
        },
        userId: {
          label: "User ID",
          description: "The user's unique identifier",
        },
        leadId: {
          label: "Lead ID",
          description: "The associated lead identifier",
        },
        planName: {
          label: "Plan Name",
          description: "The subscription plan name",
        },
      },
    },
    adminNotification: {
      name: "Admin Subscription Notification",
      description:
        "Internal notification sent to admins when a user subscribes",
      category: "admin",
      preview: {
        privateName: {
          label: "User Name",
        },
        publicName: {
          label: "Public Name",
        },
        email: {
          label: "User Email",
        },
        planName: {
          label: "Plan Name",
        },
        statusName: {
          label: "Subscription Status",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Back",
    confirm: {
      title: "Cancel your subscription?",
      description:
        "This ends your access at the end of the billing period. There's no undo.",
      cancel: "Keep subscription",
      proceed: "Yes, cancel it",
    },
  },

  // Widget display keys
  title: "Your Subscription",
  description: "Manage your subscription and billing",
  notAvailable: "N/A",
  canceledOn: "Canceled On",
  endedOn: "Ended On",
  billingInterval: "Billing Interval",
  currentPeriodStart: "Current Period Start",
  endsOn: "Ends On",
  nextBillingDate: "Next Billing Date",
  cancellation: {
    title: "Subscription Cancellation Scheduled",
    description:
      "Your subscription will be canceled on {{date}}. You will continue to have access until then.",
  },
  canceled: {
    title: "Subscription Ended",
    description:
      "Your subscription has ended. Renew to regain access to all features.",
  },
  noSubscription: {
    title: "No Subscription Yet",
    description:
      "Subscribe to unlock monthly credits and access to every model.",
    cta: "View Plans",
  },
  manage: {
    nowpayments: {
      info: "Please contact support to manage your NowPayments subscription.",
      button: "Manage Subscription",
    },
    stripe: {
      button: "Manage Subscription",
    },
    portal: {
      error: "Failed to open customer portal. Please try again.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
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
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} credits",
      note: "One-time top-up. Never expire.",
      aria: "Buy {{credits}} credits for {{price}}, one-time",
    },
    plan: {
      title: "{{credits}} credits / month",
      note: "{{plan}}. Cancel anytime.",
      perMonth: "/mo",
      aria: "Start {{plan}}: {{credits}} credits every month for {{price}}",
    },
    upgrade: {
      title: "Upgrade to {{plan}}",
      note: "{{credits}} credits / month",
      aria: "Upgrade to {{plan}}: {{credits}} credits every month for {{price}}",
      confirm:
        "You pay the difference for the rest of this period now. The extra credits land right away.",
      confirmButton: "Upgrade now",
      cancel: "Cancel",
      working: "Upgrading...",
    },
    opening: "Opening checkout...",
    secure: "Card, PayPal, Apple Pay, Google Pay via Stripe.",
    allPlans: "All plans and crypto",
    moreOptions: "Crypto and more options",
    error: "Checkout didn't open. Try again.",
  },
  tiers: {
    examples: {
      heading: "What {{credits}} credits a month buy",
      subheading: "Messages per month with a few popular models.",
      perMessage: "about {{credits}} credits per message",
      messages: "about {{amount}} messages",
      note: "Estimated for a typical message: {{input}} tokens in (your chat so far) and {{output}} out. Short chats cost less, long chats and files cost more.",
    },
    faq: {
      heading: "Questions before you pay",
      credit: {
        question: "What is a credit worth?",
        answer:
          "One credit is {{unitPrice}}. Light models cost less than a credit per message, top models a few. The examples above use the real model prices.",
      },
      unused: {
        question: "What happens to unused credits?",
        answer:
          "Plan credits cover your billing month and refill at renewal. Credit packs never expire.",
      },
      cancel: {
        question: "Can I cancel?",
        answer:
          "Yes, anytime, right here. You keep your plan and its credits until the period you paid for ends.",
      },
      free: {
        question: "What stays free?",
        answer:
          "Guests get {{freeCreditsGuest}} credits a month. A free account gets {{freeCreditsSignedIn}}, and {{freeCreditsMax}} with a confirmed newsletter subscription. No card needed.",
      },
      api: {
        question: "Does a plan unlock the API?",
        answer:
          "Yes. Any plan or credit pack unlocks API keys for OpenAI and Anthropic compatible clients. Free credits don’t.",
      },
      pay: {
        question: "How can I pay?",
        answer: "Card or PayPal through Stripe, or crypto through NOWPayments.",
      },
      more: "More answers in the help center",
    },
    heading: "Pick your plan",
    subheading:
      "Fresh credits every month for all {{modelCount}} models. Cancel anytime.",
    changeHeading: "Change plan",
    changeSubheading: "You're on {{plan}}: {{credits}} credits a month.",
    recommended: "Recommended",
    current: "Your plan",
    perMonth: "/ month",
    perYear: "/ year",
    creditsPerMonth: "credits / month",
    yearlyEquivalent: "{{monthlyPrice}} / month, billed yearly",
    picked: "{{plan}}: {{credits}} credits every month",
    pickedNote:
      "All {{modelCount}} models. Credits renew every month. Cancel anytime.",
    cta: {
      start: "Get {{plan}}",
      upgrade: "Upgrade to {{plan}}",
      downgrade: "Switch to {{plan}} at renewal",
      intervalYearly: "Switch to yearly billing",
      intervalMonthly: "Switch to {{plan}} monthly",
      current: "Your current plan",
    },
    signInHint: "Create a free account to start a plan.",
    cryptoHint:
      "Paying in crypto? Plus, Pro and Ultra take it monthly or yearly, Starter yearly.",
    confirm: {
      upgradeTitle: "Upgrade to {{plan}}?",
      upgradeBody:
        "You pay the difference for the rest of this period now, and the extra credits land right away. From your next renewal: {{price}} a month for {{credits}} credits.",
      upgradeButton: "Pay and upgrade",
      downgradeTitle: "Switch to {{plan}}?",
      downgradeBody:
        "Starts at your next renewal on {{date}}. Until then you keep your current plan and credits. After that: {{price}} a month for {{credits}} credits.",
      downgradeButton: "Switch at renewal",
      intervalTitle: "Change billing?",
      intervalBody:
        "Your billing period restarts today and Stripe settles the prorated difference. New plan: {{plan}}, {{price}}{{period}}, {{credits}} credits a month.",
      intervalButton: "Switch billing",
      cancel: "Not now",
      working: "Switching...",
    },
    packsLocked: {
      title: "Credit packs: {{price}} for {{credits}} credits",
      body: "Packs top up an active plan. Start a plan, then add packs whenever you run low. They never expire.",
    },
    topUp: {
      heading: "Top up",
      subheading:
        "Running low before renewal? Packs stack on your plan and never expire.",
    },
  },
  buy: {
    provider: {
      stripe: "Card, PayPal & wallets",
      stripeDescription: "Card, PayPal, Apple Pay, Google Pay via Stripe",
      nowpayments: "Crypto (NowPayments)",
      nowpaymentsDescription: "Pay with Bitcoin, Ethereum, and more",
      cryptoMonthlyDisabled:
        "Starter takes crypto with yearly billing. Plus, Pro and Ultra take crypto monthly too.",
    },
    login: "Sign In",
    signup: "Sign Up Free",
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
