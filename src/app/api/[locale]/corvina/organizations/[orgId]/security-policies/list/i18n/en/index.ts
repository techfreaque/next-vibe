export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    securityPolicies: "Security Policies",
  },
  get: {
    title: "List Security Policies",
    description:
      "Fetches all security policy groups for a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    response: {
      policies: {
        title: "Security Policies",
        description: "Security policy groups belonging to this organization.",
        id: "ID",
        name: "Name",
        type: "Type",
        organizationId: "Organization ID",
        orgResourceId: "Org Resource ID",
      },
      totalElements: "Total",
      totalPages: "Pages",
      last: "Last Page",
    },
    widget: {
      title: "Security Policies",
      noPoliciesFound: "No security policies found",
    },
    enums: {
      policyType: {
        standard: "Standard",
        selfDevice: "Self Device",
        allDevices: "All Devices",
      },
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
        description: "No access to list security policies.",
      },
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
      description: "Security policies fetched successfully.",
    },
  },
};
