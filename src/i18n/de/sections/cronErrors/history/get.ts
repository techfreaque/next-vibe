import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/history/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Verlauf-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Verlaufsparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Verlauf nicht autorisiert",
      description: "Sie haben keine Berechtigung, den Cron-Verlauf anzuzeigen",
    },
    server: {
      title: "Verlauf-Serverfehler",
      description:
        "Verlauf kann aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Verlauf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Verlaufs aufgetreten",
    },
  },
  success: {
    title: "Verlauf abgerufen",
    description: "Cron-Verlauf wurde erfolgreich abgerufen",
  },
};
