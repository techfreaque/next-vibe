import { translations as retryTranslations } from "../../retry/i18n/de";
import { translations as stopTranslations } from "../../stop/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Import-Job aktualisieren",
    description: "Import-Job-Konfigurationseinstellungen aktualisieren",
    jobId: {
      label: "Job-ID",
      description: "Eindeutige Kennung für den Import-Job",
    },
    form: {
      title: "Job-Einstellungen aktualisieren",
      description: "Import-Job-Konfiguration ändern",
    },
    settings: {
      title: "Job-Einstellungen",
      description: "Konfigurationseinstellungen für den Import-Job",
    },
    batchSize: {
      label: "Batch-Größe",
      description: "Anzahl der Zeilen, die in jedem Batch verarbeitet werden",
      placeholder: "100",
    },
    maxRetries: {
      label: "Maximale Wiederholungen",
      description: "Maximale Anzahl von Wiederholungsversuchen für fehlgeschlagene Zeilen",
      placeholder: "3",
    },
    response: {
      title: "Aktualisierte Job-Informationen",
      description: "Aktualisierte Import-Job-Details",
      info: {
        title: "Job-Informationen",
        description: "Grundlegende Job-Details",
      },
      id: {
        content: "Job-ID",
      },
      fileName: {
        content: "Dateiname",
      },
      status: {
        content: "Job-Status",
      },
      progress: {
        title: "Import-Fortschritt",
        description: "Aktueller Import-Fortschritt und Statistiken",
      },
      totalRows: {
        content: "Gesamtzahl der Zeilen",
      },
      processedRows: {
        content: "Verarbeitete Zeilen",
      },
      successfulImports: {
        content: "Erfolgreiche Importe",
      },
      failedImports: {
        content: "Fehlgeschlagene Importe",
      },
      duplicateEmails: {
        content: "Duplizierte E-Mails",
      },
      configuration: {
        title: "Job-Konfiguration",
        description: "Aktuelle Job-Konfigurationseinstellungen",
      },
      currentBatchStart: {
        content: "Aktueller Batch-Start",
      },
      batchSize: {
        content: "Batch-Größe",
      },
      retryCount: {
        content: "Wiederholungszähler",
      },
      maxRetries: {
        content: "Maximale Wiederholungen",
      },
      error: {
        content: "Fehlermeldung",
      },
      timestamps: {
        title: "Job-Zeitstempel",
        description: "Job-Lebenszyklus-Zeitstempel",
      },
      createdAt: {
        content: "Erstellt am",
      },
      updatedAt: {
        content: "Aktualisiert am",
      },
      startedAt: {
        content: "Gestartet am",
      },
      completedAt: {
        content: "Abgeschlossen am",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Aktualisieren von Jobs",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Job zu aktualisieren",
      },
      notFound: {
        title: "Job nicht gefunden",
        description: "Kein Import-Job mit der angegebenen ID gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Aktualisieren des Jobs ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Aktualisierungskonflikt",
        description: "Der Job wurde von einem anderen Benutzer geändert",
      },
    },
    success: {
      title: "Erfolg",
      description: "Import-Job erfolgreich aktualisiert",
    },
  },
  delete: {
    title: "Import-Job löschen",
    description: "Einen bestimmten Import-Job löschen",
    jobId: {
      label: "Job-ID",
      description: "Eindeutige Kennung für den zu löschenden Import-Job",
    },
    form: {
      title: "Import-Job löschen",
      description: "Löschen des Import-Jobs bestätigen",
    },
    response: {
      title: "Löschergebnis",
      description: "Ergebnis des Löschvorgangs",
      success: {
        content: "Erfolgsstatus",
      },
      message: {
        content: "Löschmeldung",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Job-ID ist ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Löschen von Jobs",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diesen Job zu löschen",
      },
      notFound: {
        title: "Job nicht gefunden",
        description: "Kein Import-Job mit der angegebenen ID gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Löschen des Jobs ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Löschkonflikt",
        description: "Job, der gerade verarbeitet wird, kann nicht gelöscht werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Import-Job erfolgreich gelöscht",
    },
  },
  retry: retryTranslations,
  stop: stopTranslations,
};
