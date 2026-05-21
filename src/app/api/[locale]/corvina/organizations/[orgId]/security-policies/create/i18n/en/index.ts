export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    securityPolicies: "Security Policies",
  },
  post: {
    title: "Create Security Policy",
    description:
      "Creates a new security policy group in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    name: {
      label: "Name",
      description: "Unique name for the security policy.",
      placeholder: "my-policy",
    },
    descriptionField: {
      label: "Description",
      description: "Optional description.",
      placeholder: "Restricts access to...",
    },
    deviceHwIds: {
      label: "Device HW IDs",
      description: "Comma-separated hardware IDs of devices to include.",
      placeholder: "AABBCCDD, 11223344",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Type",
      organizationId: "Organization ID",
      orgResourceId: "Org Resource ID",
    },
    submitButton: { label: "Create policy", loadingText: "Creating…" },
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
        description: "No permission to create security policies.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "A policy with that name already exists.",
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
      description: "Security policy created successfully.",
    },
  },
};
