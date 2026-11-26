export const translations = {
  category: "Payments",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Ensure Stripe prices",
    titleShort: "Stripe prices",
    description:
      "Create every plan and credit pack price in the connected Stripe account (per currency and language), found by lookup key. Idempotent, no price ids in .env. Dry run lists what exists and what is missing.",
    fields: {
      dryRun: {
        label: "Dry run",
        description: "List prices without creating anything",
      },
    },
    response: {
      dryRun: "Dry run",
      stripeMode: "Stripe mode",
      existing: "Already there",
      created: "Created now",
      missing: "Missing",
      prices: "Prices",
      lookupKey: "Lookup key",
      priceId: "Price ID",
      productId: "Product ID",
      amount: "Amount",
      status: "Status",
    },
    widget: {
      hint: "Run once per Stripe account after prices change. Checkout also creates a missing price on first use.",
      submit: "Ensure prices",
      summary:
        "Stripe {{mode}}: {{existing}} existing, {{created}} created, {{missing}} missing",
    },
  },
  errors: {
    validation: {
      title: "Invalid input",
      description: "Check the request",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can manage Stripe prices",
    },
    notFound: {
      title: "Not found",
      description: "Resource not found",
    },
    conflict: {
      title: "Conflict",
      description: "Stripe changed in the meantime, run again",
    },
    server: {
      title: "Server error",
      description: "Stripe prices could not be ensured",
    },
    network: {
      title: "Network error",
      description: "Request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
    notConfigured: "Stripe is not configured (STRIPE_SECRET_KEY missing)",
  },
  success: {
    title: "Done",
    description: "Stripe prices checked",
  },
};
