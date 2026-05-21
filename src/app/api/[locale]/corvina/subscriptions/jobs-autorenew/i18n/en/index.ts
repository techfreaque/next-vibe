export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Trigger Subscription Auto-Renew Job",
    description:
      "Triggers the subscription auto-renew background job. Super admin only.",
    now: {
      label: "Reference Time",
      description:
        "Optional epoch timestamp (ms) to use as the current time for the job.",
      placeholder: "1704067200000",
    },
    response: {
      result: "Job Result",
    },
    widget: {
      title: "Auto-Renew Job",
      back: "Back",
      noResult: "No result returned.",
    },
    submitButton: {
      label: "Trigger Job",
      loadingText: "Triggering...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request parameters are invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "Super admin permission required.",
      },
      notFound: {
        title: "Not Found",
        description: "Job endpoint not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Job Triggered",
      description: "Auto-renew job triggered successfully.",
    },
  },
};
