import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/stats/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Statistik-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Statistikparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Statistik nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, die Cron-Statistiken anzuzeigen",
    },
    server: {
      title: "Statistik-Serverfehler",
      description:
        "Statistiken können aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Statistik fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Statistiken aufgetreten",
    },
  },
  success: {
    title: "Statistiken abgerufen",
    description: "Cron-Statistiken wurden erfolgreich abgerufen",
  },
};
