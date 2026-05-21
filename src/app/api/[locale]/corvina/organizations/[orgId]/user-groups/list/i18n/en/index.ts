export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    userGroups: "User Groups",
  },
  get: {
    title: "List User Groups",
    description: "Fetches all user groups for a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    response: {
      groups: {
        title: "User Groups",
        description: "User groups belonging to this organization.",
        id: "ID",
        name: "Name",
        organizationId: "Organization ID",
        type: "Type",
        owner: "Owner",
        membershipRole: "Membership Role",
      },
      totalElements: "Total",
      totalPages: "Pages",
      last: "Last Page",
    },
    widget: {
      title: "User Groups",
      noGroupsFound: "No user groups found",
    },
    enums: {
      groupType: {
        standard: "Standard",
        selfUserAny: "Self User (Any)",
        selfUser: "Self User",
        allUser: "All Users",
        selfUserService: "Self User Service",
        all: "All",
      },
      groupOwner: {
        organization: "Organization",
        app: "App",
      },
      membershipRole: {
        user: "User",
        admin: "Admin",
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
        description: "Corvina rejected the API key. Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key does not have access to list user groups.",
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
      description: "User groups fetched successfully.",
    },
  },
};
