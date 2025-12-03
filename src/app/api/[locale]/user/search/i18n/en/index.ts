export const translations = {
  title: "User Search",
  description: "Search for users",
  tag: "User Search",
  container: {
    title: "Search Container",
    description: "User search container",
  },
  groups: {
    searchCriteria: {
      title: "Search Criteria",
      description: "Define your search parameters",
    },
    filters: {
      title: "Advanced Filters",
      description: "Additional filtering options",
    },
    pagination: {
      title: "Pagination",
      description: "Control how results are paginated",
    },
  },
  fields: {
    search: {
      label: "Search Query",
      description: "Enter search terms",
      placeholder: "Search users...",
      help: "Search by name, email, or company",
      validation: {
        minLength: "Search query must be at least 2 characters",
      },
    },
    roles: {
      label: "User Roles",
      description: "Filter by user roles",
      placeholder: "Select roles...",
      help: "Select one or more roles to filter by",
    },
    status: {
      label: "User Status",
      description: "Filter by user status",
      placeholder: "Select status...",
      help: "Filter by active, inactive, or all users",
    },
    limit: {
      label: "Limit",
      description: "Maximum number of results",
      help: "Specify how many results to return (default: 10)",
    },
    offset: {
      label: "Offset",
      description: "Number of results to skip",
      help: "Specify pagination offset (default: 0)",
    },
  },
  status: {
    active: "Active",
    inactive: "Inactive",
    all: "All",
  },
  response: {
    title: "Search Results",
    description: "User search results",
    success: {
      badge: "Success",
    },
    message: {
      content: "Search result message",
    },
    searchInfo: {
      title: "Search Information",
      description: "Details about the search operation",
      searchTerm: "Search Term",
      appliedFilters: "Applied Filters",
      searchTime: "Search Time",
      totalResults: "Total Results",
    },
    pagination: {
      title: "Pagination Info",
      description: "Page navigation information",
      currentPage: "Current Page",
      totalPages: "Total Pages",
      itemsPerPage: "Items Per Page",
      totalItems: "Total Items",
      hasMore: "Has More",
      hasPrevious: "Has Previous",
    },
    actions: {
      title: "Available Actions",
      description: "Actions you can perform on the results",
      type: "Action Type",
      label: "Action",
      href: "Link",
    },
    users: {
      label: "Users Found",
      description: "List of matching users",
      item: {
        title: "User",
        description: "User account information",
      },
      id: "User ID",
      leadId: "Lead ID",
      isPublic: "Public",
      firstName: "First Name",
      lastName: "Last Name",
      privateName: "Private Name",
      publicName: "Public Name",
      company: "Company",
      email: "Email",
      imageUrl: "Avatar",
      isActive: "Active",
      emailVerified: "Email Verified",
      requireTwoFactor: "2FA Required",
      marketingConsent: "Marketing Consent",
      userRoles: {
        item: {
          title: "Role",
          description: "User role assignment",
        },
        id: "Role ID",
        role: "Role",
      },
      createdAt: "Created",
      updatedAt: "Updated",
    },
  },
  columns: {
    firstName: "First Name",
    lastName: "Last Name",
    privateName: "Private Name",
    publicName: "Public Name",
    email: "Email",
    company: "Company",
    userRoles: "Roles",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid search parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Search not authorized",
    },
    internal: {
      title: "Internal Error",
      description: "Internal server error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "No users found",
    },
    conflict: {
      title: "Conflict",
      description: "Search conflict occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "Changes were not saved",
    },
  },
  success: {
    title: "Search Successful",
    description: "Search completed successfully",
  },
  post: {
    title: "Search",
    description: "Search endpoint",
    form: {
      title: "Search Configuration",
      description: "Configure search parameters",
    },
    response: {
      title: "Response",
      description: "Search response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
