import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  jobId: {
    category: "Datenimport",
    tags: {
      leads: "Leads",
      management: "Verwaltung",
    },

    get: {
      title: "Import-Job abrufen",
      description: "Details eines bestimmten Import-Jobs abrufen",
      actions: {
        retry: "Wiederholen",
        stop: "Stoppen",
        viewLeads: "Leads anzeigen",
      },
      jobId: {
        label: "Job-ID",
        description: "Eindeutige Kennung für den Import-Job",
      },
      form: {
        title: "Import-Job-Status",
        description: "Aktueller Status und Fortschritt des Import-Jobs",
      },
      response: {
        title: "Job-Informationen",
        description: "Aktuelle Import-Job-Details",
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
          description: "Die angegebene Job-ID ist ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich zum Anzeigen von Jobs",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung, diesen Job anzuzeigen",
        },
        notFound: {
          title: "Job nicht gefunden",
          description: "Kein Import-Job mit der angegebenen ID gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Beim Abrufen des Jobs ist ein Fehler aufgetreten",
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
          title: "Konflikt",
          description: "Beim Abrufen des Jobs ist ein Konflikt aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Import-Job erfolgreich abgerufen",
      },
    },
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
        description:
          "Maximale Anzahl von Wiederholungsversuchen für fehlgeschlagene Zeilen",
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
          description:
            "Authentifizierung erforderlich zum Aktualisieren von Jobs",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description:
            "Sie haben keine Berechtigung, diesen Job zu aktualisieren",
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
          description:
            "Job, der gerade verarbeitet wird, kann nicht gelöscht werden",
        },
      },
      success: {
        title: "Erfolg",
        description: "Import-Job erfolgreich gelöscht",
      },
    },
    retry: {
      category: "Datenimport",
      tags: {
        leads: "Leads",
        management: "Verwaltung",
      },

      post: {
        title: "Import-Job wiederholen",
        description: "Einen fehlgeschlagenen Import-Job wiederholen",
        jobId: {
          label: "Job-ID",
          description:
            "Eindeutige Kennung für den zu wiederholenden Import-Job",
        },
        form: {
          title: "Import-Job wiederholen",
          description: "Den fehlgeschlagenen Import-Job wiederholen",
        },
        response: {
          title: "Wiederholungsergebnis",
          description: "Ergebnis der Wiederholungsoperation",
          success: {
            content: "Erfolgsstatus",
          },
          message: {
            content: "Wiederholungsnachricht",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebene Job-ID ist ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description:
              "Authentifizierung erforderlich, um Jobs zu wiederholen",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description:
              "Sie haben keine Berechtigung, diesen Job zu wiederholen",
          },
          notFound: {
            title: "Job nicht gefunden",
            description: "Kein Import-Job mit der angegebenen ID gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "Beim Wiederholen des Jobs ist ein Fehler aufgetreten",
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
            title: "Wiederholungskonflikt",
            description:
              "Job kann nicht wiederholt werden, während er verarbeitet wird",
          },
        },
        success: {
          title: "Erfolg",
          description: "Import-Job erfolgreich wiederholt",
        },
      },
      widget: {
        title: "Import-Job wiederholen",
        successMessage: "Job-Wiederholung erfolgreich gestartet",
      },
    },
    stop: {
      category: "Datenimport",
      tags: {
        leads: "Leads",
        management: "Verwaltung",
      },

      post: {
        title: "Import-Job stoppen",
        description: "Einen laufenden Import-Job stoppen",
        jobId: {
          label: "Job-ID",
          description: "Eindeutige Kennung für den zu stoppenden Import-Job",
        },
        form: {
          title: "Import-Job stoppen",
          description: "Den laufenden Import-Job stoppen",
        },
        response: {
          title: "Stoppergebnis",
          description: "Ergebnis der Stoppoperation",
          success: {
            content: "Erfolgsstatus",
          },
          message: {
            content: "Stoppnachricht",
          },
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Die angegebene Job-ID ist ungültig",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich, um Jobs zu stoppen",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung, diesen Job zu stoppen",
          },
          notFound: {
            title: "Job nicht gefunden",
            description: "Kein Import-Job mit der angegebenen ID gefunden",
          },
          server: {
            title: "Serverfehler",
            description: "Beim Stoppen des Jobs ist ein Fehler aufgetreten",
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
            title: "Stoppkonflikt",
            description:
              "Job kann nicht gestoppt werden, wenn er nicht verarbeitet wird",
          },
        },
        success: {
          title: "Erfolg",
          description: "Import-Job erfolgreich gestoppt",
        },
      },
      widget: {
        title: "Import-Job stoppen",
        successMessage: "Job erfolgreich gestoppt",
      },
    },
    widget: {
      status: {
        title: "Import-Job-Status",
        loadingJobStatus: "Job-Status wird geladen…",
        totalRows: "Gesamtzeilen",
        processed: "Verarbeitet",
        imported: "Importiert",
        failed: "Fehlgeschlagen",
        duplicates: "Duplikate",
        progress: "Fortschritt",
        configurationTitle: "Konfiguration",
        batchSize: "Batch-Größe",
        batchStart: "Batch-Start",
        retries: "Wiederholungen",
        timestampsTitle: "Zeitstempel",
        created: "Erstellt",
        started: "Gestartet",
        completed: "Abgeschlossen",
        jobStatus: {
          enums: {
            csvImportJobStatus: {
              pending: "Ausstehend",
              processing: "Wird verarbeitet",
              completed: "Abgeschlossen",
              failed: "Fehlgeschlagen",
            },
          },
        },
      },
      retry: {
        title: "Import-Job wiederholen",
        loadingRetrying: "Job wird wiederholt…",
        successMessage: "Job erfolgreich wiederholt",
        failureMessage: "Wiederholung fehlgeschlagen",
        viewJobStatus: "Job-Status anzeigen",
        viewLeads: "Leads anzeigen",
      },
      stop: {
        title: "Import-Job stoppen",
        loadingStopping: "Job wird gestoppt…",
        successMessage: "Job erfolgreich gestoppt",
        failureMessage: "Stoppen fehlgeschlagen",
        viewLeads: "Leads anzeigen",
        startNewImport: "Neuen Import starten",
      },
    },
  },
};
