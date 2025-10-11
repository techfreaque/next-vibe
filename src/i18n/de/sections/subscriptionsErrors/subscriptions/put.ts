import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/subscriptionsErrors/subscriptions/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Abonnement-Update-Validierung fehlgeschlagen",
      description:
        "Überprüfen Sie Ihre Abonnement-Informationen und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Abonnement-Update nicht autorisiert",
      description: "Sie haben keine Berechtigung, Abonnements zu aktualisieren",
    },
    forbidden: {
      title: "Abonnement-Update verboten",
      description:
        "Sie haben keine Berechtigung, dieses Abonnement zu aktualisieren",
    },
    not_found: {
      title: "Abonnement nicht gefunden",
      description:
        "Das Abonnement, das Sie aktualisieren möchten, konnte nicht gefunden werden",
    },
    server: {
      title: "Abonnement-Update-Serverfehler",
      description:
        "Abonnement kann aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Abonnement-Update fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist beim Aktualisieren des Abonnements aufgetreten",
    },
  },
  success: {
    title: "Abonnement erfolgreich aktualisiert",
    description: "Die Abonnement-Informationen wurden erfolgreich aktualisiert",
  },
};
