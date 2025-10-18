import type { translations as EnglishDeleteTranslations } from "../../../en/subscriptionErrors/subscription/delete";

export const translations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Validierung der Abonnement-Kündigung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Kündigungsanfrage und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Kündigung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu kündigen",
    },
    server: {
      title: "Server-Fehler bei Abonnement-Kündigung",
      description:
        "Abonnement konnte aufgrund eines Server-Fehlers nicht gekündigt werden",
    },
    unknown: {
      title: "Abonnement-Kündigung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Abonnement-Kündigung aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich gekündigt",
    description: "Ihr Abonnement wurde gekündigt",
  },
};
