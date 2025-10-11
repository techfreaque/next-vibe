import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/businessDataErrors/businessData/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Validierung beim Abrufen der Geschäftsdaten fehlgeschlagen",
      description:
        "Anfrage zum Abrufen der Geschäftsdaten konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Abrufen der Geschäftsdaten nicht autorisiert",
      description: "Sie haben keine Berechtigung, Geschäftsdaten abzurufen",
    },
    server: {
      title: "Serverfehler beim Abrufen der Geschäftsdaten",
      description:
        "Geschäftsdaten konnten aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Abrufen der Geschäftsdaten fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Geschäftsdaten aufgetreten",
    },
  },
  success: {
    title: "Geschäftsdaten erfolgreich abgerufen",
    description: "Ihre Geschäftsinformationen wurden geladen",
  },
};
