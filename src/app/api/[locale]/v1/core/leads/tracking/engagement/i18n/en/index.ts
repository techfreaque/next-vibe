export const translations = {
  category: "Lead Tracking",
  tags: {
    tracking: "Tracking",
    engagement: "Engagement",
  },
  post: {
    title: "Record Lead Engagement",
    description: "Record a new engagement event for a lead",
    form: {
      title: "Lead Engagement Form",
      description: "Record lead engagement details",
    },
    leadId: {
      label: "Lead ID",
      description: "Unique identifier for the lead",
      placeholder: "Enter lead ID",
      helpText: "UUID of the lead to track engagement for",
    },
    engagementType: {
      label: "Engagement Type",
      description: "Type of engagement event",
      placeholder: "Select engagement type",
      helpText: "The type of interaction or engagement",
    },
    campaignId: {
      label: "Campaign ID",
      description: "Associated campaign identifier",
      placeholder: "Enter campaign ID",
      helpText: "Optional campaign this engagement is part of",
    },
    metadata: {
      label: "Metadata",
      description: "Additional engagement metadata",
      placeholder: "Enter metadata as JSON",
      helpText: "Custom data about this engagement",
    },
    userId: {
      label: "User ID",
      description: "Associated user identifier",
      placeholder: "Enter user ID",
      helpText: "Optional user ID if lead is associated with a user",
    },
    response: {
      id: "Engagement ID",
      leadId: "Lead ID",
      engagementType: "Engagement Type",
      campaignId: "Campaign ID",
      metadata: "Metadata",
      timestamp: "Timestamp",
      ipAddress: "IP Address",
      userAgent: "User Agent",
      createdAt: "Created At",
      leadCreated: "Lead Created",
      relationshipEstablished: "Relationship Established",
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
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Engagement Recorded",
      description: "Lead engagement recorded successfully",
    },
  },
  get: {
    title: "Track Lead Click",
    description: "Track lead click and redirect to target URL",
    form: {
      title: "Click Tracking Parameters",
      description: "Parameters for click tracking and redirect",
    },
    id: {
      label: "Lead ID",
      description: "Unique identifier for the lead",
      placeholder: "Enter lead ID",
      helpText: "UUID of the lead to track click for",
    },
    stage: {
      label: "Campaign Stage",
      description: "Email campaign stage",
      placeholder: "Select campaign stage",
      helpText: "Optional campaign stage this click is part of",
    },
    source: {
      label: "Lead Source",
      description: "Source of the lead",
      placeholder: "Select lead source",
      helpText: "Source where the lead originated from",
    },
    url: {
      label: "Target URL",
      description: "URL to redirect to after tracking",
      placeholder: "Enter target URL",
      helpText: "The destination URL for redirection",
    },
    response: {
      success: "Success",
      redirectUrl: "Redirect URL",
      leadId: "Lead ID",
      campaignId: "Campaign ID",
      engagementRecorded: "Engagement Recorded",
      leadStatusUpdated: "Lead Status Updated",
      isLoggedIn: "Is Logged In",
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
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Click Tracked",
      description: "Lead click tracked successfully",
    },
  },
  enums: {
    engagementLevel: {
      high: "High",
      medium: "Medium",
      low: "Low",
      none: "None",
    },
  },
  error: {
    default: "An error occurred while processing the engagement",
  },
};
