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
    pitch: {
      headline: "Turn visitors into subscribers",
      body: "When someone views your skill page or creator profile, they see a subscribe field. They enter their email - it lands directly in your list. No extra apps, no middleman, no monthly fee for basic capture.",
      step1: "Someone visits your skill page or creator profile",
      step2: "They submit the subscribe form",
      step3: "Email lands in your list - on your platform of choice",
    },
    noConfig:
      "Connect an email platform to start collecting subscribers from your skill pages and creator profile.",
    active: "Active",
    inactive: "Inactive",
    choosePlatform: "Connect email platform",
    switchPlatform: "Switch platform",
    selectPlaceholder: "Pick a platform…",
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
