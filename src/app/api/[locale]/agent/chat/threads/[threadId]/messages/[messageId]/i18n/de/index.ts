import { translations as voteTranslations } from "../../vote/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Nachrichten",
  },
  get: {
    title: "Nachricht abrufen",
    description: "Eine bestimmte Nachricht anhand der ID abrufen",
    container: {
      title: "Nachrichtendetails",
      description: "Nachrichteninformationen anzeigen",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, der die Nachricht enthält",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "ID der abzurufenden Nachricht",
    },
    rootFolderId: {
      label: "Stammordner",
      description: "Stammordner des Threads (für Client-Routing verwendet)",
    },
    response: {
      title: "Nachrichtenantwort",
      description: "Nachrichtendetails",
      message: {
        title: "Nachricht",
        id: { content: "Nachrichten-ID" },
        threadId: { content: "Thread-ID" },
        role: { content: "Rolle" },
        content: { content: "Inhalt" },
        parentId: { content: "Übergeordnete Nachrichten-ID" },
        authorId: { content: "Autor-ID" },
        isAI: { content: "Ist KI" },
        model: { content: "Modell" },
        tokens: { content: "Token" },
        createdAt: { content: "Erstellt am" },
        updatedAt: { content: "Aktualisiert am" },
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
        description: "Sie müssen angemeldet sein, um Nachrichten anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Nachricht anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nachricht nicht gefunden",
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
    },
    success: {
      title: "Erfolg",
      description: "Nachricht erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Nachricht aktualisieren",
    description: "Inhalt einer Nachricht aktualisieren",
    container: {
      title: "Nachricht bearbeiten",
      description: "Nachrichteninhalt aktualisieren",
    },
    form: {
      title: "Nachricht bearbeiten",
      description: "Nachrichteninhalt aktualisieren",
    },
    sections: {
      message: {
        title: "Nachrichteninhalt",
        description: "Nachricht bearbeiten",
      },
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, der die Nachricht enthält",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "ID der zu aktualisierenden Nachricht",
    },
    rootFolderId: {
      label: "Stammordner",
      description: "Stammordner des Threads (für Client-Routing verwendet)",
    },
    content: {
      label: "Inhalt",
      description: "Aktualisierter Nachrichteninhalt",
      placeholder: "Nachrichteninhalt eingeben...",
    },
    role: {
      label: "Rolle",
      description: "Nachrichtenrolle (Benutzer, Assistent, System)",
    },
    response: {
      title: "Aktualisierte Nachricht",
      description: "Aktualisierte Nachrichtendetails",
      message: {
        title: "Nachricht",
        id: { content: "Nachrichten-ID" },
        threadId: { content: "Thread-ID" },
        role: { content: "Rolle" },
        content: { content: "Inhalt" },
        parentId: { content: "Übergeordnete Nachrichten-ID" },
        createdAt: { content: "Erstellt am" },
        updatedAt: { content: "Aktualisiert am" },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Nachrichtendaten angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Nachrichten zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Nachricht zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nachricht nicht gefunden",
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
    },
    success: {
      title: "Erfolg",
      description: "Nachricht erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Nachricht löschen",
    description: "Eine Nachricht aus dem Thread löschen",
    container: {
      title: "Nachricht löschen",
      description: "Nachricht aus Thread entfernen",
    },
    confirmTitle: "Nachricht löschen",
    confirmText:
      "Möchten Sie diese Nachricht wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    backButton: {
      label: "Abbrechen",
    },
    deleteButton: {
      label: "Löschen",
      loadingText: "Löschen…",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, der die Nachricht enthält",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "ID der zu löschenden Nachricht",
    },
    rootFolderId: {
      label: "Stammordner",
      description: "Stammordner des Threads (für Client-Routing verwendet)",
    },
    response: {
      success: { content: "Erfolg" },
      role: { content: "Rolle" },
      content: { content: "Inhalt" },
      parentId: { content: "Übergeordnete Nachrichten-ID" },
      authorId: { content: "Autor-ID" },
      isAI: { content: "Ist KI" },
      model: { content: "Modell" },
      createdAt: { content: "Erstellt am" },
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
        description: "Sie müssen angemeldet sein, um Nachrichten zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Nachricht zu löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nachricht nicht gefunden",
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
        description:
          "Nachricht mit untergeordneten Nachrichten kann nicht gelöscht werden",
      },
      threadNotFound: {
        title: "Thread nicht gefunden",
        description: "Der angegebene Thread existiert nicht",
      },
      messageNotFound: {
        title: "Nachricht nicht gefunden",
        description: "Die angegebene Nachricht existiert nicht",
      },
    },
    success: { title: "Erfolg", description: "Nachricht erfolgreich gelöscht" },
  },
  vote: voteTranslations,
};
