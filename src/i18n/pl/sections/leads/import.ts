import type { importTranslations as EnglishImportTranslations } from "../../../en/sections/leads/import";

export const importTranslations: typeof EnglishImportTranslations = {
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
