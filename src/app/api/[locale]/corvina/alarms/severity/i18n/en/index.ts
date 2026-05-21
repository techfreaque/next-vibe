export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarms" },
  post: {
    title: "Alarm Severity Count",
    description:
      "Returns the count of active alarms grouped by severity level.",
    scopedOrganization: {
      label: "Organization",
      description: "Limit counts to a specific organization resource ID.",
      placeholder: "e.g. exorde.connex.acme",
    },
    deviceName: {
      label: "Device Name",
      description: "Filter counts by device name.",
      placeholder: "e.g. my-device",
    },
    response: {
      data: {
        count: "Count",
        severity: "Severity",
      },
    },
    widget: {
      title: "Severity Counts",
      noData: "No alarm data.",
      severity: "Severity",
      count: "Count",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina Platform API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No access to severity counts.",
      },
      notFound: {
        title: "Not Found",
        description: "Severity count endpoint not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "The Corvina Platform API returned a server error.",
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
      title: "Success",
      description: "Severity counts fetched.",
    },
  },
};
