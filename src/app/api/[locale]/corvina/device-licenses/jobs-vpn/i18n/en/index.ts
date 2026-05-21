export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  get: {
    title: "Trigger VPN Job",
    description:
      "Triggers the VPN background job for device licenses. Super admin only.",
    now: {
      label: "Reference Time",
      description: "Optional epoch timestamp (ms) as current time.",
      placeholder: "1704067200000",
    },
    response: {
      result: "Job Result",
    },
    widget: {
      title: "VPN Job",
      back: "Back",
      noResult: "No result returned.",
    },
    submitButton: {
      label: "Trigger VPN Job",
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
      title: "VPN Job Triggered",
      description: "VPN job triggered successfully.",
    },
  },
};
