export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  get: {
    title: "Get VPN Sync Job",
    description: "Fetches the status of an asynchronous VPN sync job.",
    jobId: {
      label: "Job ID",
      description: "The ID of the async VPN sync job.",
    },
    response: {
      id: "Job ID",
      orgResourceId: "Org Resource ID",
      rootOrgResourceId: "Root Org Resource ID",
      status: "Status",
      error: "Error",
    },
    widget: {
      title: "VPN Sync Job",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
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
        description: "No permission to view this VPN sync job.",
      },
      notFound: {
        title: "Not Found",
        description: "No VPN sync job with that ID exists.",
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
      title: "Job Retrieved",
      description: "VPN sync job status fetched successfully.",
    },
  },
};
