export const translations = {
  post: {
    title: "Sync Subscriptions from Stripe",
    titleShort: "Stripe Sync",
    description:
      "Pull status, billing period and cancellation fields from Stripe into our subscription rows. Expires legacy rows with no Stripe id and an ended period. Never grants or revokes credits. Dry run by default.",
    fields: {
      subscriptionId: {
        label: "Subscription",
        description:
          "Our subscription id (uuid) or the Stripe subscription id (sub_...). Leave empty with 'All' on.",
        placeholder: "sub_... or subscription uuid",
      },
      all: {
        label: "All",
        description:
          "Check every subscription that is not already canceled or expired.",
      },
      dryRun: {
        label: "Dry run",
        description: "Preview the changes without writing anything.",
      },
    },
    response: {
      dryRun: "Dry run",
      scanned: "Checked",
      changed: "Changed",
      failed: "Failed",
      items: "Subscriptions",
      item: {
        subscriptionId: "Subscription",
        userEmail: "User",
        providerSubscriptionId: "Stripe id",
        action: "Action",
        statusBefore: "Status before",
        statusAfter: "Status after",
        periodEndBefore: "Period end before",
        periodEndAfter: "Period end after",
        note: "Note",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Login required",
      },
      validation: {
        title: "Missing target",
        description: "Pass a subscription id, a Stripe id, or all=true.",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Sync failed",
        description: "Could not sync subscriptions from Stripe",
        detail: "Subscription sync failed: {{error}}",
      },
      unknown: {
        title: "Unknown error",
        description: "Unexpected error during the sync",
      },
      conflict: {
        title: "Conflict",
        description: "The subscription changed during the sync",
      },
      network: {
        title: "Network error",
        description: "Could not reach Stripe",
      },
      notFound: {
        title: "Not found",
        description: "No subscription matches that id",
        detail: "No subscription matches {{id}}",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Run or discard the pending sync first",
      },
      notConfigured: "Stripe is not configured on this instance.",
    },
    success: {
      title: "Sync complete",
      description: "Subscriptions checked against Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe says {{stripeStatus}}; kept canceled (never downgrade canceled).",
      missingInStripe:
        "Not found in Stripe; marked canceled and Stripe id cleared.",
      expiredLegacy:
        "No Stripe id and the period ended {{date}}; marked canceled.",
      noStripeIdActivePeriod: "No Stripe id, period still running; left as is.",
      notStripe: "Provider is not Stripe; skipped.",
      stripeError: "Stripe error: {{error}}",
    },
    widget: {
      submit: "Run sync",
      submitting: "Syncing...",
      preview: "Preview: nothing written",
      applied: "Applied",
      empty: "Nothing to sync.",
      none: "none",
    },
  },
  enums: {
    action: {
      updated: "Updated",
      unchanged: "In sync",
      expired: "Expired",
      missingInStripe: "Missing in Stripe",
      skipped: "Skipped",
      error: "Error",
    },
  },
};
