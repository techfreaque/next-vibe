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
    update: "Update",
    management: "Management",
  },
  patch: {
    title: "Update company",
    titleShort: "Update company",
    description: "Edit company details. Requires Admin or Owner role.",
    companyId: {
      label: "Company ID",
      description: "The company to update",
    },
    name: {
      label: "Company name",
      description: "Legal name of the company",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Company type",
      description: "Business model",
      placeholder: "Select type",
    },
    vatNumber: {
      label: "VAT number",
      description: "VAT identification number",
      placeholder: "DE123456789",
    },
    country: {
      label: "Country",
      description: "Country of registration",
      placeholder: "DE",
    },
    currency: {
      label: "Default currency",
      description: "Primary invoicing currency",
      placeholder: "EUR",
    },
    email: {
      label: "Company email",
      description: "Primary business email",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Company phone",
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
        title: "Validation error",
        description: "Check the form and try again",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to update company details",
      },
      forbidden: {
        title: "Access denied",
        description: "Admin or Owner role required to update company details",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
      },
      server: {
        title: "Server error",
        description: "Something went wrong. Try again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network error",
        description: "Check your connection and try again",
      },
      notFound: {
        title: "Company not found",
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Company updated",
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
