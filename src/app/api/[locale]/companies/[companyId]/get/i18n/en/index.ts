export const translations = {
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
      createdAt: "Member Since",
      actions: "Actions",
      modules: {
        title: "Modules",
        accounting: {
          label: "Accounting",
          description: "Chart of accounts, journal entries, reports",
        },
        invoices: {
          label: "Invoices",
          description: "AR invoices, estimates, payments",
        },
        estimates: {
          label: "Estimates",
          description: "Draft quotes for clients",
        },
        bills: {
          label: "Bills",
          description: "AP bills and vendor payments",
        },
        pos: {
          label: "Point of Sale",
          description: "Terminals, sessions, orders",
        },
        purchasing: {
          label: "Purchasing",
          description: "Purchase orders and vendors",
        },
        inventory: {
          label: "Inventory",
          description: "Stock, warehouses, transfers",
        },
        team: {
          label: "Team",
          description: "Members and roles",
        },
      },
    },
  },
};
