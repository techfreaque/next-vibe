import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    taskSync: "Aufgaben-Sync",
  },
  get: {
    title: "Aufgaben-Sync Einstellungen",
    description: "Aktuelle Aufgaben-Sync Einstellungen abrufen",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Sync-Einstellungen konnten nicht geladen werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Aufgabe nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Einstellungen geladen",
      description: "Aufgaben-Sync Einstellungen abgerufen",
    },
  },
  patch: {
    title: "Sync-Einstellungen aktualisieren",
    description: "Aufgaben-Sync Cron-Job aktivieren oder deaktivieren",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugriff erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Sync-Einstellungen konnten nicht aktualisiert werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Aufgabe nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
    },
    success: {
      title: "Einstellungen aktualisiert",
      description: "Aufgaben-Sync Einstellungen gespeichert",
    },
    syncEnabled: {
      label: "Auto-Sync aktiviert",
      description:
        "Wenn aktiviert, synchronisieren sich Aufgaben und Erinnerungen jede Minute mit allen verbundenen Ferninstanzen",
    },
  },
};
