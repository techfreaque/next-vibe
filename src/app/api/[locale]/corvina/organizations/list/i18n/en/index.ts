export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  get: {
    title: "List Corvina Organizations",
    description:
      "Fetches every customer organization registered on the Corvina tenant.",
    container: {
      title: "Corvina Organizations",
      description:
        "All customer organizations on the configured Corvina tenant.",
    },
    response: {
      title: "Organizations",
      description: "Customer organizations returned by the Corvina API.",
      organizations: {
        title: "Organizations",
        description: "Each row is one customer organization.",
        id: "ID",
        name: "Name",
        displayName: "Display Name",
        enabled: "Enabled",
        createdAt: "Created",
      },
      total: "Total",
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
          "Corvina rejected the service-account credentials. Check CORVINA_CLIENT_ID and CORVINA_CLIENT_SECRET.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The service account does not have the required scope to list organizations.",
      },
      notFound: {
        title: "Not Found",
        description:
          "Corvina returned 404 for the configured organizations path. Adjust CORVINA_ORGANIZATIONS_PATH.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict while listing organizations.",
      },
      server: {
        title: "Server Error",
        description: "The Corvina API returned an internal server error.",
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
      description: "Organizations fetched successfully.",
    },
  },
};
