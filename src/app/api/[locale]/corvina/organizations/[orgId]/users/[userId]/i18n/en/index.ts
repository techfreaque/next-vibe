export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Users",
  },
  get: {
    title: "Get User",
    description: "Fetches a single Corvina organization user by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    userId: {
      label: "User ID",
      description: "Numeric Corvina user ID.",
    },
    response: {
      id: "ID",
      username: "Username",
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      country: "Country",
      serviceAccount: "Service Account",
      mfaEnabled: "MFA Enabled",
      owner: "Owner",
      groupPoliciesEnabled: "Group Policies",
      userImpersonation: "Impersonation",
    },
    widget: {
      edit: "Edit",
      delete: "Delete",
      sections: {
        identity: "Identity",
        flags: "Flags",
      },
      labels: {
        username: "Username",
        email: "Email",
        name: "Name",
        country: "Country",
        owner: "Owner",
      },
      badges: {
        serviceAccount: "Service Account",
        mfaEnabled: "MFA",
        mfaDisabled: "No MFA",
        groupPolicies: "Group Policies",
        impersonation: "Impersonation",
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
        description: "The API key does not have access to this user.",
      },
      notFound: {
        title: "Not Found",
        description: "No user with that ID exists.",
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
      description: "User fetched successfully.",
    },
  },
  put: {
    title: "Update User",
    description: "Updates an existing Corvina organization user.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    userId: {
      label: "User ID",
      description: "Numeric Corvina user ID to update.",
    },
    email: {
      label: "Email",
      description: "User email address.",
      placeholder: "jdoe@example.com",
    },
    firstName: {
      label: "First Name",
      description: "User's given name.",
      placeholder: "John",
    },
    lastName: {
      label: "Last Name",
      description: "User's family name.",
      placeholder: "Doe",
    },
    country: {
      label: "Country",
      description: "User's country code.",
      placeholder: "US",
    },
    defaultHomePage: {
      label: "Default Home Page",
      description: "URL of user's default home page.",
      placeholder: "/dashboard",
    },
    groupPoliciesEnabled: {
      label: "Group Policies Enabled",
      description: "Enable group-based policy enforcement for this user.",
    },
    userImpersonation: {
      label: "User Impersonation",
      description: "Allow this user to impersonate other users.",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving…",
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
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key does not have write access to this user.",
      },
      notFound: {
        title: "Not Found",
        description: "No user with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict for this update.",
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
      description: "User updated successfully.",
    },
  },
  delete: {
    title: "Delete User",
    description: "Permanently deletes a Corvina organization user.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    userId: {
      label: "User ID",
      description: "Numeric Corvina user ID to delete.",
    },
    widget: {
      warning: "This action is permanent and cannot be undone.",
      confirmButton: "Delete User",
      cancelButton: "Cancel",
      deletedTitle: "User Deleted",
      deletedDescription: "The user has been permanently removed.",
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
          "The API key does not have permission to delete this user.",
      },
      notFound: {
        title: "Not Found",
        description: "No user with that ID exists.",
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
      description: "User deleted successfully.",
    },
  },
};
