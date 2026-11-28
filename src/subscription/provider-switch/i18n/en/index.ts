export const translations = {
  category: "Payments",
  tags: {
    subscription: "Subscription",
    billing: "Billing",
  },

  get: {
    title: "Move Your Plan",
    titleShort: "Move Plan",
    description:
      "Shows whether your card plan can move to the new payment provider, and when billing there starts.",
  },
  post: {
    title: "Start Plan Move",
    titleShort: "Move Plan",
    description:
      "Opens checkout at the new payment provider for your current plan. Your old card plan stops once it is paid. No double charge.",
  },

  form: {
    fields: {
      provider: {
        label: "Payment method",
        description:
          "Card (Whop) or crypto (NOWPayments). Defaults to the main method.",
      },
    },
  },

  response: {
    offer: "Offer",
    targetProvider: "New provider",
    providers: "Payment methods",
    nowPaymentsAcceptsCards: "Card payments via NOWPayments",
    cryptoMinUsd: "Lowest crypto amount (USD)",
    plan: "Plan",
    billingInterval: "Billing interval",
    pastDue: "Past due",
    deadline: "Plan runs until",
    billingStartAt: "New billing starts",
    firstPeriodEnd: "First new period ends",
    carryOver: "Paid time carry-over",
    checkoutUrl: "Checkout link",
    sessionId: "Checkout session",
  },

  widget: {
    badge: "Action needed",
    title: "Too free for our card processor",
    description:
      "They decided an AI that answers freely doesn't fit their rules. We're not changing a single answer. Your plan and credits are safe.",
    deadline:
      "Your plan runs until {{date}}. Move it before then to keep it going.",
    carryExtend:
      "You pay now, and your first new period runs until {{date}}. The days you already paid for carry over.",
    carryDeferred:
      "Nothing is charged today. Billing on the new provider starts on {{date}}, when your paid time ends.",
    pastDue:
      "Your last renewal did not go through. Move now to keep your plan.",
    unsupportedPlan:
      "The new card checkout cannot sell this plan on monthly billing yet. Pick yearly billing or pay with crypto.",
    cta: "Move my plan",
    ctaLoading: "Opening checkout...",
    noDoubleCharge:
      "Your old card plan stops as soon as the new one is paid. You are never charged twice.",
    checkoutReady: "Checkout is ready.",
    openCheckout: "Open checkout",
    notEligible: "No card plan to move.",
  },

  manage: {
    cancelOld: "Cancel old card plan",
    moveFirst: "Keep your plan: move it above. Cancelling here ends it.",
  },

  enums: {
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
      whop: "Whop",
    },
    carryOver: {
      extendFirstPeriod: "Charge now, paid time extends the first period",
      deferredStart: "Billing starts when the paid time ends",
    },
    status: {
      pending: "Checkout started",
      completed: "Moved",
      cancelFailed: "Moved, old plan cancel failed",
    },
    cancelMode: {
      atPeriodEnd: "At period end",
      immediate: "Immediately",
    },
    offer: {
      available: "Available",
      planNotSupported: "Plan not supported",
      notEligible: "Not eligible",
    },
    notice: {
      sending: "Sending",
      sent: "Sent",
      failed: "Failed",
    },
  },

  errors: {
    validation: {
      title: "Invalid request",
      description: "Check the request and try again.",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to move your plan.",
    },
    forbidden: {
      title: "Not allowed",
      description: "This account cannot move a plan.",
    },
    notFound: {
      title: "No card plan",
      description: "There is no card plan on this account to move.",
    },
    conflict: {
      title: "Nothing to move",
      description:
        "Moving plans is not open right now, or this plan cannot move. Your plan keeps running.",
    },
    unsupportedPlan: {
      title: "Plan not supported",
      description:
        "The new provider cannot sell this plan with this billing interval.",
    },
    server: {
      title: "Something broke",
      description: "Checkout could not be opened. Try again in a minute.",
    },
    network: {
      title: "Network error",
      description: "Could not reach the server. Check your connection.",
    },
    unknown: {
      title: "Unexpected error",
      description: "Something unexpected happened. Try again.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first.",
    },
  },

  success: {
    title: "Checkout ready",
    description: "Finish the payment to move your plan.",
  },
};
