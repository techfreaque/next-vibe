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
    create: "Create",
  },
  post: {
    title: "Create Company",
    titleShort: "New Company",
    description: "Register a new company. You become its owner automatically.",
    name: {
      label: "Company Name",
      description: "Legal name of the company",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Company Type",
      description: "Business model — B2B, B2C, or individual",
      placeholder: "Select type",
    },
    vatNumber: {
      label: "VAT Number",
      description: "VAT identification number for tax purposes",
      placeholder: "DE123456789",
    },
    country: {
      label: "Country",
      description: "Country where the company is registered",
      placeholder: "Select country",
    },
    currency: {
      label: "Default Currency",
      description: "Primary currency for invoicing",
      placeholder: "EUR",
    },
    email: {
      label: "Company Email",
      description: "Primary business email address",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Company Phone",
      description: "Primary business phone number",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Website",
      description: "Company website URL",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the form fields and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to create a company",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to create a company",
      },
      conflict: {
        title: "Already Exists",
        description: "A company with this name already exists",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong on our end — try again",
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
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Company Created",
      description: "Your company is ready. Add members to get started.",
    },
    response: {
      id: "Company ID",
      name: "Company Name",
    },
    widget: {
      viewCompany: "View Company",
      back: "Back to List",
    },
  },
};
