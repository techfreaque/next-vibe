export const translations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Individual",
    },
    companyMemberRole: {
      owner: "Owner",
      admin: "Admin",
      member: "Member",
      accountant: "Accountant",
      viewer: "Viewer",
    },
  },
  tags: {
    companies: "Companies",
    list: "List",
  },
  get: {
    title: "Companies",
    titleShort: "Company directory",
    description:
      "Browse company memberships. Platform administrators can open the full directory.",
    includeAll: {
      label: "All companies",
      description:
        "Include companies you do not belong to. Platform administrators only.",
    },
    page: {
      label: "Page",
      description: "Page number (starts at 1)",
    },
    pageSize: {
      label: "Per Page",
      description: "Results per page (max 100)",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view your companies",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Check your connection and try again",
      },
      notFound: {
        title: "Not Found",
        description: "No companies found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Companies Loaded",
      description: "Company list retrieved",
    },
    widget: {
      noMembership: "No membership",
      back: "Back",
      loading: "Loading companies...",
      title: "Companies",
      create: "New company",
      previous: "Previous",
      next: "Next",
      total: "companies",
      totalSingular: "company",
      inactive: "Inactive",
      empty: {
        title: "No companies yet",
        hint: "Create a company to start managing your accounting, invoicing, and team.",
        cta: "Create your first company",
      },
    },
    response: {
      total: "Total",
      id: "ID",
      name: "Name",
      type: "Type",
      role: "Your Role",
      isActive: "Active",
      country: "Country",
      currency: "Currency",
      email: "Email",
      createdAt: "Created",
    },
  },
};
