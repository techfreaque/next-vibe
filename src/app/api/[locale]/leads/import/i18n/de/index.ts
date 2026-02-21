import { translations as jobsTranslations } from "../../jobs/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenimport",
  post: {
    title: "Leads importieren",
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
      placeholder: "app.api.leads.csv",
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
  jobs: jobsTranslations,
  status: statusTranslations,
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
  },
};
