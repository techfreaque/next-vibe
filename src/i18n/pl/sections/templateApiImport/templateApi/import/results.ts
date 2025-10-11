import type { resultsTranslations as EnglishResultsTranslations } from "../../../../../en/sections/templateApiImport/templateApi/import/results";

export const resultsTranslations: typeof EnglishResultsTranslations = {
  title: "Wyniki Importu",
  summary: {
    total: "Łączne Rekordy",
    processed: "Przetworzone",
    successful: "Udane",
    failed: "Nieudane",
    warnings: "Ostrzeżenia",
  },
  status: {
    pending: "Oczekujące",
    processing: "Przetwarzanie",
    completed: "Zakończone",
    failed: "Nieudane",
    cancelled: "Anulowane",
  },
  details: {
    errors: "Błędy",
    warnings: "Ostrzeżenia",
    noErrors: "Nie znaleziono błędów",
    noWarnings: "Brak ostrzeżeń",
  },
};
