import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Teilen-Links abrufen",
    description: "Alle Teilen-Links für einen Thread abrufen",
    container: {
      title: "Teilen-Links",
      description: "Alle Teilen-Links für diesen Thread",
    },
    response: {
      shareLink: {
        title: "Teilen-Link",
        id: {
          content: "Link-ID",
        },
        token: {
          content: "Teilen-Token",
        },
        label: {
          content: "Bezeichnung",
        },
        allowPosting: {
          content: "Posten erlauben",
        },
        requireAuth: {
          content: "Authentifizierung erforderlich",
        },
        active: {
          content: "Aktiv",
        },
        accessCount: {
          content: "Zugriffszähler",
        },
        lastAccessedAt: {
          content: "Letzter Zugriff",
        },
        createdAt: {
          content: "Erstellt",
        },
        editAction: {
          text: "Bearbeiten",
        },
        deleteAction: {
          text: "Widerrufen",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Teilen-Links anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Teilen-Links anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread oder Teilen-Link nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Teilen-Links konnten nicht abgerufen werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Diese Ressource wurde geändert",
      },
    },
    success: {
      title: "Erfolg",
      description: "Teilen-Links erfolgreich abgerufen",
    },
  },
  post: {
    title: "Teilen-Link erstellen",
    description: "Neuen Teilen-Link für einen Thread erstellen",
    container: {
      title: "Neuer Teilen-Link",
      description: "Konfigurieren Sie Ihren neuen Teilen-Link",
    },
    label: {
      label: "Bezeichnung",
      description: "Optionale Bezeichnung zur Identifizierung dieses Links",
    },
    allowPosting: {
      label: "Posten erlauben",
      description:
        "Empfängern erlauben, Nachrichten in diesem Thread zu posten",
    },
    requireAuth: {
      label: "Authentifizierung erforderlich",
      description:
        "Benutzer müssen sich anmelden, um auf diesen Link zuzugreifen",
    },
    response: {
      id: {
        content: "Link-ID",
      },
      token: {
        content: "Teilen-Token",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Teilen-Link-Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Teilen-Links zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Nur Threads im Ordner 'Geteilt' können über Links geteilt werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Teilen-Link konnte nicht erstellt werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Diese Ressource wurde geändert",
      },
    },
    success: {
      title: "Erfolg",
      description: "Teilen-Link erfolgreich erstellt",
    },
  },
  patch: {
    title: "Teilen-Link aktualisieren",
    description: "Existierenden Teilen-Link aktualisieren",
    container: {
      title: "Teilen-Link aktualisieren",
      description: "Teilen-Link-Einstellungen ändern",
    },
    linkId: {
      label: "Link-ID",
      description: "ID des zu aktualisierenden Links",
    },
    label: {
      label: "Bezeichnung",
      description: "Optionale Bezeichnung zur Identifizierung dieses Links",
    },
    allowPosting: {
      label: "Posten erlauben",
      description:
        "Empfängern erlauben, Nachrichten in diesem Thread zu posten",
    },
    requireAuth: {
      label: "Authentifizierung erforderlich",
      description:
        "Benutzer müssen sich anmelden, um auf diesen Link zuzugreifen",
    },
    deleteAction: {
      text: "Link widerrufen",
    },
    response: {
      id: {
        content: "Link-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Aktualisierungsparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Teilen-Links zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Link zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Teilen-Link nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Teilen-Link konnte nicht aktualisiert werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Diese Ressource wurde geändert",
      },
    },
    success: {
      title: "Erfolg",
      description: "Teilen-Link erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Teilen-Link widerrufen",
    description: "Aktiven Teilen-Link widerrufen",
    container: {
      title: "Teilen-Link widerrufen",
      description: "Dies wird den Link dauerhaft deaktivieren",
    },
    linkId: {
      label: "Link-ID",
      description: "ID des zu widerrufenden Links",
    },
    response: {
      id: {
        content: "Link-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Link-ID",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Teilen-Links zu widerrufen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Link zu widerrufen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Teilen-Link nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Teilen-Link konnte nicht widerrufen werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Diese Ressource wurde geändert",
      },
    },
    success: {
      title: "Erfolg",
      description: "Teilen-Link erfolgreich widerrufen",
    },
  },
};
