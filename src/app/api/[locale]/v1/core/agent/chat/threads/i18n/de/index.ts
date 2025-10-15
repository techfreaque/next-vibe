import { translations as threadsIdTranslations } from "../../[id]/i18n/de";
import { translations as threadsThreadIdMessagesTranslations } from "../../[threadId]/messages/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Chat-Threads auflisten",
    description:
      "Eine paginierte Liste von Chat-Threads mit Filteroptionen abrufen",
    container: {
      title: "Thread-Liste",
      description: "Chat-Threads durchsuchen und filtern",
    },
    sections: {
      pagination: {
        title: "Paginierung",
        description: "Seitennavigationseinstellungen",
      },
      filters: {
        title: "Filter",
        description: "Threads nach Kriterien filtern",
      },
    },
    page: {
      label: "Seite",
      description: "Abzurufende Seitennummer",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Threads pro Seite",
    },
    folderId: {
      label: "Ordner",
      description: "Nach Ordner-ID filtern",
    },
    status: {
      label: "Status",
      description: "Nach Thread-Status filtern",
    },
    search: {
      label: "Suche",
      description: "Threads nach Titel oder Inhalt durchsuchen",
      placeholder: "Threads durchsuchen...",
    },
    response: {
      title: "Thread-Listen-Antwort",
      description: "Paginierte Liste von Threads",
      threads: {
        thread: {
          title: "Thread",
          id: {
            content: "Thread-ID",
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
          preview: {
            content: "Vorschau",
          },
          pinned: {
            content: "Angepinnt",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
      },
      totalCount: {
        content: "Gesamtanzahl",
      },
      pageCount: {
        content: "Seitenanzahl",
      },
      page: {
        content: "Aktuelle Seite",
      },
      limit: {
        content: "Elemente pro Seite",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Threads anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Threads anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Threads gefunden",
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
      description: "Threads erfolgreich abgerufen",
    },
  },
  post: {
    title: "Chat-Thread erstellen",
    description: "Einen neuen Chat-Thread erstellen",
    form: {
      title: "Thread erstellen",
      description: "Neue Thread-Einstellungen konfigurieren",
    },
    sections: {
      thread: {
        title: "Thread-Details",
        description: "Grundlegende Thread-Informationen",
      },
    },
    threadTitle: {
      label: "Titel",
      description: "Thread-Titel",
      placeholder: "Thread-Titel eingeben...",
      default: "Neuer Chat",
    },
    folderId: {
      label: "Ordner",
      description: "Ordner für den Thread",
    },
    defaultModel: {
      label: "Standardmodell",
      description: "Standard-KI-Modell für diesen Thread",
    },
    defaultTone: {
      label: "Standardton",
      description: "Standard-Persona/Ton für diesen Thread",
    },
    systemPrompt: {
      label: "System-Prompt",
      description: "Benutzerdefinierter System-Prompt für diesen Thread",
      placeholder: "System-Prompt eingeben...",
    },
    response: {
      title: "Erstellter Thread",
      description: "Details des neu erstellten Threads",
      thread: {
        title: "Thread",
        id: {
          content: "Thread-ID",
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
        description: "Sie müssen angemeldet sein, um Threads zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Threads zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
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
        description: "Ein Thread mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Thread erfolgreich erstellt",
    },
  },
  id: threadsIdTranslations,
  threadId: {
    messages: threadsThreadIdMessagesTranslations,
  },
};
