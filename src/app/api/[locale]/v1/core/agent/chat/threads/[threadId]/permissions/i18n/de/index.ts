import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Thread-Berechtigungen abrufen",
    description:
      "Die Liste der Moderatoren für einen bestimmten Thread abrufen",
    container: {
      title: "Thread-Berechtigungen",
    },
    threadId: {
      label: "Thread-ID",
      description: "Die eindeutige Kennung des Threads",
    },
    response: {
      title: "Thread-Berechtigungen",
      moderatorIds: {
        title: "Moderator-IDs",
        description:
          "Liste der Benutzer-IDs, die diesen Thread moderieren können",
        content: "Benutzer-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Beim Abrufen der Thread-Berechtigungen ist ein Netzwerkfehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Thread-Berechtigungen anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, die Berechtigungen dieses Threads anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Thread wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Abrufen der Thread-Berechtigungen ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Es gab einen Konflikt mit dem aktuellen Zustand",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread-Berechtigungen erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Thread-Berechtigungen aktualisieren",
    description:
      "Die Liste der Moderatoren für einen bestimmten Thread aktualisieren",
    container: {
      title: "Thread-Berechtigungen aktualisieren",
    },
    threadId: {
      label: "Thread-ID",
      description: "Die eindeutige Kennung des zu aktualisierenden Threads",
    },
    permissions: {
      title: "Berechtigungsaktualisierung",
      moderatorIds: {
        label: "Moderator-IDs",
        description:
          "Liste der Benutzer-IDs, die diesen Thread moderieren können",
        item: {
          label: "Benutzer-ID",
        },
      },
    },
    response: {
      title: "Aktualisierte Berechtigungen",
      message: {
        content: "Thread-Berechtigungen erfolgreich aktualisiert",
      },
      moderatorIds: {
        title: "Aktuelle Moderatoren",
        description: "Aktualisierte Liste der Moderatoren für diesen Thread",
        content: "Benutzer-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Moderator-IDs sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Beim Aktualisieren der Thread-Berechtigungen ist ein Netzwerkfehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Thread-Berechtigungen zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, die Berechtigungen dieses Threads zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Thread wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren der Thread-Berechtigungen ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Es gab einen Konflikt mit dem aktuellen Zustand",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread-Berechtigungen erfolgreich aktualisiert",
    },
  },
};
