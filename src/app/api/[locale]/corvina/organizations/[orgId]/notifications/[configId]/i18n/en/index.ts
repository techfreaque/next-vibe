export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Notifications",
  },
  post: {
    title: "Update Notification Config",
    description: "Updates an existing notification configuration.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    configId: {
      label: "Config ID",
      description: "Numeric notification configuration ID.",
    },
    event: {
      label: "Event",
      description: "The notification event type.",
    },
    beforeDays: {
      label: "Before Days",
      description: "Trigger notification this many days before the event.",
    },
    afterDays: {
      label: "After Days",
      description: "Trigger notification this many days after the event.",
    },
    emailBcc: {
      label: "Email BCC",
      description: "Additional BCC email address for notifications.",
      placeholder: "bcc@example.com",
    },
    response: {
      id: "ID",
      organizationId: "Organization ID",
      event: "Event",
      beforeDays: "Before Days",
      afterDays: "After Days",
      emailBcc: "Email BCC",
      lastCheck: "Last Check",
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
        description:
          "The API key does not have access to update notification configs.",
      },
      notFound: {
        title: "Not Found",
        description: "No notification config with that ID exists.",
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
      title: "Updated",
      description: "Notification config updated successfully.",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving...",
    },
    widget: {
      labels: {
        bcc: "bcc",
        before: "before",
        after: "after",
        deleted: "DELETED",
        updated: "Updated",
        deleted2: "Deleted",
      },
    },
  },
  delete: {
    title: "Delete Notification Config",
    description: "Deletes a notification configuration.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    configId: {
      label: "Config ID",
      description: "Numeric notification configuration ID.",
    },
    response: {
      id: "ID",
      organizationId: "Organization ID",
      event: "Event",
      beforeDays: "Before Days",
      afterDays: "After Days",
      emailBcc: "Email BCC",
      lastCheck: "Last Check",
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
        description:
          "The API key does not have access to delete notification configs.",
      },
      notFound: {
        title: "Not Found",
        description: "No notification config with that ID exists.",
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
      title: "Deleted",
      description: "Notification config deleted successfully.",
    },
  },
};
