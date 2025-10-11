import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/schedule/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Terminplanung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfe Ihre Termindetails und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Terminplanung nicht berechtigt",
      description: "Sie haben keine Berechtigung, Beratungen zu planen",
    },
    server: {
      title: "Terminplanung Serverfehler",
      description:
        "Beratung konnte aufgrund eines Serverfehlers nicht geplant werden",
    },
    unknown: {
      title: "Terminplanung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Planen der Beratung aufgetreten",
    },
  },
  success: {
    title: "Beratung erfolgreich geplant",
    description: "Ihre Beratung wurde geplant",
  },
};
