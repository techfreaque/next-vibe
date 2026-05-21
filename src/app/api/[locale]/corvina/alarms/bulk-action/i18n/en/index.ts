export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarms" },
  post: {
    title: "Bulk Alarm Action",
    description:
      "Acknowledge, reset, or clear all alarms matching the given filter.",
    type: {
      label: "Action",
      description: "Bulk action to perform.",
    },
    filter: {
      label: "Filter",
      description: "OData-style filter to select which alarms to act on.",
      placeholder: "e.g. severity gt 3",
    },
    scopedOrganization: {
      label: "Organization",
      description: "Limit action to a specific organization resource ID.",
      placeholder: "e.g. exorde.connex.acme",
    },
    deviceName: {
      label: "Device Name",
      description: "Limit action to alarms from this device.",
      placeholder: "e.g. my-device",
    },
    comment: {
      label: "Comment",
      description: "Optional comment to attach to the bulk action.",
      placeholder: "Add a note…",
    },
    response: {
      success: "Result",
      message: "Message",
    },
    widget: {
      successTitle: "Bulk Action Applied",
      successDescription: "The bulk alarm action was executed successfully.",
      submitButton: "Execute Bulk Action",
      submitLoading: "Executing…",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check the action type and filter.",
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
        description: "No permission to perform bulk actions.",
      },
      notFound: {
        title: "Not Found",
        description: "Bulk action endpoint not found.",
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
      description: "Bulk alarm action executed.",
    },
  },
};
