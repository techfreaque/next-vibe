import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

export const translations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    create: "Create",
  },

  enums: {
    leadSource: {
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
    },
  },
  widget: {
    headerLeadCreated: "Lead Created",
    headerCreateLead: "New lead",
    subheaderFillDetails: "Fill in the details below",
    fallbackLeadName: "Lead",
    buttonCopyId: "Copy ID",
    buttonViewLead: "View Lead",
    buttonEditLead: "Edit Lead",
    buttonBackToList: "Back to List",
  },
  post: {
    title: "Create Lead",
    titleShort: "New Lead",
    description: "Create a new lead in the system",
    backButton: {
      label: "Back to Leads",
    },
    submitButton: {
      label: "Create lead",
      loadingText: "Creating lead...",
    },
    form: {
      title: "New Lead Form",
      description: "Enter lead information to create a new lead",
    },
    validation: {
      country: "Pick a country.",
      language: "Pick a language.",
      source: "Pick where this lead came from.",
    },
    contactInfo: {
      title: "Contact",
      description: "Primary contact details for the lead",
    },
    email: {
      label: "Email",
      description: "Primary email address for communication",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "Business name",
      description: "Name of the company or business",
      placeholder: "Example Corp",
    },
    phone: {
      label: "Phone",
      description: "Contact phone number with country code",
      placeholder: "+1234567890",
    },
    website: {
      label: "Website",
      description: "Company website URL",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Location and language",
      description: "Geographic and language preferences",
    },
    country: {
      label: "Country",
      description: "Business location or target market",
      placeholder: "Select a country",
    },
    language: {
      label: "Language",
      description: "Preferred communication language",
      placeholder: "Select a language",
    },
    leadDetails: {
      title: "Source and notes",
      description: "Additional information about the lead",
    },
    source: {
      label: "Source",
      description: "How the lead was acquired",
      placeholder: "Select source",
    },
    notes: {
      label: "Notes",
      description: "Additional notes or comments",
      placeholder: "Enter any additional information...",
    },
    response: {
      title: "Created Lead",
      description: "Details of the newly created lead",
      summary: {
        title: "Lead Summary",
        id: "Lead ID",
        businessName: "Business Name",
        email: "Email Address",
        status: "Lead Status",
      },
      contactDetails: {
        title: "Contact Details",
        phone: "Phone Number",
        website: "Website URL",
        country: "Country",
        language: "Language",
      },
      trackingInfo: {
        title: "Tracking Information",
        source: "Lead Source",
        emailsSent: "Email Count",
        currentCampaignStage: "Campaign Stage",
      },
      metadata: {
        title: "Metadata",
        notes: "Notes",
        createdAt: "Creation Date",
        updatedAt: "Last Updated",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to create leads",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid lead information provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred while creating lead",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred while creating lead",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while creating lead",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden for lead creation",
      },
      notFound: {
        title: "Not Found",
        description: "Required resource not found for lead creation",
      },
      conflict: {
        title: "Conflict",
        description: "Lead already exists or data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes in the lead form",
      },
    },
    success: {
      title: "Lead Created",
      description: "Lead created successfully",
    },
  },
  email: {
    welcome: {
      subject: "Welcome to {{companyName}}",
      title: "Welcome to {{companyName}}, {{businessName}}!",
      preview: "Welcome. Here is how to start.",
      greeting:
        "Welcome to {{companyName}}, {{businessName}}! Good to have you.",
      defaultName: "there",
      introduction:
        "Thanks for your interest. Your details reached us, and a real person reads them.",
      nextSteps: {
        title: "What happens next?",
        step1Number: "1.",
        step1: "Start chatting right away. No setup, no card.",
        step2Number: "2.",
        step2: "Questions? Reply to this email. A human reads it.",
        step3Number: "3.",
        step3: "We answer as soon as we can.",
      },
      cta: {
        getStarted: "Start chatting",
      },
      support:
        "Have questions? Reply to this email or contact us at {{supportEmail}}",
      error: {
        noEmail: "Cannot send welcome email - no email address provided",
      },
    },
    admin: {
      newLead: {
        subject: "New Lead: {{businessName}}",
        title: "New Lead Created",
        preview: "New lead from {{businessName}} requires follow-up",
        message:
          "A new lead has been created in the system from {{businessName}} and requires your attention.",
        leadDetails: "Lead Details",
        businessName: "Business Name",
        email: "Email",
        phone: "Phone",
        website: "Website",
        source: "Source",
        status: "Status",
        notes: "Notes",
        notProvided: "Not provided",
        viewLead: "View Lead Details",
        viewAllLeads: "View All Leads",
        error: {
          noData: "Cannot send admin notification - no lead data provided",
        },
        defaultName: "New Lead",
      },
    },
    error: {
      general: {
        internal_server_error: "An internal server error occurred",
      },
    },
  },
  countries: {
    ...regionalCountryNames("en"),
    global: "Global",
    de: "Germany",
    pl: "Poland",
    fr: "France",
    us: "United States",
  },
  languages: {
    it: "Italian",
    es: "Spanish",
    sk: "Slovak",
    en: "English",
    de: "German",
    pl: "Polish",
    fr: "French",
  },
};
