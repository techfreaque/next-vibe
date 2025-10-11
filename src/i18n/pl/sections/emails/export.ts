import type { exportTranslations as EnglishExportTranslations } from "../../../en/sections/emails/export";

export const exportTranslations: typeof EnglishExportTranslations = {
  title: "Eksportuj E-maile",
  description: "Eksportuj dane e-maili do CSV lub Excel",
  formats: {
    csv: "CSV",
    xlsx: "Excel",
  },
  button: "Eksportuj",
  success: "E-maile pomyślnie wyeksportowane",
  failed: "Nie udało się wyeksportować e-maili",
};
