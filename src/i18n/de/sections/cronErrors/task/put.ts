import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/cronErrors/task/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Aufgabenaktualisierung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Aufgabenparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgabenaktualisierung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diese Cron-Aufgabe zu aktualisieren",
    },
    notFound: {
      title: "Aufgabe nicht gefunden",
      description:
        "Die Aufgabe, die Sie aktualisieren möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Aufgabenaktualisierung-Serverfehler",
      description:
        "Aufgabe kann aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Aufgabenaktualisierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Aktualisieren der Aufgabe aufgetreten",
    },
  },
  success: {
    title: "Aufgabe erfolgreich aktualisiert",
    description: "Ihre Cron-Aufgabe wurde erfolgreich aktualisiert",
  },
};
