export const translations = {
  category: "Subscriptions",
  tags: {
    subscription: "subscription",
    admin: "admin",
  },
  post: {
    title: "Yearly plans: monthly credits",
    titleShort: "Yearly credits",
    description:
      "Give every yearly plan this month's credits. Runs daily; each month is granted once and expires when the month ends.",
    response: {
      scanned: "Yearly plans checked",
      granted: "Months granted now",
      credits: "Credits granted",
    },
    widget: {
      hint: "Runs daily on its own. Safe to run by hand: a month is never granted twice.",
      submit: "Grant this month",
      summary:
        "{{scanned}} yearly plans checked, {{granted}} months granted, {{credits}} credits",
    },
  },
  task: {
    description: "Grants yearly plans their monthly credits",
  },
  backfill: {
    title: "Yearly plans: backfill missed months",
    titleShort: "Yearly backfill",
    description:
      "Months of the current yearly period that passed without monthly credits. Dry run lists them; turn it off to grant them once, as one pack that lasts until the period ends.",
    fields: {
      dryRun: {
        label: "Dry run",
        description: "List what would be granted without granting",
      },
    },
    response: {
      dryRun: "Dry run",
      subscriptions: "Subscriptions",
      months: "Missed months",
      credits: "Credits",
      rows: "Subscriptions",
      subscriptionId: "Subscription",
      userEmail: "User",
      plan: "Plan",
      periodStart: "Period start",
      periodEnd: "Period end",
      currentMonth: "Current month",
      missedMonths: "Missed months",
      status: "Status",
    },
    widget: {
      hint: "Check the dry run first. The grant runs once per subscription and period; repeating it adds nothing.",
      submit: "Run backfill",
      preview:
        "Dry run: {{subscriptions}} subscriptions, {{months}} missed months, {{credits}} credits would be granted.",
      done: "Granted: {{subscriptions}} subscriptions, {{months}} months, {{credits}} credits.",
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
      description: "Only admins can grant plan credits",
    },
    notFound: {
      title: "Not found",
      description: "Resource not found",
    },
    conflict: {
      title: "Conflict",
      description: "Data changed in the meantime, run again",
    },
    server: {
      title: "Server error",
      description: "Yearly credits could not be granted",
      detail: "Yearly credits failed: {{error}}",
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
  },
  success: {
    title: "Done",
    description: "Yearly credits processed",
  },
};
