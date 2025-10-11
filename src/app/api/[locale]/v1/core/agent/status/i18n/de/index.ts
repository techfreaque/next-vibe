import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "E-Mail Agent Status",
    description: "Verarbeitungsstatus für E-Mails abrufen",
    form: {
      title: "Status-Abfrageparameter",
      description: "E-Mail Agent Verarbeitungsstatus filtern und sortieren",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für Paginierung",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Elemente pro Seite",
    },
    emailId: {
      label: "E-Mail ID",
      description: "Nach spezifischer E-Mail ID filtern",
    },
    accountId: {
      label: "Konto ID",
      description: "Nach E-Mail Konto ID filtern",
    },
    status: {
      label: "Status",
      description: "Nach Verarbeitungsstatus filtern",
    },
    actionType: {
      label: "Aktionstyp",
      description: "Nach Aktionstyp filtern",
    },
    priority: {
      label: "Priorität",
      description: "Nach Verarbeitungspriorität filtern",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Felder zum Sortieren",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Richtung der Sortierreihenfolge",
    },
    dateFrom: {
      label: "Datum von",
      description: "Ab diesem Datum filtern",
    },
    dateTo: {
      label: "Datum bis",
      description: "Bis zu diesem Datum filtern",
    },
    response: {
      title: "Status Antwort",
      description: "E-Mail Agent Verarbeitungsstatus Ergebnisse",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, auf den Agent-Status zuzugreifen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Parameter bereitgestellt",
      },
      server: {
        title: "Server-Fehler",
        description: "Agent-Status konnte nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerk-Fehler",
        description: "Netzwerkkommunikation fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Angeforderte Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Agent-Status erfolgreich abgerufen",
    },
  },
  post: {
    title: "E-Mail Agent Status (CLI)",
    description: "CLI-Version zum Abrufen des Verarbeitungsstatus",
    form: {
      title: "Status-Abfrageparameter",
      description: "Parameter für Statusabruf konfigurieren",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für Paginierung",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Elemente pro Seite",
    },
    response: {
      title: "Status Antwort",
      description: "E-Mail Agent Verarbeitungsstatus Ergebnisse",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, auf den Agent-Status zuzugreifen",
      },
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Parameter bereitgestellt",
      },
      server: {
        title: "Server-Fehler",
        description: "Agent-Status konnte nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerk-Fehler",
        description: "Netzwerkkommunikation fehlgeschlagen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Angeforderte Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Agent-Status erfolgreich abgerufen",
    },
  },
};
