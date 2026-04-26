import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Barrierefreiheitsbaum abrufen",
  description:
    "Barrierefreiheitsbaum des fokussierten Fensters oder einer bestimmten Anwendung abrufen",
  form: {
    label: "Barrierefreiheitsbaum abrufen",
    description:
      "Den AT-SPI-Barrierefreiheitsbaum für die Desktop-UI-Inspektion abrufen",
    fields: {
      appName: {
        label: "Anwendungsname",
        description:
          "Prozessname oder Fenstertitel (weglassen für fokussiertes Fenster)",
        placeholder: "firefox",
      },
      maxDepth: {
        label: "Maximale Tiefe",
        description: "Maximale Baumtiefe für die Durchquerung (Standard: 5)",
        placeholder: "5",
      },
      includeActions: {
        label: "Aktionen einbeziehen",
        description:
          "Verfügbare Aktionen pro Knoten anzeigen (klicken, drücken, aktivieren...). Mehr Details, größere Ausgabe.",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Barrierefreiheitsbaum erfolgreich abgerufen",
    tree: "Barrierefreiheitsbaum als strukturierter Text",
    nodeCount: "Gesamtanzahl der durchlaufenen Knoten",
    truncated:
      "Ob die Abfrage abgelaufen ist und die Ausgabe unvollständig sein kann",
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
      description:
        "Ein Netzwerkfehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, auf den Barrierefreiheitsbaum zuzugreifen",
    },
    forbidden: {
      title: "Verboten",
      description: "Der Zugriff auf den Barrierefreiheitsbaum ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description:
        "Die Zielanwendung oder das Zielfenster wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Ein Konflikt ist beim Abrufen des Barrierefreiheitsbaums aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Barrierefreiheitsbaum abgerufen",
    description: "Der Barrierefreiheitsbaum wurde erfolgreich abgerufen",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    accessibilityAutomation: "Barrierefreiheits-Automatisierung",
  },
};
