import type { resetTranslations as EnglishResetTranslations } from "../../../../en/sections/imapErrors/config/reset";

export const resetTranslations: typeof EnglishResetTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, die Konfiguration zurückzusetzen.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist beim Zurücksetzen der Konfiguration aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Zurücksetzen der Konfiguration aufgetreten.",
    },
  },
  success: {
    title: "Konfiguration zurückgesetzt",
    description:
      "Konfiguration wurde erfolgreich auf die Standardwerte zurückgesetzt.",
  },
};
