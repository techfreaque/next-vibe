export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    apiKeys: "API Keys",
  },
  get: {
    title: "List API Keys",
    description: "Fetches all API keys for a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    response: {
      keys: {
        title: "API Keys",
        description: "API keys belonging to this organization.",
        id: "ID",
        userId: "User ID",
        organizationId: "Organization ID",
        key: "Key",
      },
    },
    widget: {
      title: "API Keys",
      noKeysFound: "No API keys found",
      keyMasked: "Key (masked)",
      loading: "Loading…",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: { title: "Forbidden", description: "No access to API keys." },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
      description: "API keys fetched successfully.",
    },
  },
  post: {
    title: "Create API Key",
    description: "Creates a new API key for a Corvina organization user.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    username: {
      label: "Username",
      description: "Username to create the API key for.",
      placeholder: "john.doe",
    },
    response: {
      id: "ID",
      userId: "User ID",
      organizationId: "Organization ID",
      key: "API Key",
    },
    submitButton: { label: "Create key", loadingText: "Creating…" },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
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
        description: "No permission to create API keys.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization or user with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "An API key for this user already exists.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
      description: "API key created. Save it now — it won't be shown again.",
    },
  },
};
