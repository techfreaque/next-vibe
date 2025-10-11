import type { exportTranslations as EnglishExportTranslations } from "../../../en/sections/emails/export";

export const exportTranslations: typeof EnglishExportTranslations = {
  title: "E-Mails exportieren",
  description: "E-Mail-Daten als CSV oder Excel exportieren",
  formats: {
    csv: "CSV",
    xlsx: "Excel",
  },
  button: "Exportieren",
  success: "E-Mails erfolgreich exportiert",
  failed: "Fehler beim Exportieren der E-Mails",
};
