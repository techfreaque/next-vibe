import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Fenster fokussieren",
  description: "Ein Fenster in den Vordergrund bringen und ihm den Fokus geben",
  form: {
    label: "Fenster fokussieren",
    description: "Ein Fenster nach ID, PID oder Titel fokussieren",
    fields: {
      windowId: {
        label: "Fenster-ID",
        description:
          "X11-Fenster-ID (hexadezimal, z.B. 0x1234). Hat Vorrang vor anderen Optionen.",
        placeholder: "0x1234",
      },
      pid: {
        label: "Prozess-ID",
        description: "Fenster fokussieren, das zu dieser Prozess-ID gehört",
        placeholder: "12345",
      },
      title: {
        label: "Fenstertitel",
        description:
          "Fenster fokussieren, dessen Titel diesen Text enthält (Groß-/Kleinschreibung beachten)",
        placeholder: "Firefox",
      },
    },
  },
  response: {
    success: "Fenster erfolgreich fokussiert",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte geben Sie mindestens eines an: Fenster-ID, PID oder Titel",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Ein Netzwerkfehler ist beim Fokussieren des Fensters aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Fenster zu fokussieren",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Fokussieren von Fenstern ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Das angegebene Fenster wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Fokussieren des Fensters aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Fokussieren des Fensters aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Fokussieren des Fensters aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Fenster fokussiert",
    description: "Das Fenster wurde erfolgreich in den Vordergrund gebracht",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    windowManagement: "Fensterverwaltung",
  },
};
