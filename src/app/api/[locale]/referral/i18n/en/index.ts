export const translations = {
  // Main referral domain
  category: "Referral",

  // Tags
  tags: {
    referral: "referral",
    codes: "codes",
    earnings: "earnings",
    get: "get",
    create: "create",
    list: "list",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Get Referral Code",
    description: "Retrieve referral code details",
    form: {
      title: "Referral Code Details",
      description: "View referral code information",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Create Referral Code",
    description: "Create a new referral code",
    form: {
      title: "Create Referral Code",
      description: "Generate a new referral code to share with others",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Update Referral Code",
    description: "Update referral code settings",
    form: {
      title: "Update Referral Code",
      description: "Modify referral code properties",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Deactivate Referral Code",
    description: "Deactivate a referral code",
    form: {
      title: "Deactivate Referral Code",
      description: "Disable this referral code",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Link Referral to Lead",
      description: "Link a referral code to a lead before signup",
      form: {
        title: "Link Referral Code",
        description: "Associate referral code with your session",
      },
    },
    success: {
      title: "Referral Linked",
      description: "Referral code successfully linked to your session",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "List Referral Codes",
        description: "Get all your referral codes with statistics",
        form: {
          title: "Your Referral Codes",
          description: "View and manage your referral codes",
        },
      },
      success: {
        title: "Codes Retrieved",
        description: "Successfully retrieved your referral codes",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Referral Statistics",
      description: "Get your referral program statistics",
      form: {
        title: "Your Referral Stats",
        description: "View your referral performance metrics",
      },
    },
    success: {
      title: "Stats Retrieved",
      description: "Successfully retrieved your referral statistics",
    },
  },

  // Earnings List endpoint
  earnings: {
    list: {
      get: {
        title: "List Referral Earnings",
        description: "Get your referral earnings history",
        form: {
          title: "Your Referral Earnings",
          description: "View your earnings from referrals",
        },
      },
      success: {
        title: "Earnings Retrieved",
        description: "Successfully retrieved your referral earnings",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Referral Code",
        description: "Unique referral code",
        placeholder: "Enter code",
      },
      label: {
        label: "Label",
        description: "Optional label for this code",
        placeholder: "My referral code",
      },
      description: {
        label: "Description",
        description: "Optional description",
        placeholder: "Enter description",
      },
      maxUses: {
        label: "Maximum Uses",
        description: "Maximum number of times this code can be used",
        placeholder: "Leave empty for unlimited",
      },
      expiresAt: {
        label: "Expiration Date",
        description: "When this code expires",
        placeholder: "Select date",
      },
      isActive: {
        label: "Active",
        description: "Whether this code is currently active",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Code",
    label: "Label",
    description: "Description",
    ownerUserId: "Owner User ID",
    maxUses: "Maximum Uses",
    currentUses: "Current Uses",
    expiresAt: "Expires At",
    isActive: "Active",
    createdAt: "Created At",
    updatedAt: "Updated At",
    referralCode: "Referral Code",
    success: "Success",
    message: "Message",
  },

  // Error types
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid referral code parameters",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "Referral code not found",
    },
    not_found: "Referral code not found",
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    serverError: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Referral code already exists",
    },
    code_exists: "This referral code already exists",
    code_expired: "This referral code has expired",
    code_inactive: "This referral code is not active",
    max_uses_reached: "This referral code has reached its maximum uses",
    invalid_code: "Invalid referral code",
  },

  // Success types
  success: {
    title: "Success",
    description: "Operation completed successfully",
    code_created: "Referral code created successfully",
    code_updated: "Referral code updated successfully",
    code_deactivated: "Referral code deactivated successfully",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Subscription",
      creditPack: "Credit Pack",
    },
    earningStatus: {
      pending: "Pending",
      confirmed: "Confirmed",
      canceled: "Canceled",
    },
  },
};
