import type { translations as EnglishImportTranslations } from "../../../en/leads/admin/import";

export const translations: typeof EnglishImportTranslations = {
  button: "Leads importieren",
  title: "Leads aus CSV importieren",
  description:
    "Laden Sie eine CSV-Datei hoch, um Leads in Ihr Kampagnensystem zu importieren",
  template: {
    title: "Vorlage herunterladen",
    description: "Holen Sie sich die CSV-Vorlage mit erforderlichen Spalten",
    download: "Vorlage herunterladen",
    examples: {
      example1:
        "hans@beispiel.com,Beispiel GmbH,Hans Müller,+49-123-456789,https://beispiel.com,DE,de,website,Interessiert an Premium-Funktionen",
      example2:
        "anna@firma.com,Firma AG,Anna Schmidt,+49-987-654321,https://firma.com,DE,de,empfehlung,Sucht nach Social Media Automatisierung",
    },
  },
  file: {
    label: "CSV-Datei",
    dropzone: {
      title: "Legen Sie Ihre CSV-Datei hier ab",
      description: "oder klicken Sie, um Dateien zu durchsuchen",
    },
    validation: {
      required: "Bitte wählen Sie eine CSV-Datei zum Hochladen aus",
    },
  },
  options: {
    title: "Import-Optionen",
    description:
      "Konfigurieren Sie, wie der Import mit vorhandenen Daten umgehen soll",
    skipDuplicates: "Leads mit doppelten E-Mail-Adressen überspringen",
    updateExisting: "Bestehende Leads mit neuen Daten aktualisieren",
  },
  batch: {
    title: "Batch-Verarbeitung",
    description:
      "Konfigurieren Sie, wie große Importe verarbeitet werden sollen",
    useChunkedProcessing: "Batch-Verarbeitung verwenden",
    useChunkedProcessingDescription:
      "Große CSV-Dateien in kleineren Batches über Hintergrund-Jobs verarbeiten. Empfohlen für Dateien mit mehr als 1000 Zeilen.",
    batchSize: "Batch-Größe",
    batchSizeDescription: "Anzahl der Zeilen pro Batch (10-1000)",
    batchSizePlaceholder: "100",
  },
  defaults: {
    title: "Standardwerte",
    description:
      "Standardwerte für Leads festlegen, die diese Felder nicht angeben",
    country: "Standardland",
    countryDescription: "Land, das verwendet wird, wenn nicht in CSV angegeben",
    countryPlaceholder: "Standardland auswählen",
    language: "Standardsprache",
    languageDescription:
      "Sprache, die verwendet wird, wenn nicht in CSV angegeben",
    languagePlaceholder: "Standardsprache auswählen",
    status: "Standardstatus",
    statusDescription:
      "Status, der verwendet wird, wenn nicht in CSV angegeben",
    statusPlaceholder: "Standardstatus auswählen",
    campaignStage: "Standard-Kampagnenstufe",
    campaignStageDescription:
      "Kampagnenstufe, die verwendet wird, wenn nicht in CSV angegeben",
    campaignStagePlaceholder: "Standard-Kampagnenstufe auswählen",
    source: "Standardquelle",
    sourceDescription:
      "Quelle, die verwendet wird, wenn nicht in CSV angegeben",
    sourcePlaceholder: "Standardquelle auswählen",
  },
  progress: {
    title: "Import-Fortschritt",
    processing: "Verarbeitung...",
  },
  status: {
    title: "Import-Status",
    pending: "Wartend",
    processing: "Verarbeitung",
    completed: "Abgeschlossen",
    failed: "Fehlgeschlagen",
    unknown: "Unbekannt",
    rows: "Zeilen",
    summary:
      "{{successful}} erfolgreich, {{failed}} fehlgeschlagen, {{duplicates}} Duplikate",
    andMore: "und {{count}} weitere",
    importing: "Importiere",
    loading: "Lade Import-Status...",
    activeJobs: "Aktive Import-Aufträge",
    preparing: "Bereite Import vor...",
  },
  settings: {
    title: "Import-Auftragseinstellungen",
    description: "Einstellungen für diesen Import-Auftrag anpassen",
    batchSize: "Batch-Größe",
    maxRetries: "Maximale Wiederholungen",
  },
  success:
    "Erfolgreich {{successful}} von {{total}} Leads importiert. {{failed}} fehlgeschlagen, {{duplicates}} Duplikate.",
  importing: "Importiere...",
  start: "Import starten",
  error: {
    generic:
      "Import fehlgeschlagen. Bitte überprüfen Sie Ihr Dateiformat und versuchen Sie es erneut.",
    invalid_email_format: "Ungültiges E-Mail-Format",
    email_required: "E-Mail ist erforderlich",
  },
  errors: {
    noData: "Keine Daten in der hochgeladenen Datei gefunden",
    missingHeaders: "Fehlende erforderliche Header in der CSV-Datei",
  },
};
