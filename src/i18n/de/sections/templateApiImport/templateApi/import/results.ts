import type { resultsTranslations as EnglishResultsTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/results";

export const resultsTranslations: typeof EnglishResultsTranslations = {
  title: "Import-Ergebnisse",
  summary: {
    total: "Gesamte Datensätze",
    processed: "Verarbeitet",
    successful: "Erfolgreich",
    failed: "Fehlgeschlagen",
    warnings: "Warnungen",
  },
  status: {
    pending: "Ausstehend",
    processing: "Verarbeitung",
    completed: "Abgeschlossen",
    failed: "Fehlgeschlagen",
    cancelled: "Abgebrochen",
  },
  details: {
    errors: "Fehler",
    warnings: "Warnungen",
    noErrors: "Keine Fehler gefunden",
    noWarnings: "Keine Warnungen",
  },
};
