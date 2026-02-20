export const translations = {
  get: {
    title: "Campaign-Starter-Konfiguration abrufen",
    description: "Campaign-Starter-Konfiguration laden",
    form: {
      title: "Campaign-Starter-Konfiguration Anfrage",
      description: "Campaign-Starter-Konfiguration anfordern",
    },
    response: {
      title: "Konfigurationsantwort",
      description: "Campaign-Starter-Konfigurationsdaten",
      dryRun: "Testmodus",
      minAgeHours: "Mindestalter in Stunden",
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
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
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
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
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
    success: {
      title: "Konfiguration erfolgreich geladen",
      description: "Campaign-Starter-Konfiguration erfolgreich geladen",
    },
  },
  post: {
    title: "Campaign-Starter-Konfiguration",
    description: "Campaign-Starter-Konfiguration Endpunkt",
    form: {
      title: "Campaign-Starter-Konfiguration",
      description: "Campaign-Starter-Konfigurationsparameter konfigurieren",
    },
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
    response: {
      title: "Antwort",
      description: "Campaign-Starter-Konfiguration Antwortdaten",
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
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  widget: {
    title: "Campaign-Starter-Konfiguration",
    titleSaved: "Konfiguration gespeichert",
    saving: "Speichern...",
    guidanceTitle: "Campaign Starter konfigurieren",
    guidanceDescription:
      "Legen Sie den Zeitplan, aktive Tage/Stunden, Leads-pro-Woche-Ziele und Cron-Task-Einstellungen fest. Verwenden Sie nach dem Speichern die Aktionsschaltflächen, um Statistiken anzuzeigen oder die Kampagne sofort zu starten.",
    successTitle: "Konfiguration erfolgreich gespeichert",
    successDescription:
      "Der Campaign Starter wird diese Einstellungen beim nächsten geplanten Lauf anwenden.",
    savedSettings: "Gespeicherte Einstellungen",
    scheduleCron: "Zeitplan (cron)",
    enabled: "Aktiviert",
    dryRun: "Probelauf",
    minLeadAge: "Mindest-Lead-Alter",
    activeDays: "Aktive Tage",
    activeHours: "Aktive Stunden",
    priority: "Priorität",
    timeout: "Timeout",
    retries: "Wiederholungen",
    retryDelay: "Wiederholungsverzögerung",
    leadsPerWeek: "Leads pro Woche",
    viewStats: "Statistiken anzeigen",
    viewCurrentConfig: "Aktuelle Konfiguration anzeigen",
    yes: "Ja",
    no: "Nein",
    yesNoEmailsSent: "Ja (keine E-Mails gesendet)",
    dayMon: "Mo",
    dayTue: "Di",
    dayWed: "Mi",
    dayThu: "Do",
    dayFri: "Fr",
    daySat: "Sa",
    daySun: "So",
  },
};
