import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/cronErrors/task/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Aufgabenlöschung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Aufgaben-ID und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgabenlöschung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diese Cron-Aufgabe zu löschen",
    },
    notFound: {
      title: "Aufgabe nicht gefunden",
      description:
        "Die Aufgabe, die Sie löschen möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Aufgabenlöschung-Serverfehler",
      description:
        "Aufgabe kann aufgrund eines Serverfehlers nicht gelöscht werden",
    },
    unknown: {
      title: "Aufgabenlöschung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Löschen der Aufgabe aufgetreten",
    },
  },
  success: {
    title: "Aufgabe erfolgreich gelöscht",
    description: "Cron-Aufgabe wurde erfolgreich gelöscht",
  },
};
