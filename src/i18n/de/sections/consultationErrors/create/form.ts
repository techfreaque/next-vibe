import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/create/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Beratungserstellung Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Beratungsdetails und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Beratungserstellung nicht berechtigt",
      description: "Sie haben keine Berechtigung, Beratungen zu erstellen",
    },
    server: {
      title: "Beratungserstellung Serverfehler",
      description:
        "Beratung konnte aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Beratungserstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Erstellen der Beratung aufgetreten",
    },
  },
  success: {
    title: "Beratung erfolgreich erstellt",
    description: "Ihre Beratungsanfrage wurde eingereicht",
  },
};
