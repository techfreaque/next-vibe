export const translations = {
  get: {
    title: "Get Lead Details",
    description: "Retrieve detailed information about a specific lead",
    backButton: {
      label: "Back to Leads",
    },
    editButton: {
      label: "Edit Lead",
    },
    deleteButton: {
      label: "Delete Lead",
    },
    id: {
      label: "Lead ID",
      description: "Unique identifier for the lead",
    },
    form: {
      title: "Lead Details Request",
      description: "Request parameters for retrieving lead information",
    },
    response: {
      title: "Lead Information",
      description: "Complete lead details and history",
      basicInfo: {
        title: "Basic Information",
        description: "Core lead identification and status",
      },
      id: {
        content: "Lead ID",
      },
      email: {
        content: "Email Address",
      },
      businessName: {
        content: "Business Name",
      },
      contactName: {
        content: "Contact Name",
      },
      status: {
        content: "Lead Status",
      },
      contactDetails: {
        title: "Contact Details",
        description: "Contact information and preferences",
      },
      phone: {
        content: "Phone Number",
      },
      website: {
        content: "Website URL",
      },
      country: {
        content: "Country",
      },
      language: {
        content: "Language",
      },
      campaignTracking: {
        title: "Campaign Tracking",
        description: "Email campaign and tracking information",
      },
      source: {
        content: "Lead Source",
      },
      currentCampaignStage: {
        content: "Current Campaign Stage",
      },
      emailJourneyVariant: {
        content: "Email Journey Variant",
      },
      emailsSent: {
        content: "Emails Sent",
      },
      lastEmailSentAt: {
        content: "Last Email Sent",
      },
      engagement: {
        title: "Engagement Metrics",
        description: "Email engagement and interaction data",
      },
      emailsOpened: {
        content: "Emails Opened",
      },
      emailsClicked: {
        content: "Emails Clicked",
      },
      lastEngagementAt: {
        content: "Last Engagement",
      },
      unsubscribedAt: {
        content: "Unsubscribed At",
      },
      conversion: {
        title: "Conversion Tracking",
        description: "Lead conversion and milestone tracking",
      },
      convertedUserId: {
        content: "Converted User ID",
      },
      convertedAt: {
        content: "Converted At",
      },
      signedUpAt: {
        content: "Signed Up At",
      },
      subscriptionConfirmedAt: {
        content: "Subscription Confirmed At",
      },
      metadata: {
        title: "Additional Information",
        description: "Notes and metadata",
        content: "Metadata",
      },
      notes: {
        content: "Notes",
      },
      createdAt: {
        content: "Created At",
      },
      updatedAt: {
        content: "Updated At",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided lead ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access lead details",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to view this lead",
      },
      notFound: {
        title: "Lead Not Found",
        description: "No lead found with the provided ID",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving lead details",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Data Conflict",
        description: "The lead data has been modified",
      },
    },
    success: {
      title: "Success",
      description: "Lead details retrieved successfully",
    },
  },
  patch: {
    title: "Update Lead",
    description: "Update lead information and status",
    backButton: {
      label: "Back to Lead",
    },
    deleteButton: {
      label: "Delete Lead",
    },
    submitButton: {
      label: "Update Lead",
      loadingText: "Updating Lead...",
    },
    id: {
      label: "Lead ID",
      description: "Unique identifier for the lead to update",
    },
    form: {
      title: "Update Lead",
      description: "Modify lead information",
    },
    updates: {
      title: "Lead Updates",
      description: "Fields to update",
    },
    basicInfo: {
      title: "Basic Information",
      description: "Update core lead information",
    },
    email: {
      label: "Email Address",
      description: "Lead's email address",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Business Name",
      description: "Name of the business",
      placeholder: "Acme Corporation",
    },
    contactName: {
      label: "Contact Name",
      description: "Primary contact person",
      placeholder: "John Doe",
    },
    status: {
      label: "Lead Status",
      description: "Current status of the lead",
      placeholder: "Select status",
    },
    contactDetails: {
      title: "Contact Details",
      description: "Update contact information",
    },
    phone: {
      label: "Phone Number",
      description: "Contact phone number",
      placeholder: "+1234567890",
    },
    website: {
      label: "Website",
      description: "Business website URL",
      placeholder: "https://example.com",
    },
    country: {
      label: "Country",
      description: "Business country",
      placeholder: "Select country",
    },
    language: {
      label: "Language",
      description: "Preferred language",
      placeholder: "Select language",
    },
    campaignManagement: {
      title: "Campaign Management",
      description: "Manage campaign settings",
    },
    source: {
      label: "Lead Source",
      description: "Origin of the lead",
      placeholder: "Select source",
    },
    currentCampaignStage: {
      label: "Campaign Stage",
      description: "Current email campaign stage",
      placeholder: "Select stage",
    },
    additionalDetails: {
      title: "Additional Details",
      description: "Notes and metadata",
    },
    notes: {
      label: "Notes",
      description: "Internal notes about the lead",
      placeholder: "Add notes here",
    },
    metadata: {
      label: "Metadata",
      description: "Additional metadata (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "Converted User ID",
      description: "ID of the converted user account",
      placeholder: "User ID",
    },
    subscriptionConfirmedAt: {
      label: "Subscription Confirmed At",
      description: "Date when subscription was confirmed",
      placeholder: "Select date",
    },
    response: {
      title: "Updated Lead",
      description: "Updated lead information",
      basicInfo: {
        title: "Basic Information",
        description: "Updated core lead information",
      },
      id: {
        content: "Lead ID",
      },
      email: {
        content: "Email Address",
      },
      businessName: {
        content: "Business Name",
      },
      contactName: {
        content: "Contact Name",
      },
      status: {
        content: "Lead Status",
      },
      contactDetails: {
        title: "Contact Details",
        description: "Updated contact information",
      },
      phone: {
        content: "Phone Number",
      },
      website: {
        content: "Website URL",
      },
      country: {
        content: "Country",
      },
      language: {
        content: "Language",
      },
      campaignTracking: {
        title: "Campaign Tracking",
        description: "Updated campaign information",
      },
      source: {
        content: "Lead Source",
      },
      currentCampaignStage: {
        content: "Current Campaign Stage",
      },
      emailJourneyVariant: {
        content: "Email Journey Variant",
      },
      emailsSent: {
        content: "Emails Sent",
      },
      lastEmailSentAt: {
        content: "Last Email Sent",
      },
      engagement: {
        title: "Engagement Metrics",
        description: "Email engagement data",
      },
      emailsOpened: {
        content: "Emails Opened",
      },
      emailsClicked: {
        content: "Emails Clicked",
      },
      lastEngagementAt: {
        content: "Last Engagement",
      },
      unsubscribedAt: {
        content: "Unsubscribed At",
      },
      conversion: {
        title: "Conversion Tracking",
        description: "Conversion milestone tracking",
      },
      convertedUserId: {
        content: "Converted User ID",
      },
      convertedAt: {
        content: "Converted At",
      },
      signedUpAt: {
        content: "Signed Up At",
      },
      subscriptionConfirmedAt: {
        content: "Subscription Confirmed At",
      },
      metadata: {
        title: "Additional Information",
        description: "Notes and metadata",
        content: "Metadata",
      },
      notes: {
        content: "Notes",
      },
      createdAt: {
        content: "Created At",
      },
      updatedAt: {
        content: "Updated At",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to update leads",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to update this lead",
      },
      notFound: {
        title: "Lead Not Found",
        description: "No lead found with the provided ID",
      },
      conflict: {
        title: "Update Conflict",
        description: "The lead was modified by another user",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while updating the lead",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Lead updated successfully",
    },
  },
  post: {
    title: "[id]",
    description: "[id] endpoint",
    form: {
      title: "[id] Configuration",
      description: "Configure [id] parameters",
    },
    response: {
      title: "Response",
      description: "[id] response data",
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
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  delete: {
    title: "Delete Lead",
    description: "Delete a lead from the system",
    container: {
      title: "Delete Lead",
      description: "Are you sure you want to permanently delete this lead?",
    },
    backButton: {
      label: "Back to Lead",
    },
    submitButton: {
      label: "Delete Lead",
      loadingText: "Deleting Lead...",
    },
    actions: {
      delete: "Delete Lead",
      deleting: "Deleting Lead...",
    },
    id: {
      label: "Lead ID",
      description: "Unique identifier for the lead to delete",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided lead ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to delete leads",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to delete this lead",
      },
      notFound: {
        title: "Lead Not Found",
        description: "No lead found with the provided ID",
      },
      conflict: {
        title: "Delete Conflict",
        description: "The lead cannot be deleted due to existing dependencies",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while deleting the lead",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Lead Deleted",
      description: "The lead has been successfully deleted",
    },
  },
};
