import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError:
      "Ein unerwarteter Fehler ist aufgetreten: {{error}}. Bitte erneut versuchen.",
    modelNotResolved:
      "Für diesen Thread konnte kein Modell ermittelt werden - der Stream lässt sich nicht fortsetzen.",
  },
  post: {
    title: "Wiederaufnahme",
    titleShort: "Wiederaufnahme",
    description:
      "Setzt einen bestehenden Thread nach dem Abschluss eines asynchronen Tasks fort (callbackMode=wait oder wakeUp).",
    fields: {
      threadId: {
        title: "Thread-ID",
        description: "UUID des fortzusetzenden Threads.",
      },
      favoriteId: {
        title: "Favoriten-ID",
        description: "Favorit zum Laden von Modell und Charakter.",
      },
      modelId: {
        title: "Modell-ID",
        description: "KI-Modell für den fortgesetzten Schritt.",
      },
      skillId: {
        title: "Charakter-ID",
        description: "Charakter/Persona für den fortgesetzten Schritt.",
      },
      callbackMode: {
        title: "Callback-Modus",
        description: "wait oder wakeUp — bestimmt das Wiederaufnahmeverhalten.",
      },
      wakeUpToolMessageId: {
        title: "Tool-Nachrichten-ID",
        description: "ID der ursprünglichen Tool-Nachricht mit dem Ergebnis.",
      },
      wakeUpTaskId: {
        title: "WakeUp-Aufgaben-ID",
        description: "Auslösende Cron-Aufgabe, nach Wiederaufnahme gelöscht.",
      },
      resumeTaskId: {
        title: "Wiederaufnahme-Aufgaben-ID",
        description: "Diese Cron-Aufgabe selbst, nach Wiederaufnahme gelöscht.",
      },
      resumed: {
        title: "Fortgesetzt",
        description: "Ob der Thread erfolgreich fortgesetzt wurde.",
      },
      lastAiMessageId: {
        title: "Letzte KI-Nachrichten-ID",
        description: "UUID der letzten generierten Assistentennachricht.",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich.",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert." },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread oder Modell nicht gefunden.",
      },
      internal: {
        title: "Serverfehler",
        description: "Interner Fehler bei der Wiederaufnahme.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Konflikt bei nicht gespeicherten Änderungen.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten.",
      },
    },
    success: {
      title: "Thread wiederaufgenommen",
      description: "Der KI-Thread wurde erfolgreich fortgesetzt.",
    },
  },
};
