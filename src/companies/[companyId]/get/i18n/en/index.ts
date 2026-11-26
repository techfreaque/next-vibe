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
    get: "Get",
  },
  get: {
    title: "Company Details",
    titleShort: "Company",
    description: "View company information",
    companyId: {
      label: "Company ID",
      description: "The company to view",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid company ID",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view company details",
      },
      forbidden: {
        title: "Access Denied",
        description: "You are not a member of this company",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
      },
      server: {
        title: "Server Error",
        description: "The request failed. Try again.",
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
        title: "Company Not Found",
        description: "This company does not exist or you lost access",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Company Loaded",
      description: "Company details retrieved",
    },
    widget: {
      address: "Address",
      activeMembers: "Active members",
      backToList: "Companies",
      type: "Customer type",
      loadFailed: "Could not load this company",
      retry: "Try again",
      related: "Work in this company",
      setupAccounting: "Set up accounting",
      back: "Back",
      loading: "Loading company...",
      edit: "Edit",
      members: "Members",
      invite: "Invite Member",
      chartOfAccounts: "Chart of Accounts",
      viewInvoices: "View Invoices",
      viewTerminals: "View POS Terminals",
      active: "Active",
      inactive: "Inactive",
      country: "Country",
      currency: "Currency",
      vatNumber: "VAT Number",
      taxId: "Tax ID",
      email: "Email",
      phone: "Phone",
      website: "Website",
      createdAt: "Created",
      actions: "Actions",
      modules: {
        accounting: {
          label: "Accounting",
        },
        invoices: {
          label: "Invoices",
        },
        estimates: {
          label: "Estimates",
        },
        bills: {
          label: "Bills",
        },
        pos: {
          label: "Point of Sale",
        },
        purchasing: {
          label: "Purchasing",
        },
        inventory: {
          label: "Inventory",
        },
        team: {
          label: "Team",
        },
      },
    },
  },
};
