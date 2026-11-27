export const translations = {
  category: "Payments",
  tags: {
    payment: "payment",
    admin: "admin",
  },
  post: {
    title: "Sync Whop catalog",
    titleShort: "Whop catalog",
    description:
      "Create every plan and credit pack in the connected Whop account: one product per plan, one variant per interval, currency and price, found by our key in the metadata. Idempotent. Dry run lists what exists and what is missing.",
    fields: {
      dryRun: {
        label: "Dry run",
        description: "List variants without creating anything",
      },
    },
    response: {
      dryRun: "Dry run",
      environment: "Whop environment",
      accountId: "Whop account",
      existing: "Already there",
      created: "Created now",
      missing: "Missing",
      variants: "Variants",
      key: "Key",
      variantId: "Variant ID",
      productId: "Whop product",
      amount: "Amount",
      status: "Status",
      purchaseUrl: "Purchase link",
    },
    widget: {
      hint: "Run once per Whop account after prices change. Checkout also creates a missing variant on first use.",
      submit: "Sync catalog",
      summary:
        "Whop {{environment}} ({{accountId}}): {{existing}} existing, {{created}} created, {{missing}} missing",
    },
  },
  errors: {
    validation: { title: "Invalid input", description: "Check the request" },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can sync the Whop catalog",
    },
    notFound: { title: "Not found", description: "Resource not found" },
    conflict: {
      title: "Conflict",
      description: "Whop changed in the meantime. Run it again.",
    },
    server: {
      title: "Server error",
      description: "The Whop catalog could not be synced",
    },
    network: {
      title: "Network error",
      description: "The request did not reach the server",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected failed",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first",
    },
    notConfigured:
      "Whop is not configured (API key of the active WHOP_ENVIRONMENT missing)",
    syncFailed: "Whop catalog sync failed: {{error}}",
  },
  success: {
    title: "Done",
    description: "Whop catalog checked",
  },
};
