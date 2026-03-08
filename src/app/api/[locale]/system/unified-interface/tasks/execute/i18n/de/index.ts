import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aufgabenausführung",
  tags: {
    execute: "Ausführen",
  },
  errors: {
    executeTask: "Aufgabe konnte nicht ausgeführt werden",
    forbidden: "Sie haben keine Berechtigung, diese Aufgabe auszuführen",
    alreadyRunning: "Aufgabe wird bereits ausgeführt",
    notFound: "Aufgabe nicht gefunden",
  },
  post: {
    title: "Aufgabe ausführen",
    description:
      "Eine einzelne Aufgabe per ID auslösen und das Ergebnis synchron erhalten",
    container: {
      title: "Aufgabenausführung",
      description:
        "Eine bestimmte Aufgabe ausführen und auf ihr Ergebnis warten",
    },
    fields: {
      taskId: {
        label: "Aufgaben-ID",
        description: "Die ID der auszuführenden Aufgabe",
      },
      success: {
        title: "Erfolg",
      },
      message: {
        title: "Nachricht",
      },
    },
    response: {
      taskId: "Aufgaben-ID",
      taskName: "Aufgabenname",
      executedAt: "Ausgeführt am",
      duration: "Dauer (ms)",
      status: "Status",
      output: "Ausgabe",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Aufgabe auszuführen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Aufgabe nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Aufgabe läuft bereits",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
    },
    submitButton: {
      label: "Aufgabe ausführen",
      loadingText: "Wird ausgeführt...",
    },
    success: {
      title: "Erfolg",
      description: "Aufgabe erfolgreich ausgeführt",
    },
  },
};
