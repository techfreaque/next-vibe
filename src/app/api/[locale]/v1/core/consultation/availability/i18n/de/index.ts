import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Beratungsverfügbarkeit prüfen",
  description: "Verfügbare Zeitfenster für die Beratungsplanung abrufen",
  category: "Beratungsverfügbarkeit",
  tag: "Verfügbarkeit",

  form: {
    title: "Parameter für Verfügbarkeitsprüfung",
    description:
      "Geben Sie den Datumsbereich und Parameter an, um verfügbare Beratungsslots zu prüfen",
  },

  startDate: {
    label: "Startdatum",
    description: "Das Startdatum für die Verfügbarkeitsprüfung",
    placeholder: "Startdatum auswählen",
  },

  endDate: {
    label: "Enddatum",
    description: "Das Enddatum für die Verfügbarkeitsprüfung",
    placeholder: "Enddatum auswählen",
  },

  slotDuration: {
    label: "Slot-Dauer (Minuten)",
    description: "Dauer jedes Beratungsslots in Minuten",
    placeholder: "60",
  },

  response: {
    slotsArray: "Verfügbare Zeitfenster",
    slots: {
      title: "Zeitfenster",
      description: "Verfügbares Beratungszeitfenster",
      start: "Startzeit",
      end: "Endzeit",
      available: "Verfügbar",
    },
    timezone: "Zeitzone",
  },

  success: {
    title: "Verfügbarkeit abgerufen",
    description: "Verfügbare Beratungsslots erfolgreich abgerufen",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die angegebenen Parameter sind ungültig",
      message: "Bitte geben Sie gültige Datums- und Zeitparameter an",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, die Beratungsverfügbarkeit zu prüfen",
    },
    server: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Prüfen der Verfügbarkeit aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zum Server fehlgeschlagen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf diese Ressource ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt mit dem aktuellen Zustand ist aufgetreten",
    },
  },
};
