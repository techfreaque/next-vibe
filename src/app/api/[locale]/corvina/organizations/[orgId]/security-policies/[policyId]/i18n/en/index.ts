export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    securityPolicies: "Security Policies",
  },
  get: {
    title: "Get Security Policy",
    description: "Fetches a single security policy group by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    policyId: {
      label: "Policy ID",
      description: "Numeric security policy group ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Type",
      organizationId: "Organization ID",
      orgResourceId: "Org Resource ID",
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
      forbidden: {
        title: "Forbidden",
        description: "No access to this security policy.",
      },
      notFound: {
        title: "Not Found",
        description: "No security policy with that ID.",
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
      description: "Security policy fetched successfully.",
    },
    widget: { prefix: "Policy" },
  },
  put: {
    title: "Update Security Policy",
    description: "Updates a security policy group.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    policyId: {
      label: "Policy ID",
      description: "Numeric security policy group ID.",
    },
    name: {
      label: "Name",
      description: "New name for the security policy.",
      placeholder: "my-policy",
    },
    descriptionField: {
      label: "Description",
      description: "Optional description.",
      placeholder: "Restricts access to...",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Type",
      organizationId: "Organization ID",
      orgResourceId: "Org Resource ID",
    },
    submitButton: { label: "Save changes", loadingText: "Saving…" },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update.",
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
        description: "No write access to this policy.",
      },
      notFound: {
        title: "Not Found",
        description: "No security policy with that ID.",
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
      title: "Saved",
      description: "Security policy updated successfully.",
    },
    widget: { prefix: "Updated policy" },
  },
  delete: {
    title: "Delete Security Policy",
    description: "Deletes a security policy group.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    policyId: {
      label: "Policy ID",
      description: "Numeric security policy group ID to delete.",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Type",
      organizationId: "Organization ID",
      orgResourceId: "Org Resource ID",
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
      forbidden: {
        title: "Forbidden",
        description: "No access to delete this policy.",
      },
      notFound: {
        title: "Not Found",
        description: "No security policy with that ID.",
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
      title: "Deleted",
      description: "Security policy deleted successfully.",
    },
    widget: { prefix: "Deleted policy" },
  },
};
