import type { templateExportTranslations as EnglishTemplateExportTranslations } from "../../en/sections/templateExport";

export const templateExportTranslations: typeof EnglishTemplateExportTranslations =
  {
    status: {
      initializing: "Inicjowanie eksportu...",
      processing: "Przetwarzanie szablonów...",
      generating: "Generowanie pliku...",
      completed: "Eksport zakończony",
      completed_success: "Eksport zakończony sukcesem",
      failed: "Eksport nie powiódł się",
      cancelled: "Eksport anulowany",
    },
    buttons: {
      export: "Eksportuj szablony",
      exporting: "Eksportowanie...",
      export_large: "Eksportuj duże",
      export_small: "Eksportuj małe",
    },
    errors: {
      no_templates: "Nie znaleziono szablonów spełniających kryteria",
      unsupported_format: "Nieobsługiwany format eksportu",
    },
    file: {
      default_name: "Szablon bez nazwy",
      export_name: "szablony_eksport_{{timestamp}}.{{extension}}",
    },
  };
