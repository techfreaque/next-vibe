export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarms" },
  post: {
    title: "Alarm Action",
    description: "Acknowledge, reset, or clear a single Corvina alarm.",
    alarmId: {
      label: "Alarm ID",
      description: "ID of the alarm to act on.",
      placeholder: "e.g. alarm-001",
    },
    type: {
      label: "Action",
      description: "Action to perform on the alarm.",
    },
    comment: {
      label: "Comment",
      description: "Optional comment to attach to the action.",
      placeholder: "Add a note…",
    },
    response: {
      success: "Result",
      message: "Message",
    },
    widget: {
      successTitle: "Action Applied",
      successDescription: "The alarm action was executed successfully.",
      submitButton: "Execute",
      submitLoading: "Executing…",
      back: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check the alarm ID and action type.",
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
        description: "No permission to perform this action.",
      },
      notFound: {
        title: "Not Found",
        description: "Alarm not found.",
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
      description: "Alarm action executed.",
    },
  },
};
