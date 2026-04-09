export const translations = {
  get: {
    tag: "lead-magnet-config",
    title: "Lead Magnet Config",
    description: "View your current lead magnet configuration",
    response: {
      exists: "Config exists",
      config: "Config",
    },
    success: {
      title: "Config Retrieved",
      description: "Your lead magnet config was retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The request data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission",
      },
      notFound: { title: "Not Found", description: "No config found" },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      internal: {
        title: "Server Error",
        description: "An internal error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
  },
  widget: {
    loading: "Loading…",
    noConfig:
      "No email platform connected. Pick one below to start capturing leads.",
    active: "Active",
    inactive: "Inactive",
    choosePlatform: "Choose email platform",
    switchPlatform: "Switch platform",
    selectPlaceholder: "Select a platform…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "Email (via platform)",
    },
    capturedLeads: "Captured Leads",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "Disconnect Email Platform",
    description:
      "Remove your lead magnet configuration and stop capturing leads",
    response: {
      deleted: "Disconnected",
    },
    success: {
      title: "Disconnected",
      description: "Your email platform has been disconnected",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The request data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission",
      },
      notFound: {
        title: "Not Found",
        description: "No config found to delete",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      internal: {
        title: "Server Error",
        description: "An internal error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
  },
};
