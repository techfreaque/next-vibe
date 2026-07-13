import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Threads",
  },
  patch: {
    title: "Thread umbenennen",
    titleShort: "Umbenennen",
    description: "Titel und Vorschau eines Chat-Threads ändern",
    container: {
      title: "Thread umbenennen",
      description: "Neuen Titel oder Vorschautext für den Thread festlegen",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des umzubenennenden Threads",
    },
    threadTitle: {
      label: "Titel",
      description: "Neuer Titel für den Thread",
      placeholder: "Thread-Titel eingeben...",
    },
    preview: {
      label: "Vorschau",
      description: "Kurze Beschreibung oder Vorschautext für den Thread",
      placeholder: "Vorschautext eingeben...",
    },
    response: {
      threadId: {
        content: "Thread-ID",
      },
      title: {
        content: "Titel",
      },
      preview: {
        content: "Vorschau",
      },
      updatedAt: {
        content: "Aktualisiert am",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description:
          "Prüfen Sie, ob die Thread-ID eine gültige UUID ist und mindestens ein Feld angegeben wurde",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melden Sie sich an, um Threads umzubenennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Thread umzubenennen",
      },
      notFound: {
        title: "Thread nicht gefunden",
        description: "Kein Thread mit dieser ID vorhanden",
      },
      server: {
        title: "Serverfehler",
        description: "Thread konnte nicht umbenannt werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Etwas ist schiefgelaufen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Der Thread wurde von jemand anderem geändert",
      },
    },
    success: {
      title: "Thread umbenannt",
      description: "Titel und Vorschau des Threads wurden aktualisiert",
    },
    backButton: {
      label: "Abbrechen",
    },
    submitButton: {
      label: "Speichern",
      loadingText: "Wird gespeichert...",
    },
    dynamicTitle: "Thread umbenennen: {{title}}",
  },
};
