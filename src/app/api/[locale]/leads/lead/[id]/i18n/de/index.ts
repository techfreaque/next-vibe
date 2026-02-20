export const translations = {
  get: {
    title: "Lead-Details abrufen",
    description: "Detaillierte Informationen zu einem bestimmten Lead laden",
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
      label: "Lead-ID",
      description: "Eindeutige Kennung des Leads",
    },
    form: {
      title: "Lead-Details Anfrage",
      description: "Anfrageparameter für Lead-Informationen",
    },
    response: {
      title: "Lead-Informationen",
      description: "Vollständige Lead-Details und Verlauf",
      basicInfo: {
        title: "Grundlegende Informationen",
        description: "Kern-Lead-Identifikation und Status",
      },
      id: {
        content: "Lead-ID",
      },
      email: {
        content: "E-Mail-Adresse",
      },
      businessName: {
        content: "Firmenname",
      },
      contactName: {
        content: "Kontaktname",
      },
      status: {
        content: "Lead-Status",
      },
      contactDetails: {
        title: "Kontaktdaten",
        description: "Kontaktinformationen und Präferenzen",
      },
      phone: {
        content: "Telefonnummer",
      },
      website: {
        content: "Website-URL",
      },
      country: {
        content: "Land",
      },
      language: {
        content: "Sprache",
      },
      campaignTracking: {
        title: "Kampagnenverfolgung",
        description: "E-Mail-Kampagnen- und Tracking-Informationen",
      },
      source: {
        content: "Lead-Quelle",
      },
      currentCampaignStage: {
        content: "Aktuelle Kampagnenphase",
      },
      emailJourneyVariant: {
        content: "E-Mail-Journey-Variante",
      },
      emailsSent: {
        content: "E-Mails gesendet",
      },
      lastEmailSentAt: {
        content: "Letzte E-Mail gesendet",
      },
      engagement: {
        title: "Engagement-Metriken",
        description: "E-Mail-Engagement- und Interaktionsdaten",
      },
      emailsOpened: {
        content: "E-Mails geöffnet",
      },
      emailsClicked: {
        content: "E-Mails geklickt",
      },
      lastEngagementAt: {
        content: "Letztes Engagement",
      },
      unsubscribedAt: {
        content: "Abgemeldet am",
      },
      conversion: {
        title: "Konversionsverfolgung",
        description: "Lead-Konversion und Meilensteinverfolgung",
      },
      convertedUserId: {
        content: "Konvertierte Benutzer-ID",
      },
      convertedAt: {
        content: "Konvertiert am",
      },
      signedUpAt: {
        content: "Registriert am",
      },
      subscriptionConfirmedAt: {
        content: "Abonnement bestätigt am",
      },
      metadata: {
        title: "Zusätzliche Informationen",
        description: "Notizen und Metadaten",
        content: "Metadaten",
      },
      notes: {
        content: "Notizen",
      },
      createdAt: {
        content: "Erstellt am",
      },
      updatedAt: {
        content: "Aktualisiert am",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Lead-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich zum Zugriff auf Lead-Details",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Lead anzuzeigen",
      },
      notFound: {
        title: "Lead nicht gefunden",
        description: "Kein Lead mit der angegebenen ID gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Lead-Details ist ein Fehler aufgetreten",
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
      conflict: {
        title: "Datenkonflikt",
        description: "Die Lead-Daten wurden geändert",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Lead-Details erfolgreich geladen",
    },
  },
  patch: {
    title: "Lead aktualisieren",
    description: "Lead-Informationen und Status aktualisieren",
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
      label: "Lead-ID",
      description: "Eindeutige Kennung des zu aktualisierenden Leads",
    },
    form: {
      title: "Lead aktualisieren",
      description: "Lead-Informationen bearbeiten",
    },
    updates: {
      title: "Lead-Aktualisierungen",
      description: "Zu aktualisierende Felder",
    },
    basicInfo: {
      title: "Grundlegende Informationen",
      description: "Kern-Lead-Informationen aktualisieren",
    },
    email: {
      label: "E-Mail-Adresse",
      description: "E-Mail-Adresse des Leads",
      placeholder: "email@example.com",
    },
    businessName: {
      label: "Firmenname",
      description: "Name des Unternehmens",
      placeholder: "Muster GmbH",
    },
    contactName: {
      label: "Kontaktname",
      description: "Hauptansprechpartner",
      placeholder: "Max Mustermann",
    },
    status: {
      label: "Lead-Status",
      description: "Aktueller Status des Leads",
      placeholder: "Status wählen",
    },
    contactDetails: {
      title: "Kontaktdaten",
      description: "Kontaktinformationen aktualisieren",
    },
    phone: {
      label: "Telefonnummer",
      description: "Kontakttelefonnummer",
      placeholder: "+491234567890",
    },
    website: {
      label: "Website",
      description: "Unternehmens-Website-URL",
      placeholder: "https://example.de",
    },
    country: {
      label: "Land",
      description: "Land des Unternehmens",
      placeholder: "Land wählen",
    },
    language: {
      label: "Sprache",
      description: "Bevorzugte Sprache",
      placeholder: "Sprache wählen",
    },
    campaignManagement: {
      title: "Kampagnenverwaltung",
      description: "Kampagneneinstellungen verwalten",
    },
    source: {
      label: "Lead-Quelle",
      description: "Herkunft des Leads",
      placeholder: "Quelle wählen",
    },
    currentCampaignStage: {
      label: "Kampagnenphase",
      description: "Aktuelle E-Mail-Kampagnenphase",
      placeholder: "Phase wählen",
    },
    additionalDetails: {
      title: "Weitere Details",
      description: "Notizen und Metadaten",
    },
    notes: {
      label: "Notizen",
      description: "Interne Notizen zum Lead",
      placeholder: "Notizen hier eingeben",
    },
    metadata: {
      label: "Metadaten",
      description: "Zusätzliche Metadaten (JSON)",
      placeholder: '{"key": "value"}',
    },
    convertedUserId: {
      label: "Konvertierte Benutzer-ID",
      description: "ID des konvertierten Benutzerkontos",
      placeholder: "Benutzer-ID",
    },
    subscriptionConfirmedAt: {
      label: "Abonnement bestätigt am",
      description: "Datum der Abonnementbestätigung",
      placeholder: "Datum wählen",
    },
    response: {
      title: "Aktualisierter Lead",
      description: "Aktualisierte Lead-Informationen",
      basicInfo: {
        title: "Grundlegende Informationen",
        description: "Aktualisierte Kern-Lead-Informationen",
      },
      id: {
        content: "Lead-ID",
      },
      email: {
        content: "E-Mail-Adresse",
      },
      businessName: {
        content: "Firmenname",
      },
      contactName: {
        content: "Kontaktname",
      },
      status: {
        content: "Lead-Status",
      },
      contactDetails: {
        title: "Kontaktdaten",
        description: "Aktualisierte Kontaktinformationen",
      },
      phone: {
        content: "Telefonnummer",
      },
      website: {
        content: "Website-URL",
      },
      country: {
        content: "Land",
      },
      language: {
        content: "Sprache",
      },
      campaignTracking: {
        title: "Kampagnenverfolgung",
        description: "Aktualisierte Kampagneninformationen",
      },
      source: {
        content: "Lead-Quelle",
      },
      currentCampaignStage: {
        content: "Aktuelle Kampagnenphase",
      },
      emailJourneyVariant: {
        content: "E-Mail-Journey-Variante",
      },
      emailsSent: {
        content: "E-Mails gesendet",
      },
      lastEmailSentAt: {
        content: "Letzte E-Mail gesendet",
      },
      engagement: {
        title: "Engagement-Metriken",
        description: "E-Mail-Engagement-Daten",
      },
      emailsOpened: {
        content: "E-Mails geöffnet",
      },
      emailsClicked: {
        content: "E-Mails geklickt",
      },
      lastEngagementAt: {
        content: "Letztes Engagement",
      },
      unsubscribedAt: {
        content: "Abgemeldet am",
      },
      conversion: {
        title: "Konversionsverfolgung",
        description: "Konversionsmeilensteinverfolgung",
      },
      convertedUserId: {
        content: "Konvertierte Benutzer-ID",
      },
      convertedAt: {
        content: "Konvertiert am",
      },
      signedUpAt: {
        content: "Registriert am",
      },
      subscriptionConfirmedAt: {
        content: "Abonnement bestätigt am",
      },
      metadata: {
        title: "Zusätzliche Informationen",
        description: "Notizen und Metadaten",
        content: "Metadaten",
      },
      notes: {
        content: "Notizen",
      },
      createdAt: {
        content: "Erstellt am",
      },
      updatedAt: {
        content: "Aktualisiert am",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich zum Aktualisieren von Leads",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung, diesen Lead zu aktualisieren",
      },
      notFound: {
        title: "Lead nicht gefunden",
        description: "Kein Lead mit der angegebenen ID gefunden",
      },
      conflict: {
        title: "Aktualisierungskonflikt",
        description: "Der Lead wurde von einem anderen Benutzer geändert",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Aktualisieren des Leads ist ein Fehler aufgetreten",
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
      title: "Erfolgreich",
      description: "Lead erfolgreich aktualisiert",
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
