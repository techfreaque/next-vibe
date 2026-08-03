export const translations = {
  category: "Leads",
  countries: {
    global: "Global",
    de: "Germany",
    pl: "Poland",
    us: "United States",
  },
  languages: {
    en: "English",
    de: "German",
    pl: "Polish",
  },
  enums: {
    campaignType: {
      leadCampaign: "Lead Campaign",
      newsletter: "Newsletter",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      transactional: "Transactional",
      notification: "Notification",
      system: "System",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Uncensored Convert",
      sideHustle: "Side Hustle",
      quietRecommendation: "Quiet Recommendation",
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
      newsletterMay2026: "Newsletter May 2026",
    },
    emailCampaignStage: {
      notStarted: "Not Started",
      initial: "Initial",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    leadStatus: {
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
    },
  },
  tags: {
    campaigns: "Campaigns",
    leads: "Leads",
  },
  post: {
    title: "Test Mail",
    titleShort: "Test Email",
    description: "Send test email with custom lead data",
    form: {
      title: "Test Mail Configuration",
      description: "Configure test mail parameters and lead data",
    },
    campaignType: {
      label: "Campaign Type",
      description: "Type of email campaign",
      placeholder: "Enter campaign type",
    },
    emailJourneyVariant: {
      label: "Email Journey Variant",
      description: "A/B test variant for email journey",
      placeholder: "Select journey variant",
    },
    emailCampaignStage: {
      label: "Email Campaign Stage",
      description: "Current stage in the email campaign",
      placeholder: "Select campaign stage",
    },
    testEmail: {
      label: "Test Email Address",
      description: "Email address to send test mail to",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Lead Data",
      description: "Lead information for template rendering",
      businessName: {
        label: "Business Name",
        description: "Name of the business",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Contact Name",
        description: "Name of the contact person",
        placeholder: "John Doe",
      },
      website: {
        label: "Website",
        description: "Company website URL",
        placeholder: "https://example.com",
      },
      country: {
        label: "Country",
        description: "Country code",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Language",
        description: "Preferred language code",
        placeholder: "en",
      },
      status: {
        label: "Status",
        description: "Lead status",
        placeholder: "NEW",
      },
      source: {
        label: "Source",
        description: "Lead source",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Notes",
        description: "Additional notes about the lead",
        placeholder: "Enter any additional notes",
      },
    },
    response: {
      title: "Test Email Result",
      description: "Result of sending test email",
      success: {
        content: "Success",
      },
      messageId: {
        content: "Message ID",
      },
      testEmail: {
        content: "Test Email",
      },
      subject: {
        content: "Email Subject",
      },
      sentAt: {
        content: "Sent At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
        detail: "Test send failed: {{error}}",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      templateNotFound: {
        title:
          "No template for {{emailJourneyVariant}} / {{emailCampaignStage}}",
        description: "Email template not found for specified parameters",
      },
      sendingFailed: {
        title: "Send to {{recipient}} failed ({{subject}}): {{error}}",
        description: "Failed to send test email",
      },
    },
    success: {
      title: "Success",
      description: "Test email sent successfully",
    },
    selectionCriteria: "SMTP Selection Criteria",
    widget: {
      title: "Send Test Email",
      send: "Send Test Email",
      sending: "Sending...",
      successMessage: "Test email sent successfully",
      sentTo: "Sent to: ",
      subject: "Subject: ",
      sentAt: "Sent at: ",
      campaignConfig: "Campaign Config",
      sendAnother: "Send Another",
    },
  },
};
