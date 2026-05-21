export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  get: {
    title: "Get Corvina Organization",
    description: "Fetches a single customer organization by id.",
    container: {
      title: "Organization",
      description: "Details of one customer organization.",
    },
    id: {
      label: "Organization ID",
      description: "The Corvina organization id.",
    },
    response: {
      title: "Organization",
      description: "The organization returned by Corvina.",
      organization: {
        title: "Details",
        description: "Top-level fields of the organization.",
        id: "ID",
        name: "Name",
        displayName: "Display Name",
        enabled: "Enabled",
        createdAt: "Created",
      },
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
        description:
          "Corvina rejected the service-account credentials.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The service account does not have the scope to read this organization.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that id exists.",
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
      title: "Success",
      description: "Organization fetched successfully.",
    },
  },
  patch: {
    title: "Update Corvina Organization",
    description:
      "Renames a Corvina organization. Disable/enable is intentionally not wired yet — confirm the correct API primitive first.",
    container: {
      title: "Update Organization",
      description: "Edit the organization's display name.",
    },
    id: {
      label: "Organization ID",
      description: "The Corvina organization id to update.",
    },
    displayName: {
      label: "Display Name",
      description: "Human-friendly name shown in the Corvina UI.",
      placeholder: "Acme Corp",
    },
    response: {
      title: "Updated Organization",
      description: "The organization after the update.",
      organization: {
        title: "Details",
        description: "Top-level fields after update.",
        id: "ID",
        name: "Name",
        displayName: "Display Name",
        enabled: "Enabled",
        createdAt: "Created",
      },
    },
    submitButton: {
      label: "Save changes",
      loadingText: "Saving…",
    },
    backButton: {
      label: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update payload.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the service-account credentials.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The service account does not have the scope to update this organization.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that id exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reports a conflict for this update.",
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
      title: "Saved",
      description: "Organization updated successfully.",
    },
  },
  delete: {
    title: "Delete Corvina Organization",
    description:
      "Removes an organization from Corvina. Irreversible — confirm before running.",
    container: {
      title: "Delete Organization",
      description: "Permanently delete this organization.",
    },
    id: {
      label: "Organization ID",
      description: "The Corvina organization id to delete.",
    },
    response: {
      title: "Deletion",
      description: "Result of the delete call.",
      deleted: "Deleted",
      id: "ID",
    },
    submitButton: {
      label: "Delete organization",
      loadingText: "Deleting…",
    },
    backButton: {
      label: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Corvina rejected the delete request.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the service-account credentials.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The service account does not have the scope to delete organizations.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that id exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reports a conflict for this delete.",
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
