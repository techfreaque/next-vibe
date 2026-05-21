export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    userGroups: "User Groups",
  },
  post: {
    title: "Create User Group",
    endpointDescription: "Creates a new user group in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    name: {
      label: "Name",
      description: "Unique name for the user group.",
      placeholder: "my-group",
    },
    description: {
      label: "Description",
      description: "Optional description for this group.",
      placeholder: "Team responsible for...",
    },
    groupPoliciesEnabled: {
      label: "Group Policies Enabled",
      description: "Enable group-level security policies.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organization ID",
      type: "Type",
      owner: "Owner",
      membershipRole: "Membership Role",
    },
    submitButton: {
      label: "Create group",
      loadingText: "Creating…",
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
        description: "The API key does not have permission to create groups.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "A group with that name already exists.",
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
      description: "User group created successfully.",
    },
  },
};
