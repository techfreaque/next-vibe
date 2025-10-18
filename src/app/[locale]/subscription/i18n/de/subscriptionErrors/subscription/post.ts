import type { translations as EnglishPostTranslations } from "../../../en/subscriptionErrors/subscription/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Validierung der Abonnement-Erstellung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre Abonnement-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Erstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu erstellen",
    },
    server: {
      title: "Server-Fehler bei Abonnement-Erstellung",
      description:
        "Abonnement konnte aufgrund eines Server-Fehlers nicht erstellt werden",
    },
    unknown: {
      title: "Abonnement-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Abonnement-Erstellung aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich erstellt",
    description: "Ihr Abonnement wurde aktiviert",
  },
};
