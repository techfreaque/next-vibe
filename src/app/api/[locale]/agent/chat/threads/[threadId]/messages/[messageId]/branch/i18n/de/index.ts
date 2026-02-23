import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Nachrichten",
  },
  post: {
    title: "Nachricht verzweigen",
    description: "Einen neuen Zweig aus dieser Nachricht erstellen",
    container: {
      title: "Zweig erstellen",
      description: "Konversation von diesem Punkt verzweigen",
    },
    form: {
      title: "Nachricht verzweigen",
      description: "Alternativen Konversationspfad erstellen",
    },
    sections: {
      branch: {
        title: "Zweigdetails",
        description: "Neuer Nachrichteninhalt",
      },
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, der die Nachricht enthält",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "ID der Nachricht, von der verzweigt werden soll",
    },
    content: {
      label: "Inhalt",
      description: "Inhalt der neuen Zweigsnachricht",
      placeholder: "Nachrichteninhalt eingeben...",
    },
    role: {
      label: "Rolle",
      description: "Nachrichtenrolle (Benutzer, Assistent, System)",
    },
    model: {
      label: "Modell",
      description: "KI-Modell für die Antwort",
    },
    response: {
      title: "Verzweigte Nachricht",
      description: "Neu erstellte Zweigsnachricht",
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
        authorId: {
          content: "Autor-ID",
        },
        isAI: {
          content: "Ist KI",
        },
        model: {
          content: "Modell",
        },
        tokens: {
          content: "Tokens",
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
        description: "Ungültige Zweigedaten angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Nachrichten zu verzweigen",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Nachricht zu verzweigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Übergeordnete Nachricht nicht gefunden",
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
      messageNotFound: {
        title: "Nachricht nicht gefunden",
        description: "Die angegebene Nachricht existiert nicht",
      },
      cannotBranchFromRoot: {
        title: "Kann nicht von Root verzweigen",
        description: "Von der Root-Nachricht kann kein Zweig erstellt werden",
      },
      createFailed: {
        title: "Erstellen fehlgeschlagen",
        description: "Zweigsnachricht konnte nicht erstellt werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zweig erfolgreich erstellt",
    },
  },
};
