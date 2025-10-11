import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Kampagnenstarter-Konfiguration Abrufen",
    description: "Kampagnenstarter-Konfiguration abrufen",
    form: {
      title: "Kampagnenstarter-Konfiguration Anfrage",
      description: "Kampagnenstarter-Konfiguration anfordern",
    },
    response: {
      title: "Konfigurationsantwort",
      description: "Kampagnenstarter-Konfigurationsdaten",
      dryRun: "Testlauf-Modus",
      minAgeHours: "Mindestalter Stunden",
      enabledDays: "Aktivierte Tage",
      enabledHours: "Aktivierte Stunden",
      leadsPerWeek: "Leads pro Woche",
      schedule: "Zeitplan",
      enabled: "Aktiviert",
      priority: "Priorität",
      timeout: "Timeout",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    success: {
      title: "Konfiguration Erfolgreich Abgerufen",
      description: "Kampagnenstarter-Konfiguration erfolgreich abgerufen",
    },
  },
  post: {
    title: "Kampagnenstarter-Konfiguration",
    description: "Kampagnenstarter-Konfiguration Endpunkt",
    form: {
      title: "Kampagnenstarter-Konfiguration Konfiguration",
      description: "Kampagnenstarter-Konfigurationparameter konfigurieren",
    },
    dryRun: {
      label: "Testlauf-Modus",
      description: "Testlauf-Modus zum Testen aktivieren",
    },
    minAgeHours: {
      label: "Mindestalter Stunden",
      description: "Mindestalter in Stunden vor der Verarbeitung von Leads",
    },
    enabledDays: {
      label: "Aktivierte Tage",
      description: "Wochentage, an denen Kampagnen aktiviert sind",
    },
    enabledHours: {
      label: "Aktivierte Stunden",
      description: "Tagesstunden, in denen Kampagnen aktiviert sind",
    },
    leadsPerWeek: {
      label: "Leads pro Woche",
      description: "Maximale Anzahl von Leads pro Woche zu verarbeiten",
    },
    schedule: {
      label: "Zeitplan",
      description: "Kampagnenausführungszeitplan",
    },
    enabled: {
      label: "Aktiviert",
      description: "Kampagnenstarter aktivieren oder deaktivieren",
    },
    priority: {
      label: "Priorität",
      description: "Prioritätsstufe für Kampagnenausführung",
    },
    timeout: {
      label: "Timeout",
      description: "Timeout-Wert in Sekunden",
    },
    retries: {
      label: "Wiederholungen",
      description: "Anzahl der Wiederholungsversuche",
    },
    retryDelay: {
      label: "Wiederholungsverzögerung",
      description: "Verzögerung zwischen Wiederholungsversuchen in Sekunden",
    },
    response: {
      title: "Antwort",
      description: "Kampagnenstarter-Konfiguration Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
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
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
