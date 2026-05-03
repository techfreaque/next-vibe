import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Taste drücken",
  dynamicTitle: "Taste: {{key}}",
  description: "Eine Taste oder Tastenkombination mit xdotool drücken",
  form: {
    label: "Taste drücken",
    description: "Ein Tastdruckereignis an den Desktop senden (xdotool-Syntax)",
    fields: {
      key: {
        label: "Taste",
        description:
          "Tastenname oder Kombination in xdotool-Syntax (z.B. Return, ctrl+c, alt+F4)",
        placeholder: "Return",
      },
      repeat: {
        label: "Wiederholungsanzahl",
        description: "Anzahl der Tastendrücke (Standard: 1)",
        placeholder: "1",
      },
      delay: {
        label: "Verzögerung (ms)",
        description:
          "Verzögerung zwischen wiederholten Tastendrücken in Millisekunden (Standard: 0)",
        placeholder: "0",
      },
      windowId: {
        label: "Fenster-ID",
        description: "Dieses Fenster vor dem Tastendruck fokussieren",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Fenstertitel",
        description: "Fenster mit diesem Titel vor dem Tastendruck fokussieren",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Taste erfolgreich gedrückt",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist beim Drücken der Taste aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, Tasten auf dem Desktop zu drücken",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Drücken von Tasten auf dem Desktop ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Drücken der Taste aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Drücken der Taste aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Drücken der Taste aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Taste gedrückt",
    description: "Die Taste wurde erfolgreich gedrückt",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
  },
};
