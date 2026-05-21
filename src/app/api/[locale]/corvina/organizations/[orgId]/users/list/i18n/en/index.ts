export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Users",
  },
  get: {
    title: "List Org Users",
    description: "Lists all users belonging to a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of users per page (max 100).",
    },
    response: {
      users: {
        id: "ID",
        username: "Username",
        email: "Email",
        firstName: "First Name",
        lastName: "Last Name",
        country: "Country",
        defaultHomePage: "Home Page",
        serviceAccount: "Service Account",
        groupPoliciesEnabled: "Group Policies",
        userImpersonation: "Impersonation",
        mfaEnabled: "MFA",
        owner: "Owner",
        ownerRef: "Owner Ref",
      },
      totalElements: "Total Users",
      totalPages: "Total Pages",
      last: "Last Page",
    },
    widget: {
      title: "Users",
      loading: "Loading users…",
      emptyState: "No users in this organization.",
      createButton: "Add user",
      prev: "Prev",
      next: "Next",
      badges: {
        serviceAccount: "Service",
        mfaEnabled: "MFA",
        mfaDisabled: "No MFA",
        groupPolicies: "Policies",
        impersonation: "Impersonation",
      },
    },
    enums: {
      userOwner: {
        organization: "Organization",
        app: "App",
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
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key does not have access to list users.",
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
      title: "Success",
      description: "Users fetched successfully.",
    },
  },
};
