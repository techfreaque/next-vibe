import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/unsubscribe/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Newsletter-Abmeldung-Validierung fehlgeschlagen",
      description: "Abmeldeanfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Newsletter-Abmeldung nicht autorisiert",
      description: "Sie haben keine Berechtigung, den Newsletter abzumelden",
    },
    server: {
      title: "Newsletter-Abmeldung-Serverfehler",
      description:
        "Newsletter-Abmeldung aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Newsletter-Abmeldung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abmelden vom Newsletter aufgetreten",
    },
  },
  success: {
    title: "Newsletter-Abmeldung erfolgreich",
    description: "Sie wurden von unserem Newsletter abgemeldet",
  },
};
