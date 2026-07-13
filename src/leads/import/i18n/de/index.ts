import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "Importieren",
    leads: "Leads",
    csv: "CSV",
  },

  category: "Datenimport",
  post: {
    title: "Leads importieren",
    titleShort: "Leads importieren",
    description: "Leads aus CSV-Datei importieren",
    form: {
      title: "Import-Konfiguration",
      description: "Lead-Importparameter konfigurieren",
    },
    file: {
      label: "CSV-Datei",
      description: "CSV-Dateiinhalt (base64-kodiert)",
      placeholder: "Base64-kodierten CSV-Inhalt einfügen",
      helpText: "CSV-Datei mit Lead-Daten hochladen",
    },
    fileName: {
      label: "Dateiname",
      description: "Name der CSV-Datei",
      placeholder: "leads.csv",
      helpText: "Aussagekräftigen Dateinamen angeben",
    },
    skipDuplicates: {
      label: "Duplikate überspringen",
      description: "Leads mit doppelten E-Mail-Adressen überspringen",
      helpText:
        "Aktivieren um existierende E-Mail-Adressen automatisch zu überspringen",
    },
    updateExisting: {
      label: "Existierende aktualisieren",
      description: "Existierende Leads mit neuen Daten aktualisieren",
      helpText:
        "Aktivieren um existierende Leads zu aktualisieren statt zu überspringen",
    },
    defaultCountry: {
      label: "Standard-Land",
      description: "Standard-Land für Leads ohne Land-Angabe",
      helpText: "Standard-Ländercode auswählen",
    },
    defaultLanguage: {
      label: "Standard-Sprache",
      description: "Standard-Sprache für Leads ohne Sprach-Angabe",
      helpText: "Standard-Sprachcode auswählen",
    },
    defaultStatus: {
      label: "Standard-Status",
      description: "Standard-Status für importierte Leads",
      helpText: "Anfangsstatus für neue Leads auswählen",
    },
    defaultCampaignStage: {
      label: "Standard-Kampagnenstufe",
      description: "Standard-E-Mail-Kampagnenstufe für importierte Leads",
      helpText: "Anfangskampagnenstufe auswählen",
    },
    defaultSource: {
      label: "Standard-Quelle",
      description: "Standard-Quellenzuordnung für importierte Leads",
      helpText: "Lead-Quelle für Tracking auswählen",
    },
    useChunkedProcessing: {
      label: "Stückweise Verarbeitung verwenden",
      description: "Große Importe in Hintergrund-Chunks verarbeiten",
      helpText: "Für Dateien mit mehr als 1000 Zeilen aktivieren",
    },
    batchSize: {
      label: "Batch-Größe",
      description: "Anzahl der Zeilen pro Batch",
      helpText: "Empfohlen: 2000 Zeilen pro Batch",
    },
    response: {
      batchId: "Batch-ID",
      totalRows: "Gesamtzeilen",
      successfulImports: "Erfolgreiche Importe",
      failedImports: "Fehlgeschlagene Importe",
      duplicateEmails: "Doppelte E-Mails",
      errors: "Import-Fehler",
      summary: "Import-Zusammenfassung",
      isChunkedProcessing: "Stückweise Verarbeitung",
      jobId: "Hintergrund-Job-ID",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Importparameter oder CSV-Format",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich um Leads zu importieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff für Lead-Import verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "CSV-Datei nicht gefunden oder ungültig",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Import",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Import",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Import",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Import",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen im Importformular",
      },
    },
    success: {
      title: "Import gestartet",
      description: "Lead-Import wurde erfolgreich initiiert",
    },
    widget: {
      headerTitle: "Leads aus CSV importieren",
      exportTemplateButton: "Vorlage exportieren",
      importGuideTitle: "Import-Anleitung",
      importGuideSubtitle: "CSV-Datei mit folgenden Spalten hochladen:",
      importGuideNote:
        "Nur {{email}} ist erforderlich. Alle anderen Spalten sind optional und verwenden die unten konfigurierten Standardwerte.",
      fileRequirementsTitle: "Dateianforderungen",
      fileRequirementFormat:
        "Format: CSV (kommagetrennte Werte, UTF-8 kodiert)",
      fileRequirementHeader:
        "Die erste Zeile muss die Kopfzeile mit Spaltennamen sein",
      fileRequirementSize: "Empfohlene Maximalgröße: 50 MB pro Upload",
      fileRequirementChunked:
        "Für Dateien mit mehr als ~5.000 Zeilen {{chunkedProcessing}} aktivieren, um Timeouts zu vermeiden",
      chunkedProcessingLabel: "Stückweise Verarbeitung",
      downloadTemplateLink: "CSV-Vorlage herunterladen",
      loadingText: "Leads werden importiert\u2026",
      backgroundProcessingTitle: "Hintergrundverarbeitung",
      backgroundProcessingNote:
        "Großer Import als Job eingereiht: {{jobId}}. {{totalRows}} Zeilen werden im Hintergrund verarbeitet.",
      checkJobStatusButton: "Job-Status prüfen",
      stopJobButton: "Job stoppen",
      retryFailedButton: "Fehlgeschlagene wiederholen",
      statTotalRows: "Zeilen gesamt",
      statImported: "Importiert",
      statDuplicates: "Duplikate",
      statFailed: "Fehlgeschlagen",
      viewImportedLeadsButton: "Importierte Leads anzeigen",
      retryFailedWithCountButton: "Fehlgeschlagene wiederholen ({{count}})",
      summaryTitle: "Zusammenfassung",
      summaryNewLeads: "Neue Leads",
      summaryUpdated: "Aktualisiert",
      summarySkipped: "Übersprungen",
      successRateLabel: "Erfolgsrate",
      importErrorsTitle: "{{count}} Importfehler",
      errorRowLabel: "Zeile {{row}}",
      findLeadButton: "Lead suchen",
    },
  },
  process: {
    tag: "Importverarbeitung",
    post: {
      title: "Importaufträge verarbeiten",
      titleShort: "Import verarbeiten",
      description: "Ausstehende CSV-Importaufträge verarbeiten",
      container: {
        title: "Importverarbeitungskonfiguration",
        description: "Importverarbeitungsparameter konfigurieren",
      },
      fields: {
        maxJobsPerRun: {
          label: "Max. Aufträge pro Durchlauf",
          description:
            "Maximale Anzahl der zu verarbeitenden Aufträge pro Durchlauf",
        },
        maxRetriesPerJob: {
          label: "Max. Wiederholungen pro Auftrag",
          description: "Maximale Anzahl der Wiederholungen pro Auftrag",
        },
        dryRun: {
          label: "Testlauf",
          description: "Ausführen ohne Änderungen vorzunehmen",
        },
        selfTaskId: {
          label: "Eigene Task-ID",
          description:
            "Interne Task-ID zur Selbstbereinigung nach der Verarbeitung",
        },
      },
      response: {
        jobsProcessed: "Verarbeitete Aufträge",
        totalRowsProcessed: "Verarbeitete Zeilen gesamt",
        successfulImports: "Erfolgreiche Importe",
        failedImports: "Fehlgeschlagene Importe",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description:
            "Beim Verarbeiten der Importe ist ein Fehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "Importverarbeitung abgeschlossen",
        description: "Importaufträge erfolgreich verarbeitet",
      },
    },
  },
  widget: {
    header: {
      title: "Importaufträge",
      newImport: "Neuer Import",
    },
    filter: {
      all: "Alle",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      pending: "Ausstehend",
      running: "In Bearbeitung",
    },
    loading: "Importauftr\u00e4ge werden geladen\u2026",
    empty: {
      title: "Keine Importauftr\u00e4ge gefunden",
      withFilter:
        "Versuchen Sie einen anderen Filter oder starten Sie einen neuen Import.",
      withoutFilter: "Starten Sie Ihren ersten Import, um ihn hier zu sehen.",
      newImport: "Neuer Import",
    },
  },
  jobs: {
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
          description:
            "Anzahl der Zeilen, die in jedem Batch verarbeitet werden",
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
            description:
              "Beim Aktualisieren des Jobs ist ein Fehler aufgetreten",
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
              description:
                "Beim Wiederholen des Jobs ist ein Fehler aufgetreten",
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
              description:
                "Sie haben keine Berechtigung, diesen Job zu stoppen",
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
  },
  status: {
    category: "Datenimport",
    tags: {
      import: "Importieren",
      jobs: "Jobs",
      list: "Liste",
    },

    get: {
      title: "Import-Jobs Status",
      titleShort: "Importaufträge",
      description: "CSV-Import-Jobs auflisten und überwachen",
      actions: {
        refresh: "Aktualisieren",
        refreshing: "Wird aktualisiert...",
      },
      form: {
        title: "Job-Filter",
        description: "Import-Jobs nach Status und Paginierung filtern",
      },
      filters: {
        title: "Filter",
        description: "Filteroptionen für Import-Jobs",
      },
      status: {
        label: "Job-Status",
        description: "Nach Job-Status filtern",
        placeholder: "Status auswählen",
      },
      limit: {
        label: "Ergebnisse pro Seite",
        description: "Anzahl der zurückzugebenden Jobs",
        placeholder: "50",
      },
      offset: {
        label: "Seiten-Offset",
        description: "Anzahl der zu überspringenden Jobs",
        placeholder: "0",
      },
      response: {
        title: "Import-Jobs",
        description: "Liste der Import-Jobs mit ihrem aktuellen Status",
        statusCounts: "Statusübersicht",
        items: {
          title: "Jobs-Liste",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Filterparameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Authentifizierung erforderlich um Import-Jobs anzuzeigen",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff für Import-Jobs verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Import-Jobs gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Abrufen der Jobs",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Abrufen der Jobs",
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
        title: "Jobs abgerufen",
        description: "Import-Jobs-Liste erfolgreich abgerufen",
      },
    },
    widget: {
      status: {
        pending: "Ausstehend",
        running: "Läuft",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
        stopped: "Gestoppt",
      },
      filter: {
        all: "Alle",
        pending: "Ausstehend",
        running: "Läuft",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
      },
      progress: {
        rows: "Zeilen",
      },
      job: {
        total: "Gesamt:",
        processed: "Verarbeitet:",
        ok: "OK:",
        fail: "Fehler:",
        created: "Erstellt:",
        done: "Fertig:",
      },
      header: {
        title: "Import-Jobs",
        newImport: "Neuer Import",
      },
      loading: "Import-Jobs werden geladen\u2026",
      empty: {
        title: "Keine Import-Jobs gefunden",
        withFilter: "Anderen Filter wählen oder neuen Import starten.",
        withoutFilter: "Starten Sie Ihren ersten Import, um ihn hier zu sehen.",
        newImport: "Neuer Import",
      },
    },
  },
  csv: {
    post: {
      title: "CSV-Daten Importieren",
      description:
        "Importieren Sie Daten aus CSV-Dateien mit intelligenter Verarbeitung und Validierung",
      form: {
        title: "CSV-Import Konfiguration",
        description:
          "Konfigurieren Sie Ihre CSV-Import Einstellungen für optimale Ergebnisse",
      },
      fileSection: {
        title: "Datei Upload",
        description:
          "Wählen Sie Ihre CSV-Datei aus und spezifizieren Sie die Zieldomäne",
      },
      file: {
        label: "CSV-Datei",
        description: "Wählen Sie eine CSV-Datei zum Upload (max 10MB)",
        placeholder: "CSV-Datei auswählen...",
        helpText:
          "Unterstütztes Format: CSV mit komma-getrennten Werten. Erste Zeile sollte Spaltenüberschriften enthalten.",
      },
      fileName: {
        label: "Dateiname",
        description: "Name für diesen Import (zu Ihrer Referenz)",
        placeholder: "z.B. Januar 2024 Leads Import",
      },
      domain: {
        label: "Import-Domäne",
        description: "Welche Art von Daten importieren Sie?",
        placeholder: "Datentyp auswählen...",
      },
      processingSection: {
        title: "Verarbeitungsoptionen",
        description:
          "Konfigurieren Sie, wie Ihre Daten verarbeitet werden sollen",
      },
      skipDuplicates: {
        label: "Duplikate Überspringen",
        description: "Datensätze mit doppelten E-Mail-Adressen überspringen",
        helpText:
          "Empfohlen: Verhindert das doppelte Importieren desselben Kontakts",
      },
      updateExisting: {
        label: "Bestehende Aktualisieren",
        description:
          "Bestehende Datensätze mit neuen Daten aus CSV aktualisieren",
        helpText:
          "Wenn nicht aktiviert, bleiben bestehende Datensätze unverändert",
      },
      useChunkedProcessing: {
        label: "Hintergrundverarbeitung",
        description: "Große Dateien im Hintergrund verarbeiten",
        helpText: "Empfohlen für Dateien mit mehr als 500 Datensätzen",
      },
      batchSize: {
        label: "Batch-Größe",
        description:
          "Anzahl der Datensätze, die gleichzeitig verarbeitet werden",
        placeholder: "100",
        helpText:
          "Kleinere Batches sind stabiler, größere Batches sind schneller",
      },
      defaultsSection: {
        title: "Standardwerte (Optional)",
        description:
          "Setzen Sie Standardwerte für Datensätze, denen diese Information fehlt",
      },
      defaultCountry: {
        label: "Standardland",
        description: "Land für Datensätze ohne Ortsangabe",
        placeholder: "Land auswählen...",
      },
      defaultLanguage: {
        label: "Standardsprache",
        description: "Sprache für Datensätze ohne Sprachpräferenz",
        placeholder: "Sprache auswählen...",
      },
      response: {
        title: "Import-Ergebnisse",
        description: "Zusammenfassung Ihres CSV-Import Vorgangs",
        basicResults: {
          title: "Basis-Ergebnisse",
          description: "Kern-Import-Statistiken",
        },
        batchId: {
          label: "Batch-ID",
        },
        totalRows: {
          label: "Gesamtzeilen",
        },
        isChunkedProcessing: {
          label: "Hintergrundverarbeitung",
        },
        jobId: {
          label: "Job-ID",
        },
        statistics: {
          title: "Import-Statistiken",
          description: "Detaillierte Aufschlüsselung des Import-Vorgangs",
        },
        successfulImports: {
          label: "Erfolgreiche Importe",
        },
        failedImports: {
          label: "Fehlgeschlagene Importe",
        },
        duplicateEmails: {
          label: "Doppelte E-Mails",
        },
        processingTimeMs: {
          label: "Verarbeitungszeit (ms)",
        },
        summary: {
          title: "Import-Zusammenfassung",
          description: "Übersicht der Import-Ergebnisse",
        },
        newRecords: {
          label: "Neue Datensätze",
        },
        updatedRecords: {
          label: "Aktualisierte Datensätze",
        },
        skippedDuplicates: {
          label: "Übersprungene Duplikate",
        },
        errors: {
          title: "Fehlerdetails",
          row: {
            label: "Zeile",
          },
          email: {
            label: "E-Mail",
          },
          error: {
            label: "Fehler",
          },
        },
        nextSteps: {
          title: "Nächste Schritte",
          item: {
            label: "Nächster Schritt",
          },
        },
      },
      errors: {
        validation: {
          title: "Ungültige Import-Daten",
          description: "Bitte überprüfen Sie Ihre CSV-Datei und Einstellungen",
          emptyFile: "CSV-Dateiinhalt ist erforderlich",
          emptyFileName: "Bitte geben Sie einen Namen für diesen Import an",
          invalidDomain: "Bitte wählen Sie eine gültige Import-Domäne aus",
          invalidBatchSize: "Batch-Größe muss zwischen 10 und 1000 liegen",
          fileTooLarge:
            "Dateigröße überschreitet 10MB Limit. Erwägen Sie Hintergrundverarbeitung.",
        },
        unauthorized: {
          title: "Zugriff Verweigert",
          description: "Sie haben keine Berechtigung zum Importieren von Daten",
        },
        fileTooLarge: {
          title: "Datei zu Groß",
          description:
            "Die ausgewählte Datei überschreitet die maximale Größenbeschränkung von 10MB",
        },
        server: {
          title: "Import Fehlgeschlagen",
          description:
            "Ein Fehler ist beim Verarbeiten Ihres Imports aufgetreten. Bitte versuchen Sie es erneut.",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindung während des Imports fehlgeschlagen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung für diesen Import",
        },
        notFound: {
          title: "Nicht Gefunden",
          description: "Import-Ressource nicht gefunden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht Gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Datenkonflikt",
          description: "Ein Konflikt mit vorhandenen Daten ist aufgetreten",
        },
      },
      success: {
        title: "Import Erfolgreich",
        description: "Ihre CSV-Daten wurden erfolgreich importiert",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "Ausstehend",
        description: "Job wartet auf Verarbeitung",
      },
      processing: {
        label: "Verarbeitung",
        description: "Job wird gerade verarbeitet",
      },
      completed: {
        label: "Abgeschlossen",
        description: "Job erfolgreich beendet",
      },
      failed: {
        label: "Fehlgeschlagen",
        description: "Job ist auf einen Fehler gestoßen",
      },
      cancelled: {
        label: "Abgebrochen",
        description: "Job wurde vom Benutzer abgebrochen",
      },
      paused: {
        label: "Pausiert",
        description: "Job-Verarbeitung ist vorübergehend pausiert",
      },
    },
    domain: {
      leads: {
        label: "Leads",
        description: "Potenzielle Kunden und Geschäftskontakte",
      },
      contacts: {
        label: "Kontakte",
        description: "Allgemeine Kontaktinformationen und Adressbuch",
      },
      businessData: {
        label: "Geschäftsdaten",
        description: "Unternehmensinformationen und Geschäftsprofile",
      },
      emails: {
        label: "E-Mail-Listen",
        description: "E-Mail-Marketing Listen und Kampagnen",
      },
      users: {
        label: "Benutzer",
        description: "Systembenutzer und Kontoinformationen",
      },
      templates: {
        label: "Vorlagen",
        description: "E-Mail-Vorlagen und Inhalte",
      },
    },
    format: {
      csv: {
        label: "CSV-Datei",
        description: "Komma-getrennte Werte (am häufigsten)",
      },
      xlsx: {
        label: "Excel-Datei",
        description: "Microsoft Excel Tabelle",
      },
      json: {
        label: "JSON-Datei",
        description: "JavaScript Object Notation Daten",
      },
      tsv: {
        label: "TSV-Datei",
        description: "Tab-getrennte Werte",
      },
    },
    processing: {
      immediate: {
        label: "Jetzt Verarbeiten",
        description: "Datei sofort verarbeiten (schnellste)",
      },
      background: {
        label: "Hintergrund",
        description: "Im Hintergrund verarbeiten (für große Dateien)",
      },
      scheduled: {
        label: "Später Planen",
        description: "Verarbeitung für bestimmte Zeit planen",
      },
    },
    errorType: {
      validation: {
        label: "Validierungsfehler",
        description:
          "Daten entsprechen nicht dem erforderlichen Format oder Regeln",
      },
      duplicate: {
        label: "Doppelte Daten",
        description: "Datensatz existiert bereits im System",
      },
      format: {
        label: "Formatfehler",
        description: "Dateiformat ist falsch oder beschädigt",
      },
      processing: {
        label: "Verarbeitungsfehler",
        description: "Fehler während der Datenverarbeitung aufgetreten",
      },
      system: {
        label: "Systemfehler",
        description: "Interner Systemfehler",
      },
    },
    batchSize: {
      small: {
        label: "Klein (50)",
        description: "Am besten für Tests oder kleine Imports",
      },
      medium: {
        label: "Mittel (100)",
        description: "Empfohlen für die meisten Imports",
      },
      large: {
        label: "Groß (250)",
        description: "Gut für große Dateien mit einfachen Daten",
      },
      xlarge: {
        label: "Extra Groß (500)",
        description: "Für sehr große Dateien (fortgeschrittene Benutzer)",
      },
    },
  },
  nextSteps: {
    reviewErrors:
      "Überprüfen Sie die Fehlerdetails, um zu verstehen, was schiefgelaufen ist",
    checkDuplicates:
      "Erwägen Sie die Anpassung der Duplikat-Behandlungseinstellungen",
    reviewLeads:
      "Überprüfen Sie Ihre importierten Leads im Leads-Management-Bereich",
    startCampaign:
      "Erwägen Sie den Start einer E-Mail-Kampagne mit Ihren neuen Leads",
    reviewContacts:
      "Überprüfen Sie Ihre importierten Kontakte im Kontakte-Bereich",
    organizeContacts: "Organisieren Sie Ihre Kontakte in Gruppen oder Tags",
    reviewImported:
      "Überprüfen Sie Ihre importierten Daten im entsprechenden Bereich",
    monitorProgress: "Überwachen Sie den Fortschritt im Job-Verlauf",
    checkJobsList:
      "Überprüfen Sie die Jobs-Liste für detaillierte Status-Updates",
  },
  errors: {
    cancel: {
      server: "Import-Job konnte nicht abgebrochen werden",
    },
    retry: {
      server: "Import-Job konnte nicht wiederholt werden",
    },
    delete: {
      server: "Import-Job konnte nicht gelöscht werden",
    },
    status: {
      server: "Job-Status konnte nicht abgerufen werden",
    },
  },
  error: {
    default: "Ein Fehler ist aufgetreten",
  },
  enums: {
    csvImportJobStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
    },
    csvImportJobAction: {
      retry: "Wiederholen",
      delete: "Löschen",
      stop: "Stoppen",
    },
    importMode: {
      createOnly: "Nur erstellen",
      updateOnly: "Nur aktualisieren",
      createOrUpdate: "Erstellen oder aktualisieren",
      skipDuplicates: "Duplikate überspringen",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "Sofort",
      chunked: "Stückweise",
      scheduled: "Geplant",
    },
    importErrorType: {
      validationError: "Validierungsfehler",
      duplicateEmail: "Doppelte E-Mail",
      invalidFormat: "Ungültiges Format",
      missingRequiredField: "Pflichtfeld fehlt",
      processingError: "Verarbeitungsfehler",
      systemError: "Systemfehler",
    },
    batchProcessingStatus: {
      pending: "Ausstehend",
      processing: "In Bearbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      retrying: "Wird wiederholt",
    },
    importPriority: {
      low: "Niedrig",
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend",
    },
    importSource: {
      webUpload: "Web-Upload",
      apiUpload: "API-Upload",
      scheduledImport: "Geplanter Import",
      bulkOperation: "Massenoperation",
    },
    csvDelimiter: {
      comma: "Komma",
      semicolon: "Semikolon",
      tab: "Tab",
      pipe: "Pipe",
    },
    importValidationLevel: {
      strict: "Streng",
      moderate: "Mäßig",
      lenient: "Nachsichtig",
    },
    importNotificationType: {
      email: "E-Mail",
      inApp: "In-App",
      webhook: "Webhook",
      none: "Keine",
    },
    leadStatus: {
      new: "Neu",
      pending: "Ausstehend",
      campaignRunning: "Kampagne läuft",
      websiteUser: "Website-Nutzer",
      newsletterSubscriber: "Newsletter-Abonnent",
      inContact: "In Kontakt",
      signedUp: "Registriert",
      subscriptionConfirmed: "Abonnement bestätigt",
      unsubscribed: "Abgemeldet",
      bounced: "Zurückgewiesen",
      invalid: "Ungültig",
    },
    emailCampaignStage: {
      notStarted: "Nicht gestartet",
      initial: "Erstkontakt",
      followup1: "Nachfassen 1",
      followup2: "Nachfassen 2",
      followup3: "Nachfassen 3",
      nurture: "Pflege",
      reactivation: "Reaktivierung",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Soziale Medien",
      emailCampaign: "E-Mail-Kampagne",
      referral: "Empfehlung",
      csvImport: "CSV-Import",
    },
  },
  countries: {
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
    us: "Vereinigte Staaten",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
};
