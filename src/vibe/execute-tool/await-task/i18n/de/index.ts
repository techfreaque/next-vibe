import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    awaitTask: "Aufgabe abwarten",
  },
  post: {
    title: "Aufgabe abwarten",
    titleShort: "Abwarten",
    description:
      "Wartet auf eine gestartete Hintergrundaufgabe. Liefert sofort das Ergebnis, wenn bereits abgeschlossen, oder pausiert den KI-Stream bis zur Fertigstellung.",
    fields: {
      taskId: {
        label: "Aufgaben-ID",
        description:
          "Die Task-ID aus execute-tool (detach- oder wakeUp-Modus).",
      },
      status: {
        title: "Status",
        description: "Aktueller Aufgabenstatus.",
      },
      result: {
        title: "Ergebnis",
        description: "Tool-Ausgabe (vorhanden wenn abgeschlossen).",
      },
      waiting: {
        title: "Wartend",
        description:
          "True wenn der Stream auf den Abschluss der Aufgabe wartet.",
      },
      originalToolName: {
        title: "Tool",
        description: "Das gestartete Tool.",
      },
      originalArgs: {
        title: "Argumente",
        description: "Die Eingabeargumente des gestarteten Tools.",
      },
    },
    dynamicTitle: "Abwarten: {{toolName}}",
    widget: {
      noToolName: "Kein Tool-Name verfügbar.",
      resolving: "Tool wird aufgelöst...",
      unknownTool: "Unbekanntes Tool: {{toolName}}",
    },
    status: {
      waiting: "Wartend",
      complete: "Abgeschlossen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Aufgaben-ID",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      internal: {
        title: "Interner Fehler",
        description: "Waiter konnte nicht registriert werden",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung zum Abwarten dieser Aufgabe",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Aufgabe nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Aufgabenstatus-Konflikt",
      },
    },
    success: {
      title: "Fertig",
      description: "Aufgabe abgeschlossen",
    },
  },
};
