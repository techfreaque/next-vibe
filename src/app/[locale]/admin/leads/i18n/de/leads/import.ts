import type { translations as EnglishImportTranslations } from "../../en/leads/import";

export const translations: typeof EnglishImportTranslations = {
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
