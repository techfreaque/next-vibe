import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Nachrichten",
  },
  get: {
    title: "Konversationspfad abrufen",
    description:
      "Nachrichten entlang eines bestimmten Konversationspfads abrufen",
    container: {
      title: "Konversationspfad",
      description: "Nachrichten im ausgewählten Konversationszweig",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, aus dem der Pfad abgerufen werden soll",
    },
    branchIndices: {
      label: "Zweigindizes",
      description:
        "Zuordnung von übergeordneter Nachrichten-ID zu Zweigindex für die Auswahl des Konversationspfads",
    },
    before: {
      label: "Vor Nachrichten-ID",
      description:
        "Verlaufsblock vor dieser Nachrichten-ID laden (cursorbasierte Paginierung)",
    },
    response: {
      title: "Pfadnachrichten",
      description: "Nachrichten im Konversationspfad",
      messages: {
        message: {
          title: "Nachricht",
          id: {
            content: "Nachrichten-ID",
          },
          threadId: {
            content: "Thread-ID",
          },
          role: {
            content: "Rolle",
          },
          content: {
            content: "Inhalt",
          },
          parentId: {
            content: "Übergeordnete Nachrichten-ID",
          },
          depth: {
            content: "Tiefe",
          },
          sequenceId: {
            content: "Sequenz-ID",
          },
          authorId: {
            content: "Autor-ID",
          },
          authorName: {
            content: "Autorname",
          },
          isAI: {
            content: "Ist KI",
          },
          model: {
            content: "Modell",
          },
          character: {
            content: "Charakter",
          },
          errorType: {
            content: "Fehlertyp",
          },
          errorMessage: {
            content: "Fehlermeldung",
          },
          errorCode: {
            content: "Fehlercode",
          },
          metadata: {
            content: "Metadaten",
          },
          upvotes: {
            content: "Positiv-Bewertungen",
          },
          downvotes: {
            content: "Negativ-Bewertungen",
          },
          searchVector: {
            content: "Suchvektor",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
      },
      branchMeta: {
        title: "Zweig-Metadaten",
        item: {
          title: "Zweig-Gabelungspunkt",
          parentId: {
            content: "Übergeordnete ID",
          },
          siblingCount: {
            content: "Anzahl Geschwister",
          },
          currentIndex: {
            content: "Aktueller Index",
          },
        },
      },
      hasOlderHistory: {
        content: "Hat älteren Verlauf",
      },
      oldestLoadedMessageId: {
        content: "Älteste geladene Nachrichten-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Konversationspfade anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Konversationspfad anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
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
      threadNotFound: {
        title: "Thread nicht gefunden",
        description: "Der angegebene Thread existiert nicht",
      },
      noRootMessage: {
        title: "Keine Root-Nachricht",
        description: "Der Thread hat keine Root-Nachricht",
      },
      getFailed: {
        title: "Abruf fehlgeschlagen",
        description: "Konversationspfad konnte nicht abgerufen werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Konversationspfad erfolgreich abgerufen",
    },
  },
};

export default translations;
