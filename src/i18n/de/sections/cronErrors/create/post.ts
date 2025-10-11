import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/cronErrors/create/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Aufgabenerstellung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Aufgabenparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgabenerstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Cron-Aufgaben zu erstellen",
    },
    server: {
      title: "Aufgabenerstellung-Serverfehler",
      description:
        "Aufgabe kann aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Aufgabenerstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Erstellen der Aufgabe aufgetreten",
    },
  },
  success: {
    title: "Aufgabe erfolgreich erstellt",
    description: "Ihre Cron-Aufgabe wurde erfolgreich erstellt",
  },
};
