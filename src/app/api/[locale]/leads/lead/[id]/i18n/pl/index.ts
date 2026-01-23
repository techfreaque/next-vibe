import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Get Lead Details",
    description: "Retrieve detailed information about a specific lead",
    backButton: {
      label: "Powrót do leadów",
    },
    editButton: {
      label: "Edytuj leada",
    },
    deleteButton: {
      label: "Usuń leada",
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
      label: "Powrót do leada",
    },
    deleteButton: {
      label: "Usuń leada",
    },
    submitButton: {
      label: "Zaktualizuj leada",
      loadingText: "Aktualizowanie leada...",
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
    title: "Usuń leada",
    description: "Usuń leada z systemu",
    container: {
      title: "Usuń leada",
      description: "Czy na pewno chcesz trwale usunąć tego leada?",
    },
    backButton: {
      label: "Powrót do leada",
    },
    submitButton: {
      label: "Usuń leada",
      loadingText: "Usuwanie leada...",
    },
    actions: {
      delete: "Usuń leada",
      deleting: "Usuwanie leada...",
    },
    id: {
      label: "ID leada",
      description: "Unikalny identyfikator leada do usunięcia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID leada jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja aby usuwać leadów",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do usunięcia tego leada",
      },
      notFound: {
        title: "Lead nie znaleziony",
        description: "Nie znaleziono leada z podanym ID",
      },
      conflict: {
        title: "Konflikt usuwania",
        description:
          "Lead nie może być usunięty z powodu istniejących zależności",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania leada",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Lead usunięty",
      description: "Lead został pomyślnie usunięty",
    },
  },
};
