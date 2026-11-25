export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: { who: { signedIn: "Signed-in users", guests: "Guests" } },
  post: {
    titleShort: "AI Users",
    title: "People Using AI (signed in, guests)",
    description:
      "Distinct people with at least one credit debit per bucket, incognito chats included: signed-in accounts (admins excluded) or guest devices (bots excluded). A count of people, not credits.",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      who: { label: "Who", description: "Signed-in accounts or guest devices" },
      result: {
        label: "People",
        description: "Output time series",
      },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Series computed",
      description: "Time series returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: { title: "Server error", description: "Query failed" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: { title: "Not found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
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
