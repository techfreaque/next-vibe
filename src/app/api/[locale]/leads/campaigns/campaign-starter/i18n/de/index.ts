import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnen-Verwaltung",
  tag: "Kampagnenstarter",
  task: {
    description:
      "Kampagnen für neue Leads starten, indem sie in den PENDING-Status versetzt werden",
  },
  errors: {
    server: {
      title: "Serverfehler",
      description:
        "Bei der Verarbeitung der Kampagnenstarter-Anfrage ist ein Fehler aufgetreten",
    },
    invalidTransition: "Ungültiger Statusübergang für den Kampagnenstart",
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
  },
  post: {
    title: "Kampagnenstarter",
    description: "Kampagnen für neue Leads starten",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Starten der Kampagnen ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    fields: {
      timezone: {
        label: "Zeitzone",
        description: "Browser-Zeitzone zur Stundenumrechnung",
      },
      dryRun: {
        label: "Testlauf",
        description: "Ausführen ohne Änderungen vorzunehmen",
      },
      force: {
        label: "Erzwingen",
        description: "Tages-/Stunden-Zeitplaneinschränkungen umgehen",
      },
    },
    response: {
      leadsProcessed: "Verarbeitete Leads",
      leadsStarted: "Gestartete Leads",
      leadsSkipped: "Übersprungene Leads",
      executionTimeMs: "Ausführungszeit (ms)",
      errors: "Fehler",
      quotaDetails: "Kontingent-Details",
    },
    success: {
      title: "Kampagnenstarter abgeschlossen",
      description: "Kampagnenstarter wurde erfolgreich ausgeführt",
    },
  },
  get: {
    title: "Campaign-Starter-Konfiguration abrufen",
    description: "Campaign-Starter-Konfiguration laden",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
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
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    fields: {
      timezone: {
        label: "Zeitzone",
        description: "Browser-Zeitzone zur Stundenumrechnung",
      },
    },
    response: {
      dryRun: "Testmodus",
      minAgeHours: "Mindestalter in Stunden",
      localeConfig: "Sprachkonfiguration",
      enabledDays: "Aktive Wochentage",
      enabledHours: "Aktive Stunden",
      leadsPerWeek: "Leads pro Woche",
      schedule: "Zeitplan",
      enabled: "Aktiviert",
      priority: "Priorität",
      timeout: "Timeout",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    success: {
      title: "Konfiguration erfolgreich geladen",
      description: "Campaign-Starter-Konfiguration erfolgreich geladen",
    },
  },
  put: {
    title: "Campaign-Starter-Konfiguration",
    description: "Campaign-Starter-Konfiguration aktualisieren",
    dryRun: {
      label: "Testmodus (Dry Run)",
      description: "Testmodus aktivieren ohne echte E-Mails zu senden",
    },
    minAgeHours: {
      label: "Mindestalter in Stunden",
      description: "Mindestalter in Stunden bevor Leads verarbeitet werden",
    },
    enabledDays: {
      label: "Aktive Wochentage",
      description: "Wochentage, an denen Kampagnen aktiv sind",
      monday: "Montag",
      tuesday: "Dienstag",
      wednesday: "Mittwoch",
      thursday: "Donnerstag",
      friday: "Freitag",
      saturday: "Samstag",
      sunday: "Sonntag",
    },
    enabledHours: {
      label: "Aktive Stunden",
      description: "Tagesstunden, in denen Kampagnen aktiv sind",
      start: {
        label: "Startstunde",
        description: "Tagesstunde, zu der Kampagnen beginnen (0-23)",
      },
      end: {
        label: "Endstunde",
        description: "Tagesstunde, zu der Kampagnen enden (0-23)",
      },
    },
    localeConfig: {
      label: "Sprachkonfiguration",
      description:
        "Einstellungen pro Sprache: Leads pro Woche, aktive Tage und aktive Stunden",
    },
    leadsPerWeek: {
      label: "Leads pro Woche",
      description: "Maximale Anzahl der zu verarbeitenden Leads pro Woche",
    },
    schedule: {
      label: "Zeitplan",
      description: "Kampagnenausführungszeitplan",
    },
    enabled: {
      label: "Aktiviert",
      description: "Campaign Starter aktivieren oder deaktivieren",
    },
    priority: {
      label: "Priorität",
      description: "Prioritätsstufe für die Kampagnenausführung",
    },
    timeout: {
      label: "Timeout",
      description: "Timeout-Wert in Millisekunden",
    },
    retries: {
      label: "Wiederholungen",
      description: "Anzahl der Wiederholungsversuche",
    },
    retryDelay: {
      label: "Wiederholungsverzögerung",
      description:
        "Verzögerung zwischen Wiederholungsversuchen in Millisekunden",
    },
    success: {
      title: "Konfiguration gespeichert",
      description: "Campaign-Starter-Konfiguration erfolgreich gespeichert",
    },
  },
  priority: {
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    background: "Hintergrund",
    filter: {
      all: "Alle Prioritäten",
      highAndAbove: "Hoch und höher",
      mediumAndAbove: "Mittel und höher",
    },
  },
  widget: {
    title: "Campaign-Starter-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    description:
      "Kampagnen für neue Leads starten, die kontaktiert werden können.",
    saving: "Speichern...",
    save: "Einstellungen speichern",
    addLocale: "+ Sprache hinzufügen",
    guidanceTitle: "Campaign Starter konfigurieren",
    guidanceDescription:
      "Zeitplan, aktive Tage/Stunden und Leads-pro-Woche-Ziele festlegen.",
    runButton: "Kampagnen starten",
    running: "Läuft...",
    done: "Fertig",
    perRunBudget:
      "~{{perRunBudget}} Leads/Lauf · {{totalRunsPerWeek}} Läufe/Woche",
    perRunBudgetFractional:
      "{{exactBudget}}/Lauf · {{totalRunsPerWeek}} Läufe/Woche (gebrochen - akkumuliert über Läufe)",
    perRunBudgetZeroHint:
      "— Leads/Woche erhöhen oder Zeitplanfrequenz reduzieren",
    sections: {
      general: "Allgemein",
      generalDescription:
        "Hauptsteuerung zum Aktivieren des Campaign Starters und des Testmodus.",
      schedule: "Zeitplan",
      scheduleDescription:
        "Wann sollen Kampagnen laufen? Cron-Zeitplan, aktive Tage und Stunden festlegen.",
      hoursTimezoneNote:
        "Stunden in Ihrer Browser-Zeitzone ({{offset}}). Auf dem Server als UTC gespeichert.",
      quotas: "Kontingente",
      quotasDescription:
        "Wie viele Leads pro Woche verarbeitet werden sollen, aufgeteilt nach Sprache.",
      advanced: "Erweitert",
      advancedDescription:
        "Task-Ausführungseinstellungen wie Priorität, Timeouts und Wiederholungsverhalten.",
    },
  },
};
