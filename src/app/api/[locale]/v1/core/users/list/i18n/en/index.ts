export const translations = {
  title: "List Users",
  description: "List and search users with filtering",
  category: "Users",
  tag: "List",
  container: {
    title: "User List",
    description: "Search and filter users",
  },
  fields: {
    limit: {
      label: "Limit",
      description: "Number of users to return",
      placeholder: "Enter limit...",
    },
    page: {
      label: "Page",
      description: "Page number for pagination",
      placeholder: "Enter page number...",
    },
    offset: {
      label: "Offset",
      description: "Number of users to skip",
    },
    search: {
      label: "Search",
      description: "Search users by name or email",
      placeholder: "Enter search term...",
    },
    status: {
      label: "Status Filter",
      description: "Filter users by status",
      placeholder: "Select status...",
    },
    role: {
      label: "Role Filter",
      description: "Filter users by role",
      placeholder: "Select role...",
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
