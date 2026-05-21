export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  delete: {
    title: "Delete Corvina Organization",
    description: "Permanently deletes a Corvina organization by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID to delete.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Label",
      status: "Status",
      resourceId: "Resource ID",
    },
    widget: {
      title: "Delete Organization",
      warning: "This action is permanent and cannot be undone.",
      confirmButton: "Delete",
      cancelButton: "Cancel",
      deletedTitle: "Organization Deleted",
      deletedDescription: "The organization has been permanently removed.",
      backButton: "Back",
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
          "The API key does not have permission to delete this organization.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
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
      description: "Organization deleted successfully.",
    },
  },
};
