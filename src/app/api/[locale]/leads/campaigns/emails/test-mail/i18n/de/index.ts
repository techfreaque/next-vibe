import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Test-Mail",
    description: "Test-E-Mail mit benutzerdefinierten Lead-Daten senden",
    form: {
      title: "Test-Mail-Konfiguration",
      description: "Test-Mail-Parameter und Lead-Daten konfigurieren",
    },
    campaignType: {
      label: "Kampagnentyp",
      description: "Art der E-Mail-Kampagne",
      placeholder: "Kampagnentyp eingeben",
    },
    emailJourneyVariant: {
      label: "E-Mail-Journey-Variante",
      description: "A/B-Test-Variante für E-Mail-Journey",
      placeholder: "Journey-Variante auswählen",
    },
    emailCampaignStage: {
      label: "E-Mail-Kampagnenstufe",
      description: "Aktuelle Stufe in der E-Mail-Kampagne",
      placeholder: "Kampagnenstufe auswählen",
    },
    testEmail: {
      label: "Test-E-Mail-Adresse",
      description: "E-Mail-Adresse, an die Test-Mail gesendet wird",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Lead-Daten",
      description: "Lead-Informationen für Template-Rendering",
      businessName: {
        label: "Unternehmensname",
        description: "Name des Unternehmens",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Kontaktname",
        description: "Name der Kontaktperson",
        placeholder: "Max Mustermann",
      },
      website: {
        label: "Website",
        description: "Unternehmens-Website-URL",
        placeholder: "https://example.com",
      },
      country: {
        label: "Land",
        description: "Ländercode",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Sprache",
        description: "Bevorzugter Sprachcode",
        placeholder: "de",
      },
      status: {
        label: "Status",
        description: "Lead-Status",
        placeholder: "NEW",
      },
      source: {
        label: "Quelle",
        description: "Lead-Quelle",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Notizen",
        description: "Zusätzliche Notizen zum Lead",
        placeholder: "Zusätzliche Notizen eingeben",
      },
    },
    response: {
      title: "Test-E-Mail-Ergebnis",
      description: "Ergebnis des Sendens der Test-E-Mail",
      success: {
        content: "Erfolg",
      },
      messageId: {
        content: "Nachrichten-ID",
      },
      testEmail: {
        content: "Test-E-Mail",
      },
      subject: {
        content: "E-Mail-Betreff",
      },
      sentAt: {
        content: "Gesendet am",
      },
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
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      templateNotFound: {
        title: "Vorlage nicht gefunden",
        description: "E-Mail-Vorlage für angegebene Parameter nicht gefunden",
      },
      sendingFailed: {
        title: "Senden fehlgeschlagen",
        description: "Test-E-Mail konnte nicht gesendet werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Test-E-Mail erfolgreich gesendet",
    },
  },
};
