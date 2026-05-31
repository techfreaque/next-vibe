export const translations = {
  get: {
    title: "Get User CRM Profile",
    description: "Retrieve a user's billing fields and note count",
    fields: {
      userId: {
        label: "User ID",
        description: "The user to look up",
        placeholder: "User UUID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid user ID",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have access to this user's CRM data",
      },
      notFound: {
        title: "Not Found",
        description: "User not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: {
        title: "Internal Error",
        description: "Server error — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
    },
    success: {
      title: "CRM Profile Loaded",
      description: "User CRM data retrieved",
    },
    widget: {
      addNote: "Add Note",
      viewNotes: "View Notes",
    },
    response: {
      id: "User ID",
      email: "Email",
      privateName: "Name",
      companyBillingName: "Company / Billing Name",
      vatNumber: "VAT Number",
      taxId: "Tax ID",
      phone: "Phone",
      addressLine1: "Address Line 1",
      addressLine2: "Address Line 2",
      city: "City",
      region: "Region",
      postalCode: "Postal Code",
      billingCountry: "Country",
      defaultCurrency: "Default Currency",
      paymentTermsDays: "Payment Terms (days)",
      notesCount: "Total Notes",
    },
  },
  tag: "CRM",
};
