import { translations as messagesTranslations } from "../../messages/i18n/de";
import { translations as permissionsTranslations } from "../../permissions/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  messages: messagesTranslations,
  permissions: permissionsTranslations,
  errors: {
    not_implemented_on_native:
      "{{method}} ist auf der nativen Plattform nicht implementiert. Bitte verwenden Sie die Web-Version für diesen Vorgang.",
  },
  get: {
    title: "Chat-Thread abrufen",
    description: "Einen bestimmten Chat-Thread nach ID abrufen",
    container: {
      title: "Thread-Details",
      description: "Detaillierte Thread-Informationen anzeigen",
    },
    id: {
      label: "Thread-ID",
      description: "Eindeutige Kennung für den Thread",
      placeholder: "Thread-ID eingeben...",
    },
    response: {
      thread: {
        title: "Thread-Details",
        description: "Vollständige Thread-Informationen",
        id: {
          content: "Thread-ID",
        },
        userId: {
          content: "Benutzer-ID",
        },
        threadTitle: {
          content: "Titel",
        },
        folderId: {
          content: "Ordner-ID",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Standardmodell",
        },
        defaultTone: {
          content: "Standardton",
        },
        systemPrompt: {
          content: "System-Prompt",
        },
        pinned: {
          content: "Angepinnt",
        },
        archived: {
          content: "Archiviert",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Veröffentlicht",
        },
        preview: {
          content: "Vorschau",
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
        description: "Ungültige Thread-ID angegeben",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Threads anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Thread anzuzeigen",
      },
      notFound: {
        title: "Thread nicht gefunden",
        description: "Der angeforderte Thread konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
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
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Chat-Thread aktualisieren",
    description: "Einen bestehenden Chat-Thread aktualisieren",
    container: {
      title: "Thread aktualisieren",
      description: "Thread-Einstellungen ändern",
    },
    id: {
      label: "Thread-ID",
      description: "Eindeutige Kennung für den zu aktualisierenden Thread",
      placeholder: "Thread-ID eingeben...",
    },
    sections: {
      updates: {
        title: "Thread-Aktualisierungen",
        description: "Zu aktualisierende Felder",
      },
    },
    threadTitle: {
      label: "Titel",
      description: "Thread-Titel",
      placeholder: "Thread-Titel eingeben...",
    },
    folderId: {
      label: "Ordner",
      description: "Ordner für den Thread",
    },
    status: {
      label: "Status",
      description: "Thread-Status",
    },
    defaultModel: {
      label: "Standardmodell",
      description: "Standard-KI-Modell für diesen Thread",
    },
    defaultTone: {
      label: "Standardton",
      description: "Standard-Charakter/Ton für diesen Thread",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Benutzerdefinierter System-Prompt für diesen Thread",
    },
    pinned: {
      label: "Angepinnt",
      description: "Diesen Thread oben anheften",
    },
    archived: {
      label: "Archiviert",
      description: "Diesen Thread archivieren",
    },
    tags: {
      label: "Tags",
      description: "Tags zur Organisation",
    },
    published: {
      label: "Veröffentlicht",
      description: "Thread öffentlich über Link zugänglich machen",
    },
    response: {
      thread: {
        title: "Aktualisierter Thread",
        description: "Thread-Details nach Aktualisierung",
        id: {
          content: "Thread-ID",
        },
        userId: {
          content: "Benutzer-ID",
        },
        threadTitle: {
          content: "Titel",
        },
        folderId: {
          content: "Ordner-ID",
        },
        status: {
          content: "Status",
        },
        defaultModel: {
          content: "Standardmodell",
        },
        defaultTone: {
          content: "Standardton",
        },
        systemPrompt: {
          content: "System-Prompt",
        },
        pinned: {
          content: "Angepinnt",
        },
        archived: {
          content: "Archiviert",
        },
        tags: {
          content: "Tags",
        },
        published: {
          content: "Veröffentlicht",
        },
        preview: {
          content: "Vorschau",
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
        description: "Ungültige Thread-Daten angegeben",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Threads zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Thread zu aktualisieren",
      },
      notFound: {
        title: "Thread nicht gefunden",
        description:
          "Der zu aktualisierende Thread konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
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
        description: "Ein Konflikt ist beim Aktualisieren aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Chat-Thread löschen",
    description: "Einen Chat-Thread löschen",
    container: {
      title: "Thread löschen",
      description: "Thread dauerhaft entfernen",
    },
    id: {
      label: "Thread-ID",
      description: "Eindeutige Kennung für den zu löschenden Thread",
      placeholder: "Thread-ID eingeben...",
      helpText: "WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden",
    },
    response: {
      success: {
        content: "Löschung erfolgreich",
      },
      deletedId: {
        content: "Gelöschte Thread-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Thread-ID angegeben",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Threads zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Thread zu löschen",
      },
      notFound: {
        title: "Thread nicht gefunden",
        description: "Der zu löschende Thread konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
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
          "Thread kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread erfolgreich gelöscht",
    },
  },
};
