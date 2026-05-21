export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subscriptions",
  },
  get: {
    title: "Resource Usage Journal Sum",
    description:
      "Returns the total usage sum for a specific resource type across journal entries.",
    resourceType: {
      label: "Resource Type",
      description:
        "The resource type to query (e.g. DEVICES, USERS, ORGANIZATIONS, DEVICE_DATA, DEVICE_VPN, CREDITS).",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter by organization resource ID.",
    },
    deviceLabel: {
      label: "Device Label",
      description: "Filter by device label.",
    },
    organizationFilter: {
      label: "Organization Filter",
      description: "Filter by organization.",
    },
    includeSubOrgs: {
      label: "Include Sub-orgs",
      description: "Whether to include entries from sub-organizations.",
    },
    fromDate: {
      label: "From Date",
      description: "Start timestamp in milliseconds.",
    },
    toDate: {
      label: "To Date",
      description: "End timestamp in milliseconds.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of entries per page.",
    },
    response: {
      totalUsage: "Total Usage",
    },
    widget: {
      title: "Resource Usage Journal Sum",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request is invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach Corvina.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission.",
      },
      notFound: {
        title: "Not Found",
        description: "No data found.",
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
      title: "Data Retrieved",
      description: "Resource usage journal sum fetched successfully.",
    },
  },
};
