export const translations = {
  get: {
    title: "User List",
    description: "Search and filter users",
    form: {
      title: "User Management",
      description: "Manage and filter users",
    },
    actions: {
      refresh: "Refresh",
      refreshing: "Refreshing...",
    },
    // Search & Filters section
    searchFilters: {
      title: "Search & Filters",
      description: "Search and filter users by criteria",
    },
    search: {
      label: "Search",
      description: "Search users by name or email",
      placeholder: "Search users...",
    },
    status: {
      label: "Status",
      description: "Filter users by status",
      placeholder: "Select status...",
    },
    role: {
      label: "Role",
      description: "Filter users by role",
      placeholder: "Select role...",
    },
    // Sorting section
    sortingOptions: {
      title: "Sorting",
      description: "Configure result sorting",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort by",
      placeholder: "Select sort field...",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort direction",
      placeholder: "Select sort order...",
    },
    // Response section
    response: {
      title: "Users",
      description: "List of users matching criteria",
      users: {
        id: "User ID",
        email: "Email",
        privateName: "Private Name",
        publicName: "Public Name",
        isActive: "Active",
        emailVerified: "Verified",
        createdAt: "Created",
        updatedAt: "Updated",
      },
      totalCount: "Total Users",
      pageCount: "Total Pages",
    },
    // Pagination section
    page: {
      label: "Page",
    },
    limit: {
      label: "Per Page",
    },
    // Error messages
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view users",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters provided",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You don't have permission to view users",
      },
      server: {
        title: "Server Error",
        description: "Unable to retrieve users",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Conflict Error",
        description: "Unable to list users due to conflicts",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      notFound: {
        title: "Not Found",
        description: "No users found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Users retrieved successfully",
    },
  },
  // Legacy keys for backward compatibility
  title: "List Users",
  description: "List and search users with filtering",
  category: "Users",
  tag: "List",
  container: {
    title: "User List",
    description: "Search and filter users",
  },
  response: {
    summary: {
      title: "User Summary",
      description: "Summary statistics for user list",
    },
    users: {
      title: "Users",
    },
    user: {
      title: "User",
      id: "User ID",
      email: "Email",
      privateName: "Private Name",
      publicName: "Public Name",
      firstName: "First Name",
      lastName: "Last Name",
      company: "Company",
      phone: "Phone",
      isActive: "Active",
      emailVerified: "Email Verified",
      role: "Role",
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
    total: {
      content: "Total Users",
    },
    page: {
      content: "Current Page",
    },
    limit: {
      content: "Users Per Page",
    },
    totalPages: {
      content: "Total Pages",
    },
  },
  errors: {
    unauthorized: {
      title: "Unauthorized Access",
      description: "You must be logged in to view users",
    },
    validation: {
      title: "Validation Failed",
      description: "Invalid parameters provided for user listing",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You don't have permission to view users",
    },
    server: {
      title: "Server Error",
      description: "Unable to retrieve users due to server error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred while listing users",
    },
    conflict: {
      title: "Conflict Error",
      description: "Unable to list users due to existing conflicts",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server",
    },
    notFound: {
      title: "Users Not Found",
      description: "No users were found matching your criteria",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred while listing users",
    },
  },
  post: {
    title: "List",
    description: "List endpoint",
    form: {
      title: "List Configuration",
      description: "Configure list parameters",
    },
    response: {
      title: "Response",
      description: "List response data",
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
  enums: {
    userSortField: {
      createdAt: "Created At",
      updatedAt: "Updated At",
      email: "Email",
      privateName: "Private Name",
      publicName: "Public Name",
      firstName: "First Name",
      lastName: "Last Name",
      company: "Company",
      lastLogin: "Last Login",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    userStatusFilter: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      suspended: "Suspended",
      emailVerified: "Email Verified",
      emailUnverified: "Email Unverified",
    },
    userStatus: {
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      suspended: "Suspended",
    },
    userRoleFilter: {
      all: "All",
      user: "User",
      public: "Public",
      customer: "Customer",
      moderator: "Moderator",
      partnerAdmin: "Partner Admin",
      partnerEmployee: "Partner Employee",
      admin: "Admin",
      superAdmin: "Super Admin",
    },
  },
};
