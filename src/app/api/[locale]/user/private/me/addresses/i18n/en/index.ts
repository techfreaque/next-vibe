export const translations = {
  category: "User Addresses",
  tag: "addresses",

  list: {
    title: "My Addresses",
    titleShort: "My Addresses",
    description: "List your saved addresses",
    response: {
      addresses: "Addresses",
    },
    widget: {
      addAddress: "Add Address",
      edit: "Edit",
      delete: "Delete",
      billing: "Billing",
      delivery: "Delivery",
      empty: "No saved addresses",
      emptyHint: "Save addresses for faster checkout",
      emptyCta: "Add your first address",
      loading: "Loading addresses…",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "No addresses found" },
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
    success: { title: "Success", description: "Addresses retrieved" },
  },

  create: {
    title: "Add Address",
    titleShort: "Add Address",
    description: "Save a new address to your account",
    fields: {
      label: {
        label: "Label",
        description: "Name this address (e.g. Home, Office)",
        placeholder: "Home",
      },
      fullName: {
        label: "Full Name",
        description: "Contact name for this address",
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
      id: "Address ID",
      label: "Label",
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
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "User not found" },
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
      title: "Address Saved",
      description: "Address added to your account",
    },
    widget: {
      saved: "Address saved.",
      backToAddresses: "Back to Addresses",
    },
  },
};
