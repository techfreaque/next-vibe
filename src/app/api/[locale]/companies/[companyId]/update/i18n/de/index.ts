import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Unternehmen",
    update: "Bearbeiten",
    management: "Verwaltung",
  },
  patch: {
    title: "Unternehmen bearbeiten",
    titleShort: "Bearbeiten",
    description:
      "Unternehmensdetails bearbeiten. Administrator- oder Inhaberrolle erforderlich.",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das zu bearbeitende Unternehmen",
    },
    name: {
      label: "Unternehmensname",
      description: "Offizieller Name des Unternehmens",
      placeholder: "Beispiel GmbH",
    },
    type: {
      label: "Unternehmenstyp",
      description: "Geschäftsmodell",
      placeholder: "Typ auswählen",
    },
    vatNumber: {
      label: "USt-IdNr.",
      description: "Umsatzsteuer-Identifikationsnummer",
      placeholder: "DE123456789",
    },
    country: {
      label: "Land",
      description: "Registrierungsland",
      placeholder: "DE",
    },
    currency: {
      label: "Standardwährung",
      description: "Hauptwährung für die Rechnungsstellung",
      placeholder: "EUR",
    },
    email: {
      label: "Unternehmens-E-Mail",
      description: "Primäre geschäftliche E-Mail-Adresse",
      placeholder: "kontakt@unternehmen.de",
    },
    phone: {
      label: "Unternehmenstelefon",
      description: "Primäre geschäftliche Telefonnummer",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Website",
      description: "URL der Unternehmenswebseite",
      placeholder: "https://unternehmen.de",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Formular prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmensdetails zu bearbeiten",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description: "Administrator- oder Inhaberrolle erforderlich",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung prüfen und erneut versuchen",
      },
      notFound: {
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Unternehmen aktualisiert",
      description: "Unternehmensdetails erfolgreich gespeichert",
    },
    response: {
      id: "Unternehmens-ID",
      name: "Unternehmensname",
    },
    widget: {
      back: "Zurück",
      successLabel: "Unternehmen aktualisiert",
      viewCompany: "Unternehmen anzeigen",
    },
  },
};
