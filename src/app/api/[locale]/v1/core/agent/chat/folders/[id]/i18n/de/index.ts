import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Ordner abrufen",
    description: "Einen bestimmten Ordner nach ID abrufen",
    container: {
      title: "Ordnerdetails",
      description: "Ordnerinformationen anzeigen",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des Ordners",
    },
    response: {
      title: "Ordner",
      description: "Die angeforderten Ordnerdetails",
      folder: {
        title: "Ordner",
        id: {
          content: "ID",
        },
        userId: {
          content: "Benutzer-ID",
        },
        name: {
          content: "Name",
        },
        icon: {
          content: "Symbol",
        },
        color: {
          content: "Farbe",
        },
        parentId: {
          content: "Übergeordneter Ordner",
        },
        expanded: {
          content: "Erweitert",
        },
        sortOrder: {
          content: "Sortierreihenfolge",
        },
        metadata: {
          content: "Metadaten",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Ordner-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Ordner anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen des Ordners ist ein Fehler aufgetreten",
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
        description:
          "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Ordner aktualisieren",
    description: "Einen vorhandenen Ordner aktualisieren",
    container: {
      title: "Ordner aktualisieren",
      description: "Ordnereigenschaften ändern",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu aktualisierenden Ordners",
    },
    sections: {
      updates: {
        title: "Ordneraktualisierungen",
        description: "Zu aktualisierende Felder",
      },
    },
    name: {
      label: "Name",
      description: "Der Ordnername",
    },
    icon: {
      label: "Symbol",
      description: "Lucide- oder Simple Icons-Symbolname",
    },
    color: {
      label: "Farbe",
      description: "Hex-Farbcode zur visuellen Unterscheidung",
    },
    parentId: {
      label: "Übergeordneter Ordner",
      description:
        "Ordner zu einem anderen übergeordneten Ordner verschieben (null für Wurzel)",
    },
    expanded: {
      label: "Erweitert",
      description: "Ob der Ordner in der Benutzeroberfläche erweitert ist",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Reihenfolge zum Sortieren von Ordnern",
    },
    metadata: {
      label: "Metadaten",
      description: "Zusätzliche Ordnermetadaten",
    },
    response: {
      title: "Aktualisierter Ordner",
      description: "Die aktualisierten Ordnerdetails",
      folder: {
        title: "Ordner",
        id: {
          content: "ID",
        },
        userId: {
          content: "Benutzer-ID",
        },
        name: {
          content: "Name",
        },
        icon: {
          content: "Symbol",
        },
        color: {
          content: "Farbe",
        },
        parentId: {
          content: "Übergeordneter Ordner",
        },
        expanded: {
          content: "Erweitert",
        },
        sortOrder: {
          content: "Sortierreihenfolge",
        },
        metadata: {
          content: "Metadaten",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
        circularReference:
          "Ordner kann nicht als eigener übergeordneter Ordner festgelegt werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Ordner zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Beim Aktualisieren des Ordners ist ein Fehler aufgetreten",
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
        description: "Ein Ordner mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Ordner löschen",
    description: "Einen Ordner und alle seine Inhalte löschen",
    container: {
      title: "Ordner löschen",
      description: "Ordner dauerhaft entfernen",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu löschenden Ordners",
    },
    response: {
      title: "Löschergebnis",
      description: "Bestätigung der Ordnerlöschung",
      success: {
        content: "Erfolg",
      },
      deletedFolderId: {
        content: "Gelöschte Ordner-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Ordner-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Ordner zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Löschen des Ordners ist ein Fehler aufgetreten",
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
        description: "Ordner mit aktiven Inhalten kann nicht gelöscht werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich gelöscht",
    },
  },
} as const;
