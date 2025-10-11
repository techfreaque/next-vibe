import type { translations as enTranslations } from "../en";

/**
*

* Consultation Status subdomain translations for German
*/

export const translations: typeof enTranslations = {
  title: "Beratungsstatus abrufen",
  description: "Rufen Sie den aktuellen Status Ihrer Beratungsbuchung ab",
  category: "Beratung",
  tag: "Status",
  container: {
    title: "Beratungsstatus",
    description: "Sehen Sie Ihren Beratungsbuchungsstatus und Details",
  },
  response: {
    title: "Statusdetails",
    description: "Aktuelle Beratungsstatusinformationen",
    isScheduled: "Ist geplant",
    scheduledAt: "Geplant am",
    consultant: "Berater",
    status: "Status",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die Anfrageparameter sind ungültig",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Keine Beratung für Ihr Konto gefunden",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie müssen angemeldet sein, um den Beratungsstatus zu überprüfen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, diese Beratung anzuzeigen",
    },
    server: {
      title: "Serverfehler",
      description:
        "Beim Abrufen des Beratungsstatus ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Verbindung zum Server nicht möglich. Bitte überprüfen Sie Ihre Internetverbindung",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description:
        "Sie haben ungespeicherte Änderungen, die verloren gehen, wenn Sie fortfahren",
    },
    conflict: {
      title: "Konflikt",
      description: "Es besteht ein Konflikt mit dem aktuellen Beratungsstatus",
    },
    internal: {
      title: "Interner Serverfehler",
      description:
        "Bei der Verarbeitung Ihrer Anfrage ist ein interner Serverfehler aufgetreten",
    },
    database: {
      title: "Datenbankfehler",
      description:
        "Beratungsdaten konnten nicht aus der Datenbank abgerufen werden",
    },
  },
  success: {
    title: "Status abgerufen",
    description: "Ihr Beratungsstatus wurde erfolgreich abgerufen",
  },
};
