export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  post: {
    title: "Create Corvina Organization",
    description: "Creates a new customer organization in Corvina.",
    container: {
      title: "New Organization",
      description: "Add a customer organization to the Corvina tenant.",
    },
    name: {
      label: "Name",
      description:
        "Stable identifier used in URLs and APIs. Lowercase, no spaces.",
      placeholder: "acme",
    },
    displayName: {
      label: "Display Name",
      description: "Human-friendly name shown in the Corvina UI.",
      placeholder: "Acme Corp",
    },
    enabled: {
      label: "Enabled",
      description: "Whether the organization is active on creation.",
    },
    response: {
      title: "Created Organization",
      description: "The new organization Corvina returned.",
      organization: {
        title: "Details",
        description: "Top-level fields of the created organization.",
        id: "ID",
        name: "Name",
        displayName: "Display Name",
        enabled: "Enabled",
        createdAt: "Created",
      },
    },
    submitButton: {
      label: "Create organization",
      loadingText: "Creating…",
    },
    backButton: {
      label: "Back",
    },
    errors: {
      validation: {
        title: "Invalid Input",
        description: "Corvina rejected the create payload.",
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
          "The service account does not have the scope to create organizations.",
      },
      notFound: {
        title: "Not Found",
        description: "The configured organizations path returned 404.",
      },
      conflict: {
        title: "Conflict",
        description: "An organization with that name already exists.",
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
      title: "Created",
      description: "Organization created successfully.",
    },
  },
};
