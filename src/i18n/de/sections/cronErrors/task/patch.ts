import type { patchTranslations as EnglishPatchTranslations } from "../../../../en/sections/cronErrors/task/patch";

export const patchTranslations: typeof EnglishPatchTranslations = {
  error: {
    validation: {
      title: "Aufgaben-Umschaltung-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Umschaltparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Aufgaben-Umschaltung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diese Cron-Aufgabe umzuschalten",
    },
    notFound: {
      title: "Aufgabe nicht gefunden",
      description:
        "Die Aufgabe, die Sie umschalten möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Aufgaben-Umschaltung-Serverfehler",
      description:
        "Aufgabe kann aufgrund eines Serverfehlers nicht umgeschaltet werden",
    },
    unknown: {
      title: "Aufgaben-Umschaltung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Umschalten der Aufgabe aufgetreten",
    },
  },
  success: {
    title: "Aufgabe erfolgreich umgeschaltet",
    description: "Aufgabenstatus wurde erfolgreich aktualisiert",
  },
};
