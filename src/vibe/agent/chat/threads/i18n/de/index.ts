import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "Threads",
  },
  enums: {
    threadStatus: {
      active: "Aktiv",
      archived: "Archiviert",
      deleted: "Gelöscht",
    },
  },
  errors: {
    count_failed: "Fehler beim Abrufen der Konversationsanzahl: {{error}}",
  },
  get: {
    title: "Threads",
    titleShort: "Threads",
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
    rootFolderId: {
      label: "Stammordner",
      description:
        "Nach Stammordner filtern (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Unterordner",
      description: "Nach Unterordner-ID filtern (optional)",
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
    isPinned: {
      label: "Nur Angepinnte",
      description: "Nur angepinnte Threads anzeigen",
    },
    dateFrom: {
      label: "Datum Von",
      description: "Threads nach diesem Datum filtern",
    },
    dateTo: {
      label: "Datum Bis",
      description: "Threads vor diesem Datum filtern",
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
          rootFolderId: {
            content: "Hauptordner",
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
          archived: {
            content: "Archiviert",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
          canEdit: {
            content: "Kann bearbeiten",
          },
          canPost: {
            content: "Kann posten",
          },
          canModerate: {
            content: "Kann moderieren",
          },
          canDelete: {
            content: "Kann löschen",
          },
          streamingState: {
            content: "Streaming-Status",
          },
          canManagePermissions: {
            content: "Kann Berechtigungen verwalten",
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
        detail: "Serverfehler: {{error}}",
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
    title: "Neuer Thread",
    titleShort: "Neuer Thread",
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
    id: {
      label: "Thread-ID",
      description: "Client-generierte Thread-ID",
    },
    threadTitle: {
      label: "Titel",
      description: "Thread-Titel",
      placeholder: "Thread-Titel eingeben...",
      default: "Neuer Chat",
    },
    rootFolderId: {
      label: "Stammordner",
      description: "Stammordner (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "Unterordner",
      description: "Unterordner für den Thread (optional)",
    },
    defaultModel: {
      label: "Standardmodell",
      description: "Standard-KI-Modell für diesen Thread",
    },
    defaultTone: {
      label: "Standardton",
      description: "Standard-Skill/Ton für diesen Thread",
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
        rootFolderId: {
          content: "Hauptordner",
        },
        subFolderId: {
          content: "Unterordner-ID",
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
        canEdit: {
          content: "Kann bearbeiten",
        },
        canPost: {
          content: "Kann posten",
        },
        canModerate: {
          content: "Kann moderieren",
        },
        canDelete: {
          content: "Kann löschen",
        },
        canManagePermissions: {
          content: "Kann Berechtigungen verwalten",
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
        incognitoNotAllowed:
          "Inkognito-Threads können nicht auf dem Server erstellt werden",
        cannotCreateHere: "Thread kann an diesem Ort nicht erstellt werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
        folderNotFound: "Ordner nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
        detail: "Serverfehler: {{error}}",
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
  widget: {
    common: {
      noChatsFound: "Keine Chats gefunden",
      delete: "Löschen",
      cancel: "Abbrechen",
    },
    actions: {
      menu: "Thread-Aktionen",
      rename: "Umbenennen",
      unpin: "Entpinnen",
      pin: "Oben anheften",
      unarchive: "Aus Archiv holen",
      archive: "Archivieren",
      manageSharing: "Freigabe verwalten",
      moveToFolder: "In Ordner verschieben",
      unfiled: "Nicht abgelegt",
    },
    folderList: {
      managePermissions: "Berechtigungen verwalten",
      today: "Heute",
      lastWeek: "Letzte 7 Tage",
      lastMonth: "Letzte 30 Tage",
      older: "Älter",
    },
    threadList: {
      deleteDialog: {
        title: "Thread löschen",
        description:
          'Möchten Sie "{{title}}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden und alle Nachrichten werden dauerhaft gelöscht.',
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "Einfach erklärt",
          prompt: "Erklär mir Inflation, als wäre ich 12. Kurz und konkret.",
        },
        search: {
          label: "Im Web suchen",
          prompt:
            "Was waren die größten Tech-News dieser Woche? Such danach und nenn mir Quellen.",
        },
        image: {
          label: "Bild erstellen",
          prompt:
            "Erstelle ein Bild einer gemütlichen Hütte im Schneesturm bei Nacht, warmes Licht in den Fenstern.",
        },
        honest: {
          label: "Klartext",
          prompt:
            "Gib mir die stärksten Argumente für und gegen Krypto. Ohne Ausflüchte, ohne Disclaimer.",
        },
      },
      takeTour: "Kurze Tour starten (1 Minute)",
      backgroundTitle: "Deine KI-Agenten arbeiten",
      backgroundDescription:
        "Subagenten und autonome Hintergrundagenten erledigen Aufgaben hier, während du dich um anderes kümmern kannst. Ergebnisse landen automatisch hier.",
    },
    emptyState: {
      changeCompanion: "Begleiter oder Modell wechseln. Aktuell: {{name}}",
      folder: {
        private: { label: "Privat", note: "In deinem Konto, auf jedem Gerät." },
        incognito: {
          label: "Inkognito",
          note: "Nur in diesem Browser gespeichert.",
        },
        shared: { label: "Geteilt", note: "Lesbar für alle mit dem Link." },
        public: { label: "Öffentlich", note: "Für alle sichtbar." },
        cron: {
          label: "Hintergrund",
          note: "Hier arbeiten Agenten selbstständig.",
        },
        remote: {
          label: "Remote",
          note: "Läuft auf deiner verbundenen Instanz.",
        },
      },
      use: {
        everyday: {
          good: "Recherche, Texte und tägliche Aufgaben",
          weak: "Bei Politik vorsichtig",
        },
        politics: {
          good: "Klare Antworten zu Politik und Tabuthemen",
          weak: "Nur Text, schwächer bei komplexen Aufgaben",
        },
        security: {
          good: "Offensive und defensive Security-Arbeit",
          weak: "Bei Politik vorsichtig",
        },
        writing: {
          good: "Sorgfältige Texte, Code und Analysen",
          weak: "Weicht bei heiklen Themen aus oder blockt",
        },
        images: {
          good: "Liest Screenshots, Fotos und Videos",
          weak: "Vorsichtig bei heiklen Themen",
        },
        classic: {
          good: "Zuverlässiger Allrounder für Code und Planung",
          weak: "Vorsichtig bei heiklen Themen",
        },
        bold: {
          good: "Direkte Antworten mit Meinung",
          weak: "Nicht die Wahl für Politik",
        },
        general: {
          good: "Allgemeine Fragen",
          weak: "Nicht die Wahl für Politik",
        },
      },
      mode: {
        autoModel: "Automatisch gewählt",
        goodAt: "Stark bei:",
        weakAt: "Schwach bei:",
      },
      spotlight: {
        title: "Wähl, wie {{name}} arbeitet.",
        subtitle:
          "Jeder Modus nutzt ein anderes Modell. Oder schreib einfach los.",
        now: "Aktueller Modus",
        runsOn: "Läuft auf",
        allModes: "Alle Modi",
        more: "Weitere Modi",
        fix: {
          politics: "Politik? Wechsel zu {{mode}}",
          complex: "Komplexe Aufgabe? Wechsel zu {{mode}}",
        },
      },
      single: {
        title: "{{name}} nutzt ein einziges Modell.",
        action: "Zu {{companion}} wechseln, für mehr Modi",
      },
      companion: {
        title: "Wer soll antworten?",
        subtitle:
          "Jeder Begleiter hat eine eigene Persönlichkeit und Modelle für verschiedene Aufgaben.",
        skip: "Oder schreib einfach los, ganz ohne Begleiter.",
        skipModel:
          "Oder schreib einfach los. {{model}} antwortet, ohne Persona.",
        about: {
          thea: "Warm und nachdenklich. Denkt mit dir.",
          hermes: "Direkt und schnell. Erledigt, was ansteht.",
        },
      },
      custom: {
        title: "Dein eigener Skill ist startklar.",
        subtitle:
          "Skill oder Modell wechselst du im Auswahlfeld unter dem Eingabefeld.",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "Gerade eben",
      hoursAgo: "vor {{hours}}h",
      daysAgo: "vor {{days}}d",
    },
  },
  config: {
    folders: {
      private: "Private Chats",
      shared: "Geteilte Chats",
      public: "Öffentliche Chats",
      incognito: "Inkognito Chats",
      background: "Hintergrund-Threads",
      remote: "Remote-Chats",
    },
  },
};
