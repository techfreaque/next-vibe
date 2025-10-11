import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/list/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Aufgabenlisten-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Filterparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgabenliste nicht autorisiert",
      description: "Sie haben keine Berechtigung, Cron-Aufgaben anzuzeigen",
    },
    server: {
      title: "Aufgabenlisten-Serverfehler",
      description:
        "Aufgaben können aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Aufgabenliste fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Aufgaben aufgetreten",
    },
  },
  success: {
    title: "Aufgaben abgerufen",
    description: "Cron-Aufgaben wurden erfolgreich abgerufen",
  },
};
