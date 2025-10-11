import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    validation: {
      title: "Abonnement-Abruf-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Anfrageparameter und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Abruf nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, auf Abonnement-Daten zuzugreifen",
    },
    forbidden: {
      title: "Abonnement-Zugriff verboten",
      description:
        "Sie haben keine Berechtigung, auf dieses Abonnement zuzugreifen",
    },
    not_found: {
      title: "Abonnement nicht gefunden",
      description: "Das angeforderte Abonnement konnte nicht gefunden werden",
    },
    server: {
      title: "Abonnement-Abruf-Serverfehler",
      description:
        "Abonnement kann aufgrund eines Serverfehlers nicht abgerufen werden",
    },
    unknown: {
      title: "Abonnement-Abruf fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Abrufen des Abonnements aufgetreten",
    },
  },
  success: {
    title: "Abonnements erfolgreich abgerufen",
    description: "Abonnement-Daten wurden erfolgreich geladen",
  },
};
