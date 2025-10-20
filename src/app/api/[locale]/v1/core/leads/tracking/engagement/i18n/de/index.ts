import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Lead-Tracking",
  tags: {
    tracking: "Tracking",
    engagement: "Engagement",
  },
  post: {
    title: "Lead-Engagement erfassen",
    description: "Neues Engagement-Ereignis für einen Lead erfassen",
    form: {
      title: "Lead-Engagement-Formular",
      description: "Lead-Engagement-Details erfassen",
    },
    leadId: {
      label: "Lead-ID",
      description: "Eindeutige Kennung für den Lead",
      placeholder: "Lead-ID eingeben",
      helpText: "UUID des Leads, für den das Engagement erfasst werden soll",
    },
    engagementType: {
      label: "Engagement-Typ",
      description: "Art des Engagement-Ereignisses",
      placeholder: "Engagement-Typ auswählen",
      helpText: "Die Art der Interaktion oder des Engagements",
    },
    campaignId: {
      label: "Kampagnen-ID",
      description: "Zugehörige Kampagnenkennung",
      placeholder: "Kampagnen-ID eingeben",
      helpText: "Optionale Kampagne, zu der dieses Engagement gehört",
    },
    metadata: {
      label: "Metadaten",
      description: "Zusätzliche Engagement-Metadaten",
      placeholder: "Metadaten als JSON eingeben",
      helpText: "Benutzerdefinierte Daten zu diesem Engagement",
    },
    userId: {
      label: "Benutzer-ID",
      description: "Zugehörige Benutzerkennung",
      placeholder: "Benutzer-ID eingeben",
      helpText:
        "Optionale Benutzer-ID, falls Lead mit einem Benutzer verknüpft ist",
    },
    response: {
      id: "Engagement-ID",
      leadId: "Lead-ID",
      engagementType: "Engagement-Typ",
      campaignId: "Kampagnen-ID",
      metadata: "Metadaten",
      timestamp: "Zeitstempel",
      ipAddress: "IP-Adresse",
      userAgent: "User-Agent",
      createdAt: "Erstellt am",
      leadCreated: "Lead erstellt",
      relationshipEstablished: "Beziehung hergestellt",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Engagement erfasst",
      description: "Lead-Engagement erfolgreich erfasst",
    },
  },
  get: {
    title: "Lead-Klick verfolgen",
    description: "Lead-Klick verfolgen und zur Ziel-URL weiterleiten",
    form: {
      title: "Klick-Tracking-Parameter",
      description: "Parameter für Klick-Tracking und Weiterleitung",
    },
    id: {
      label: "Lead-ID",
      description: "Eindeutige Kennung für den Lead",
      placeholder: "Lead-ID eingeben",
      helpText: "Die eindeutige Kennung des Leads",
    },
    stage: {
      label: "Kampagnenstufe",
      description: "Aktuelle Stufe in der Kampagne",
      placeholder: "Stufe auswählen",
      helpText: "Die aktuelle Stufe des Leads in der Kampagne",
    },
    source: {
      label: "Quelle",
      description: "Quelle des Klicks",
      placeholder: "Quelle eingeben",
      helpText: "Die Quelle, von der der Klick kam",
    },
    url: {
      label: "Ziel-URL",
      description: "URL, zu der weitergeleitet werden soll",
      placeholder: "https://example.com",
      helpText: "Die URL, zu der der Lead weitergeleitet wird",
    },
    response: {
      success: "Erfolg",
      redirectUrl: "Weiterleitungs-URL",
      leadId: "Lead-ID",
      campaignId: "Kampagnen-ID",
      engagementRecorded: "Engagement erfasst",
      leadStatusUpdated: "Lead-Status aktualisiert",
      isLoggedIn: "Ist angemeldet",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Klick erfasst",
      description: "Lead-Klick erfolgreich erfasst und weitergeleitet",
    },
  },
  enums: {
    engagementLevel: {
      high: "Hoch",
      medium: "Mittel",
      low: "Niedrig",
      none: "Keine",
    },
  },
};
