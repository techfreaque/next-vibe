export const translations = {
  title: "All Users",
  description: "Browse and manage all user accounts in the system",
  empty: {
    title: "No users found",
    description:
      "No users match your current filters. Try adjusting your search criteria.",
    message: "No users match your current filters.",
  },
  filters: {
    title: "Filters",
    placeholder: "Use the filters above to search and filter users.",
    clear: "Clear Filters",
    search: {
      placeholder: "Search users by name, email, or company...",
    },
    status: {
      label: "Status",
      all: "All Statuses",
      active: "Active",
      inactive: "Inactive",
      emailVerified: "Email Verified",
      emailUnverified: "Email Unverified",
    },
    role: {
      label: "Role",
      all: "All Roles",
      public: "Public",
      customer: "Customer",
      partnerAdmin: "Partner Admin",
      partnerEmployee: "Partner Employee",
      admin: "Admin",
    },
    country: {
      label: "Country",
      all: "All Countries",
    },
    language: {
      label: "Language",
      all: "All Languages",
    },
    sortBy: {
      label: "Sort by",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      company: "Company",
    },
    sortOrder: {
      label: "Order",
      asc: "Ascending",
      desc: "Descending",
    },
  },
  results: {
    showing: "Showing {{start}} to {{end}} of {{total}} users",
  },
  pagination: {
    showing: "Showing {{start}} to {{end}} of {{total}} users",
    page: "Page {{current}} of {{total}}",
    per_page: "Per page",
    of: "of",
  },
};
