import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Erinnerung aktualisieren",
    description: "Aktualisiert eine vorhandene Erinnerung anhand der ID",
    container: {
      title: "Erinnerung aktualisieren",
      description: "Eine vorhandene Erinnerung ändern",
    },
    id: {
      label: "Erinnerungs-ID",
      description: "Die eindeutige Kennung der zu aktualisierenden Erinnerung",
    },
    content: {
      label: "Erinnerungsinhalt",
      description:
        "Die zu merkende Tatsache (leer lassen, um aktuellen Wert zu behalten)",
    },
    tags: {
      label: "Tags",
      description:
        "Tags zur Kategorisierung (leer lassen, um aktuellen Wert zu behalten)",
    },
    priority: {
      label: "Priorität",
      description:
        "Höhere Priorität Erinnerungen erscheinen zuerst (leer lassen, um aktuellen Wert zu behalten)",
    },
    backButton: {
      label: "Zurück",
    },
    submitButton: {
      label: "Erinnerung aktualisieren",
    },
    deleteButton: {
      label: "Erinnerung löschen",
    },
    response: {
      success: {
        content: "Erfolgreich aktualisiert",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die Anfragedaten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Erinnerungen zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Erinnerung zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Erinnerung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren der Erinnerung ist ein Fehler aufgetreten",
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
        description:
          "Beim Aktualisieren der Erinnerung ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Erinnerung erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Erinnerung löschen",
    description: "Entfernt eine Erinnerung anhand der ID",
    container: {
      title: "Erinnerung löschen",
      description: "Diese Erinnerung dauerhaft entfernen",
    },
    id: {
      label: "Erinnerungs-ID",
      description: "Die eindeutige Kennung der zu löschenden Erinnerung",
    },
    backButton: {
      label: "Zurück",
    },
    deleteButton: {
      label: "Löschen",
    },
    response: {
      success: {
        content: "Erfolgreich gelöscht",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Die Anfragedaten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Erinnerungen zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Erinnerung zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Erinnerung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Löschen der Erinnerung ist ein Fehler aufgetreten",
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
        description: "Beim Löschen der Erinnerung ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Erinnerung erfolgreich gelöscht",
    },
  },
};
