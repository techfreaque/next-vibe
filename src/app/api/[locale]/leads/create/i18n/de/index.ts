import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Lead erstellen",
    description: "Einen neuen Lead im System erstellen",
    form: {
      title: "Neues Lead-Formular",
      description: "Lead-Informationen eingeben um einen neuen Lead zu erstellen",
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
      preview: "Willkommen bei unserem Service - lassen Sie uns starten",
      greeting:
        "Willkommen bei {{companyName}}, {{businessName}}! Wir freuen uns darauf, Ihrem Unternehmen beim Wachstum zu helfen.",
      defaultName: "dort",
      introduction:
        "Vielen Dank für Ihr Interesse an unseren Dienstleistungen. Wir haben Ihre Informationen erhalten und unser Team ist bereit, Ihnen bei der Erreichung Ihrer Geschäftsziele zu helfen.",
      nextSteps: {
        title: "Was passiert als Nächstes?",
        step1Number: "1.",
        step1: "Unser Team wird Ihr Geschäftsprofil und Ihre Ziele überprüfen",
        step2Number: "2.",
        step2: "Sie erhalten innerhalb von 24 Stunden einen personalisierten Beratungsvorschlag",
        step3Number: "3.",
        step3:
          "Wir vereinbaren einen Termin, um Ihre spezifischen Bedürfnisse und Ziele zu besprechen",
      },
      cta: {
        getStarted: "Beratung planen",
      },
      support:
        "Haben Sie Fragen? Antworten Sie auf diese E-Mail oder kontaktieren Sie uns unter {{supportEmail}}",
      error: {
        noEmail: "Willkommens-E-Mail kann nicht gesendet werden - keine E-Mail-Adresse angegeben",
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
          noData: "Admin-Benachrichtigung kann nicht gesendet werden - keine Lead-Daten angegeben",
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
};
