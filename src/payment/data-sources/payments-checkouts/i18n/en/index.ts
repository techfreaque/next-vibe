export const translations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Started",
      paid: "Paid",
      abandoned: "Abandoned or declined",
    },
  },
  post: {
    title: "Checkouts",
    titleShort: "Checkouts",
    description:
      "Pack and new-subscription checkouts opened per bucket, by outcome. Abandoned means the session expired after 24 h or the charge was declined. Renewals and admin accounts excluded.",
    fields: {
      resolution: {
        label: "Resolution",
        description: "Computation timeframe",
      },
      range: {
        label: "Range",
        description: "Time range to query",
      },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      result: {
        label: "Checkouts",
        description: "Output time series",
      },
      meta: {
        label: "Meta",
        description: "Node execution metadata",
      },
      outcome: {
        label: "Outcome",
        description: "Started (all), paid, or abandoned/declined",
      },
    },
    success: {
      title: "Checkouts computed",
      description: "Checkout series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Query failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: {
        title: "Not found",
        description: "Not found",
      },
      conflict: {
        title: "Conflict",
        description: "Conflict",
      },
      network: {
        title: "Network error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes first",
      },
    },
  },
};
