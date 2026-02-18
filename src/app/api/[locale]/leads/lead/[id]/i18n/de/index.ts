export const translations = {
  get: {
    title: "Get Lead Details",
    description: "Retrieve detailed information about a specific lead",
    backButton: {
      label: "Zurück zu Leads",
    },
    editButton: {
      label: "Lead bearbeiten",
    },
    deleteButton: {
      label: "Lead löschen",
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
      label: "Zurück zum Lead",
    },
    deleteButton: {
      label: "Lead löschen",
    },
    submitButton: {
      label: "Lead aktualisieren",
      loadingText: "Lead wird aktualisiert...",
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
  widget: {
    loading: "Lead wird geladen...",
    notFound: "Lead nicht gefunden.",
    back: "Zurück",
    leadFallbackTitle: "Lead",
    edit: "Bearbeiten",
    delete: "Löschen",
    converted: "Konvertiert",
    quickActions: "Schnellaktionen",
    editLead: "Lead bearbeiten",
    sendTestEmail: "Test-E-Mail senden",
    viewInSearch: "In Suche anzeigen",
    userProfile: "Benutzerprofil",
    userDetail: "Benutzerdetails",
    creditHistory: "Kreditverlauf",
    campaignFunnel: "Kampagnentrichter",
    sourceLabel: "Quelle:",
    lastEmailLabel: "Letzte E-Mail:",
    campaignPerformance: "Kampagnenleistung",
    emailsSent: "E-Mails gesendet",
    opened: "Geöffnet",
    clicked: "Geklickt",
    openRate: "Öffnungsrate",
    clickRate: "Klickrate",
    clickToOpenRate: "Klick-zu-Öffnungs-Rate",
    contactDetails: "Kontaktdaten",
    country: "Land",
    language: "Sprache",
    engagement: "Engagement",
    emailsOpened: "E-Mails geöffnet",
    emailsClicked: "E-Mails geklickt",
    lastEngagement: "Letztes Engagement",
    unsubscribed: "Abgemeldet",
    conversion: "Konversion",
    signedUp: "Registriert",
    convertedAt: "Konvertiert am",
    subscriptionConfirmed: "Abonnement bestätigt",
    convertedUserId: "Konvertierte Benutzer-ID",
    activeSubscriberSince: "Aktiver Abonnent seit",
    viewUserProfile: "Benutzerprofil anzeigen",
    viewUserDetail: "Benutzerdetails anzeigen",
    notesAndMetadata: "Notizen & Metadaten",
    notes: "Notizen",
    metadata: "Metadaten",
    created: "Erstellt",
    lastUpdated: "Zuletzt aktualisiert",
    daysOld: "Tage alt",
    lastEngaged: "Zuletzt engagiert",
    ago: "vor",
    variant: "Variante:",
    copyEmail: "E-Mail",
    copyId: "ID",
    copyPhone: "Telefon",
    copyUserId: "Benutzer-ID",
    stageNotStarted: "Nicht gestartet",
    stageInitial: "Initial",
    stageFollowup1: "Nachfassen 1",
    stageFollowup2: "Nachfassen 2",
    stageFollowup3: "Nachfassen 3",
    stageNurture: "Pflegen",
    stageReactivation: "Reaktivierung",
  },
  delete: {
    title: "Lead löschen",
    description: "Lead aus dem System löschen",
    container: {
      title: "Lead löschen",
      description:
        "Sind Sie sicher, dass Sie diesen Lead dauerhaft löschen möchten?",
    },
    backButton: {
      label: "Zurück zum Lead",
    },
    submitButton: {
      label: "Lead löschen",
      loadingText: "Lead wird gelöscht...",
    },
    actions: {
      delete: "Lead löschen",
      deleting: "Lead wird gelöscht...",
    },
    id: {
      label: "Lead ID",
      description: "Eindeutige Kennung des zu löschenden Leads",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Lead-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Löschen von Leads",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Lead zu löschen",
      },
      notFound: {
        title: "Lead nicht gefunden",
        description: "Kein Lead mit der angegebenen ID gefunden",
      },
      conflict: {
        title: "Löschkonflikt",
        description:
          "Der Lead kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Löschen des Leads ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Lead gelöscht",
      description: "Der Lead wurde erfolgreich gelöscht",
    },
  },
};
