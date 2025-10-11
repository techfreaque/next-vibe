import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/newsletterErrors/subscribe/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Newsletter-Abonnement-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre E-Mail-Adresse und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Newsletter-Abonnement nicht autorisiert",
      description: "Sie haben keine Berechtigung, den Newsletter zu abonnieren",
    },
    server: {
      title: "Newsletter-Abonnement-Serverfehler",
      description:
        "Newsletter-Abonnement aufgrund eines Serverfehlers nicht möglich",
    },
    unknown: {
      title: "Newsletter-Abonnement fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abonnieren des Newsletters aufgetreten",
    },
  },
  success: {
    title: "Newsletter-Abonnement erfolgreich",
    description: "Sie haben unseren Newsletter abonniert",
  },
};
