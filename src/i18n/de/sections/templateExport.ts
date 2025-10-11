import type { templateExportTranslations as EnglishTemplateExportTranslations } from "../../en/sections/templateExport";

export const templateExportTranslations: typeof EnglishTemplateExportTranslations =
  {
    status: {
      initializing: "Export wird initialisiert...",
      processing: "Vorlagen werden verarbeitet...",
      generating: "Datei wird generiert...",
      completed: "Export abgeschlossen",
      completed_success: "Export erfolgreich abgeschlossen",
      failed: "Export fehlgeschlagen",
      cancelled: "Export abgebrochen",
    },
    buttons: {
      export: "Vorlagen exportieren",
      exporting: "Exportiere...",
      export_large: "Groß exportieren",
      export_small: "Klein exportieren",
    },
    errors: {
      no_templates: "Keine Vorlagen gefunden, die den Kriterien entsprechen",
      unsupported_format: "Nicht unterstütztes Exportformat",
    },
    file: {
      default_name: "Unbenannte Vorlage",
      export_name: "vorlagen_export_{{timestamp}}.{{extension}}",
    },
  };
