import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Import-Jobs Status",
    description: "CSV-Import-Jobs auflisten und überwachen",
    form: {
      title: "Job-Filter",
      description: "Import-Jobs nach Status und Paginierung filtern",
    },
    filters: {
      title: "Filter",
      description: "Filteroptionen für Import-Jobs",
    },
    status: {
      label: "Job-Status",
      description: "Nach Job-Status filtern",
      placeholder: "Status auswählen",
    },
    limit: {
      label: "Ergebnisse pro Seite",
      description: "Anzahl der zurückzugebenden Jobs",
      placeholder: "50",
    },
    offset: {
      label: "Seiten-Offset",
      description: "Anzahl der zu überspringenden Jobs",
      placeholder: "0",
    },
    response: {
      title: "Import-Jobs",
      description: "Liste der Import-Jobs mit ihrem aktuellen Status",
      items: {
        title: "Jobs-Liste",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Filterparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Import-Jobs anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Import-Jobs verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Import-Jobs gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Abrufen der Jobs",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Jobs",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Jobs abgerufen",
      description: "Import-Jobs-Liste erfolgreich abgerufen",
    },
  },
};
