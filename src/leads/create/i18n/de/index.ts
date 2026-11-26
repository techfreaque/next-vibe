import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    create: "Erstellen",
  },

  enums: {
    leadSource: {
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
    },
  },
  widget: {
    headerLeadCreated: "Lead erstellt",
    headerCreateLead: "Lead erstellen",
    subheaderFillDetails: "Füllen Sie die Details unten aus",
    fallbackLeadName: "Lead",
    buttonCopyId: "ID kopieren",
    buttonViewLead: "Lead anzeigen",
    buttonEditLead: "Lead bearbeiten",
    buttonBackToList: "Zurück zur Liste",
  },
  post: {
    title: "Lead erstellen",
    titleShort: "Neuer Lead",
    description: "Einen neuen Lead im System erstellen",
    backButton: {
      label: "Zurück zu Leads",
    },
    submitButton: {
      label: "Lead erstellen",
      loadingText: "Lead wird erstellt...",
    },
    form: {
      title: "Neues Lead-Formular",
      description:
        "Lead-Informationen eingeben um einen neuen Lead zu erstellen",
    },
    validation: {
      country: "Wählen Sie ein Land.",
      language: "Wählen Sie eine Sprache.",
      source: "Wählen Sie, woher der Lead kommt.",
    },
    contactInfo: {
      title: "Kontaktinformationen",
      description: "Primäre Kontaktdaten für den Lead",
    },
    email: {
      label: "E-Mail-Adresse",
      description: "Primäre E-Mail-Adresse für die Kommunikation",
      placeholder: "john@beispiel.com",
    },
    businessName: {
      label: "Firmenname",
      description: "Name des Unternehmens oder Geschäfts",
      placeholder: "Beispiel GmbH",
    },
    phone: {
      label: "Telefonnummer",
      description: "Kontakt-Telefonnummer mit Ländercode",
      placeholder: "+491234567890",
    },
    website: {
      label: "Webseite",
      description: "Firmen-Website-URL",
      placeholder: "https://beispiel.de",
    },
    locationPreferences: {
      title: "Standort & Präferenzen",
      description: "Geografische und Sprachpräferenzen",
    },
    country: {
      label: "Land",
      description: "Geschäftsstandort oder Zielmarkt",
      placeholder: "Land auswählen",
    },
    language: {
      label: "Sprache",
      description: "Bevorzugte Kommunikationssprache",
      placeholder: "Sprache auswählen",
    },
    leadDetails: {
      title: "Lead-Details",
      description: "Zusätzliche Informationen über den Lead",
    },
    source: {
      label: "Lead-Quelle",
      description: "Wie der Lead akquiriert wurde",
      placeholder: "Quelle auswählen",
    },
    notes: {
      label: "Notizen",
      description: "Zusätzliche Notizen oder Kommentare",
      placeholder: "Zusätzliche Informationen eingeben...",
    },
    response: {
      title: "Erstellter Lead",
      description: "Details des neu erstellten Leads",
      summary: {
        title: "Lead-Zusammenfassung",
        id: "Lead-ID",
        businessName: "Firmenname",
        email: "E-Mail-Adresse",
        status: "Lead-Status",
      },
      contactDetails: {
        title: "Kontaktdetails",
        phone: "Telefonnummer",
        website: "Website-URL",
        country: "Land",
        language: "Sprache",
      },
      trackingInfo: {
        title: "Tracking-Informationen",
        source: "Lead-Quelle",
        emailsSent: "E-Mail-Anzahl",
        currentCampaignStage: "Kampagnenstufe",
      },
      metadata: {
        title: "Metadaten",
        notes: "Notizen",
        createdAt: "Erstellungsdatum",
        updatedAt: "Zuletzt aktualisiert",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Leads zu erstellen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Lead-Informationen angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Erstellen des Leads",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Erstellen des Leads",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Erstellen des Leads",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Lead-Erstellung verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benötigte Ressource für Lead-Erstellung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Lead existiert bereits oder Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen im Lead-Formular",
      },
    },
    success: {
      title: "Lead erstellt",
      description: "Lead erfolgreich erstellt",
    },
  },
  email: {
    welcome: {
      subject: "Willkommen bei {{companyName}}",
      title: "Willkommen bei {{companyName}}, {{businessName}}!",
      preview: "Willkommen. So legen Sie los.",
      greeting:
        "Willkommen bei {{companyName}}, {{businessName}}! Schön, dass Sie da sind.",
      defaultName: "dort",
      introduction:
        "Danke für Ihr Interesse. Ihre Angaben sind angekommen, und ein Mensch liest sie.",
      nextSteps: {
        title: "Was passiert als Nächstes?",
        step1Number: "1.",
        step1: "Sofort loslegen. Keine Einrichtung, keine Karte.",
        step2Number: "2.",
        step2:
          "Fragen? Antworten Sie einfach auf diese E-Mail. Ein Mensch liest sie.",
        step3Number: "3.",
        step3: "Wir antworten, so schnell wir können.",
      },
      cta: {
        getStarted: "Jetzt loschatten",
      },
      support:
        "Haben Sie Fragen? Antworten Sie auf diese E-Mail oder kontaktieren Sie uns unter {{supportEmail}}",
      error: {
        noEmail:
          "Willkommens-E-Mail kann nicht gesendet werden - keine E-Mail-Adresse angegeben",
      },
    },
    admin: {
      newLead: {
        subject: "Neuer Lead: {{businessName}}",
        title: "Neuer Lead erstellt",
        preview: "Neuer Lead von {{businessName}} benötigt Nachfassen",
        message:
          "Ein neuer Lead wurde im System von {{businessName}} erstellt und benötigt Ihre Aufmerksamkeit.",
        leadDetails: "Lead-Details",
        businessName: "Firmenname",
        email: "E-Mail",
        phone: "Telefon",
        website: "Webseite",
        source: "Quelle",
        status: "Status",
        notes: "Notizen",
        notProvided: "Nicht angegeben",
        viewLead: "Lead-Details ansehen",
        viewAllLeads: "Alle Leads ansehen",
        error: {
          noData:
            "Admin-Benachrichtigung kann nicht gesendet werden - keine Lead-Daten angegeben",
        },
        defaultName: "Neuer Lead",
      },
    },
    error: {
      general: {
        internal_server_error: "Ein interner Serverfehler ist aufgetreten",
      },
    },
  },
  countries: {
    ...regionalCountryNames("de"),
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
    fr: "Frankreich",
    us: "Vereinigte Staaten",
  },
  languages: {
    it: "Italienisch",
    es: "Spanisch",
    sk: "Slowakisch",
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
    fr: "Französisch",
  },
};
