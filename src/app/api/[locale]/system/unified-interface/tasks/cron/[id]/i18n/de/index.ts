import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Cron-Aufgabe abrufen",
    description: "Eine einzelne Cron-Aufgabe nach ID abrufen",
    container: {
      title: "Cron-Aufgabendetails",
      description: "Details einer bestimmten Cron-Aufgabe anzeigen",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der Aufgabe",
      },
    },
    response: {
      task: {
        title: "Aufgabe",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Aufgaben-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Aufgabe anzuzeigen",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description: "Die angeforderte Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Beim Abrufen der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese Aufgabe zuzugreifen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      retrieved: {
        title: "Aufgabe abgerufen",
        description: "Aufgabe erfolgreich abgerufen",
      },
    },
  },
  put: {
    title: "Cron-Aufgabe aktualisieren",
    description: "Eine bestehende Cron-Aufgabe aktualisieren",
    container: {
      title: "Cron-Aufgabe aktualisieren",
      description: "Aufgabeneinstellungen ändern",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der Aufgabe",
      },
      name: {
        label: "Aufgabenname",
        description: "Name der Aufgabe",
        placeholder: "Aufgabennamen eingeben",
      },
      description: {
        label: "Beschreibung",
        description: "Aufgabenbeschreibung",
        placeholder: "Aufgabenbeschreibung eingeben",
      },
      schedule: {
        label: "Zeitplan",
        description: "Cron-Zeitplanausdruck",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Aktiviert",
        description: "Ob die Aufgabe aktiviert ist",
      },
      priority: {
        label: "Priorität",
        description: "Aufgabenpriorität",
        placeholder: "Priorität auswählen",
      },
      category: {
        label: "Kategorie",
        description: "Aufgabenkategorie",
        placeholder: "Kategorie auswählen",
      },
      timeout: {
        label: "Zeitüberschreitung",
        description: "Maximale Ausführungszeit in Sekunden",
        placeholder: "3600",
      },
      retries: {
        label: "Wiederholungen",
        description: "Anzahl der Wiederholungsversuche bei Fehler",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Wiederholungsversuche",
        description: "Anzahl der Wiederholungsversuche bei Fehler",
      },
      retryDelay: {
        label: "Wiederholungsverzögerung",
        description: "Verzögerung zwischen Wiederholungen in Sekunden",
      },
    },
    response: {
      task: {
        title: "Aktualisierte Aufgabe",
      },
      success: {
        title: "Erfolg",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Aufgabe zu aktualisieren",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description:
          "Die zu aktualisierende Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description:
          "Beim Aktualisieren der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Aufgabe zu aktualisieren",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Beim Aktualisieren der Aufgabe ist ein Konflikt aufgetreten",
      },
    },
    submitButton: {
      label: "Aufgabe speichern",
      loadingText: "Speichern...",
    },
    success: {
      updated: {
        title: "Aufgabe aktualisiert",
        description: "Aufgabe erfolgreich aktualisiert",
      },
    },
  },
  delete: {
    title: "Cron-Aufgabe löschen",
    description: "Eine Cron-Aufgabe löschen",
    container: {
      title: "Cron-Aufgabe löschen",
      description: "Eine Aufgabe aus dem System entfernen",
    },
    fields: {
      id: {
        label: "Aufgaben-ID",
        description: "Eindeutige Kennung der zu löschenden Aufgabe",
      },
    },
    response: {
      success: {
        title: "Erfolg",
      },
      message: {
        title: "Nachricht",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Aufgaben-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie sind nicht berechtigt, diese Aufgabe zu löschen",
      },
      notFound: {
        title: "Aufgabe nicht gefunden",
        description: "Die zu löschende Aufgabe konnte nicht gefunden werden",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Beim Löschen der Aufgabe ist ein Fehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diese Aufgabe zu löschen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Aufgabe kann aufgrund eines Konflikts nicht gelöscht werden",
      },
    },
    success: {
      deleted: {
        title: "Aufgabe gelöscht",
        description: "Aufgabe erfolgreich gelöscht",
      },
    },
  },
  widget: {
    notFound: "Aufgabe nicht gefunden",
    never: "Nie",
    history: "Verlauf",
    edit: "Bearbeiten",
    delete: "Löschen",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    identity: "Identität",
    id: "Aufgaben-ID",
    version: "Version",
    category: "Kategorie",
    priority: "Priorität",
    schedule: "Zeitplan",
    timezone: "Zeitzone",
    createdAt: "Erstellt",
    updatedAt: "Aktualisiert",
    stats: {
      totalExecutions: "Gesamtausführungen",
      successful: "Erfolgreich",
      errors: "Fehler",
      successRate: "Erfolgsrate",
    },
    timingSection: "Zeitplan",
    timing: {
      avgDuration: "Ø Dauer",
      lastDuration: "Letzte Dauer",
      lastRun: "Letzter Lauf",
      nextRun: "Nächster Lauf",
      timeout: "Zeitlimit",
      retries: "Wiederholungen",
      retryDelay: "Wiederholungsverzögerung",
    },
    lastExecutionError: "Letzter Fehler",
    refresh: "Aktualisieren",
  },
};
