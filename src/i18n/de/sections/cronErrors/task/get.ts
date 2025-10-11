import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/cronErrors/task/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Aufgabenabruf-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Aufgaben-ID und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgabenabruf nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diese Cron-Aufgabe anzuzeigen",
    },
    notFound: {
      title: "Aufgabe nicht gefunden",
      description: "Die angeforderte Cron-Aufgabe konnte nicht gefunden werden",
    },
    server: {
      title: "Aufgabenabruf-Serverfehler",
      description:
        "Aufgabe kann aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Aufgabenabruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen der Aufgabe aufgetreten",
    },
  },
  success: {
    title: "Aufgabe erfolgreich abgerufen",
    description: "Cron-Aufgabendetails wurden erfolgreich abgerufen",
  },
};
