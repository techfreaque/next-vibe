import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/consultationErrors/list/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Beratungsliste Validierung fehlgeschlagen",
      description: "Beratungslisten-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Beratungsliste nicht berechtigt",
      description: "Sie haben keine Berechtigung, Beratungen anzuzeigen",
    },
    server: {
      title: "Beratungsliste Serverfehler",
      description:
        "Beratungen konnten aufgrund eines Serverfehlers nicht geladen werden",
    },
    unknown: {
      title: "Beratungsliste fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Laden der Beratungen aufgetreten",
    },
  },
  success: {
    title: "Beratungen erfolgreich geladen",
    description: "Ihre Beratungsliste wurde abgerufen",
  },
};
