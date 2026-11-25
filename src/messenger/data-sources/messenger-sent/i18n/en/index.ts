export const translations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    messageType: {
      all: "All types",
      system: "System",
      transactional: "Transactional",
      notification: "Notification",
      marketing: "Marketing",
      leadCampaign: "Lead campaign",
      userCommunication: "User message",
    },
  },
  post: {
    title: "Messages Sent",
    titleShort: "Sent Msgs",
    description: "Outbound messages sent per resolution bucket",
    fields: {
      resolution: { label: "Resolution", description: "Computation timeframe" },
      range: { label: "Range", description: "Time range to query" },
      lookback: {
        label: "Lookback",
        description: "Extra bars before range start",
      },
      messageType: {
        label: "Message type",
        description: "Count all sent messages or only one type",
      },
      result: { label: "Messages Sent", description: "Output time series" },
      meta: { label: "Meta", description: "Node execution metadata" },
    },
    success: {
      title: "Messages Sent computed",
      description: "Messages Sent series returned",
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
