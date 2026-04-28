import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Fenster auf Monitor verschieben",
  description: "Ein Fenster auf einen bestimmten Monitor verschieben",
  form: {
    label: "Fenster auf Monitor verschieben",
    description:
      "Fenster per ID, PID oder Titel auf einen Zielmonitor verschieben",
    fields: {
      windowId: {
        label: "Fenster-ID",
        description:
          "KWin-interne Fenster-UUID (aus list-windows). Hat Vorrang vor PID und Titel.",
        placeholder: "{uuid}",
      },
      pid: {
        label: "Prozess-ID",
        description: "Fenster dieser Prozess-ID verschieben",
        placeholder: "12345",
      },
      title: {
        label: "Fenstertitel",
        description:
          "Fenster verschieben, dessen Titel diesen Text enthält (Groß-/Kleinschreibung egal)",
        placeholder: "Firefox",
      },
      monitorName: {
        label: "Monitorname",
        description:
          "Name des Zielmonitors (z. B. DP-1, HDMI-A-1). list-monitors zeigt verfügbare Namen.",
        placeholder: "DP-1",
      },
      monitorIndex: {
        label: "Monitor-Index",
        description: "Index des Zielmonitors (ab 0). Monitorname bevorzugen.",
        placeholder: "0",
      },
    },
  },
  response: {
    success: "Ob das Verschieben erfolgreich war",
    movedTo: "Monitor, auf den das Fenster verschoben wurde",
    windowTitle: "Titel des verschobenen Fensters",
    error: "Fehlermeldung bei Misserfolg",
    executionId: "Eindeutige Ausführungs-ID",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte mindestens eine Fensterkennung und ein Monitorziel angeben",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler beim Verschieben des Fensters",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Keine Berechtigung zum Verschieben von Fenstern",
    },
    forbidden: {
      title: "Verboten",
      description: "Fenster verschieben ist nicht erlaubt",
    },
    notFound: {
      title: "Nicht gefunden",
      description:
        "Das angegebene Fenster oder der Monitor wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Interner Serverfehler beim Verschieben des Fensters",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Unbekannter Fehler beim Verschieben des Fensters",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Es gibt nicht gespeicherte Änderungen, die verloren gehen könnten",
    },
    conflict: {
      title: "Konflikt",
      description: "Konflikt beim Verschieben des Fensters",
    },
  },
  success: {
    title: "Fenster verschoben",
    description: "Das Fenster wurde erfolgreich auf den Zielmonitor verschoben",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    windowManagement: "Fensterverwaltung",
  },
};
