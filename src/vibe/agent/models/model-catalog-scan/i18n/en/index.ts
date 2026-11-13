export const translations = {
  category: "Agent",
  tags: {
    models: "Models",
  },

  get: {
    title: "Model Catalog Scan",
    titleShort: "Catalog Scan",
    description:
      "Latest scan of every provider's model list: new upstream models we do not serve yet, price drift, removed ids and announced shutdowns. Read-only.",
    success: {
      title: "Scan loaded",
      description: "Latest model catalog scan loaded.",
    },
  },

  post: {
    title: "Run Model Catalog Scan",
    titleShort: "Run Scan",
    description:
      "Fetch every provider's model list and live prices now, diff them against our definitions, store the report and mail it to the ops inboxes. Never edits code.",
    fields: {
      force: {
        label: "Run even if recent",
        description:
          "Skip the 5-day guard. Without it, a scan younger than 5 days is returned as is.",
      },
      sendEmail: {
        label: "Email the report",
        description: "Mail the report to hi@ and thea@unbottled.ai.",
      },
    },
    success: {
      title: "Scan finished",
      description: "Model catalog scan stored.",
    },
  },

  response: {
    scan: "Scan",
    report: "Report",
    history: "Previous scans",
    skipped: "Skipped (recent scan)",
    reportText: "Report",
  },

  widget: {
    back: "Back",
    runNow: "Run scan now",
    running: "Scanning...",
    empty: {
      title: "No scan yet",
      message:
        "The first scan runs on its daily schedule. Run one now to see what changed upstream.",
    },
    skipped:
      'A scan from the last 5 days already exists, so nothing new was fetched. Tick "Run even if recent" to force one.',
    scannedAt: "Scanned",
    newSince: "New since",
    emailedTo: "Emailed to",
    notEmailed: "Not emailed",
    emailError: "Email failed",
    metrics: {
      newModels: "New models",
      uncensored: "Look uncensored",
      priceChanges: "Price changes",
      missing: "Gone upstream",
      deprecations: "Shutdowns announced",
      sourceErrors: "Failed sources",
    },
    sections: {
      newModels: "New upstream models",
      priceChanges: "Price and context drift",
      missing: "Gone upstream",
      deprecations: "Announced shutdowns",
      sources: "Sources",
      history: "Previous scans",
    },
    legacy: "legacy",
    suspect: "suspect, check fetcher",
    uncensored: "uncensored",
    ok: "ok",
    failed: "failed",
    models: "models",
    perMillion: "per 1M",
    context: "ctx",
    nothing: "Nothing here.",
  },

  task: {
    name: "Model Catalog Scan",
    description:
      "Every 5 days: diff provider model lists and prices against our catalog, store and mail the report.",
  },

  errors: {
    scanFailed: "Model catalog scan failed: {{error}}",
    loadFailed: "Could not load the model catalog scan: {{error}}",
    server: {
      title: "Server error",
      description: "The scan could not be completed. Check the server logs.",
    },
    network: {
      title: "Network error",
      description: "Could not reach the server.",
    },
    unknown: {
      title: "Unknown error",
      description: "Something unexpected went wrong.",
    },
    validation: {
      title: "Invalid input",
      description: "Check the scan options.",
    },
    unauthorized: {
      title: "Not signed in",
      description: "Sign in as an admin to view catalog scans.",
    },
    forbidden: {
      title: "Admins only",
      description: "Only admins can view or run catalog scans.",
    },
    notFound: {
      title: "Not found",
      description: "No catalog scan found.",
    },
    conflict: {
      title: "Conflict",
      description: "Another scan is running. Try again shortly.",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "Save or discard your changes first.",
    },
  },
};
