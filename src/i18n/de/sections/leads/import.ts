import type { importTranslations as EnglishImportTranslations } from "../../../en/sections/leads/import";

export const importTranslations: typeof EnglishImportTranslations = {
  validation: {
    missingFields: "Erforderliche Felder fehlen",
    invalidEmail: "Ungültige E-Mail-Adresse",
    invalidData: "Ungültiges Datenformat",
    failed: "Validierung fehlgeschlagen",
  },
  defaults: {
    language: "de",
    source: "csv_import",
  },
};
