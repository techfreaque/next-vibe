import type { translations as EnglishPostTranslations } from "../../../en/subscriptionsErrors/subscriptions/post";

export const translations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Abonnement-Erstellungs-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Abonnement-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Erstellung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu erstellen",
    },
    forbidden: {
      title: "Abonnement-Erstellung verboten",
      description: "Sie haben keine Berechtigung, Abonnements zu erstellen",
    },
    duplicate: {
      title: "Abonnement existiert bereits",
      description: "Ein Abonnement für diesen Benutzer existiert bereits",
    },
    server: {
      title: "Abonnement-Erstellungs-Serverfehler",
      description:
        "Abonnement kann aufgrund eines Serverfehlers nicht erstellt werden",
    },
    unknown: {
      title: "Abonnement-Erstellung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Erstellen des Abonnements aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich erstellt",
    description: "Das neue Abonnement wurde erstellt und aktiviert",
  },
};
