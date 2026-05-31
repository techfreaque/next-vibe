export const translations = {
  category: "User Addresses",
  tag: "addresses",

  update: {
    title: "Update Address",
    description: "Edit a saved address",
    fields: {
      addressId: { label: "Address ID", description: "Address to update" },
      label: {
        label: "Label",
        description: "Name this address",
        placeholder: "Home",
      },
      fullName: {
        label: "Full Name",
        description: "Contact name",
        placeholder: "Jane Doe",
      },
      company: {
        label: "Company",
        description: "Company name (optional)",
        placeholder: "Acme Corp",
      },
      phone: {
        label: "Phone",
        description: "Contact phone number",
        placeholder: "+1 555 000 0000",
      },
      vatNumber: {
        label: "VAT Number",
        description: "EU VAT registration number",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Tax ID",
        description: "National tax identifier",
        placeholder: "123-45-6789",
      },
      addressLine1: {
        label: "Address Line 1",
        description: "Street and number",
        placeholder: "123 Main St",
      },
      addressLine2: {
        label: "Address Line 2",
        description: "Apartment, suite, unit (optional)",
        placeholder: "Suite 4B",
      },
      city: { label: "City", description: "City", placeholder: "Berlin" },
      region: {
        label: "State / Region",
        description: "State or region (optional)",
        placeholder: "Bayern",
      },
      postalCode: {
        label: "Postal Code",
        description: "ZIP or postal code",
        placeholder: "10115",
      },
      country: {
        label: "Country",
        description: "ISO 3166-1 alpha-2 country code",
        placeholder: "DE",
      },
      isDefaultBilling: {
        label: "Default Billing",
        description: "Use as default billing address",
      },
      isDefaultDelivery: {
        label: "Default Delivery",
        description: "Use as default delivery address",
      },
    },
    response: {
      updated: "Updated",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check required fields",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "This address does not belong to you",
      },
      notFound: { title: "Not Found", description: "Address not found" },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Address Updated",
      description: "Address saved successfully",
    },
    widget: {
      updated: "Address updated.",
      backToAddresses: "Back to Addresses",
    },
  },

  delete: {
    title: "Delete Address",
    description: "Remove a saved address from your account",
    fields: {
      addressId: { label: "Address ID", description: "Address to delete" },
    },
    response: {
      deleted: "Deleted",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "This address does not belong to you",
      },
      notFound: { title: "Not Found", description: "Address not found" },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      internal: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      title: "Address Deleted",
      description: "Address removed from your account",
    },
    widget: {
      deleted: "Address deleted.",
      backToAddresses: "Back to Addresses",
    },
  },
};
