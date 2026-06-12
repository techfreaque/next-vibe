export const translations = {
  tags: {
    companies: "Companies",
    update: "Update",
    management: "Management",
  },
  patch: {
    title: "Update Company",
    titleShort: "Update Company",
    description: "Edit company details. Requires Admin or Owner role.",
    companyId: {
      label: "Company ID",
      description: "The company to update",
    },
    name: {
      label: "Company Name",
      description: "Legal name of the company",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Company Type",
      description: "Business model",
      placeholder: "Select type",
    },
    vatNumber: {
      label: "VAT Number",
      description: "VAT identification number",
      placeholder: "DE123456789",
    },
    country: {
      label: "Country",
      description: "Country of registration",
      placeholder: "DE",
    },
    currency: {
      label: "Default Currency",
      description: "Primary invoicing currency",
      placeholder: "EUR",
    },
    email: {
      label: "Company Email",
      description: "Primary business email",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Company Phone",
      description: "Primary business phone",
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
        description: "Check the form and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to update company details",
      },
      forbidden: {
        title: "Access Denied",
        description: "Admin or Owner role required to update company details",
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
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Company Updated",
      description: "Company details saved successfully",
    },
    response: {
      id: "Company ID",
      name: "Company Name",
    },
    widget: {
      back: "Back",
      successLabel: "Company updated",
      viewCompany: "View Company",
    },
  },
};
