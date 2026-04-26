import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Text eingeben",
  description:
    "Text in das fokussierte Fenster über Tastatureingabe-Simulation eingeben",
  form: {
    label: "Text eingeben",
    description: "Tastatureingaben an das fokussierte Fenster senden",
    fields: {
      text: {
        label: "Text",
        description: "Der in das fokussierte Fenster einzugebende Text",
        placeholder: "Hallo, Welt!",
      },
      delay: {
        label: "Verzögerung (ms)",
        description:
          "Verzögerung zwischen Tastatureingaben in Millisekunden (Standard: 12)",
        placeholder: "12",
      },
      windowId: {
        label: "Fenster-ID",
        description:
          "Dieses Fenster vor der Eingabe fokussieren (UUID aus list-windows)",
        placeholder: "{uuid}",
      },
      windowTitle: {
        label: "Fenstertitel",
        description: "Fenster mit diesem Titel vor der Eingabe fokussieren",
        placeholder: "Kate",
      },
    },
  },
  response: {
    success: "Text erfolgreich eingegeben",
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
      description: "Ein Netzwerkfehler ist beim Eingeben von Text aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Text auf dem Desktop einzugeben",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Eingeben von Text auf dem Desktop ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Eingeben von Text aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Eingeben von Text aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Eingeben von Text aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Text eingegeben",
    description: "Der Text wurde erfolgreich eingegeben",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
  },
};
