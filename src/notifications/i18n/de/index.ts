import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benachrichtigungen",

  tags: {
    notifications: "benachrichtigungen",
    list: "liste",
    unread: "ungelesen",
    read: "gelesen",
  },

  enums: {
    type: {
      taskComplete: "Aufgabe erledigt",
      taskFailed: "Aufgabe fehlgeschlagen",
      earning: "Verdienst",
      dreamerResult: "Dreamer-Ergebnis",
      creditLow: "Guthaben knapp",
      system: "System",
    },
  },

  templates: {
    taskComplete: {
      title: "{{name}} ist fertig",
      body: "Deine Hintergrundaufgabe ist durch. Ergebnis öffnen.",
    },
    taskFailed: {
      title: "{{name}} ist fehlgeschlagen",
      body: "Deine Hintergrundaufgabe ist auf einen Fehler gelaufen. Öffnen, um die Ursache zu sehen.",
    },
    earning: {
      title: "{{amount}} Credits verdient",
      body: "Ein Empfehlungsverdienst hat die Sperrfrist überstanden und ist jetzt nutzbar.",
    },
    dreamerResult: {
      title: "{{name}} hat ein Ergebnis",
      body: "Dein Dreamer-Lauf ist abgeschlossen.",
    },
    creditLow: {
      title: "Guthaben wird knapp",
      body: "Noch {{amount}} Credits. Lade auf, bevor dein nächster Lauf stehen bleibt.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Hintergrundaufgabe",
  },

  list: {
    get: {
      title: "Benachrichtigungen",
      titleShort: "Benachrichtigungen",
      description:
        "Alles, was fertig wurde, während du weg warst. Ungelesenes zuerst.",
      emptyTitle: "Nichts Neues",
      emptyHint: "Erledigte Aufgaben und Verdienste erscheinen hier.",
      markAllRead: "Alle gelesen",
      unread: "Ungelesen",
      response: {
        notifications: {
          id: "ID",
          type: "Typ",
          title: "Titel",
          body: "Nachricht",
          link: "Link",
          read: "Gelesen",
          createdAt: "Eingegangen",
        },
        unreadCount: "Ungelesen",
      },
      paginationInfo: {
        label: "Seitenwahl",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Anzahl ungelesener Benachrichtigungen",
      titleShort: "Ungelesen",
      description: "Wie viele Benachrichtigungen du noch nicht geöffnet hast.",
      response: {
        unreadCount: "Ungelesene Benachrichtigungen",
      },
    },
  },

  read: {
    post: {
      title: "Benachrichtigungen als gelesen markieren",
      titleShort: "Als gelesen markieren",
      description:
        "Eine oder alle Benachrichtigungen als gelesen markieren. Sende eine ID oder all=true.",
      id: {
        label: "Benachrichtigungs-ID",
        description: "Die Benachrichtigung, die als gelesen gelten soll",
      },
      all: {
        label: "Alles als gelesen markieren",
        description: "Die ganze Ungelesen-Liste leeren",
      },
      response: {
        updatedCount: "Als gelesen markiert",
      },
      submit: {
        label: "Als gelesen markieren",
        loading: "Wird aktualisiert...",
      },
    },
  },

  bell: {
    label: "Benachrichtigungen",
    empty: "Alles erledigt. Nichts offen.",
    markAllRead: "Alle gelesen",
    viewAll: "Alle anzeigen",
    loading: "Lädt...",
    unreadBadge: "{{count}} ungelesene Benachrichtigungen",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Sende eine Benachrichtigungs-ID oder all=true",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Melde dich an, um deine Benachrichtigungen zu sehen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Benachrichtigung nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    serverError: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
      detail: "Bei uns ist etwas schiefgelaufen: {{error}}",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Konflikt beim Benachrichtigungsstatus",
    },
    idOrAllRequired: "Sende eine Benachrichtigungs-ID oder all=true.",
  },

  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
  },
};
