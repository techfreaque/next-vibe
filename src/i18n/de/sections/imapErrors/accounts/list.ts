import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/accounts/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Ungültige Parameter für die Kontoauflistung bereitgestellt.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Konten aufzulisten.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Auflisten der Konten aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auflisten der Konten aufgetreten.",
    },
  },
};
