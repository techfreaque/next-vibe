import type { translations as EnglishImportTranslations } from "../../en/leads/import";

export const translations: typeof EnglishImportTranslations = {
  validation: {
    missingFields: "Brakuje wymaganych pól",
    invalidEmail: "Nieprawidłowy adres e-mail",
    invalidData: "Nieprawidłowy format danych",
    failed: "Walidacja nie powiodła się",
  },
  defaults: {
    language: "pl",
    source: "csv_import",
  },
};
