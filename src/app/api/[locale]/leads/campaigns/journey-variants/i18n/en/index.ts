export const translations = {
  title: "Journey Variants",
  description: "Manage email journey variant registrations",
  get: {
    title: "Journey Variants",
    description: "List all registered email journey variants",
    response: {
      id: "ID",
      variantKey: "Variant Key",
      displayName: "Display Name",
      description: "Description",
      weight: "Weight",
      active: "Active",
      campaignType: "Campaign Type",
      sourceFilePath: "Source File Path",
      checkErrors: "Check Errors",
      createdAt: "Created At",
      updatedAt: "Updated At",
      items: "Variants",
      total: "Total Variants",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Must be admin" },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to load journey variants",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      notFound: { title: "Not Found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
      network: { title: "Network Error", description: "Network error" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: {
      title: "Variants Loaded",
      description: "Journey variants loaded successfully",
    },
  },
  post: {
    title: "Register Journey Variant",
    description: "Register a new email journey variant",
    fields: {
      variantKey: {
        label: "Variant Key",
        description:
          "Unique identifier (e.g. MY_VARIANT). Must match a key in EmailJourneyVariant enum.",
      },
      displayName: {
        label: "Display Name",
        description: "Human-readable name for this variant",
      },
      description: {
        label: "Description",
        description: "What this journey is about",
      },
      weight: {
        label: "Weight",
        description:
          "A/B test weight (1-100). Used for cold-lead campaigns only.",
      },
      campaignType: {
        label: "Campaign Type",
        description: "Which campaign type this variant is for (optional)",
      },
      sourceFilePath: {
        label: "Source File Path",
        description:
          "Relative path to the .email.tsx file (e.g. journeys/my-variant.email)",
      },
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Must be admin" },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to register journey variant",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid variant key or data",
      },
      notFound: {
        title: "Not Found",
        description: "Variant key not found in enum",
      },
      conflict: {
        title: "Conflict",
        description: "Variant key already registered",
      },
      network: { title: "Network Error", description: "Network error" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: {
      title: "Variant Registered",
      description: "Journey variant registered successfully",
    },
  },
  patch: {
    title: "Update Journey Variant",
    description: "Update a registered email journey variant",
    fields: {
      id: {
        label: "Variant ID",
        description: "ID of the variant to update",
      },
      active: {
        label: "Active",
        description: "Enable or disable this variant",
      },
      weight: {
        label: "Weight",
        description: "A/B test weight (1-100)",
      },
      displayName: {
        label: "Display Name",
        description: "Human-readable name for this variant",
      },
      description: {
        label: "Description",
        description: "What this journey is about",
      },
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Must be admin" },
      forbidden: { title: "Forbidden", description: "No permission" },
      server: {
        title: "Server Error",
        description: "Failed to update journey variant",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid update data",
      },
      notFound: { title: "Not Found", description: "Variant not found" },
      conflict: { title: "Conflict", description: "Conflict" },
      network: { title: "Network Error", description: "Network error" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: {
      title: "Variant Updated",
      description: "Journey variant updated successfully",
    },
  },
  widget: {
    title: "Journey Variants",
    refresh: "Refresh",
    register: "Register Variant",
    noVariants: "No variants registered yet",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    weightLabel: "Weight",
    campaignTypeLabel: "Campaign Type",
    sourceFileLabel: "Source File",
    toggleActivate: "Activate",
    toggleDeactivate: "Deactivate",
    checkErrorsLabel: "Check errors:",
  },
};
