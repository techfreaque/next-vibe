import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/status/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Status-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Statusparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Status nicht autorisiert",
      description: "Sie haben keine Berechtigung, den Cron-Status anzuzeigen",
    },
    server: {
      title: "Status-Serverfehler",
      description:
        "Status kann aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Status fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Status aufgetreten",
    },
  },
  success: {
    title: "Status abgerufen",
    description: "Cron-Status wurde erfolgreich abgerufen",
  },
};
