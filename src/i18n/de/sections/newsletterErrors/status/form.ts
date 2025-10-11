import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/status/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Newsletter-Status-Validierung fehlgeschlagen",
      description: "Status-Anfrage konnte nicht validiert werden",
    },
    unauthorized: {
      title: "Newsletter-Status nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, den Newsletter-Status zu überprüfen",
    },
    server: {
      title: "Newsletter-Status-Serverfehler",
      description:
        "Newsletter-Status aufgrund eines Serverfehlers nicht überprüfbar",
    },
    unknown: {
      title: "Newsletter-Status fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Überprüfen des Newsletter-Status aufgetreten",
    },
  },
  success: {
    title: "Newsletter-Status erfolgreich abgerufen",
    description: "Ihr Newsletter-Abonnement-Status wurde geladen",
  },
};
