export const translations = {
  title: "Halt All Campaigns",
  description: "Stop all active email campaigns",
  post: {
    title: "Halt All Campaigns",
    description:
      "Immediately halt all active email campaigns and cancel pending sends",
    fields: {
      confirm: {
        label: "Confirm halt",
        description: "Check to confirm you want to halt all campaigns",
      },
      reason: {
        label: "Reason",
        description: "Reason for halting (optional)",
      },
    },
    response: {
      halted: "Campaigns halted",
      emailsCancelled: "Emails cancelled",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Must be admin" },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to halt campaigns",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Confirm must be checked",
      },
      notFound: { title: "Not Found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
      network: { title: "Network Error", description: "Network error" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: {
      title: "Campaigns Halted",
      description: "All campaigns have been halted successfully",
    },
  },
  widget: {
    title: "Emergency Halt",
    description:
      "Immediately stop all active email campaigns. Use this in case of errors or urgent issues.",
    haltButton: "Halt All Campaigns",
    halting: "Halting...",
    confirmTitle: "Halt All Campaigns?",
    confirmDescription:
      "This will immediately stop all active email campaigns and cancel pending emails. This action cannot be undone.",
    confirmButton: "Yes, Halt Everything",
    cancelButton: "Cancel",
    done: "Halted",
  },
};
