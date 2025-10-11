import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // === HAUPTKATEGORIE ===
  category: "Datenimport",

  // === CSV IMPORT ENDPOINT ===
  csv: {
    post: {
      title: "CSV-Daten Importieren",
      description: "Importieren Sie Daten aus CSV-Dateien mit intelligenter Verarbeitung und Validierung",
      
      form: {
        title: "CSV-Import Konfiguration",
        description: "Konfigurieren Sie Ihre CSV-Import Einstellungen für optimale Ergebnisse",
      },
      
      // === DATEI UPLOAD BEREICH ===
      fileSection: {
        title: "Datei Upload",
        description: "Wählen Sie Ihre CSV-Datei aus und spezifizieren Sie die Zieldomäne",
      },
      
      file: {
        label: "CSV-Datei",
        description: "Wählen Sie eine CSV-Datei zum Upload (max 10MB)",
        placeholder: "CSV-Datei auswählen...",
        helpText: "Unterstütztes Format: CSV mit komma-getrennten Werten. Erste Zeile sollte Spaltenüberschriften enthalten.",
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
      
      // === VERARBEITUNGSBEREICH ===
      processingSection: {
        title: "Verarbeitungsoptionen",
        description: "Konfigurieren Sie, wie Ihre Daten verarbeitet werden sollen",
      },
      
      skipDuplicates: {
        label: "Duplikate Überspringen",
        description: "Datensätze mit doppelten E-Mail-Adressen überspringen",
        helpText: "Empfohlen: Verhindert das doppelte Importieren desselben Kontakts",
      },
      
      updateExisting: {
        label: "Bestehende Aktualisieren",
        description: "Bestehende Datensätze mit neuen Daten aus CSV aktualisieren",
        helpText: "Wenn nicht aktiviert, bleiben bestehende Datensätze unverändert",
      },
      
      useChunkedProcessing: {
        label: "Hintergrundverarbeitung",
        description: "Große Dateien im Hintergrund verarbeiten",
        helpText: "Empfohlen für Dateien mit mehr als 500 Datensätzen",
      },
      
      batchSize: {
        label: "Batch-Größe",
        description: "Anzahl der Datensätze, die gleichzeitig verarbeitet werden",
        placeholder: "100",
        helpText: "Kleinere Batches sind stabiler, größere Batches sind schneller",
      },
      
      // === STANDARDWERTE BEREICH ===
      defaultsSection: {
        title: "Standardwerte (Optional)",
        description: "Setzen Sie Standardwerte für Datensätze, denen diese Information fehlt",
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
      
      // === ANTWORT ===
      response: {
        title: "Import-Ergebnisse",
        description: "Zusammenfassung Ihres CSV-Import Vorgangs",
      },
      
      // === FEHLER ===
      errors: {
        validation: {
          title: "Ungültige Import-Daten",
          description: "Bitte überprüfen Sie Ihre CSV-Datei und Einstellungen",
          emptyFile: "CSV-Dateiinhalt ist erforderlich",
          emptyFileName: "Bitte geben Sie einen Namen für diesen Import an",
          invalidDomain: "Bitte wählen Sie eine gültige Import-Domäne aus",
          invalidBatchSize: "Batch-Größe muss zwischen 10 und 1000 liegen",
          fileTooLarge: "Dateigröße überschreitet 10MB Limit. Erwägen Sie Hintergrundverarbeitung.",
        },
        unauthorized: {
          title: "Zugriff Verweigert",
          description: "Sie haben keine Berechtigung zum Importieren von Daten",
        },
        fileTooLarge: {
          title: "Datei zu Groß",
          description: "Die ausgewählte Datei überschreitet die maximale Größenbeschränkung von 10MB",
        },
        server: {
          title: "Import Fehlgeschlagen",
          description: "Ein Fehler ist beim Verarbeiten Ihres Imports aufgetreten. Bitte versuchen Sie es erneut.",
        },
      },
      
      success: {
        title: "Import Erfolgreich",
        description: "Ihre CSV-Daten wurden erfolgreich importiert",
      },
    },
  },
  
  // === JOBS LISTE ENDPOINT ===
  jobs: {
    get: {
      title: "Import-Job Verlauf",
      description: "Anzeigen und Verwalten Ihrer Import-Jobs",
      
      form: {
        title: "Import-Jobs Filtern",
        description: "Jobs nach Status, Datum oder anderen Kriterien filtern",
      },
      
      status: {
        label: "Job-Status",
        description: "Nach aktuellem Job-Status filtern",
        placeholder: "Alle Status",
      },
      
      limit: {
        label: "Ergebnisse Pro Seite",
        description: "Anzahl der Jobs pro Seite anzuzeigen",
        placeholder: "20",
      },
      
      offset: {
        label: "Seiten-Offset",
        description: "Diese Anzahl von Ergebnissen überspringen (für Paginierung)",
        placeholder: "0",
      },
      
      response: {
        title: "Import-Jobs",
        description: "Ihr Import-Job Verlauf und aktueller Status",
      },
      
      errors: {
        unauthorized: {
          title: "Zugriff Verweigert",
          description: "Sie haben keine Berechtigung zum Anzeigen von Import-Jobs",
        },
        server: {
          title: "Jobs Laden Fehlgeschlagen",
          description: "Import-Job Verlauf konnte nicht abgerufen werden",
        },
      },
      
      success: {
        title: "Jobs Geladen",
        description: "Import-Job Verlauf erfolgreich abgerufen",
      },
    },
  },
  
  // === ENUM ÜBERSETZUNGEN ===
  enum: {
    // === JOB STATUS ===
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
    
    // === IMPORT DOMÄNEN ===
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
    
    // === DATEIFORMATE ===
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
    
    // === VERARBEITUNGSMODI ===
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
    
    // === FEHLERTYPEN ===
    errorType: {
      validation: {
        label: "Validierungsfehler",
        description: "Daten entsprechen nicht dem erforderlichen Format oder Regeln",
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
    
    // === BATCH-GRÖßEN VOREINSTELLUNGEN ===
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
  
  // === NÄCHSTE SCHRITTE ===
  nextSteps: {
    reviewErrors: "Überprüfen Sie die Fehlerdetails, um zu verstehen, was schiefgelaufen ist",
    checkDuplicates: "Erwägen Sie die Anpassung der Duplikat-Behandlungseinstellungen",
    reviewLeads: "Überprüfen Sie Ihre importierten Leads im Leads-Management-Bereich",
    startCampaign: "Erwägen Sie den Start einer E-Mail-Kampagne mit Ihren neuen Leads",
    reviewContacts: "Überprüfen Sie Ihre importierten Kontakte im Kontakte-Bereich",
    organizeContacts: "Organisieren Sie Ihre Kontakte in Gruppen oder Tags",
    reviewImported: "Überprüfen Sie Ihre importierten Daten im entsprechenden Bereich",
    monitorProgress: "Überwachen Sie den Fortschritt im Job-Verlauf",
    checkJobsList: "Überprüfen Sie die Jobs-Liste für detaillierte Status-Updates",
  },
  
  // === AKTIONSMELDUNGEN ===
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
  
  // === TAGS ===
  tags: {
    csv: "CSV",
    upload: "Upload", 
    batch: "Batch-Verarbeitung",
    jobs: "Jobs",
    status: "Status",
    history: "Verlauf",
    statistics: "Statistiken",
    analytics: "Analysen",
  },
};
