import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Unternehmen",
    create: "Erstellen",
  },
  post: {
    title: "Unternehmen erstellen",
    titleShort: "Erstellen",
    description:
      "Neues Unternehmen anlegen. Sie werden automatisch zum Inhaber.",
    name: {
      label: "Unternehmensname",
      description: "Offizieller Name des Unternehmens",
      placeholder: "Beispiel GmbH",
    },
    type: {
      label: "Unternehmenstyp",
      description: "Geschäftsmodell — B2B, B2C oder Einzelperson",
      placeholder: "Typ auswählen",
    },
    vatNumber: {
      label: "USt-IdNr.",
      description: "Umsatzsteuer-Identifikationsnummer",
      placeholder: "DE123456789",
    },
    country: {
      label: "Land",
      description: "Land, in dem das Unternehmen registriert ist",
      placeholder: "Land auswählen",
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
        description: "Formularfelder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um ein Unternehmen zu erstellen",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description:
          "Sie haben keine Berechtigung ein Unternehmen zu erstellen",
      },
      conflict: {
        title: "Bereits vorhanden",
        description: "Ein Unternehmen mit diesem Namen existiert bereits",
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
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Unternehmen erstellt",
      description: "Ihr Unternehmen ist bereit. Fügen Sie Mitglieder hinzu.",
    },
    response: {
      id: "Unternehmens-ID",
      name: "Unternehmensname",
    },
    widget: {
      viewCompany: "Unternehmen anzeigen",
      back: "Zurück zur Liste",
    },
  },
};
