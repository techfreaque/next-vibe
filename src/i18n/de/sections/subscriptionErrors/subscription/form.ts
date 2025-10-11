import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/subscriptionErrors/subscription/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Abonnement-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Abonnement-Details und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, dieses Abonnement zu verwalten",
    },
    server: {
      title: "Abonnement Server-Fehler",
      description:
        "Abonnement konnte aufgrund eines Server-Fehlers nicht verwaltet werden",
    },
    unknown: {
      title: "Abonnement fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Abonnement-Verwaltung aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich verwaltet",
    description: "Ihre Abonnement-Einstellungen wurden aktualisiert",
  },
};
