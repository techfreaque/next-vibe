export const translations = {
  widget: {
    headerLeadCreated: "Lead Created",
    headerCreateLead: "Create Lead",
    subheaderFillDetails: "Fill in the details below",
    fallbackLeadName: "Lead",
    buttonCopyId: "Copy ID",
    buttonViewLead: "View Lead",
    buttonEditLead: "Edit Lead",
    buttonBackToList: "Back to List",
  },
  post: {
    title: "Create Lead",
    description: "Create a new lead in the system",
    backButton: {
      label: "Back to Leads",
    },
    submitButton: {
      label: "Create Lead",
      loadingText: "Creating Lead...",
    },
    form: {
      title: "New Lead Form",
      description: "Enter lead information to create a new lead",
    },
    contactInfo: {
      title: "Contact Information",
      description: "Primary contact details for the lead",
    },
    email: {
      label: "Email Address",
      description: "Primary email address for communication",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "Business Name",
      description: "Name of the company or business",
      placeholder: "Example Corp",
    },
    phone: {
      label: "Phone Number",
      description: "Contact phone number with country code",
      placeholder: "+1234567890",
    },
    website: {
      label: "Website",
      description: "Company website URL",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "Location & Preferences",
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
      title: "Lead Details",
      description: "Additional information about the lead",
    },
    source: {
      label: "Lead Source",
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
      preview: "Welcome to our service - let's get you started",
      greeting:
        "Welcome to {{companyName}}, {{businessName}}! We're excited to help you grow your business.",
      defaultName: "there",
      introduction:
        "Thank you for your interest in our services. We've received your information and our team is ready to help you achieve your business goals.",
      nextSteps: {
        title: "What happens next?",
        step1Number: "1.",
        step1: "Our team will review your business profile and goals",
        step2Number: "2.",
        step2:
          "You'll receive a personalized consultation proposal within 24 hours",
        step3Number: "3.",
        step3:
          "We'll schedule a call to discuss your specific needs and objectives",
      },
      cta: {
        getStarted: "Schedule Your Consultation",
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
};
